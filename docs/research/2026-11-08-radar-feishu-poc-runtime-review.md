# 飞书 PoC 运行边界复核处置记录

- 日期：2026-11-08。
- 范围：`tools/feishu-poc`、固定官方 SDK 1.76.0；传输层本地复核，不是产品或生产验收。
- 复核快照：2026-11-08 23:35 CST；后续测试/README已发生有记录的修正，不能把旧快照当终态审计。
- 机器复核标记：`human_gold_claim_count=0`。
- 处置状态：定向修复与复核执行中；尚无真实 WebSocket 运行证据。

## 发现与处置

| 发现 | 核对后的效力 | 处置 |
|---|---|---|
| discovery ClientConfig 未校验，零值/NaN可能使SDK计时器及重试高频运行 | C：独立源码检查与合成复现支持；不是已发生的线上事故 | 修复：校验整数范围，拒绝缺字段/异常值，避免计时器溢出与热循环 |
| SDK close无法触达尚未open的局部握手socket与计时器 | B：固定SDK源码局限；C：合成子进程复现 | 修复：CLI终态flush并退出自身进程，设置不超过2秒兜底；保留close/abort，不停止其他client |
| 启动20秒等于discovery10秒加握手10秒，无调度余量 | C：合成边界复现；未观测真实平台超时 | 修复：启动25秒；父启动预算同步25秒，总时限duration+35秒 |
| 晚fatal可能在stopped后追加failed，但退出码仍0 | C：同一复核者续问的合成子进程复现 | 并入退出修复：统一终态，不输出相互矛盾的末行与退出码 |
| handler返回值被丢弃；异常可能被无诊断地ACK为成功 | 当前空对象回调与内核返回一致；未来非空toast/card传播不属本PoC | 保留固定`{}`不扩展业务输出；仅修当前失败诊断，输出固定handler_error，不回显异常 |
| malformed bot/card通过展平wrapper后仍可能被记received | C：真实EventDispatcher的合成复现支持；计数不是事件schema完整校验 | 修复：仅验证必要字段存在性，不读取人员/群/卡/action/body值，补集成断言 |
| WSS只校验scheme与userinfo，未限制目标host/port | C：防御加固；需要可信官方discovery被破坏才可利用，不是已发生的SSRF | 本地fail-closed工程策略：仅feishu.cn域名族、默认或443端口；不把该策略称官方全部域名目录；不合策略时不放宽到任意host |
| “single discovery call”注释不准确，重连会重复discovery | 重复请求属于重连机制；不能声称仅一次秘密传输 | 改为每次尝试有界，并补每运行最多32次、间隔至少1秒的fail-closed预算；不静默无限重试 |
| README仍写8192字节 | 旧复核快照发现 | 父助手已更新为32768字节，与Secret自身4096 UTF-8字节校验区分 |

## 测试校准与已知限制

- A（父助手本地实际命令）：原修复后Node71/71、Python15/15均exit0；后续运行边界变更须重新全量复跑，不能沿用这些数字。
- Python生命周期断言曾先人工兜底清理再检查死亡，已改为先断言、后按自身Popen兜底。父助手故意no-op cleanup时3/3因存活child失败；恢复后15/15通过。这是合成测试的RED/GREEN，不是live停止证据。
- `onReady`证明SDK观察到WebSocket open，不证明已订阅事件、真实消息/回调通路或业务接受；终态connected曾发生不等结束时健康。
- SDK只处理event型数据帧；平台新卡回调支持与真实本App帧型/ACK仍须分项测试。
- 主启动器不转交代理、NODE_OPTIONS、TLS关闭或额外CA环境变量；直接运行入口的外部环境依赖不是整机TLS审计。
- 独立复核披露：早期一版合成复现误保留真实defaultHttpInstance，可能向固定官方endpoint发出最多3次短时、已取消的合成凭证discovery请求。没有使用本用户实际Secret、没有取得响应/WSS或打开socket。后续已改假HTTP；因此不得把该复核笼统描述为完全无网络。该偏差不授权后续Agent使用真实凭证。
- 不覆盖stdout高流量全量性能、产品RBAC/ACL、业务幂等、远程竞争连接、应用后台配置或生产接受。

## 来源八字段

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| WS-RUNTIME-REVIEW-01 | C：机器复核及合成复现 | 本会话工作流wf_999df019-827的review结果；锚点runtime.mjs原211–216、382–411、SDK lib原102603–102612/102635–102670/103024–103034 | 本批机器复核者 | 2026-11-08 23:35 CST快照 | Radar/feishu-poc | 本批无秘密实现/定向复核；主助手 | 不作live通路、线上事故、人工金标或生产依据 |
| WS-RUNTIME-SDK-01 | B：固定官方源码 | [SDK核验报告](2026-11-08-radar-feishu-sdk-poc-verification.md)及其精确源码锚点 | 飞书官方SDK | npm1.76.0 | Radar/feishu-poc | 本批公开源码核验 | 不证明指定App真实投递 |

## 七字段

- **conclusion：** 当前运行边界仍HOLD；定向修复未验完，不能启动真实连接。
- **evidence：** WS-RUNTIME-REVIEW-01、WS-RUNTIME-SDK-01及父助手合成RED/GREEN命令。
- **assumptions：** 只使用官方发现端点与指定App；实际凭证只由主助手内存使用。
- **uncertainty：** 修复终态、平台真实WSS主机及ClientConfig、本App事件/卡回调投递尚待验证。
- **confidence：** 对已定位计时器/退出局限有源码及合成支持；对真实全链路无证据。
- **blocked_actions：** 普通发送、历史/卡片补读、后台修改、停止他人client、业务模型、Git、部署、生产声明。
- **next_human_action：** 如需后台设置或手动触发，由管理者在已有授权范围操作；本次不索取新Secret或自动扩大权限。
