# Momcozy Radar Agent：合作生态、达人数据与合规研究报告

- 日期：2026-11-08
- 研究范围：PMO Radar 三能力（IP 合作计划制定、全渠道动态监测、合作机会识别）所依赖的 Momcozy 品牌合作生态、达人/名人计划、FTC 广告披露、孕产/医疗器械 claims、Instagram/Meta/TikTok/YouTube/Reddit 官方数据访问边界、授权登记语义与 lawful data-source 方案。
- 研究方法与边界：仅阅读公开网页、官方文档、法规/监管记录；未批量抓取、未登录任何后台、未采集个人数据、未外联、未采购、未发送消息、未初始化 git、未使用任何凭据。品牌官网只能证明“公开声明”，不能证明 Momcozy 内部预算、战略、组织归属、转化数据或实际合同条款。
- 重要声明：本文不是法律意见。所有流程、阈值、字段、指标均为draft/C级建议，需Momcozy法务、合规、业务负责人评审；Agent评审不等于人类批准。
- 校准提示：本笔记的法规A等级统一改按[研究校准](2026-11-08-radar-research-calibration.md)的B规则来源理解；品牌多合作入口不证明内部碎片化，年代/分母差异非自动矛盾，未见披露不等于违法，合法采购/同意资料另审。平台条款按[窄复核](2026-11-08-radar-source-scope-verification.md)限定，FTC FAQ当前版本未锁；[主计划](../superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md)优先于下文原方案。

## 0. 证据分级

| 级别 | 含义 | 本文用法 |
|---|---|---|
| A | 法规/监管一手记录：CFR 条文、FTC 官方指南与新闻稿、FDA 页面与 510(k) 文件、Health Canada 召回记录 | 可作为外部约束引用；仍需法务解释 |
| B | 平台官方条款与开发文档：Meta、TikTok、YouTube、Reddit | 可作为产品可行性约束引用；条款会变，需记录访问日期 |
| C | 品牌官网/社区公开声明、PMO 方法论、本文建议 | 只能视为“公开声称”或“未批准建议”，不能当作内部事实 |
| D | 二手转述、推断、未验证信息 | 必须显式标注，不能进入自动决策 |

判断规则：A/B 用于回答“能不能做”；C 用于回答“Momcozy 公开怎么说/建议怎么做”；D 只用于提示“还需要什么证据”。

## 1. 结论摘要

> 建议状态：本节及全文所有流程、字段、阈值、指标、产品设计均为 draft/C 级建议，不是 Momcozy 已批准的内部标准；需要业务、法务、合规、安全负责人逐项评审。Agent 评审不等于人类批准。

1. Radar 不应被设计成“抓取全网达人并打分”的系统。官方平台并不提供通用的公开达人发现与受众人口统计接口；TikTok 条款还禁止用其 API 建立个人/内容画像数据库，YouTube 条款禁止用 API 数据生成新的派生指标。可行定位是“以授权、证据、权利状态为核心的达人合作决策系统”，公开数据只做线索，授权数据做判断，合同/授权登记做使用前提，人工复核做最终动作。
2. Momcozy 的合作入口高度碎片化：至少存在联盟营销（Awin/Impact/CJ，旧页面又写 ShareASale/Impact/RecomSale）、Influencer Rewards、Growth Empowerment（Superuser / Brand Influencer / Community Brand Ambassador）、Long-Term Co-Creator Community（S/A/B 分级）、机构合作（医院/产后护理/泌乳顾问机构）、Care Program 伙伴、名人/品牌 campaign 七类入口。没有看到一个统一的公开“合作计划登记表”，同一达人的身份、权益、披露义务和内容授权可能落在不同页面/不同合同里。
3. 公开页面的关键数字互相矛盾：成立年份有 2017 与 2018 两种说法；客户规模出现 2M、3M、4M、4.5M、6M 多种口径；“Global No.1 Wearable Breast Pump Brand” 依赖 Grand View Research 2024 报告的市场份额口径。Radar 不能把这些数字当作事实写入达人卡片，必须保留“来源、日期、口径、脚注”。
4. Momcozy 的乳房泵属于 FDA Class II 医疗器械（21 CFR 884.5160，产品码 HGX）。公开可查的 510(k)（K230776、K233880、K253283、K254254、K254258）适应症均限定为“lactating women 表达并收集乳汁、single user”。这意味着达人内容中的“增奶”“通乳”“治疗堵奶/乳腺炎”“医院级”等表述不能仅凭个人体验随意发挥，需与具体型号的 cleared indications、标签和法务审核对齐。
5. Health Canada 曾于 2023-01-28 对 Momcozy wearable breast pumps 发布 Type II 召回/警报，原因是未取得加拿大医疗器械许可证（MDL）即销售；该页面后续更新称 2023-05-03 已获 MDL。这是“品牌热度不等于市场准入合规”的直接证据，达人背调与市场计划必须把监管状态纳入，而不是只看粉丝数。
6. FTC 规则把品牌置于“不能只看合同免责”的位置：品牌必须给达人提供合规指引、监测达人内容、发现问题后采取补救（16 CFR 255.1(d)）；消费者证言本身不是科学证据（255.2(a)）；“Results not typical”式免责通常不足以修正典型性误导（255.2(b)）；专家背书必须真有相应专业能力并做过相应评估（255.3）；未披露 material connection 可构成欺骗（255.5）。2024-08-14 的最终规则（16 CFR Part 465）进一步把虚假评论、买卖评论、内部人评论、评论压制、虚假社媒指标等纳入可处民事罚款的范围。
7. Momcozy 社区官方规则要求参与者在“分享与 Program 相关的内容时”清晰显著披露 material connection，并列举 #MomcozyPartner/#MomcozyGifted/#Ad/#Sponsored；但 2026-07-09 的官方社区回帖又称“日常社区互动和日常活动帖不需要披露”。这两段公开文本存在直接冲突。无论最终法律结论如何，Radar 不应把“日常帖无需披露”当作规则写入自动化逻辑，应由法务给出统一口径。
8. Momcozy 官网使用名人/电视人物/奥运冠军/母婴 KOL 内容时，公开页面未展示可见的 material connection 说明。我们无法从公开页面判断这些关系是付费、赠品、编辑采访还是长期代言；这正是 Radar 授权登记要解决的问题：关系类型、对价、披露义务、内容权利必须逐条登记，而不是从页面推断。
9. 平台数据边界决定了“全渠道监测”只能覆盖四类来源：自有渠道、达人授权数据、签约数据供应商、人工研究。Instagram 的 hashtag 搜索需要 Facebook Login + Public Content Access，且 7 天内最多 30 个唯一 hashtag；oEmbed 只能用于展示，禁止持久化元数据或做分析；TikTok Research API 只对学术/非营利开放；Reddit 商业使用必须书面批准并签约。把这些限制隐藏起来，产品就会在合规评审时被推翻。
10. 达人背调的核心不是“粉丝数”，而是“证据覆盖度”：Observed（公开可见）、Authorized（达人授权）、Licensed estimate（付费数据）、Inferred（模型推断）、Unverified（未知）必须逐字段标注。公开粉丝数不能推出受众年龄/性别/地域；没有授权或付费面板，就不存在“完整粉丝画像”。虚假粉丝可以按 FTC 465.1(h) 的“fake indicators of social media influence”处理，但 Radar 只能做异常提示，不能自动定罪。
11. 授权登记必须是一等公民数据模型，而不是一个“已授权”布尔值。至少需要区分：内容授权、平台/地域/期限、自然流量转发、付费投放、whitelisting、改编/翻译、姓名/肖像、未成年人同意、AI/合成使用、可转授权、撤销/到期、证据文件。授权到期或撤销必须能向下游素材库、广告投放、Feishu 任务传播，否则登记只是台账。
12. 最稳妥的 0→1 路径不是先做“全网雷达”，而是先做“三类高价值、低争议工作流”：达人主页链接→背调卡（证据+授权状态）、合作内容披露审计、授权到期/缺失清单。先让 BD/法务/品牌团队在一个可审计的工作台上达成一致，再扩展到机会识别和竞品监测。

## 2. PMO Radar 三能力的业务边界

PMO 页面（https://pmo.luteos.com/）把 Radar 定义为“IP/名人 Agent & 工作台”，总进度 20%，三条能力分别为：

| 能力 | PMO 公开进度 | 公开描述 | 对本研究的含义 |
|---|---:|---|---|
| IP 合作计划制定 | 25% | 粉丝分析 → 合作计划 → 动态监测 → 机会推荐 | 需要达人分层、合作目标、预算/权益/披露/授权模板；预算与转化数据不在公开网页 |
| 全渠道动态监测 | 20% | 全渠道动态监测 | 需要明确“自有/授权/签约/人工”四类来源，不能承诺全网公开内容 |
| 合作机会识别 | 15% | 合作机会识别 | 需要线索来源、机会评分、证据与时效；不能把推断当事实 |

PMO 还列出一个 Stage 2 缺口：上线独立 @Radar 飞书应用，支持达人 BD 在飞书发主页链接直接回调生成“粉丝/声量背调卡片与授权登记按钮”。这说明第一交互面是飞书卡片，但真正的系统记录必须是后端的“达人档案 + 证据 + 授权登记 + 披露记录”，飞书只是视图和触发器。把授权状态放在聊天消息里，会丢失版本、证据和撤销链路。

注意：PMO 的百分比是站点自报（C 级），不能当作已验收事实；本文把它当作“团队当前自我认知”的线索。

## 3. Momcozy 品牌、产品与公开主张

### 3.1 品牌主体与公开数字

| 事项 | 公开说法 | 来源 | 级别 | 备注 |
|---|---|---|---|---|
| 运营主体 | Root Technology, Ltd. 及其关联实体 | https://momcozy.com/pages/momcozy-privacy-notice（Who Controls My Personal Data）；https://momcozy.com/pages/news（Footer：ROOT Technology Ltd.） | C | 大小写/名称不一致，需以合同主体为准 |
| 成立时间 | “Since our inception in 2017” | https://momcozy.com/pages/affiliate-influencer-program | C | 与下一条冲突 |
| 成立时间 | “Since 2018, Momcozy has been...” | https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower（About Momcozy）；https://momcozy.com/pages/our-story 的媒体引语“since its 2018 launch” | C | 公开文本不一致 |
| 客户规模 | “over 3 million moms” | https://momcozy.com/pages/influencer-rewards-program（FAQ） | C | 与 2M/4M/4.5M/6M 并存 |
| 客户规模 | “trusted by two million moms” | https://momcozy.com/pages/momcozy-real-support-for-breastfeeding-moms | C | 2023 年页面 |
| 客户规模 | “over 4 million mothers in over 60 countries” | https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower（About Momcozy） | C | 与 3M/4.5M/6M 并存 |
| 客户规模 | “4.5M+ Customers” | https://momcozy.com/pages/momcozy-affiliate-program | C | 联盟页面 |
| 客户规模 | “Chosen by Over 6 Million Moms & Families Worldwide* / *Momcozy global sales data as of June 2026” | https://momcozy.com/（首页） | C | 口径为“Moms and families”，不是独立人数 |
| 市场地位 | “Global No.1 Wearable Breast Pump Brand* / *According to Grand View Research's Wearable Breast Pump Market Analysis and Segment Forecasts to 2030 (2024), Momcozy ranked No.1 globally in the Wearable Breast Pump category based on total market share in 2024. Rankings are based on the methodology and market definition used in the report.” | https://momcozy.com/pages/news | C | 第三方报告口径；未独立核验报告全文 |
| 覆盖市场 | “60+ Countries Covered” | https://momcozy.com/pages/momcozy-affiliate-program | C | 联盟页面 |

结论：这些数字不是“可直接写入 Radar 的事实”，而是“需要版本化的营销主张”。Radar 的达人卡片/周报如果引用，必须带来源 URL、抓取日期、口径和脚注；否则一旦对外复用，会把营销口径变成合规风险。

### 3.2 产品范围与监管事实

- 产品 sitemap 中约有 434 个 product URL（含变体/地区，不等同于 SKU 数），覆盖吸奶器、哺乳内衣、孕妇枕、婴儿推车、餐椅、监护器、奶瓶清洗机等。来源：https://momcozy.com/sitemap_products_1.xml?from=6695389757638&to=9151116640454（本次仅统计 `<loc>` 数量，未逐页抓取）。
- 乳房泵是 FDA 监管的医疗器械。FDA 消费者页面明确：“Breast pumps are medical devices regulated by the FDA.” 页面还列出乳房泵可用于维持或增加奶量、缓解涨奶和堵奶、牵拉扁平/凹陷乳头等一般用途；但这是消费者教育页面（内容更新日期 2018-03-26），不能替代具体型号的 cleared indications。来源：https://www.fda.gov/medical-devices/consumer-products/breast-pumps。
- 21 CFR 884.5160 把 powered breast pump 定为 Class II（performance standards）。来源：https://www.law.cornell.edu/cfr/text/21/884.5160。
- 公开可查的 Momcozy 乳房泵 510(k)：

| 510(k) | 日期 | 型号 | 适应症要点 | 来源 |
|---|---|---|---|---|
| K230776 | 2023-06-09 | S9 Pro, S12 Pro | powered breast pump，用于泌乳期女性表达并收集乳汁，single user | https://www.accessdata.fda.gov/cdrh_docs/pdf23/K230776.pdf |
| K233880 | 2023-12-08 | BP137, BP141 | 同上 | https://www.accessdata.fda.gov/cdrh_docs/pdf23/K233880.pdf |
| K253283 | 2025-10-29 | BP334, BP380, BP420, BP431, BP400, BP432, BP434 | 同上 | https://www.accessdata.fda.gov/cdrh_docs/pdf25/K253283.pdf |
| K254254 | 2026-06-18 | BP311, BP311-A/B/C/D | 同上 | https://www.accessdata.fda.gov/cdrh_docs/pdf25/K254254.pdf |
| K254258 | 2026-04-08 | BP137, BP137-A/B/C/D, BP137Y-A/B, BP141, BP141-A/B/C/D | 同上 | https://www.accessdata.fda.gov/cdrh_docs/pdf25/K254258.pdf |

- Health Canada 记录：Momcozy wearable breast pumps（S9、M1、S9 PRO、S12 PRO、S12）在加拿大未取得医疗器械许可证即销售；召回开始日期 2023-01-28，Type II，编号 RA-72662；页面更新称 2023-05-03 已获 MDL。公司名为 Shenzhen Lutejiacheng Technology Co., Ltd.。来源：https://recalls-rappels.canada.ca/en/alert-recall/wearable-breast-pumps。
- 这说明：Momcozy 的乳房泵不是普通消费品；市场准入、型号、标签、适应症和 claims 需要逐市场核验。Radar 的“达人背调”如果只看粉丝与互动，不看产品/市场合规，会把 BD 引向高风险合作。

### 3.3 Momcozy 公开的性能/健康相关表述

| 表述 | 出处 | 风险点 |
|---|---|---|
| “up to 28.2% faster pumping and 6% more milk output than the previous model. (*Based on Momcozy Lab data)” | https://momcozy.com/products/s12-pro-quick-wearable-breast-pump | 性能比较 + 奶量结果；依赖厂商实验室数据；达人转发时容易丢掉脚注 |
| “Hospital grade” | https://momcozy.com/collections/wearable-breast-pump（S12 Pro 条目） | “医院级”不是 FDA 的官方分类；需要定义、证据和适用型号 |
| “Painless horizontal angle to pump like a real baby mouth” / “Painlessly Pump” | https://momcozy.com/collections/wearable-breast-pump（M5 条目） | “无痛”是强体验/健康暗示；个体差异大 |
| “Not enough milk? Always leaking?” | https://momcozy.com/products/momcozy-s12-pro-wearable-breast-pump | 暗示解决奶量不足/漏奶，接近健康诉求 |
| “human milk ... carries lifelong benefits ... vital preventive health measure universally” | https://momcozy.com/pages/our-pledge-to-breastfeeding-moms | 品牌层面的母乳健康主张；若与产品绑定，需更强 substantiation |
| “Global No.1 Wearable Breast Pump Brand” | https://momcozy.com/pages/news | 市场地位比较；依赖第三方报告口径与年份 |

这些表述本身是否合规，需要法务/监管事务逐条判断；本文只指出它们会被达人复用，并因此成为 Radar 的 claim 监控对象。

## 4. 官方合作/达人计划图谱

| 计划 | 公开入口 | 公开权益/机制 | 公开门槛/评估 | 披露/权利要点 | 级别 |
|---|---|---|---|---|---|
| 联盟营销（当前页） | https://momcozy.com/pages/momcozy-affiliate-program | 7% 起、最高 15%；30 天 cookie；60+ 国家；专属折扣码；素材；专属经理 | 网站主、联盟营销人员、出版商、母婴博主/影响者、论坛/社群、KOL 等 | 通过 Awin/Impact/CJ 结算；页面说“free to join, EARN-ONLY”；未展示达人披露条款 | C |
| 联盟营销（旧页） | https://momcozy.com/pages/affiliate-influencer-program | 10%–15%；ShareASale/Impact/RecomSale；30 天 cookie；免费样品 | 网站主、社媒创作者、UGC 创作者 | 与当前页的联盟网络、佣金区间不一致 | C |
| Influencer Rewards Program | https://momcozy.com/pages/influencer-rewards-program | 优质内容奖励、品牌活动露出、免费样品、付费合作/高佣金、长期合作/品牌大使/co-branding | 邮件申请；审核内容风格、曝光、播放量、互动、点赞等 | 未公开披露条款；未公开内容授权模板 | C |
| Growth Empowerment Program | https://momcozy.com/pages/momcozy-growth-empowerment-program | Superuser：任务佣金、礼品卡、新品试用；Brand Influencer：佣金、品牌周边、免费产品；Community Brand Ambassador：收益机会、活动资助、活动礼包赞助 | 分别有申请入口；未公开具体门槛 | 三类角色的对价/权利/披露可能不同 | C |
| Long-Term Co-Creator Community Rewards（The Cozy Spotlight） | https://community.momcozy.com/t/the-cozy-spotlight-creator-incentive-program/12752；官方规则 https://community.momcozy.com/t/momcozy-long-term-co-creator-community-rewards-program-terms-participation-rules-the-official-rules/17823 | S/A/B 三级；Tier S 每月 50 美元礼品卡 + 1000 Points + 连续 3 个月 199 美元礼包；Tier A 500 Points；Tier B 300 Points | 社区贡献、内容质量、互动质量、合规历史等；官方规则称内部权重/阈值 proprietary | 官方规则第 11 条要求 material connection 披露；第 12 条授予 Momcozy 永久、不可撤销、可转授权的内容许可，含付费广告、PDP、EDM、likeness；第 14 条禁止医疗 claims | C |
| 机构合作 | https://support.momcozy.com/article/51894491384601 | 医院、产后护理中心、泌乳顾问机构等合作 | 邮件提案；团队审核 | 未公开合同/披露/数据条款 | C |
| Momcozy Care Program | https://momcozy.com/pages/momcozy-care-program | 专业支持、循证教育、社区、产品方案；PMH-C Clinical Scholarship；IBCLC 考试报销 | 伙伴包括 Baby Academy、Miami Mom Collective、Sleeper Teachers、Mama Glow、PSI、Milk Bank、The People Place、Pumpspotting、Colette Wiseman、Academic Pediatric Association、FIT4MOM、WIC、ACNM、Nurture by NAPS、Mom's Pillow | 专业机构/专家合作；专家背书需符合 16 CFR 255.3 | C |
| 名人/品牌 campaign | https://momcozy.com/pages/our-story；https://momcozy.com/pages/brand-day；https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower | Danielle Panabaker & Caity Lotz 的 NYFW 叙事；Babylist Beverly Hills 的 influencer shower；Brand Day 的奥运冠军故事；社区 UGC 故事 | 未公开合同/对价/披露 | 公开页面未展示可见的 material connection 说明；关系性质未知 | C |

### 4.1 结构性观察

1. **入口碎片化**：同一品牌至少 7 类合作入口，分别由不同页面/团队/表格管理；没有看到统一的公开计划注册表、统一合同模板或统一披露政策入口。
2. **同一角色多重身份**：一个达人可能同时是联盟发布者、Influencer Rewards 参与者、社区 S 级 KOC、品牌大使；不同身份对应不同对价、内容权利、披露义务和税务处理。Radar 必须允许“一个 Creator 多条 Grant/Program 关系”，不能用一个状态字段概括。
3. **公开规则 ≠ 实际合同**：官方规则是公开的格式条款；实际合作可能另有邮件、brief、附件、平台 DM 或单独合同。Radar 的授权登记必须以“可验证证据”为准，不能只引用公开页面。
4. **旧页面残留**：当前联盟页与旧联盟页的联盟网络、佣金区间不一致；说明网站存在版本漂移。Radar 抓取时必须记录“页面版本/抓取日期”，不能把旧页面当现行规则。
5. **社区规则内部冲突**：官方规则要求“分享与 Program 相关的内容时”披露；官方回帖又说“日常活动帖不需要披露”。这是最需要在 0→1 阶段解决的口径问题（见 5.2）。

## 5. FTC 广告披露与评价规则

### 5.1 关键规则（A 级）

| 规则 | 要点 | 对 Radar 的含义 |
|---|---|---|
| 16 CFR 255.0(b) | “endorsement” 包括消费者可能认为反映非广告主意见的广告/营销/推广信息；文字、标签、演示、姓名/肖像/签名、组织名称/印章都可能是 endorsement | 达人 posts、直播、短视频、tag、品牌 repost 都可能构成 endorsement |
| 16 CFR 255.0(f) | “clear and conspicuous”：难以错过、容易理解；互动媒体中 disclosure 必须是“unavoidable”；不能只放在 profile/bio/文末/“more”后面 | 披露检测不能只看 caption；要覆盖画面、音频、直播重复 |
| 16 CFR 255.1(d) | 广告主对 endorsement 中的误导/未证实陈述负责；应给达人指引、监测合规、发现问题后补救；good faith 不是 safe harbor | Radar 需要“pre-brief + post-monitor + correction”闭环，不能只靠合同 |
| 16 CFR 255.1(e) | endorser 也可能对明知/应知的欺骗性陈述负责；非专家达人超出个人体验做性能/有效性陈述也可能负责 | 达人 briefing 必须限制 claim 范围；个人体验不是万能挡箭牌 |
| 16 CFR 255.2(a) | 消费者 endorsement 会被理解为产品对广告 depicted purpose 有效；广告主必须有 substantiation；消费者证言本身不是 competent and reliable scientific evidence | 不能用“用户说有效”替代科学证据；健康/性能 claim 要有证据 |
| 16 CFR 255.2(b) | 关键属性/典型性：如果达人经验不是消费者普遍能获得的，必须清楚显著披露 generally expected performance；“Results not typical”通常不够 | 奶量、速度、舒适度等结果型内容要做典型性/期望值披露 |
| 16 CFR 255.3 | 专家背书：专家资格必须真实；必须实际运用其专业能力评估产品；比较性结论必须有相应比较评估 | IBCLC/护士/医生类达人不能只挂头衔；其背书需要真实评估 |
| 16 CFR 255.5(a) | material connection 包括金钱、免费/折扣产品、提前访问、获奖机会、上电视等；只要 significant minority 不理解/不预期，就必须披露 | 免费样品、礼品卡、积分、活动赞助、联盟佣金都可能需要披露 |
| 16 CFR 255.0(g)(13) | 购买/创建虚假社媒影响力指标并用于商业误导是欺骗行为 | 不得购买粉丝/互动；Radar 不得采购“刷量”服务 |
| 16 CFR 465.1(h) | “fake indicators of social media influence” 包括 bots、假账号、未经同意使用真人信息创建的账号、被劫持账号等；指标包括 followers、views、likes、saves、shares、comments | 达人背调可标记异常，但不能仅凭算法判定“买粉” |
| 16 CFR 465.2 | 禁止创建/出售/购买/传播虚假消费者评论、消费者证言、名人证言；不得虚假表示评论者存在、使用过产品或体验 | 达人内容若由品牌代写、AI 生成、未使用产品，风险极高 |
| 16 CFR 465.6 / 465.7 | 禁止把品牌控制的网站/实体伪装成独立评论；禁止用无理威胁/恐吓/虚假指控压制评论，或虚假表示评论代表全部 | Radar 的“舆情/评论管理”不能参与压制负面评论 |
| FTC Health Products Compliance Guidance（2022-12） | 健康相关产品 claim 需 competent and reliable scientific evidence；express/implied claims 都算；社交媒体与达人营销明确属于 advertising；testimonials 不是 substantiation | 孕产/乳房泵内容必须按健康产品标准审；不能只看“个人体验” |
| FTC Disclosures 101（2019-11） | 披露要跟 endorsement 在一起；视频要在视频内（音频+画面更佳）；直播要周期性重复；不要用 “spon”“collab”“ambassador” 等含糊词；平台披露工具不够 | 披露检测规则要按这些维度设计 |

补充：Endorsement Guides 本身是 FTC 工作人员的行政解释，不是独立罚则；16 CFR Part 465 是可执行规则，允许 FTC 寻求民事罚款。FTC 2024-08-14 新闻稿确认最终规则 5-0 通过、将在联邦公报发布后 60 天生效；具体罚款金额按通胀调整，本文不把某一数字当作已核实事实（多家律所解读为 2024 年约 51,744 美元/次，属 D 级二手，需法务复核）。来源：https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials。

### 5.2 对 Momcozy 的具体风险点

1. **社区披露口径冲突（高优先级）**：官方规则第 11.1 条说，因为参与者获得 Points、礼品卡、礼包、测试机会等，存在 material connection；第 11.2 条要求“whenever they share content associated with the Program”清晰显著披露。官方回帖（2026-07-09）却说“Daily Activities: For regular community interactions and daily event posts, no disclosure required.” 这两段话不可能同时作为统一操作口径。建议法务立即裁定：哪些社区互动构成 endorsement、哪些不构成；并在官方规则/回帖之间做版本合并。
2. **名人页面无可见披露**：Our Story 页面用 Danielle Panabaker & Caity Lotz 作为品牌叙事人物；Brand Day 用奥运冠军故事；Babylist 文章用电视人物 influencer shower。公开页面没有可见的 “paid/partner/gifted” 说明。我们不知道关系性质；但 Radar 应把“关系类型未知”作为风险状态，而不是默认“编辑内容”。
3. **媒体引语被用作广告素材**：Our Story 的 “As seen in” 引语包含“most comfortable breast pump I tested”“highest milk removal yield”等强性能/健康暗示。按 255.0(g)(1)，把第三方评论摘录放进广告会变成 endorsement；必须公平反映原文、保留来源/日期/上下文，并对摘录中的 claim 有 substantiation。当前页面未展示日期/原文链接。
4. **联盟佣金与披露**：联盟发布者获得佣金，属于 material connection；联盟网络条款不能替代 FTC 披露要求。Radar 的联盟达人清单应默认要求披露审计，而不是因为“网络已合规”就跳过。
5. **免费样品/礼品卡/积分**：Influencer Rewards、Growth Empowerment、社区 S/A/B 都涉及免费产品、礼品卡、积分、活动礼包；这些都可能构成 material connection。不能因为“不是现金”就不披露。
6. **品牌 repost**：品牌把达人原帖 repost 到自有账号时，如果原帖披露不足或 repost 后披露不在同一画面，品牌自己的 repost 也可能需要披露（255.5(b)(3)(iii) 的示例逻辑）。Radar 的 repost 工作流必须有“披露是否随内容一起搬运”的检查。
7. **AI 生成内容**：社区官方规则第 5.4/5.5 条禁止全部/实质性 AI 生成的证言、图片、视频、声音；这与 FTC 465.2 对虚假评论/证言的禁止方向一致。Radar 若提供 AI 脚本/素材生成，必须禁止把 AI 生成内容伪装成真实用户体验。

## 6. 孕产/医疗器械 claim 风险

### 6.1 监管框架要点

- 乳房泵是医疗器械；Momcozy 的公开 510(k) 适应症限定为“express milk from lactating women in order to collect milk”“single user”。这不是“FDA approved”，而是“FDA cleared / substantially equivalent”。对外说“FDA approved”属于错误表述。
- FDA 消费者页面（2018-03-26）确实列出乳房泵可用于维持/增加奶量、缓解涨奶和堵奶、牵拉扁平/凹陷乳头；但这是对乳房泵这一类产品的消费者教育，不是对某个具体型号的适应症扩展。具体型号的标签/适应症仍以 510(k) 与 labeling 为准。
- Health Canada 的 2023 年记录说明，同一产品在不同市场的准入状态可能不同；达人在加拿大市场做“可在加拿大购买/使用”的表述时，需要市场准入证据。
- “Hospital grade”不是 FDA 的监管分类；如果没有明确定义和证据，容易被理解为医疗级/多用户级。Momcozy 公开页面在 S12 Pro 条目使用该词，需法务确认其定义与证据。
- “Global No.1”依赖 Grand View Research 2024 报告的市场份额口径；对外使用时必须保留报告名称、年份、口径、脚注，并确认报告允许引用。

### 6.2 Claim 分级（建议，C 级）

| 级别 | 定义 | 示例 | Radar 动作 |
|---|---|---|---|
| 绿色 | 产品功能/规格，不涉及健康结果 | hands-free、电池续航、BPA-free、可调吸力、App 控制、部件数量 | 可进入达人 brief 的“可说”清单，仍需与型号一致 |
| 黄色 | 性能/体验比较，需要 substantiation 与限定语 | “faster pumping”“more output”“quieter”“more comfortable”“hospital grade” | 要求品牌提供证据/限定语；达人转发必须保留脚注；法务抽检 |
| 红色 | 疾病/治疗/预防/保证/未批准适应症 | “cures mastitis”“unclog ducts”“increase supply”“heal sore nipples”“FDA approved”“guaranteed results”“doctors recommend” | 禁止自动放行；必须法务/监管事务逐条审核；默认拦截 |
| 黑色 | 明确虚假/无证据/超适应症 | 伪造研究、伪造专家、AI 生成假证言、贬低竞品无证据 | 阻断、下架、留证、升级 |

注意：黄色与红色之间不是靠“个人体验”划清。按 255.2(a)(b)，即使达人只说“我觉得”，如果整体 net impression 暗示产品能治疗/保证结果，仍可能需要 substantiation。Radar 的 NLP 只能做“提示”，不能做最终法律判断。

### 6.3 达人 brief 的最小内容

- 可说 claims 清单（按型号/市场/语言）。
- 不可说 claims 清单（红色词表 + 解释）。
- 必须保留的限定语/脚注（例如 “based on Momcozy Lab data”“results vary”）。
- 披露要求（#Ad/#Sponsored/#MomcozyPartner；位置；语言；视频内；直播重复）。
- 内容权利/授权范围（自然流量、付费投放、whitelisting、期限、地域）。
- 未成年人出镜规则（父母/监护人同意；不得暴露姓名/学校/地址；不得利用儿童做健康 claim）。
- 竞品比较规则（不得无证据贬低；不得伪造测试）。
- 事故/投诉升级路径。

## 7. 平台数据访问约束

| 平台 | 官方可用能力 | 不能/不应做 | 关键保留/删除条款 | 来源 |
|---|---|---|---|---|
| Instagram（Meta） | Instagram API with Instagram Login：专业账号的评论管理、内容发布、Media Insights、@mentions、消息；适用于品牌自有/授权账号 | 不能通过该 API 获取任意公开个人账号的帖子/受众；不能做通用公开内容检索；不能访问 ads/tagging | Meta Platform Terms：不得出售/许可/购买平台数据；不得未经同意建立/扩展用户画像；不再需要时尽快删除；用户请求/停用产品/停止服务时删除 | https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login；https://developers.facebook.com/terms/dfc_platform_terms（3.a.iv、3.a.v、3.d） |
| Instagram hashtag 搜索 | 仅 Instagram API with Facebook Login；需要 `Instagram Public Content Access` feature + `instagram_basic`；7 天内最多 30 个唯一 hashtag；敏感/冒犯 hashtag 返回通用错误 | 不能把它当“全网 hashtag 监听”；配额极小；不能绕过限制 | 同上；另见 hashtag 搜索文档的限制 | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search |
| Instagram oEmbed | 仅用于把公开 post 嵌入网页/应用；支持 photo/video/Reel/Feed；每小时 1,000 请求 | 文档明确：不得把 metadata/content 用于展示之外的任何目的；禁止持久化、操纵、提取或用于 analytics | 同上 | https://developers.facebook.com/docs/instagram/oembed |
| Meta Content Library | Facebook/Instagram/Threads/WhatsApp Channels 的公开内容档案；研究工具 | 仅限学术机构或其他非营利研究机构；Momcozy 作为商业品牌不符合资格；申请由 CASD 审核 | 研究用途、受控环境 | https://transparency.meta.com/researchtools/meta-content-library/ |
| TikTok Display API | 授权用户的 profile（user.info.basic）与最近视频（video.list）；用于展示该用户授权的内容 | 不能查询任意公开创作者；不能做公开内容搜索；不能建立跨用户画像数据库 | TikTok Developer Terms III.3(h)：不得建立/补充任何个人、设备、内容、浏览器的 profile/database；III.3(k)：不得用 robot/spider 收集；VI：终止后删除 TikTok Information | https://developers.tiktok.com/doc/display-api-get-started；https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en |
| TikTok Research API | 学术/非营利研究；公开账号、内容、粉丝/关注列表、点赞视频、置顶/转发等 | 申请资格要求位于合格地区、学术机构/非营利、独立于商业利益、伦理审查；品牌不符合；不能商用 | Research Tools Terms；非商业用途 | https://developers.tiktok.com/products/research-api/ |
| TikTok Commercial Content Library API | DSA 第 39 条下的广告/商业内容库 | 只覆盖广告/商业内容，不覆盖 organic 创作者内容；用途限定 CCL Purposes | Developer Terms I.2–I.5、II.5 | https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en |
| YouTube Data API | 公开视频/频道/播放列表元数据与统计；搜索；评论；配额 10,000 units/day；search.list 默认 100 次/day | 不能 scraping；不能用 API 数据创建新的/派生指标；未授权统计（Non-Authorized Data）最多存 30 天；不能下载/缓存音视频 | YouTube Developer Policies III.E.4.b（未授权统计 30 天）、III.E.4.h（不得创建 new/derived data or metrics）、III.E.6（禁止 scraping）；API TOS 第 15 条配额、第 24 条终止删除 | https://developers.google.com/youtube/v3/getting-started；https://developers.google.com/youtube/terms/developer-policies；https://developers.google.com/youtube/terms/api-services-terms-of-service |
| YouTube Analytics / Reporting API | 频道所有者授权的分析数据；所有操作都需要授权 | 不能拿别人的频道分析；不能把授权数据给未授权方 | Developer Policies III.D.2（Analytics/Reporting 全部需要授权）、III.E.3（Authorized Data 只能给授权用户/其批准代理）、III.E.4 | 同上 |
| Reddit Data API | 经批准的非商业/研究用途；商业用途需书面批准并签约；免费/付费访问由 Reddit 决定 | 不能未经批准商用；不能 AI 训练；不能推断敏感特征（健康、政治、性取向等）；不能 re-identify；不能转售/许可数据 | Data API Terms 2.4（仅限展示所需复制/展示；不得 AI 训练）、3.1（商业需单独协议）、3.2（不得超范围保留，须立即删除）；Responsible Builder Policy | https://redditinc.com/policies/data-api-terms；https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy |

补充说明：

- **Instagram**：`Instagram API with Instagram Login` 只面向 Instagram professional accounts（business/creator），用于管理其自己的 presence；不能用来“发现任意公开达人”。`@mentions` 只能拿到品牌账号被提及的媒体，是合法 UGC 线索的重要来源，但不是全网搜索。
- **Facebook**：本次没有单独研究 Facebook Page Public Content Access 的当前资格；不要把 Instagram 的结论直接外推到 Facebook。Meta Content Library 对商业品牌不可用；品牌自有 Page 的 API 访问需按 Meta 文档单独申请/审核（本文未验证具体资格）。
- **TikTok**：Research API 的资格门槛明确排除商业品牌；Display API 只覆盖授权用户自己的数据；Developer Terms 对“建立个人画像数据库”的禁止非常直接。这三点共同意味着：Radar 不能把 TikTok 公开内容做成持久化的达人画像库。
- **YouTube**：`III.E.4.h` 的“不得创建 new or derived data or metrics”是对“达人评分/影响力指数”类产品的直接约束。Radar 若要坚持做 score，必须证明 score 不是从 YouTube API 数据派生，或取得 YouTube 书面同意/使用许可数据。最安全的做法是：YouTube 只展示原始指标，score 只用品牌自有数据/授权数据/签约数据计算。
- **Reddit**：Responsible Builder Policy 明确禁止“derive or infer potentially sensitive characteristics”（例如健康、政治、性取向）。孕产状态属于健康相关敏感信息，因此 Radar 不能对 Reddit 用户做“孕期/产后/哺乳”推断，只能做聚合主题分析，且需商业合同。

## 8. 公开数据 vs 授权数据 vs 禁止数据

| 类别 | 示例 | 合法基础 | 允许用途 | 保留 | 置信标签 |
|---|---|---|---|---|---|
| 公开主页元数据 | handle、bio、公开粉丝数、公开视频数 | 平台条款允许的公开访问 | 线索发现、人工背调、展示 | 短周期，带抓取时间；不长期累积 | Observed |
| 公开帖子元数据 | 公开视频标题/发布时间/播放/点赞/评论（以平台 API 实际返回为限） | 平台 API 条款 | 内容表现分析、选题参考 | 按平台限制（YouTube 未授权统计 30 天） | Observed |
| 品牌 @mentions | IG mentions、YouTube 评论、品牌标签 | 平台 API + 品牌自有账号权限 | 互动追踪、UGC 线索、危机预警 | 按平台条款；可删除 | Observed |
| 达人授权数据 | IG Media Insights、TikTok Analytics、YouTube Analytics | 达人明确 OAuth 授权 + 隐私告知 | 受众画像、转化分析、合作评估 | 授权期内；撤销后按平台要求删除 | Authorized |
| 联盟/转化数据 | Awin/Impact/CJ 报告、Shopify 订单、CRM | 合同 + 品牌第一方数据 | ROI、归因、佣金 | 按合同/财务保留 | Authorized / First-party |
| 签约数据供应商 | 达人数据库、受众面板、舆情监听 | 合同 + DPA + 使用限制 | 发现、估算、竞品分析 | 按合同；不得转售/超范围 | Licensed estimate |
| 媒体/新闻 | 新闻报道、采访 | 版权/许可/合理使用（需法务） | PR 监测、引用 | 按版权/许可 | Observed / Licensed |
| 人工研究笔记 | 分析师阅读公开页面后的摘要 | 公开访问 + 内部记录 | 一次性背调、访谈准备 | 最小化；标注 URL/日期 | Observed / Inferred |
| 私信/私密群组 | DM、Facebook Group 私密帖、微信群 | 通常无合法访问基础 | 不做 | 不收集 | Prohibited |
| 抓取公开网页 | 绕过 API/登录/反爬的批量抓取 | 平台条款通常禁止；可能违反法律 | 不做 | 不存储 | Prohibited |
| 购买数据库 | 买来的达人名单/粉丝名单/联系方式 | 来源不可验证；违反平台条款/隐私法 | 不做 | 不存储 | Prohibited |
| 敏感属性推断 | 推断孕期/产后/哺乳/疾病/宗教/性取向 | 无合法基础/高风险 | 不做 | 不存储 | Prohibited |
| 未成年人数据 | 儿童面孔、姓名、学校、健康信息 | 需监护人同意；高风险 | 不做结构化分析 | 不存储 | Prohibited |

关键原则：**公开可见 ≠ 可自由使用**。公开数据仍可能是个人数据，仍受 GDPR/CCPA/平台条款/版权约束；公开页面没有“商用授权”。Radar 的每个字段都应带 `source_type`、`lawful_basis`、`collected_at`、`retention_until`、`confidence`。

## 9. 达人背调与反欺诈：能力与边界

### 9.1 可观察 vs 可推断

| 信号 | 公开可观察？ | 需要授权？ | 需要付费数据？ | 备注 |
|---|---|---|---|---|
| 粉丝数、关注数、发帖数 | 通常是 | 否 | 否 | 平台定义不同；可能有缓存/延迟 |
| 近期帖子播放/点赞/评论 | 部分平台（YouTube 公开；IG/TikTok 取决于 API/页面） | 部分 | 部分 | 不能把“未返回”当成 0 |
| 互动率 | 可计算 | 否 | 否 | 公式不统一；需注明分母（粉丝/播放/触达） |
| 粉丝增长趋势 | 需要历史快照 | 否 | 可能需要 | 第一次观测没有基线，不能编造增长率 |
| 受众年龄/性别/地域 | 通常不可从公开 API 获得 | 是（平台 insights） | 是（面板估算） | 公开粉丝数不能推出人口统计 |
| 受众真实性/假粉比例 | 不可直接观察 | 否 | 是（fraud score） | 只能做异常提示，不能定罪 |
| 内容品类/品牌安全 | 可推断 | 否 | 可选 | 需人工复核；不能只靠关键词 |
| 过往品牌合作 | 可观察但不完整 | 否 | 可选 | 未标注的合作可能漏掉 |
| 披露历史 | 可观察样本 | 否 | 可选 | 样本偏差；不能代表全部 |
| 转化/ROI | 不可公开观察 | 需要联盟/CRM 数据 | 可选 | 只有品牌第一方/联盟数据才能算 |
| 内容权利/授权状态 | 不可从公开页面推断 | 需要合同/授权登记 | 否 | 公开 post ≠ 授权 |

### 9.2 反欺诈信号（建议，C 级）

- 粉丝突增/突降，且内容互动不匹配。
- 粉丝数很高但近期播放/点赞/评论极低，或评论高度模板化。
- 评论区大量无关账号、互关互赞群、重复 emoji/短语。
- 历史内容突然从某品类切换到母婴，且互动异常。
- 同一素材/文案在多个账号重复发布。
- 购买粉丝/互动的公开迹象（FTC 465.1(h) 的 fake indicators）。
- 合作帖没有披露，或披露被埋在 hashtag 堆/文末/“more”后。
- 内容含红色 claim（治疗、保证、FDA approved）。
- 内容含未成年人敏感信息/隐私暴露。

处理原则：异常只触发“人工复核”，不触发自动拒绝/公开指控；保留证据、给达人解释机会、记录复核人/日期/结论。FTC 255.1(d) 的“监测+补救”是品牌义务，但“监测”不等于“自动执法”。

### 9.3 评分建议

不要做单一“信任分”。建议做六维向量：

| 维度 | 问题 | 证据来源 | 未知时 |
|---|---|---|---|
| 证据覆盖 | 我们对该达人的了解有多少来自可验证来源？ | source coverage | 标 `unknown`，不默认高分 |
| 受众质量 | 受众是否真实、是否匹配品牌？ | 授权 insights / licensed panel / 异常检测 | 标 `estimated` 或 `unknown` |
| 品牌安全 | 是否有仇恨、成人、危险育儿、医疗误导？ | 内容抽样 + 人工复核 | 标 `not_reviewed` |
| 披露合规 | 过往合作帖是否清晰披露？ | 帖子抽样 + 披露记录 | 标 `insufficient_sample` |
| 权利准备 | 是否有可用的内容/投放/肖像授权？ | 授权登记 | 标 `no_grant` |
| 商业匹配 | 品类、市场、受众、价格带是否匹配？ | 品牌策略 + 授权/签约数据 | 标 `hypothesis` |

每个维度都要能展开到证据链接；总分只能作为排序辅助，不能作为对外拒绝/签约的唯一依据。

## 10. 授权登记（Licensing/Authorization Register）

### 10.1 为什么布尔值不够

- 公开 post ≠ 内容授权。
- 公开 program 页面 ≠ 具体 content grant。
- 联盟佣金 ≠ 付费广告/whitelisting 权利。
- 社区 UGC license ≠ 名人肖像/姓名授权。
- 达人授权 ≠ 平台条款允许（例如 IG oEmbed 不能持久化；TikTok 不能建画像库）。
- 品牌 repost ≠ 可以二次剪辑/投放；需要看 grant 的具体范围。

### 10.2 实体模型（建议，C 级）

| 实体 | 作用 | 关键字段 |
|---|---|---|
| Creator | 达人/名人/专家/机构联系人 | creator_id、姓名/艺名、地区、语言、联系方式（最小化）、状态 |
| PlatformAccount | 平台账号 | account_id、platform、handle、platform_user_id、验证状态、粉丝数快照 |
| Program | 合作计划 | program_id、名称、类型（affiliate/influencer/ambassador/KOC/institutional/celebrity）、公开条款 URL、版本、生效日期 |
| Agreement | 合同/邮件/brief | agreement_id、相对方、签署日期、文件哈希、关键条款摘要、到期日 |
| ContentAsset | 内容素材 | asset_id、平台、post URL、作者、发布时间、内容类型、是否含未成年人、是否含健康 claim |
| RightsGrant | 授权 | grant_id、creator_id、asset_ids、rights_type、platforms、territory、start/end、exclusivity、paid_media、whitelisting、derivative、translation、likeness、minor_consent、ai_use、sublicense、credit、compensation、disclosure_required、status、proof_url |
| DisclosureRecord | 披露记录 | record_id、asset_id、required_text、placement、language、screenshot/evidence、reviewer、reviewed_at、result（pass/fail/manual）、correction_due |
| ClaimRecord | Claim 记录 | claim_id、text、type（green/yellow/red/black）、product/model、market、substantiation_doc、approved_channels、creator_allowed、expiry、reviewer |
| Evidence | 证据 | evidence_id、type（URL/PDF/email/screenshot）、hash、collected_at、collector、lawful_basis |
| Revocation | 撤销/到期 | revocation_id、grant_id、reason、effective_at、downstream_actions |
| Usage | 使用记录 | usage_id、asset_id、campaign、channel、start/end、paid、territory |

### 10.3 RightsGrant 字段语义

| 字段 | 必填 | 说明 |
|---|---|---|
| `rights_type` | 是 | organic_repost / paid_media / whitelisting / derivative / translation / likeness / endorsement / exclusive |
| `platforms` | 是 | IG/TikTok/YouTube/Facebook/Pinterest/官网/邮件/线下 |
| `territory` | 是 | 国家/地区；默认不能写“全球”除非合同明确 |
| `start_at` / `end_at` | 是 | 到期必须可计算；永久授权也要有“无到期”标记和复核周期 |
| `exclusivity` | 是 | exclusive / non-exclusive / category-exclusive；默认 non-exclusive |
| `paid_media` | 是 | 是否允许付费投放；不允许时广告系统必须拦截 |
| `whitelisting` | 是 | 是否允许用达人账号做 Spark Ads/品牌合作广告 |
| `derivative` | 是 | 是否允许剪辑/改编/加字幕/加音乐 |
| `translation` | 是 | 是否允许翻译/本地化 |
| `likeness` | 是 | 是否允许姓名/肖像/声音/签名 |
| `minor_consent` | 是 | 内容含未成年人时，是否有监护人书面同意 |
| `ai_use` | 是 | 是否允许用于 AI 训练/生成；默认否 |
| `sublicense` | 是 | 是否允许转授权给 agency/媒体 |
| `credit` | 否 | 必须标注的 @/标签 |
| `compensation` | 否 | 现金/产品/礼品卡/积分/佣金；用于税务和披露判断 |
| `disclosure_required` | 是 | 必须使用的披露文本/标签；按市场/语言 |
| `status` | 是 | draft / requested / granted / active / expiring / expired / revoked / disputed |
| `proof_url` | 是 | 合同/邮件/平台确认的存储位置（不把私密文件放进聊天） |

### 10.4 状态机与下游传播

`draft → requested → granted → active → expiring → expired/revoked/disputed`

- `requested`：BD 发起授权请求；不得自动外联，必须人工发送。
- `granted`：有证据（合同/邮件/平台确认）；不是“达人口头说可以”。
- `active`：在期限/地域/平台范围内；素材库可标记“可用”。
- `expiring`：到期前 N 天（建议 30/60/90，draft）提醒 BD/法务/投放。
- `expired/revoked`：素材库自动标记“不可用”；广告投放任务暂停；已发布内容按合同/平台规则处理；保留审计日志。
- `disputed`：权属/范围有争议；冻结使用，升级法务。

下游传播的最低要求：
1. 素材库每个 asset 绑定 grant_id；没有 grant 不能标记“可商用”。
2. 广告投放系统读取 grant 的 `paid_media`/`territory`/`end_at`；不满足则阻断。
3. Feishu 卡片显示“授权状态”和“证据链接”，但不显示合同全文/个人敏感信息。
4. 达人撤销/到期时，自动生成“下架/替换/续约”任务；不能只发一条通知。

### 10.5 与平台条款的关系

授权登记解决“达人/内容权利人是否允许我们用”，平台条款解决“平台是否允许我们这样访问/展示/存储”。两者必须同时满足；一个 grant 不能覆盖平台限制。例如：
- 达人说“可以 repost”，但 IG oEmbed 仍不允许把 metadata 持久化做 analytics。
- 达人说“可以投广告”，但 TikTok API 仍不允许建立跨用户画像库。
- 达人说“永久授权”，但平台条款终止后仍必须删除平台数据。

## 11. 访谈矩阵（建议，C 级）

| 角色 | 为什么访谈 | 关键问题 | 影响的决策 |
|---|---|---|---|
| 品牌/市场负责人 | 目标、市场、预算、风险偏好 | 今年合作目标是什么？按市场/品类/渠道怎么拆？哪些指标算成功？谁对达人合作最终签字？ | Radar 的范围、优先级、KPI |
| 达人/联盟负责人 | 现有流程、工具、量级 | 现在用什么表格/系统？一个月处理多少达人？从线索到签约要几步？最大卡点是什么？ | 工作流、字段、自动化边界 |
| PR/传播负责人 | 名人/媒体/危机 | 名人合作谁谈？是否有披露模板？危机时如何联动达人？ | 名人 module、危机 playbook |
| 法务/合规 | claim、合同、披露、隐私 | 现行达人合同模板有哪些权利条款？谁审 claim？是否处理过 FTC/平台投诉？ | claim 库、授权字段、审批 gate |
| 电商/CRM | 联盟、转化、归因 | 用哪些联盟网络？转化数据在哪里？能否按达人/代码归因？ | ROI 模型、数据接口 |
| 财务/采购 | 预算、付款、税务 | 达人付款流程？礼品卡/积分/产品怎么入账？是否涉及 W-9/W-8BEN？ | 补偿字段、税务标记 |
| 代理/达人经纪 |  sourcing、谈判、执行 | 代理如何筛选达人？如何审内容？披露谁负责？ | 外部协作、证据链 |
| 客服/VOC | 投诉、产品安全 | 哪些投诉与达人内容相关？如何升级？ | 危机/claim 监控 |
| IT/安全 | 数据、权限、驻留 | 数据存哪里？谁能看？保留多久？如何做 DSAR/删除？ | 架构、权限、保留策略 |

访谈原则：先问“现在怎么做/有什么证据”，再问“想要什么”；不要把 PMO 的设想当成已存在的流程。每个访谈输出“事实、痛点、决策、待验证假设”四栏。

## 12. 任务样例与验收标准（建议，C 级）

| 任务 | 输入 | 输出 | 验收标准 | 人工 gate |
|---|---|---|---|---|
| 达人主页链接背调 | 一个公开主页 URL | 背调卡：身份、平台、公开指标、证据链接、风险 flag、授权状态、未知项 | 每个数字有来源/时间；未知项明确标 `unknown`；不输出受众人口统计除非有授权/签约数据 | BD 确认是否进入 pipeline |
| 披露审计 | 品牌合作帖清单/时间窗 | 披露缺口清单：帖子、平台、缺失类型、证据截图、建议动作 | 覆盖 caption/画面/音频/直播；不把“有 hashtag”自动判 pass；抽样可复核 | 法务/品牌确认纠正 |
| Claim 扫描 | 达人脚本/已发内容 | 红/黄/绿分级 + 建议改写 + 依据 | 红色 claim 100% 人工复核；不自动发布改写版 | 法务批准 |
| 授权到期清单 | 授权登记 | 30/60/90 天到期清单 + 下游素材/广告影响 | 每个 grant 有 owner、到期日、证据；到期自动冻结 | 法务/投放确认 |
| 竞品达人重叠 | 竞品品牌/品类 + 合法数据源 | 重叠达人清单 + 证据 + 机会假设 | 只使用签约/授权/公开允许数据；不输出“抢人”自动外联 | BD 决定是否接触 |
| 品牌 @mention 分诊 | IG mentions/YouTube 评论等 | 分类：粉丝、UGC、投诉、危机、合作意向 | 每条有原帖链接、时间、分类理由；危机升级 | 客服/PR 确认 |
| UGC 授权请求队列 | 高互动 UGC 清单 | 待请求授权列表 + 建议请求文案 | 不自动发送；记录请求时间/渠道/回复 | BD/法务发送 |
| 危机达人地图 | 危机关键词/事件 | 关联达人/内容/历史合作清单 | 只做事实关联；不推断立场/健康状态 | PR/法务确认 |
| 机构合作 pipeline | 医院/产后中心/泌乳机构名单 | 机构卡：类型、地区、证据、接触状态 | 不采集个人医生隐私；只用公开机构信息 | BD 确认 |
| 周报 | 上述数据 | 合作 pipeline、授权覆盖率、披露通过率、风险项 | 每个数字有口径/来源；未知项不补零 | 负责人审阅 |

## 13. 发现指标（建议，C 级）

| 指标 | 定义 | 来源 | 建议阈值（draft） | 注意 |
|---|---|---|---|---|
| 证据覆盖率 | 有至少一个可验证来源的达人字段占比 | 数据源登记 | ≥ 90% | 不是“粉丝数覆盖率” |
| 授权覆盖率 | 活跃合作达人中，有有效 RightsGrant 的比例 | 授权登记 | 100% 才能投放 | 自然流量 repost 也需 grant |
| 披露记录覆盖率 | 付费/赠品合作帖中，有 DisclosureRecord 的比例 | 披露审计 | 100% 付款前 | 记录含截图/复核人 |
| 披露通过率 | 首次审计即符合披露要求的比例 | 披露审计 | ≥ 90%（建议） | 低于阈值触发培训/复核 |
| 红色 claim 拦截率 | 红色 claim 被人工复核/拦截的比例 | Claim 扫描 | 100% | 不追求自动改写 |
| 来源新鲜度 | 达人记录最近一次证据更新时间 | 数据源 | ≤ 30 天（公开）；授权数据按平台 | stale 必须标注 |
| 未知项比例 | 关键字段为 `unknown` 的比例 | 数据质量 | ≤ 20%（建议） | 未知不是 0 |
| 背调时长 | 从提交主页链接到背调卡完成 | 工作流 | 基线未知，先测量 | 不设虚假目标 |
| 授权请求时长 | 从请求到 granted/declined | 工作流 | 基线未知，先测量 | 含达人响应时间 |
| 纠正闭环时长 | 发现披露/claim 问题到修正/下架 | 工作流 | 建议 72 小时内（draft） | 按风险分级 |
| 机会响应时长 | 机会被识别到 BD 首次人工接触 | 工作流 | 基线未知 | 不自动外联 |
| 数据源违规数 | 抓取/超范围/未授权访问事件 | 审计 | 0 | 一票否决 |
| 未成年人排除率 | 含未成年人内容被排除结构化分析的比例 | 内容审核 | 100% 排除 | 除非有监护人同意且业务必需 |
| 敏感推断阻断数 | 被阻断的孕期/产后/疾病推断请求 | 审计 | 全部阻断 | Reddit 尤其严格 |

这些阈值是建议，不是 Momcozy 已批准的标准；基线需要访谈和试点测量。

## 14. 数据源依赖计划与 fallback（建议，C 级）

| 能力 | 主来源 | 次来源 | fallback | 禁止的 fallback | 降级行为 |
|---|---|---|---|---|---|
| 自有渠道表现 | IG/TikTok/YouTube/Facebook 官方 API + 品牌账号授权 | 平台原生后台导出 | 人工导出 CSV，记录日期 | 抓取登录后页面 | 显示“数据延迟/不完整” |
| 达人发现 | 签约达人数据库/监听供应商 | 公开主页人工研究 + 行业名单 | BD 手工录入，附 URL/日期 | 批量抓取公开网页 | 只显示已录入线索，不声称“全网” |
| 受众画像 | 达人授权 insights | 签约面板估算 | 无，标 `unknown` | 从粉丝数推断年龄/性别/地域 | 不生成人口统计 |
| 披露监测 | 品牌合作帖清单 + 人工/规则扫描 | 达人授权内容 + 平台 mentions | 人工抽样审计 | 抓取私密群/私信 | 标记样本覆盖不足 |
| Claim 监测 | 内部 claim 库 + 规则/NLP | 法务人工审核 | 人工逐条审 | 自动对外发布改写 | 红色 claim 默认拦截 |
| Reddit 主题 | 签约 Reddit 商业数据 | 人工阅读公开帖做主题摘要 | 无自动化，仅一次性人工摘要 | 抓取/推断用户健康状态 | 明确“未覆盖 Reddit” |
| 联盟转化 | Awin/Impact/CJ 报告 | 品牌 Shopify/CRM | 人工 CSV | 购买第三方“转化估算”当事实 | 标注归因口径 |
| 危机预警 | 品牌 mentions + 签约监听 | 客服工单/PR 线索 | 人工巡查 | 抓取私密社区 | 只报已知事件 |
| 授权证据 | 合同/邮件/平台确认 | 达人书面确认 | 人工上传 | 用公开 post 代替授权 | 标 `no_grant` |
| 媒体/PR | 签约新闻/媒体监测 | 人工阅读 | 人工剪报 | 大批量抓取付费墙内容 | 标注来源/版权 |

运行规则：
1. 每个数据源登记：供应商、合同到期、允许用途、保留期、删除义务、API 版本、rate limit、owner。
2. 数据源健康看板：可用性、延迟、配额消耗、错误率；异常时显示“stale”，不静默补数。
3. 任何 fallback 都不能绕过平台条款；不能用“人工复制”变相批量抓取。
4. 供应商合同必须包含：不得转售、不得 AI 训练（除非明确同意）、审计权、删除义务、数据泄露通知、跨境传输条款。
5. 平台 API 版本/条款变更时，触发影响评估；不能假设旧权限永久有效。

## 15. 业务安全排除清单（建议，C 级）

以下为 Radar 0→1 阶段建议的“硬排除”，需产品、法务、安全共同确认：

1. 不提供医疗诊断/治疗建议；不判断某个母亲/婴儿是否“安全/适用”。
2. 不推断或结构化存储孕期、产后、哺乳、疾病、用药等敏感健康状态。
3. 不采集未成年人（儿童）面孔、姓名、学校、地址、健康信息；含未成年人内容默认排除结构化分析。
4. 不访问私信、私密群组、私密 Facebook Group、微信群等非公开空间。
5. 不抓取需登录/绕过反爬的页面；不伪造 UA/账号；不使用假账号。
6. 不购买粉丝、互动、评论、达人名单或“泄露数据库”。
7. 不自动外联、自动私信、自动签约、自动付款；所有对外动作由人发起。
8. 不在没有 RightsGrant 的情况下 repost/剪辑/投放达人内容。
9. 不在没有 paid_media/whitelisting 授权的情况下做付费放大。
10. 不把平台 API 数据用于 AI 训练，除非平台条款和权利人明确允许。
11. 不使用 Reddit 数据做敏感特征推断、re-identify、跨平台匹配。
12. 不对外说“FDA approved”；只说“FDA cleared/510(k) cleared”，并附型号/市场。
13. 不在没有证据/定义的情况下说“hospital grade”“clinically proven”“doctors recommend”。
14. 不做无证据的竞品贬低/比较优越性 claim。
15. 不把“公开可见”当作“可商用/可长期保存”。
16. 不在授权到期/撤销后继续使用素材；必须冻结/下架/替换。
17. 不用单一“信任分”自动拒绝达人；必须有人工复核和申诉路径。
18. 不按种族、民族、宗教、年龄、性别、性取向、残障、健康状况等受保护特征做排序/歧视。
19. 不把 PMO 自报进度、官网营销数字当作已核实事实对外引用。
20. 不在 Feishu 卡片/聊天中传输合同全文、身份证、银行信息、未成年人信息或密钥。

## 16. 覆盖与盲点

### 16.1 已阅读/已核验（截至 2026-11-08）

- PMO：https://pmo.luteos.com/（Radar 三能力、Stage 2 缺口、进度百分比）。
- Momcozy：首页、sitemap（product/page）、Our Story、News、Brand Day、Babylist 文章、Our Pledge、Affiliate（新/旧）、Influencer Rewards、Growth Empowerment、Care Program、Terms、Privacy Notice、Support “Partner with Us”、Community 官方规则、Community 2026-07-09 回帖、S12 Pro Quick 产品页、wearable breast pump collection。
- 监管：FDA breast pumps 页面、21 CFR 884.5160、5 份 Momcozy 510(k) PDF、Health Canada RA-72662。
- FTC/CFR：16 CFR 255.0/255.1/255.2/255.3/255.5、16 CFR 465.1/465.2/465.6/465.7、FTC Disclosures 101、FTC Health Products Compliance Guidance、FTC 2024-08-14 新闻稿。
- 平台：Instagram Platform / IG Login / hashtag search / oEmbed、Meta Content Library、Meta Platform Terms、TikTok Research API / Display API / Developer Terms、YouTube Data API / Developer Policies / API TOS、Reddit Data API Terms / Responsible Builder Policy / Developer Platform 页面。

### 16.2 未阅读/不可访问/未核验（明确列出）

- eCFR 原站被 robots 阻止；本文使用 Cornell LII 的 CFR 文本（内容一致，但排版/锚点可能不同）。
- FTC 站点对自动 fetch 返回 403；本文部分页面通过浏览器读取，未能批量抓取所有 FTC 指南/案例。
- TikTok 部分开发者文档对 fetch 返回 403；Display API 页面通过搜索缓存读取，未逐页核验所有字段。
- Awin/Impact/CJ 的联盟后台、合同、佣金/数据条款未登录、未阅读。
- Meta App Review / Content Library 申请流程未实际走通；商业品牌资格未验证。
- Momcozy 内部预算、战略、组织归属、转化数据、达人名单、合同模板、实际披露率未获取。
- 全部 434 个 product URL 未逐页阅读；仅抽样乳房泵与 collection。
- 全部社媒帖子/达人内容未逐条审计；披露/claim 结论基于样本。
- 名人/电视人物/奥运冠军的实际合作性质（付费/赠品/编辑采访/代言）未核实。
- CPSC 数据库仅做关键词搜索，未发现 Momcozy 召回结果；不等于不存在。
- 美国各州 AG、集体诉讼、UK ASA/CMA、EU DSA 透明度数据库、加拿大 Competition Bureau 未系统检索。
- 中文来源、中国 NMPA 注册、跨境电商平台（Amazon/TikTok Shop）规则未研究。
- Momcozy App 的隐私政策（footer 指向 app.cozyinnov.com）未阅读；与网站 Privacy Notice 可能不同。
- Pinterest 未研究；不要假设其 API/条款与 IG/TikTok 相同。
- 未访问任何私信、私密群组、登录后页面；这是设计约束，不是遗漏。

### 16.3 Blocked actions（本次未执行/被阻断）

| 类型 | 动作 | 状态/原因 |
|---|---|---|
| 未执行 | 批量抓取、登录后台、采集个人数据、外联达人、采购数据、发送消息、使用凭据、初始化 git、部署 | 任务边界明确禁止；本次研究只读公开页面/官方文档 |
| 被阻断 | eCFR 原站抓取 | robots 阻止；改用 Cornell LII CFR 文本 |
| 被阻断 | FTC 站点自动 fetch | 返回 403；部分页面改用浏览器读取 |
| 被阻断 | TikTok 部分开发者文档 | 返回 403；Display API 页面改用搜索缓存 |
| 被阻断 | Awin/Impact/CJ 后台与合同 | 需登录；未阅读 |
| 被阻断 | Meta Content Library 申请 | 需学术/非营利资格；商业品牌不符合 |
| 被阻断 | Reddit 商业数据接入 | 需书面批准 + 合同；未申请 |
| 被阻断 | Momcozy 内部预算/战略/组织/转化数据 | 无内部权限；公开网站不能证明 |
| 被阻断 | 实际达人合同、披露率、付款条款 | 未获取；只能引用公开 program 条款 |
| 被阻断 | 名人/电视人物/奥运冠军关系性质 | 未核实；不推断是否付费 |
| 不建议执行 | 抓取公开网页、购买粉丝/互动/数据库、自动外联/签约/付款、采集私信/私密群、推断孕期/产后/疾病、采集未成年人数据、用平台数据训练 AI | 违反平台条款/隐私法/本文安全排除清单 |

## 17. 假设与不确定性

1. 公开页面可能过期/版本漂移；本文记录的是 2026-11-08 可读到的版本。
2. 公开 program 条款不等于实际合同；实际合作可能有单独附件/邮件/地区差异。
3. PMO 的进度百分比是自报，不能当作验收证据。
4. “Global No.1”“6M moms”等是营销主张，未独立核验；引用时必须带口径。
5. 名人/达人关系性质未知；本文不推断是否付费。
6. FDA 510(k) 只证明特定型号在特定时间被 cleared；不证明所有型号/所有市场/所有 claim 合规。
7. Health Canada 页面是 2023 年记录及后续更新；当前状态需再次核验。
8. 平台条款会变；本文的 B 级结论需在每次接入/续约时重读。
9. 公开数据仍可能是个人数据；GDPR/CCPA 的合法基础需法务逐场景判断，本文不提供法律结论。
10. 本文所有阈值/字段/流程是 draft，不是 Momcozy 批准的标准；Agent 评审不等于人类批准。
11. 没有发现某类执法/召回，不等于不存在；检索范围和数据库覆盖有限。
12. 未对 Momcozy 的财务/转化/预算做任何推断；公开网站不能证明这些。

## 18. 下一步人类决策

| 决策 | 建议 owner（待确认） | 建议时间 | 为什么现在需要 |
|---|---|---|---|
| 明确 Radar 0→1 的平台/市场/达人层级范围 | 品牌负责人 + Radar owner | 第 1 周 | 决定数据源、预算、合规复杂度 |
| 选择数据策略：签约供应商 vs 达人授权 vs 人工研究 | 数据/采购 + 法务 | 第 1–2 周 | 决定“能不能做全渠道” |
| 法务裁定社区披露口径冲突 | 法务/合规 | 第 1 周 | 直接影响社区 KOC 运营和 Radar 规则 |
| 批准 claim 分级/红色词表/审批 gate | 法务 + 监管事务 | 第 2 周 | 孕产/医疗器械高风险 |
| 批准 RightsGrant schema 与保留/删除策略 | 法务 + 安全 + 产品 | 第 2 周 | 授权登记是系统核心 |
| 决定 Reddit 是否在范围内（需商业合同） | 法务 + 采购 + 品牌 | 第 2 周 | 无合同则不能自动化 |
| 决定 YouTube API 使用方式（是否做 score） | 产品 + 法务 | 第 2 周 | 避免违反“no derived metrics” |
| 设计 20–30 位达人的 4 周试点 | Radar owner + BD | 第 3 周 | 用真实流程验证字段/阈值 |
| 确定人工复核 SLA/升级路径 | 运营 + 法务 + PR | 第 3 周 | 披露/claim/危机需要人 |
| 批准“不抓取/不自动外联/不买数据”政策 | 管理层 + 法务 | 第 1 周 | 先划红线，再谈自动化 |
| 预算：签约数据/法务/试点 | 财务 + 品牌 | 第 2–3 周 | 没有预算就只能人工模式 |
| 指定 creator data owner / DSAR 流程 | 隐私 + 安全 | 第 3 周 | 达人数据是个人数据 |

## 19. 事实/来源表

| # | 事实/主张 | 来源（URL + 章节/锚点） | 级别 | 核验状态/备注 |
|---:|---|---|---|---|
| 1 | Radar 三能力与进度：IP 合作计划 25%、全渠道监测 20%、机会识别 15%、总 20% | https://pmo.luteos.com/（Radar 卡片） | C | 站点自报，未验收 |
| 2 | Stage 2 缺口：@Radar 飞书应用、主页链接→背调卡+授权登记按钮 | https://pmo.luteos.com/（Radar “Stage 2 缺口”） | C | 需求线索，不是已实现 |
| 3 | 品牌主体为 Root Technology, Ltd. | https://momcozy.com/pages/momcozy-privacy-notice（Who Controls My Personal Data） | C | Footer 写作 ROOT Technology Ltd. |
| 4 | 成立时间 2017 | https://momcozy.com/pages/affiliate-influencer-program | C | 与 2018 冲突 |
| 5 | 成立时间 2018 | https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower（About Momcozy） | C | 与 2017 冲突 |
| 6 | 客户数 6M+ Moms & Families（2026-06 销售数据口径） | https://momcozy.com/（首页） | C | 口径为“Moms and families” |
| 7 | 客户数 4.5M+ | https://momcozy.com/pages/momcozy-affiliate-program | C | 与 6M/4M/3M/2M 并存 |
| 8 | 客户数 4M+ / 60+ 国家 | https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower（About Momcozy） | C | 品牌自述 |
| 9 | 客户数 3M+ | https://momcozy.com/pages/influencer-rewards-program（FAQ） | C | 品牌自述 |
| 10 | 客户数 2M | https://momcozy.com/pages/momcozy-real-support-for-breastfeeding-moms | C | 2023 年页面 |
| 11 | “Global No.1 Wearable Breast Pump Brand” 依赖 Grand View Research 2024 报告 | https://momcozy.com/pages/news | C | 未核验报告全文/授权引用 |
| 12 | 当前联盟页：Awin/Impact/CJ，7% 起最高 15%，30 天 cookie，60+ 国家 | https://momcozy.com/pages/momcozy-affiliate-program | C | 与旧页冲突 |
| 13 | 旧联盟页：ShareASale/Impact/RecomSale，10%–15% | https://momcozy.com/pages/affiliate-influencer-program | C | 版本漂移 |
| 14 | Influencer Rewards：内容奖励、免费样品、付费合作、品牌大使路径；评估内容风格/曝光/播放/互动/点赞 | https://momcozy.com/pages/influencer-rewards-program | C | 邮件申请 |
| 15 | Growth Empowerment：Superuser / Brand Influencer / Community Brand Ambassador 三类 | https://momcozy.com/pages/momcozy-growth-empowerment-program | C | 分别申请 |
| 16 | 社区 S/A/B：Tier S $50 礼品卡/月 + 1000 Points + $199 礼包；A 500 Points；B 300 Points | https://community.momcozy.com/t/the-cozy-spotlight-creator-incentive-program/12752 | C | 公开帖 |
| 17 | 官方规则：material connection 披露要求、#MomcozyPartner/#MomcozyGifted/#Ad/#Sponsored | https://community.momcozy.com/t/momcozy-long-term-co-creator-community-rewards-program-terms-participation-rules-the-official-rules/17823（第 11 条） | C | 需与实际合同核对 |
| 18 | 官方规则：永久、不可撤销、可转授权的内容许可，含付费广告、PDP、EDM、likeness | 同上（第 12 条） | C | 授权登记必须区分该许可与单独 grant |
| 19 | 官方回帖：“Daily Activities ... no disclosure required” | https://community.momcozy.com/t/the-cozy-spotlight-creator-incentive-program/12752/71 | C | 与官方规则第 11 条冲突 |
| 20 | 机构合作入口：医院/产后护理/泌乳顾问机构 | https://support.momcozy.com/article/51894491384601 | C | 邮件提案 |
| 21 | Care Program 伙伴清单（Baby Academy、PSI、Milk Bank、ACNM、WIC 等） | https://momcozy.com/pages/momcozy-care-program | C | 机构/专家合作 |
| 22 | Our Story 使用 Danielle Panabaker & Caity Lotz、NYFW、Babylist Beverly Hills | https://momcozy.com/pages/our-story | C | 未见 material connection 说明 |
| 23 | Brand Day 使用奥运冠军故事 | https://momcozy.com/pages/brand-day | C | 关系性质未知 |
| 24 | Babylist influencer shower 文章：电视人物、3.4M IG followers、4M mothers/60+ countries | https://momcozy.com/blogs/news/nikki-mudarris-momcozy-babylist-influencer-shower | C | 未见披露 |
| 25 | 乳房泵是 FDA 监管的医疗器械；可用于维持/增加奶量、缓解涨奶/堵奶等（消费者教育页面） | https://www.fda.gov/medical-devices/consumer-products/breast-pumps | A | 页面内容日期 2018-03-26 |
| 26 | Powered breast pump 为 Class II，21 CFR 884.5160 | https://www.law.cornell.edu/cfr/text/21/884.5160 | A | 法规文本 |
| 27 | Momcozy 510(k) K230776：S9 Pro/S12 Pro，适应症 express/collect milk，single user | https://www.accessdata.fda.gov/cdrh_docs/pdf23/K230776.pdf | A | 已读 PDF |
| 28 | K233880：BP137/BP141；K253283：BP334 等；K254254：BP311 等；K254258：BP137/BP141 等 | 对应 PDF：pdf23/K233880、pdf25/K253283、pdf25/K254254、pdf25/K254258 | A | 已读 PDF |
| 29 | Health Canada：Momcozy wearable pumps 未获 MDL 即销售；2023-01-28 Type II 召回；2023-05-03 获 MDL | https://recalls-rappels.canada.ca/en/alert-recall/wearable-breast-pumps | A | 监管记录 |
| 30 | Momcozy S12 Pro Quick：28.2% faster、6% more output、*Momcozy Lab data | https://momcozy.com/products/s12-pro-quick-wearable-breast-pump | C | 厂商自述 |
| 31 | Momcozy S12 Pro 条目使用 “Hospital grade” | https://momcozy.com/collections/wearable-breast-pump | C | 需定义/证据 |
| 32 | 16 CFR 255.0：endorsement 定义、clear and conspicuous、fake followers 示例 | https://www.law.cornell.edu/cfr/text/16/255.0 | A | 法规文本 |
| 33 | 16 CFR 255.1(d)：广告主指引/监测/补救义务；255.1(e) endorser 责任 | https://www.law.cornell.edu/cfr/text/16/255.1 | A | 法规文本 |
| 34 | 16 CFR 255.2(a)(b)：消费者证言不是科学证据；典型性/期望值披露 | https://www.law.cornell.edu/cfr/text/16/255.2 | A | 法规文本 |
| 35 | 16 CFR 255.3：专家背书需真实专业能力与评估 | https://www.law.cornell.edu/cfr/text/16/255.3 | A | 法规文本 |
| 36 | 16 CFR 255.5：material connection 披露 | https://www.law.cornell.edu/cfr/text/16/255.5 | A | 法规文本 |
| 37 | 16 CFR 465.1(h)：fake indicators of social media influence 定义 | https://www.law.cornell.edu/cfr/text/16/465.1 | A | 法规文本 |
| 38 | 16 CFR 465.2：虚假评论/证言/名人证言 | https://www.law.cornell.edu/cfr/text/16/465.2 | A | 法规文本 |
| 39 | 16 CFR 465.6/465.7：公司控制评论网站、评论压制 | https://www.law.cornell.edu/cfr/text/16/465.6；https://www.law.cornell.edu/cfr/text/16/465.7 | A | 法规文本 |
| 40 | FTC 2024-08-14 最终规则：5-0 通过、联邦公报后 60 天生效、可寻求民事罚款 | https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials | A | 罚款具体金额需另核 |
| 41 | FTC Disclosures 101：披露位置/视频/直播/语言/平台工具不够 | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | A | 2019-11 |
| 42 | FTC Health Products Compliance Guidance：健康 claim 需 competent and reliable scientific evidence；社媒/达人营销属于 advertising | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | A | 2022-12 |
| 43 | Instagram API with Instagram Login：专业账号评论/发布/insights/mentions/消息；不含 ads/tagging | https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login | B | 平台文档 |
| 44 | IG hashtag 搜索：Facebook Login + Public Content Access；7 天 30 个唯一 hashtag | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search | B | 平台文档 |
| 45 | IG oEmbed：仅展示；禁止持久化/提取/analytics | https://developers.facebook.com/docs/instagram/oembed | B | 平台文档 |
| 46 | Meta Content Library：仅学术/非营利研究机构 | https://transparency.meta.com/researchtools/meta-content-library/ | B | 商业品牌不符合 |
| 47 | Meta Platform Terms：不得出售/许可/购买平台数据；不得未经同意建画像；删除义务 | https://developers.facebook.com/terms/dfc_platform_terms（3.a.iv、3.a.v、3.d） | B | 条款文本 |
| 48 | TikTok Research API：学术/非营利、独立于商业利益、伦理审查 | https://developers.tiktok.com/products/research-api/ | B | 品牌不符合 |
| 49 | TikTok Developer Terms：不得建个人/内容画像数据库；不得 robot/spider；终止后删除 | https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en（III.3(h)、III.3(k)、VI） | B | 条款文本 |
| 50 | TikTok Display API：授权用户的 profile/video.list | https://developers.tiktok.com/doc/display-api-get-started | B | 只覆盖授权用户 |
| 51 | YouTube Data API：10,000 units/day；search.list 100/day | https://developers.google.com/youtube/v3/getting-started | B | 平台文档 |
| 52 | YouTube Developer Policies：未授权统计最多 30 天；不得创建派生指标；禁止 scraping | https://developers.google.com/youtube/terms/developer-policies（III.E.4.b、III.E.4.h、III.E.6） | B | 条款文本 |
| 53 | YouTube Analytics/Reporting 全部需要授权 | https://developers.google.com/youtube/terms/developer-policies（III.D.2） | B | 平台文档 |
| 54 | Reddit Data API Terms：仅展示所需复制；不得 AI 训练；商业需单独协议；超范围立即删除 | https://redditinc.com/policies/data-api-terms（2.4、3.1、3.2） | B | 条款文本 |
| 55 | Reddit Responsible Builder Policy：访问需批准；商业需书面批准；禁止敏感特征推断；禁止 AI 训练 | https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy | B | 政策文本 |
| 56 | Reddit Developer Platform：商业使用需合同；不得用 Reddit 内容训练 LLM/AI | https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data | B | 官方帮助页 |
| 57 | Momcozy Terms 禁止 spider/crawl/scrape 其平台 | https://momcozy.com/pages/terms-conditions（Section 11） | C | 品牌条款 |
| 58 | Momcozy Privacy：健康数据属敏感数据；不用于 AI 训练除非聚合/去标识；美国数据存美国、欧盟存德国、亚太存新加坡 | https://momcozy.com/pages/momcozy-privacy-notice | C | 品牌声明 |
| 59 | 官方首页 footer 列出 FB/IG/Pinterest/YouTube/TikTok；未见 Reddit 链接 | https://momcozy.com/（footer） | C | 2026-11-08 观察 |
| 60 | 产品 sitemap 约 434 个 product URL（含变体） | https://momcozy.com/sitemap_products_1.xml?from=6695389757638&to=9151116640454 | C | 仅统计 `<loc>`，未逐页抓取 |

## 20. 附：建议的 Radar 0→1 工作流（文字版）

1. **入口**：BD 在飞书发主页链接 → Radar 解析平台/handle → 去重 → 生成“背调卡草稿”。
2. **背调**：展示公开指标（带时间/来源）+ 风险 flag + 授权状态（默认 `no_grant`）+ 未知项；不展示未经授权的受众人口统计。
3. **计划**：BD 选择合作类型（affiliate/influencer/ambassador/KOC/institutional/celebrity）→ 系统带出对应模板/披露要求/权利字段。
4. **授权**：BD 发起授权请求（人工发送）→ 上传合同/邮件 → 法务复核 → grant 生效。
5. **内容**：达人发布 → Radar 监测披露/claim → 人工复核 → 通过/纠正/下架。
6. **使用**：素材库只显示有 grant 的 asset；广告投放读取 paid_media/territory/end_at；到期冻结。
7. **复盘**：授权覆盖率、披露通过率、claim 拦截率、背调时长、机会响应时长；未知项不补零。
8. **降级**：数据源不可用时显示“覆盖不足”，不抓取、不推断、不自动外联。

这个工作流的价值不在“自动化程度”，而在“可审计、可解释、可停止”。在孕产/医疗器械品类，能停下来比跑得快更重要。