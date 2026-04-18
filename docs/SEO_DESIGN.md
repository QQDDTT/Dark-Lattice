# Dark Lattice SEO 设计规范 (SEO Design Specifications)

本文档定义了 Dark Lattice 博客的搜索引擎优化标准，旨在提升多语言环境下的检索权重与用户点击率。

## 1. 元数据规范 (Metadata Standards)

### 1.1 标题标签 (Title Tag)
*   **格式**：
    *   首页：`Dark Lattice | Exploring Deep Learning & Web Design`
    *   内容页：`文章标题 | Dark Lattice`
*   **长度限制**：建议控制在 50-60 个字符以内。

### 1.2 描述标签 (Meta Description)
*   **要求**：每篇内容必须通过 Front Matter 提供 `description` 字段。
*   **默认值**：若未提供，则回退至站点全局描述（详见 `hugo.toml`）。
*   **长度限制**：120-160 个字符。

### 1.3 关键词 (Keywords)
*   **形式**：通过 `tags` 自动映射。
*   **多语言映射**：针对不同语言版本，应使用相应语言的行业术语关键词。

## 2. 语义化结构 (Semantic HTML)

### 2.1 标题层级 (Headings)
*   **H1**：每页有且仅有一个，用于显示页面主标题。
*   **H2-H6**：正文内容必须严格遵循层级递减，严禁跳级（例如从 H2 跳到 H4）。

### 2.2 图片优化 (Images)
*   **Alt 属性**：所有 `<img>` 必须包含描述性的 `alt` 文本。对于纯装饰性图像，可设为空字符串。
*   **懒加载**：默认使用 `loading="lazy"`。

### 2.3 规范链接 (Canonical URLs)
*   **作用**：在 `<head>` 中包含 `rel="canonical"`，指向该内容的权威 URL，避免因多语言路径产生的重复内容惩罚。

## 3. 国际化 SEO (International SEO)

### 3.1 Hreflang 标签
*   **实施**：在 `<head>` 中列出所有语言版本的互链地址。
*   **格式**：`<link rel="alternate" hreflang="zh-cn" href="https://example.org/zh/..." />`。

### 3.2 语言标识 (Lang Attribute)
*   **要求**：`<html>` 标签的 `lang` 属性必须根据当前页面语言动态设置。

## 4. 社交化增强 (Social Sharing)

### 4.1 OpenGraph (OG)
*   **og:image**：自动引用 Front Matter 中的 `featured_image`。若无，则引用默认的 3D 渲染图（例如 `blog_list_ui_mockup.png`）。
*   **og:type**：文章页设为 `article`，首页设为 `website`。

### 4.2 Twitter Cards
*   **twitter:card**：统一设为 `summary_large_image`，以获得最佳视觉展示效果。

## 5. 结构化数据 (JSON-LD)

通过脚本注入符合 Schema.org 标准的 JSON-LD：
*   **Article**：用于博客文章。
*   **BreadcrumbList**：用于层级导航。
*   **Organization**：用于站点信息描述。

## 6. 技术性能 (Technical Performance)

优异的性能是 SEO 的核心指标：
*   **Core Web Vitals 目标**：
    *   **LCP (Largest Contentful Paint)**: < 2.5s
    *   **FID (First Input Delay)**: < 100ms
    *   **CLS (Cumulative Layout Shift)**: < 0.1
*   **Sitemap**：启用 Hugo 自动生成的 `/sitemap.xml`。
*   **Robots.txt**：配置规则，允许除预览路径外的一切抓取。

## 7. 辅助功能 SEO (A11y & SEO)

*   **ARIA 增强**：所有交互元素（如 3D 交互卡片）必须包含 `aria-label` 或 `aria-labelledby`，确保爬虫能理解交互组件的功能语义。
*   **导航语义化**：全局导航 (`<nav>`) 必须包含清晰的层次结构，并对当前活动页 (`aria-current="page"`) 进行标注，提升站点地图的抓取效率。

---
*更新日期：2026-04-17*
