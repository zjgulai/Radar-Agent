# 飞书 Node SDK 1.76.0 只收 WSClient PoC：API 与行为核验

- 日期：2026-11-08
- 对象：`@larksuiteoapi/node-sdk@1.76.0`（npm 官方包，非 GitHub main）
- 方法：只读检查 npm tarball 内的 `lib/index.js`、`es/index.js`、`types/index.d.ts`、`package.json`、`README.md`；对照飞书开放平台官方文档。未执行 SDK 代码、未安装依赖、未建立 WebSocket、未使用任何凭证、未读取 transcript/memory/CLI profile。
- 本地制品目录（repo 外）：`/tmp/feishu-sdk-1760.VkCZxh/extracted/package`
- 已安装对照：`/Users/lute/Project/Radar-Agent/tools/feishu-poc/node_modules/@larksuiteoapi/node-sdk`。其 `lib/index.js` 与本报告的 tarball 解压件 SHA-256 完全一致（`4e816e0ff140cd33d931105b3198ae7685cc40b44bfd1fa8da158308246d5491`），因此下文行号同时适用于已安装包。
- 限制：源码阅读不能证明飞书服务端实际下发的帧类型，也不能证明卡片回调在真实租户配置下可用；带 `C` 的条目是实现建议或推断，不是平台承诺。

> **仅机器复核 / machine-review only.** `human_gold_claim_count=0` 本报告由 Agent 基于只读源码与官方文档生成，不是人工复核、安全审计、生产批准或飞书平台行为保证。任何上线判断仍需人工复核与真实环境验证。

证据等级：

- **B**：官方规则或一手事实。来源为锁定版本的 npm 制品（含 shasum/integrity 校验）或飞书开放平台官方文档，附文件/行号或官方 URL。
- **C**：建议、推断或非官方旁证。不得当作平台合同、安全批准或兼容性保证。

## 0. 结论先行（实现相关）

1. **`await wsClient.start({ eventDispatcher })` 不代表连接成功。** `start()` 校验参数后只调用 `this.reConnect(true)`，没有 `await`；Promise 很快 resolve，网络连接在后台继续（B：`lib/index.js:103037-103067`）。
2. **`start()` 的失败大多是静默的。** appId 不匹配硬编码正则、缺 `eventDispatcher` 都只打日志后 `return`；网络失败不会让 `start()` reject，可重试错误会无限/按服务端次数重试（B）。
3. **真正的就绪信号是 `onReady` 回调或 `getConnectionStatus().state === 'connected'`。** 没有返回连接 Promise 的 API，也没有 EventEmitter 风格的 ready 事件（B：`lib/index.js:102668-102672`、`102982-103001`、`102733`）。
4. **WS 只派发 header `type === "event"` 的数据帧。** `MessageType.card` 虽已定义（`lib/index.js:102326-102332`），但 1.76.0 没有消费路径；`card` 帧在 `handleEventData` 入口直接 `return`，既不调用 handler 也不回 ACK（B：`lib/index.js:102911-102922`）。
5. **事件 ACK 固定为 `{code:200}`；handler 返回 truthy 值时追加 `data = base64(JSON.stringify(result))`；handler 抛错则 `{code:500}`。** 随后回写同帧并追加 `biz_rt` header，值为 `startTime - endTime`（源码如此，通常为负）（B：`lib/index.js:102944-102959`）。
6. **卡片回调的官方响应体是 `{toast?, card?}`。** 若 `card.action.trigger` 确实走到 EventDispatcher，其返回值会按上述事件 ACK 路径编码；但 1.76.0 是否能收到该回调取决于服务端帧类型，源码阅读无法单独证明（B 官方响应结构；C 帧类型推断）。协调方另行完成的官方回调研究报告支持新版回调且空 `{}` ack 可接受；本报告不重复该研究，仅保留 SDK 源码帧分流事实。
7. **`EventDispatcher` 会把 v2 的 `header` 与 `event` 扁平合并。** handler 收到的不是原始 `{header,event}`，而是 `{schema, ...header字段, ...event字段}`；`event.token` 会覆盖 `header.token`（B：`lib/index.js:100862-100884`）。
8. **关闭只有 `close({force?})`，没有 `stop()`。** 它同步清理 ping/reconnect/liveness/data-cache 定时器并 detach socket；但无法中断已经发出的 endpoint discovery HTTP 请求或尚未 open 的握手，需靠 `handshakeTimeoutMs` 兜底（B：`lib/index.js:103007-103035`、`102626-102679`）。
9. **SDK 不强制 WSS。** discovery 返回的 URL 被原样交给 `new WebSocket(url)`；`buildConnectionUrl` 只保留原 `ws/wss` scheme，不校验。官方文档要求传输加密并使用 wss，默认 HTTPS domain 应保持（B 源码；B 官方文档规则；C 建议）。
10. **默认日志存在敏感信息泄漏面。** `Client.request` 失败时记录原始 AxiosError；生成的 API 方法记录 `formatErrors(e)`，其中包含 `config.data` 与 `response.data`。只用 `WSClient` 的只收 PoC 不经过 `Client`，其 discovery 失败日志只取 `e.message`；但 debug 级别会打印完整事件 payload 与含 `device_id/service_id` 的 WS URL（B：`lib/index.js:335-366`、`100797-100810`、`102613`、`102943`；C 建议）。

## 1. 制品、完整性与包元数据

**B / SRC-NSDK-1760**

- Tarball：`https://registry.npmjs.org/@larksuiteoapi/node-sdk/-/node-sdk-1.76.0.tgz`
- Registry `dist.shasum`：`cb7329170c6aa8630c922fbe11359c3895caeea1`
- 下载后本地 `shasum -a 1` 与上述一致。
- Registry `dist.integrity`：`sha512-v/bxQNCugwAmMPbZtBGJtSu8hdQLiB1/29Jr+GBIG18DyQ4LYyp7gxQ74pkhXVSuoUeH4v+/ZHAw/SW+KMrj2g==`；下载后本地 openssl SHA-512/base64 与 payload 一致。
- 已安装包 `lib/index.js` 与 tarball 解压件 SHA-256 一致：`4e816e0ff140cd33d931105b3198ae7685cc40b44bfd1fa8da158308246d5491`。
- `fileCount: 7`，`unpackedSize: 30259126`；包内仅：
  - `package/LICENSE`
  - `package/lib/index.js`（CJS 主入口，107447 行）
  - `package/es/index.js`（ESM，107395 行，关键逻辑与 CJS 同构，例如 `es/index.js:102902` 同样是 `type !== MessageType.event` 提前返回）
  - `package/types/index.d.ts`（322678 行，单一合并声明文件）
  - `package/package.json`
  - `package/README.md`、`package/README.zh.md`
- `package.json`：`main: ./lib/index.js`、`module: ./es/index.js`、`types: ./types`；`engines` 为 `null`（未声明 Node 版本约束）。
- 运行时依赖：`axios ^1.16.0`、`ws ^8.19.0`、`protobufjs ^7.2.6`、`qs ^6.14.2`、`lodash.merge ^4.6.2`、`lodash.pickby ^4.6.0`、`lodash.identity ^3.0.0`。
- `scripts` 只有 `test`、`build`、`test:watch`；没有 `preinstall`/`install`/`postinstall`/`prepare` 生命周期脚本（只做了 tarball 静态检查，未运行 npm）。
- 注意：tarball 没有 `docs/` 目录，但 `README.md:620` 引用 `./docs/channel.md`；这是打包内容与 README 的偏差，不影响本报告结论。

## 2. `WSClient` 构造器（精确选项与默认值）

**B / SRC-NSDK-1760；locator：`lib/index.js:102390-102453`；类型声明 `types/index.d.ts:321621-321670`。**

构造器参数解构原文（`lib/index.js:102422`）：

```js
const {
  appId, appSecret, clientAssertionProvider, agent,
  domain = Domain.Feishu, httpInstance = defaultHttpInstance,
  loggerLevel = LoggerLevel.info, logger = defaultLogger,
  autoReconnect = true, source, extraUaTags,
  onReady, onError, onReconnecting, onReconnected,
  handshakeTimeoutMs, wsConfig: userWsConfig,
} = params;
```

| 选项 | 类型/默认 | 实际行为 |
|---|---|---|
| `appId` | `string`，必填 | 构造时 `assert(!appId, () => logger.error('appId is needed'))`；`assert` 只在条件为真时执行回调，**不抛错**（`lib/index.js:313-319`、`102428`）。真正的硬门在 `start()`。 |
| `appSecret` | `string?` | 与 `clientAssertionProvider` 二选一；两者都空时抛 `ClientAssertionError`，code `7104`（`102430-102433`）。 |
| `clientAssertionProvider` | provider? | 设置后 discovery body 使用 `ClientAssertion` 而非 `AppSecret`（`102567-102582`）。 |
| `domain` | `Domain.Feishu` 默认 | `formatDomain`：`Domain.Feishu → https://open.feishu.cn`，`Domain.Lark → https://open.larksuite.com`，其他字符串原样使用（`102289-102297`）。字符串若缺 scheme，后续 URL 会缺 scheme；建议传枚举或完整 HTTPS URL。 |
| `logger` | `defaultLogger` | 需实现 `error/warn/info/debug/trace` 五个方法。 |
| `loggerLevel` | `LoggerLevel.info`（3） | **WSClient 对显式 `fatal=0` 不再二次兜底**，会传给 LoggerProxy；EventDispatcher/Client/CardActionHandler 则使用 `params.loggerLevel || info`，`0` 会被当成假值变成 info（见 §8）。 |
| `httpInstance` | `defaultHttpInstance` | 默认是 axios 实例，response 拦截器返回 `resp.data`；`pullConnectConfig` 直接解构 `{code,data,msg}`。自定义实例必须保持该契约（`185-198`、`102584`）。 |
| `autoReconnect` | `true` | 写入 `wsConfig`；断线后自动重连（`102436-102438`）。 |
| `agent` | `any?` | 原样作为 `new WebSocket(url, { agent })` 的传输 agent（`102630-102635`）。 |
| `connectionHost` | `string?` | 只替换 WS URL 的 `host[:port]`，保留 scheme/path/query；空值、含 `/` 或 `?` 抛 `ConnectionConfigError`（`102349-102355`）。 |
| `connectionHeaders` | `Record<string,string>?` | 握手专用头；构造时复制。`Host`、`Connection`、`Upgrade`、`Sec-WebSocket-*` 抛 `ConnectionConfigError`；其余头不做格式校验（`102357-102367`）。不会转发给 endpoint discovery。 |
| `source` | `string?` | 追加到 User-Agent，格式 `source/<name>`。 |
| `extraUaTags` | `string[]?` | 内部用，追加裸 token。 |
| `onReady` | `() => void` | 首次握手成功后调用（start 成功路径每次都调用；重连循环中仅当从未连过才调用）。 |
| `onError` | `(err: Error) => void` | 仅在不可重试的初始失败、`autoReconnect=false` 的初始失败、重连次数耗尽/不可重试时调用。 |
| `onReconnecting` | `() => void` | 进入自动重连循环且曾经连过时调用。 |
| `onReconnected` | `() => void` | 自动重连成功且曾经连过时调用。 |
| `handshakeTimeoutMs` | `number?`，未设置=无超时 | 为 WS `open`/`error` 加客户端超时；超时后 detach+terminate，按可重试失败处理（`102657-102667`）。 |
| `wsConfig` | `{ pingTimeout?: number }` | 仅客户端 liveness 看门狗，单位秒；未设置=关闭（`321611-321620`、`102451`）。服务端下发的 ping/reconnect 参数不由此覆盖。 |

构造器不会发起网络请求；它会创建 `DataCache`，其中 `setInterval(..., 10000)` 已 `.unref()`（`102266-102286`）。`connectionHost`/`connectionHeaders` 的基本校验在构造期完成，非法值在联网前抛错。

### 2.1 每客户端 `httpInstance`、timeout 与默认日志

**B / SRC-NSDK-1760；locator：`lib/index.js:185-198`、`102553-102623`。**

- `httpInstance` 是**每个 `WSClient` 实例自己的选项**；不传时共享模块级 `defaultHttpInstance`（`axios.create()`，`185`）。传自定义实例即可隔离默认值与拦截器。
- 该实例只用于 endpoint discovery，不用于 WS 帧收发。`pullConnectConfig` 每次请求显式传 `timeout: 15000`（`102584-102590`），会覆盖实例默认 timeout，只针对这一次 discovery；WS 握手超时另由 `handshakeTimeoutMs` 控制，两者独立。
- 默认 `defaultHttpInstance` 只做两件事：请求头缺 `User-Agent` 时补 fallback UA；响应拦截器返回 `resp.data`（`190-198`）。**没有请求/响应 body 的日志拦截器**。
- 自定义 `httpInstance` 必须继续返回 `resp.data`（或至少让 `pullConnectConfig` 能解构 `{code,data,msg}`）；否则 discovery 会静默进入可重试失败（C）。
- **不要给 `httpInstance` 加会打印 `config.data` 的请求日志拦截器**：discovery body 含 `AppSecret`（`102565-102583`）。让 SDK 自己只记 `e.message` 更安全（`102616-102623`）。
- 推荐：PoC 传一个专用 axios 实例，设置 `timeout: 15000`、不挂日志拦截器；或者直接使用默认实例但把 logger 保持在 info 以上（C）。

## 3. `start()` 的 Promise 语义、吞错与日志误导

**B / SRC-NSDK-1760；locator：`lib/index.js:103037-103067`；类型 `types/index.d.ts:321810-321815`。**

原文关键段：

```js
async start(params) {
  const { appId } = this.wsConfig.getClient();
  if (!/^cli_[0-9a-fA-F]{16}$/.test(appId)) {
    this.logger.error('[ws]', `invalid appId: ${appId}`);
    return;
  }
  const { eventDispatcher } = params;
  if (!eventDispatcher) {
    this.logger.warn('[ws]', 'client need to start with a eventDispatcher');
    return;
  }
  // reset terminalError/closed/currentReconnectAttempts, re-arm dataCache sweep
  this.logger.info('[ws]', `receive events or callbacks ...`);
  this.eventDispatcher = eventDispatcher;
  this.reConnect(true);      // 注意：没有 await
}
```

精确事实：

1. **appId 硬门**：必须匹配 `/^cli_[0-9a-fA-F]{16}$/`，即 `cli_` + 恰好 16 位十六进制字符（大小写均可）。不匹配时只 `logger.error` 并返回，`start()` resolve `undefined`，不抛错、不触发 `onError`（B：`103039-103043`）。飞书官方文档没有公开这个正则；若真实 appId 含 `g-z` 或长度不同，1.76.0 会静默不连接。PoC 必须先做此预检（C）。
2. **`eventDispatcher` 必填**：缺失时只 `logger.warn` 并返回（B：`103045-103048`）。类型层面要求 `EventDispatcher`；`CardActionHandler` 不满足 `EventDispatcher` 类型（`321810-321815`）。
3. **`start()` 不是连接等待**：它调用 `this.reConnect(true)` 但不 `await`。`reConnect` 是 async 函数，会在第一个 `await`（`pullConnectConfig`）前同步执行到发起 HTTP 请求；`start()` 在该调用后立即结束。因此 `await start()` 只表示“已开始尝试”，不表示“已连接”（B）。
4. **网络/连接失败不会让 `start()` reject**：`reConnect(true)` 的失败路径全部内部处理；可重试错误会进入自动重连循环。`start()` 的 Promise 没有 reject 分支（B）。
5. **`onReady` 不是 `start()` 的 resolve 信号**：见 §4。
6. **误导性日志**：在初次尝试可重试失败时，代码走 `this.logger.error('[ws]','connect failed'); yield this.reConnect();`，随后仍执行 `this.logger.info('[ws]','ws client ready')`（`102744-102748`）。因此默认 info 级别下看到 “ws client ready” 不能证明已经连上（B）。
7. **回调异常吞掉**：`safeInvoke` 捕获 `onReady/onError/onReconnecting/onReconnected` 的同步异常，只 `logger.error('[ws] ${label} callback threw', e)`，不让状态机崩溃；它不 await 回调返回值，async 回调的 rejection 不会被捕获（B：`102543-102551`）。PoC 的回调应自行 catch（C）。
8. **`start()` 可在 `close()` 后再次调用**：会清 `closed/terminalError/currentReconnectAttempts`，重新 arm dataCache sweep，再 `reConnect(true)`；但 `hasEverConnected` 不清零（B：`103050-103066`、`103007-103035`）。

**C 建议**：把 `start()` 只当作“提交启动”；另设就绪超时（例如 15–30s）等待 `onReady` 或轮询 `getConnectionStatus()`。同时设置 `handshakeTimeoutMs`（例如 10000–15000），否则 stuck DNS/代理/NAT 可能让握手无限挂起（类型注释 `321661-321666` 明确说明）。

## 4. 真实连接就绪信号

**B / SRC-NSDK-1760；locator：`lib/index.js:102626-102679`、`102680-102826`、`102982-103001`、`102733`、`102791`、`102795`。**

- `connect()` 返回 `Promise<boolean>`：在 `ws` 的 `'open'` 事件中 `setWSInstance`、启动 `pingLoop()`、`resolve(true)`；`'error'` 事件 `resolve(false)`；可选 handshake timer 超时后 detach+terminate+`resolve(false)`（`102643-102678`）。
- `reConnect(isStart=true)` 在 `connect()` true 后调用 `communicate()` 挂 `message/error/close` 监听，然后走成功分支：
  - `this.hasEverConnected = true; this.safeInvoke('onReady', this.onReady);`（`102731-102734`）
  - 然后 `logger.info('[ws]','ws client ready')`（`102748`）。
- 自动重连循环成功时：若 `hasEverConnected` 为 true → `onReconnected`；否则 `hasEverConnected = true` 并 `onReady`（`102787-102796`）。
- `getConnectionStatus()` 返回 `{state,lastConnectTime,nextConnectTime,reconnectAttempts}`；`computeState()` 顺序：
  1. `terminalError` → `'failed'`
  2. `isConnecting && !hasEverConnected` → `'connecting'`
  3. `isConnecting && hasEverConnected` → `'reconnecting'`
  4. WS instance `readyState === OPEN` → `'connected'`
  5. 否则 `'idle'`
  （`102982-103001`）
- `getConnectionStatus().state === 'connected'` 可能在 `onReady` 之前的一瞬成立，因为 `setWSInstance` 在 `'open'` 回调里先执行、`onReady` 在 `connect()` resolve 后执行。只收 PoC 用 `onReady` 最稳（B 源码顺序；C 建议）。
- **没有** `wsClient.connect()`、`ready` Promise 或 EventEmitter。`start()` 是唯一启动入口，`onReady`/`onReconnected` 是回调式信号（B）。
- `onReady` 并非严格“一生一次”：每次 `start()` 的初始成功都会调用；初次失败后进入重连循环并首次成功也会调用。若依赖“只触发一次”，需自行加布尔锁（B 源码；C 建议）。

### 4.1 `getWSInstance` 与公开访问面（协调方问题）

**B / SRC-NSDK-1760；locator：`lib/index.js:102162-102210`、`102390-102453`、`102974-103001`、`107426`；类型 `types/index.d.ts:321689-321815`。**

- `getWSInstance()` **不是导出的公共 API**。它只是内部 `WSConfig` 类的一个方法（`lib/index.js:102205-102207`）；`WSConfig` 本身没有出现在模块导出列表里（模块只导出 `WSClient`，`107426`），也没有 `exports.WSConfig`。
- `WSClient` 的 `wsConfig` 在 typings 中是 `private wsConfig`（`types/index.d.ts:321690`），所以 TypeScript 层面不能访问 `client.wsConfig.getWSInstance()`。运行时 JS 可以通过 `(client as any).wsConfig.getWSInstance()` 拿到 `ws` 实例，但这是私有实现，不是稳定契约（C：不要依赖；升级可能破坏）。
- 公开的 WS 状态访问器只有：
  - `getConnectionStatus(): WSConnectionStatus`（`102982-102989`）
  - `getReconnectInfo(): { lastConnectTime; nextConnectTime }`（`102974-102976`）
  - `close({force?})`、`start({eventDispatcher})`
- `LarkChannel` 只暴露 `getConnectionStatus()` 委托给内部 `rawWsClient`（`107017-107019`），也不暴露 `getWSInstance`。
- **没有 ready 事件**：SDK 不继承 EventEmitter，`WSClient` 没有 `on('ready')`。就绪只能通过构造器 `onReady` 回调或轮询 `getConnectionStatus()`；日志字符串不是 API。
- 常见的私有 logger 字符串（不是结构化事件，不要作为就绪判定）：
  - `'[ws]' 'ws connect success'`（debug，`102669`）
  - `'[ws]' 'ws client ready'`（info，**可重试失败后也会打印**，`102748`）
  - `'[ws]' 'reconnect'`（info，`102760`）
  - `'[ws]' 'client closed'`（debug，`102874`）
  - `'[ws]' 'ws client closed manually'`（info，`103035`）
  - `'[ws]' 'repeat connection'`（debug，`102684`）
  - `'[ws]' 'ws connect failed'`（error，`102675`）
  - `'[ws]' 'ws error'`（error，`102871`）
- 如果 runtime 需要原始 socket（例如自己挂 `'message'` 监听），只能走上面的私有访问；更稳妥的是用 `getConnectionStatus()` + SDK 已有 handler，或在 PoC 中用独立 `ws` 连接做对照（C）。

## 5. 重连行为

**B / SRC-NSDK-1760；locator：`lib/index.js:102680-102826`、`102847-102877`、`102162-102180`。**

默认 `WSConfig`（在服务端 discovery 覆盖前）：`pingInterval 120s`、`reconnectCount -1`（无限）、`reconnectInterval 120s`、`reconnectNonce 30s`、`autoReconnect true`（`102169-102178`）。服务端 discovery 返回的 `ClientConfig` 以**秒**为单位，SDK 乘 1000 转毫秒（`102608-102611`）；pong 也会更新这四个值（`102900-102906`）。

触发与流程：

- socket `'close'` → `clearLiveness(); this.reConnect()`（`102873-102877`）。`'error'` 只记日志，不直接重连；`'close'` 才是重连入口（`102870-102872`）。
- `reConnect()` 非 start 路径：若 `isConnecting` 为 true，debug `'repeat connection'` 后返回；否则置 `isConnecting=true`，递增 `reconnectGeneration`，清 ping/reconnect timer，terminate 旧实例并置空。
- `autoReconnect === false`：
  - 若从未连接：`terminalError=true`，`onError(new Error('WebSocket connect failed and autoReconnect is disabled'))`，返回（`102753-102756`）。
  - 若曾经连接：**静默返回**，且没有把 `isConnecting` 复位；`computeState()` 会一直显示 `'reconnecting'`（B 源码事实；这是可观察的状态机缺陷）。
- `autoReconnect === true`：
  - 记 info `'reconnect'`；若 `hasEverConnected`，调用 `onReconnecting`。
  - 首次重试延迟 `reconnectNonce * Math.random()` 毫秒（默认 0–30s），赋值给 `this.reconnectInterval`；随后 `loopReConnect(count)` 从 `count=0` 开始，进入后 `count++`。
  - 每次尝试重新 `pullConnectConfig()` + `connect()`；成功则 `currentReconnectAttempts=0`，`onReconnected` 或首次 `onReady`。
  - 失败且 `retryable`：若 `reconnectCount >= 0 && count >= reconnectCount` → `terminalError=true`、`onError(new Error('WebSocket reconnect exhausted after ${count} attempts'))`；否则 `setTimeout(loopReConnect, reconnectInterval)`。
  - 不可重试错误（如认证失败/配置错误）→ `terminalError=true`、`onError(new Error(result.error))`，不再重试。
- `reconnectInfo.lastConnectTime` 在每次 `tryConnect()` 开始时更新；`nextConnectTime` 只在首次 nonce 延迟与后续 interval 调度时更新（`102689-102691`、`102819`）。
- `pingLoop()` 每 `pingInterval` 发 control ping；`armLiveness()` 在 `pingTimeout` 设置时启动看门狗，超时 `terminate()` 触发重连；任何入站帧 `clearLiveness()`（`102827-102845`、`102467-102492`）。
- 服务器 control `ping` 帧被 `return` 忽略；只有 `pong` 会解析并更新配置（`102879-102908`）。

**C 建议**：PoC 若要求“断线可见”，同时监听 `onReconnecting`/`onReconnected`，并记录 `getConnectionStatus()` 的 `reconnectAttempts`；不要只依赖 `onError`，它在可重试失败时不会触发。若必须快速失败，显式设置 `autoReconnect:false`，但注意上面的状态卡死缺陷。

## 6. `close()` / 停止选项与定时器清理

**B / SRC-NSDK-1760；locator：`lib/index.js:103007-103035`；类型 `types/index.d.ts:321810-321812`。**

- **没有 `stop()`。** 只有 `close(params?: { force?: boolean }): void`。`LarkChannel` 上的 `disconnect()` 是高层封装，不是 `WSClient` API（`106994-107008`）。
- `close()` 是同步、幂等的；重复调用无副作用。清理动作：
  - `closed = true`；`reconnectGeneration++`（使所有旧重连循环失效）。
  - `clearTimeout(pingInterval)`、`clearTimeout(reconnectInterval)` 并置 undefined。
  - `clearLiveness()` 清 pong 看门狗。
  - `dataCache.destroy()`：清 10s fragment sweep interval 并清空缓存（`102291-102298`）。
  - `isConnecting = false`、`currentReconnectAttempts = 0`。
  - 若存在 WS 实例：`detachSocket` 移除全部监听并保留一个 `'error'` sink，然后 `force ? terminate() : close()`，最后置空实例。
  - 记 info `'ws client closed manually'`（force 时带 ` (force)`）。

### 6.1 定时器清单（协调方问题）

| 定时器 | 字段/位置 | 类型 | 是否 unref | `close()` 是否清理 |
|---|---|---|---|---|
| fragment sweep | `DataCache.timer`，`102277-102286` | `setInterval` 10s | 是（`timer.unref()`） | 是，`dataCache.destroy()` |
| ping loop | `WSClient.pingInterval`，`102845` | `setTimeout`，每 `pingInterval` 重排 | 否 | 是，`clearTimeout` |
| reconnect delay/loop | `WSClient.reconnectInterval`，`102818` | `setTimeout`，nonce 或 interval | 否 | 是，`clearTimeout` |
| pong/liveness watchdog | `WSClient.livenessTimer`，`102472-102480` | `setTimeout`，`pingTimeout` 秒 | 否 | 是，`clearLiveness()` |
| handshake timeout | `connect()` 局部 `timer`，`102658-102667` | `setTimeout`，`handshakeTimeoutMs` | 否 | **否**（`close()` 不持有该 timer；它在 open/error/timeout 时自行清理） |

- `close()` 后再次 `start()` 会重新 arm dataCache sweep 并清 `closed`；旧 generation 的循环不会复活（B：`103050-103066`）。
- **未覆盖的在途操作**：
  - endpoint discovery 的 HTTP 请求有 `timeout: 15000`，`close()` 无法取消它；若 `close()` 在 discovery 期间发生，`tryConnect` 仍会在 discovery 返回后调用 `connect()`，直到尝试结束才检查 `closed` 并 `discardConnection()`（`102689-102696`、`102712-102724`）。
  - `connect()` 在 `'open'` 前不会把 socket 登记到 `wsConfig`，因此 `close()` 看不到这个在途 socket，无法 terminate；若 `handshakeTimeoutMs` 未设置，stuck 握手可能一直挂到 OS/ws 自己放弃。设置 `handshakeTimeoutMs` 可让 `connect()` 的本地 timer 在超时后 detach+terminate（`102629-102667`）。
- **进程退出**：dataCache sweep 已 `.unref()`；但 ping timer、reconnect timer、liveness timer 都没有 `.unref()`，必须 `close()` 才会清掉。只收 PoC 在 `SIGINT/SIGTERM`/`finally` 中调用 `close()`（C）。

## 7. `EventDispatcher`：register / invoke / payload / header

**B / SRC-NSDK-1760；locator：`lib/index.js:100975-101095`、`100852-100920`；类型 `types/index.d.ts:321356-321399`。**

### 7.1 构造器

```ts
new EventDispatcher({
  verificationToken?: string;
  encryptKey?: string;
  cache?: Cache;
  logger?: Logger;
  loggerLevel?: LoggerLevel;
  webhookCredentialsProvider?: () => WebhookCredentials | Promise<WebhookCredentials>;
})
```

- 构造时创建静态 `RequestHandle`；`webhookCredentialsProvider` 在构造期不会被调用（`100984-101004`；README `816-836`）。
- **默认注册内置 `app_ticket` handler**（`101006-101024`）。只收 PoC 若不处理 ISV app_ticket，可保留；`unregister('app_ticket')` 会 warn 并停止缓存 app ticket（`101045-101067`）。
- 构造完成记 info `'event-dispatch is ready'`（`101007`）。
- 无 `encryptKey`/`verificationToken` 时，`checkIsEventValidated` 返回 true；有 `verificationToken` 时，v2 校验 `header.token`，v1 校验顶层 `token`，用 timingSafeEqual（`100920-100958`）。
- **WS 路径传 `needCheck:false`，因此完全跳过验签/解密/动态凭证 provider**（B：`102949`；README `835-836` 明确 “Trusted WebSocket dispatch (needCheck: false) does not call the provider”）。

### 7.2 `register` / `unregister`

- `register(handles: IHandles & T): this`：参数是**对象映射**，key 是事件类型字符串，value 是 handler；返回 this，可链式。
- 同 key 重复注册会 `logger.warn(duplicateHandleWarning(key))` 并**替换**旧 handler；`app_ticket` 除外（不 warn，但仍替换）（`101033-101042`）。
- `unregister(...keys): this`：删除存在的 handler；不存在只 debug；删 `app_ticket` 会 warn（`101045-101067`）。
- handler 类型：`(data) => Promise<any> | any`，单参数。
- `card.action.trigger` 不在生成的 `IHandles` 键列表中；运行时可以注册，TypeScript 需依赖 `register<T>` 的泛型扩展或显式断言。Node SDK issue #128/#98 的维护者回复称 codegen 未生成该键但不影响使用（C 非官方旁证）。

### 7.3 `invoke` 与 payload 形状

```ts
invoke(data: any, params?: { needCheck?: boolean }): Promise<any>
```

- `needCheck = params?.needCheck !== false`；默认 true。WSClient 传 false（`101069-101074`、`102949`）。
- `invokeWithHandle`：
  1. 若需要校验且校验失败 → `logger.warn('verification failed event')`，返回 `undefined`。
  2. `targetData = handle.parse(data)`。
  3. `type = targetData[CEventType]`（内部 Symbol，`lib/index.js:226`）。
  4. 有 handler → `await handler(targetData)`，debug `execute ${type} handle`，返回 handler 结果。
  5. 无 handler → `logger.warn('no ${type} handle')`，返回字符串 `` `no ${type} event handle` ``（truthy！）（`101076-101094`）。
- `RequestHandle.parse`（`100862-100885`）：
  - 若 `data.encrypt` 存在，先 AES 解密，再把顶层 `rest` 合并回去；解密失败记 `'parse encrypt data failed'` 并返回 `{}`。
  - v2（`'schema' in targetData`）：
    ```js
    const { header, event } = targetData, rest = __rest(targetData, ["header","event"]);
    return { [CEventType]: header?.event_type, ...rest, ...header, ...event };
    ```
  - v1（无 `schema`）：
    ```js
    const { event } = targetData, rest = __rest(targetData, ["event"]);
    return { [CEventType]: event?.type, ...event, ...rest };
    ```
    注意 v1 的顺序与 v2 相反：先 `event`，再顶层 `rest`，因此**顶层同名字段会覆盖 `event` 内字段**；而派发 key 是在合并前从 `event.type` 取的，所以若顶层也有 `type`，handler 数据里的 `type` 可能与实际派发 key 不一致（B：`100883-100884`）。

#### 7.3.1 对本地 `ENVELOPE {event:{message:{chat_type}}}` 的精确映射

**B / SRC-NSDK-1760；locator：`lib/index.js:100862-100884`、`101069-101094`。**

`EventDispatcher.invoke` 不会把原始 envelope 原样传给 handler；它会先 `parse()` 扁平化。对本地 core 的 envelope，结果如下：

| `invoke(data)` 输入 | 派发 key `targetData[CEventType]` | handler 实际收到 |
|---|---|---|
| `{ event: { message: { chat_type } } }` | `undefined`（`event.type` 不存在） | `{ message: { chat_type }, [CEventType]: undefined }`；没有 `event` 包裹层。若没有注册 `undefined` key，则返回字符串 `no undefined event handle`，handler 不会执行。 |
| `{ event: { type: 'im.message.receive_v1', message: { chat_type } } }` | `'im.message.receive_v1'` | `{ type: 'im.message.receive_v1', message: { chat_type }, [CEventType]: 'im.message.receive_v1' }` |
| `{ type: 'TOP', event: { type: 'im.message.receive_v1', message: { chat_type } } }` | `'im.message.receive_v1'`（合并前取 `event.type`） | `{ type: 'TOP', message: { chat_type }, [CEventType]: 'im.message.receive_v1' }`（v1 顶层 `rest` 最后展开，`type:'TOP'` 覆盖 `event.type`） |
| `{ schema:'2.0', header:{ event_type:'im.message.receive_v1', app_id:'cli_x' }, event:{ message:{ chat_type } } }` | `'im.message.receive_v1'` | `{ schema:'2.0', event_type:'im.message.receive_v1', app_id:'cli_x', message:{ chat_type }, [CEventType]:'im.message.receive_v1' }`（v2 顺序：rest → header → event；event 覆盖 header） |

结论（B）：如果本地 core 只传 `{event:{message:{chat_type}}}`，**没有事件类型 key，`invoke` 不会命中任何 handler**；需要把 `event.type`（v1）或 `header.event_type`（v2）放进输入，或者让本地 core 直接调用已注册 handler。handler 拿到的 `message` 在顶层，不在 `data.event.message`；runtime 归一化时应按 `data.message.chat_type` 读取，或把 envelope 重新包一层再交给期望 `{event:{...}}` 的下游（C）。`CEventType` 是内部 Symbol（`lib/index.js:226`），不会出现在 `JSON.stringify` 结果里，但 handler 对象上存在。

- **header 处理的关键点**：
  - `header` 的字段被扁平到 handler 数据顶层，不会保留 `data.header`。
  - v2 中 `event` 字段最后展开，因此**同名键以 event 为准**。对 `card.action.trigger`：`header.token`（应用 Verification Token）会被 `event.token`（更新卡片用 token，30 分钟/最多 2 次）覆盖；handler 里 `data.token` 是更新 token，不是验签 token（B：`100879-100881`；官方卡片结构见 SRC-FEISHU-CARDCB）。
  - `schema` 会保留在 `rest` 中（v2）；`header.event_type` 只作为 Symbol key 用于派发，同时 `event_type` 也可能通过 `header` 展开出现在数据里。
  - v2 的 `card.action.trigger` 数据形如：`{schema:'2.0', event_id, token: <更新token>, create_time, event_type:'card.action.trigger', tenant_key, app_id, operator:{open_id,...}, action:{value,tag,...}, context:{open_message_id, open_chat_id}, host, ...}`。官方 SDK 的 `RawCardActionEvent` 类型也注明 message/chat id 通常在 `context` 下（`types/index.d.ts:322534-322560`）。
- **handler 抛错会向上传播**：`EventDispatcher.invokeWithHandle` 没有 try/catch；WSClient 的 `handleEventData` 捕获后把 ACK 置 500（见 §9）。这与 `CardActionHandler` 不同：后者内部 catch 并返回 `undefined`（`101164-101190`）。
- **无 handler 的返回值是字符串，不是 `undefined`**：WSClient 会把这个 truthy 字符串 base64 编码进 ACK 的 `data`。如果 PoC 希望空 ACK，注册一个返回 `undefined` 的 no-op handler（C）。

### 7.4 `CardActionHandler` 与 WS 的关系

- `CardActionHandler` 是 webhook 专用：`invoke(data)` 总是调用 `checkIsCardEventValidated(data)`，然后 parse、按 handler map 或 `cardHandler` 派发，异常内部 catch（`101101-101190`）。
- `WSClient.start` 类型只接受 `EventDispatcher`，不接受 `CardActionHandler`（`types/index.d.ts:321810-321815`）。
- Node SDK 的高层 `LarkChannel` 在 WS 路径上把 `card.action.trigger` 注册进 `EventDispatcher`（`107291-107300`），而 `connectWebSocket` 用 `new WSClient(...)` + `start({ eventDispatcher: this.dispatcher })`（`106951-106992`）。这证明 SDK 的**预期路径**是 EventDispatcher；但见 §9 关于 `card` 帧的保留。

## 8. Logger：接口、级别、默认值与陷阱

**B / SRC-NSDK-1760；locator：`types/index.d.ts:27-49`、`lib/index.js:216-224`、`100001-100049`、`100695`、`100983`、`101104`、`102427`。**

接口（五方法，无 `fatal`）：

```ts
interface Logger {
  error: (...msg: any[]) => void | Promise<void>;
  warn:  (...msg: any[]) => void | Promise<void>;
  info:  (...msg: any[]) => void | Promise<void>;
  debug: (...msg: any[]) => void | Promise<void>;
  trace: (...msg: any[]) => void | Promise<void>;
}
```

级别：

| 名称 | 数值 | LoggerProxy 是否输出 |
|---|---:|---|
| `fatal` | 0 | 所有方法都不输出（`level >= X` 全 false）；但 Logger 接口没有 `fatal` 方法 |
| `error` | 1 | error |
| `warn` | 2 | error, warn |
| `info` | 3 | error, warn, info（默认） |
| `debug` | 4 | + debug |
| `trace` | 5 | + trace |

- `LoggerProxy` 方法体是 `if (this.level >= LoggerLevel.X) this.logger.X(msg);`。**注意它把 `msg` 作为单个数组参数传给自定义 logger**，不是展开的可变参数；`defaultLogger` 再把这个数组展开到 `console.*`（`100024-100047`、`100001-100017`）。
- `defaultLogger`：`error` 用 `console.log('[error]:', ...msg)`（stdout，不是 stderr）；`warn` 用 `console.warn`；`info` 用 `console.info`；`debug` 用 `console.debug`；`trace` 用 `console.trace`（会打印调用栈）。没有任何脱敏（B）。
- **`fatal=0` 的不一致**：`EventDispatcher`/`Client`/`CardActionHandler` 使用 `params.loggerLevel || LoggerLevel.info`，显式传 `0` 会被当作假值回到 `info=3`；`WSClient` 用默认参数解构后直接 `new LoggerProxy(loggerLevel, logger)`，显式 `0` 会保留并静默全部日志（B：`100695`、`100983`、`101104`、`102427`）。想静音不要依赖 `LoggerLevel.fatal`；传一个 no-op logger 更可靠（C）。
- `LoggerProxy` 调用自定义 logger 时**不 await、不 catch** 返回的 Promise；async logger 的 rejection 会成为 unhandled rejection（B 源码；C 建议自定义 logger 自己吞掉错误）。

## 9. `card.action.trigger` 与事件 ACK 的精确帧格式

### 9.1 WS 入站帧分流

**B / SRC-NSDK-1760；locator：`lib/index.js:102326-102332`、`102847-102877`、`102911-102960`。**

- pbbp2 `Frame` 解码后按 `method` 分流：`FrameType.control (0)` → `handleControlData`；`FrameType.data (1)` → `handleEventData`（`102856-102861`）。
- `handleEventData` 从 `data.headers` 建 map，取 `message_id/sum/seq/type/trace_id`。
- **硬门**：

  ```js
  if (type !== MessageType.event) {
      return;
  }
  ```

  `MessageType` 定义：`event="event"`、`card="card"`、`ping="ping"`、`pong="pong"`（`lib/index.js:102326-102332`）。`card` 在 1.76.0 **没有任何消费点**；`type === 'card'` 的数据帧在入口直接返回，不派发、不 ACK（`102911-102922`）。
- 多分片事件：`sum > 1` 时按 `message_id` 缓存，`seq` 必须在 `[0,sum)`；合并完成才 `JSON.parse`；缺片/10s 过期丢弃。`sum/seq` 非法会记 `'failed to merge event fragments'` 并丢弃（`102923-102942`；DataCache `102211-102298`）。
- 完整事件 payload 在 debug 级别会连同 `mergedData.data` 明文打进日志（`102943`）。

### 9.2 事件 ACK 帧

**B / SRC-NSDK-1760；locator：`lib/index.js:102944-102972`。**

```js
const respPayload = { code: HttpStatusCode.ok };          // 200
const startTime = Date.now();
try {
  const result = await this.eventDispatcher?.invoke(mergedData, { needCheck: false });
  if (result) {
    respPayload.data = Buffer.from(JSON.stringify(result)).toString("base64");
  }
} catch (error) {
  respPayload.code = HttpStatusCode.internal_server_error; // 500
  this.logger.error('[ws]', `invoke event failed, ...`);
}
const endTime = Date.now();
this.sendMessage({
  ...data,
  headers: [...data.headers, { key: HeaderKey.biz_rt, value: String(startTime - endTime) }],
  payload: new TextEncoder().encode(JSON.stringify(respPayload)),
});
```

精确行为：

- 正常 ACK：`{"code":200}`。
- handler 返回 **truthy** 值：`{"code":200,"data":"<base64(JSON.stringify(result))>"}`。返回 `undefined/null/false/0/''` 时没有 `data`。
- handler 抛错（包括 `JSON.stringify` 抛错，例如循环引用）：`{"code":500}`，无 `data`；错误日志含 `message_type/message_id/trace_id/error`（`102954-102957`）。
- 回写帧复用原 `data` 的 `service/SeqID/LogID/method` 等字段，headers 追加 `biz_rt`，值为 `String(startTime - endTime)`。源码如此，按字面是**负的耗时**；不要依赖该字段做正向延迟统计（B 源码；C 提醒）。
- `sendMessage` 只在 `wsInstance.readyState === WebSocket.OPEN` 时发送；否则静默丢弃 ACK；`send` 回调错误只记 `'send data failed'`（`102962-102972`）。
- **无 handler 时**：`EventDispatcher.invoke` 返回字符串 `no ${type} event handle`（truthy），于是 ACK 变成 `{"code":200,"data":"<base64(JSON.stringify('no X event handle'))>"}`。这不是空 ACK（B：`101091-101093`、`102950-102951`）。

### 9.3 `card.action.trigger` 的返回体

**B 官方文档 / SRC-FEISHU-CARDCB；C 帧类型推断。**

- 官方卡片回调文档的响应结构（新版本）：
  - `toast?`：`{type: 'info'|'success'|'error'|'warning', content?, i18n?}`
  - `card?`：`{type: 'raw'|'template', data: object}`；`raw` 时 `data` 是完整卡片 JSON。官方示例为 `{"toast": {...}, "card": {"type": "raw", "data": {...}}}`。
  - 业务服务器必须在 3 秒内响应；不能使用 HTTP 3xx。
- 如果 `card.action.trigger` 以 `event` 帧到达并由 EventDispatcher 处理，则 handler 返回上述对象时，WS ACK 会是 `{"code":200,"data":"<base64(JSON.stringify({toast?,card?}))>"}`。这与官方 “SDK auto-responds `{"code":200}` within 3s” 的描述不冲突：`code:200` 是 ACK 外层，`data` 承载卡片响应（B 源码 + 官方文档；C 组合推断）。
- **协调方另行完成的官方回调研究**：报告支持新版回调，且空 `{}` ack 可接受。本报告不重复该研究，也不把它当作 1.76.0 WS 帧分流的证明（C：协调方输入，未在本报告复核原文）。
- **关键未决点**：1.76.0 的 `handleEventData` 只接受 `event` 帧。若飞书把卡片回调作为 `card` 帧下发，则：
  - handler 不会被调用；
  - 不会回 ACK；
  - 客户端约 3 秒后报错（外部旁证：Python SDK issue #126 记录 `MessageType.CARD` 被 `return` 丢弃、客户端出现 200340；这是非官方 C 级旁证，不能直接证明 Node 服务端帧类型）。
- 支持“能工作”的旁证：
  - 官方 `card.action.trigger` 参考文档明确说事件通过既有 WebSocket 长连接投递，无需额外 URL（SRC-FEISHU-SKILL，B 官方）。
  - 官方 “步骤三：接收回调” 文档明确说长连接可接收 `card.action.trigger`，并给出 3 秒响应要求（SRC-FEISHU-CALLBACK，B 官方）。
  - Node SDK 自己的 `LarkChannel` 把 `card.action.trigger` 注册到 WS 使用的 EventDispatcher（`107291-107300`），说明作者预期它走 event 派发路径（B 源码）。
- 反向证据：
  - pinned README `570` 仍写 “long connection mode only supports event subscriptions and does not support callback subscriptions”（B 该版本 README 文本）。
  - 1.76.0 没有 `card` 帧处理分支，也没有针对 card 帧的测试；官方仓库 main 的 `ws-client/__tests__` 只有 event 帧测试（C 非锁定版本旁证）。
  - 官方卡片回调文档的 “推送方式” 仍写 Webhook（SRC-FEISHU-CARDCB，B 官方文本），与长连接文档冲突。
- **结论（C）**：源码阅读**不能**证明 1.76.0 的 `card.action.trigger` 在 WS 上可用。只收 PoC 必须把卡片回调视为“条件支持/待实测”：注册 handler 后观察是否收到 `event_type: 'card.action.trigger'`；若没有，优先怀疑 `card` 帧被 §9.1 的硬门丢弃。若 PoC 必须在无实测条件下保证卡片回调，使用官方 webhook 路径（`CardActionHandler` + `adaptDefault/adaptExpress/adaptKoa`），不要依赖 1.76.0 的 WS 卡片回调。

## 10. domain 与安全 WSS 要求

**B 源码 / SRC-NSDK-1760；B 官方文档 / SRC-FEISHU-LONGCONN、SRC-FEISHU-CALLBACK。**

- `Domain.Feishu = 0 → https://open.feishu.cn`；`Domain.Lark = 1 → https://open.larksuite.com`；自定义字符串原样使用（`lib/index.js:211-215`、`289-297`）。
- Endpoint discovery：`POST ${domain}/callback/ws/endpoint`（`WSConfig.wsConfigUrl`，`102200-102201`）。
  - headers：`locale: zh`、`User-Agent: <SDK UA>`（`102560-102564`）。
  - body：`{ AppID, AppSecret }`；ClientAssertion 模式为 `{ AppID, AppSecret:'', ClientAssertion }`，可加 `X-Target-Service`（`102565-102583`）。
  - timeout：`15000` ms（`102584-102590`）。
  - 期望响应：`{ code:0, data:{ URL, ClientConfig:{ PingInterval, ReconnectCount, ReconnectInterval, ReconnectNonce } }, msg }`；`URL` 的 query 中取 `device_id/service_id`；`ClientConfig` 数值单位是秒（`102591-102612`）。
  - 非 0 code：`1 system_busy` 与 `1000040343 internal_error` 可重试；其余（如 `514 auth_failed`、`403 forbidden`、`1000040350 exceed_conn_limit`）不可重试，`onError`（`102591-102601`）。
- WS 连接：`new WebSocket(connectUrl, { agent, headers? })`（`102626-102635`）。
- **SDK 没有校验 `wss:`**：`buildConnectionUrl` 的正则是 `/^(wss?):\/\/([^/?#]+)([^#]*)$/`，保留原 scheme；无 `connectionHost` 时直接返回 endpoint；有 `connectionHost` 时只替换 authority（`102368-102381`）。如果 discovery 返回 `ws://`，SDK 会按明文 WS 连接；如果返回 `wss://`，`ws` 库按 TLS 连接。`connectionHeaders` 只影响 HTTP Upgrade 握手，不改变 scheme；`agent` 可覆盖 TLS 行为（C：自定义 agent 必须自行保证证书校验）。
- 官方规则（B）：
  - 长连接是 WebSocket 全双工通道，服务器需能访问公网（SRC-FEISHU-LONGCONN）。
  - “长连接方式内置了通信通信加密和鉴权的逻辑，事件数据网络上传输时为加密传输”；建连时鉴权，后续推送为明文，无需开发者解密/验签（SRC-FEISHU-LONGCONN、SRC-FEISHU-CALLBACK）。
  - 其他语言 SDK 的成功日志示例为 `connected to wss://xxxxx`（SRC-FEISHU-LONGCONN）。
  - 长连接仅支持企业自建应用；商店应用需 HTTP 推送（SRC-FEISHU-LONGCONN）。
  - 每个应用最多 50 个连接；集群模式随机单个客户端收消息；事件需 3 秒内处理完成且不抛异常，否则超时重推（SRC-FEISHU-LONGCONN）。
- **C 建议**：
  - PoC 使用 `Domain.Feishu`/`Domain.Lark` 或完整 HTTPS URL；不要传裸 `open.feishu.cn`（缺 scheme）。
  - 若安全基线要求“禁止明文 WS”，不要把安全性完全交给 SDK；在网络层/代理层拒绝 `ws://`，或对 endpoint discovery 结果做校验（需要包装/代理；SDK 本身不暴露该 URL）。至少不要设置 `connectionHost` 把流量导向不可信主机。
  - 自定义 `agent` 时保持 `rejectUnauthorized` 默认 true；只收 PoC 不要用 `NODE_TLS_REJECT_UNAUTHORIZED=0`。
  - 生产不要开 debug/trace（见 §11）。

## 11. 默认 HTTP logger 泄漏面

**B 源码 / SRC-NSDK-1760；C 风险建议。**

- `defaultHttpInstance` 本身没有请求/响应 body 日志拦截器；它只补 `User-Agent` 并解包 `resp.data`（`lib/index.js:185-198`）。泄漏来自调用点的日志。
- **`Client.request` 失败**：
  - `this.logger.trace('send request [METHOD]: url')` 只记 method+url（`100797`）。
  - `.catch(e => { this.logger.error(e); throw e; })` 记录**原始 AxiosError 对象**（`100806-100810`）。AxiosError 的标准自有属性含 `config`（其中 `config.data` 是请求体，`config.headers` 可能含 `Authorization: Bearer <token>`）、`request`、`response`。默认 logger 的 `error` 是 `console.log`，未脱敏。
  - 生成的 API 方法还会额外 `this.logger.error(formatErrors(e))`；`formatErrors` 明确挑选 `config.data`、`config.url`、`config.params`、`config.method`、`response.data` 等（`335-366`）。对 token/认证类请求，`config.data` 可能包含 `app_secret`、`client_secret`、`refresh_token`、`client_assertion` 等；对消息类请求，可能包含消息内容。**这是默认 error 级别就会触发的泄漏面**。
- **WSClient 的 discovery**：
  - 失败：`this.logger.error('[ws]', e?.message || 'system busy')`，只取 message，不打印 body（`102616-102623`）。因此 `AppSecret` 不会因 discovery 失败被默认打印（B）。
  - 成功：`this.logger.debug('[ws]', 'get connect config success, ws url: ' + URL)`（`102613`）。URL 的 query 含 `device_id/service_id`（短生命周期连接标识）；只有 `debug` 级别才输出，默认 info 不输出（B）。生产 debug 日志应视为敏感连接元数据（C）。
- **WSClient 的事件 payload**：`handleEventData` 在 debug 级别打印 `...data: ${mergedData.data}`（`102943`），即完整事件 JSON，可能含消息内容、open_id、chat_id、卡片 action value 等。默认 info 不输出；排障时开 debug 会把 PII 写入日志（B 源码；C 建议用脱敏 logger 或短期采样）。
- **默认 logger 无脱敏、error 走 stdout**：`defaultLogger.error` 是 `console.log('[error]:', ...)`，不是 stderr；日志采集/告警若只看 stderr 会漏掉错误（`100001-100017`）。`trace` 用 `console.trace`，会打印堆栈（B）。
- **C 建议**：
  - 只收 PoC 不要实例化 `Client`；只需要 `EventDispatcher` + `WSClient`，可避开 `Client.request/formatErrors` 的主要泄漏面。
  - 使用自定义 logger：error/warn 路由到 stderr，统一 redact `authorization`、`app_secret`、`client_secret`、`token`、`x-lark-*`、`device_id/service_id`；不要原样打印 Error 对象的 `config/request/response`。
  - 默认 `loggerLevel: info`；不要为排障长期开 `debug/trace`。若必须开，先确认日志系统有访问控制和保留策略。
  - 不要依赖 `LoggerLevel.fatal=0` 静音 EventDispatcher/Client（会被 `||` 兜底成 info）；用 no-op logger。

## 12. 只收 PoC 的实施清单（C）

1. **预检 appId**：必须匹配 `/^cli_[0-9a-fA-F]{16}$/`；不匹配时 1.76.0 的 `start()` 不会联网。若真实 appId 不匹配，先确认是否 SDK 版本问题，不要盲改 appId。
2. **构造顺序**：`new EventDispatcher({ logger, loggerLevel })` → `.register({...})` → `new WSClient({ appId, appSecret, domain, logger, loggerLevel, handshakeTimeoutMs, autoReconnect, onReady, onError, onReconnecting, onReconnected })` → `start({ eventDispatcher })`。
3. **就绪判定**：不要 `await start()` 后立即认为已连接。设置 15–30s 超时，等待 `onReady` 或轮询 `getConnectionStatus().state === 'connected'`；超时则 `close({force:true})` 并记录 `getConnectionStatus()`。
4. **失败可见性**：监听 `onError`，但知道它只覆盖终止性失败；可重试失败看日志与 `getConnectionStatus().reconnectAttempts`。初次失败时不要被 `'ws client ready'` info 日志误导。
5. **关闭**：`try/finally` 中 `wsClient.close({ force: true })`（或按需非 force）；`close()` 是同步的，不需要 await。设置 `handshakeTimeoutMs` 以限制 stuck 握手；`close()` 不能取消在途 discovery HTTP。
6. **事件 handler**：返回 `undefined` 表示普通事件 ACK `{code:200}`；返回对象会被 base64 进 ACK `data`，确保可 JSON 序列化且 <3s。handler 抛错会得到 `{code:500}`，并可能触发平台重推。
7. **卡片回调**：注册 `'card.action.trigger'` 到 `EventDispatcher` 后，必须实测是否收到；不要仅凭官方文档或 LarkChannel 注册代码就宣布可用。若无实测条件，改用 webhook `CardActionHandler` 作为确定性路径。
8. **日志**：只用 `WSClient` 的只收 PoC 不要引入 `Client`；默认 info；自定义 logger 做脱敏；不要打印 AxiosError 原始对象。
9. **WSS**：使用 `Domain.Feishu`/`Domain.Lark` 或完整 HTTPS domain；不要把 `connectionHost` 指向不可信主机；自定义 agent 保持证书校验；生产网络层拒绝明文 `ws://`。
10. **进程退出**：`SIGINT/SIGTERM` 调 `close()`；dataCache sweep 已 unref，但 ping/reconnect/liveness timer 未 unref。

## 13. 未决问题（不能由本次只读核验证明）

- **C1 帧类型**：`card.action.trigger` 在真实租户下是 `event` 帧还是 `card` 帧？1.76.0 只处理 `event`；`card` 会被静默丢弃。需要真实按钮点击 + 抓帧/日志验证，超出本次“无凭证、无 live socket”范围。
- **C2 ACK 接受度**：协调方官方研究报支持新版回调且空 `{}` ack 可接受；但 1.76.0 若把 handler 返回值放进 `data`，平台是否接受 `{code:200,data:base64({toast,card})}` 这一 WS 封装仍需实测。官方 skill 文档说 SDK 自动回 `{"code":200}`，未给出 WS 内层 data 的规范。
- **C3 appId 格式**：官方文档没有公开 `cli_` + 16 hex 的规范；1.76.0 的硬正则可能拒绝合法 appId。需用真实 appId 预检，或向 SDK 维护方确认。
- **C4 重连状态机**：`autoReconnect:false` 且曾经连过时，`reConnect()` 静默返回且不复位 `isConnecting`，`getConnectionStatus()` 会长期显示 `'reconnecting'`。这是源码可读出的缺陷；是否影响 PoC 取决于是否用该配置。
- **C5 Node 版本**：包未声明 `engines`；`ws ^8.19.0`/`axios ^1.16.0` 的实际 Node 兼容范围需按 lockfile/运行环境另行验证（本次未安装依赖）。

## 来源

| source_id | 证据等级 | source_uri | source_owner | version/访问 | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| SRC-NSDK-1760 | B，官方 npm 制品；已校验 shasum/integrity | `https://registry.npmjs.org/@larksuiteoapi/node-sdk/-/node-sdk-1.76.0.tgz`；本地 `/tmp/feishu-sdk-1760.VkCZxh/extracted/package`；已安装 `/Users/lute/Project/Radar-Agent/tools/feishu-poc/node_modules/@larksuiteoapi/node-sdk` | Lark / npm registry | `1.76.0`；shasum `cb7329170c6aa8630c922fbe11359c3895caeea1`；sha512 integrity 匹配；lib SHA-256 `4e816e0ff140cd33d931105b3198ae7685cc40b44bfd1fa8da158308246d5491`；2026-11-08 访问 | Radar/research | 只读源码核验、报告引用 | 不执行代码、不安装、不连 WS、不使用凭证、不据此签发生产兼容性保证 |
| SRC-FEISHU-CALLBACK | B，官方文档 | `https://open.feishu.cn/document/event-subscription-guide/callback-subscription/receive-and-handle-callbacks?lang=zh-CN`（markdown: 同路径 `.md`） | 飞书开放平台 | 2026-11-08 访问；页面内容可能更新 | Radar/research | 引用长连接接收回调、card.action.trigger、3 秒响应规则 | 不把文档描述当作本租户/本 SDK 版本的实际行为保证 |
| SRC-FEISHU-LONGCONN | B，官方文档 | `https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case?lang=zh-CN`（markdown: 同路径 `.md`） | 飞书开放平台 | 2026-11-08 访问；Node SDK 版本要求 ≥1.24.0 | Radar/research | 引用 WSS/加密传输、企业自建限制、50 连接、集群随机、3 秒处理规则 | 不据此认定本 SDK 版本已实现全部文档能力 |
| SRC-FEISHU-CARDCB | B，官方文档 | `https://open.feishu.cn/document/.../feishu-cards/card-callback-communication?lang=zh-CN`（doc-prefix 在抓取层被脱敏；标题“卡片回传交互回调”） | 飞书开放平台 | 2026-11-08 访问 | Radar/research | 引用 `{toast?,card?}` 响应结构与 3 秒/禁 3xx 规则 | 不把 “推送方式: Webhook” 一行当作长连接不支持卡片回调的证据；官方文档内部有冲突 |
| SRC-FEISHU-SKILL | B，官方 well-known 参考 | `https://open.feishu.cn/.well-known/skills/lark-im/references/lark-im-card-action-reply.md` | 飞书开放平台 | 2026-11-08 访问 | Radar/research | 引用 “card.action.trigger 通过既有 WebSocket 长连接投递”“SDK auto-responds {"code":200} within 3s” | 不把该 skill 文档当作 Node SDK 1.76.0 的实现证明 |
| SRC-PYSDK-126 | C，非官方旁证 | `https://github.com/larksuite/oapi-sdk-python/issues/126` | GitHub 社区/报告者 | issue 2026-05-13 关闭；非锁定版本 | Radar/research | 仅用于提示 `MessageType.CARD` 帧被丢弃的失败模式 | 不把 Python 行为直接外推到 Node/飞书服务端 |
| SRC-NODESDK-MAIN-TESTS | C，非锁定版本旁证 | `https://github.com/larksuite/node-sdk/tree/main/ws-client/__tests__` | Lark / GitHub | main 分支，2026-11-08 读取；非 1.76.0 tarball 内容 | Radar/research | 说明官方 WS 测试只覆盖 event 帧、未覆盖 card 帧 | 不把 main 分支测试当作 1.76.0 制品的一部分 |

**方法边界**：本次没有执行任何下载代码、没有 `npm install`、没有 `npm pack`、没有打开 WebSocket、没有调用飞书 API、没有使用 appId/appSecret/tenant token、没有发送消息。npm tarball 仅解压到 repo 外的新建空目录；Python 解析均使用 `-I` 且从 `/tmp` 运行。官方文档仅做公开 GET。
