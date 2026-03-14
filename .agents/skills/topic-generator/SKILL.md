---
name: Topic Generator
description: Generates a new MDX topic file for the System Design Platform.
---

# Topic Generator Skill

This skill teaches you how to generate a new MDX learning topic for the platform. When asked to "create a topic about X", you must rigorously follow the MDX schema and structure defined below.

## 1. File Location
Topics must be saved as `[slug].mdx` inside the appropriate category folder under `src/content/`:
- `src/content/fundamentals/`
- `src/content/scaling/`
- `src/content/databases/`
- `src/content/messaging/`
- `src/content/patterns/`
- `src/content/case-studies/`

## 2. Topic Tree Registration
After creating the file, you **MUST** update `src/data/topicTree.ts` to include the new topic in the relevant category array so it appears in the sidebar.

## 3. MDX Schema Requirements

EVERY topic must include the following sections exactly:

1.  **Frontmatter (YAML):** `title`, `slug`, `category`, `difficulty`, `tags`, `diagramId`.
2.  **## Introduction:** A brief overview.
3.  **## The Problem:** What problem this system solves.
4.  **## Architecture:** Detailed explanation containing an `<ArchitectureCanvas configId="[diagramId]" />`. *Note: You do not pass component arrays here, only the string ID.*
5.  **## Flow Simulation:** If applicable, add `<SimulationEmbed type="[type]" />`
6.  **## Tradeoffs:** A `<TradeoffCard pros={[...]} cons={[...]} />`
7.  **## Interview Answer:** An `<InterviewAnswer>` wrapping 5 numbered points (Definition, Components, Benefits, Tradeoffs, When to use).

Review the example `topic-template.mdx` file in this skill's `examples` folder before generating any content.
