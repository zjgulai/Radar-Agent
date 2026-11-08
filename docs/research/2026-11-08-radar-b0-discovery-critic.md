# Radar B0 业务发现完整性反证（独立评审）

> **父助手范围校准（2026-11-08）：** 本文保留独立反证及原始观察；行号定位指向专题加父助手校准提示/修订前的版本，当前引用应以章节、主张 ID 和原文匹配复核。它不是人类批准，提出的固定案例数、负案例硬门、必须具名个人、强制单一 owner、候选绝对互斥以及自建必须同时具备权利/跨入口/供应商缺口不予自动采纳。角色/责任必须可明确，但探索可用别名；负例是补充证据，不是项目有价值的必要条件；一个 episode 可以包含连续决定，首发要有主要决定而非禁止关联步骤。PMO 自身也提 Expert/Editorial/Affiliate/Sponsored，所以 IP/名人与本轮公开四页的差异是覆盖待核，不自动判严重范围错位或排除其余工作。所有建议仍为 C，不能签发 advance/stop 或替代真实业务接受。

- 日期：2026-11-08。
- 状态：**L0 独立反证 / 研究评审**；不是 B0 完成、业务批准、MVP 选择、法务意见、测试结果、采购建议或实施授权。
- 评审对象：三份 B0 专题（`2026-11-08-radar-b0-momcozy-jobs.md`、`2026-11-08-radar-b0-alternatives.md`、`2026-11-08-radar-b0-validation-method.md`），以及它们引用的项目边界、决策登记、研究校准、主计划 §1–3 / §8–10。
- 评审立场：独立 B0 完整性反证，**不是架构评审**。本文只问“这些材料是否足以支持一个首发业务判断”，不评技术栈、数据库、部署或模型选型。
- 方法：只读本地文件；不联网、不复抓外部页面、不登录、不访谈、不联系创作者、不使用凭证、不调用付费模型、不安装/运行代码、不写 Git、不部署、不修改任何既有文档。写入前目标文件不存在；本文为新建。
- 证据等级：按研究校准 §1。A 仅限用户本轮明确方向与目录检查；本地研究/规划文档均为 **C（未批准方案）**；品牌/供应商/PMO 页面按 **C** 转述；访问失败为 **D**。PMO 能力图谱中的“A”是公开页面直接观察，不是项目批准记录，不能升级为业务结论。
- `human_gold_claim_count = 0`。本文没有真人金标、实际批准、测试通过或生产数据。

## 0. 结论摘要

1. **公共研究不能有把握地选出一个首发 job。** 它可以证明“存在哪些公开合作入口”“供应商宣称什么”“方法指南建议什么”，但不能证明内部 owner、量级、触发、当前流程、决策标准、预算、合同、权利、API 访问、采用或 ROI。三份专题在文字上多次承认这一点，但其标题、评分和候选表仍然在事实上进行了排序。
2. **“四种伙伴业务工作”是本文最重要的不成立推断。** 四个公开页面证明的是四种**公开 program surface**，不是四个已被观察的内部 job。页面能证明申请入口、权益、部分规则；不能证明谁在做、做多少次、卡在哪、由谁决定、是否值得建系统。`jobs §0.1 L12` 的“至少支持四种不同的伙伴业务工作”应降为“四个公开 program surface，内部 job 未证明”。
3. **PMO 命名的是 IP/名人，公开证据却覆盖创作者/联盟/社区。** `jobs §3.3 L135` 自己承认 celebrity/IP licensing “不在这四页的证据范围内”。这不是一个小缺口，而是 **PMO 命名对象与 B0 证据对象的错位**。如果 PMO 的“IP/名人”是字面业务，四个创作者页面可能都不是首发 job；如果它只是标签，owner 必须说明真实对象。PR/媒体方向同样没有被这四个页面覆盖。
4. **link-first 仍是未批准的锚点。** 公开页面说的是“邮件申请 + 账号审核”（`jobs §2 L73`、CL-04/CL-05），联盟是网络申请（CL-02）。主计划的“主页/账号输入”是 C 建议（`plan §2.1 L123`），领域场景也把它列为待验证不确定性（`domain-scenarios §2 L49`）。`jobs §5.2 L201` 虽把 link-first 降为“窄候选”，但仍以 link/brief/monitor 三分法组织全文；这会继续把首发形状锚在旧 MVP 上。
5. **权利、数据与 API 访问被多处默认为可得。** “creator_id + 授权七元组”只有名字，没有字段定义（`pmo-map §7.5 L414–416`）；公开页面/公开路由未发现（`pmo-map §6.1 L318`）。Co-Creator 的 perpetual/irrevocable/sublicensable 许可只适用于该 Program 提交内容（`jobs CL-14 L391`），不能外推为所有合作的“权利模型”。联盟数据在 Awin/Impact/CJ 后台（`jobs §3.1 L105`），没有合同/导出/API 证据，不能假设 Radar 能读。
6. **没有 owner 批准的价值指标。** PMO G1/S2 是 C 级规划记录，不是 Momcozy 战略；公开 program 混合佣金、曝光、社区、活动、技能（`jobs §7.2 L247–260`）。这恰好说明不能做一个跨 job 的“creator score”，而不是说明需要一个多目标分数。三份文件都没有给出“一个 job、一个 owner、一个主指标、分子/分母/窗口”的组合。
7. **强制样本数/阈值仍在泄漏。** `jobs §6 L228–234` 的“最近 20 个申请 / 3 个 brief / 3 个月 / 10 个请求 / 5 个活动”没有依据；`alternatives §7.1 L378` 的“3–5 个案例、至少 2 类对象、1–2 个市场”被写成“最低可接受形态”；`validation §4.3 L182` 自己说样本量是研究参数、不是阈值。主计划的 45–70 / 80–130 人日、6.4–10 周是 C 级 WBS，不是排期或承诺（`plan §8.2–8.3 L528–536`）。PMO 图谱的 20 golden set、P95 ≤10s、80% 采纳、precision@10 ≥0.6 是 D 级建议（`pmo-map §7.2 L378–382`），不得当基线。
8. **访谈问题库有内部矛盾。** `jobs §9 Q12 L329` 问“如果 Radar 明天给一张卡片/计划，什么情况下你会用？”——这正是 `validation §6.2 L363–373` 明令不要问的假设性意愿问题。`jobs Q7/Q10/Q13/Q15` 也偏一般流程或抽象排序，不是最近行为。方法库本身较好，但必须跨文件执行它的禁令。
9. **验证方法对第一次 B0 过重。** 918 行、17 字段 episode ledger、15+ 公式、成本/采用/Tier/演练协议，在还没有一个真实案例时先搭了一套研究操作系统。方法本身是 C，不是批准流程；“顺序不可跳过”（`validation §3 L129`）没有项目授权。建议先用一页纸跑通一个案例，2–3 个案例后再启用完整量表。
10. **没有任何候选达到可排序的证据条件。** link-first、brief-first、existing monitoring、四个 program surface、A/B/C 策略都只是假设；没有一个是“已证明值得首发”的 job。本文只给三个**互斥的候选决策 job**（作为待验证假设），以及一个先问人的问题。

## 1. 评审边界、阅读记录与“verified”的含义

### 1.1 本轮实际读取

| 材料 | 读取范围 | 用途 |
|---|---|---|
| `docs/research/2026-11-08-project-research-boundary.md` | 全文 | 用户明确要求、授权/禁止、证据规则 |
| `docs/research/2026-11-08-radar-decision-register.md` | 全文 | D01–D12 全部未批准；身份/范围/权利/数据决策 |
| `docs/research/2026-11-08-radar-research-calibration.md` | 全文 | 统一证据等级与 CAL-01–CAL-30 纠正口径 |
| `docs/research/2026-11-08-radar-b0-session-status.md` | 全文 | 本轮 B0 任务清单与 HOLD 条件 |
| `docs/superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md` | §1–3、§8–10 | PMO 深研、产品草案、B0/Main 链路、工作量/风险 |
| `docs/research/2026-11-08-radar-b0-momcozy-jobs.md` | 全文 422 行 | 公开 program surface、四类原型、起点评估、问题库 |
| `docs/research/2026-11-08-radar-b0-alternatives.md` | 全文 501 行 | 替代产品、单工具覆盖、A/B/C 策略、证据门 |
| `docs/research/2026-11-08-radar-b0-validation-method.md` | 全文 918 行 | B0 方法、episode、基线、访谈、Tier、退出 |
| `docs/research/2026-11-08-radar-pmo-business-capability-map.md` | §2.2–2.4、§3.1–3.6、§4.1、§6.1、§7.2、§7.5 | 核对 PMO 原文、百分比、交接协议、工作台观察、阈值 |
| `docs/research/2026-11-08-radar-domain-scenarios.md` | §2 及关键不确定性 | 核对 link-first 是待验证假设 |
| `docs/research/2026-11-08-main-full-stack-lifecycle.md` | §8.2 摘录 | 核对 B0 的 3 用户/3 案例只是 C 建议 |
| `docs/research/2026-11-08-radar-delivery-resourcing.md` | P1 行摘录 | 核对“至少 3 条近 12 个月案例”是 C 建议 |
| `docs/research/2026-11-08-radar-design-critic.md` | §5.6 摘录 | 核对 3 案例/基线是 C 建议 |

**未读**：PMO 能力图谱全文、Momcozy 合规专题全文、架构/资源/安全/评测/飞书专题全文、主计划 §4–7 全文、Main 生命周期全文。未读部分可能包含与本评审不同的证据，不能把“本文未见”写成“文档没有”。

### 1.2 “verified”在本文件中的含义

本文的“verified local source”只表示：**该主张能在所引本地文件的对应章节/行找到，且引文与该文件一致**。它不表示：

- 外部公开页面在 2026-11-08 之后仍然如此；
- 页面文本等于内部流程；
- 本地研究文档等于项目批准；
- 供应商营销等于产品能力、采用、API 权限或 ROI；
- 本文复核等于真人业务验证。

三份专题对 Momcozy 页面的引用，本文按 **C** 接受并检查其内部一致性；**没有重新抓取外部页面**。因此，本文对“页面原文”的判断只到“专题这样引用”，不到“页面现在仍这样写”。

### 1.3 来源八字段登记（本文使用的本地载体）

> 外部页面（Momcozy、CreatorIQ、impact.com、Shopify、PMO、Main、GOV.UK、NN/g）的八字段已分别登记在 `jobs §11`、`alternatives §10`、`validation §2.2`；本文不重复扩写，只按其专题转述使用，等级仍为 C（访问失败为 D）。`workspace=Radar/research`；`allowed_agents=this research/review only`；`blocked_actions` 为本轮研究限制，不授予生产权限。

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| SRC-CRITIC-01 | C | `docs/research/2026-11-08-project-research-boundary.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不当作章程/批准/实施/外联/部署授权 |
| SRC-CRITIC-02 | C | `docs/research/2026-11-08-radar-decision-register.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | D01–D12 全部未批准；不据此采购/实施/上线 |
| SRC-CRITIC-03 | C | `docs/research/2026-11-08-radar-research-calibration.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把 C 当 A；不继承旧项目指标/状态 |
| SRC-CRITIC-04 | C | `docs/research/2026-11-08-radar-b0-session-status.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把 B0 启动当 B0 完成/批准 |
| SRC-CRITIC-05 | C | `docs/superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md` | 本项目规划（Agent 撰写，未获人工批准） | v1.1 / 2026-11-08 | Radar/research | this research/review only | 不当作批准工期/预算/MVP/实施指令 |
| SRC-CRITIC-06 | C | `docs/research/2026-11-08-radar-b0-momcozy-jobs.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08，422 行 | Radar/research | this research/review only | 不把公开页面当内部流程/采用/ROI/批准 |
| SRC-CRITIC-07 | C | `docs/research/2026-11-08-radar-b0-alternatives.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08，501 行 | Radar/research | this research/review only | 不把 vendor 营销当采用/API/合同/ROI |
| SRC-CRITIC-08 | C | `docs/research/2026-11-08-radar-b0-validation-method.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08，918 行 | Radar/research | this research/review only | 不把方法当批准流程/验收线/实测值 |
| SRC-CRITIC-09 | C | `docs/research/2026-11-08-radar-pmo-business-capability-map.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | PMO 记录不证明采用/完成度/ROI/内部责任 |
| SRC-CRITIC-10 | C | `docs/research/2026-11-08-radar-domain-scenarios.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把场景 A 当已验证流程/起点 |
| SRC-CRITIC-11 | C | `docs/research/2026-11-08-main-full-stack-lifecycle.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把 B0 扩展写成 Main 原文/批准 |
| SRC-CRITIC-12 | C | `docs/research/2026-11-08-radar-delivery-resourcing.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把 3 案例/工期当批准阈值/承诺 |
| SRC-CRITIC-13 | C | `docs/research/2026-11-08-radar-design-critic.md` | 本项目研究（Agent 撰写，未获人工批准） | 2026-11-08 | Radar/research | this research/review only | 不把评审意见当批准/实施授权 |

### 1.4 本轮没有做的事

未登录、未填写申请、未加入会员/社群、未访问个人创作者主页、未发消息、未联系代理/客户、未采购、未询价、未调用付费模型或带凭证 API、未安装/运行代码、未写 Git、未部署、未读取秘密、未读取无关项目或无关浏览器标签、未再委托子代理。目标文件写入前不存在；未修改任何既有文档。

## 2. 与原请求 / PMO / Main 边界逐项对照

| 边界项 | 原始/本地 locator | 三份专题的处理 | 反证判断 |
|---|---|---|---|
| 用户要求：Momcozy、Radar Agent + 工作台、PMO Radar 研究入口、Main 路线、飞书群 @/P2P、本轮只研究 | `boundary §用户明确给定的需求 L7–16`；`session-status §1 B0-INPUT-01 L13` | 均未实施；都声明研究/未批准；`validation` 明确不复问品牌/产品形态/Main/飞书入口 | 基本遵守。没有把研究写成实施授权。 |
| PMO 将 Radar 登记为 G1/S2 的 “IP/名人 Agent & 工作台” | `boundary §初步命名核验 L19–24`；`pmo-map §2.2–2.4 L56–79` | `jobs` 研究四个创作者/联盟/社区页面，`§3.3 L135` 承认 celebrity/IP 无这四页证据；`alternatives`/`validation` 未补 IP/名人证据 | **错位**：PMO 命名对象是 IP/名人，B0 证据对象是创作者/联盟/社区。`jobs` 把 IP/名人列为“另一个假设”是诚实，但没有解决“首发对象可能完全不在四页里”的问题。 |
| PMO 能力链路“粉丝分析 → 合作计划 → 动态监测 → 机会推荐”共 4 项 | `pmo-map §2.4 L77`；`calibration CAL-02 L49` | `jobs`/`validation` 使用 4 项；`validation §5.5 L256` 明确 PMO 能力名只是候选标签 | 使用正确。但 `pmo-map §0 L22` 写“场景写了 5 个环节”，与同文件 L77 的 4 项不一致；这是本地来源陷阱，不能照抄 5。 |
| PMO 25/20/15 是能力登记百分比，不是完成度/价值 | `pmo-map §4.1 L154–158`；`calibration L17` | `jobs`/`alternatives` 均按 C 级登记处理；`alternatives §0.1 L11` 明确不能推出“必须建设” | 处理正确。 |
| PMO 的跨 Agent 协议：Radar 是 `creator_id` + 授权七元组的唯一登记源 | `pmo-map §3.6 L142` | `jobs §5.3` 把权利登记改为条件性；`alternatives §5 L258–278` 把“权利证据”列为候选差异 | 方向正确，但仍把“七元组”当作可设计对象；字段未定义，公开页面/路由未发现（`pmo-map §7.5 L414–416`、`§6.1 L318`）。协议是 C，不是已实现接口或法律授权。 |
| Main 不能判断“市场有没有人要”；B0 是本项目扩展 | `main-lifecycle §8.2 L627`；`plan §3 L183` | `validation §1.1 L43–45` 引用 Main 边界；`validation §0.3 L35` 说 B0 是补齐“怎么做” | 正确使用。不要反过来把 Main 的“必须”当成 B0 的项目强制；`validation §2.1 L82` 已说明方法指南是 C。 |
| D01–D12 全部未批准 | `decision-register 开头 L4`；`plan §10.2 L621` | 三份文件都声明未批准；`validation §11.1 L731` 明确 B0 不能把研究写成决策 | 文字上正确。但 `alternatives §6.4 L370` 的“A 后悔值最低”、`jobs §5.2 L201–203` 的“低/中/中高”适配判断、`validation §8.2` 的 Tier 1 规则，在实际阅读中仍构成排序。**声明不等于去锚定。** |
| 用户未批准 link-first、单市场/品类/团队/对象/来源、技术栈、45–70/80–130、6.4–10 周 | `plan §2.1 L123`、`§2.2 L132`、`§8.1 L515`、`§8.2 L528–530`、`§8.3 L536`；`calibration CAL-19 L66`、`CAL-30 L77` | `jobs`/`alternatives`/`validation` 多处标 C；但 `jobs` 仍以 link-first 为三分法之一，`alternatives §8.1 L426–427` 重复 45–70/80–130/6.4–10 周 | **未批准锚点仍在**。标 C 只能防止“冒充批准”，不能防止“作为讨论默认值”。 |
| 品牌/供应商营销是 C，不等于采用/ROI/内部责任/API | `calibration L34`、`§3 CAL-05 L52`；`alternatives §1.3 L43` | `alternatives` 大体按 C 处理；`jobs` 也把品牌页按 C | 大体正确。但 `alternatives §3.1 L109` 的“没有证据表明 Momcozy 使用上述任何工具”与 `jobs CL-02 L379` 的“We partner with Awin, Impact, and CJ Affiliate networks”冲突；至少是命名碰撞，不能直接说“无证据”。 |
| PMO 工作台 URL `magpie.luteos.com` 的公开面是视频应用，不是 Radar 工作台 | `pmo-map §6.1 L308–320`；`boundary L21–24` 说未登录不作不存在判断 | 三份 B0 专题基本不讨论工作台存在性；`plan §2.3` 设计工作台页面 | **未被处理的 D01 风险**：公开面没有 Radar 工作台证据，私有可能存在但不能假设。任何“已有工作台可复用/可在其上扩展”的 B0 结论都缺证据。 |

**对照结论：** 三份专题在“不要把 C 当 A”“不要冒充内部事实”“不要做实施”上基本合格；但在“PMO 命名对象 vs 公共证据对象”“link-first 锚点”“权利/数据访问”“价值指标”“样本数/阈值”“访谈问题”上仍不完整。**原请求没有批准任何首发业务选择；本文也不批准。**

### 2.1 三份专题做对的部分（修正时不应丢掉）

- **证据等级**：品牌/供应商/PMO 页面按 C；失败访问按 D；没有把营销页当采用/ROI/API 权限（`jobs §1.2 L42–46`、`alternatives §1.3 L43`、`validation §2.1 L82–86`）。
- **内部事实边界**：`jobs §1.4 L60–66` 明确不能得出内部团队/预算/审批/ROI；`§2.1 L83` 明确“多入口不证明团队碎片化”；`§2.1 L84` 与 CAL-14 明确“页面未展示披露 ≠ 违规”。
- **具体纠正**：Affiliate 15% 标签歧义（`jobs §2.1 L86`）；权利登记条件化而非每个 assessment 默认（`jobs §5.3 L205–210`）；不把“未文档化”写成“供应商没有”（`alternatives §9.2 L463`）；不把 PMO 25/20/15 当完成度（`alternatives §0.1 L11`）。
- **方法边界**：`validation §0.2 L23–31` 明确不做生产验收/模型评测/live 采集；`§2.1 L82` 明确方法指南是 C，不是项目批准；`§6.2 L363–373` 明确禁止 would-you-use 问题。
- **失败与限制**：Growth 申请页失败、Shopify 403 都保留为 D，没有写成“不存在”（`jobs §1.3 L56`、`alternatives §3.4 L205–209`）。
- **不冒充批准**：三份文件的输出契约都声明未批准；`validation §10.2 L699–707` 把 finding/decision/PoC authorization 分开。

这些是本文批评的前提；下面的反证不等于否定这些正确边界。

## 3. 公共证据能证明什么，不能证明什么

### 3.1 能证明（C 级，且仅到页面陈述）

- 四个 Momcozy 公开 program 页面存在，并分别描述了申请入口、部分权益、部分规则：Influencer Rewards 邮件申请/账号审核；Affiliate 通过 Awin/Impact/CJ 申请/结算；Growth Empowerment 的会员/社群/角色；Co-Creator 的月度 S/A/B 规则、披露、许可、申诉等（`jobs §2 L70–75`、CL-01–CL-28）。
- 这些页面之间存在差异：不同入口、不同评估证据、不同生命周期、不同正式化程度（`jobs §2.1 L79–86`）。这支持“不能合并成一个通用达人发现流程”，但不支持“因此有四个内部 job”。
- CreatorIQ 与 impact.com 的官方页面包含某些能力宣称；Shopify Collabs 两页 403（`alternatives §1.4 L45–56`、§3.2–3.4）。这些是供应商 C，不是 Momcozy 采用/API/ROI。
- PMO 公开记录写了 Radar 的 G1/S2、#66–#68、25/20/15、四步链路、跨 Agent 协议文本（`pmo-map §2–4`）。这些是 C 级登记/陈述，不是本项目完成度或内部批准。
- GOV.UK / NN/g 提供了“先看现状、问最近事件、访谈是自述行为”等方法建议（`validation §2.2`、§5–6）。这些是 C 级方法参考，不是 Momcozy 规则。

### 3.2 不能证明

- 内部团队、owner、审批人、SLA、headcount、预算、合同、实际申请量、通过率、激活率、返工、争议、权利事故、采用、ROI。
- 用户真实起点是 link、brief、monitor、续约、材料审查还是混合；各占多少。
- 四个公开 program 中哪一个有量、有痛点、有 owner、有可合法取得的证据。
- PMO 的“IP/名人”是否字面业务；celebrity/IP licensing 的流程、合同、权利链、费用、审批。
- PR/媒体（Vicky）与创作者/联盟/社区的关系；是否共享流程。
- Awin/Impact/CJ 后台数据能否被 Radar 读取、导出、保留、派生；平台 API 是否有权限；创作者 insights 是否可得。
- 权利七元组的字段、法务效力、撤回/到期/下游消费规则。
- 任何供应商是否被 Momcozy 采用；任何工具是否能覆盖真实字段；任何工具的总成本/国家可用性/API 权限。
- 任何 job 的业务价值、优先级或“最低 regret”。

### 3.3 结论：公共-only 能否选出一个首发 job？

**不能。** 理由不是“公开研究做得不够多”，而是**公共-only 的证据类型与首发 job 所需证据类型不匹配**：

1. **公开页面是 offer，不是 operation。** 它能证明“对外提供什么”，不能证明“内部谁在做、做多少次、卡在哪、谁决定”。首发 job 需要后者。
2. **四个 program 是不同决策过程。** `jobs` 自己证明它们入口/证据/生命周期不同（`§2.1 L79–86`）。在没有内部案例前，把它们并列为“四个 job”只是把页面结构投影成组织工作。
3. **PMO 命名的 IP/名人没有公共证据。** `jobs §3.3 L135` 已承认。若 PMO 名称是字面业务，公共研究连对象都没有覆盖；若名称是标签，必须由 owner 说明真实对象。
4. **数据/权利/API 路径未知。** 首发 job 的可行性取决于“必需证据能否合法取得”；公共页面没有给出 Awin/Impact/CJ 数据权限、平台 API 权限、创作者授权或法务权利定义。
5. **没有价值指标。** 公共页面没有 Momcozy 批准的目标、分母、窗口；vendor 页只有营销数字；PMO 只有登记百分比。没有 owner-approved 指标，无法比较 job 的“价值”。

**公共-only 可以合法输出的**：候选假设清单、排除“一个统一达人发现流程”、需要哪些人类证据、第一个人类问题、以及“现在只能 hold/reframe”的判断。**不能输出的**：首发 job、候选排序、MVP 冻结、buy/build/integrate 选择、ROI/价值结论。

**什么会改变这个判断**：一个具名 business owner + 一个最近的负案例（拒绝/搁置/返工）+ 该案例的脱敏产物/时间线 + 该 job 的合法数据路径 + 法务对权利用途的初步意见 + owner 接受的一个主指标。即使这些都有，一个案例也只能支持“继续研究/进入需求候选”，不能单独证明业务价值或首发正确。

## 4. 三个互斥的候选决策 job（仅作为待验证假设，不是推荐）

> 说明：以下是**决策类型**，不是 personas，也不是“达人类型”。一个首发切片只能选一个；如果 owner 不能区分它们，或同一个案例同时属于多个，说明流程还没被还原。**本文不选任何一个。**

| Job | 要做的决定 | 公开证据 | 最强反证 | 流程修复是否可能足够 | 需要的人类 ownership |
|---|---|---|---|---|---|
| **J1 入站申请处置** | 对一个入站联盟/创作者申请，决定批准 / 补料 / 拒绝 / 转到别的 program | Influencer Rewards 邮件申请 + 账号审核（`jobs §2 L73`、CL-04/05）；Affiliate 网络申请（CL-02） | 公开证据是邮件/网络申请，不是 link-first；Affiliate 的批准/条款/结算委托给 Awin/Impact/CJ（CL-02/03），Radar 没有网络数据/审批角色；Influencer 审核是账号级指标，复杂度低。若量小，一个 intake form + 必填清单 + 回复模板就可能足够。这个 job 可能属于 affiliate/influencer manager，不是 PMO 的 IP/名人。 | **可能足够。** 共享 intake form、必填字段、决定理由、补料模板、简单台账。只有在量大、跨 program、反复补料/错判时，系统才可能值得。 | Program owner（affiliate/influencer manager）；法务只在披露/claim/内容使用时介入；财务/结算归网络。无具名 owner = hold。 |
| **J2 Brief 驱动的赞助/专家合作选择** | 对一个 campaign brief 或合作请求，决定是否做、短名单谁、轻量计划/条件是什么 | 页面提到付费合作、品牌活动、co-branding、样品、专家角色（`jobs §3.2 L111`、§3.3 L129）；**没有公开 brief 证据** | 没有公开证据表明 brief 先于选人，也没有预算/日历/审批链；可能是 agency/关系/预算驱动；专家/创意服务是技能/作品集 sourcing，和创作者赞助不是同一决策；高错误代价在权利/claim，法务 ownership 比工具更关键。brief 模板 + 证据清单 + 审批 memo 可能足够。 | **可能足够。** Brief 模板、候选证据清单、shortlist/审批 memo、权利 checklist。只有在多 campaign、跨团队、反复因 brief 变更返工时，系统才可能值得。 | Brand/influencer marketing lead + 法务（权利/claim）+ 财务（预算）；专家/创意可能归 Vicky/creative ops。无具名 owner = hold。 |
| **J3 现有伙伴周期复核/续约/纠正** | 对一个现有伙伴/社区成员的累计记录，决定 tier/续约/纠正/退出 | Co-Creator 月度 S/A/B、1 日 roster、operations team holistic review、proprietary weights、human review（`jobs §2 L75`、CL-11）；Affiliate 每日 dashboard（CL-02）；Influencer long-term（CL-06） | 公开规则证明“有周期性评审”，不证明“评审慢/错/漏/值得建系统”；operations team 可能已有社区后台/表格；proprietary weights + human review 意味着自动化评分会与规则冲突并引入偏见/法律风险；奖励是 $50 gift card/Points，业务价值可能低。这个 job 是社区运营，不是 PMO 的 IP/名人。 | **可能足够。** 月度日历、roster 导出、评审清单、appeal 日志、披露/claim 抽查。只有在伙伴数多、跨 program、审计要求高时，系统才可能值得。 | Community operations lead；法务（披露/claim）；财务/税务（奖励）。无具名 owner = hold。 |

**互斥性说明：** J1 是“入站申请”的决定；J2 是“有 brief 的合作选择”的决定；J3 是“已有关系”的决定。它们按决策类型和生命周期阶段互斥，不按人头互斥。一个人可以同时出现在三个流程里，但首发切片只能选一个决策类型。

**没有被列为候选的两个缺口：**

- **Celebrity/IP licensing**：PMO 命名对象，但这四页没有证据（`jobs §3.3 L135`）。它不是第四个候选 job，而是**范围问题**：如果 owner 说真实工作是名人/IP 授权，J1–J3 可能全部 out of scope，B0 必须 reframe。
- **PR/媒体**：PMO S2 包含 Vicky/PR 方向（`pmo-map §2.3 L67`），但这四页是 affiliate/influencer/community，不是 PR。`jobs §7` 把“品牌声量/公共关系”作为 PMO 背景，但没有研究 PR 的具体决策。PR 是另一个 job/owner，不应被“brand awareness”吸收。

## 5. 每个公开 program surface 的最强反证

> 这一节回答“如果非要从这些页面里挑一个，最强的反对理由是什么”。它不是推荐；它的作用是防止把“页面存在”误当“job 成立”。

| Program surface | 公开证据能证明 | 作为首发 job 的最强反证 | 流程修复是否可能足够 | 人类 ownership |
|---|---|---|---|---|
| **Affiliate** | Awin/Impact/CJ 申请、批准、链接/素材/折扣码、每日后台、佣金、dedicated manager（CL-01–03） | 核心 intake/审批/结算/数据都在网络后台；Radar 无合同/导出/API 权限时只能做重复 dashboard；联盟客不是“IP/名人”；异常/欺诈线索需要网络侧行动权。 | **是。** 网络后台 + 例外台账 + 模板可能足够；系统只在跨网络对账/异常量大时才有意义。 | Affiliate/partnerships manager；网络方客户经理；财务。 |
| **Influencer/sponsored** | 邮件申请、账号审核（content style/exposure/views/engagement/likes）、样品/付费合作/大使/co-branding（CL-04–06） | 页面说的是邮件 + 账号审核，不是 link-first；没有量/SLA/审核人/权重；付费合作可能无预算/无 brief；决定可能关系驱动。 | **是。** Intake form + 必填清单 + 审核模板 + 简单 tracker 可能足够。 | Influencer marketing manager；法务（披露/内容使用）。 |
| **Growth/expert** | 会员/社群/角色；Superuser 邀请 editor/designer/illustrator/native speaker/multilingual；任务佣金/礼品卡/试用；Brand Influencer/Community Ambassador（CL-07） | 只有角色/权益，没有申请/评估/合同/量级；技能型 sourcing 可能走 agency/freelance 平台；它和“创作者发现”不是同一流程；“10,000 moms”是营销数字。 | **是。** 技能/作品集 roster + 任务分配 + 交付验收可能足够；系统未必是第一步。 | Brand/creative ops 或 Vicky/PR；可能需要 HR/procurement。 |
| **Co-Creator** | 月度 S/A/B、1 日 roster、holistic qualitative review、proprietary weights、human review、$50 gift card/Points、披露/许可/申诉（CL-09–14、CL-27） | 规则证明“有评审”，不证明“评审是瓶颈”；operations team 可能已覆盖；proprietary weights 不可审计，自动评分会冲突；奖励金额小；这是社区运营，不是 BD/IP。 | **是。** 日历 + roster + 评审清单 + appeal 日志可能足够；系统只在规模/审计需要时才有意义。 | Community operations；法务（披露/claim）；财务/税务。 |
| **Celebrity/IP** | 这四页没有合同/授权/独家/费用/范围/审批证据（`jobs §3.3 L135`） | 没有公共证据；高法律/品牌风险；权利链复杂；不能塞进创作者 program；如果 PMO 名称是字面业务，这才是真正的 B0 对象，而公共研究没有覆盖。 | **未知。** 可能需要法务/agency 主导的流程修复，而不是系统。 | Senior brand + 法务 + agency；PMO/发起人确认对象。 |
| **PR/媒体** | PMO S2 提到 PR/媒体编辑跟踪/声量洞察（`pmo-map §2.3 L67`），但四页没有 PR 流程 | 与 affiliate/creator/community 是不同 job；没有公开证据；把它归入“brand awareness”会掩盖 owner/流程/指标差异。 | **未知。** 可能是媒体监测/关系维护流程，先要 owner 和案例。 | Vicky/PR owner。 |

**结论：** 四个公开 surface 都有“流程修复可能足够”的强反证；没有一个 surface 仅凭公开页面就能证明需要 Radar。Celebrity/IP 和 PR 是范围缺口，不是可以用来凑“四个 job”的候选。

### 5.1 替代方案覆盖缺口

`alternatives` 只深入了 CreatorIQ、impact.com 两个 vendor，Shopify Collabs 403；这不足以支撑“现有替代是什么”的完整图景。至少以下替代没有被比较：

| 替代 | 为什么相关 | 当前证据状态 | 应补的问题 |
|---|---|---|---|
| **Awin / Impact / CJ 网络后台** | Momcozy 公开称通过这三个网络做 affiliate（`jobs CL-02 L379`）；这是“现有替代”，不是未来 vendor | C（品牌页声明）；无合同/导出/API/实际使用证据 | Momcozy 已用哪个网络产品？网络后台已提供哪些审批/报告/素材/异常功能？Radar 还缺什么？ |
| **Shopify Collabs** | 电商合作/联盟工具；与 Shopify 语境相关 | D（403，无正文） | 重新访问或通过采购文档取得；不得推断功能存在/缺失 |
| **community.momcozy.com / 社区后台** | Co-Creator 的 roster/Points/评审可能已在社区平台 | C（页面存在）；内部工具未知 | 社区运营实际用什么后台/表？review/roster/points 是否已自动化？ |
| **飞书/表格/邮件/人工流程** | `alternatives §2.2 L68` 的工作假设；可能是最低成本替代 | H（未观察） | 实际工具、耗时、返工、缺证；流程修复是否足够 |
| **Agency / PR / freelance 平台** | 名人/IP、PR、专家/创意 sourcing 常用 agency/freelance，不是 creator discovery 工具 | 未研究 | Vicky/PR、专家/创意、celebrity/IP 现在通过谁 sourcing？合同/费率/权利谁管？ |
| **合同/权利/法务 workflow** | 权利可能是法务/合同流程，不是软件缺口 | 未研究 | 法务现用模板/审批/登记是什么？是否需要新登记源？ |
| **Do nothing / stop** | 如果没有案例、owner、合法数据路径，停止是有效选项 | 已列在 `alternatives §7.4 L410–420`，但未与 A/B/C 同等比较 | 停止的触发条件、谁有权停、停后如何记录 |

**结论：** `alternatives` 的“两个 vendor”样本不足以证明“没有单工具覆盖”或“A 最低 regret”。至少要把 Awin/CJ、社区后台、agency/PR、法务 workflow、人工流程和 stop 放进同一张比较表；否则“替代方案”本身是被窄化的。

## 6. 流程修复 / 集成 / 自建 / 停止：最强反证

| 选项 | 最强反证 | 什么情况下可能足够/成立 | 人类 ownership |
|---|---|---|---|
| **A 增强现有流程（process fix）** | “A 的后悔值最低”（`alternatives §6.4 L370`）没有测量；流程修复依赖纪律、管理注意力和 adoption；如果失败是缺数据/缺权利，模板/清单不能解决；如果量小，流程修复本身也可能不划算；它仍是一套流程设计，不是“零成本”。 | 如果案例显示失败主要是 intake 不一致、提醒遗漏、交接靠记忆、brief 不统一，且 owner 能强制执行，A 可以足够。需要前后对比的耗时/返工/缺证，不是功能清单。 | 业务 owner + operations；法务（权利/claim）；没有 owner 就没有 A。 |
| **B 集成许可工具** | 两个 vendor 页是 C 营销；权利/Feishu/国家/API/导出/删除未知；impact.com 可能已经是 Momcozy affiliate 网络的一部分（`jobs CL-02 L379`），所以“集成”可能是用现有网络，而不是买新平台；license/实施/集成/培训/lock-in 成本未知；可能仍需权利/飞书薄层。 | 如果真实约束是商品化 discovery/assessment/relationship/outcome，且 vendor 用真实字段 demo、API/导出 sandbox、权限/安全/合同/国家可用性都通过，B 才可能成立。 | 业务 owner + 采购/IT/安全/法务/财务；没有合同/安全审查就没有 B。 |
| **C 自建窄证据中心** | 80–130 人日、6.4–10 周是 C 级 WBS，不是已验证成本/排期（`plan §8.2–8.3`；`alternatives §8.1 L426–427`）；没有证据“权利证据”是反复发生、代价明确的业务失败；没有 owner/值班/维护；在法务定义权利用途前设计 schema 是倒置；机会成本高。 | 只有在真实案例证明“权利证据 + 跨入口协作 + 供应商 API/导出缺口”同时成立，且法务批准权利语义、下游消费者要求明确、owner/采用/维护落实时，C 才可能成立。 | 发起人 + 业务 owner + 法务/数据/技术/财务；没有 owner/预算就没有 C。 |
| **Stop** | 如果拿不到具名 owner、真实负案例、合法数据路径或业务接受，stop/hold 是有效结论；把 stop 写成“失败”会诱导团队硬做。 | 没有案例显示实质痛点；现有流程/清单/提醒已足够；许可工具更低成本覆盖；权利不是约束；无 owner/采用/维护资源。 | 业务 owner/发起人；Agent 不能签 stop。 |

**结论：** 不能把 A 写成“最低 regret”，不能把 B 写成“更快”，不能把 C 写成“必须建”。四种选项都还没有证据。流程修复是**可能足够**的强假设，不是默认答案；它的证据要求和 B/C 一样，都是真实案例基线。

## 7. 价值指标：品牌声量 vs 销售，及“value”仍未定义

### 7.1 没有 owner 批准的目标/指标

- PMO G1 原文是“加速品牌多渠道声量增长”，S2 是“媒体公关 + GEO + IP/名人融合”（`pmo-map §2.2–2.3 L56–69`）。这是 **PMO 的 C 级规划记录**，不是 Momcozy 内部批准的战略，也不是 Radar 的项目目标。
- 公开 program 同时包含佣金/销售、曝光/内容、社区/关系、技能/活动（`jobs §7.2 L247–260`）。这说明**不能**用一个 GMV/佣金分数排序所有工作，也**不能**用一个“声量”分数排序所有工作；它不说明 Momcozy 已经批准了一个多目标平衡。
- `jobs §7` 的结论“每个 job 需要 owner 批准的目标和指标；不存在一个跨 job 的默认优化目标”（`L272`）是正确的。问题在于：三份文件都没有拿到这个 owner 指标；后面的候选表却仍在用“value/benefit”语言。

### 7.2 “value”在不同文件里指不同东西

| 文件 | “value”实际指什么 | 问题 |
|---|---|---|
| `jobs §6 H1–H7` | 更快响应、更少补料、更少错配、更少漏审、更快 sourcing、更少漏交付、更好 follow-up | 每个都是“可能收益”，没有分子/分母/窗口/owner；不是可比较的价值指标。 |
| `alternatives §6.4` | first value（快/中/慢）、cost（低/中/高）、fit、lock-in、risk | 定性排序；没有成本数字/时间基线；“A 最低 regret”不是测量。 |
| `validation §7` | wall-clock、人时、等待、复核、返工、成本、decision latency、coverage、traceability、adoption | 有公式，但没有值；且 `actual_adoption` 在 B0 没有可采用的 Radar 产物，定义悬空（见 §12 T22）。 |
| `pmo-map §7.2` | 20 golden set、P95 ≤10s、80% 采纳、precision@10 ≥0.6、寄样 ≥60%、到期 <5% | D 级建议；未批准；不能当基线或验收。 |

### 7.3 建议的“最小价值定义”（C，非批准）

对任一候选 job，先要求 owner 给出**一个**主指标，格式为：

> `指标名 = 分子 / 分母；时间窗；数据来源；缺失/失败如何计入；谁批准`

示例（只是示例，不是目标）：

- J1：首次响应时间；补料轮次；批准/拒绝理由完整率。
- J2：从 brief 到 shortlist 的 elapsed time；brief 变更后的返工；权利/claim 纠正次数。
- J3：月度评审完成率；漏审/申诉/纠正次数；续约/退出记录完整率。

**不做**：跨 job 加权总分、creator score、ROI/EMV/CPM/佣金预测。没有 owner 指标，任何“价值排序”都是假设。

## 8. 权利、数据与 API：被默认为可得的未证明条件

### 8.1 “授权七元组”不是定义，是名字

- PMO 只写 `creator_id + 授权七元组`，没有字段定义（`pmo-map §7.5 L414–416`）；公开页面与公开路由未发现（`§6.1 L318`）。
- `jobs §5.3 L207–210` 正确指出：纯初筛不需要权利登记，权利状态可记 `not_assessed`/`unknown`；只有复用/转发、paid ads/whitelisting、co-branding、产品测试内容、专家交付、celebrity/IP、affiliate 素材二次使用、PDP/EDM/广告时才需要检查。这是三份文件里最好的权利纠正之一。
- 但“触发清单”仍不是法律模型。**（C：本文整理，不是法律意见）** 权利至少涉及：著作权/内容许可、肖像/likeness、音乐、未成年人、医疗/健康 claim、平台条款、合同相对性、独家/地域/渠道/期限/转授权/撤回/下游用途/审计。一个七字段 tuple 可能不够；在法务定义具体用途前，不应设计 schema 或 gate。
- Co-Creator 的 `perpetual, irrevocable, sublicensable` 许可只适用于该 Program 提交内容（`jobs CL-14 L391`），不能外推为所有合作、所有素材、所有创作者。它是 program 条款，不是 Radar 的通用权利模型。

### 8.2 数据/API 访问没有证明

- Affiliate 的核心数据在 Awin/Impact/CJ 后台（`jobs §3.1 L105`、CL-02）。没有合同/导出/API 证据，不能假设 Radar 能读、能存、能派生、能删除。
- CreatorIQ/impact.com 的“bi-directional API”“direct API integrations”“250k+ partners”“20M creators”都是供应商 C（`alternatives §3.2–3.3`）。它们不证明 Momcozy 有权限、字段可用、导出合法、国家可用或价格可接受。
- 平台公开账号/主页不是数据路径；公开可见不等于可合法使用/存储/派生（`calibration CAL-05 L52`；`validation §8.1 L582`）。创作者 insights/受众人口统计没有授权就不存在。
- PMO 的跨 Agent 协议是 C 级协议文本，不是已实现接口、不是法律授权、不是数据访问许可（`pmo-map §3.6 L142`；`jobs §1.4 L62–66`）。

### 8.3 对首发 job 的含义

在选 job 前，必须先回答：**这个 job 的哪一个必需证据项，通过什么合法路径，由谁负责取得？** 如果答案是“平台 API”“网络后台”“公开主页”“以后采购”，那还不是路径；是假设。没有路径的 job 只能 Tier 2/unknown，不能 Tier 1。`validation §8.1` 的证据矩阵字段（permission_basis、access_method、failure_semantics、owner）是正确的，但还没有填。

## 9. 被当作默认的未批准锚点

| 锚点 | 出现位置 | 状态 | 为什么未批准 | 什么会批准它 |
|---|---|---|---|---|
| **Link-first MVP**：主页/账号输入 → 背调 → brief 关联 → 认领 → 材料待审 | `plan §2.1 L123`、`§2.2 L132`；`pmo-map §7.2 L378`（D 映射）；`jobs §5.2 L201` | C/D 假设 | 用户未批准；公开页面是邮件/网络申请；领域场景自己把它列为待验证不确定性（`domain-scenarios §2 L49`） | D04 + business owner 根据真实案例确认起点 |
| **单市场/单品类/单团队/单对象类型/单来源路径** | `plan §8.1 L515`；`decision-register D02 L10、D03 L11` | C 建议 | 没有 owner/市场/品类/对象证据；`jobs` 证明四类程序流程不同 | D02/D03 业务 owner 签核 |
| **技术栈**：TypeScript/Node/React/PostgreSQL/私有对象存储/模型适配器 | `plan L11` | C 讨论起点 | 用户未批准；D09 未关闭；本评审不做架构判断 | D09 技术/安全/运维/财务 |
| **45–70 工程人日 / 80–130 总人日 / 6.4–10 周容量** | `plan §8.2 L528–530`、`§8.3 L536`；`alternatives §8.1 L426–427` | C WBS | 不是统计区间/报价/排期；`calibration CAL-30 L77` 明确撤回综合交付区间；D12 未批准 | D12 实际容量/外部等待/审批 |
| **PMO Radar 身份 = 本项目** | `boundary §初步命名核验 L19–24`；`decision-register D01 L9` | C 研究默认 | 用户要求“定位具体 Radar 项目”，但名称/域名/继承关系未确认；PMO 的 Radar 与 radar 域名上的 Echo 是两个项目 | 发起人/PMO/技术负责人 D01 |
| **CreatorIQ + impact.com 是代表性替代** | `alternatives §3.1 L103–109` | C 研究选择 | 只读 2 个 vendor、6 页上限；Shopify 403；不是市场扫描；Impact 可能已是现有 affiliate 网络 | B0 案例 + 采购/技术标准；补 Awin/CJ/agency/community/do-nothing |
| **“A 后悔值最低”** | `alternatives §6.4 L370` | C 判断 | 没有成本/失败基线；没有 owner；没有 adoption | 真实案例 + 流程执行成本 + 对比 |
| **“四个公开 program = 四个 job”** | `jobs §0.1 L12` | C 推断 | 页面是 offer，不是 operation；没有 owner/量/触发 | 每个 program 的 owner + 最近案例 + 当前产物 |
| **权利七元组** | `pmo-map §3.6 L142`、`§7.5 L414–416`；`decision-register D08 L16` | 未定义 | PMO 只给名字；公开页面/路由未发现；法务未定义 | 法务/品牌资产 owner 的用途矩阵与合同模板 |
| **飞书应用配置/权限/可用范围** | `boundary L14`；`decision-register D06 L14` | 未验证 | 只有 App ID；没有后台核验；不能读聊天/发消息 | D06 应用 owner/安全/技术 |
| **Radar 工作台已存在/可复用** | `pmo-map §6.1 L308–320`；`boundary L21–24` | 公开面不支持 | `magpie.luteos.com` 公开面是视频应用；私有模块未登录未验证；不能说不存在，也不能假设存在 | D01 + 应用 owner |
| **PMO 日期/百分比是项目承诺** | `pmo-map §4.1 L154–158`；`calibration L17`、`CAL-19 L66` | C 记录 | 25/20/15 是能力登记；日期是 PMO 参考；不是本项目排期 | PMO owner 确认；本项目 D12 另估 |

**结论：** 上面的锚点没有一个被用户或业务 owner 批准。三份专题大多标了 C，但 C 标签不能阻止它们成为讨论默认值；本文明确把它们全部视为未批准。

## 10. 访谈问题审计：哪些问题会得到无效证据

> 方法依据：`validation §6.1 L285–290` 引用 NN/g“问具体最近事件，不问一般流程”；`validation §6.2 L363–373` 明确列出不要问的 would-you-use 问题。`jobs §9` 的问题库部分好，但有几条违反了这个标准。

| 问题（原文/短引） | locator | 问题 | 替换建议 |
|---|---|---|---|
| “如果 Radar 明天给一张卡片/计划，什么情况下你会用？什么情况下它会误导你或增加工作？” | `jobs §9 D.12 L329` | **直接违反** `validation §6.2` 的“不要问假设性意愿”；会把受访者锚在 Radar 产物上，得到社会赞许/功能愿望，不是行为证据。 | “最近一次你拿到一份背调/计划/推荐时，你实际用它做了什么决定？如果没有，最近一次你需要这类材料是什么场景？” |
| “G1/S2 的声量目标和销售/佣金目标，在实际工作中怎么排序？谁负责哪个指标？分母和窗口是什么？” | `jobs §9 E.13 L333` | 抽象排序 + 制度性问题；受访者可能给 espoused theory，而不是实际取舍；分母/窗口可能无人知道。 | “最近一次声量目标和销售目标冲突时，你们实际怎么处理？谁做的决定？留下了什么记录？” |
| “如果这个项目只能先做一个工作，你会选哪个？为什么？什么情况下应该停？” | `jobs §9 E.15 L335` | 征求偏好/优先级，不是最近行为；容易得到“我觉得”的答案；也会诱导过早选 job。 | “最近一次你们在多个合作工作之间分配时间/预算时，实际怎么分的？谁决定的？后来调整了吗？” |
| “你们怎么决定一个合作走 affiliate、sponsored、community、expert/creative 还是 celebrity/IP？这个分类是谁定的？” | `jobs §9 C.7 L321` | 一般流程 + 分类法问题；不是最近案例；受访者可能复述制度而不是实际做法。 | “最近一次你们要在两个合作类型之间选一个，实际是怎么选的？第一份材料是什么？谁拍板？” |
| “你们现在用哪些表/后台/邮件/合同？哪些是重复录入？哪些经常过期？” | `jobs §9 D.10 L327` | 工具 inventory，不是具体事件；回忆偏差大；应通过 artifact register 取得。 | “最近一次你为了一个合作决定打开的第一个文件/系统是什么？后来还打开了什么？哪里重复了？” |
| “同一个创作者同时是联盟、Influencer、社区 Co-Creator 或活动大使时，你们怎么知道？谁是主 owner？” | `jobs §9 B.6 L317` | 一般性问题；如果锚在最近一个重叠案例，会很有价值。 | “最近一次同一个创作者出现在两个 program 里是什么时候？你们怎么发现的？谁负责？” |
| “有没有一次是从 brief 开始、而不是从某个人开始的？那次流程有什么不同？” | `validation §6.2 Q9 L313` | 二选一引导；假设 brief 和人是对立的起点。 | “最近一次合作决定的第一份材料是什么？是 brief、链接、名单、还是别的？后来怎么变的？” |
| “如果信息缺失，你会补料、降级判断、还是放弃？最近一次是哪样？” | `validation §6.2 Q13 L320` | 封闭选项引导；受访者会从给定选项里选。 | “最近一次信息不全时，你实际做了什么？当时缺的是什么？对决定有什么影响？” |
| “最近一次跨群 / 私聊 / 表格复制信息是什么场景？为什么不在一个地方做？” | `validation §6.2 Q22 L335` | 预设“复制信息”发生过；可能诱导确认。 | “最近一次你把信息从一个地方挪到另一个地方是什么场景？为什么？” |
| “如果这个产物错了，最坏会发生什么？谁会受影响？什么错误可以接受？什么一次都不能有？” | `validation §6.2 Q32–33 L353–354` | 假设性风险问题；不是 adoption 证据，但对 stop signal/风险容忍有用。 | 保留，但标注 `stated_expectation`，不要当行为/采用证据；优先问“最近一次错误/纠正是什么？” |

**跨文件一致性发现：** `jobs` 的问题库与 `validation` 的禁令冲突。`jobs` 自称“中性最近案例访谈探针”（`§9 L303–305`），但 Q12 是明显的 would-you-use；Q13/Q15 是偏好/排序。**执行时应以 `validation` 的禁令为准**，并把这几个问题替换为最近事件问题。

## 11. 不必要的技术/研究设计：B0 方法过重

- `validation` 有 918 行，包含 17 字段 episode ledger（`§5.1 L196–216`）、15+ 时间/成本/采用公式（`§7.2 L433–455`、`§7.3 L471–487`、`§7.5 L509–523`）、Tier 1/2/3 规则（`§8.2 L605–614`）、演练协议与评审质量控制（`§9`）、退出 memo/handoff package（`§10.3`、`§12`）。这些作为后续方法库是有价值的；作为“第一次 B0、还没有一个案例”的起步协议，过重。
- 具体风险：团队会先花时间搭 ledger/公式/模板，而不是拿到第一个案例；17 字段和 15 个指标会制造“已经测量”的错觉；业务 owner 可能被研究 apparatus 吓退。`validation` 自己说“样本量是研究参数”“不设固定阈值”（`§4.3 L182`、`§7.1 L424`），但文档规模本身在传递“必须全套”的信号。
- **建议（C）**：第一案例只用一页纸：触发、角色、步骤、产物、等待、返工、决定、未知、下一动作、证据等级。2–3 个案例后，再按需启用 `validation` 的完整量表。`B0.0–B0.7` 的“顺序不可跳过”（`§3 L129`）应改为“按案例成熟度逐段启用”；它不是项目批准的门。
- `alternatives §6.1 L284–311` 的 Strategy A 是一套具体流程设计（brief 模板、证据清单、权利登记、飞书任务、通用 LLM 摘要、决策日志、月度抽样），在观察现状之前就给出。它可以作为“候选流程改动”假设，但不能作为“A 最低 regret”的策略排序；流程修复是否足够，取决于案例，不取决于设计完整度。
- **明确边界：** 本文不评技术栈、数据库、部署、模型或多 Agent 架构；上面的“过重”只针对 B0 研究方法，不是架构评审。

## 12. 本地来源 claim → problem → correction → needed human evidence 矩阵

> 读法：`Claim` 是原文/短引；`Locator` 是本地文件章节+行号；`Problem` 是本文的反证；`Correction` 是应采用的限定写法；`Needed human evidence` 是能改变判断的真人材料/owner。所有本地研究/规划材料为 C；外部页面按专题转述为 C；没有 A 级业务批准。

### 12.1 三份专题中的主张

| ID | Claim（原文/短引） | Locator | Problem | Correction | Needed human evidence |
|---|---|---|---|---|---|
| T01 | “公开计划不是‘一个达人发现流程’，至少支持四种不同的伙伴业务工作。” | `jobs §0.1 L12` | 公开页面证明的是四种 **public program surface**，不是四个内部 job；没有 owner、量级、触发、当前产物。 | 改为“四个公开 program surface；内部 job/owner/量级未证明”。 | 每个 program 的具名 owner；最近 1–2 个案例；月度申请/评审量；当前表/后台。 |
| T02 | “link-first 背调只对‘入站创作者初筛’这一窄工作有直接相似性。” | `jobs §0.1 L14`；`§5.2 L201` | 仍在用 link-first 做参照；公开页面是邮件申请/账号审核（CL-04/05），联盟是网络申请（CL-02）；没有观察到的 link 触发。 | “link-first 是未观察假设；先问最近案例的第一份材料，不把 link 当默认起点。” | 最近案例的触发方式、第一份材料、申请渠道；operator/approver 分别确认。 |
| T03 | “brief-first 只对 campaign/赞助/专家合作可能成立，但公开页面没有 brief 证据。” | `jobs §0.1 L14`；`§5.2 L202` | 没有公开 brief；没有证据 brief 先于选人；仍是产品形状假设。 | “brief-first 未被公开证据支持；只在真实 brief 出现时检验。” | 最近几个 campaign 的 brief/时间线/变更记录（N 由可得性决定）；谁写、何时写、是否先于候选。 |
| T04 | “existing collaboration monitoring 对 Co-Creator 和联盟后台有最强的公开规则支撑。” | `jobs §0.1 L14`；`§5.2 L203` | “公开规则支撑”不等于“业务痛点/量级/未满足”；operations team 可能已覆盖；proprietary weights + human review 不可自动评分。 | “公开规则证明有周期性评审；不证明它是瓶颈或值得建系统。” | 月度 roster、评审耗时、漏审/申诉/争议、当前工具、owner 容量。 |
| T05 | “专家/创意服务是中等可能的独立 job。” | `jobs §3.3 L138` | 只有角色/权益，没有申请/评估/合同/量级；技能 sourcing 可能走 agency/freelance；与创作者发现不是同一流程。 | “公开页面列出技能型角色；job 未证明；先看最近 request 与 sourcing 方式。” | 最近 10 个专家/创意请求（不是强制数）、当前 sourcing 渠道、owner、费率/合同。 |
| T06 | “celebrity/IP licensing …只能作为另一个假设，不应作为首发假设。” | `jobs §3.3 L135` | PMO 命名对象是 IP/名人；把它排除会造成 **PMO 对象 vs B0 证据对象** 的错位；不是“另一个假设”那么简单。 | “四页没有 celebrity/IP 证据；这是覆盖缺口，不是排除理由。若 PMO 名称字面成立，B0 需 reframe。” | 团队是否做 celebrity/IP；最近案例；合同/授权/独家/费用/审批；法务/senior brand owner。 |
| T07 | “Affiliate 适配：低到中。” | `jobs §3.1 L105` | 评分没有量级/owner 证据；联盟 intake/审批/结算/数据在网络；可能是 PMO 范围外。 | “不做 fit 评分；先问联盟侧还剩什么决定由 Momcozy 做。” | 网络报告、Momcozy 侧审批角色、例外/异常量、合同/数据访问。 |
| T08 | “Co-Creator 适配：中到高，但也是重复风险最高的方向。” | `jobs §3.4 L158` | “中到高”是判断，不是证据；奖励金额小；operations team 可能已有流程；human review 是规则要求。 | “不做 fit 评分；先问评审量/耗时/漏项/现有工具。” | 月度评审记录、耗时、appeal、当前社区后台/表、owner。 |
| T09 | H1 最低验证材料：“最近 20 个申请；时间戳；决定理由；补料次数。” | `jobs §6 L228` | 20 没有依据/抽样框；与 `validation §4.3 L182` 的“样本量是研究参数”冲突；看起来像统计样本。 | “N 由可得性/饱和决定；报告 N 与选择；20 不是门槛。” | 实际申请量、可取得的样本框、时间戳/决定记录；owner 同意样本。 |
| T10 | H2“3 个 brief”、H3“3 个月 cycle”、H5“10 个请求”、H7“5 个活动”。 | `jobs §6 L229–234` | 固定数量/窗口没有依据；不同 job 的量级不同；不能作为统一 B0 最低材料。 | 改为“研究参数，不是 gate；按案例覆盖/饱和决定；报告实际 N/窗口”。 | 各 job 的真实月度/季度量；owner 对观察窗口的确认。 |
| T11 | “如果 Radar 明天给一张卡片/计划，什么情况下你会用？” | `jobs §9 D.12 L329` | 违反 `validation §6.2 L363–373` 的 would-you-use 禁令；社会赞许/功能愿望，不是行为。 | 改为“最近一次你拿到背调/计划/推荐时，实际做了什么决定？” | 最近决策记录/产物引用；operator/approver 分别复述。 |
| T12 | “G1/S2 的声量目标和销售/佣金目标，在实际工作中怎么排序？”；“如果这个项目只能先做一个工作，你会选哪个？” | `jobs §9 E.13 L333`、`E.15 L335` | 抽象排序/偏好，不是最近行为；诱导过早选 job；可能得到 espoused theory。 | 改为“最近一次目标冲突/时间预算分配，实际怎么处理？谁决定？” | 最近一次 trade-off 的记录；预算/时间分配；决定人。 |
| T13 | “你们怎么决定一个合作走 affiliate/sponsored/community/expert/celebrity/IP？”；“你们现在用哪些表/后台/邮件/合同？” | `jobs §9 C.7 L321`、`D.10 L327` | 一般流程/工具 inventory；回忆偏差；不是具体事件。 | 锚到最近一个案例；用 artifact register 代替 inventory。 | 最近案例 artifact；实际打开的系统/文件；重复录入证据。 |
| T14 | “（概括）PMO G1/S2 被用作品牌多渠道声量增长/公共关系目标。” | `jobs §7.1 L242–244` | G1/S2 是 PMO C 级规划记录，不是 Momcozy 内部批准战略；公开 program 混合销售/曝光/社区/技能。 | “PMO G1/S2 是 C 级背景；不推断 Momcozy 优先级/预算/ROI；不把声量当唯一目标。” | Momcozy brand owner 的目标/指标；PMO owner 确认 G1/S2 效力。 |
| T15 | “sales-only 或 awareness-only 都会误读组合。” | `jobs §7.2 L247–260` | 这个 caution 正确，但文件没有 owner-approved 指标；后续仍用“value/benefit”比较。 | 保留 caution；进一步要求“一个 job 一个主指标”，不做跨 job score。 | Owner 批准的主指标（分子/分母/窗口）；每个 job 的 decision owner。 |
| T16 | “没有证据表明 Momcozy 使用上述任何工具。” | `alternatives §3.1 L109` | 与 `jobs CL-02 L379` 的 “We partner with Awin, Impact, and CJ Affiliate networks” 冲突；至少是 Impact 命名碰撞。 | 改为“Momcozy 公开称与 Awin/Impact/CJ 网络合作（C）；这是网络关系证据，不是 impact.com 全平台/内部 workflow 证据；需核实产品/合同。” | Affiliate program owner/合同；实际使用的网络产品；数据访问/导出。 |
| T17 | “两个可核验的替代产品各覆盖一部分，没有一个覆盖七段全链路。” | `alternatives §0.3 L13`；`§1.1 L22` | “七段”是 `alternatives` 自己的研究/候选评估框架（发现→评估→关系→brief/计划→权利→监测→结果），不是已观察流程；只读了 2 个 vendor；Shopify 403。 | 改为“在已读的 2 个 vendor 页面中，没有覆盖该候选七段；不是市场结论；实际流程可能不同。” | 真实 as-is 流程；更多 vendor/网络/Agency/社区/自建对比；采购标准。 |
| T18 | “在未取得真实案例前，A 的后悔值最低。” | `alternatives §6.4 L370` | 没有成本/失败/执行基线；“后悔值”不是测量；A 仍是一套流程设计。 | 改为“A 是条件性假设；在案例/成本/执行证据前不排序。” | 3–5 案例（研究参数）中的时间/返工/权利事故；流程执行成本；owner。 |
| T19 | “3–5 个真实脱敏案例；至少 2 类合作对象、1–2 个市场；不是演示样例。” | `alternatives §7.1 L378` | 数量/分层被写成“最低可接受形态”，容易变成 gate；`validation §4.3 L182` 说样本量是研究参数。 | 改为“研究参数：先 1 个负案例，再按 job 覆盖/饱和扩展；报告 N/选择；2 类/1–2 市场是可选分层，不是门槛。” | Owner 同意样本框；案例可得性；覆盖限制；不把便利样本当代表。 |
| T20 | “当前人工流程假设：表格/飞书 + 通用 LLM/manual evidence。” | `alternatives §2.2 L68` | 明确是未观察假设，但 Strategy A 以它为设计基础；没有实际工具/耗时/返工/权利事故。 | 在观察前不设计 A；把 A 写成“候选流程改动”，不是策略排序。 | 实际工具清单、案例时间线、返工/缺证/权利事故、operator/approver 访谈。 |
| T21 | “B0 采用 B0.0–B0.7 八个步骤，顺序不可跳过。” | `validation §3 L129` | 方法是 C，不是项目批准；“不可跳过”过重；第一次 B0 还没有案例，先搭全套 apparatus 会拖慢。 | 改为“按案例成熟度逐段启用；第一案例用一页纸；完整量表 2–3 案例后再用。” | Owner 同意 B0 范围/负担；在一个案例上试运行；记录研究负担。 |
| T22 | `actual_adoption = accepted_episodes / eligible_episodes` | `validation §7.5 L514` | B0 没有 Radar 产物可被采用；把未来产品 adoption 放到 B0 会定义悬空；只能测“当前流程产物是否被用于决定”。 | B0 测当前流程的 artifact use/decision record；未来 adoption 在试点阶段另定义；不要用 B0 公式冒充产品采用。 | 当前 decision record/审批记录；试点定义；owner 确认“使用”定义。 |
| T23 | Tier 1 条件：“频率 recurring、严重性至少 medium…有具名 owner、替代方案不足。” | `validation §8.2 L605–614` | 没有案例数据时所有维度 unknown；规则仍会产生“Tier 1”外观；定性阈值不是测量。 | 无案例时所有 job 标 `insufficient_evidence`；不排名；Tier 1 只在案例覆盖后使用。 | Episode ledger；逐维证据指针；owner 确认；dissent。 |
| T24 | 第一个问题：“请指定最近一个真实、可脱敏…合作决策案例。” | `validation §13.2 L809` | 好问题，但可以由协调人回答，不要求具名 owner/决策权；没有 owner 的案例可能无法授权访谈。 | 先问“谁是对这个决定负责的具名 owner，最近哪个负案例？”；再问授权。 | 具名 owner；案例；授权记录；operator/approver 可分访。 |

### 12.2 本地锚点/继承主张

| ID | Claim | Locator | Problem | Correction | Needed human evidence |
|---|---|---|---|---|---|
| A01 | PMO 将 Radar 登记为 G1/S2 “IP/名人 Agent & 工作台”。 | `boundary L19–24`；`pmo-map §2.2–2.4 L56–79` | 三份专题把研究对象窄化为创作者/联盟/社区；celebrity/IP 无证据；身份/域名 D01 未批。 | 保留 PMO C 记录；明确“研究对象可能是 IP/名人，公开证据未覆盖”；D01 未批前不把身份当批准。 | 发起人/PMO/技术负责人确认 D01；业务 owner 说明真实对象。 |
| A02 | PMO 25/20/15 是能力百分比。 | `pmo-map §4.1 L154–158`；`calibration L17` | 三份专题正确按 C 处理；但外部读者可能把 20% 当完成度。 | 继续写“登记值，不是完成度/价值/采用”。 | PMO owner 确认记录语义；本项目不继承百分比。 |
| A03 | `verified_summary` 写“BD 在飞书查达人背调、点卡片登记寄样与二创授权到期”。 | `pmo-map §3.2 L107` | 这是 C 级 PMO 记录，不是观察到的流程；三份专题把它当工作假设是合理的，但不能当事实。 | 标“PMO 记录/待观察”；不据此设计 MVP。 | BD operator/approver 的最近案例；实际飞书/表/后台使用。 |
| A04 | 跨 Agent 协议：Radar 是 `creator_id` + 授权七元组的唯一登记源。 | `pmo-map §3.6 L142` | 协议是 C，不是已实现接口/法律授权；七元组字段未定义；下游 Clone/Paid Media 消费未验证。 | 写“待落实的跨系统协议”；不假设机器可读/法务有效。 | 法务/数据/下游 owner；合同/接口/回执；七元组定义。 |
| A05 | PMO 能力图谱写“场景写了 5 个环节”。 | `pmo-map §0 L22` vs `§2.4 L77`；`calibration CAL-02 L49` | 同文件链条只有 4 项；5 是旧口径/过宽推断，不是当前的 4 项；专题若照抄会传播。 | 统一写 4 项：粉丝分析→合作计划→动态监测→机会推荐。 | PMO 原文/owner 确认；不把能力名当流程。 |
| A06 | PMO 图谱建议“20 个 golden set、P95 ≤10s、BD 采纳 ≥80%、precision@10 ≥0.6”。 | `pmo-map §7.2 L378–382` | D 级建议；不是 PMO 批准阈值；`calibration CAL-19 L66` 明确 20/10s/80% 未批准。 | 不作为 B0 基线或验收；如需指标，由业务 owner 另定。 | Owner 批准的主指标；实际样本/耗时/采纳测量。 |
| A07 | 主计划 MVP：主页/账号输入→背调→brief 关联→认领→材料待审。 | `plan §2.1 L123`、`§2.2 L132`；`decision-register D04 L12` | 用户未批准；公开页面是邮件/网络申请；D04 未关闭；这是旧 MVP 锚点。 | 标“C 候选闭环”；B0 先观察起点，不把 link-first 当默认。 | D04 业务 owner；真实案例；起点分布。 |
| A08 | 主计划假设单团队/单市场/单品类/单对象类型/单来源路径。 | `plan §8.1 L515`；`D02 L10`、`D03 L11` | 没有 owner/市场/对象证据；B0 尚未确定；不能作为估算前提当事实。 | 标“估算假设，不是范围批准”；D02/D03 前不冻结。 | 品牌业务 owner 选择市场/品类/团队/对象；案例分布。 |
| A09 | 主计划技术栈与 45–70/80–130/6.4–10 周。 | `plan L11`、`§8.2 L528–530`、`§8.3 L536`；`alternatives §8.1 L426–427` | 技术栈 D09 未批；人日/周数是 C WBS，不是报价/排期；`CAL-30 L77` 撤回综合区间。 | 保留为 C 讨论输入；不写承诺/预算/关键路径；D09/D12 另批。 | D09 技术/安全/运维/财务；D12 容量/外部等待。 |
| A10 | `magpie.luteos.com` 是 Radar 工作台。 | `pmo-map §6.1 L308–320`；`boundary L21–24` | 公开面是 Short Video Factory 视频应用；私有模块未验证；不能假设 Radar 工作台存在/可复用。 | 写“部署归属待核对；公开面不支持；私有未知”；D01 前不设计复用。 | D01 发起人/PMO/技术；应用 owner；私有后台证据（如获授权）。 |
| A11 | “creator_id + 授权七元组”可作为权利登记 schema。 | `pmo-map §7.5 L414–416`；`decision-register D08 L16`；`jobs §5.3 L207–210` | 只有名字，没有字段；公开页面/路由未发现；权利范围可能远超七个字段；法务未定义。 | 不设计 schema/gate；先做法务 use-case 矩阵；纯筛选用 `not_assessed`/`unknown`。 | 法务/品牌资产 owner；合同模板；用途/地域/渠道/期限/转授权/撤回/下游。 |
| A12 | Co-Creator 的内容许可是 perpetual/irrevocable/sublicensable。 | `jobs CL-14 L391` | 只适用于该 Program 提交内容；不是所有合作/所有素材的通用许可；不能外推。 | 限定到 Program/内容/条款；其他合作逐合同审查。 | 法务审查 Program 条款；其他 program 合同；创作者同意记录。 |

### 12.3 矩阵后的“人类证据包”（按角色）

| 角色 | 必须提供 | 为什么改变判断 | 不充分/不能代替 |
|---|---|---|---|
| 发起人/Sponsor | 具名 business owner；B0 范围/资源；是否授权访谈 | 没有 owner，B0 只能 hold；Agent 不能替业务接受 | “先做做看”、口头兴趣、Agent 复核 |
| 品牌业务 owner | 真实对象（IP/名人 vs 创作者/联盟/社区/PR）；一个主指标；停止信号；首发团队/市场/品类 | 决定 B0 是否在正确对象上；决定“value”定义 | 泛泛“都要”、PMO 百分比、品牌营销数字 |
| Program owner（affiliate/influencer/community/expert/PR/IP） | 最近 1–2 个负案例；月度/季度量；当前产物；审批人；耗时/返工/例外 | 证明 job 是否存在、是否有量/痛点/owner | 页面链接、功能愿望、行业报告 |
| Operator | 实际步骤、工具、等待、补料、返工；最近案例时间线 | 还原 as-is；发现真实起点（可能不是 link/brief） | 对“应该怎么做”的叙述、一般流程 |
| Approver | 决策标准、拒绝理由、复核负担、风险容忍 | 解释为什么批/不批；验证证据是否足够 | 操作者替审批者回答 |
| 法务/品牌资产 | 权利 use-case 矩阵；合同/披露/claim 模板；撤回/到期 owner；未成年人/医疗边界 | 决定权利是否可行；防止 schema 先于法律 | “七元组”名称、Co-Creator 单一 program 条款 |
| 数据 owner | 每个必需字段的 permission_basis、access_method、freshness、failure semantics、retention | 决定 job 是否可做；防止假设 API/后台可得 | “平台存在”“公开可见”“以后采购” |
| 财务/采购 | 成本结构、费率、预算包络、license/实施/维护/退出 | 决定 A/B/C 是否可比较；防止 C WBS 当报价 | vendor 营销 ROI、无报价的“低成本” |
| PMO | D01 身份/名称/域名；PMO 记录语义；G1/S2 效力 | 防止把 PMO 登记当项目批准；防止 Radar/Echo 混用 | PMO 页面百分比/日期当承诺 |
| 飞书应用 owner/安全 | 应用归属、权限、订阅、版本、可用范围 | 决定真实入口是否可行；本轮未验证 | App ID 本身、Agent 假设 |

## 13. 单一最有信息量的 FIRST 人类问题

> **“谁是对最近一次以拒绝 / 搁置 / 返工结束的合作决定负责的具名业务 owner，那个案例是什么？”**
>
> 英文备选：**“Who is the single named business owner accountable for the partnership decision that most recently ended in a rejection, deferral, or rework — and what was that case?”**

**为什么是这个问题：**

1. 它同时要求**一个具名 owner**和**一个负案例**。没有 owner，案例无法授权访谈、无法确认停止信号；没有负案例，容易只拿到成功故事。
2. 它不问“哪个 program 最重要”“你会不会用 Radar”“你想要什么功能”，避免假设性意愿和过早方案化。
3. 它直接测试 B0 能否开始：如果答案是“没有单一 owner / 没有最近负案例 / 不能脱敏”，B0 应 hold 或 reframe，而不是继续写抽象方案。
4. 它不把 link/brief/monitor 作为菜单；起点由案例自己浮现。案例可能是 link、brief、monitor、续约、材料审查、临时问题——这正是要观察的。
5. 它比 `validation §13.2 L809` 的 Q1 更强：Q1 只要求案例，可能由协调人回答；本问题要求 owner，确保后续授权和决策责任。

**问谁：** 发起人或品牌业务负责人（不是随机 operator）。如果对方不是 owner，请其指出 owner；不要接受“大家都可以”。

**回答如何改变下一步：**

| 回答 | 含义 | 下一步 |
|---|---|---|
| 具名 owner + 一个负案例 | B0 有锚点 | Q2：该 owner 是否授权分别访谈 operator/approver、取得脱敏产物？Q3：按时间线走案例。 |
| “没有单一 owner / 很多人” | 决策权不清 | hold/reframe；先解决 ownership，不选 job。 |
| “没有负案例 / 都是成功” | 样本偏差或问题不真实 | 要求最近一次补料/搁置/内部否决；仍无则 hold；不要用成功故事代替。 |
| “不能脱敏 / 不能访谈” | 证据路径不可行 | hold；记录阻塞；不绕开做外部研究冒充内部事实。 |
| 案例属于 celebrity/IP 或 PR，而非四页创作者 program | 研究对象错位 | reframe B0；不要把案例硬塞进 J1–J3。 |

**不要先问：**

- “哪个 program 最重要？”——意见，不是行为。
- “如果 Radar 给你一张卡，你会用吗？”——违反 would-you-use 禁令。
- “你觉得能省多少时间/多少钱？”——要求未经验证的推算。
- “你最喜欢哪个方案/界面？”——过早设计。
- “你们未来会不会需要？”——假设性意愿。

## 14. 覆盖限制、失败/截断与不能外推的边界

### 14.1 本轮覆盖

- 本地读取：见 §1.1。三份专题全文；主计划指定章节；PMO 图谱相关章节；少量交叉核对摘录。
- 外部页面：**0 次新抓取**。三份专题对 Momcozy/CreatorIQ/impact.com/GOV.UK/NN/g 的引用按 C 接受，未独立重抓；因此不能证明这些页面在本文写作时仍保持原文。
- 访谈/观察：0。真实案例：0。内部数据：0。法务审查：0。供应商 demo/API/报价：0。测试/演练：0。`human_gold_claim_count = 0`。
- 没有登录、申请、加入社群、访问个人创作者主页、发消息、采购、外联、付费模型、凭证 API、安装/代码/Git/部署。没有读取秘密、无关项目或无关浏览器标签。没有再委托子代理。
- 目标文件写入前不存在；本文为新建；未修改任何既有文档。

### 14.2 失败/截断

- 本轮没有网络访问，因此没有新的失败 URL；三份专题记录的失败为：Growth 申请页 `JavaScript is required` / `CRAWL_EMPTY_CONTENT`（`jobs §1.3 L56`、CL-08）；Shopify Collabs 两页 403（`alternatives §1.4 L53–54`、§3.4 L205–209）。这些失败被保留为 D，没有写成“不存在”。
- 未读文件/章节见 §1.1；不能把“本文未读”写成“文档没有”。
- 三份专题的外部引用未重抓；不能把“专题引用”写成“本文独立验证”。
- PMO 工作台私有区未登录；不能证明 Radar 模块存在或不存在（`pmo-map §6.1 L322`）。
- 公开页面可能变化；版本以访问日期代替；没有快照/commit。

### 14.3 不能外推

- “公开页面未展示” ≠ “内部没有”；“未观察到” ≠ “不存在”；“未文档化” ≠ “供应商没有”；“没有证据” ≠ “证伪”。
- “PMO 登记” ≠ “项目完成/批准”；“PMO 25/20/15” ≠ “业务价值/采用/ROI”；“PMO 日期” ≠ “本项目排期”。
- “品牌页面存在 program” ≠ “Momcozy 内部有对应 job/团队/预算/流程”。
- “供应商营销页说支持” ≠ “Momcozy 可用/已采购/API 有权限/数据合法”。
- “本文说某 candidate 反证强” ≠ “该 candidate 被否决”；只是证据不足。**本文不批准、不否决、不排序任何 job。**
- 本文是 C 级研究评审；可能错；需要真人业务/法务/数据 owner 复核。

## 15. 输出契约

- **conclusion：** 三份 B0 专题提供了有用的公开 program surface、替代品和方法材料，但**不足以选出一个首发 job**。公共证据不能证明内部 owner、量级、触发、流程、权利/数据路径或价值；四个公开 program 不是四个已观察 job；PMO 命名的 IP/名人（以及 PR）没有被覆盖；link-first/brief-first/monitoring 仍是未批准锚点。本文只给三个互斥的候选决策 job（作为假设）和一个先问人的问题。没有业务价值、批准或测试完成结论。
- **evidence：** 本地文件与行号见 §1.1、§2、§12；三份专题全文；PMO 图谱相关章节；主计划指定章节；`human_gold_claim_count = 0`。外部页面未重抓，按专题 C 转述。
- **assumptions：** 研究对象暂按 PMO 的 Radar（C）；三份专题的外部引用大体忠实；本地行号对应 2026-11-08 版本；没有隐藏的 owner/案例数据。
- **uncertainty：** 真实 owner、对象类型（IP/名人 vs 创作者/联盟/社区/PR）、量级、触发、当前流程、耗时/返工、权利/数据/API、预算、价值指标、adoption、供应商采用/合同/API、飞书配置、工作台归属，全部 unknown。
- **confidence：** 对“公共-only 不能选首发 job”“四页是 offer 不是 operation”“IP/名人缺口”“link-first 是未批准锚点”“Q12 违反自身禁令”“样本数/阈值未批准”有较高文本依据；对任何业务价值/优先级/可行性低置信或 unknown。
- **blocked_actions：** 不实施、不选型、不采购、不询价、不申请 demo、不登录、不访谈（本文未获授权）、不联系创作者/代理/客户、不读取秘密/个人资料/聊天、不调用凭证/付费模型、不安装/写代码/Git/部署、不修改既有文档、不把本文当 D01–D12 批准或 B0 完成。
- **next_human_action：** 向发起人/品牌业务负责人问 §13 的单一问题；拿到具名 owner + 负案例 + 访谈/脱敏授权前，B0 保持 hold/reframe，不选 J1–J3，不进入需求冻结。

**strongest_unresolved_question：** 在 PMO 命名的 IP/名人业务中，**谁是对最近一次以拒绝/搁置/返工结束的合作决定负责的具名 owner，那个案例是什么？** 如果这个问题答不上来，B0 没有第一个锚点；如果案例属于 celebrity/IP 或 PR 而不是四个创作者 program，三份专题的候选 job 全部需要 reframe。
