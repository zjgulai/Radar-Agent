# Momcozy Radar B0：合作业务替代方案与建设必要性研究

> **父助手校准提示（2026-11-08）：** 本文保留独立候选调查。Momcozy 品牌页明确称与 Awin／Impact／CJ 网络合作（C；见[公开合作研究](2026-11-08-radar-b0-momcozy-jobs.md) CL-02），不能说完全没有对应关系证据；但该声明不证明内部实际工作流、使用 impact.com 全部产品、合同/导出/API 权限或 Radar 可访问。两家供应商的四个页面不足以判定市场全链路覆盖或功能不存在。“流程增强后悔值最低”、快/中/慢、低/中/高与固定案例/市场数量均未验证，不作默认排序或门槛。自建的必要条件是有价值且可控的未满足任务、获准最低证据、责任与可维护性；**不要求每个自建切片同时包含权利登记、跨入口问题和供应商缺口**。权利只在所选任务/用途需要时审查。§8.2 的 B、§8.3 的 A 是策略编号，不是证据等级；三策略判断均为 C 草案。当前没有报价、价值实测或可信总工期。

- 日期：2026-11-08。
- 状态：**L0 研究草案；全部未批准**。不是 PRD、采购建议、架构方案、实施指令或上线授权。
- 研究问题：在 Momcozy 的窄口径合作业务中，Radar 应“增强现有流程 / 集成许可工具 / 自建证据中心 / 停止”？现有替代方案实际覆盖什么，哪些只是供应商声明？
- `human_gold_claim_count = 0`：本轮没有真人访谈、真实脱敏案例、供应商演示、采购、API 凭证或业务验收。
- 阅读前提：不假设上一版 MVP 已批准；D01–D12 仍全部未批准 [SRC-B0-LOC-02]。

## 0. 结论摘要（C，非批准）

1. **本轮证据不能得出“必须建设 Radar”的结论。** PMO 只把 Radar 登记为 IP/名人 Agent & 工作台，三项能力进度 25/20/15 是登记值，不是业务价值、采用或完成度证据 [SRC-B0-LOC-05 §3.3、§4.1]。
2. **“表格/飞书任务 + 通用 LLM/manual evidence”目前是工作假设，不是观察到的现状。** 它来自 PMO 对 BD 在飞书查背调、登记寄样与二创授权到期的描述，以及本项目 MVP 草案；没有真实案例的耗时、返工、权利事故和工具使用记录 [SRC-B0-LOC-05 §3.2、§3.5；SRC-B0-LOC-04 §2.2]。
3. **两个可核验的替代产品各覆盖一部分，没有一个覆盖七段全链路。** 在已抓取页面中，CreatorIQ 明确覆盖发现、评估、关系、监测、结果，brief/计划仅部分，权利证据未文档化；impact.com 明确覆盖发现、招募/关系、合同/支付/归因，评估/brief/内容监测仅部分，权利证据未文档化 [SRC-B0-CIQ-01；SRC-B0-CIQ-02；SRC-B0-IMP-01；SRC-B0-IMP-02]。
4. **“权利证据、到期与下游用途”是共同未文档化缺口，但还不是已证实的采购理由。** 两个供应商都没有在已读页面文档化资产级使用范围、地区、渠道、期限、撤回和下游门禁；Radar 的 `creator_id + 授权七元组` 在本项目也仍未定义 [SRC-B0-LOC-05 §3.6；SRC-B0-LOC-04 §2.4、D08]。
5. **专有评分/排序不构成护城河。** 供应商已提供 AI 推荐、相似达人、品牌安全、受众真实性、活动管理和归因；自建分数需要独立验证与采用证据，不能作为建设理由 [SRC-B0-CIQ-01 §Discover、§Protect；SRC-B0-IMP-01 FAQ]。
6. **B0 的默认下一步不是选型，而是 3–5 个真实脱敏案例的基线取证。** 在约束排序、合法数据路径、权利语义、供应商 API/导出证据和机会成本比较完成前，任何 buy/integrate/build 结论都只是 C 级假设。

## 1. 研究边界、方法与证据规则

### 1.1 范围内

- B0 业务发现中的 build vs existing alternatives，仅限 Momcozy 窄口径合作业务：发现 → 评估 → 关系 → brief/计划 → 权利证据 → 监测 → 结果。
- 比较三类替代：当前人工流程假设；creator discovery/campaign 工具；affiliate/collaboration 平台。
- 只读公开、相关的第一方产品/帮助文档；最多 3 个代表性产品，最多 6 个不同官方页面；不登录、不注册、不申请 demo、不提交表单、不抓取个性化创作者资料。

### 1.2 范围外

- 不实施、不选型、不采购、不询价、不评估安全合规、不提供法律意见、不做技术栈或组件设计。
- 不读取密钥、不调用飞书 token/WebSocket/聊天/消息、不联系达人、不购买数据、不部署、不做 Git 操作。
- 不把 PMO、Main、供应商营销或本项目旧方案自动升格为批准事实。

### 1.3 证据等级

沿用本项目校准口径 [SRC-B0-LOC-03 §1]：

| 等级 | 本项目用法 | 本轮对应材料 |
|---|---|---|
| A | 可核对的项目系统记录、实际运行结果或正式批准记录 | 本轮没有业务运行/批准证据 |
| B | 官方平台政策、法规/监管原文、标准组织建议 | 本轮未新增平台条款核验 |
| C | 第一方品牌/供应商/PMO 公开陈述、未批准方案 | 供应商产品页、PMO 记录、本项目规划 |
| D | 未核验材料、访问失败、只来自搜索摘要或记忆 | Shopify Collabs 两个帮助页（403） |

供应商页面全部按 **C** 处理：它们能证明“供应商这样宣称”，不能证明“Momcozy 已采用”“实际 ROI”“内部责任”或“API 已获授权”。

### 1.4 访问记录

| 序 | 页面 | 结果 | 处理 |
|---:|---|---|---|
| 1 | `https://www.creatoriq.com/influencer-marketing-solution` | 成功；访问 2026-11-08 | 作为 C 级供应商能力陈述 |
| 2 | `https://www.creatoriq.com/influencer-marketing-solution/creator-search` | 成功；访问 2026-11-08 | 作为 C 级发现/评估陈述 |
| 3 | `https://impact.com/discover-recruit/` | 成功；访问 2026-11-08 | 作为 C 级发现/招募陈述 |
| 4 | `https://impact.com/performance/` | 成功；访问 2026-11-08 | 作为 C 级跟踪/归因陈述 |
| 5 | `https://help.shopify.com/en/manual/promoting-marketing/collabs` | 失败：WebFetch 域名校验失败；MCP fetch 403；各重试一次 | D；无页面内容，不作能力判断 |
| 6 | `https://help.shopify.com/en/manual/promoting-marketing/collabs/merchants/managing-creators` | 失败：同上 | D；无页面内容，不作能力判断 |

说明：达到 6 个不同官方页面的上限，未继续抓取替代页面。搜索索引只用于定位官方 URL，未把搜索摘要当作实质证据。

## 2. B0 业务问题与当前工作假设

### 2.1 PMO 提供的岗位语境（C）

- PMO 产品定位：`IP/名人Agent&工作台`，业务链路为“粉丝分析 → 合作计划 → 动态监测 → 机会推荐” [SRC-B0-LOC-05 §2.4]。
- PMO `verified_summary` 原文提到：“BD 在飞书查达人背调、点卡片登记寄样与二创授权到期” [SRC-B0-LOC-05 §3.2]。
- 交接链提到：达人四维分层（Expert/Editorial/Affiliate/Sponsored）、@Radar 飞书背调卡、寄样回收 ≥60%、授权到期 <5%、合作推荐算法迁入工作台 [SRC-B0-LOC-05 §3.5]。这些是 PMO 口径，不是本项目批准阈值。
- 跨 Agent 协议原文：“Radar 是 `creator_id` 与达人授权七元组的唯一登记源；任何达人素材进入 Clone 二次剪辑或进入 Paid Media 广告投流前，必须校验 Radar 签发的有效授权状态。” [SRC-B0-LOC-05 §3.6] 这是**待落实的跨系统协议**，不是已有接口或法律授权。
- 关键限制：PMO 没有给 Radar 单独的可量化业务目标（如合作带来的 GMV/EMV/CPM、样品转内容率、授权合规率）；“20%/25/20/15”只是能力登记百分比 [SRC-B0-LOC-05 §2.4、§3.3]。

### 2.2 当前人工流程假设（未经观察）

待验证假设：

1. BD/品牌成员从飞书群、私聊或表格拿到达人主页/账号和合作问题；
2. 用公开页面、平台后台、历史表格、通用 LLM 摘要和人工判断做背调；
3. brief 与合作判断散落在飞书文档/表格；寄样、二创授权、到期由人工登记和提醒；
4. 监测靠人工回看或供应商后台；结果靠手工汇总。

目前不知道：实际使用哪些工具、每周/每月案例量、每步 elapsed time、交接次数、返工率、权利过期/素材误用事件、通用 LLM 是否被允许、谁做最终决定、谁承担法务/运营责任。

**为什么这很重要：** 如果人工流程已能满足证据质量和决策速度，自建系统就是过度建设；如果失败集中在证据拼装、权利追踪或跨入口交接，才需要进一步比较工具或自建。没有真实案例，不能把“人工流程低效”当作事实。

### 2.3 Radar 被假定的优势与必须为真的条件

PMO 把 Radar 定位为“唯一登记源/门禁”，这是当前最强的假定优势 [SRC-B0-LOC-05 §3.6]。它要成为真实优势，以下条件必须同时成立：

1. **权利证据是反复发生、代价明确的业务失败**，不只是合规口号；
2. **现有供应商无法通过 API、导出或合同提供所需字段/证据**；
3. **飞书群 @ / P2P + 工作台的双入口协作是必要的**，链接+通知无法替代；
4. **Momcozy 愿意长期拥有并维护该登记源**，包括法务/运营责任；
5. **下游 Clone/Paid Media 确实需要机器可校验的授权门禁**，且语义已批准。

本轮没有任何一条被证实。供应商页面反而显示：发现、评估、关系、监测、结果等商品化能力已有成熟替代；Radar 的差异只能落在“证据/权利/跨入口”这些尚未验证的约束上。

### 2.4 什么会证伪“必须建设 Radar”

- 3–5 个真实案例显示没有实质性的时间、返工或权利损失；
- 标准 brief + 证据清单 + 飞书提醒即可解决主要问题；
- 许可工具能以可接受的总成本和合法条款覆盖关键字段；
- 权利可由合同/法务流程处理，不需要新登记源；
- 没有业务 owner 愿意承担新系统的运行与采用。

## 3. 替代方案证据

### 3.1 为什么选这三个产品

- **CreatorIQ**：企业级 creator marketing 平台，覆盖发现、评估、campaign、measurement；代表“creator discovery/campaign 工具”。
- **impact.com**：partnership/affiliate 管理平台，覆盖发现、招募、合同、跟踪、支付/归因；代表“affiliate/collaboration 平台”。
- **Shopify Collabs**：电商联盟/合作工具，因 Momcozy 的 Shopify 语境而选；但本轮两个官方帮助页均 403，未取得页面内容，不能做能力比较。

这不是供应商热度榜，也不是推荐名单。**Momcozy 官网公开称与 Awin、Impact、CJ Affiliate 网络合作（C，见[公开合作研究](2026-11-08-radar-b0-momcozy-jobs.md) CL-02）**；这构成品牌对网络关系的公开声明，但不证明当前内部使用的产品版本、流程、合同或 API/导出权限，更不证明 Radar 可访问数据。CreatorIQ 与 Shopify Collabs 是否被 Momcozy 使用仍未知；不能将网络合作声明外推为使用 impact.com 全平台能力。

### 3.2 CreatorIQ（C；供应商营销）

**已文档化的能力：**

> “Search what 20M creators actually post, with up to 12 months of content refreshed daily.” [SRC-B0-CIQ-01 §Discover]

> “Content-first search puts creators’ posts right in your results, so you judge brand fit by what they actually make, not just their numbers.” [SRC-B0-CIQ-01 §Discover]

> “A brand mentions feed surfaces creators who are already posting about you…” [SRC-B0-CIQ-01 §Discover]

> “Review audience insights, engagement, and content in one creator profile, then add creators to a list, campaign, or community in a few clicks.” [SRC-B0-CIQ-01 §Discover]

> “AI brand safety reviews creator content across text, visuals, and audio, then learns your brand’s standards over time.” [SRC-B0-CIQ-01 §Protect]

> “Run a one-time Lookback on any creator before you partner, then use Monitoring to keep watch on active partners during and after campaigns.” [SRC-B0-CIQ-01 §Protect]

> “Set roles, workflows, and approvals by team or region, with a clear record of every decision…” [SRC-B0-CIQ-01 §Protect]

> “CreatorIQ gives your teams, your BI tools, and your AI workflows one dependable data foundation, built on the Creator Graph® and a bi-directional API.” [SRC-B0-CIQ-01 §Scale]

> “Sync creator data with your BI tools, data lakes, and marketing mix models through a bi-directional API, or leverage integrations with other tools like Sprinklr and CreativeX…” [SRC-B0-CIQ-01 §Scale]

> “Run affiliate programs that pay commission only on the sales creators drive, turn top content into paid ads, and pay creators in 60+ currencies across 80+ markets.” [SRC-B0-CIQ-01 §Scale]

> “Bring sub-brands, divisions, and regional offices into one environment with shared CRM and reporting.” [SRC-B0-CIQ-01 §Scale]

**发现/评估补充：**

> “Confidently search millions of public creator profiles across every major social network, and go beyond surface-level metrics to evaluate what truly reflects impact.” [SRC-B0-CIQ-02 §Why Choose Us]

> “Filter creators by audience demographics, engagement quality, content style, and brand affinity.” [SRC-B0-CIQ-02 §Highlights]

> “CreatorIQ’s brand safety monitoring assesses each creator and post against all common keywords to ensure they meet your safety standards.” [SRC-B0-CIQ-02 §Highlights]

> FAQ：“CreatorIQ’s database of millions of global creators is powered by direct API integrations with every major social platform…” [SRC-B0-CIQ-02 §FAQs]

**已文档化 / 未文档化：**

| 维度 | 已文档化 | 未文档化（不等于不存在） |
|---|---|---|
| 发现 | 20M creators、内容优先搜索、品牌提及、相似达人、关键词/品牌搜索、筛选器 | 数据库独立验证、Momcozy 目标市场覆盖率 |
| 评估 | 受众/互动/内容、品牌安全、虚假粉丝检测、Lookback、端到端审核 | 证据来源许可、未知处理、brief 版本绑定 |
| 关系 | 列表、campaign、community、共享 CRM、roles/workflows/approvals | 飞书群/P2P、外部租户协作 |
| brief/计划 | 只文档化“加入 campaign”；未展开 brief 编写/审批/版本 | brief 模板、审批链、预算未知处理 |
| 权利证据 | 未文档化 | 资产级范围、地区、渠道、期限、撤回、下游门禁 |
| 监测 | Monitoring、always-on 品牌安全、Lookback | 权利到期监测、内容删除/撤回联动 |
| 结果 | Measure、自然语言问数、竞品 benchmark、联盟佣金 | 独立 ROI 验证、Momcozy 归因口径 |
| API/集成 | “bi-directional API”、BI/data lake/MMM、Sprinklr、CreativeX | API scope、权限、速率、价格、导出格式、数据删除 |
| 国家/可用性 | 支付 60+ currencies / 80+ markets | 平台可用国家、语言、数据驻留、采购资格 |
| 合同/权利 | “approvals”“clear record of every decision” | 合同权利语义、授权七元组、下游用途门禁 |

### 3.3 impact.com（C；供应商营销）

**已文档化的能力：**

> “One system. Discovery to signed partnership” [SRC-B0-IMP-01 标题区]

> “Vetted partners across affiliates, publishers, and creators 250k+” [SRC-B0-IMP-01 数据区]

> FAQ：“Brands find and recruit affiliate partners by combining a searchable partner marketplace with proactive outreach tools and a structured pipeline that moves prospects from first contact to signed partnership.” [SRC-B0-IMP-01 §FAQ]

> “browsing a vetted network filtered by audience geography, promotional method, content category, and engagement rate” [SRC-B0-IMP-01 §FAQ]

> “bulk outreach, automated follow-up sequences, and in-app messaging keep recruitment moving efficiently.” [SRC-B0-IMP-01 §FAQ]

> “a marketplace of 250,000+ vetted partners, AI-powered discovery, and a Prospects pipeline that keeps every recruitment conversation visible and progressing.” [SRC-B0-IMP-01 §FAQ]

> “Every partner you find moves into the same platform for contracting, tracking, engagement, and optimization. No tool-switching. No data gaps.” [SRC-B0-IMP-01 §Discovery is the start of the full partnership lifecycle]

> “Every transaction tracked. Every partner paid. Every outcome attributed without the guesswork.” [SRC-B0-IMP-02 §标题区]

> “A clean data layer. Transaction-level attribution on every sale” [SRC-B0-IMP-02 §A clean data layer]

> “A payment infrastructure that handles any partner type, any commission structure, any geography.” [SRC-B0-IMP-02 §A clean data layer]

> “1m+ active partnerships on the platform / 250k+ vetted partners available in Marketplace / $100b+ in total GMV tracked annually.” [SRC-B0-IMP-02 §数据区]

客户引述（C，不等于产品规格）：“The platform’s flexibility—from custom contracts and advanced tracking to Creator Discovery—has allowed us to streamline operations…” [SRC-B0-IMP-02 §客户引述]

**已文档化 / 未文档化：**

| 维度 | 已文档化 | 未文档化（不等于不存在） |
|---|---|---|
| 发现 | 250k+ vetted partners、按地区/推广方式/内容类别/互动率筛选、AI 推荐 | 数据库独立验证、Momcozy 市场覆盖 |
| 评估 | “vetted partners”、真实表现数据、profile 过滤 | 品牌安全、受众真实性、内容级证据、未知处理 |
| 关系 | Prospects pipeline、批量外联、自动跟进、站内消息 | 飞书协作、外部租户、群/私聊保密 |
| brief/计划 | “discovery to signed partnership”；合同/签约在同一平台 | brief 编写/审批/版本、预算未知处理 |
| 权利证据 | “contracting”“custom contracts”（客户引述） | 资产级范围、地区、渠道、期限、撤回、下游门禁 |
| 监测 | 交易级 tracking、lead/sale 归因 | 内容监测、权利到期、素材删除/撤回 |
| 结果 | 交易归因、支付、GMV | Momcozy 独立 ROI、跨系统归因 |
| API/集成 | 已抓取页面未文档化 | API 存在性、scope、导出、速率、价格 |
| 国家/可用性 | 支付 “any geography” | 平台可用国家、资格、数据驻留 |
| 合同/权利 | 合同/签约在同一平台 | 合同权利语义、授权七元组、下游用途门禁 |

### 3.4 Shopify Collabs（D；访问失败）

- 两个官方帮助页均返回 403；WebFetch 域名校验失败，MCP fetch 403；每个 URL 仅重试一次，未取得正文。
- 因此本轮**不对 Shopify Collabs 的能力、限制、国家可用性、API 或价格做任何结论**。
- “未抓到”不等于“没有该功能”；若 B0 继续，应在新的授权轮次重新访问，或通过采购/供应商文档获取，不把搜索摘要当证据。

### 3.5 跨供应商观察

1. 所有供应商能力均为 **C 级营销陈述**；没有独立 benchmark、真实采用、ROI 或安全审核。
2. 数据库规模、达人数量、GMV、ROI 案例都是供应商自述，不能用于 Momcozy 商业论证。
3. 没有一家在已读页面文档化“资产级权利证据 + 到期/撤回 + 下游用途门禁”。这是共同缺口，但缺口本身不等于业务痛点。
4. API/集成证据很薄：CreatorIQ 明确写有 bi-directional API；impact.com 在已读页面未文档化 API；Shopify 未知。**不得因为营销页提到“integration”就推断接口可用。**
5. 没有一家文档化飞书群 @ / P2P、国产协作习惯、中国区数据驻留或 Momcozy 内部审批链。

## 4. 单工具覆盖矩阵

图例：● = 已抓取页面明确文档化；◐ = 部分/相邻能力，需额外验证；○ = 已抓取页面未文档化（不等于不存在）；? = 访问失败/未知；H = 当前人工假设，未观察。

| 方案 | 发现 | 评估 | 关系 | brief/计划 | 权利证据 | 监测 | 结果 |
|---|---|---|---|---|---|---|---|
| 当前人工假设（表格/飞书 + 通用 LLM/manual） | H | H | H | H | H | H | H |
| CreatorIQ | ● | ● | ● | ◐ | ○ | ● | ● |
| impact.com | ● | ◐ | ● | ◐ | ○ | ◐ | ● |
| Shopify Collabs | ? | ? | ? | ? | ? | ? | ? |
| 自定义证据中心（候选，未建设） | 候选 | 候选 | 候选 | 候选 | 候选 | 候选 | 候选 |

### 4.1 如何读这张表

- **CreatorIQ 覆盖最广**：发现、评估、关系、监测、结果均有明确页面证据；brief/计划只到“加入 campaign/community”，未展开 brief 编写与审批；权利证据完全未文档化。
- **impact.com 更偏交易与联盟**：发现、招募/关系、合同/支付/归因强；评估只有“vetted”和表现数据，缺少内容级品牌安全/受众真实性证据；监测是交易跟踪，不是内容/权利监测；权利证据未文档化。
- **Shopify Collabs 无法评价**：访问失败；不得推断其强或弱。
- **当前人工流程可能“七段都能做”**：表格+飞书+人工可以覆盖全部环节，问题在于质量、耗时、可审计性和规模化，而不是“有没有”。这正是 B0 要用真实案例测量的。
- **自定义证据中心是候选设计，不是证据**：它声称能覆盖七段，但未建设、未试点、未验收；不能把“设计上可以”当作“已经更好”。

### 4.2 集成、导出、可用性与国家限制

| 维度 | CreatorIQ | impact.com | Shopify Collabs |
|---|---|---|---|
| API 存在性 | 明确写 “bi-directional API” [SRC-B0-CIQ-01 §Scale]；scope/权限/速率/价格未知 | 已抓取页面未文档化；不能推断 | 未知（403） |
| 数据导出 | 未明确；API 可同步到 BI/data lake，但导出格式/限制/删除未知 | 未文档化 | 未知 |
| 具名集成 | Sprinklr、CreativeX、BI tools、data lakes、MMM [SRC-B0-CIQ-01 §Scale] | 未文档化 | 未知 |
| 国家/市场可用性 | 支付 60+ currencies / 80+ markets [SRC-B0-CIQ-01 §Scale]；平台可用国家未声明 | 支付 “any geography” [SRC-B0-IMP-02]；平台可用/资格未声明 | 未知 |
| 数据来源/权限 | “direct API integrations with every major social platform” [SRC-B0-CIQ-02 §FAQs] —— 供应商声明；权限未知 | “vetted partners”/marketplace；来源与权限未知 | 未知 |
| 定价 | 未抓取；不报价 | 未抓取；不报价 | 未抓取；不报价 |
| 合同/权利 | “approvals”“clear record of every decision” [SRC-B0-CIQ-01 §Protect]；无权利范围 | “contracting”、客户引述 “custom contracts” [SRC-B0-IMP-01；SRC-B0-IMP-02]；无权利范围 | 未知 |

**读法：**

- “API 存在”只说明供应商宣称有接口，不说明 Momcozy 能用、能导出哪些字段、需要什么权限、是否允许跨系统存储。
- “any geography”出现在支付基础设施语境，不等于平台在 Momcozy 目标市场可售/可用。
- 没有国家限制声明，不等于没有限制；必须由供应商书面确认和法律/采购复核。
- 未抓取定价页；本研究的成本比较只能给结构，不能给报价。

## 5. 候选差异点：供应商已提供什么，什么才可能真正不同

| 候选差异点 | 供应商已提供 | 要成为真实差异必须为真 | 需要的证据 | 当前状态 |
|---|---|---|---|---|
| 情境绑定的决策/证据 | 达人档案、受众/互动、品牌安全、决策记录、审批 | 决策必须绑定 brief 版本、来源版本、未知、复核人；且审计/法务确实要求 | 真实案例中的证据拼装耗时、返工、审计要求 | 未验证 |
| 跨入口协作 | 站内消息、CRM、campaign、roles/workflows | 飞书群 @ / P2P + 工作台的双入口显著优于“链接+通知”；用户实际这样工作 | 用户观察、采用数据、群/私聊保密规则 | 未验证 |
| 权利范围证据 | 合同/签约（impact）、“approvals/decision record”（CreatorIQ） | 资产级范围、地区、渠道、期限、撤回、下游门禁是真实约束；供应商 API/导出无法满足 | 权利事故/到期数据、法务批准的七元组、下游消费者要求 | 未验证 |
| 专有评分/排序 | AI 推荐、相似达人、品牌安全、表现筛选 | **不构成护城河**；需要独立验证、可解释性和业务采用 | 分数与真实决策/结果的相关性；人审对照 | 不应作为建设理由 |
| 达人数据库 | 20M creators（CreatorIQ）、250k+ partners（impact） | 商品化能力；Momcozy 不需要自建 | 覆盖率/许可/成本比较 | 商品化 |
| 结果归因 | 交易级 tracking、支付、GMV（impact）；measure/benchmark（CreatorIQ） | 商品化；Momcozy 特殊归因才可能需要补层 | 现有归因口径与缺口 | 商品化 |
| 飞书集成 | 未文档化 | 可以是工作流差异，但不是数据护城河；轻量 bot/链接可能足够 | 用户使用频率、替代方案测试 | 未验证 |

**明确结论：** 专有评分/排序的新颖性不是假定护城河。供应商已经在做 AI 推荐、相似达人、品牌安全和表现数据；自建一个分数既没有独立验证，也没有采用证据，不能支撑 build。

真正可能不同的是：

1. **证据级 provenance**：每条结论能回溯到来源、时间、许可、版本、未知和复核人，并绑定具体 brief/决策。
2. **权利范围与下游门禁**：资产/地区/渠道/期限/撤回/用途，且能被 Clone/Paid Media 消费。
3. **跨入口协作**：飞书群/P2P 与工作台共享同一业务事实，且不泄露私聊/合同。

这三项都还只是候选差异，不是已验证优势。它们也可能被“表格+飞书+合同模板+提醒”覆盖，或被供应商 API+薄层覆盖。

## 6. 三种 B0 策略与条件（不含技术栈设计）

以下策略是业务层面的选项，不指定架构、数据库、模型、部署或组件。

### 6.1 策略 A：增强现有流程（augment）

**业务主张：** 先修正流程与证据纪律，不新建系统。

**可做的动作：**

- 统一 brief 模板：品牌/市场/品类/对象类型/目标/时间/已知约束/预算未知/非目标；
- 证据清单：来源、访问时间、许可、直接观测/推断/未知、复核人；
- 权利登记：主体/账号/素材/地区/渠道/期限/到期 owner/撤回；
- 飞书任务与到期提醒；通用 LLM 只做摘要/检索辅助，人工复核；
- 决策记录：brief 版本、证据版本、决定、理由、操作者、时间；
- 月度抽样复核与错误复盘。

**适用条件：**

- 真实案例显示痛点在一致性、提醒、交接，而不是缺少数据或权利门禁；
- 案例量/差异度使软件投入不划算；
- 现有人工 + 通用 LLM 能达到可接受证据质量；
- 下游不要求机器可读的权利门禁；
- 有业务 owner 能执行流程。

**必须为真：** 用户愿意用模板；提醒能降低过期/返工；通用 LLM 的数据使用被允许；复核负担不增加。

**证据：** 3–5 案例前后对比（耗时、返工、缺证、过期）；用户采用；无新增权利事故。

**成本/机会：** 最低直接成本；消耗管理注意力；可能不 scale；不产生跨系统门禁。

**升级/停止：** 若证据检索/拼装仍是主瓶颈，或权利事故持续，或案例量增长，升级到 B/C；若流程无法执行，停止并重新定义问题。

### 6.2 策略 B：集成许可工具（integrate）

**业务主张：** 用许可工具覆盖商品化能力（发现、评估、关系、campaign、跟踪、归因），只为 Momcozy 特有约束保留薄层。

**适用条件：**

- 约束主要是发现/评估/关系/结果，而不是权利证据；
- 供应商覆盖关键字段，且能用 Momcozy 真实字段演示；
- API/导出/权限/合同允许所需用途、保留、删除和跨系统消费；
- 目标市场在国家/语言/数据驻留上可用；
- 安全、采购、法务可接受；
- 总成本（license + 实施 + 集成 + 培训 + 供应商管理 + 退出）低于自建；
- 权利证据可由现有法务/合同流程或薄层解决；
- 飞书协作可通过链接/通知/薄集成满足。

**必须为真：** demo 能覆盖真实字段；API sandbox 可导出所需证据；合同允许；目标市场可用；用户接受新工具；关键数据不被锁定。

**证据：** 结构化 demo、API/导出测试、权限模型、安全问卷、定价、reference、法务审查、飞书集成可行性。

**成本/机会：** license + 实施 + 集成 + 培训 + 供应商管理 + 退出；工程少于自建；但 lock-in、导出限制、功能 fit、国家覆盖未知；可能仍需权利层。

**停止：** 供应商不能暴露必需字段；许可不允许；国家不支持；总成本高于自建；安全/采购失败；采用低。

### 6.3 策略 C：自建证据中心窄系统（build）

**业务主张：** 只自建供应商不覆盖、且真实案例证明为约束的窄证据闭环；不做通用达人数据库、不做全网采集、不做通用 Agent 平台。

**适用条件：**

- 真实案例证明权利证据/来源溯源/跨入口协作是主约束；
- 供应商无法通过 API/导出/合同满足；
- 法务/运营要求 Momcozy 自有登记与下游门禁；
- 下游 Clone/Paid Media 的消费要求真实且已批准；
- 能承担 45–70 工程人日 + 35–60 其他角色人日 + 持续维护 [SRC-B0-LOC-04 §8.2]；
- owner、采用、值班、恢复责任落实；
- 数据来源合法。

**必须为真：** 3–5 案例量化返工/权利事故；法务批准权利 tuple；vendor gap 经 API/导出测试证明；下游消费者要求明确；A/B 成本比较支持；试点验收可测。

**证据：** 同上 + 受控试点（fixture/授权 live 分层）、独立人审、安全/恢复、运营责任。

**成本/机会：** 最高工程/维护；延迟 #66/#67/#68 与其他 G1/S2 工作；需要法务/数据/飞书/运营；过度建设商品化能力的风险；若约束真实，可能形成证据/权利资产。

**停止：** 无量化痛；供应商足够；权利非约束；无 owner；数据不可得；试点失败。

### 6.4 三策略对比

| 维度 | A 流程增强 | B 许可集成 | C 自建证据中心 |
|---|---|---|---|
| 首次价值 | 快 | 中 | 慢 |
| 直接成本 | 低 | 中（license 未知） | 高（45–70 工程人日 + 35–60 其他人日，C） |
| 证据/权利 fit | 取决于执行 | 商品化能力 + 薄层 | 可定制，但需验证 |
| 飞书 fit | 高（现有） | 中（需集成） | 高（可设计） |
| 供应商锁定 | 无 | 有 | 无（但自建锁定） |
| 主要风险 | 不 scale/无审计 | 数据/导出/国家/成本 | 过度建设/维护/采用 |
| 停止信号 | 流程无法执行 | 供应商不满足关键字段 | 试点失败/无 owner |

**校准后的讨论口径（C）：** 当前没有真实流程、成本与采用证据，不对 A/B/C 排序。A 是流程问题主导时的候选；B 是商品化数据/协作能力满足真实需求且许可/合同可行时的候选；C 是有价值且可控的任务仍未满足、最低必要证据获准且责任/维护可承担时的候选。权利登记只在任务和实际用途需要时成为条件，不要求全部自建工作同时包含“权利证据 + 跨入口 + 供应商缺口”。三者都不是批准结论。

## 7. Buy / Integrate / Build / Stop 决策所需证据

### 7.1 证据清单

| 证据 | 它决定什么 | 最低可接受形态 | 岗位 owner（建议） | 当前状态 |
|---|---|---|---|---|
| 近期真实脱敏案例（数量待按实际任务确定） | 是否存在值得解决的问题 | 实际产物/证据/决定/结果；如存在则纳入拒绝、搁置和返工；报告实际 N、选择方式与未覆盖类型，不强制跨对象或跨市场 | BD/品牌业务 | 未取得真实案例 |
| 基线指标 | A/B/C 的价值比较 | 每案例 elapsed time、等待、交接、返工、缺证、权利过期/事故、采用；实测而非估计 | 业务 + 产品/BA | 无 |
| 约束排序 | 先解决哪一段 | 量化各段对时间/错误/风险的贡献；不是“全都重要” | 业务 + 产品 | 只有假设 |
| 合法数据路径 | 能否使用数据 | 平台条款、供应商许可、导出/保留/删除、国家；法务/数据 owner 签字 | 法务 + 数据 | 未取得 |
| 权利语义 | 是否能定义“有效授权” | 主体/账号/素材/地区/渠道/期限/撤回/下游用途；法务批准草案 | 法务 + 品牌资产 | 七元组未定义 |
| 供应商证明 | B 是否可行 | 真实字段 demo、API/导出 sandbox、权限模型、安全问卷、定价、reference、合同 | 技术 + 采购 + 安全 | 只有营销页 |
| 成本/机会 | 选哪个 | A/B/C 全成本 + 维护 + 延迟其他工作的机会成本；假设与有效期 | 财务 + 产品 | 只有 C 级 WBS |
| 采用/运营 | 能否持续 | 具名 owner、培训、支持、值班、退出；实际使用而非意向 | 业务 owner + 运营 | 未知 |

### 7.2 B0 决策门（建议，非批准）

| 门 | 退出条件 | 能支持的决定 |
|---|---|---|
| G0 章程 | 业务问题、对象类型、市场、owner、停止信号形成 | 可以开始取证 |
| G1 案例基线 | 3–5 案例完成；约束排序有数据 | 可以排除/保留某策略 |
| G2 合法与权利 | 数据路径可用；权利语义有法务草案 | 可以判断 B/C 是否可行 |
| G3 选项证明 | A/B/C 总成本与机会成本比较；vendor 或试点证据 | 可以提出选型建议 |
| G4 采用/运营 | owner、培训、值班、退出落实；试点验收 | 可以进入有限试点 |
| G5 决策记录 | 选择、替代、证据、批准主体、失效条件记录 | 人类签核；本文不能关闭任何门 |

### 7.3 什么时候简单流程改变就足够

- 痛点主要是链接散落、brief 不一致、到期忘记、交接靠记忆；
- 案例量低、差异大，软件 ROI 不明显（阈值由 B0 实测后业务 owner 批准，本文不预设）；
- 通用 LLM + 人工复核已能达到证据质量；
- 下游不要求机器可读的权利门禁；
- 权利可由登记表 + owner + 提醒覆盖，不需要资产级 clearance；
- 没有预算/owner 做软件，但流程可以被强制执行。

只要上述任一不成立，就应继续比较 B/C，而不是直接上系统。

### 7.4 停止信号

沿用本项目主计划的停止/收缩信号 [SRC-B0-LOC-04 §9] 并补充 B0 口径：

- 没有真实案例显示实质痛点；
- 用户无法说明任务、产物和下一人类动作；
- 必需证据无法合法取得；
- 当前流程 + 清单/提醒已达到可接受周期与质量；
- 许可工具以更低总成本覆盖关键字段；
- 权利不是约束，或法务认为不需要新登记源；
- 没有 owner/采用/维护资源；
- 试点验收失败，或单任务成本超出批准包络（包络尚未批准）。

## 8. 机会成本与比较口径

### 8.1 自建（C）

- 直接工程：45–70 工程人日；加产品/BA/设计 15–25、QA/安全/运维 12–20、业务/法务/管理员/人审 8–15，合计 80–130 人日（C 级草案，未批准）[SRC-B0-LOC-04 §8.2]。
- 容量换算：两名工程各 70% 投入，每周约 7 工程人日；45–70 人日约 6.4–10 周**容量**，不是端到端工期，也不是承诺 [SRC-B0-LOC-04 §8.3]。
- 机会成本：延迟 #66/#67/#68 与其他 G1/S2 工作；占用业务/法务/数据/飞书管理员时间；持续维护、值班、恢复、供应商/数据许可管理。
- 隐性成本：采用失败、流程返工、过度建设商品化能力、后续迁移/退出。

### 8.2 集成（B）

- license + 实施 + 集成 + 培训 + 供应商管理 + 合同/安全审查 + 退出；本轮未抓取定价，不能给报价。
- 可能仍需薄的权利/飞书层；供应商锁定、导出限制、国家覆盖、功能 fit 都是成本。
- 时间价值可能更快，但依赖采购、安全、数据许可和供应商交付，不一定比自建快。

### 8.3 增强（A）

- 流程设计、模板、培训、审计、管理注意力；直接成本最低。
- 可能不 scale、不产生跨系统门禁、依赖人工纪律；长期可能积累技术债/表格 sprawl。

### 8.4 比较规则

1. 比较“关闭约束的总成本”，不比较功能数量或供应商热度。
2. 把产品/QA/安全/法务/业务/运营人日全部计入，不用工程空闲替代法务/人审。
3. 不把 license 费用与“零成本自建”比较；自建有工程、维护、机会成本。
4. 不使用供应商 ROI 案例作为 Momcozy 的 ROI 证据；案例是 C 级营销。
5. 记录假设、数据来源、有效期；外部等待和价格变化即重估。
6. 不以“AI/Agent”作为默认优势；只问是否解决已证实的约束。

## 9. 覆盖限制、失败访问与未决问题

### 9.1 失败/截断

- Shopify Collabs 两个官方帮助页均 403，各重试一次；没有正文，不能判断其能力、限制、国家可用性或 API。
- 未抓取任何定价页、API reference、安全/DPA、合同条款、demo 或社区讨论；价格不是本轮必需，但成本和权限结论受限。
- 未进行真人访谈、真实案例走查、供应商演示或 sandbox 测试；`human_gold_claim_count = 0`。
- 6 个不同官方页面上限导致只能深入两个供应商；这不是“市场上只有两个替代”。
- 供应商页面可能随时间变化；版本以访问日期代替，未锁定快照。

### 9.2 有意义限制

- **不能把“页面未文档化”写成“供应商没有”。** 权利证据、国家限制、API 权限、导出能力都可能是未读页面/合同中的内容。
- **不能把供应商营销当成采用/ROI/内部责任证据。** 本轮没有 Momcozy 使用任何工具的记录。
- **不能把 PMO 登记当成业务价值。** 25/20/15 是 C 级登记，不是运行结果。
- **不能把“人工流程假设”当现状。** 真实耗时/返工/权利事故未知。
- **不能把“权利是共同缺口”直接推成“必须自建”。** 缺口可能由法务/合同/流程解决。
- **不能把“API 存在”推成“集成可行”。** 需要 scope、权限、许可、导出、删除、国家与安全审核。

### 9.3 最强未决问题

**最近 3–5 个真实合作决定中，哪一个环节消耗了最多 elapsed time、造成了返工或权利事故，实际使用了哪些证据、哪些工具、谁做的决定？**

在这个问题有实测答案之前，buy / integrate / build / stop 的选择没有可靠依据；任何“Radar 必要”的结论都只是假设。

## 10. 来源登记（八字段）

`workspace` 统一为 `Radar/research`；`allowed_agents` 统一为 `this research/review only`。这是资料分类，不是外部平台授权。

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| SRC-B0-LOC-01 | C | `docs/research/2026-11-08-project-research-boundary.md` | 本项目研究 | 2026-11-08 | Radar/research | this research/review only | 不当作批准、实施、外联或部署授权 |
| SRC-B0-LOC-02 | C | `docs/research/2026-11-08-radar-decision-register.md` | 本项目研究 | 2026-11-08 | Radar/research | this research/review only | D01–D12 全部未批准；不据此采购/实施/上线 |
| SRC-B0-LOC-03 | C | `docs/research/2026-11-08-radar-research-calibration.md` | 本项目研究 | 2026-11-08 | Radar/research | this research/review only | 不把 C 级当 A 级；不继承旧项目状态/指标 |
| SRC-B0-LOC-04 | C | `docs/superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md` | 本项目规划 | 2026-11-08 | Radar/research | this research/review only | 不当作批准工期、预算、MVP 或实施指令 |
| SRC-B0-LOC-05 | C | `docs/research/2026-11-08-radar-pmo-business-capability-map.md` | 本项目研究 | 2026-11-08 | Radar/research | this research/review only | PMO 记录不证明采用、完成度、ROI 或内部责任 |
| SRC-B0-CIQ-01 | C | `https://www.creatoriq.com/influencer-marketing-solution` | CreatorIQ | 访问 2026-11-08（未发布版本） | Radar/research | this research/review only | 供应商营销；不证明 Momcozy 采用/ROI/API 权限 |
| SRC-B0-CIQ-02 | C | `https://www.creatoriq.com/influencer-marketing-solution/creator-search` | CreatorIQ | 访问 2026-11-08 | Radar/research | this research/review only | 同上；“direct API integrations”仅为供应商声明，不代表权限 |
| SRC-B0-IMP-01 | C | `https://impact.com/discover-recruit/` | impact.com | 访问 2026-11-08 | Radar/research | this research/review only | 供应商营销；不证明采用、合同可用或 API 权限 |
| SRC-B0-IMP-02 | C | `https://impact.com/performance/` | impact.com | 访问 2026-11-08 | Radar/research | this research/review only | 同上；客户引述不等于产品规格或 Momcozy 结果 |
| SRC-B0-SHOP-01 | D | `https://help.shopify.com/en/manual/promoting-marketing/collabs` | Shopify | 访问失败 2026-11-08（403） | Radar/research | this research/review only | 无页面内容；不得推断功能存在或缺失 |
| SRC-B0-SHOP-02 | D | `https://help.shopify.com/en/manual/promoting-marketing/collabs/merchants/managing-creators` | Shopify | 访问失败 2026-11-08（403） | Radar/research | this research/review only | 同上；不得推断功能存在或缺失 |

## 11. 输出契约

- **conclusion：** 本轮没有足够证据证明必须建设 Radar；也没有足够证据排除许可工具或流程增强。两个已核验供应商各覆盖部分链路，权利证据是共同未文档化缺口；Shopify Collabs 访问失败，不能评价。B0 应先做真实案例取证，再决定 buy/integrate/build/stop。
- **evidence：** 四份本地研究/规划文件与 PMO 能力图谱的定位章节；CreatorIQ 与 impact.com 各两个官方页面（C）；Shopify 两个官方帮助页 403（D）。所有供应商声明均为 C，不是采用/ROI/API 权限证据。
- **assumptions：** 当前人工流程按“表格/飞书 + 通用 LLM/manual evidence”假设；PMO 的窄口径合作业务是本次 B0 对象；首发不需要完整达人数据库或全网采集。
- **uncertainty：** 真实案例、耗时、返工、权利事故、工具使用、预算、owner、目标市场、数据许可、供应商价格/API/国家可用性、权利七元组定义全部未知。
- **confidence：** 对“现有证据不足以证明必须自建”和“供应商覆盖有限”有直接页面依据；对具体策略选择只有条件性判断，没有业务验证。
- **blocked_actions：** 不实施、不选型、不采购、不询价、不申请 demo、不登录、不联系达人、不调用凭证、不部署、不做 Git 操作、不把本文当批准。
- **next_human_action：** 后续由业务 owner 按实际任务和可得性提供近期脱敏案例，记录选择方式与覆盖限制，不预设数量、对象数或市场数。先还原耗时/返工/工具使用与实际决定；法务/数据仅对所需字段或用途提供相应证据路径，再讨论首发范围和能力获取方式。