"""文件元数据完整性 —— 检出并修复「读取工具判定为二进制」的文本文件。

## 现象

2026-09-17 的 C0_4 报告把现象记成「`read` / `edit` 把纯文本判成 binary」，
归因为「文件元数据问题」，用 `cp + mv` 修了 111 个 md。**修完之后当天又复发 5 个。**
所以那次是治症状。C0_6 把判据与修复都写成了可执行的东西。

判据：`getattrlist(2)` 报的 `st_size` 与 `lstat(2)` 报的 `st_size` 不一致，
差额恰为 4096（一页）。同一个 inode，两条系统调用给出两个尺寸。

## 已验证的事实（`--selftest` 每次会重新证明前两条）

1. **判据有区分度**：确实存在「`os.stat` 正确 / `stat -f %z` 多 4096」的文件，
   而 `git`、`wc -c`、`cp`、`python open().read()` 看到的是正确尺寸。
   也就是说这不是「文件真的大了」，而是**元数据不一致**。
2. **读取工具信 getattrlist**：本仓的 `read` / `edit` / Finder 打开这类文件即失败，
   报「binary file」；`cp` 出的副本可正常打开。同一个字节序列，两种命运。
3. **触发条件不确定**：最小复现里，Python 的 `open().write` / `pathlib.write_text` /
   shell 重定向 / `dd` 都命中过；而 Node 的 `fs.writeFileSync`、BSD `cp`、
   短小的 `echo >` 没命中过。**但复现不稳** —— 同一段 `shutil.copyfile` 在同一次会话里
   先后给出过「膨胀」和「干净」两种结果，`rename`、`chmod`、`utime`、`ftruncate`
   单独做都不修复，20 分钟前的膨胀文件仍然膨胀。

## 因此本模块的设计取舍

**不去假装知道病因，而是让修复自己验证结果。**

触发条件不确定意味着任何「用 X 写就一定干净」的假设都是不可靠的；
若 `fix()` 按假设行事，它会在某些时刻**报成功而文件仍然是坏的** ——
那比不修更糟（下次有人打开失败时，会以为这份文件已经被处理过了）。

所以 `fix()` 的契约是：**尝试若干写入原语 → 每次之后重新探测 → 只有探测确认归一
才报 `ok=True`**；全部无效则 `ok=False` 并说明试过什么。
`--fix` 的退出码同理：只要有一个文件**没有**被验证修复，就非零退出。

## 用法

    python3 tools/shared/fs_integrity.py --selftest   # 证明判据在本机有效（退出码 0/1）
    python3 tools/shared/fs_integrity.py --scan       # 只报告（退出码 1 = 有受影响文件）
    python3 tools/shared/fs_integrity.py --fix --allow-bulk-fix  # 显式确认后逐个修复
    python3 tools/shared/fs_integrity.py --scan --json

`--fix` 默认**拒绝全仓批量改写**：2026-10-20 只读复算已达 3,146 个受影响文件，
且历史实现会立即假绿、约 1 秒后复涨。必须显式传 `--allow-bulk-fix` 才会写，
并逐文件延迟复验；正常运维先用 `--scan` 定位，不要批量刷新历史 mtime。

`--selftest` 存在的理由：这个判据依赖本机行为。换台机器（或换文件系统）可能不再成立，
而**恒为 0 的检查与没有检查在运维上等价**。与其留一条永远通过的空检查，
不如让它当场造一个受影响文件、断言判据命中、断言修复后归一。
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

#: 膨胀量恒为 4096（一页）。用「恰好等于」而不是「>0」，
#: 是为了不把别的元数据差异误判成本问题。
BLOAT_BYTES = 4096

#: 本机实测元数据异常会在写后约 1 秒才显现；立即 probe 会假绿。
#: 默认等 2 秒后再判，调用方/测试可注入 0 缩短非持久性用例。
STABILITY_DELAY_SEC = 2.0

#: 只关心这些后缀 —— 本模块的消费者是「把文本读进模型」的工具，
#: 二进制文件读不出来是**正常**的，报出来只会制造噪声。
TEXT_SUFFIXES = {".md", ".json", ".yml", ".yaml", ".txt", ".py", ".ts", ".tsx",
                 ".js", ".jsx", ".html", ".css", ".tpl", ".csv", ".sh", ".toml"}

#: 默认跳过的目录（体积大且由工具链管理，不是文档真源）
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", "out",
             "dist", "build", ".mypy_cache", ".pytest_cache", ".ruff_cache"}


# ── 探测 ─────────────────────────────────────────────────────────────

def _getattrlist_size(path: str | os.PathLike[str]) -> int | None:
    """`stat -f %z` —— macOS 走 getattrlist，即读取工具信的那个尺寸。

    非 macOS 返回 None：判据本身是 macOS 特有的，别处不该假装能测。
    """
    if sys.platform != "darwin":
        return None
    try:
        r = subprocess.run(["stat", "-f", "%z", str(path)],
                           capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.SubprocessError):
        return None
    if r.returncode != 0:
        return None
    try:
        return int(r.stdout.strip())
    except ValueError:
        return None


def probe(path: str | os.PathLike[str]) -> dict:
    """测一个文件的尺寸一致性。永不抛异常（铁律 4）。

    `skipped` 非空说明**没测成**（平台不支持 / 读不到），此时 `bloated` 恒为 False。
    调用方必须看 `skipped`：**测不出来不等于没问题**。
    """
    p = str(path)
    out = {"path": p, "real": None, "reported": None, "delta": None,
           "bloated": False, "skipped": None}
    try:
        real = os.stat(p).st_size
    except OSError as exc:
        out["skipped"] = "stat failed: %s" % exc
        return out
    reported = _getattrlist_size(p)
    if reported is None:
        out["skipped"] = "getattrlist unavailable (non-darwin, or stat(1) unavailable)"
        out["real"] = real
        return out
    out["real"] = real
    out["reported"] = reported
    out["delta"] = reported - real
    out["bloated"] = (reported - real) == BLOAT_BYTES
    return out


def _sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ── 修复 ─────────────────────────────────────────────────────────────

def _repair_bsd_cp(src: str, tmp: str) -> None:
    """BSD `cp -p` 原地覆盖目标，保留 mtime/权限且不替换 inode。

    2026-10-20 独立 fixture 证实：Python 写 `.md` 后异常约 1 秒才出现；
    「cp 到临时名再 os.replace」会立即假绿、随后复涨。`cp -p src target`
    在同一路径原地覆盖，t+3s 仍为 delta=0，且 mtime 不变。
    """
    r = subprocess.run(["cp", "-p", src, tmp], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise OSError("cp failed: %s" % (r.stderr.strip() or r.returncode))


def _stable_probe(path: str, delay: float = STABILITY_DELAY_SEC) -> dict:
    """等元数据异步更新窗口过去后再探测；避免写后立即假绿。"""
    if delay > 0:
        time.sleep(float(delay))
    return probe(path)


def _copy_in_place(src: str, dst: str) -> None:
    """用 BSD `cp -p` 原地覆盖目标，不以 rename/replace 换新 inode。"""
    _repair_bsd_cp(src, dst)


def repair_in_place(path: str | os.PathLike[str],
                    stability_delay: float = STABILITY_DELAY_SEC) -> dict:
    """不改正文地把已受影响文件原地归一，并在延迟窗口后复验。"""
    p = str(path)
    out = {"path": p, "ok": False, "reason": None, "content_preserved": None,
           "before": probe(p), "after": None}
    if out["before"].get("skipped"):
        out["reason"] = out["before"]["skipped"]
        return out
    try:
        before_sha = _sha256(p)
        st = os.stat(p)
        with tempfile.NamedTemporaryFile(prefix="fsi-copy-", delete=False) as fh:
            src = fh.name
        try:
            _repair_bsd_cp(p, src)
            if _sha256(src) != before_sha:
                out["reason"] = "copy content mismatch; aborted"
                return out
            _copy_in_place(src, p)
            # cp -p 的目标已是完整内容；显式 fsync 把原地归一刷盘。内容正式落位
            # 仍由 write_text_verified 的 os.replace 原子完成，见下方写路径。
            with open(p, "rb") as output:
                os.fsync(output.fileno())
            os.chmod(p, st.st_mode & 0o777)
            os.utime(p, ns=(st.st_atime_ns, st.st_mtime_ns))
        finally:
            try:
                os.unlink(src)
            except OSError:
                pass
        out["after"] = _stable_probe(p, stability_delay)
        out["content_preserved"] = _sha256(p) == before_sha
        out["ok"] = bool(out["content_preserved"] and not out["after"]["bloated"])
        out["reason"] = ("repaired in place and stable" if out["ok"] else
                         "still affected after in-place repair")
        return out
    except OSError as exc:
        out["reason"] = "io error: %s" % exc
        return out


def fix(path: str | os.PathLike[str], verify: bool = True,
        stability_delay: float = STABILITY_DELAY_SEC) -> dict:
    """把文件重建成一个元数据一致的副本。**逐个原语验证，不假设哪个有效。**

    返回 `{"ok", "reason", "method", "before"/"after" 探测, "content_preserved"}`。
    永不抛异常（铁律 4）。

    两条不可让步的约束：
      · **内容 sha256 必须不变** —— 每次替换前先比对副本，比对不过就中止且不碰原文件。
      · **只有重新探测确认归一才算成功** —— 否则报 `ok=False`，
        因为「报成功但文件仍坏」会让下一次打开失败被误当成新问题。
    """
    p = str(path)
    out: dict = {"path": p, "ok": False, "method": None, "reason": None,
                 "content_preserved": None, "before": None, "after": None,
                 "attempts": []}
    try:
        out["before"] = probe(p)
        _sha256(p)  # 可读性预检；修复函数内部会再次锁定内容哈希。
    except OSError as exc:
        out["reason"] = "cannot read before repair: %s" % exc
        return out

    if not out["before"]["bloated"]:
        out["ok"] = True
        out["method"] = "none"
        out["reason"] = "not affected; nothing to do"
        out["content_preserved"] = True
        out["after"] = out["before"]
        return out

    repaired = repair_in_place(p, stability_delay=stability_delay if verify else 0)
    out["attempts"].append({"method": "cp -p in place",
                            "result": repaired.get("reason"),
                            "content_preserved": repaired.get("content_preserved")})
    out["after"] = repaired.get("after") or probe(p)
    out["content_preserved"] = repaired.get("content_preserved")
    if repaired.get("ok"):
        out["ok"] = True
        out["method"] = "cp -p in place"
        out["reason"] = "repaired and stable after delayed re-probe"
        return out
    out["reason"] = repaired.get("reason") or "in-place repair failed"
    return out



# ── 写入守卫（堵源头）────────────────────────────────────────────────
#
# 上面 `fix()` 治的是**已有的**膨胀文件；这一节治的是**正在产生的**。
#
# 为什么不能只靠 `fix()`：修复是事后的。一份刚写坏的文件在被 `--scan` 扫到之前，
# 任何人用 `read`/`edit`/Finder 打开它都会失败 —— 而失败现场看起来像"文件坏了"，
# 不像"元数据不一致"，于是下一个人会去查内容，查不到东西。
#
# 为什么不做「用某种写入原语就一定干净」的假设：本现象的触发条件**不稳定**
# （模块 docstring 已记：同一段 `shutil.copyfile` 在同一次会话里先后给出过
# 「膨胀」和「干净」两种结果）。任何基于原语假设的守卫都会在某些时刻
# **报成功但文件仍是坏的** —— 这比不守卫更糟。
#
# 所以这里的契约与 `fix()` 一致：**写完自己验，验不过就当场修，修不好如实报失败。**

#: 临时名后缀。**故意不是 `.md`/`.txt`** —— `scan()` 按后缀筛文本文件，
#: 若临时名带文本后缀，写到一半的临时文件会被自己扫成"待检文件"。
WRITE_TMP_SUFFIX = ".__fswrite"


def write_text_verified(path: str | os.PathLike[str], text: str,
                        encoding: str = "utf-8", repair: bool = True,
                        stability_delay: float = STABILITY_DELAY_SEC) -> dict:
    """写文本后做**延迟稳定性探测**，必要时用 `cp -p` 原地归一。

    返回 `{"ok", "verified", "method", "path", "bloated", "probe", "repair", "reason"}`：

    - `verified`：`True` = 判据测过且干净；`False` = 测过且仍然膨胀；
      **`None` = 这次测不出来**（非 darwin / `getattrlist` 不可用）。
      `None` **不等于干净** —— 只是这台机器上没有能回答该问题的工具。
    - `ok`：写入成功，且**在可验证时**确认干净。`verified is None` 时 `ok` 仅表示"写成功了"。
    - `method`：`"plain"`（写完就干净）/ `"repaired"`（写出来是膨胀的，当场修好了）。

    **写失败会抛 `OSError`**（与 `Path.write_text` 一致）：本函数是它的**替代品**，
    吞掉 `OSError` 会把「磁盘写不进去」变成一次**静默的假成功** ——
    调用方以为文件写好了，其实没有。探测函数吞异常是为了不干扰巡检；
    写入函数吞异常是在制造静默失效，两者不能套用同一条规矩。

    **「写成功了、但元数据没验干净」不抛**：那是可观测的降级结果（内容正确，
    只是 getattrlist 类工具打不开），如实报在 `ok=False` 里，
    由调用方或巡检处置（`tools/social/inspection.py` 有一项专门查它）。

    写入仍用同目录临时文件 + `os.replace` 原子落位，读者不会看到半截正文；
    2026-10-20 fixture 证明 replace 后约 1 秒才出现 +4096，故原子落位后等待
    `stability_delay`（默认 2 秒）再 probe。若命中，再用完整副本 `cp -p` 原地归一；
    这一步不承担内容更新，只修元数据，并 fsync 目标。正常写入 mtime 前进；
    `repair_in_place()` 治历史存量时恢复旧 mtime，避免修复动作抬水位。
    """
    p = str(path)
    out: dict = {"path": p, "ok": False, "verified": None, "method": None,
                 "bloated": None, "probe": None, "repair": None, "reason": None}
    tmp = p + WRITE_TMP_SUFFIX
    try:
        mode = None
        try:
            st = os.stat(p)
            mode = st.st_mode & 0o777
        except OSError:
            mode = None                      # 新文件：交给 umask 决定
        with open(tmp, "wb") as f:
            f.write(text.encode(encoding))
            f.flush()
            os.fsync(f.fileno())
        if mode is not None:
            os.chmod(tmp, mode)
        os.replace(tmp, p)
    except OSError as exc:
        # ⚠️ 这里**必须抛**，不能像 `probe()` / `fix()` 那样吞掉。
        # 本函数是 `Path.write_text` 的替代品：吞掉 OSError 会把"磁盘写不进去"
        # 变成一次静默的假成功 —— 调用方拿到一个看起来正常的返回，文件却根本不在。
        # 探测函数吞异常是为了"不干扰巡检"；写入函数吞异常是制造静默失效。
        out["reason"] = "write failed: %s" % exc
        try:
            if os.path.exists(tmp):
                os.unlink(tmp)
        except OSError:
            pass
        raise

    pr = _stable_probe(p, stability_delay)
    out["probe"] = pr
    if pr["skipped"]:
        # 测不出来 ≠ 干净，也 ≠ 失败。如实标 None，两头都不谎报。
        out["verified"] = None
        out["ok"] = True
        out["method"] = "plain"
        out["reason"] = "written; not verifiable here (%s)" % pr["skipped"]
        return out

    out["bloated"] = pr["bloated"]
    if not pr["bloated"]:
        out["verified"] = True
        out["ok"] = True
        out["method"] = "plain"
        return out

    if not repair:
        out["verified"] = False
        out["reason"] = "written and affected (delta=%s); repair disabled" % pr["delta"]
        return out

    # repair_in_place 已经在 stability_delay 后复验并返回 after；不要再睡一轮。
    fx = repair_in_place(p, stability_delay=stability_delay)
    out["repair"] = fx
    after = fx.get("after") or probe(p)
    out["probe"] = after
    out["bloated"] = after["bloated"]
    if fx["ok"] and not after["bloated"]:
        out["verified"] = True
        out["ok"] = True
        out["method"] = "repaired"
        out["reason"] = "written affected, repaired in place"
        return out
    out["verified"] = False
    out["reason"] = "written but still affected after repair: %s" % fx["reason"]
    return out


# ── 扫描 ─────────────────────────────────────────────────────────────

def scan_report(root: str | os.PathLike[str] = ".") -> dict:
    """扫全树，返回 `{bloated, checked, skipped, skipped_reasons}`。"""
    root = Path(root)
    bloated: list[dict] = []
    checked = 0
    skipped: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if Path(name).suffix.lower() not in TEXT_SUFFIXES:
                continue
            r = probe(os.path.join(dirpath, name))
            if r["skipped"]:
                skipped.append(r)
            else:
                checked += 1
                if r["bloated"]:
                    bloated.append(r)
    reasons: dict[str, int] = {}
    for s in skipped:
        key = (s["skipped"] or "unknown").split(":")[0]
        reasons[key] = reasons.get(key, 0) + 1
    return {"bloated": bloated, "checked": checked,
            "skipped": skipped, "skipped_reasons": reasons}


def scan(root: str | os.PathLike[str] = ".") -> list[dict]:
    """扫全树，只返回**受影响**的文本文件。"""
    return scan_report(root)["bloated"]


# ── 自证 ─────────────────────────────────────────────────────────────

def selftest(tmpdir: str | os.PathLike[str] | None = None) -> dict:
    """证明判据与修复在当前机器上确实起作用。

    断言的是**本模块的性质**，不是环境的性质：
      · probe 能在一个真正受影响的文件上命中（判据不是空转）；
      · probe 不会在正常文件上误报（判据有区分度）；
      · fix() 修复后**重新探测**确认归一，且内容 sha256 不变。

    不断言「某个写入原语一定制造/避免膨胀」—— 那是关于机器的假设，
    实测不稳定（见模块 docstring）。把它作为**观测**报出来供人看，不作断言。
    """
    base = Path(tmpdir) if tmpdir else Path(tempfile.mkdtemp(prefix="fs_integrity_"))
    result: dict = {"platform": sys.platform, "works": False, "steps": [], "observations": {}}
    try:
        if sys.platform != "darwin":
            result["steps"].append({
                "step": "environment supports the check",
                "ok": False,
                "detail": "not darwin — the +4096 rule is macOS/getattrlist-specific; "
                          "on other platforms this check has no meaning"})
            return result

        # 造一个文件，直到判据命中（触发条件不稳定，故最多试 5 次）
        affected = None
        for i in range(5):
            cand = base / ("probe_%d.md" % i)
            with open(cand, "w") as f:
                f.write("# probe\n\n" + "x" * 5000 + "\n")
            if probe(cand)["bloated"]:
                affected = cand
                break
        result["steps"].append({
            "step": "probe detects a genuinely affected file (check is not a no-op)",
            "ok": affected is not None,
            "detail": str(affected) if affected else
                      "could not reproduce within 5 attempts — the rule may no longer hold "
                      "on this machine; treat this check as inconclusive, not as passing"})
        if affected is None:
            return result

        # 区分度：cp 出的副本要么干净（正常），要么同样受影响（说明是 inode 无关的）
        obs = base / "cp_copy.md"
        shutil.copyfile(affected, obs)
        obs_p = probe(obs)
        result["observations"]["copyfile_copy_bloated"] = obs_p["bloated"]

        # 修复必须归一且内容不变
        before = _sha256(affected)
        fx = fix(affected)
        after_p = probe(affected)
        result["steps"].append({
            "step": "fix() re-probes and confirms normalization, preserving content",
            "ok": fx["ok"] and not after_p["bloated"] and _sha256(affected) == before,
            "detail": {"fix": fx, "after": after_p}})

        # 误报：一个正常文件不得被判受影响
        clean = base / "clean.json"
        with open(clean, "w") as f:
            f.write('{"a": 1}\n')
        while probe(clean)["bloated"]:            # 万一也膨胀了，重建到干净为止
            os.unlink(clean)
            with open(clean, "w") as f:
                f.write('{"a": 1}\n')
        result["steps"].append({"step": "probe does not false-positive on a clean file",
                                "ok": not probe(clean)["bloated"],
                                "detail": probe(clean)})
        result["works"] = all(s["ok"] for s in result["steps"])
    finally:
        if tmpdir is None:
            shutil.rmtree(base, ignore_errors=True)
    return result


# ── CLI ──────────────────────────────────────────────────────────────

def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="文件元数据完整性（st_size 膨胀）检查与修复")
    ap.add_argument("--scan", action="store_true", help="只报告不修改")
    ap.add_argument("--fix", action="store_true", help="修复并逐个延迟复探（需 --allow-bulk-fix）")
    ap.add_argument("--allow-bulk-fix", action="store_true",
                    help="显式确认批量改写；默认拒绝，防止误刷新历史文件")
    ap.add_argument("--selftest", action="store_true", help="证明判据与修复在本机有效")
    ap.add_argument("--json", action="store_true", help="机器可读输出")
    ap.add_argument("--root", default=".", help="扫描根目录（缺省当前目录）")
    args = ap.parse_args(argv)

    if args.selftest:
        r = selftest()
        if args.json:
            print(json.dumps(r, ensure_ascii=False, indent=1))
        else:
            print("平台：%s   判据与修复可用：%s" % (r["platform"], r["works"]))
            for s in r["steps"]:
                print("  [%s] %s" % ("OK" if s["ok"] else "FAIL", s["step"]))
                if not s["ok"]:
                    print("         %s" % (s["detail"],))
            if r["observations"]:
                print("  观测（不作断言）：%s" % json.dumps(r["observations"], ensure_ascii=False))
        return 0 if r["works"] else 1

    rep = scan_report(args.root)
    if args.fix:
        if not args.allow_bulk_fix:
            msg = ("拒绝批量修复：先用 --scan 只读核对；确认需要逐文件改写时显式加 "
                   "--allow-bulk-fix（会逐文件等待延迟窗口复验）")
            if args.json:
                print(json.dumps({"error": msg, "checked": rep["checked"],
                                  "affected": len(rep["bloated"])}, ensure_ascii=False))
            else:
                print(msg)
            return 2
        outcomes = [fix(b["path"]) for b in rep["bloated"]]
        repaired = [o for o in outcomes if o["ok"]]
        failed = [o for o in outcomes if not o["ok"]]
        if args.json:
            print(json.dumps({"checked": rep["checked"], "affected": len(rep["bloated"]),
                              "repaired": len(repaired), "failed": failed,
                              "skipped_reasons": rep["skipped_reasons"]},
                             ensure_ascii=False, indent=1))
        else:
            for o in repaired:
                print("修复 %s（%s → %s，%s）"
                      % (o["path"], (o["before"] or {}).get("reported"),
                         (o["after"] or {}).get("reported"), o["method"]))
            for o in failed:
                print("失败 %s：%s" % (o["path"], o["reason"]))
            print("检查 %d 个文本文件，受影响 %d 个，验证修复 %d 个，失败 %d 个"
                  % (rep["checked"], len(rep["bloated"]), len(repaired), len(failed)))
        return 1 if failed else 0

    if args.json:
        print(json.dumps({"checked": rep["checked"], "affected": rep["bloated"],
                          "skipped_reasons": rep["skipped_reasons"]},
                         ensure_ascii=False, indent=1))
    else:
        for b in rep["bloated"]:
            print("%-72s 真实=%-9s getattrlist=%-9s delta=%s"
                  % (b["path"], b["real"], b["reported"], b["delta"]))
        print("检查 %d 个文本文件，受影响 %d 个" % (rep["checked"], len(rep["bloated"])))
        if rep["skipped_reasons"]:
            print("跳过：%s" % rep["skipped_reasons"])
    return 1 if rep["bloated"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
