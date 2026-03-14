import { DiagramConfig } from "../../types/diagram";

export const loadBalancerDiagram: DiagramConfig = {
  id: "load-balancer-flow",
  nodes: [
    { id: "client",  type: "client",       label: "Client",         position: { x: 300, y: 0 } },
    { id: "lb",      type: "loadBalancer",  label: "Load Balancer",  position: { x: 300, y: 150 } },
    { id: "s1",      type: "service",       label: "Server 1",      position: { x: 100, y: 300 } },
    { id: "s2",      type: "service",       label: "Server 2",      position: { x: 300, y: 300 } },
    { id: "s3",      type: "service",       label: "Server 3",      position: { x: 500, y: 300 } },
    { id: "db",      type: "database",      label: "PostgreSQL",     position: { x: 300, y: 450 } },
  ],
  edges: [
    { source: "client", target: "lb",  type: "http",  label: "Request", animated: true },
    { source: "lb",     target: "s1",  type: "http",  label: "Route" },
    { source: "lb",     target: "s2",  type: "http",  label: "Route" },
    { source: "lb",     target: "s3",  type: "http",  label: "Route" },
    { source: "s1",     target: "db",  type: "http",  label: "Query" },
    { source: "s2",     target: "db",  type: "http",  label: "Query" },
    { source: "s3",     target: "db",  type: "http",  label: "Query" },
  ],
};
