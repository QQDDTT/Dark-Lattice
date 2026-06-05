---
name: SEO Analysis Workflow
description: 获取项目的部署状态和 GSC 的数据，从而制定修改计划
---
# SEO 分析与改进工作流 (SEO Analysis Workflow)

**描述**: 本工作流用于指导 AI Agent 如何自动化或半自动化地获取 Dark Lattice 项目的 Vercel 部署状态以及 Google Search Console (GSC) 的 SEO 数据，从而制定并执行网站的 SEO 修改计划。

## 🎯 目标 (Goal)
- 监控 Vercel 生产环境（`https://dark-lattice.vercel.app/`）的部署与运行状态。
- 获取并分析 Google Search Console 中的索引覆盖率、页面体验（Core Web Vitals）以及搜索表现数据。
- 根据数据分析结果，自动生成优化和修复计划（如修复重定向、补充 Meta 数据、优化性能等）。

## 📋 前提条件 (Prerequisites)
执行此工作流前，需确保：
1. 可获取 Vercel 状态：通过 Vercel CLI (`vercel ls`) 或通过访问站点进行可用性探活。
2. 可获取 GSC 数据：用户已将 GSC 数据导出为 CSV 文件并放置于项目目录（例如 `data/seo_exports/`），或已配置 GSC API 凭证。

## 🔄 执行步骤 (Workflow Steps)

### Step 1: 检查 Vercel 部署状态 (Check Deployment Status)
- 使用 `curl` 或 Lighthouse 检查 `https://dark-lattice.vercel.app/` 的可访问性及最新响应状态。
- 如果配置了 Vercel CLI，运行检查最新一次部署是否有构建警告或错误。
- 提取响应头中的 SEO 相关标签，初步验证 `<title>`, `<meta description>`, 以及 `<link rel="canonical">` 是否正常。

### Step 2: 获取并分析 GSC 数据 (Fetch and Analyze GSC Data)
- **读取数据**：查找目录中是否有最新的 GSC 导出报告（如 `Coverage.csv`, `Performance.csv` 等）。
- **分析索引情况**：重点筛选出状态为“未编入索引”（如：带有正确规范标签的备用页面、未找到 404、重定向错误等）的 URL 列表。
- **分析关键词表现**：分析哪些页面的展现量高但点击率（CTR）低，标记为“需优化 Meta Description 或 Title”的目标页面。

### Step 3: 制定修改计划 (Formulate Modification Plan)
基于 Step 1 和 Step 2 的数据，利用 `implementation_plan.md` 格式输出修改计划：
- **配置文件调整**：如果存在跨域或 Canonical 标签问题，需更新 `hugo.toml` 或 `vercel.json`。
- **模板优化**：针对缺少或不规范的 Meta 信息，调整 `layouts/partials/seo.html` 或 `head.html`。
- **内容优化**：针对高曝光低点击的页面，建议在相关的 Markdown（`content/` 目录下）Front-matter 中优化 `description` 或 `keywords`。

### Step 4: 征求用户同意并执行 (Request Approval & Execute)
- 将分析报告与修改计划提供给用户。
- 获得用户批准后，利用文件编辑工具自动修改项目源码。
- 提示用户通过 Git Push 触发 Vercel 部署，并在 GSC 中提交重新验证。

## 🚀 启动方式
当用户输入类似指令时，主动触发此工作流：
> "请根据最新的 GSC 数据运行 SEO 分析工作流" 
> "获取 项目的部署状态和 GSC 的数据，制定修改计划"
