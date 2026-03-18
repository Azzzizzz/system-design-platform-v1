# Phase 5 (Hard): Case Studies Sprint Plan — Part 1

> **Goal:** Define implementation-ready specs for Wave 1 of the Hard case studies: WhatsApp, Uber, and YouTube. These topics set the premium interaction bar for the most complex system flows in the product.

---

## Wave Strategy (Hard — 9 Topics, 3 Waves)

- **Wave 1 (This doc):** WhatsApp, Uber, YouTube — real-time + geospatial + streaming
- **Wave 2 (Part 2):** Netflix, Zoom / Google Meet, Google Docs — media + collaboration
- **Wave 3 (Part 3):** Google Drive / Dropbox, Search Engine, Amazon — storage + search + capstone
- **Part 1 Scope:** Covers Wave 1 so later Hard waves can inherit proven interaction patterns for encryption, geospatial matching, and media pipelines
- **Gate:** Each wave must pass verification before the next begins.

---

## Reusable Asset Inventory

### Reusable Visual Primitives (existing or required before wave start)
| Node/Edge/Sim | Reused As |
|---|---|
| `ClientNode` | Users, drivers, riders, viewers, uploaders |
| `ServiceNode` | API servers, workers, matchers, transcoders |
| `DatabaseNode` | Primary DBs, message stores, geo indexes |
| `LoadBalancerNode` | API Gateway, CDN, WebSocket gateway |
| `CacheNode` | Session cache, geo cache, hot data, presence |
| `QueueNode` | Kafka topics, transcoding queues, event streams |
| `LaneNode` | Side-by-side strategy comparisons |
| `AnimatedEdge` | All flow arrows |
| `PresenceDeliverySim` | Reuse for WhatsApp delivery receipts |

### New Components Needed (Phase 5 Hard — Wave 1)
| Component | Type | Purpose | Reused By |
|---|---|---|---|
| `E2EEncryptionSim` | Simulation | Signal protocol key exchange + message encryption flow | WhatsApp |
| `GeoMatchingSim` | Simulation | QuadTree spatial index + driver-rider matching with surge | Uber |
| `TranscodingPipelineSim` | Simulation | Video upload → adaptive bitrate transcoding → CDN delivery | YouTube, Netflix (Wave 2) |

---

> **Planning rule:** Hard topics may reuse Medium primitives only when the teaching story remains clear. If a shared primitive cannot explain the Hard-topic concept without heavy narration, define a dedicated simulation or wrapper before implementation.

---

## Visualization Contract (Mandatory For Hard Wave 1)

Hard case studies are the clearest proof that this product can teach dense distributed systems visually. Every React Flow visualization must help the user reason about the system under `normal`, `alternate`, and `degraded` conditions, not just display topology.

### Required Interaction Model

| Interaction | Required Behavior | Learning Purpose |
|---|---|---|
| Hover | Short explanation for `what this component does` and `why it exists` | Makes dense systems readable |
| Click | Open inspect state for the selected node/edge with role, hot path, and failure role | Supports deliberate exploration |
| Scenario Toggle | Switch between at least 3 meaningful states: `normal`, `alternate strategy`, `failure/degraded` | Teaches tradeoffs visually |
| Replay / Reset | Replay active flow and reset to baseline | Supports repetition and interview prep |
| Visible Legend | Explain colors, line styles, badges, queue states, map zones, and overlays | Prevents hidden meaning |

### Required Visual Grammar

- Every node must have a clear label and short sublabel.
- Every important edge must name the action or payload (`pre-key fetch`, `match offer`, `segment request`, `retry`, `direct delivery`).
- Use layered disclosure: default view = main path; secondary paths appear through focus states or scenario toggles.
- Keep the main path readable before overlays, counters, or alternate branches are introduced.
- State colors must be consistent:
  - Green: success / delivered / accepted / hot path success
  - Amber: fallback / merge / deferred / degraded
  - Red: blocked / failure / retry / reject
  - Blue: client-facing / request / read path
- Complex overlays such as surge zones, queue lanes, delivery states, and ABR gauges must remain understandable without reading the paragraph below the visualization.

---

## React Flow Readiness Checklist

These items must be complete before Hard Wave 1 implementation starts.

- [ ] All shared case-study prerequisites from Easy and Medium are complete
- [ ] `ArchitectureCanvas` supports hover explanations, click inspection, scenario toggles, replay/reset behavior, and a visible legend for dense diagrams
- [ ] `CacheNode`, `QueueNode`, and `CapacityEstimationCard` are available in the case-study stack
- [ ] `diagramConfigs.ts` contains:
  - [ ] `whatsapp-arch`
  - [ ] `uber-arch`
  - [ ] `youtube-arch`
- [ ] Wave 1 simulation scope is explicit:
  - [ ] `E2EEncryptionSim` is scoped to the WhatsApp encryption + delivery story
  - [ ] `GeoMatchingSim` is scoped to the Uber geospatial matching story
  - [ ] `TranscodingPipelineSim` supports the YouTube media-pipeline story and a later Netflix-specific wrapper or mode
- [ ] Status badges, zone overlays, queue lanes, and failure-state language are standardized before topic implementation

---

## Shared Simulation Strategy

### `E2EEncryptionSim`

- Treat as a dedicated WhatsApp simulation.
- It may reuse delivery-receipt and presence tokens from `PresenceDeliverySim`, but it must add first-contact key exchange, ciphertext state, offline queue delivery, and group fan-out as first-class teaching states.

### `GeoMatchingSim`

- Treat as a dedicated Uber simulation.
- It must teach location ingest, spatial query, driver offer cascade, surge zone overlay, and tracking updates. A mini-map is required because the spatial index is part of the concept, not decorative chrome.

### `TranscodingPipelineSim`

- Treat as a shared media-pipeline primitive across Hard waves.
- `youtube` teaches upload, transcode queue, progressive variant readiness, CDN hit/miss, and adaptive bitrate playback.
- Later Netflix reuse must add a playback-focused wrapper or mode. It must not ship as a renamed YouTube upload simulation.

---

## Topic-Specific Visual Grammar

These rules are mandatory for Wave 1 so the hardest concepts stay readable without relying on surrounding prose.

### WhatsApp

- **Default view = one 1:1 encrypted message path**. Group fan-out, media transfer, and first-contact key exchange appear only through scenario controls.
- **Edge styling must be explicit**:
  - Blue = session bootstrap / key exchange / client request
  - Green = healthy delivery / decrypt / receipt progression
  - Amber = offline queue / reconnect / delayed delivery
  - Red = intercept attempt / blocked delivery / failure state
- **Plaintext vs ciphertext must be visually impossible to confuse**: plaintext appears only on sender/recipient nodes. The server path must always show encrypted blobs or lock-state badges.
- **Receipt progression must stay visible on the canvas**: `✓`, `✓✓`, and `✓✓ blue` are part of the system behavior, not decorative icons.

### Uber

- **Control plane and motion plane must be visually separated**: rider request / match state should not look identical to high-frequency location ingestion.
- **Edge styling must be explicit**:
  - Blue = rider request / rider-facing tracking
  - Green = healthy match / accepted route / active trip state
  - Amber = search expansion / surge / rejection cascade / degraded location freshness
  - Red = no-driver or failed-match state
- **Map overlays are mandatory**: the mini-map must always show the search radius, active drivers, and the spatial index overlay or zone model that explains why the match was chosen.
- **Default scenario must stay small**: one rider and a small driver set first. Density, surge, and rejection cascades expand through controls so the first read stays understandable.

### YouTube

- **Default view = upload-to-first-playable path**. Recommendations, long-tail cache behavior, and live-streaming edge cases appear only through scenario toggles or secondary focus.
- **Edge styling must be explicit**:
  - Blue = upload / manifest request / viewer-facing control flow
  - Green = successful transcode / ready variant / CDN hit / healthy playback
  - Amber = queue backlog / cache miss / variant warming / degraded bandwidth
  - Red = failed transcode / stalled pipeline / playback risk state
- **Variant readiness must be visible on the canvas**: the user should see which qualities are ready, pending, retrying, or skipped without reading the paragraph below.
- **ABR state must be visually tied to playback**: the quality gauge, segment size change, and buffering badge need to feel like one system, not separate UI ornaments.

---

## Pilot Sequence

Use a staged pilot approach instead of implementing all three Wave 1 topics in parallel.

### Stage 1: `TranscodingPipelineSim` Pilot

- Start with **YouTube** because it sets the visual standard for high-density pipelines and is reused by Netflix in Wave 2.
- Use it to validate layered flow teaching: upload, transcode, cache miss, and ABR fallback without overwhelming the default view.

### Stage 2: `GeoMatchingSim` Pilot

- Move to **Uber** after the media-pipeline interaction pattern is proven.
- Use it to validate map overlays, query radius teaching, and rejection/fallback states.

### Stage 3: `E2EEncryptionSim` Pilot

- Implement **WhatsApp** after the other two pilots establish the visual grammar for dense, stateful flows.
- Use it to validate encryption-state storytelling without leaking into cryptography jargon that the visual itself cannot explain.

---

## Pedagogical Rules (Same as Phase 5 Easy/Medium)

- **Beginner First**: Simple analogies, explain jargon immediately
- **Self-Explaining Visuals**: React Flow diagrams must be understandable at a glance
- **Strict Counts**: Tradeoffs (4-6), FAQ (4-6), Interview Notes (5), Takeaways (4-6)
- **18-Section Template**: Introduction, Why This Matters, Requirements, Capacity, API, Data Model, Architecture, Read/Write Paths, Deep Dives, Implementation Patterns, Scaling Strategy, Failure Scenarios, System Flows, Tradeoffs, FAQ, Interview Notes, Takeaways, Related Topics
- **Inherited Quality Bar**: Hard topics must pass the same visualization contract and review rigor established in Easy and Medium before the wave can be marked complete

---

## Topic 1: WhatsApp

**File:** `src/content/case-studies/whatsapp.mdx`
**Difficulty:** Hard | **Wave:** 1 | **Order:** 1

### Introduction
"WhatsApp is like a sealed envelope postal system — every message is locked (encrypted) so that only the sender and recipient can read it, not even the post office (WhatsApp's servers) can peek inside. The hard part: delivering 100B+ sealed envelopes per day, ensuring none are lost, and handling groups of up to 1,024 people."

### Why This Matters & Prerequisites
**Why This Matters:**
WhatsApp handles 100B+ messages/day for 2B+ users with end-to-end encryption, making it the most-used messaging system in the world. Unlike our Medium-level Chat System (which focused on message ordering and presence), WhatsApp adds E2E encryption (Signal Protocol), multi-device sync without server-side access to plaintext, delivery guarantees across flaky mobile networks, and group messaging at massive scale. This is the definitive messaging interview question.

**Who Should Read This:**
- 🟢 **Beginners**: Understand message delivery guarantees and basic encryption concepts
- 🟡 **Intermediate**: Design multi-device sync with E2E encryption, group key distribution
- 🔴 **Advanced**: Optimize for unreliable mobile networks, handle device key rotation, and scale group messaging

**Prerequisites:** [Chat System](/case-studies/chat-system), [Kafka](/topics/kafka), [Consistent Hashing](/topics/consistent-hashing), [Exactly-Once Processing](/topics/exactly-once-processing)

### Requirements
**Functional:**
1. 1:1 and group messaging (up to 1,024 members)
2. End-to-end encryption (server cannot read message content)
3. Delivery receipts (✓ sent to server, ✓✓ delivered to device, ✓✓ blue read)
4. Multi-device support (phone, web, desktop — all synced)
5. Media sharing (photos, videos, documents) with E2E encryption
6. Last seen / online presence with privacy controls

**Non-Functional:**
1. Message delivery p99 < 500ms (on stable network)
2. 99.99% message durability (zero silent loss)
3. Server MUST NOT have access to plaintext messages
4. Offline message queuing with reliable delivery on reconnect
5. Support 2B+ registered users, 100B+ messages/day

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Registered users | 2B+ | Global reach |
| DAU | 500M | ~25% daily active |
| Messages/day | 100B | ~200 msgs/user/day average |
| Peak message rate | 5M msg/sec | Burst during events/holidays |
| Avg message size | 1.5 KB | Encrypted payload + metadata |
| Media messages/day | 7B | ~7% of total messages |
| Avg media size | 2 MB (photo), 15 MB (video) | Compressed + encrypted |
| Daily data ingest | ~300 TB | Text + media combined |
| Message retention on server | Until delivered (ephemeral) | Not stored permanently |

### API Design
```http
-- Message send (REST fallback; primary path is WebSocket/MQTT)
POST /api/v1/messages
Body: {
  recipientId: string,
  encryptedPayload: base64, -- E2E encrypted by client
  messageType: "text" | "image" | "video" | "document",
  clientMsgId: string, -- client-generated for dedup
  timestamp: number
}
Response: 202 { serverMsgId, serverTimestamp, status: "queued" }

-- Group message
POST /api/v1/groups/{groupId}/messages
Body: {
  encryptedPayloads: { [memberId]: base64 }, -- one per member key
  messageType: string,
  clientMsgId: string
}

-- Key exchange (Signal Protocol)
POST /api/v1/keys/prekeys
Body: { identityKey, signedPreKey, oneTimePreKeys: [100 keys] }

GET /api/v1/keys/{userId}/bundle
Response: { identityKey, signedPreKey, oneTimePreKey }

-- Delivery status
WebSocket events:
  SERVER_ACK { serverMsgId, status: "received" } -- ✓
  DELIVERED { serverMsgId, recipientId } -- ✓✓
  READ { serverMsgId, readerId } -- ✓✓ blue
```

### Data Model
```sql
-- Server only stores encrypted blobs + metadata (NO plaintext)
message_queue (
  server_msg_id BIGINT PRIMARY KEY,
  sender_id BIGINT NOT NULL,
  recipient_id BIGINT NOT NULL, -- for 1:1; NULL for group
  group_id BIGINT, -- for group messages
  encrypted_payload BYTEA NOT NULL, -- E2E encrypted, opaque to server
  message_type VARCHAR(16),
  client_msg_id VARCHAR(64), -- for dedup
  server_timestamp TIMESTAMP,
  status VARCHAR(16), -- queued | delivered | expired
  expires_at TIMESTAMP -- TTL: 30 days max
)

-- Key store (public keys only — server never has private keys)
key_bundles (
  user_id BIGINT NOT NULL,
  identity_key BYTEA NOT NULL,
  signed_pre_key BYTEA NOT NULL,
  signed_pre_key_sig BYTEA NOT NULL,
  one_time_pre_keys BYTEA[], -- array of single-use keys
  updated_at TIMESTAMP
)

-- Group metadata (server knows membership, NOT message content)
groups (
  group_id BIGINT PRIMARY KEY,
  name_encrypted BYTEA, -- only members can decrypt
  admin_ids BIGINT[],
  member_ids BIGINT[],
  created_at TIMESTAMP
)
```
**DB Choice:** Cassandra for message queue (high write throughput, auto-expiry TTL). PostgreSQL for key bundles and group metadata. Redis for presence/online status and connection routing.

### Architecture Diagram (`whatsapp-arch`)

```
[Alice (Client)] ─ws─→ [Connection Gateway]
                              ↓
                        [Message Router]
                      ↙     ↓      ↘
               [Message Queue] [Presence / Routing Cache] [Key Server]
               (Cassandra)          (Redis)              (Pre-key bundles)
                    ↓
              [Delivery Workers]
                    ↓
          [Bob's Connection Gateway] ─ws─→ [Bob (Client)]
          
[Media Path:]
[Alice] ─presign─→ [Media Service] → [Encrypted Blob Store (S3)]
                                        ↓ (URL in message)
                              [Bob downloads + decrypts locally]
```

**Nodes:**
- `ClientNode` x2 → "Alice" (sublabel: "🟢 Online · Device: iPhone"), "Bob" (sublabel: "⚫ Offline · Device: Android")
- `ServiceNode` x2 → "Connection Gateway" (sublabel: "Alice ingress · WebSocket/MQTT · Sticky sessions"), "Bob's Connection Gateway" (sublabel: "Recipient ingress · WebSocket/MQTT")
- `ServiceNode` → "Message Router" (sublabel: "Route by recipient · Dedup by clientMsgId")
- `QueueNode` → "Message Queue" (sublabel: "Cassandra · Per-recipient queue · TTL 30 days")
- `ServiceNode` → "Key Server" (sublabel: "Signal Protocol · Pre-key bundles · Identity verification")
- `ServiceNode` → "Delivery Workers" (sublabel: "Stateless · Pull from queue · Push to gateway")
- `ServiceNode` → "Media Service" (sublabel: "Presigned URLs · Encrypted blob upload")
- `DatabaseNode` → "Encrypted Blob Store" (sublabel: "S3 · AES-256 encrypted · Client holds key")
- `CacheNode` → "Presence / Routing Cache" (sublabel: "Redis · User→Gateway mapping · Online status")

**Edges:**
- Alice → Connection Gateway: animated, label "WebSocket (TLS)"
- Gateway → Message Router: animated, label "Encrypted payload"
- Router → Message Queue: animated, label "Enqueue (recipient offline)"
- Router → Bob's Gateway: animated (when online), label "Direct delivery"
- Message Queue → Delivery Workers: animated, label "Pull pending messages"
- Delivery Workers → Bob's Gateway: animated, label "Push on reconnect"
- Alice → Key Server: animated (during first contact), label "Fetch Bob's pre-key bundle"
- Alice → Media Service: animated (dashed), label "Upload encrypted media"
- Media Service → Blob Store: animated, label "Store encrypted blob"
- Bob → Blob Store: dim, label "Download + decrypt locally"

### Read & Write Paths
**Write (Send Message):**
1. Alice's client encrypts message using Bob's public key (Signal Protocol: Double Ratchet)
2. Encrypted payload sent via WebSocket to Connection Gateway
3. Message Router checks `clientMsgId` for dedup → routes to Bob
4. If Bob is online: direct delivery via his Gateway → **✓✓ delivered**
5. If Bob is offline: enqueue in Cassandra (per-recipient partition, TTL 30 days) → **✓ sent to server**
6. Server sends `SERVER_ACK` back to Alice → she sees **✓**

**Read (Receive / Reconnect):**
1. Bob comes online → Connection Gateway registers with Routing Cache
2. Delivery Workers pull all pending messages from Bob's queue
3. Messages delivered in order via WebSocket → each triggers **✓✓ delivered** back to Alice
4. Bob opens conversation → `READ` event sent → Alice sees **✓✓ blue**

**Media:** Alice encrypts media with random AES key → uploads encrypted blob to S3 → sends AES key inside the E2E encrypted message → Bob downloads blob + decrypts locally.

### Deep Dives
1. **Signal Protocol (Double Ratchet):** Each message uses a unique encryption key derived from a ratcheting chain. Even if one key is compromised, past and future messages remain secure (forward secrecy). The server stores pre-key bundles (public keys only) for initial key exchange. After the first message, both parties maintain a shared ratchet state.
2. **Multi-Device E2E Encryption:** Each device has its own key pair. When Alice sends a group message, she encrypts it separately for each member's each device. For a 100-member group where each member has 2 devices, Alice generates 200 encrypted copies. This is the "fan-out encryption" challenge.
3. **Offline Message Queuing:** Messages for offline users are stored in Cassandra with a per-recipient partition key. When a user reconnects, all pending messages are streamed in timestamp order. Messages expire after 30 days (TTL). The server never retains messages after successful delivery.

### Implementation Patterns
**Signal Protocol Key Exchange:**
```typescript
async function initiateSession(senderId: string, recipientId: string) {
  // 1. Fetch recipient's pre-key bundle from Key Server
  const bundle = await keyServer.getPreKeyBundle(recipientId);

  // 2. Perform X3DH key agreement (Extended Triple Diffie-Hellman)
  const sharedSecret = x3dh(
    senderIdentityKey,    // sender's long-term key
    senderEphemeralKey,   // freshly generated
    bundle.identityKey,   // recipient's long-term key
    bundle.signedPreKey,  // recipient's medium-term key
    bundle.oneTimePreKey  // single-use (consumed after this)
  );

  // 3. Initialize Double Ratchet with shared secret
  const session = new DoubleRatchet(sharedSecret);
  return session;
}

async function encryptMessage(session: DoubleRatchet, plaintext: string) {
  // Each message advances the ratchet → unique key per message
  const { ciphertext, header } = session.encrypt(Buffer.from(plaintext));
  return { ciphertext: base64(ciphertext), header: base64(header) };
}
```

**Offline Queue Delivery:**
```typescript
async function deliverPendingMessages(userId: string, gateway: WebSocket) {
  // Pull all pending messages from Cassandra (ordered by timestamp)
  const pending = await cassandra.execute(
    'SELECT * FROM message_queue WHERE recipient_id = ? AND status = ? ORDER BY server_timestamp ASC',
    [userId, 'queued']
  );

  for (const msg of pending.rows) {
    gateway.send(JSON.stringify({
      type: 'MESSAGE_CREATED',
      serverMsgId: msg.server_msg_id,
      encryptedPayload: msg.encrypted_payload,
      senderId: msg.sender_id,
      timestamp: msg.server_timestamp
    }));

    // Mark as delivered
    await cassandra.execute(
      'UPDATE message_queue SET status = ? WHERE server_msg_id = ?',
      ['delivered', msg.server_msg_id]
    );

    // Notify sender: ✓✓ delivered
    await notifySender(msg.sender_id, msg.server_msg_id, 'delivered');
  }
}
```

### Scaling Strategy
- **0→10M users:** Single-region WebSocket gateway cluster, Cassandra ring (3 nodes), Redis for routing
- **10M→100M:** Regional gateway clusters, Cassandra multi-DC replication, dedicated Key Server cluster
- **100M→1B:** Multi-region active-active, edge gateways (reduce latency), MQTT for poor networks, media CDN
- **1B→2B+:** Custom MQTT protocol, connection multiplexing, adaptive compression, device-optimized binaries, regionalized media storage

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Gateway node crash | Thousands of WebSocket drops | Clients auto-reconnect (exponential backoff). Routing cache updates within 5s |
| Cassandra node down | Delayed offline message delivery | Replication factor 3. Reads/writes at QUORUM. Surviving nodes serve traffic |
| Key Server unavailable | Can't initiate new sessions | Cached pre-key bundles. Existing sessions unaffected (ratchet state is client-side) |
| One-time pre-keys exhausted | Key exchange falls back to signed pre-keys only | Monitor pre-key supply. Push clients to upload new batches when < 10 remaining |
| Malicious message flood | Queue storage pressure | Per-user rate limiting (max 100 msgs/min). Abuse detection from metadata patterns |
| Media blob store outage | Media messages undeliverable | Cross-region S3 replication. Message text portion still delivers. Retry download later |

**Production Monitoring:** WebSocket connection count per gateway, message delivery latency (p50/p99), offline queue depth per user, pre-key inventory levels, encryption handshake success rate
**How WhatsApp Actually Works:** WhatsApp uses Erlang/BEAM for their Connection Gateway (each server handles 2M+ connections). They use a custom fork of the Signal Protocol. Messages are stored in an in-memory queue (not disk-based) for online users, falling back to Mnesia (Erlang's built-in DB) for offline storage. At 100B messages/day, they run one of the most efficient per-engineer infrastructures in tech (~50 engineers for 2B users).

### System Flows (Interactive) — `<E2EEncryptionSim />`

**Controls:**
- **"Send Message" button** → Alice sends an encrypted message to Bob
- **"Bob Goes Offline" toggle** → Switches Bob between online/offline
- **"First Contact" button** → Shows the full key exchange (X3DH) before first message
- **"Group Message" button** → Alice sends to a 5-member group (shows fan-out encryption)
- **"Intercept Attempt" toggle** → Shows that the server sees only encrypted blobs

**Animations:**
1. **"First Contact"**: Alice → Key Server: "Fetch Bob's pre-key bundle" → Key exchange animation (Diffie-Hellman visual: two colors mixing into a shared secret) → session established → "🔐 Session Ready" badge on both Alice and Bob
2. **"Send Message" (Bob online)**: Alice encrypts (plaintext transforms to `████` ciphertext with lock icon) → encrypted blob flies to Gateway → Router → Bob's Gateway → Bob decrypts (ciphertext transforms back to plaintext) → Delivery receipts: ✓ (server ack) → ✓✓ (delivered) → ✓✓ blue (read)
3. **"Bob Goes Offline" + "Send Message"**: Same encryption → Gateway → Router → "⚫ Bob offline" → message flows to Cassandra queue (badge: "Pending: 1") → when "Bob Goes Offline" toggled back ON → Delivery Workers pull message → stream to Bob → ✓✓ delivered
4. **"Intercept Attempt" ON**: Server (Router node) highlighted with magnifying glass → shows only `████████` encrypted blob → "🔒 Server cannot read" badge → plaintext visible only on Alice and Bob's nodes
5. **"Group Message"**: Alice encrypts message 5 times (one per member) → animated edges fan out to 5 recipients → each receives their uniquely encrypted copy → each decrypts locally

### Tradeoffs (4/4)
**Pros:** True end-to-end encryption means zero-knowledge server (strongest privacy guarantee), offline queuing ensures reliable delivery across flaky mobile networks, Signal Protocol provides forward secrecy (compromised key doesn't expose past messages), Erlang-based gateways scale to 2M+ connections per server
**Cons:** Fan-out encryption for large groups is expensive (N encryptions per message per member × devices), multi-device sync requires re-encryption for each device (not just "sync from cloud"), server cannot perform content moderation or spam detection on encrypted messages, key rotation on device change requires re-establishing all sessions

### FAQ (4 Questions)
1. **How does E2E encryption work if the server can't read messages?** — The server is a relay, not a reader. Alice encrypts with Bob's public key using Signal Protocol. Only Bob's private key (stored on his device, never sent to server) can decrypt. The server sees opaque blobs.
2. **How does multi-device work with E2E encryption?** — Each device has its own key pair. When Alice sends a message, she encrypts it separately for Bob's phone AND Bob's laptop. The server delivers the correct encrypted copy to each device. This is why adding a new device requires a "security code changed" notification.
3. **Why doesn't WhatsApp store messages permanently?** — Messages are deleted from the server once delivered. This is a privacy and cost decision. At 100B messages/day, permanent storage would be petabytes/day. Users back up locally or to iCloud/Google Drive (encrypted with a user-chosen password).
4. **How does WhatsApp handle group encryption at scale (1,024 members)?** — Sender Key protocol: the sender generates a single "sender key" for the group, distributes it to all members via pairwise encryption (each member gets the key encrypted with their public key). Subsequent messages use this shared sender key — one encryption, not N. But key rotation on member changes is expensive.

### Interview Notes (5 Points)
1. **E2E encryption is the defining constraint**: Every design decision flows from "server cannot read content." This eliminates server-side search, moderation, and cloud sync
2. **Signal Protocol (Double Ratchet + X3DH)**: Know the high-level flow. Each message uses a unique key. Forward secrecy means compromising today's key doesn't expose yesterday's messages
3. **Offline is the normal state**: Mobile users are frequently offline. Design for eventual delivery, not real-time. Queue → deliver on reconnect → confirm
4. **Group messaging is the scalability challenge**: Sender Key protocol reduces N encryptions to 1, but key rotation on member change is O(N)
5. **Server is a dumb pipe**: Unlike Slack/Discord (which index and search messages), WhatsApp's server just relays encrypted blobs. This radically simplifies server-side storage but eliminates server-side features

### Key Takeaways (5 Points)
1. E2E encryption fundamentally changes the architecture — the server becomes a relay, not a storage + processing engine
2. Signal Protocol (X3DH + Double Ratchet) is the industry standard for secure messaging — know it at a high level
3. Offline message queuing with TTL-based expiry is critical for mobile-first systems
4. Group messaging encryption uses Sender Key to avoid N×M fan-out encryption
5. WhatsApp proves that massive scale (2B users, 100B msgs/day) is achievable with a tiny team when the server does less

### Related Topics
`chat-system`, `kafka`, `consistent-hashing`, `exactly-once-processing`, `event-driven-architecture`

---

## Topic 2: Uber

**File:** `src/content/case-studies/uber.mdx`
**Difficulty:** Hard | **Wave:** 1 | **Order:** 2

### Introduction
"Uber is like an air traffic control system for taxis — it tracks the real-time position of millions of moving vehicles, matches riders with the closest available driver in seconds, calculates dynamic pricing based on demand, and navigates both parties to a meeting point. The hard part: doing this 20M times/day across 70+ countries with sub-second matching."

### Why This Matters & Prerequisites
**Why This Matters:**
Uber processes 20M+ rides/day with a matching system that must find the best driver within seconds. The unique technical challenges are geospatial indexing (QuadTree/GeoHash for location queries), real-time location tracking (millions of GPS updates/sec), dynamic pricing (surge algorithm), and a complex state machine (ride lifecycle: request → match → pickup → trip → dropoff → payment). This is one of the most complex system design interview questions.

**Who Should Read This:**
- 🟢 **Beginners**: Understand geospatial basics, location tracking, and ride state machines
- 🟡 **Intermediate**: Design QuadTree-based spatial indexing, driver matching algorithms, and ETA calculation
- 🔴 **Advanced**: Optimize surge pricing, handle supply-demand imbalances, and scale matching across regions

**Prerequisites:** [Rate Limiting](/topics/rate-limiting), [Load Balancers](/topics/load-balancers), [Kafka](/topics/kafka), [Consistent Hashing](/topics/consistent-hashing)

### Requirements
**Functional:**
1. Rider requests a ride (origin, destination, ride type)
2. Match rider with nearest available driver (within radius, considering traffic)
3. Real-time GPS tracking during the trip (rider sees driver's location)
4. Dynamic pricing (surge multiplier based on supply/demand ratio)
5. ETA calculation (pickup ETA + trip ETA)
6. Trip lifecycle management (request → match → driver en route → pickup → in-trip → drop-off → payment)

**Non-Functional:**
1. Match latency < 5 seconds for 95% of requests
2. Location update ingestion: 5M GPS updates/sec globally
3. 99.99% availability for the matching system
4. Surge pricing computation < 2 seconds
5. ETA accuracy within ±3 minutes

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Active drivers | 5M globally | Across 70+ countries |
| Rides/day | 20M | ~230 rides/sec average |
| Peak ride requests | 3,000/sec | Rush hour in top 10 cities |
| Location updates | 5M/sec | Drivers send GPS every 4 seconds |
| Avg trip duration | 15 minutes | City average |
| Trip data per ride | ~5 KB | Metadata + route + pricing |
| Historical data (1 year) | ~35 TB | 20M rides/day × 5KB × 365 |

### API Design
```http
-- Rider: Request a ride
POST /api/v1/rides/estimate
Body: { origin: { lat, lng }, destination: { lat, lng }, rideType: "uberX" | "uberXL" | "comfort" }
Response: { estimatedFare: { min, max, surge }, estimatedPickupEta, estimatedTripDuration }

POST /api/v1/rides
Body: { origin, destination, rideType, paymentMethodId }
Response: 201 { rideId, status: "matching", matchTimeout: 30 }

-- Driver: Location updates (high-frequency, lightweight)
PUT /api/v1/drivers/location
Body: { lat, lng, heading, speed, timestamp }
Response: 200 (minimal)

-- Driver: Accept/reject match
POST /api/v1/rides/{rideId}/accept
POST /api/v1/rides/{rideId}/reject

-- Real-time tracking (WebSocket)
WS /api/v1/rides/{rideId}/track
Events: DRIVER_LOCATION { lat, lng, eta }, STATUS_CHANGED { status }
```

### Data Model
```sql
rides (
  ride_id BIGINT PRIMARY KEY,
  rider_id BIGINT NOT NULL,
  driver_id BIGINT, -- NULL until matched
  origin_lat DOUBLE, origin_lng DOUBLE,
  dest_lat DOUBLE, dest_lng DOUBLE,
  ride_type VARCHAR(16),
  status VARCHAR(24), -- matching | driver_en_route | arrived | in_trip | completed | cancelled
  surge_multiplier DECIMAL(3,2),
  fare_estimate_cents INT,
  fare_actual_cents INT,
  requested_at TIMESTAMP,
  matched_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
)

driver_locations (
  driver_id BIGINT PRIMARY KEY,
  lat DOUBLE NOT NULL,
  lng DOUBLE NOT NULL,
  heading FLOAT,
  speed FLOAT,
  is_available BOOLEAN,
  geohash VARCHAR(12), -- for spatial queries
  updated_at TIMESTAMP
)

surge_zones (
  zone_id VARCHAR(16) PRIMARY KEY, -- geohash prefix
  demand_count INT,
  supply_count INT,
  surge_multiplier DECIMAL(3,2),
  computed_at TIMESTAMP
)
```
**DB Choice:** PostgreSQL for rides (transactional, relational). Redis + in-memory QuadTree for real-time driver locations (sub-millisecond spatial queries). Cassandra for trip history (write-heavy, range scans by time).

### Architecture Diagram (`uber-arch`)

```
[Rider App] → [API Gateway] → [Ride Service] → [Ride Store]
                                    ↓
                              [Matching Engine] → [QuadTree Index (Redis)]
                                    ↓                      ↑
                              [Surge Service]        [QuadTree Updater] ← [Stream (Kafka)] ← [Location Ingestion] ← [Driver App]
                                    ↓
                              [Pricing Store]

                         [Location Service] → [Tracking Gateway] ─ws─→ [Rider App]

```

**Nodes:**
- `ClientNode` x2 → "Rider App" (sublabel: "Request · Track · Pay"), "Driver App" (sublabel: "Location · Accept · Navigate")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit · Route")
- `ServiceNode` → "Ride Service" (sublabel: "Lifecycle FSM · Status transitions")
- `ServiceNode` → "Matching Engine" (sublabel: "QuadTree query · Score & rank · Offer to driver")
- `ServiceNode` → "Surge Service" (sublabel: "Supply/demand ratio · Zone-level pricing")
- `ServiceNode` → "Location Service" (sublabel: "Ingest 5M GPS/sec · QuadTree updates")
- `ServiceNode` → "Location Ingestion" (sublabel: "Lightweight receiver · Batch to Kafka")
- `ServiceNode` → "QuadTree Updater" (sublabel: "Consumers update spatial cells")
- `QueueNode` → "Location Stream" (sublabel: "Kafka · Partitioned by geohash region")
- `CacheNode` → "QuadTree Index" (sublabel: "Redis + In-memory · Sub-ms spatial queries")
- `DatabaseNode` → "Ride Store" (sublabel: "PostgreSQL · Trip lifecycle")
- `DatabaseNode` → "Pricing Store" (sublabel: "Surge zones · Historical pricing")
- `ServiceNode` → "Tracking Gateway" (sublabel: "WebSocket · Per-ride real-time updates")

**Edges:**
- Rider → Gateway: animated, label "POST /rides (request)"
- Gateway → Ride Service: animated, label "Create ride"
- Ride Service → Matching Engine: animated, label "Find nearest driver"
- Matching Engine → QuadTree Index: animated, label "Spatial query: drivers within 3km"
- Matching Engine → Ride Service: animated, label "Best match: Driver #42"
- Ride Service → Driver App: animated, label "Ride offer (15 sec timeout)"
- Driver App → Location Ingestion: animated (high frequency), label "GPS every 4s"
- Location Ingestion → Location Stream: animated, label "Batch GPS events"
- Location Stream → QuadTree Updater: animated, label "Driver position events"
- QuadTree Updater → QuadTree Index: animated, label "Update driver position"
- Ride Service → Surge Service: animated, label "Get surge multiplier"
- Tracking Gateway → Rider App: animated, label "WebSocket: driver location"

### Read & Write Paths
**Write (Request a Ride):**
1. Rider → API Gateway → Ride Service creates ride record (status: `matching`)
2. Ride Service → Surge Service: get surge multiplier for rider's zone (supply/demand ratio)
3. Ride Service → Matching Engine: "Find best driver near (lat, lng) within 3km"
4. Matching Engine queries QuadTree Index → returns sorted list of available drivers (by distance + rating + acceptance rate)
5. Matching Engine offers ride to top driver → 15-second timeout
6. Driver accepts → Ride Service updates status to `driver_en_route` → sends ETA to rider
7. If driver rejects → Matching Engine offers to next driver

**Write (Location Updates — Hot Path):**
1. Driver App sends GPS every 4 seconds → Location Ingestion (lightweight HTTP)
2. Batched → Kafka (partitioned by geohash region)
3. QuadTree Updater consumers update the in-memory spatial index
4. If driver is on an active ride → Location Service pushes update to Tracking Gateway → Rider sees driver moving on map

**Read (Trip History):** Rider → API → query Cassandra by rider_id + time range.

### Deep Dives
1. **QuadTree Spatial Indexing:** The world is divided into a recursive grid (QuadTree). Each cell subdivides when it contains too many drivers (>100). Matching queries find all drivers within a bounding box, then sort by driving distance (not straight-line). This achieves O(log N) spatial lookups vs O(N) brute force.
2. **Surge Pricing Algorithm:** Divide the city into hexagonal zones (H3 — Uber's actual system). For each zone, compute `supply_count / demand_count` every 30 seconds. When demand > supply by a threshold: surge multiplier = `base × (demand / supply)^0.5` (square root dampening to prevent extreme surges). Surge is communicated to rider BEFORE confirming the ride.
3. **Ride State Machine:** A ride goes through a strict FSM: `matching → driver_en_route → arrived → in_trip → completed`. Each transition emits an event (Kafka) and updates the ride store. Invalid transitions are rejected (e.g., can't go from `matching` to `in_trip`). Cancellations branch to a `cancelled` terminal state with different fee rules depending on when the cancellation happens.

### Implementation Patterns
**QuadTree Nearest-Driver Query:**
```typescript
async function findNearestDrivers(
  lat: number, lng: number, radiusKm: number, limit: number
): Promise<Driver[]> {
  // 1. Query QuadTree for drivers in bounding box
  const bbox = boundingBox(lat, lng, radiusKm);
  const candidates = quadTree.queryRange(bbox);

  // 2. Filter: available, correct ride type, not already offered
  const available = candidates.filter(d =>
    d.isAvailable && !d.activeOffer && d.rideTypes.includes(requestedType)
  );

  // 3. Calculate driving distance (not straight-line) via routing service
  const withDistance = await Promise.all(
    available.map(async d => ({
      ...d,
      drivingDistanceKm: await routingService.getDistance(d.lat, d.lng, lat, lng),
      score: computeMatchScore(d, lat, lng) // distance + rating + acceptance rate
    }))
  );

  // 4. Sort by composite score & return top N
  return withDistance.sort((a, b) => b.score - a.score).slice(0, limit);
}
```

**Surge Pricing Computation:**
```typescript
function computeSurge(zone: SurgeZone): number {
  const ratio = zone.demandCount / Math.max(zone.supplyCount, 1);

  if (ratio <= 1.2) return 1.0; // No surge
  if (ratio > 5.0) return 3.0;  // Cap at 3x

  // Square root dampening: prevents extreme spikes
  return Math.round(Math.sqrt(ratio) * 10) / 10; // e.g., 1.4x, 1.8x, 2.1x
}
```

### Scaling Strategy
- **0→100K rides/day:** Single-region, single QuadTree, PostgreSQL for rides
- **100K→1M:** Regional QuadTree shards (by city), Kafka for location ingestion, read replicas for ride history
- **1M→10M:** Multi-region deployment, H3 hexagonal zones for surge, dedicated matching engine cluster per metro
- **10M→20M+:** Edge location ingestion (reduce latency), ML-based matching (predict driver acceptance), dynamic QuadTree rebalancing, pre-computed ETAs

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| QuadTree node crash | Matching fails for a region | Replicated QuadTree across 3 nodes. Failover within 2s |
| Kafka consumer lag (location stream) | Driver positions stale → bad matches | Monitor lag. Autoscale consumers. Degrade gracefully (use last known position) |
| Surge service outage | No dynamic pricing → revenue loss | Cache last surge values per zone (5 min TTL). Default to 1.0x (no surge) |
| GPS drift / spoofing | Incorrect driver positions | Cross-validate with cell tower triangulation. Flag drivers with impossible speed (>200 km/h) |
| Matching timeout (no driver accepts) | Rider waits indefinitely | Expand search radius after 15s. Show "No drivers available" after 60s. Offer higher fare |
| Payment service down | Can't complete ride | Allow ride to complete. Queue payment for retry. Charge later via stored payment method |

**Production Monitoring:** Match rate (% of requests that find a driver), match latency p99, GPS ingestion lag, surge accuracy (predicted vs actual demand), driver utilization rate
**How Uber Actually Works:** Uber uses H3 (hexagonal hierarchical spatial index) instead of a traditional QuadTree. Their matching algorithm considers not just distance but predicted trip profitability, driver preference, and rider loyalty. They run a service called "Uber's Marketplace" that simultaneously optimizes dispatching, surge pricing, and driver positioning using ML models trained on billions of historical trips.

### System Flows (Interactive) — `<GeoMatchingSim />`

**Controls:**
- **"Request Ride" button** → Rider requests a ride, triggers matching
- **"Move Drivers" toggle** → Drivers animate moving on a mini-map
- **"Surge Zone" toggle** → Shows supply/demand heatmap with surge multipliers
- **"Driver Rejects" button** → First matched driver rejects, cascades to next

**Animations:**
1. **"Request Ride"**: Rider pin appears on mini-map → radius circle expands → QuadTree visually subdivides the area → drivers within radius highlight (green dots) → closest 3 ranked → offer sent to #1 → driver accepts → route line draws between rider and driver → ETA badge appears
2. **"Move Drivers"**: Driver dots animate along roads. Location Ingestion node shows incoming GPS events (counter: "5M/sec"). QuadTree Index updates in real-time (cells flash when updated)
3. **"Surge Zone"**: Mini-map overlays hexagonal zones. High-demand zones glow red with "2.1x" badge. Low-demand zones stay green "1.0x". A real-time supply/demand bar chart shows the ratio per zone
4. **"Driver Rejects"**: Offer sent to Driver #1 → 15s timeout → "❌ Rejected" → offer cascades to Driver #2 → accepted → matching complete. Counter: "Match attempts: 2"

### Tradeoffs (4/4)
**Pros:** Real-time spatial indexing enables sub-second driver matching across millions of vehicles, surge pricing balances supply/demand dynamically (reduces wait times), event-driven architecture (Kafka) decouples location ingestion from matching, state machine enforces strict ride lifecycle (prevents invalid transitions)
**Cons:** QuadTree rebalancing under high churn is expensive (5M location updates/sec), surge pricing creates user perception problems (PR risk), GPS accuracy limits matching quality (30m error common in urban canyons), multi-region matching complicates cross-border rides

### FAQ (4 Questions)
1. **Why QuadTree instead of GeoHash for spatial indexing?** — QuadTree supports dynamic subdivision (cells split when crowded, merge when empty). GeoHash is fixed-resolution. For ride-hailing where driver density varies wildly (Times Square vs rural highway), QuadTree adapts better. Uber actually uses H3 (hexagonal), which combines benefits of both.
2. **How does Uber prevent surge price manipulation?** — Surge is computed server-side from aggregate supply/demand across zones, not from individual rider behavior. Riders see the surge multiplier BEFORE confirming. Surge gradually reduces as more drivers enter the high-demand zone (incentivized by higher fares).
3. **What happens when Uber's matching system can't find a driver?** — Expand radius (3km → 5km → 8km). Lower match score threshold. If still no match after 60s, notify rider "No drivers available, try again soon." During extreme demand, suggest scheduling a ride for later.
4. **How does Uber calculate ETA accurately?** — Road network graph (OpenStreetMap-based) + real-time traffic data from active driver GPS traces + historical patterns (Thursday 5 PM on this road = 20 min). ML model trained on billions of actual trips to predict remaining time.

### Interview Notes (5 Points)
1. **Geospatial index is the core**: QuadTree/H3 for spatial queries. Know the tradeoff: QuadTree (dynamic) vs GeoHash (simple) vs H3 (hexagonal, Uber's choice)
2. **Two hot paths**: Matching (rider → driver assignment, <5s) and Location ingestion (5M GPS/sec, eventual consistency OK). Never block matching on location writes
3. **Surge pricing**: Supply/demand ratio per zone, computed every 30s. Square-root dampening prevents extreme values. Must be communicated to rider before they confirm
4. **Ride state machine**: Strict FSM with invalid-transition protection. Each transition emits a Kafka event for downstream services (billing, analytics, safety)
5. **Scale separations**: Matching is CPU-intensive (spatial queries). Location ingestion is I/O-intensive (Kafka writes). Keep them on separate infrastructure

### Key Takeaways (5 Points)
1. Ride-hailing is a real-time geospatial matching problem — the spatial index design is the most critical decision
2. Surge pricing is supply/demand economics implemented as a distributed system — zones, ratios, dampening
3. Location data is the hottest path (5M updates/sec) — decouple ingestion from query with Kafka + dedicated index
4. Ride lifecycle is a state machine — enforce transitions strictly and emit events for every state change
5. ETA is harder than matching — it requires road network + real-time traffic + ML. Matching finds WHO, ETA answers WHEN

### Related Topics
`consistent-hashing`, `kafka`, `rate-limiting`, `load-balancers`, `service-discovery`

---

## Topic 3: YouTube

**File:** `src/content/case-studies/youtube.mdx`
**Difficulty:** Hard | **Wave:** 1 | **Order:** 3

### Introduction
"YouTube is like a global TV station where anyone can broadcast — but instead of one channel, there are 800M+ videos, and each viewer gets a personalized channel list. The real engineering magic isn't playing videos (your phone can do that) — it's ingesting 500 hours of new video every minute, transcoding each into 20+ formats, and serving 1B+ hours of watch time per day from global edge servers."

### Why This Matters & Prerequisites
**Why This Matters:**
YouTube serves 2B+ monthly active users watching 1B+ hours/day of video. The core challenges are: video upload and transcoding pipeline (converting one upload into 20+ resolution/codec/bitrate variants), adaptive bitrate streaming (ABR — switching quality mid-stream based on network conditions), content delivery at global scale (CDN with petabytes of cached content), and a recommendation engine that drives 70% of watch time. This is one of the most infrastructure-heavy interview questions.

**Who Should Read This:**
- 🟢 **Beginners**: Understand video processing basics, CDN delivery, and why transcoding is necessary
- 🟡 **Intermediate**: Design the transcoding pipeline, implement adaptive bitrate streaming, and understand CDN cache hierarchies
- 🔴 **Advanced**: Optimize for tail latency, handle live streaming edge cases, and scale the recommendation system

**Prerequisites:** [Kafka](/topics/kafka), [Load Balancers](/topics/load-balancers), [Consistent Hashing](/topics/consistent-hashing), [Instagram](/case-studies/instagram) (media pipeline basics)

### Requirements
**Functional:**
1. Upload videos (up to 256 GB per video, up to 12 hours long)
2. Transcode into multiple resolutions (144p, 240p, 360p, 480p, 720p, 1080p, 4K) and codecs (H.264, VP9, AV1)
3. Adaptive bitrate streaming (quality adjusts based on viewer's network)
4. Video recommendations (personalized feed — 70% of views come from recommendations)
5. Live streaming with < 10 second latency
6. Comments, likes, subscriber count (social features)

**Non-Functional:**
1. Upload-to-playable latency: < 5 minutes for standard videos
2. Playback start time: < 2 seconds (first frame rendered)
3. Buffering rate: < 1% of watch sessions
4. 99.99% availability for playback
5. Support 500+ hours of uploads per minute, 1B+ hours watched per day

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Monthly active users | 2.5B | Global reach |
| Videos uploaded/minute | 500 hours | ~720K videos/day |
| Total videos stored | 800M+ | All-time catalog |
| Watch time/day | 1B hours | ~12.5K years of video/day |
| Peak concurrent viewers | 100M+ | Major events / prime time |
| Avg video size (uploaded) | 1.5 GB | HD original |
| Transcoded variants per video | 20+ | 7 resolutions × 3 codecs |
| Storage per video (all variants) | ~10 GB | 1.5 GB original + transcoded |
| Total storage | ~8 EB (exabytes) | 800M × 10 GB |
| CDN bandwidth (peak) | ~150 Tbps | 100M viewers × ~1.5 Mbps avg |

### API Design
```http
-- Upload: get presigned URL for direct upload to object store
POST /api/v1/videos/upload
Body: { title, description, tags, channelId, privacyStatus: "public"|"private"|"unlisted" }
Response: 201 {
  videoId: string,
  uploadUrl: string, -- presigned S3/GCS URL for direct upload
  uploadExpiry: number
}

-- Upload status & processing
GET /api/v1/videos/{videoId}/status
Response: { status: "uploading"|"processing"|"ready"|"failed", progress: 0.0-1.0, variants: ["360p", "720p", "1080p"] }

-- Watch: get manifest for adaptive streaming
GET /api/v1/videos/{videoId}/manifest
Response: { dashManifestUrl, hlsManifestUrl, thumbnailUrl, duration, title, viewCount }

-- Recommendations
GET /api/v1/recommendations?userId={userId}&context=home|watch_next
Response: { videos: [{ videoId, title, channelName, thumbnailUrl, duration, viewCount }] }

-- Live streaming
POST /api/v1/live/start
Body: { title, description, channelId }
Response: { streamKey, rtmpUrl, dashManifestUrl }
```

### Data Model
```sql
videos (
  video_id BIGINT PRIMARY KEY,
  channel_id BIGINT NOT NULL,
  title VARCHAR(100),
  description TEXT,
  tags VARCHAR(500),
  upload_status VARCHAR(16), -- uploading | processing | ready | failed
  privacy VARCHAR(16), -- public | private | unlisted
  duration_secs INT,
  original_blob_path VARCHAR(255), -- GCS/S3 path to original upload
  uploaded_at TIMESTAMP,
  published_at TIMESTAMP
)

video_variants (
  video_id BIGINT,
  resolution VARCHAR(8), -- 144p, 360p, 720p, 1080p, 4K
  codec VARCHAR(8), -- h264, vp9, av1
  bitrate_kbps INT,
  blob_path VARCHAR(255), -- GCS/S3 path to transcoded file
  segment_manifest_url VARCHAR(255), -- DASH/HLS manifest for this variant
  file_size_bytes BIGINT,
  status VARCHAR(16), -- pending | processing | ready | failed
  PRIMARY KEY (video_id, resolution, codec)
)

-- Video engagement (denormalized for fast reads)
video_stats (
  video_id BIGINT PRIMARY KEY,
  view_count BIGINT DEFAULT 0,
  like_count INT DEFAULT 0,
  dislike_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  avg_watch_pct DECIMAL(5,2)  -- average % of video watched
)

-- Watch history (for recommendations)
watch_history (
  user_id BIGINT,
  video_id BIGINT,
  watched_at TIMESTAMP,
  watch_duration_secs INT,
  watch_pct DECIMAL(5,2),
  PRIMARY KEY (user_id, watched_at)
)
```
**DB Choice:** PostgreSQL for video metadata (transactional, relational). Vitess (sharded MySQL) for video stats at scale (YouTube's actual choice). BigTable/Cassandra for watch history (massive write volume, time-series queries). Redis for hot video stats cache (view counts, trending).

### Architecture Diagram (`youtube-arch`)

```
[Creator] → [Upload Service] → [Raw Blob Store] → [Transcode Queue] → [Transcode Workers] → [Variant Store] → [CDN]
                                                                                                              ↓
[Viewer] → [API Gateway] → [Video Service] → [Manifest Generator] --------------------------------------→ [Viewer]
                                ↓                  ↓
                          [Video Metadata DB]   [Hot Video Cache]
                                ↓
                       [Recommendation Service] → [Watch History]
```

**Nodes:**
- `ClientNode` x2 → "Creator" (sublabel: "Upload · Dashboard · Analytics"), "Viewer" (sublabel: "Watch · Search · Subscribe")
- `ServiceNode` → "Upload Service" (sublabel: "Presigned URLs · Resumable uploads · Chunk validation")
- `DatabaseNode` → "Raw Blob Store" (sublabel: "GCS · Original uploads · 500 hrs/min ingest")
- `QueueNode` → "Transcode Queue" (sublabel: "Kafka · Priority lanes: monetized > free · ~20 jobs/video")
- `ServiceNode` → "Transcode Workers" (sublabel: "GPU cluster · FFmpeg · H.264 + VP9 + AV1 · 20+ variants")
- `DatabaseNode` → "Variant Store" (sublabel: "GCS · Segmented files · DASH/HLS manifests")
- `LoadBalancerNode` → "CDN" (sublabel: "Google Edge Network · 150+ Tbps · 3-tier cache hierarchy")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit · Route")
- `ServiceNode` → "Video Service" (sublabel: "Metadata · Stats · Manifest serving")
- `ServiceNode` → "Manifest Generator" (sublabel: "DASH/HLS · Per-viewer quality selection")
- `ServiceNode` → "Recommendation Service" (sublabel: "ML pipeline · Collaborative filtering · 70% of views")
- `DatabaseNode` → "Watch History" (sublabel: "BigTable · Per-user event stream · Billions/day")
- `CacheNode` → "Hot Video Cache" (sublabel: "Redis · View counts · Trending · Top 1M videos")
- `DatabaseNode` → "Video Metadata DB" (sublabel: "Vitess (Sharded MySQL) · 800M+ video records")

**Edges:**
- Creator → Upload Service: animated, label "Presigned upload (direct to blob store)"
- Upload Service → Raw Blob Store: animated (dashed), label "Direct upload (bypass API)"
- Raw Blob Store → Transcode Queue: animated, label "Upload complete event"
- Transcode Queue → Transcode Workers: animated, label "Dequeue: video_id + target variants"
- Transcode Workers → Variant Store: animated, label "Write segments (360p → 4K)"
- Variant Store → CDN: animated, label "Origin pull on first request"
- CDN → Viewer: animated, label "Adaptive bitrate stream"
- Viewer → API Gateway: animated, label "GET /manifest"
- API Gateway → Video Service: animated, label "Fetch metadata + manifest URL"
- Video Service → Manifest Generator: animated, label "Generate DASH/HLS for viewer's capabilities"
- Viewer → Recommendation Service: animated, label "GET /recommendations"
- Recommendation Service → Watch History: animated, label "Query user's viewing patterns"
- Video Service → Hot Video Cache: animated, label "View count increment"

### Read & Write Paths
**Write (Upload & Process):**
1. Creator → Upload Service → receives presigned URL for direct-to-GCS upload
2. Creator uploads directly to GCS (resumable upload, chunked for large files)
3. GCS emits `upload_complete` event → Upload Service validates (file integrity, format check)
4. Upload Service publishes to Transcode Queue (Kafka): one message per target variant (20+)
5. Transcode Workers (GPU cluster) dequeue → FFmpeg transcode → segment into 4-10 sec chunks → write to Variant Store
6. Each variant completion updates `video_variants` table → when all variants ready → video status = `ready`
7. Video is now playable. First viewer request triggers CDN origin pull

**Read (Watch a Video):**
1. Viewer → API Gateway → Video Service → returns manifest URL + metadata
2. Viewer's player fetches DASH/HLS manifest from CDN (lists all available quality levels + segment URLs)
3. Player starts with lowest quality → measures bandwidth → upgrades quality (adaptive bitrate)
4. Each segment request: CDN edge → if cached, serve immediately; if miss → pull from origin (Variant Store)
5. Watch event logged to Watch History (BigTable) for recommendations
6. View count increment: batched in Redis → flushed to Vitess every 5 seconds

### Deep Dives
1. **Adaptive Bitrate Streaming (ABR):** Video is split into 4-10 second segments. Each segment is available in multiple quality levels (360p, 720p, 1080p, 4K). The player monitors bandwidth in real-time and switches quality per-segment. This is why you see quality fluctuate during poor network conditions. Standards: DASH (Google/Netflix) and HLS (Apple). ABR algorithm: measure throughput of last 3 segments → if sustained > required bitrate for next level, upgrade; if < current level, downgrade immediately.
2. **Transcoding Pipeline:** Each uploaded video generates 20+ variants: 7 resolutions × 3 codecs. Transcoding is CPU/GPU-intensive; 1 hour of 4K video takes ~4 GPU-hours to transcode. Priority system: monetized channels get faster transcoding. Live streaming uses real-time single-pass transcoding (lower quality but instant). Codecs: H.264 (universal compatibility), VP9 (better compression, more CPU), AV1 (best compression, most CPU — YouTube's future).
3. **CDN Cache Hierarchy:** Google's CDN has 3 tiers: Edge Caches (close to ISPs, serve popular videos), Mid-Tier Caches (regional, store warm content), Origin (GCS, authoritative). ~80% of watch time is served from edge caches. Long-tail videos (viewed rarely) are served from origin with higher latency. Cache key: `video_id + resolution + codec + segment_number`.

### Implementation Patterns
**Adaptive Bitrate Selection:**
```typescript
function selectNextQuality(
  currentQuality: QualityLevel,
  bandwidthHistory: number[], // last N segment download speeds (bps)
  availableQualities: QualityLevel[]
): QualityLevel {
  // 1. Estimate available bandwidth (weighted average, recent = higher weight)
  const estimatedBandwidth = weightedAverage(bandwidthHistory, [0.5, 0.3, 0.2]);

  // 2. Add safety margin (80% of estimated to avoid buffering)
  const safeBandwidth = estimatedBandwidth * 0.8;

  // 3. Find highest quality that fits within safe bandwidth
  const viable = availableQualities
    .filter(q => q.bitrateKbps * 1000 <= safeBandwidth)
    .sort((a, b) => b.bitrateKbps - a.bitrateKbps);

  if (viable.length === 0) return availableQualities[0]; // lowest quality fallback

  // 4. Upgrade gradually (max one level up), downgrade immediately
  const best = viable[0];
  if (best.bitrateKbps > currentQuality.bitrateKbps) {
    // Upgrade: one level at a time to avoid oscillation
    const currentIndex = availableQualities.indexOf(currentQuality);
    return availableQualities[Math.max(currentIndex - 1, 0)];
  }
  return best; // Downgrade: jump directly to sustainable level
}
```

**Transcode Job Orchestration:**
```typescript
async function onUploadComplete(videoId: string, originalPath: string) {
  const targetVariants = [
    { resolution: '360p', codec: 'h264', priority: 1 },
    { resolution: '720p', codec: 'h264', priority: 1 },
    { resolution: '1080p', codec: 'h264', priority: 2 },
    { resolution: '720p', codec: 'vp9', priority: 3 },
    { resolution: '1080p', codec: 'vp9', priority: 3 },
    { resolution: '4k', codec: 'vp9', priority: 4 },
    { resolution: '1080p', codec: 'av1', priority: 5 },
    // ... 20+ total variants
  ];

  // Publish one Kafka message per variant, with priority
  for (const variant of targetVariants) {
    await kafka.produce('transcode-jobs', {
      videoId,
      originalPath,
      resolution: variant.resolution,
      codec: variant.codec,
      priority: variant.priority,
      segmentDurationSecs: 4
    });
  }

  // Video becomes playable as SOON as first variant (360p h264) completes
  // Higher qualities trickle in over next few minutes
}
```

### Scaling Strategy
- **0→1M views/day:** Single-region, small GPU cluster (4 GPUs), CloudFront CDN, PostgreSQL
- **1M→100M views/day:** Multi-region CDN, Kafka for transcode pipeline, sharded metadata DB, GPU auto-scaling
- **100M→1B views/day:** Own CDN edge network (peering with ISPs), multi-codec transcoding, live streaming infrastructure, ML-based recommendations
- **1B→10B+ views/day:** Custom silicon for transcoding (Google TPU/VPU), edge computing at ISPs, real-time personalized thumbnails, predictive pre-fetching for next video

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Transcode worker failure mid-job | Partial transcoding, video stuck in "processing" | Idempotent jobs. Checkpoint every 60 seconds. Worker crash → job re-queued automatically |
| CDN edge cache eviction (long-tail) | Higher latency for unpopular videos | 3-tier cache hierarchy. Prefetch trending videos to edge. Accept higher latency for tail (<0.1% of views) |
| Origin storage outage | No new videos playable, existing CDN cache serves | Multi-region GCS replication. CDN stale-while-revalidate. Playback continues for cached content |
| Massive upload spike (viral event) | Transcode queue backlog | Priority lanes (monetized > free). Auto-scale GPU fleet. Rate limit non-priority uploads |
| ABR algorithm failure (always lowest quality) | Poor viewer experience → churn | Client-side fallback to manual quality selection. Server-side bandwidth test endpoint. A/B testing ABR variants |
| View count inconsistency (cache vs DB) | Inaccurate public-facing counts | Eventual consistency is OK for view counts. Redis → Vitess flush every 5s. Exact counts reconciled hourly for monetization |

**Production Monitoring:** Upload-to-playable latency (p50/p99), CDN cache hit rate (target: >95%), buffering ratio (target: <1%), transcode queue depth, ABR quality distribution per session
**How YouTube Actually Works:** YouTube transcodes into ~20 variants per video using custom hardware (Google VCU — Video Coding Unit). They use VP9 and AV1 (Google-developed codecs) for better compression than H.264. Their CDN is integrated with Google's global network (owns undersea cables!). Recommendations use a deep neural network trained on billions of watch sessions. A/B testing is done continuously on thousands of ABR algorithm variants.

### System Flows (Interactive) — `<TranscodingPipelineSim />`

**Controls:**
- **"Upload Video" button** → Triggers full upload → transcode → CDN flow
- **"Watch Video" button** → Viewer plays video, ABR quality selection visible
- **"Network Throttle" slider** → Adjusts simulated viewer bandwidth (Poor / Medium / Fast)
- **"Transcode Failure" button** → One transcode variant fails, shows retry + partial availability
- **"CDN Cache Miss" toggle** → Forces origin pull, shows latency difference

**Animations:**
1. **"Upload Video"**: Creator uploads → progress bar on Upload Service → "Upload Complete ✓" → Transcode Queue fills with 20+ jobs → Workers process in parallel → Variant Store fills up (360p first ✓, then 720p ✓, 1080p ✓, 4K ✓) → Video badge changes: "Processing ⏳" → "Ready ▶️"
2. **"Watch Video"**: Viewer requests manifest → CDN serves segments → ABR gauge shows current quality (e.g., "1080p · 12 Mbps") → segments flow as animated particles from CDN to Viewer → quality bar indicator fills smoothly
3. **"Network Throttle" (Poor)**: ABR gauge drops "1080p → 720p → 360p" with downward arrow → segments become smaller (visually thinner particles) → "Buffering..." badge briefly appears if drop is extreme → quality recovers when slider moves back to Fast
4. **"Transcode Failure"**: One worker node turns red "❌ 1080p VP9 FAILED" → job re-queues → fresh worker picks up → "1080p VP9 ✓ (Retry #1)" → video still playable via other variants during retry
5. **"CDN Cache Miss"**: CDN edge shows "MISS" → request waterfall: Edge → Mid-Tier → Origin → stream back → edge now shows "CACHED" → next request served instantly. Latency counter: "Cache HIT: 5ms" vs "Cache MISS: 120ms"

**Wow Factor:** A real-time ABR quality gauge (like a speedometer) that responds to the bandwidth slider — this is something viewers experience daily but never see the engineering behind.

### Tradeoffs (4/4)
**Pros:** Transcoding into 20+ variants ensures optimal quality for any device/network combination, adaptive bitrate streaming minimizes buffering (quality adjusts, not playback), 3-tier CDN cache hierarchy serves 95%+ of requests from edge (low latency), progressive availability (360p ready first) lets viewers watch within minutes of upload
**Cons:** Storage cost is enormous (10 GB per video × 800M videos = exabytes), transcoding is GPU-intensive and expensive (~4 GPU-hours per hour of 4K video), long-tail videos (low view count) have poor cache hit rates and higher latency, live streaming requires real-time transcoding which limits quality vs pre-recorded

### FAQ (4 Questions)
1. **Why does YouTube transcode into 20+ variants instead of just the original quality?** — Different devices support different codecs (iPhone: H.264, Chrome: VP9/AV1). Different networks need different bitrates (mobile data: 360p, fiber: 4K). Without variants, YouTube would either waste bandwidth (serving 4K to a phone) or provide terrible quality (serving 360p to a 4K TV).
2. **How does adaptive bitrate streaming work?** — Each video is split into 4-second segments. Each segment is available in multiple qualities. The player measures download speed after each segment and picks the best quality for the next segment. If your network drops, the next segment will be lower quality (no buffering). If it improves, quality goes back up automatically.
3. **Why does it take a few minutes for an uploaded video to become available?** — Transcoding. A 10-minute 1080p video needs to be converted into 20+ variants (different resolutions × codecs). The 360p H.264 version is done first (smallest/fastest) so the video becomes playable quickly. Higher-quality variants trickle in over the next few minutes.
4. **How does YouTube's CDN serve billions of viewers without collapsing?** — 3-tier cache hierarchy: Edge (at ISP) → Regional → Origin. Popular videos are cached at the edge, so most requests never reach Google's data centers. YouTube also peers directly with ISPs (placing Google servers inside ISP networks) to reduce backbone traffic.

### Interview Notes (5 Points)
1. **Transcoding pipeline is the core technical challenge**: Know the flow (upload → queue → GPU workers → segmented variants → CDN). Priority lanes separate monetized/partner content from free-tier
2. **Adaptive bitrate streaming (ABR)**: Video split into segments, each available in multiple qualities. Player measures bandwidth per-segment and switches. Standards: DASH + HLS. This is what makes video "just work" on variable networks
3. **CDN is the delivery backbone**: 3-tier cache hierarchy. Edge serves ~95% of views. Cache key = video_id + resolution + codec + segment_number. Long-tail videos have low cache hit rates
4. **Storage is exabyte-scale**: Every video has 20+ variants. Total storage is in exabytes. Cost optimization: cold storage for old/unpopular content. Codec evolution (AV1) reduces storage per variant
5. **Recommendations drive 70% of views**: Collaborative filtering + deep neural networks. Inputs: watch history, engagement (like/share), session context. This is YouTube's competitive moat, not the infrastructure

### Key Takeaways (5 Points)
1. Video platforms are storage and bandwidth intensive — transcoding into multiple variants is the core pipeline
2. Adaptive bitrate streaming is why video "just works" on bad networks — understand segment-based quality switching
3. CDN is not optional at scale — 3-tier caching serves 95%+ from edge, reducing origin load by 20x
4. Progressive availability (lowest quality first) transforms a 5-minute pipeline into perceived instant availability
5. The recommendation system is the product — infrastructure serves the content, but recommendations decide WHICH content

### Related Topics
`kafka`, `consistent-hashing`, `load-balancers`, `instagram`, `event-driven-architecture`

---

## New Simulation Component Specs (Wave 1)

### `E2EEncryptionSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | WhatsApp |
| **Controls** | Send Message, Bob Goes Offline, First Contact, Group Message, Intercept Attempt |
| **Key Visual** | Plaintext → `████` ciphertext transformation with 🔐 lock icon |
| **Wow Factor** | "Intercept Attempt" mode: server highlighted with magnifying glass, shows only encrypted blob, "🔒 Server cannot read" badge |
| **Data Flow** | Alice encrypts → Gateway → Router → (Queue if offline) → Bob decrypts |
| **Metrics Shown** | Delivery status (✓ / ✓✓ / ✓✓ blue), pre-key inventory count, group encryption count |

### `GeoMatchingSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation with mini-map |
| **Used by** | Uber |
| **Controls** | Request Ride, Move Drivers, Surge Zone, Driver Rejects |
| **Key Visual** | Mini-map with driver dots, QuadTree grid overlay, radius circle for matching |
| **Wow Factor** | Driver dots moving on roads, QuadTree subdividing as density changes, hexagonal surge zones with color-coded multipliers |
| **Data Flow** | Rider request → QuadTree spatial query → rank drivers → offer → accept/reject cascade |
| **Metrics Shown** | Match attempts, match latency, surge multiplier per zone, driver count in radius |

### `TranscodingPipelineSim`
| Property | Value |
|---|---|
| **Type** | Shared simulation primitive with topic modes or wrappers |
| **Used by** | YouTube directly in Wave 1, Netflix later via playback/CDN wrapper in Wave 2 |
| **Controls** | Upload Video, Watch Video, Network Throttle slider, Transcode Failure, CDN Cache Miss |
| **Key Visual** | ABR quality gauge (speedometer style), progressive variant completion badges |
| **Wow Factor** | Real-time ABR quality gauge responding to bandwidth slider — users recognize this from their daily YouTube experience but never see the engineering |
| **Data Flow** | Upload → Blob Store → Transcode Queue → Workers (parallel) → Variant Store → CDN → Viewer |
| **Metrics Shown** | Transcode progress per variant, CDN cache hit/miss latency, viewer quality level, buffering indicator |

---

## Dependency Matrix (Wave 1)

| Depends on ↓ / Needed by → | WhatsApp | Uber | YouTube |
|---|---|---|---|
| `ClientNode` | ✅ | ✅ | ✅ |
| `ServiceNode` | ✅ | ✅ | ✅ |
| `DatabaseNode` | ✅ | ✅ | ✅ |
| `QueueNode` | ✅ | ✅ | ✅ |
| `CacheNode` | ✅ | ✅ | ✅ |
| `LoadBalancerNode` | ✅ | ✅ | ✅ (CDN) |
| `AnimatedEdge` | ✅ | ✅ | ✅ |
| `E2EEncryptionSim` | ✅ | — | — |
| `GeoMatchingSim` | — | ✅ | — |
| `TranscodingPipelineSim` | — | — | ✅ |

---

## Implementation Order (Wave 1)

| Priority | Topic | Effort | Rationale |
|---|---|---|---|
| 1 | **YouTube** | High | `TranscodingPipelineSim` is reused by Netflix (Wave 2). Build first |
| 2 | **Uber** | High | `GeoMatchingSim` is self-contained, most complex simulation (mini-map) |
| 3 | **WhatsApp** | Medium | `E2EEncryptionSim` reuses patterns from `PresenceDeliverySim` (Phase 5 Medium) |

---

## Verification Plan (Wave 1)

### Shared Hard Readiness
- [ ] All shared case-study prerequisites inherited from Easy and Medium are complete before Wave 1 content implementation begins
- [ ] `CacheNode`, `QueueNode`, and `CapacityEstimationCard` exist and are wired into the Hard case-study stack
- [ ] All 3 Wave 1 diagram config IDs exist in `diagramConfigs.ts`
- [ ] Wave 1 simulations are scoped correctly before reuse claims are made for later Hard waves

### Visual QA Rubric
- [ ] A new user can identify the main path within 10 seconds without reading surrounding prose
- [ ] Hover, click, scenario toggle, and replay/reset interactions are present and meaningful
- [ ] Primary path and fallback/degraded path are visually distinguishable
- [ ] Legends, labels, badges, and overlays are sufficient to understand the diagram without extra decoding
- [ ] WhatsApp clearly separates plaintext/key exchange from the server-side encrypted relay path
- [ ] Uber / Lyft clearly separates location ingest from match / trip state
- [ ] YouTube clearly separates upload/transcode pipeline state from playback/CDN delivery state
- [ ] The visualization feels like a product feature, not a static diagram with motion layered on top

### Per-Topic Checklist
- [ ] All 18 sections present and populated per template
- [ ] React Flow architecture diagram renders with correct nodes, sublabels, and animated edges
- [ ] Simulation loads with all controls functional
- [ ] Simulation animations trigger correctly for each control
- [ ] Section counts: Tradeoffs (4/4), FAQ (4), Interview Notes (5), Key Takeaways (5)
- [ ] Implementation code examples are valid TypeScript with comments
- [ ] Scaling strategy covers 4 stages with specific technologies at each stage
- [ ] Failure scenarios table has 6+ rows with realistic mitigations

### Wave 1 Exit Criteria
- [ ] WhatsApp: E2EEncryptionSim shows encryption/decryption flow, offline queuing, and group fan-out
- [ ] Uber: GeoMatchingSim shows QuadTree query, driver matching, surge zones, and rejection cascade
- [ ] YouTube: TranscodingPipelineSim shows upload → transcode → CDN flow, ABR quality gauge, and cache miss
- [ ] All 3 topics pass the shared Hard visual QA rubric
- [ ] No P0 or P1 issues in visualization review
