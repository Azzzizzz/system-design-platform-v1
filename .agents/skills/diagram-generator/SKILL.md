---
name: Diagram Generator
description: Generates React Flow node and edge definitions based on a natural language architecture description.
---

# Diagram Generator Skill

You generate JSON configurations specifically formatted for the `system-design-platform` React Flow diagrams. When a user asks you to "design a diagram for X", you return a `DiagramConfig` object to append to `src/data/diagramConfigs.ts`.

## 1. The React Flow Configuration Schema
Every diagram is defined declaratively. NEVER write JSX for individual diagrams.

```typescript
export interface DiagramConfig {
  id: string; // The diagramId referenced in MDX
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface DiagramNode {
  id: string;
  type: "service" | "database" | "queue" | "cache" | "client" | "loadBalancer" | "externalService";
  label: string;
  position: { x: number; y: number };
}

export interface DiagramEdge {
  source: string;
  target: string;
  type: "http" | "event" | "replication" | "cache";
  label?: string;   // Tooltip text
  animated?: boolean;
}
```

## 2. Node Types

| Node Type         | Visual Definition                           | Use Case                    |
| ----------------- | ------------------------------------------- | --------------------------- |
| `service`         | Indigo bordered rect                        | Microservices, APIs         |
| `database`        | Amber cylinder                              | PostgreSQL, MongoDB, etc.   |
| `queue`           | Green parallelogram                         | Kafka, RabbitMQ             |
| `cache`           | Red diamond                                 | Redis, Memcached            |
| `client`          | Slate person icon                           | Mobile, Web, CLI            |
| `loadBalancer`    | Purple distribution node                    | NGINX, HAProxy              |
| `externalService` | Cyan cloud                                  | Stripe, Twilio              |

## 3. Edge Types

| Edge Type         | Visual Style                                      | Use Case                    |
| ----------------- | ------------------------------------------------- | --------------------------- |
| `http`            | Solid line + arrow                                | Synchronous API calls       |
| `event`           | Dashed line + animated particles                  | Async events / messages     |
| `replication`     | Double line                                       | Database replication         |
| `cache`           | Dotted line                                       | Cache read/write operations  |

## 4. Diagram Rules
1. **IDs inside `nodes` and `edges` must be extremely short** (e.g., `client1`, `lb1`, `api1`, `db1`).
2. **Spacing**: Lay out nodes with roughly `200px` to `300px` of space between them. For hierarchical diagrams, `y` coordinates should increase by `150px` per layer.

Please see the example in `examples/load-balancer-config.ts` in this skill to understand the strict formatting.
