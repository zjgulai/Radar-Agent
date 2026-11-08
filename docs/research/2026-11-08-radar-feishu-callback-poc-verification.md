# 飞书新版卡片回调（card.action.trigger）长连接支持验证与 PoC 验收报告

- 日期：2026-11-08
- 目标应用：`cli_aa69bd34937adbf7`（仅使用 App ID；未验证其存在性、归属、应用类型或线上配置）
- 范围：只读核对飞书开放平台官方文档与 larksuite 官方 SDK 源码；给出“单连接、有界、本地、仅接收”的 WebSocket PoC 设计与验收清单
- 明确未做：未登录开发者后台、未读取或使用 App Secret、未调用任何凭证接口、未建立真实长连接、未发送消息/卡片、未修改应用配置、未执行 CLI consume、未改产品代码、未对产品仓库做 Git 操作、未部署
- 证据级别：A（本机/本租户实测）= 0 条；B（官方文档/官方 SDK 源码）= 本文主体；C（推断/建议）；U（未知）
- 机器复核标记：human_gold_claim_count=0

## 0. 结论摘要（先看这张表）

| 问题 | 结论 | 等级 | 关键来源 |
|---|---|---|---|
| 新版 `card.action.trigger` 是否支持长连接接收？ | **支持**。官方“使用长连接接收回调”文档给出 Go/Python/Java/Node SDK 的 `card.action.trigger` 长连接示例；“卡片回传交互回调”文档说明新版回调结构且 SDK 已全量支持新版卡片回调 | B | [S2][S3][S4] |
| 旧版 `card.action.trigger_v1` 是否支持长连接？ | **不支持**。官方明确旧版卡片回调只能“将回调发送至开发者服务器” | B | [S2] |
| 中性信息 Toast 的准确类型？ | `toast.type = "info"`，语义为“仅提示，不展示状态图标”；另有 `success` / `error` / `warning` | B | [S3][S4] |
| 回调响应体长什么样？ | 顶层 `toast` 与 `card` 均可选；不更新卡片时可返回 `{}` 或仅 `toast`；`card` 使用 `template` 或 `raw` 两种类型 | B | [S3][S4] |
| 事件与回调的 3 秒语义一样吗？ | 都有 3 秒上限，但事件超时会重推，回调超时**不补推**，用户端直接报错 | B | [S1][S2][S5][S6] |
| 事件重推间隔？ | 15 秒、5 分钟、1 小时、6 小时，最多 4 次；链路为“至少一次”，重复是正常现象 | B | [S6] |
| SDK README main 说“不支持回调订阅”对吗？ | **过时/错误**。同一官方文档与当前 SDK 源码、示例均支持 `card.action.trigger` 长连接；README 该行是旧说明 | B | [S12][S2][S13] |
| 接收单聊/群 @ 的最小事件键？ | 一个 `im.message.receive_v1` 覆盖两者；权限分别用 `im:message.p2p_msg:readonly` 与 `im:message.group_at_msg:readonly` | B | [S7] |
| 机器人进/出群事件？ | `im.chat.member.bot.added_v1` / `im.chat.member.bot.deleted_v1`；权限三选一，最贴合用途的是 `im:chat.members:bot_access` | B | [S8][S9] |
| 能否在不使用凭证、不改后台的情况下发现“另一个远端长连接客户端”？ | **不能可靠发现**。没有公开的客户端列表；静默的“仅接收”竞争客户端不可见。可用连接数 API/事件日志做间接判断，但都需要凭证或后台只读权限 | B/C/U | [S16][S17][S18] |
| 握手与合成测试能证明什么？ | 只能证明网络可达、SDK 分发/序列化/重连行为；不能证明应用已开通长连接、权限/订阅有效、平台接受响应、3 秒/重推真实生效 | C | [S1][S13][S15] |
| 本应用现在就能用吗？ | **未知（U）**。本次 A=0，未做任何线上验证 | U | 本文 §9、§12 |

## 1. 证据分级、边界与“无 Secret”说明

| 等级 | 含义 | 本文用法 |
|---|---|---|
| A | 本机/本租户真实连接、真实事件或真实卡片交互得到的结果 | **0 条**。没有建立连接、没有换 token、没有发消息 |
| B | 官方文档或官方 SDK 源码可直接核对的事实/约束 | 平台限制、时限、权限键、API 语义、SDK 默认行为 |
| C | 本文提出的推断、设计或运维建议 | 需人类评审后才可作为决策 |
| U | 文档未覆盖、页面不可达或本次无法验证 | 明确保留，不当作事实 |

**边界说明**

1. 本报告不包含任何 App Secret、tenant_access_token、user_access_token、Verification Token 或真实回调 token。
2. `cli_aa69bd34937adbf7` 仅作为目标应用标识出现；它符合官方 Node SDK 的本地 App ID 正则 `^cli_[0-9a-fA-F]{16}$`（`cli_` + 16 位十六进制），但**格式合法不等于应用存在或属于本租户** [S13]。
3. “No secret is provided or needed”应理解为：**本研究报告不需要 Secret**；未来要执行真实的长连接 PoC，仍必须在运行时由应用负责人注入 App Secret（或 ClientAssertion）才能完成握手。没有 Secret 时，只能做文档核对、端点/协议分析与本地合成测试，不能完成真实握手，更不能接收真实事件 [S13]。
4. 所有“线上配置”（机器人能力、权限、事件/回调订阅、长连接订阅方式、应用发版、可用范围）均**未验证**。本文出现的“应”“需要”都是未来验收动作，不是已完成状态。

### 1.1 与既有研究 `2026-11-08-feishu-long-connection-agent.md` 的 F 事实对照

| 既有 F | 本次核对结果 | 处理 |
|---|---|---|
| F3：3 秒内处理完成且不抛异常，否则重推 | 确认。事件概述对长连接明确“3 秒内处理请求，且 SDK handler 不抛异常” [S1][S6] | 保留为 B |
| F4：每应用最多 50 条连接 | 确认。事件/回调长连接页均写明 50 条，每 client 一条 [S1][S2] | 保留为 B |
| F5：集群随机一个 client、不广播 | 确认 [S1][S2] | 保留为 B |
| F12：事件/回调均 3 秒；回调无补推 | 确认。回调概述明确“不提供补推机制”，事件概述明确重推 [S5][S6] | 保留为 B |
| F13：新版 `card.action.trigger` 支持长连接；旧版 `_v1` 不支持 | **确认，且本次给出官方长连接回调页的 SDK 示例与旧版排除原文** [S2][S3][S4] | 升级证据粒度 |
| F14：3 秒响应；不可用 HTTP 3xx | 确认 [S3][S4] | 保留为 B |
| F15：交互有效期 30 天；可更新 14 天 | 确认 [S4] | 保留为 B |
| F16/F17：延时 token 30 分钟、最多 2 次、须在响应后 | 确认 [S3][S4] | 保留为 B |
| F36：Node SDK 卡片回传参数仅对象、不支持字符串 | **部分确认**：旧 `CardActionHandler` 的 `InteractiveCardActionEvent.action.value` 类型为 `Record<string, any>` [S21]；新 `EventDispatcher` 路径按 `header.event_type` 分发，官方文档允许 object/string [S3]。工程上仍应统一用对象 | 保留为设计约束，真实点击验证 |
| F37：Node SDK 默认 `pingInterval=120s`、`reconnectInterval=120s`、`reconnectCount=-1`、`reconnectNonce=30s`、`autoReconnect=true` | 确认 [S14] | 保留为 B |
| F39：SDK 将 handler 结果作为响应；handler 抛错回 500 | 确认 Node/Go 源码：`code: 200/500` + `data` [S13][S15] | 保留为 B |
| 既有 U4：一个 client 是否同时承载事件与回调、连接数如何计 | 仍为 U。文档说每初始化一个 client 就是一条连接 [S1]，SDK 允许同一 `EventDispatcher` 注册事件与 `card.action.trigger` [S2][S13]；但平台是否按 1 条计未实测 | 保留 U12 |

## 2. 当前第一方支持矩阵

### 2.1 新版 vs 旧版卡片回调

| 能力 | `card.action.trigger`（新版） | `card.action.trigger_v1`（旧版） |
|---|---|---|
| 长连接接收 | **支持** | **不支持**；只能“将回调发送至开发者服务器” [S2] |
| Webhook 接收 | 支持 | 支持 |
| 官方 SDK 支持 | 官方长连接文档给出 Go/Python/Java/Node 示例；文档称“开放平台 SDK 已全量支持新版卡片回调” [S2][S3] | 旧协议，保留兼容 |
| 回调结构版本 | `schema: "2.0"`，`header.event_type: "card.action.trigger"` [S3] | 旧结构 |
| 建议 | **只订阅新版** | 不要与新版同时添加；同时添加会导致一次点击收到 2 个请求 [S4] |

> 官方原文（长连接回调页·使用限制）：“消息卡片回传交互（旧）回调不支持 **使用长连接接收回调** 订阅方式，只能选择 将回调发送至开发者服务器 订阅方式。” [S2]
>
> 官方原文（卡片回传交互页）：“本文档提供新版本的卡片回调结构和响应示例。开放平台 SDK 已全量支持新版卡片回调。” [S3]

### 2.2 长连接模式的共同限制

以下限制同时适用于“长连接接收事件”和“长连接接收回调”：

| 限制 | 内容 | 来源 |
|---|---|---|
| 应用类型 | 仅企业自建应用；商店应用不支持长连接 | [S1][S2] |
| 处理时限 | 收到消息后 3 秒内处理完成；事件还要求 SDK handler 不抛异常 | [S1][S2][S6] |
| 连接数 | 每个应用最多 50 条连接；每初始化一个 client 就是一条 | [S1][S2] |
| 投递拓扑 | 集群模式、不支持广播；同一应用多个 client 时，只有随机一个收到某条消息 | [S1][S2] |
| 鉴权/加密 | 建连时鉴权；传输加密；无需自行解密/验签，无需公网 IP/域名/白名单 | [S1][S2] |
| 配置保存 | 事件/回调订阅方式保存时，本地必须有长连接在线 | [S1][S2] |

**推断（C）**：由于投递是“随机一个 client”，任何“会话粘性/进程内状态”都不成立；去重、会话状态、任务状态必须外置。滚动发布、多个副本、同事本地调试都会让事件被随机分走。见 §8。

### 2.3 一个需要解释的文档表象

“卡片回传交互回调”页的“基本信息”表里有一行“推送方式：Webhook” [S3]。这**不表示** `card.action.trigger` 只能走 Webhook。该字段是事件/回调详情页的通用元数据；同一个页面同时说明“开放平台 SDK 已全量支持新版卡片回调”，而专门的“使用长连接接收回调”页给出了 `card.action.trigger` 的长连接 SDK 示例 [S2][S3]。结论以专门的长连接订阅文档和 SDK 源码为准（B）。

## 3. 回调结构体与响应结构体（精确字段）

### 3.1 `card.action.trigger` 回调结构体

官方结构（节选，完整表见 [S3]）：

| 层级 | 字段 | 类型 | 说明 |
|---|---|---|---|
| 顶层 | `schema` | string | 固定 `"2.0"`（新版） |
| 顶层 | `header.event_id` | string | 回调唯一标识 |
| 顶层 | `header.token` | string | 应用 Verification Token |
| 顶层 | `header.create_time` | string | 微秒级时间戳 |
| 顶层 | `header.event_type` | string | 固定 `"card.action.trigger"` |
| 顶层 | `header.tenant_key` / `header.app_id` | string | 租户与应用标识 |
| `event` | `operator.open_id` | string | 触发者 open_id；`user_id` 仅在开启 `contact:user.employee_id:readonly` 时返回 |
| `event` | `operator.tenant_key` / `operator.union_id` | string | 触发者租户/union_id |
| `event` | `token` | string | 更新卡片用的凭证；30 分钟有效，最多更新 2 次 |
| `event` | `action.value` | object/string | 交互组件绑定的自定义回传数据 |
| `event` | `action.tag` | string | 交互组件标签，如 `button` |
| `event` | `action.name` | string | 组件自定义唯一标识（表单场景） |
| `event` | `action.form_value` / `input_value` / `option` / `options` / `checked` | object/string/bool | 表单、输入框、选择器、勾选器场景 |
| `event` | `context.open_message_id` | string | 卡片所在消息 ID |
| `event` | `context.open_chat_id` | string | 卡片所在会话 ID |
| `event` | `host` | string | 卡片展示场景，如 `im_message` |

> 官方原文（`event.token` 行）：“更新卡片用的凭证，有效期为 30 分钟，最多可更新 2 次。” [S3]

**注意（C）**：`action.value` 在官方文档中允许 object 或 string；但 Node SDK 的旧 `InteractiveCardActionEvent` 类型把 `action.value` 标为 `Record<string, any>`（仅对象）[S21]。为了避免 SDK 类型/运行时差异，PoC 与产品设计应统一使用**对象**（例如 `{"action":"confirm","id":"..."}`），不要依赖字符串 value。

### 3.2 响应回调的结构体

官方响应体是顶层 `toast` + 顶层 `card`，两者均可选 [S3]：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `toast` | object | 否 | 客户端 Toast 弹窗提示 |
| `toast.type` | string | 否 | 可选 `info` / `success` / `error` / `warning`；`info` 为“仅提示，不展示状态图标” [S4] |
| `toast.content` | string | 否 | 单语言提示文案 |
| `toast.i18n` | map | 否 | 多语言文案；key 如 `zh_cn`、`en_us`、`zh_hk`、`zh_tw`、`ja_jp` 等 [S3] |
| `card` | object | 否 | 卡片数据；不更新卡片时可省略 |
| `card.type` | string | 是（若传 `card`） | `template`（卡片模板）或 `raw`（卡片 JSON） |
| `card.data` | object | 是（若传 `card`） | `raw` 时为卡片 JSON；`template` 时为模板数据 |
| `card.data.template_id` | string | 是（`template` 时） | 卡片模板 ID |
| `card.data.template_version_name` | string | 否（`template` 时） | 固定版本号；避免发布后立即影响线上 |
| `card.data.template_variable` | object | 否（`template` 时） | 模板变量赋值 |

#### 中性信息 Toast（本文要求的“neutral informational toast”）

只提示、不改变卡片、不展示成功/失败图标：

```json
{
  "toast": {
    "type": "info",
    "content": "已收到",
    "i18n": {
      "zh_cn": "已收到",
      "en_us": "Received"
    }
  }
}
```

依据：`toast.type` 的 `info` 在官方示例注释中明确为“仅提示，不展示状态图标”；`success` 是成功提示（带成功状态），`error`/`warning` 分别带失败/警告状态 [S4]。`toast` 的 `content` 与 `i18n` 均为可选，但生产建议至少给 `content` 作为兜底 [S3]。

#### 不更新卡片

官方“方式二：不更新卡片”明确：3 秒内返回 HTTP 200，HTTP body 为 `"{}"` 或返回自定义 Toast 结构体 [S4]。因此：

- `{}`：交互成功，无 Toast、卡片保持原样。
- 仅 `toast`：交互成功，弹 Toast、卡片保持原样。
- `toast + card`：交互成功，弹 Toast 并按 `card` 更新卡片。

#### 更新卡片（两种）

- `card.type = "raw"`：`data` 传卡片 JSON；若原卡片是 JSON 2.0，响应也必须是 2.0，不能降级为 1.0（错误码 200830）[S3]。
- `card.type = "template"`：`data` 传 `template_id`、可选 `template_version_name`、`template_variable` [S3]。

#### 禁止事项

- 业务服务端不可用 HTTP 3xx 响应卡片回调；否则用户端出现交互请求错误 [S3][S4]。
- 长连接场景没有 HTTP 状态码；等价要求是 handler 正常返回、SDK 回 `code: 200`。handler 抛异常时 SDK 回 `code: 500`，平台视为失败 [S13][S15]。
- 超时未响应，用户端展示请求错误；不会补推 [S5]。

### 3.3 长连接传输层封装（SDK 源码事实）

官方文档描述的是“响应体”的逻辑 JSON；在长连接下，SDK 会把 handler 返回值放进响应帧。Node SDK 的实现是 [S13 · `handleEventData`]：

```ts
const respPayload: { code: number, data?: string } = {
  code: HttpStatusCode.ok, // 200
};
const result = await this.eventDispatcher?.invoke(mergedData, { needCheck: false });
if (result) {
  respPayload.data = Buffer.from(JSON.stringify(result)).toString("base64");
}
// handler 抛错时：
respPayload.code = HttpStatusCode.internal_server_error; // 500
```

也就是说，**逻辑响应**仍是 §3.2 的 `toast/card` 对象；**传输帧**是：

```json
{
  "code": 200,
  "data": "<base64(JSON.stringify({toast,card}))>"
}
```

- 事件 handler 通常无返回值：`{ "code": 200 }`，无 `data`。
- 回调 handler 返回 Toast/卡片对象：`code: 200` + base64 后的 JSON。
- handler 抛异常：`code: 500`；事件会触发平台重推，回调没有补推 [S13][S15]。
- Go SDK 同样在 handler 出错时回 `http.StatusInternalServerError`，否则回 `200` 并把返回值 marshal 进 `data`（`[]byte` 在 JSON 中即 base64 字符串）[S15 · `writeEventResponse`]。

**限制**：以上是 SDK 源码行为，不是平台文档对“平台一定接受该帧”的保证；真实卡片点击仍是唯一的 A 级证据（见 §9）。

## 4. 3 秒行为、重推与去重（事件 vs 回调）

### 4.1 对照表

| 维度 | 事件（如 `im.message.receive_v1`） | 回调（`card.action.trigger`） |
|---|---|---|
| 语义 | 异步通知 | 同步交互，用户端等待结果 |
| 时限 | 3 秒内处理完成；长连接下 handler 不抛异常 | 3 秒内响应；返回 Toast/卡片/`{}` |
| 成功判定 | Webhook：HTTP 200；长连接：3 秒内完成且 SDK handler 不抛异常 | Webhook：HTTP 200 + 合法响应体；长连接：SDK 回 `code: 200` + 合法响应数据 |
| 超时后果 | 平台按 15 秒、5 分钟、1 小时、6 小时重推，最多 4 次 | **不补推**；用户端展示请求错误；错误码 200341 |
| 重复投递 | “至少一次”；成功接收也可能重复 | 平台不重投；用户可再次点击，业务需防连点/幂等 |
| 去重键 | 通用 2.0 事件用 `event_id`；`im.message.receive_v1` 页面明确用 `message_id`，不要依赖 `event_id` | 平台无重投；建议用 `operator.open_id + open_message_id + action.name/value + 短时间窗` 防连点 |
| 顺序 | 仅部分事件为有序事件；`im.message.receive_v1` 未声明有序（U） | 一次性交互，不存在平台顺序问题 |
| 长连接 | 支持 | 新版支持；旧版 `_v1` 不支持 |

来源：事件 3 秒/重推/至少一次 [S6]；长连接 3 秒/不抛异常 [S1][S2]；回调同步/无补推 [S5]；回调 3 秒/200/3xx 禁止/错误码 [S3][S4]；`message_id` 去重 [S7]。

### 4.2 关键原文

> 事件概述：“应用接收到包含事件数据的请求（向开发者服务器发送的 HTTP POST 请求，或是通过服务端 SDK 长连接接收到请求）时，需要在 3 秒内（TCP 建联的超时时间为 2 秒，回调整体的超时时间为 3 秒）以 HTTP 200 状态码响应该请求（长连接场景下，需要 3 秒内处理请求，且在 SDK 的处理函数中不抛出异常，即视为处理成功）。否则飞书开放平台认为本次推送失败，并以 15秒、5分钟、1小时、6小时 的间隔重新推送事件，**最多重试 4 次**。” [S6]

> 事件概述：“由于整个业务链路上消息通信目前采取至少发送一次的策略，所以系统整个链路中出现超时等异常时，均会触发内部消息重发逻辑，这会导致接收事件时即使成功接收，仍会收到重复消息的情况。” [S6]

> 回调概述：“回调是同步操作，不提供补推机制，超时未响应即认为这次回调失败，前端会展示报错等平台提供的兜底响应策略。” [S5]

> 处理卡片回调：“你的服务端接收到卡片回传交互的回调请求后，需要在 3 秒内以 HTTP 200 状态码响应该请求（未及时响应，用户客户端将展示请求错误）。” [S4]

> 接收消息：“特殊情况下可能会收到重复的推送，如有幂等需求请使用 `message_id` 去重，不要依赖 `event_id`。” [S7]

### 4.3 工程含义（C）

1. **事件路径**：handler 只做“校验 + 落库/入队 + 去重”，目标 p99 < 500ms，硬上限 3 秒；不要在 handler 内调用 LLM 或发消息。
2. **回调路径**：handler 只做“鉴权 + 轻量状态变更 + 返回 Toast/卡片”；慢任务必须在 3 秒内返回 `toast` + `{}`，之后用延时 token（30 分钟、最多 2 次）或 `message_id` PATCH（14 天窗口）更新 [S4]。
3. **回调超时不要指望重试**：错误码 200341 表示卡片回调服务未在规定时间内响应；没有补推 [S3][S5]。
4. **事件重复不要依赖 `event_id`**：`im.message.receive_v1` 明确用 `message_id`；建议同时记录 `event_id` 作为审计，但唯一约束以 `(tenant_key, message_id)` 为主 [S7]。
5. **防连点**：回调没有平台重投，但用户会连点；按 `operator.open_id + open_message_id + action` 做短时间窗幂等 [C]。
6. **卡片窗口**：交互有效期 30 天；可更新有效期 14 天；第 14–30 天交互若动作是“更新卡片”，更新不生效 [S4]。

## 5. SDK README 与官方文档冲突的核对

### 5.1 README 的原话

larksuite/node-sdk 的 `README.md` main 分支（以及 `README.zh.md`）在“Subscribing to Events Using Long Connection Mode / 使用长连接订阅事件”一节写道：

> English: “Currently, the long connection mode only supports event subscriptions and does not support callback subscriptions” [S12]
>
> 中文：“目前长连接模式仅支持事件订阅，不支持回调订阅。” [S12]

同一节还写“SDK supports this function integration, `1.24.0` and later versions are available”，但该示例只注册了 `im.message.receive_v1` [S12]。

### 5.2 与当前官方文档/SDK 源码的对照

| README 主张 | 当前官方证据 | 判定 |
|---|---|---|
| 长连接只支持事件、不支持回调 | “使用长连接接收回调”页明确列出 `card.action.trigger` 与 `url.preview.get` 的长连接 SDK 示例（Go/Python/Java/Node）[S2] | README 过时/错误 |
| 回调只能 Webhook | 同一页“使用限制”只排除**旧版** `card.action.trigger_v1`；新版 `card.action.trigger` 在示例中通过 `WSClient.start({ eventDispatcher })` 注册 [S2] | README 过时/错误 |
| SDK 不支持新版卡片回调 | “卡片回传交互回调”页：“开放平台 SDK 已全量支持新版卡片回调” [S3] | README 过时/错误 |
| 长连接仅事件 | 当前 Node SDK `start()` 日志明确写“receive events **or callbacks** through persistent connection only available in self-build & Feishu app” [S13] | README 过时/错误 |
| 长连接仅事件 | 当前 Node SDK 高层 `Channel` 模块直接使用 `WSClient` 并注册 `card.action.trigger` handler [S22] | README 过时/错误 |

**结论（B）**：README main 的“does not support callback subscriptions”是**陈旧说明**，与当前官方长连接回调文档、新版卡片回调文档、当前 Node SDK 源码/示例均矛盾。应以官方专门页 + 当前 SDK 源码为准。README 的 `1.24.0` 仅是“事件订阅长连接”的版本门槛；官方长连接回调文档的 Node 示例要求 `@larksuiteoapi/node-sdk@1.36.0` [S2][S20]。当前 npm 包版本为 `1.76.0` [S19]。

**残余风险（U/C）**：README 是很多开发者的第一入口，可能误导团队以为“回调不能走长连接”。PoC 必须锁定 SDK 版本（建议 ≥1.36.0，实际取当前 1.76.x 或团队锁定版本）并做真实回调验证；不能只凭 README 或只凭文档下结论。

### 5.3 另一个文档表象

`card.action.trigger` 详情页“推送方式：Webhook” [S3] 与 README 的旧说法容易叠加成“只能 Webhook”的误判。应以“使用长连接接收回调”专页的订阅方式说明和 SDK 示例为准 [S2][S4]。

## 6. 最小事件键与权限

### 6.1 事件键

| 场景 | 事件键 | 权限键（应用身份，最小集） | 说明 |
|---|---|---|---|
| 单聊用户发给机器人 | `im.message.receive_v1` | `im:message.p2p_msg:readonly` | 事件体 `chat_type = "p2p"` [S7] |
| 群内用户 @ 机器人 | 同上 `im.message.receive_v1` | `im:message.group_at_msg:readonly` | 事件体 `chat_type = "group"`，`mentions[].id.open_id` 含机器人 [S7] |
| 群内“用户或其他机器人”@ 机器人 | 同上 | `im:message.group_at_msg.include_bot:readonly` | 需要感知其他机器人 @ 时才申请 [S7] |
| 群内全部用户消息 | 同上 | `im:message.group_msg`（官方标注敏感权限） | 非必要不申请 [S7] |
| 群内全部消息（含机器人） | 同上 | `im:message.group_msg.include_bot:read` | 仅自建应用；审核等级需后台确认 [S7] |
| 机器人进群（可选） | `im.chat.member.bot.added_v1` | 三选一：`im:chat` / `im:chat.members:bot_access` / `im:chat:readonly` | 最贴合用途的是 `im:chat.members:bot_access` [S8] |
| 机器人被移出群（可选） | `im.chat.member.bot.deleted_v1` | 同上三选一 | 仅被移除的机器人收到 [S9] |

**关键点**：P2P 与群 @ 不需要两个事件键，**同一个 `im.message.receive_v1` 就够**；区别在权限键与事件体 `chat_type`。如果同时要单聊和群 @，两个读取权限都要有；如果只要其中一种，只申请对应那一个 [S7]。

**不要申请**：`im:message.group_msg`（敏感权限）与 `im:message.group_msg.include_bot:read`，除非未来确实需要群内全量上下文/历史对账；它们会显著扩大数据面 [S7]。

**机器人进/出群事件是否相关**：对“仅接收 P2P 与群 @ 消息”的 PoC **不是必需**；加上它可以验证机器人被拉群后的生命周期，但会增加权限与事件面。建议作为可选 P2 项 [S8][S9]。

### 6.2 权限与发版

- 添加事件时，控制台可以“确认开通权限”一键开通该事件所需权限；也可以“暂不开通”，之后在事件配置页点权限开通 [S10]。
- 即使权限已审批或免审，**添加事件/回调后仍必须发布应用**，配置才生效 [S10][S11]。
- 长连接仅企业自建应用；商店应用不适用 [S1][S2]。

## 7. 控制台配置：只读核对项与未来操作步骤

### 7.1 当前状态（本次全部未验证）

| 检查项 | 位置 | PoC 期望 | 本次观察 |
|---|---|---|---|
| 应用类型 | 开发者后台应用详情 | 企业自建应用 | **U** |
| 租户区域/域名 | 应用详情 / 凭证 | 飞书中国（`open.feishu.cn`）或 Lark（`open.larksuite.com`）明确 | **U** |
| 机器人能力 | 应用能力 > 机器人 | 已开启 | **U** |
| 事件订阅方式 | 开发配置 > 事件与回调 > 事件配置 | 使用长连接接收事件 | **U** |
| 已添加事件 | 同上 > 已添加事件 | `im.message.receive_v1`（可选 bot added/deleted） | **U** |
| 回调订阅方式 | 开发配置 > 事件与回调 > 回调配置 | 使用长连接接收事件 | **U** |
| 已订阅回调 | 同上 > 已订阅的回调 | 仅 `card.action.trigger` | **U** |
| 权限 | 权限管理 | p2p readonly + group_at readonly（可选 bot_access） | **U** |
| 应用发版 | 应用发布 > 版本管理与发布 | 已发布/已审核通过 | **U** |
| 可用范围 | 应用发布/可用范围 | 包含测试用户 | **U** |
| 旧版回调/历史卡片请求地址 | 回调配置 / 机器人页面 | 不存在，避免双请求 | **U** |
| 其他长连接客户端 | 运行时/团队 | 无 | **U** |

### 7.2 未来人工操作步骤（未执行；需应用负责人/管理员）

> 以下步骤会改变应用级配置，**本次一律未做**。生产应用切换订阅方式可能影响现有 Webhook 集成；没有负责人书面批准，不要在生产应用上操作。优先使用测试企业 + 测试版本 [S1][S2][S10][S11]。

1. 确认应用为企业自建应用，且租户区域/域名与 SDK `domain` 一致 [S1][S2]。
2. 确认机器人能力已开启 [S7 前提条件]。
3. 先启动**唯一一个**本地长连接客户端（仅接收），保证有连接在线；否则订阅方式保存会失败 [S1][S2]。
4. 开发者后台 > 开发配置 > 事件与回调 > 事件配置 > 编辑订阅方式 > 选择 **使用长连接接收事件** > 保存 [S1]。
5. 在“已添加事件”中点击“添加事件” > 选择“应用身份订阅” > 勾选 `im.message.receive_v1`（可选 `im.chat.member.bot.added_v1` / `im.chat.member.bot.deleted_v1`）> 确认添加 > 按需“确认开通权限” [S10]。
6. 回调配置 > 编辑订阅方式 > 选择 **使用长连接接收事件**（UI 文案如此，即使当前在回调配置页）> 保存；保存时本地客户端必须处于已连接运行状态 [S2]。
7. 在“已订阅的回调”中点击“添加回调” > 选择 **卡片回传交互**（`card.action.trigger`，新版）> 确认添加；**不要**添加旧版 `card.action.trigger_v1` [S11][S4]。
8. 确认权限已开通（或测试企业免审）[S10]。
9. 应用发布 > 版本管理与发布 > 创建版本 > 保存 > 申请线上发布；等待管理员审核通过，配置才生效 [S10][S11]。
10. 验证：事件配置/回调配置列表正确；事件日志状态 `SUCCESS`；真实 P2P、群 @、卡片点击各一次 [S17]。

### 7.3 配置相关未知

- 应用当前是自建还是商店应用、属于飞书中国还是 Lark：**U**。
- 当前订阅方式是否已经是长连接、是否已经添加过事件/回调：**U**。
- 当前版本是否已发布、权限是否已审批、可用范围是否包含测试账号：**U**。
- 是否存在旧版 `card.action.trigger_v1` 或机器人页面历史“消息卡片请求地址”：**U**；若存在，一次点击可能收到 2 个请求 [S4]。
- 控制台是否允许在无客户端在线时保存回调长连接方式：官方文档要求必须在线 [S2]；实际 UI 以现场为准（U）。
- 切换订阅方式对现有生产 Webhook 的影响：官方说明是应用级订阅方式；切换后事件/回调按新方式投递（C，需变更评审）。

## 8. 如何发现“另一个远端长连接客户端”（无凭证、无后台改动的现实答案）

### 8.1 为什么难

- 长连接是**你的服务器出站**连接开放平台，不是开放平台连入你的服务器；没有公开的“客户端列表”端点 [S1]。
- 投递是集群模式、随机一个 client、不广播；另一个客户端只要在线，就可能分走事件，但不会在你的客户端留下任何“被谁拿走”的痕迹 [S1][S2]。
- 每个应用最多 50 条连接；每初始化一个 client 就是一条 [S1][S2]。
- 握手需要 AppID + AppSecret（或 ClientAssertion）；没有凭证无法以该应用身份建立连接，也无法查询该应用的在线连接 [S13]。

### 8.2 可选检测方法（按限制条件分层）

| 方法 | 需要什么 | 能证明什么 | 局限 / 等级 |
|---|---|---|---|
| A. 人类可见的机器人副作用 | 飞书客户端、在测试会话中 | 若出现**你的 PoC 没有触发**的机器人消息/卡片更新/回复，可证明另有行为主体 | 只能发现“会行动”的客户端；**静默仅接收的竞争客户端完全不可见**；C |
| B. 受控投递缺口 | 你自己的应用凭证 + 可控测试消息 | 发送 N 条唯一消息，统计你的客户端收到数；显著少于 N 说明可能被分走 | 需要凭证；随机投递、断连、重试都会造成缺口；统计不是证明；C |
| C. 事件日志相关性 | 开发者后台只读日志权限 | 平台日志显示 `SUCCESS`/`event_id`，但你的入站日志没有该 `event_id`/`message_id`，说明可能被另一个 client 消费 | 需要后台只读权限；日志字段是否含 event_id 未验证；C/B |
| D. 连接数 API | `tenant_access_token` | `GET /open-apis/event/v1/connection` 返回在线连接数 `data.online_instance_cnt`；与已知客户端数对比，多出来的就是竞争连接 | 需要凭证；只给数量，不给身份；**不满足“无凭证”约束**；B/U [S16] |
| E. FAQ 的 500/重试症状 | 事件日志/回调日志 | 官方 FAQ：多个在线长连接实例中部分未实现 handler 会导致 500；`retry cnt > 1` 可识别重推 | 需要日志权限；500/重试也可能由其它故障引起；B/U [S18][S17] |
| F. 负责人/团队断言 | 无 | 应用负责人确认没有其他客户端/没有同事本地调试 | 不是技术证明；人员变更/遗忘会失效；C |
| G. 本机 socket / DNS / TLS 检查 | 本机 | 只能看到**你自己**的出站连接 | 看不到远端客户端；C |

### 8.3 官方 FAQ 的两个关键说法

> “该问题通常因应用存在多个在线长连接实例所致：其中部分实例未实现对应监听事件的处理器（handler），进而触发 500 错误。” [S18]
>
> “是否有方式能够查到应用建立了多少个长连接？回答：当前不支持查看应用已建立多少个长连接。” [S18]

第二句与 2026-06-17 更新的新 API 存在冲突：官方 API 列表已列出 `GET /open-apis/event/v1/connection` [S16]，官方页面摘要称“Query the number of online long connections for the app”，返回在线连接数（第三方镜像称字段为 `data.online_instance_cnt`）[S16]。**判断**：FAQ 的“不支持查看”是旧答案；当前第一方有了连接数 API，但需要 `tenant_access_token`，所以仍不满足“无凭证”约束。连接数 API 的精确字段/租户可用性未直接读取官方页面（动态渲染），标记 B/U。

### 8.4 结论（C，重要）

在**严格禁止凭证、禁止后台读取/改动**的前提下：

- 没有可靠的技术手段能发现一个**静默的、仅接收的**远端长连接客户端。
- 唯一可用的证据是“机器人做出了你没有触发的动作”（需该客户端会发消息/更新卡片），或应用负责人/团队的过程性断言。
- 若允许**只读**后台或应用凭证，优先顺序是：
  1. `GET /open-apis/event/v1/connection` 对比 `online_instance_cnt` 与已知客户端数（最直接，但只给数量）；
  2. 事件日志 `SUCCESS`/`retry cnt`/500 与本地入站日志按 `event_id`/`message_id` 对账；
  3. 受控消息的投递缺口统计。
- 任何单一方法都不能给出“竞争客户端身份”；要证明“无竞争客户端”，需要**连接数 + 事件日志 + 负责人断言**三者组合，且仍不是平台级保证。

## 9. 握手与合成测试：能证明 / 不能证明

### 9.1 握手协议（来自 SDK 源码）

Node SDK 建立长连接的流程 [S13][S14]：

1. `POST ${domain}/callback/ws/endpoint`，JSON body 至少包含 `AppID` 与 `AppSecret`（或 `ClientAssertion`）。
2. 平台返回 `{ code, data: { URL, ClientConfig }, msg }`。
3. SDK 从 `URL` 解析 `device_id`、`service_id`，按 `ClientConfig` 设置 `PingInterval`、`ReconnectCount`、`ReconnectInterval`、`ReconnectNonce`。
4. SDK 用 `ws` 连接平台下发的 `wss://` URL，发送/接收 protobuf 帧；`start()` 成功后打印 `ws client ready`。
5. 事件/回调帧到达后，SDK 调 `EventDispatcher.invoke`；返回值放入 `{ code: 200, data: base64(JSON) }` 响应帧；handler 抛异常则 `code: 500`。

**关键事实**：没有 AppSecret/ClientAssertion，第 1 步就无法成功；所谓“只握手、不凭证”的探针无法建立真实长连接。它能做的最多是 DNS/TLS/HTTP 可达性检查，或观察无效请求的错误外形（但用真实 App ID 做无效认证尝试仍属于认证调用，本文不建议）。

### 9.2 能证明 / 不能证明矩阵

| 测试 | 能证明 | 不能证明 |
|---|---|---|
| DNS/TCP/TLS 到 `open.feishu.cn` / `/callback/ws/endpoint` | 网络路径可达、证书/域名正常 | 应用存在、Secret 有效、订阅配置有效、能收事件 |
| 用无效/占位凭证请求 `/callback/ws/endpoint` | 端点存在、错误响应外形；**不能**完成握手 | 真实应用/租户的任何状态；且属于认证尝试，本文未执行 |
| 用真实 Secret 完成一次握手（未来 PoC） | AppID/Secret 被平台接受；WS 升级成功；心跳/重连可用；连接计入在线连接 | 事件/回调订阅是否已配置；权限/可用范围；平台一定投递；3 秒/重推真实行为 |
| 本地构造 `card.action.trigger` 帧注入 `EventDispatcher` | SDK 能按 `header.event_type` 找到 handler；字段解析正确；handler 返回值被序列化 | 平台会发送该帧；平台接受该响应；Toast/卡片真实渲染 |
| 本地 mock WebSocket 服务端驱动 `WSClient` | SDK 的 ping/pong、重连、响应帧格式、`code 500` 行为 | 飞书服务端的协议一致性/真实投递 |
| 真实 P2P/群 @ 消息（未来 PoC） | 该应用/该租户/该版本下事件确实到达；权限/可用范围有效；ack 时延 | 平台全局保证；50 连接上限；无竞争客户端 |
| 真实卡片点击（未来 PoC） | `card.action.trigger` 确实到达；Toast 类型/内容；卡片是否更新；3 秒超时后的用户错误 | 30 天/14 天边界；延时 token 的全部分支；平台无重推的全局保证 |

### 9.3 合成测试建议（本地，不触碰平台）

1. **分发测试**：构造 `schema: "2.0"`、`header.event_type: "card.action.trigger"`、`event.operator.open_id`、`event.action.value`、`event.context.open_message_id/open_chat_id` 的 payload，交给 `EventDispatcher.register({"card.action.trigger": handler})`，断言 handler 收到字段、返回值原样返回 [S3][S13]。
2. **响应序列化测试**：handler 返回 `{toast:{type:"info",content:"..."}}`，断言 SDK 响应帧为 `code: 200` 且 `data` 解码后等于该 JSON；handler 抛错时断言 `code: 500` [S13]。
3. **空响应测试**：handler 返回 `{}`，断言响应帧 `data` 为 `base64("{}")`，平台语义为“不更新卡片” [S4]。
4. **去重测试**：重复注入同一 `message_id`/`event_id`，断言业务只处理一次 [S7]。
5. **时延预算测试**：在 handler 内测量 1ms/100ms/500ms/2.9s 分支，断言 p99 < 3s；但**不能**证明平台计时器/重推 [S1][S6]。
6. **生命周期测试**：mock WS 服务端模拟 open/ping/pong/close，断言 SDK 自动重连、`onReady`/`onReconnecting`/`onReconnected` 状态；不能证明飞书真实网络行为 [S14]。
7. **框架边界测试**：确认 `EventDispatcher` 对 `card.action.trigger` 的注册键与 `header.event_type` 完全一致；当前 Node/Go SDK 的 WS 数据帧只处理 `MessageType.event`，若平台把卡片回调帧标为 `type=card` 会被丢弃——**这是必须在真实 PoC 中确认的 U 项**（见 §12 U5）[S13][S15]。

## 10. 单连接、有界、本地、仅接收 PoC 设计（未来执行，本次未执行）

### 10.1 范围与边界

| 项 | 约定 |
|---|---|
| 应用 | `cli_aa69bd34937adbf7`（仅 App ID；应用类型/租户/配置先由负责人确认） |
| 连接 | **1 个进程、1 个 `WSClient` 实例、1 条长连接**；不启动第二个副本/第二个本地客户端 |
| 方向 | **仅接收**；不发送消息、不发送卡片、不回复、不更新卡片 |
| 时长 | 建议 ≤ 15 分钟；到点主动关闭 |
| 消息量 | 建议 ≤ 20 条测试消息 + 1 次人工卡片点击 |
| 凭证 | 运行时由负责人注入；不写入报告、不写入日志、不落盘；本报告不含 Secret |
| 配置 | 本次不改；未来由管理员在测试应用/测试版本上配置，生产切换需书面批准 |
| 日志 | 只记录必要字段：`event_id`、`event_type`、`message_id`、`chat_type`、`operator.open_id`、接收时间、handler 耗时、响应 JSON（脱敏） |
| 结束 | 关闭 WS、确认进程退出、确认无残留连接；可选查询连接数回落 |

### 10.2 建议的注册键

```text
事件：
  im.message.receive_v1
  （可选）im.chat.member.bot.added_v1
  （可选）im.chat.member.bot.deleted_v1
回调：
  card.action.trigger
```

说明：P2P 与群 @ 共用 `im.message.receive_v1`；不要注册旧版 `card.action.trigger_v1` [S7][S2]。

### 10.3 处理策略

- **事件 handler**：校验 `header.app_id` / `header.tenant_key`；用 `message_id` 去重；落库/入队后立即返回；不做 LLM、不发消息；目标 <500ms，硬上限 3 秒 [S6][S7]。
- **回调 handler**：校验 `operator.open_id`、`open_message_id`、`action.value`；做轻量鉴权/状态变更；3 秒内返回：
  - 中性提示：`{"toast":{"type":"info","content":"已收到"}}`；
  - 或 `{}`（不更新卡片）。
  - 不在 handler 内做慢任务；慢任务走延时 token/后续 PATCH [S4]。
- **响应**：不要抛异常；不要返回 3xx（长连接下即不要用错误码/异常表达业务失败）[S3][S13]。
- **记录**：保存原始帧的脱敏副本（去掉 token、手机号、消息正文中的敏感内容），保留 `event_id`/`message_id` 用于对账 [S17]。

## 11. 生命周期验收清单

> 说明：以下为未来 PoC 的验收项；“证据”列是应保存的工件。当前全部未执行，状态为 U。

### P0 前置（只读/负责人确认）

| # | 检查/动作 | 期望 | 证据 | 状态 |
|---|---|---|---|---|
| P0-1 | 确认应用为企业自建、租户区域正确 | 自建；`domain` 与租户一致 | 后台截图/负责人确认 | U |
| P0-2 | 确认机器人能力已开启 | 应用能力页有机器人 | 截图 | U |
| P0-3 | 确认事件订阅方式为长连接 | 事件配置显示“使用长连接接收事件” | 截图 | U |
| P0-4 | 确认已添加 `im.message.receive_v1`（可选 bot 事件） | 已添加事件列表匹配 | 截图 | U |
| P0-5 | 确认回调订阅方式为长连接 | 回调配置显示“使用长连接接收事件” | 截图 | U |
| P0-6 | 确认已订阅 `card.action.trigger`，且无 `_v1`/历史地址 | 仅新版；无双请求风险 | 截图 | U |
| P0-7 | 确认权限最小集 | p2p + group_at（+可选 bot_access） | 权限列表截图 | U |
| P0-8 | 确认版本已发布/审核通过、可用范围含测试用户 | 配置已生效 | 版本页截图 | U |
| P0-9 | 确认无其他已知长连接客户端 | 仅本 PoC 一个 | 负责人断言/连接数基线 | U |
| P0-10 | 确认使用测试应用/测试版本；生产切换有批准 | 不影响生产 | 变更单/负责人确认 | U |

### P1 连接

| # | 步骤 | 期望 | 证据 | 状态 |
|---|---|---|---|---|
| P1-1 | 启动唯一 `WSClient`，注册事件与回调 handler | 进程启动，无第二个 client | 启动日志 | U |
| P1-2 | 观察连接成功 | `ws client ready` / `connected to wss://` | 日志 | U |
| P1-3 | 保持 ≤15 分钟 | 无异常断连/重连风暴；心跳正常 | 连接状态日志 | U |
| P1-4 | （可选，需凭证）查询 `GET /open-apis/event/v1/connection` | `online_instance_cnt` 与已知客户端数一致 | API 响应 | U |
| P1-5 | 记录基线后保持单连接 | 连接数不增加 | 指标 | U |

### P2 事件

| # | 步骤 | 期望 | 证据 | 状态 |
|---|---|---|---|---|
| P2-1 | 测试用户单聊发送唯一文本 | 收到 `im.message.receive_v1`；`chat_type=p2p`；`header.app_id` 正确；`message_id`/`sender.open_id` 存在；ack <3s | 入站日志/耗时 | U |
| P2-2 | 测试群内 @ 机器人 | 收到同一事件；`chat_type=group`；`mentions[].id.open_id` 含机器人；ack <3s | 入站日志 | U |
| P2-3 | 群内不 @ 机器人 | 仅开 `group_at` 时**不应**收到事件 | 入站日志为空 | U |
| P2-4 | 重复注入同一 `message_id`（或平台重推） | 业务只处理一次；唯一约束生效 | DB/计数 | U |
| P2-5 | （可选）把机器人拉入测试群 | 收到 `im.chat.member.bot.added_v1` | 入站日志 | U |
| P2-6 | 记录事件日志 | 状态 `SUCCESS`；`retry cnt` 符合预期 | 后台日志截图 | U |

### P3 卡片回调

| # | 步骤 | 期望 | 证据 | 状态 |
|---|---|---|---|---|
| P3-1 | 人工发送一张带按钮的测试卡片并点击（**未来由人操作**） | 收到 `card.action.trigger`；`schema=2.0`；`operator.open_id`、`action.value`、`context.open_message_id/open_chat_id` 存在；3 秒内响应 | 入站日志/响应耗时 | U |
| P3-2 | 返回中性 Toast `{"toast":{"type":"info","content":"..."}}` | 客户端显示普通提示（无成功/失败图标）；卡片不更新；平台接受响应 | 客户端截图 + 响应日志 | U |
| P3-3 | 返回 `{}` | 交互成功；无 Toast；卡片保持原样 | 客户端截图 + 响应日志 | U |
| P3-4 | 负向：handler sleep >3 秒 | 用户端请求错误（200341）；**没有**第二次回调补推 | 客户端截图 + 入站计数 | U |
| P3-5 | 确认未订阅旧版 `_v1`/历史地址 | 一次点击只有 1 个回调请求 | 入站计数 | U |
| P3-6 | 连续快速点击同一按钮 | 业务只执行一次（防连点） | DB/计数 | U |

### P4 可靠性与生命周期

| # | 步骤 | 期望 | 证据 | 状态 |
|---|---|---|---|---|
| P4-1 | kill 客户端后重启 | SDK 自动重连；`onReconnecting`/`onReconnected` 触发；无进程残留 | 日志 | U |
| P4-2 | 断连期间发送消息，恢复后观察 | 平台按 15s/5m/1h/6h 重推或可对账；不丢已确认数据 | 入站日志/事件日志 | U（断连排队行为未文档化） |
| P4-3 | 主动关闭客户端 | 进程退出；连接关闭；无残留 socket | 日志/进程检查 | U |
| P4-4 | （可选，需凭证）关闭后查连接数 | `online_instance_cnt` 回落 | API 响应 | U |
| P4-5 | 检查日志 | 无 Secret、无 token、无完整 PII | 日志抽样 | U |
| P4-6 | 检查应用配置 | 与 PoC 前一致，未发生未批准变更 | 配置对比 | U |

### P5 证据与签核

| # | 项 | 要求 |
|---|---|---|
| P5-1 | 证据包 | 连接日志、入站事件日志（event_id/message_id）、回调响应 JSON、ack 时延、后台事件日志截图、客户端 Toast 截图 |
| P5-2 | 脱敏 | 去掉 token、Secret、手机号、完整消息正文中的敏感信息 |
| P5-3 | 判定 | 所有 P0–P4 必选项通过；失败项记录复现步骤与堆栈；U 项单列 |
| P5-4 | 签核 | 应用负责人确认“无其他客户端/配置未变”；安全/运维确认无 Secret 泄漏 |

**通过标准（C）**：P2/P3 必选项全部收到且 ack p99 <3 秒；无重复副作用；回调超时无补推；无旧版双请求；无 Secret 泄漏；配置零漂移。任何一项不满足，不得宣称“本应用长连接回调已验收”。

## 12. 未知项与阻塞（必须保留）

| # | 未知/阻塞 | 影响 | 如何解除 |
|---|---|---|---|
| U1 | 应用 `cli_aa69bd34937adbf7` 是否为自建应用、是否存在、所属租户/区域 | 长连接仅支持自建；域名为 `open.feishu.cn` 还是 `open.larksuite.com` 影响 SDK `domain` | 负责人在后台确认；不要用凭证猜测 |
| U2 | 当前机器人能力、事件/回调订阅方式、已添加事件/回调、权限、发版、可用范围 | 任何一项不满足都收不到事件/回调 | 后台只读截图 + 负责人确认 |
| U3 | 是否已有其他长连接客户端（同事本地调试、旧部署、泄漏的 Secret） | 事件被随机分走；无法在无凭证条件下可靠发现 | 负责人断言；如允许凭证，查 `online_instance_cnt` + 事件日志对账 |
| U4 | 本次无 Secret，未建立真实长连接 | 所有应用级结论均为 B/U，A=0 | 未来由负责人注入运行时 Secret，做单连接有界 PoC |
| U5 | `card.action.trigger` 在 WS 帧中的 `type` 是 `event` 还是 `card` | Node/Go SDK 的 WS 数据帧只处理 `MessageType.event`；若平台发 `type=card`，handler 可能收不到 | 真实 PoC 抓帧确认；不要在合成测试中假设 |
| U6 | 连接数 API 的精确响应字段/租户可用性；FAQ 仍说“不支持查看” | 影响竞争客户端检测方案 | 用 `tenant_access_token` 实测 `GET /open-apis/event/v1/connection`；以官方页面为准 |
| U7 | 是否存在旧版 `card.action.trigger_v1` 或历史消息卡片请求地址 | 一次点击可能收到 2 个请求，导致重复处理 | 后台回调配置/机器人页面检查；只保留新版 |
| U8 | 长连接断开期间平台是否排队事件；重推窗口外的补偿 | 影响可靠性设计 | 官方未明确；PoC 实测 + 历史消息对账（需额外权限） |
| U9 | 3 秒/重推/50 连接/集群随机等平台行为未在本应用实测 | 不能把文档当成本应用 SLA | 真实 PoC + 事件日志；保留 U |
| U10 | Node SDK README 旧说法可能误导团队 | 版本/方案选型错误 | 锁定 ≥1.36.0（当前 1.76.x）；以官方长连接回调文档为准；README 提 issue/PR（未来） |
| U11 | `action.value` 字符串 vs 对象在新旧 SDK 类型中的差异 | 运行时类型错误/回调数据丢失 | 统一用对象；真实点击验证 |
| U12 | 一个 `WSClient` 同时承载事件与回调时，平台是否按 1 条还是 2 条连接计数 | 连接预算（50 上限） | 真实 PoC 用连接数 API/后台观察；默认按 1 条 client 计 [S1] |
| U13 | 测试用户是否在应用可用范围；权限是否需管理员审核 | 单聊/群 @ 可能报 230013 或权限错误 | 后台确认可用范围/权限状态 |
| U14 | 是否存在租户 DLP/内容安全规则影响测试消息 | 发送失败/内容被拦截 | 与租户管理员确认；PoC 用无害文本 |

## 13. 证据与限制

### 13.1 本次实际收集的证据

| 证据 | 内容 | 等级 |
|---|---|---|
| 官方“使用长连接接收事件”页 | 适用范围、3 秒、50 连接、集群随机、配置步骤、SDK 示例 | B |
| 官方“使用长连接接收回调”页 | 新版 `card.action.trigger` 长连接示例、旧版不支持、3 秒、50 连接、配置步骤 | B |
| 官方“卡片回传交互回调”页 | 回调结构、响应结构、Toast 枚举、错误码、schema 2.0 | B |
| 官方“处理卡片回调”页 | 3 秒、200/3xx、`{}`/Toast、30/14 天、延时 token | B |
| 官方“回调概述”/“事件概述” | 回调无补推、事件重推 15s/5m/1h/6h、至少一次 | B |
| 官方“接收消息”/“机器人进群”/“机器人被移出群” | 事件键、权限键、`message_id` 去重 | B |
| 官方“添加事件”/“添加回调” | 控制台步骤、发版要求 | B |
| Node SDK README main | 旧说法“only event subscriptions...does not support callback subscriptions” | B（作为反例） |
| Node SDK 源码（main，`b188be60134d409b61259546bcf69c731d2b0b7c`，npm 1.76.0） | 握手端点、AppID 正则、handler 分发、响应 `code/data`、重连默认值 | B |
| Go SDK 源码（`db9f52d0a88e3f5e4ed81bb34d71a28e3f5608fa`） | WS 消息分发、`code 200/500`、仅处理 `MessageTypeEvent` | B |
| 官方 API 列表/连接数 API 页面摘要 | `GET /open-apis/event/v1/connection`、`online_instance_cnt` | B/U（页面动态渲染） |
| 官方事件 FAQ 摘要 | 多客户端导致 500、console 不支持查看连接数 | B/U（页面动态渲染） |

### 13.2 限制

1. **A=0**：没有真实握手、没有 token、没有事件/回调；所有“支持”结论都是平台文档/SDK 源码层面的 B，不是本应用实测。
2. **文档冲突**：README 旧说法、`推送方式: Webhook` 元数据、FAQ “不支持查看连接数” vs 新 API。本文按“更专门/更新/源码优先”的顺序裁决，但保留 U。
3. **动态页面**：连接数 API 页、事件订阅 FAQ 的部分内容通过官方检索摘要获得，直接简化抓取失败；字段/文案可能随版本变化。
4. **SDK 版本漂移**：Node main 为 2026-10-16 提交、npm 1.76.0；未来 SDK 可能变化。PoC 必须锁定版本。
5. **无应用状态**：应用类型/租户/权限/订阅/发版/可用范围全部未知；不能把“官方支持”误写成“本应用已开通”。
6. **平台行为未实测**：3 秒、重推、50 连接、集群随机、无补推、卡片 14/30 天窗口均来自文档；真实 PoC 才能升级为 A。
7. **无竞争客户端证明**：在无凭证/无后台条件下不可可靠证明；这是验收的硬边界。

### 13.3 什么会改变结论

- 若真实 PoC 发现 `card.action.trigger` 帧被 SDK 丢弃（`type=card`），则“新版回调可走长连接”对本 SDK 版本不成立，需要升级/改用支持 card 帧的 SDK 或走 Webhook。
- 若 `GET /open-apis/event/v1/connection` 返回的 `online_instance_cnt` 与已知客户端数不一致，优先怀疑竞争客户端/旧部署。
- 若控制台保存长连接订阅方式失败，通常是本地客户端未在线或应用类型不支持 [S1][S2]。
- 若真实回调超时后仍收到第二次请求，则与“回调无补推”文档冲突，需要重新核对订阅方式（是否同时配置了旧版/历史地址）[S4][S5]。

## 14. 来源清单（精确链接）

> 访问时间均为 2026-11-08。官方页面可能动态渲染；标注“摘要”的条目表示直接简化抓取失败，使用官方站内检索摘要核对。

| # | 来源 | URL | 用途 |
|---|---|---|---|
| S1 | 使用长连接接收事件 | https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case | 长连接限制、3 秒、50 连接、集群随机、配置步骤 |
| S2 | 使用长连接接收回调 | https://open.feishu.cn/document/event-subscription-guide/callback-subscription/step-1-choose-a-subscription-mode/configure-callback-request-address | 新版回调长连接示例、旧版不支持、3 秒、配置步骤 |
| S3 | 卡片回传交互回调（`card.action.trigger`） | https://open.feishu.cn/document/feishu-cards/card-callback-communication | 回调结构、响应结构、Toast 枚举、错误码 |
| S4 | 处理卡片回调 | https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/handle-card-callbacks | 3 秒、200/3xx、`{}`/Toast、30/14 天、延时 token、双请求 |
| S5 | 回调概述 | https://open.feishu.cn/document/event-subscription-guide/callback-subscription/callback-overview | 回调同步、无补推；事件异步、会重推 |
| S6 | 事件概述 | https://open.feishu.cn/document/server-docs/event-subscription-guide/overview | 3 秒、15s/5m/1h/6h 重推、至少一次、event_id |
| S7 | 接收消息 `im.message.receive_v1` | https://open.feishu.cn/document/server-docs/im-v1/message/events/receive | 事件键、权限键、`message_id` 去重、事件体 |
| S8 | 机器人进群 | https://open.feishu.cn/document/server-docs/group/chat-member/event/added-2 | `im.chat.member.bot.added_v1`、权限三选一 |
| S9 | 机器人被移出群 | https://open.feishu.cn/document/server-docs/group/chat-member/event/deleted | `im.chat.member.bot.deleted_v1`、权限三选一 |
| S10 | 步骤二：添加事件 | https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/subscription-event-case | 控制台添加事件、开通权限、发版 |
| S11 | 步骤二：添加回调 | https://open.feishu.cn/document/event-subscription-guide/callback-subscription/add-callback | 控制台添加回调、发版 |
| S12 | larksuite/node-sdk README（main） | https://github.com/larksuite/node-sdk/blob/main/README.md | 旧说法“only event subscriptions...does not support callback subscriptions”；中文同文件 `README.zh.md` |
| S13 | larksuite/node-sdk `ws-client/index.ts`（main，commit `b188be60134d409b61259546bcf69c731d2b0b7c`） | https://github.com/larksuite/node-sdk/blob/main/ws-client/index.ts | 握手端点、AppID 正则、事件/回调分发、响应 `code/data`、重连状态 |
| S14 | larksuite/node-sdk `ws-client/ws-config.ts` / `connection-config.ts` | https://github.com/larksuite/node-sdk/blob/main/ws-client/ws-config.ts ；https://github.com/larksuite/node-sdk/blob/main/ws-client/connection-config.ts | 默认 `pingInterval=120s`、`reconnectInterval=120s`、`reconnectCount=-1`、`reconnectNonce=30s`、`autoReconnect=true`、`/callback/ws/endpoint` |
| S15 | larksuite/oapi-sdk-go `ws/client_message.go`（`db9f52d0a88e3f5e4ed81bb34d71a28e3f5608fa`） | https://github.com/larksuite/oapi-sdk-go/blob/v3_main/ws/client_message.go | WS 仅处理 `MessageTypeEvent`；`code 200/500`；`data` marshal |
| S16 | 飞书开放平台 Get WebSocket Connection Count / API 列表 | https://open.feishu.cn/document/server-docs/event-v1/connection/get ；https://open.feishu.cn/document/server-docs/api-call-guide/server-api-list | `GET /open-apis/event/v1/connection`、`online_instance_cnt`、`tenant_access_token`、无 scope；页面动态渲染，字段为 B/U |
| S17 | 事件订阅常见问题 | https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/faq | 事件日志 `SUCCESS`、`retry cnt > 1`、3 秒重推 |
| S18 | 事件订阅常见问题（长连接，官方摘要） | https://open.feishu.cn/document/event-subscription-guide/event-card-faq | 多客户端导致 500、console 不支持查看连接数；摘要获取，B/U |
| S19 | larksuite/node-sdk `package.json`（main） | https://github.com/larksuite/node-sdk/blob/main/package.json | 当前版本 `1.76.0` |
| S20 | 官方 Node SDK 长连接回调示例（`@larksuiteoapi/node-sdk@1.36.0`） | https://open.feishu.cn/document/event-subscription-guide/callback-subscription/step-1-choose-a-subscription-mode/configure-callback-request-address | 版本门槛与 `card.action.trigger` 注册示例 |
| S21 | larksuite/node-sdk `typings/card.ts`（main） | https://github.com/larksuite/node-sdk/blob/main/typings/card.ts | 旧 `InteractiveCardActionEvent.action.value` 类型为 `Record<string, any>` |
| S22 | larksuite/node-sdk `channel/channel.ts`（main） | https://github.com/larksuite/node-sdk/blob/main/channel/channel.ts | 高层 `Channel` 使用 `WSClient` 并注册 `card.action.trigger` |

---

## 15. 给验收负责人的一句话

**官方层面（B）已经可以确认：新版 `card.action.trigger` 支持长连接，旧版 `_v1` 不支持；中性提示用 `toast.type=info`；事件 3 秒超时会重推 4 次，回调 3 秒超时不会补推；SDK README 的“不支持回调”是旧说明。**  
**本应用（A）仍未验证：无 Secret、无真实连接、无后台核对；且在没有凭证/后台只读权限的条件下，无法可靠发现静默的竞争长连接客户端。**  
