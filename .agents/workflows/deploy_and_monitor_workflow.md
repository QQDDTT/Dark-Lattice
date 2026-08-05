---
name: Deploy and Monitor Workflow
description: 提交本地修改并推送，依赖 GitHub CLI (gh) 检查最新的 Actions 部署日志和状态
---
# 部署与日志监控工作流 (Deploy and Monitor Workflow)

**描述**: 本工作流用于指导 AI Agent 在完成本地代码或配置的修改后，自动化地执行代码提交、推送，并通过 GitHub CLI (`gh`) 监控云端的构建和部署日志，确保修改被成功应用。

## 🎯 目标 (Goal)
- 将本地工作区内已验证的修改（如 SEO 调整、配置文件等）自动 Commit 并 Push 到 GitHub 仓库。
- 使用 GitHub CLI 实时追踪 GitHub Actions 部署流程的状态。
- 提取并分析部署日志，确保没有构建失败或隐藏的警告。

## 📋 前提条件 (Prerequisites)
1. 工作区代码无需本地构建验证（因本地未安装 Hugo），一切运行和日志检查以 GitHub Actions 部署状态为准。
2. 本地已安装 `git`，并配置好对当前仓库的提交权限。
3. 本地已安装并登录 GitHub CLI (`gh auth status` 验证通过)。

## 🔄 执行步骤 (Workflow Steps)

### Step 1: 提交与推送修改 (Commit and Push)
- 使用 `git status` 检查当前修改的文件。
- 确认要提交的文件后，执行 `git add <files>`。
- 根据修改内容生成符合规范的提交信息（如：`chore(seo): update configs`），并执行 `git commit -m "..."`。
- 执行 `git push` 将修改推送到远程主分支。

### Step 2: 监控构建与部署状态 (Monitor Deployment via GitHub CLI)
- 执行 `gh run list --limit 3` 查找最新触发的 GitHub Actions 运行记录（如 SEO Audit 等）。
- 提取最新的 `run-id`，执行 `gh run watch <run-id>` 实时等待构建流程完成。

### Step 3: 检查部署日志 (Check Deployment Logs)
- 部署结束后，通过 `gh run view <run-id> --log` 获取完整的运行日志。
- Agent 需分析日志内容，重点排查是否存在 `ERROR`, `WARN` 或者构建失败的栈信息。
- 如果是 Lighthouse CI 工作流，需在日志中提取 SEO 分数是否达标。

### Step 4: 结果反馈 (Report Result)
- 汇总日志排查结果。
- 如果部署成功且日志无异常，向用户发送“部署成功”的确认消息，并提供线上预览地址。
- 如果发现错误，提取错误日志片段，并主动提供后续的修复建议。

## 🚀 启动方式
当用户输入类似指令时，主动触发此工作流：
> "请帮我提交本次修改并检查部署日志"
> "推送代码并使用 gh 工具看下构建状态"
