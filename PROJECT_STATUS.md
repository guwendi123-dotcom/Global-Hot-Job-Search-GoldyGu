# GoldyHire 当前状态

最后整理日期：2026-09-02

## 生产环境

- 正式站点：<https://www.goldyhire.com>
- GitHub：<https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu>
- Cloudflare Worker：`headhunter-portfolio`
- Cloudflare KV：`HEADHUNTER_CONTENT`
- 当前正式版本：`24d8b2e5-ff1c-4d01-94e5-52d90e316df8`
- 当前公开数据：37 家公司、153 个岗位、7 个行业

## 当前产品能力

- 首页按“最近 30 天访问热度 + 逐日衰减的新鲜度”综合排序，新岗位和近期高热岗位优先。
- 岗位分类内支持“大区 → 城市”二级筛选，覆盖中国主要城市、美国东西部、香港、新加坡、亚洲其他、中东及 Remote。
- 管理后台可维护公司、岗位、行业及私密公司映射，但默认发布仍走 GitHub + Cloudflare 正式流程。
- Cloudflare KV 是线上实时数据源；项目内 `data/*.json` 是 GitHub 版本与故障回退数据，发布前必须先读取线上数据并合并本次变更。
- 真实公司名只保存在 Cloudflare 私密 KV 与本机 `.private/`，公开仓库、网页、URL、图片文字及岗位文案不得出现。

## 仍需持续关注的招聘状态

- 隐私优先 AI 对话平台：“增长负责人”为 `Offer 阶段`。
- AI 动画创作工具：含海外 Base 的 3 个岗位因业务调整暂停；仅北京或上海岗位保持开放。
- 全球内容社区 Trust & Safety：前三个岗位 Base Palo Alto；Policy Specialist 为旧金山湾区 / 新加坡，四个岗位均不含纽约。
- 全球 Physical AI 人类体验数据平台：新加坡运营经理 / 高级运营经理为成熟人选，预算 SGD 6,000–8,000/月，优秀人选可向上讨论，不提供签证；市场负责人覆盖中国、美国、新加坡。
- 全球 AI 达人营销平台：当前重点为北京 AI 应用工程师、达人营销产品经理、大客户销售，以及中国 Remote 客户运营；详细内部口径见 `.private/CLIENT_CONTEXT.md`。

## 最近关键内容变更

- 新增全球化旅游平台深圳“全球招聘负责人（R&D）”。
- 新增新一代 AGI 模型与 Agent 平台的媒体关系、Agent Harness、AI Native 产品设计与前沿 AI 产品工程岗位。
- 新增头部互联网视频内容与 AI 创作平台的 Agent 技术负责人及 AIGC 产品负责人。
- 新增具身智能真实场景数据基础设施平台的 CEO、CTO、首席科学家。
- 新增全球 AI 体育影像智能硬件公司的全球市场负责人。
- 新增交互式世界模型与 Physical AI 平台的 10 个 Member of Technical Staff 岗位。
- 新增跨境 VLA 与 Physical AI 基础模型平台的 Founding CTO。
- 全球 Top 10 数字资产平台的平台产品岗位已区分香港 Head 与吉隆坡 IC 画像。

## 接手提醒

开始网站工作前必须读取 `CLAUDE.md`、`WEBSITE_CONTEXT.md` 与本文件；涉及候选人匹配时读取 `RECRUITING_CONTEXT.md`；涉及公开招聘传播时读取 `MARKETING_CONTEXT.md`；确需内部客户口径时再读取 `.private/CLIENT_CONTEXT.md`。

2026-07-26 曾发生本地旧副本落后于 Cloudflare 线上版本。任何发布都必须使用 `CLAUDE.md` 指定的唯一主目录，先确认 Git、线上 KV 与正式站点，避免版本倒退。
