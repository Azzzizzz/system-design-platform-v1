# Phase 5 (Medium): Case Studies Sprint Plan — Part 2

> **Goal:** Complete 2 of 5 Medium case studies (Instagram, Web Crawler) using the enhanced 18-section template.

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
**Cons:** High infrastructure cost (350 TB/day), complex dedup correctness (canonicalization edge cases), strong ops burden (robots.txt changes, abuse handling), Bloom filter has inherent false positive rate (trade-off vs memory)

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
