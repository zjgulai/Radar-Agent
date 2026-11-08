# Momcozy Radar：研究与规划文档入口

**研究材料仍为 L0。** 已形成从0到1的主计划和配套研究；无人工金标或生产批准。用户在研究/B0批次之后新要求打通指定应用的飞书事件/回调长连接，当前开始独立、接收-only、有界的技术 PoC；最新代码/运行覆盖以其执行记录为准，不把技术接入升级为业务发现或产品发布。其余具体范围/预算/架构及超出此 PoC 的真实动作尚未批准。

## 当前技术任务：飞书最小长连接 PoC

[执行范围、设计与分项状态](research/2026-11-08-radar-feishu-poc-execution.md)：指定应用 `cli_aa69bd34937adbf7`；endpoint认证已实际返回code 0/WSS地址，WebSocket握手与事件/回调投递尚未验证。Secret 不入项目或日志；不发送普通消息、不读取历史/卡片补读、不改后台权限/订阅/版本、不停止其他客户端、不部署。原研究-only限制按历史批次保留，不作为对新窄请求的永久禁止；B0和D01–D12状态不变。

## 推荐阅读顺序

1. [全链路主计划 v1.1](superpowers/plans/2026-11-08-momcozy-radar-zero-to-one.md)：PMO职责/三能力与日期、首发闭环、B0+Main七阶段、数据/权利、飞书、架构工作包、评测发布、资源/关键路径、逐节点deep research议程。
2. [决策登记D01–D12](research/2026-11-08-radar-decision-register.md)：全部未批准；唯一决策登记，不把候选H/DC编号当批准。
3. [研究校准与来源八字段](research/2026-11-08-radar-research-calibration.md)：统一证据等级和30项限定；主计划/校准优先于原专题建议，不赋生产规范效力。
4. [文档自查与覆盖记录](research/2026-11-08-radar-document-review.md)：原请求覆盖、独立反证处理、静态检查范围及未解决事项。

## B0 业务发现：公开研究与校准工作稿已形成

**当前状态：`public-research-delivered / internal-validation-pending`。** 三份公开资料专题、独立反证、校准工作稿及独立机器复核均已返回；这两轮公开研究工作流已经结束。用户已同意开始下一批 **B0 真实任务回溯与约束验证**；本批本地执行记录与机器边界复核已返回，文本修正完成，真实案例尚未提供，首个案例来源问题尚未获回答。本次同意仅批准本批研究活动，不批准首发、D01–D12、私有资料存储／额外 Agent 使用或接入、外部发送、实施。研究材料为 C 级，不证明内部流程或价值。工作稿与专题头部的父助手校准提示优先于旧文的适配排序、固定案例数和策略优先级；机器反证与复核也不是业务批准门禁。

- [B0 业务发现工作稿（优先阅读）](research/2026-11-08-radar-b0-business-discovery.md)：三个不排序的任务假设、条件性替代方案、近期案例十字段、最小基线与五项业务证据缺口；不是批准章程或首发规格。
- [可填写的合作决策案例模板](research/2026-11-08-radar-b0-case-template.md)：十字段空白表单，按真实案例填写脱敏摘要；未知留明，不预设样本量，不要求上传原始材料。
- [虚构案例填写示例](research/2026-11-08-radar-b0-case-example-fictional.md)：DEMO-01，合作申请是否进入候选名单；品牌、角色、材料及计时全部虚构，仅供教学，不进入真实样本或业务基线。
- [独立机器复核与修正处置](research/2026-11-08-radar-b0-synthesis-review.md)：两项文本发现已修正，另作父助手窄校准；保留原复核范围，没有再次独立全篇复核，不等于真人业务接受。
- [本轮任务与边界](research/2026-11-08-radar-b0-session-status.md)：区分公开研究交付与内部业务发现完成。
- [真实任务回溯与约束验证批次执行记录](research/2026-11-08-radar-b0-retrospective-validation-batch.md)：本批研究启动同意、五项活动、未填证据表与机器边界复核；本地准备完成，真实案例输入待提供。
- [Momcozy 公开合作与业务假设](research/2026-11-08-radar-b0-momcozy-jobs.md)：四个公开入口，不是四个已观察内部 job；IP/名人覆盖仍需核对。
- [现有替代与建设必要性](research/2026-11-08-radar-b0-alternatives.md)：品牌网络合作声明与内部/API 未知分开；不推“必须自建”或市场全链覆盖结论。
- [业务发现与价值验证方法库](research/2026-11-08-radar-b0-validation-method.md)：按需启用，不全套强制；人工投入、等待、返工、产物使用分开。
- [独立 B0 完整性反证](research/2026-11-08-radar-b0-discovery-critic.md)：仅核对本地专题；其中数量、负案例、单一 owner 与互斥切片要求不自动批准。

B0 仍缺真实任务/原流程/基线、最低证据路径及业务 owner 接受。链接优先只是此前主计划的候选，不是已确认首发。所有 D01–D12 仍未批准。

## 一手来源专题

| 文档 | 用途与限制 |
|---|---|
| [项目边界与凭证处理](research/2026-11-08-project-research-boundary.md) | 原研究-only边界及后续窄PoC补充；不继承Echo实现/故障，不保存Secret |
| [PMO业务与能力图谱](research/2026-11-08-radar-pmo-business-capability-map.md) | Radar为IP/名人；#66/#67/#68与协作登记。登记状态不是本项目进度 |
| [Main全栈路线](research/2026-11-08-main-full-stack-lifecycle.md) | 七阶段、横切管理、8+3、方法边界；站点脚本不是本项目已有命令 |
| [飞书长连接](research/2026-11-08-feishu-long-connection-agent.md) | 官方消息/新卡回调机制与限制；指定应用配置仍未验证 |
| [Momcozy合作、数据与合规](research/2026-11-08-momcozy-partnership-data-compliance.md) | 品牌公开入口不证明内部合同/效用；法规级别按校准B，非法律意见 |
| [三项条款范围窄复核](research/2026-11-08-radar-source-scope-verification.md) | TikTok/YouTube限制与例外；FTC存档精确日期/现行版本未锁，不作生产口径 |

## 产品、工程与反证草案

- [领域场景](research/2026-11-08-radar-domain-scenarios.md)：对象/账号、brief/评估/人工决定/认领、三种端到端场景；词典未批准。
- [安全与可靠性](research/2026-11-08-radar-security-reliability.md)：工具外授权、注入/SSRF、恢复与失败测试候选，非控制已实现。
- [评测验收](research/2026-11-08-radar-evaluation-acceptance.md)：指标分母、最低证据与数据分层；human_gold_claim_count=0。
- [架构选项](research/2026-11-08-radar-architecture-options.md)：独立候选调查；旧schema/目录/编号不直接实施，以主计划讨论口径为准。
- [资源情景](research/2026-11-08-radar-delivery-resourcing.md)：原27–46周区间已撤出综合基线，保留调查过程；当前无可批准交付日期。
- [独立设计反证](research/2026-11-08-radar-design-critic.md)：只审候选资料，非主计划最终验收；平台缺证据不等于官方不支持。

## 状态与执行纪律

- Radar不等于`radar.luteos.com`上的Echo/VOC；PMO为Radar登记`magpie.luteos.com`，实际部署归属待核。
- 方案、字段、指标、栈和WBS都是C级研究建议；D01–D12均未整体批准，**完整产品实施/生产HOLD，共12项产品决策待闭合**。新飞书请求仅允许上述独立窄PoC，不关闭这些产品决策。
- 不把PMO20%、演示、官方SDK支持或Agent复核当成本项目实现、人工接受或发布证据。
- 原研究/B0批次未使用飞书Secret/换token/启动连接/读聊天/发消息；最新PoC的实际执行状态以[执行记录](research/2026-11-08-radar-feishu-poc-execution.md)为准。未授权普通发送、业务模型API、达人采集、采购、外联、Git或部署。
- B0下一业务工作仍是还原近期真实脱敏合作决定及当前流程；技术PoC不替代该证据或真人决定。不自动实施完整产品，不一次索要全部合同/秘密。
