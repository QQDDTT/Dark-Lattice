---
name: Deploy and Monitor Workflow
description: 提交本地修改并推送至 Gitea，触发 Gitea Actions 自动构建并部署至 Cloudflare Pages
---
# 部署与监控工作流 (Deploy and Monitor Workflow)

**描述**: 本工作流用于指导 AI Agent 在完成本地代码或配置的修改后，自动化执行代码提交、推送至 Gitea 仓库，并通过 Cloudflare Pages 部署体系发布上线。

## 🎯 目标 (Goal)
- 将本地工作区内已验证的修改自动 Commit 并 Push 到 Gitea (`git.evotensor.dev`) 仓库。
- 触发自动化 CI 流程，执行 Hugo 构建并发布至 Cloudflare Pages。
- 确保线上自定义域名（`https://dark-lattice.evotensor.dev/`）正常提供服务。

## 📋 前提条件 (Prerequisites)
1. 本地已配置好对 Gitea 仓库的 Git 提交权限。
2. Gitea 仓库已配置 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID` Secrets。

## 🔄 执行步骤 (Workflow Steps)

### Step 1: 提交与推送修改 (Commit and Push)
- 使用 `git status` 检查当前修改的文件。
- 确认要提交的文件后，执行 `git add <files>`。
- 根据修改内容生成符合规范的提交信息（如：`feat: ...` 或 `chore: ...`），执行 `git commit -m "..."`。
- 执行 `git push origin main` 将修改推送到 Gitea 远程主分支。

### Step 2: 验证 Cloudflare Pages 部署状态
- 通过 Cloudflare Pages API / 命令行或访问目标域名检查最新部署版本。
- 验证线上静态资源与文章更新正常生效。

