# Phase 3: Scaling + Databases Sprint — Comprehensive Plan

> **Goal:** Complete 7 remaining topics across the Scaling and Databases categories using a strict reusable-component approach and our established pedagogical framework.

---

## Reusable Asset Inventory

Before building anything new, here is what we already have:

### Existing Node Types
| Node | File | Reusable For |
|---|---|---|
| `ClientNode` | `nodes/ClientNode.tsx` | Users, Apps, External traffic |
| `ServiceNode` | `nodes/ServiceNode.tsx` | App servers, Cache servers, Replicas |
| `DatabaseNode` | `nodes/DatabaseNode.tsx` | Primary DB, Replicas, Shards (has `isPrimary` prop) |
| `LoadBalancerNode` | `nodes/LoadBalancerNode.tsx` | LBs, Routers, API Gateways |
| `LaneNode` | `nodes/LaneNode.tsx` | Swimlane containers for side-by-side comparison |

### Existing Edge Types
| Edge | File | Reusable For |
|---|---|---|
| `AnimatedEdge` | `edges/AnimatedEdge.tsx` | All animated data-flow connections |

### Existing Simulations
| Simulation | Can Be Referenced By |
|---|---|
| `ConsistentHashingSim` | Database Sharding (hash ring) |
| `ScalingComparison` | Horizontal vs Vertical |

### New Components Needed
| Component | Purpose | Reused By |
|---|---|---|
| `CacheNode` | A new node type for Cache layers (Redis/Memcached) | Caching Strategies, Database Replication |
| `ReplicationSim` | Interactive leader→follower replication flow | Database Replication |
| `CacheFlowSim` | Cache Hit/Miss simulation with TTL slider | Caching Strategies |
| `IndexLookupSim` | B-Tree traversal vs Full Scan race visualization | Indexing |
| `PartitionQuerySim` | Queryable partition selector (click date → highlight partition) | Partitioning |
| `ACIDvsBASESim` | Transaction lifecycle: locking vs eventual sync | ACID vs BASE |

---

## Pedagogical Rules (Enforced Per Topic)

Every topic **MUST** follow this structure:

| # | Section | Rule |
|---|---|---|
| 1 | Introduction | 2-3 sentences, beginner-friendly analogy |
| 2 | Problem & Context | What real problem does this solve? |
| 3 | Core Theory | Key concepts with simple language |
| 4 | Architecture & Components | **React Flow diagram** (reuse existing nodes) |
| 5 | Interactive Visualization | Simulation or interactive React Flow |
| 6 | Tradeoffs | **4-6 Pros, 4-6 Cons** (strict) |
| 7 | Real-World Application | Level 1 (Foundational) + Level 2 (Enterprise) |
| 8 | Implementation Patterns | `<KnowledgeSnippet>` with best practice |
| 9 | Common Questions (Q&A) | **4-6 questions** (strict) |
| 10 | Interview Notes | `<InterviewAnswer>` with 5-point framework |
| 11 | Summary & Takeaways | **4-6 points** (strict) |
| 12 | Related Topics | `<RelatedTopics>` cross-links |

---

## Topic 1: Database Sharding

**File:** `src/content/scaling/database-sharding.mdx`
**Difficulty:** Medium
**Category:** Scaling

### Introduction
"Imagine a library with 10 million books on one shelf. Finding a book takes forever. Sharding splits that shelf into labeled sections so you can go straight to the right aisle."

### Architecture Diagram (`database-sharding-flow`)
**Config ID:** `database-sharding-flow`

Use `LaneNode` for **before/after** comparison:

```
┌─── Lane: Before Sharding ────────────────────────────┐
│ [All Users] → [Single Overloaded DB (status: down)]  │
└──────────────────────────────────────────────────────-┘

┌─── Lane: After Sharding ─────────────────────────────────────────────────┐
│ [App] → [Shard Router] → [Shard A: Users A-H (1.2M rows)]              │
│                         → [Shard B: Users I-P (1.8M rows) ⚠️ Hot]       │
│                         → [Shard C: Users Q-Z (1.0M rows)]              │
└──────────────────────────────────────────────────────────────────────────-┘
```

**Nodes (reuse existing):**
- 2x `LaneNode` → "Before Sharding" and "After Sharding"
- `ClientNode` → "All Users" (Before lane), "Application" (After lane)
- `DatabaseNode` → "Single DB" with status: "down" (Before lane — shows overload)
- `LoadBalancerNode` → "Shard Router" (sublabel: "hash(user_id) % 3")
- `DatabaseNode` x3 → "Shard A" (sublabel: "Users A-H · 1.2M rows"), "Shard B" (sublabel: "Users I-P · 1.8M rows", status: "warning" — hot shard glow), "Shard C" (sublabel: "Users Q-Z · 1.0M rows")

**Edges:**
- Before: Client→SingleDB animated, label "All Traffic → One DB"
- After: App→Router animated, Router→each Shard animated with labels showing shard key routing (e.g., `"user_id: 42 → Shard B"`)

### Interactive Visualization
Reuse `<ConsistentHashingSim />` for the hash ring distribution. The Lane diagram above shows the "why" (before/after), and the hash ring shows the "how" (key distribution).

### Tradeoffs (4 Pros / 4 Cons)
**Pros:**
1. Enables horizontal scaling of databases beyond a single machine's capacity
2. Each shard handles less traffic, improving query latency
3. Failure of one shard doesn't affect the others (fault isolation)
4. Allows geographic data placement (e.g., EU users on EU shard)

**Cons:**
1. Cross-shard queries (JOINs) become extremely complex or impossible
2. Re-sharding (changing the key) requires massive data migration
3. "Hot shards" can occur if the shard key is poorly chosen
4. Increases operational complexity (monitoring N databases instead of 1)

### Q&A (4 Questions)
1. **What is a "Shard Key"?** — The column used to decide which shard a row belongs to (e.g., `user_id`).
2. **What happens if one shard gets too big?** — You "re-shard" by splitting it. This is expensive, which is why consistent hashing is preferred.
3. **How do I do cross-shard JOINs?** — Generally, you don't. You denormalize data or use an application-level scatter-gather pattern.
4. **Range-based vs Hash-based sharding?** — Range is better for sequential scans; Hash is better for even distribution but loses range query ability.

### Interview Notes (5 Points)
1. **Definition**: Splitting a single database into multiple smaller databases (shards), each holding a subset of the data.
2. **Shard Key Selection**: The most critical decision. A bad key causes hot shards. Good keys have high cardinality and even distribution (e.g., `user_id`).
3. **Routing**: A "Shard Router" directs queries using `hash(shard_key) % num_shards` or consistent hashing.
4. **Rebalancing**: When adding shards, consistent hashing minimizes data movement ($1/N$ of keys).
5. **Trade-off**: You sacrifice cross-shard transactions and JOINs for virtually unlimited horizontal scale.

### Summary (5 Points)
1. Sharding splits a database horizontally across multiple machines.
2. The shard key determines data distribution and must be chosen carefully.
3. Consistent hashing enables smooth scaling without massive data migration.
4. Cross-shard queries are the primary architectural cost.
5. Used by Instagram (user_id), Discord (guild_id), and Uber (city_id).

---

## Topic 2: Database Replication

**File:** `src/content/scaling/database-replication.mdx`
**Difficulty:** Medium
**Category:** Scaling

### Introduction
"Think of a Google Doc. You type on one copy, but your teammates see the same content on their screens almost instantly. Database replication works the same way — one 'leader' database pushes changes to 'follower' copies."

### Architecture Diagram (`database-replication-flow`)
**Config ID:** `database-replication-flow`

```
[Client App] → [Primary DB (Leader)] ──sync──→ [Replica 1 (Follower)]
                                      ──async─→ [Replica 2 (Follower)]
                    ↑
            [Read Client] ← reads from Replicas
```

**Nodes (reuse existing):**
- `ClientNode` → "Write Client" + "Read Client"
- `DatabaseNode` → "Primary (Leader)" with `isPrimary: true`
- `DatabaseNode` x2 → "Replica 1" (sublabel: "Sync"), "Replica 2" (sublabel: "Async")

**Edges:**
- Client→Primary: animated, label "Write"
- Primary→Replica1: animated, label "Sync Replication"
- Primary→Replica2: animated, label "Async Replication"
- Replica1→ReadClient: animated, label "Read"
- Replica2→ReadClient: animated, label "Read"

### Interactive Visualization
**New Component:** `<ReplicationSim />`
- Shows a "Write" event propagating from Leader to Followers
- Toggle between "Synchronous" (both replicas confirm before response) and "Asynchronous" (leader responds immediately)
- Visual delay on async replica to show eventual consistency lag

### Tradeoffs (4 Pros / 4 Cons)
**Pros:**
1. Increases read throughput by distributing reads across replicas
2. Provides high availability — if the leader fails, a replica can be promoted
3. Enables geographic distribution (replicas closer to users)
4. Protects against data loss (multiple copies of the same data)

**Cons:**
1. Write throughput is NOT improved (all writes go to the leader)
2. Replication lag causes stale reads in async mode
3. Failover (promoting a replica to leader) can cause brief data inconsistency
4. Increases storage costs linearly (N copies of the data)

### Q&A (5 Questions)
1. **What is "Replication Lag"?** — The time delay between a write on the leader and when the follower catches up. In async mode, this can be milliseconds to seconds.
2. **Leader-Follower vs Multi-Leader?** — Leader-Follower is simpler (one write point). Multi-Leader allows writes on any node but introduces complex conflicts.
3. **How does failover work?** — The system detects the leader is down (heartbeat timeout), elects a replica as the new leader, and redirects writes. This is the core of tools like AWS RDS Multi-AZ.
4. **Can I read from the leader?** — Yes, for reads that demand "read-your-writes" consistency. Otherwise, read from replicas to reduce leader load.
5. **What is "Split Brain"?** — When two nodes both think they are the leader, causing conflicting writes. This is prevented by consensus protocols like Raft.

### Interview Notes (5 Points)
1. **Definition**: Maintaining copies of the same data on multiple machines to improve read performance and availability.
2. **Sync vs Async**: Synchronous replication guarantees consistency but adds latency. Asynchronous is faster but risks stale reads.
3. **Read Scaling**: Replicas serve read traffic, offloading the leader. This is the primary scaling benefit.
4. **Failover**: Automatic promotion of a replica to leader. Critical for high availability (HA).
5. **Trade-off**: Replication improves reads and availability but does NOT scale writes. For write scaling, you need Sharding.

### Summary (5 Points)
1. Replication creates copies of a database for read scaling and high availability.
2. The Leader handles all writes; Followers serve reads.
3. Synchronous replication = strong consistency but higher latency.
4. Asynchronous replication = low latency but risk of stale reads.
5. Combined with sharding, it forms the backbone of modern distributed databases.

---

## Topic 3: Caching Strategies

**File:** `src/content/scaling/caching-strategies.mdx`
**Difficulty:** Medium
**Category:** Scaling

### Introduction
"Caching is like keeping your most-used phone contacts on speed dial. Instead of scrolling through thousands of contacts every time, you access the most frequent ones instantly."

### Architecture Diagram (`caching-strategies-flow`)
**Config ID:** `caching-strategies-flow`

```
[Client] → [App Server] → [Cache (Redis)] ── HIT ──→ Response
                                           ── MISS ──→ [Database] → populate cache → Response
```

**Nodes (reuse existing + 1 new):**
- `ClientNode` → "User Request"
- `ServiceNode` → "App Server"
- **[NEW]** `CacheNode` → "Redis Cache" (sublabel: "In-Memory Store") — new node with a lightning-bolt icon and a distinct teal/cyan color
- `DatabaseNode` → "PostgreSQL" (sublabel: "Persistent Storage")

**Edges:**
- Client→App: animated
- App→Cache: animated, label "Lookup"
- Cache→App: animated (green tint), label "Cache Hit"
- App→DB: animated, label "Cache Miss"
- DB→Cache: animated (dashed), label "Populate"

### Interactive Visualization
**New Component:** `<CacheFlowSim />`
- Animated flow showing requests hitting the cache
- **Cache Hit**: Green flash, instant response
- **Cache Miss**: Red flash → query goes to DB → result populates cache → future hits are green
- Controls: TTL slider, "Flush Cache" button, request rate control

### Tradeoffs (4 Pros / 4 Cons)
**Pros:**
1. Dramatically reduces database load and read latency (sub-millisecond)
2. Protects the database during traffic spikes (acts as a buffer)
3. Multiple caching patterns available (Cache-Aside, Write-Through, Write-Behind)
4. Cost-effective way to scale reads without adding more DB replicas

**Cons:**
1. Cache Invalidation is notoriously difficult ("one of the two hard things in CS")
2. Stale data risk if TTL is too long or invalidation is missed
3. Cold start problem — an empty cache causes a "thundering herd" to the DB
4. Extra infrastructure to maintain (Redis/Memcached cluster)

### Q&A (5 Questions)
1. **Cache-Aside vs Write-Through?** — Cache-Aside (Lazy Loading): app checks cache first, loads from DB on miss. Write-Through: app writes to cache AND DB simultaneously, ensuring cache is always fresh.
2. **What is a "Thundering Herd"?** — When the cache expires and hundreds of concurrent requests all hit the DB at once. Solved with "cache locking" or staggered TTLs.
3. **When should I NOT use caching?** — For data that changes very frequently (real-time stock prices) or data where staleness is unacceptable (financial balances).
4. **How big should my cache be?** — Follow the 80/20 rule. ~20% of your data serves ~80% of requests. Cache the hottest 20%.
5. **What is "Write-Behind" caching?** — The app writes ONLY to the cache. The cache asynchronously flushes to the DB in batches. Fastest writes, but risk of data loss if the cache crashes before flushing.

### Interview Notes (5 Points)
1. **Cache-Aside (Lazy Loading)**: App checks cache → miss → query DB → store in cache → return. Most common pattern.
2. **Write-Through**: App writes to cache + DB on every write. Cache is always consistent but writes are slower.
3. **Write-Behind (Write-Back)**: App writes ONLY to cache. Cache batches writes to DB. Fastest but riskiest.
4. **Eviction Policies**: LRU (Least Recently Used), LFU (Least Frequently Used), TTL-based expiry.
5. **Trade-off**: Caching trades memory (RAM) and consistency (staleness) for speed and reduced DB load.

### Summary (5 Points)
1. Caching stores frequently accessed data in fast memory (RAM) to avoid slow disk reads.
2. Cache-Aside is the most common pattern; the application manages the cache lifecycle.
3. Cache Invalidation is the hardest problem — use TTLs and event-driven invalidation.
4. The "Thundering Herd" is the biggest operational risk during cache failures.
5. Redis and Memcached are the industry standards for distributed caching.

---

## Topic 4: Indexing

**File:** `src/content/databases/indexing.mdx`
**Difficulty:** Easy
**Category:** Databases

### Introduction
"An index in a database is like the index at the back of a textbook. Instead of reading every page to find 'B-Tree', you flip to the index, find the page number, and go straight there."

### Architecture Diagram (`indexing-flow`)
**Config ID:** `indexing-flow`

Use a **tree-shaped React Flow layout** to visually represent the B-Tree structure:

```
                    [Root Node: 1-1000]
                   /                    \
        [Branch: 1-500]           [Branch: 501-1000]
        /           \              /              \
  [Leaf: 1-100] [Leaf: 101-500] [Leaf: 501-750] [Leaf: 751-1000]
       ↓                                    ↓
  [Data Page 1]                       [Data Page 4] ← FOUND!
```

**Nodes (reuse existing):**
- `ClientNode` → "SQL Query" (sublabel: `"SELECT * WHERE id=42"`)
- `ServiceNode` → Root node, Branch nodes, and Leaf nodes (using different sublabels to show the key range at each level)
- `DatabaseNode` → "Data Pages" (the actual row storage)

**Edges:**
- Use animated edges on the **search path only** (Root → Left Branch → Leaf 1 → Data Page 1) to show the B-Tree traversal
- All other edges remain dim/inactive to show they were "skipped"
- Label the active path: "Step 1: Root", "Step 2: Branch", "Step 3: Leaf", "Step 4: Data Page"

### Interactive Visualization
**New Component:** `<IndexLookupSim />`
- **Left Panel (Indexed)**: A visual B-Tree (3 levels). When a search value is entered, the path from Root → Leaf → Data Page lights up step-by-step. A counter shows: `"Steps: 3 → Found in O(log n)"`
- **Right Panel (Unindexed)**: A linear list of rows being checked one-by-one with a slow sequential animation. A counter shows: `"Steps: 847,293 → Found in O(n)"`
- **Controls**: A search input field + preset queries ("Find id=42", "Find id=999")
- **Live scoreboard**: `"Index: 3 lookups (0.2ms)"` vs `"Full Scan: 847,293 lookups (1,200ms)"`

### Tradeoffs (4 Pros / 4 Cons)
**Pros:**
1. Dramatically speeds up SELECT queries (from O(n) to O(log n))
2. Enforces uniqueness constraints (unique indexes)
3. Speeds up ORDER BY and GROUP BY operations
4. Composite indexes can optimize multi-column queries

**Cons:**
1. Slows down INSERT/UPDATE/DELETE (index must be maintained on every write)
2. Consumes additional disk space (index is a separate data structure)
3. Too many indexes degrade write performance significantly
4. Choosing the wrong columns to index wastes resources

### Q&A (4 Questions)
1. **What is a B-Tree?** — A self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in O(log n) time. Most databases use B+ Trees (a variant).
2. **When should I add an index?** — On columns that appear frequently in WHERE, JOIN, and ORDER BY clauses. Never index columns with very low cardinality (e.g., a boolean `is_active` column).
3. **What is a Composite Index?** — An index on multiple columns (e.g., `(city, last_name)`). The order matters — it can optimize queries filtering on `city` or `city + last_name`, but NOT `last_name` alone.
4. **What is a Covering Index?** — An index that contains ALL the columns needed by a query, so the database can answer the query entirely from the index without touching the actual table data.

### Interview Notes (5 Points)
1. **Definition**: An index is a separate data structure (usually a B+ Tree) that maps column values to row locations on disk.
2. **Read vs Write Trade-off**: Indexes speed up reads but slow down writes because the index must be updated on every mutation.
3. **B+ Tree**: The standard. All data pointers are in leaf nodes, linked together for efficient range scans.
4. **Hash Index**: O(1) lookup for exact matches but cannot support range queries (`WHERE age > 25`).
5. **Guideline**: Index columns used in WHERE/JOIN/ORDER BY. Avoid over-indexing. Monitor with `EXPLAIN ANALYZE`.

### Summary (5 Points)
1. Indexes trade write speed and disk space for dramatically faster reads.
2. B+ Trees are the default index type in most relational databases.
3. Composite indexes optimize multi-column queries but column order matters.
4. Over-indexing degrades write performance — index strategically.
5. Use `EXPLAIN ANALYZE` to verify that your queries actually use the index.

---

## Topic 5: Partitioning

**File:** `src/content/databases/partitioning.mdx`
**Difficulty:** Medium
**Category:** Databases

### Introduction
"Partitioning is like organizing a filing cabinet by year. Instead of searching through every document, you go straight to the '2024' drawer. Each drawer is a partition."

### Architecture Diagram (`partitioning-flow`)
**Config ID:** `partitioning-flow`

```
[Query: WHERE date='2024-03'] → [Partition Router] → [2024-Q1 Partition] ✓
                                                    → [2023-Q4 Partition] (skipped)
                                                    → [2023-Q3 Partition] (skipped)
```

**Nodes (reuse existing):**
- `ClientNode` → "Query" (sublabel: "WHERE date = '2024-03'")
- `LoadBalancerNode` → "Partition Router" (sublabel: "Partition Pruning")
- `DatabaseNode` x3 → "P1: 2024-Q1" (isPrimary: true, targeted), "P2: 2023-Q4", "P3: 2023-Q3" (status: healthy but dim/untargeted)

**Edges:**
- Query→Router: animated
- Router→P1: animated (active), label "Hit"
- Router→P2: not animated, label "Pruned"
- Router→P3: not animated, label "Pruned"

### Interactive Visualization
**New Component:** `<PartitionQuerySim />`
- **Preset query buttons**: "Q1 2024", "Q4 2023", "Q3 2023", "All 2023"
- When a button is clicked, the diagram **dynamically highlights** the matching partition(s) and dims the rest
- Clicking "All 2023" highlights all 2023 partitions and shows: `"Rows Scanned: 3,200,000 / 5,000,000"` vs clicking "Q1 2024" shows: `"Rows Scanned: 800,000 / 5,000,000"` — making partition pruning tangible
- Consider adding **5-6 partitions** (instead of 3) to make the pruning benefit more dramatic

### Tradeoffs (4 Pros / 4 Cons)
**Pros:**
1. "Partition pruning" skips irrelevant partitions, massively speeding up queries
2. Enables efficient archival (drop an old partition instead of DELETE-ing rows)
3. Different partitions can live on different storage tiers (hot/cold)
4. Maintenance operations (VACUUM, REINDEX) can run per-partition

**Cons:**
1. Queries that span ALL partitions are slower than a single table
2. Choosing the wrong partition key leads to "hot partitions"
3. Adds complexity to schema design and migration
4. Some databases have limits on the number of partitions

### Q&A (4 Questions)
1. **Partitioning vs Sharding?** — Partitioning splits data WITHIN a single database instance. Sharding splits data ACROSS multiple database servers. Sharding is distributed partitioning.
2. **Range vs List vs Hash partitioning?** — Range: by date/value ranges. List: by explicit values (e.g., country). Hash: by hash of a column for even distribution.
3. **What is "Partition Pruning"?** — The database's ability to skip partitions that are irrelevant to a query. This is the primary performance benefit.
4. **Can I partition an existing table?** — Yes, but it's a significant migration. In PostgreSQL, you use declarative partitioning and migrate data into child tables.

### Interview Notes (5 Points)
1. **Definition**: Splitting a single logical table into smaller physical pieces (partitions) within the same database.
2. **Types**: Range (date-based), List (category-based), Hash (even distribution). Range is most common for time-series data.
3. **Partition Pruning**: The query planner skips irrelevant partitions automtically.
4. **Archival**: Old partitions can be detached and archived instead of running expensive DELETE operations.
5. **Key Difference from Sharding**: Partitioning = same server, different files. Sharding = different servers entirely.

### Summary (5 Points)
1. Partitioning divides a table into smaller, manageable physical pieces within the same database.
2. Range partitioning (by date) is the most common pattern for time-series data.
3. "Partition Pruning" makes queries dramatically faster by skipping irrelevant partitions.
4. Partitioning is NOT sharding — it happens within a single database instance.
5. It simplifies archival, maintenance, and storage tiering for large datasets.

---

## Topic 6: SQL vs NoSQL

**File:** `src/content/databases/sql-vs-nosql.mdx`
**Difficulty:** Easy
**Category:** Databases

### Introduction
"SQL databases are like Excel spreadsheets — structured rows and columns with strict rules. NoSQL databases are like JSON files — flexible, schema-less, and optimized for specific access patterns."

### Architecture Diagram (`sql-vs-nosql-flow`)
**Config ID:** `sql-vs-nosql-flow`

Use `LaneNode` for side-by-side comparison with **enriched inner nodes** showing actual data structures:

```
┌─── Lane: SQL (Relational) ───────────────────────────────────────┐
│ [App] → [Query Engine] → [Users Table] ──JOIN──→ [Orders Table]  │
└──────────────────────────────────────────────────────────────────-┘

┌─── Lane: NoSQL (Document) ──────────────────────────────────┐
│ [App] → [Key Lookup] → [User Doc {name, orders: [...]}]     │
└─────────────────────────────────────────────────────────────-┘
```

**Nodes:**
- 2x `LaneNode` → "SQL (Relational)" and "NoSQL (Document)"
- 2x `ClientNode` → "Application" (inside each lane)
- **SQL Lane (enriched)**:
  - `ServiceNode` → "Query Engine" (sublabel: "SELECT * FROM users JOIN orders...")
  - `DatabaseNode` → "Users Table" (sublabel: "id, name, email")
  - `DatabaseNode` → "Orders Table" (sublabel: "id, user_id, total")
  - JOIN edge between the two tables (animated, label: "JOIN on user_id")
- **NoSQL Lane (enriched)**:
  - `ServiceNode` → "Key Lookup" (sublabel: `"db.users.findOne({id: 42})"`)  
  - `DatabaseNode` → "User Document" (sublabel: `"{name, email, orders: [...]}"`) — shows embedded/denormalized data

**Edges:**
- SQL: App→Engine→UsersTable→OrdersTable (multi-hop with JOIN)
- NoSQL: App→Lookup→Document (single hop, faster animation)

### Interactive Visualization
Use `<ArchitectureCanvas>` with the enriched Lane diagram above. The visual contrast between the multi-hop SQL JOIN path and the single-hop NoSQL lookup tells the story. The different edge counts per lane instantly communicate the tradeoff.

### Tradeoffs (5 Pros / 5 Cons — framed as "SQL Strengths vs NoSQL Strengths")
**Pros (SQL):**
1. ACID transactions guarantee data integrity
2. Powerful JOINs for relational data
3. Mature ecosystem (PostgreSQL, MySQL)
4. Standard query language (SQL)
5. Enforced schema prevents bad data

**Cons (SQL) / Pros (NoSQL):**
1. Rigid schema makes rapid iteration difficult
2. Horizontal scaling is complex (requires sharding)
3. Not optimized for hierarchical or nested data
4. Schema migrations can cause downtime on large tables
5. Over-normalization leads to excessive JOINs

### Q&A (5 Questions)
1. **When should I use NoSQL?** — When you need flexible schemas, horizontal scaling, high write throughput, or your data is naturally document-shaped (e.g., user profiles, product catalogs).
2. **Can NoSQL do JOINs?** — Most NoSQL databases do not support JOINs natively. You denormalize data (embed related data in the same document) instead.
3. **Is MongoDB "web scale"?** — MongoDB supports horizontal scaling via sharding but sacrifices ACID transactions across shards. You trade consistency for scale.
4. **What is a "Wide-Column" database?** — A type of NoSQL (like Cassandra) that stores data in rows with dynamic columns. Ideal for time-series data and write-heavy workloads.
5. **Can SQL databases scale horizontally?** — Yes, but it's harder. CockroachDB, Google Spanner, and YugabyteDB are "NewSQL" databases that combine SQL with horizontal scaling.

### Interview Notes (5 Points)
1. **SQL**: Relational, structured, ACID-compliant. Best for complex queries, transactions, and data integrity (e.g., banking).
2. **NoSQL Types**: Document (MongoDB), Key-Value (Redis), Wide-Column (Cassandra), Graph (Neo4j). Each optimized for different access patterns.
3. **Schema**: SQL enforces schema-on-write. NoSQL uses schema-on-read (flexible but riskier).
4. **Scaling**: SQL scales vertically by default. NoSQL is designed for horizontal scaling.
5. **Decision Framework**: Use SQL for relational data with JOINs. Use NoSQL for high-velocity data, flexible schemas, or massive scale.

### Summary (5 Points)
1. SQL databases excel at complex queries, JOINs, and transactional integrity.
2. NoSQL databases excel at flexible schemas, horizontal scaling, and high write throughput.
3. The choice depends on your data model and access patterns, not just "which is better."
4. "NewSQL" (CockroachDB, Spanner) aims to combine the best of both worlds.
5. Many production systems use BOTH (Polyglot Persistence) — SQL for transactions, NoSQL for caching/analytics.

---

## Topic 7: ACID vs BASE

**File:** `src/content/databases/acid-base.mdx`
**Difficulty:** Easy
**Category:** Databases

### Introduction
"ACID and BASE are two philosophies for how databases handle data correctness. ACID says 'I will never show you wrong data, even if it means waiting.' BASE says 'I'll show you data fast, and it will EVENTUALLY be correct.'"

### Architecture Diagram (`acid-vs-base-flow`)
**Config ID:** `acid-vs-base-flow`

Use `LaneNode` for side-by-side comparison with **behavioral emphasis**:

```
┌─── Lane: ACID (Strong Consistency) ──────────────────────────┐
│ [Client A] → [Txn Manager 🔒] → [Single DB (Locked)]        │
│ [Client B] → ⏳ WAITING (lock held by Client A)               │
└──────────────────────────────────────────────────────────────-┘

┌─── Lane: BASE (Eventual Consistency) ────────────────────────┐
│ [Client A] → [Service] → [DB Node A] ──delayed──→ [DB Node B]│
│ [Client B] → [Service] → [DB Node B] (sees stale data ⚠️)    │
└──────────────────────────────────────────────────────────────-┘
```

**Nodes:**
- 2x `LaneNode` → "ACID (Strong Consistency)" and "BASE (Eventual Consistency)"
- **ACID Lane (behavioral)**:
  - `ClientNode` → "Client A" (sublabel: "Writing") + `ClientNode` → "Client B" (sublabel: "⏳ Waiting for lock")
  - `ServiceNode` → "Transaction Manager" (sublabel: "🔒 Lock Active")
  - `DatabaseNode` → "PostgreSQL" with isPrimary: true
  - Edge from Client B → Txn Manager should be **inactive/dim** to show blocking
- **BASE Lane (behavioral)**:
  - `ClientNode` → "Client A" + `ClientNode` → "Client B"
  - `ServiceNode` → "Service Layer"
  - `DatabaseNode` → "Node A" (sublabel: "v2 — Updated") + `DatabaseNode` → "Node B" (sublabel: "v1 — Stale ⚠️")
  - Delayed propagation edge between Node A → Node B (dashed, label: "Eventual Sync (50ms lag)")

**Edges:**
- ACID: Client A → Txn Manager (animated), Client B → Txn Manager (dim/blocked), Txn Manager → DB (animated, label: "120ms")
- BASE: Both clients animated to their respective nodes. Node A → Node B with dashed lag edge

### Interactive Visualization
**New Component:** `<ACIDvsBASESim />`
- **ACID side**: Animated transaction lifecycle: BEGIN → WRITE → COMMIT (with lock icon on DB during write). If user clicks "Fail", show ROLLBACK animation reverting the write
- **BASE side**: Write goes to Node A immediately (5ms). A delayed "Propagation" edge lights up to Node B after a visible lag (50-200ms). During the lag, Node B shows "⚠️ Stale" sublabel
- **Concurrent Access Demo**: Two write buttons ("Client A Write" + "Client B Write"). In ACID, Client B's button shows a spinner until Client A finishes. In BASE, both fire instantly but Node B briefly shows conflicting data
- **Timing indicators**: Live latency counters — "ACID: 120ms (waited for lock)" vs "BASE: 5ms (wrote immediately)"

### Tradeoffs (4 Pros / 4 Cons)
**ACID Pros:**
1. Data is always correct and consistent (no "dirty reads")
2. Rollback capability on failure (Atomicity)
3. Concurrent transactions don't interfere (Isolation)
4. Once committed, data survives crashes (Durability)

**ACID Cons / BASE Advantages:**
1. ACID locks are slow — BASE avoids locking for higher throughput
2. ACID is hard to scale across distributed systems
3. BASE provides higher availability (no waiting on locks)
4. BASE is more natural for eventually-consistent systems like social media feeds

### Q&A (4 Questions)
1. **What does "Basically Available" mean in BASE?** — The system guarantees a response to every request, even if the data might be slightly stale.
2. **Can a system be BOTH ACID and BASE?** — At different layers, yes. Your payment system might be ACID (PostgreSQL), while your recommendation engine is BASE (Cassandra).
3. **How does BASE relate to CAP Theorem?** — BASE systems typically prioritize "A" (Availability) and "P" (Partition Tolerance) over "C" (Consistency) in the CAP triangle.
4. **What does "Soft State" mean?** — The system's state may change over time, even without new input, as data propagates between replicas. This is the opposite of ACID's "Consistency."

### Interview Notes (5 Points)
1. **ACID**: Atomicity (all-or-nothing), Consistency (rules always valid), Isolation (concurrent txns don't clash), Durability (committed = permanent).
2. **BASE**: Basically Available (always responds), Soft State (state may change over time), Eventually Consistent (all replicas converge).
3. **Use ACID**: When correctness trumps speed — banking, inventory, healthcare.
4. **Use BASE**: When availability and speed trump strict correctness — social feeds, analytics, recommendations.
5. **Trade-off**: ACID sacrifices performance and scalability for correctness. BASE sacrifices short-term correctness for availability and speed.

### Summary (5 Points)
1. ACID guarantees data correctness through atomic, isolated transactions.
2. BASE prioritizes availability and speed, accepting temporary inconsistency.
3. ACID is best for financial systems; BASE is best for high-traffic, read-heavy apps.
4. BASE maps closely to AP systems in the CAP Theorem.
5. Modern architectures mix both — ACID for payments, BASE for feeds and analytics.

---

## Implementation Order (Revised)

| Priority | Topic | New Components | Estimated Effort |
|---|---|---|---|
| 1 | Caching Strategies | `CacheNode` + `CacheFlowSim` + diagram config | Medium |
| 2 | Database Replication | Diagram config + `ReplicationSim` (sync/async toggle + failover) | Medium |
| 3 | Database Sharding | Lane diagram config (before/after) + reuse Hash Ring sim | Low→Medium |
| 4 | **Indexing** | Tree-shaped diagram + `IndexLookupSim` (B-Tree vs Full Scan race) | **High** |
| 5 | Partitioning | Diagram config + `PartitionQuerySim` (queryable partition selector) | Medium |
| 6 | SQL vs NoSQL | Enriched Lane diagram (multi-table SQL vs single-doc NoSQL) | Low→Medium |
| 7 | **ACID vs BASE** | Behavioral Lane diagram + `ACIDvsBASESim` (locking vs eventual sync) | **High** |

---

## New Components Summary (6 Total)

| Component | Type | File |
|---|---|---|
| `CacheNode` | React Flow Node | `src/components/diagram/nodes/CacheNode.tsx` |
| `ReplicationSim` | Simulation | `src/components/simulation/ReplicationSim.tsx` |
| `CacheFlowSim` | Simulation | `src/components/simulation/CacheFlowSim.tsx` |
| `IndexLookupSim` | Simulation | `src/components/simulation/IndexLookupSim.tsx` |
| `PartitionQuerySim` | Simulation | `src/components/simulation/PartitionQuerySim.tsx` |
| `ACIDvsBASESim` | Simulation | `src/components/simulation/ACIDvsBASESim.tsx` |

> All diagrams reuse existing node types (`ClientNode`, `ServiceNode`, `DatabaseNode`, `LoadBalancerNode`, `LaneNode`) + `AnimatedEdge`. Only **1 new node type** (`CacheNode`). **5 new simulations** ensure every topic meets the "Interactive" and "Self-Explanatory" quality bar.

---

## Verification Plan (Manual Only)

- [ ] All 7 topics render with correct 12-section structure
- [ ] All React Flow diagrams use existing node types (no custom nodes except `CacheNode`)
- [ ] Tradeoffs, Q&A, and Summaries are all within 4-6 point range
- [ ] `CacheFlowSim` shows cache hit (green) / miss (red → DB → populate) with TTL slider
- [ ] `ReplicationSim` shows sync vs async modes + failover promotion
- [ ] `IndexLookupSim` shows B-Tree traversal (3 steps) vs Full Scan (847K steps) race
- [ ] `PartitionQuerySim` dynamically highlights selected partition and dims the rest
- [ ] `ACIDvsBASESim` shows locking (ACID) vs immediate-write-with-lag (BASE)
- [ ] Lane-based diagrams (Sharding, SQL/NoSQL, ACID/BASE) show clear before/after or side-by-side
- [ ] Cross-category Related Topics links work bidirectionally
- [ ] Homepage topic tree shows all new topics in correct categories
