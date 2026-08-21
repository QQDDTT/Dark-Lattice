---
name: Check GSC Status Workflow
description: 使用 mcp:chrome-devtools-mcp 访问 GSC 获取网页索引状态
---
# 检查 GSC 状态工作流 (Check GSC Status Workflow)

**描述**: 本工作流指导 AI Agent 如何通过 MCP (chrome-devtools-mcp) 自动化访问 Google Search Console (GSC)，以获取网站最新的网页索引状态数据。

## 🎯 目标 (Goal)
- 使用 `chrome-devtools-mcp` 访问 GSC 控制台 URL。
- 获取当前网站的 "已编入索引" 和 "未编入索引" 的页面数量等状态。
- 为后续的 SEO 优化计划提供实时数据支持。

## 📋 前提条件 (Prerequisites)
1. 确保已启用并配置了 `chrome-devtools-mcp`。
2. 当前环境需保持 GSC 账号的登录状态或已授权。

## 🔄 执行步骤 (Workflow Steps)

### Step 1: 启动浏览器并导航
- 调用 `mcp:chrome-devtools-mcp` 提供的工具（如 `new_page` 或 `navigate_page`）。
- 访问目标 URL: `https://search.google.com/search-console?utm_source=about-page&resource_id=https://evotensor.dev/`。

### Step 2: 获取状态数据
- 等待页面加载完成（尤其是“网页索引编制”相关的数据卡片）。
- 通过 `evaluate_script` 或页面内容获取工具，提取 "已编入索引" 和 "未编入索引" 的网页数量及具体原因列表。
- 可选：使用 `take_screenshot` 捕获当前页面的索引状态概览图，以便于更直观地记录。

### Step 3: 输出状态报告
- 将提取到的数据整理为清晰的 Markdown 报告或 artifact。
- 结合之前的部署状态分析，决定是否需要更新 SEO 优化计划。

## 🚀 启动方式
当用户输入类似以下指令时，主动触发此工作流：
> "使用 mcp:chrome-devtools-mcp 访问 GSC 获取状态"
> "去 Google Search Console 看看索引状态"
