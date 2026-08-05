---
title: "gcp-gemini-manage Core Architecture Design: Four-Project Routing and Agent Feedback Loop"
date: 2026-08-05
tags:
  - GCP
  - Gemini
  - Infrastructure
  - AI Agent
---

As businesses and AI labs scale, managing the complex web of server instances, API keys, and databases on Google Cloud Platform (GCP) becomes a daunting challenge. The `gcp-gemini-manage` project was born out of this necessity—it is not merely a collection of deployment scripts, but a dedicated **Ops Hub** designed to bridge the gap between "underlying cloud infrastructure" and "upper-layer AI Agents".

This article dives deep into the core design philosophy of the project, covering the enterprise-grade 4-independent-project architecture and how it achieves zero-touch closed-loop management via Agent Skills.

## Enterprise-Grade 4-Independent-Project Architecture

In the past, development, testing, and production resources were often mixed within a single GCP project. This not only complicated billing and permissions audits but also increased the risk of cross-environment misconfigurations. `gcp-gemini-manage` fully embraces multi-environment isolation by dividing the entire business into 4 clearly defined independent microservice projects:

1. **AI Lab (`evotensor-ai-lab`)**
   Dedicated to Large Language Model (LLM) inference, GPU-attached servers, and Gemini API Keys allocation. This environment handles all high-intensity AI computing tasks, acting as the "brain factory" of the system.

2. **Data Core (`evotensor-data-core`)**
   Data is an asset. This environment exclusively manages Cloud SQL, persistent storage volumes, and various core data infrastructures. Strict access controls and isolation ensure the absolute security of user data and system configurations.

3. **Ops Build (`evotensor-ops-build`)**
   The home of automated build machines and CI/CD pipelines. Lifecycle management here focuses on build speed and concurrency capacity, dynamically waking up build clusters via automated scripts as tasks arrive.

4. **Family Hub (`evotensor-family-hub`)**
   Provides auxiliary daily servers and edge computing nodes (such as the Hermes Agent). It emphasizes long-lived connection stability and lightweight routing, offering gateway support for end-users or home applications.

## Unified Environment Routing: The Art of `config.sh`

To allow underlying scripts to navigate the 4 projects effortlessly, we abandoned reliance on a single `.gcp_project_id`. All bash ops scripts perform traffic hijacking and redirection via `scripts/config.sh`:

```bash
export GCP_PROJECT_AI_LAB="evotensor-ai-lab"
export GCP_PROJECT_DATA_CORE="evotensor-data-core"
# ...
```

When we need to check global Gemini usage or batch-start servers, the underlying monitor iterates through `GCP_ALL_PROJECTS`, performing cross-project resource sniffing to aggregate a complete asset topology map.

## Agent Synergy Loop: Granting AI Physical Environment Awareness

Traditional automated infrastructure is usually human-centric (DevOps engineers executing operations via consoles or CLIs). However, the core advantage of `gcp-gemini-manage` is that it is **built for Agents**.

By declaring standardized skills in the `.agents/skills/` directory, we have semantically encapsulated underlying `gcloud` command lines:
- When a user requests: "Help me set up a private database."
- The Agent automatically reads the `deploy_aux_server.sh` script and dispatches the required parameters.
- Once the server starts, critical states like generated public IPs and connection credentials are directly synced back to the Agent's Context via standard input streams (stdin) and log echoes.

Thus, the Agent not only "writes code" but also possesses the ability to "provision servers" and "understand physical cloud states," completing a fully automated, self-healing loop from application development to infrastructure deployment.
