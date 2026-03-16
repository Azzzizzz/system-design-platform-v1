# Phase 5 (Medium): Case Studies Sprint Plan

> **Goal:** Complete 5 Medium case studies using the enhanced 18-section template (4 layers: Beginner → Core → Intermediate → Advanced). All visualizations must meet Phase 3-4 quality bar.

---

## Wave Strategy

- **Wave 1 (Lower risk):** Notification System, Chat System (Slack/Discord)
- **Wave 2 (Higher complexity):** Twitter/X (News Feed), Instagram, Web Crawler
- **Gate:** Wave 1 verification must pass before Wave 2 begins.

---

## Reusable Asset Inventory

### Existing Components (Phases 1-5 Easy)
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

---

## Pedagogical Rules (Same as Phase 3-5 Easy)

- **Beginner First**: Simple analogies, explain jargon immediately
- **Self-Explaining Visuals**: React Flow diagrams must be understandable at a glance
- **Strict Counts**: Tradeoffs (4-6), FAQ (4-6), Interview Notes (5), Takeaways (4-6)
- **18-Section Template**: Introduction, Why This Matters, Requirements, Capacity, API, Data Model, Architecture, Read/Write Paths, Deep Dives, Implementation Patterns, Scaling Strategy, Failure Scenarios, System Flows, Tradeoffs, FAQ, Interview Notes, Takeaways, Related Topics

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
- Router → Workers: animated, label "Channel dispatch"
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

### System Flows (Interactive) — `<PresenceDeliverySim />`

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

### System Flows (Interactive) — `<PresenceDeliverySim />`

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
**Cons:** WebSocket connections are expensive (memory per connection), message ordering adds complexity (per-conversation sequences), presence is high-churn metadata (5s heartbeats × millions of users), moderation/storage grows unboundedly

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

## Wave 2 Topic Plans

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

### System Flows (Interactive) — `<FeedFanoutSim />`

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

---

## Topic 4: Instagram

**File:** `src/content/case-studies/instagram.mdx`
**Difficulty:** Medium | **Wave:** 2 | **Order:** 4

### Introduction
"Instagram is like a photography gallery that rebuilds its exhibit walls every time you walk in. Behind the glamour, it's a massive media pipeline: upload photos, generate thumbnails, transcode videos, push them worldwide via CDN, and rank a personalized feed — all before you've finished scrolling."

### Why This Matters & Prerequisites
**Why This Matters:**
Instagram processes 200M+ photo/video uploads daily, each requiring multiple format conversions and global distribution via CDN. It combines the feed-ranking challenge from Twitter with a massive media processing pipeline. This makes it the best case study for learning async processing, object storage, and CDN architecture.

**Who Should Read This:**
- 🟢 **Beginners**: Understand media upload flows, CDN basics, and presigned URLs
- 🟡 **Intermediate**: Design async media processing pipelines with status tracking
- 🔴 **Advanced**: Optimize multi-region object replication, CDN cache invalidation, and story lifecycle

**Prerequisites:** [Twitter/X News Feed](/case-studies/twitter-news-feed), [Caching Strategies](/topics/caching-strategies), [Load Balancers](/topics/load-balancers), [Event-Driven Architecture](/topics/event-driven-architecture)

### Requirements
**Functional:**
1. Upload photo/video posts (with caption and audience controls)
2. Generate multiple media sizes/formats (thumbnail, medium, full)
3. Build personalized home feed and stories (24h ephemeral)
4. Support likes, comments, and basic ranking signals
5. Enforce privacy (public/private accounts, block lists)

**Non-Functional:**
1. Upload success rate ≥ 99.9%
2. Feed p99 < 350ms
3. CDN-first media delivery (> 90% hit rate)
4. Global availability with region failover

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Daily uploads | 200M/day | Photo + video |
| Avg upload size | 3MB photo, 18MB video | Pre-compression |
| Daily media ingest | ~2.5 PB/day | Raw + variants |
| Feed reads/day | 20B/day | Very read-heavy |
| CDN hit target | > 90% | Cost and latency control |
| Variants per upload | 4-6 | Thumbnail, small, medium, full, video HLS segments |

### API Design
```http
-- Step 1: Get presigned upload URL (client uploads directly to S3)
POST /api/v1/media/presign
Body: { contentType: "image/jpeg", size: 3145728, checksum: "sha256:..." }
Response: 200 { uploadUrl: "https://s3.../presigned", mediaId: "uuid" }

-- Step 2: Create post after upload completes
POST /api/v1/posts
Body: { mediaId: string, caption: string, audience: "public" | "followers" }
Response: 201 { postId, status: "processing" }

-- Step 3: Feed
GET /api/v1/feed/home?cursor=<opaque>&limit=20
Response: { items: [{ postId, authorId, mediaUrl, caption, score }], nextCursor }

-- Stories
GET /api/v1/stories/feed
Response: { tray: [{ userId, items: [{ mediaUrl, expiresAt }] }] }
```

### Data Model
```sql
media_assets (
  media_id UUID PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  type VARCHAR(16), -- image | video
  original_url TEXT, -- S3 path
  variants JSONB, -- { "thumb": "s3://...", "medium": "s3://...", "full": "s3://..." }
  status VARCHAR(16), -- uploaded | processing | ready | failed
  created_at TIMESTAMP
)

posts (
  post_id BIGINT PRIMARY KEY,
  author_id BIGINT NOT NULL,
  media_id UUID REFERENCES media_assets(media_id),
  caption TEXT,
  visibility VARCHAR(16), -- public | followers | private
  created_at TIMESTAMP
)

stories (
  id BIGINT PRIMARY KEY,
  author_id BIGINT,
  media_id UUID,
  expires_at TIMESTAMP, -- created_at + 24h
  created_at TIMESTAMP
)
```
**DB Choice:** PostgreSQL for posts/stories metadata (relational queries). S3-compatible object storage for media files. Redis for feed cache (sorted sets).

### Architecture Diagram (`instagram-arch`)

```
[Client] → [API Gateway] → [Upload Service] ─presign─→ [Object Storage (S3)]
                                    ↓                          ↓
                           [Post Service]              [Transcoding Queue]
                                    ↓                          ↓
                           [Feed/Ranking]              [Transcoding Workers]
                                    ↓                          ↓
                           [Feed Cache]                [Variant Store (S3)]
                                    ↓                          ↓
                           [Client]  ←──media──  [CDN (CloudFront)]
```

**Nodes:**
- `ClientNode` → "Client" (sublabel: "Upload · Browse · Stories")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit")
- `ServiceNode` → "Upload Service" (sublabel: "Presign · Validate · Track status")
- `DatabaseNode` → "Object Storage" (sublabel: "S3 · Raw uploads")
- `QueueNode` → "Transcoding Queue" (sublabel: "Kafka · Priority: photo > video")
- `ServiceNode` → "Transcoding Workers" (sublabel: "FFmpeg · ImageMagick · 4-6 variants")
- `DatabaseNode` → "Variant Store" (sublabel: "S3 · Thumbnails · HLS")
- `ServiceNode` → "Post Service" (sublabel: "Create · Validate media ready")
- `ServiceNode` → "Feed / Ranking" (sublabel: "Hybrid fanout · ML rank")
- `CacheNode` → "Feed Cache" (sublabel: "Redis · Sorted Sets")
- `LoadBalancerNode` → "CDN" (sublabel: "CloudFront · 90%+ hit rate · Edge PoPs")

**Edges:**
- Client → Gateway: animated, label "POST /media/presign"
- Upload Service → Object Storage: animated, label "Presigned URL (direct upload)"
- Client → Object Storage: animated (special dashed), label "Upload directly to S3 (bypasses API)"
- Object Storage → Transcoding Queue: animated, label "Upload complete event"
- Transcoding Queue → Workers: animated
- Workers → Variant Store: animated, label "thumb · medium · full · HLS"
- Workers → Post Service: animated, label "Status: ready"
- Post Service → Feed/Ranking: animated, label "post.created"
- Feed/Ranking → Feed Cache: animated
- CDN → Variant Store: dim, label "Origin fetch (cache miss)"
- CDN → Client: animated, label "Media delivery (cache hit 90%+)"

### Read & Write Paths
**Write (Upload):** Client → API Gateway → Upload Service generates presigned S3 URL → **Client uploads directly to S3** (key insight: no media bytes flow through the API) → S3 fires upload-complete event → Transcoding Queue → Workers generate 4-6 variants → mark `media_assets.status = 'ready'` → Post becomes visible in feed.
**Read (Feed):** Client → Feed API → reads Feed Cache (ranked post IDs) → returns post metadata with CDN URLs → Client fetches media from CDN → If CDN miss: CDN fetches from S3 origin → caches for next request.
**Stories:** Same upload pipeline but with `expires_at = now + 24h`. Background job archives expired stories to cold storage.

### Deep Dives
1. **Presigned Uploads:** Client uploads directly to S3 via presigned URL. This avoids routing large media files through the API servers (which would choke them). The API only handles metadata — never the bytes.
2. **Transcoding Pipeline:** Each upload generates 4-6 variants: thumbnail (150×150), small (320×320), medium (640×640), full (1080×1080), and for video: HLS segments (adaptive bitrate). Workers are stateless and autoscalable.
3. **Story Lifecycle:** Stories have a 24h TTL. A background scheduler job runs every minute, moving expired stories to cold storage (S3 Glacier). The stories tray API filters by `expires_at > now`.

### Implementation Patterns
**Presigned Upload Flow:**
```typescript
async function createPresignedUpload(userId: string, contentType: string, size: number) {
  const mediaId = uuid();
  const key = `uploads/${userId}/${mediaId}`;

  // Generate S3 presigned URL (expires in 15 min)
  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: 'instagram-uploads',
    Key: key,
    ContentType: contentType,
    Expires: 900
  });

  // Track upload status
  await db.mediaAssets.insert({ mediaId, ownerId: userId, status: 'uploaded', originalUrl: key });

  return { uploadUrl, mediaId };
}
```

**Post Creation with Media Gate:**
```typescript
async function createPost(input: CreatePostInput) {
  const media = await db.mediaAssets.findById(input.mediaId);

  if (media.status !== 'ready') {
    throw new Error(`Media not ready: ${media.status}`);
  }
  if (media.ownerId !== input.userId) {
    throw new ForbiddenError('Not your media');
  }

  const post = await db.posts.insert({ ...input, createdAt: new Date() });
  await kafka.produce('post.created', post);
  return post;
}
```

### Scaling Strategy
- **0→10M users:** Single-region media pipeline + CDN, basic chronological feed
- **10M→80M:** Partitioned transcoding queues (photo vs video), variant caching, ranked feed
- **80M→200M:** Multi-region object replication, edge transcoding for popular regions
- **Mature:** Region-aware ranking, edge personalization, adaptive CDN cache warming

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Transcoding backlog | Posts stuck in "processing" | Autoscale workers. Priority: photos > videos. Alert if queue > 5 min |
| Object storage region issue | Media unavailable | Cross-region replication with failover DNS. CDN serves cached copies |
| CDN purge bug | Users see stale/wrong media | Signed URL versioning (include content hash). CDN cache TTL: 24h |
| Ranking outage | Degraded feed quality | Recency fallback + cache last known good feed |
| Story expiration job fails | Stories persist beyond 24h | Redundant scheduler + API-level filter (`WHERE expires_at > NOW()`) |

**Production Monitoring:** Upload success rate, transcoding queue depth, CDN hit rate, feed p99, story expiration accuracy
**How Instagram Actually Differs:** Instagram uses a custom Django-based backend with Cassandra for feed storage. Their media pipeline processes 200M+ uploads/day using a custom transcoding service (not FFmpeg directly). They use a sophisticated CDN warmup strategy that pre-pushes popular content to edge PoPs before users request it.

### System Flows (Interactive) — `<FeedFanoutSim />` (reused) + Media Pipeline

**Controls:**
- **"Upload Photo" button** → Triggers the full upload → transcode → publish flow
- **"CDN Miss" button** → Shows origin fetch and cache population
- **"Story Timer" slider** → Fast-forwards the 24h story lifecycle
- **"Transcode Failure" toggle** → Shows retry behavior

**Animations:**
1. **"Upload Photo"**: Client node → Upload Service (generates presigned URL) → **dashed edge directly from Client to S3** (bypasses API — key visual insight) → S3 fires event → Transcoding Queue → Worker processes (status badge cycles: "processing" → "generating thumb" → "generating medium" → "ready" ✅) → Post Service creates post → Feed Cache updates → post appears in follower's feed
2. **"CDN Miss"**: Follower opens feed → Feed API returns media URLs → Client requests image from CDN → CDN node flashes **red "MISS"** → fallback edge to S3 origin lights up → media flows back → CDN node turns **green "CACHED"** → next request hits CDN directly (no origin)
3. **"Story Timer"**: Story node has a visual countdown (24:00:00 → 00:00:00). When timer hits zero → node dims → "→ Archive (S3 Glacier)" edge lights up → story disappears from tray
4. **"Transcode Failure"**: Worker node flashes red → retry edge to Transcoding Queue → re-processed → succeeds on second attempt → status badge: "ready"

### Tradeoffs (4/4)
**Pros:** CDN-first delivery gives sub-100ms media loads worldwide, presigned uploads avoid API bottleneck for large files, async transcoding decouples upload latency from processing, ranked feed drives engagement
**Cons:** High infrastructure cost (2.5 PB/day storage, CDN bandwidth), complex media lifecycle (upload → transcode → serve → archive → delete), eventual consistency between processing status and feed visibility, moderation challenges (must scan media before publishing)

### FAQ (4 Questions)
1. **Why presigned uploads instead of multipart through the API?** — Routing 3MB photos through your API servers would require massive bandwidth and block threads. Presigned URLs let the client upload directly to S3, reducing API server load by 99%.
2. **How to enforce upload security with presigned URLs?** — Presigned URLs are time-limited (15 min), tied to specific content types, and include a checksum. The Upload Service validates file size and type before generating the URL.
3. **When should video variants be generated?** — Immediately after upload for common sizes (720p, 480p, thumbnail). Rare sizes (4K, HLS) can be generated on-demand or lazily when first requested via CDN.
4. **How to handle deleted or privacy-restricted media?** — Delete from S3 + invalidate CDN cache (purge API). For privacy changes: update the access check at the URL signing layer, not at the media storage layer.

### Interview Notes (5 Points)
1. **Separate metadata from media bytes**: API handles metadata only. Media goes directly to object storage
2. **Async pipeline for heavy media transforms**: Never block the upload response on transcoding
3. **CDN is the primary read path**: 90%+ of media requests should never reach your origin servers
4. **Feed/ranking is independent from media processing**: A post becomes visible ONLY when `media.status = 'ready'`
5. **Story expiration needs redundancy**: Background job + API filter + TTL guarantees correct behavior

### Key Takeaways (5 Points)
1. Media products are bandwidth-constrained — presigned uploads and CDN are essential architectural patterns
2. Async processing (transcode queue → workers) avoids blocking writes and enables autoscaling
3. CDN hit rate directly drives both cost and user experience — monitor it obsessively
4. Feed reliability requires a ranking fallback (chronological) when the ML service is down
5. Media lifecycle management (upload → process → serve → archive → delete) is the hidden complexity

### Related Topics
`twitter-news-feed`, `caching-strategies`, `event-driven-architecture`, `load-balancers`, `kafka`

---

## Topic 5: Web Crawler

**File:** `src/content/case-studies/web-crawler.mdx`
**Difficulty:** Medium | **Wave:** 2 | **Order:** 5

### Introduction
"A web crawler is like a librarian who visits every library in the world, catalogs every book, and comes back regularly to check for new editions. The challenge: there are billions of libraries, some have strict visiting hours, and the librarian must never visit the same shelf twice."

### Why This Matters & Prerequisites
**Why This Matters:**
Google's crawler indexes 100B+ pages. Search engines, price comparison sites, AI training data pipelines, and threat detection systems all depend on reliable crawl infrastructure. The unique challenge is balancing throughput (crawl everything fast) with politeness (don't overload any single website).

**Who Should Read This:**
- 🟢 **Beginners**: Understand URL frontier, robots.txt, and basic crawl flow
- 🟡 **Intermediate**: Design host-based politeness with per-domain rate limiting
- 🔴 **Advanced**: Optimize Bloom filter dedup, adaptive recrawl scheduling, and distributed frontier sharding

**Prerequisites:** [Kafka](/topics/kafka), [Rate Limiting](/topics/rate-limiting), [Service Discovery](/topics/service-discovery), [Consistent Hashing](/topics/consistent-hashing)

### Requirements
**Functional:**
1. Ingest seed URLs and discover links recursively
2. Respect `robots.txt` and `crawl-delay` directives
3. Deduplicate URLs (canonicalize variants) and content (detect mirror sites)
4. Store page metadata and extracted text
5. Support adaptive recrawl scheduling (frequently-changing pages crawled more often)

**Non-Functional:**
1. Sustain 2M pages/minute crawl capacity
2. Per-host politeness guarantees (never overload a website)
3. High durability for crawl frontier state
4. Backpressure support for parse/index stages

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Frontier size | 10B URLs | Active + pending |
| Fetch rate | 2M pages/min | ~33K pages/sec |
| Avg HTML size | 120KB | Compressed transfer |
| Daily data ingest | ~350 TB/day | Raw + parsed metadata |
| Dedup Bloom filter | ~2 GB | 10B URLs × 1.5 bytes/URL |
| Recrawl cycle | 7-30 days | Varies by page freshness |

### API Design
```http
-- Seed injection (internal API)
POST /api/v1/crawler/seeds
Body: { urls: string[], priority: "low" | "normal" | "high" }
Response: 202 { accepted: number, duplicates: number }

-- Worker job assignment
GET /api/v1/crawler/jobs/next?workerId=<id>&capacity=10
Response: { jobs: [{ url, hostKey, politenessDelayMs }] }

-- Result submission
POST /api/v1/crawler/results
Body: { url, statusCode, contentHash, links: string[], fetchedAt, robotsTxt? }
Response: 200 { newLinksAccepted: number }
```

### Data Model
```sql
frontier (
  url_hash BYTEA PRIMARY KEY, -- SHA-256 of canonical URL
  canonical_url TEXT NOT NULL,
  host_key VARCHAR(128), -- "example.com"
  priority SMALLINT, -- 0=high, 1=normal, 2=low
  next_fetch_at TIMESTAMP, -- when this URL is eligible
  state VARCHAR(16), -- pending | leased | done | failed
  last_fetched_at TIMESTAMP,
  change_frequency INTERVAL -- adaptive: frequent changers get shorter intervals
)

crawl_results (
  id BIGSERIAL PRIMARY KEY,
  url_hash BYTEA,
  status_code INT,
  content_hash BYTEA, -- for content-level dedup
  extracted_text TEXT,
  out_links JSONB, -- discovered URLs
  fetched_at TIMESTAMP
)

host_state (
  host_key VARCHAR(128) PRIMARY KEY,
  robots_txt TEXT,
  robots_fetched_at TIMESTAMP,
  crawl_delay_ms INT DEFAULT 1000, -- from robots.txt or default
  last_fetch_at TIMESTAMP -- for politeness enforcement
)
```
**DB Choice:** RocksDB (embedded) or Cassandra for frontier (high write throughput, range scans). Bloom filter in Redis/memory for fast URL dedup. Elasticsearch for crawled content indexing.

### Architecture Diagram (`web-crawler-arch`)

```
[Seed API] → [Frontier Service] → [URL Frontier Queue (by host)]
                                         ↓
                                   [Fetcher Workers (pool)]
                                         ↓
                                   [Parser Workers]
                                    ↙          ↘
                            [Dedup Service]   [Index Store]
                            (Bloom Filter)    (Elasticsearch)
                                    ↓
                            [New URLs → back to Frontier]

                            [Robots Service] ← robots.txt cache
```

**Nodes:**
- `ServiceNode` → "Seed API" (sublabel: "Inject starting URLs")
- `ServiceNode` → "Frontier Service" (sublabel: "Priority Queue · URL Scheduling · Host grouping")
- `QueueNode` → "URL Frontier Queue" (sublabel: "Host-partitioned · Priority-sorted")
- `ServiceNode` x3 → "Fetcher Worker 1" (sublabel: "HTTP GET · Timeout 30s"), "Fetcher Worker 2", "Fetcher Worker 3"
- `ServiceNode` → "Parser Workers" (sublabel: "Extract links · Clean HTML · Extract text")
- `ServiceNode` → "Dedup Service" (sublabel: "Bloom Filter · URL canonicalization")
- `DatabaseNode` → "Index Store" (sublabel: "Elasticsearch · Full-text search")
- `ServiceNode` → "Robots Service" (sublabel: "robots.txt cache · crawl-delay enforcement")
- `CacheNode` → "Host State Cache" (sublabel: "Redis · Last fetch time · Politeness timers")

**Edges:**
- Seed API → Frontier: animated, label "Inject seeds"
- Frontier → Queue: animated, label "Schedule by priority + host delay"
- Queue → Fetcher Workers: animated, label "Lease URL (with politeness check)"
- Fetcher → Robots Service: animated, label "Check robots.txt"
- Fetcher → Parser: animated, label "Raw HTML"
- Parser → Dedup: animated, label "Discovered URLs"
- Dedup → Frontier: animated (for new URLs), label "New URL → enqueue"
- Dedup → Frontier: dim/red (for duplicates), label "DUPLICATE → reject"
- Parser → Index Store: animated, label "Store crawled content"
- Robots Service → Fetcher: animated, label "Allow / Disallow / Delay"

### Read & Write Paths
**Write (Crawl Cycle):** Frontier selects highest-priority URL whose host is past its politeness delay → Leases URL to Fetcher Worker → Worker checks robots.txt via Robots Service → if allowed: fetch page → pass to Parser → Parser extracts links + text → new URLs go to Dedup Service → Bloom filter check → if new: insert into Frontier. If duplicate: discard.
**Read (Index Query):** Search/analytics service queries Index Store (Elasticsearch) for crawled content.

### Deep Dives
1. **URL Canonicalization:** Before dedup, normalize: lowercase host, remove trailing slash, sort query params, remove tracking params (utm_source, fbclid), resolve relative URLs. This prevents crawling the same page under different URL variants.
2. **Host-Based Politeness:** Each host has a `crawl_delay_ms` (from robots.txt or default 1s). The Frontier never schedules two URLs from the same host within the delay window. This is enforced via `host_state.last_fetch_at + crawl_delay_ms < now`.
3. **Bloom Filter Dedup:** A Bloom filter with 10B entries × 10 hash functions fits in ~2GB RAM. False positive rate: ~0.01% (0.01% of unique URLs incorrectly skipped). Trade-off: tiny number of missed pages vs massive memory savings over a full hash set.

### Implementation Patterns
**Politeness-Aware Scheduling:**
```typescript
async function getNextBatch(workerId: string, capacity: number) {
  const now = Date.now();
  const batch = [];

  // Get eligible hosts (past their politeness delay)
  const eligibleHosts = await db.hostState.findMany({
    where: { lastFetchAt: { lt: new Date(now - host.crawlDelayMs) } },
    orderBy: { lastFetchAt: 'asc' },
    take: capacity
  });

  for (const host of eligibleHosts) {
    // Get highest-priority pending URL for this host
    const url = await db.frontier.findFirst({
      where: { hostKey: host.hostKey, state: 'pending', nextFetchAt: { lte: new Date() } },
      orderBy: { priority: 'asc' }
    });

    if (url) {
      await db.frontier.update({ where: { urlHash: url.urlHash }, data: { state: 'leased' } });
      await db.hostState.update({ where: { hostKey: host.hostKey }, data: { lastFetchAt: new Date() } });
      batch.push({ url: url.canonicalUrl, hostKey: host.hostKey, politenessDelayMs: host.crawlDelayMs });
    }
  }
  return batch;
}
```

**Bloom Filter URL Dedup:**
```typescript
class URLDedup {
  private bloom: BloomFilter; // ~2GB for 10B URLs

  isNew(canonicalUrl: string): boolean {
    const hash = sha256(canonicalUrl);
    if (this.bloom.has(hash)) return false; // Probably seen before
    this.bloom.add(hash);
    return true; // Definitely new
  }
}
```

### Scaling Strategy
- **0→50M URLs:** Single frontier cluster, 10 fetcher workers, in-memory Bloom filter
- **50M→1B:** Shard frontier by host hash, scale fetcher pool to 100+, distributed Bloom filter
- **1B→10B:** Region-aware crawl partitions, content-level dedup (SimHash), Bloom filter tiers (RAM + disk)
- **Mature:** Adaptive recrawl scheduling (news sites: hourly, static sites: monthly), priority by page importance (PageRank)

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Frontier corruption | Crawl gaps or duplicates | WAL + periodic checkpoints + replay from last checkpoint |
| Parser lag (queue buildup) | Fetchers outpace parsers | Separate fetch and parse queues. Backpressure: pause scheduling when parse queue > threshold |
| Host abuse complaints | Legal/reputation risk | Strict robots.txt compliance + per-host rate limits. Abuse report webhook |
| Bloom filter false positive spike | Good URLs incorrectly skipped | Monitor false positive rate. Rebuild filter periodically. Secondary dedup via DB check for flagged URLs |
| Malicious page (infinite links) | Crawl resources wasted | Max links per page (1000). Max page size (5MB). Max depth per domain (50) |

**Production Monitoring:** Pages crawled/min, Bloom filter FP rate, frontier queue depth per host, politeness violation rate, parser lag
**How Google Differs:** Google's crawler (Googlebot) uses a custom distributed system spanning thousands of machines. They use PageRank to prioritize crawling important pages first. Their frontier uses a MapReduce-style batch processing model, not a real-time queue. They also run a separate "freshness" crawler that recrawls frequently-changing pages on a faster schedule.

### System Flows (Interactive) — `<CrawlerFrontierSim />`

**Controls:**
- **"Add Seed URL" input** → User types a URL to inject into the frontier
- **"Crawl Next" button** → Triggers the next eligible URL fetch
- **"Duplicate URL" button** → Attempts to add a URL that already exists
- **"Speed" slider** → Controls crawl animation speed

**Animations:**
1. **"Add Seed URL"**: URL appears in the Frontier → normalized (visual: "HTTP://Example.COM/page?b=2&a=1" transforms to "http://example.com/page?a=1&b=2") → Bloom filter check (bits flip animation) → "NEW ✅" badge → URL enters the host's queue lane
2. **"Crawl Next"**: Frontier scans host lanes → finds the host whose politeness timer has expired (**timer countdown visible per host lane: "google.com: ⏱️ 0.0s READY" vs "twitter.com: ⏱️ 1.3s WAIT"**) → selects highest-priority URL → Fetcher Worker edge lights up → Robots Service check ("✅ Allowed") → page fetched → Parser extracts 5 links → new links flow back to Dedup → 3 are new (green → enter frontier), 2 are duplicates (red "DUPLICATE ✗" → discarded)
3. **"Duplicate URL"**: URL enters → normalization → Bloom filter check → bits already set → **"DUPLICATE ✗"** stamp with red border → URL discarded. A subtle counter shows "Deduped: 42,891 / Total: 100,000 (42.9% savings)"
4. **Politeness Visual**: Each host lane shows a countdown timer. When a fetch completes for a host, the timer **resets to the crawl-delay value** (e.g., "example.com: ⏱️ 2.0s"). The timer counts down in real-time. URLs in that host's queue are visually "locked" (greyed out) until the timer reaches 0
5. **Robots.txt Block**: If a URL is disallowed by robots.txt, the Fetcher → Robots edge shows **🚫 "Disallowed by robots.txt"** → URL marked as `state: 'blocked'` → removed from frontier

### Tradeoffs (4/4)
**Pros:** Scalable pipeline architecture (fetch/parse/index stages decouple), Bloom filter enables memory-efficient dedup at billion-URL scale, host-based politeness prevents legal issues, adaptive recrawl optimizes freshness
**Cons:** High storage/network cost (350 TB/day), complex dedup correctness (canonicalization edge cases), strong ops burden (robots.txt changes, abuse handling), Bloom filter has inherent false positive rate (trade-off vs memory)

### FAQ (4 Questions)
1. **Why host-based scheduling instead of global FIFO?** — Global FIFO would hit the same host repeatedly in bursts, overwhelming target servers. Host-based scheduling enforces per-domain rate limits and politeness delays.
2. **How to detect duplicate content (not just duplicate URLs)?** — Content-level dedup using SimHash or MinHash. If two pages from different URLs have > 95% similarity, mark as duplicate content. Saves storage and indexing cost.
3. **How often should pages be recrawled?** — Adaptive: compute a `change_frequency` per URL based on historical changes. News sites: hourly. Documentation: weekly. Static pages: monthly.
4. **How to protect crawler infrastructure from malicious pages?** — Max page size (5MB), max links per page (1000), max redirects (10), request timeout (30s), sandbox parsers in isolated containers.

### Interview Notes (5 Points)
1. **Frontier is the heart**: Priority queue + host-aware scheduling determines crawl quality and legality
2. **Politeness is mandatory**: robots.txt compliance + per-host rate limiting. Not optional
3. **Separate fetch from parse**: Different scaling profiles. Fetchers are I/O-bound, parsers are CPU-bound
4. **Dedup at two levels**: URL-level (Bloom filter, cheap) + content-level (SimHash, catches mirrors)
5. **Recrawl policy should be adaptive**: Static pages monthly, news hourly. Base on observed change frequency

### Key Takeaways (5 Points)
1. Web crawlers are distributed pipelines — fetch, parse, dedup, and index are separate, scalable stages
2. Frontier scheduling (priority + politeness) is the single most important design decision
3. Bloom filter dedup saves massive cost — 2GB RAM filters 10B URLs with 0.01% false positive rate
4. Backpressure between stages keeps the entire pipeline stable under load
5. Observability and safety controls (max depth, max links, robots.txt) are required for production crawling

### Related Topics
`kafka`, `rate-limiting`, `service-discovery`, `consistent-hashing`, `event-driven-architecture`

---

## New Simulation Component Specs

### `FeedFanoutSim` — Twitter + Instagram
| Attribute | Detail |
|---|---|
| **Type** | Simulation component |
| **Controls** | "Post (Normal)" button, "Post (Celebrity)" button, "Fanout Mode" toggle (write/read/hybrid), "Ranking Down" toggle |
| **Visual** | Dual `LaneNode` comparison. Left = fanout-on-write (tree of edges fanning to follower caches). Right = fanout-on-read (single write, merge at read) |
| **Metrics** | Live cost counter: "Writes: X" / "Read merges: Y" |
| **Wow factor** | Celebrity toggle visually switches fanout path + crossed-out cost counter (50M writes → 1 write) |
| **Reused by** | `twitter-news-feed.mdx`, `instagram.mdx` |

### `PresenceDeliverySim` — Chat + Notification
| Attribute | Detail |
|---|---|
| **Type** | Simulation component |
| **Controls** | "Send Message" / "Send Notification" button, "Go Online/Offline" toggle, "Channel Preference" selector, "Read Message" button |
| **Visual** | Pulsing green presence dots (online), grey (offline). Delivery receipt badges: ✓ → ✓✓ → ✓✓ blue. Multi-channel lanes for notifications (Push/SMS/Email) |
| **Wow factor** | Read receipt animation mirrors WhatsApp's iconic blue ticks. Provider failure triggers visual channel fallback |
| **Reused by** | `chat-system.mdx`, `notification-system.mdx` |

### `CrawlerFrontierSim` — Web Crawler
| Attribute | Detail |
|---|---|
| **Type** | Simulation component |
| **Controls** | "Add Seed URL" input, "Crawl Next" button, "Duplicate URL" trigger, "Speed" slider |
| **Visual** | Host-grouped URL queues with per-host countdown timers. Bloom filter bit-flip animation. URL canonicalization transform. Robots.txt 🚫 block |
| **Wow factor** | Real-time politeness timers per host. Dedup savings counter. URL normalization visual transform |
| **Reused by** | `web-crawler.mdx` only |

---

## Dependency Matrix

| Topic | Diagram Config ID | New Component | Blocking Risk |
|---|---|---|---|
| Notification System | `notification-system-arch` | `PresenceDeliverySim` | Medium |
| Chat System | `chat-system-arch` | `PresenceDeliverySim` (reuse) | Medium |
| Twitter News Feed | `twitter-news-feed-arch` | `FeedFanoutSim` | High |
| Instagram | `instagram-arch` | `FeedFanoutSim` (reuse) | Medium |
| Web Crawler | `web-crawler-arch` | `CrawlerFrontierSim` | High |

---

## Implementation Order

1. Build diagram configs for Wave 1 topics (notification-system-arch, chat-system-arch)
2. Build `PresenceDeliverySim` component
3. Implement Wave 1 content (notification-system.mdx, chat-system.mdx)
4. Run Wave 1 verification checklist
5. Build `FeedFanoutSim` and `CrawlerFrontierSim` components
6. Implement Wave 2 content (twitter-news-feed.mdx, instagram.mdx, web-crawler.mdx)
7. Run full Phase 5 Medium verification checklist

---

## Verification Plan (Manual Only)

### Wave 1 Verification
- [ ] `notification-system.mdx` renders with full 18-section structure
- [ ] `chat-system.mdx` renders with full 18-section structure
- [ ] Both architecture diagrams render with sublabeled nodes and animated edges
- [ ] `PresenceDeliverySim` works: presence dots + delivery receipts + channel fallback
- [ ] Tradeoffs (4+/4+), FAQ (4+), Interview Notes (5), Takeaways (5) counts verified

### Wave 2 Verification
- [ ] `twitter-news-feed.mdx` renders with full 18-section structure
- [ ] `instagram.mdx` renders with full 18-section structure
- [ ] `web-crawler.mdx` renders with full 18-section structure
- [ ] `FeedFanoutSim` demonstrates: write/read/hybrid toggle, celebrity mode, cost counter
- [ ] `CrawlerFrontierSim` demonstrates: politeness timers, Bloom dedup, robots.txt block
- [ ] All 3 failure scenario tables have mitigation strategies
- [ ] Related topics links are correct

### Exit Criteria
- [ ] All 5 medium case studies complete in `src/content/case-studies/`
- [ ] All 3 new simulation components implemented and functional
- [ ] All diagram configs defined with full node/edge specs
- [ ] No placeholder markers (`TODO`, `TBD`, or missing sections)
- [ ] `Execution-Plan.md` Phase 5 Medium status can be marked complete

