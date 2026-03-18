# Phase 5 (Hard): Case Studies Sprint Plan — Part 3

> **Goal:** Define implementation-ready specs for Wave 3 of the Hard case studies: Google Drive / Dropbox, Search Engine, and Amazon (Capstone). Wave 3 is the final proof that the product can teach storage synchronization, search infrastructure, and a full end-to-end commerce platform with premium, self-explanatory React Flow experiences.

> **Shared planning rules:** This document inherits the `Visualization Contract`, `React Flow Readiness Checklist`, shared Hard quality bar, and review rigor defined in [Phase-5-Hard-Sprint-Plan-Part1.md](./Phase-5-Hard-Sprint-Plan-Part1.md).

---

## Wave Strategy (Hard — 9 Topics, 3 Waves)

- **Wave 1 (Part 1):** WhatsApp, Uber, YouTube — real-time + geospatial + streaming foundations
- **Wave 2 (Part 2):** Netflix, Zoom / Google Meet, Google Docs — playback + conferencing + collaboration
- **Wave 3 (This doc):** Google Drive / Dropbox, Search Engine, Amazon — storage + search + capstone
- **Part 3 Scope:** Covers Wave 3 so the final Hard topics inherit proven patterns for multi-state sync, dual-lane ingest/query visuals, and full-stack scenario orchestration
- **Gate:** Wave 3 starts only after Wave 1 and Wave 2 visual standards and shared prerequisites are approved

---

## Wave 3 Visual Focus

- **State continuity over time:** Google Drive / Dropbox must make sync state, chunk progress, versioning, and conflict resolution legible without turning the canvas into a wall of arrows.
- **Dual-plane understanding:** Search Engine must clearly separate document ingestion/indexing from query serving/ranking.
- **Capstone orchestration:** Amazon must feel like a composed system of subsystems, not three isolated diagrams glued together.
- **Progressive disclosure:** Default views must show one primary teaching path first. Secondary flows such as failures, background reconciliation, or multi-service fan-out appear through scenario toggles.

---

## Reusable Asset Inventory

### Reusable Visual Primitives (existing or required before wave start)
| Node/Edge/Sim | Reused As |
|---|---|
| `ClientNode` | Users, editors, shoppers, indexers, ops roles |
| `ServiceNode` | Sync engines, query services, carts, payment/order workers |
| `DatabaseNode` | Metadata stores, indexes, snapshots, object storage, catalog DBs |
| `LoadBalancerNode` | API gateways, regional routers, edge search front doors |
| `CacheNode` | Metadata cache, query cache, cart/session cache, hot result cache |
| `QueueNode` | Background indexing, chunk processing, order fan-out, async reconciliation |
| `LaneNode` | Upload vs download, ingest vs query, success vs failure comparison |
| `AnimatedEdge` | All flow arrows |
| `CrawlerFrontierSim` | Optional reference pattern for crawl-side search ingestion visuals |
| `RealtimeCollabSim` | Reuse idea only for version/conflict visibility, not as a drop-in sync simulation |

### New Components Needed (Phase 5 Hard — Wave 3)
| Component | Type | Purpose | Reused By |
|---|---|---|---|
| `FileSyncSim` | Simulation | Chunk upload, delta sync, conflict resolution, version restore, offline replay | Google Drive / Dropbox |
| `SearchPipelineSim` | Simulation | Crawl/index pipeline + query execution + ranking + shard fan-out | Search Engine |
| `CommerceFlowSim` | Simulation | Browse → search → cart → checkout → order fan-out → inventory/payment outcomes | Amazon |

> **Planning rule:** Wave 3 is the capstone wave. Reuse is acceptable only when it strengthens clarity. If a reused primitive obscures the teaching story, define a dedicated Wave 3 simulation instead of forcing reuse.

---

## Shared Wave 3 Simulation Strategy

### `FileSyncSim`

- Treat this as a **dedicated file-sync simulation**.
- It must teach chunked upload, client-side hashing, delta sync, conflict detection, version history, and reconnect replay.
- The simulation must separate metadata sync from blob transfer so users understand why “file appears” and “file fully synced” are not the same event.

### `SearchPipelineSim`

- Treat this as a **dedicated search simulation** with two clear scenario modes:
  - `ingest`: crawl/discover → parse → index → rank signal update
  - `query`: query parse → shard fan-out → retrieve → rank → return results
- The default view must start with one mode only. The other mode appears via scenario toggle.
- Ranking and indexing must be shown as distinct responsibilities.

### `CommerceFlowSim`

- Treat this as a **dedicated capstone orchestration simulation**.
- It must teach one customer request flowing across search, cart, checkout, payment, order, and inventory services.
- It must support degraded states such as payment failure, inventory race, and downstream retry.
- The simulation should reveal that Amazon is multiple reliable subsystems coordinated by state transitions, not one giant “store service.”

---

## Topic-Specific Visual Grammar

These rules are mandatory for Wave 3 so the hardest concepts stay readable without relying on surrounding prose.

### Google Drive / Dropbox

- **Default view = one file-sync path**: local file change → chunk/hash → metadata update → object storage → other device sync. Conflict resolution and version restore appear only through controls.
- **Edge styling must be explicit**:
  - Blue = client metadata/control flow
  - Green = healthy chunk transfer / synced state / version restore success
  - Amber = partial sync / background reconciliation / offline replay
  - Red = conflict / stale version / failed chunk upload
- **Sync state must be visible on the canvas**: `uploading`, `hashed`, `committed`, `synced`, and `conflict` are system states, not only sidebar text.
- **Chunk and metadata paths must be visually distinct** so the user understands why metadata can commit before every blob chunk finishes.

### Search Engine

- **Default view = one chosen plane**. Ingest and query must not be rendered at full intensity simultaneously by default.
- **Edge styling must be explicit**:
  - Blue = user query / serving path
  - Green = healthy index lookup / rank / result return
  - Amber = shard timeout / stale cache / background reindex
  - Red = rejected duplicate / failed shard / crawl block
- **Ingest path and query path must use separate zones or lanes**. Parsing, indexing, and PageRank-style score updates must not look like query-serving edges.
- **Result ranking must be visible as a step**: retrieval and ranking are not the same box. The user should see candidate results become ordered results.

### Amazon (Capstone)

- **Default view = one order lifecycle**: search/browse → cart → checkout → payment → order placement → inventory reservation. Secondary systems appear through controlled reveals.
- **Edge styling must be explicit**:
  - Blue = customer-facing browse/search/cart actions
  - Green = successful reservation / payment / order confirmation path
  - Amber = async fan-out / inventory hold / retry / eventual reconciliation
  - Red = payment failure / stock race / downstream failure
- **Zone model is mandatory**:
  - `Browse & Discovery` zone = shopper, API Gateway, Search / Catalog, Search Index, Product DB
  - `Cart State` zone = Cart Service, Cart Store, price snapshot state
  - `Checkout Correctness` zone = Checkout Orchestrator, Payment Service, Inventory Service, Order Service
  - `Async Fan-out` zone = Event Bus, Fulfillment / Notification / Analytics
- **Subsystem boundaries must stay obvious**: search, cart, checkout, payment, order, and inventory must read as separate responsibilities, not one flat service mesh.
- **Failure handling must be visible on the canvas**: the user should be able to see what happens when payment succeeds but inventory fails, or when inventory is reserved but order confirmation is delayed.

---

## Pilot Sequence

Use a staged approach instead of implementing all three topics in parallel.

### Stage 1: `SearchPipelineSim` Pilot

- Start with **Search Engine** because it sets the visual standard for dual-plane architecture teaching in Wave 3.
- Use it to validate ingest-vs-query separation before the capstone topics add more subsystems.

### Stage 2: `FileSyncSim` Pilot

- Implement **Google Drive / Dropbox** second.
- Use it to validate stateful client/server sync visualization, chunk-level progress, and conflict states.

### Stage 3: `CommerceFlowSim` Pilot

- Implement **Amazon** last.
- Use it to validate the broadest capstone flow after the query and sync visual grammars are already proven.

---

## Topic 7: Google Drive / Dropbox

**File:** `src/content/case-studies/google-drive.mdx`
**Difficulty:** Hard | **Wave:** 3 | **Order:** 7

### Introduction
"A cloud drive is like a shared filing cabinet that quietly keeps every copy of a document in sync, even when you edit on a laptop during a flight and reopen it on your phone later. The hard part is not storing files; it is deciding what changed, moving only the necessary bytes, and resolving conflicts when multiple versions exist."

### Why This Matters & Prerequisites
**Why This Matters:**
Google Drive and Dropbox are classic distributed systems because they combine metadata, chunked blob transfer, client sync agents, version history, and conflict resolution in one product. They are the best way to teach the difference between file metadata consistency and actual content transfer.

**Who Should Read This:**
- 🟢 **Beginners**: Understand why file sync needs more than simple upload/download
- 🟡 **Intermediate**: Design chunked uploads, delta sync, and version history
- 🔴 **Advanced**: Handle multi-device offline edits, conflict resolution, and large-scale deduplicated storage

**Prerequisites:** [Google Docs](/case-studies/google-docs), [Consistent Hashing](/topics/consistent-hashing), [Caching Strategies](/topics/caching-strategies), [Load Balancers](/topics/load-balancers)

### Requirements
**Functional:**
1. Upload, download, and sync files across multiple devices
2. Split large files into chunks for resumable transfer
3. Detect file changes and transfer only deltas when possible
4. Maintain version history and restore previous versions
5. Detect and resolve sync conflicts across devices

**Non-Functional:**
1. Small-file sync visible across devices within seconds
2. Large file uploads must survive reconnects and resume without restart
3. 99.99% durability for stored objects and metadata
4. Support billions of files with efficient deduplicated storage
5. Minimize redundant bandwidth through chunk hashes and delta transfer

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Registered users | 1B+ | Consumer + enterprise |
| Stored files | 50B+ | Long-lived file corpus |
| Daily file mutations | 2B/day | Uploads + edits + renames |
| Avg file size | 8 MB | Long tail with large media files |
| Large file upload peak | 50K/sec | Burst upload periods |
| Chunk size | 4-8 MB | Resumable transfer target |
| Metadata lookups | 500K/sec peak | Sync polling / push refresh |

### API Design
```http
POST /api/v1/files/upload-sessions
Body: { path: string, sizeBytes: number, chunkCount: number, contentHash: string }
Response: { uploadSessionId, chunkSizeBytes, uploadUrls: [...] }

PUT /api/v1/files/{fileId}/chunks/{chunkNo}
Body: <binary chunk>
Response: 202 { received: true, etag: string }

POST /api/v1/files/{fileId}/commit
Body: { uploadSessionId: string, chunkHashes: string[], parentVersion: string }
Response: 201 { fileId, versionId, syncState: "committed" }

GET /api/v1/sync/changes?cursor=<opaque>
Response: { changes: [{ fileId, path, versionId, changeType }], nextCursor }

POST /api/v1/files/{fileId}/resolve-conflict
Body: { strategy: "keep_both" | "replace" | "manual", winningVersionId?: string }
Response: 200 { resolvedVersionId }
```

### Data Model
```sql
files (
  file_id UUID PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  path TEXT NOT NULL,
  latest_version_id UUID NOT NULL,
  size_bytes BIGINT,
  mime_type VARCHAR(128),
  updated_at TIMESTAMP
)

file_versions (
  version_id UUID PRIMARY KEY,
  file_id UUID NOT NULL,
  content_hash BYTEA NOT NULL,
  chunk_manifest JSONB NOT NULL,
  created_by BIGINT NOT NULL,
  created_at TIMESTAMP,
  conflict_group_id UUID
)

sync_cursors (
  device_id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL,
  cursor_token TEXT NOT NULL,
  last_seen_version TIMESTAMP,
  updated_at TIMESTAMP
)
```
**DB Choice:** PostgreSQL or Spanner-like metadata store for paths, versions, and permissions. Object storage for blob chunks. Redis for hot sync cursors and change-feed positions.

### Architecture Diagram (`google-drive-arch`)

```
[Laptop] → [Sync Gateway] → [Metadata Service] → [Metadata DB]
    ↓                           ↓
[Chunker / Hasher] → [Blob Store]   [Sync Engine] → [Change Feed Cache] → [Phone]
                                  ↘
                                [Version Store]
```

**Nodes:**
- `ClientNode` x2 → "Laptop" (sublabel: "Upload · Edit · Offline queue"), "Phone" (sublabel: "Download · Preview · Resume sync")
- `LoadBalancerNode` → "Sync Gateway" (sublabel: "Auth · Device session · Upload routing")
- `ServiceNode` → "Metadata Service" (sublabel: "Paths · versions · permissions")
- `DatabaseNode` → "Metadata DB" (sublabel: "File tree · latest version pointers")
- `ServiceNode` → "Sync Engine" (sublabel: "Diff detect · change feed · conflict check")
- `CacheNode` → "Change Feed Cache" (sublabel: "Per-device cursor · pending changes")
- `ServiceNode` → "Chunker / Hasher" (sublabel: "Chunk split · hash compare · resumable state")
- `DatabaseNode` → "Blob Store" (sublabel: "Chunk blobs · deduplicated object storage")
- `DatabaseNode` → "Version Store" (sublabel: "Version history · restore points")

**Edges:**
- Laptop → Sync Gateway: animated, label "File change detected"
- Sync Gateway → Metadata Service: animated, label "Start upload / version check"
- Metadata Service → Metadata DB: animated, label "Read latest version pointer"
- Laptop → Chunker / Hasher: animated, label "Chunk + hash locally"
- Chunker / Hasher → Blob Store: animated, label "Upload changed chunks"
- Metadata Service → Sync Engine: animated, label "Commit version + publish change"
- Sync Engine → Change Feed Cache: animated, label "Queue device updates"
- Change Feed Cache → Phone: animated, label "Sync delta"
- Sync Engine → Version Store: animated, label "Persist new version"

### Read & Write Paths
**Write (Upload / Sync):**
1. Laptop detects file change and computes chunk hashes locally
2. Sync Gateway and Metadata Service check the parent version and existing chunk manifest
3. Only changed chunks upload to Blob Store
4. Metadata Service commits a new version pointer
5. Sync Engine publishes the change to other devices

**Read (Apply Remote Change):**
1. Phone polls or receives change feed delta via cursor
2. Sync Engine returns new version pointer and required chunk manifest
3. Phone downloads missing chunks only
4. New file state becomes `synced`; version history remains available for restore

### Deep Dives
1. **Metadata vs Blob Separation:** File-tree updates and blob transfer are separate responsibilities. This is why a file can appear in the UI before every chunk has fully hydrated on every device.
2. **Chunk Dedup + Delta Sync:** Large files should not move as one opaque object every time. Chunk hashes enable resumable transfer and storage reuse.
3. **Conflict Resolution:** Sync conflicts happen when two devices modify from the same base version while disconnected. The visualization must show how the system detects divergence and produces a safe resolution path.

### Implementation Patterns
**Upload Only Changed Chunks:**
```typescript
async function syncFileVersion(input: SyncCandidate) {
  const localChunks = chunkFile(input.filePath, input.chunkSizeBytes).map(hashChunk);
  const remoteManifest = await metadataApi.getChunkManifest(input.fileId, input.parentVersionId);

  const changedChunks = localChunks.filter((chunk, index) => {
    return remoteManifest[index]?.hash !== chunk.hash;
  });

  for (const chunk of changedChunks) {
    await blobApi.uploadChunk(input.fileId, chunk.index, chunk.bytes, chunk.hash);
  }

  return metadataApi.commitVersion({
    fileId: input.fileId,
    parentVersionId: input.parentVersionId,
    chunkHashes: localChunks.map((chunk) => chunk.hash),
  });
}
```

**Detect Simple Version Conflict:**
```typescript
function detectConflict(localBaseVersionId: string, remoteLatestVersionId: string) {
  return localBaseVersionId !== remoteLatestVersionId;
}
```

### Scaling Strategy
- **0→100M files:** Single-region metadata DB, object storage, basic polling sync
- **100M→5B:** Multi-region blob storage, push-based change feed, chunk dedup, resumable sessions
- **5B→20B:** Stronger versioning/indexing, region-aware metadata routing, faster delta sync for large files
- **20B+ files:** Enterprise isolation, smarter prefetch and dedup tiers, aggressive background reconciliation, global metadata replication

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Chunk upload interrupted | Partial file sync | Resume from uploaded chunk manifest; retry only missing chunks |
| Metadata commit succeeds but device disconnects | Other devices see new version, uploader unsure | Idempotent commit + client reconciliation on reconnect |
| Two devices edit offline | Conflict on sync | Create conflict group, surface `keep both` or merge strategy |
| Blob region issue | File download latency spike | Multi-region blob replication and region-local reads |
| Change-feed cursor loss | Device misses updates | Rebuild from durable version history checkpoint |
| Dedup hash collision or corruption | Wrong chunk reuse risk | Strong hashes + periodic integrity scan + end-to-end checksum |

**Production Monitoring:** sync latency, chunk retry rate, conflict frequency, dedup savings, resume success rate, cursor lag
**How Real Systems Differ:** Dropbox and Google Drive differ in push/poll strategies, local agent behavior, and collaboration integration. The shared distributed-systems lesson is still the same: sync is a state machine across metadata, chunks, versions, and devices.

### System Flows (Interactive) — `<FileSyncSim />`

**Controls:**
- **"Upload File" button** → Starts a fresh chunked upload
- **"Edit Offline" toggle** → Queues a local version while disconnected
- **"Create Conflict" button** → Simulates concurrent device edits from the same base version
- **"Restore Version" button** → Rewinds to a prior saved version
- **"Network Drop" toggle** → Interrupts chunk transfer and resumes later

**Animations:**
1. **"Upload File"**: Laptop hashes file → chunk badges appear → changed chunks move to Blob Store → metadata commit badge flips `committed` → Phone receives change feed and becomes `synced`
2. **"Edit Offline"**: Laptop node dims amber `Offline` → pending version queue grows → on reconnect, queued version replays through Metadata Service
3. **"Create Conflict"**: Laptop and Phone both commit from the same base → Sync Engine marks red `Conflict` → split branch offers `keep both` and `manual resolve`
4. **"Restore Version"**: Version Store highlights older version → metadata pointer rewinds → devices pull historical chunk manifest
5. **"Network Drop"**: Chunk transfer pauses amber `resume later` → upload resumes from the last completed chunk instead of restarting

### Tradeoffs (4/4)
**Pros:** Chunked sync saves bandwidth, version history makes recovery safe, metadata/blob separation improves scalability, resumable uploads make large-file UX tolerable
**Cons:** Conflict resolution is hard to explain and implement, metadata consistency bugs can make files appear “synced” when blobs lag, dedup/integrity logic adds complexity, background sync correctness is operationally subtle

### FAQ (4 Questions)
1. **Why split metadata from blob transfer?** — They scale differently and have different latency/durability needs. Paths and versions are small and hot; blobs are large and bandwidth-heavy.
2. **Why chunk files instead of uploading them whole?** — Resumability, delta sync, and deduplication. Only changed chunks need to move.
3. **How are sync conflicts handled?** — Detect divergent base versions, then create a safe resolution path such as `keep both`, user merge, or guided restore.
4. **Why does a file sometimes appear before it is fully usable on another device?** — Metadata can propagate first; blob hydration may still be finishing in the background.

### Interview Notes (5 Points)
1. **Sync is a state machine**: detect change → diff → transfer → commit → propagate
2. **Metadata and blobs are separate systems**: do not collapse them into one box
3. **Chunk hashes are the main optimization**: they enable resume, dedup, and delta sync
4. **Conflict resolution is a product and system problem**: not just storage
5. **Version history is a safety mechanism**: it turns sync errors from disasters into recoverable events

### Key Takeaways (5 Points)
1. File-sync systems are distributed-state systems, not simple file uploads
2. Chunking and hashing are the core technical patterns for scalable sync
3. Metadata and blob transfer must be visualized separately for the concept to click
4. Conflict handling is unavoidable and must be a first-class learning path
5. Good sync UX depends on resumability, clear state, and safe rollback

### Related Topics
`google-docs`, `consistent-hashing`, `caching-strategies`, `load-balancers`, `event-driven-architecture`

---

## Topic 8: Search Engine

**File:** `src/content/case-studies/search-engine.mdx`
**Difficulty:** Hard | **Wave:** 3 | **Order:** 8

### Introduction
"A search engine is like a librarian who has already read and cataloged the whole library so that when you ask a question, the answer feels instant. The hard part is doing both jobs at once: constantly crawling and indexing the web in the background while answering live queries in milliseconds."

### Why This Matters & Prerequisites
**Why This Matters:**
Search Engine is a defining systems problem because it combines distributed crawling, parsing, inverted indexing, ranking, query fan-out, caching, and result serving. It is also a useful bridge between the earlier Web Crawler case study and a full production search stack.

**Who Should Read This:**
- 🟢 **Beginners**: Understand why indexing exists and why search is not a raw database scan
- 🟡 **Intermediate**: Design inverted indexes, shard fan-out, and query ranking pipelines
- 🔴 **Advanced**: Handle freshness, ranking signals, query latency, and large-scale reindexing

**Prerequisites:** [Web Crawler](/case-studies/web-crawler), [Kafka](/topics/kafka), [Caching Strategies](/topics/caching-strategies), [Consistent Hashing](/topics/consistent-hashing)

### Requirements
**Functional:**
1. Crawl and ingest documents continuously
2. Parse, tokenize, and build inverted indexes
3. Support low-latency keyword and phrase queries
4. Rank results using relevance and link/quality signals
5. Return snippets, titles, and cached result metadata

**Non-Functional:**
1. Query p99 < 300ms
2. Fresh content should appear in the index within minutes to hours depending on priority
3. 99.99% availability on the query path
4. Support web-scale indexing and shard fan-out
5. Degrade gracefully when some shards are slow or unavailable

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Indexed pages | 100B+ | Web-scale corpus |
| Daily crawl ingest | 20B discovered URLs/day | Continuous refresh |
| Query volume | 10B queries/day | Global usage |
| Avg terms per query | 3 | Typical search behavior |
| Peak query QPS | 300K/sec | High-traffic periods |
| Index shards | 10K+ | Distributed serving |
| Snippet generation rate | 100K/sec | Cached + on-demand summary mix |

### API Design
```http
GET /api/v1/search?q=<query>&cursor=<opaque>&lang=en
Response: {
  items: [{ url, title, snippet, rankScore, cacheAgeSecs }],
  nextCursor,
  requestId
}

POST /api/v1/index/documents
Body: { docId: string, url: string, title: string, body: string, links: string[] }
Response: 202 { accepted: true }

POST /api/v1/index/rebuild
Body: { shardId: string, reason: "schema_change" | "repair" }
Response: 202 { jobId }
```

### Data Model
```sql
documents (
  doc_id BIGINT PRIMARY KEY,
  url TEXT UNIQUE,
  title TEXT,
  crawl_timestamp TIMESTAMP,
  content_hash BYTEA,
  language VARCHAR(16),
  quality_score FLOAT
)

inverted_index_entries (
  term_hash BYTEA,
  shard_id INT,
  posting_list BYTEA, -- compressed doc ids + positions
  updated_at TIMESTAMP,
  PRIMARY KEY (term_hash, shard_id)
)

query_logs (
  query_id BIGSERIAL PRIMARY KEY,
  user_query TEXT,
  normalized_query TEXT,
  clicked_doc_id BIGINT,
  latency_ms INT,
  created_at TIMESTAMP
)
```
**DB Choice:** BigTable/Cassandra for document and index metadata. Lucene/Elasticsearch-like shard engine for serving indexes. Object/blob storage for large index segments and snapshots. Redis for hot query/result cache.

### Architecture Diagram (`search-engine-arch`)

```
[User] → [Query API] → [Query Planner] → [Result Cache]
                         ↘
                      [Index Shards] → [Ranker / Aggregator] → [User]

[Web Crawl / Feeds] → [Parse & Tokenize] → [Ingest Queue] → [Index Builder] → [Index Shards]
                              ↓                              ↓
                         [Doc Store]              [Link Graph / Rank Signals]
```

**Nodes:**
- `ClientNode` → "User" (sublabel: "Query · Click · Refine")
- `LoadBalancerNode` → "Query API" (sublabel: "Autocomplete · Spellfix · Search request")
- `ServiceNode` → "Web Crawl / Feeds" (sublabel: "Crawler output · feed imports · recrawl events")
- `ServiceNode` → "Query Planner" (sublabel: "Parse query · shard fan-out · timeout budget")
- `DatabaseNode` → "Result Cache" (sublabel: "Hot query cache · snippets · top results")
- `DatabaseNode` → "Index Shards" (sublabel: "Inverted index segments · shard-local retrieval")
- `ServiceNode` → "Ranker / Aggregator" (sublabel: "Merge shard hits · apply relevance + link signals")
- `ServiceNode` → "Parse & Tokenize" (sublabel: "HTML clean · tokenize · language detect")
- `ServiceNode` → "Index Builder" (sublabel: "Build postings · segment merge · refresh")
- `DatabaseNode` → "Doc Store" (sublabel: "Canonical documents · snippets · metadata")
- `DatabaseNode` → "Link Graph / Rank Signals" (sublabel: "PageRank-style signals · freshness · quality")
- `QueueNode` → "Ingest Queue" (sublabel: "Async document update flow")

**Edges:**
- User → Query API: animated, label "Search query"
- Query API → Query Planner: animated, label "Parse + budget"
- Query Planner → Result Cache: animated, label "Hot query lookup"
- Query Planner → Index Shards: animated, label "Shard fan-out"
- Index Shards → Ranker / Aggregator: animated, label "Candidate results"
- Ranker / Aggregator → User: animated, label "Ordered results"
- Web Crawl / Feeds → Parse & Tokenize: animated, label "Discovered docs"
- Parse & Tokenize → Ingest Queue: animated, label "Parsed docs"
- Ingest Queue → Index Builder: animated, label "Index update jobs"
- Index Builder → Index Shards: animated, label "Refresh segments"
- Index Builder → Link Graph / Rank Signals: animated, label "Update rank inputs"
- Parse & Tokenize → Doc Store: animated, label "Store canonical doc + snippet"

### Read & Write Paths
**Write (Ingest / Reindex):**
1. Crawled or feed-sourced document is parsed and tokenized
2. Clean text and metadata go to Doc Store
3. Ingest Queue triggers index updates and segment merges
4. Link and quality signals update ranking inputs
5. New shards or refreshed segments become visible to the query path

**Read (Search Query):**
1. User query reaches Query API and Query Planner
2. Planner checks Result Cache and, on miss, fans out to relevant index shards
3. Shards return candidate postings/doc hits
4. Ranker / Aggregator merges candidates and applies ranking signals
5. Ordered results return to the user, and query/click logs feed future ranking updates

### Deep Dives
1. **Inverted Index:** Search is fast because the engine maps terms to posting lists, not because it scans document text linearly. The diagram must make this shift visible.
2. **Ingest vs Query Separation:** Index freshness is a background concern; query latency is a foreground concern. Mixing them visually confuses the architecture.
3. **Ranking is a separate stage:** Retrieval finds candidates; ranking decides order. The user should see this as two different operations.

### Implementation Patterns
**Simplified Shard Query:**
```typescript
async function searchQuery(query: ParsedQuery, shardIds: number[]) {
  const shardHits = await Promise.all(
    shardIds.map((shardId) => shardClient.search(shardId, query))
  );

  const merged = shardHits.flatMap((hitSet) => hitSet.hits);
  return merged
    .sort((a, b) => b.score - a.score)
    .slice(0, query.limit);
}
```

**Append Index Refresh Job:**
```typescript
async function scheduleIndexRefresh(documentId: string) {
  await ingestQueue.publish('index.refresh', {
    documentId,
    priority: 'normal',
    requestedAt: Date.now(),
  });
}
```

### Scaling Strategy
- **0→100M docs:** Single query cluster, small crawler set, basic relevance scoring
- **100M→10B:** Sharded serving index, separate ingest queue, cached top queries, rank-signal storage
- **10B→100B:** Regional query clusters, aggressive cache layers, large-scale segment merges, stronger freshness controls
- **100B+ docs:** Specialized hot/cold index tiers, advanced rank features, query understanding, continuous repair/reindex tooling

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| One query shard times out | Partial or slow results | Timeout budget + partial result merge + degraded badge |
| Rank-signal pipeline lags | Lower result quality | Serve from last good signal snapshot |
| Ingest backlog grows | Fresh docs appear late | Priority indexing for hot/fresh content |
| Cache stampede on hot query | Backend query spike | Request coalescing and hot-result cache |
| Bad reindex rollout | Serving errors or low-quality results | Versioned index segments + rollback |
| Crawl spam / low-quality pages | Polluted index | Quality filters, spam signals, and quarantine path |

**Production Monitoring:** query latency, shard timeout rate, ingest lag, cache hit rate, fresh-doc visibility delay, click-through quality metrics
**How Real Systems Differ:** Production search engines have many more stages including spell correction, query rewriting, semantic ranking, ads, and experiments. The plan keeps the architecture focused on the core systems lesson: ingest and query are separate but tightly coupled pipelines.

### System Flows (Interactive) — `<SearchPipelineSim />`

**Controls:**
- **"Ingest Document" button** → Adds a new page into the parse/index path
- **"Run Query" button** → Executes a live query through shard fan-out and ranking
- **"Shard Timeout" toggle** → Forces one shard to degrade or miss deadline
- **"Reindex" button** → Rebuilds one shard or segment after a schema change
- **"Freshness Priority" toggle** → Moves a hot document ahead in ingest priority

**Animations:**
1. **"Ingest Document"**: Document enters Parse & Tokenize → Ingest Queue receives job → Index Builder refreshes segment → new term appears in Index Shards → rank-signal badge updates
2. **"Run Query"**: Query Planner fans out to multiple shards → candidate hits return → Ranker / Aggregator orders them → result list appears with scores and snippet badges
3. **"Shard Timeout"**: One shard turns amber `slow` → planner continues with partial candidates → result page shows degraded-but-usable state instead of blank failure
4. **"Reindex"**: Old segment dims → replacement segment builds → traffic shifts to new version without full outage
5. **"Freshness Priority"**: Hot document bypasses normal backlog → index refresh happens faster → document appears earlier in search results

### Tradeoffs (4/4)
**Pros:** Inverted indexes make search fast at scale, ingest/query separation protects query latency, caching cuts repeated work dramatically, ranking stages allow continuous quality improvement
**Cons:** Freshness and latency are in tension, shard fan-out creates operational complexity, ranking systems are expensive and hard to debug, reindexing at scale is disruptive if not versioned carefully

### FAQ (4 Questions)
1. **Why can't a search engine just query a database?** — Because scanning raw text across billions of documents is too slow. Search relies on specialized inverted indexes and rank pipelines.
2. **Why separate retrieval from ranking?** — Retrieval finds candidates cheaply; ranking spends more computation on a much smaller set.
3. **How do search engines stay fresh if indexing is asynchronous?** — Priority queues, partial refresh, and fast-path indexing for hot or breaking content.
4. **What happens if one shard is slow?** — Real systems often return partial but useful results within the latency budget rather than blocking on the slowest shard.

### Interview Notes (5 Points)
1. **Ingest and query are the two main planes**: explain both, not just query serving
2. **Inverted index is the core data structure**: this is the main architectural leap
3. **Ranking is a separate expensive stage**: retrieval != ranking
4. **Freshness is a product requirement with system cost**: faster refresh means more resource pressure
5. **Partial results are often better than total timeout**: graceful degradation matters

### Key Takeaways (5 Points)
1. Search engines are two systems at once: index builders and query servers
2. The diagram must make retrieval and ranking visibly separate
3. Inverted indexes are why search can feel instantaneous at web scale
4. Freshness, latency, and ranking quality constantly trade off with one another
5. Good search architecture is as much about degradation strategy as best-case performance

### Related Topics
`web-crawler`, `kafka`, `caching-strategies`, `consistent-hashing`, `event-driven-architecture`

---

## Topic 9: Amazon (Capstone)

**File:** `src/content/case-studies/amazon.mdx`
**Difficulty:** Hard | **Wave:** 3 | **Order:** 9

### Introduction
"Amazon is like a giant mall where every storefront, cash register, warehouse shelf, and shipping dock is run by a different specialist, but the customer still expects one smooth checkout. The real challenge is not showing products on a page; it is coordinating search, cart, payment, inventory, and order state so the user gets a reliable outcome even when some pieces slow down or fail."

### Why This Matters & Prerequisites
**Why This Matters:**
Amazon is the capstone case study because it combines several system-design themes at once: search, product catalog, cart, checkout, payment, inventory reservation, order orchestration, and eventual reconciliation. It tests whether the product can teach a broad architecture without collapsing into generic enterprise spaghetti.

**Who Should Read This:**
- 🟢 **Beginners**: Understand the major subsystems behind a modern e-commerce flow
- 🟡 **Intermediate**: Design cart/session state, checkout orchestration, and inventory reservation
- 🔴 **Advanced**: Handle payment failure, stock races, asynchronous order fan-out, and reconciliation across services

**Prerequisites:** [Search Engine](/case-studies/search-engine), [Caching Strategies](/topics/caching-strategies), [Saga Pattern](/topics/saga-pattern), [API Gateway](/topics/api-gateway)

### Requirements
**Functional:**
1. Search and browse products with category filters
2. Add items to cart and persist cart state across sessions/devices
3. Checkout with payment authorization and order placement
4. Reserve and decrement inventory safely
5. Emit downstream order events for fulfillment, notifications, and analytics

**Non-Functional:**
1. Product page and cart reads p99 < 200ms
2. Checkout completion p99 < 3 seconds for healthy dependencies
3. Inventory correctness under concurrent checkout load
4. 99.99% availability for browse/cart flows
5. Graceful degradation when payments, inventory, or downstream fan-out are impaired

### Capacity Estimation
| Metric | Value | Calculation |
|---|---|---|
| Product catalog | 1B+ SKUs | Global marketplace |
| Daily active shoppers | 250M+ | Large global traffic |
| Peak browse/search QPS | 500K/sec | Shopping bursts and events |
| Peak cart updates | 100K/sec | Add/remove/change quantity |
| Peak checkouts | 25K/sec | Event periods |
| Order events/day | 500M+ | Orders + line items + fulfillment states |
| Inventory reservations | 50K/sec peak | Concurrent demand windows |

### API Design
```http
GET /api/v1/search?q=<query>&filters=<...>
Response: { items: [{ sku, title, price, availability }], nextCursor }

GET /api/v1/products/{sku}
Response: { sku, title, price, inventoryStatus, shippingEstimate, sellerInfo }

POST /api/v1/cart/items
Body: { sku: string, quantity: number }
Response: 200 { cartId, items: [...] }

POST /api/v1/checkout
Body: { cartId: string, paymentMethodId: string, addressId: string }
Response: 202 { checkoutId, status: "processing" }

GET /api/v1/orders/{orderId}
Response: { orderId, status, lineItems, paymentStatus, fulfillmentStatus }
```

### Data Model
```sql
products (
  sku VARCHAR(32) PRIMARY KEY,
  title TEXT,
  category_id BIGINT,
  price_cents INT,
  inventory_available INT,
  seller_id BIGINT,
  updated_at TIMESTAMP
)

carts (
  cart_id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL,
  status VARCHAR(16), -- active | checked_out | abandoned
  updated_at TIMESTAMP
)

cart_items (
  cart_id UUID,
  sku VARCHAR(32),
  quantity INT,
  unit_price_cents INT,
  PRIMARY KEY (cart_id, sku)
)

orders (
  order_id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL,
  cart_id UUID,
  status VARCHAR(24), -- pending_payment | reserved | confirmed | failed | cancelled
  total_cents INT,
  created_at TIMESTAMP
)
```
**DB Choice:** Search index for search/browse. DynamoDB or Redis-backed cart store for fast mutable carts. Relational order store for checkout correctness. Separate inventory service/database with reservation semantics. Kafka or similar bus for downstream fan-out.

### Architecture Diagram (`amazon-arch`)

```
[Shopper] → [API Gateway] → [Search / Catalog] → [Search Index]
                      ↓              ↓
                 [Cart Service]   [Product DB]
                      ↓
                  [Cart Store]
                      ↓
                [Checkout Orchestrator] → [Payment Service]
                      ↓                   [Inventory Service]
                      ↓
                   [Order Service] → [Event Bus] → [Fulfillment / Notification / Analytics]
```

**Nodes:**
- `ClientNode` → "Shopper" (sublabel: "Browse · Cart · Checkout")
- `LoadBalancerNode` → "API Gateway" (sublabel: "Auth · Rate limit · Route")
- `ServiceNode` → "Search / Catalog" (sublabel: "Search results · product detail · filters")
- `DatabaseNode` → "Search Index" (sublabel: "Catalog search documents")
- `DatabaseNode` → "Product DB" (sublabel: "Canonical SKU data · price · metadata")
- `CacheNode` → "Cart Store" (sublabel: "Active cart session · item state")
- `ServiceNode` → "Cart Service" (sublabel: "Add/remove item · price snapshot")
- `ServiceNode` → "Checkout Orchestrator" (sublabel: "Reserve → pay → confirm saga")
- `ServiceNode` → "Payment Service" (sublabel: "Authorize / capture / fail")
- `ServiceNode` → "Inventory Service" (sublabel: "Reserve stock · release on failure")
- `ServiceNode` → "Order Service" (sublabel: "Order state machine · confirmation")
- `QueueNode` → "Event Bus" (sublabel: "Order fan-out events")
- `ServiceNode` → "Fulfillment / Notification / Analytics" (sublabel: "Downstream async consumers")

**Edges:**
- Shopper → Gateway: animated, label "Browse / cart / checkout"
- Gateway → Search / Catalog: animated, label "Search or PDP request"
- Search / Catalog → Search Index: animated, label "Search results"
- Search / Catalog → Product DB: animated, label "Canonical product metadata"
- Gateway → Cart Service: animated, label "Cart mutation"
- Cart Service → Cart Store: animated, label "Persist cart state"
- Cart Service → Checkout Orchestrator: animated, label "Checkout request"
- Checkout Orchestrator → Inventory Service: animated, label "Reserve stock"
- Checkout Orchestrator → Payment Service: animated, label "Authorize payment"
- Checkout Orchestrator → Order Service: animated, label "Create order"
- Order Service → Event Bus: animated, label "order.created / order.failed"
- Event Bus → Fulfillment / Notification / Analytics: animated, label "Async fan-out"

### Read & Write Paths
**Read (Browse / Cart):**
1. Shopper searches or opens a product page through Search / Catalog
2. Search results come from Search Index; canonical details fill from Product DB
3. Cart Service reads/writes the active cart state from Cart Store
4. Shopper sees current pricing, availability hints, and cart state quickly

**Write (Checkout):**
1. Shopper triggers checkout from Cart Service
2. Checkout Orchestrator validates price snapshot and requests inventory reservation
3. Payment Service authorizes payment
4. On success, Order Service creates order and emits events
5. On failure, reservation or payment is released/reversed and the customer gets a clear degraded outcome

### Deep Dives
1. **Catalog vs Transaction Separation:** Browsing needs fast, scalable search; checkout needs correctness. These should never be the same path.
2. **Inventory Reservation:** Inventory correctness is not just a database decrement. Reservation and release semantics are the core concurrency control.
3. **Order Saga:** Checkout is a multi-step workflow. The visualization must show compensating behavior when payment or inventory fails.

### Implementation Patterns
**Reserve Then Confirm Checkout:**
```typescript
async function processCheckout(input: CheckoutInput) {
  const reservation = await inventory.reserve(input.items, input.checkoutId);
  if (!reservation.ok) {
    return { status: 'failed', reason: 'inventory_unavailable' };
  }

  const payment = await payments.authorize(input.paymentMethodId, input.totalCents);
  if (!payment.ok) {
    await inventory.release(input.checkoutId);
    return { status: 'failed', reason: 'payment_declined' };
  }

  const order = await orders.create({
    userId: input.userId,
    items: input.items,
    paymentAuthId: payment.authId,
    reservationId: reservation.reservationId,
  });

  await events.publish('order.created', { orderId: order.orderId });
  return { status: 'confirmed', orderId: order.orderId };
}
```

**Simple Cart Merge on Login:**
```typescript
function mergeAnonymousCart(serverCart: Cart, localCart: Cart) {
  const merged = new Map(serverCart.items.map((item) => [item.sku, item.quantity]));

  for (const item of localCart.items) {
    merged.set(item.sku, (merged.get(item.sku) ?? 0) + item.quantity);
  }

  return Array.from(merged.entries()).map(([sku, quantity]) => ({ sku, quantity }));
}
```

### Scaling Strategy
- **0→1M orders/day:** Single-region checkout, managed search cluster, Redis/Dynamo cart store
- **1M→20M:** Regional search + cart caches, dedicated inventory reservation path, async order fan-out
- **20M→100M:** Multi-region browse tier, checkout orchestration hardening, stronger price/inventory snapshot rules, richer downstream consumers
- **100M+ orders/day:** Event-driven fulfillment mesh, global catalog/search strategy, adaptive inventory placement, extensive reconciliation and recovery tooling

### Failure Scenarios & Production Considerations
| Failure | Impact | Mitigation |
|---|---|---|
| Payment declines after reservation | Reserved stock needs release | Saga compensation: release reservation and return customer-friendly failure |
| Inventory race on hot SKU | Oversell risk | Atomic reservation and short hold TTL |
| Search index lag | Product discoverability drop | Serve from last good index; PDP still available from Product DB |
| Cart store outage | Users cannot mutate carts | Fallback read-only cart state + retry queue for writes |
| Event bus lag | Fulfillment and notifications delayed | Checkout still confirms after durable order write; async consumers catch up |
| Price change during checkout | Mismatch between cart and final charge | Re-price at checkout and surface explicit confirmation before charge |

**Production Monitoring:** search latency, cart mutation latency, checkout success rate, reservation release rate, payment decline rate, event-bus lag, order confirmation latency
**How Real Systems Differ:** Amazon's real estate is vastly larger, with marketplace sellers, ads, recommendations, pricing engines, fulfillment networks, and many regional rules. This capstone plan intentionally narrows the surface to the most important system-design lesson: reliable coordination across loosely coupled subsystems.

### System Flows (Interactive) — `<CommerceFlowSim />`

**Controls:**
- **"Search Product" button** → Runs browse/search into the catalog path
- **"Add to Cart" button** → Mutates cart state
- **"Checkout" button** → Starts reserve → pay → order flow
- **"Payment Failure" toggle** → Forces payment authorization failure
- **"Inventory Race" toggle** → Forces stock contention on a hot item

**Animations:**
1. **"Search Product"**: Shopper query goes to Search / Catalog → Search Index returns candidates → product details hydrate from Product DB → shopper sees result cards
2. **"Add to Cart"**: Cart Service updates Cart Store → cart badge increments → price snapshot badge appears
3. **"Checkout"**: Checkout Orchestrator requests inventory hold → payment authorization succeeds → Order Service creates order → Event Bus fans out to fulfillment/notification/analytics
4. **"Payment Failure"**: Payment Service turns red `declined` → Inventory Service receives `release reservation` → checkout path returns a clear failure state without a ghost order
5. **"Inventory Race"**: Two shoppers contend for the same SKU → one reservation wins green → the other goes amber/red `out of stock` with visible compensation path

### Tradeoffs (4/4)
**Pros:** Separation of browse and checkout improves both speed and correctness, cart state can scale independently, reservation-based inventory avoids many oversell paths, async order fan-out keeps checkout from blocking on downstream consumers
**Cons:** Cross-service coordination is complex, eventual consistency can confuse users if not communicated well, cart and price snapshots require careful rules, failure compensation logic is easy to get subtly wrong

### FAQ (4 Questions)
1. **Why separate search/catalog from checkout?** — Search optimizes for speed and scale; checkout optimizes for correctness and state transitions. Combining them makes both worse.
2. **Why reserve inventory before charging payment?** — To avoid charging a customer for stock you no longer have. Reservation is the concurrency guard.
3. **What if payment succeeds but order confirmation is delayed?** — The system needs a durable intermediate state and reconciliation path so the customer gets a trustworthy outcome.
4. **Why use async order events after confirmation?** — Fulfillment, notifications, and analytics should not block the customer-facing confirmation path.

### Interview Notes (5 Points)
1. **Amazon is a coordination problem**: search, cart, checkout, payment, inventory, and order are distinct systems
2. **Browse and buy are different reliability targets**: search can degrade; checkout needs stronger guarantees
3. **Inventory reservation is the key correctness primitive**
4. **Saga-style compensation is necessary**: payment and inventory failures must unwind cleanly
5. **Capstone quality comes from separation of concerns**: flat service meshes are not acceptable explanations here

### Key Takeaways (5 Points)
1. Amazon is the capstone because it combines many distributed-system patterns in one user flow
2. The diagram must keep subsystem boundaries obvious or the teaching value collapses
3. Inventory and payment are the two correctness-critical stages in checkout
4. Async order fan-out is a scale tool, not a customer-facing dependency
5. A premium capstone visualization should make failure compensation as clear as the success path

### Related Topics
`search-engine`, `caching-strategies`, `saga-pattern`, `api-gateway`, `service-discovery`

---

## New Simulation Component Specs (Wave 3)

### `FileSyncSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | Google Drive / Dropbox |
| **Controls** | Upload File, Edit Offline, Create Conflict, Restore Version, Network Drop |
| **Key Visual** | Chunk-level file sync path with distinct metadata and blob lanes |
| **Wow Factor** | Conflict branch plus resumable chunk replay without restarting the full upload |
| **Data Flow** | Local change → chunk/hash → blob upload → metadata commit → change feed → other device sync |
| **Metrics Shown** | Changed chunks, upload progress, sync state, conflict count, resume offset |

### `SearchPipelineSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | Search Engine |
| **Controls** | Ingest Document, Run Query, Shard Timeout, Reindex, Freshness Priority |
| **Key Visual** | Two-mode search view: ingest/index lane or query/rank lane |
| **Wow Factor** | Shard fan-out and partial result merge staying usable under timeout |
| **Data Flow** | Ingest: parse → queue → build → refresh. Query: parse → shard fan-out → retrieve → rank → results |
| **Metrics Shown** | Query latency, shard timeout count, ingest lag, cache hits, refresh age |

### `CommerceFlowSim`
| Property | Value |
|---|---|
| **Type** | Dedicated topic simulation |
| **Used by** | Amazon |
| **Controls** | Search Product, Add to Cart, Checkout, Payment Failure, Inventory Race |
| **Key Visual** | Customer order path crossing search, cart, checkout, payment, inventory, and event fan-out |
| **Wow Factor** | Visible compensation path when payment or stock fails after checkout starts |
| **Data Flow** | Search/browse → cart → reserve inventory → authorize payment → create order → async fan-out |
| **Metrics Shown** | Cart size, reservation state, payment result, order status, async fan-out lag |

---

## Dependency Matrix (Wave 3)

| Depends on ↓ / Needed by → | Google Drive / Dropbox | Search Engine | Amazon |
|---|---|---|---|
| `ClientNode` | ✅ | ✅ | ✅ |
| `ServiceNode` | ✅ | ✅ | ✅ |
| `DatabaseNode` | ✅ | ✅ | ✅ |
| `QueueNode` | — | ✅ | ✅ |
| `CacheNode` | ✅ | ✅ | ✅ |
| `LoadBalancerNode` | ✅ | ✅ | ✅ |
| `LaneNode` | — | ✅ | ✅ |
| `AnimatedEdge` | ✅ | ✅ | ✅ |
| `FileSyncSim` | ✅ | — | — |
| `SearchPipelineSim` | — | ✅ | — |
| `CommerceFlowSim` | — | — | ✅ |

---

## Implementation Order (Wave 3)

| Priority | Topic | Effort | Rationale |
|---|---|---|---|
| 1 | **Search Engine** | High | Establishes the ingest-vs-query visual grammar needed for the rest of the wave |
| 2 | **Google Drive / Dropbox** | High | `FileSyncSim` is self-contained and validates stateful sync storytelling before the capstone |
| 3 | **Amazon** | Very High | `CommerceFlowSim` is the broadest capstone flow and should come after the wave's lower-level visual patterns are already proven |

---

## Verification Plan (Wave 3)

### Shared Wave 3 Readiness
- [ ] All shared Hard prerequisites inherited from Part 1 are complete before Wave 3 content implementation begins
- [ ] `diagramConfigs.ts` contains `google-drive-arch`, `search-engine-arch`, and `amazon-arch`
- [ ] `FileSyncSim`, `SearchPipelineSim`, and `CommerceFlowSim` are scoped before implementation starts
- [ ] Wave 1 and Wave 2 quality bars are treated as the minimum, not the target ceiling
- [ ] Capstone diagrams keep primary path readability before secondary flow density is introduced

### Visual QA Rubric
- [ ] A new user can identify the main path within 10 seconds without reading surrounding prose
- [ ] Hover, click, scenario toggle, and replay/reset interactions are present and meaningful
- [ ] Primary path and fallback/degraded path are visually distinguishable
- [ ] Legends, labels, badges, and overlays are sufficient to understand the diagram without extra decoding
- [ ] Google Drive / Dropbox clearly separates metadata sync from chunk/blob transfer
- [ ] Search Engine clearly separates ingest/indexing flow from query/ranking flow
- [ ] Amazon clearly separates browse/search/cart actions from checkout/order correctness paths
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

### Wave 3 Exit Criteria
- [ ] Google Drive / Dropbox: `FileSyncSim` shows chunked sync, offline replay, conflict detection, and version restore
- [ ] Search Engine: `SearchPipelineSim` shows ingest/index refresh, shard fan-out query path, ranking, and degraded partial-results behavior
- [ ] Amazon: `CommerceFlowSim` shows search/cart/checkout orchestration, payment failure compensation, inventory race, and async order fan-out
- [ ] All 3 topics pass the shared Hard visual QA rubric
- [ ] No P0 or P1 issues in visualization review
