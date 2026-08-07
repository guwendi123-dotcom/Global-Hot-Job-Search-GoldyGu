# GoldyHire 协作规则

## 唯一主版本

- 唯一本地项目：`/Users/gugudechaojidanao/Documents/Codex/2026-07-20/nin/GoldyHire`
- 唯一 GitHub 仓库：`https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu`
- 正式网站：`https://www.goldyhire.com`
- Cloudflare Worker：`headhunter-portfolio`
- 恢复新版 UI 的主线基准提交：`016e70ef0edfe8d06a3ed350df8df83154cdab23`

不要使用用户主目录或其他同名目录中的旧代码。开始修改前，必须确认当前目录与上面的路径完全一致，并检查 Git 状态与远端版本。
正确页面应包含米白色新版 UI、Goldy 与三只猫主插画、公司目录，以及 Wechat 和 LinkedIn 入口；如果这些特征不存在，必须停止发布并检查版本。

## 内容数据

- 公司：`data/companies.json`
- 岗位：`data/jobs.json`
- 行业：`data/industries.json`
- 页面与组件：`app/`、`components/`

所有公司和岗位内容以这三个 `data/` 文件为准。客户要求脱敏时，不得在中英文公司介绍、岗位说明、标签、URL ID 或图片文字中出现真实公司名或产品名。

管理后台启用后，Cloudflare KV 中的 `content:companies`、`content:jobs`、`content:industries` 是线上实时内容源，项目内 JSON 是首次初始化与故障回退数据。不得用部署动作清空或覆盖 KV。后台使用方式见 `ADMIN_GUIDE.md`。

## 真实公司名称（严格保密）

- 线上真实名称只保存在 Cloudflare KV 的 `admin:company-identities`，仅登录后的管理后台可见。
- 本机协作备份位于 `.private/company-identities.json`，该目录已被 Git 忽略，Codex 与 Claude 可以在本机读取，但绝不能提交、上传或粘贴到公开页面。
- `data/company-identities.json` 只能保留空数组 `[]` 作为公开仓库模板，禁止写入任何真实公司名或产品名。
- 新增或修改真实名称时，应通过管理后台保存，并同步更新本机 `.private/company-identities.json`；不得把私密映射同步到 GitHub。

## 发布流程

1. 读取本文件和 `PROJECT_STATUS.md`。
2. 确认没有覆盖现有公司或岗位，只做用户要求的增删改。
3. 检查 JSON、脱敏关键词和页面构建。
4. 运行 `npm run build:cloudflare`。
5. 运行 `npx wrangler deploy`。
6. 用正式域名验证公司页和岗位页。
7. 提交并同步 GitHub，使线上、GitHub 和本地保持一致。

禁止从旧副本直接发布，禁止用 GitHub 的旧提交覆盖 Cloudflare 当前线上版本。
