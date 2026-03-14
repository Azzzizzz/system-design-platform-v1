import type { DiagramConfig } from "../types/diagram";
import { MarkerType } from "reactflow";

// Shared edge style mapping
const defaultEdge = (id: string, source: string, target: string, animated = true) => ({
  id,
  source,
  target,
  type: "animated",
  data: { active: animated },
  markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(255,255,255,0.2)" },
});

export const diagramConfigs: Record<string, DiagramConfig> = {
  "load-balancer-flow": {
    id: "load-balancer-flow",
    nodes: [
      { id: "client1", type: "client", position: { x: 50, y: 50 }, data: { label: "Client A", sublabel: "Mobile", status: "healthy" } },
      { id: "client2", type: "client", position: { x: 50, y: 150 }, data: { label: "Client B", sublabel: "Desktop", status: "healthy" } },
      { id: "client3", type: "client", position: { x: 50, y: 250 }, data: { label: "Client C", sublabel: "API", status: "healthy" } },
      
      { id: "lb", type: "lb", position: { x: 350, y: 125 }, data: { label: "Load Balancer", sublabel: "Nginx / ALB", status: "healthy" } },
      
      { id: "web1", type: "service", position: { x: 650, y: 0 }, data: { label: "Web Server 1", status: "healthy" } },
      { id: "web2", type: "service", position: { x: 650, y: 125 }, data: { label: "Web Server 2", status: "healthy" } },
      { id: "web3", type: "service", position: { x: 650, y: 250 }, data: { label: "Web Server 3", status: "down" } },
    ],
    edges: [
      { ...defaultEdge("e-c1-lb", "client1", "lb", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-c2-lb", "client2", "lb", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-c3-lb", "client3", "lb", true), sourceHandle: "right", targetHandle: "left" },
      
      { ...defaultEdge("e-lb-web1", "lb", "web1", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-lb-web2", "lb", "web2", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-lb-web3", "lb", "web3", false), sourceHandle: "right", targetHandle: "left" },
    ]
  }
};
