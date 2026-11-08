# 飞书自建应用机器人：长连接接收群 @ 与单聊消息 —— 官方文档与 SDK 源码研究

- 日期：2026-11-08
- 范围：Momcozy Radar Agent 的飞书接入层（事件 + 卡片交互回调 + 出站消息）
- 研究方式：仅阅读飞书/飞书开放平台官方文档与 larksuite 官方 GitHub SDK 源码；未登录开发者后台，未读取任何凭证，未发起在线连接或 token 请求
- 目标读者：后续做架构决策、PoC验收与安全评审的人类负责人
- 校准提示：[主计划](../superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md)§5和[研究校准](2026-11-08-radar-research-calibration.md)统一核心三权限、消息ID去重、新旧卡片回调/重推差异、条件附件权限、配置生效例外及出站unknown。官方机制有支持不等于本应用实测；短窗/单活/查询对账均不能当平台全局保证。下文原建议仅为研究过程。

## 0. 证据分级与边界

| 等级 | 含义 | 本笔记中的用法 |
|---|---|---|
| A | 在本机/本租户实测得到的结果 | **本次为 0 条**。没有建立真实连接、没有换取 token、没有发送消息 |
| B | 官方文档或官方 SDK 源码可直接核对的事实/约束 | 平台限制、时限、权限键、API 语义、SDK 默认行为 |
| C | 本文提出的建议、推断或架构草案 | 架构、运维、安全策略；需人类评审后才可作为决策 |
| U | 文档未覆盖或本次无法访问 | 明确标注，不得当作事实使用 |

> 注意：本笔记不包含任何 App Secret。任务中提供的 App ID 与 Secret 均未写入、未读取、未用于任何调用。所有"线上配置"（机器人能力是否开启、权限是否已申请、长连接是否已启用、应用是否已发版）**均未验证**。

---

## 1. 结论摘要（TL;DR）

1. **长连接模式适用于本场景**：企业自建应用 + 官方 SDK + WebSocket 全双工通道即可接收 `im.message.receive_v1`，无需公网 IP/域名、无需内网穿透、无需处理 HTTP challenge 与加密解密。限制是仅企业自建应用、每应用最多 50 条连接、集群随机投递不广播。（B）
2. **确认时限是硬约束**：事件与回调都要求 3 秒内处理完成；事件超时会触发重推（15 秒、5 分钟、1 小时、6 小时，最多 4 次），回调**没有补推**。（B）
3. **卡片回传交互可以用同一条长连接通道**：新版 `card.action.trigger` 支持长连接；**旧版 `card.action.trigger_v1` 不支持长连接**，只能走公网回调地址。（B）
4. **卡片回调是同步语义**：3 秒内必须返回 HTTP 200 等价的成功响应，不能 3xx；交互有效期 30 天，卡片可更新有效期 14 天，延时更新 token 仅 30 分钟且最多用 2 次。（B）
5. **投递语义是"至少一次"**：官方明确使用 at-least-once 策略，重复是正常现象；`im.message.receive_v1` 文档特别要求**用 `message_id` 去重，不要依赖 `event_id`**，这与通用事件文档"用 `event_id`"的表述存在冲突，工程上应两者都记录、以 `message_id` 为主键。（B）
6. **连接是集群随机投递**：同一应用多个 client 时，只有随机一个收到某条消息，无法做会话粘性。因此会话状态、去重、任务状态必须放在共享存储，不能放进程内存。（B）
7. **权限要按最小集申请**：单聊 `im:message.p2p_msg:readonly`、群内 @ `im:message.group_at_msg:readonly`、发送 `im:message:send_as_bot`；群内全部消息 `im:message.group_msg` 是官方标注的敏感权限，非必要不申请。（B）
8. **出站有明确频控**：同一用户 5 QPS、同一群组 5 QPS（群内机器人共享）、接口级 1000 次/分钟与 50 次/秒；发送/回复支持 `uuid` 去重，1 小时内至多成功一次。（B）
9. **App Secret 是本方案的最高价值凭证**：泄露即可冒用机器人发消息，并可另开一条长连接"分走"随机投递的事件份额；长连接没有 IP 白名单可兜底。（B 事实 + C 推断）
10. **必须有常驻主机与持久化**：长连接是出站长连接，Serverless 请求-响应模型不适用；要可靠就必须"先落库再确认"（持久化入站 + 发件箱），否则进程崩溃会丢已确认的消息。（C，基于 B 的时限与投递语义）

---

## 2. 事实与来源表

> 表中"锚点"指该页面内的章节标题或表格行，便于复核。所有页面访问时间：2026-11-08。

| # | 事实 | 等级 | 来源与锚点 |
|---|---|---|---|
| F1 | 长连接是 SDK 内能力，服务器只需可访问公网，与开放平台建立 WebSocket 全双工通道 | B | [使用长连接接收事件](https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case) · "功能优势" |
| F2 | 长连接仅支持企业自建应用；商店应用需走开发者服务器 | B | 同上 · "注意事项" 第 1 条 |
| F3 | 长连接收到消息后需 3 秒内处理完成且不抛异常，否则触发超时重推 | B | 同上 · "注意事项" 第 2 条 |
| F4 | 每个应用最多 50 条连接（每初始化一个 client 即一条） | B | 同上 · "注意事项" 第 3 条 |
| F5 | 长连接推送为集群模式、不支持广播，多个 client 时只有随机一个收到 | B | 同上 · "注意事项" 第 4 条 |
| F6 | 配置长连接订阅方式时，本地客户端必须在线才能保存成功 | B | 同上 · "步骤二：设置订阅方式" warning |
| F7 | 长连接内置通信加密与鉴权；无需额外解密、验签，也无需防火墙/白名单 | B | 同上 · "功能优势" 第 2 条 |
| F8 | 事件失败重推间隔 15 秒、5 分钟、1 小时、6 小时，最多 4 次 | B | [事件概述](https://open.feishu.cn/document/server-docs/event-subscription-guide/overview) · "事件推送 / 推送周期和频次" |
| F9 | 事件链路采用"至少发送一次"策略，成功接收也可能重复；建议幂等 | B | 同上 · "接收事件时成功重发机制" |
| F10 | 2.0 事件通用去重键为 `event_id`；部分事件为有序事件 | B | 同上 · "接收事件时成功重发机制""事件推送顺序" |
| F11 | `im.message.receive_v1` 特别说明：特殊情况可能重复推送，**用 `message_id` 去重，不要依赖 `event_id`** | B | [接收消息](https://open.feishu.cn/document/server-docs/im-v1/message/events/receive) · "注意事项" 第 2 条 |
| F12 | 长连接模式下事件与回调均"3 秒内处理完成"；回调无补推机制，超时即失败 | B | [回调概述](https://open.feishu.cn/document/event-subscription-guide/callback-subscription/callback-overview) · "回调与事件的区别" |
| F13 | 卡片回传交互 `card.action.trigger` 支持长连接；旧版 `card.action.trigger_v1` **不支持**长连接 | B | [使用长连接接收回调](https://open.feishu.cn/document/event-subscription-guide/callback-subscription/step-1-choose-a-subscription-mode/configure-callback-request-address) · "使用限制" |
| F14 | 卡片回调需 3 秒内响应；业务服务端不可用 HTTP 3xx 响应 | B | [卡片回传交互](https://open.feishu.cn/document/feishu-cards/card-callback-communication) · "响应回调的结构体" warning |
| F15 | 卡片请求回调交互有效期 30 天；卡片可更新有效期 14 天 | B | [处理卡片回调](https://open.feishu.cn/document/feishu-cards/handle-card-callbacks) · "注意事项" |
| F16 | 延时更新 token 有效期 30 分钟，同一 token 最多更新 2 次；必须在响应回调之后执行 | B | [延时更新消息卡片](https://open.feishu.cn/document/server-docs/im-v1/message-card/delay-update-message-card) · "使用限制""延时更新消息卡片流程" |
| F17 | 卡片回调的 `event.token` 是更新卡片的凭证（30 分钟、最多 2 次） | B | [卡片回传交互](https://open.feishu.cn/document/feishu-cards/card-callback-communication) · "回调结构体" 表 `token` 行 |
| F18 | 卡片回调无权限要求（"暂无"），但 `user_id` 需 `contact:user.employee_id:readonly` 才返回 | B | 同上 · "基本信息" |
| F19 | 单聊接收需 `im:message.p2p_msg:readonly`（或历史键 `im:message.p2p_msg`） | B | [接收消息](https://open.feishu.cn/document/server-docs/im-v1/message/events/receive) · "权限要求" |
| F20 | 群内仅收用户 @ 需 `im:message.group_at_msg:readonly`（或历史键 `im:message.group_at_msg`）；含其他机器人 @ 需 `im:message.group_at_msg.include_bot:readonly` | B | 同上 · "权限要求" |
| F21 | 群内全部消息需 `im:message.group_msg`（官方标注"敏感权限"）；含机器人消息需 `im:message.group_msg.include_bot:read`（仅自建） | B | 同上 · "权限要求" |
| F22 | `im:message.p2p_msg`、`im:message.group_at_msg` 等四个历史权限点自 2024-09-30 停止申请，已有应用不受影响 | B | [权限点下线公告](https://open.feishu.cn/document/platform-notices/platform-updates-/message-and-group-scope-removed) · 正文第 1 段与"下线后的解决方案" |
| F23 | 发送消息权限三选一：`im:message`、`im:message:send_as_bot`、`im:message:send`（历史） | B | [发送消息](https://open.feishu.cn/document/server-docs/im-v1/message/create) · "权限要求" |
| F24 | 发送/回复频控：同一用户 5 QPS、同一群组 5 QPS（群内机器人共享）；接口级 1000 次/分钟、50 次/秒 | B | [发送消息](https://open.feishu.cn/document/server-docs/im-v1/message/create) / [回复消息](https://open.feishu.cn/document/server-docs/im-v1/message/reply) · "使用限制" |
| F25 | 发送/回复支持 `uuid` 去重：相同 uuid 请求 1 小时内至多成功一条 | B | [发送消息](https://open.feishu.cn/document/server-docs/im-v1/message/create) · 请求体 `uuid` |
| F26 | 更新消息卡片：身份需与发送者一致；需 `update_multi:true`；14 天内；单条消息更新 5 QPS；不支持批量消息与"仅特定人可见"卡片 | B | [更新已发送的消息卡片](https://open.feishu.cn/document/server-docs/im-v1/message-card/patch) · "注意事项""使用限制" |
| F27 | `tenant_access_token` 最大有效期 2 小时；剩余 <30 分钟时刷新会返回新 token，旧 token 仍短暂有效 | B | [自建应用获取 tenant_access_token](https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal) · "注意事项" |
| F28 | 开启机器人能力后需发布版本才生效；需审核的权限申请后需发版并由管理员审核才生效（免审权限申请后立即生效） | B | [如何开启机器人能力](https://open.feishu.cn/document/faq/trouble-shooting/how-to-enable-bot-ability) · 步骤 5；[申请 API 权限](https://open.feishu.cn/document/server-docs/application-scope/introduction) · "为企业自建应用申请 API 权限" |
| F29 | 可用范围决定哪些用户能发现/使用机器人；范围外用户单聊会报 230013 | B | [配置应用可用范围](https://open.feishu.cn/document/develop-process/test-and-release-app/availability) · "功能说明"；[发送消息](https://open.feishu.cn/document/server-docs/im-v1/message/create) · 错误码 230013 |
| F30 | 测试版应用无需发布即可生效；测试企业内权限可免审调试 | B | [配置应用可用范围](https://open.feishu.cn/document/develop-process/test-and-release-app/availability) · "应用开发者"；[申请 API 权限](https://open.feishu.cn/document/server-docs/application-scope/introduction) · "方式二：使用测试企业调试 API" |
| F31 | 群聊历史消息接口要求：应用需先具备单聊场景任一读取权限，且群聊还需 `im:message.group_msg` | B | [获取会话历史消息](https://open.feishu.cn/document/server-docs/im-v1/message/list) · "权限要求" |
| F32 | 机器人自身 open_id 可通过 `GET /open-apis/bot/v3/info` 获取，无权限要求 | B | [获取机器人信息](https://open.feishu.cn/document/client-docs/bot-v3/obtain-bot-info) · 请求/响应体 |
| F33 | 机器人进群事件 `im.chat.member.bot.added_v1`；官方列出的订阅权限为"获取与更新群组信息 / 订阅机器人进、出群事件 / 获取群组信息"三选一（页面给的是中文名，精确 scope key 未逐字核对） | B/U | [机器人进群](https://open.feishu.cn/document/server-docs/group/chat-member/event/added-2) · "事件" |
| F34 | 事件日志检索仅支持查询 7 天内、单次不超过 24 小时的推送日志 | B | [日志检索](https://open.feishu.cn/document/tools-and-resources/log-query-of-apps/open-api-log-query) · "检索事件日志" |
| F35 | 官方建议将耗时操作异步化，先返回 200，再异步处理 | B | [事件订阅优化指南](https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-callback-optimization-guide) · "优化策略" 第 2 条 |
| F36 | 官方 Node SDK：`EventDispatcher` 仅支持对象类型的卡片回传参数，不支持字符串 | B | [处理回调（Node SDK）](https://open.feishu.cn/document/server-side-sdk/nodejs-sdk/handling-callbacks) · "注意事项" |
| F37 | 官方 Node SDK 默认 `pingInterval=120s`、`reconnectInterval=120s`、`reconnectCount=-1`（无限）、`reconnectNonce=30s`、`autoReconnect=true` | B | [ws-config.ts](https://github.com/larksuite/node-sdk/blob/main/ws-client/ws-config.ts) · `private ws` 初始值 |
| F38 | 官方 Go SDK 默认 `autoReconnect=true`、`reconnectCount=-1`、`reconnectInterval=2m`、`pingInterval=2m`、`writeTimeout=10s`；服务端 pong 可覆盖 | B | [ws/client.go](https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client.go) · `NewClient`；[client_session.go](https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client_session.go) · `pongWait` |
| F39 | 官方 SDK 将 handler 结果作为响应帧返回；handler 抛错则响应 500（平台视为失败） | B | [Go client_message.go](https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client_message.go) · `writeEventResponse`；[Node index.ts](https://github.com/larksuite/node-sdk/blob/main/ws-client/index.ts) · `handleEventData` |
| F40 | Node SDK 对分片消息按 `message_id/sum/seq` 合并，缓存 10 秒过期 | B | [data-cache.ts](https://github.com/larksuite/node-sdk/blob/main/ws-client/data-cache.ts) · 注释 "magic number，10s expired" |
| F41 | 卡片回调结构包含 `operator.open_id`、`tenant_key`、`action.value`、`context.open_message_id`、`context.open_chat_id` | B | [卡片回传交互](https://open.feishu.cn/document/feishu-cards/card-callback-communication) · "回调结构体" |
| F42 | 卡片可更新窗口 14 天与交互窗口 30 天是两件事；第 14–30 天交互若动作为更新卡片，更新不生效 | B | [处理卡片回调](https://open.feishu.cn/document/feishu-cards/handle-card-callbacks) · "注意事项" |
| F43 | `im.message.receive_v1` 事件体含 `chat_id`、`chat_type`(p2p/group)、`thread_id`、`root_id`、`parent_id`、`mentions`、`message_type`、`content` | B | [接收消息](https://open.feishu.cn/document/server-docs/im-v1/message/events/receive) · "事件体" |
| F44 | 用户发给机器人的消息，用户必须在机器人可用范围内；群内发送要求机器人在群且拥有发言权限 | B | [发送消息](https://open.feishu.cn/document/server-docs/im-v1/message/create) · "前提条件" |
| F45 | 消息卡片"仅特定人可见"接口存在（ephemeral），可用于群内私密结果 | B | [卡片资源概述](https://open.feishu.cn/document/server-docs/im-v1/message-card/overview) · 列表项"发送仅特定人可见的消息卡片" |

---

## 3. 关键机制详解

### 3.1 事件（event）与回调（callback）不是一回事

| 维度 | 事件（如 `im.message.receive_v1`） | 回调（如 `card.action.trigger`） |
|---|---|---|
| 语义 | 异步通知 | 同步交互，用户端等待结果 |
| 是否需要返回业务数据 | 否，只需成功确认 | 是，响应体决定 toast/卡片更新 |
| 超时后的行为 | 重推 4 次（15s/5m/1h/6h） | **不补推**，用户端展示错误 |
| 幂等 | 至少一次，需去重 | 一次性交互，但仍需防重复点击 |
| 长连接支持 | 支持 | 新版支持；旧版不支持 |

来源：F8–F14。这一区分决定了架构必须分成两条处理路径：**事件可以"先落库再异步"**，**卡片回调必须在 3 秒内给出用户可见结果**。

### 3.2 长连接的拓扑与投递语义

- 连接方向：你的服务器主动出站连接 `wss://...`，不需要公网入口（F1、F7）。
- 连接数：每应用最多 50 条；一个 SDK client 实例 = 一条连接（F4）。因此 `副本数 × 每副本 client 数 + 本地开发连接数 ≤ 50`。
- 投递：集群模式、随机一个 client、不广播（F5）。**没有会话粘性**。
- 工程含义（C）：
  - 任意副本都可能收到任意会话的消息，会话状态、去重表、任务状态必须外置。
  - 滚动发布期间新旧副本同时在线，消息会被随机分到两个版本，必须保证协议与数据模型向后兼容。
  - 本地开发若使用生产应用凭证，会"抢走"约 1/N 的线上事件；必须使用测试企业/测试版本或独立应用。

### 3.3 确认时限、重试与去重

- 事件：3 秒内处理完成且不抛异常；否则按 15s/5m/1h/6h 重推，最多 4 次，总窗口约 7.1 小时（F3、F8）。
- 回调：3 秒内必须成功响应；无补推（F12、F14）。
- 去重键冲突（必须显式处理）：
  - 通用 2.0 事件文档：用 `event_id`（F10）。
  - `im.message.receive_v1` 页面：用 `message_id`，不要依赖 `event_id`（F11）。
  - 建议（C）：入站表同时落 `event_id` 与 `message_id`；对消息事件以 `(tenant_key, message_id)` 唯一约束为准，`event_id` 仅作审计与排障。卡片回调以 `event_id` 去重并叠加"用户+消息+组件+短时间窗"的防连点。
- 顺序：仅部分事件是有序事件；`im.message.receive_v1` 页面未声明为有序（U）。不要假设严格顺序，按 `create_time` 排序并允许小窗口乱序。

### 3.4 卡片交互：新旧机制与长连接

| 机制 | 回调类型 | 长连接 | 说明 |
|---|---|---|---|
| 新版卡片回传交互 | `card.action.trigger` | **支持** | 推荐；响应体为 `toast` + `card`（raw/template） |
| 旧版消息卡片回传交互 | `card.action.trigger_v1` | **不支持** | 只能配置公网回调地址；兼容历史机器人配置 |
| 历史"消息卡片请求网址" | 旧协议 | 不支持 | 在机器人页面配置过历史地址时，可能与新版并存，导致一次点击收到 2 个请求 |

来源：F13、F15、F26；以及[处理卡片回调](https://open.feishu.cn/document/feishu-cards/handle-card-callbacks) · "步骤二" 的请求数量表。

关键约束：
- 3 秒内响应，不能 3xx（F14）。
- 交互有效期 30 天；可更新有效期 14 天；第 14–30 天的"更新"动作不生效（F15、F42）。
- 延时更新 token：30 分钟、最多 2 次、必须在响应之后调用（F16、F17）。
- 卡片按钮的 `value` 在官方 Node SDK 中只支持对象，不支持字符串（F36）。设计回调数据时统一用 `{ "action": "...", "id": "..." }`。

### 3.5 出站：发送、回复、更新、异步任务卡

| 动作 | 接口 | 关键限制 | 适用 |
|---|---|---|---|
| 发送到会话 | `POST /open-apis/im/v1/messages` | 5 QPS/用户、5 QPS/群；`uuid` 去重 1h | 主动推送、群进度 |
| 回复某条消息 | `POST /open-apis/im/v1/messages/:message_id/reply` | 同上；保持 `root_id/parent_id` | 对话式回复，保留上下文 |
| 更新卡片 | `PATCH /open-apis/im/v1/messages/:message_id` | 同发送身份；`update_multi:true`；14 天；单消息 5 QPS | 长任务的进度/结果回填 |
| 延时更新卡片 | `POST /open-apis/interactive/v1/card/update` | 回调 token；30 分钟；最多 2 次；须在响应后 | 卡片点击后的慢任务 |
| 仅特定人可见卡片 | `POST /open-apis/ephemeral/v1/send` | 群内私密结果 | 避免群内泄露敏感数据 |

来源：F23–F26、F45。

**异步任务卡片的推荐时序（C）**：
1. 收到事件 → 3 秒内完成确认（落库并返回成功）；随后尽快发送一张"已接收，正在分析"的卡片（或文本）。注意：3 秒是事件确认时限，不是用户看到回复的时限。
2. 后台任务完成后，用 `message_id` PATCH 同一张卡片为结果（14 天内、5 QPS）。
3. 若是卡片按钮触发的慢任务：3 秒内返回 toast + `{}`，保存 `event.token`，任务完成后调用延时更新（30 分钟内、最多 2 次）。
4. 超过 30 分钟的任务不要依赖延时 token，改用 `message_id` PATCH；超过 14 天的结果只能新发消息。

### 3.6 身份与令牌

- 应用身份：`tenant_access_token`，最大 2 小时；SDK 自动缓存与刷新；剩余 <30 分钟刷新会产生新旧两个有效 token（F27）。
- 用户身份：`user_access_token` 需要 OAuth 授权，本场景不需要；发送接口若用用户身份还需 `im:message.send_as_user`，且卡片更新者必须是发送者（F26）。
- 卡片"身份"：卡片归属于发送它的应用机器人；只能更新本应用发送的卡片；更新身份必须与发送一致（F26）。
- 建议（C）：Radar Agent 全部使用应用身份；不申请用户身份权限，避免把员工个人数据面扩大。

### 3.7 权限矩阵（最小特权）

> "必需"指该场景下官方文档列出的"任一即可"集合中的最小项；"避免"指能覆盖但范围过大或已下线。

| 场景 | 必需（应用身份） | 可选 | 避免/不要申请 | 说明 | 等级 |
|---|---|---|---|---|---|
| 接收单聊 | `im:message.p2p_msg:readonly` | — | `im:message.p2p_msg`（2024-09-30 停止申请） | 只收用户发给机器人的单聊 | B |
| 接收群内用户 @ | `im:message.group_at_msg:readonly` | — | `im:message.group_at_msg`（历史键） | 不含其他机器人 @ | B |
| 接收群内"用户+机器人" @ | `im:message.group_at_msg.include_bot:readonly` | — | — | 需要感知其他 bot 时 | B |
| 接收群内全部用户消息 | `im:message.group_msg` | — | — | 官方标注**敏感权限**；非必要不申请 | B |
| 接收群内全部（含机器人） | `im:message.group_msg.include_bot:read` | — | — | 仅自建应用；审核等级需后台确认 | B |
| 发送/回复消息 | `im:message:send_as_bot` | `im:message`（过宽） | `im:message.send_as_user` | 应用身份发消息 | B |
| 更新卡片 | `im:message:update` 或复用 `im:message:send_as_bot` | — | — | 文档三选一 | B |
| 下载消息内图片/文件 | `im:resource` | `im:message`（过宽） | — | 处理用户上传的截图/附件 | B |
| 读取群信息 | `im:chat:read` | — | `im:chat.group_info:readonly`（已下线） | 群名、群类型 | B |
| 机器人自检 | 无 | — | — | `GET /open-apis/bot/v3/info` 无权限要求 | B |
| 获取 user_id | 不申请 | `contact:user.employee_id:readonly` | — | `open_id` 已足够做用户主键；user_id 是敏感字段 | B |
| 群历史补拉/对账 | 单聊读取任一 + `im:message.group_msg` | — | — | 群聊历史强制要求敏感权限 | B |
| 卡片回调 | 无 | — | — | `card.action.trigger` 权限要求为"暂无" | B |
| 机器人进群事件 | 官方三选一：获取与更新群组信息 / 订阅机器人进、出群事件 / 获取群组信息（精确 key 需后台确认） | — | — | 用于群生命周期管理 | B/U |

**最小权限结论（C）**：Radar Agent 第一版只申请 5 个权限：
`im:message.p2p_msg:readonly`、`im:message.group_at_msg:readonly`、`im:message:send_as_bot`、`im:resource`、`im:chat:read`。
`im:message.group_msg` 留到"需要群内全量上下文/历史对账"时再单独评审，并准备隐私影响评估。

### 3.8 应用上线与可用范围

- 开启机器人能力后必须创建版本并发布（F28）。
- 权限、事件订阅、回调订阅的变更都要发版审核才生效（F28）。
- 可用范围决定谁能搜到机器人、谁能单聊；范围外报 230013（F29）。
- 测试企业 + 测试版本可免审、免发布快速验证（F30）。这是 PoC 阶段的推荐路径。
- 长连接订阅方式保存时要求客户端在线（F6），所以上线顺序必须是：**先启动客户端 → 再保存长连接配置 → 再发版**。顺序错了会保存失败。

---

## 4. 建议的处理架构（C 级草案）

### 4.1 组件图

```
飞书开放平台
   │  WSS（出站 TLS，SDK 鉴权）
   ▼
┌─────────────────────────────────────────────┐
│ feishu-gateway（1..N 副本，总连接数 ≤ 50）    │
│  - WSClient + EventDispatcher               │
│  - 校验 header.app_id / tenant_key          │
│  - 计算 dedupe_key                          │
│  - 持久化 inbound_events + 入队              │
│  - 500ms 内返回成功（绝不在此做 LLM 调用）     │
└─────────────────────────────────────────────┘
   │  持久化队列（Redis Streams / SQS / Kafka）
   ▼
┌─────────────────────────────────────────────┐
│ agent-worker（消费组，可水平扩展）             │
│  - 解析 text/post/mentions                   │
│  - 会话解析（tenant+chat+thread+user）        │
│  - RBAC / 提示注入防护 / 工具白名单            │
│  - 调用 Radar Agent                          │
│  - 写 outbox（回复、卡片更新）                 │
└─────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────┐
│ outbox-sender（限速 + 重试 + 死信）           │
│  - 每会话令牌桶 5 QPS                         │
│  - send/reply 带 uuid 去重                    │
│  - PATCH 卡片 / delay update                  │
└─────────────────────────────────────────────┘
   │  HTTPS
   ▼
飞书 OpenAPI
```

### 4.2 持久化入站（durable ingress）

原则：**先落库、再确认**。事件的"成功"语义是"平台认为你已处理"，一旦确认后进程崩溃，平台不会补发。

建议表结构：

| 表 | 关键字段 | 约束/用途 |
|---|---|---|
| `feishu_inbound_events` | `event_id`、`message_id`、`tenant_key`、`chat_id`、`thread_id`、`event_type`、`raw_json`、`received_at`、`status` | `UNIQUE(tenant_key, message_id)`（消息事件）；`UNIQUE(event_id)`（其他事件） |
| `feishu_conversation_state` | `session_key`、`tenant_key`、`chat_id`、`thread_id`、`user_open_id`、`state_json`、`updated_at` | 会话状态外置，支持任意副本 |
| `feishu_outbox` | `id`、`dedupe_key`、`target_type`、`target_id`、`payload`、`state`、`attempts`、`next_at` | 发送前先落库；`uuid` 复用 `dedupe_key` |
| `feishu_card_bindings` | `message_id`、`chat_id`、`session_key`、`delay_token`、`token_expires_at` | 延时 token 30 分钟，过期清理 |
| `feishu_audit_log` | `actor_open_id`、`action`、`payload_hash`、`result`、`ts` | 安全审计与追责 |

入站处理顺序（严格）：
1. 解析帧 → 提取 `header.app_id`、`header.tenant_key`。
2. 与应用配置比对；不匹配直接丢弃并告警。
3. 计算 dedupe key；`INSERT ... ON CONFLICT DO NOTHING`。
4. 若为新记录，写入队列（同一事务或事务后 outbox 模式）。
5. 返回成功。目标 p99 < 500ms，硬上限 3s。

失败处理：
- 落库失败 → 抛出异常（SDK 返回 500）→ 平台重推（事件）或用户看到错误（回调）。
- 队列不可用 → 同上，让平台重推，不要静默吞掉。

### 4.3 会话隔离

`session_key` 建议：

```
tenant_key + ":" + chat_id + ":" + (thread_id || "root") + ":" + (chat_type == "p2p" ? user_open_id : "group")
```

理由：
- 单聊天然一对一会话。
- 群聊中同一 `chat_id` 可能有多个话题（`thread_id`），不同话题不应共享上下文。
- 群聊中多个用户共享同一会话，但"谁有权触发什么动作"必须按 `operator.open_id` 单独判定，不能把群会话当成单一用户。
- 卡片回调只带 `open_chat_id` 与 `open_message_id`，需要用 `message_id` 反查 `session_key`。

### 4.4 卡片交互的两种响应路径

**路径 A：快任务（<3s）**
- handler 内完成鉴权 + 轻量计算 → 直接返回 `toast` + 新卡片。
- 适合"确认/取消""切换筛选"等即时操作。

**路径 B：慢任务（>3s）**
- 3 秒内返回 `toast`（"已收到，正在处理"）+ `{}`。
- 同时落库任务与 `event.token`。
- 后台完成后：
  - 优先 `PATCH /im/v1/messages/:message_id`（14 天窗口，5 QPS）。
  - 若必须在 30 分钟内且只更新一次，可用延时 token。
- **禁止**在响应前调用延时更新（会失败或更新后复原，F16）。

---

## 5. 运维：故障、恢复与容量

### 5.1 故障矩阵

| 故障 | 现象 | 应对 | 等级 |
|---|---|---|---|
| 长连接断开 | 收不到事件；SDK 自动重连 | SDK 默认 2 分钟重连、无限次、2 分钟 ping（F37/F38）；监控 `onReconnected`，补偿窗口内消息 | B/C |
| 重连窗口内事件丢失 | 平台重推最多 4 次（约 7.1 小时）；断连期间是否排队未文档化 | 用群历史接口做对账（需 `im:message.group_msg`）；否则提示用户重发 | B/U |
| 进程在确认后崩溃 | 消息永久丢失 | 先落库再确认；禁止"内存队列 + 先 ack" | C |
| 数据库不可用 | 无法确认 | 让 handler 抛错，触发平台重推；同时告警 | C |
| 重复投递 | 同一消息处理两次 | `message_id` 唯一约束；下游幂等 | B |
| 乱序 | 回复顺序异常 | 按 `create_time` 排序；会话内加序列号；不要假设有序 | C |
| 出站 429/230020 | 发送失败 | 每会话令牌桶 + 指数退避 + 抖动；不要全局重试风暴 | B/C |
| 卡片更新失败 | 用户看到旧卡片 | 检查 14 天/5 QPS/`update_multi`/身份一致；失败落死信并补发新消息 | B |
| 应用发版后配置未生效 | 事件/权限仍旧 | 确认已创建版本并由管理员审核通过（F28） | B |
| 长连接配置无法保存 | 后台报错 | 先确保至少一个 client 在线（F6） | B |
| 凭证轮换 | 旧连接仍持有旧 secret | 维护窗口内轮换 + 重启全部 client；观察连接数 | C |

### 5.2 容量与连接预算

- 硬上限 50 条连接/应用（F4）。
- 建议：生产 2 副本 × 1 client = 2 条；预发 1 条；本地开发使用独立测试应用，不占生产连接池。
- 吞吐不由连接数决定，而由 worker 与出站频控决定；网关保持"薄"。
- 监控指标（C）：
  - `ws_connected`（应为副本数）
  - `ack_latency_p99`（目标 < 500ms）
  - `inbound_duplicate_ratio`
  - `inbound_lag_seconds`
  - `outbox_pending`、`outbox_dlq`
  - `feishu_api_error_rate`（按错误码分桶：230020/230013/230027/230099）
  - `card_update_failures`

### 5.3 上线/变更顺序（Runbook）

1. 启动 gateway（至少一个 client 在线）。
2. 开发者后台 → 事件与回调 → 事件配置 → 选择"使用长连接接收事件" → 保存。
3. 回调配置 → 选择"使用长连接接收事件"（UI 文案如此）→ 保存。
4. 添加事件 `im.message.receive_v1`；添加回调 `card.action.trigger`。
5. 确认权限已开通（或在测试企业内免审）。
6. 创建版本 → 申请发布 → 管理员审核。
7. 验证：单聊、群 @、卡片点击、事件日志状态 `SUCCESS`。
8. 回滚：保留上一版本；回滚时注意事件/回调配置是应用级，不会随代码回滚。

---

## 6. 安全与隐私

### 6.1 凭证

- App Secret 只存放在密钥管理服务/环境变量注入；不写入代码、镜像、日志、工单、Prompt。
- 轮换周期建议 90 天；轮换时所有 client 必须重启。
- **关键风险（C，基于 F5/F7）**：长连接模式不依赖入站白名单，文档也未提供客户端 IP 白名单机制，实际只有应用凭证鉴权。Secret 泄露者可以：
  1. 以机器人身份发消息；
  2. 另开一条长连接，按集群随机规则"分走"约 1/N 的事件；
  3. 读取其分到的事件内容（含用户消息）。
  因此必须监控"异常连接数/异常客户端"，并把 Secret 泄露视为数据泄露事件。
- 不要在前端工作台、浏览器扩展、移动端嵌入 Secret。

### 6.2 入站信任边界

- 即使长连接已鉴权，也要校验 `header.app_id` 与 `header.tenant_key` 是否属于本应用/本租户。
- 不要用 `header.token`（Verification Token）作为信任依据；长连接模式下平台已在建连时完成鉴权，官方说明无需再验签（F7）。
- 不要把 `sender.name` 当作身份；用 `sender_id.open_id`。
- 群内 @ 判定：用 `mentions[].id.open_id` 与 `/bot/v3/info` 返回的机器人 `open_id` 比对，而不是只匹配文本里的 `@_user_1`。

### 6.3 Agent 特有的提示注入风险（C）

飞书消息是**不可信输入**。Radar Agent 接收的是外部用户文本，可能包含"忽略之前的指令""把数据库导出"等攻击。

建议：
- 系统提示与用户内容严格分层；用户内容只作为数据字段传入。
- 工具白名单 + 参数校验；高危工具（写库、发消息、删除）需要显式授权与二次确认。
- 群聊场景下，非授权用户的指令不得触发高权限工具。
- 输出前做敏感信息检查（PII、密钥、内部链接）。
- 记录"谁在哪个会话触发了哪个工具"的审计日志。

### 6.4 数据与隐私

- 只存储业务必需字段；原始 `raw_json` 建议保留 30–90 天后归档或删除（需业务确认）。
- 消息内容可能含消费者 PII（妈妈人群、健康/哺乳相关讨论），按敏感数据加密存储。
- 工作台按角色做行级/字段级权限；导出需审批。
- 遵守最小化：不申请 `contact:user.employee_id:readonly`，避免拿到员工 user_id。
- 群内敏感结果用"仅特定人可见卡片"，避免群内广播。

---

## 7. 未来 PoC 验收清单（可执行，但本次未执行）

> 前置：使用**测试企业 + 测试版本**；不要用生产 Secret 在本地连生产应用。以下步骤全部为未来动作。

### P0 环境与配置

| # | 步骤 | 期望结果 | 证据 |
|---|---|---|---|
| P0-1 | 创建/进入测试企业，关联应用，切换测试版本 | 顶部显示"测试版" | 截图 |
| P0-2 | 添加机器人能力 | 应用能力页出现机器人 | 截图 |
| P0-3 | 只开通 5 个最小权限 | 权限列表与矩阵一致 | 截图/批量导入 JSON |
| P0-4 | 事件配置选"使用长连接接收事件"并保存（需 gateway 已在线） | 保存成功，无"应用未建立长连接" | 截图 + gateway 日志 |
| P0-5 | 回调配置选长连接并保存 | 保存成功 | 截图 |
| P0-6 | 添加 `im.message.receive_v1` 与 `card.action.trigger` | 列表出现两条 | 截图 |
| P0-7 | 创建版本并发布 | 状态"已发布" | 截图 |

### P1 连接与事件

| # | 步骤 | 期望结果 | 证据 |
|---|---|---|---|
| P1-1 | 启动 gateway | 日志 `connected to wss://` 或 `ws client ready` | 日志 |
| P1-2 | 单聊发送 "ping" | 收到 `chat_type=p2p`、`message_id`、`sender.open_id` | 入站表 |
| P1-3 | 机器人回复 | 事件确认 <3s；回复在正常网络下数秒内到达；`parent_id` 指向原消息 | 客户端截图 + API 响应 + ack 指标 |
| P1-4 | 建测试群并拉机器人进群 | 收到 `im.chat.member.bot.added_v1` | 入站表 |
| P1-5 | 群内 @机器人 发送 "ping" | 收到 `chat_type=group`；`mentions` 含机器人 open_id | 入站表 |
| P1-6 | 群内不 @ 发送消息 | 仅开 `group_at` 时**不应**收到事件 | 入站表为空 |
| P1-7 | 在隔离测试群开通 `im:message.group_msg` 后重复 P1-6 | 应收到事件 | 入站表（需评审后） |

### P2 可靠性

| # | 步骤 | 期望结果 | 证据 |
|---|---|---|---|
| P2-1 | 人为把同一 `message_id` 重放入 handler | 只处理一次；唯一约束生效 | DB 计数 |
| P2-2 | handler 内 sleep 5 秒 | 平台重推；事件日志 `retry cnt > 1`；出现重复 | 事件日志截图 |
| P2-3 | 改为"落库后立即返回"，重复 P2-2 | 无重推；ack p99 < 500ms | 指标 |
| P2-4 | 启动 2 个 gateway 副本，发 20 条消息 | 两个副本日志均有分布；总处理数 = 20，无丢失 | 日志聚合 |
| P2-5 | kill gateway 后重启 | 进程重启后自动建连；期间消息按平台重试窗口补齐或可对账 | 日志 |
| P2-6 | 同一群 10 条突发 | 队列削峰；无 230020；最终全部发出 | 指标 |
| P2-7 | 断开 DB | handler 抛错；平台重推；恢复后补齐 | 日志 |

### P3 卡片交互

| # | 步骤 | 期望结果 | 证据 |
|---|---|---|---|
| P3-1 | 发送带按钮卡片（`value` 为对象） | 客户端可点击 | 截图 |
| P3-2 | 点击按钮 | 收到 `card.action.trigger`；3 秒内完成响应；`operator.open_id` 正确 | 入站表 + 响应耗时 |
| P3-3 | 返回 toast + 更新卡片 | 客户端立即刷新 | 截图 |
| P3-4 | 返回 `{}` 后调用延时更新 | 第一次成功；第二次成功；第三次失败（超过 2 次） | API 响应 |
| P3-5 | 超过 30 分钟再延时更新 | 返回 token 失效 | API 响应 |
| P3-6 | 用 `message_id` PATCH 卡片 | 成功；`update_multi` 未显式设为 true 时按文档要求应失败，记录实际错误码 | API 响应 |
| P3-7 | 同时配置旧版 `trigger_v1` 与新版 | 一次点击收到 2 个请求；确认只保留新版 | 日志 |
| P3-8 | 连续快速点击同一按钮 5 次 | 业务侧只执行一次（防连点） | DB 计数 |

### P4 权限与安全负向测试

| # | 步骤 | 期望结果 | 证据 |
|---|---|---|---|
| P4-1 | 正式版本不发版直接调用 | 需审核权限不生效（99991672/230027）；测试版本应生效 | API 错误 |
| P4-2 | 可用范围外用户单聊 | 230013 | 错误码 |
| P4-3 | 伪造 `app_id` 的入站帧 | 被丢弃并告警 | 日志 |
| P4-4 | 检查日志 | 无 Secret、无 token、无完整手机号 | 日志抽样 |
| P4-5 | 检查连接数 | ≤ 50，且与副本数一致 | 后台/监控 |

### P5 可观测性

| # | 步骤 | 期望结果 |
|---|---|---|
| P5-1 | 事件日志检索 | 状态 `SUCCESS`，可见 `retry cnt` |
| P5-2 | 指标看板 | ack p99、重复率、outbox 积压、错误码分桶齐全 |
| P5-3 | 死信队列 | 可查看、可重放、可丢弃 |

---

## 8. 假设与不确定性

| # | 假设/不确定项 | 影响 | 如何处理 |
|---|---|---|---|
| U1 | 租户在飞书（open.feishu.cn）还是 Lark（open.larksuite.com）未确认 | SDK `domain`、API 域名、数据驻留地不同 | 人类确认租户区域；PoC 前先用测试企业验证 |
| U2 | 断连期间平台是否排队事件，文档未说明 | 影响补偿策略 | 不要假设会补；准备历史对账或用户重发 |
| U3 | `im.message.receive_v1` 是否为"有序事件"，页面未声明 | 影响会话内顺序 | 按 `create_time` 排序 + 序列号，不依赖平台顺序 |
| U4 | 同一 SDK client 是否同时承载事件与回调、平台是否分别计连接数，未明示 | 连接预算 | 先用 1 client 同时注册两类 handler 验证 |
| U5 | 长连接的真实吞吐/单连接并发上限未文档化 | 容量规划 | PoC 压测；网关保持薄 |
| U6 | `im:message.group_msg.include_bot:read` 的审核等级未在页面标注 | 审批周期 | 在开发者后台确认；非必要不申请 |
| U7 | 卡片的 14 天更新窗口与 30 天交互窗口在极端场景下的边界行为 | 长任务结果回填 | PoC 用短周期模拟；超期改用新消息 |
| U8 | 旧版 `card.action.trigger_v1` 与历史"消息卡片请求网址"并存时的双请求行为 | 重复处理 | 只保留新版；删除历史地址 |
| U9 | 应用当前是否已开启机器人能力、是否已发版、是否已配置长连接 | 一切上线动作 | **全部未验证**；由人类在后台确认 |
| U10 | 飞书侧对消息内容的 DLP 规则（如明文手机号/邮箱） | 发送失败 230028 | PoC 前确认租户 DLP 策略 |

---

## 9. 被阻塞/未执行的动作

明确记录，避免误以为已完成：

- 未读取、未存储、未使用 App Secret。
- 未调用 `tenant_access_token` 接口，未验证 App ID 是否有效。
- 未建立任何 WebSocket 长连接，未验证线上配置。
- 未在开发者后台修改机器人能力、权限、事件/回调订阅、版本或可用范围。
- 未发送任何飞书消息，未创建群，未添加机器人。
- 未初始化 git，未写代码，未部署，未改动任何外部状态。
- 未读取 luteos 系列站点内容（不属于本笔记任务范围）。
- 未读取其他本地项目、凭证配置或无关浏览器标签页。

---

## 10. 待人类决策

| # | 决策 | 选项 | 建议 |
|---|---|---|---|
| D1 | 租户区域 | 飞书中国 / Lark 国际 | 先确认，再定 SDK domain 与主机区域 |
| D2 | 群聊范围 | 仅 @ / 全部消息 | 第一版仅 @；全量消息需隐私评审 |
| D3 | 是否申请 `im:message.group_msg` | 申请 / 不申请 | 仅在做历史对账或群内全量上下文时申请 |
| D4 | 是否申请 user_id | 申请 / 不申请 | 不申请；open_id 足够 |
| D5 | 主机区域 | 中国大陆 / 海外 | 若为飞书中国租户，官方建议大陆服务器以留足 3 秒余量 |
| D6 | 常驻运行时 | VM/容器 / Serverless | 必须常驻；Serverless 不适合长连接 |
| D7 | 消息内容保留期 | 30 / 90 / 180 天 | 按隐私影响评估定；默认 30 天 |
| D8 | 群内敏感结果 | 共享卡片 / 仅特定人可见 | 含消费者数据时用 ephemeral |
| D9 | RBAC 模型 | 全员可用 / 角色白名单 | 先角色白名单，高危动作二次确认 |
| D10 | 副本与连接预算 | 1 / 2 / 3 副本 | 生产 2 副本；开发用独立测试应用 |
| D11 | Secret 托管 | KMS / Secret Manager / 环境变量 | KMS 或 Secret Manager；90 天轮换 |
| D12 | PoC 负责人 | — | 指定一人负责测试企业、发版与验收证据 |

---

## 11. 来源清单（精确链接）

### 官方文档

1. 接收消息 `im.message.receive_v1` — https://open.feishu.cn/document/server-docs/im-v1/message/events/receive
2. 事件概述（重试/至少一次/有序） — https://open.feishu.cn/document/server-docs/event-subscription-guide/overview
3. 使用长连接接收事件 — https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case
4. 使用长连接接收回调 — https://open.feishu.cn/document/event-subscription-guide/callback-subscription/step-1-choose-a-subscription-mode/configure-callback-request-address
5. 回调概述（回调无补推） — https://open.feishu.cn/document/event-subscription-guide/callback-subscription/callback-overview
6. 卡片回传交互 `card.action.trigger` — https://open.feishu.cn/document/feishu-cards/card-callback-communication
7. 处理卡片回调（30 天/14 天/3 秒） — https://open.feishu.cn/document/feishu-cards/handle-card-callbacks
8. 延时更新消息卡片（30 分钟/2 次） — https://open.feishu.cn/document/server-docs/im-v1/message-card/delay-update-message-card
9. 更新已发送的消息卡片（14 天/5 QPS） — https://open.feishu.cn/document/server-docs/im-v1/message-card/patch
10. 发送消息（5 QPS/uuid） — https://open.feishu.cn/document/server-docs/im-v1/message/create
11. 回复消息 — https://open.feishu.cn/document/server-docs/im-v1/message/reply
12. 获取会话历史消息 — https://open.feishu.cn/document/server-docs/im-v1/message/list
13. 卡片资源概述（ephemeral 等） — https://open.feishu.cn/document/server-docs/im-v1/message-card/overview
14. 自建应用获取 tenant_access_token — https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
15. 申请 API 权限（权限等级/免审/发版） — https://open.feishu.cn/document/server-docs/application-scope/introduction
16. 配置应用可用范围 — https://open.feishu.cn/document/develop-process/test-and-release-app/availability
17. 创建企业自建应用（发布流程） — https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN
18. 机器人概述 — https://open.feishu.cn/document/client-docs/bot-v3/bot-overview
19. 如何开启机器人能力 — https://open.feishu.cn/document/faq/trouble-shooting/how-to-enable-bot-ability
20. 获取机器人信息（bot open_id） — https://open.feishu.cn/document/client-docs/bot-v3/obtain-bot-info
21. 机器人进群事件 — https://open.feishu.cn/document/server-docs/group/chat-member/event/added-2
22. 权限点下线公告（2024-09-30） — https://open.feishu.cn/document/platform-notices/platform-updates-/message-and-group-scope-removed
23. 事件订阅优化指南（3 秒/异步化） — https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-callback-optimization-guide
24. 事件订阅常见问题 — https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/faq
25. 日志检索（7 天） — https://open.feishu.cn/document/tools-and-resources/log-query-of-apps/open-api-log-query
26. 处理回调（Node SDK 长连接示例） — https://open.feishu.cn/document/server-side-sdk/nodejs-sdk/handling-callbacks

### 官方 SDK 源码

27. Node SDK WSClient — https://github.com/larksuite/node-sdk/blob/main/ws-client/index.ts
28. Node SDK WS 默认配置 — https://github.com/larksuite/node-sdk/blob/main/ws-client/ws-config.ts
29. Node SDK 分片缓存 — https://github.com/larksuite/node-sdk/blob/main/ws-client/data-cache.ts
30. Go SDK WS Client — https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client.go
31. Go SDK 会话/心跳 — https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client_session.go
32. Go SDK 事件响应 — https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client_message.go

---

## 12. 未读/不可达的官方章节（覆盖缺口）

以下页面本次未能完整读取，相关结论已避免下断言：

| 页面 | 问题 | 影响 |
|---|---|---|
| API 权限列表（动态页） | 页面为动态渲染，简化抓取失败 | 无法逐条确认每个 scope 的审核等级；只能依赖具体 API 页的标注 |
| `im/v1/chat/get` | 简化抓取失败 | 群信息接口的精确权限键未逐字核对（仅从下线公告推断 `im:chat:read`） |
| 机器人进群事件官方页 | 直接抓取失败，仅通过搜索摘要获得关键字段 | 事件体字段未逐项核对 |
| open.larksuite.com 长连接页 | 抓取失败 | 国际版与飞书中国版的限制是否完全一致未验证 |
| 新版 tenant_access_token 页 | 实际返回商店应用页面 | 自建应用新路径未读取；已用历史版本文档核对 2 小时有效期 |
| CardKit / 流式卡片 | 未研究 | 本笔记不包含流式卡片建议 |
| 长连接吞吐/并发上限 | 官方未给出 | 只能通过 PoC 压测确定 |

---

**文档状态**：草案（C）。所有架构与运维建议需经人类负责人评审；所有线上配置需在开发者后台逐项核实后再执行。