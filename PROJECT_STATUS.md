# GoldyHire 当前状态

最后整理日期：2026-09-15

## 生产环境

- 正式站点：<https://www.goldyhire.com>
- GitHub：<https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu>
- Cloudflare Worker：`headhunter-portfolio`
- Cloudflare KV：`HEADHUNTER_DATA`
- 当前正式版本：`13364f19-4333-4e27-b2db-9f5d40863411`
- 当前公开数据：40 家公司、173 个岗位、7 个行业

## 当前产品能力

- 首页按“最近 30 天访问热度 + 逐日衰减的新鲜度”综合排序，新岗位和近期高热岗位优先。
- 岗位检索已重构为“一级职能 → 二级专业方向”，并可独立叠加职级、招聘状态、办公方式及“大区 → 城市”筛选；负责人、Director 与 CXO 不再混入职能分类。
- 新增登录后的“咕咕寻访模式”，可查看真实公司、岗位优先级、HC、薪酬、汇报关系、核心画像、排除画像及相似岗位；这些信息只存放在受保护的私密 KV 和本机 `.private/`。
- 管理后台可维护公司、岗位、行业及私密公司映射，但默认发布仍走 GitHub + Cloudflare 正式流程。
- Cloudflare KV 是线上实时数据源；项目内 `data/*.json` 是 GitHub 版本与故障回退数据，发布前必须先读取线上数据并合并本次变更。
- 真实公司名只保存在 Cloudflare 私密 KV 与本机 `.private/`，公开仓库、网页、URL、图片文字及岗位文案不得出现。

## 仍需持续关注的招聘状态

- 隐私优先 AI 对话平台：“增长负责人”为 `Offer 阶段`。
- AI 动画创作工具：网站现有 5 个岗位均因业务方向调整暂停招聘，岗位记录继续保留。
- 全球内容社区 Trust & Safety：前三个岗位 Base Palo Alto；Policy Specialist 为旧金山湾区 / 新加坡，四个岗位均不含纽约。
- 全球主动式 AI 生活平台：上海新增 Agent 后端、数据开发负责人、工程效能、安全和后训练算法 5 个技术岗位；前四个为当前高优，后训练算法长期优中择优。安全岗细分 Scope 仍需客户进一步确认，未确认前不得向候选人承诺。
- 全球 Physical AI 人类体验数据平台：新加坡运营经理 / 高级运营经理为成熟人选，预算 SGD 6,000–8,000/月，优秀人选可向上讨论，不提供签证；市场负责人覆盖中国、美国、新加坡。
- 全球 AI 达人营销平台：当前重点为北京 AI 应用工程师、达人营销产品经理、大客户销售，以及中国 Remote 客户运营；详细内部口径见 `.private/CLIENT_CONTEXT.md`。

## 尚未实施的产品方案

- “候选人画像入口”仍处于讨论阶段，未上线；未经用户再次确认不要自行实现。

## 长期上下文边界

- 本文件只记录当前状态，不再保留逐次上传、改文案、修排版和发布成功的历史流水账。
- 公司与岗位的完整现状直接读取线上 KV 和 `data/*.json`，不要从聊天记录或本文件反推。
- 客户内部画像只读取 `.private/CLIENT_CONTEXT.md`、`.private/role-profiles.json` 和 `.private/company-identities.json`。
- 候选人简历、联系方式、单次匹配结论、推荐报告和面试沟通不进入长期上下文。
- 海报审美和沟通模板只保存在 `MARKETING_CONTEXT.md`，海报成品不进入网站发布流程。

## 接手提醒

开始网站工作前必须读取 `CLAUDE.md`、`WEBSITE_CONTEXT.md` 与本文件；涉及候选人匹配时读取 `RECRUITING_CONTEXT.md`；涉及公开招聘传播时读取 `MARKETING_CONTEXT.md`；确需内部客户口径时再读取 `.private/CLIENT_CONTEXT.md`。

2026-07-26 曾发生本地旧副本落后于 Cloudflare 线上版本。任何发布都必须使用 `CLAUDE.md` 指定的唯一主目录，先确认 Git、线上 KV 与正式站点，避免版本倒退。
