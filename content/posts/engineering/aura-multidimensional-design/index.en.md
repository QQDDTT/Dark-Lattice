---
title: "From Chain to Multidimensional: Rust Refactoring and Graph Evolution of Aura Agent Engine"
date: 2026-04-25T00:43:00+09:00
draft: false
tags: ["Rust", "AI Agent", "Graph Engine", "Engineering"]
categories: ["Engineering Practice"]
summary: "An in-depth analysis of how Aura Agent evolved from Python linear workflows to a Rust-driven multidimensional graph structure engine. Covering the five core dimensions, ACP protocol, and engineering insights for high-performance AI agents."
---

## Preface

In the evolution of AI Agents, we have found that traditional "Linear Chains" are struggling to handle increasingly complex task scenarios. While straightforward, this linear logic falls short when dealing with long-term memory association, multi-role collaboration, and self-evolution.

This post shares the comprehensive upgrade plan for the **Aura** project: we are migrating the core kernel from Python to **Rust** and introducing a brand-new **Multidimensional Graph** engine.

---

## 1. Why Rust?

A high-performance AI Agent is essentially a high-concurrency, low-latency scheduling system. During the Python era of Aura-Simple, we were limited by the Global Interpreter Lock (GIL) and slow serialization overhead.

Core reasons for choosing Rust for Aura include:
- **Zero-Cost Abstractions**: Allowing us to manage complex graph topologies with near-native performance.
- **Memory Safety & Concurrency**: Rust's ownership model ensures no data races while scheduling multiple AI models and Skill Plugins across threads.
- **WASM Compatibility**: Via WebAssembly, we can implement high-performance, sandboxed skill plugin systems.

---

## 2. The Soul: Five Core Dimensions Graph Structure

Aura no longer views a task as a straight line, but as a graph structure interwoven across five different dimensions.

### 2.1 Memory
Unlike simple vector database retrieval, Aura's memory dimension is a subgraph. it establishes edges based on time series, emotional weights, and entity associations. This means the Agent can automatically reach "non-local" historical experiences while executing the current step.

### 2.2 Work Steps
This is the traditional logical execution flow, defining task dependencies. In the graph, it manifests as edges with state transition probabilities.

### 2.3 Architecture Layers
We partition the execution space into different levels, from "low-level system calls" to "high-level strategic planning." This vertical dimension allows the Agent to switch thinking modes across different abstraction levels.

### 2.4 Agent Role —— [New]
The same node (Node) has different connection weights under different role perspectives. For example, a "Lead Architect" role will focus more on the Architecture Layers dimension, while a "Junior Developer" will focus more on specific Work Steps.

### 2.5 Self-Evolution —— [New]
This is Aura's most breakthrough dimension. It records the feedback loop of node execution. Through "Reflection Nodes," the Agent can dynamically modify edge weights in other dimensions. This endogenous growth capability allows Aura to become sharper as it is used more.

---

## 3. Interaction Revolution: ACP Protocol and Parallel Dashboard

To support multi-platform interaction, we defined the **ACP (Agent Communication Protocol)**.

- **Multi-platform Sync**: The JSON-RPC based ACP protocol allows Dashboards, mobile apps, and CLIs to sync the Agent's status in real-time.
- **Parallel Experience**: Thanks to Rust's async runtime, Aura achieves decoupling of "frontend interaction" and "backend reasoning." You can continue issuing new commands or viewing intermediate reasoning on the Dashboard while the Agent performs complex graph searches, without perceiving any blocking.

---

## 4. Outlook: Towards a Professionalized Skill System

In Aura's blueprint, Skills are no longer simple scripts, but professionalized components with strict Schema validation, independent cost accounting models, and support for WASM loading. Combined with the multidimensional graph engine, the Agent will be able to precisely select the most suitable combination of models and skills based on task complexity and real-time feedback.

## Conclusion

From linear to multidimensional is not just a change in code structure, but an evolution of the AI Agent's cognitive paradigm. Aura's Rust refactoring provides a solid foundation for exploring higher-level machine intelligence on top of this multidimensional graph structure.
