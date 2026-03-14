import type { Node, Edge } from "reactflow";

// Custom node data types
export interface BaseNodeData {
  label: string;
  sublabel?: string;
  icon?: string;
  status?: "healthy" | "degraded" | "down";
  highlighted?: boolean;
}

export interface ServiceNodeData extends BaseNodeData {
  replicaCount?: number;
}

export interface DatabaseNodeData extends BaseNodeData {
  dbType?: "sql" | "nosql" | "cache";
  isPrimary?: boolean;
}

// Map of config IDs to their specific diagram layouts
export interface DiagramConfig {
  id: string;
  nodes: Node[];
  edges: Edge[];
}
