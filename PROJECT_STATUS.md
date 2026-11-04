# GoldyHire 当前状态

最后整理日期：2026-11-04

## 生产环境

- 正式站点：<https://www.goldyhire.com>
- GitHub：<https://github.com/guwendi123-dotcom/Global-Hot-Job-Search-GoldyGu>
- Cloudflare Worker：`headhunter-portfolio`
- Cloudflare KV：`HEADHUNTER_DATA`（`49ce5f1fc2f24e63b808bb6aecab5df7`）
- 当前正式版本：`2d21e956-7647-4b37-b842-8f60ce8516ac`
- 当前公开数据：53 家公司、244 个岗位、7 个行业

## 当前有效产品规则

- Cloudflare KV 是公司、岗位、行业、真实身份和私密画像的线上权威来源；不要从聊天或本文件反推岗位现状。
- 首页按编辑精选、最近 30 天访问热度与逐日衰减的新鲜度综合排序。
- 检索结构为“一级职能 → 二级专业方向”，并独立支持职级、招聘状态、办公方式、大区、城市和关键词筛选。
- 登录后的“咕咕寻访模式”展示真实公司、优先级、HC、薪酬、汇报关系、核心/排除画像和相似岗位；公开页面不得出现这些信息。
- 主站与公开子页面统一使用 `public/goldy-mark.png`；浏览器与 Apple 图标由同一源生成，禁止另画不同版本。
- 首页与子页面沿用米白羊皮纸、学院感视觉体系，保留 Goldy 与猫的主插画、固定导航及微信复制弹窗。

## 当前特别口径

- Wanderboat：全部 On-site；美国 Base Sunnyvale，国内 Base 上海，双地岗位可选择上海或 Sunnyvale。
- RedNote：纽约岗位统一写纽约 On-site。
- Vivix：美国候选人前期支持 Remote。
- MaxInsights 与光轮：现有岗位暂停，记录继续保留。
- 用户登录 Cloudflare 时：选择 GitHub 登录；GitHub 使用用户自己的国内 Apple ID。登录后用 `wrangler whoami` 核对 `guwendi123@icloud.com`。

## 上下文边界

- 公司与岗位完整现状：读取线上 KV 与 `data/*.json`。
- 私密客户口径：读取 `.private/`，只在任务相关时加载。
- 候选人简历、一次性匹配结论、传播文案、海报中间稿、已完成发布流水和故障排查过程不进入长期上下文。
- “候选人画像入口”仍未实施，未经用户再次确认不要开发。
