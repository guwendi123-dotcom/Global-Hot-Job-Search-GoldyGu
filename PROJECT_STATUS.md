# GoldyHire 当前状态

最后整理日期：2026-09-10

## 生产环境

- 正式站点：<https://www.goldyhire.com>
- GitHub：<https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu>
- Cloudflare Worker：`headhunter-portfolio`
- Cloudflare KV：`HEADHUNTER_CONTENT`
- 当前正式版本：`071970b4-c0b8-42b1-8c20-7abe88ba1591`
- 当前公开数据：38 家公司、162 个岗位、7 个行业

## 当前产品能力

- 首页按“最近 30 天访问热度 + 逐日衰减的新鲜度”综合排序，新岗位和近期高热岗位优先。
- 岗位分类内支持“大区 → 城市”二级筛选，覆盖中国主要城市、美国东西部、香港、新加坡、亚洲其他、中东及 Remote。
- 管理后台可维护公司、岗位、行业及私密公司映射，但默认发布仍走 GitHub + Cloudflare 正式流程。
- Cloudflare KV 是线上实时数据源；项目内 `data/*.json` 是 GitHub 版本与故障回退数据，发布前必须先读取线上数据并合并本次变更。
- 真实公司名只保存在 Cloudflare 私密 KV 与本机 `.private/`，公开仓库、网页、URL、图片文字及岗位文案不得出现。

## 仍需持续关注的招聘状态

- 隐私优先 AI 对话平台：“增长负责人”为 `Offer 阶段`。
- AI 动画创作工具：网站现有 5 个岗位均因业务方向调整暂停招聘，岗位记录继续保留。
- 全球内容社区 Trust & Safety：前三个岗位 Base Palo Alto；Policy Specialist 为旧金山湾区 / 新加坡，四个岗位均不含纽约。
- 全球 Physical AI 人类体验数据平台：新加坡运营经理 / 高级运营经理为成熟人选，预算 SGD 6,000–8,000/月，优秀人选可向上讨论，不提供签证；市场负责人覆盖中国、美国、新加坡。
- 全球 AI 达人营销平台：当前重点为北京 AI 应用工程师、达人营销产品经理、大客户销售，以及中国 Remote 客户运营；详细内部口径见 `.private/CLIENT_CONTEXT.md`。

## 最近关键内容变更

- Personal AGI 的增长工程岗位依据正式 JD 更新为高优急招“资深软件工程师（增长工程 Tech Lead）”：明确 5 年以上、全球候选人可看、上海/深圳优先，新增 Paid Ads 渠道工程、国际 SEO/GEO、多渠道支付与区域定价、Growth Dashboard/ROI 归因、社交裂变及高并发增长基础设施要求。
- 新增“超一线互联网大厂｜城市出行业务”及 6 个北京岗位：城市运营算法负责人、预测算法专家、运筹调度算法专家、营销算法负责人、营销增长算法专家、营销产品 AI Builder；公开内容已移除真实公司名、内部职级与目标企业名单，并在每个 JD 下补充脱敏后的咕咕对焦画像。
- Personal AGI 的“视觉设计师（品牌与宣传）”与“产品设计师（UI）”均明确支持中国远程办公，同时保留 Palo Alto 办公选项。
- AI 动画创作工具的“资深产品设计师”和“海外用户增长”同步调整为暂停招聘；至此该公司网站内 5 个岗位全部为暂停状态，但不删除历史岗位。
- Personal AGI“国际增长与社区运营”调整为高优先级拉美市场岗位：北美已有对应负责人，新人主攻拉美 PLG，西班牙语或葡萄牙语为必备，并兼顾用户社区、核心用户及 KOL/Creator 运营；同时修复岗位详情页项目符号与长行换行对齐。
- 新增全球化旅游平台深圳“全球招聘负责人（R&D）”。
- 新增新一代 AGI 模型与 Agent 平台的媒体关系、Agent Harness、AI Native 产品设计与前沿 AI 产品工程岗位。
- 新增头部互联网视频内容与 AI 创作平台的 Agent 技术负责人及 AIGC 产品负责人。
- 新增具身智能真实场景数据基础设施平台的 CEO、CTO、首席科学家。
- 新增全球 AI 体育影像智能硬件公司的全球市场负责人。
- 新增交互式世界模型与 Physical AI 平台的 10 个 Member of Technical Staff 岗位。
- 新增跨境 VLA 与 Physical AI 基础模型平台的 Founding CTO。
- 全球 Top 10 数字资产平台的平台产品岗位已区分香港 Head 与吉隆坡 IC 画像。
- 全球 AI 视觉叙事创作平台新增 San Carlos“高级产品经理（企业产品）”，聚焦企业协作、管理权限、Billing、安全合规与专业创意工作流；支持符合条件候选人的签证及绿卡办理。
- 全球 AI 创意设计 Agent 平台将原“AI Agent 产品经理”校准为上海“Agent 策略产品经理”，补充 20–40K CNY/月及模型评估、RL 奖励机制画像；新增上海“AI 用户产品经理”，聚焦 C 端体验、用户研究、多模态生成与 AI Native 人机协作。
- Personal AGI 新增高优先级“增长工程负责人（Senior Software Engineer）”，Base 中国或美国，带领 10 人以内亚太团队，负责 Landing Page、注册激活、支付订阅、实验平台、增长漏斗、社区及邮件/短信触达等完整 PLG 工程体系；美国候选人需稳定支持跨时区协作。

## 接手提醒

开始网站工作前必须读取 `CLAUDE.md`、`WEBSITE_CONTEXT.md` 与本文件；涉及候选人匹配时读取 `RECRUITING_CONTEXT.md`；涉及公开招聘传播时读取 `MARKETING_CONTEXT.md`；确需内部客户口径时再读取 `.private/CLIENT_CONTEXT.md`。

2026-07-26 曾发生本地旧副本落后于 Cloudflare 线上版本。任何发布都必须使用 `CLAUDE.md` 指定的唯一主目录，先确认 Git、线上 KV 与正式站点，避免版本倒退。
