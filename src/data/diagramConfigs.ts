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
      // --- Lane Groups (Containers) ---
      { 
        id: "lane-v", 
        type: "lane", 
        position: { x: 0, y: 0 }, 
        style: { width: 550, height: 230 },
        data: { label: "Approach A", sublabel: "Vertical Scaling", type: "vertical" },
        draggable: false, selectable: false,
      },
      { 
        id: "lane-h", 
        type: "lane", 
        position: { x: 0, y: 260 }, 
        style: { width: 920, height: 320 },
        data: { label: "Approach B", sublabel: "Horizontal Scaling", type: "horizontal" },
        draggable: false, selectable: false,
      },

      // --- Top Row: Vertical Scaling (Monolith) ---
      { id: "v-visitors", type: "client", position: { x: 60, y: 70 }, parentId: "lane-v", extent: "parent", data: { label: "Public Visitors", sublabel: "Internet Traffic", status: "healthy" } },
      { id: "v-server", type: "service", position: { x: 350, y: 70 }, parentId: "lane-v", extent: "parent", data: { label: "Monolithic Server", sublabel: "Scale Up Target", status: "healthy" } },
      
      // --- Bottom Row: Horizontal Scaling (Fleet) ---
      { id: "h-visitors", type: "client", position: { x: 60, y: 110 }, parentId: "lane-h", extent: "parent", data: { label: "Public Visitors", sublabel: "Internet Traffic", status: "healthy" } },
      { id: "h-lb", type: "lb", position: { x: 350, y: 110 }, parentId: "lane-h", extent: "parent", data: { label: "Load Balancer", sublabel: "Traffic Dispatcher", status: "healthy" } },
      { id: "h-s1", type: "service", position: { x: 700, y: 20 }, parentId: "lane-h", extent: "parent", data: { label: "Node A", sublabel: "Processing Unit", status: "healthy" } },
      { id: "h-s2", type: "service", position: { x: 700, y: 125 }, parentId: "lane-h", extent: "parent", data: { label: "Node B", sublabel: "Processing Unit", status: "healthy" } },
      { id: "h-s3", type: "service", position: { x: 700, y: 230 }, parentId: "lane-h", extent: "parent", data: { label: "Node C", sublabel: "Processing Unit", status: "healthy" } },
    ],
    edges: [
      // Vertical Path
      { ...defaultEdge("e-v-path", "v-visitors", "v-server", true), sourceHandle: "right", targetHandle: "left" },
      
      // Horizontal Path
      { ...defaultEdge("e-h-entry", "h-visitors", "h-lb", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-h-lb-s1", "h-lb", "h-s1", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-h-lb-s2", "h-lb", "h-s2", true), sourceHandle: "right", targetHandle: "left" },
      { ...defaultEdge("e-h-lb-s3", "h-lb", "h-s3", true), sourceHandle: "right", targetHandle: "left" },
    ]
  }
};
