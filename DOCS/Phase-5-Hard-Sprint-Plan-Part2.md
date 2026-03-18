# Phase 5 (Hard): Case Studies Sprint Plan — Part 2

> **Goal:** Define implementation-ready specs for Wave 2 of the Hard case studies: Netflix, Zoom / Google Meet, and Google Docs. Wave 2 builds on the Hard visual grammar from Wave 1 and proves that the product can teach playback systems, live conferencing, and collaborative state synchronization at a premium quality bar.

> **Shared planning rules:** This document inherits the `Visualization Contract`, `React Flow Readiness Checklist`, shared Hard quality bar, and review rigor defined in [Phase-5-Hard-Sprint-Plan-Part1.md](./Phase-5-Hard-Sprint-Plan-Part1.md).

---

## Wave Strategy (Hard — 9 Topics, 3 Waves)

- **Wave 1 (Part 1):** WhatsApp, Uber, YouTube — real-time + geospatial + streaming foundations
- **Wave 2 (This doc):** Netflix, Zoom / Google Meet, Google Docs — playback + conferencing + collaboration
- **Wave 3 (Part 3):** Google Drive / Dropbox, Search Engine, Amazon — storage + search + capstone
- **Part 2 Scope:** Covers Wave 2 so later Hard topics can inherit proven patterns for playback wrappers, live media routing, and multi-user synchronization
- **Gate:** Wave 2 starts only after Wave 1 visual standards and shared prerequisites are approved

---

## Wave 2 Visual Focus

- **Playback over ingest:** Netflix must not feel like a renamed YouTube upload diagram. The default story is playback, CDN locality, and recommendation-driven discovery.
- **Multi-party live state:** Zoom / Google Meet must make join, publish, route, degrade, and reconnect states understandable without drowning the user in WebRTC jargon.
- **Concurrent editing clarity:** Google Docs must show why operations converge, not just that updates bounce between users.
- **Progressive disclosure:** Default views must show one primary path first. Secondary paths such as failover, reconnect, or conflict resolution appear through scenario toggles.

---

## Reusable Asset Inventory

### Reusable Visual Primitives (existing or required before wave start)
| Node/Edge/Sim | Reused As |
|---|---|
| `ClientNode` | Viewers, hosts, guests, collaborators, mobile devices |
| `ServiceNode` | APIs, routers, SFUs, sync engines, recommendation services |
| `DatabaseNode` | Metadata stores, op logs, snapshots, feature stores |
| `LoadBalancerNode` | API gateways, regional routers, CDN tiers |
| `CacheNode` | Session cache, playback state cache, presence cache, hot feature cache |
| `QueueNode` | Recording queue, background processing, async state fan-out |
| `LaneNode` | OT vs CRDT comparison, primary vs fallback strategy comparison |
| `AnimatedEdge` | All flow arrows |
| `TranscodingPipelineSim` | Reused as a playback-focused wrapper for Netflix |

### New Components Needed (Phase 5 Hard — Wave 2)
| Component | Type | Purpose | Reused By |
|---|---|---|---|
| `ConferenceMediaSim` | Simulation | Meeting join, media publish, SFU fan-out, screen share, recording, reconnect | Zoom / Google Meet |
| `RealtimeCollabSim` | Simulation | Concurrent edits, remote cursors, OT/CRDT comparison, offline replay | Google Docs |
| `TranscodingPipelineSim` Netflix wrapper | Simulation wrapper / mode | Playback-first CDN + ABR + recommendation experience using Wave 1 media primitive | Netflix |

> **Planning rule:** Wave 2 should prove that shared primitives can be wrapped into new teaching stories without becoming generic demos. If a Wave 1 primitive cannot explain the Wave 2 concept cleanly, extend or replace it explicitly instead of pretending reuse is enough.

---

## Shared Wave 2 Simulation Strategy

### `TranscodingPipelineSim` in `netflix` mode

- Treat this as a **playback wrapper**, not an upload-first simulation.
- The default scenario must start with a viewer choosing a title, fetching a manifest, hitting the nearest CDN tier, and adapting quality.
- Secondary scenarios must show cache miss, regional failover, and recommendation fallback.
- Any ingest or studio pipeline visuals should be background context, not the primary teaching flow.

### `ConferenceMediaSim`

- Treat this as a **dedicated live-conferencing simulation**.
- It must teach signaling, ICE/TURN setup, media publish to SFU, fan-out to other participants, screen sharing, and reconnect behavior.
- The simulation must separate metadata/control flow from media flow so the user does not confuse signaling with RTP delivery.

### `RealtimeCollabSim`

- Treat this as a **dedicated collaboration simulation**.
- It must teach local edit → operation → transform/merge → broadcast → converge.
- It must support a visible comparison between OT-style and CRDT-style convergence, even if one path is marked as the product's chosen strategy.
- It must show offline replay and cursor synchronization as first-class states.

---

## Topic-Specific Visual Grammar

These rules are mandatory for Wave 2 so the hardest concepts stay readable without relying on surrounding prose.

### Netflix

- **Default view = playback path**: title selection → playback session → manifest → CDN → viewer. Recommendation flow appears only through a scenario toggle or secondary branch focus.
- **Edge styling must be explicit**:
  - Blue = browse/session bootstrap
  - Green = healthy CDN hit / media delivery
  - Amber = regional cache miss / failover / warming state
  - Red = degraded discovery or blocked playback dependency
- **CDN hierarchy must read like tiers, not a single box**: edge labels must explicitly show `edge hit`, `regional pull`, and `origin fetch`.
- **Resume state must be visible on the canvas**: `Continue Watching` is not a hidden note. Show saved progress as a badge on Session Cache and on the second device when resume is triggered.

### Zoom / Google Meet

- **Control plane and media plane must be visually separated** with lanes or zones. Signaling must never look identical to RTP media flow.
- **Edge styling must be explicit**:
  - Dashed blue = signaling / participant state
  - Solid green = healthy media publish / subscribe
  - Amber = TURN relay / reconnect / degraded quality
  - Red = packet-loss or session failure state
- **Participant emphasis must be obvious**: active speaker gets a visible halo, screen share gets a dominant frame, and degraded participants show an amber state badge before they disappear.
- **Default scenario must stay small**: start with host + guest only. Additional participants appear only through a control so the first read stays understandable.

### Google Docs

- **Default view = one chosen collaboration strategy**. OT vs CRDT comparison appears only when the toggle is enabled; do not show both lanes by default.
- **Operation classes must be visually distinct**:
  - Solid green = acknowledged content ops
  - Dotted blue = cursor / presence updates
  - Amber = local pending ops / offline replay
  - Red = transform conflict or failed replay state
- **Cursor identity must stay stable**: the same user color must repeat across cursor, presence chip, and operation badge so the user can track authorship without rereading labels.
- **Version movement must be visible**: pending, acked, and rebased states need badges near the operation path. The user should see convergence happen, not infer it from text.

---

## Pilot Sequence

Use a staged approach instead of implementing all three topics in parallel.

### Stage 1: `TranscodingPipelineSim` Netflix Wrapper

- Start with **Netflix** because it validates the first Hard-wave primitive reuse from Part 1.
- Use it to prove that a shared simulation can feel product-specific when the teaching story changes from upload to playback.

### Stage 2: `RealtimeCollabSim` Pilot

- Implement **Google Docs** second.
- Use it to validate multi-user state visualization, cursor presence, and conflict resolution before tackling the densest live-media topic.

### Stage 3: `ConferenceMediaSim` Pilot

- Implement **Zoom / Google Meet** last.
- Use it to validate the most complex Wave 2 visual: simultaneous media routing, participant state, network degradation, and recording.

---

## Topic 4: Netflix

**File:** `src/content/case-studies/netflix.mdx`
**Difficulty:** Hard | **Wave:** 2 | **Order:** 4

### Introduction
"Netflix is like a global movie theater chain where every seat has a private projector. The system must figure out what you want to watch, fetch the right version for your device and network, and start the stream almost instantly from a nearby cache instead of shipping film reels across the world every time."

### Why This Matters & Prerequisites
**Why This Matters:**
Netflix is a canonical example of large-scale video delivery: recommendation-driven discovery, adaptive bitrate playback, CDN locality, device-specific manifests, and continuous experimentation. It is also the cleanest contrast with YouTube: one is upload-heavy and creator-driven, the other is playback-heavy and catalog-driven.

**Who Should Read This:**
- 🟢 **Beginners**: Understand how a title becomes playable quickly across TVs, phones, and laptops
- 🟡 **Intermediate**: Design playback APIs, ABR behavior, CDN cache hierarchies, and session progress sync
- 🔴 **Advanced**: Optimize multi-region playback failover, personalization ranking, and experimentation at global scale

**Prerequisites:** [YouTube](/case-studies/youtube), [Caching Strategies](/topics/caching-strategies), [Consistent Hashing](/topics/consistent-hashing), [Load Balancers](/topics/load-balancers)

### Requirements
**Functional:**
1. Browse personalized home feed and title detail pages
2. Start playback on any device with adaptive bitrate streaming
3. Resume playback across devices (`Continue Watching`)
4. Support subtitles, audio tracks, and DRM policies by device
5. Serve downloads or offline-ready manifests for supported devices

**Non-Functional:**
1. Playback start time < 2 seconds
2. Rebuffer ratio < 0.5% of viewing time
3. 99.99% playback availability
4. Recommendation response p99 < 300ms
5. Global regional failover without session loss for most viewers

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Monthly active accounts | 300M+ | Global footprint |
| Peak concurrent streams | 40M | Prime-time peaks |
| Daily watch time | 500M+ hours/day | Large catalog consumption |
| Avg bitrate | 4-12 Mbps | Depends on device + quality |
| Peak CDN egress | ~100 Tbps | Global playback bursts |
| Recommendation requests | 8B/day | Home + watch-next + browse |
| Progress updates | 200K/sec peak | Batched session heartbeats |

### API Design
```http
GET /api/v1/home
Response: {
  rows: [{ title: "Continue Watching", items: [...] }, { title: "Top Picks", items: [...] }],
  requestId: string
}

GET /api/v1/titles/{titleId}
Response: {
  titleId,
  synopsis,
  artwork,
  maturityRating,
  availableAudioTracks,
  availableSubtitleTracks
}

POST /api/v1/playback/sessions
Body: { titleId: string, deviceClass: "tv" | "mobile" | "web", drmCapabilities: string[] }
Response: {
  sessionId,
  manifestUrl,
  cdnToken,
  resumePositionSecs,
  recommendedQualityStart: "720p"
}

PUT /api/v1/playback/sessions/{sessionId}/progress
Body: { positionSecs: number, bitrateKbps: number, rebufferMs: number }
Response: 202

GET /api/v1/recommendations/watch-next?titleId={titleId}
Response: { items: [{ titleId, artwork, score, reason }] }
```

### Data Model
```sql
titles (
  title_id BIGINT PRIMARY KEY,
  content_type VARCHAR(16), -- movie | episode | trailer
  series_id BIGINT,
  season_no INT,
  episode_no INT,
  maturity_rating VARCHAR(16),
  duration_secs INT,
  artwork JSONB,
  availability_regions TEXT[],
  published_at TIMESTAMP
)

playback_sessions (
  session_id UUID PRIMARY KEY,
  profile_id BIGINT NOT NULL,
  title_id BIGINT NOT NULL,
  device_class VARCHAR(16),
  current_position_secs INT,
  current_bitrate_kbps INT,
  last_cdn_region VARCHAR(32),
  updated_at TIMESTAMP
)

recommendation_events (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT NOT NULL,
  title_id BIGINT NOT NULL,
  event_type VARCHAR(24), -- impression | play | complete | thumbs_up
  event_value NUMERIC,
  created_at TIMESTAMP
)
```
**DB Choice:** Cassandra/BigTable for high-volume recommendation and playback events. PostgreSQL or sharded MySQL for catalog metadata. Redis for hot `Continue Watching` and personalization caches.

### Architecture Diagram (`netflix-arch`)

```
[Viewer] → [API Gateway] → [Playback API] → [Manifest Service]
                           ↘                 ↘
                            [Recommendation Service] → [Feature Store]
                           ↘                 ↘
                            [Session Cache]   [Origin Library]
                                              ↓
                                      [CDN Hierarchy]
                                              ↓
                                           [Viewer]
```

**Nodes:**
- `ClientNode` → "Viewer" (sublabel: "TV · Mobile · Web")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Device policy · Region route")
- `ServiceNode` → "Playback API" (sublabel: "Session create · Resume · Heartbeats")
- `ServiceNode` → "Manifest Service" (sublabel: "DASH/HLS · DRM policy · Device-aware variants")
- `ServiceNode` → "Recommendation Service" (sublabel: "Home rows · Watch next · Personalization")
- `DatabaseNode` → "Feature Store" (sublabel: "Watch history · Taste vectors · Experiment features")
- `CacheNode` → "Session Cache" (sublabel: "Continue watching · Recent session state")
- `DatabaseNode` → "Origin Library" (sublabel: "Encoded masters · Subtitle/audio assets")
- `LoadBalancerNode` → "CDN Hierarchy" (sublabel: "Edge → Regional → Origin shield")

**Edges:**
- Viewer → Gateway: animated, label "Browse / play request"
- Gateway → Playback API: animated, label "Create playback session"
- Playback API → Manifest Service: animated, label "Get device-safe manifest"
- Playback API → Session Cache: animated, label "Resume position"
- Manifest Service → CDN Hierarchy: animated, label "Manifest + segment URLs"
- CDN Hierarchy → Viewer: animated, label "Adaptive bitrate segments"
- Gateway → Recommendation Service: animated, label "GET /home"
- Recommendation Service → Feature Store: animated, label "Fetch profile features"
- CDN Hierarchy → Origin Library: dim, label "Origin fetch on cache miss"

### Read & Write Paths
**Read (Start Playback):**
1. Viewer selects title → API Gateway authenticates device/profile
2. Playback API creates a session and checks `Continue Watching` state from Session Cache
3. Manifest Service generates a DRM/device-aware DASH or HLS manifest
4. Viewer requests segments from the nearest CDN edge
5. Player measures throughput and changes quality level per segment

**Write (Playback Progress):**
1. Client sends heartbeat every few seconds with `positionSecs`, bitrate, and rebuffer metrics
2. Playback API updates Session Cache immediately
3. Progress and QoE events are written asynchronously to analytics storage
4. Recommendation Service consumes completion/engagement signals to refresh home rows later

### Deep Dives
1. **Playback-First Wrapper:** Unlike YouTube, the hot path starts at title selection, not ingest. The visualization must teach playback locality, device manifests, and resume state before it ever mentions content preparation.
2. **Open Connect / CDN Locality:** Netflix's advantage is delivering segments from caches close to ISPs. The difference between edge hit and origin fetch is the key latency/cost lesson.
3. **Recommendation Decoupling:** Recommendation quality matters for product value, but playback must survive if recommendation services are degraded. The diagram should visually separate discovery from delivery.

### Implementation Patterns
**Playback Session Bootstrap:**
```typescript
async function createPlaybackSession(input: CreatePlaybackSessionInput) {
  const resume = await sessionCache.get(`resume:${input.profileId}:${input.titleId}`);
  const manifest = await manifestService.build({
    titleId: input.titleId,
    deviceClass: input.deviceClass,
    drmCapabilities: input.drmCapabilities,
  });

  const session = await db.playbackSessions.insert({
    profileId: input.profileId,
    titleId: input.titleId,
    deviceClass: input.deviceClass,
    currentPositionSecs: resume?.positionSecs ?? 0,
    currentBitrateKbps: 0,
    lastCdnRegion: manifest.preferredRegion,
    updatedAt: new Date(),
  });

  return {
    sessionId: session.sessionId,
    manifestUrl: manifest.url,
    resumePositionSecs: session.currentPositionSecs,
    recommendedQualityStart: manifest.initialQuality,
  };
}
```

**Batched Progress Updates:**
```typescript
async function recordPlaybackProgress(input: PlaybackHeartbeat) {
  await sessionCache.set(
    `resume:${input.profileId}:${input.titleId}`,
    { positionSecs: input.positionSecs, bitrateKbps: input.bitrateKbps },
    { ttlSeconds: 60 * 60 * 24 * 30 }
  );

  await analyticsQueue.publish('playback.qoe', {
    sessionId: input.sessionId,
    titleId: input.titleId,
    positionSecs: input.positionSecs,
    rebufferMs: input.rebufferMs,
    bitrateKbps: input.bitrateKbps,
    capturedAt: Date.now(),
  });
}
```

### Scaling Strategy
- **0→10M streams/day:** Single-region playback API + managed CDN + basic collaborative filtering
- **10M→100M:** Multi-region manifests, ISP-near edge caches, batched session analytics, row-based recommendations
- **100M→500M:** Dedicated origin shielding, device-aware ABR tuning, large-scale experiment platform, stronger personalization features
- **500M+ hours/day:** Regional failover orchestration, predictive cache warming, per-device QoE optimization, near-real-time home row refresh

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| CDN edge outage in a region | Higher startup latency / rebuffer risk | Fail to nearest healthy regional cache. Session preserves progress |
| Recommendation service outage | Home page quality drops | Fallback rows: trending, continue watching, editorial shelves |
| DRM/license service lag | Playback start delays | Short-lived license cache + retry budget + grace mode for active sessions |
| Session cache loss | Resume position missing | Fall back to last durable playback event from analytics store |
| Origin library degradation | Cache misses get expensive | Stale cache serve + regional origin shielding + controlled failover |
| Bad ABR tuning rollout | Rebuffer spike | Experiment guardrails and quick rollback per device class |

**Production Monitoring:** playback start time, rebuffer ratio, CDN hit rate, QoE by device class, recommendation response time, resume accuracy
**How Netflix Actually Differs:** Netflix runs Open Connect appliances close to ISPs, uses heavy experimentation across devices, and separates discovery, playback, and encoding concerns into many services. Our plan simplifies the estate to focus on the key learning flows.

### System Flows (Interactive) — `<TranscodingPipelineSim mode="netflix" />` + playback/recommendation wrapper

**Controls:**
- **"Play Title" button** → Starts a playback session from the home row
- **"Network Drop" toggle** → Simulates weaker bandwidth and forces ABR downgrade
- **"CDN Miss" toggle** → Forces an origin-shield fetch path
- **"Recommendation Down" toggle** → Shows graceful degradation on the browse path
- **"Resume on TV" button** → Opens the same title on a second device using saved progress

**Animations:**
1. **"Play Title"**: Viewer selects a title card → Playback API creates session → Session Cache provides resume position → manifest appears → CDN edge lights green → first segments stream to viewer → playback badge changes to `Playing · 1080p`
2. **"Network Drop"**: Throughput meter falls → quality badge steps down `1080p → 720p → 480p` → segment flow narrows visually → stream continues without hard stop
3. **"CDN Miss"**: Edge node flashes red `MISS` → request waterfall lights `Edge → Regional → Origin` → edge becomes amber `WARMING` → next request returns green `HIT`
4. **"Recommendation Down"**: Home-row request to Recommendation Service dims red → fallback shelves animate in (`Trending`, `Because you watched`, `Continue Watching` from cache)
5. **"Resume on TV"**: Mobile session writes `position=1432s` → TV client opens title → Session Cache returns resume point → TV stream starts at the saved timestamp badge

### Tradeoffs (4/4)
**Pros:** CDN-first delivery keeps startup times low worldwide, playback and discovery are decoupled so the core stream survives recommendation issues, ABR keeps sessions alive on unstable networks, session caching makes cross-device resume feel instant
**Cons:** Multi-region CDN coordination is expensive, recommendation systems create major infra and experimentation complexity, DRM/device policy adds operational friction, long-tail catalog items still suffer more misses and worse startup latency

### FAQ (4 Questions)
1. **Why is Netflix's hot path different from YouTube's?** — Netflix is mostly catalog playback. The user journey starts at discovery and playback, not upload and transcode. The architecture must optimize stream start, locality, and personalization.
2. **Why not tie recommendations directly into playback availability?** — That creates a brittle system. Recommendations can degrade gracefully, but the playback path needs independent reliability.
3. **How does Netflix resume playback across devices?** — Session progress is cached and later persisted from heartbeats/events. A new device session reads that position during playback bootstrap.
4. **Why are CDN misses so important to teach visually?** — They explain both latency and cost. Users feel the startup delay; engineers pay for the origin traffic.

### Interview Notes (5 Points)
1. **Playback is the primary hot path**: Know session create → manifest → CDN → ABR → heartbeats
2. **Recommendation is a product multiplier, not the playback backbone**: Separate discovery from delivery
3. **CDN hierarchy is the cost and latency lever**: Edge hit vs origin miss is the key mental model
4. **Session progress sync matters**: `Continue Watching` is a real system design problem, not UI sugar
5. **Graceful degradation wins**: Trending/fallback rows + stable playback are better than all-or-nothing personalization

### Key Takeaways (5 Points)
1. Netflix is a playback-first architecture, not an upload-first one
2. ABR and CDN locality are the two most important streaming ideas to visualize clearly
3. Recommendation outages should degrade discovery, not break playback
4. Resume state and QoE telemetry are core platform features, not side data
5. Shared media primitives only work if the wrapper changes the teaching story meaningfully

### Related Topics
`youtube`, `caching-strategies`, `load-balancers`, `consistent-hashing`, `event-driven-architecture`

---

## Topic 5: Zoom / Google Meet

**File:** `src/content/case-studies/zoom-google-meet.mdx`
**Difficulty:** Hard | **Wave:** 2 | **Order:** 5

### Introduction
"A video meeting system is like a live stage production where every participant is both an audience member and a performer. The system must get your camera and microphone to everyone else fast enough to feel natural, recover when networks wobble, and keep side features like recording and screen sharing synchronized without turning the call into a slideshow."

### Why This Matters & Prerequisites
**Why This Matters:**
Zoom and Google Meet make distributed communication possible through WebRTC, selective forwarding, bandwidth adaptation, and large-scale session orchestration. They are the best case study for teaching the difference between signaling, media routing, and participant state.

**Who Should Read This:**
- 🟢 **Beginners**: Understand how people join a call and why media needs a relay
- 🟡 **Intermediate**: Design SFU-based media routing, participant state sync, and recording pipelines
- 🔴 **Advanced**: Handle bandwidth adaptation, regional failover, large calls, and reconnect behavior at scale

**Prerequisites:** [Load Balancers](/topics/load-balancers), [Kafka](/topics/kafka), [Service Discovery](/topics/service-discovery), [Rate Limiting](/topics/rate-limiting)

### Requirements
**Functional:**
1. Create and join meetings with host/guest permissions
2. Publish and receive audio/video streams with mute/unmute support
3. Support screen sharing and active-speaker layout updates
4. Record meetings to cloud storage
5. Recover from brief disconnects without forcing full rejoin

**Non-Functional:**
1. Join time < 3 seconds for most participants
2. End-to-end interactive latency < 300ms
3. Packet loss should degrade quality before causing call failure
4. 99.99% meeting continuity for active sessions
5. Support large meetings with hundreds to thousands of listeners/viewers

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Daily meeting participants | 250M/day | Global collaboration load |
| Peak concurrent meetings | 5M | Work-hour overlap |
| Peak active media publishers | 25M | Cameras + microphones |
| Avg upstream per participant | 1-3 Mbps | Camera + audio |
| SFU downstream fan-out | 10-1000 subscribers | Meeting size dependent |
| Recording jobs/day | 20M | Many meetings recorded |
| Peak signaling events | 2M/sec | Join/leave/mute/layout churn |

### API Design
```http
POST /api/v1/meetings
Body: { hostId: string, title: string, scheduledStartAt?: string }
Response: { meetingId, joinUrl, hostToken }

POST /api/v1/meetings/{meetingId}/join
Body: { participantId: string, deviceClass: "web" | "mobile" | "desktop" }
Response: {
  participantToken,
  signalingUrl,
  iceServers: [{ urls: ["stun:...", "turn:..."] }],
  assignedRegion: "ap-south-1"
}

POST /api/v1/meetings/{meetingId}/recordings/start
Body: { layout: "speaker" | "gallery" }
Response: 202 { recordingJobId }

WebSocket /signal/{meetingId}
Events:
  OFFER { sdp }
  ANSWER { sdp }
  ICE_CANDIDATE { candidate }
  PARTICIPANT_STATE { muted, handRaised, screenSharing }
```

### Data Model
```sql
meetings (
  meeting_id UUID PRIMARY KEY,
  host_id BIGINT NOT NULL,
  title VARCHAR(200),
  region VARCHAR(32),
  status VARCHAR(16), -- scheduled | active | ended
  started_at TIMESTAMP,
  ended_at TIMESTAMP
)

participants (
  meeting_id UUID,
  participant_id BIGINT,
  role VARCHAR(16), -- host | guest | viewer
  muted BOOLEAN,
  video_enabled BOOLEAN,
  screen_sharing BOOLEAN,
  connection_state VARCHAR(24), -- joining | connected | reconnecting | dropped
  PRIMARY KEY (meeting_id, participant_id)
)

recordings (
  recording_id UUID PRIMARY KEY,
  meeting_id UUID NOT NULL,
  layout VARCHAR(16),
  status VARCHAR(16), -- queued | processing | ready | failed
  storage_path TEXT,
  created_at TIMESTAMP
)
```
**DB Choice:** Redis for hot participant state and meeting membership. PostgreSQL for meeting metadata and recording jobs. Object storage for recordings. Kafka or NATS for high-volume participant-state events.

### Architecture Diagram (`zoom-google-meet-arch`)

``` 
[Participants] → [Meeting Gateway] → [Signaling Service]
        ↓                 ↓                 ↓
     [TURN/STUN]      [Session Cache]    [SFU Cluster]
                                              ↓          ↘
                                      [Recording Queue]   [QoE Store]
                                              ↓
                                    [Recording Service] → [Object Storage]
```

**Nodes:**
- `ClientNode` x3 → "Host" (sublabel: "Audio · Video · Screen share"), "Guest" (sublabel: "Join · Speak · Chat"), "Mobile User" (sublabel: "Low bandwidth · background state")
- `LoadBalancerNode` → "Meeting Gateway" (sublabel: "Auth · Regional entrypoint · Rate limit")
- `ServiceNode` → "Signaling Service" (sublabel: "Offer/answer · ICE candidates · participant state")
- `ServiceNode` → "TURN/STUN" (sublabel: "NAT traversal · relay fallback")
- `CacheNode` → "Session Cache" (sublabel: "Participant state · active speaker · reconnect tokens")
- `ServiceNode` → "SFU Cluster" (sublabel: "Selective forwarder · simulcast layer choice")
- `QueueNode` → "Recording Queue" (sublabel: "Async record / transcode jobs")
- `ServiceNode` → "Recording Service" (sublabel: "Mix layout metadata · write archives")
- `DatabaseNode` → "Object Storage" (sublabel: "Cloud recordings")
- `DatabaseNode` → "QoE Store" (sublabel: "Packet loss · jitter · join time metrics")

**Edges:**
- Participants → Gateway: animated, label "Join meeting"
- Gateway → Signaling Service: animated, label "WS signaling session"
- Signaling Service → TURN/STUN: animated, label "ICE server selection"
- Participants → SFU Cluster: animated, label "WebRTC media publish / subscribe"
- Signaling Service → Session Cache: animated, label "Mute / screen share / presence state"
- SFU Cluster → Recording Queue: animated, label "Record composite / track set"
- Recording Queue → Recording Service: animated, label "Async recording job"
- Recording Service → Object Storage: animated, label "Persist recording"
- SFU Cluster → QoE Store: animated, label "QoE events"

### Read & Write Paths
**Write (Join + Publish):**
1. Participant joins via Meeting Gateway and receives signaling endpoint + ICE servers
2. Client exchanges offer/answer and ICE candidates with Signaling Service
3. Media path is established to the nearest SFU
4. Session Cache stores mute state, participant presence, and active speaker hints
5. Other participants subscribe to selected audio/video layers from the SFU

**Read (Receive Meeting Media):**
1. Subscriber client receives available layers/streams from the SFU
2. Client picks the appropriate quality per remote participant based on bandwidth and layout
3. Active speaker and screen-share priority alter subscription choices dynamically
4. QoE metrics are recorded continuously for debugging and adaptation

### Deep Dives
1. **SFU vs MCU:** SFU forwards selected streams without heavy server-side compositing, which preserves quality and scales better. MCU simplifies clients but explodes server cost and latency.
2. **Simulcast / Layer Selection:** Publishers can send multiple qualities. The SFU forwards the best available layer to each participant based on bandwidth and viewport importance.
3. **Reconnect Semantics:** The user should feel like the meeting survived. Reconnect tokens, participant state caching, and quick stream re-subscription are part of the hot path.

### Implementation Patterns
**Select Remote Video Layer:**
```typescript
function chooseRemoteLayer(input: {
  estimatedBandwidthKbps: number;
  isActiveSpeaker: boolean;
  isScreenShare: boolean;
  availableLayers: Array<{ id: string; bitrateKbps: number }>;
}) {
  if (input.isScreenShare) {
    return input.availableLayers.sort((a, b) => b.bitrateKbps - a.bitrateKbps)[0];
  }

  const ceiling = input.isActiveSpeaker
    ? input.estimatedBandwidthKbps * 0.8
    : input.estimatedBandwidthKbps * 0.4;

  return input.availableLayers
    .filter((layer) => layer.bitrateKbps <= ceiling)
    .sort((a, b) => b.bitrateKbps - a.bitrateKbps)[0] ?? input.availableLayers[0];
}
```

**Issue Reconnect Token:**
```typescript
async function issueReconnectToken(meetingId: string, participantId: string) {
  const token = crypto.randomUUID();
  await sessionCache.set(
    `reconnect:${meetingId}:${participantId}`,
    { token, expiresAt: Date.now() + 30_000 },
    { ttlSeconds: 30 }
  );
  return token;
}
```

### Scaling Strategy
- **0→100K daily participants:** Single-region SFU cluster, managed TURN, basic meeting metadata store
- **100K→10M:** Regional SFU pools, Redis-backed participant state, async recording queue, simulcast for active speakers
- **10M→100M:** Multi-region meeting placement, QoE-driven adaptation, large-meeting listener tiers, dedicated recording fleet
- **100M+ daily participants:** Dynamic regional spillover, selective screen-share prioritization, predictive reconnect handling, specialized low-latency media routing

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| SFU node crash | Participants lose media | Fast reattach to same-region standby SFU with reconnect token |
| TURN saturation | NATed users cannot connect well | Regional relay pools + autoscaling + direct path preference |
| Recording pipeline lag | Recording delayed or partial | Async queue + retryable segment writes + visible recording health |
| Packet loss spike | Frozen video / robotic audio | Audio-first fallback, lower video layers, screen-share prioritization |
| Signaling outage | New participants cannot join | Existing media stays alive; degrade to no new join / no layout updates |
| Hot meeting overload | Too many subscriptions on one SFU | Large-meeting fan-out tiers and overflow routing |

**Production Monitoring:** join time, packet loss, jitter, reconnect success rate, active speaker switch latency, recording completion success
**How Real Systems Differ:** Zoom, Meet, and Teams all use variants of regional media routing, TURN relay fallback, selective forwarding, and device-class-specific adaptation. The exact transport and control stack differs, but the teaching model stays the same: signaling is not media, and resilience depends on fast state recovery.

### System Flows (Interactive) — `<ConferenceMediaSim />`

**Controls:**
- **"Join Meeting" button** → Starts signaling + media setup
- **"Screen Share" toggle** → Switches one participant into presentation mode
- **"Packet Loss" slider** → Degrades network quality and forces lower media layers
- **"Start Recording" button** → Sends the session through the recording pipeline
- **"Reconnect User" button** → Drops and restores one participant with cached state

**Animations:**
1. **"Join Meeting"**: Host and Guest connect to Signaling Service → ICE candidates appear → TURN/STUN path selected if needed → media streams attach to SFU → participant badges flip to `Connected`
2. **"Screen Share"**: Screen-share stream lights in blue → SFU prioritizes it visually → remote clients downgrade non-presenter video tiles to smaller layers
3. **"Packet Loss"**: Packet-loss meter rises → video layers step down → audio lane remains green longer than video → participant badge shows `Degraded but alive`
4. **"Start Recording"**: Recording Queue receives job → Recording Service highlights active → archive file progress appears in Object Storage panel
5. **"Reconnect User"**: One participant drops red `Disconnected` → reconnect token path lights amber → participant rejoins the same session state without full meeting rebuild

### Tradeoffs (4/4)
**Pros:** SFU-based routing scales better than full mixing, simulcast keeps calls usable under varied bandwidth, reconnect tokens preserve meeting continuity, recording remains decoupled from the live path
**Cons:** WebRTC state is operationally complex, TURN relay traffic is expensive, large meetings create fan-out pressure, screen-share and active-speaker policies add UX-sensitive complexity

### FAQ (4 Questions)
1. **Why not send every participant every stream at the same quality?** — Bandwidth and device limits make that impossible. Quality must be adapted per participant and layout importance.
2. **Why is SFU usually preferred over MCU?** — SFU avoids server-side re-encoding for every participant, which reduces cost and latency. Clients do more work, but the system scales better.
3. **Why separate signaling from media?** — Signaling negotiates the connection; media is the continuous stream. Conflating them makes the architecture much harder to reason about.
4. **How does reconnect feel seamless?** — Participant identity, stream subscriptions, and mute state are cached long enough for a fast reattach.

### Interview Notes (5 Points)
1. **The main mental split is signaling vs media**: know what runs over WebSocket and what runs over WebRTC
2. **SFU is the common large-scale choice**: forward selected streams instead of mixing everything centrally
3. **Network degradation should downshift quality before it kills the call**
4. **Recording must be async from the live meeting path**
5. **Reconnect is part of the hot path**: real products are judged on recovery, not just best-case quality

### Key Takeaways (5 Points)
1. Video conferencing is a stateful live-routing problem, not just a streaming problem
2. SFU, simulcast, and reconnect state are the three most important ideas to visualize clearly
3. Audio usually gets priority over video under bad network conditions
4. Recording and analytics should observe the meeting, not block it
5. A premium learning visualization must make multi-party live state readable in seconds

### Related Topics
`load-balancers`, `kafka`, `service-discovery`, `rate-limiting`, `youtube`

---

## Topic 6: Google Docs

**File:** `src/content/case-studies/google-docs.mdx`
**Difficulty:** Hard | **Wave:** 2 | **Order:** 6

### Introduction
"Google Docs is like a shared whiteboard where everyone can write at once without grabbing the marker away from each other. The hard part is not storing text; it is making every user's screen converge on the same document even when edits happen at the same time or one person briefly goes offline."

### Why This Matters & Prerequisites
**Why This Matters:**
Google Docs is the definitive collaborative-editing system design problem. It forces you to reason about operational transform vs CRDTs, remote cursor presence, offline edits, snapshots, and version history in one product.

**Who Should Read This:**
- 🟢 **Beginners**: Understand the idea of shared document state and why concurrent edits conflict
- 🟡 **Intermediate**: Design operation logs, snapshots, and remote cursor sync
- 🔴 **Advanced**: Compare OT vs CRDT, handle hot documents, and recover from offline divergence

**Prerequisites:** [Event-Driven Architecture](/topics/event-driven-architecture), [Caching Strategies](/topics/caching-strategies), [Exactly-Once Processing](/topics/exactly-once-processing), [Chat System](/case-studies/chat-system)

### Requirements
**Functional:**
1. Multiple users edit the same document in real time
2. Show remote cursors and selections
3. Preserve version history and snapshots
4. Support comments and suggestions
5. Allow brief offline edits with replay on reconnect

**Non-Functional:**
1. Remote edits visible in < 150ms in normal conditions
2. Strong convergence: all clients eventually agree on the same document
3. 99.99% durability for document state and history
4. Recover from disconnects without losing acknowledged edits
5. Support hot documents with hundreds of simultaneous viewers and dozens of active editors

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Documents stored | 1B+ | Consumer + enterprise use |
| Active collaborative docs | 10M/day | Multi-user sessions |
| Peak concurrent editors | 5M | Work-hour spikes |
| Peak ops/sec | 500K/sec | Typing + formatting + comments |
| Avg active editors per hot doc | 5-20 | Team docs |
| Snapshot frequency | Every 100 ops or 30s | Recovery / compaction |
| Version history retention | Years | Product expectation |

### API Design
```http
GET /api/v1/documents/{docId}
Response: {
  docId,
  snapshotVersion,
  content,
  activeUsers: [{ userId, color }],
  lastSnapshotAt
}

WebSocket /docs/{docId}
Events:
  CLIENT_OP { opId, baseVersion, op }
  SERVER_ACK { opId, appliedVersion }
  REMOTE_OP { opId, appliedVersion, transformedOp }
  PRESENCE { userId, cursor, selection }

POST /api/v1/documents/{docId}/comments
Body: { range, body }
Response: 201 { commentId }

GET /api/v1/documents/{docId}/history?beforeVersion=1234
Response: { snapshots: [...], operations: [...] }
```

### Data Model
```sql
documents (
  doc_id UUID PRIMARY KEY,
  title VARCHAR(255),
  owner_id BIGINT NOT NULL,
  latest_version BIGINT NOT NULL,
  latest_snapshot_id UUID,
  updated_at TIMESTAMP
)

operations (
  doc_id UUID,
  version BIGINT,
  op_id UUID,
  author_id BIGINT,
  base_version BIGINT,
  op JSONB,
  created_at TIMESTAMP,
  PRIMARY KEY (doc_id, version)
)

snapshots (
  snapshot_id UUID PRIMARY KEY,
  doc_id UUID NOT NULL,
  version BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP
)
```
**DB Choice:** PostgreSQL or Spanner-like metadata store for document pointers and permissions. Append-only op log in Cassandra/BigTable. Redis for hot presence/cursor state. Blob/object storage for large snapshots and exports.

### Architecture Diagram (`google-docs-arch`)

```
[Editors] → [Collab Gateway] → [Sync Engine] → [Operation Log]
     ↓             ↓               ↘            ↘
 [Presence Cache]  [Comment Service] [Snapshot Service] → [Snapshot Store]
                         ↓
                    [Version History]
```

**Nodes:**
- `ClientNode` x3 → "Alice" (sublabel: "Typing · Cursor"), "Bob" (sublabel: "Concurrent editor"), "Carol" (sublabel: "Offline / reconnect")
- `LoadBalancerNode` → "Collab Gateway" (sublabel: "Auth · WS session · doc routing")
- `ServiceNode` → "Sync Engine" (sublabel: "OT/CRDT apply · version ordering · broadcast")
- `DatabaseNode` → "Operation Log" (sublabel: "Append-only ops · per-doc ordering")
- `CacheNode` → "Presence Cache" (sublabel: "Cursors · selections · active users")
- `ServiceNode` → "Snapshot Service" (sublabel: "Compaction every N ops · recovery bootstrap")
- `DatabaseNode` → "Snapshot Store" (sublabel: "Durable document snapshots")
- `ServiceNode` → "Comment Service" (sublabel: "Comments · suggestions · anchors")
- `DatabaseNode` → "Version History" (sublabel: "Named versions · audit trail")

**Edges:**
- Editors → Collab Gateway: animated, label "WebSocket session"
- Collab Gateway → Sync Engine: animated, label "CLIENT_OP / PRESENCE"
- Sync Engine → Operation Log: animated, label "Append ordered op"
- Sync Engine → Editors: animated, label "REMOTE_OP broadcast"
- Collab Gateway → Presence Cache: animated, label "Cursor / selection updates"
- Sync Engine → Snapshot Service: animated, label "Threshold reached"
- Snapshot Service → Snapshot Store: animated, label "Persist snapshot"
- Comment Service → Version History: animated, label "Comment metadata"

### Read & Write Paths
**Write (Concurrent Edit):**
1. Alice types locally and generates an operation against base version `v`
2. Collab Gateway forwards op to Sync Engine
3. Sync Engine transforms or merges against concurrent operations, assigns new version `v+1`
4. Operation is appended to the log and broadcast to other editors
5. Presence updates continue independently so cursor motion is not blocked by text edits

**Read (Open Existing Doc):**
1. Client fetches latest snapshot + recent operations
2. Client reconstructs current state locally
3. WebSocket session attaches to receive remote ops and cursor updates
4. On reconnect, client replays unacked local ops against the newest server version

### Deep Dives
1. **OT vs CRDT:** OT transforms incoming operations against concurrent edits; CRDTs encode operations so order differences still converge. The simulation must make the difference visible rather than theoretical.
2. **Snapshots + Op Log:** Rebuilding from every operation is too slow. Snapshots compact the history so new clients can bootstrap quickly and then replay recent ops.
3. **Presence is separate from content:** Cursor color and selection updates are high churn and low durability. They should not block the durable document path.

### Implementation Patterns
**Simple OT Transform Example:**
```typescript
function transformInsertAgainstInsert(a: InsertOp, b: InsertOp): InsertOp {
  if (a.position < b.position) return a;
  if (a.position > b.position) {
    return { ...a, position: a.position + b.text.length };
  }

  // Tie-break by author/op id for deterministic ordering
  return a.opId < b.opId ? a : { ...a, position: a.position + b.text.length };
}
```

**Replay Unacked Ops After Reconnect:**
```typescript
async function resyncDocumentState(docId: string, localState: LocalDocState) {
  const serverState = await api.fetchDocumentState(docId);
  let content = applySnapshot(serverState.snapshot);
  content = applyOperations(content, serverState.operations);

  for (const pendingOp of localState.unackedOps) {
    content = applyOperation(content, pendingOp);
    ws.send(JSON.stringify({ type: 'CLIENT_OP', op: pendingOp }));
  }

  return { content, baseVersion: serverState.latestVersion };
}
```

### Scaling Strategy
- **0→1M collaborative sessions/day:** Single-region sync engine, append-only op log, periodic snapshots
- **1M→20M:** Doc-sharded sync workers, Redis presence, background snapshot compaction, comment service split out
- **20M→100M:** Multi-region doc routing, hot-doc admission control, richer suggestion/comment pipelines, stronger version-history indexing
- **100M+ sessions/day:** Adaptive hot-doc partitioning, incremental CRDT/OT hybrid strategies, predictive prefetch for recently opened docs, enterprise audit isolation

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Sync worker crash | Temporary edit interruption | Doc session reattached to standby worker; replay from op log |
| Presence cache loss | Cursor indicators disappear | Rehydrate from active WS sessions; content path unaffected |
| Snapshot lag | Slow document open | Cap op replay window and force compaction jobs |
| Offline client reconnect conflict | Divergent local edits | Replay pending ops against latest version, surface conflict if transform fails |
| Hot document overload | Edit latency spikes | Limit active editors, throttle nonessential presence updates, shard observers |
| Comment anchor drift | Comments appear on wrong range | Anchor by logical positions + repair job on version changes |

**Production Monitoring:** op apply latency, ack latency, snapshot freshness, reconnect success rate, cursor staleness, hot-doc saturation
**How Real Systems Differ:** Google Docs uses a highly optimized operational transform lineage with many product-specific details around comments, suggestions, permissions, and rich formatting. The plan here keeps the model approachable while still exposing the core convergence problem.

### System Flows (Interactive) — `<RealtimeCollabSim />`

**Controls:**
- **"Type Text" button** → Applies a local edit from one user
- **"Concurrent Edit" button** → Fires overlapping edits from two users at the same base version
- **"OT / CRDT" toggle** → Switches visual merge strategy lane
- **"Go Offline" toggle** → Queues local edits for one user and replays on reconnect
- **"Add Comment" button** → Anchors a comment to a selected text range

**Animations:**
1. **"Type Text"**: Alice types locally → op badge appears `pending` → Sync Engine assigns new version → Bob and Carol receive `REMOTE_OP` → all documents converge with green `v+1`
2. **"Concurrent Edit"**: Alice and Bob edit the same sentence simultaneously → dual lanes show transform/merge → resulting text converges identically on all clients → version counter increments in lockstep
3. **"OT / CRDT"**: Lane view shifts from transform-first to merge-by-identity → user sees the same end result reached through different mechanisms
4. **"Go Offline"**: Carol's node dims amber `Offline` → local ops stack in a side queue → on reconnect, replay arrows animate back through Sync Engine → final content converges
5. **"Add Comment"**: Comment anchor attaches to a range → later text shifts cause anchor to move with the content instead of staying at a stale absolute index

### Tradeoffs (4/4)
**Pros:** Real-time collaboration feels magical when convergence is fast, operation logs plus snapshots give strong durability and recovery, presence can stay lightweight and separate from the durable path, OT/CRDT separation teaches core distributed-state tradeoffs well
**Cons:** Rich-text editing is much harder than plain text, hot documents create ordering pressure, offline replay introduces tricky edge cases, comments/suggestions add anchor-maintenance complexity beyond raw text ops

### FAQ (4 Questions)
1. **Why not just lock the document so one person edits at a time?** — That destroys the product value. Real-time collaboration exists to let many people work together without serializing all input.
2. **What is the simplest way to explain OT vs CRDT?** — OT changes operations so they still make sense after concurrency. CRDTs encode data so operations can arrive in different orders and still converge.
3. **Why keep presence separate from document content?** — Cursor motion is high frequency and disposable. Document content is durable and order-sensitive.
4. **How do offline edits avoid being lost?** — They are queued locally, replayed against the latest server version, and either transformed or merged on reconnect.

### Interview Notes (5 Points)
1. **Convergence is the main problem**: every client must eventually agree on the same document state
2. **OT vs CRDT is a tradeoff, not a trivia question**: explain why you would pick one for the product
3. **Snapshot + op log is the standard recovery pattern**
4. **Presence is hot but weakly durable**: separate it from the durable content path
5. **Offline replay and hot-doc behavior are where the system becomes truly hard**

### Key Takeaways (5 Points)
1. Google Docs is a distributed state-convergence problem disguised as a text editor
2. The best visualization must show why concurrent edits still converge, not just that they do
3. Snapshots keep document open time reasonable at scale
4. Presence and comments are separate subproblems with different durability needs
5. A strong collaborative editor needs both correctness and clarity under reconnect scenarios

### Related Topics
`event-driven-architecture`, `caching-strategies`, `chat-system`, `exactly-once-processing`, `zoom-google-meet`

---

## New Simulation Component Specs (Wave 2)

### `TranscodingPipelineSim` — Netflix wrapper
| Property | Value |
|---|---|
| **Type** | Shared simulation primitive with `netflix` playback wrapper |
| **Used by** | Netflix |
| **Controls** | Play Title, Network Drop, CDN Miss, Recommendation Down, Resume on TV |
| **Key Visual** | Viewer-first playback path with CDN tier transitions and ABR badge |
| **Wow Factor** | Cache-miss waterfall plus seamless cross-device resume |
| **Data Flow** | Title select → playback session → manifest → CDN → viewer → progress heartbeat |
| **Metrics Shown** | Startup time, current bitrate, rebuffer count, CDN region, resume position |

### `ConferenceMediaSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | Zoom / Google Meet |
| **Controls** | Join Meeting, Screen Share, Packet Loss, Start Recording, Reconnect User |
| **Key Visual** | Participant tiles feeding an SFU with separate signaling and media lanes |
| **Wow Factor** | Live quality downshift while audio survives and screen share stays prioritized |
| **Data Flow** | Join → signal → ICE/TURN → publish to SFU → fan-out → record / reconnect |
| **Metrics Shown** | Join time, packet loss, active participants, selected video layer, reconnect time |

### `RealtimeCollabSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | Google Docs |
| **Controls** | Type Text, Concurrent Edit, OT / CRDT toggle, Go Offline, Add Comment |
| **Key Visual** | Multi-user document panes with operation badges and convergence lanes |
| **Wow Factor** | Concurrent edit lane comparison that still ends in one converged document |
| **Data Flow** | Local op → sync engine → ordered log → remote broadcast → snapshot / replay |
| **Metrics Shown** | Ack latency, current version, unacked ops, snapshot freshness, active cursors |

---

## Dependency Matrix (Wave 2)

| Depends on ↓ / Needed by → | Netflix | Zoom / Google Meet | Google Docs |
|---|---|---|---|
| `ClientNode` | ✅ | ✅ | ✅ |
| `ServiceNode` | ✅ | ✅ | ✅ |
| `DatabaseNode` | ✅ | ✅ | ✅ |
| `QueueNode` | — | ✅ | — |
| `CacheNode` | ✅ | ✅ | ✅ |
| `LoadBalancerNode` | ✅ | ✅ | ✅ |
| `LaneNode` | — | ✅ | ✅ |
| `AnimatedEdge` | ✅ | ✅ | ✅ |
| `TranscodingPipelineSim` | ✅ | — | — |
| `ConferenceMediaSim` | — | ✅ | — |
| `RealtimeCollabSim` | — | — | ✅ |

---

## Implementation Order (Wave 2)

| Priority | Topic | Effort | Rationale |
|---|---|---|---|
| 1 | **Netflix** | Medium | Reuses `TranscodingPipelineSim` from Wave 1. Best place to validate wrapper reuse without inventing a new primitive |
| 2 | **Google Docs** | High | `RealtimeCollabSim` is self-contained and establishes the product's visual language for concurrent state |
| 3 | **Zoom / Google Meet** | Very High | `ConferenceMediaSim` is the densest Wave 2 visual and should come after the collaboration and playback standards are proven |

---

## Verification Plan (Wave 2)

### Shared Wave 2 Readiness
- [ ] All shared Hard prerequisites inherited from Part 1 are complete before Wave 2 content implementation begins
- [ ] `diagramConfigs.ts` contains `netflix-arch`, `zoom-google-meet-arch`, and `google-docs-arch`
- [ ] `TranscodingPipelineSim` supports a Netflix-specific playback wrapper or mode
- [ ] `ConferenceMediaSim` and `RealtimeCollabSim` are scoped before implementation starts
- [ ] Wave 1 quality bar is treated as the minimum, not the target ceiling

### Visual QA Rubric
- [ ] A new user can identify the main path within 10 seconds without reading surrounding prose
- [ ] Hover, click, scenario toggle, and replay/reset interactions are present and meaningful
- [ ] Primary path and fallback/degraded path are visually distinguishable
- [ ] Legends, labels, badges, and overlays are sufficient to understand the diagram without extra decoding
- [ ] Multi-party state remains comprehensible when several components animate at once
- [ ] Netflix clearly separates discovery/bootstrap flow from playback/CDN flow
- [ ] Zoom / Google Meet clearly separates signaling flow from media flow
- [ ] Google Docs clearly separates durable content ops from presence and offline replay states
- [ ] The visualization feels like a product feature, not a static diagram with motion layered on top

### Per-Topic Checklist
- [ ] All 18 sections present and populated per template
- [ ] React Flow architecture diagram renders with correct nodes, sublabels, and animated edges
- [ ] Simulation loads with all controls functional
- [ ] Simulation explains at least one degraded or fallback state clearly
- [ ] Section counts: Tradeoffs (4/4), FAQ (4), Interview Notes (5), Key Takeaways (5)
- [ ] Implementation code examples are valid TypeScript with comments
- [ ] Scaling strategy covers 4 stages with specific technologies at each stage
- [ ] Failure scenarios table has 6+ rows with realistic mitigations

### Wave 2 Exit Criteria
- [ ] Netflix: playback wrapper shows session bootstrap, ABR fallback, CDN miss path, and graceful recommendation degradation
- [ ] Zoom / Google Meet: `ConferenceMediaSim` shows join → publish → SFU fan-out, screen-share priority, reconnect, and recording flow
- [ ] Google Docs: `RealtimeCollabSim` shows concurrent edit convergence, OT/CRDT comparison, cursor sync, and offline replay
- [ ] All 3 topics pass the shared Hard visual QA rubric
- [ ] No P0 or P1 issues in visualization review
