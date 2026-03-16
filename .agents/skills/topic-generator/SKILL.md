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

## 4. Case Study Schema (Separate Template)

For topics in the `case-studies` category, use this structure instead:

1.  **Frontmatter (YAML):** Same as standard.
2.  **## Requirements:** Functional and non-functional requirements.
3.  **## Capacity Estimation:** Read/write ratio, storage, bandwidth calculations.
4.  **## API Design:** Endpoint signatures and auth approach.
5.  **## Data Model:** Schema design with database selection rationale.
6.  **## High-Level Architecture:** `<ArchitectureCanvas configId="[diagramId]" />`
7.  **## Read & Write Paths:** Step-by-step creation and retrieval flows.
8.  **## Deep Dives:** Caching, scaling, and key algorithmic decisions.
9.  **## Tradeoffs & Decisions:** `<TradeoffCard pros={[...]} cons={[...]} />`
10. **## Interview Answer Template:** `<InterviewAnswer>` with structured answer.
11. **## Key Takeaways:** `<KeyTakeaways items={[...]} />`
12. **## Related Topics:** `<RelatedTopics slugs={[...]} />`

## 5. Content Reference

Before writing content for any topic, consult `DOCS/SD-Plan.md` Section 5.3 (Full Topic Content Outline) which lists the exact content points that should be covered for each of the 28 topics.

Review the example templates in this skill's `examples` folder before generating any content:
- `topic-template.mdx` — Standard 12-section topic
- `case-study-template.mdx` — Case study topic
