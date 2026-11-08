# Momcozy Radar Agent 业务目标与能力图谱研究（PMO 一手材料核验）

- 研究日期：2026-11-08
- 研究对象：`pmo.luteos.com` 的 OGSM 战略骨架、14 个产品项目、49 项能力图谱、Radar 详情抽屉与同源数据 API；`magpie.luteos.com` 与 `radar.luteos.com` 的独立核验；Main / Source / Vicky / GEO / Daisy / 守衡与 Radar 的边界；飞书长连接官方约束。
- 文档性质：研究笔记（draft）。**本笔记不是 owner 批准，不构成立项、预算、上线或对外承诺。**
- 安全声明：未使用任何飞书凭证或密钥；未把用户提供的 App ID / App Secret 写入本笔记；未调用任何写接口；未初始化 git、未写业务代码、未部署、未发送消息、未改变任何外部状态。
- 当前项目事实：研究开始时`/Users/lute/Project/Radar-Agent`无产品代码、非Git；目前已有研究Markdown，仍无产品实现。所有20%为PMO自报，不代表本项目已有代码。
- 校准提示：本文保留原调查过程，证据等级及过宽推断以[研究校准](2026-11-08-radar-research-calibration.md)和[主计划](../superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md)为准。下文“五环节”、七元组字段反推、公开面无模块及登记Bot状态不能分别当完整性错误、正式schema、私有后台不存在或指定应用实测。

---

## 0. 结论摘要

1. **Radar 的 PMO 定位是明确的**：`G1 / S2` 下的 `Radar · IP/名人Agent&工作台`，业务链路为“粉丝分析 → 合作计划 → 动态监测 → 机会推荐”，工作台 URL 登记为 `https://magpie.luteos.com/`，当前自报 `20%`、`Stage 1 基座期`、状态“进行中”。
2. **“20%”不是完成度，也不是代码量**。PMO 的项目百分比等于其能力百分比的简单算术平均：Radar `20 = mean(25, 20, 15)`；S2 `30 = mean(13 项能力)`；G1 `41 = mean(19 项能力)`。同一算法可复现 G2 64、G3 74、S1 63、S3 65、S4 63、S5 68、S6 80。百分比可以随单个能力数值编辑而升降，不能当作挣值（Earned Value）或交付证据。
3. **Radar 三项能力没有任何 `evidence_url`**：`IP 合作计划制定` 25%（部分验证）、`全渠道动态监测` 20%（部分验证）、`合作机会识别` 15%（待验证）。PMO 全库 49 项能力中 34 项“已验证”，**34/34 都挂了 `evidence_url`**；Radar 为 0/3。按 PMO 自己的证据口径，Radar 没有任何一项达到“已验证”。
4. **`magpie.luteos.com` 的公开面不是 IP/名人工作台，而是“Short Video Factory”视频创作应用**：标题 `Short Video Factory — AI Multi-platform Distribution`，路由为 `/works`、`/library`、`/toolbox`、`/settings`、`/admin/dashboard`；没有达人四维分层、粉丝背调、授权七元组或 A-Gate 登记界面。
5. **`magpie`、`geo`、`video` 三个子域的公开面当前指向同一个视频应用**：三者 `/api/health` 均为 `version 2.0.0`，同样报告 `remotion.available=false`、`rendering service probe error`。PMO 却把 `geo.luteos.com` 登记为 GEO 工作台、`video.luteos.com` 登记为 Clone 工作台、`magpie.luteos.com` 登记为 Radar 工作台。**工作台 URL 的“在线”不能证明该项目的功能已实现。**
6. **`radar.luteos.com` 是 Echo · VOC 工作台，不是 Radar**：页面标题 `Momcozy & Reddit 舆情工作台`，展示 Reddit VOC、品牌健康度、负面 VOC 占比等；`/api/bot-kit/registry` 明确把 Echo 的 `workbench_url` 写为 `https://radar.luteos.com/`，把 Radar 写为 `https://magpie.luteos.com/`。两者不能混用。
7. **Radar 当前处于 Stage 1，且独立 @Radar 飞书 Bot 未上线**：`bot_live=false`、`kit_ready=true`、`required_gates=["A"]`。按 PMO 四阶标尺，“未打通独立飞书应用双向回调的能力，进度最高封顶 50%”；Radar 连 Stage 2 的门槛尚未进入，20% 是 Stage 1 的计划/SOP 导入进度。
8. **Radar 的业务核心不是“内容生成”，而是“达人资产 + 授权”的唯一登记源**：PMO 的跨 Agent 协议写明，Radar 是 `creator_id` 与“达人授权七元组”的唯一登记源；任何达人素材进入 Clone 二次剪辑或 Paid Media 广告投流前，必须校验 Radar 签发的有效授权状态。这使 Radar 成为下游投放的 A-Gate（授权门禁）控制点。
9. **当前 PMO 的 Radar 能力集不完整**：场景写了 5 个环节，注册能力只有 3 项；“粉丝分析”和“机会推荐”被标为“共用当前链路底座”，没有能力 ID、没有 owner、没有验收指标。必须在立项时决定：补注册为独立能力，还是显式折叠进 `IP 合作计划制定` 与 `合作机会识别`。
10. **最大风险不是技术，而是口径**：`magpie` 工作台错配、`200 在线` 可能只是 HTTP 200、20% 是简单平均、Stage 3 阈值未达到（SOP 候选为 4 次/周、1 次打回、35% 返工，而 PMO 规则是 ≥10 次/周或 ≥3 次打回、返工 <20%）——如果不在立项前纠正，后续所有“进度”和“验收”都会失真。

---

## 1. 证据分级与阅读方式

本笔记采用四级标注，避免把“网站声称”当成“已实现”：

| 级别 | 含义 | 本笔记中的典型来源 |
|---|---|---|
| **A** | 独立复现的事实（站点行为、TLS、HTTP、页面标题、路由、API 响应） | 我用独立浏览器/`curl`/`openssl` 实测的 `magpie`、`radar`、`geo`、`video` 站点 |
| **B** | 官方平台约束，或机器可读的一手记录 | 飞书开放平台官方文档；PMO `/api/backup.json`、`/api/bot-kit/registry`、`/api/gate/receipts` 的原始字段 |
| **C** | PMO 公开方法论/自报数据，未经 owner 批准 | PMO 页面、抽屉、报告、SOP 中的自述与百分比 |
| **D** | 本笔记提出的建议、假设、门槛、MVP 设计 | 所有“建议”“应”“建议门槛”“草案”内容 |

关键说明：

- **“Agent 评审”不是人类批准**。本笔记即使被其他 Agent 读取或引用，也不构成 owner 批准。
- PMO 的“已验证”在本笔记中按 PMO 自身口径引用，即 `verify_state=已验证` 且带 `evidence_url`；这不等于我独立验证了该能力的业务效果。
- 本文把所有“新建议”标为 **D**；所有“PMO 方法论陈述”标为 **C**；飞书平台约束标为 **B**；我独立复现的站点/证书/API 事实标为 **A**。

---

## 2. OGSM 定位：Radar 在哪个目标、哪条策略下

### 2.1 O（愿景）

PMO 首页页脚与首屏给出的唯一愿景原文：

> 【O】以品牌 Agent 全链路自动化，让声量有增长、口碑有防线、人效有提升。

来源：`https://pmo.luteos.com/`，首屏 `【O】` 文案；页脚“同源架构：1个愿景(O) → 3个目标(G) → 6条策略(S) → 14个Agent产品工作台 → 49项能力图谱”。

### 2.2 G1（目标）

> 【G1】加速品牌多渠道声量增长
> 覆盖社媒趋势、爆款脚本、公关媒体、AI 搜索可见度与 IP 名人合作，共 5 个产品项目

来源：`https://pmo.luteos.com/` 的 G1 卡片；`/api/backup.json → goals[code=G1]`。

G1 下 5 个项目：Emily（社媒）、Clone（爆款复刻）、Vicky（PR）、GEO（专家内容）、Radar（IP/名人）。G1 共 19 项能力，自报总进度 41%。

### 2.3 S2（策略）

> 媒体公关专家 + GEO专家 + IP/名人专家 融合，为品牌公共关系从核心媒体编辑跟踪、声量洞察、专家挖掘助力

来源：`https://pmo.luteos.com/` 的 S2 卡片；`/api/backup.json → strategies[code=S2]`。

S2 下 3 个项目：Vicky、GEO、Radar；共 13 项能力，自报总进度 30%。Radar 是 S2 中进度最低的项目（20%），也是 S2 平均值的下拉项之一。

### 2.4 Radar 的产品定位

PMO 给出的产品名是 `IP/名人Agent&工作台`，业务链路是：

> 粉丝分析 → 合作计划 → 动态监测 → 机会推荐

来源：`https://pmo.luteos.com/projects` 的 Radar 卡片；`DRAWER_PROJECTS.radar.scenarios`；`/api/backup.json → projects[slug=radar].scenarios`。

**关键缺口（C/D）**：PMO 没有给 Radar 单独写一个可量化的业务目标（例如“达人合作带来的 GMV / EMV / CPM / 样品转内容率 / 授权合规率”）。G1/S2 是定性目标；“20%”“25/20/15”只是能力百分比。**Radar 缺少 owner 批准的 M（Measure）**，这是立项前必须补的第一件事。

---

## 3. Radar 项目档案：抽屉原始字段

### 3.1 项目级字段

来源：`https://pmo.luteos.com/projects` 的 `DRAWER_PROJECTS.radar`；`/api/backup.json → projects[slug=radar]`（`updated_at=2026-11-05T10:18:06.904114Z`）。

| 字段 | 值 | 证据级 |
|---|---|---|
| `expert_name` / `product_name` | `Radar` / `IP/名人Agent&工作台` | B |
| `goal_code` / `strategy_code` | `G1` / `S2` | B |
| `status_summary` | `进行中` | B |
| `pct` | `20` | B |
| `workbench_url` | `https://magpie.luteos.com/` | B |
| `workbench_online` | `true` | B（注意：这是站点探活字段，不是功能验收） |
| `extra_sites` | 空 | B |
| `report_links` | 空字符串 | B |
| `updated_at` | `2026-11-05T10:18:06.904114Z` | B |
| owner（角色化） | 需求/数据架构；监测运营；算法研发（三人） | C |
| `verified_summary` | 见 3.2 | C |

### 3.2 `verified_summary` 原文（C）

> 【Wave 3 · 四阶真实进度 20%（处于 Stage 1 基座与 SOP 导入期）】工作台（magpie.luteos.com）在线，已导入 wiki 四维达人分层工作流（Expert/Editorial/Affiliate/Sponsored）与 Shopify 站外增长 SOP 的「creator_id + 授权七元组」风控模型；按四阶标尺，独立 @Radar 飞书应用回调（BD 在飞书查达人背调、点卡片登记寄样与二创授权到期）排在 Wave 3 交付。

这段文字包含三个可核验点：

1. “工作台在线”是否等于 Radar 功能在线？——**独立核验为否**，见第 4 节。
2. “已导入 wiki 四维达人分层”是否可在公开站点看到？——**公开面未见**；可能在私有 wiki/后台，未见 `evidence_url`。
3. “creator_id + 授权七元组”是否已定义？——**PMO 只给了名字，没有字段清单**；见第 6.3 节的草案。

### 3.3 指标卡（metrics）

| 指标 | 值 | 副标题 | 证据级 |
|---|---|---|---|
| 四阶真实进度 | `Stage 1 基座期 (20%)` | `Wave 3 接入独立Bot` | C |
| 工作台站点 | `200 在线` | `magpie.luteos.com` | C（语义存疑，见 4.6） |
| 达人分层工作流 | `4 类模型 / Wave-1 排序` | `wiki 仓库 pytest 通过` | C |
| 授权前置闸门 | `creator_id + 授权七元组` | `Shopify 站外增长 SOP` | C |

### 3.4 待补齐项（gaps）

原文：

> 【Stage 2 缺口】上线独立 @Radar 飞书应用，支持达人 BD 在飞书发主页链接直接回调生成粉丝/声量背调卡片与授权登记按钮
> 【Stage 3-4 缺口】统计 BD 高频询价与违约场景，自进化出达人筛选与到期催办 SOP 并固化至 magpie.luteos.com

这两条与 Task 文本中的 Stage 2 gap 完全一致，可确认任务描述来自 PMO 原始数据。

### 3.5 交接链（#17 / #18 / #19）

来源：`/projects` Radar 的 `support` 字段；`/api/backup.json → projects[slug=radar].support_notes`。

> 【Wave 3｜当前 Stage 1 基座期 (20%)｜甘特收口：2026-11-24 ~ 2026-12-23】
> 飞书Agent→工作台自进化交接链：需求/数据架构负责人于 12-05 前完成达人四维分层与 @Radar 飞书背调卡设计（#17 里程碑） → 监测运营负责人于 12-16 前打通寄样回收(≥60%)与授权到期(<5%)飞书催办卡（#18） → 算法研发负责人于 12-23 前将高频筛选条件自进化为合作推荐算法并迁入 magpie.luteos.com（#19）。

### 3.6 跨 Agent 交接协议（原文）

> 跨 Agent 交接协议（Radar → Clone / Paid Media）：Radar 是 `creator_id` 与达人授权七元组的唯一登记源；任何达人素材进入 Clone 二次剪辑或进入 Paid Media 广告投流前，必须校验 Radar 签发的有效授权状态。

这是 Radar 在整条链路中最重要的定位：**它不是“又一个内容工具”，而是达人身份与授权的登记源/门禁**。下游 Clone、Paid Media、Shopify 的投流动作都依赖它的 `rights_ref`。

---

## 4. 三项注册能力与 P1/P2/P3 接力

### 4.1 能力总表

来源：`/api/backup.json → capabilities[project_slug=radar]`；`/projects` 的 `DRAWER_PROJECTS.radar.caps`。

| ID | 能力 | 状态 | 验证状态 | 进度 | 起止日期 | 是否里程碑 | `evidence_url` |
|---:|---|---|---|---:|---|---|---|
| 66 | IP 合作计划制定 | 进行中 | 部分验证 | 25% | 2026-11-24 ~ 2026-12-05 | 是 | 空 |
| 67 | 全渠道动态监测 | 进行中 | 部分验证 | 20% | 2026-12-01 ~ 2026-12-16 | 否 | 空 |
| 68 | 合作机会识别 | 方案中 | 待验证 | 15% | 2026-12-08 ~ 2026-12-23 | 否 | 空 |

### 4.2 P1/P2/P3 接力细节

`DRAWER_PROJECTS.radar.caps[].relay_steps` 给出了每一步的 owner、权重、日期、交付物：

**能力 66 · IP 合作计划制定（里程碑）**

| 步骤 | 标题 | 日期 | 权重 | 进度 | 交付物（原文要点） |
|---|---|---|---:|---:|---|
| P1 | 需求调研 / 前端设计 / 数据架构 | 2026-11-24 ~ 11-27 | 30 | 83 | 产出该能力的数据表 Schema、飞书交互卡片原型与工作台 UI 组件 |
| P2 | 全栈开发 / 飞书Bot回调 / 算法研发 | 2026-11-28 ~ 12-02 | 40 | 0 | 实现全栈 API、独立飞书 Bot 双向回调与核心算法/自进化脚本 |
| P3 | 测试验收 / Agent运营 / 工作台推广闭环 | 2026-12-03 ~ 12-05 | 30 | 0 | 门禁测试（挂 `evidence_url`）、控制台高频统计（≥10 次/周）、向品牌市场部推广固化 |

**能力 67 · 全渠道动态监测**

| 步骤 | 日期 | 权重 | 进度 | 交付物要点 |
|---|---|---:|---:|---|
| P1 | 2026-12-01 ~ 12-05 | 30 | 67 | 数据表 Schema、飞书卡片原型、工作台 UI |
| P2 | 2026-12-06 ~ 12-11 | 40 | 0 | 全栈 API、飞书 Bot 双向回调、核心算法 |
| P3 | 2026-12-12 ~ 12-16 | 30 | 0 | 门禁测试、控制台高频统计、推广固化 |

**能力 68 · 合作机会识别**

| 步骤 | 日期 | 权重 | 进度 | 交付物要点 |
|---|---|---:|---:|---|
| P1 | 2026-12-08 ~ 12-12 | 30 | 50 | 数据表 Schema、飞书卡片原型、工作台 UI |
| P2 | 2026-12-13 ~ 12-18 | 40 | 0 | 全栈 API、飞书 Bot 双向回调、核心算法 |
| P3 | 2026-12-19 ~ 12-23 | 30 | 0 | 门禁测试、控制台高频统计、推广固化 |

### 4.3 进度快照：从 10/5/0 到 25/20/15

来源：`/api/backup.json → snapshots[]`（三份快照，`payload_json` 内为 49 项能力）。

| 快照 | 能力 66 | 67 | 68 | 三能力均值 | 全库总进度 | 已验证数 |
|---|---:|---:|---:|---:|---:|---:|
| 2026-11-02 16:07 | 10%（方案中/待验证） | 5%（方案中/待验证） | 0%（方案中/待验证） | 5（(10+5+0)/3） | 66% | 31 |
| 2026-11-03 02:59 | 10%（方案中/待验证） | 5%（方案中/待验证） | 0%（方案中/待验证） | 5（(10+5+0)/3） | 66% | 31 |
| 2026-11-06 01:00 | 25%（进行中/部分验证） | 20%（进行中/部分验证） | 15%（方案中/待验证） | 20（(25+20+15)/3） | 58% | 34 |

这条时间线很关键：**11-06 三项能力从 10/5/0 跳到 25/20/15，项目从 5% 跳到 20%，但 `evidence_url` 仍为空、`report_links` 仍为空、`business_actions` 中没有 Radar。** 这更像是一次计划/排期/口径调整，而不是一次可复现的交付。

注意：早期快照的 `payload_json` 只记录能力值，不记录项目字段；上表的“三能力均值”是我按当前口径复算的参照值，不是 PMO 当时显示的项目百分比。这里只引用快照内的能力值，避免把未同步的项目字段当成事实。

### 4.4 审计流水：排期被改过

来源：`https://pmo.luteos.com/api/audit-logs?limit=200`，Radar 相关 5 条：

| 时间 | 能力 | 变更 | 来源 |
|---|---|---|---|
| 2026-11-03 11:02:20 | IP 合作计划制定 | 负责人：达人与IP组 → 需求/数据架构 + 算法研发 | 飞书表同步 |
| 2026-11-03 11:02:20 | IP 合作计划制定 | 排期截止：待排期 → 2026-11-06 | 飞书表同步 |
| 2026-11-03 14:47:44 | IP 合作计划制定 | 排期截止：2026-12-05 → 2026-11-06 | 飞书表同步 |
| 2026-11-03 14:47:44 | 全渠道动态监测 | 排期截止：2026-12-15 → 2026-11-06 | 飞书表同步 |
| 2026-11-03 14:47:44 | 合作机会识别 | 排期截止：2026-12-22 → 2026-11-16 | 飞书表同步 |

而当前能力 66 的描述又写“已从原11-06调入Wave 3”，当前日期是 2026-11-24 ~ 12-05。**说明 Radar 的排期在 11-03 被短暂提前到 11-06/11-16，随后又整体调回 Wave 3（11-24 起）。** 这是计划不稳定性的直接证据，也说明“日期”不能当作承诺，除非 owner 重新确认。

### 4.5 SOP 候选：阈值未达到

来源：`https://pmo.luteos.com/sop` 的 `P0-1 自进化实时漏斗`；`/api/backup.json → sop_candidates[id=11]`。

| 字段 | 值 |
|---|---|
| 项目 / 专家 | Radar |
| Wave | Wave 3 |
| 主题 | 达人BD查询候选IP四维分层背调、报价区间与二创投流授权七元组 |
| 周提问数 | **4 次/周** |
| 人工打回 | 1 次 |
| 返工率 | **35%** |
| 当前阶段 | Stage 1 |
| 目标工作台 SOP | `magpie.luteos.com Wave-1 达人背调台账与寄样/授权到期监控` |
| 截止日 | 2026-12-05 |
| owner | 需求/数据架构负责人 |

按 PMO 自己的 Stage 3 规则，触发自进化需要 **“提问 ≥10 次/周 或 人工打回 ≥3 次”**，且返工率 **<20%**。Radar 当前是 **4 次/周、1 次打回、35% 返工**，**三项都不满足**。这意味着：

- 即使 12-05 交付了“背调卡”，也还不具备进入 Stage 3 的需求密度；
- 12-05 的 SOP 候选更像“计划中的候选”，不是“已满足阈值、可晋升”的候选；
- 如果要按 PMO 节奏推进，必须先设计“需求侧运营”（让 BD 真的每周在飞书问 ≥10 次），否则 Stage 3 无法自证。

### 4.6 `measuredActions=0`

来源：`/api/backup.json → business_actions[]` 共 6 条，项目为 Echo、守衡、Shopify、Emily、Vicky、Market；**没有 Radar**。

PMO 的 `P0-3 解决 measuredActions=0` 账本明确把“品牌市场部在飞书卡片点击认领/批准发布并自动回写经营结果”作为 L4 证据。Radar 目前没有任何业务动作回写，因此：

- Radar 的业务价值尚未被 `measuredActions` 证明；
- 20% 不能说明业务已采纳；
- 立项后必须把“至少 1 条/周的 measuredAction”纳入验收，否则会重复 PMO 已经指出的 `measuredActions=0` 问题。

---

## 5. 百分比口径：简单平均，不是挣值

### 5.1 可复现的算术恒等式

我用 `/api/backup.json` 的 49 项能力原始 `progress_pct` 做了逐级复算：

| 层级 | 计算 | 结果 | PMO 显示 |
|---|---|---:|---:|
| Radar 项目 | mean(25, 20, 15) | 20.00 → 20 | 20 |
| S2 策略 | mean(13 项能力) = 390/13 | 30.00 → 30 | 30 |
| G1 目标 | mean(19 项能力) = 770/19 | 40.53 → 41 | 41 |
| G2 目标 | mean(17 项能力) = 1085/17 | 63.82 → 64 | 64 |
| G3 目标 | mean(13 项能力) = 965/13 | 74.23 → 74 | 74 |
| S1 | mean(6 项能力) | 63.33 → 63 | 63 |
| S3 | mean(6 项能力) | 65.00 → 65 | 65 |
| S4 | mean(11 项能力) | 63.18 → 63 | 63 |
| S5 | mean(6 项能力) | 67.50 → 68 | 68 |
| S6 | mean(7 项能力) | 80.00 → 80 | 80 |

**结论：PMO 的百分比是“能力百分比的简单平均（四舍五入）”，没有按业务价值、工作量、风险或证据强度加权。** 这意味着：

- 把某一项能力从 15% 改成 25%，项目百分比就会上升；这不等于交付增加。
- Radar 的 20% 恰好等于三项能力的平均值，不能解释为“完成了 20% 的工作”。
- S2 的 30% 也被 Radar 的 20% 拉低；提高 Radar 的“数字”会直接提高 S2/G1 的数字，但这只是算术，不是业务结果。

### 5.2 “已验证”的真实门槛

来源：`/api/backup.json → capabilities[]` 统计。

| 验证状态 | 数量 | 带 `evidence_url` 的数量 |
|---|---:|---:|
| 已验证 | 34 | **34** |
| 部分验证 | 12 | **0** |
| 待验证 | 3 | **0** |

**PMO 的“已验证”在实践中等于“挂了 evidence_url”**；没有 evidence_url 的能力最多是“部分验证/待验证”。Radar 三项全部为空，因此 0/3 已验证。

### 5.3 “200 在线”是什么

来源：`https://pmo.luteos.com/api/ping-sites`，`checked_at=2026-11-08 10:14:28 UTC`，`total=24, online=24`，其中：

```json
"https://magpie.luteos.com/": {"url":"https://magpie.luteos.com/","ok":true,"code":200,"ms":26}
```

这说明“在线”是 **HTTP 200 探活**，不是“200 个用户在线”，也不是“200 项功能可用”。Radar 指标卡的“工作台站点 200 在线”应理解为“站点返回 HTTP 200”。**把“200 在线”当作工作台被业务使用的证据是错误的。**

---

## 6. 独立核验：`magpie.luteos.com` 与 `radar.luteos.com`

### 6.1 `magpie.luteos.com`：公开面是视频创作应用

我在独立隔离上下文打开 `https://magpie.luteos.com/`，并检查了公开路由与 API：

| 核验项 | 结果 | 证据级 |
|---|---|---|
| 页面标题 | `Short Video Factory — AI Multi-platform Distribution` | A |
| 首屏品牌 | `Momcozy` / `路特创新视频创作平台` | A |
| 公开导航 | 首页、我的作品 `/works`、资产库 `/library`、工具箱 `/toolbox`、设置 `/settings`、管理后台 `/admin/dashboard` | A |
| 工具箱标题 | `AI 视频工具箱` | A |
| 作品页标题 | `我的作品` | A |
| 创作类型 | 商品直拍、品牌宣传片、网红二创带链接、实拍素材生成、品牌VLOG、快速模式 | A |
| `/api/health` | `status=ok, version=2.0.0`；`remotion.available=false`；`rendering service probe error: [Errno -2] Name or service not known`；`persistence.backend=postgresql, healthy`；`media_tools.ytdlp/whisper/clip` 可用 | A |
| `/api/admin/auth/session` | `401` | A |
| `/api/portfolio/brand-presets?brand=momcozy` | `401` | A |
| TLS 证书 | `subject=CN=lute-tlz-dddd.top`；SAN 列表不含 `magpie.luteos.com`；`curl` 默认校验失败 | A |
| 达人四维分层 / 授权七元组 / A-Gate | **公开页面与公开路由未发现** | A |

补充交叉核验：`https://geo.luteos.com/` 与 `https://video.luteos.com/` 的页面标题同样是 `Short Video Factory — AI Multi-platform Distribution`，三者的 `/api/health` 返回完全相同的 `version=2.0.0` 与相同的 `remotion` 报错。**这说明 `magpie`、`geo`、`video` 当前指向同一个视频应用，而不是三个项目各自的工作台。** PMO 把三者分别登记为 Radar、GEO、Clone 的工作台，存在明显的映射完整性问题。

需要保留的不确定性：`magpie` 的 `/admin` 与登录后区域可能需要认证，我没有登录，也没有访问私有数据；因此不能 100% 排除“后台另有达人模块”。但就公开面、公开路由、公开 API 与健康检查而言，**没有证据支持“magpie 是 Radar 的达人背调/授权工作台”**。

### 6.2 `radar.luteos.com`：Echo · VOC 工作台

我在独立隔离上下文打开 `https://radar.luteos.com/`，页面标题为 `Momcozy & Reddit 舆情工作台`；首屏包含：

- `真实数据概览`、`核心经营指标`、`四类经营决策入口`、`优先行动`；
- `26,382 帖子 · 103,307 关联评论`；
- `负面 VOC 占比 6.05%`、`品牌健康度指数 76.14`；
- `Momcozy`、`Reddit`、`VOC`、`eufy` 竞品语境等。

这与 Echo 的 VOC 能力完全一致。`/api/bot-kit/registry` 也明确写明：

```json
{"slug":"echo","workbench_url":"https://radar.luteos.com/","bot_live":true}
{"slug":"radar","workbench_url":"https://magpie.luteos.com/","bot_live":false}
```

**结论：`radar.luteos.com` = Echo VOC；`magpie.luteos.com` = PMO 登记的 Radar 工作台（但公开面是视频应用）。两者绝不能混用。** 任何把 `radar.luteos.com` 当作 Radar 工作台、或把 Echo 的 VOC 指标当作 Radar 达人指标的做法，都会造成严重口径错误。

### 6.3 对“工作台在线”的处理建议

- 在 Radar 立项文档中，把 `magpie.luteos.com` 标注为“PMO 登记的 URL，公开面未验证为 Radar 功能”；不要把 `workbench_online=true` 当作功能验收。
- 如果决定复用 `magpie`，必须先回答：它是“共享视频应用 + Radar 模块”，还是“需要新建独立 Radar 工作台”？见第 12 节 Q3。
- 如果新建工作台，建议不要沿用 `magpie` 这个域名，以免与视频应用混淆；或者明确把 `magpie` 重命名为 Radar 专属应用，并迁移视频功能到 `video`。

---

## 7. 业务任务 → 能力 → 输入/输出 → 下游

### 7.1 场景链路与 MECE 缺口

PMO 的场景是 5 个环节：

```
粉丝分析 → 合作计划 → 动态监测 → 机会推荐
```

但注册能力只有 3 项：

```
IP 合作计划制定（25%） / 全渠道动态监测（20%） / 合作机会识别（15%）
```

其中：

- “粉丝分析”没有独立能力 ID，页面显示“共用当前链路底座 (20%)”；
- “机会推荐”也没有独立能力 ID，页面显示“共用当前链路底座 (20%)”；
- 只有“合作计划”“动态监测”“机会识别”有 ID、owner、日期、验收描述。

**这是一个 MECE 缺口（C/D）**：如果“粉丝分析”是“合作计划”的输入，应该把它的验收并入能力 66；如果它是独立能力，应该补注册 ID、owner、指标。否则项目会出现“场景写了、能力没注册、验收没人负责”的黑洞。

### 7.2 业务任务映射表（D：本笔记整理；C：PMO 原文）

| 业务任务 | 对应能力 | 输入 | 处理 | 输出 | 下游 | 验收（PMO 给定 / 建议） |
|---|---|---|---|---|---|---|
| 达人发现与粉丝/声量背调 | 未注册（“粉丝分析”） | BD 在飞书发的达人主页链接、平台、账号；Source 采集的粉丝/互动/内容数据；历史合作记录 | 解析平台与 `creator_id`；拉取粉丝规模、互动率、受众匹配、内容调性、报价区间；四维分层（Expert/Editorial/Affiliate/Sponsored） | 粉丝/声量背调卡；分层结果；风险提示；建议报价 | `IP 合作计划制定`、BD | PMO：无独立指标。建议：20 个 golden set 达人，字段完整率 ≥90%，`creator_id` 唯一率 100% |
| IP 合作计划制定 | 66 | 背调卡、品牌 Brief、预算、目标市场、合规要求 | 生成合作计划：达人组合、内容方向、报价、排期、寄样、授权类型 | 合作计划卡；寄样/授权登记按钮；A-Gate 草稿 | Clone（二创）、Paid Media（投流）、守衡（C-Gate） | PMO：25% 部分验证、无 evidence_url。建议：P95 卡片生成 ≤10s；BD 采纳率 ≥80%（20 个 golden set） |
| 合作执行与寄样/授权登记 | 66 + 67 | 合作计划、寄样地址、授权七元组、Spark Ads code | 登记 `creator_id`；登记授权范围/期限/渠道；触发寄样；跟踪回收 | 授权登记回执；寄样状态；到期提醒 | Radar 自身、Clone、Paid Media | PMO：寄样回收 ≥60%；授权到期预警 <5%。建议：授权七元组完整率 100%；A-Gate 拦截未授权素材 100% |
| 全渠道动态监测 | 67 | Source 的 TikTok/IG/YouTube/Facebook/Reddit/Google Trends 数据；达人账号；合作内容 | 监测粉丝变化、互动、内容发布、竞品动作、声量异动；匹配 `creator_id` | 监测看板；异动卡片；催办卡；到期预警 | BD、Clone、Paid Media、Vicky/Signal（视异动类型） | PMO：20% 部分验证、无 evidence_url；寄样回收 ≥60%；授权到期预警 <5%。建议：数据新鲜度 ≤24h；误报率 <10% |
| 合作机会识别 | 68 | 历史合作表现、粉丝/声量、竞品合作、TikTok Affiliate 准入、报价、BD 筛选条件 | 识别可合作/可续约/可加投的达人；排序；解释信号 | 机会推荐卡；Top-N 列表；下一步动作 | BD、Paid Media、PMO（measuredActions） | PMO：15% 待验证、无 evidence_url。建议：precision@10 ≥0.6 或 BD 采纳率 ≥30%；每条推荐 ≥3 个信号 + 来源链接 |
| 机会推荐/续约/到期管理 | 未注册（“机会推荐”） | 机会卡、授权到期、合作表现、预算 | 续约/加投/到期提醒；违约/到期升级 | 续约建议；到期清单；违约工单 | BD、法务、Paid Media | PMO：无独立指标。建议：0 个未授权续约；到期前 30/60/90 天提醒覆盖率 100% |

### 7.3 输入清单（D，按 MVP 最小集）

**必须输入**

- 达人主页 URL（TikTok / Instagram / YouTube 优先）；
- 平台 + 账号 handle + 稳定 `creator_id`；
- 粉丝数、互动率、近期内容、受众画像（能拿到多少算多少，缺失要显示“缺失”）；
- 报价区间（BD 输入或历史合同）；
- 合作类型（寄样 / 付费 / 联盟 / Spark Ads / 二创）；
- 授权七元组（见 7.5）；
- 品牌/市场/品类/预算约束；
- 合规要求（FTC 披露、平台规则、母婴/健康宣称边界）。

**可选输入**

- 历史合作记录、寄样记录、内容表现、转化数据；
- 竞品合作达人；
- TikTok Affiliate 准入状态；
- 内容风格/调性标签；
- 风险信号（违规史、假粉、受众错配）。

### 7.4 输出清单（D）

- **粉丝/声量背调卡**：四维分层、粉丝规模、互动率、受众匹配、内容调性、报价区间、风险提示、数据来源与时间戳。
- **授权登记卡**：`creator_id`、授权类型、范围、渠道、期限、证据引用、A-Gate 回执。
- **寄样/到期催办卡**：寄样状态、回收率、到期前 30/60/90 天提醒、违约升级。
- **机会推荐卡**：Top-N 达人、推荐理由、信号、预期动作、优先级。
- **工作台台账**：达人库、合作计划、授权台账、监测看板、机会漏斗。

### 7.5 “授权七元组”草案（D，必须由法务/守衡/业务确认）

PMO 只写了“creator_id + 授权七元组”，**没有给出七个字段的定义**。从 `/api/gate/receipts` 的 A-Gate 回执可以反推出至少这些要素：

```json
{
  "receipt_id": "ast-creator-remix-00512@1#A-0001",
  "gate_type": "A",
  "subject_id": "ast-creator-remix-00512",
  "rule_refs_json": [
    "rule-tiktok-shop-creator-asset-sources-us-review@1",
    "rule-tiktok-shop-reedit-scope-us-review@1"
  ],
  "evidence_refs_json": ["<Spark Ads 授权码凭据，已脱敏>"],
  "market_overlay_version": "overlay-us-tiktok-shop@1",
  "valid_until": "2027-03-31",
  "invalidate_on_json": ["content_hash_change", "claim_version_change", "rule_version_change", "rights_revoked", "expired"],
  "judged_by": "守衡×Radar-RightsGate@v2.1"
}
```

据此建议的七元组（草案，D）：

1. `creator_id`：平台 + 稳定账号 ID（不是 handle，handle 会变）。
2. `platform_account`：平台、handle、主页 URL、账号归属。
3. `asset_ref`：被授权的内容/素材 ID（视频/帖子/图片），以及 `content_hash`。
4. `authorization_type`：Spark Ads / 白名单 / 二创 / 自然转发 / 联盟带货。
5. `scope`：市场/地区、渠道、付费/自然、时长、排他性。
6. `evidence_ref`：合同/邮件/平台授权码（如 `cred-ttam_spark_code`）/截图的可核验引用。
7. `validity`：`valid_from` / `valid_until` / 撤销状态（`rights_revoked`）。

**验收建议（D）**：七元组完整率 100%；A-Gate 对未授权素材拦截率 100%；授权到期前 30/60/90 天提醒覆盖率 100%；授权撤销后 1 小时内下游 `rights_ref` 失效。

---

## 8. 上下游边界：Main / Source / Vicky / GEO / Daisy / 守衡

### 8.1 边界总表

| Agent | 与 Radar 的边界 | Radar 消费/提供 | 证据级 | 对 Radar 的影响 |
|---|---|---|---|---|
| **Main** | 工程底座与飞书 Bot 脚手架 | 复用 `apps/bot-gateway` 的长连接/回调/幂等/会话模板；复用 `packages/feishu` 的事件归一化与卡片能力 | C（Main 报告） | 降低 @Radar Bot 的从 0 开发成本；但 Radar 仍需自己的业务卡片与 A-Gate |
| **Source** | 统一采集平台（70 平台 / 284 端点 / 39 MCP 工具） | 达人账号、内容、评论、粉丝/互动、竞品、趋势数据 | C（Source 报告） | 数据覆盖是 Radar 的前提；但 Source 的 creator 级数据有明确限制（见 8.2） |
| **Vicky** | PR / earned media（媒体编辑、权威报道、舆情工单） | Radar 不消费 Vicky 的媒体库；双方可能在“Editorial”层重叠 | C（Vicky 项目卡） | 必须定义“媒体编辑”vs“达人/名人”的边界，避免重复触达与归属冲突 |
| **GEO** | AI 搜索可见度（Perplexity/ChatGPT/Rufus 问句与引用） | Radar 不直接消费 GEO；共享 BrandOS 315 SKU 事实与品牌口径 | C（GEO 项目卡） | 仅在内容 Brief/事实引用上有弱依赖；不是 Day-1 依赖 |
| **Daisy** | 多智能体统一入口/路由/知识库 | Radar 的飞书高频问答日志未来接入 Daisy Lane B；Radar 可被 Daisy 路由调用 | C（Daisy 项目卡） | Stage 3-4 的跨 Agent 路由依赖；不是 Day-1 依赖 |
| **守衡** | Claim Gate / Launch Gate / 合规规则 | Radar 提供 `rights_ref`；守衡提供 `claim_evidence_refs`；A-Gate 回执由“守衡×Radar-RightsGate”联合签发 | B/C（gate receipt + 项目卡） | **强依赖**：达人素材进入投放前必须双签（授权 + 宣称证据） |
| **Clone / Paid Media** | 二创与投流 | 消费 Radar 的 `creator_id` + 授权七元组 + `rights_ref` | C（botkit/交接协议） | Radar 是上游门禁；A-Gate 不通过则下游不能投放 |
| **Shopify** | 独立站/落地页/库存 | 投流前校验落地页 JS 负载与 SCM 库存；Radar 提供达人授权状态 | C（sites 链 4） | Radar 与 Shopify 同为 Paid Media 的前置门禁 |
| **PMO** | OGSM/甘特/证据/measuredActions | Radar 上报进度、evidence_url、measuredActions；PMO 做 90 天裁决 | B/C | Radar 的“已验证”与续投/关停由 PMO 口径决定 |

### 8.2 Main：可直接复用的 Bot 参考架构

来源：`https://pmo.luteos.com/reports-view/Main/Main-项目成果总结-20261101.html`（C 级，但细节具体）。

Main 报告给出的 `apps/bot-gateway` 设计：

- 双模式：**WebSocket 长连接（默认）+ HTTP webhook（`POST /events`）**；
- 事件序列：验签/解密 → 归一化 → 幂等（`event_id`，TTL 10 分钟）→ 准入 → per-chat 队列（全局并发 2、同群串行、**3 秒内回执**）→ `agent.answer()` → 回复失败降级；
- thread session：SQLite 持久化，TTL 30 分钟，最近 6 轮；
- CLI：doctor / configure / authorize / eval；
- 45 个 bot-gateway 测试 + 24 个 `packages/feishu` 测试；
- 已授权 scope：`im:message`、`im:message:send_as_bot`、`im:message.group_msg`、`im:message.p2p_msg`、`im:message:readonly`、`im:chat:readonly`；
- `im.message.receive_v1` 长连接；v1.0.5；长连接在线数 1。

**对 Radar 的直接价值（D）**：@Radar 不应该从零写飞书网关；应复用这套“长连接 + 3 秒回执 + 幂等 + per-chat 队列 + 卡片回调”的骨架，把 Radar 的业务处理放在 `agent.answer()` 之后。Main 报告还给出了工程质量纪律：`pnpm test` 验证代码（零模型调用）+ eval run 验证判断（真模型、花钱、行为变更时跑）；**单测绿不等于完成**。这应成为 Radar 的验收纪律。

### 8.3 Source：数据覆盖有，但 creator 级数据有硬限制

来源：`https://pmo.luteos.com/reports-view/Source/Source-项目成果总结-20261031.html`（C 级，2026-10-31 快照）。

Source 的规模：

- 70 平台 / 312 能力视图 / 284 唯一端点；
- 200 verified / 57 config-gated / 12 degraded / 10 empty / 4 untested / 1 disabled；
- 39 个 MCP 工具（23 基础 + 16 TikTok）；
- TikTok：16 工具 / 21 张 canonical 表；
- 数说飞书 Bot：3 秒回执 + BackgroundTasks；`event_id` TTL 600 秒、容量 1024；mention 闸门“私聊放行；群聊只认精确 @ bot 的 open_id”。

**与 Radar 直接相关的限制**（Source 报告“已知边界”原文要点）：

- `商品到视频完整列表`：**阻塞**，创作者 Cookie 未配置，端点返回 `no login`；
- `评论到视频关联`：**阻塞**，0 行，两侧都没有 join key；
- `字幕、音轨、画面分析`：**未开始**（`transcript_or_audio=0`）；
- TikTok 2 个商品关系工具受创作者 Cookie 门控，缺 Cookie 时返回 `credential_required`；
- 3 个已下架 Apify Actor 仍对应 6 个端点行（amazon-bsr、1688、aliexpress），调用随时可能停止；
- 57 个 config-gated 端点需要凭据/自建服务/外访策略。

**结论（D）**：Radar 不能假设“Source 已有完整达人画像/粉丝数据”。MVP 必须明确：

1. 哪些字段来自 Source 的公开采集（粉丝数、互动、内容）；
2. 哪些字段必须由 BD 手工输入（报价、合作类型、授权）；
3. 哪些字段必须走官方授权（TikTok Shop/TTAM、Spark Ads code、创作者 Cookie）；
4. 哪些字段在 MVP 中直接标“不可得”，不编造。

### 8.4 Vicky：PR 媒体编辑 vs Radar 达人/名人

Vicky 的项目卡（C）：

- 上线报道总数 347 条（Earned 77%）；
- 媒体资源库 246 家（S 级报道 100 条）；
- 7 表 × 16 能力矩阵；
- 业务链路：竞品监测 → 风险预警 → 工作台协同；舆情线：看板对话化 → 自动分类 → 工单闭环；
- 跨 Agent：Vicky 收录的 100 条 S 级权威媒体评测报道同步至 GEO；GEO 缺口反推 Vicky 攻关。

**边界建议（D）**：

- **Vicky = earned media / PR**：媒体机构、编辑、记者、权威榜单、报道；产出是报道/背书/公关工单。
- **Radar = creator/influencer/IP**：达人、专家型创作者、联盟带货、赞助内容、二创授权；产出是合作计划/背调卡/授权回执/机会推荐。
- **重叠点**：Radar 的四维分层中有 `Editorial`（编辑型创作者）与 `Expert`（专家型创作者），可能与 Vicky 的“媒体编辑/专家”重叠。必须在立项时定义：
  - 以“产出载体”区分：报道/媒体文章 → Vicky；社交账号内容/二创/带货 → Radar；
  - 以“付费关系”区分：earned（无付费）→ Vicky；paid/sponsored/affiliate（有付费或授权）→ Radar；
  - 以“授权对象”区分：媒体机构版权 → Vicky；创作者个人授权/二创 → Radar。
- 如果没有这个边界，BD 和 PR 可能对同一专家/编辑重复触达，或者都认为对方负责，导致授权登记缺失。

### 8.5 GEO / Daisy / 守衡

**GEO（C）**：AI 搜索可见度，Perplexity 5/5 提及（0/5 Best Overall），第 9 主键 `ai_answer_snapshot_id`，315 SKU × 16 类事实文件，20 问/ASIN。与 Radar 的直接交集很少；仅在“达人内容需要引用品牌事实/claim”时，可能共享 BrandOS 315 SKU 事实。**不是 Radar 的 Day-1 依赖。**

**Daisy（C）**：48 条星链路由、81 正式 Skill、1,054 算法 Skill、72 灵词 Hook、Lane B + Know 三道门禁。Radar 的飞书高频问答日志应在 Stage 3 接入 Daisy 的 Lane B/Know 蒸馏管线；Radar 也可以被 Daisy 路由调用。**这是 Stage 3-4 的依赖，不是 MVP 的依赖。**

**守衡（B/C）**：138 条规则、227/227 契约自证、两段式判定引擎、Launch Gate 104 COS 证据。`/api/gate/receipts` 中的 A-Gate 回执由 `守衡×Radar-RightsGate@v2.1` 联合签发，规则引用 `rule-tiktok-shop-creator-asset-sources-us-review@1` 与 `rule-tiktok-shop-reedit-scope-us-review@1`，证据引用为 Spark Ads 授权码凭据（已脱敏）。**这是 Radar 最强的下游依赖**：没有 A-Gate + C-Gate 双签，达人素材不能进入 Clone 二创或 Paid Media 投流。

---

## 9. 四阶标尺与 Radar 阶段判定

### 9.1 四阶定义（原文，C）

来源：`https://pmo.luteos.com/sop` 的“四阶真实进度评估标尺（0% → 100%）”。

| 阶段 | 区间 | 定义 | 主责配合 |
|---|---|---|---|
| Stage 1 | 0% → 25% | 工作台基座与初版 SOP：`*.luteos.com` 工作台 200 在线，完成核心数据表建模与初版固定 SOP 看板交付 | 需求/数据架构 + 全栈底座 |
| Stage 2 | 25% → 50% | 14 独立飞书 Bot 双向回调：每个专家独立飞书应用（WS 长连接 + Webhook），品牌市场部 @Agent 提需求，Agent 真实调用工具并回复可交互卡片（点按钮回调产生任务/改状态） | Bot 网关/工具 + 飞书控制台/测试 |
| Stage 3 | 50% → 75% | 高频问题统计与 SOP 自进化：自动统计提问 ≥10 次/周（或人工打回 ≥3 次）的高频问题，由 Agent 蒸馏为确定性业务 SOP 与自动化脚本，并通过三道门禁测试（返工率 <20%） | 高频统计运营/盲测 + 自进化管线 |
| Stage 4 | 75% → 100% | 迁移固化为工作台自动化能力：经 ≥2 周验证稳定的自进化 SOP 脚本，正式迁移固化为 Web 工作台上的自动化工位或定时流水线，自动产出业务结果 | 工作台工位固化/推广 + 验收签字 |

**硬门禁（原文）**：

> 未打通独立飞书应用双向回调的能力，进度最高封顶 50%。

### 9.2 Radar 的阶段判定

| 判定项 | 当前值 | 结论 |
|---|---|---|
| 项目阶段 | Stage 1 基座期 | 未进入 Stage 2 |
| `bot_live` | `false` | 独立 @Radar 飞书应用未上线 |
| `kit_ready` | `true` | 脚手架/配置已就绪，可开发 |
| `required_gates` | `["A"]` | 必须过 A-Gate |
| Stage 2 门槛 | 独立应用 + WS/Webhook + 真实工具调用 + 交互卡片 | **未满足** |
| Stage 3 门槛 | 提问 ≥10/周 或 打回 ≥3；返工 <20% | **未满足**（4/周、1 次、35%） |
| Stage 4 门槛 | ≥2 周稳定 + 迁移工作台 | 未开始 |

**判定（D）**：Radar 当前是“Stage 1 计划/SOP 导入”，不是“Stage 2 前夜”。20% 是 Stage 1 的低位，且没有证据；真正的 Stage 1 完成（25%）应以“可用的 Radar 工作台 + 核心数据表 + 初版 SOP 看板 + evidence_url”来证明，而不是以 `magpie` 的 HTTP 200 来证明。

---

## 10. 完整映射：OGSM → 业务任务 → 能力 → 可测验收 → 依赖 → MVP

### 10.1 主映射表（D：建议；C：PMO 给定）

| O/G/S | 业务任务 | 能力 | 可测验收 | 依赖 | MVP 波次 |
|---|---|---|---|---|---|
| O：Agent 全链路自动化；G1：加速品牌多渠道声量增长；S2：媒体公关 + GEO + IP/名人专家融合 | 达人发现与粉丝/声量背调 | 未注册（粉丝分析） | 20 个 golden set 达人 × 1 平台；字段完整率 ≥90%；`creator_id` 唯一率 100%；数据时间戳可见 | Source 采集（含限制）、官方 API/授权、BD 输入 | MVP-1 |
| 同上 | IP 合作计划制定 | 66 | 链接→背调卡 P95 ≤10s；卡片含四维分层/粉丝/互动/报价/风险；BD 采纳率 ≥80%；无 evidence 不得标“已验证” | Feishu Bot、Source/Main、品牌 Brief、法务 | MVP-1 |
| 同上 | 合作执行与寄样/授权登记 | 66 + 67 | 授权七元组完整率 100%；A-Gate 未授权拦截 100%；寄样回收 ≥60%；到期提醒覆盖 100% | 守衡 A/C-Gate、Clone/Paid Media、合同/法务 | MVP-2 |
| 同上 | 全渠道动态监测 | 67 | 数据新鲜度 ≤24h；误报率 <10%；授权到期 <5%；异动卡片可回写处置结果 | Source 6 平台、Signal（可选）、控制台运营 | MVP-2 |
| 同上 | 合作机会识别 | 68 | precision@10 ≥0.6 或 BD 采纳率 ≥30%；每条推荐 ≥3 信号 + 来源；time-to-shortlist -50% | 历史合作数据、TikTok Affiliate 准入、BD 反馈 | MVP-3 |
| 同上 | 机会推荐/续约/到期 | 未注册（机会推荐） | 0 个未授权续约；到期前 30/60/90 天提醒覆盖 100%；续约建议可解释 | 授权台账、BD/法务、Paid Media | MVP-3 |
| 横切 | 授权门禁与下游投放 | A-Gate（非独立能力，横切） | A-Gate 回执 100% 可追溯；`rights_revoked` 1 小时内下游失效；与守衡 C-Gate 双签 | 守衡、Clone、Paid Media、Shopify | MVP-1 起持续 |

### 10.2 建议的验收口径（D）

**功能验收**

- @Radar 在飞书群内被精确 @ 或 P2P 消息触发；3 秒内回执；卡片按钮可回调；失败可降级。
- 发送达人主页链接 → 返回背调卡；卡片包含：四维分层、粉丝数、互动率、受众匹配、内容调性、报价区间、风险提示、数据来源/时间戳。
- 卡片按钮：`登记授权`、`催寄样`、`标记到期`、`生成合作计划`、`加入机会池`。
- 工作台：达人库、合作计划、授权台账、监测看板、机会漏斗；每个能力挂 `evidence_url`。

**业务验收**

- 20 个 golden set 达人，BD 采纳率 ≥80%；
- 寄样回收 ≥60%；
- 授权到期率 <5%；
- `measuredActions` ≥1 条/周（试点期），≥5 条/试点结束；
- Stage 3 触发：连续 2 周提问 ≥10 次/周，或打回 ≥3 次；返工率 <20%。

**证据验收**

- 每个能力必须有 `evidence_url`（报告/看板/评测/回执）；
- 每个 A-Gate 回执必须有 `receipt_id`、`subject_id`、规则版本、证据引用、有效期、撤销条件；
- 每个“已验证”能力必须有独立复现记录，不能只靠 PMO 页面自报。

### 10.3 MVP 排序（Plan A：对齐 PMO 4 周，强约束）

| 阶段 | 时间 | 范围 | 交付物 | 退出条件 |
|---|---|---|---|---|
| Phase 0 | 2026-11-09 ~ 11-23 | 决策与契约：范围、平台、市场、A-Gate 七元组、数据来源、工作台归属、法务 | 一页纸立项书；A-Gate Schema v0；数据字典 v0；风险清单 | owner 签字；法务确认；Source/官方 API 可用性确认 |
| Phase 1 / PMO P1 | 11-24 ~ 12-05 | 1 平台（TikTok US）+ 20 个 golden set 达人 + @Radar Bot 骨架 + 背调卡 | Feishu 长连接 Bot；`creator_id` 注册表；背调卡；工作台达人库 v0 | 20 个达人可查；卡片可用；`evidence_url` v0；BD 试用 ≥5 人 |
| Phase 2 / PMO P2 | 12-06 ~ 12-16 | 授权七元组 + A-Gate + 寄样/到期催办 + 监测看板 v0 | 授权台账；A-Gate 回执；寄样/到期卡片；监测看板 | 寄样回收 ≥60%；授权到期 <5%；A-Gate 拦截 100%；与守衡/Clone 联调 |
| Phase 3 / PMO P3 | 12-17 ~ 12-23 | 机会识别 + 推荐卡 + 工作台 SOP + measuredActions | 机会卡；Top-N 列表；SOP 工位；回写账本 | BD 采纳率 ≥30%；`measuredActions` ≥1；PMO 证据挂接 |
| Post-MVP | 12-24 ~ 2027-01 | Stage 3 自进化 + Daisy 接入 + 多平台 | 高频问答统计；SOP 蒸馏；Daisy 路由 | 连续 2 周 ≥10/周；返工 <20%；≥2 周稳定 |

**Plan A 的现实性判断（D）**：在空仓库、无代码、无数据契约、无 A-Gate 定义的前提下，4 周完成“Bot + 背调 + 授权 + 监测 + 机会 + 工作台”是极高风险。建议把 Plan A 定义为“**薄切片演示**”：只做 1 平台、1 市场、20 个达人、3 类卡片、1 个工作台模块；不做全量 70 平台、不做自动合同、不做支付、不做无授权采集。若 owner 要求 12-23 必须“上线”，应明确这是“试点可用”，不是“生产全量”。

### 10.4 MVP 排序（Plan B：建议的重基线，8-10 周）

| 阶段 | 时间 | 目标 | 关键产出 |
|---|---|---|---|
| B0 | 11-09 ~ 11-23 | 决策/契约/数据可用性 | 立项书、A-Gate Schema、数据字典、法务意见 |
| B1 | 11-24 ~ 12-12 | 垂直切片：@Radar + 背调卡 + 达人库 | 可演示的端到端链路；20 个 golden set；eval 50 例 |
| B2 | 12-13 ~ 12-26 | 授权/寄样/到期 + A-Gate 联调 | A-Gate 回执；守衡/Clone/Paid Media 只读校验；试点 |
| B3 | 12-27 ~ 2027-01-16 | 机会识别 + 工作台 SOP + measuredActions | 机会卡；SOP 工位；业务回写 |
| B4 | 2027-01-17 ~ 01-30 | Stage 3 自进化 + Daisy | 高频统计；SOP 蒸馏；路由接入 |

**建议（D）**：把 PMO 的 12-05 / 12-16 / 12-23 作为“PMO 汇报里程碑”，把 B1/B2/B3 作为“真实交付里程碑”；两者可以映射，但不要用 PMO 日期倒逼未经验证的全量承诺。若必须单轨，选 Plan A 的薄切片，并在 11-30 T0 前做一次 go/no-go。

---

## 11. 风险与矛盾清单

| # | 风险/矛盾 | 严重度 | 证据 | 建议 |
|---|---|---|---|---|
| R1 | `magpie` 公开面是视频应用，不是 Radar 达人工作台；`magpie/geo/video` 同源同版本 | **Critical** | A：标题、路由、`/api/health` 三者一致 | 立项前确认工作台归属；不要把 `magpie` 当作 Radar 已实现 |
| R2 | Radar 三项能力 0 个 `evidence_url`、0 份报告、0 条 `measuredActions` | **Critical** | B：backup `evidence_url=""`、`report_links=""`、`business_actions` 无 Radar | 先补证据标准，再谈百分比 |
| R3 | 百分比是能力简单平均，不是挣值 | **High** | A/B：逐级复算 G1/G2/G3/S1-S6 | 在立项书里明确“进度≠完成度”；用里程碑/证据替代百分比 |
| R4 | Source 的 creator 级数据不完整：商品到视频阻塞、评论到视频 0 行、字幕/音轨未开始、创作者 Cookie 门控 | **High** | C：Source 报告“已知边界” | MVP 明确字段来源；不可得字段显示缺失；不编造 |
| R5 | “授权七元组”没有字段定义；A-Gate 法务/合规未确认 | **High** | C/B：PMO 只给名字；gate receipt 只给规则/证据引用 | 先定 Schema 与法务意见，再开发 |
| R6 | 4 周（11-24~12-23）对空仓库是极高风险 | **High** | A：项目根目录为空；PMO 日期 | 采用薄切片或重基线；设 11-30 go/no-go |
| R7 | Vicky（PR 媒体编辑）与 Radar（达人/名人，含 Editorial/Expert 层）边界未定义 | **Medium-High** | C：Vicky/Radar 项目卡；四维分层 | 以“earned vs paid/授权对象/产出载体”三条规则划界 |
| R8 | 飞书长连接有 3 秒处理、50 连接、集群随机单 client、仅自建应用等约束 | **Medium** | B：飞书官方文档 | 单应用单 client 或明确分片；ack 与业务处理分离；幂等 |
| R9 | `magpie` TLS 证书不匹配，普通浏览器可能告警 | **Medium** | A：`openssl` SAN 不含 `magpie.luteos.com` | 修证书或换域名；不要把 TLS 告警当成“已上线” |
| R10 | Stage 3 阈值未达到：4 次/周 vs ≥10，35% 返工 vs <20%，1 次打回 vs ≥3 | **Medium** | B/C：`sop_candidates[id=11]` | 设计需求侧运营；或把 12-05 定义为“候选”，不是“晋升” |
| R11 | 没有 Radar 的可量化业务 M（GMV/EMV/CPM/样品转内容率/授权合规率） | **Medium-High** | C：PMO 只有 G/S 定性 | owner 补 M；否则无法算 ROI |
| R12 | 达人数据/二创/Spark Ads 的平台条款、FTC 披露、母婴/健康宣称合规 | **Medium-High** | C/B：Source 报告、守衡规则、FTC 指南（未深读） | 法务前置审查；A-Gate 规则化 |
| R13 | 用户提供的飞书 App Secret 需要密钥管理；本笔记未写入 | **Medium** | 任务约束 | 用 secret manager/env；轮换；最小权限 |
| R14 | Source 覆盖 70 平台但 57 个 config-gated、12 degraded、10 empty；3 个下架 Actor 随时停 | **Medium** | C：Source 报告 | 为每个数据源设降级/替代方案；监控漂移 |
| R15 | PMO 排期被改过（11-06/11-16 → 11-24 起）；日期不稳定 | **Low-Medium** | B：`/api/audit-logs` | 以 owner 确认的基线为准；变更留痕 |

### 11.1 最需要纠正的三个口径

1. **“20%”不是“完成 20%”**：它是 `mean(25,20,15)`；没有 evidence_url。
2. **“工作台在线”不是“Radar 工作台可用”**：`magpie` 是视频应用；`ping-sites` 只测 HTTP 200。
3. **“radar.luteos.com”不是 Radar**：它是 Echo VOC；两个名字必须分开。

---

## 12. 假设与不确定性

1. PMO 数据为自报，未经 owner 批准；百分比、状态、日期都可能变化。
2. “200 在线”最可能是 HTTP 200 探活，但也可能是 PMO 文案的“200 个在线用户/站点”；当前证据更支持前者。
3. `magpie` 的私有后台/管理区可能存在达人模块；我没有登录，也没有访问私有数据，不能 100% 排除。
4. `magpie` 的 TLS 不匹配可能是反向代理/证书配置问题，也可能是环境特例；Chrome 自动化能加载，不代表普通用户浏览器不会告警。
5. Source 报告是 2026-10-31 快照；当前可能已变化；我没有重新跑 284 端点。
6. Radar 的 25/20/15 可能包含线下 wiki/SOP 导入工作；但没有 `evidence_url`，无法核验。
7. 飞书应用的实际权限/scope 未验证；我没有使用 App ID/Secret，也没有调用飞书 API。
8. “授权七元组”的字段是我从 A-Gate 回执反推的草案，不是 PMO 官方定义。
9. 本文的验收门槛（P95 ≤10s、采纳率 ≥80%、precision@10 ≥0.6 等）是建议值，需业务 owner 校准。
10. PMO 的 4 周日期可能是“汇报承诺”而非“工程承诺”；审计流水已显示日期被调整过。
11. 我没有阅读其他本地项目、凭证配置或无关浏览器标签；无法判断是否存在可复用的 Radar 代码。
12. 我没有验证 Lotus 站点的 `robots.txt`/ToS；本笔记只用于内部研究，不构成采集授权。

---

## 13. 阻塞动作与合规边界

本笔记执行过程中，以下动作被明确禁止或未执行：

- 未初始化 git、未提交、未写业务代码、未部署、未发消息、未注册身份、未改变任何外部状态。
- 未调用 PMO 的 POST/PUT/DELETE 接口：`/api/cap/{cap_id}/inline`、`/api/snapshot/save`、`/api/ingest/report`、`/api/sync-reports`、`/api/import.csv`、`/api/feishu/push-weekly`、`/api/feishu/events`、`/api/feishu/card-action`、`/api/feishu/command`、`/api/auto/collect-metrics`、`/api/feishu/sheet-sync`、`/api/auto/patrol`、`/api/feishu/push-member-todos`、`/api/sop/telemetry`、`/api/gate/evaluate`、`/api/gate/verify`、`/api/gate/hypothesis`、`/admin/*` 等。
- 未访问 `/admin`、`/login`；未使用任何账号登录。
- 未使用飞书 App ID/App Secret；未把 Secret 写入任何文件或提示词。
- 未抓取达人数据、未调用 Source 的采集端点、未访问私有 creator 数据。
- 未读取其他本地项目、`~/.claude` 凭证配置、其他会话的浏览器标签。
- 未修改共享的既有浏览器页面；所有浏览器操作在独立隔离上下文 `radar-pmo-research` 中进行。

---

## 14. 覆盖清单：已读 / 未读 / 不可达

| 区域 | 已读 | 未读 / 不可达 | 说明 |
|---|---|---|---|
| PMO 页面 `/` | 首屏 O/G/S、G1/G2/G3 卡片、S1-S6、Radar 卡片、指标、gaps、报告列表、页脚 | 部分内联弹窗/交互未逐一点开 | 文本与 `DRAWER_PROJECTS` 已抓取 |
| `/projects` | Radar 及 14 项目卡片、能力、交接链 | 其他项目抽屉未逐项精读 | Radar 已完整读取 |
| `/roadmap` | Radar 三条能力的 P1/P2/P3 日期、阶段、进度 | 其他项目甘特未逐行读 | 只取 Radar 相关 |
| `/sop` | 四阶定义、硬门禁、Radar 行、SOP 候选 11、P0-3 账本、岗位职责 | 其他 13 个 Bot 的 SOP 候选未逐条读 | Radar 相关已覆盖 |
| `/sites` | 6 条交接链、Radar 无附属子站、站点矩阵 | 其他站点详情未读 | 只取 Radar 相关链 |
| `/present` | 通过搜索读取 Radar 段落与 T0 文案 | 未逐页通读 10 页 PPTX 内容 | 不作为主证据 |
| `/docs` | Swagger UI 外壳 | `/docs/{name}` 具体文档未枚举 | 主要用 `/openapi.json` |
| `/openapi.json` | 全部路径/方法清单 | 请求/响应 schema 未逐项展开 | 只读 GET |
| `/api/backup.json` | goals/strategies/projects/capabilities/snapshots/audit_logs/sop_candidates/business_actions | 未导出/未保留原始大文件到项目目录 | 只在 `/tmp` 分析 |
| `/api/bot-kit/registry` | 14 个 Bot 的 workbench/gates/handoff/bot_live | 无 | 已完整读 |
| `/api/audit-logs` | 70 条，Radar 5 条 | 非 Radar 未逐条分析 | 只取 Radar |
| `/api/gate/receipts` | 5 条回执，A-Gate 1 条 | 无 | 已完整读 |
| `/api/ping-sites` | 24 站点，magpie 200 | 无 | 已完整读 |
| `/api/weekly-brief` | 周报 markdown | 无 | 已读 |
| `/api/backup.sql` | 未读 | 不可达/未尝试 | 可能含 PII，未需要 |
| `/api/export.csv`、`/api/export.pptx` | 未读 | 未下载 | 非研究必需 |
| `/admin`、`/login` | 未访问 | 需认证 | 不登录 |
| `magpie` 公开面 | 首页、`/works`、`/library`、`/toolbox`、`/settings`、`/admin/dashboard` 外壳、`/api/health`、401 API | `/admin` 登录后区域、私有作品、品牌预设数据 | 未登录 |
| `radar.luteos.com` | 首页/dashboard 公开数据 | 登录后/私有数据 | 只读公开页 |
| `geo` / `video` | 标题、`/api/health` | 业务页面未逐一读 | 用于同源交叉核验 |
| `social.luteos.com` | 标题 | 业务页面未读 | 用于对照 |
| Main 报告 | 全文 | 无 | 已读 |
| Source 报告 | 全文 | 无 | 已读 |
| Vicky / Echo / 守衡 / Daisy / Shopify / Emily 报告 | 未读 | 未读 | 与 Radar 边界不构成关键依赖；项目卡已读 |
| `main.luteos.com/data-layers.html` | 未读 | 未读 | 后续工程节点再读 |
| 飞书官方文档 | 长连接、回调、卡片回调 | 应用权限/审批/发布流程未逐页读 | 只验证长连接约束 |
| 其他本地项目/凭证/无关标签 | 未读 | 未读 | 任务禁止 |

---

## 15. 下一步需要人类决策的问题

1. **Radar 的边界**：`IP/名人` 是否只指达人/创作者（influencer/creator），还是也包括名人/明星/专家？与 Vicky 的媒体编辑/PR 如何划界？
2. **Radar 的业务 M**：G1 下 Radar 的可量化目标是什么？建议从“达人合作带来的 GMV/EMV、样品转内容率、授权合规率、合作周期缩短、CPM/CPA”中选 1-2 个 owner 认可的指标。
3. **工作台归属**：`magpie.luteos.com` 是共享视频应用，是否要新建 Radar 专属工作台？还是把 `magpie` 重命名/扩展为 Radar 应用，把视频功能迁到 `video`？
4. **数据来源**：达人粉丝/互动/内容数据用 Source 公开采集、官方 API（TikTok Shop/TTAM 等）、第三方数据商，还是 BD 手工输入？各自的法律/平台条款边界是什么？
5. **授权七元组**：七个字段的正式定义是什么？谁签发 A-Gate 回执？Radar 与守衡的责任边界？撤销后下游多快失效？
6. **日期**：PMO 的 12-05/12-16/12-23 是硬承诺还是汇报节点？是否接受 Plan A 薄切片，或采用 Plan B 重基线？
7. **验收证据**：Radar 的 `evidence_url` 标准是什么？报告、看板、eval、A-Gate 回执、`measuredActions` 哪些算？
8. **飞书应用治理**：App ID/Secret 由谁管理？scope 最小集是什么？长连接部署在哪？如何处理 3 秒回执、50 连接、单 client 随机接收？
9. **写入边界**：Radar 只做登记/提醒/推荐，还是可以自动签约/付款/发布？哪些动作必须人类点击确认？
10. **Stage 3 需求密度**：当前 SOP 候选只有 4 次/周、35% 返工；是先做需求侧运营（让 BD 每周问 ≥10 次），还是调整 PMO 阈值/阶段目标？

---

## 16. 建议的后续 deep research 节点

按用户要求“从需求调研到交付迭代的全链路”，建议把后续研究拆成 6 个节点，每个节点单独出笔记并做人类评审：

1. **飞书长连接与卡片回调技术方案**（B）：确认自建应用、WS 长连接、3 秒回执、`card.action.trigger`、幂等、限流、部署拓扑；参考 Main 的 bot-gateway。
2. **达人数据源与合规**（B/C）：Source 端点清单、TikTok Shop/TTAM、创作者 Cookie、FTC 披露、平台 ToS；输出字段可用性矩阵。
3. **A-Gate / 授权七元组契约**（D → owner 批准）：字段、规则、回执、撤销、与守衡 C-Gate 的双签流程；法务评审。
4. **Radar 工作台信息架构与原型**（D）：达人库、背调卡、合作计划、授权台账、监测看板、机会漏斗；与 `magpie` 的关系。
5. **MVP 工程方案与评测体系**（D）：参考 main.luteos.com 的 ADR/单源 schema/测试+eval 纪律；50-100 条真实评测；golden set 20 达人。
6. **运营 SOP 与 Stage 3/4 自进化**（D）：BD 提问模板、高频统计、返工率、SOP 蒸馏、Daisy 接入、measuredActions 回写。

---

## 附录 A：Radar 抽屉关键原始字段（摘录）

```json
{
  "slug": "radar",
  "expert": "Radar",
  "product_name": "IP/名人Agent&工作台",
  "goal_code": "G1",
  "strategy_code": "S2",
  "status_summary": "进行中",
  "pct": 20,
  "workbench_url": "https://magpie.luteos.com/",
  "extra_sites": [],
  "reports": [],
  "metrics": [
    ["四阶真实进度", "Stage 1 基座期 (20%)", "Wave 3 接入独立Bot"],
    ["工作台站点", "200 在线", "magpie.luteos.com"],
    ["达人分层工作流", "4 类模型 / Wave-1 排序", "wiki 仓库 pytest 通过"],
    ["授权前置闸门", "creator_id + 授权七元组", "Shopify 站外增长 SOP"]
  ],
  "gaps": [
    "【Stage 2 缺口】上线独立 @Radar 飞书应用，支持达人 BD 在飞书发主页链接直接回调生成粉丝/声量背调卡片与授权登记按钮",
    "【Stage 3-4 缺口】统计 BD 高频询价与违约场景，自进化出达人筛选与到期催办 SOP 并固化至 magpie.luteos.com"
  ],
  "caps": [
    {"id": 66, "name": "IP 合作计划制定", "status": "进行中", "verify_state": "部分验证", "pct": 25, "start_date": "2026-11-24", "end_date": "2026-12-05", "is_milestone": true, "evidence_url": ""},
    {"id": 67, "name": "全渠道动态监测", "status": "进行中", "verify_state": "部分验证", "pct": 20, "start_date": "2026-12-01", "end_date": "2026-12-16", "is_milestone": false, "evidence_url": ""},
    {"id": 68, "name": "合作机会识别", "status": "方案中", "verify_state": "待验证", "pct": 15, "start_date": "2026-12-08", "end_date": "2026-12-23", "is_milestone": false, "evidence_url": ""}
  ]
}
```

## 附录 B：事实与来源总表

| # | 事实/结论 | 来源（URL + 锚点） | 级别 | 核验方式/备注 |
|---:|---|---|---|---|
| 1 | O 愿景：“以品牌 Agent 全链路自动化，让声量有增长、口碑有防线、人效有提升。” | `https://pmo.luteos.com/` 首屏 `【O】` | C | 页面文本 |
| 2 | G1：“加速品牌多渠道声量增长”，覆盖 5 个项目 | `https://pmo.luteos.com/` G1 卡片；`/api/backup.json → goals[code=G1]` | C/B | 页面 + JSON |
| 3 | S2：“媒体公关专家 + GEO专家 + IP/名人专家 融合……” | `https://pmo.luteos.com/` S2 卡片；`/api/backup.json → strategies[code=S2]` | C/B | 页面 + JSON |
| 4 | Radar 定位：`IP/名人Agent&工作台`，链路“粉丝分析 → 合作计划 → 动态监测 → 机会推荐” | `https://pmo.luteos.com/projects`；`DRAWER_PROJECTS.radar.scenarios` | C/B | 页面 + JSON |
| 5 | Radar 20%、Stage 1、`magpie` 工作台、三能力 25/20/15 | `https://pmo.luteos.com/projects`；`/api/backup.json → projects[slug=radar]`、`capabilities[66..68]` | C/B | 页面 + JSON |
| 6 | Radar 三项能力 `evidence_url` 全空；`report_links` 空 | `/api/backup.json → capabilities[66..68]`、`projects[slug=radar]` | B | 原始字段 |
| 7 | Radar 无 `business_actions` | `/api/backup.json → business_actions[]` | B | 6 条动作无 Radar |
| 8 | Radar 交接链 #17/#18/#19 与 12-05/12-16/12-23 | `/projects` Radar `support`；`/api/backup.json → projects[slug=radar].support_notes` | C | 原文 |
| 9 | Radar 是 `creator_id` + 授权七元组唯一登记源；下游 Clone/Paid Media 必须校验 | `/projects` Radar `support`；“跨 Agent 交接协议” | C | 原文 |
| 10 | 百分比是能力简单平均：Radar 20 = mean(25,20,15)；S2 30；G1 41；G2 64；G3 74 | `/api/backup.json` 49 项能力复算 | A/B | 逐级算术复现 |
| 11 | 34/49 已验证，34/34 有 `evidence_url`；12 部分验证、3 待验证均无 | `/api/backup.json → capabilities[]` | B | 统计 |
| 12 | “200 在线”来自 `ping-sites` 的 HTTP 200 | `https://pmo.luteos.com/api/ping-sites` → `results["https://magpie.luteos.com/"]` | B | JSON |
| 13 | `magpie` 标题 `Short Video Factory`，公开路由 `/works` `/library` `/toolbox` `/settings` `/admin/dashboard` | `https://magpie.luteos.com/` 实测 | A | 浏览器 |
| 14 | `magpie` `/api/health` v2.0.0，remotion 不可用，persistence healthy | `https://magpie.luteos.com/api/health` | A | curl -k |
| 15 | `magpie`、`geo`、`video` 三者 `/api/health` 关键字段一致（`version 2.0.0` + 相同 `remotion` 报错） | `https://{magpie,geo,video}.luteos.com/api/health` | A | 交叉核验 |
| 16 | `magpie` TLS 证书 CN=`lute-tlz-dddd.top`，SAN 不含 `magpie.luteos.com` | `openssl s_client -servername magpie.luteos.com` | A | 证书 |
| 17 | `radar.luteos.com` 标题 `Momcozy & Reddit 舆情工作台`，VOC 指标 | `https://radar.luteos.com/` 实测 | A | 浏览器 |
| 18 | Echo=`radar.luteos.com`；Radar=`magpie.luteos.com`；Radar `bot_live=false`，gate `A` | `https://pmo.luteos.com/api/bot-kit/registry` → items[slug=echo/radar] | B | JSON |
| 19 | 四阶定义 Stage 1-4 与硬门禁 50% | `https://pmo.luteos.com/sop` “四阶真实进度评估标尺” | C | 原文 |
| 20 | Radar SOP 候选：4 次/周、1 次打回、35% 返工、Stage 1、12-05 | `https://pmo.luteos.com/sop` P0-1；`/api/backup.json → sop_candidates[id=11]` | C/B | 页面+JSON |
| 21 | Stage 3 阈值：≥10 次/周 或 ≥3 次打回；返工 <20% | `https://pmo.luteos.com/sop` Stage 3 | C | 原文 |
| 22 | Main bot-gateway：WS 长连接 + Webhook、幂等 TTL 10 分钟、per-chat 队列、3 秒回执、45 测试 | `https://pmo.luteos.com/reports-view/Main/Main-项目成果总结-20261101.html` §4.2 | C | 报告 |
| 23 | Main 264 测试、150/150 评测、v1.0.5 长连接在线 | 同上，§1/§4.3/§4.4 | C | 报告 |
| 24 | Source：70 平台/284 端点/200 verified/39 MCP；TikTok 16 工具/21 表 | `https://pmo.luteos.com/reports-view/Source/Source-项目成果总结-20261031.html` §1/§4.2/§4.6 | C | 报告 |
| 25 | Source creator 限制：商品到视频阻塞、评论到视频 0 行、字幕/音轨未开始、Cookie 门控 | 同上 §5“已知边界” | C | 报告 |
| 26 | Vicky：246 媒体/347 报道/100 S 级；PR 线 + 舆情线 | `https://pmo.luteos.com/projects` Vicky 卡片 | C | 页面 |
| 27 | 守衡 A-Gate 回执：`ast-creator-remix-00512@1#A-0001`，规则 creator-asset-sources/reedit-scope，证据为 Spark Ads 授权码凭据（已脱敏） | `https://pmo.luteos.com/api/gate/receipts` | B | JSON |
| 28 | Daisy：48 路由/81 Skill/1,054 算法 Skill/72 Hook | `https://pmo.luteos.com/projects` Daisy 卡片 | C | 页面 |
| 29 | PMO API 清单：GET backup/audit/bot-kit/gate/ping/weekly/export；POST 写接口 | `https://pmo.luteos.com/openapi.json` | B | JSON |
| 30 | Radar 排期审计：11-03 改到 11-06/11-16，后回到 11-24 起 | `https://pmo.luteos.com/api/audit-logs?limit=200` | B | JSON |
| 31 | 快照：11-02/11-03 Radar 10/5/0；11-06 25/20/15 | `/api/backup.json → snapshots[]` | B | JSON |
| 32 | 飞书长连接：企业自建应用、无需公网 IP/域名、3 秒处理、最多 50 连接、集群随机单 client | `https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case` “功能优势/注意事项” | B | 官方文档 |
| 33 | 飞书回调：`card.action.trigger`，3 秒内响应 | `https://open.feishu.cn/document/event-subscription-guide/callback-subscription/receive-and-handle-callbacks?lang=zh-CN` | B | 官方文档 |
| 34 | 飞书卡片回调结构 | `https://open.feishu.cn/document/feishu-cards/card-callback-communication?lang=zh-CN` | B | 官方文档 |

---

## 附录 C：一句话给决策者

**Radar 的 20% 不是“做了 20%”，而是“三个能力百分比的平均值”；`magpie.luteos.com` 不是 Radar 达人工作台，而是与 `geo`/`video` 公开面同源同版本特征的 Short Video Factory；`radar.luteos.com` 是 Echo VOC。立项前请先把这三件事纠正，再谈 12-05/12-16/12-23 的交付。**
