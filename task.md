# 任务清单

- [x] 兼容性调整（修正案执行中）
    - [x] 恢复 hugo.toml 配置字段为 locale 和 label
    - [x] 替换布局文件中的全局 hugo 命令为 site 兼容形式 (hugo.Sites -> site.Sites, hugo.Data -> site.Data)
    - [x] 将多语言属性统一为 .Language.Lang
    - [x] 恢复模板中的 .Language.Label 引用
- [x] 验证编译 (本地新版 0 警告 & 服务器老版 0 报错)
