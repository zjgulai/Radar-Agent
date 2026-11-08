# Radar 飞书长连接 PoC：执行范围与最小设计

- 日期：2026-11-08。
- 状态：`endpoint-authenticated / ws-handshake-pending`。
- 适用应用：`cli_aa69bd34937adbf7`，不回退到全局 CLI profile 或其他应用。
- 性质：当前用户新请求下的窄技术接入记录；不是完整 Radar 实施、B0 通过、D01–D12 批准或生产发布。

## 1. 新请求与历史边界

用户在先前研究批次之后明确要求：“先打通：打通 飞书事件回调长链接”，并给定上述 App ID 与 App Secret。此处只记录请求，不记录 Secret。新请求允许为该应用准备并测试最小事件/交互回调长连接；先前研究文档中“不开连接、不编码”的限制是当时批次边界，不作为对本次窄请求的永久禁止。

新请求不授予以下动作：普通消息/测试卡发送、读取历史/附件/个人资料、自动补读卡片内容、修改开放平台权限/订阅/版本、停止其他客户端、外联、业务模型调用、Git 或部署。收到实时测试事件只做内存处理及元数据计数，不保存正文或传播到额外 Agent。

## 2. 最小设计

使用独立的官方 Node SDK 低层 `WSClient` 与 `EventDispatcher`，不使用带自动消息读取的 CLI card consumer 或带发送功能的高层 channel。具体 API、连接就绪信号及关闭方式必须以固定版本源码核验为准。

- 单连接、有界本地进程；连接期间保持在线供开放平台验证，到期或 SIGINT/SIGTERM 后关闭。
- 事件：注册 `im.message.receive_v1`，必要时注册官方确认的 bot 入群事件；快速返回，不生成业务回答。
- 回调：仅新版 `card.action.trigger`；计划快速返回空对象 `{}`，只确认传输处理，不显示业务成功toast、不更新卡片、不执行合作决定；响应结构仍须与官方核验对齐。
- 数据：仅允许固定事件类型、P2P/群分类、计数、耗时、状态和随机请求标识出现在日志。原始消息、人员/群/卡片 ID、Secret、token、带查询参数连接 URL 与 SDK 原始错误均不输出。
- Secret：仅内存/受控 stdin 注入，不创建 `.env`、密钥文件或仓库凭证；不使用现有但 App ID 不匹配的全局 FEISHU 凭证。
- 错误：启动、认证、网络、未就绪、回调/事件未测分别记录；`start()` 返回不自动等于握手成功。
- 停止：使用核验后的 SDK 关闭 API，确认重连和心跳计时器已停止；不杀其他客户端。

这是一项传输层 PoC，不实现业务 principal/RBAC、工作台、数据库、LLM、业务幂等/outbox 或生产服务。

## 3. 测试与判断

本地合成测试只证明本地逻辑，不证明开放平台投递。覆盖配置拒绝、Secret/正文不泄漏、事件处理、新回调返回、处理超时、启动失败/就绪与有界停止；合成 fixture 不含个人数据。

live 分项记录：认证/握手、连接就绪、P2P 事件、群 @ 事件、新卡回调、重连、停止。只有实际观测项可标已验证；没有事件/卡片触发时保持 `not-tested`，网络或配置阻断为 `indeterminate/HOLD`，不计 pass。不得用普通消息或测试卡发送来自动补齐缺口。

## 4. 已完成前置检查

- A（本地查询事实）：项目开始此 PoC 时根目录只有 `docs`，无 `package.json`，不是 Git 仓库；Node v26.7.0、npm 11.19.0。不切换全局 runtime。
- B（官方 npm 元数据及本地安装）：`@larksuiteoapi/node-sdk` 1.76.0 已固定安装于独立 `tools/feishu-poc`，禁用 lifecycle scripts，共安装 52 个包。不改根目录技术栈，不切换 runtime；具体 API 与回调支持仍以源码和当前平台规则分别核验。
- A（有限本地事实）：可见本地进程命令未匹配该 App ID；`lark-cli event status --json` 未找到目标 App 本地 bus。两项都不能证明没有其他机器、环境配置或其他路径的连接。
- A（凭证存在性检查）：现有全局 `FEISHU_APP_SECRET` 已存在，但同组 App ID 不匹配目标。未读取/使用其值，不回退使用。
- A（网络可达性）：Node 原生 HTTPS 对 `https://open.feishu.cn` 返回 HTTP 200，TLS 校验通过；未使用应用凭证。只证明该时刻 HTTPS 可达，不证明 WebSocket/认证/事件通路。
- A（本地合成检查）：安全 stdin 输入读取器经历模块缺失检查、占位实现下 6 项行为失败（RED）、最小实现后 6 项通过（GREEN），exit 0，无跳过。仅覆盖完整 JSON、错误抑制、空输入、类型及 8192 字节限制；不是 live 凭证或连接验证。
- A（历史本地合成检查）：原请求定位及 stdin 子进程转交经历 RED/GREEN，7 项合成测试通过，exit 0。验证排除 summary/tool/assistant 与其他 App、多个匹配 fail-closed；不转交全局 FEISHU Secret、不把凭证放命令参数。此初版检查时实际连接认证未开始；后续认证及修复后测试分别见§5。
- A（有限 bus 范围复核）：local event status 中目标 App ID 出现次数为 0，另有 1 个本地 app bus；不输出其 App 身份、不停止或接管。
- D（未验证）：远程已有连接、应用后台模式/权限/订阅/发布状态尚未知。不停止其他连接，不自行修改后台。
- B（官方 README）：main README 的旧“callback 不支持”说明与当前平台规则不一致。独立[新版回调核验](2026-11-08-radar-feishu-callback-poc-verification.md)已取得官方支持依据：新 `card.action.trigger` 支持长连接，旧 `_v1` 不支持；空对象不改卡。该报告只证明平台规则，不证明指定 App 已通。
- A（父助手复跑）：`npm --prefix tools/feishu-poc test` 为 31/31 通过（内核25＋stdin6），Python合成原请求定位/转交为7/7通过，退出码均0。当前内核使用完整事件 envelope，运行时须按固定SDK handler形状归一化；尚无SDK集成或live证据。

## 5. 真实接口验证与当前分项状态

- A（本次实际接口结果）：主助手仅向官方 HTTPS `POST /callback/ws/endpoint` 提交原始用户请求中的指定应用凭证。平台 `code = 0`，返回合法 WSS 连接地址。未输出或保存 Secret、地址、token、响应正文；没有启动 WebSocket。该事实只证明 endpoint 认证及地址获取，不证明订阅、权限、握手或投递。
- B（固定版本核验）：[SDK 1.76.0 源码报告](2026-11-08-radar-feishu-sdk-poc-verification.md)已返回；安装副本与校验后的官方 tarball 一致。`start()` 只启动尝试，实际就绪使用 `onReady`；v2数据由dispatcher展平，适配器需补回内核的event wrapper；关闭使用 `close({force:true})` 并取消 discovery。
- D（卡片线级验证）：官方支持新回调，但SDK仅分发event型数据帧，卡片回调真实线帧未观测；不得把本地`{}`返回等同于平台接收成功。
- C（跨会话协调说明）：本机另一 Radar 会话明确说明不开启/不计划开启本 App 长连接，且不修改 `tools/feishu-poc` 或相关配置。这只排除该会话已声明的竞争计划，不证明所有本地/远程client不存在，也不是新的用户授权；该会话其他任务不进入本PoC范围。
- 独立内核复核已返回：确认SDK展平接口需要适配、启动器子进程终止/总时限、非对象JSON行、转录读取上限及Unicode/控制字符输入上限缺陷。运行入口已补回event wrapper；启动器已加入8 MiB行/64 MiB总限、32768字节stdin、UTF-8转交、父duration+30秒时限及仅自身child终止/reap。修复仅使用合成资料，新增行为断言先RED再GREEN；复核标记 `human_gold_claim_count=0`，不是人工金标。
- A（修复后父助手新复跑）：Node为71/71通过（内核25、stdin10、SDK边界14、运行入口22），Python为15/15通过，均exit 0、无跳过；运行入口语法检查通过，安装SDK 1.76.0的lib SHA-256与固定官方副本一致。这些合成检查不证明真实握手或平台投递。
- A（修复后限定泄漏检查）：从原始请求仅在内存取得Secret，对`docs`及`tools/feishu-poc`的44个文件精确匹配，排除`node_modules`/`__pycache__`，命中0；不称整机或所有秘密审计。
- 独立运行边界复核已返回；[处置记录](2026-11-08-radar-feishu-poc-runtime-review.md)登记ClientConfig计时器校验、握手中的CLI退出上限、启动时间余量和终态一致性等定向修复，当前执行中，未沿用旧71/71作修复终态证据。Python生命周期测试顺序已校准：先断言实际死亡/reap，再按捕获的自身Popen对象兜底清理；父助手故意将`_cleanup_child`设为no-op时3/3断言因存活child变红（0 errors），恢复实现后15/15复跑通过，exit 0。RED只在合成进程内临时替换，不改生产源文件。尚未启动WS、未读取历史、未发送普通消息/卡片、未改后台配置。

- A（2026-11-09定向修复后父助手复跑）：Node86/86、Python16/16通过，均exit0，无跳过；语法与固定SDK hash校验通过。`docs`及PoC共51文件针对实际Secret精确扫描0命中；初次进程查询误把自身shell脚本文本计为1，改按node可执行名称及准确入口匹配后本PoC接收器为0。这是本地有限范围事实，不证明无远程其他client。定向机器复核仍执行中，尚未启动WS。

| 项目 | 当前状态 |
|---|---|
| 指定App endpoint认证 | 已实际验证：code 0，WSS地址返回 |
| WebSocket握手/onReady | pending：尚未启动 |
| P2P事件 / 群@事件 / bot入群 | not-tested：无实时投递证据 |
| 新card.action.trigger投递与响应 | not-tested：无真实点击/平台响应证据 |
| 网络重连 | not-tested |
| 连接有界关闭 | pending：仅本地实现/测试，尚无live连接 |

## 6. 来源八字段

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| WS-INPUT-01 | A：本会话请求记录，只证明窄技术请求 | 用户消息“先打通：打通 飞书事件回调长链接”；不含凭证副本 | 用户，具体组织岗位未确认 | 2026-11-08 | Radar/feishu-poc | 主助手；无秘密的官方资料核验/本地实现/机器复核 | 不推定普通发送、后台修改、其他应用接入、生产批准或全部 D 决策批准 |
| WS-LOCAL-01 | A：本地查询输出，范围有限 | 本会话 runtime、目标进程及 event status 查询 | 本地操作系统/CLI | 2026-11-08 | Radar/feishu-poc | 本批无秘密核验/实现/复核 | 不证明无远程连接或指定应用已配置 |
| WS-SDK-01 | B：官方包/固定版本源码；不代表实测通路 | https://www.npmjs.com/package/@larksuiteoapi/node-sdk ; https://github.com/larksuite/node-sdk ; [固定版本核验](2026-11-08-radar-feishu-sdk-poc-verification.md) | 飞书官方 SDK | npm 1.76.0；2026-11-08读取 | Radar/feishu-poc | 本批公开资料核验/实现/复核 | 不作为握手、消息/回调实测或生产接受 |
| WS-LIVE-01 | A：实际endpoint认证响应 | 本会话主助手官方HTTPS请求，§5记录code 0和WSS地址存在性；不保存响应正文 | 飞书官方endpoint | 2026-11-08 | Radar/feishu-poc | 主助手；其他Agent仅能读脱敏结果 | 不证明WS握手、权限/订阅、事件/回调、用户接受或生产；不保存/传播凭证和地址 |

## 7. 七字段记录

- **conclusion：** 指定应用endpoint认证已实际成功（A，code 0）；WS握手、事件及真实卡片回调尚未验证。完整链路仍为 HOLD，当前3项阻断：运行入口/安全复核未完成、握手待测、事件/回调实际投递与响应待测。
- **evidence：** WS-INPUT-01、WS-LOCAL-01、WS-SDK-01及§5本次endpoint请求；源码支持与本地测试不冒充live握手。
- **assumptions：** 指定应用按企业自建长连接路径接入；凭证仅用于认证；本地单连接有界运行。
- **uncertainty：** 远程连接、后台配置、真实事件/回调投递、重连及有界停止尚需分别核验。
- **confidence：** 对认证代码0、WSS地址获取及已执行本地检查有依据；对完整连接成功尚无依据。
- **blocked_actions：** 普通发送、历史/补读、后台变更、停止其他 client、业务模型、Git、部署与生产声明。
- **next_human_action：** 若后台需要设置或缺少手动测试触发，由应用管理者在其获准范围内操作；本记录不代为修改或授予权限。不再索取 Secret。
