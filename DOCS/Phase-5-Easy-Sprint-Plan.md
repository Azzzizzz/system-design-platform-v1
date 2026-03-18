# Phase 5 (Easy): Case Studies Sprint Plan

> **Goal:** Complete 4 Easy case studies that introduce the case study format with foundational systems. Each follows the enhanced 18-section template (4 layers: Beginner → Core → Intermediate → Advanced).

---

## Reusable Asset Inventory

### Reusable Visual Primitives (existing or required before sprint start)
| Node/Edge | Reused As |
|---|---|
| `ClientNode` | Users, API callers, log producers |
| `ServiceNode` | Application servers, API services, aggregators |
| `DatabaseNode` | Primary stores, time-series DBs |
| `LoadBalancerNode` | API Gateway, load balancers, routers |
| `CacheNode` | Redis, Memcached layers |
| `QueueNode` | Kafka topics, message queues |
| `LaneNode` | Before/After comparisons, growth stages |
| `AnimatedEdge` | All data-flow connections |

### New Components Needed (Phase 5 Easy)
| Component | Type | Purpose | Reused By |
|---|---|---|---|
| `CapacityEstimationCard` | UI Component | Visual table for back-of-envelope calculations | All 16 case studies |

> **Planning rule:** Easy topics should introduce the case study format with minimal new visual paradigms. Reuse existing React Flow primitives first, but only claim reuse for components that actually exist in the codebase at sprint start.

---

## Visualization Contract (Mandatory For All 4 Topics)

These diagrams are a core product feature, not decorative support. Every Easy case study must use React Flow in a way that teaches the system visually, not just renders boxes and arrows.

### Required Interaction Model

| Interaction | Required Behavior | Learning Purpose |
|---|---|---|
| Hover | Show a short explanation for the node/edge (`what it is` + `why it exists`) | Makes the diagram self-explanatory |
| Click | Open an inspect panel or inline details state for the selected component | Lets users explore architecture intentionally |
| Scenario Toggle | Switch between at least 3 states: `primary path`, `alternative path`, `failure or fallback path` | Helps users compare system behavior |
| Replay / Reset | Replay the active system flow and reset back to baseline | Supports repetition and interview prep |
| Visible Legend | Explain colors, line styles, status badges, and zones | Prevents interpretation ambiguity |

### Required Visual Grammar

- Every node must have a clear label and a short sublabel.
- Every important edge must be labeled with the action or payload (`cache hit`, `INCR`, `redirect`, `async ingest`).
- Use a consistent state language across topics:
  - Green: success / cache hit / allowed path
  - Amber: fallback / retry / miss / degraded path
  - Red: blocked / failure / rejected path
  - Blue: client/read-facing activity
- Show only one primary teaching story at a time. Avoid turning the default view into a dense all-paths-at-once network.
- Each diagram must answer one learning question immediately, e.g. `"How does a cache miss recover?"` or `"What happens when a request is rate-limited?"`

---

## React Flow Readiness Checklist

These items must be completed before the Easy sprint is considered executable.

- [ ] `ArchitectureCanvas` supports hover explanations, click inspection, scenario toggles, and replay/reset behavior
- [ ] `CacheNode` is registered and available in the React Flow node type registry
- [ ] `QueueNode` is registered and available in the React Flow node type registry
- [ ] `diagramConfigs.ts` contains:
  - [ ] `url-shortener-arch`
  - [ ] `rate-limiter-arch`
  - [ ] `distributed-cache-arch`
  - [ ] `logging-pipeline-arch`
- [ ] Every reuse claim maps to a real component name in the codebase
- [ ] If a claimed reusable simulation does not exist, replace the claim with explicit planned work before sprint execution
- [ ] Edge labels, badge states, and legend rules are standardized before topic implementation begins

### Current Planning Assumptions

- `RateLimitingSim.tsx` exists and can be reused for Rate Limiter concepts.
- `ConsistentHashingSim.tsx` exists and can support ring-based key distribution teaching.
- Cache-specific and logging-specific case-study flows should not be marked as reused unless a concrete reusable component exists.

---

## Pilot Topic Decision

Use **Distributed Cache** as the Easy-sprint visualization pilot before implementing all 4 topics.

### Why This Topic First

- It exercises the widest set of visual requirements: topology, key routing, cache hit, cache miss, invalidation, and fallback.
- It is more representative of the product's visual learning value than URL Shortener, which is structurally simpler.
- It establishes the visual grammar needed later for Medium and Hard case studies.

### Pilot Exit Criteria

- The diagram clearly teaches both `cache hit` and `cache miss` without relying on surrounding prose.
- Users can inspect why a key maps to a specific cache node.
- Failure mode is visible (`node down` or `miss to DB fallback`) rather than described only in text.
- The interaction pattern is good enough to reuse across the other Easy topics without redesign.

---

## Topic 1: URL Shortener

**File:** `src/content/case-studies/url-shortener.mdx`
**Difficulty:** Easy | **Order:** 1

### Introduction
"A URL Shortener is like a nickname. Instead of saying 'that really long address on the fifth floor of the building on Main Street,' you just say 'Dave's place.' The system maps a short code to a long URL and redirects visitors instantly."

### Why This Matters & Prerequisites
**Why This Matters:**
URL shorteners handle billions of redirects daily. Services like Bitly, TinyURL, and t.co (Twitter) are critical infrastructure for marketing, analytics, and social media. Without a URL shortener, long URLs break in emails and SMS, are impossible to share verbally, and provide no click tracking.

This is the #1 most-asked "easy" system design interview question — it tests your ability to design a simple read-heavy system with caching, hashing, and horizontal scaling.

**Who Should Read This:**
- 🟢 **Beginners**: Learn the case study format — requirements, capacity estimation, API design, and architecture
- 🟡 **Intermediate**: Practice Base62 encoding implementation, Redis cache-aside pattern, and capacity math
- 🔴 **Advanced**: Explore sharding strategies, multi-region deployment, and analytics pipeline at scale

**Prerequisites:** [Caching Strategies](/topics/caching-strategies), [Consistent Hashing](/topics/consistent-hashing), [Load Balancers](/topics/load-balancers)

### Requirements
**Functional:**
1. Given a long URL, generate a unique short URL (e.g., `short.ly/abc123`)
2. Redirect a short URL to the original long URL (301/302)
3. Allow custom aliases (optional, e.g., `short.ly/my-link`)
4. Set TTL / expiration on short URLs (optional)
5. Track click analytics (count, referrer, geo)

**Non-Functional:**
1. Latency: < 50ms p99 for redirects
2. Availability: 99.99% uptime
3. Scale: 100M+ URLs, 100K redirects/sec
4. Security: Short codes must not be guessable (no sequential IDs)

### Capacity Estimation

| Metric | Value | Calculation |
|---|---|---|
| Read:Write Ratio | ~100:1 | Redirects dominate |
| Writes/sec | ~1,000 | ~86M new URLs/day |
| Reads/sec | ~100,000 | 100x write rate |
| Storage (5 years) | ~15 TB | 86M × 500B × 365 × 5 |
| Bandwidth (reads) | ~50 MB/s | 100K × 500B |

### API Design
```
POST /api/v1/shorten
  Body: { url: string, customAlias?: string, ttl?: number }
  Response: 201 { shortUrl: string, expiresAt: string }

GET /:shortCode
  Response: 301 Redirect → Location: <original_url>

GET /api/v1/stats/:shortCode
  Response: 200 { clicks: number, createdAt: string, topReferrers: [...] }
```

### Data Model
```sql
urls (
  id          BIGINT PRIMARY KEY,
  short_code  VARCHAR(8) UNIQUE INDEX,
  original_url TEXT NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMP,
  expires_at  TIMESTAMP,
  click_count INT DEFAULT 0
)
```
**DB Choice:** NoSQL (DynamoDB) for simple key-value lookups at massive scale. Alternative: sharded PostgreSQL if relational queries needed.

### Architecture Diagram (`url-shortener-arch`)

```
[Client] → [API Gateway] → [URL Service] → [PostgreSQL / DynamoDB]
                                    ↕
                              [Redis Cache]
```

**Nodes:**
- `ClientNode` → "Client" (sublabel: "Browser / Mobile")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate Limit")
- `ServiceNode` → "URL Service" (sublabel: "Shorten · Redirect · Analytics")
- `CacheNode` → "Redis" (sublabel: "Hot URLs · 80% Hit Rate")
- `DatabaseNode` → "DynamoDB" (sublabel: "short_code → original_url")

**Edges:**
- Client → Gateway: animated, label "GET /abc123"
- Gateway → Service: animated
- Service → Cache: animated, label "Cache-Aside Lookup"
- Service → DB: animated (dim when cache hit), label "Fallback"

### Read & Write Paths
**Write:** Client → Gateway → Service → Generate Base62(counter) → Write DB → Return short URL
**Read (Redirect):** Client → Gateway → Service → Check Redis → If miss: Query DB → Populate cache → 301 Redirect

### Deep Dives
1. **URL Generation:** Base62 encoding of auto-increment counter. 7 chars = 3.5 trillion unique URLs. Alternative: MD5 hash (first 7 chars) with collision retry.
2. **Caching:** Redis cache-aside for hot URLs. ~80% hit rate. TTL: 24h, LRU eviction.
3. **DB Scaling:** Shard by `short_code` hash. Read replicas for redirect traffic.

### Implementation Patterns
**Core Algorithm — Base62 Encoding:**
```typescript
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num: number): string {
  let encoded = '';
  while (num > 0) {
    encoded = CHARS[num % 62] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded.padStart(7, '0'); // 7 chars minimum
}

// encodeBase62(123456789) → "8M0kX"
```

**Redis Cache-Aside Pattern:**
```typescript
async function redirect(shortCode: string): Promise<string> {
  // 1. Check cache
  let url = await redis.get(`url:${shortCode}`);
  if (url) return url; // Cache HIT (~80% of requests)

  // 2. Cache miss → query DB
  url = await db.query('SELECT original_url FROM urls WHERE short_code = ?', [shortCode]);
  if (!url) throw new NotFoundError();

  // 3. Populate cache for next time
  await redis.set(`url:${shortCode}`, url, 'EX', 86400); // 24h TTL
  return url;
}
```

### Scaling Strategy
- **0→10K:** Single server + single DB + in-memory cache
- **10K→1M:** Add Redis, separate DB, load balancer + 2 app servers
- **1M→100M:** Shard DB by short_code hash, CDN for static assets
- **100M→1B:** Multi-region deployment, global LB, analytics pipeline offloaded to Kafka

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Redis cache down | All reads hit DB, 100x spike in DB load | Circuit breaker → fall back to DB for 5 min. DB can handle burst |
| Database primary fails | New URLs can't be created | Auto-failover to replica (< 30s). Reads still work via cache |
| Hash collision | Two URLs get same short code | Retry with appended random char. Check collision rate metric |
| Traffic spike (viral link) | Single URL gets 1M requests/min | CDN caching for popular URLs. Rate limit per short code |

**Production Monitoring:** p99 redirect latency, cache hit rate (alert if < 70%), DB QPS, collision rate
**How Real Bitly Differs:** Custom domains, team workspaces, detailed geo/device analytics, branded links, QR codes, and A/B testing on link destinations

### System Flows (Interactive)
Use `<ArchitectureCanvas>` with **scenario states**, not just one animation:
- **"Shorten URL"** → write path: Client → Gateway → Service → DB → return short code
- **"Redirect (Cache Hit)"** → read path where Redis answers immediately
- **"Redirect (Cache Miss)"** → miss path: Service → DB → cache populate → 301
- **"Hot Link Spike"** → highlight cache pressure and why hot links should stay served from cache/CDN

### Tradeoffs (4/4)
**Pros:** Simple reads with caching (sub-10ms), horizontally scalable via sharding, Base62 gives compact human-readable codes, stateless service enables easy scaling
**Cons:** Hash collisions require retry logic, custom aliases add uniqueness complexity, expiration cleanup requires background jobs, analytics at scale needs async processing

### FAQ (4 Questions)
1. **Base62 vs MD5?** — Base62 is simpler, no collisions. MD5 needs collision detection. Use Base62 for new systems.
2. **301 vs 302 redirect?** — 301 (permanent) is cached by browsers (fewer hits to your server). 302 (temporary) lets you track every click. Use 302 for analytics.
3. **How to handle custom aliases?** — Check uniqueness against the DB before inserting. Reserve common words/profanity.
4. **How to prevent abuse?** — Rate limiting per user/IP, CAPTCHA for anonymous, blocklist for malicious URLs.

### Interview Notes (5 Points)
1. **Requirements:** Shorten, redirect (< 50ms), 100M+ URLs, 99.99% availability
2. **API:** POST /shorten, GET /:code (301), GET /stats/:code
3. **Storage:** Key-value (short_code → url). NoSQL or sharded SQL
4. **Generation:** Base62(auto-increment counter). 7 chars = 3.5T capacity
5. **Scaling:** Redis cache (80% hit), DB sharding by code, read replicas

### Key Takeaways (5 Points)
1. URL shorteners are read-heavy — optimize the redirect path with caching
2. Base62 encoding of auto-increment IDs is the simplest, most scalable approach
3. Always estimate capacity first: QPS, storage, bandwidth
4. Sharding by short_code hash ensures even distribution
5. Analytics should be decoupled via async processing (Kafka/queues)

### Related Topics
`caching-strategies`, `database-sharding`, `consistent-hashing`, `rate-limiting`

---

## Topic 2: Rate Limiter Service

**File:** `src/content/case-studies/rate-limiter.mdx`
**Difficulty:** Easy | **Order:** 2

### Introduction
"A Rate Limiter is like a bouncer at a club. They let a certain number of people in per hour. If you've already reached your limit, you wait outside. It protects the club from overcrowding and ensures everyone inside has a good time."

### Why This Matters & Prerequisites
**Why This Matters:**
Without rate limiting, a single abusive client can bring down your entire system. Every major API — Stripe, GitHub, Twitter, AWS — has rate limiting as a core protection layer. It prevents DDoS attacks, controls costs, ensures fair usage across customers, and protects backend services from overload.

Rate limiting is asked in interviews because it tests your understanding of middleware architecture, distributed counters, and the tradeoff between consistency and availability.

**Who Should Read This:**
- 🟢 **Beginners**: Understand why rate limiting exists, the bouncer analogy, and basic Token Bucket algorithm
- 🟡 **Intermediate**: Implement sliding window counters in Redis with Lua scripts, handle distributed race conditions
- 🔴 **Advanced**: Design multi-tier rate limiting (per-user, per-IP, per-endpoint, global), cross-DC synchronization, and fail-open strategies

**Prerequisites:** [Rate Limiting](/topics/rate-limiting), [Caching Strategies](/topics/caching-strategies), [API Gateway](/topics/api-gateway)

### Requirements
**Functional:**
1. Limit API requests per user/IP to N requests per time window
2. Support multiple rate limiting strategies (fixed window, sliding window, token bucket)
3. Return rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
4. Support different limits per API endpoint or user tier (free vs premium)

**Non-Functional:**
1. Latency: < 5ms per rate check (inline with every request)
2. Availability: 99.99% — if the limiter is down, should fail open (allow requests)
3. Scale: Handle 1M+ rate checks/sec across distributed servers
4. Consistency: Rate limits must work correctly across multiple servers

### Capacity Estimation

| Metric | Value | Calculation |
|---|---|---|
| Rate checks/sec | ~1,000,000 | Every API request checks the limiter |
| Storage per user | ~100 bytes | Counter + timestamp + window metadata |
| Total storage | ~100 GB | 1B users × 100B |
| Latency budget | < 5ms | Must not add noticeable overhead |

### API Design
```
-- Rate Limiter is middleware, not a user-facing API
-- Internal interface:

RateLimiter.isAllowed(clientId: string, endpoint: string) → { allowed: boolean, remaining: number, resetAt: timestamp }

-- Response headers added to every API response:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1710612000

-- When rate limited:
HTTP 429 Too Many Requests
Retry-After: 30
```

### Data Model
```
-- Redis data structure (Sliding Window Counter)
Key:   rate_limit:{client_id}:{endpoint}:{window_start}
Value: counter (integer)
TTL:   window_size (e.g., 60 seconds)

-- Example:
rate_limit:user_42:/api/orders:1710611940 → 73
rate_limit:user_42:/api/orders:1710612000 → 12
```
**DB Choice:** Redis (in-memory, O(1) operations, built-in TTL, atomic INCR). No persistent DB needed.

### Architecture Diagram (`rate-limiter-arch`)

```
[Client] → [API Gateway] → [Rate Limiter Middleware] → [Redis Cluster] 
                                      ↓ (if allowed)
                              [Backend Services]
```

**Nodes:**
- `ClientNode` → "Client" (sublabel: "API Consumer")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Routes Requests")
- `ServiceNode` → "Rate Limiter" (sublabel: "Token Bucket · Sliding Window")
- `CacheNode` → "Redis Cluster" (sublabel: "Counters · TTL · Atomic INCR")
- `ServiceNode` → "Backend Service" (sublabel: "Order API · User API")

**Edges:**
- Client → Gateway: animated
- Gateway → Rate Limiter: animated, label "Every request"
- Rate Limiter → Redis: animated, label "INCR counter"
- Rate Limiter → Backend: animated when allowed, **dim/red when blocked** (label "429 Too Many Requests")

### Read & Write Paths
**Check (every request):** Gateway → Rate Limiter → Redis INCR → If counter ≤ limit: forward to backend. If counter > limit: return 429 with Retry-After header.
**Reset:** Redis TTL auto-expires the counter key when the window rolls over.

### Deep Dives
1. **Algorithms:** Fixed Window (simple but bursty at boundaries), Sliding Window Log (precise but memory-heavy), Sliding Window Counter (best balance — weighted average of current and previous window), Token Bucket (smooth, allows bursts up to bucket size).
2. **Distributed Rate Limiting:** With multiple servers, each server talks to the same Redis cluster. Lua scripts (EVAL) ensure atomicity: `INCR + EXPIRE` in a single round-trip.
3. **Race Conditions:** Use Redis MULTI/EXEC or Lua scripts to avoid two servers reading the same counter and both allowing the request.

### Implementation Patterns
**Sliding Window Counter (Redis Lua Script):**
```lua
-- Atomic rate check: INCR + EXPIRE in one round-trip
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('INCR', key)
if current == 1 then
  redis.call('EXPIRE', key, window)
end

if current > limit then
  return 0  -- REJECTED
else
  return limit - current  -- remaining
end
```

**Node.js Middleware:**
```typescript
async function rateLimitMiddleware(req, res, next) {
  const key = `rate:${req.userId}:${req.path}:${Math.floor(Date.now() / 60000)}`;
  const remaining = await redis.eval(luaScript, 1, key, 100, 60);

  res.set('X-RateLimit-Limit', '100');
  res.set('X-RateLimit-Remaining', String(remaining));

  if (remaining === 0) {
    return res.status(429).json({ error: 'Too Many Requests', retryAfter: 30 });
  }
  next();
}
```

### Scaling Strategy
- **0→10K:** Single Redis instance, rate limiter middleware in the app
- **10K→1M:** Redis cluster (3 shards), dedicated rate limiter service
- **1M→100M:** Redis Cluster with consistent hashing, local in-memory cache (leaky bucket) as first layer before Redis
- **100M→1B:** Multi-datacenter Redis with cross-DC sync, per-DC local limiters, centralized global limits

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Redis cluster down | No rate limiting → backend unprotected | Fail open (allow all requests). Alert ops. Backend has its own circuit breakers |
| Network partition between app and Redis | Each server limits independently (inaccurate) | Local in-memory token bucket as fallback. Accept temporary over-admission |
| Clock skew across servers | Window boundaries misaligned | Use Redis server time (not app time). NTP sync all servers |
| Sudden legitimate traffic spike | Good users get 429 errors | Dynamic limits per tier. Burst allowance in token bucket. Whitelist known clients |

**Production Monitoring:** 429 response rate, Redis latency p99, per-user rejection rate, false positive rate
**How Stripe/GitHub Differ:** Stripe uses a sophisticated multi-tier system with per-key, per-IP, and global limits. GitHub uses a "primary" + "secondary" rate limit with separate pools for authenticated vs anonymous. Both return rich headers with reset timestamps.

### System Flows (Interactive)
Reuse `<RateLimitingSim />` for algorithm intuition, and pair it with `<ArchitectureCanvas>` scenario states:
- **"Allowed Request"** → request flows through limiter to backend
- **"Burst Traffic"** → repeated requests drain available capacity
- **"Blocked Request"** → edge turns red, `429` badge appears, and headers update
- **"Limiter Down"** → fail-open fallback path is shown explicitly

### Tradeoffs (4/4)
**Pros:** Protects backend from overload and abuse, enables fair usage across users/tiers, Redis-based solution is fast (< 1ms per check), built-in headers inform clients of their limits
**Cons:** Adds latency to every request (~1-5ms), distributed rate limiting has race condition risks, "fail open" policy means no protection if Redis is down, complex to configure per-endpoint/per-tier rules at scale

### FAQ (4 Questions)
1. **Fixed Window vs Sliding Window?** — Fixed Window is simple but allows 2x burst at window boundaries. Sliding Window Counter uses a weighted average of current + previous window, eliminating the burst.
2. **What if Redis goes down?** — Fail open (allow all requests) to maintain availability. Log the event and alert. Use Redis Cluster with replication for HA.
3. **How to rate limit by IP vs User?** — Use IP for unauthenticated requests, user_id for authenticated. Composite key: `{user_id}:{endpoint}` or `{ip}:{endpoint}`.
4. **Token Bucket vs Leaky Bucket?** — Token Bucket allows controlled bursts (tokens accumulate). Leaky Bucket enforces a strict constant rate (no bursts). Token Bucket is more commonly used.

### Interview Notes (5 Points)
1. **Algorithms**: Token Bucket (allows bursts), Sliding Window Counter (best balance), Fixed Window (simplest)
2. **Storage**: Redis with atomic INCR + TTL. ~100 bytes per user per endpoint
3. **Distributed**: All servers share one Redis cluster. Lua scripts ensure atomic check-and-increment
4. **Fail Open**: If Redis is unavailable, allow requests to maintain system availability
5. **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After

### Key Takeaways (5 Points)
1. Rate limiters are middleware — they check every request inline with < 5ms overhead
2. Redis is the industry-standard backend: atomic INCR, built-in TTL, O(1) operations
3. Sliding Window Counter is the best algorithm for most use cases
4. Always fail open — rate limiter unavailability should not block legitimate traffic
5. Return clear headers (Limit, Remaining, Reset) so clients can self-regulate

### Related Topics
`rate-limiting`, `caching-strategies`, `api-gateway`, `consistent-hashing`

---

## Topic 3: Distributed Cache

**File:** `src/content/case-studies/distributed-cache.mdx`
**Difficulty:** Easy | **Order:** 3

### Introduction
"A Distributed Cache is like sticky notes on your desk. Instead of walking to the filing cabinet (database) every time you need a fact, you write it on a sticky note. But your desk only fits 100 notes — so when it's full, you throw away the oldest one (LRU) to make room."

### Why This Matters & Prerequisites
**Why This Matters:**
Caching is the single most impactful performance optimization in software. A database query might take 10-100ms, but a cache hit takes 0.1-1ms — a 100x speedup. Every major tech company (Netflix, Twitter, Facebook) relies on massive distributed caches handling millions of operations per second.

This case study teaches you to design a cache from scratch — not just "add Redis," but the WHY behind eviction policies, consistent hashing, invalidation strategies, and cache stampede prevention.

**Who Should Read This:**
- 🟢 **Beginners**: Understand cache-aside pattern, LRU eviction, and why caching matters
- 🟡 **Intermediate**: Implement consistent hashing for key distribution, handle cache stampede with locking
- 🔴 **Advanced**: Design tiered caching (L1 + L2), multi-region cache coherence, and cache warming strategies

**Prerequisites:** [Caching Strategies](/topics/caching-strategies), [Consistent Hashing](/topics/consistent-hashing), [Database Replication](/topics/database-replication)

### Requirements
**Functional:**
1. Store key-value pairs with sub-millisecond GET/SET operations
2. Support TTL (time-to-live) for automatic expiration
3. Support eviction policies (LRU, LFU, FIFO)
4. Distribute data across multiple cache nodes for scalability

**Non-Functional:**
1. Latency: < 1ms p99 for GET operations
2. Throughput: 100K+ operations/sec per node
3. Availability: Cache misses should gracefully fall back to the database
4. Scalability: Add/remove nodes without downtime (consistent hashing)

### Capacity Estimation

| Metric | Value | Calculation |
|---|---|---|
| Read:Write Ratio | ~10:1 | Reads dominate (cache-aside) |
| Operations/sec (total) | ~500,000 | Across 5 cache nodes |
| Avg value size | ~1 KB | JSON objects, serialized records |
| Total cache memory | ~50 GB | 50M hot keys × 1 KB |
| Cache hit rate target | ~85-95% | Hot data follows power law |

### API Design
```
-- Internal Cache Interface
Cache.get(key: string) → value | null
Cache.set(key: string, value: any, ttl?: number) → void
Cache.delete(key: string) → void
Cache.flush() → void

-- Cache-Aside Pattern (application code)
function getUser(userId) {
  let user = cache.get(`user:${userId}`);
  if (!user) {
    user = db.query("SELECT * FROM users WHERE id = ?", userId);
    cache.set(`user:${userId}`, user, ttl=3600);
  }
  return user;
}
```

### Data Model
```
-- Redis data structures
String:  user:42 → "{name: 'Alice', email: '...'}"  TTL: 3600s
Hash:    session:abc123 → { userId: 42, role: admin }  TTL: 1800s
Set:     online_users → { 42, 57, 103, 89 }
SortedSet: leaderboard → { alice: 9500, bob: 8700 }
```
**DB Choice:** Redis (in-memory, rich data structures, built-in replication). Alternative: Memcached (simpler, multi-threaded, but fewer features).

### Architecture Diagram (`distributed-cache-arch`)

```
[App Server 1] → [Cache Proxy / Consistent Hashing] → [Cache Node A (Shard 1)]
[App Server 2] →                                     → [Cache Node B (Shard 2)]
[App Server 3] →                                     → [Cache Node C (Shard 3)]
                                                            ↕ (miss)
                                                      [PostgreSQL]
```

**Nodes:**
- `ServiceNode` x3 → "App Server 1/2/3" (sublabel: "Cache-Aside Pattern")
- `LoadBalancerNode` → "Cache Proxy" (sublabel: "Consistent Hashing Ring")
- `CacheNode` x3 → "Node A" (sublabel: "Shard 1 · 15GB"), "Node B" (sublabel: "Shard 2 · 18GB"), "Node C" (sublabel: "Shard 3 · 17GB")
- `DatabaseNode` → "PostgreSQL" (sublabel: "Source of Truth")

**Edges:**
- App Servers → Cache Proxy: animated, label "GET user:42"
- Cache Proxy → correct Node: animated, label "hash(key) → Node B"
- Node → DB: dim edge, label "Cache Miss → DB Fallback"

### Read & Write Paths
**Read (Cache-Aside):** App → hash(key) → correct Cache Node → If hit: return value. If miss: query DB → populate cache → return value.
**Write (Cache-Aside):** App → write DB → invalidate/delete cache key. Next read will repopulate.
**Write (Write-Through):** App → write cache → cache writes to DB synchronously. Slower but always consistent.

### Deep Dives
1. **Eviction Policies:** LRU (Least Recently Used — best general-purpose), LFU (Least Frequently Used — good for stable working sets), FIFO (simple but ignores access patterns), Random (surprisingly effective for uniform access).
2. **Consistent Hashing:** Distribute keys across nodes with minimal rebalancing when nodes are added/removed. Virtual nodes ensure even distribution.
3. **Cache Invalidation:** "There are only two hard things in CS: cache invalidation and naming things." Strategies: TTL-based (simple), event-based (pub/sub from DB changes), write-through (always consistent but slower).

### Implementation Patterns
**Cache-Aside Pattern (Complete):**
```typescript
class CacheService {
  async get<T>(key: string, fetcher: () => Promise<T>, ttl = 3600): Promise<T> {
    // 1. Try cache
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    // 2. Prevent cache stampede with lock
    const lock = await this.redis.set(`lock:${key}`, '1', 'EX', 5, 'NX');
    if (!lock) {
      await sleep(50); // Another request is rebuilding, wait briefly
      return this.get(key, fetcher, ttl); // Retry
    }

    // 3. Fetch from source
    const data = await fetcher();

    // 4. Populate cache + release lock
    await this.redis.set(key, JSON.stringify(data), 'EX', ttl);
    await this.redis.del(`lock:${key}`);
    return data;
  }
}
```

**Consistent Hashing (Node Selection):**
```typescript
function getNode(key: string, nodes: CacheNode[]): CacheNode {
  const hash = murmurhash3(key);
  // Binary search on sorted hash ring
  const idx = ring.findNextNode(hash);
  return nodes[idx];
}
// Adding a node only moves ~K/N keys (K=total keys, N=nodes)
```

### Scaling Strategy
- **0→10K:** Single Redis instance, cache-aside in the app
- **10K→1M:** Redis Sentinel (master + 2 replicas for HA), consistent hashing for sharding
- **1M→100M:** Redis Cluster (auto-sharding), separate read replicas, connection pooling
- **100M→1B:** Multi-region cache (local Redis per DC), cache warming on deployment, tiered caching (L1 in-process → L2 Redis)

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Cache node dies | Keys on that node become cache misses → DB spike | Consistent hashing redistributes to neighbors. Redis Sentinel promotes replica |
| Cache stampede | Popular key expires → 1000 requests hit DB simultaneously | Mutex/lock pattern (only one rebuilds). Probabilistic early expiration |
| Cold start (deploy) | Empty cache = all requests hit DB | Cache warming: pre-populate hot keys from DB before routing traffic |
| Stale data served | User sees outdated information | TTL guardrail (max staleness). Event-driven invalidation via pub/sub |
| Memory pressure | Eviction increases → hit rate drops | Monitor memory, add nodes, tune eviction policy. Alert if hit rate < 80% |

**Production Monitoring:** Cache hit rate (target > 85%), eviction rate, memory usage %, p99 GET latency, connection pool utilization
**How Facebook/Netflix Differ:** Facebook's Memcached layer handles 1B+ requests/sec across thousands of servers with custom consistent hashing. Netflix uses EVCache (built on Memcached) with multi-region replication and automatic zone-aware failover.

### System Flows (Interactive)
This is the **pilot topic** for the Easy sprint. Use `<ArchitectureCanvas>` plus focused scenario states:
- **"Cache Hit"** → key routes to the owning node and returns immediately
- **"Cache Miss"** → request falls through to DB, then populates the owning node
- **"Node Rebalance"** → show how consistent hashing remaps only a subset of keys
- **"Node Failure"** → degraded path highlights misses and fallback behavior

Use `ConsistentHashingSim.tsx` concepts for the ring interaction. If no reusable cache-flow component exists at sprint start, plan a dedicated minimal flow layer instead of claiming reuse.

### Tradeoffs (4/4)
**Pros:** Sub-millisecond reads (100-1000x faster than DB), reduces DB load dramatically, consistent hashing enables seamless horizontal scaling, rich data structures (sets, sorted sets, hashes) beyond simple key-value
**Cons:** Cache invalidation is the hardest problem (stale data risk), adds memory costs ($$ for large datasets), cold start problem (empty cache = all requests hit DB), distributed caching adds network complexity

### FAQ (4 Questions)
1. **Redis vs Memcached?** — Redis: rich data structures, persistence, replication, Lua scripting. Memcached: simpler, multi-threaded (better for pure string caching), slightly lower latency. Use Redis unless you have a specific reason for Memcached.
2. **What is the "Cache Stampede" problem?** — When a popular key expires, hundreds of concurrent requests all miss the cache and hit the DB simultaneously. Solution: lock (only one request rebuilds the cache) or probabilistic early expiration.
3. **Write-Through vs Write-Behind vs Cache-Aside?** — Cache-Aside (app manages): most common, simple. Write-Through (cache writes to DB): always consistent, slower writes. Write-Behind (cache writes async): fast writes, risk of data loss.
4. **How to handle cache node failure?** — Consistent hashing redistributes keys to neighboring nodes. Redis Sentinel promotes a replica to master. Brief cache misses are expected.

### Interview Notes (5 Points)
1. **Core Pattern**: Cache-Aside (lazy loading): read from cache first, fallback to DB, populate cache on miss
2. **Distribution**: Consistent hashing distributes keys. Virtual nodes ensure balance. Adding a node moves only K/N keys
3. **Eviction**: LRU is the default choice. LFU for stable access patterns. Always set TTLs
4. **Invalidation**: TTL-based (simple), event-based (pub/sub), write-through (consistent). Pick based on staleness tolerance
5. **When NOT to cache**: Highly dynamic data, write-heavy workloads, data that must always be fresh (financial transactions)

### Key Takeaways (5 Points)
1. Cache-Aside is the most common pattern — read from cache first, populate on miss
2. LRU + TTL is the default eviction strategy for most systems
3. Consistent hashing is essential for distributing keys across nodes with minimal rebalancing
4. Cache invalidation is the hardest problem — choose your strategy based on staleness tolerance
5. Always design for cache failure — the system must work (slower) without the cache

### Related Topics
`caching-strategies`, `consistent-hashing`, `database-replication`, `rate-limiting`

---

## Topic 4: Logging / Metrics Pipeline

**File:** `src/content/case-studies/logging-metrics-pipeline.mdx`
**Difficulty:** Easy | **Order:** 4

### Introduction
"A Logging Pipeline is like the black box in an airplane. It records everything that happens so that when something goes wrong, you can rewind and understand exactly what happened. A Metrics Pipeline is the cockpit dashboard — showing altitude, speed, and fuel in real-time so the pilot can react before problems occur."

### Why This Matters & Prerequisites
**Why This Matters:**
You can't fix what you can't see. Logging and metrics are the foundation of **observability** — the ability to understand what's happening inside your distributed system. When Netflix has a latency spike at 3 AM, their logging pipeline is what tells the on-call engineer which service, which endpoint, and which downstream dependency caused it.

This is also the highest-ingestion system you can design. A logging pipeline at scale processes more data per second than most user-facing applications combined — making it an excellent study in throughput, buffering, and storage tiering.

**Who Should Read This:**
- 🟢 **Beginners**: Understand why structured logging matters, the ELK stack, and basic Kafka buffering
- 🟡 **Intermediate**: Design log enrichment pipelines, configure metric downsampling, and build alert rules
- 🔴 **Advanced**: Handle petabyte-scale storage tiering, cross-region log federation, and log sampling strategies

**Prerequisites:** [Kafka](/topics/kafka), [Event-Driven Architecture](/topics/event-driven-architecture), [Database Sharding](/topics/database-sharding)

### Requirements
**Functional:**
1. Ingest structured logs from all services (JSON format, with trace IDs)
2. Collect metrics (CPU, memory, request latency, error rates) from all services
3. Support real-time alerting (e.g., "error rate > 5% for 2 minutes")
4. Provide search and filtering across logs (e.g., "show all logs for request_id=abc123")
5. Visualize metrics on dashboards (time-series graphs)

**Non-Functional:**
1. Ingestion: Handle 1M+ log events/sec without back-pressure on application servers
2. Latency: Logs searchable within < 30 seconds of emission
3. Retention: 30 days hot storage, 1 year cold archive
4. Reliability: Never block the application — logging failures must be invisible to users

### Capacity Estimation

| Metric | Value | Calculation |
|---|---|---|
| Log events/sec | ~1,000,000 | 500 services × 2,000 logs/sec each |
| Avg log size | ~500 bytes | JSON with timestamp, level, message, metadata |
| Daily ingestion | ~43 TB | 1M × 500B × 86,400s |
| Hot storage (30 days) | ~1.3 PB | 43 TB × 30 |
| Metrics data points/sec | ~500,000 | 500 services × 100 metrics × 10s interval |

### API Design
```
-- Log Ingestion (async, fire-and-forget)
POST /api/v1/logs
  Body: { service: string, level: string, message: string, 
          traceId: string, timestamp: ISO8601, metadata: {} }

-- Log Search
GET /api/v1/logs/search?q=error&service=payment&from=2024-01-01&to=2024-01-02
  Response: { results: [...], total: number, nextCursor: string }

-- Metrics Query
GET /api/v1/metrics?name=http_request_latency_p99&service=api-gateway&range=1h
  Response: { datapoints: [{ timestamp, value }] }

-- Alert Rules
POST /api/v1/alerts
  Body: { metric: string, condition: "> 5%", duration: "2m", notify: "slack" }
```

### Data Model
```
-- Log Entry (stored in Elasticsearch)
{
  "@timestamp": "2024-03-16T14:30:00Z",
  "service": "payment-service",
  "level": "ERROR",
  "message": "Payment failed: insufficient funds",
  "trace_id": "abc-123-def",
  "span_id": "span-456",
  "user_id": 42,
  "metadata": { "amount": 99.99, "currency": "USD" }
}

-- Metric Data Point (stored in time-series DB)
{
  "name": "http_request_latency_ms",
  "tags": { "service": "api-gateway", "endpoint": "/api/v1/orders", "method": "POST" },
  "value": 142,
  "timestamp": 1710612000
}
```
**DB Choice:** Elasticsearch for logs (full-text search, fast filtering). InfluxDB/Prometheus for metrics (time-series optimized, downsampling). S3 for cold archive.

### Architecture Diagram (`logging-pipeline-arch`)

```
[Service A] ──→                                ──→ [Elasticsearch]
[Service B] ──→  [Kafka (logs topic)]  ──→ [Log Processor]  ──→ [S3 (Archive)]
[Service C] ──→                                ──→ [Alert Engine → Slack/PagerDuty]
                 [Kafka (metrics topic)] ──→ [Metrics Aggregator] ──→ [InfluxDB → Grafana]
```

**Nodes:**
- `ServiceNode` x3 → "Service A/B/C" (sublabel: "Emits logs + metrics via SDK")
- `QueueNode` x2 → "Kafka: logs-topic" (sublabel: "Buffered ingestion · 8 partitions"), "Kafka: metrics-topic" (sublabel: "Metrics stream")
- `ServiceNode` → "Log Processor" (sublabel: "Parse · Enrich · Route")
- `ServiceNode` → "Metrics Aggregator" (sublabel: "Rollup · Downsample")
- `DatabaseNode` → "Elasticsearch" (sublabel: "Full-text search · 30-day retention")
- `DatabaseNode` → "InfluxDB" (sublabel: "Time-series · Downsampled")
- `DatabaseNode` → "S3" (sublabel: "Cold archive · 1-year retention")
- `ServiceNode` → "Alert Engine" (sublabel: "Rules · Thresholds")
- `ServiceNode` → "Grafana" (sublabel: "Dashboards · Visualizations")

**Edges:**
- Services → Kafka: animated, label "Async (non-blocking)"
- Kafka → Processors: animated
- Processor → Elasticsearch: animated, label "Hot logs"
- Processor → S3: dim, label "Cold archive"
- Processor → Alert Engine: animated, label "Real-time"
- Metrics Aggregator → InfluxDB: animated
- InfluxDB → Grafana: animated, label "Query"

### Read & Write Paths
**Write (Log Ingestion):** Service → SDK → Kafka (async, fire-and-forget) → Log Processor consumes → enriches with trace context → writes to Elasticsearch (hot) + S3 (cold).
**Read (Log Search):** User → Grafana/Kibana → Elasticsearch query → filtered results with trace IDs.
**Metrics:** Service → SDK → Kafka → Metrics Aggregator → rollup (1s → 10s → 1m → 1h) → InfluxDB → Grafana dashboard.

### Deep Dives
1. **Kafka as Buffer:** Kafka decouples producers from consumers. If Elasticsearch is slow/down, logs buffer in Kafka without back-pressuring application services. This is the most critical design decision.
2. **Log Enrichment:** The Log Processor enriches raw logs: adds geo-IP, resolves service names, links trace/span IDs, and normalizes fields. This makes searching much more powerful.
3. **Downsampling:** Metrics are stored at full resolution (1s) for 24 hours, then downsampled: 10s for 7 days, 1m for 30 days, 1h for 1 year. This reduces storage by ~3,600x for old data.

### Implementation Patterns
**Structured Logger (Application SDK):**
```typescript
class Logger {
  private kafka: KafkaProducer;

  async log(level: string, message: string, meta: Record<string, any>) {
    const entry = {
      '@timestamp': new Date().toISOString(),
      service: process.env.SERVICE_NAME,
      level,
      message,
      trace_id: getCurrentTraceId(), // from OpenTelemetry context
      span_id: getCurrentSpanId(),
      ...meta
    };

    // Fire-and-forget: never block the application
    this.kafka.send('logs-topic', JSON.stringify(entry)).catch(() => {
      // Silently drop — logging must never crash the app
    });
  }
}
```

**Downsampling Query (InfluxDB/TimescaleDB):**
```sql
-- Rollup from 1s → 1m resolution
INSERT INTO metrics_1m
  SELECT time_bucket('1 minute', time) AS bucket,
         service, metric_name,
         avg(value) AS avg_val,
         max(value) AS max_val,
         percentile_cont(0.99) WITHIN GROUP (ORDER BY value) AS p99
  FROM metrics_raw
  WHERE time < NOW() - INTERVAL '24 hours'
  GROUP BY bucket, service, metric_name;
```

### Scaling Strategy
- **0→10K:** stdout logging + Prometheus + Grafana on a single server
- **10K→1M:** Centralized logging (ELK stack), Kafka for buffering, dedicated Elasticsearch cluster
- **1M→100M:** Multi-topic Kafka, partitioned by service. Elasticsearch cluster with hot/warm/cold tiers. S3 archival
- **100M→1B:** Multi-region Kafka + Elasticsearch per DC. Centralized Grafana with federation. Automated log sampling (only store 10% of debug logs)

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Kafka cluster down | Logs buffered locally on app servers, risk of loss | Local file buffer (rotate after 1GB). App continues serving. Replay when Kafka recovers |
| Elasticsearch overloaded | Logs queue up in Kafka (increasing lag) | Kafka retains logs for 7 days. Scale ES cluster or enable sampling |
| Alert engine false positive | On-call woken up unnecessarily | Add "for" duration to rules ("error > 5% FOR 2 minutes"). Review alert fatigue metrics |
| Disk full on log node | Node stops indexing, data loss | Monitor disk usage. Hot/warm/cold tiering. Alert at 80% capacity |
| Log volume spike (incident) | 10x normal volume during outage | Dynamic sampling: increase sampling rate for DEBUG/INFO during spikes. Always keep 100% of ERROR |

**Production Monitoring:** Kafka consumer lag, ES indexing rate, storage usage per tier, alert noise ratio
**How Netflix/Uber Differ:** Netflix processes 1+ PB of logs/day using custom pipelines. They use Kafka → Apache Druid for real-time analytics and a separate pipeline for batch processing. Uber uses Jaeger for distributed tracing integrated with their logging pipeline.

### System Flows (Interactive)
Use `<ArchitectureCanvas>` with explicit observability scenarios:
- **"Generate Error"** → error log flows from service → Kafka → processor → Elasticsearch and Alert Engine
- **"Normal Metrics"** → metrics flow through the metrics branch to InfluxDB/Grafana
- **"Burst Traffic"** → Kafka depth increases and buffering value becomes visible
- **"Elasticsearch Slow"** → logs continue buffering in Kafka while the app remains unaffected

The default view should visually separate the `logs path` and `metrics path` so beginners can parse them quickly.

### Tradeoffs (4/4)
**Pros:** Kafka buffer protects applications from logging infrastructure failures, full-text search in Elasticsearch enables fast debugging, time-series DB + downsampling handles metrics at massive scale, centralized logging with trace IDs enables distributed tracing
**Cons:** High storage costs (1+ PB for large organizations), Elasticsearch cluster management is operationally complex, log sampling may miss rare edge-case errors, pipeline lag means logs aren't instantly searchable (< 30s delay)

### FAQ (4 Questions)
1. **Why Kafka instead of sending logs directly to Elasticsearch?** — If Elasticsearch is slow or down, direct ingestion would back-pressure your application servers, causing user-facing latency. Kafka buffers the logs, decoupling producers from consumers.
2. **Structured vs Unstructured logs?** — Always structured (JSON). Structured logs enable field-level searching (`service=payment AND level=ERROR`). Unstructured text requires expensive full-text parsing.
3. **How to handle log volume at scale?** — Sampling (store 100% of ERROR, 10% of DEBUG), field indexing (only index fields you search on), hot/warm/cold tiers (recent data on fast SSDs, old data on cheap HDDs).
4. **Prometheus vs InfluxDB for metrics?** — Prometheus: pull-based, great for Kubernetes, built-in alerting. InfluxDB: push-based, better for custom metrics, SQL-like query language. Both work well.

### Interview Notes (5 Points)
1. **Architecture**: Services → Kafka (buffer) → Processors → Storage (Elasticsearch for logs, time-series DB for metrics)
2. **Kafka is key**: Decouples application from logging infra. Prevents back-pressure on services
3. **Storage tiers**: Hot (Elasticsearch, 30 days) → Warm (cheaper nodes) → Cold (S3, 1 year)
4. **Downsampling**: Full resolution → 10s → 1m → 1h as data ages. Reduces storage 3,600x
5. **Alerting**: Real-time rules on the metric stream. "Error rate > 5% for 2 minutes" → PagerDuty

### Key Takeaways (5 Points)
1. Never let logging failures impact your application — always use async, fire-and-forget ingestion
2. Kafka is the critical buffer between your services and your logging infrastructure
3. Structured JSON logs with trace IDs are essential for debugging distributed systems
4. Downsampling is the secret to affordable long-term metrics storage
5. This pipeline is the foundation of observability at Netflix, Uber, and every large-scale system

### Related Topics
`kafka`, `event-driven-architecture`, `database-sharding`, `caching-strategies`

---

## Implementation Order

| Priority | Topic | Key Reuse | Estimated Effort |
|---|---|---|---|
| 1 | Distributed Cache | `ConsistentHashingSim` concepts + new case-study flow states | Medium |
| 2 | URL Shortener | Existing nodes + new case-study diagram config | Low |
| 3 | Rate Limiter Service | Reuse `RateLimitingSim` + new case-study diagram config | Low |
| 4 | Logging / Metrics Pipeline | Queue visualization + dual-path logs/metrics diagram config | Medium |

### Ordering Rationale

- **Distributed Cache first** sets the quality bar for topology, branching behavior, and fallback visualization.
- **URL Shortener second** is simpler and benefits from the visual grammar established by the pilot.
- **Rate Limiter third** reuses the same scenario-toggle pattern for allowed vs blocked behavior.
- **Logging / Metrics fourth** is visually denser, so it should inherit the established interaction rules instead of inventing them.

---

## New Components Summary

| Component | Type | File |
|---|---|---|
| `CapacityEstimationCard` | UI Component | `src/components/ui/CapacityEstimationCard.tsx` |

> **Planning note:** The only guaranteed new UI component is `CapacityEstimationCard`. Additional case-study flow logic may still be needed if reuse targets are not present or do not meet the visualization contract above.

---

## Visual QA Rubric

Every Easy topic must pass this rubric before the next one starts.

| Criterion | Pass Condition |
|---|---|
| Easy to Follow | A new user can identify the main path within 10 seconds without reading the prose below |
| Highly Understandable | Components, relationships, and data movement are labeled clearly enough that the architecture can be narrated directly from the diagram |
| Interactive | The user can inspect nodes, switch scenarios, and replay/reset a flow without leaving the diagram area |
| Self-Explanatory | Legend, labels, badges, and state colors explain the visualization without relying on a paragraph to decode it |
| Visually Creative and Engaging | Motion is purposeful, layout feels premium, and the diagram looks like a product feature rather than a static doc embed |

### Hard Stop Rules

- Do not mark a topic complete if the diagram is only pan/zoom with no meaningful interaction.
- Do not mark a topic complete if the primary path and fallback path cannot be visually distinguished.
- Do not mark a topic complete if a user must read the prose first to understand what each node does.
- Do not mark a topic complete if the diagram becomes cluttered when all states are shown at once.

---

## Verification Plan (Manual Only)

- [ ] React Flow readiness checklist completed before topic implementation
- [ ] Distributed Cache approved as the pilot visualization benchmark
- [ ] All 4 Easy case studies render with correct 18-section structure
- [ ] Each has: Introduction, Why This Matters & Prerequisites, Requirements, Capacity Estimation, API Design, Data Model
- [ ] Each has: Architecture diagram (React Flow), Read/Write Paths, Deep Dives
- [ ] Each has: Implementation Patterns (with runnable code examples)
- [ ] Each has: Scaling Strategy (4 stages), Failure Scenarios & Production Considerations
- [ ] Each has: System Flows (interactive), Tradeoffs (4+/4+)
- [ ] Each has: FAQ (4+ questions), Interview Notes (5 points), Key Takeaways (5 points)
- [ ] URL Shortener reuses existing nodes and diagram config
- [ ] Rate Limiter reuses `RateLimitingSim` from existing fundamentals infrastructure
- [ ] Distributed Cache uses approved pilot interaction pattern
- [ ] Logging Pipeline visually separates logs and metrics branches
- [ ] All 4 topics pass the Visual QA Rubric
- [ ] All Related Topics links work bidirectionally
