---
title: "大模型能力与限额分析 (Project AURA 扩展)"
date: 2026-07-19
description: "Google AI Studio 限额与模型特性参考手册（针对 Project AURA 整理）"
draft: false
tags: ["AiSpect", "LLM", "Limits"]
---

# 大模型能力与限额分析 (Project AURA 扩展)

本指南基于 Google AI Studio 控制面板的限额数据（针对 Project AURA），移除了实时用量，仅保留各项速率上限（Limits），并对各类模型与工具的核心使用方式进行了归纳。在 AiSpect 的多智能体编排中，合理利用这些不同特性和限额的模型，是优化成本与响应速度的关键。

## 1. 核心模型矩阵 (Models)

为了满足不同的 Agent 调度需求，平台提供了一系列针对性优化的模型：

### 1.1 文本与推理主力 (Text Generation)
- **极速轻量模型 (Flash Lite 系列)**：如 `Gemini 2.5 Flash Lite` 与 `Gemini 3.1 Flash Lite`。拥有极高的每日请求额度（RPD 高达 500），针对极低延迟需求优化，非常适合高并发、大批量基础文本处理和流水线任务。
- **高性价比与基础模型 (Flash 系列)**：如 `Gemini 3.5 Flash` 与 `Gemini 2.5 Flash`。适用于常规文本生成、轻量 Agent 开发及高频 API 轮询。
- **复杂推理模型 (Pro 系列)**：如 `Gemini 2.5 Pro` 与 `Gemini 3.1 Pro`。专为复杂逻辑推理、深度代码生成、长文本理解设计，适合要求严谨学术或技术推理的场景。

### 1.2 高级智能体抽象 (Agent Models)
- **自主编程 (Antigravity)**：拥有独立的 Linux 沙箱和内嵌浏览器，能自发计划、编写、运行并自主 Debug 修复代码。
- **自主调研 (Deep Research Pro)**：能够围绕复杂课题自发执行多步骤网络搜索、文献阅读并生成深度报告。
- **计算机操作 (Computer Use)**：能够通过截屏、模拟鼠标点击和键盘输入来直接操作操作系统（OS）。

### 1.3 多模态与外围生态 (Multimodal & Others)
- **语音多模态 (TTS & Native Audio)**：原生支持高自然度的流式语音合成，甚至支持毫秒级延迟的双向实时双工 API（`Live API`），适合开发实时语音助手。
- **图像/视频/音频创作**：包含尖端图像生成 (`Imagen 4`)、视频生成 (`Veo 3`) 和音乐音频创作 (`Lyria 3`)。
- **全模态融合 (`Gemini Omni Flash`)**：原生同步处理文本、音频、视频，实现真正的跨模态输入输出。
- **基础外延**：如向量嵌入 (`Gemini Embedding`)、机器人具体化控制 (`Gemini Robotics ER`) 及开源轻量化部署 (`Gemma 4`)。

## 2. 工具与接地能力 (Tools & Grounding)

接地（Grounding）工具允许大模型在生成回答时接入实时外部可信数据源，大幅降低“幻觉”现象并确保信息时效性：

- **搜索接地 (Search Grounding)**：支持 Gemini 2 / 2.5 / 3 系列。开启后，模型在回答前会自动调用 Google 搜索获取最新实时网页、新闻或技术文档，并在回答中附带引用链接。
- **地图接地 (Map Grounding)**：支持 Deep Research 及部分 Gemini 基础模型。开启后，模型能实时检索 Google Maps 数据库，获取精确的地理位置、商户信息、路线规划及空间 POI 数据。

合理搭配不同梯队的模型与 Grounding 工具，是保障 AiSpect Graph Agent 在复杂业务流中高效稳定运行的基础。
