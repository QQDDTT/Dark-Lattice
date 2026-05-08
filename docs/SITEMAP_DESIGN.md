# 网站地图 (Sitemap) 设计文档

本文档定义 **Dark Lattice** 站点地图的生成逻辑、展示策略与部署配置，确保多语言站点在搜索引擎抓取与人工检查两侧都具备一致性与可维护性。

## 1. 设计目标

1. **协议合规**：遵循 [sitemaps.org](https://www.sitemaps.org/protocol.html) 标准。
2. **多语言可发现**：一级索引清晰指向各语言二级站点地图。
3. **展示一致性**：一级 (`sitemapindex`) 与二级 (`urlset`) 在浏览器中保持统一视觉风格。
4. **类型正确性**：部署后所有 `sitemap.xml` 均返回 XML 的 `Content-Type`。

---

## 2. 结构设计

### 2.1 一级 Sitemap（索引）

- 路径：`/sitemap.xml`
- 协议结构：`<sitemapindex>`
- 作用：聚合并指向各语言二级 sitemap（如 `/zh/sitemap.xml`、`/en/sitemap.xml`、`/ja/sitemap.xml`）。

### 2.2 二级 Sitemap（URL 列表）

- 路径：`/<lang>/sitemap.xml`
- 协议结构：`<urlset>`
- 作用：列出该语言下具体页面 URL，并携带抓取辅助字段。

> 说明：一级与二级在 XML 协议结构上**天然不同**（`sitemapindex` vs `urlset`），这是标准要求，不应强行改为同构。

---

## 3. 模板实现

### 3.1 二级模板：`layouts/sitemap.xml`

- 输出 `urlset`。
- 过滤规则：
  - 排除 `404` 页面；
  - 支持 `sitemap_exclude`；
  - 支持 `sitemap.disable = true`。
- 字段策略：
  - `lastmod`：优先使用页面更新时间；
  - `changefreq`：页面未声明时默认 `weekly`；
  - `priority`：首页、关键栏目与普通页面采用分层优先级；
  - `xhtml:link`：输出多语言互链；
  - `image:image`：支持背景图与页面资源图像。

### 3.2 一级模板：`layouts/sitemapindex.xml`

- 覆盖 Hugo 默认模板，统一输出风格与字段格式。
- 输出项：
  - `loc`：使用站点级 `SitemapAbsURL`；
  - `lastmod`：使用 `Home.Lastmod` 作为语言站点更新时间来源。

---

## 4. 统一展示样式（XSL）

为提升浏览器可读性，在一级与二级 XML 中统一引入样式：

```xml
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
```

### 4.1 样式文件

- 路径：`static/sitemap.xsl`
- 行为：
  - 若根节点是 `sitemapindex`，按索引表格渲染；
  - 若根节点是 `urlset`，按 URL 明细表格渲染。

### 4.2 设计原则

- 仅统一“浏览器展示层”，不改变 XML 协议语义。
- 搜索引擎读取的是 XML 数据本体，XSL 不影响收录逻辑。

---

## 5. 部署与响应头配置

在 `vercel.json` 中增加规则，保证所有层级 `sitemap.xml` 返回 XML 类型：

- 匹配规则：`/(.*)sitemap\.xml`
- 响应头：`Content-Type: application/xml; charset=utf-8`

该配置用于避免部分环境将二级 sitemap 识别为 HTML 的问题。

---

## 6. 验证清单

### 6.1 本地构建验证

- 执行：`hugo --cleanDestinationDir`
- 预期输出：
  - `public/sitemap.xml`（一级索引）
  - `public/zh/sitemap.xml`、`public/en/sitemap.xml`、`public/ja/sitemap.xml`（二级列表）

### 6.2 线上头部验证

- `curl -I https://<domain>/sitemap.xml`
- `curl -I https://<domain>/zh/sitemap.xml`

预期两者均包含：

- `Content-Type: application/xml; charset=utf-8`

### 6.3 搜索引擎验证

- 在 Google Search Console 提交：`/sitemap.xml`
- 观察子 sitemap 是否被自动发现并成功抓取。

---

## 7. 维护规范

1. 新增语言时，只需确保该语言站点正常生成 `/<lang>/sitemap.xml`，一级索引会自动收录。
2. 若新增页面类型（如知识库、案例库），应复核 `priority` 与 `changefreq` 策略是否需要分层调整。
3. 若变更部署平台，需重新确认 `sitemap.xml` 的 `Content-Type` 不被覆盖。

---

## 相关文档

- [GSC SEO 设计文档](./GSC_SEO_DESIGN.md)
- [国际化 (I18N) 方案设计](./I18N_DESIGN.md)

更新时间：2026-05-08
