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
  },
  "api-gateway": {
    id: "api-gateway",
    nodes: [
      { id: "internet", type: "client", position: { x: 50, y: 125 }, data: { label: "Internet", sublabel: "Public Traffic", status: "healthy" } },
      { id: "gateway", type: "lb", position: { x: 350, y: 125 }, data: { label: "API Gateway", sublabel: "Rate Limiting Hub", status: "healthy" } },
      { id: "service1", type: "service", position: { x: 650, y: 0 }, data: { label: "Order Service", status: "healthy" } },
      { id: "service2", type: "service", position: { x: 650, y: 125 }, data: { label: "User Service", status: "healthy" } },
      { id: "service3", type: "service", position: { x: 650, y: 250 }, data: { label: "Auth Service", status: "healthy" } },
    ],
    edges: [
      { ...defaultEdge("e-int-gw", "internet", "gateway", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-gw-s1", "gateway", "service1", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-gw-s2", "gateway", "service2", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-gw-s3", "gateway", "service3", true), sourceHandle: "right", targetHandle: "left" },
    ]
  },
  "scaling-basics": {
    id: "scaling-basics",
    nodes: [
      { id: "v-server", type: "service", position: { x: 50, y: 125 }, data: { label: "Monolithic Server", sublabel: "Scale Up Target", status: "healthy" } },
      
      { id: "h-lb", type: "lb", position: { x: 450, y: 125 }, data: { label: "Load Balancer", sublabel: "Scale Out Entry", status: "healthy" } },
      
      { id: "h-s1", type: "service", position: { x: 750, y: 0 }, data: { label: "Node A", status: "healthy" } },
      { id: "h-s2", type: "service", position: { x: 750, y: 125 }, data: { label: "Node B", status: "healthy" } },
      { id: "h-s3", type: "service", position: { x: 750, y: 250 }, data: { label: "Node C", status: "healthy" } },
    ],
    edges: [
      { ...defaultEdge("e-h-lb-s1", "h-lb", "h-s1", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-h-lb-s2", "h-lb", "h-s2", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-h-lb-s3", "h-lb", "h-s3", true), sourceHandle: "right", targetHandle: "left" },
    ]
  }
};
