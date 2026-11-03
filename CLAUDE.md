# GoldyHire 协作入口

## 开始任务时只读必要文件

- 网站维护或发布：`WEBSITE_CONTEXT.md` + `PROJECT_STATUS.md`
- 候选人匹配：另读 `RECRUITING_CONTEXT.md`
- 邮件、LinkedIn、朋友圈与海报：另读 `MARKETING_CONTEXT.md`
- 只有涉及客户内部画像时：按需读取 `.private/CLIENT_CONTEXT.md`、`.private/role-profiles.json`、`.private/company-identities.json`

历史聊天、已完成的上传过程、旧文案、候选人单次结论和登录故障不作为后续工作依据。

## 唯一项目

- 本地：`/Users/gugudechaojidanao/Documents/Codex/2026-07-20/nin/GoldyHire`
- GitHub：`https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu`
- 正式站：`https://www.goldyhire.com`
- Worker：`headhunter-portfolio`

不得使用其他同名旧目录。Cloudflare KV 是线上实时数据源，本地 `data/*.json` 是版本与故障回退数据；发布前先读取线上集合，只合并本次变更。

## 不可违反

- 公开页面、公开 JSON、URL、Logo 与图片不得泄露真实公司、产品、薪资、HC、汇报关系和定向画像。
- 私密真实名称与画像只能保存在 `.private/` 和 Cloudflare 私密 KV，绝不提交 GitHub。
- 保留用户已有未提交内容；不要提交 `marketing-assets/` 或无关素材。
- 发布前校验 JSON、脱敏、构建和 Git diff；发布后验证正式页面、更新 `PROJECT_STATUS.md`，再提交并推送 GitHub。
