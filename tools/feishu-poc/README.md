# 飞书接收-only PoC

独立本地工具，不是 Radar 产品运行服务。只绑定 `cli_aa69bd34937adbf7`；不使用环境里的其他飞书应用凭证。

## 当前覆盖

- `core.mjs`：固定应用配置校验、枚举/计数白名单日志、快速事件处理与空对象卡片回调响应。
- `input.mjs`：最多 32768 字节的 stdin JSON 读取，错误不回显内容；Secret 自身仍由内核限制为最多 4096 UTF-8 字节。
- `launch_from_session.py`：只定位当前原始用户接入请求，将已提供的凭证经 stdin 转交，不写文件/环境/命令参数。转录逐行最多 8 MiB、总计最多 64 MiB；父进程设置运行时长加 30 秒的总时限，只清理自身子进程。
- `runtime.mjs` / `run.mjs`：官方低层 WSClient 与 EventDispatcher，适配展平后的事件；20 秒启动上限、10 秒握手上限、从 onReady 起计时、到期 abort discovery 并 close。输出仅固定状态和计数。
- SDK：官方 `@larksuiteoapi/node-sdk` 固定 1.76.0，安装时禁用 lifecycle scripts。
- 本地实现及回归已完成；独立运行边界复核仍在进行。endpoint 已认证，尚无真实 WebSocket 握手、事件或卡片回调证据。

## 仅运行本地合成测试

```sh
npm --prefix tools/feishu-poc test
python3 -I -B tools/feishu-poc/test/test_session_launcher.py
```

测试使用合成资料，不调用飞书，不验证真实权限、订阅或事件投递。

## 安全与范围

不创建 `.env`，不输出或记录 Secret、token、连接 URL、人员/群/消息 ID、消息正文或原始错误。实时事件只做内存处理与计数，不传播给研究/复核 Agent。无普通消息/测试卡发送、历史/附件/卡片补读、后台权限/订阅/版本修改或生产部署。

连接期结束后关闭；不要将该 PoC 静默变为生产常驻程序。多客户端为随机单点投递，不能将无事件认定为 SDK 故障或用本地无 bus 证明没有远程连接。

最新分项状态：[执行记录](../../docs/research/2026-11-08-radar-feishu-poc-execution.md)。验证边界：[清单](../../docs/runbooks/2026-11-08-feishu-ws-poc-validation.md)。
