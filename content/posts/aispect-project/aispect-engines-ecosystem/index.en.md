---
title: "AiSpect Engines Ecosystem and Peripheral Matrix (Engines & Ecosystem)"
date: 2026-07-19
description: "Elaborates on the deployment ecosystem of the framework, including adaptations for different engines, specific Agent instances, and testing and example projects"
draft: false
tags: ["AiSpect", "Engines", "Ecosystem"]
---

# AiSpect Engines Ecosystem and Peripheral Matrix (Engines & Ecosystem)

To allow business developers to enable AI proxy capabilities with "zero intrusion" or "minimal configuration" in their familiar frameworks, AiSpect has built a rich array of engine adapters (Engines) and peripheral ecosystem modules outside the core foundation.

## 1. Engine Adaptation Layer (Engines)

The core goal of the engine adaptation layer is deep integration with different runtime host environments. Developers only need to import the corresponding engine module, which will automatically transitively pull in all necessary core packages.

### 1.1 `aispect-engine-spring`
An auto-configuration module tailor-made for the Spring Boot environment.
- **Auto-configuration**: Utilizes `@ConfigurationProperties` to automatically read parameters from `application.yml` and uses `AiAgentBeanPostProcessor` to automatically scan and generate proxy instance replacements after Bean initialization.
- **Dependency Injection**: Agent interface implementation classes are themselves Spring Beans. They can freely use `@Autowired` internally to inject database Mappers, Redis clients, etc., achieving high integration between the AI layer and the business layer.
- **Graph Workflow Gateway**: Built-in `AiGraphAgentSpringLauncher`. After the Spring container starts, it actively collects Beans with `@AiGraphAgent` into a resource pool and uses functional routing like WebFlux to dynamically expose HTTP API endpoints (e.g., `POST /ai/graph/{agentName}`). External systems can trigger complex graph algorithm execution chains simply by sending a request.

### 1.2 `aispect-engine-se` and `aispect-engine-quarkus`
- **`aispect-engine-se`**: Targeted at pure Java SE environments. Provides a minimalist static factory or builder API. Developers manually manage the lifecycle of objects and assemble the `AiClient`, making it suitable for basic server-side or console applications.
- **`aispect-engine-quarkus` (Planned)**: Targeted at the cloud-native Quarkus framework, focusing on GraalVM AOT build-time enhancements. Generates proxy class bytecode through Quarkus Extensions during the compilation phase, aligning with the design philosophy of blazing-fast startup and extremely low memory footprint.

## 2. Pre-built Agent Instances Set (`aispect-agents`)

As the core contract abstractions descend to the API layer, this module transitions into **providing a rich, out-of-the-box built-in Agent implementation library** that does not depend on specific model vendors.
- **Data Processing Category**: Such as text cleaning (`DataCleanAgent`) and forced structured JSON extraction (`JsonExtractorAgent`).
- **Flow Control Category**: Conditional routing branches (`ConditionalRouterAgent`) and timeout/exception fallback strategies (`FallbackAgent`).
- **Review and Risk Control Category**: Content compliance checking (`ContentModerationAgent`).
- **Graph Routing Examples**: Such as `StorytellingGraphAgent`, demonstrating how to handle streaming (SSE) output and contextual graph routing.

## 3. Auxiliary Project Matrix

### 3.1 Best Practice Examples (`examples`)
Provides intuitive, out-of-the-box experiences.
- **`example-java-se`**: CLI automated file assistant, showcasing tool calling and local file interaction.
- **`example-spring-boot`**: AI document intelligent editing Web platform, demonstrating how Agents integrate with front-end single-page applications and back-end Service dependency injection.
- **`example-quarkus`**: Demonstrates real-time code defect analysis via Webhooks.

### 3.2 Dedicated Testing Scaffold (`aispect-test`)
An offline testing tool library provided for the business side.
- **`MockAiClient`**: Simulates fixed returns, network timeouts, or content review blocks without needing a real API.
- **Context Forging**: Rapidly assembles proxy execution snapshots through `InvocationContextBuilder`.
- **Spring Test Slices**: Provides test slice support to quickly bring up a localized Agent interception chain without starting heavy components like database connections.

### 3.3 Version Control and Facade (`bom` and `website`)
- **`aispect-bom`**: Centrally manages internal and external dependency versions via Maven, so external integration only requires importing a single POM.
- **`aispect-website`**: A public portal built with VitePress, containing only public APIs, JavaDoc, and integration guides. It ensures the privacy of core business logic while establishing a professional open-source product image.
