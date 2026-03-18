# Execution Plan: System Design Learning Platform

> **Strategy: Vertical Slicing** — Build one complete topic end-to-end first, then expand by category sprints. Each phase produces a shippable result.

---

## Technical Standards: Definition of Done (DoD)

Each topic must meet the following criteria before being marked as complete:
1.  **Content**: All 12 sections followed as per the refined 12-section MDX schema (including Level 1/2 examples, FAQ accordion, and Interview Notes).
2.  **Visualization**: **React Flow** must be used for ALL architecture diagrams, simulations, and interactive visualizations to ensure a unified and consistent design system.
3.  **Code Reusability**: Maximize use of shared components (e.g., `ServiceNode`, `LaneNode`, `AnimatedEdge`) and global CSS utilities. Do not duplicate logic or styles across topics.
4.  **Pedagogical Standards (Beginner-Friendly)**:
    - **Tone**: Simplified, analogy-driven explanations.
    - **Visuals**: Self-explanatory React Flow diagrams.
    - **Section Limits**: EXACTLY 4-6 points for Tradeoffs, Q&A, and Summaries.
5.  **Testing Policy**:
    - **NO Automated Tests**: Do not write Unit Tests (Vitest) or E2E Tests (Playwright) unless explicitly requested by the USER.
    - **NO Browser Research**: Do not use browser-based research or manual testing tools (Antigravity browser control) unless explicitly requested by the USER.
    - **Visual Verification**: All manual verification must be done via code inspection and provided browser screenshots/recordings only when asked.

---

## Phase 0: Foundation ✅ (Completed)

**Goal:** Project scaffold, design system, and content architecture.

| # | Task | Status |
|---|---|---|
| 0.1 | Initialize Vite + React + TypeScript | ✅ |
| 0.2 | Install dependencies (Router, Zustand, Framer Motion, React Flow, Lucide) | ✅ |
| 0.3 | Configure Tailwind CSS + shadcn/ui | ✅ |
| 0.4 | Setup directory structure | ✅ |
| 0.5 | Establish Linear-inspired dark theme in `index.css` | ✅ |
| 0.6 | Create prototype layout with animated diagram in `App.tsx` | ✅ |
| 0.7 | Define refined 12-section MDX schema + case study schema in `SD-Plan.md` | ✅ |
| 0.8 | Setup Antigravity skills | ✅ |

---

## Phase 1: Golden Path (One Complete Topic End-to-End)

**Goal:** Build the entire application stack through a single topic — **Load Balancers** — so every layer is proven before scaling content.

**Outcome:** One fully working, visually polished page that serves as the reference implementation for all other topics.

### 1A. Types & Data Layer

| # | Task | Files |
|---|---|---|
| 1A.1 | Create TypeScript types | `src/types/topic.ts`, `src/types/diagram.ts`, `src/types/simulation.ts` |
| 1A.2 | Create topic tree data | `src/data/topicTree.ts` |
| 1A.3 | Create Load Balancer diagram config | `src/data/diagramConfigs.ts` |

### 1B. Application Shell & Routing

| # | Task | Files |
|---|---|---|
| 1B.1 | Build `Layout.tsx` (root shell with sidebar + content) | `src/components/layout/Layout.tsx` |
| 1B.2 | Build `Topbar.tsx` (glass header + ⌘K stub) | `src/components/layout/Topbar.tsx` |
| 1B.3 | Build `Sidebar.tsx` (dynamic nav from topicTree) | `src/components/layout/Sidebar.tsx` |
| 1B.4 | Build `Breadcrumb.tsx` | `src/components/layout/Breadcrumb.tsx` |
| 1B.5 | Create `Home.tsx`, `TopicPage.tsx`, `NotFound.tsx` stubs | `src/pages/*.tsx` |
| 1B.6 | Setup React Router in `App.tsx` | `src/App.tsx` |

### 1C. MDX Content Engine

| # | Task | Files |
|---|---|---|
| 1C.1 | Install + configure MDX plugin | `vite.config.ts`, `package.json` |
| 1C.2 | Build `MDXRenderer.tsx` | `src/components/content/MDXRenderer.tsx` |
| 1C.3 | Build `TopicHeader.tsx` | `src/components/content/TopicHeader.tsx` |
| 1C.4 | Build `TradeoffCard.tsx` | `src/components/content/TradeoffCard.tsx` |
| 1C.5 | Build `InterviewAnswer.tsx` | `src/components/content/InterviewAnswer.tsx` |
| 1C.6 | Build `KeyTakeaways.tsx` | `src/components/content/KeyTakeaways.tsx` |
| 1C.7 | Build `RelatedTopics.tsx` | `src/components/content/RelatedTopics.tsx` |
| 1C.8 | Build `CodeBlock.tsx` + `Callout.tsx` | `src/components/content/CodeBlock.tsx`, `Callout.tsx` |

### 1D. Visualization (React Flow for Load Balancers)

| # | Task | Files |
|---|---|---|
| 1D.1 | Build `ArchitectureCanvas.tsx` (React Flow wrapper) | `src/components/diagram/ArchitectureCanvas.tsx` |
| 1D.2 | Build core nodes: `ServiceNode`, `ClientNode`, `LoadBalancerNode`, `DatabaseNode` | `src/components/diagram/nodes/*.tsx` |
| 1D.3 | Build core edges: `AnimatedEdge`, `HttpEdge` | `src/components/diagram/edges/*.tsx` |
| 1D.4 | Style with Linear aesthetic | `src/styles/diagram.css` |
| 1D.5 | Build `DiagramControls.tsx` | `src/components/diagram/DiagramControls.tsx` |

### 1E. Simulation (Load Balancer Sim)

| # | Task | Files |
|---|---|---|
| 1E.1 | Create Zustand simulation store | `src/hooks/useSimulation.ts` |
| 1E.2 | Build `SimulationControls.tsx` | `src/components/simulation/SimulationControls.tsx` |
| 1E.3 | Build `LoadBalancerSim.tsx` (Round Robin, Least Conn, IP Hash) | `src/components/simulation/LoadBalancerSim.tsx` |

### 1F. First Complete Topic

| # | Task | Files |
|---|---|---|
| 1F.1 | Author `load-balancers.mdx` (all 12 sections) | `src/content/fundamentals/load-balancers.mdx` |
| 1F.2 | Wire `TopicPage.tsx` to load MDX by route slug | `src/pages/TopicPage.tsx` |

### Phase 1 Verification ✅

- [x] `npm run build` — zero errors
- [x] Navigate to `/fundamentals/load-balancers` → full 12-section page renders
- [x] Sidebar shows all categories, Load Balancers is highlighted as active
- [x] Breadcrumb shows `Fundamentals > Load Balancers`
- [x] Diagram renders with custom nodes, animated edges, faint grid
- [x] Simulation plays: requests animate to servers per selected algorithm
- [x] `TradeoffCard`, `InterviewAnswer`, `KeyTakeaways`, `RelatedTopics` all render
- [x] Topbar glass effect matches Linear aesthetic
- [x] Mobile responsive: sidebar collapses

> **Milestone: After Phase 1, you have a fully shippable single-page product.** This is your golden reference.

---

## Phase 2: Fundamentals Sprint ✅

**Goal:** Complete the remaining 4 Fundamentals topics using Phase 1 infrastructure.

### Execution

| # | Topic | New Infra Needed | Content File | Status |
|---|---|---|---|---|
| 2.1 | Latency vs Throughput | Pipeline bottleneck visualization | `src/content/fundamentals/latency-throughput.mdx` | ✅ |
| 2.2 | CAP Theorem | Interactive triangle (new node type?) | `src/content/fundamentals/cap-theorem.mdx` | ✅ |
| 2.3 | Consistency Models | Timeline diagram | `src/content/fundamentals/consistency-models.mdx` | ✅ |
| 2.4 | Rate Limiting | Token bucket sim (`RateLimitingSim.tsx`) | `src/content/fundamentals/rate-limiting.mdx` | ✅ |
| 2.5 | Diagram configs for all 4 | — | `src/data/diagramConfigs.ts` (update) | ✅ |
| 2.6 | **Testing Suite** | — | — | (Removed per User Request) |

### Verification

- [x] All 5 Fundamentals topics accessible and rendering correctly
- [x] Each topic has a working diagram (CAP/Consistency now have dedicated configs)
- [x] Rate Limiting simulation works (token bucket fill/drain)
- [x] Pedagogical Alignment: All sections have 4-6 points (Q&A/Tradeoffs)
- [x] No regressions on Load Balancers page

---

## Phase 3: Scaling + Databases Sprint

**Goal:** Complete 9 topics across Scaling and Databases categories.

### Execution

| # | Topic | New Infra Needed | Content File | Status |
|---|---|---|---|---|
| 3.1 | Horizontal vs Vertical | Scaling comparison viz | `src/content/scaling/horizontal-vs-vertical.mdx` | ✅ |
| 3.2 | Consistent Hashing | Interactive Hash Ring | `src/content/scaling/consistent-hashing.mdx` | ✅ |
| 3.3 | Database Sharding | Hash ring viz, `QueueNode` | `src/content/scaling/database-sharding.mdx` | [ ] |
| 3.4 | Database Replication | `ReplicationEdge`, leader-follower anim | `src/content/scaling/database-replication.mdx` | [ ] |
| 3.5 | Caching Strategies | `CacheNode`, `CacheFlowSim.tsx` | `src/content/scaling/caching-strategies.mdx` | [ ] |
| 3.6 | Indexing | B-tree traversal viz | `src/content/databases/indexing.mdx` | [ ] |
| 3.7 | Partitioning | Partition routing viz | `src/content/databases/partitioning.mdx` | [ ] |
| 3.8 | SQL vs NoSQL | Comparison matrix component | `src/content/databases/sql-vs-nosql.mdx` | [ ] |
| 3.9 | ACID vs BASE | — | `src/content/databases/acid-base.mdx` | [ ] |

### Planned New Components

| Component | Purpose |
|---|---|
| `CacheNode.tsx` | Cache layer custom node |
| `CacheFlowSim.tsx` | Cache hit/miss simulation |
| `ReplicationEdge.tsx` | DB replication edge type |

### Verification

- [ ] All 9 topics render with correct content
- [ ] Cache sim: hit (green flash) / miss (red → DB query → cache populate)
- [ ] Sharding diagram shows hash ring with key distribution
- [ ] Replication diagram shows leader-follower with animated sync
- [ ] Cross-category Related Topics links work

---

## Phase 4: Messaging + Patterns Sprint

**Goal:** Complete 9 topics across Messaging and Distributed Patterns.

### Execution

| # | Topic | New Infra Needed | Content File |
|---|---|---|---|
| 4.1 | Kafka | `KafkaFlowSim.tsx`, partition viz | `src/content/messaging/kafka.mdx` |
| 4.2 | RabbitMQ | Exchange-queue routing viz | `src/content/messaging/rabbitmq.mdx` |
| 4.3 | Event-Driven Architecture | Multi-service event flow | `src/content/messaging/event-driven-architecture.mdx` |
| 4.4 | Exactly-Once Processing | Dedup visualization | `src/content/messaging/exactly-once-processing.mdx` |
| 4.5 | Circuit Breaker | `CircuitBreakerSim.tsx` | `src/content/patterns/circuit-breaker.mdx` |
| 4.6 | Retry Pattern | Backoff timeline viz | `src/content/patterns/retry-pattern.mdx` |
| 4.7 | Saga Pattern | `SagaPatternSim.tsx` | `src/content/patterns/saga-pattern.mdx` |
| 4.8 | API Gateway | Gateway routing viz | `src/content/patterns/api-gateway.mdx` |
| 4.9 | Service Discovery | Registry heartbeat viz | `src/content/patterns/service-discovery.mdx` |

### Planned New Components

| Component | Purpose |
|---|---|
| `QueueNode.tsx` | Message queue custom node |
| `EventEdge.tsx` | Async event/message edge |
| `KafkaFlowSim.tsx` | Producer → broker → consumer sim |
| `CircuitBreakerSim.tsx` | State machine sim |
| `SagaPatternSim.tsx` | Multi-step + rollback sim |

### Verification

- [ ] All 9 topics render correctly
- [ ] Kafka sim: messages flow to partitions, consumers rebalance
- [ ] Circuit Breaker sim: closed → open → half-open transitions
- [ ] Saga sim: forward flow + failure injection + compensation rollback
- [ ] All diagrams match Linear line-art aesthetic
- [ ] 23/23 conceptual topics now complete

---

## Phase 5: Case Studies Sprint

**Goal:** Complete 18 case studies (4 Easy · 5 Medium · 9 Hard) using the enhanced 18-section case study MDX template.

### Execution

#### Shared Phase 5 Prerequisites

| # | Task | Files |
|---|---|---|
| 5.0.1 | Extend `ArchitectureCanvas` with hover explanations, click inspection, scenario toggles, replay/reset, and visible legend support | `src/components/diagram/ArchitectureCanvas.tsx`, diagram UI components |
| 5.0.2 | Register case-study React Flow primitives: `CacheNode` and `QueueNode` | `src/components/diagram/nodes/*.tsx`, `ArchitectureCanvas.tsx` |
| 5.0.3 | Build `CapacityEstimationCard.tsx` for case-study capacity sections | `src/components/ui/CapacityEstimationCard.tsx` |
| 5.0.4 | Standardize case-study visual grammar: edge labels, badge states, lane colors, and scenario vocabulary | `src/styles/diagram.css`, simulation/content conventions |
| 5.0.5 | Add Easy case-study diagram config IDs | `src/data/diagramConfigs.ts` |
| 5.0.6 | Add Medium case-study diagram config IDs | `src/data/diagramConfigs.ts` |
| 5.0.7 | Add Hard Wave 1 diagram config IDs | `src/data/diagramConfigs.ts` |
| 5.0.8 | Scope shared simulation primitives before reuse claims (`PresenceDeliverySim`, `FeedFanoutSim`, `TranscodingPipelineSim`) | `src/components/simulation/*.tsx`, sprint plans |
| 5.0.9 | Approve pilot visual QA gates before parallel case-study implementation begins | `DOCS/Phase-5-*.md`, `DOCS/Execution-Plan.md` |

#### Easy (⭐ Foundational)

| # | Topic | Unique Concepts | Content File |
|---|---|---|---|
| 5.1 | URL Shortener | Hashing, base62, redirect, analytics | `src/content/case-studies/url-shortener.mdx` |
| 5.2 | Rate Limiter Service | Token bucket, sliding window, Redis | `src/content/case-studies/rate-limiter.mdx` |
| 5.3 | Distributed Cache | Eviction policies, consistent hashing, cache coherence | `src/content/case-studies/distributed-cache.mdx` |
| 5.4 | Logging / Metrics Pipeline | Kafka ingestion, aggregation, time-series DB | `src/content/case-studies/logging-metrics-pipeline.mdx` |

#### Medium (⭐⭐ Multi-Component)

| # | Topic | Unique Concepts | Content File |
|---|---|---|---|
| 5.5 | Twitter/X (News Feed) | Fan-out, timelines, celebrity problem, caching | `src/content/case-studies/twitter-news-feed.mdx` |
| 5.6 | Notification System | Multi-channel (push/SMS/email), priority queues | `src/content/case-studies/notification-system.mdx` |
| 5.7 | Instagram | Image processing, CDN, feed ranking, stories | `src/content/case-studies/instagram.mdx` |
| 5.8 | Chat System (Slack/Discord) | WebSocket, channels, presence, message persistence | `src/content/case-studies/chat-system.mdx` |
| 5.9 | Web Crawler | URL frontier, BFS crawling, politeness, dedup | `src/content/case-studies/web-crawler.mdx` |

#### Hard (⭐⭐⭐ Full-Scale Distributed) — 3 Waves

| # | Topic | Unique Concepts | Content File | Wave |
|---|---|---|---|---|
| 5.10 | WhatsApp | E2E encryption, delivery guarantees, group chat | `src/content/case-studies/whatsapp.mdx` | 1 |
| 5.11 | Uber | Geospatial (QuadTree), matching, surge pricing | `src/content/case-studies/uber.mdx` | 1 |
| 5.12 | YouTube | User-generated content, transcoding, live streaming | `src/content/case-studies/youtube.mdx` | 1 |
| 5.13 | Netflix | Adaptive bitrate, CDN, recommendation engine | `src/content/case-studies/netflix.mdx` | 2 |
| 5.14 | Zoom / Google Meet | WebRTC, SFU/MCU, recording, screen sharing | `src/content/case-studies/zoom-google-meet.mdx` | 2 |
| 5.15 | Google Docs | Real-time collaboration, OT/CRDT, cursor sync | `src/content/case-studies/google-docs.mdx` | 2 |
| 5.16 | Google Drive / Dropbox | File sync, chunking, conflict resolution, versioning | `src/content/case-studies/google-drive.mdx` | 3 |
| 5.17 | Search Engine | Web indexing, ranking (PageRank), query processing | `src/content/case-studies/search-engine.mdx` | 3 |
| 5.18 | Amazon (E-Commerce) | Full-stack: search, cart, payments, inventory — Capstone | `src/content/case-studies/amazon.mdx` | 3 |

### Planned New Components

| Component | Purpose |
|---|---|
| `CapacityEstimationCard.tsx` | Visual capacity calculation (reads, writes, storage, bandwidth) |
| Enhanced Case Study Template | 18-section template with layered content (Beginner → Advanced) |
| `FeedFanoutSim` | Dual-lane fanout-on-write vs fanout-on-read comparison |
| `PresenceDeliverySim` | Presence dots + delivery/read receipts + channel fallback |
| `CrawlerFrontierSim` | URL frontier with politeness timers + Bloom filter dedup |
| `E2EEncryptionSim` | Signal protocol key exchange + encrypted delivery flow |
| `GeoMatchingSim` | Geospatial driver-rider matching with map overlays and surge zones |
| `TranscodingPipelineSim` | Media upload → transcode → CDN delivery with adaptive bitrate states |

### Verification

- [ ] Shared Phase 5 prerequisites are complete before topic implementation begins
- [ ] `ArchitectureCanvas` supports hover, click inspection, scenario toggles, replay/reset, and visible legends for case-study diagrams
- [ ] `CacheNode`, `QueueNode`, and `CapacityEstimationCard` exist and are wired into the case-study stack
- [ ] Active sprint diagram config IDs are defined before MDX implementation starts
- [ ] Shared simulations are explicitly scoped by topic mode or wrapper before reuse is claimed
- [ ] Case-study visual QA rubric passes: main path clear in 10 seconds, interactions meaningful, fallback path distinct, legend self-explanatory, presentation feels product-grade
- [ ] All 18 case studies render using the enhanced 18-section case study template
- [ ] Each has: Introduction, Why This Matters, Requirements, Capacity, API, Data Model, Architecture
- [ ] Each has: Read/Write Paths, Deep Dives, Implementation Patterns, Scaling Strategy
- [ ] Each has: Failure Scenarios, System Flows (interactive), Tradeoffs, FAQ, Interview Notes, Takeaways, Related
- [ ] Architecture diagrams are interactive React Flow with sublabeled nodes and animated edges
- [ ] Difficulty progression flows naturally (Easy → Medium → Hard)
- [ ] All topics complete (Phases 1-4: 23 conceptual + Phase 5: 18 case studies = 41 total)

---

## Phase 6: UX Polish

**Goal:** Search, progress tracking, micro-animations, and responsive polish.

### Execution

| # | Task | Files |
|---|---|---|
| 6.1 | Build `CommandPalette.tsx` (⌘K search) | `src/components/ui/CommandPalette.tsx` |
| 6.2 | Implement `useSearch.ts` | `src/hooks/useSearch.ts` |
| 6.3 | Build `useProgress.ts` (localStorage) | `src/hooks/useProgress.ts` |
| 6.4 | Add progress indicators to sidebar | `Sidebar.tsx` |
| 6.5 | Build prev/next topic navigation | `src/components/layout/TopicNavigation.tsx` |
| 6.6 | Build `TableOfContents.tsx` (sticky right-side) | `src/components/layout/TableOfContents.tsx` |
| 6.7 | Add page transitions (Framer Motion) | Layout components |
| 6.8 | Mobile responsive polish | All layout components |

### Verification

- [ ] ⌘K opens palette, filters topics, Enter navigates
- [ ] Progress persists across reloads
- [ ] Prev/Next cycles through topics in order
- [ ] Table of Contents highlights active section on scroll
- [ ] Smooth page transitions
- [ ] Fully responsive on mobile (375px+)

---

## Phase 7: Interview Mode

**Goal:** Dedicated interview practice with guided architecture building.

### Execution

| # | Task | Files |
|---|---|---|
| 7.1 | Build `InterviewMode.tsx` layout | `src/pages/InterviewPage.tsx` |
| 7.2 | Build `RequirementsPanel.tsx` | `src/components/interview/RequirementsPanel.tsx` |
| 7.3 | Build `ArchitectureBuilder.tsx` | `src/components/interview/ArchitectureBuilder.tsx` |
| 7.4 | Build `AnswerTemplate.tsx` (copy-to-clipboard) | `src/components/interview/AnswerTemplate.tsx` |
| 7.5 | Wire interview routes | `App.tsx` |

### Verification

- [ ] Interview mode accessible from sidebar + topic pages
- [ ] Step-by-step guided flow works
- [ ] Copy-to-clipboard on answer template
- [ ] All 6 case studies have interview mode

---

## Phase 8: Testing & Ship

**Goal:** Launch readiness, performance, and production deployment (manual verification by default).

### Execution

- [ ] **Phase 8: Polish & Launch Readiness**
    - [ ] Complete manual verification audit across all completed phases (code inspection + build checks).
    - [ ] Optional automated tests (Vitest/Playwright) only if explicitly requested by the user.
    - [ ] Comprehensive A11y & Performance audit.

### Verification (Manual only if asked)

- [ ] All topics render correctly via code inspection
- [ ] No automated test regressions (tests inactive per request)
- [ ] Production build completes cleanly

---

## Execution Flow

```
Phase 0  ✅ Foundation
  │
Phase 1  ✅ Golden Path (1 complete topic: Load Balancers)
  │        ALL layers proven: routing → MDX → diagram → simulation
  │        🎯 Milestone: Shippable single-page product
  │
Phase 2  ✅ Fundamentals Sprint (+4 topics = 5 total)
  │        🎯 Milestone: Complete "Fundamentals" category
  │
Phase 3  ▶ Scaling + Databases Sprint (+9 topics = 14 total)
  │        🎯 Milestone: MVP with 3 categories
  │
Phase 4  ▶ Messaging + Patterns Sprint (+9 topics = 23 total)
  │        🎯 Milestone: All concept topics done
  │
Phase 5  ▶ Case Studies Sprint (+18 topics = 41 total)
  │        🎯 Milestone: All content complete
  │
Phase 6  ▶ UX Polish (search, progress, animations)
  │
Phase 7  ▶ Interview Mode
  │
Phase 8  ▶ Testing & Ship
```

> **Key principle:** Each phase builds on proven infrastructure. No phase requires building everything from scratch. By the end of Phase 1, every technical question is answered.
