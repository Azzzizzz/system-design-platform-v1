# SD-Plan: Interactive System Design Learning Platform

> **A visual, interactive knowledge system for mastering distributed systems and acing system design interviews.**

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [UI Layout & Design System](#2-ui-layout--design-system)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Content Architecture](#5-content-architecture)
6. [Visualization Engine](#6-visualization-engine)
7. [Interactive Simulations](#7-interactive-simulations)
8. [Topic Roadmap & Learning Path](#8-topic-roadmap--learning-path)
9. [Interview Mode](#9-interview-mode)
10. [Micro Animations & Motion](#10-micro-animations--motion)
11. [MVP Scope](#11-mvp-scope)
12. [Advanced Features (Post-MVP)](#12-advanced-features-post-mvp)
13. [Development Phases](#13-development-phases)
14. [Component Specification](#14-component-specification)
15. [Data Flow & State Management](#15-data-flow--state-management)
16. [Performance Considerations](#16-performance-considerations)

---

## 1. Product Vision

### Goal

Build a **Visual System Design Learning Hub** — a static, docs-style platform that transforms system design concepts into interactive, animated, visual experiences.

### Why This Exists

| Problem                                    | Solution                                    |
| ------------------------------------------ | ------------------------------------------- |
| System design is abstract and text-heavy   | Interactive diagrams with live simulations   |
| Hard to remember architecture patterns     | Visual flow animations reinforce memory      |
| Interview prep lacks structured visuals    | Dedicated Interview Mode with templates      |
| No single tool combines learn + practice   | Unified platform: learn → visualize → prep  |

### Core Learning Flow

```
Topic → Explanation → Visualization → Animation → Flow Simulation → Interview Notes
```

**Example — Load Balancer:**

```
1. What is a load balancer?         → Rich MDX content
2. How does it work?                → Interactive React Flow diagram
3. See it in action                 → Animated request routing simulation
4. What are the tradeoffs?          → Comparison cards with highlights
5. How to explain in an interview?  → Structured answer template
```

---

## 2. UI Layout & Design System

### 2.1 Layout Structure

Inspired by **Notion + Linear + Vercel Docs**.

```
┌────────────────────────────────────────────────────────────────────┐
│  Logo    Search (⌘K)     Theme Toggle     GitHub                  │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                     │
│  SIDEBAR     │  MAIN CONTENT AREA                                  │
│              │                                                     │
│  🏠 Home     │  ┌─────────────────────────────────────────────┐   │
│              │  │  Breadcrumb: Fundamentals > CAP Theorem      │   │
│  📚 Topics   │  ├─────────────────────────────────────────────┤   │
│  ├ Fundament │  │                                              │   │
│  ├ Scaling   │  │  Title + Metadata (difficulty, category)    │   │
│  ├ Databases │  │                                              │   │
│  ├ Messaging │  │  Rich MDX Explanation                       │   │
│  ├ Patterns  │  │                                              │   │
│  └ Case Stu  │  │  ┌────────────────────────────────────┐    │   │
│              │  │  │  Interactive React Flow Diagram     │    │   │
│  🎯 Interview│  │  │  (zoomable, pannable, animated)     │    │   │
│              │  │  └────────────────────────────────────┘    │   │
│  🔖 Bookmarks│  │                                              │   │
│              │  │  Simulation Controls                        │   │
│              │  │  [▶ Play] [⏸ Pause] [🔄 Reset]             │   │
│              │  │                                              │   │
│              │  │  Tradeoffs & Interview Notes                │   │
│              │  └─────────────────────────────────────────────┘   │
│              │                                                     │
│              │  ← Prev Topic          Next Topic →                │
└──────────────┴─────────────────────────────────────────────────────┘
```

### 2.2 Color Palette

```
┌────────────────────────────────────────────────┐
│  Token              │  Value     │  Usage       │
├────────────────────────────────────────────────┤
│  --bg-primary       │  #0a0a0f  │  Page bg     │
│  --bg-secondary     │  #111827  │  Cards/panels│
│  --bg-elevated      │  #1e293b  │  Hover/active│
│  --accent-primary   │  #6366f1  │  Links, CTA  │
│  --accent-success   │  #22c55e  │  Success/flow│
│  --accent-warning   │  #f59e0b  │  Warnings    │
│  --accent-danger    │  #ef4444  │  Errors      │
│  --text-primary     │  #f1f5f9  │  Headings    │
│  --text-secondary   │  #94a3b8  │  Body text   │
│  --text-muted       │  #64748b  │  Metadata    │
│  --border           │  #1e293b  │  Dividers    │
│  --border-active    │  #6366f1  │  Focus rings │
└────────────────────────────────────────────────┘
```

### 2.3 Typography

| Element    | Font          | Weight | Size    |
| ---------- | ------------- | ------ | ------- |
| Headings   | **Inter**     | 700    | 2rem+   |
| Body       | **Inter**     | 400    | 1rem    |
| Code       | **JetBrains Mono** | 400 | 0.875rem |
| UI Labels  | **Inter**     | 500    | 0.875rem |

### 2.4 Design Principles

| Principle            | Implementation                                      |
| -------------------- | --------------------------------------------------- |
| **Clean whitespace** | `p-8` sections, `gap-6` between cards               |
| **Minimal borders**  | 1px `border-[#1e293b]`, no heavy outlines           |
| **Soft shadows**     | `shadow-lg shadow-black/20` on elevated elements    |
| **Subtle gradients** | Background mesh gradients, card shimmer on hover     |
| **Glass morphism**   | `backdrop-blur-xl bg-white/5` on floating panels     |
| **Dark-first**       | Primary dark theme, light mode as secondary          |

---

## 3. Tech Stack

### Core

| Layer          | Technology                | Rationale                              |
| -------------- | ------------------------- | -------------------------------------- |
| **Framework**  | React 18+                 | Component model, ecosystem, hooks      |
| **Bundler**    | Vite                      | Fast HMR, optimized builds             |
| **Language**   | TypeScript                | Type safety, better DX                 |
| **Routing**    | React Router v6           | Client-side navigation                 |
| **State Mgmt** | Zustand                   | High-performance simulation state      |

### UI & Styling

| Layer          | Technology                | Rationale                              |
| -------------- | ------------------------- | -------------------------------------- |
| **CSS**        | TailwindCSS v3            | Utility-first, rapid prototyping       |
| **Components** | shadcn/ui                 | Accessible, customizable primitives    |
| **Primitives** | Radix UI                  | Unstyled accessible components         |
| **Icons**      | Lucide React              | Clean, consistent icon set             |

### Visualization & Animation

| Layer          | Technology                | Rationale                              |
| -------------- | ------------------------- | -------------------------------------- |
| **Diagrams**   | React Flow                | Interactive node-edge graphs           |
| **Fallback**   | Mermaid.js (optional)     | Quick static diagrams in MDX           |
| **Charts**     | D3.js (later)             | Complex data visualizations            |
| **Animation**  | Framer Motion             | Declarative animations, gestures       |
| **Particles**  | Custom Canvas / CSS       | Edge particle animations               |

### Content

| Layer          | Technology                | Rationale                              |
| -------------- | ------------------------- | -------------------------------------- |
| **Authoring**  | MDX                       | Markdown + JSX components              |
| **Processing** | @mdx-js/react             | MDX compilation and rendering          |
| **Syntax**     | Shiki / Prism             | Code block syntax highlighting         |
| **Frontmatter**| gray-matter               | YAML metadata parsing                  |

---

## 4. Project Structure

```
system-design-platform/
│
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx                 # Root layout with sidebar + content
│   │   │   ├── Sidebar.tsx                # Collapsible topic navigation tree
│   │   │   ├── Topbar.tsx                 # Search, theme toggle, navigation
│   │   │   ├── Breadcrumb.tsx             # Topic path breadcrumb
│   │   │   ├── TableOfContents.tsx        # Right-side section navigation
│   │   │   └── Footer.tsx                 # Navigation links, credits
│   │   │
│   │   ├── diagram/
│   │   │   ├── ArchitectureCanvas.tsx     # React Flow wrapper with controls
│   │   │   ├── nodes/
│   │   │   │   ├── ServiceNode.tsx        # Microservice box node
│   │   │   │   ├── DatabaseNode.tsx       # Database cylinder node
│   │   │   │   ├── QueueNode.tsx          # Message queue node
│   │   │   │   ├── CacheNode.tsx          # Cache layer node (Redis etc.)
│   │   │   │   ├── ClientNode.tsx         # User / client node
│   │   │   │   ├── LoadBalancerNode.tsx   # LB distribution node
│   │   │   │   └── ExternalServiceNode.tsx# Third-party service node
│   │   │   ├── edges/
│   │   │   │   ├── AnimatedEdge.tsx       # Edge with particle animation
│   │   │   │   ├── HttpEdge.tsx           # HTTP request edge
│   │   │   │   ├── EventEdge.tsx          # Async event/message edge
│   │   │   │   ├── ReplicationEdge.tsx    # DB replication arrow
│   │   │   │   └── CacheEdge.tsx          # Cache read/write edge
│   │   │   └── DiagramControls.tsx        # Zoom, fit, minimap controls
│   │   │
│   │   ├── simulation/
│   │   │   ├── SimulationProvider.tsx      # Context for simulation state
│   │   │   ├── SimulationControls.tsx      # Play / pause / reset / speed
│   │   │   ├── LoadBalancerSim.tsx         # LB request distribution sim
│   │   │   ├── KafkaFlowSim.tsx            # Producer → broker → consumer
│   │   │   ├── CacheFlowSim.tsx            # Cache hit/miss visualization
│   │   │   ├── CircuitBreakerSim.tsx       # Circuit states animation
│   │   │   └── SagaPatternSim.tsx          # Saga rollback flow
│   │   │
│   │   ├── content/
│   │   │   ├── MDXRenderer.tsx            # MDX content renderer
│   │   │   ├── TopicHeader.tsx            # Title, category, difficulty badge
│   │   │   ├── TradeoffCard.tsx           # Pro/con comparison cards
│   │   │   ├── InterviewAnswer.tsx        # Structured interview template
│   │   │   ├── CodeBlock.tsx              # Syntax highlighted code block
│   │   │   └── Callout.tsx                # Info/warning/tip callouts
│   │   │
│   │   ├── interview/
│   │   │   ├── InterviewMode.tsx          # Full interview practice layout
│   │   │   ├── RequirementsPanel.tsx      # Functional/non-functional reqs
│   │   │   ├── ArchitectureBuilder.tsx    # Step-by-step diagram building
│   │   │   └── AnswerTemplate.tsx         # Copy-ready answer structure
│   │   │
│   │   └── ui/
│   │       ├── CommandPalette.tsx         # ⌘K search interface
│   │       ├── ThemeToggle.tsx            # Dark/light mode switch
│   │       ├── Badge.tsx                  # Difficulty / category tags
│   │       ├── Tabs.tsx                   # Content section tabs
│   │       └── Tooltip.tsx               # Hover info tooltips
│   │
│   ├── pages/
│   │   ├── Home.tsx                       # Landing / dashboard page
│   │   ├── TopicPage.tsx                  # Individual topic renderer
│   │   ├── CaseStudyPage.tsx              # Case study dedicated layout
│   │   ├── InterviewPage.tsx              # Interview mode page
│   │   └── NotFound.tsx                   # 404 page
│   │
│   ├── content/
│   │   ├── fundamentals/
│   │   │   ├── cap-theorem.mdx
│   │   │   ├── latency-throughput.mdx
│   │   │   ├── consistency-models.mdx
│   │   │   ├── load-balancers.mdx
│   │   │   └── rate-limiting.mdx
│   │   │
│   │   ├── scaling/
│   │   │   ├── horizontal-vs-vertical.mdx
│   │   │   ├── database-sharding.mdx
│   │   │   ├── database-replication.mdx
│   │   │   └── caching-strategies.mdx
│   │   │
│   │   ├── databases/
│   │   │   ├── indexing.mdx
│   │   │   ├── partitioning.mdx
│   │   │   ├── sql-vs-nosql.mdx
│   │   │   └── acid-base.mdx
│   │   │
│   │   ├── messaging/
│   │   │   ├── kafka.mdx
│   │   │   ├── rabbitmq.mdx
│   │   │   ├── event-driven-architecture.mdx
│   │   │   └── exactly-once-processing.mdx
│   │   │
│   │   ├── patterns/
│   │   │   ├── circuit-breaker.mdx
│   │   │   ├── retry-pattern.mdx
│   │   │   ├── saga-pattern.mdx
│   │   │   ├── api-gateway.mdx
│   │   │   └── service-discovery.mdx
│   │   │
│   │   └── case-studies/
│   │       ├── url-shortener.mdx
│   │       ├── whatsapp.mdx
│   │       ├── uber.mdx
│   │       ├── netflix.mdx
│   │       ├── youtube.mdx
│   │       └── amazon.mdx
│   │
│   ├── data/
│   │   ├── topicTree.ts                   # Sidebar navigation structure
│   │   ├── diagramConfigs.ts              # React Flow node/edge configs
│   │   └── interviewTemplates.ts          # Answer structure templates
│   │
│   ├── hooks/
│   │   ├── useSimulation.ts               # Simulation play/pause/state
│   │   ├── useTheme.ts                    # Theme management
│   │   ├── useSearch.ts                   # ⌘K search logic
│   │   ├── useTopicNavigation.ts          # Prev/next topic navigation
│   │   ├── useProgress.ts                 # Local progress tracking
│   │   └── useDiagramExport.ts            # Export React Flow to PNG/PDF
│   │
│   ├── lib/
│   │   ├── mdx.ts                         # MDX compilation utilities
│   │   ├── diagram.ts                     # Diagram layout helpers (dagre)
│   │   └── animation.ts                   # Shared animation variants
│   │
│   ├── styles/
│   │   ├── globals.css                    # Tailwind directives + CSS vars
│   │   ├── diagram.css                    # React Flow custom styles
│   │   └── mdx.css                        # MDX prose styling overrides
│   │
│   ├── types/
│   │   ├── topic.ts                       # Topic, Category types
│   │   ├── diagram.ts                     # Node, Edge, Config types
│   │   └── simulation.ts                  # Simulation state types
│   │
│   ├── App.tsx                            # Root app with routing
│   ├── main.tsx                           # Entry point
│   └── vite-env.d.ts                      # Vite type declarations
│
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
├── cypress.config.ts                      # Cypress testing configuration
└── README.md
```

---

## 5. Content Architecture

### 5.1 MDX Topic Schema

Every topic follows a consistent structure via frontmatter + sections:

```mdx
---
title: "Event-Driven Architecture"
slug: "event-driven-architecture"
category: "messaging"
difficulty: "medium"          # easy | medium | hard
order: 3
tags: ["async", "kafka", "decoupling"]
relatedTopics: ["kafka", "saga-pattern"]
diagramId: "event-driven-flow"
---

## Introduction
Brief overview of the concept and why it matters.

## The Problem
What problem does this solve? Real-world pain points.

## Architecture
Detailed explanation with embedded React Flow diagram.

<ArchitectureCanvas configId="event-driven-flow" />
*Note: We rely on strictly typed `diagramConfigs.ts` via `configId` rather than passing complex JSON directly in MDX to prevent compilation issues.*

## Flow Simulation
Interactive simulation of the concept in action.

<SimulationEmbed type="kafka-flow" />

## Tradeoffs

<TradeoffCard
  pros={["Loose coupling", "Scalability", "Fault isolation"]}
  cons={["Eventual consistency", "Debugging complexity", "Message ordering"]}
/>

## Real-World Examples
- Netflix event processing pipeline
- Uber trip lifecycle events

## Interview Answer

<InterviewAnswer>
### How would you explain Event-Driven Architecture?

**1. Definition:** Asynchronous communication pattern where services emit and react to events.

**2. Components:** Event producers, event bus/broker (Kafka), event consumers.

**3. Benefits:** Decoupled services, independent scaling, fault tolerance.

**4. Tradeoffs:** Eventual consistency, complex debugging, idempotency requirements.

**5. When to use:** High-throughput async workflows, microservices communication.
</InterviewAnswer>
```

### 5.2 Topic Tree Navigation Data

```typescript
// src/data/topicTree.ts

export const topicTree: TopicCategory[] = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    icon: "BookOpen",
    topics: [
      { slug: "cap-theorem",         label: "CAP Theorem",         difficulty: "medium" },
      { slug: "latency-throughput",   label: "Latency vs Throughput", difficulty: "easy" },
      { slug: "consistency-models",   label: "Consistency Models",   difficulty: "hard" },
      { slug: "load-balancers",       label: "Load Balancers",       difficulty: "medium" },
      { slug: "rate-limiting",        label: "Rate Limiting",        difficulty: "medium" },
    ],
  },
  {
    id: "scaling",
    label: "Scaling",
    icon: "TrendingUp",
    topics: [
      { slug: "horizontal-vs-vertical", label: "Horizontal vs Vertical", difficulty: "easy" },
      { slug: "database-sharding",      label: "Database Sharding",      difficulty: "hard" },
      { slug: "database-replication",    label: "Database Replication",    difficulty: "medium" },
      { slug: "caching-strategies",      label: "Caching Strategies",      difficulty: "medium" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    icon: "Database",
    topics: [
      { slug: "indexing",       label: "Indexing",             difficulty: "medium" },
      { slug: "partitioning",   label: "Partitioning",         difficulty: "hard" },
      { slug: "sql-vs-nosql",   label: "SQL vs NoSQL",         difficulty: "easy" },
      { slug: "acid-base",      label: "ACID & BASE",          difficulty: "medium" },
    ],
  },
  {
    id: "messaging",
    label: "Messaging",
    icon: "MessageSquare",
    topics: [
      { slug: "kafka",                      label: "Apache Kafka",              difficulty: "hard" },
      { slug: "rabbitmq",                    label: "RabbitMQ",                  difficulty: "medium" },
      { slug: "event-driven-architecture",   label: "Event-Driven Architecture", difficulty: "medium" },
      { slug: "exactly-once-processing",     label: "Exactly-Once Processing",   difficulty: "hard" },
    ],
  },
  {
    id: "patterns",
    label: "Distributed Patterns",
    icon: "GitBranch",
    topics: [
      { slug: "circuit-breaker",    label: "Circuit Breaker",    difficulty: "medium" },
      { slug: "retry-pattern",      label: "Retry Pattern",      difficulty: "easy" },
      { slug: "saga-pattern",       label: "Saga Pattern",       difficulty: "hard" },
      { slug: "api-gateway",        label: "API Gateway",        difficulty: "medium" },
      { slug: "service-discovery",  label: "Service Discovery",  difficulty: "medium" },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    icon: "Briefcase",
    topics: [
      { slug: "url-shortener", label: "URL Shortener",  difficulty: "medium" },
      { slug: "whatsapp",      label: "WhatsApp",       difficulty: "hard" },
      { slug: "uber",          label: "Uber",           difficulty: "hard" },
      { slug: "netflix",       label: "Netflix",        difficulty: "hard" },
      { slug: "youtube",       label: "YouTube",        difficulty: "hard" },
      { slug: "amazon",        label: "Amazon",         difficulty: "hard" },
    ],
  },
];
```

---

## 6. Visualization Engine

### 6.1 React Flow Architecture

The visualization engine is the **heart of the platform**. Every topic includes at least one interactive diagram.

#### Core Capabilities

| Feature             | Implementation                                     |
| ------------------- | -------------------------------------------------- |
| **Drag nodes**      | React Flow default + custom drag constraints       |
| **Zoom & Pan**      | React Flow viewport controls                       |
| **Animated edges**  | Custom edge components with CSS/Framer Motion       |
| **Custom nodes**    | 7 node types with unique visual styles             |
| **Auto-layout**     | Dagre.js for automatic node positioning            |
| **Minimap**         | React Flow `<MiniMap />` for complex diagrams      |
| **Tooltips**        | Hover any node/edge for context                    |
| **Image Export**    | Download diagram as PNG/PDF (React Flow + html2canvas) |

#### 6.2 Custom Node Types

```
┌─────────────────────────────────────────────────────────────────────┐
│  Node Type          │  Visual           │  Color/Style              │
├─────────────────────────────────────────────────────────────────────┤
│  ServiceNode        │  Rounded rect     │  Indigo border (#6366f1)  │
│  DatabaseNode       │  Cylinder shape   │  Amber (#f59e0b)          │
│  QueueNode          │  Parallelogram    │  Green (#22c55e)          │
│  CacheNode          │  Diamond / hex    │  Red (#ef4444)            │
│  ClientNode         │  Person icon      │  Slate (#94a3b8)          │
│  LoadBalancerNode   │  Wide rect + bars │  Purple (#a855f7)         │
│  ExternalServiceNode│  Cloud shape      │  Cyan (#06b6d4)           │
└─────────────────────────────────────────────────────────────────────┘
```

Each node renders:
- **Icon** (Lucide) for quick identification
- **Label** (service name)
- **Status indicator** (green dot = healthy, red = down)
- **Port handles** (input/output connection points)
- **Hover tooltip** with brief description

#### 6.3 Custom Edge Types

| Edge Type         | Visual Style                                      | Use Case                    |
| ----------------- | ------------------------------------------------- | --------------------------- |
| `HttpEdge`        | Solid line + arrow, blue                          | Synchronous API calls       |
| `EventEdge`       | Dashed line + arrow, green, animated particles    | Async events / messages     |
| `ReplicationEdge` | Double line, amber                                | Database replication         |
| `CacheEdge`       | Dotted line, red                                  | Cache read/write operations  |

#### 6.4 Diagram Configuration

Each diagram is defined declaratively in `diagramConfigs.ts`:

```typescript
// Example: Load Balancer diagram config
export const loadBalancerDiagram: DiagramConfig = {
  id: "load-balancer-flow",
  nodes: [
    { id: "client",  type: "client",       label: "Client",         position: { x: 300, y: 0 } },
    { id: "lb",      type: "loadBalancer",  label: "Load Balancer",  position: { x: 300, y: 120 } },
    { id: "s1",      type: "service",       label: "Server 1",      position: { x: 100, y: 260 } },
    { id: "s2",      type: "service",       label: "Server 2",      position: { x: 300, y: 260 } },
    { id: "s3",      type: "service",       label: "Server 3",      position: { x: 500, y: 260 } },
    { id: "db",      type: "database",      label: "PostgreSQL",     position: { x: 300, y: 400 } },
  ],
  edges: [
    { source: "client", target: "lb",  type: "http",  label: "Request" },
    { source: "lb",     target: "s1",  type: "http",  label: "Route" },
    { source: "lb",     target: "s2",  type: "http",  label: "Route" },
    { source: "lb",     target: "s3",  type: "http",  label: "Route" },
    { source: "s1",     target: "db",  type: "http",  label: "Query" },
    { source: "s2",     target: "db",  type: "http",  label: "Query" },
    { source: "s3",     target: "db",  type: "http",  label: "Query" },
  ],
};
```

---

## 7. Interactive Simulations

### 7.1 Simulation Engine Architecture

```
SimulationProvider (Context)
    │
    ├── state: { isPlaying, speed, currentStep, mode }
    ├── actions: { play, pause, reset, setSpeed, setMode }
    │
    └── SimulationControls
         │
         ├── ▶ Play / ⏸ Pause
         ├── 🔄 Reset
         ├── ⏩ Speed (0.5x, 1x, 2x)
         └── Mode Switcher (Round Robin / Least Conn / IP Hash)
```

### 7.2 Simulation Catalog

#### Load Balancer Simulation

```
          Client Requests (animated dots)
               │ │ │
               ▼ ▼ ▼
        ┌──────────────┐
        │ Load Balancer │
        └──┬─────┬────┬┘
           │     │    │
           ▼     ▼    ▼
        ┌────┐┌────┐┌────┐
        │ S1 ││ S2 ││ S3 │
        └────┘└────┘└────┘
```

**Modes:**
| Mode              | Behavior                                          |
| ----------------- | ------------------------------------------------- |
| Round Robin       | Requests cycle S1 → S2 → S3 → S1 → ...          |
| Least Connections | Routes to server with fewest active connections    |
| IP Hash           | Same client IP always goes to same server          |
| Weighted          | Proportional distribution based on server capacity |

**Visual indicators:**
- Animated dots traveling from LB to servers
- Connection counter badge on each server
- Server health color (green/yellow/red)
- Throughput meter per server

---

#### Kafka Flow Simulation

```
  ┌──────────┐     ┌───────────────────┐     ┌─────────────┐
  │ Producer │────▶│  Kafka Topic      │────▶│ Consumer    │
  │          │     │  ┌─────┐ ┌─────┐  │     │ Group       │
  │          │     │  │ P-0 │ │ P-1 │  │     │ ┌────┐┌────┐│
  │          │     │  └─────┘ └─────┘  │     │ │ C1 ││ C2 ││
  └──────────┘     └───────────────────┘     │ └────┘└────┘│
                                              └─────────────┘
```

**Animations:**
- Messages appear at producer, travel to partitions
- Partition fill indicators (message backlog)
- Consumer group rebalancing on consumer add/remove
- Message processing with acknowledgment pulse

---

#### Cache Layer Simulation

```
  Client ──▶ API Service ──▶ Redis Cache
                                │
                          ┌─────┴─────┐
                          │ HIT  MISS │
                          │  ↓    ↓   │
                          │  ←    DB  │
                          └───────────┘
```

**Visual indicators:**
- Cache hit: green flash, fast response
- Cache miss: red flash, DB query, then cache populate
- TTL countdown timer on cached entries
- Hit/miss ratio dashboard

---

#### Circuit Breaker Simulation

```
  ┌────────┐     ┌──────────────────┐     ┌──────────┐
  │ Caller │────▶│ Circuit Breaker  │────▶│ Service  │
  └────────┘     │ [CLOSED/OPEN/    │     │ (flaky)  │
                 │  HALF_OPEN]      │     └──────────┘
                 └──────────────────┘
```

**States:**
- **Closed (green):** Requests pass through normally
- **Open (red):** All requests fail fast, no calls to service
- **Half-Open (yellow):** Trial request sent to test recovery

---

#### Saga Pattern Simulation

```
  Order ──▶ Payment ──▶ Inventory ──▶ Shipping
    │          │           │            │
    │    (compensate) (compensate) (compensate)
    │          │           │            │
    ◀──────────◀───────────◀────────────┘
                   ROLLBACK
```

**Animations:**
- Forward flow: green arrows progressing step by step
- Failure injection: click any step to simulate failure
- Compensation: red arrows flowing backwards
- Step status badges (pending → success → compensating → rolled back)

---

## 8. Topic Roadmap & Learning Path

### Phase 1 — Fundamentals (MVP)

| Topic                  | Visualization                                      | Simulation  |
| ---------------------- | -------------------------------------------------- | ----------- |
| Latency vs Throughput  | Animated pipeline with bottleneck visualization    | ❌          |
| CAP Theorem            | Interactive triangle: drag to select CP/AP/CA      | ❌          |
| Consistency Models     | Timeline diagram with read/write ordering          | ❌          |
| Load Balancers         | Multi-server distribution diagram                  | ✅          |
| Rate Limiting          | Token bucket filling/draining animation            | ✅          |

### Phase 2 — Data Layer

| Topic                  | Visualization                                      | Simulation  |
| ---------------------- | -------------------------------------------------- | ----------- |
| Indexing               | B-tree traversal animation                         | ❌          |
| Replication            | Leader-follower data sync flow                     | ✅          |
| Sharding               | Hash ring with key distribution                    | ✅          |
| Partitioning           | Range vs hash partition comparison                 | ❌          |
| Caching                | Cache-aside pattern with hit/miss flow             | ✅          |

### Phase 3 — Messaging

| Topic                  | Visualization                                      | Simulation  |
| ---------------------- | -------------------------------------------------- | ----------- |
| Kafka                  | Full broker-partition-consumer topology             | ✅          |
| RabbitMQ               | Exchange-queue-consumer binding                    | ✅          |
| Event-Driven Arch      | Multi-service event flow                           | ✅          |
| Exactly-Once           | Idempotency key dedup visualization                | ❌          |

### Phase 4 — Distributed Patterns

| Topic                  | Visualization                                      | Simulation  |
| ---------------------- | -------------------------------------------------- | ----------- |
| Circuit Breaker        | State machine with transition animations           | ✅          |
| Retry Pattern          | Exponential backoff timeline                       | ✅          |
| Saga Pattern           | Multi-step transaction with rollback               | ✅          |
| API Gateway            | Request routing + auth + rate limiting             | ❌          |
| Service Discovery      | Service registry with heartbeat pulses             | ❌          |

### Phase 5 — Case Studies

| Case Study   | Architecture                                          |
| ------------ | ----------------------------------------------------- |
| URL Shortener| Hash service → DB → redirect flow                    |
| WhatsApp     | WebSocket gateway → message broker → delivery        |
| Uber         | Location service → matching → trip flow              |
| Netflix      | CDN → API Gateway → microservices → caching          |
| YouTube      | Upload pipeline → transcoding → CDN → streaming     |
| Amazon       | Cart → Order → Payment → Inventory → Shipping       |

---

## 9. Interview Mode

### 9.1 Layout

```
┌──────────────────────────────────────────────────────────┐
│  🎯 Interview Mode: Design a URL Shortener               │
├──────────────────────┬───────────────────────────────────┤
│                      │                                    │
│  Step Navigation     │  Step Content                      │
│                      │                                    │
│  1. Requirements ✅  │  ┌──────────────────────────────┐ │
│  2. High Level   🔵  │  │  Architecture Diagram        │ │
│  3. Data Model   ⬜  │  │  (Interactive React Flow)     │ │
│  4. API Design   ⬜  │  └──────────────────────────────┘ │
│  5. Scaling      ⬜  │                                    │
│  6. Tradeoffs    ⬜  │  Key Decisions:                    │
│                      │  • Base62 vs MD5 for short code   │
│                      │  • SQL vs NoSQL for storage       │
│                      │  • Cache layer for hot URLs       │
│                      │                                    │
│  📋 Answer Template  │  Talking Points:                   │
│  [Copy to clipboard] │  • Read-heavy workload (100:1)    │
│                      │  • Horizontal scaling strategy    │
│                      │                                    │
└──────────────────────┴───────────────────────────────────┘
```

### 9.2 Interview Answer Template Structure

```
┌─────────────────────────────────────────────────┐
│  📝 Interview Answer: [System Name]              │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Requirements Clarification                   │
│     • Functional requirements (3-5 bullet)       │
│     • Non-functional requirements                │
│     • Scale estimation                           │
│                                                  │
│  2. High-Level Architecture                      │
│     • Component diagram                          │
│     • Data flow explanation                      │
│                                                  │
│  3. Data Model                                   │
│     • Schema design                              │
│     • Database selection rationale               │
│                                                  │
│  4. API Design                                   │
│     • Endpoint signatures                        │
│     • Authentication approach                    │
│                                                  │
│  5. Scaling Strategy                             │
│     • Read/write optimization                    │
│     • Caching, sharding, replication             │
│                                                  │
│  6. Bottlenecks & Tradeoffs                      │
│     • Known limitations                          │
│     • Alternative approaches considered          │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 10. Micro Animations & Motion

### Animation Guidelines

| Element                | Animation                                         | Library         |
| ---------------------- | ------------------------------------------------- | --------------- |
| **Page transitions**   | Fade + slide with stagger                        | Framer Motion   |
| **Sidebar hover**      | Smooth background highlight slide                | CSS transitions |
| **Sidebar expand**     | Accordion open/close with spring                 | Framer Motion   |
| **Card hover**         | Subtle scale (1.02) + shadow increase            | CSS transitions |
| **Diagram nodes**      | Pulse glow on active/highlighted                 | CSS keyframes   |
| **Edge particles**     | Dots moving along edge path                      | Canvas / CSS    |
| **Simulation flow**    | Request dots traveling between nodes             | Framer Motion   |
| **Code blocks**        | Syntax highlight fade-in on scroll               | Intersection Obs|
| **Tooltips**           | Scale-in from origin point                       | Radix + CSS     |
| **Search modal**       | Backdrop blur + scale-in                         | Framer Motion   |
| **Tab switching**      | Underline slide animation                        | Framer Motion   |
| **Badge appear**       | Pop scale-in with spring physics                 | Framer Motion   |
| **Animation gating**   | Only play animations when visible via Observer   | Intersection Obs|

### Framer Motion Presets

```typescript
// src/lib/animation.ts

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 },
};
```

---

## 11. MVP Scope

### Must-Have (v1.0)

| Feature                          | Priority | Complexity |
| -------------------------------- | -------- | ---------- |
| Sidebar topic navigation         | P0       | Medium     |
| Local progress tracking (checkmarks)| P0    | Low        |
| MDX content rendering            | P0       | Medium     |
| React Flow interactive diagrams  | P0       | High       |
| Diagram export to PNG            | P0       | Low        |
| 5 fundamental topic pages        | P0       | Medium     |
| Dark theme                       | P0       | Low        |
| Basic edge animations            | P0       | Medium     |
| Responsive layout                | P0       | Medium     |
| Breadcrumb navigation            | P1       | Low        |

### Nice-to-Have (v1.1)

| Feature                          | Priority | Complexity |
| -------------------------------- | -------- | ---------- |
| ⌘K command palette search        | P1       | Medium     |
| Load Balancer simulation         | P1       | High       |
| Cache flow simulation            | P1       | High       |
| Interview answer templates       | P1       | Medium     |
| Light theme toggle               | P1       | Low        |
| Table of contents (right panel)  | P2       | Low        |
| Mobile responsive sidebar        | P2       | Medium     |

### Future (v2.0+)

| Feature                          | Priority | Complexity |
| -------------------------------- | -------- | ---------- |
| All 25+ topic pages              | P2       | High       |
| 6 case study pages               | P2       | High       |
| Full Interview Mode              | P2       | High       |
| Whiteboard mode                  | P3       | Very High  |
| Traffic simulation               | P3       | Very High  |
| Architecture templates           | P3       | High       |
| Flashcard revision mode          | P3       | Medium     |

---

## 12. Advanced Features (Post-MVP)

### 12.1 Local Progress Tracking
Local storage-based progress tracking to keep users motivated.
- Checkmarks next to completed topics in the sidebar
- Progress bar for overall course completion (e.g., "5/25 Mastered")
- Stored as a simple array of completed topic slugs in `localStorage`

### 12.2 Whiteboard Mode

Free-form drawing canvas for interview practice. Build architecture diagrams from scratch.

**Implementation:** React Flow with editable nodes + freehand drawing overlay (tldraw or custom canvas).

### 12.2 Traffic Simulation

Simulate realistic traffic patterns:

```
Config: 10,000 requests/sec

Observe:
├── Load balancer distribution
├── Queue backlog growth
├── Cache hit ratio changes
├── Database connection pool usage
└── Response time degradation
```

### 12.5 Architecture Templates

Pre-built, annotated architecture patterns:

| Template         | Description                                    |
| ---------------- | ---------------------------------------------- |
| Microservices    | API Gateway → Service mesh → DBs              |
| Event-Driven     | Producers → Broker → Consumers                |
| CQRS             | Command service → Event store → Query service  |
| Pub/Sub          | Publishers → Channels → Subscribers            |
| Lambda (FAAS)    | API GW → Function → DB/Queue                  |

### 12.6 Revision / Flashcard Mode

Quick-review system with spaced repetition:

```
┌────────────────────────────────────┐
│  What is the CAP Theorem?          │
│                                    │
│         [Reveal Answer]            │
│                                    │
│  Confidence:                       │
│  [Again] [Hard] [Good] [Easy]      │
└────────────────────────────────────┘
```

---

## 13. Development Phases

### Phase 1 — Foundation (Week 1-2)

```
[ ] Project scaffolding (Vite + React + TS + Tailwind + Zustand)
[ ] shadcn/ui setup + design tokens
[ ] Layout shell (Sidebar, Topbar, Main content area)
[ ] React Router setup with topic routes
[ ] Local progress tracking logic (`useProgress`)
[ ] MDX pipeline (compilation + rendering)
[ ] 2-3 fundamental topic pages (CAP Theorem, Load Balancers, Rate Limiting)
```

### Phase 2 — Visualization (Week 3-4)

```
[ ] React Flow integration
[ ] Custom node components (all 7 types)
[ ] Custom edge components (all 4 types)
[ ] Diagram auto-layout with Dagre
[ ] Edge particle animations (gated by IntersectionObserver)
[ ] Diagram configs for all Phase 1 topics
[ ] Diagram controls (zoom, fit, minimap, export to PNG)
[ ] Cypress suite setup for visual snapshot tests
```

### Phase 3 — Simulations (Week 5-6)

```
[ ] SimulationProvider context
[ ] Simulation controls UI (play/pause/speed)
[ ] Load Balancer simulation (4 modes)
[ ] Cache flow simulation (hit/miss)
[ ] Kafka flow simulation
[ ] Circuit breaker simulation
```

### Phase 4 — Content Expansion (Week 7-8)

```
[ ] Scaling topics (4 pages)
[ ] Database topics (4 pages)
[ ] Messaging topics (4 pages)
[ ] Distributed pattern topics (5 pages)
[ ] Tradeoff cards for all topics
[ ] Interview answers for all topics
```

### Phase 5 — Interview Mode + Case Studies (Week 9-10)

```
[ ] Interview Mode layout
[ ] Step-by-step architecture builder
[ ] Answer templates with copy-to-clipboard
[ ] URL Shortener case study
[ ] WhatsApp case study
[ ] Netflix case study
```

### Phase 6 — Polish & Launch (Week 11-12)

```
[ ] ⌘K command palette search
[ ] Responsive design polish
[ ] Light theme
[ ] Performance optimization (lazy loading, code splitting)
[ ] SEO meta tags
[ ] Deploy to Vercel / Netlify
[ ] README documentation
```

---

## 14. Component Specification

### Key Component APIs

#### `<ArchitectureCanvas />`

```typescript
interface ArchitectureCanvasProps {
  configId: string;              // References diagram config
  interactive?: boolean;         // Allow drag/zoom (default: true)
  showMinimap?: boolean;         // Show minimap (default: false)
  showControls?: boolean;        // Show zoom controls (default: true)
  highlightPath?: string[];      // Node IDs to highlight in sequence
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}
```

#### `<SimulationControls />`

```typescript
interface SimulationControlsProps {
  isPlaying: boolean;
  speed: number;                 // 0.5 | 1 | 2
  mode?: string;                 // Simulation-specific mode
  modes?: { label: string; value: string }[];
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onModeChange?: (mode: string) => void;
}
```

#### `<TradeoffCard />`

```typescript
interface TradeoffCardProps {
  pros: string[];
  cons: string[];
  title?: string;
  className?: string;
}
```

#### `<InterviewAnswer />`

```typescript
interface InterviewAnswerProps {
  children: React.ReactNode;     // MDX content
  copyable?: boolean;            // Show copy button (default: true)
}
```

---

## 15. Data Flow & State Management

### State Architecture

Replace React Context for high-frequency updates with **Zustand** to prevent rendering bottlenecks during simulations:

```
App
├── ThemeProvider (theme state, low frequency)
├── ProgressProvider (topic completion state, low frequency)
└── Router
    └── Layout
        ├── Sidebar (reads topicTree data + progress state)
        ├── Topbar (search, theme toggle)
        └── TopicPage
            ├── MDXRenderer (content)
            ├── ArchitectureCanvas (diagram state local)
            └── SimulationEmbed (consumes Zustand store)
```

### URL Structure

```
/                                    → Home / Dashboard
/topic/:category/:slug              → Topic page
/case-study/:slug                   → Case study page
/interview/:slug                    → Interview mode page
```

---

## 16. Performance Considerations

| Concern                    | Strategy                                          |
| -------------------------- | ------------------------------------------------- |
| **Bundle size**            | Code splitting per route with `React.lazy()`      |
| **MDX compilation**        | Pre-compile MDX at build time (vite-plugin-mdx)   |
| **React Flow perf**        | Memoize nodes/edges, use `nodeTypes` registry     |
| **Animation perf**         | Use `will-change`, GPU-accelerated transforms     |
| **Image loading**          | Lazy load with intersection observer              |
| **Font loading**           | `font-display: swap` + preload critical fonts     |
| **Search index**           | Build client-side search index at build time       |
| **Simulation state**       | Using Zustand to bypass React Context re-renders   |
| **Animation gating**       | IntersectionObserver pauses animations off-screen |

---

## Summary

This platform transforms system design learning from passive reading into **active visual exploration**. By combining React Flow diagrams, interactive simulations, and structured interview templates — all wrapped in a premium dark-mode UI — it becomes a powerful tool for both **learning** and **interview preparation**.

```
Your Learning Tool  +  Your Portfolio Project  +  Your Interview Prep System
                              =
              System Design Mastery Platform
```
