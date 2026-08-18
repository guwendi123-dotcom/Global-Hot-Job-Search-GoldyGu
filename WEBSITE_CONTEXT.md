# GoldyHire 网站唯一上下文

本文件只保留网站长期维护所需的信息。任何历史聊天、旧副本、招聘文案草稿、候选人分析和海报迭代，都不是网站操作依据。

## 唯一版本

- 本地项目：`/Users/gugudechaojidanao/Documents/Codex/2026-07-20/nin/GoldyHire`
- GitHub：`https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu`
- 正式网站：`https://www.goldyhire.com`
- Cloudflare Worker：`headhunter-portfolio`
- Cloudflare KV：`49ce5f1fc2f24e63b808bb6aecab5df7`
- 当前线上版本和数据量：以 `PROJECT_STATUS.md` 为准

禁止使用用户主目录或其他同名目录中的旧版本。正式页面应保持米白色新版 UI、Goldy 与三只猫主插画、公司目录，以及 WeChat 和 LinkedIn 入口。

## 内容来源

- 公司：`data/companies.json`
- 岗位：`data/jobs.json`
- 行业：`data/industries.json`
- 页面：`app/`
- 组件：`components/`
- 真实公司名本机私密备份：`.private/company-identities.json`
- 公开真实名称模板：`data/company-identities.json`，必须始终为空数组

线上实时内容位于 Cloudflare KV：

- `content:companies`
- `content:jobs`
- `content:industries`
- `admin:company-identities`（私密，仅后台登录后可见）

项目内 JSON 是 GitHub 版本和故障回退基线。修改内容时，必须先读取线上 KV，再仅合并本次增删改，避免覆盖线上较新的内容。

## 公开内容规则

- 用户要求脱敏时，中英文公司名、产品名、JD、标签、URL ID、Logo 文字和图片文字都不得泄露真实名称。
- 真实公司名只允许存在于 `.private/company-identities.json` 和 Cloudflare KV 的 `admin:company-identities`。
- 不得把真实名称映射提交到 GitHub。
- 没有合适 Logo 时可以使用相关 Emoji；使用 Logo 时优先选择不含文字的图形标识。
- 新公司、新岗位必须写入 ISO 格式 `createdAt`，旧内容编辑时不得重置原创建时间。
- 首页排序采用最近 30 天访问热度与新鲜度综合权重。
- 岗位招聘进度使用 `hiringStatus`；当前支持 `open`、`offer-stage`、`paused`、`closed`。

## 默认发布方式

除非用户明确要求，否则不要通过管理后台发布。默认使用 GitHub + Cloudflare 直接发布：

1. 确认位于唯一主目录，读取本文件、`CLAUDE.md` 和 `PROJECT_STATUS.md`。
2. 检查 Git 状态，保留用户未提交内容；`marketing-assets/` 不得擅自提交。
3. 从 Cloudflare KV 读取线上集合，只合并本次变更。
4. 更新项目内对应 JSON 和必要的页面代码。
5. 校验 JSON、编号、公司关联、脱敏关键词和 Git diff。
6. 运行 `npm run build:cloudflare`。
7. 将合并后的数据写入对应 Cloudflare KV key。
8. 运行 `npx wrangler deploy`。
9. 使用正式域名和公开 API 核验页面、状态、数量和脱敏结果。
10. 更新 `PROJECT_STATUS.md` 中的日期、数据量和 Cloudflare Version ID。
11. 只提交本次相关文件，推送 GitHub `main`。

禁止用部署动作清空 KV，禁止从旧提交回滚覆盖线上，禁止提交无关的本地素材目录。

## 不作为长期上下文保留

- 候选人简历分析与岗位匹配结论
- LinkedIn、邮件、朋友圈等一次性文案
- 海报的中间版本、提示词和审美讨论
- 已完成上传任务的冗长原始 JD 消息
- 与网站无关的公司研究、人物资料和沟通记录
- 旧版前端、旧仓库、旧部署及已被新版替代的操作方案

如以后需要保留新的长期规则，先向用户确认，再补充到本文件；不要依赖聊天记录作为唯一保存位置。
