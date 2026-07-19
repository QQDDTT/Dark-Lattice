---
title: "Large Model Capabilities and Limits Analysis (Project AURA Extension)"
date: 2026-07-19
description: "Google AI Studio limits and model features reference manual (compiled for Project AURA)"
draft: false
tags: ["AiSpect", "LLM", "Limits"]
---

# Large Model Capabilities and Limits Analysis (Project AURA Extension)

This guide is based on the quota data from the Google AI Studio dashboard (specifically for Project AURA). Live usage has been removed, retaining only the rate limits, and the core usage methods for various models and tools have been summarized. In AiSpect's multi-agent orchestration, reasonably utilizing these models with different characteristics and limits is key to optimizing costs and response speeds.

## 1. Core Model Matrix (Models)

To meet different Agent scheduling needs, the platform provides a series of targeted optimized models:

### 1.1 Text and Inference Mainstays (Text Generation)
- **Ultra-fast Lightweight Models (Flash Lite Series)**: Such as `Gemini 2.5 Flash Lite` and `Gemini 3.1 Flash Lite`. They have extremely high daily request limits (RPD up to 500), are optimized for ultra-low latency requirements, and are very suitable for high-concurrency, high-volume basic text processing, and pipeline tasks.
- **Cost-effective and Foundational Models (Flash Series)**: Such as `Gemini 3.5 Flash` and `Gemini 2.5 Flash`. Suitable for routine text generation, lightweight Agent development, and high-frequency API polling.
- **Complex Inference Models (Pro Series)**: Such as `Gemini 2.5 Pro` and `Gemini 3.1 Pro`. Designed specifically for complex logical reasoning, deep code generation, and long text understanding. Suitable for scenarios requiring rigorous academic or technical reasoning.

### 1.2 Advanced Agent Abstractions (Agent Models)
- **Autonomous Programming (Antigravity)**: Possesses an independent Linux sandbox and embedded browser, capable of spontaneously planning, writing, running, and autonomously debugging and repairing code.
- **Autonomous Research (Deep Research Pro)**: Capable of spontaneously executing multi-step web searches, reading literature, and generating in-depth reports around complex topics.
- **Computer Operation (Computer Use)**: Capable of directly operating the operating system (OS) through screenshots, simulated mouse clicks, and keyboard inputs.

### 1.3 Multimodal and Peripheral Ecosystem (Multimodal & Others)
- **Voice Multimodal (TTS & Native Audio)**: Natively supports highly natural streaming voice synthesis, and even supports millisecond-latency two-way real-time duplex APIs (`Live API`), suitable for developing real-time voice assistants.
- **Image/Video/Audio Creation**: Includes cutting-edge image generation (`Imagen 4`), video generation (`Veo 3`), and music/audio creation (`Lyria 3`).
- **Omni-modal Fusion (`Gemini Omni Flash`)**: Natively processes text, audio, and video synchronously, achieving true cross-modal input and output.
- **Foundational Extensions**: Such as vector embeddings (`Gemini Embedding`), robotic embodied control (`Gemini Robotics ER`), and open-source lightweight deployment (`Gemma 4`).

## 2. Tools and Grounding Capabilities (Tools & Grounding)

Grounding tools allow large models to access real-time external trusted data sources when generating answers, significantly reducing "hallucinations" and ensuring information timeliness:

- **Search Grounding**: Supports Gemini 2 / 2.5 / 3 series. When enabled, the model automatically calls Google Search to obtain the latest real-time web pages, news, or technical documents before answering, and includes citation links in the response.
- **Map Grounding**: Supports Deep Research and some Gemini foundational models. When enabled, the model can query the Google Maps database in real-time to obtain precise geographic locations, merchant information, route planning, and spatial POI data.

Rationally combining different tiers of models and Grounding tools is the foundation for ensuring the efficient and stable operation of AiSpect Graph Agents in complex business flows.
