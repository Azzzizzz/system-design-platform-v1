# Execution Plan: System Design Learning Platform

> **Strategy: Vertical Slicing** — Build one complete topic end-to-end first, then expand by category sprints. Each phase produces a shippable result.

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
| 0.7 | Define 12-section MDX schema + case study schema in `SD-Plan.md` | ✅ |
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

### Phase 1 Verification

- [ ] `npm run build` — zero errors
- [ ] Navigate to `/fundamentals/load-balancers` → full 12-section page renders
- [ ] Sidebar shows all categories, Load Balancers is highlighted as active
- [ ] Breadcrumb shows `Fundamentals > Load Balancers`
- [ ] Diagram renders with custom nodes, animated edges, faint grid
- [ ] Simulation plays: requests animate to servers per selected algorithm
- [ ] `TradeoffCard`, `InterviewAnswer`, `KeyTakeaways`, `RelatedTopics` all render
- [ ] Topbar glass effect matches Linear aesthetic
- [ ] Mobile responsive: sidebar collapses

> **Milestone: After Phase 1, you have a fully shippable single-page product.** This is your golden reference.

---

## Phase 2: Fundamentals Sprint

**Goal:** Complete the remaining 4 Fundamentals topics using Phase 1 infrastructure.

### Execution

| # | Topic | New Infra Needed | Content File |
|---|---|---|---|
| 2.1 | Latency vs Throughput | Pipeline bottleneck visualization | `src/content/fundamentals/latency-throughput.mdx` |
| 2.2 | CAP Theorem | Interactive triangle (new node type?) | `src/content/fundamentals/cap-theorem.mdx` |
| 2.3 | Consistency Models | Timeline diagram | `src/content/fundamentals/consistency-models.mdx` |
| 2.4 | Rate Limiting | Token bucket sim (`RateLimitingSim.tsx`) | `src/content/fundamentals/rate-limiting.mdx` |
| 2.5 | Diagram configs for all 4 | — | `src/data/diagramConfigs.ts` (update) |

### Verification

- [ ] All 5 Fundamentals topics accessible and rendering correctly
- [ ] Each topic has a working diagram
- [ ] Rate Limiting simulation works (token bucket fill/drain)
- [ ] Related Topics links between Fundamentals topics work
- [ ] No regressions on Load Balancers page

---

## Phase 3: Scaling + Databases Sprint

**Goal:** Complete 8 topics across Scaling and Databases categories.

### Execution

| # | Topic | New Infra Needed | Content File |
|---|---|---|---|
| 3.1 | Horizontal vs Vertical | Scaling comparison viz | `src/content/scaling/horizontal-vs-vertical.mdx` |
| 3.2 | Database Sharding | Hash ring viz, `QueueNode` | `src/content/scaling/database-sharding.mdx` |
| 3.3 | Database Replication | `ReplicationEdge`, leader-follower anim | `src/content/scaling/database-replication.mdx` |
| 3.4 | Caching Strategies | `CacheNode`, `CacheFlowSim.tsx` | `src/content/scaling/caching-strategies.mdx` |
| 3.5 | Indexing | B-tree traversal viz | `src/content/databases/indexing.mdx` |
| 3.6 | Partitioning | Partition routing viz | `src/content/databases/partitioning.mdx` |
| 3.7 | SQL vs NoSQL | Comparison matrix component | `src/content/databases/sql-vs-nosql.mdx` |
| 3.8 | ACID vs BASE | — | `src/content/databases/acid-base.mdx` |

### New Components Built

| Component | Purpose |
|---|---|
| `CacheNode.tsx` | Cache layer custom node |
| `CacheFlowSim.tsx` | Cache hit/miss simulation |
| `ReplicationEdge.tsx` | DB replication edge type |

### Verification

- [ ] All 8 topics render with correct content
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

### New Components Built

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
- [ ] 22/28 topics now complete

---

## Phase 5: Case Studies Sprint

**Goal:** Complete all 6 case studies using the separate case study MDX template.

### Execution

| # | Topic | Content File |
|---|---|---|
| 5.1 | URL Shortener | `src/content/case-studies/url-shortener.mdx` |
| 5.2 | WhatsApp | `src/content/case-studies/whatsapp.mdx` |
| 5.3 | Uber | `src/content/case-studies/uber.mdx` |
| 5.4 | Netflix | `src/content/case-studies/netflix.mdx` |
| 5.5 | YouTube | `src/content/case-studies/youtube.mdx` |
| 5.6 | Amazon | `src/content/case-studies/amazon.mdx` |

### Verification

- [ ] All 6 case studies render using the case study template
- [ ] Each has: Requirements, Capacity Estimation, API Design, Data Model, Architecture Diagram
- [ ] Architecture diagrams are interactive and match Linear aesthetic
- [ ] All 28/28 topics complete

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

**Goal:** E2E tests, performance, and production deployment.

### Execution

| # | Task | Files |
|---|---|---|
| 8.1 | Setup Cypress | `cypress.config.ts` |
| 8.2 | E2E: navigation flows | `cypress/e2e/navigation.cy.ts` |
| 8.3 | E2E: MDX rendering | `cypress/e2e/content.cy.ts` |
| 8.4 | E2E: simulations | `cypress/e2e/simulations.cy.ts` |
| 8.5 | Lighthouse audit (Perf > 90, A11y > 95) | — |
| 8.6 | Code splitting + lazy loading | Router + React.lazy |
| 8.7 | SEO: meta tags, OG images | `index.html`, `public/` |
| 8.8 | Production build + deploy | `npm run build` |

### Verification

- [ ] All Cypress tests pass
- [ ] Lighthouse: Performance > 90, Accessibility > 95
- [ ] Bundle size < 500KB gzipped (initial load)
- [ ] Production build completes cleanly

---

## Execution Flow

```
Phase 0  ✅ Foundation
  │
Phase 1  ▶ Golden Path (1 complete topic: Load Balancers)
  │        ALL layers proven: routing → MDX → diagram → simulation
  │        🎯 Milestone: Shippable single-page product
  │
Phase 2  ▶ Fundamentals Sprint (+4 topics = 5 total)
  │        🎯 Milestone: Complete "Fundamentals" category
  │
Phase 3  ▶ Scaling + Databases Sprint (+8 topics = 13 total)
  │        🎯 Milestone: MVP with 3 categories
  │
Phase 4  ▶ Messaging + Patterns Sprint (+9 topics = 22 total)
  │        🎯 Milestone: All concept topics done
  │
Phase 5  ▶ Case Studies Sprint (+6 topics = 28 total)
  │        🎯 Milestone: All content complete
  │
Phase 6  ▶ UX Polish (search, progress, animations)
  │
Phase 7  ▶ Interview Mode
  │
Phase 8  ▶ Testing & Ship
```

> **Key principle:** Each phase builds on proven infrastructure. No phase requires building everything from scratch. By the end of Phase 1, every technical question is answered.
