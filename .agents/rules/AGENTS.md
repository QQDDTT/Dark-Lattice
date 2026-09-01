---
trigger: always_on
description: "静态前端项目开发规范"
---

# 项目开发规范

## 1. 核心架构约束 (Core Architecture Constraints)
- **本地定位**: 本地开发环境（宿主机）仅作为**代码编辑与测试环境**。
- **Gitea CI/CD 优先原则**: 本项目为纯前端静态网站应用。禁止在本地直连 Cloudflare 进行上传发布，**所有的生产环境部署必须通过 Commit 代码至 Gitea 的主分支，由 `.gitea/workflows/deploy.yml` 自动化发布至 Cloudflare Pages**。

## 2. 行为准则 (Behavioral Guidelines)
- 在本地只需执行正常的 `npm run dev` 即可调试，需要发布变更时使用 `git commit` 并 `git push`。

## 3. 设计规范要求
- **全中文化**: 所有面向用户的日志、文档以及代码注释必须遵守中文规范（见全局约束）。

## 4. 专属部署规则 (Specific Deployment Rules)
- **部署平台**: Cloudflare Pages
- **网关路由**: dark-lattice.evotensor.dev
