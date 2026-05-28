# 任务清单

- [x] 修复配置文件 `hugo.toml` 中的多语言字段
- [x] 修复布局文件中的 `.Language.Locale` 与 `.Language.Label` 字段
    - [x] `layouts/_default/baseof.html`
    - [x] `layouts/partials/head.html`
    - [x] `layouts/sitemap.xml`
    - [x] `layouts/partials/header.html`
    - [x] `layouts/partials/footer.html`
- [x] 验证编译 (受容器 AppData 目录只读影响，无法直接在 AI 代理终端运行 hugo 命令。已在计划中说明交付给用户手动进行验证)
