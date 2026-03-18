# Phase 5 (Medium): Case Studies Sprint Plan — Part 1

> **Goal:** Define implementation-ready specs for Topics 1-3 of the Medium case studies: Notification System, Chat System, and Twitter/X News Feed.

---

## Wave Strategy

- **Wave 1 (Lower risk):** Notification System, Chat System (Slack/Discord)
- **Wave 2 (Higher complexity):** Twitter/X (News Feed), Instagram, Web Crawler
- **Part 1 Scope:** Covers Topics 1-3 so Wave 1 can be implemented first and Wave 2 can start with a proven feed simulation design

---

## Reusable Asset Inventory

### Reusable Visual Primitives (existing or required before sprint start)
| Node/Edge/Sim | Reused As |
|---|---|
| `ClientNode` | Users, publishers, subscribers, crawlers |
| `ServiceNode` | API servers, workers, ranking services, parsers |
| `DatabaseNode` | Primary DBs, message stores, graph stores |
| `LoadBalancerNode` | API Gateway, CDN, ingress router |
| `CacheNode` | Feed cache, session/presence cache, hot data |
| `QueueNode` | Kafka topics, priority queues, retry/DLQ queues |
| `LaneNode` | Side-by-side strategy comparisons |
| `AnimatedEdge` | All flow arrows |
| `CapacityEstimationCard` | Standardized estimation block |

### New Components (Phase 5 Medium)
| Component | Type | Purpose | Reused By |
|---|---|---|---|
| `FeedFanoutSim` | Simulation | Dual-lane fanout-on-write vs fanout-on-read with celebrity toggle + cost counter | Twitter, Instagram |
| `PresenceDeliverySim` | Simulation | Presence dots + delivery/read receipts + multi-channel fallback | Chat System, Notification System |
| `CrawlerFrontierSim` | Simulation | URL frontier queue with per-host politeness timers + Bloom filter dedup | Web Crawler |

> **Planning rule:** Reuse should only be claimed when the base primitive exists and the topic-specific teaching story remains clear. Shared simulations should be treated as base primitives with topic modes or wrappers, not one-size-fits-all drop-ins.

---

## Visualization Contract (Mandatory For All 5 Medium Topics)

Medium case studies are where the architecture visual layer becomes a core product feature. Every React Flow visualization must teach a system behavior through interaction, not just render topology.

### Required Interaction Model

| Interaction | Required Behavior | Learning Purpose |
|---|---|---|
| Hover | Short explanation for `what this component does` and `why it exists` | Makes dense systems readable |
| Click | Open inspect state for the selected node/edge with role, hot path, and failure role | Supports active exploration |
| Scenario Toggle | Switch between at least 3 meaningful states: `normal`, `alternate strategy`, `failure/degraded` | Teaches tradeoffs visually |
| Replay / Reset | Replay active flow and reset to baseline | Supports repetition and interview prep |
| Visible Legend | Explain colors, line styles, badges, queue states, and zones | Prevents hidden meaning |

### Required Visual Grammar

- Every node must have a clear label and short sublabel.
- Every important edge must name the action or payload (`post.created`, `retry`, `fanout`, `merge at read`, `robots check`).
- Use one dominant teaching story per scenario. Do not show every branch at once by default.
- Keep the main path readable before secondary systems are highlighted.
- State colors must be consistent:
  - Green: success / delivered / hot path success
  - Amber: fallback / merge / deferred / degraded
  - Red: blocked / failure / retry / reject
  - Blue: client-facing / request / read path

---

## React Flow Readiness Checklist

These items must be complete before Medium implementation starts.

- [ ] `ArchitectureCanvas` supports hover explanations, click inspection, scenario toggles, and replay/reset behavior
- [ ] `CacheNode` is registered in the React Flow node registry
- [ ] `QueueNode` is registered in the React Flow node registry
- [ ] `CapacityEstimationCard` exists for case-study capacity sections
- [ ] `diagramConfigs.ts` contains:
  - [ ] `notification-system-arch`
  - [ ] `chat-system-arch`
  - [ ] `twitter-news-feed-arch`
  - [ ] `instagram-arch`
  - [ ] `web-crawler-arch`
- [ ] Shared simulation primitives are explicitly scoped:
  - [ ] `PresenceDeliverySim` supports `notification` mode
  - [ ] `PresenceDeliverySim` supports `chat` mode
  - [ ] `FeedFanoutSim` supports `twitter` mode
  - [ ] `FeedFanoutSim` supports `instagram` mode or is wrapped by an Instagram-specific media pipeline layer
  - [ ] `CrawlerFrontierSim` is specified as a dedicated topic simulation
- [ ] Edge labels, badges, lane colors, and fallback-state language are standardized before topic implementation

---

## Shared Simulation Strategy

### `PresenceDeliverySim`

- Treat as a shared primitive with two topic modes:
  - `notification`: priority lanes, channel fallback, quiet hours, provider failure
  - `chat`: presence, reconnect sync, delivery/read receipts, offline replay
- The UI copy, badges, and scenarios must change by topic. Do not present it as the same simulation with renamed buttons.

### `FeedFanoutSim`

- Treat as a feed primitive for fanout strategy only.
- `twitter` mode teaches hybrid fanout, celebrity bypass, ranking fallback, and read-vs-write cost.
- `instagram` mode must not stop at feed fanout. It needs an Instagram-specific media pipeline layer or wrapper for upload, transcode, CDN miss, and story expiry.

### `CrawlerFrontierSim`

- This is a dedicated topic simulation, not a reusable primitive.
- It must teach scheduling, politeness, normalization, dedup, and robots.txt as first-class concepts.

---

## Pilot Sequence

Use a staged pilot approach instead of implementing all five topics in parallel.

### Stage 1: `PresenceDeliverySim` Pilot

- Start with **Notification System** as the first implementation target.
- Use it to validate priority lanes, fallback logic, and queue-driven delivery visuals.
- Only after that interaction model is proven should Chat System reuse the same primitive in `chat` mode.

### Stage 2: `FeedFanoutSim` Pilot

- Use **Twitter/X** as the feed-systems pilot.
- Twitter should set the visual standard for dual-lane comparisons, cost counters, and strategy toggles.
- Only after Twitter is approved should Instagram reuse the feed primitive and add its media-pipeline-specific layer.

---

## Pedagogical Rules (Same as Phase 3-5 Easy)

- **Beginner First**: Simple analogies, explain jargon immediately
- **Self-Explaining Visuals**: React Flow diagrams must be understandable at a glance
- **Strict Counts**: Tradeoffs (4-6), FAQ (4-6), Interview Notes (5), Takeaways (4-6)
- **18-Section Template**: Introduction, Why This Matters, Requirements, Capacity, API, Data Model, Architecture, Read/Write Paths, Deep Dives, Implementation Patterns, Scaling Strategy, Failure Scenarios, System Flows, Tradeoffs, FAQ, Interview Notes, Takeaways, Related Topics
- **Inherited Quality Bar**: The Medium sprint must pass the same visualization contract and review rigor established in the Easy sprint before being marked complete

---

## Topic 1: Notification System

**File:** `src/content/case-studies/notification-system.mdx`
**Difficulty:** Medium | **Wave:** 1 | **Order:** 1

### Introduction
"A notification system is like a postal sorting office. Letters (events) arrive, get sorted by urgency (priority), routed to the right mailbox (push/SMS/email), and if delivery fails, they're retried or rerouted to a different carrier."

### Why This Matters & Prerequisites
**Why This Matters:**
Every product depends on notifications for engagement: password resets, order confirmations, breaking news alerts. A badly designed system either spams users (fatigue → uninstalls) or silently drops critical messages (missed 2FA codes → support tickets). Companies like Twilio, SendGrid, and Firebase Cloud Messaging handle billions of notifications daily.

**Who Should Read This:**
- 🟢 **Beginners**: Understand multi-channel delivery and priority queues
- 🟡 **Intermediate**: Implement idempotent dispatch with retry + DLQ patterns
- 🔴 **Advanced**: Design provider failover, cross-region routing, and cost optimization

**Prerequisites:** [Event-Driven Architecture](/topics/event-driven-architecture), [Retry Pattern](/topics/retry-pattern), [Rate Limiting](/topics/rate-limiting), [API Gateway](/topics/api-gateway)

### Requirements
**Functional:**
1. Send notifications across Push, SMS, and Email channels
2. Support per-user channel preferences and quiet hours
3. Support priority levels (`critical`, `high`, `normal`, `bulk`)
4. Retry on transient provider failures with exponential backoff
5. Expose delivery status and failure reason via API

**Non-Functional:**
1. p99 enqueue latency < 120ms
2. 99.95% system availability
3. At-least-once delivery for critical notifications
4. Cost control via provider routing and rate limiting

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Daily notifications | 300M/day | Product + transactional mix |
| Peak write rate | 30K/sec | Campaign bursts |
| Consumer throughput | 45K/sec | Includes retries |
| Avg payload | 1.2KB | Metadata + template vars |
| Queue retention | 72h | Replay/recovery window |

### API Design
```http
POST /api/v1/notifications
Body: {
  userId: string,
  templateId: string,
  priority: "critical" | "high" | "normal" | "bulk",
  channels?: ["push" | "sms" | "email"],
  idempotencyKey: string
}
Response: 202 { notificationId, status: "queued" }

GET /api/v1/notifications/{notificationId}
Response: { status, channelStates: [{ channel, provider, attempts, lastError }] }

PUT /api/v1/users/{userId}/preferences
Body: { quietHours: { start, end, tz }, channelPriority: [], optOut: [] }
```

### Data Model
```sql
notifications (
  id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL,
  template_id VARCHAR(64) NOT NULL,
  priority VARCHAR(16) NOT NULL,
  payload JSONB NOT NULL,
  idempotency_key VARCHAR(128) UNIQUE,
  status VARCHAR(24), -- queued | dispatching | delivered | failed
  created_at TIMESTAMP
)

notification_attempts (
  id BIGSERIAL PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id),
  channel VARCHAR(16), -- push | sms | email
  provider VARCHAR(32), -- firebase | twilio | sendgrid
  attempt_no INT,
  status VARCHAR(24), -- sent | delivered | failed | bounced
  error_code VARCHAR(64),
  attempted_at TIMESTAMP
)
```
**DB Choice:** PostgreSQL for notifications table (ACID for idempotency). Redis for dedup cache and rate limit counters.

### Architecture Diagram (`notification-system-arch`)

```
[Event Producer] → [API Gateway] → [Notification API] → [Priority Queue (Kafka)]
                                                               ↓
                                                     [Channel Router]
                                                     ↙     ↓      ↘
                                           [Push Worker] [SMS Worker] [Email Worker]
                                                ↓            ↓            ↓
                                           [Firebase]    [Twilio]    [SendGrid]
                                                    ↘     ↓      ↙
                                               [Delivery Status Store]
                                               [Retry Queue / DLQ]
```

**Nodes:**
- `ClientNode` → "Event Producer" (sublabel: "Order Service · Auth Service · Marketing")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit · Route")
- `ServiceNode` → "Notification API" (sublabel: "Validate · Dedup · Enqueue")
- `QueueNode` → "Priority Queue" (sublabel: "critical 🔴 · high 🟠 · normal 🔵 · bulk ⚪")
- `ServiceNode` → "Channel Router" (sublabel: "Preference Lookup · Channel Selection")
- `ServiceNode` x3 → "Push Worker" (sublabel: "Firebase FCM"), "SMS Worker" (sublabel: "Twilio API"), "Email Worker" (sublabel: "SendGrid SMTP")
- `QueueNode` → "Retry Queue" (sublabel: "Exp Backoff · Max 3 retries")
- `QueueNode` → "DLQ" (sublabel: "Dead Letter · Manual Review")
- `DatabaseNode` → "Delivery Store" (sublabel: "Status · Attempts · Errors")
- `CacheNode` → "User Preferences" (sublabel: "Quiet Hours · Channel Priority")

**Edges:**
- Producer → Gateway: animated, label "POST /notifications"
- Gateway → API: animated
- API → Priority Queue: animated, label "Enqueue by priority"
- Queue → Router: animated, color-coded by priority (red/orange/blue/grey)
- Router → Push/SMS/Email Workers: animated, label "Channel dispatch"
- Workers → Providers: animated, label "External API call"
- Workers → Delivery Store: animated, label "Status update"
- Workers → Retry Queue: dim/amber edge, label "Transient failure → retry"
- Retry Queue → Router: animated, label "Retry attempt"
- Workers → DLQ: dim/red edge, label "Max retries exceeded"

### Read & Write Paths
**Write:** Event → Gateway → API (idempotency check via Redis) → Enqueue to Kafka priority topic → Channel Router reads user preferences → Dispatches to appropriate Worker → Worker calls provider API → Updates delivery status.
**Read:** Client → GET /notifications/{id} → Query delivery store → Return merged channel states with attempt history.

### Deep Dives
1. **Idempotency:** Every notification carries an `idempotencyKey`. The API checks Redis (SET NX, 72h TTL) before enqueuing. Duplicate events are silently dropped.
2. **Channel Fallback:** If push delivery fails (e.g., invalid token), the Router automatically tries the next channel in the user's preference order (Push → SMS → Email).
3. **Priority Scheduling:** Kafka topics partitioned by priority. Critical messages get dedicated consumer groups with higher throughput. Bulk messages are rate-limited to prevent provider throttling.

### Implementation Patterns
**Dispatch with Retry + Fallback:**
```typescript
async function dispatch(job: NotificationJob) {
  const prefs = await getUserPrefs(job.userId);
  const channels = job.channels ?? prefs.channelPriority;

  for (const channel of channels) {
    if (prefs.isQuietHour(channel)) continue;

    const provider = selectProvider(channel, job.region);
    const result = await provider.send(job);

    if (result.ok) {
      await markDelivered(job.id, channel, provider.name);
      return; // Success — stop trying channels
    }

    await recordAttempt(job.id, channel, provider.name, result.error);

    if (isTransient(result.error)) {
      await enqueueRetry(job, channel, backoff(job.attempt));
      return; // Will retry this channel
    }
    // Permanent failure on this channel — try next channel
  }

  await moveToDlq(job, "All channels exhausted");
}
```

**Redis Idempotency Check:**
```typescript
async function isNewNotification(key: string): Promise<boolean> {
  const result = await redis.set(`idemp:${key}`, '1', 'EX', 259200, 'NX');
  return result === 'OK'; // true = new, false = duplicate
}
```

### Scaling Strategy
- **0→1M/day:** Single Kafka topic, one worker pool per channel, single provider per channel
- **1M→50M/day:** Priority topic partitions, retry queue, provider failover (Twilio → Vonage)
- **50M→300M/day:** Regional Kafka clusters, shard workers by channel + region, bulk isolation
- **300M+/day:** Multi-region active-active, geo-aware provider routing, cost-optimized provider selection

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Push provider outage (Firebase) | Push channel fails | Circuit breaker detects failures → auto-fallback to SMS. Alert ops |
| Queue lag spike during campaign | Delivery delays for all priorities | Priority drain policy: drain critical first. Autoscale workers |
| Duplicate events from upstream | Users receive duplicate notifications | Idempotency key + Redis dedup cache (72h TTL) |
| User Preference DB outage | Can't resolve channel preferences | Cached preferences in Redis (30m TTL) + safe default: email only |
| Provider rate limit hit | 429 from Twilio/SendGrid | Per-provider rate limiter. Backoff + retry. Failover to secondary provider |

**Production Monitoring:** p99 enqueue latency, delivery success rate per channel, retry rate, DLQ depth, provider cost per notification
**How Real Systems Differ:** Slack sends 5B+ notifications/day using a custom priority queue with 7 priority levels. They run a dedicated abuse detection pipeline that blocks spam notifications before they enter the queue.

### System Flows (Interactive) — `<PresenceDeliverySim mode="notification" />`

**Controls:**
- **"Send Critical" button** → Fires a notification with red priority badge
- **"Send Bulk" button** → Fires a low-priority notification with grey badge
- **"Provider Failure" toggle** → Makes the Push provider return errors
- **"Quiet Hours" toggle** → Activates quiet hours for the test user

**Animations:**
1. **"Send Critical"**: Event Producer edge lights up → API node flashes "Dedup ✓" → Priority Queue shows message entering the **red "critical" lane** → Channel Router checks preferences → Push Worker sends → Firebase edge turns green → Delivery Store updates "✓ Delivered"
2. **"Provider Failure" ON + "Send Critical"**: Same path until Push Worker → Firebase edge turns **red with ✗** → Router tries next channel → SMS Worker sends → Twilio edge turns green → "✓ Delivered via SMS fallback"
3. **"Send Bulk"**: Message enters the **grey "bulk" lane** → visibly slower processing → Worker sends → "✓ Delivered" (after noticeable delay vs critical)
4. **"Quiet Hours" ON**: Router checks preference → "🔇 Quiet Hours" badge appears → notification deferred (edge turns amber with ⏸️ icon)

### Tradeoffs (4/4)
**Pros:** Decoupled architecture enables independent channel scaling, priority lanes protect critical traffic from bulk storms, provider failover improves delivery reliability, idempotency prevents user-facing duplication
**Cons:** Higher operational complexity (multiple queues, workers, providers), provider dependency introduces external failure modes, state split across queue/DB/cache complicates debugging, multi-channel retry logic is subtle to get right

### FAQ (4 Questions)
1. **At-least-once vs exactly-once for notifications?** — At-least-once with idempotency at the consumer. True exactly-once across external providers is impractical because you can't control their dedup guarantees.
2. **How to avoid notifying users during quiet hours?** — Channel Router checks user preferences before dispatch. Critical notifications (2FA, security alerts) bypass quiet hours.
3. **How to prevent retry storms?** — Exponential backoff with jitter, max 3 retries, circuit breaker on provider. After max retries → DLQ for manual review.
4. **How to safely roll out new notification templates?** — Feature flag per template. Shadow mode: generate notification but don't send. Compare output with existing template before enabling.

### Interview Notes (5 Points)
1. **Queue first, deliver async**: Never send notifications synchronously from the triggering service
2. **Idempotency at ingress**: Deduplicate before enqueuing using a cache-backed idempotency key
3. **Channel abstraction**: Workers are channel-specific but share a common dispatch interface
4. **Priority isolation**: Separate consumer groups per priority level to prevent bulk blocking critical
5. **Retry + DLQ + metrics**: Every notification must be traceable through the entire pipeline

### Key Takeaways (5 Points)
1. Notification systems are queue-first architectures — never send inline
2. Idempotency prevents the most common user-facing bug: duplicate notifications
3. Channel fallback (Push → SMS → Email) dramatically improves delivery reliability
4. Priority lanes protect critical messages during bulk campaign storms
5. Provider abstraction enables cost optimization and failure resilience

### Related Topics
`event-driven-architecture`, `retry-pattern`, `api-gateway`, `exactly-once-processing`, `rate-limiting`

---

## Topic 2: Chat System (Slack/Discord)

**File:** `src/content/case-studies/chat-system.mdx`
**Difficulty:** Medium | **Wave:** 1 | **Order:** 2

### Introduction
"A chat system is like a telephone exchange from the 1920s — operators (servers) must connect the right callers (users), maintain the connection (WebSocket), and keep a log of every conversation (message store). The challenge: millions of simultaneous calls."

### Why This Matters & Prerequisites
**Why This Matters:**
Real-time messaging is core infrastructure for Slack (20M+ DAU), Discord (200M+ MAU), and WhatsApp (2B+ users). The technical challenge isn't sending one message — it's maintaining millions of concurrent WebSocket connections, ordering messages correctly, tracking who's online, and syncing state across devices.

**Who Should Read This:**
- 🟢 **Beginners**: Understand WebSocket basics, message persistence, and presence
- 🟡 **Intermediate**: Design per-conversation sequence ordering, fanout workers, and cursor-based sync
- 🔴 **Advanced**: Scale WebSocket gateways across regions, handle split-brain presence, and optimize for group channels

**Prerequisites:** [Kafka](/topics/kafka), [Service Discovery](/topics/service-discovery), [Consistent Hashing](/topics/consistent-hashing), [Rate Limiting](/topics/rate-limiting)

### Requirements
**Functional:**
1. 1:1 direct messages and group/channel messaging
2. Presence tracking (online / offline / last seen)
3. Delivery receipts (✓ sent, ✓✓ delivered, ✓✓ read)
4. Message history sync across devices (cursor-based)
5. Basic moderation hooks (mute, block, delete)

**Non-Functional:**
1. Message send → deliver p99 < 250ms
2. 99.99% availability for the real-time path
3. Message durability (zero silent message loss)
4. Ordered delivery per conversation (not globally)

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Concurrent WebSocket connections | 2M | Peak active users |
| Peak message rate | 120K msg/sec | Including bursts |
| Avg message size | 350 bytes | Text-first baseline |
| Daily events | 8B/day | Messages + receipts + presence |
| Message retention | 1 year hot, archive cold | Tiered storage |

### API Design
```http
-- REST (message history, settings)
POST /api/v1/conversations/{id}/messages
Body: { clientMsgId: string, text: string, attachments?: [] }
Response: 201 { messageId, seqNo, createdAt }

GET /api/v1/conversations/{id}/messages?after=seqNo&limit=50
Response: { items: [{ messageId, senderId, text, seqNo }], hasMore }

-- WebSocket (real-time events)
CONNECT ws://chat.example.com?token=<jwt>

SERVER → CLIENT events:
  MESSAGE_CREATED { conversationId, messageId, senderId, text, seqNo }
  MESSAGE_DELIVERED { conversationId, messageId, recipientId }
  MESSAGE_READ { conversationId, messageId, readerId, readUpTo }
  PRESENCE_CHANGED { userId, status: "online" | "offline", lastSeen }
```

### Data Model
```sql
conversations (
  id BIGINT PRIMARY KEY,
  type VARCHAR(16), -- dm | group | channel
  name VARCHAR(128),
  created_at TIMESTAMP
)

messages (
  id BIGINT PRIMARY KEY,
  conversation_id BIGINT,
  sender_id BIGINT,
  client_msg_id VARCHAR(64) UNIQUE, -- client-side dedup
  body TEXT,
  seq_no BIGINT, -- monotonic per conversation
  created_at TIMESTAMP
)

conversation_members (
  conversation_id BIGINT,
  user_id BIGINT,
  role VARCHAR(16), -- owner | admin | member
  last_read_seq BIGINT, -- for read receipts
  PRIMARY KEY (conversation_id, user_id)
)
```
**DB Choice:** PostgreSQL for messages (strong ordering guarantees via sequences). Redis for presence (TTL-based heartbeats) and online user registry.

### Architecture Diagram (`chat-system-arch`)

```
[Alice]  ─ws─→  [WS Gateway 1]  →  [Chat Service]  →  [Message Store (PG)]
[Bob]    ─ws─→  [WS Gateway 2]       ↓                  ↕
[Charlie]─ws─→  [WS Gateway 1]  [Fanout Queue (Kafka)]  [Presence Store (Redis)]
                                      ↓
                                 [Fanout Workers]  →  [WS Gateway 1 → Alice, Charlie]
                                                   →  [WS Gateway 2 → Bob]
```

**Nodes:**
- `ClientNode` x3 → "Alice" (sublabel: "🟢 Online"), "Bob" (sublabel: "🟢 Online"), "Charlie" (sublabel: "⚫ Offline")
- `ServiceNode` x2 → "WS Gateway 1" (sublabel: "1.2M connections"), "WS Gateway 2" (sublabel: "800K connections")
- `ServiceNode` → "Chat Service" (sublabel: "Sequence · Persist · Validate")
- `QueueNode` → "Fanout Queue" (sublabel: "Kafka · Partitioned by conversation")
- `ServiceNode` → "Fanout Workers" (sublabel: "Stateless · Route to correct gateway")
- `DatabaseNode` → "Message Store" (sublabel: "PostgreSQL · seq_no ordering")
- `CacheNode` → "Presence Store" (sublabel: "Redis · TTL heartbeats · 5s interval")

**Edges:**
- Alice → WS Gateway 1: animated, label "WebSocket"
- Bob → WS Gateway 2: animated, label "WebSocket"
- Charlie → WS Gateway 1: dim (offline), label "Disconnected"
- WS Gateway → Chat Service: animated, label "Send message"
- Chat Service → Message Store: animated, label "Persist (seq_no=42)"
- Chat Service → Fanout Queue: animated, label "Broadcast event"
- Fanout Queue → Fanout Workers: animated
- Fanout Workers → WS Gateway 1: animated, label "→ Alice (delivered)"
- Fanout Workers → WS Gateway 2: animated, label "→ Bob (delivered)"
- Fanout Workers → WS Gateway 1: dim, label "→ Charlie (offline, stored)"
- Chat Service → Presence Store: animated (pulsing), label "Heartbeat check"

### Read & Write Paths
**Write (Send Message):** Alice → WS Gateway → Chat Service → assign seq_no (atomic increment per conversation) → persist to Message Store → publish to Fanout Queue → Fanout Workers look up recipient connections → push via WS to online recipients. Offline recipients receive messages on reconnect via cursor-based sync.
**Read (History Sync):** Client reconnects → sends "give me messages after seq_no=38" → Chat Service queries Message Store → returns messages 39-42 → client merges into local state.

### Deep Dives
1. **Ordered Delivery:** Each conversation has an atomic sequence counter. Messages get `seq_no` at write time. Clients display messages ordered by `seq_no`, not by arrival time. This prevents reordering during network delays.
2. **Presence Tracking:** Each connected client sends a heartbeat to Redis every 5 seconds. Key: `presence:{userId}`, TTL: 15s. If 3 heartbeats are missed, the user is marked offline. Presence changes are broadcast to relevant conversations.
3. **Offline Delivery:** When Fanout Workers can't find a user's WS connection, the message is already persisted. On reconnect, the client sends its `lastSeenSeqNo` and the server replays all missed messages.

### Implementation Patterns
**Sequenced Message Handling:**
```typescript
async function handleIncomingMessage(ws: WebSocket, input: IncomingMessage) {
  // 1. Assign monotonic sequence number
  const seqNo = await redis.incr(`seq:conv:${input.conversationId}`);

  // 2. Persist with ordering guarantee
  const msg = await db.messages.insert({
    ...input,
    seqNo,
    createdAt: new Date()
  });

  // 3. Broadcast to conversation members
  await kafka.produce('chat-fanout', {
    conversationId: input.conversationId,
    message: msg,
    memberIds: await getConversationMembers(input.conversationId)
  });

  // 4. Ack to sender
  ws.send(JSON.stringify({ type: 'MESSAGE_ACK', messageId: msg.id, seqNo }));
}
```

**Cursor-Based History Sync:**
```typescript
async function syncHistory(conversationId: string, afterSeq: number, limit = 50) {
  return db.messages.findMany({
    where: { conversationId, seqNo: { gt: afterSeq } },
    orderBy: { seqNo: 'asc' },
    take: limit
  });
}
```

### Scaling Strategy
- **0→100K concurrent:** Single-region WS gateway pool (sticky sessions), single Kafka partition per conversation
- **100K→1M:** Shard WS connections by user hash, dedicated fanout workers, Redis Cluster for presence
- **1M→2M+:** Regional WS gateways with global user routing table, cross-region message replication
- **Mature:** Tiered message storage (hot SSD → cold S3), adaptive fanout (small groups direct-push, large channels use pull)

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| WS Gateway node crash | All connections on that node drop | Clients auto-reconnect with session resume token. Cursor sync recovers messages |
| Fanout lag (Kafka consumer behind) | Delayed delivery | Partition by conversation for parallelism. Autoscale consumers. Monitor lag |
| Sequence generator failure | Messages arrive out of order | Per-conversation Redis counter with fallback to DB sequence. Alert on gaps |
| Presence store hot key | Celebrity user causes Redis hotspot | Shard presence keys. Jittered heartbeat intervals (4-6s random) |
| Split-brain (network partition) | Different gateways see different member lists | Consistent hashing for user→gateway mapping. Reconciliation on partition heal |

**Production Monitoring:** WS connection count per gateway, message delivery p99, fanout lag, presence accuracy, reconnection rate
**How Slack/Discord Differ:** Slack uses a custom "message queue" (not Kafka) optimized for small group delivery. Discord uses Elixir/Erlang for their real-time gateway, handling 1M+ events/sec per node. Both support "threads" as a separate message stream within channels.

### System Flows (Interactive) — `<PresenceDeliverySim mode="chat" />`

**Controls:**
- **"Send Message" button** → Alice sends a message to a group conversation
- **"Go Offline" toggle** → Toggles Bob's online status
- **"Reconnect" button** → Bob reconnects and replays missed messages
- **"Read Message" button** → Bob opens the conversation (triggers read receipt)

**Animations:**
1. **"Send Message"**: Alice's node pulses → edge lights up to WS Gateway → Chat Service flashes "seq_no: 42" → Message Store shows green ✓ → Fanout Queue receives → Workers route: Alice gets "✓ sent", Bob gets message (edge lights up to his gateway), Charlie (offline) gets a dim edge with "stored for later"
2. **"Go Offline"**: Bob's presence dot changes from 🟢 to ⚫ → heartbeat edge stops pulsing → Presence Store key expires → "PRESENCE_CHANGED: offline" broadcasts to Alice
3. **"Send Message" (Bob offline)**: Same flow but Fanout Worker → Bob's gateway edge is dim red "⚫ offline, persisted" → message counter on Bob's node shows "2 unread"
4. **"Reconnect"**: Bob's node lights back up 🟢 → sends "afterSeq=38" → Chat Service streams messages 39-42 → edges light up sequentially → Bob's "unread" counter clears
5. **"Read Message"**: Bob opens conversation → "MESSAGE_READ" event → Alice sees ✓✓ (delivered) change to **✓✓ blue** (read) — mirrors WhatsApp's iconic read receipts

### Tradeoffs (4/4)
**Pros:** Real-time UX with sub-250ms delivery, resumable history via cursor sync, scalable fanout via Kafka partitioning, presence gives users social context
**Cons:** Higher operational complexity (multiple queues, workers, persistence stores), message sequence management, presence hotspots for celebrity users, split-brain sync edge cases.

### FAQ (4 Questions)
1. **WebSocket vs long polling vs SSE?** — WebSocket is bidirectional (client can send AND receive). Long polling adds latency per message. SSE is server→client only. WebSocket is the standard for chat.
2. **Why per-conversation sequence instead of global?** — Global ordering is unnecessary and creates a bottleneck. Users only care about order within their conversation. Per-conversation atomic counters scale horizontally.
3. **How to handle media attachments?** — Upload media to object storage (S3) via presigned URL. Message body contains a reference `mediaUrl`. Never send binary data through WebSocket.
4. **How to support multi-device read state?** — Store `last_read_seq` per user per conversation. When device A reads up to seq=42, broadcast to device B: "mark as read up to 42."

### Interview Notes (5 Points)
1. **Separate real-time path from persistence**: WebSocket for delivery, REST for history sync
2. **Sequence per conversation, not globally**: Avoids bottleneck, enables horizontal scaling
3. **Fanout workers must be stateless**: They look up connections from a routing table, not local state
4. **Presence is eventually consistent**: 5s heartbeat with 15s TTL. Exact "online" status is approximate
5. **Cursor-based reconnect is critical**: Clients must resume without data loss after disconnections

### Key Takeaways (5 Points)
1. Real-time chat is a connection-scaling problem — millions of long-lived WebSocket connections
2. Message durability and ordering are separate concerns — persist first, deliver second
3. Presence is high-churn, low-accuracy metadata — design for eventually consistent
4. Fanout workers + Kafka partitioning enable horizontal message delivery scaling
5. Cursor-based replay makes network outages invisible to users

### Related Topics
`kafka`, `service-discovery`, `retry-pattern`, `exactly-once-processing`, `consistent-hashing`

---

## Topic 3: Twitter/X (News Feed)

**File:** `src/content/case-studies/twitter-news-feed.mdx`
**Difficulty:** Medium | **Wave:** 2 | **Order:** 3

### Introduction
"A news feed is like a personal newspaper that prints itself every time you open it. Behind the scenes, editors (ranking algorithms) select the best articles (posts) from everyone you follow, sort them by relevance, and deliver a fresh front page in under 300ms."

### Why This Matters & Prerequisites
**Why This Matters:**
Twitter's feed serves 35B+ timeline reads per day. The core challenge is the "celebrity problem": when a user with 50M followers posts, naive fanout-on-write would generate 50M cache writes. This makes feed design the definitive system design interview question for testing your understanding of read vs write tradeoffs.

**Who Should Read This:**
- 🟢 **Beginners**: Understand fan-out, timelines, and why caching matters
- 🟡 **Intermediate**: Design hybrid fanout strategies and ranked feed pipelines
- 🔴 **Advanced**: Optimize ranking models, cursor consistency, and cache invalidation at scale

**Prerequisites:** [Caching Strategies](/topics/caching-strategies), [Consistent Hashing](/topics/consistent-hashing), [Event-Driven Architecture](/topics/event-driven-architecture), [Load Balancers](/topics/load-balancers)

### Requirements
**Functional:**
1. Create posts (text + media references)
2. Follow/unfollow other users (social graph)
3. Home timeline with cursor-based pagination
4. Ranking and filtering (mute, block, content safety)
5. Like/reply/repost with eventually consistent counters

**Non-Functional:**
1. Timeline p99 < 300ms
2. 99.99% availability for read path
3. Handle celebrity posts (50M+ followers) without meltdown
4. Consistent pagination under concurrent writes

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| DAU | 120M | Medium-scale target |
| Posts/day | 450M | Including replies |
| Timeline reads/day | 35B | ~290 reads per user per day |
| Read:Write ratio | ~75:1 | Feed products are read-dominant |
| Avg followers | 200 | Power-law distribution |
| Cached timeline TTL | 30-120s | Adaptive by user activity |

### API Design
```http
POST /api/v1/posts
Body: { text: string, mediaRefs?: string[] }
Response: 201 { postId, createdAt }

POST /api/v1/users/{userId}/follow
Body: { targetUserId: string }
Response: 200 { following: true }

GET /api/v1/timeline/home?cursor=<opaque>&limit=20
Response: { items: [{ postId, authorId, text, score, createdAt }], nextCursor }
```

### Data Model
```sql
posts (
  id BIGINT PRIMARY KEY,
  author_id BIGINT NOT NULL,
  body TEXT,
  media_refs JSONB,
  created_at TIMESTAMP
)

follows (
  follower_id BIGINT,
  followee_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
)

home_timeline_cache ( -- Redis sorted set
  user_id BIGINT,
  post_id BIGINT, -- members
  score DOUBLE -- ranking score or timestamp
)
```
**DB Choice:** PostgreSQL (sharded by user_id) for posts and follows. Redis sorted sets for timeline cache. Graph DB (optional) for social graph queries.

### Architecture Diagram (`twitter-news-feed-arch`)

```
[Client] → [API Gateway] → [Post Service] → [Event Bus (Kafka)]
                                                    ↓
                                             [Fanout Service]
                                            ↙ (write mode)    ↘ (read mode)
                                    [Timeline Cache (Redis)]    [Merge on read]
                                            ↓
                           [Ranking Service] ← [Feature Store]
                                            ↓
                                    [Feed API → Client]
                                    [Graph Store (Follows)]
```

**Nodes:**
- `ClientNode` → "Client" (sublabel: "Mobile / Web")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit")
- `ServiceNode` → "Post Service" (sublabel: "Create · Validate · Publish")
- `QueueNode` → "Event Bus" (sublabel: "Kafka · post.created events")
- `ServiceNode` → "Fanout Service" (sublabel: "Hybrid: write for <500K, read for celebrities")
- `CacheNode` → "Timeline Cache" (sublabel: "Redis Sorted Sets · per-user inbox")
- `ServiceNode` → "Ranking Service" (sublabel: "ML Score · Recency · Engagement")
- `DatabaseNode` → "Feature Store" (sublabel: "User affinities · Post signals")
- `ServiceNode` → "Feed API" (sublabel: "Cursor · Paginate · Serve")
- `DatabaseNode` → "Graph Store" (sublabel: "Follows · Blocks · Mutes")

**Edges:**
- Client → Gateway: animated, label "GET /timeline/home"
- Gateway → Post Service: animated, label "POST /posts"
- Post Service → Event Bus: animated, label "post.created"
- Event Bus → Fanout Service: animated
- Fanout Service → Timeline Cache: animated, label "Write to 200 follower inboxes" (shows tree-like spread)
- Fanout Service → Timeline Cache: dim alternate path, label "Celebrity: skip write, merge at read"
- Feed API → Timeline Cache: animated, label "Read user's inbox"
- Feed API → Ranking Service: animated, label "Score & sort"
- Ranking Service → Feature Store: animated, label "Get signals"
- Feed API → Client: animated, label "Ranked feed"

### Read & Write Paths
**Write (Post Published):** Author creates post → Post Service persists → publishes `post.created` to Kafka → Fanout Service reads event → checks author follower count → If < 500K followers: writes post_id to each follower's timeline cache (fanout-on-write). If ≥ 500K: stores in celebrity post index (merged at read time).
**Read (Timeline Request):** Client → Feed API → reads user's timeline cache (pre-built inbox) → merges celebrity posts from celebrity index → sends candidates to Ranking Service → Ranking scores by relevance → returns paginated, ranked feed.

### Deep Dives
1. **Hybrid Fanout:** Normal users (< 500K followers) use fanout-on-write: pre-build follower inboxes. Celebrities use fanout-on-read: merge their posts at read time. The threshold is configurable per user.
2. **Ranking Pipeline:** Two stages — candidate generation (union of inbox + celebrity posts) → ranking (ML model scores: recency, affinity, engagement probability). Fallback: chronological sort if ranking service is unavailable.
3. **Cursor Consistency:** Cursors are opaque tokens encoding (last_score, last_post_id). This ensures stable pagination even when new posts arrive between page loads.

### Implementation Patterns
**Hybrid Fanout Decision:**
```typescript
async function fanoutPost(post: Post) {
  const followers = await getFollowers(post.authorId);
  const mode = followers.length > 500_000 ? 'read' : 'write';

  if (mode === 'write') {
    // Write to each follower's timeline cache
    const pipeline = redis.pipeline();
    for (const followerId of followers) {
      pipeline.zadd(`timeline:${followerId}`, post.score, post.id);
      pipeline.zremrangebyrank(`timeline:${followerId}`, 0, -801); // Keep top 800
    }
    await pipeline.exec();
  } else {
    // Store in celebrity index — merged at read time
    await redis.zadd('celebrity:posts', post.score, post.id);
  }
}
```

**Timeline Read with Celebrity Merge:**
```typescript
async function getTimeline(userId: string, cursor?: string, limit = 20) {
  // 1. Get pre-built inbox
  const inbox = await redis.zrevrangebyscore(`timeline:${userId}`, '+inf', '-inf', 'LIMIT', 0, limit);

  // 2. Merge celebrity posts
  const celebPosts = await getCelebrityPostsForUser(userId);
  const merged = [...inbox, ...celebPosts].sort((a, b) => b.score - a.score);

  // 3. Rank
  const ranked = await rankingService.score(userId, merged.slice(0, limit * 2));
  return paginate(ranked, cursor, limit);
}
```

### Scaling Strategy
- **0→1M users:** Timeline cache + chronological sort, no ranking
- **1M→20M:** Hybrid fanout + basic ranking (recency + engagement), partitioned follower graph
- **20M→120M:** Regional feed caches, async ranking pipeline, feature store for ML signals
- **Mature:** Online ranking with real-time features, A/B testing framework, model versioning

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Celebrity post storm | Fanout backlog for normal posts | Celebrity posts skip fanout entirely → merged at read time |
| Ranking service outage | Low-quality feed | Fallback to chronological sort. Cache recent ranked results |
| Graph store shard skew | Latency hotspots for popular users | Repartition by follower load. Read replicas for hot shards |
| Cache stampede on popular timeline | DB pressure | Request coalescing (singleflight). Stale-while-revalidate |
| Cursor invalidation | User sees duplicate or missing posts | Score-based cursors (not offset-based). Stable across writes |

**Production Monitoring:** Timeline p99, fanout lag, cache hit rate, ranking latency, celebrity post throughput
**How Twitter Actually Works:** Twitter uses a hybrid approach similar to our design. Celebrity accounts (verified, >500K followers) use fanout-on-read. Twitter's ranking model considers 1000+ features and runs on specialized ML infrastructure. They serve 35B+ timeline requests/day across multiple data centers.

### System Flows (Interactive) — `<FeedFanoutSim mode="twitter" />`

**Controls:**
- **"Post (Normal User)" button** → Normal user with 200 followers publishes
- **"Post (Celebrity)" button** → Celebrity with 5M followers publishes
- **"View Timeline" button** → A follower opens their feed
- **"Fanout Mode" toggle** → Switch between write-only / read-only / hybrid views
- **"Ranking Down" toggle** → Simulates ranking service failure

**Animations:**
1. **"Post (Normal User)"**: Author node pulses → Post Service → Event Bus → Fanout Service → **tree of animated edges** spreading to 200 follower timeline caches (edges fan out visually like branches). Cost counter: "Writes: 200"
2. **"Post (Celebrity)"**: Author node pulses (gold border) → Post Service → Event Bus → Fanout Service → instead of fanning out, a single edge writes to "Celebrity Index". Cost counter: "Writes: 1" (vs "Writes: 5,000,000" crossed out)
3. **"View Timeline"**: Follower requests feed → Feed API → reads Timeline Cache (green) → **also** reads Celebrity Index (amber) → merged candidates → Ranking Service scores → sorted feed returns. Badge: "Merged 200 inbox + 12 celebrity posts"
4. **"Fanout Mode" toggle**: Side-by-side `LaneNode` comparison:
   - **Left: "Fanout-on-Write"** — post publishes → massive tree of edges → cost counter climbing
   - **Right: "Fanout-on-Read"** — post stores once → at read time, merge happens → cost counter shows read queries
   - **Center: "Hybrid"** — normal users use left path, celebrity uses right path
5. **"Ranking Down"**: Ranking Service node turns red → fallback to chronological → "⚠️ Fallback: Chronological" badge

### Tradeoffs (4/4)
**Pros:** Personalized, ranked timelines at low read latency, hybrid fanout handles celebrity problem elegantly, Redis sorted sets give O(log N) timeline operations, ranking fallback ensures feed always loads
**Cons:** High system complexity (fanout + ranking + graph), cache invalidation on delete/edit requires propagation, ML ranking introduces model drift risk, graph operations (get followers) can be expensive at scale

### FAQ (4 Questions)
1. **Why not pure fanout-on-write?** — A celebrity with 50M followers would generate 50M writes per post. At 10 posts/day, that's 500M writes/day from ONE user. Fanout-on-read for celebrities saves 99.99% of those writes.
2. **How to handle deleted posts in cached timelines?** — Lazy deletion: mark post as deleted in DB. When a timeline is read, filter out deleted posts. Periodic background job cleans caches.
3. **How to prevent out-of-order feed pages?** — Score-based cursors, not offset-based. Cursor = (last_score, last_post_id). New posts with higher scores appear on the TOP of the next refresh, not in the middle of pagination.
4. **Where to compute ranking features?** — Feature Store (precomputed): user affinities, author engagement rates. Real-time features: recency, trending signals. Combined at scoring time.

### Interview Notes (5 Points)
1. **Hybrid fanout**: Write for normal (<500K followers), read for celebrities. This is the key insight
2. **Two-stage ranking**: Candidate generation (fast, broad) → scoring (ML, precise). Always have a fallback
3. **Graph store design**: Sharded follows table. Hot users get read replicas. Avoid full graph traversal
4. **Cache is the read path**: Timeline cache is the primary data source for reads, not the DB
5. **Cursor semantics**: Score-based, not offset-based. Must be stable under concurrent writes

### Key Takeaways (5 Points)
1. Feed systems are read optimization problems — most effort goes into fast timeline reads
2. The celebrity problem breaks naive fanout — hybrid fanout is the industry solution
3. Ranking quality directly impacts engagement — but always have a chronological fallback
4. Cache strategy is product-critical — timeline cache IS the product for most feed reads
5. Social graph operations are the hidden bottleneck — shard and replicate aggressively

### Related Topics
`consistent-hashing`, `caching-strategies`, `event-driven-architecture`, `kafka`, `rate-limiting`
