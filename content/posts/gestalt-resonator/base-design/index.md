---
title: "gestalt-resonator 设计总纲 (Base Design)"
date: "2026-06-21T14:05:24+09:00"
description: "跨平台画面设计合成与转译系统设计总纲"
tags: ["gestalt-resonator", "设计总纲"]
draft: true
---

# gestalt-resonator 设计总纲 (Base Design)

本系统是基于格式塔心理学、设计构成理论与软件工程模型建立的跨平台画面设计合成与转译系统。其核心职责是作为 Agent 协同的“设计中间件”，帮助开发 Agent 实现从“要件定义”到“高保真、高体验代码”的无缝转译。

## 1. 核心理论同构 (Theoretical Synesthesia)

设计思想深度来源于课题研究 [像素与架构的系统共鸣](file:///home/nick/文档/02_课题研究/像素与架构的系统共鸣)。我们将美学、格式塔原则与计算思维进行了系统级映射：

1. **“整体大于部分之和”完形同构**：
   - 界面上不应充斥着生硬、破碎的物理边框和零散组件。我们通过定义“接近性分组 (Proximity Groups)”和“骨骼网格 (Grid Skeleton)”，在 DDSL 中生成逻辑群组。
   - 确保 Client Agent 在编写代码时，依赖网格间距和软性留白而非显式物理边线，从而唤起用户的“闭合性”与“接近性”知觉。
2. **“形式服从功能，技术交融艺术”信息控制**：
   - 使用基于 HSL 色彩空间的设计 Token 来控制视觉重力分布，保证界面具有极高的可维护性与全局设计一致性。
   - 定义“共同命运 (Common Fate)”物理动效，将系统后台的控制状态（如超时、异常、进入编辑模式）转化为界面元素的协同抖动或溢出效果。

## 2. 接口契约：DDSL 契约包 (Design Contract Package)

为确保调用本系统的 Client Agent 能够无损执行转译，系统接口设计并非输出单一代码，而是交付一个“开发契约包”：
- **DDSL 语义 JSON (`layout.ddsl.json`)**：基于 [ddsl.schema.json](file:///home/nick/workspaces/gestalt-resonator/schema/ddsl.schema.json)。内置面向 Agent 的开发约束与设计依据注解（`_agent_guidelines`）。
- **色彩与布局 Tokens (`design_tokens.css`)**：解耦的 CSS 变量，提供全局美学感质。
- **Agent 转译指南 (`TRANSPILER_RULES.md`)**：由 `gestalt-resonator get-context` 动态生成。Client Agent 可将此文件注入其 System Prompt 中，获得对布局树的最佳解析心智与编码约束。
- **QA 测试清单 (`design_qa_checklist.json`)**：定义交互状态机的 E2E 断言用例，供 Client Agent 进行自动化回归校验，防止“UI 表面绿”现象。

## 3. 驱动与调用模式 (Driver & Communication Mode)

系统支持双通道驱动方式以适配不同调用场景：
- **Headless CLI 模式**：
  - 指令：`gestalt-resonator generate --input <ddsl_path> --output-dir <output_dir> --target <target_framework>`
  - 适合构建集成，Agent 可一键批处理生成对应框架组件。
- **JSON-RPC Over Stdio (DSP Server)**：
  - 启动后，Agent 可通过 stdin 写入 JSON-RPC 请求，进行流式的要件输入与界面骨骼生成，实现轻量级实时交互。
