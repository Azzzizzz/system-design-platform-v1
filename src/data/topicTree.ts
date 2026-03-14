import type { Category } from "../types/topic";

export const topicTree: Category[] = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    icon: "BookOpen",
    topics: [
      { slug: "latency-throughput", label: "Latency vs Throughput", difficulty: "easy" },
      { slug: "cap-theorem", label: "CAP Theorem", difficulty: "medium" },
      { slug: "consistency-models", label: "Consistency Models", difficulty: "hard" },
      { slug: "load-balancers", label: "Load Balancers", difficulty: "medium" },
      { slug: "rate-limiting", label: "Rate Limiting", difficulty: "medium" },
    ],
  },
  {
    id: "scaling",
    label: "Scaling",
    icon: "TrendingUp",
    topics: [
      { slug: "horizontal-vs-vertical", label: "Horizontal vs Vertical", difficulty: "easy" },
      { slug: "database-sharding", label: "Database Sharding", difficulty: "hard" },
      { slug: "database-replication", label: "Database Replication", difficulty: "medium" },
      { slug: "caching-strategies", label: "Caching Strategies", difficulty: "medium" },
      { slug: "consistent-hashing", label: "Consistent Hashing", difficulty: "medium" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    icon: "Database",
    topics: [
      { slug: "indexing", label: "Indexing", difficulty: "medium" },
      { slug: "partitioning", label: "Partitioning", difficulty: "hard" },
      { slug: "sql-vs-nosql", label: "SQL vs NoSQL", difficulty: "easy" },
      { slug: "acid-base", label: "ACID & BASE", difficulty: "medium" },
    ],
  },
  {
    id: "messaging",
    label: "Messaging",
    icon: "MessageSquare",
    topics: [
      { slug: "kafka", label: "Apache Kafka", difficulty: "hard" },
      { slug: "rabbitmq", label: "RabbitMQ", difficulty: "medium" },
      { slug: "event-driven-architecture", label: "Event-Driven Architecture", difficulty: "medium" },
      { slug: "exactly-once-processing", label: "Exactly-Once Processing", difficulty: "hard" },
    ],
  },
  {
    id: "patterns",
    label: "Distributed Patterns",
    icon: "GitBranch",
    topics: [
      { slug: "circuit-breaker", label: "Circuit Breaker", difficulty: "medium" },
      { slug: "retry-pattern", label: "Retry Pattern", difficulty: "easy" },
      { slug: "saga-pattern", label: "Saga Pattern", difficulty: "hard" },
      { slug: "api-gateway", label: "API Gateway", difficulty: "medium" },
      { slug: "service-discovery", label: "Service Discovery", difficulty: "medium" },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    icon: "Briefcase",
    topics: [
      { slug: "url-shortener", label: "URL Shortener", difficulty: "medium" },
      { slug: "whatsapp", label: "WhatsApp", difficulty: "hard" },
      { slug: "uber", label: "Uber", difficulty: "hard" },
      { slug: "netflix", label: "Netflix", difficulty: "hard" },
      { slug: "youtube", label: "YouTube", difficulty: "hard" },
      { slug: "amazon", label: "Amazon", difficulty: "hard" },
    ],
  },
];
