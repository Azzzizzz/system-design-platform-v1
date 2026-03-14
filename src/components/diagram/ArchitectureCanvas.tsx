import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState,
  useEdgesState,
} from "reactflow";
import type { EdgeTypes, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import "../../styles/diagram.css";

import { ServiceNode } from "./nodes/ServiceNode";
import { ClientNode } from "./nodes/ClientNode";
import { LoadBalancerNode } from "./nodes/LoadBalancerNode";
import { DatabaseNode } from "./nodes/DatabaseNode";
import { AnimatedEdge } from "./edges/AnimatedEdge";
import { diagramConfigs } from "../../data/diagramConfigs";

const nodeTypes: NodeTypes = {
  service: ServiceNode,
  client: ClientNode,
  lb: LoadBalancerNode,
  database: DatabaseNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

export function ArchitectureCanvas({ configId }: { configId: string }) {
  const config = diagramConfigs[configId];
  
  const [nodes, , onNodesChange] = useNodesState(config?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(config?.edges || []);

  if (!config) {
    return (
      <div className="w-full h-96 flex items-center justify-center border border-dashed border-red-500/20 bg-red-500/5 rounded-xl text-red-400">
        Diagram configuration "{configId}" not found.
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden glass-panel relative my-10">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background gap={16} size={1} color="rgba(255,255,255,0.15)" />
        <Controls 
          showInteractive={false} 
        />
        {/*
        <MiniMap 
          nodeColor="#ffffff10" 
          maskColor="#00000080" 
          className="!bg-[#0A0A0A] !border-white/10" 
        />
        */}
      </ReactFlow>
      <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest text-primary/70 bg-primary/10 px-2 py-1 flex items-center gap-2 rounded border border-primary/20 backdrop-blur-md pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Live Architecture
      </div>
    </div>
  );
}
