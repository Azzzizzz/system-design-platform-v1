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
import { LaneNode } from "./nodes/LaneNode";
import { AnimatedEdge } from "./edges/AnimatedEdge";
import { diagramConfigs } from "../../data/diagramConfigs";

const nodeTypes: NodeTypes = {
  service: ServiceNode,
  client: ClientNode,
  lb: LoadBalancerNode,
  database: DatabaseNode,
  lane: LaneNode,
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
    <div className="w-full h-[550px] border border-white/5 rounded-2xl overflow-hidden glass-panel relative my-12 bg-[#050505]/40 shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.5}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        attributionPosition="bottom-left"
      >
        <Background gap={20} size={1} color="rgba(112, 93, 232, 0.1)" />
        <Controls 
          showInteractive={false} 
          position="bottom-right"
          className="!m-6"
        />
      </ReactFlow>
      
      {/* Zone Indicators */}
      <div className="absolute bottom-6 left-6 flex gap-6 z-10 pointer-events-none opacity-40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Client Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Network Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Infrastructure</span>
        </div>
      </div>

      <div className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1.5 flex items-center gap-2.5 rounded-lg border border-primary/20 backdrop-blur-xl pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(112,93,232,0.8)]" />
        Live Architecture
      </div>
    </div>
  );
}
