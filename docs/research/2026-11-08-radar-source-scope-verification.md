# Radar 平台条款适用范围：三项窄复核

- 日期：2026-11-08；状态：L0研究，非法律意见、数据许可或实施批准。
- 输入：TikTok Developer Terms、YouTube API Services Developer Policies、FTC Endorsement Guides FAQ三项容易被绝对化的论断。
- 方法：父助手读取已完成核验Agent的最终报告及原文摘录工具结果，未重复网络抓取。TikTok/YouTube有线上原文摘录；FTC在该Agent访问时返回404，其内容通过Internet Archive副本读取。
- `human_gold_claim_count=0`。Agent复核不等于法务审核、人工金标或品牌业务接受。
- 覆盖限制：只核对本表具体条款，不是全平台合规审计；未确认本项目应用、API产品、数据路径、供应商合同或地区适用。

## 1. 来源八字段

| source_id | evidence_grade | source_uri | source_owner | version | workspace | allowed_agents | blocked_actions |
|---|---|---|---|---|---|---|---|
| SRC-TT-SCOPE-01 | B，线上官方条款；本项目许可未知 | https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en | TikTok | 访问2026-11-08；未锁官方发布版本/hash | Radar/research | 本轮研究/规划/复核 | 不据此取得采集/存储/画像许可，不把CCL例外套到商业达人筛选 |
| SRC-YT-SCOPE-01 | B，线上官方政策；例外批准未知 | https://developers.google.com/youtube/terms/developer-policies | YouTube / Google | 访问2026-11-08；III.L提及2026-06-01起申请；未锁内容hash | Radar/research | 本轮研究/规划/复核 | 不用披露绕过API Data派生限制，不假称已获analytics许可 |
| SRC-FTC-ARCHIVE-01 | B，仅所读历史官方文本内容；当前效力/版本D | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking ; https://web.archive.org/web/2025/https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking | 文本原发布方FTC；副本访问方Internet Archive | 原URL在本次核验返回404；访问2026-11-08；`/web/2025/`为解析入口，未取得最终精确snapshot日期/URL | Radar/research | 本轮研究/复核；不作现行政策签核 | 不将副本称2026年最新规则，不据此判Momcozy/个人违法；生产前核验当前有效原文与法务口径 |

以上workspace为研究分类，allowed_agents不赋外部工具权限。历史官方出处不保证当前版本；未取得的日期、hash和批准记录不能补造。

## 2. TikTok：画像/数据库限制不等于“任何持久化都禁止”

**B / SRC-TT-SCOPE-01；locator：Developer Terms，III.3 General Restrictions，h项及III.5(b)/(c) CCL特别条款。**

III.3的适用句为“When accessing the TikTok Developer Services, you will not (or allow others to)”。h项摘录：

> collect or attempt to collect any personal data from TikTok users for any unauthorized or unlawful purpose or build, help build, or supplement any profiles, databases, or similar records on any individual, device, content, or browser or associate the behavior of any individual, device, content, or browser with any profile, databases, or similar record

不能把句中“unauthorized or unlawful purpose”自动解释为后续一切数据库只要达人同意就允许。III.5(c)另给特定例外：

> Clause III.3(h) shall not restrict usage of your Application or CCL Data by End Users to build databases or records relating to the distribution of advertising online for CCL Purposes if usage otherwise complies with the Developer Terms.

**限定结论：** 经Developer Services构建/补充画像、数据库或行为关联受到该限制；CCL用于规定广告分发监督研究目的有明确限定例外。所读页未找到“全部数据完全不可持久化”的通用条款，**这不等于持久化获准**；具体产品文档、用途许可、存储期限、终止删除等仍须逐项复核。

**对Radar：** D05不得直接批准TikTok创作者档案库，也不得为商业筛选伪装CCL研究。先验证所选数据路径和实际用途；不成立就换获准来源/人工资料或缩范围。

## 3. YouTube：API Data派生限制不能外推所有独立分析

**B / SRC-YT-SCOPE-01；locator：III.E.4.h、III.L、IV API Client/API Data定义。**

III.E.4.h摘录：

> Your API Clients must not (i) replace API Data with similar, independently calculated data, or (ii) access or use API Data to create new or derived data or metrics.

并列展示独立于API Data的信息时：

> ... must include a clear and prominent disclosure there that such information, data and metrics are not from YouTube and are part of your own product.

同项的例子允许独立计算“通过自己的API Client产生的likes数量”，与API返回总likes并列且明确其独立来源；**不是允许从API Data算任何新指标，只加免责声明即可。**

III.L摘录：

> These policies are only applicable to audited developers with analytics use cases that have explicitly applied for permission to create additional metrics, store statistical data, or both, through the standard quota extension request ... (starting June 01, 2026).

**限定结论：** 条款针对API Client使用API Data创建新派生数据/指标或替换数据。真正独立来源的自有指标展示有披露要求；III.L提到analytics开发者额外申请路径。被链接的额外政策、具体允许运算和本项目获准状态本次未核验，不把申请通道当已有批准。

**对Radar：** 如选择该API来源，逐字段检查计划/评分/聚合是否触及限制；不能把互动率、真实性分等从API指标计算后换名“业务判断”绕过政策。

## 4. FTC：未在检查范围见到披露，不足以直接判违法

**历史官方内容B / SRC-FTC-ARCHIVE-01；当前版本D。locator：FAQ关于material connection、监测influencers/bloggers、case-by-case执法的问题段。**

所读副本的material connection表述：

> if there's a connection between an endorser and the marketer that a significant minority of consumers wouldn't expect and it would affect how they evaluate the endorsement, that connection should be disclosed clearly and conspicuously.

执法问答摘录：

> If concerns about possible violations of the FTC Act come to our attention, we evaluate them case by case.

**限定结论：** 披露问题需要结合关系、endorsement、受众预期与整体呈现判断。研究者没在一个页面看见披露，不能据此证明所有内容无披露或裁定违规；写“未在检查范围确认关系/披露，需补证与人工复核”。这也不是说已存在应披露的material connection时可以不披露。

**对Radar：** 只提供可定位风险线索，不自动给违法标签。取得当前可用官方版本、冻结地区规则及法务接受口径前，不能签核生产合规政策。

## 5. 核验过程的局限与偏离

- 最终Agent报告声称“每来源内容抓取≤2次”，但工具记录可见额外FTC搜索、候选URL/status探测与存档访问；不能据其概括声称严格满足原委托的两次fetch上限。研究范围仍集中三论断，父助手没有重复委托或扩大网络核验。
- 原FTC URL的404只描述这次访问结果，不能断言全球已永久下线。存档最终定位未锁定，现行版本核验保持开放。
- TikTok/YouTube条款摘录与III.L存在有工具结果支持，但没有本项目法务/平台批准；不能给某个供应商或应用合法性结论。
- 没有运行真实飞书、模型业务API、达人采集、采购或外联。公开条款访问不是生产数据授权。

## 七字段输出

- **conclusion：** 三种绝对论断均需收窄；平台获取许可、允许用途、权利人许可与保留义务分别核验。
- **evidence：** 上述具体条款/摘录；FTC仅存档历史文本，未取得精确snapshot版本。
- **assumptions：** 这些条款可能涉及后续来源选择，具体API产品/市场尚未选定。
- **uncertainty：** 数据路径适用、额外政策、例外批准、留存限额及FTC当前版本未知。
- **confidence：** 对摘录中限制与例外较明确；对本项目具体合规性unknown。
- **blocked_actions：** 不据此开启采集/持久化/评分、签发权利或合规批准、采购、真实接入或发布。
- **next_human_action：** D05选定确切来源与用途后由数据/法务复核；D08取得现行披露/claim口径及正式授权材料语义。
