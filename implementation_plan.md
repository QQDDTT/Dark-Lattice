# Hugo 多版本兼容与报错修复实施计划（修正案三）

针对新版 Hugo (v0.161.1) 对 `.Site.Sites` 与 `.Site.Data` 报出的最新弃用警告，我们使用更底层的核心通用属性和函数进行无感重构，以实现新旧版本全面“双零”（零警告、零报错）兼容。

## 待用户确认 (User Review Required)

本修正案进行了以下决策：
1. **替换全局站点列表查询**：将 `(index site.Sites 0).Language.Lang` 替换为无警告且在老版本兼容的官方推荐属性 `site.DefaultContentLanguage`。
2. **重构数据读取方式**：在模板中通过 `readFile "data/social.toml" | transform.Unmarshal` 替代 `site.Data.social` / `hugo.Data.social`。这能够彻底消除不同 Hugo 版本对 Data 数据流调用的警告与编译报错，同时不需要移动或重命名任何物理文件。

---

## Proposed Changes

### 模板文件 (Layouts)

#### [MODIFY] [head.html](file:///workspaces/Dark-Lattice/layouts/partials/head.html)
- 将 `{{ $defaultLang := (index site.Sites 0).Language.Lang }}` 替换为 `{{ $defaultLang := site.DefaultContentLanguage }}`。

#### [MODIFY] [footer.html](file:///workspaces/Dark-Lattice/layouts/partials/footer.html)
- 将 `{{- $social := site.Data.social -}}` 替换为 `{{- $social := readFile "data/social.toml" | transform.Unmarshal -}}`。

---

## 验证计划 (Verification Plan)

### 自动测试
- 在本地测试中，运行构建命令，确认在 v0.161.1 版本下完全无警告、无报错：
  `hugo --minify`

### 手动验证
- 检查生成文件中的页脚社交链接（如邮箱）是否正确渲染，确保其解析无误。
