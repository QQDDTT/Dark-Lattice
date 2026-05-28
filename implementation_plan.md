# Hugo 语言配置与模板兼容性修复实施计划

由于 Hugo 升级导致的多语言参数废弃，以及模板中使用了当前 Hugo 版本不支持的 `.Language.Locale` 字段，本计划将对此进行修复。

## 待用户确认 (User Review Required)

本修复没有破坏性改动，仅修改配置文件和模板以适配当前版本的 Hugo 标准配置。

> [!NOTE]
> 由于检测到系统 AppData 目录为只读文件系统（Read-only file system），无法写入官方 Artifact 目录。因此，本实施计划直接保存在工作区根目录下的 `implementation_plan.md` 中。

## 待解决的问题 (Open Questions)

无。

---

## 拟作出的修改 (Proposed Changes)

### 配置文件 (Configuration)

#### [MODIFY] [hugo.toml](file:///workspaces/Dark-Lattice/hugo.toml)
- 将全局顶层的 `locale = 'zh-cn'` 改为 `languageCode = 'zh-cn'`。
- 将各语言（zh, en, ja）块内部的 `locale` 修改为官方推荐的 `languageCode`。
- 将各语言（zh, en, ja）块内部的 `label` 修改为官方推荐的 `languageName`。

---

### 模板文件 (Layouts)

#### [MODIFY] [baseof.html](file:///workspaces/Dark-Lattice/layouts/_default/baseof.html)
- 将 `<html lang="{{ .Site.Language.Locale }}">` 修改为 `<html lang="{{ .Site.Language.LanguageCode }}">`。

#### [MODIFY] [head.html](file:///workspaces/Dark-Lattice/layouts/partials/head.html)
- 将 `hreflang="{{ .Language.Locale }}"` 修改为 `hreflang="{{ .Language.LanguageCode }}"`。

#### [MODIFY] [sitemap.xml](file:///workspaces/Dark-Lattice/layouts/sitemap.xml)
- 将 `hreflang="{{ .Language.Locale }}"` 修改为 `hreflang="{{ .Language.LanguageCode }}"`。

#### [MODIFY] [header.html](file:///workspaces/Dark-Lattice/layouts/partials/header.html)
- 将 `{{ .Language.Label }}` 修改为 `{{ .Language.LanguageName }}`。

#### [MODIFY] [footer.html](file:///workspaces/Dark-Lattice/layouts/partials/footer.html)
- 将 `{{- .Language.Label -}}` 修改为 `{{- .Language.LanguageName -}}`。

---

## 验证计划 (Verification Plan)

### 自动测试
- 在修改完成后，在终端运行以下命令进行本地构建，验证是否成功通过且无报错：
  `hugo --minify`

### 手动验证
- 检查生成文件中的 `<html>` 标签中的 `lang` 属性是否正确输出。
- 检查 `sitemap.xml` 和 `head.html` 中的页面多语言版本链接 (`hreflang`) 是否配置正确。
- 验证页面头部及底部的多语言切换链接和文字显示是否正常。
