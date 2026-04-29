# GSC SEO 设计文档 (GSC SEO Design Specifications)

本文档定义了 Dark Lattice 博客的搜索引擎优化（SEO）标准，并详细说明了如何提交至 Google Search Console (GSC) 及其他搜索引擎。

## 1. 元数据与关键词策略 (Metadata & Keyword Strategy)

### 1.1 标题标签 (Title Tag)
*   **格式**：
    *   首页：`Dark Lattice | Exploring Deep Learning & Web Design`
    *   内容页建议：`文章标题 | 核心技术关键词 - Dark Lattice`
    *   **示例**：`从链式到多维：Aura 智能体引擎的 Rust 重构 | AI Agent 架构 - Dark Lattice`
*   **长度限制**：建议控制在 50-60 个字符以内。

### 1.2 描述标签 (Meta Description)
*   **要求**：摘要的前 150 个字符非常关键。应包含文章解决的具体痛点（如“如何解决 AI Agent 在复杂环境下的确定性问题”），这直接影响点击转化。
*   **默认值**：若未提供，则回退至站点全局描述（详见 `hugo.toml`）。
*   **长度限制**：120-160 个字符。

### 1.3 技术长尾词优化
*   **策略**：聚焦于“利基市场”（Niche），占领高专业性的技术词汇。
*   **术语组合**：在标题和正文中组合使用“核心技术词 + 应用场景”。例如，“Aura 智能体引擎”配合“Rust 重构”、“多维度图结构”、“ACP 通信协议”等。

### 1.4 关键词 (Keywords)
*   **形式**：通过 `tags` 自动映射。
*   **多语言映射**：针对不同语言版本，应使用相应语言的行业术语（如“智能体”在英文中对应 "AI Agent"）。

## 2. 语义化结构与技术 SEO (Semantic HTML & Technical SEO)

### 2.1 标题层级 (Headings)
*   **H1**：每页有且仅有一个，用于显示页面主标题。
*   **H2-H6**：正文内容必须严格遵循层级递减，严禁跳级。

### 2.2 图片优化
*   **格式**：优先使用 **WebP** 格式以平衡质量与体积。
*   **尺寸控制**：设置固定的宽高属性，避免布局偏移（CLS）。
*   **Alt 属性**：所有 `<img>` 必须包含描述性的 `alt` 文本。

### 2.3 规范链接 (Canonical URLs)
*   **作用**：在 `<head>` 中包含 `rel="canonical"`，指向权威 URL。
*   **必要性**：防止 Vercel 预览分支或不同 URL 后缀导致重复内容问题。

## 3. 国际化 SEO (International SEO)

### 3.1 Hreflang 标签
*   **实施**：在 `<head>` 中列出所有语言版本的对应关系（`rel="alternate" hreflang="..."`），防止权重分散。

### 3.2 翻译质量
*   **要求**：Meta Title 和 Description 必须经过人工校对，确保符合当地搜索习惯，严禁纯机器翻译。

### 3.3 语言标识 (Lang Attribute)
*   **要求**：`<html>` 标签的 `lang` 属性必须根据当前页面语言动态设置。

## 4. 社交化增强 (Social Sharing)

### 4.1 OpenGraph (OG)
*   **og:image**：自动引用 Front Matter 中的 `featured_image`。
*   **og:type**：文章页设为 `article`，首页设为 `website`。

### 4.2 Twitter Cards
*   **twitter:card**：统一设为 `summary_large_image`。

## 5. 结构化数据 (JSON-LD)

通过脚本注入符合 Schema.org 标准的 JSON-LD，提升在搜索结果中的“富媒体摘要”展示率：
*   **Article / TechArticle**：用于博客和技术文章。
*   **BreadcrumbList**：用于层级导航。
*   **Organization**：用于站点信息描述。

## 6. 技术性能与用户体验 (Performance & UX)

### 6.1 Core Web Vitals 目标
*   **LCP (Largest Contentful Paint)**: < 2.5s
*   **FID (First Input Delay)**: < 100ms
*   **CLS (Cumulative Layout Shift)**: < 0.1

### 6.2 移动端体验
*   **代码块优化**：确保代码块在移动端有良好的横向滚动体验，避免撑破容器布局。

## 7. 行业关联与外部信任 (EEAT)

提升经验 (Experience)、专业 (Expertise)、权威 (Authoritativeness) 和可靠 (Trustworthiness)：

### 7.1 内链网络
*   **网状结构**：在深度文章中链接相关的基础研究或专栏文章（如从架构演进链接至 Rust 基础）。

### 7.2 外部链接与背书
*   **平台联动**：在 GitHub、Qiita 等高权重平台的个人资料中挂载博客链接。
*   **学术背景**：在“About”页面展示 **ORCID** 集成，并详细描述研究背景与项目经历。

## 8. 辅助功能 (Accessibility)

*   **ARIA 增强**：所有交互元素必须包含 `aria-label`。
*   **导航语义化**：`<nav>` 必须包含清晰层级，并标注 `aria-current="page"`。

## 9. 搜索引擎提交与验证 (Search Engine Submission)

### 9.1 Google Search Console (GSC) 验证
1.  **HTML 文件验证（推荐）**：放置于 `static/` 目录下。
2.  **Meta 标签验证**：添加至 `layouts/partials/head.html`。

### 9.2 站点地图 (Sitemaps) 提交
*   **路径**：`/sitemap.xml`。
*   **优化**：确保包含 `<lastmod>` 标签，引导 Google 优先抓取新内容。

### 9.3 索引请求与监控
*   **URL 检查工具**：新发布的关键报告应手动请求编入索引。
*   **IndexNow**：建议集成 IndexNow 协议以实时通知 Bing 等搜索引擎。

### 9.4 Robots.txt 指令
```text
User-agent: *
Allow: /
Disallow: /search/
Sitemap: https://yourdomain.com/sitemap.xml
```

---
*更新日期：2026-04-29*

