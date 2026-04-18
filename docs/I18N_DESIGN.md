# 国际化 (I18N) 方案设计

## 1. 核心策略
**Dark Lattice** 旨在为全球研究者提供内容，支持 **中文 (zh)**、**英文 (en)** 和 **日文 (ja)** 三种语言。

- **默认语言**：中文 (zh)
- **路由模式**：子目录模式 (Subdirectory isolated)
  - 中文：`/` 或 `/zh/` (视配置而定)
  - 英文：`/en/`
  - 日文：`/ja/`

---

## 2. 内容组织规范

我们采用 **基于后缀 (Filename-based)** 的翻译模式，因为它与文件系统结构配合最自然。

| 语言 | 文件后缀示例 | 备注 |
| :--- | :--- | :--- |
| **中文** | `post-name.md` | 默认语言，无需后缀（或使用 `.zh.md`） |
| **英文** | `post-name.en.md` | 使用 `.en` 标识 |
| **日文** | `post-name.ja.md` | 使用 `.ja` 标识 |

> [!TIP]
> Hugo 会自动通过 `filename`（除后缀外部分）将不同语言的页面关联起来，并在前端生成语言切换链接。

---

## 3. UI 翻译 (Interface Localization)

界面上的固定文本（如“阅读更多”、“搜索”、“分类”）存放在 `i18n/` 目录下：

- `i18n/zh.toml`
- `i18n/en.toml`
- `i18n/ja.toml`

**示例 (en.toml)**:
```toml
[read_more]
other = "Read More"

[search_placeholder]
other = "Search for articles..."
```

---

## 4. 多语言 SEO 优化

1.  **Hreflang 标签**：在 `<head>` 中自动生成，告知搜索引擎页面之间的语言对应关系。
2.  **Lang 属性**：`<html>` 标签的 `lang` 属性随语言动态切换。
3.  **Sitemap**：生成多语言版本的 `sitemap.xml`。

---

## 5. 翻译流程建议

1.  **首发中文**：在 `content/` 目录下创建原始文档。
2.  **AI 辅助翻译**：使用 LLM 生成日文与英文的初稿。
3.  **人工校对**：特别是学术术语，需确保在不同语言环境下的专业性对等。

---

## 6. 特定内容类型的国际化方案

### 6.1 博客文章 (Blog Articles)
- **文件路径**：`content/posts/`
- **必备翻译字段**：
  - `title`: 文章标题（需针对不同语言优化 SEO）。
  - `description`: 摘要描述（显示在列表页和 Meta 标签中）。
- **正文翻译**：采用全量翻译模式，确保技术代码块与公式在不同语言版本中保持同步更新。

### 6.2 研究课题 (Research Topics)
- **文件路径**：`content/research/`
- **特有翻译字段**：
  - `abstract`: 独立于 `description` 的学术摘要，支持更详细的描述。
  - `venue` (可选): 发表机构/会议名称。通常保持原语或英文，但描述性词汇需翻译。
- **课题清单 (Topic Lists)**：
  - 对于 `topic-list.md` 等聚合页面，建议根据语言创建副本（如 `topic-list.en.md`）。
- **学术引用 (BibTeX)**：
  - 默认采用 **英文原文** 以符合学术引用规范，除非特定语言环境下有强制的本地化要求。

---

## 相关文档
- [设计概览](./DESIGN_OVERVIEW.md)
- [博客设计文档](./BLOG_DESIGN.md)

*更新时间：2026-04-16 (Enhanced Articles & Research I18N)*
