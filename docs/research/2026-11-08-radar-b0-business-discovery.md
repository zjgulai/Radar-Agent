# Radar B0 业务发现合成（工作草案）

- 日期：2026-11-08
- 状态：B0 工作草案；公开研究已交付；内部业务发现未完成。不是章程、规格、MVP、预算、排期或批准。
- 范围：Momcozy 的 Radar Agent + 工作台；仅本地研究合成，无新增访谈、观察、数据读取或外部动作。
- 证据口径：本文件的建议均为 C；内部事实未知为 D/unknown；`human_gold_claim_count = 0`；没有测试或人类批准声明。

## 1. 状态、执行结论与证据边界

**状态**

- 公开研究已完成：既有笔记已覆盖 Momcozy 四个公开 program surface、CreatorIQ/impact.com 页面、PMO 记录与 B0 方法；本文件仅做二次合成，未重抓外部页面。Shopify Collabs 页面访问失败（D）。
- 业务发现未完成：没有内部案例、角色、as-is、基线、权利/数据路径、owner 接受或 D01–D12 的任何签核。
- 当前状态应写为 **public-research-delivered / internal-validation-pending**，不是“B0 已完成”。

**执行结论**

1. 最强建议是**方法**，不是建设：先取一个最近的合作决策 episode，还原证据与决定；再找可控约束；最后比较现有工具/流程、许可集成与窄自建。一个案例先用一页纸，不先搭完整方法库。
2. 四个公开页面只证明四个 **public program surface**，不是四个已观察内部 job；公共证据不能选出一个首发 job。
3. PMO 名称是 IP/名人，公开证据却覆盖创作者/联盟/社区；这是**选择覆盖限制**，不是“名人合作不存在”的证明。范围只有在真实案例出现后才对齐或 reframe。
4. link-first 仍是**说明性 C 候选**，不是已首选验证的 job；不能从产品草案反推用户起点。
5. CreatorIQ/impact.com 只到页面营销陈述；Momcozy 公开称与 Awin/Impact/CJ 网络合作（C），不等于 impact.com 全产品/功能/API/许可已被运营验证。当前内部工具、表格、LLM、agency、community、合同流程均为 unknown。
6. 现有证据不支持任何 A/B/C 方案排序、ROI、采用率、节省时间或市场覆盖结论；pause/stop 是业务选择，不是 Agent 可签发的结果。

**固定方向（不重开投票）**

- Agent + 工作台、两个飞书入口（群内 @Radar 与 P2P）、Main 路线是用户给定方向。
- B0 可改变**首个能力、范围、实现组合与数据/权利边界**；不假装项目形态尚未决定。

**证据边界**

| 证据类别 | 等级 | 能证明 | 不能证明 |
|---|---|---|---|
| Momcozy 公开品牌页 | C | 页面明确写出的 program 入口、权益类别与部分规则 | 内部 owner、量级、审批、SLA、工具、预算、实际执行 |
| CreatorIQ / impact.com 页面 | C（供应商营销） | 页面宣称的产品能力与集成叙述 | Momcozy 采用、合同、API 权限、价格、国家可用性、ROI |
| PMO 记录 | C | PMO 的登记、命名、OGSM 语境与自报状态 | Momcozy 批准战略、预算、完成度、业务价值、项目授权 |
| B0 方法资料 | C | 可讨论的方法步骤与证据规则 | 已批准流程、组织授权、访谈/观察已发生 |
| 本合成建议 | C | 下一轮研究输入与待验证假设 | 需求冻结、MVP、验收线、任何批准 |
| 内部事实 | D / unknown | 无 | 角色、案例、基线、权限、成本、owner 接受 |

- 人工金标纪律：`human_gold_claim_count=0`；当前没有人类金标或批准记录。标记不作为业务证据或授权，本轮不读取、解析或使用应用秘密。
- 所有“未展示/未文档化/未观察到”均不等于“不存在/没有该功能/被否决”。

## 2. 四个公开 program surface（不是四个已观察内部 job）

| Public surface | source_id + locator | 短引文 | 能支持的解释 | 不能证明 |
|---|---|---|---|---|
| 申请/网络入口（Affiliate） | SRC-B0-BRAND-02；FAQ “How do I get started?”；CL-02 | “We partner with Awin, Impact, and CJ Affiliate networks” | 联盟申请通过 Awin/Impact/CJ 网络进入；页面存在公开申请路径 | Momcozy 侧审批人、申请量、拒绝原因、后台数据访问、内部工具 |
| 账号审核（Influencer Rewards） | SRC-B0-BRAND-01；FAQ “Bloggers, content creators...”；CL-05 | “We will review your application and give you feedback based on the evaluation of your accounts.” | 入站申请存在账号级审核与反馈动作 | 评分权重、审核人、SLA、通过率、补料/返工、实际合同 |
| 技能/大使角色（Growth + Influencer） | SRC-B0-BRAND-03；Membership / Facebook Group / 三个 role sections；CL-07；SRC-B0-BRAND-01；Benefits；CL-06 | “If you're an editor, designer, illustrator, native speaker, or multilingual, we invite you to collaborate”；“Chance to Become Our Brand Ambassador & Co-branding” | 页面明确列出技能型合作者与大使/co-branding 角色 | 技能 sourcing 流程、作品集评估、任务分配、费率、合同、量级 |
| 月度 co-creator 人工评审 | SRC-B0-BRAND-04；§3.1、§3.3、§4.1–4.7；CL-11 | “holistic qualitative evaluation by Momcozy's operations team”；“human review”；“weighting and thresholds... are proprietary” | 存在月度、定性、人审的社区贡献评审表面 | 实际评审量、团队规模、耗时、漏项、申诉结果、当前工具、是否痛点 |

- 四行是**公开 offer/touchpoint**，不是“四个人”或“四个已观察工作流”。一个内部 episode 可能跨多个 surface。
- Co-Creator 的内容许可仅为该 Program 提交内容而设（SRC-B0-BRAND-04 §12.1–12.2；CL-14）；**program-specific license 不得变成一般可用权利**。
- 页面未写出的付款、披露、权利与执行细节均 unknown；不能从公开权益标签推断预算或合同。

## 3. PMO 标签与证据覆盖

| 观察 | 证据 | 含义 |
|---|---|---|
| PMO 产品名与链路 | SRC-B0-PMO-01；PMO `/projects` Radar 卡片、§2.4；CL-25 | 名称是 “Radar · IP/名人 Agent & 工作台”，链路为“粉丝分析 → 合作计划 → 动态监测 → 机会推荐” |
| PMO 自身的工作流引用 | SRC-B0-PMO-01；PMO drawer `verified_summary`、§3.2 | PMO 同时写“已导入 wiki 四维达人分层工作流（Expert/Editorial/Affiliate/Sponsored）” |
| 本轮四个品牌页覆盖 | SRC-B0-BRAND-01..04；§2 | 覆盖 Affiliate、Influencer、Growth、Co-Creator；没有名人/IP 合同、独家、费用、批准链证据 |
| 未覆盖的相邻对象 | SRC-B0-PMO-01 §2.2；B0-SYN-08 §1.4 | PR/Vicky 是相邻但不同的媒体公关对象；Expert/Editorial 与 Radar 有重叠，应按任务和对外交付责任划界 |

- 四页不能回答“首发对象究竟是 IP/名人、专家/编辑、联盟还是创作者”，也不能回答真实 owner。这是**选择覆盖限制**，不是“名人合作在任何地方都不存在”的证明。
- PMO 的 Expert/Editorial/Affiliate/Sponsored 是 PMO 记录中的工作流标签，不是已观察内部 job；不能把标签当流程事实。
- 若第一个真实案例是 celebrity/IP 或 PR，B0 应改变研究对象与范围，而不是把案例硬塞进四个创作者 program，也不是排除它。
- 不把 PR/Vicky 吸收成“泛品牌声量”背景；保留其独立边界，除非真实案例显示同一决策流程。
- PMO 的 G1/S2 品牌声量语境是 C 级规划记录（CL-16），不是已批准的 Momcozy 战略，也不是 sales-only 指标；当前没有 owner 批准的主指标。

## 4. 至多三个未排序的决策假设

| ID | 决策假设 | 典型主决定 | 需要真实案例回答 | 不能假设 |
|---|---|---|---|---|
| H-A | 入站申请处置 | approve / request_more_info / reject / defer | 谁收申请、看什么、谁批、多久、为何退回 | 页面上的“申请/审核”就是完整内部流程 |
| H-B | brief 关联的合作比较/条件决定 | shortlist / 选择候选 / 计划条件 / 暂缓 | brief 从哪来、是否先于候选、比较哪些条件、谁有决定权 | 一定先有 brief；或一定从主页链接开始 |
| H-C | 现有关系跟进/周期性决定 | renew / tier 调整 / 辅导 / 调查 / exit | roster 谁维护、多久看一次、异动后做什么、如何复盘 | 公开的月度规则就是瓶颈或值得建系统 |

- 三者**不是互斥人群，也不是完整 pipeline**；一个 episode 可能依次包含多个决定。首发切片应写明一个主决定，但不任意禁止相关的补料、复核或后续步骤。
- 不做 fit low/medium、权重、跨 job 排序、固定阈值、强制市场或强制案例数。
- 若真实案例是 named-IP/PR，研究范围随之改变；不以“四页没有”作为排除理由。

## 5. 替代方案：条件性比较，不是市场结论

**证据范围**

- CreatorIQ 页面（SRC-B0-CIQ-01/02）：发现、评估、campaign/关系、监测、measurement；页面宣称 “bi-directional API”（§Scale），但 scope、权限、导出、价格未知。
- impact.com 页面（SRC-B0-IMP-01/02）：发现/招募、Prospects pipeline、合同/签约、交易跟踪、支付/归因；页面未文档化 API。
- Shopify Collabs 两个帮助页均 403（SRC-B0-SHOP-01/02，D）；**不能推断功能存在或缺失**。
- 只读了上述页面，不能给“市场-wide vendor coverage”结论；“未文档化”不等于“产品没有该功能”。
- 当前内部工具、表格、通用 LLM、agency、community、合同流程均为 unknown；供应商页面不能替代内部证据。

**Momcozy 网络关系**

- Momcozy 公开称与 Awin/Impact/CJ 网络合作（SRC-B0-BRAND-02 FAQ；CL-02，C）。
- 这是**网络合作陈述**，不是 impact.com 全产品/功能/API/license 的运营证明；产品命名碰撞需核实合同与实际使用。

**条件性方法**

| 方法 | 何时可能合理 | 失败条件 | 需要的证据 |
|---|---|---|---|
| 现有工具/流程增强（augment） | 真实案例显示约束在交接、缺证、复核或重复录入，且现有表面可改 | 只增加步骤；无人使用；控制/审计/规模没有改善；把流程改动当免费 | as-is、耗时、返工、当前产物使用、执行成本、owner |
| 许可工具集成（integrate） | 约束集中在发现/评估/结果，且供应商字段、API、导出、合同可用 | 关键字段缺失；API/许可/国家/数据驻留不成立；成本或锁定不可接受 | sandbox、字段 demo、权限模型、价格、安全/法务复核 |
| 窄自建能力（build） | 已证明存在有意义的未满足、可控 job；有合法最低证据、owner、可维护性 | 只为“全链路”而建；无 owner；证据不可得；维护/采用失败 | 真实 episode、字段/权限路径、维护容量、失败定义 |

- 自建**不要求**“权利 + 跨入口 + 供应商缺口”三项同时成立；只需证明该 job 值得做、证据/权限最低可行、owner 与维护可行。权利只在具体用途需要时进入。
- 流程改变不天然最便宜、最低后悔；没有成本、执行与采用证据前不排序。
- Pause/stop 是业务决策选项，不是产品方法，也不是 Agent 可签发的结果。

## 6. 首个案例的十字段表单

可直接使用[合作决策案例填写模板](2026-11-08-radar-b0-case-template.md)。先填已知的脱敏摘要，细节按需要补充；模板不增加样本量或审批门槛。

| # | 字段 | 记录内容 |
|---|---|---|
| 1 | 触发 | 日期/时期、触发类型（申请、brief、监测、续约、材料审查、临时问题）、来源类别 |
| 2 | 主决定 | 决策问题、决定类型（approve/reject/request_more_info/defer/shortlist/renew/stop）、完成/失败定义 |
| 3 | 角色 | 操作者、审批者、复核者、需求方、下游；研究用别名，不要求真名 |
| 4 | 步骤与产物 | 步骤顺序、系统/渠道类别、关键产物与版本、线下/未记录步骤 |
| 5 | 人工与等待 | 分角色非重叠人时；内部等待/外部等待分开；标注 observed/artifact/estimated/unknown |
| 6 | 结果与返工 | 推进/拒绝/搁置/放弃/截止未决；实质返工次数、原因、补料轮次 |
| 7 | 必需证据与路径 | 做该决定实际需要的证据；已具备/缺失/不可得；合法或技术访问路径；降级方式 |
| 8 | 下一实际动作 | 谁在何时做什么；若 unknown 写 unknown；不把建议当已发生 |
| 9 | 来源、不确定性与同意 | 证据等级、未知、矛盾、脱敏/同意状态、可引用范围 |
| 10 | 选择说明 | 为什么选此案例；是否 negative/rejected/stalled；未纳入的案例与原因 |

- 本对话不收集 PII、合同、报价或秘密；探索阶段允许角色别名，不要求真实姓名。
- 近期 negative/rejected/stalled 案例更能暴露返工与缺证；但**绝不**把“必须有负案例”做成 stop gate。
- 一个案例只是说明性样例，不是验证、代表性样本或成功率。扩展时报告选择 N、结果分布、覆盖与 withheld 案例。

## 7. 最小指标建议

| 指标 | 定义 | 分母/处理 | 禁止 |
|---|---|---|---|
| 端到端墙钟 | `t_outcome - t_trigger`；未结束时算到 cutoff 并标 `censored` | 每个 episode；报告删失比例 | 只对成功案例求平均 |
| 人工投入 | 分角色非重叠主动区间之和；复核/返工只作为 tag 或子集，不再次相加 | 每个 episode、每个角色 | 把 review/rework 小时重复加到总人时 |
| 等待 | 内部等待与外部等待分开；并行区间取并集 | 每个 episode；无法分类单列 | 并行等待重复计时，或把外部等待算产品功劳 |
| 实质返工 | 在“已提交的合格 episode”中发生实质返工的计数与原因 | 明确 eligible 分母；review round 不等于 rework | 用所有点击/所有请求做分母，或把复核轮次当返工 |
| 当前产物→决定 | 当前 artifact/证据是否被实际决定记录引用 | 有决定记录的 episode | 把未来 Radar adoption 当 B0 结果 |
| 质量/复核安全 | 缺失、未知、错误对象、权利不明、审批分歧、复核负担 | 按 episode/产物报告 | 只用速度，不报质量/风险 |
| 金钱 | 只报已批准费率或实际记录支出 | 分 direct/overhead/人工，不混算 | 用未批准费率编 labor cost 或重复计成本 |

- 主指标在 job 选定后再定；速度与质量/复核安全并列，不用单一分数。
- 缺失写 `unknown`，不是 0；空分母的 rate 写 `undefined/NA`；开放任务做删失处理。
- 更广的 ROI、adoption、生产力收益只在后续获授权试点另定义。

## 8. 最小证据矩阵

| 需要字段 | 用途 | 建议路径 | 当前状态 | 许可/同意 | 角色 owner |
|---|---|---|---|---|---|
| 触发与时间线 | 重建 episode、定分母 | 脱敏记录、访谈、时间戳 | unknown | 参与者同意 + 数据规则 | 业务 owner / operator |
| 主决定与结果 | 定义完成/失败 | 决定记录、审批记录、访谈 | unknown | owner 同意 | approver |
| 角色与审批权 | 区分操作者/审批者 | 分别访谈、角色别名 | unknown | 参与者同意 | 业务 owner |
| 步骤与产物 | as-is 图、交接 | artifact register、脱敏截图 | unknown | 数据 owner + 同意 | operator |
| 人工/等待/返工 | 基线 | 时间记录、日历、表格变更 | unknown | 观察同意 | operator / approver |
| 必需证据清单 | 证据覆盖与缺料 | 决策标准访谈、模板 | unknown | owner 同意 | approver / 法务 |
| 数据/API 访问 | 可行性 | 供应商文档、sandbox、合同 | unknown | 数据/法务批准 | 数据 / 技术 |
| 权利/用途（条件性） | 是否需要授权 | 合同模板、use-case 矩阵 | unknown | 法务/品牌资产批准 | 法务 / 品牌资产 |
| Owner 接受与停止信号 | 退出判断 | owner 访谈/决定记录 | unknown | owner 同意 | 发起人 / 业务 owner |

- `unknown` 是字面状态，不是 TODO；没有批准记录就不填“permission granted”。
- 链接/页面可访问只证明本次可达性，不证明采集、保留、派生、分享或模型使用已获许可。已取得的许可也不证明内容准确、完整或适用于该决定；两者分别核验。
- 排除对孕期/健康/儿童/个人粉丝画像的敏感推断；权利与医疗 claim 个案转人类专家；模型不做法律批准。

## 9. 发现结果与当前缺口

| 结果 | 条件（建议，不签核） | 当前判断 |
|---|---|---|
| Advance | 至少一个真实 episode 端到端可复述；操作者/审批者分别确认；必需证据有路径或明确降级；owner 接受问题/范围/停止信号；无致命法律/伦理问题 | 未达到 |
| Reframe | 真实痛点存在，但对象/起点/决定/细分不对；例如案例属于 IP/名人或 PR | 若出现即触发 |
| Hold | 缺 owner、访问、证据、决定权或资源；记录解除条件 | 当前内部验证状态 |
| Stop | 问题不重要、现有替代足够、无合法证据路径、风险/成本不可接受 | 尚无证据支持 |

- 以上只是研究建议，不是签署；Agent 不能代签。当前状态仍是 **public-research-delivered / internal-validation-pending**。
- 当前 B0 缺口：角色/owner 可用性；首个案例 + as-is；基线；最低数据路径/许可；owner 对问题、范围与停止信号的接受。
- B0 为 D01–D04、D12 的相关子问题提供输入；现状基线由 B0 自身建立，D11 的正式指标、评测与接受线留待需求阶段。访谈不要求先批准全部 12 项决策，但仍需研究范围、参与者同意及材料使用权限。所有 D01–D12 仍未批准。
- 正式章程以后写到 `work/requirements/R-radar-charter.md`；本轮不写 spec，不进入实现。

## 10. 评审意见处置与来源登记

**关键意见处置**

| # | 关键问题 | 处置 | 本合成的写法 |
|---|---|---|---|
| 1 | 四个公开页面被写成四个内部 job | accepted | 全文改称 public program surface；内部 job 未证明 |
| 2 | 公共-only 不能选首发 job | accepted | 不排名、不选 job；business discovery 未完成 |
| 3 | PMO IP/名人与四页创作者证据错位 | accepted | 限定为选择覆盖限制；只有真实案例才 reframe；不排除 |
| 4 | link-first 仍是未批准锚点 | accepted | 仅作说明性 C 候选，不是已首选验证的 job |
| 5 | 权利/数据/API 被默认为可得 | accepted | 标 unknown；program-specific license 不外推；权利按用途进入 |
| 6 | 没有 owner 批准的价值指标 | accepted | 不造跨 job score；主指标在 job 后定；PMO 语境不等于战略 |
| 7 | 强制样本数/阈值泄漏 | accepted | 去掉固定 N/市场/对象数 gate；N 按可得性与饱和报告 |
| 8 | 访谈问题含 would-you-use | calibrated | 本合成改用最近行为；旧笔记未逐处改写，引用时以 critic/validation 为准 |
| 9 | 方法库对第一次 B0 过重 | accepted | 先一页纸一个案例；完整量表后置，且不设为硬 gate |
| 10 | 自建必须同时具备权利+跨入口+供应商缺口 | rejected-as-mandatory | 只需有意义、未满足、可控的 job + 合法最低证据/owner/维护性；权利条件性 |
| 11 | 流程改变天然最低后悔 | rejected-as-mandatory | 需成本/执行/采用比较；不做默认排序 |
| 12 | 没有负案例就必须停止 | rejected-as-mandatory | 负案例增强证据，不是 gate；一个案例不代表验证 |

- 本表只对本合成负责；旧文中的阈值、评分、would-you-use 措辞并未全部静默修正；引用旧文时回到其校准条目。
- 本合成不重复旧阈值（如 20 样本、P95、80% 采纳、35% 返工等）；这些不是 B0 基线、验收线或门槛。
- 不设法律 blanket，不让模型做法务批准；不强制真实姓名（研究可用别名），但推进到需求仍需明确责任角色。

**静态来源登记（八字段；新本地 ID 用 B0-SYN-*）**

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| B0-SYN-01 | C | 本文件 | Radar 研究草案 | 2026-11-08 | Radar/research | this research/review only | 不作为批准、规格或测试证据 |
| B0-SYN-02 | C | `docs/research/2026-11-08-radar-b0-momcozy-jobs.md` §2、§3.3、§5.3、§11–12；外部 SRC-B0-BRAND-01..05 | Radar 研究 + Momcozy 官方页面 | 访问 2026-11-08 | Radar/research | this research/review only | 不登录/申请/加入；不读个人资料；不推断内部流程 |
| B0-SYN-03 | C | `docs/research/2026-11-08-radar-pmo-business-capability-map.md` §2–3；PMO 页面 | PMO 维护方 / Radar 研究 | 2026-11-08 | Radar/research | this research/review only | 不把百分比当完成度；不推断 Momcozy 战略/预算 |
| B0-SYN-04 | C | `docs/research/2026-11-08-radar-b0-alternatives.md` §3–4、§6.4–7.1、§10；外部 SRC-B0-CIQ-01/02、SRC-B0-IMP-01/02、SRC-B0-SHOP-01/02 | CreatorIQ / impact.com / Shopify 页面 + Radar 研究 | 访问 2026-11-08 | Radar/research | this research/review only | 不推断采用/API/许可/功能缺失；不采购/询价 |
| B0-SYN-05 | C | `docs/research/2026-11-08-radar-b0-validation-method.md` §2.2、§5.1–5.5、§7、§10–12 | Radar 研究 | 2026-11-08 | Radar/research | this research/review only | 方法不是批准流程；不执行 live 动作 |
| B0-SYN-06 | C | `docs/research/2026-11-08-radar-b0-discovery-critic.md` §0、§12–13 | Radar 研究 | 2026-11-08 | Radar/research | this research/review only | 评审不是批准；不据此选 job |
| B0-SYN-07 | C | `docs/research/2026-11-08-radar-decision-register.md` | Radar 研究 | 2026-11-08 | Radar/research | this research/review only | D01–D12 全部未批准 |
| B0-SYN-08 | C | `docs/superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md` §1–3 | Radar 规划草案 | 2026-11-08 | Radar/research | this research/review only | 不作为排期、预算、MVP 或实施授权 |
| B0-SYN-09 | C | `docs/research/2026-11-08-project-research-boundary.md` | Radar 研究 | 2026-11-08 | Radar/research | this research/review only | 不作为章程或真实动作授权 |

- 外部页面的完整八字段与失败记录沿用 B0-SYN-02/04 所指笔记的 §11/§10；本表只给引用指针，不重抄外部登记。
- 引文主张使用底层 ID（CL-02、CL-05、CL-06、CL-07、CL-11、CL-14、CL-16、CL-25）定位；本合成不新增外部事实。

## 11. 结论契约（七字段）

- **conclusion：** 当前最合理的第一步是证据优先的最近决策 episode 方法；四页只支持公开 program surface，不选首发 job；PMO 的 IP/名人标签与现有证据存在覆盖错位；link-first 仅是说明性 C 候选；B0 业务发现仍未完成。
- **evidence：** 本文件 §2–§5、§10 的 source_id/locator/短引文；底层为 SRC-B0-BRAND-01..04、SRC-B0-PMO-01、SRC-B0-CIQ-01/02、SRC-B0-IMP-01/02、SRC-B0-SHOP-01/02（D）、本地方法/评审/决策/计划笔记。
- **assumptions：** 公开页面可代表当前对外 offer；PMO 记录是 C 级规划语境；内部流程/工具/预算/合同未知；研究可用角色别名；一个案例可用于说明方法，但不代表总体。
- **uncertainty：** 真实首发对象（IP/名人、专家、联盟、创作者或 PR）、owner、量级、触发、as-is、基线、必需证据/许可、权利用途、工具使用、成本、主指标与退出结果全部 unknown；D01–D12 未批准。
- **confidence：** 对“公共-only 不能选 job”“四页是 surface 不是 operation”“program-specific license 不能外推”“内部工具/API/权利未知”有较强文本依据；对任何具体业务价值、优先级、ROI、工期或可行性低置信/unknown。
- **blocked_actions：** 不访谈/观察/采集、不读私人聊天或个人资料、不登录/申请/外联、不采购/询价、不使用凭证/付费模型、不写代码/Git/部署、不编辑其他文件、不声称人类批准或测试通过。
- **next_human_action：** 未来需要的首个工件是一个脱敏、角色用别名的“最近合作决策 episode 一页纸”（按 §6 字段），并标明可授权访谈的操作者/审批者角色；这是后续研究输入需求，不是本轮提问，也不构成授权。
