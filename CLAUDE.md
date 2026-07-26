# GoldyHire 协作规则

## 唯一主版本

- 唯一本地项目：`/Users/gugudechaojidanao/Documents/Codex/2026-07-20/nin/GoldyHire`
- 唯一 GitHub 仓库：`https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu`
- 正式网站：`https://www.goldyhire.com`
- Cloudflare Worker：`headhunter-portfolio`

不要使用用户主目录或其他同名目录中的旧代码。开始修改前，必须确认当前目录与上面的路径完全一致，并检查 Git 状态与远端版本。

## 内容数据

- 公司：`data/companies.json`
- 岗位：`data/jobs.json`
- 行业：`data/industries.json`
- 页面与组件：`app/`、`components/`

所有公司和岗位内容以这三个 `data/` 文件为准。客户要求脱敏时，不得在中英文公司介绍、岗位说明、标签、URL ID 或图片文字中出现真实公司名或产品名。

## 发布流程

1. 读取本文件和 `PROJECT_STATUS.md`。
2. 确认没有覆盖现有公司或岗位，只做用户要求的增删改。
3. 检查 JSON、脱敏关键词和页面构建。
4. 运行 `npm run build:cloudflare`。
5. 运行 `npx wrangler deploy`。
6. 用正式域名验证公司页和岗位页。
7. 提交并同步 GitHub，使线上、GitHub 和本地保持一致。

禁止从旧副本直接发布，禁止用 GitHub 的旧提交覆盖 Cloudflare 当前线上版本。
