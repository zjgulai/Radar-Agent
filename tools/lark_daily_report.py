# -*- coding: utf-8 -*-
"""lark_daily_report.py — Radar 每日 AI 日报写入飞书云文档（docx）。

落点：Radar 日报（docx）。同日重跑幂等替换，跨日追加。
默认 dry-run（只读预览）；--apply 才写盘。凭据运行时读
~/.config/radar-agent/feishu_credentials.json（仓外 0600），不写死、不打印。用法：

    python3 tools/lark_daily_report.py --selftest            # 离线自检，全绿才继续
    python3 tools/lark_daily_report.py --file <json>         # dry-run 预览
    python3 tools/lark_daily_report.py --file <json> --apply # 写入 + 回读核对

JSON 字段：{"日期": "2026-11-05（周四）", "今日进展": [...], "验证结果": [...], "没做完的": [...]}
"""
import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CRED_PATH = Path.home() / ".config" / "radar-agent" / "feishu_credentials.json"
DOC_ID = "CAfOdYRsJoqgpaxK9QRcbRLunib"  # Radar 日报（docx）
DOC_URL = "https://momcozy-in.feishu.cn/docx/CAfOdYRsJoqgpaxK9QRcbRLunib"
API = "https://open.feishu.cn/open-apis"

BLOCK_PAGE, BLOCK_TEXT, BLOCK_H2, BLOCK_H3 = 1, 2, 4, 5
FIELD = {BLOCK_TEXT: "text", BLOCK_H2: "heading2", BLOCK_H3: "heading3"}
SECTIONS = ("今日进展", "验证结果", "没做完的")


# ---------- 基础 ----------

def get_token():
    import urllib.request
    d = json.loads(CRED_PATH.read_text(encoding="utf-8"))
    app_id, app_secret = d["app"]["app_id"], d["app"]["app_secret"]
    req = urllib.request.Request(
        f"{API}/auth/v3/tenant_access_token/internal",
        data=json.dumps({"app_id": app_id, "app_secret": app_secret}).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=15) as r:
        out = json.loads(r.read())
    if out.get("code") != 0 or not out.get("tenant_access_token"):
        raise RuntimeError(f"token 获取失败 code={out.get('code')} msg={out.get('msg')}")
    return out["tenant_access_token"]


def _api(method, path, token, body=None, params=None):
    import urllib.request
    from urllib.parse import urlencode
    url = f"{API}{path}"
    if params:
        url += "?" + urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Authorization": f"Bearer {token}",
                                          "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def get_blocks(token, doc_id=DOC_ID):
    """按文档顺序取全部块（翻页取全）。items[0] 是页面块，其余为它的孩子。"""
    items, page_token = [], ""
    while True:
        params = {"page_size": 500, "document_revision_id": -1}
        if page_token:
            params["page_token"] = page_token
        out = _api("GET", f"/docx/v1/documents/{doc_id}/blocks", token, params=params)
        if out.get("code") != 0:
            raise RuntimeError(f"blocks 读取失败 code={out.get('code')} msg={out.get('msg')}")
        d = out.get("data", {})
        items += d.get("items") or []
        if not d.get("has_more"):
            return items
        page_token = d.get("page_token") or ""


# ---------- 结构构造（块形状 = API 就绪：block_type int + 字符串字段名并存） ----------

def _run_block(btype, text):
    content = text or ""
    return {"block_type": btype,
            FIELD[btype]: {"elements": [{"text_run": {"content": content}}], "style": {}}}


def _block_text(b):
    """取块文本：API 块与构造块共用字符串字段名。"""
    for k in ("text", "heading2", "heading3"):
        if k in b:
            return "".join(e.get("text_run", {}).get("content", "")
                           for e in b[k].get("elements") or [])
    return ""


def build_children(report):
    """report dict → 块序列：heading2 日期 + 每板块 heading3 + 编号文本行。"""
    if not isinstance(report, dict):
        raise ValueError("report 必须是 dict")
    date_line = (report.get("日期") or "").strip()
    if not date_line:
        raise ValueError("日期 不能为空")
    blocks = [_run_block(BLOCK_H2, date_line)]
    for sec in SECTIONS:
        items = report.get(sec)
        if items is None:
            raise ValueError(f"缺板块 {sec}")
        if not isinstance(items, list) or not all(isinstance(x, str) for x in items):
            raise ValueError(f"{sec} 必须是字符串列表")
        blocks.append(_run_block(BLOCK_H3, sec))
        for t in items:
            if "{{" in t or "SECRET" in t:
                raise ValueError(f"{sec} 条目含占位符/敏感串，拒绝写入: {t[:40]}")
            blocks.append(_run_block(BLOCK_TEXT, t))
    return blocks


def find_day_range(blocks, date_line):
    """返回该日期板块在「页面块孩子」里的 [start, end) 区间；无则 None。
    end = 下一个 heading2（另一天）或最后一个孩子之后。blocks[0] 是页面块。"""
    start = None
    for c, b in enumerate(blocks[1:], start=0):
        if b.get("block_type") == BLOCK_H2 and _block_text(b).strip() == date_line:
            start = c
            break
    if start is None:
        return None
    end = len(blocks) - 1  # 默认到最后一个孩子
    for c, b in enumerate(blocks[1:], start=0):
        if c > start and b.get("block_type") == BLOCK_H2:
            end = c
            break
    return start, end


def _is_empty_text(b):
    return b.get("block_type") == BLOCK_TEXT and _block_text(b).strip() == ""


# ---------- 写入 ----------

def apply_report(token, report, doc_id=DOC_ID):
    children = build_children(report)
    date_line = report["日期"].strip()
    blocks = get_blocks(token, doc_id)
    n_children = len(blocks) - 1

    rng = find_day_range(blocks, date_line)
    if rng is None and n_children == 1 and _is_empty_text(blocks[1]):
        # 首次写入：清掉历史遗留的空文本块，保持与模版一致的干净版式
        out = _api("DELETE", f"/docx/v1/documents/{doc_id}/blocks/{doc_id}/children/batch_delete",
                   token, body={"start_index": 0, "end_index": 1},
                   params={"document_revision_id": -1})
        if out.get("code") != 0:
            raise RuntimeError(f"空块清理失败 code={out.get('code')} msg={out.get('msg')}")
        rng = (0, 0)

    if rng and rng[1] > rng[0]:
        out = _api("DELETE", f"/docx/v1/documents/{doc_id}/blocks/{doc_id}/children/batch_delete",
                   token, body={"start_index": rng[0], "end_index": rng[1]},
                   params={"document_revision_id": -1})
        if out.get("code") != 0:
            raise RuntimeError(f"同日旧块删除失败 code={out.get('code')} msg={out.get('msg')}")
    index = rng[0] if rng else -1  # 无同日板块 → 追加到末尾
    out = _api("POST", f"/docx/v1/documents/{doc_id}/blocks/{doc_id}/children",
               token, body={"children": children, "index": index},
               params={"document_revision_id": -1})
    if out.get("code") != 0:
        raise RuntimeError(f"写入失败 code={out.get('code')} msg={out.get('msg')}")
    return verify_report(token, report, doc_id)


def verify_report(token, report, doc_id=DOC_ID):
    """回读核对：块类型与文本逐块比对（从本次日期行起）。返回 (ok, 明细行列表)。"""
    children = build_children(report)
    blocks = get_blocks(token, doc_id)[1:]
    expect = [(b["block_type"], _block_text(b)) for b in children]
    actual = [(b.get("block_type"), _block_text(b)) for b in blocks]
    ok, lines = True, []
    start = next((i for i, (k, t) in enumerate(actual)
                  if k == BLOCK_H2 and t.strip() == report["日期"].strip()), None)
    if start is None:
        return False, [f"❌ 回读未找到日期行「{report['日期']}」"]
    seg = actual[start:start + len(expect)]
    for i, (ek, et) in enumerate(expect):
        ak, at = seg[i] if i < len(seg) else (None, "")
        if ak == ek and at == et:
            lines.append(f"✅ [{i}] type={ek} {(at or '')[:36]}")
        else:
            ok = False
            lines.append(f"❌ [{i}] 期望 type={ek}「{et[:36]}」 实得 type={ak}「{at[:36]}」")
    dup = [t for k, t in actual if k == BLOCK_H2 and t.strip() == report["日期"].strip()]
    if len(dup) > 1:
        ok = False
        lines.append(f"❌ 同日板块出现 {len(dup)} 次（应只 1 次）")
    lines.append(f"日期行出现次数：{len(dup)}；本次写入块数：{len(expect)}")
    return ok, lines


# ---------- 自检（离线，不打网络、不打印任何凭据值） ----------

def selftest():
    results = []
    # 1 凭据文件：存在 + 0600 + 字段齐（只报布尔，不带值）
    try:
        st = CRED_PATH.stat()
        d = json.loads(CRED_PATH.read_text(encoding="utf-8"))
        ok1 = (oct(st.st_mode & 0o777) == "0o600"
               and bool(d.get("app", {}).get("app_id"))
               and bool(d["app"].get("app_secret")))
        results.append(("凭据文件存在且 0600、字段齐", bool(ok1)))
    except Exception as e:
        results.append(("凭据文件存在且 0600、字段齐", f"异常: {type(e).__name__}"))
    # 2 落点常量
    ok2 = bool(DOC_ID) and DOC_ID.isalnum() and DOC_URL.startswith("https://")
    results.append(("DOC_ID/DOC_URL 常量已配置", ok2))
    # 3 构造器：块类型序列与文本
    sample = {"日期": "2000-01-01（周六）", "今日进展": ["1. 样例（abc1234）", "1.1 子条"],
              "验证结果": ["1. 读数 0"], "没做完的": ["1. 待拍板"]}
    try:
        kids = build_children(sample)
        kinds = [b["block_type"] for b in kids]
        want = [BLOCK_H2, BLOCK_H3, BLOCK_TEXT, BLOCK_TEXT,
                BLOCK_H3, BLOCK_TEXT, BLOCK_H3, BLOCK_TEXT]
        ok3 = kinds == want and _block_text(kids[0]) == "2000-01-01（周六）"
        results.append(("构造器块序列正确", ok3))
    except Exception as e:
        results.append(("构造器块序列正确", f"异常: {type(e).__name__}"))
    # 4 占位符拦截
    try:
        build_children({"日期": "d", "今日进展": ["{{bad}}"], "验证结果": [], "没做完的": []})
        results.append(("占位符/敏感串拦截生效", False))
    except ValueError:
        results.append(("占位符/敏感串拦截生效", True))
    except Exception as e:
        results.append(("占位符/敏感串拦截生效", f"异常: {type(e).__name__}"))
    # 5 幂等查找：同日区间定位
    try:
        bs = build_children(sample)
        fake = [{"block_type": BLOCK_PAGE}] + bs
        rng = find_day_range(fake, "2000-01-01（周六）")
        ok5 = rng == (0, len(bs))  # 唯一日期段到末尾
        bs2 = build_children({**sample, "日期": "1999-12-31（周五）"})
        fake2 = [{"block_type": BLOCK_PAGE}] + bs2 + bs
        rng2 = find_day_range(fake2, "2000-01-01（周六）")
        ok5 = ok5 and rng2 == (len(bs2), len(bs2) + len(bs))
        results.append(("同日替换区间定位正确", ok5))
    except Exception as e:
        results.append(("同日替换区间定位正确", f"异常: {type(e).__name__}"))
    # 6 空板块允许（没做完的可为空列表）
    try:
        build_children({"日期": "d", "今日进展": ["1. x"], "验证结果": [], "没做完的": []})
        results.append(("空板块（未测/无遗留）允许", True))
    except Exception as e:
        results.append(("空板块（未测/无遗留）允许", f"异常: {type(e).__name__}"))

    all_ok = True
    print("lark_daily_report 自检（离线）")
    for name, r in results:
        good = r is True
        all_ok = all_ok and good
        print(f"  {'✅' if good else '❌'} {name}" + ("" if good else f" —— {r}"))
    print("selftest:", "ALL GREEN" if all_ok else "RED")
    return 0 if all_ok else 1


# ---------- 入口 ----------

def main():
    ap = argparse.ArgumentParser(description="每日 AI 日报写入飞书云文档（默认 dry-run）")
    ap.add_argument("--selftest", action="store_true", help="离线自检（不联网）")
    ap.add_argument("--file", help="日报内容 JSON 路径")
    ap.add_argument("--apply", action="store_true", help="真正写入（默认只预览）")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())
    if not args.file:
        ap.print_help()
        print("\n默认 dry-run：给 --file <json> 看预览；确认后加 --apply 写入。")
        sys.exit(2)

    report = json.loads(Path(args.file).read_text(encoding="utf-8"))
    build_children(report)  # 先本地校验，不合法就不联网
    print(f"落点：{DOC_URL}")
    print(f"日期：{report['日期']}")
    for sec in SECTIONS:
        print(f"\n【{sec}】{len(report[sec])} 条")
        for t in report[sec]:
            print(f"  {t}")

    token = get_token()
    blocks = get_blocks(token)
    rng = find_day_range(blocks, report["日期"].strip())
    if args.apply:
        ok, lines = apply_report(token, report)
        print("\n—— 已写入，回读核对 ——")
        for ln in lines:
            print(ln)
        sys.exit(0 if ok else 1)
    else:
        if rng:
            print(f"\n[dry-run] 同日板块已存在，将替换孩子区间 [{rng[0]},{rng[1]})（幂等替换，不重复）")
        else:
            print(f"\n[dry-run] 无同日板块，将追加到末尾（当前孩子数 {len(blocks)-1}；"
                  f"若仅含 1 个历史空块会先清掉）")
        print(f"[dry-run] 共将写入 {len(build_children(report))} 个块（1 日期行 + {len(SECTIONS)} 板块题 + "
              f"{sum(len(report[s]) for s in SECTIONS)} 条目）。加 --apply 才真正写入。")
        sys.exit(0)


if __name__ == "__main__":
    main()
