---
name: Topic Generator
description: Guidelines for generating new educational topics and case studies for the platform.
---

## 🏆 Pedagogical Golden Rules (CRITICAL)
1. **Beginner First**: All explanations MUST use simple analogies and avoid jargon where possible. If a technical term is used, explain it immediately.
2. **Self-Explaining Visuals**: All React Flow diagrams and simulations must be intuitive. Use labels, clear colors, and logical positioning so a beginner can understand the flow at a glance.
3. **Strict Section Counts**:
   - **Tradeoffs**: Minimum 4, Maximum 6 points.
   - **Q&A / Interview Notes**: Minimum 4, Maximum 6 questions/points.
   - **Summary / Takeaways**: Minimum 4, Maximum 6 points.
4. **Accessible Real-World Apps**: Use day-to-day examples (e.g., Netflix, WhatsApp, Uber) and explain their scaling in easy-to-follow steps.

## 1. File Location
... (rest of the file)
Topics must be saved as `[slug].mdx` inside the appropriate category folder under `src/content/`:
- `src/content/fundamentals/`
- `src/content/scaling/`
- `src/content/databases/`
- `src/content/messaging/`
- `src/content/patterns/`
- `src/content/case-studies/`

## 2. Topic Tree Registration
After creating the file, you **MUST** update `src/data/topicTree.ts` to include the new topic in the relevant category array so it appears in the sidebar.

## 3. Standard Topic Schema (12 Sections)

For topics in categories 1–5 (Fundamentals, Scaling, Databases, Messaging, Patterns), EVERY topic must include the following sections exactly:

1.  **Frontmatter (YAML):** `title`, `slug`, `category`, `difficulty`, `order`, `tags`, `relatedTopics`, `diagramId`.
2.  **## Introduction:** What the concept is, in simple terms.
3.  **## Why It Matters:** Why this topic is important in distributed systems or interviews.
4.  **## Problem It Solves:** What system limitation or challenge this addresses.
5.  **## Core Concept:** Main explanation with key principles and theory.
6.  **## Architecture:** Building blocks with `<ArchitectureCanvas configId="[diagramId]" />`. *Note: Pass only the string ID, not component arrays.*
7.  **## Request Flow:** Step-by-step system flow. If applicable, add `<SimulationEmbed type="[type]" />`.
8.  **## Interactive Visualization:** Description of the interactive simulation for this topic.
9.  **## Tradeoffs:** A `<TradeoffCard pros={[...]} cons={[...]} />`.
10. **## Real-World Usage:** Where this is used in actual production systems.
11. **## Interview Notes:** An `<InterviewAnswer>` wrapping 5 numbered points (Definition, Key Points, Benefits, Tradeoffs, When to use).
12. **## Key Takeaways:** A `<KeyTakeaways items={[...]} />` with 3–5 revision bullets.
13. **## Related Topics:** A `<RelatedTopics slugs={[...]} />` linking to connected concepts.

## 4. Case Study Schema (Enhanced Template — 18 Sections)

For topics in the `case-studies` category, use this layered structure:

**🟢 Beginner Layer:**
1.  **Frontmatter (YAML):** Same as standard + difficulty must be `easy`, `medium`, or `hard`.
2.  **## Introduction:** Real-world analogy + 2-3 beginner-friendly sentences.
3.  **## Why This Matters & Prerequisites:** Why this system exists (2-3 paragraphs), audience guide (beginner/intermediate/advanced), and prerequisite topic links.

**🟡 Core (All Levels):**
4.  **## Requirements:** Functional (4-5 items) and non-functional (latency, availability, scale, security).
5.  **## Capacity Estimation:** Table with Read/Write ratio, QPS, storage, bandwidth. Include back-of-envelope reasoning.
6.  **## API Design:** Endpoint signatures with auth approach, versioning, and design rationale.
7.  **## Data Model:** Schema design with database selection rationale (SQL vs NoSQL).
8.  **## High-Level Architecture:** `<ArchitectureCanvas configId="[diagramId]" />` with React Flow.
9.  **## Read & Write Paths:** Step-by-step creation and retrieval flows.
10. **## Deep Dives:** Key algorithm, caching strategy, and database scaling decisions.

**🟡 Intermediate Layer:**
11. **## Implementation Patterns:** `<KnowledgeSnippet>` with actual code — core algorithm implementation + key integration code (Redis, DB, etc.).

**🔴 Advanced Layer:**
12. **## Scaling Strategy:** 4-stage growth plan (0→10K, 10K→1M, 1M→100M, 100M→1B users).
13. **## Failure Scenarios & Production Considerations:** Failure table (what breaks, impact, mitigation), production monitoring (metrics, alerts, runbooks), and how real systems differ from our simplified version.

**📋 Assessment & Review:**
14. **## System Flows (Interactive):** `<SimulationEmbed>` or enriched ArchitectureCanvas showing key flow in action.
15. **## Tradeoffs & Decisions:** `<TradeoffCard pros={[...]} cons={[...]} />` (4-6 points each).
16. **## Common Questions (FAQ):** `<FAQAccordion>` with 4-6 questions.
17. **## Interview Answer Template:** `<InterviewAnswer>` with 5-point structured answer.
18. **## Key Takeaways:** `<KeyTakeaways items={[...]}/>` with 4-6 bullets.
19. **## Related Topics:** `<RelatedTopics slugs={[...]} />` cross-links.

## 5. Content Reference

Before writing content for any topic, consult `DOCS/SD-Plan.md` Section 5.3 (Full Topic Content Outline) which lists the exact content points that should be covered for each of the 28 topics.

Review the example templates in this skill's `examples` folder before generating any content:
- `topic-template.mdx` — Standard 12-section topic
## 6. Plan Synchronization Rule (MANDATORY)

Whenever a change is made to a high-level planning document, all other synchronized plans **MUST** be updated immediately to maintain a single source of truth.

**Primary Planning Documents:**
- `DOCS/SD-Plan.md`: The technical vision and full topic roadmap.
- `DOCS/Execution-Plan.md`: The phase-by-phase implementation strategy and counts.
- `task.md` (Artifact): The current active sprint tracking.

**Synchronization Workflow:**
1. If the **number of topics** changes, update topic counts in `SD-Plan.md` and `Execution-Plan.md`.
2. If a **template** changes (e.g., from 12 to 18 sections), update the schema definitions in `SKILL.md`, `SD-Plan.md`, and all active sprint plans.
3. If a **feature** is added to the roadmap, ensure it is reflected in the phase breakdown of both `SD-Plan.md` and `Execution-Plan.md`.
4. Always verify that difficulty labels and topic slugs are identical across all planning files.
