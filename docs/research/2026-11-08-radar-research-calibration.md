# Radar 研究结论校准与来源登记

- 日期：2026-11-08。
- 状态：L0；用于本轮研究整合，不是业务、法务、架构或发布批准。
- 阅读优先级：**主计划及本文的限定口径优先于专题中的方案建议**。专题保留调查过程与来源，不自动成为项目规范。
- `human_gold_claim_count = 0`：研究与复核由 Agent 完成，没有人工金标或业务验收。

## 1. 统一证据等级

| 等级 | 本项目用法 | 效力边界 |
|---|---|---|
| A | 本项目可核对的系统记录、实际运行结果或正式批准记录 | 当前只有研究文件与初始目录检查；没有产品运行或批准证据 |
| B | 官方平台政策、法规/监管原文、标准组织安全建议 | 证明规则或机制，不证明本应用配置/实现；安全建议不是法律，法律解释仍需相应岗位 |
| C | PMO/Main/品牌的公开陈述、其他项目成果报告、本轮未批准方案 | 参考输入；不证明本项目完成度、可复用代码、内部合同或业务效用 |
| D | 未核验材料、访问失败章节、只来自记忆的描述或无来源推断 | 只能登记未知/研究问题，不能作为事实支持业务决定 |

专题使用过 A/B/C/D/U/O 等不同标记，不能直接跨文档比较。PMO API 中 `pct=20` 能证明“该记录写了 20”，不能证明“本新项目实现了 20%”；本轮对业务实现结论仍按 C 处理。

## 2. 来源八字段登记

所有 `workspace` 均为本轮 Radar 研究作用域；这是资料分类，不是外部平台已授权工作区。`allowed_agents` 仅限定本轮研究用途，不授予生产工具权限。版本未由来源明确公布时写访问日期，不伪造 commit、快照 hash 或批准版本。

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| SRC-PMO-01 | C | https://pmo.luteos.com/projects ; https://pmo.luteos.com/api/backup.json | PMO 站点维护方，具体 owner 未核验 | 访问 2026-11-08；Radar 记录 updated_at=2026-11-05T10:18:06.904114Z | Radar/research | 本轮研究/规划/复核 | 不据此继承完成度、写 PMO、批准排期或发布 |
| SRC-PMO-02 | C | https://pmo.luteos.com/roadmap ; https://pmo.luteos.com/sop | PMO 站点维护方 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不把登记日期/阈值当本项目承诺或批准指标 |
| SRC-PMO-03 | C | https://pmo.luteos.com/api/bot-kit/registry ; https://pmo.luteos.com/api/gate/receipts | PMO 站点维护方及回执登记方，实际权限未核验 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不据此使用凭证、签发授权或开放下游投流 |
| SRC-MAIN-01 | C | https://main.luteos.com/ ; https://main.luteos.com/need.html ; https://main.luteos.com/design.html ; https://main.luteos.com/build.html | Main 方法站点维护方 | 访问 2026-11-08；采用当前七阶段页面而非旧六步导航 | Radar/research | 本轮研究/规划/复核 | 不假设源码、脚本、技能已可用；不由方法授予实际动作权限 |
| SRC-MAIN-02 | C | https://main.luteos.com/verify.html ; https://main.luteos.com/ship.html ; https://main.luteos.com/operate.html ; https://main.luteos.com/iterate.html ; https://main.luteos.com/manage.html | Main 方法站点维护方 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不把 Agent 复核当真人验收，不跨发布阶梯 |
| SRC-MAIN-03 | C | https://main.luteos.com/data-layers.html#all-layers ; https://main.luteos.com/matrix.html | Main 方法站点维护方 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不把命名检查器当已实现；不把观察存储规则照搬成所有数据库迁移规则 |
| SRC-FS-01 | B | https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case ; https://open.feishu.cn/document/server-docs/im-v1/message/events/receive | 飞书开放平台 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不证明本应用权限、连接、数据访问或可用范围 |
| SRC-FS-02 | B | https://open.feishu.cn/document/event-subscription-guide/callback-subscription/callback-overview ; https://open.feishu.cn/document/feishu-cards/card-callback-communication ; https://open.feishu.cn/document/feishu-cards/handle-card-callbacks | 飞书开放平台 | 访问 2026-11-08；新版 card.action.trigger | Radar/research | 本轮研究/规划/复核 | 不类推旧回调、CardKit/流式卡片或不同更新 API；不授权实际发送 |
| SRC-FS-03 | B | https://open.feishu.cn/document/server-docs/im-v1/message/create ; https://open.feishu.cn/document/server-docs/im-v1/message/reply ; https://github.com/larksuite/node-sdk | 飞书开放平台 / larksuite 官方 SDK | 访问 2026-11-08；源码分支未锁 commit，不作实现 pin | Radar/research | 本轮研究/规划/复核 | 不宣称跨系统 exactly-once；不猜 SDK 调用签名或版本 |
| SRC-BRAND-01 | C | https://momcozy.com/pages/momcozy-affiliate-program ; https://momcozy.com/pages/influencer-rewards-program ; https://momcozy.com/pages/momcozy-growth-empowerment-program | Momcozy 官网 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不推断内部团队、预算、转化或实际合同；不自动引用为现行批准口径 |
| SRC-BRAND-02 | C | https://community.momcozy.com/t/momcozy-long-term-co-creator-community-rewards-program-terms-participation-rules-the-official-rules/17823 | Momcozy 社区规则发布方 | 访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不推断单个参与者已接受条款或特定素材已获授权 |
| SRC-FTC-01 | B | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking ; https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance ; https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials | US FTC | 公开指南/规则说明；访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不据此裁定 Momcozy/达人违法或替代法务；指南与可执行规则区别保留 |
| SRC-FDA-01 | B | https://www.fda.gov/medical-devices/consumer-products/breast-pumps ; https://www.accessdata.fda.gov/cdrh_docs/pdf23/K230776.pdf | US FDA | 消费者页面/具体 510(k) 文件；访问 2026-11-08 | Radar/research | 本轮研究/规划/复核 | 不外推所有型号/所有市场，不自动批准 claim，不把 cleared 写为 approved |
| SRC-PLATFORM-01 | B | https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en ; https://developers.google.com/youtube/terms/developer-policies ; https://developers.facebook.com/terms/dfc_platform_terms ; https://redditinc.com/policies/data-api-terms | 对应平台 | 访问 2026-11-08；逐产品许可/条款适用范围须复核 | Radar/research | 本轮研究/规划/复核 | 不以一类 API 条款外推所有合法来源，不把 OAuth/采购合同当绕过政策的许可 |
| SRC-OWASP-01 | B | https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html ; https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html ; https://cheatsheetseries.owasp.org/cheatsheets/SSRF_Prevention_Cheat_Sheet.html | OWASP | 访问 2026-11-08；已读章节范围见安全笔记 | Radar/research | 本轮研究/规划/复核 | 不把建议当已完成控制/法律或授权安全测试范围 |
| SRC-OTHER-01 | C | https://pmo.luteos.com/reports-view/Main/Main-项目成果总结-20261101.html ; https://pmo.luteos.com/reports-view/Source/Source-项目成果总结-20261031.html | 对应项目报告发布方 | 报告日期 2026-11-01 / 2026-10-31 | Radar/research | 本轮研究/规划/复核 | 不继承运行状态、凭证、测试数量或数据覆盖；不直接复用未读代码 |

每条具体引用还需 locator：PMO 用 slug/capability ID/字段；Main 用页面章节；飞书用事件名、注意事项或请求字段；PDF 用页码。只列来源首页不足以支持字段结论。本文不补造未取得的 PDF 页码，主计划只采用已能定位的必要结论。

## 3. 已发现并纠正的口径

| ID | 专题里的问题 | 主计划采用的限定写法 |
|---|---|---|
| CAL-01 | 自定义证据等级不一致 | 统一使用第 1 节；官方政策/法规为 B，站点自述与建议为 C |
| CAL-02 | 说“场景链路有 5 个环节”，实际列 4 个 | 粉丝分析→合作计划→动态监测→机会推荐，共 4 个环节；能力注册粒度不同不自动构成错误 |
| CAL-03 | 反推七元组把 creator_id 写成平台账号 ID | 合作主体与平台账号分离；正式七元组未知，不能从样例回执推成批准 schema |
| CAL-04 | “应直接复用 Main Bot” | 先验证源码、许可、版本、测试、权限与新项目需求；报告不是代码验收，10 分钟内存去重不能直接沿用 |
| CAL-05 | “Source 覆盖很多平台所以完整画像可得” | Source 报告仅为他项目快照；每个 MVP 字段独立验来源、许可、时效与实际可得性 |
| CAL-06 | “Serverless 不适合”泛化为品牌标签禁令 | 需要持续进程/出站连接；会休眠、只在请求生命周期存活的环境不满足。按运行能力判断，不按产品名称判断 |
| CAL-07 | 把普通事件重推套在回调上 | 消息事件可能重推；新版卡片回调不补推，需及时给同步结果，慢任务另行持久化 |
| CAL-08 | event_id 作为唯一消息去重键 | 同存 event_id/message_id；消息任务按 app/tenant/message_id 去重；卡片按具体业务意图、资源版本和原子动作记录防重 |
| CAL-09 | 短时间窗能防所有卡片重放 | 时间窗仅辅助；主体鉴权、对象版本、参数指纹与一次性批准/命令是核心 |
| CAL-10 | 把附件与群信息权限列为最小必需 | 文本群 @/P2P/发送的核心三项；im:resource 等按材料导入路径决定，群资料/历史不默认读取 |
| CAL-11 | 所有配置变更均需审核 | 区分能力发布、需审核权限、免审权限与测试版本；以实际后台生效状态核验 |
| CAL-12 | 飞书卡片不能编辑 | 选定 API 在允许窗口/身份下可更新；但不能保证撤销用户已经看到、转发或执行的影响 |
| CAL-13 | 品牌多个年份/客户规模数字均称“矛盾” | 先区分时间与分母；仅同一时点同一口径互斥才称冲突。对外口径取品牌 owner 批准版本 |
| CAL-14 | 公开页面没看到披露即可判断违规 | 只能说未在检查范围内确认关系与披露；不得据此裁定法律违规，材料不足转人工 |
| CAL-15 | 不同语境的社区披露表述一定冲突 | 普通互动是否 endorsement 与 Program 相关背书须区分；由法务明确适用规则，不直接判定不可共存 |
| CAL-16 | 全部购买数据库/私信均无合法基础 | 来源不明、未授权或超许可使用禁止；合法采购、明确同意提供的数据分别评审，仍受平台/隐私/版权边界 |
| CAL-17 | 按固定模板永久保留全部 raw | 追加历史是在保留权限有效范围内；删除/撤回要求可优先，正文删除后仅保留合法最小审计 |
| CAL-18 | Main“读侧迁移”套到所有表 | 用于保留观察历史与版本解释；业务库仍需要受控 schema 迁移、兼容与恢复策略 |
| CAL-19 | 用固定阈值/平台/用户数伪装已定 MVP | 20 样本、10 秒、80% 采纳、TikTok US 等均未批准；不得当默认验收承诺 |
| CAL-20 | 8–10 周与 27–46 周称同一个交付范围 | 两个方案范围、容量与等待假设不统一；不取均值，不沿用单一结论。主计划另列统一窄范围工作量和重估规则 |
| CAL-21 | 没有预算就不能做任何合作计划 | 可先做带预算未知的草案；不得做预算优化/投入承诺/精确 ROI。效果归因是后续可选能力 |
| CAL-22 | Main 首发建议滑入 VOC/声量 | 本项目按用户要求建设 Agent + 工作台，业务范围为 IP/名人合作；不重新询问是否改为 Agent-only 或 Echo |
| CAL-23 | 认领与人工合作决定混用，背调无brief却算机会 | assessment与brief关联candidate分开；人工partnership_decision和claim独立，任务产物完成不等于合作决定 |
| CAL-24 | 授权材料用verified/limited/expired一条状态机 | 受理、复核、有效性、范围、具体用途五维度；首发只待审，不签发商用许可；到期/撤回需owner和下游确认 |
| CAL-25 | 飞书内部发送被当成无需控制的回执 | 受理/摘要/提醒/更正共用outbound_policy：目标/模板/内容类/ACL/批准/速率/暂停与outbox审计 |
| CAL-26 | 源API是只读，浏览器加载外链图片就也安全 | 不自动外链图片/iframe/OG/unfurl；CSP/网络出口限制，读不触发非批准来源请求；自身API/访问审计不误称零网络 |
| CAL-27 | 几乎全unknown也称成功；预算耗尽状态不一致 | minimum_evidence_set按任务类型批准；不足以决定就补料/不可用；预算/步数/时限耗尽候选为failed+明确reason，不假人审成功 |
| CAL-28 | FTC存档内容作为2026年在线最新规则 | 窄核验原URL返回404；只获未锁精确日期的存档摘录，当前版本D；不得断言永久下线或当前效力 |
| CAL-29 | 平台限制完全禁止所有存储/分析，或加披露即可绕过 | TikTok III.3(h)/III.5(c)与YouTube III.E.4.h/III.L按数据/用途/限定例外；免责声明不豁免API Data派生限制；详见条款复核 |
| CAL-30 | 新10–16周综合区间也未做岗位加载 | 撤回为交付区间；仅保留45–70工程人日的C级WBS和容量换算，D12加载依赖/各岗位/真实等待后形成日期 |

独立设计反证见[设计评审](2026-11-08-radar-design-critic.md)；本文和主计划处理的是草案口径，**不是关闭D01–D12或证明控制实现**。核验原文与版本/访问偏离见[三项条款范围复核](2026-11-08-radar-source-scope-verification.md)。新增来源八字段在该文件登记；SRC-FTC-01中的FAQ当前版本应按CAL-28，不由其他FTC来源的可用性替代。

## 4. 仍不能作为事实的结论

1. `magpie` 私有区是否存在 Radar 模块：未登录，不作不存在判断；公开面观察只是部署归属风险。
2. 本飞书应用的真实权限、bot、订阅、版本、归属、连接和生产用途：全部未验证。
3. 任一平台可得完整达人受众画像、报价、合同或转化：未取得本项目数据契约与实测。
4. 法务有效的授权七元组与 A-Gate 签发规则：未取得批准定义。
5. 本项目达标、可试点、可发布或有营收 ROI：没有运行/人审/业务接受证据。

## 输出契约

- **conclusion：** 研究可以支持范围与机制讨论，不能代替项目需求、法律判断或生产批准。
- **evidence：** 第 2 节来源与四专题的定位条款；本地文件存在不等于产品运行。
- **assumptions：** PMO 的 Radar 作为职责参考；所有扩展模板与估算为 C 级建议。
- **uncertainty：** 条款适用、实际数据、应用配置和 D01–D12 仍未批准。
- **confidence：** 对边界纠正较明确；对真实业务效用保持 unknown。
- **blocked_actions：** 不据本文执行凭证使用、live 接入、采购、外联、授权签发或发布。
- **next_human_action：** 先用脱敏真实任务审阅项目章程与 MVP 完成条件，再批准后续节点。
