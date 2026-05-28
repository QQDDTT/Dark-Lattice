# Hugo 多版本兼容与报错修复实施计划（修正案）

为兼容服务器上的旧版 Hugo (v0.128.0) 避免致命的模板编译报错，同时消除本地新版 Hugo (v0.161.1) 产生的弃用警告，需要对配置与全局方法调用进行进一步调整。

## 待用户确认 (User Review Required)

本修正案进行了以下决策：
1. **替换全局命名空间调用**：将 `hugo.Sites` 与 `hugo.Data` 改为兼容老版本的 `site.Sites` 与 `site.Data`。
2. **规避多版本语言属性的命名差异**：由于不同版本的 Hugo 对语言编码的获取属性不同（老版为 `LanguageCode`，新版为 `Locale` 且已弃用 `LanguageCode`），模板中凡是使用 `.Language.Locale` 或 `.Language.LanguageCode` 获取语言编码的地方，统一重构为使用原生兼容的 `.Language.Lang`（例如输出 `zh`, `en`, `ja`）。
3. **保持语言展示名称一致**：重新将模板中的 `.Language.LanguageName` 改回 `.Language.Label`。

---

## Proposed Changes

### 配置文件 (Configuration)

#### [MODIFY] [hugo.toml](file:///workspaces/Dark-Lattice/hugo.toml)
- 保留全局顶层的 `locale = 'zh-cn'`。
- 将各语言配置块（`[languages.zh]`, `[languages.en]`, `[languages.ja]`）下的 `languageCode` 还原/重构为 `locale`。
- 将各语言配置块下的 `languageName` 还原为 `label`。

---

### 模板文件 (Layouts)

#### [MODIFY] [baseof.html](file:///workspaces/Dark-Lattice/layouts/_default/baseof.html)
- 将 `<html lang="{{ .Site.Language.LanguageCode }}">` 重构为 `<html lang="{{ .Site.Language.Lang }}">`。

#### [MODIFY] [head.html](file:///workspaces/Dark-Lattice/layouts/partials/head.html)
- 将 `hreflang="{{ .Language.LanguageCode }}"` 重构为 `hreflang="{{ .Language.Lang }}"`。
- 将 `{{ $defaultLang := (index hugo.Sites 0).Language.Lang }}` 修改为 `{{ $defaultLang := (index site.Sites 0).Language.Lang }}`，以兼容旧版 Hugo。

#### [MODIFY] [sitemap.xml](file:///workspaces/Dark-Lattice/layouts/sitemap.xml)
- 将 `hreflang="{{ .Language.LanguageCode }}"` 重构为 `hreflang="{{ .Language.Lang }}"`。

#### [MODIFY] [header.html](file:///workspaces/Dark-Lattice/layouts/partials/header.html)
- 将 `{{ .Language.LanguageName }}` 改回 `{{ .Language.Label }}`。

#### [MODIFY] [footer.html](file:///workspaces/Dark-Lattice/layouts/partials/footer.html)
- 将 `{{- .Language.LanguageName -}}` 改回 `{{- .Language.Label -}}`。
- 将 `{{- $social := hugo.Data.social -}}` 修改为 `{{- $social := site.Data.social -}}`，以兼容旧版 Hugo。

---

## 验证计划 (Verification Plan)

### 自动测试
- 在本地测试中，运行构建命令，确认在 v0.161.1 版本下完全无警告、无报错：
  `hugo --minify`

### 手动验证
- 检查生成文件中的 `<html>` 标签中的 `lang` 属性是否正确输出。
- 检查 `sitemap.xml` 和 `head.html` 中的页面多语言版本链接 (`hreflang`) 是否配置正确。
- 验证页面头部及底部的多语言切换链接和文字显示是否正常。
