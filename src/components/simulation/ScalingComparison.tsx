import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Server, AlertTriangle, Users, ShieldCheck, Network, GitMerge } from "lucide-react";
import { 
  ReactFlow, 
  Handle, 
  Position, 
  getBezierPath, 
  BaseEdge, 
  EdgeLabelRenderer,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow
} from "@xyflow/react";
import type { EdgeProps, NodeProps, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Custom Constants & Tiers ---

interface SpecTier {
  name: string;
  cpu: string;
  ram: string;
  cost: string;
  label: string;
  rps: string;
}

const CLOUD_SPECS: SpecTier[] = [
  { name: "t3.medium", cpu: "2 vCPU", ram: "4GB", cost: "$", label: "Starter", rps: "250" },
  { name: "m5.2xlarge", cpu: "8 vCPU", ram: "32GB", cost: "$$", label: "Growth", rps: "1k" },
  { name: "r5.8xlarge", cpu: "32 vCPU", ram: "128GB", cost: "$$$", label: "Scale", rps: "5k" },
  { name: "r5.24xlarge", cpu: "96 vCPU", ram: "384GB", cost: "$$$$", label: "Enterprise", rps: "20k" },
  { name: "CEILING", cpu: "128 (MAX)", ram: "512 (MAX)", cost: "$$$$$", label: "Limit", rps: "50k+" },
];

// --- Node Data Types ---

interface ServerData extends Record<string, unknown> {
  id: number;
  label: string;
  utilization: number;
  isMonolith?: boolean;
}

// --- Custom Nodes ---

const VisitorsNode = () => (
  <div className="flex flex-col items-center gap-2">
    <motion.div 
      animate={{ scale: [1, 1.1, 1] }} 
      transition={{ repeat: Infinity, duration: 2 }}
      className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(112,93,232,0.2)] backdrop-blur-md"
    >
      <Users className="w-6 h-6 text-primary" />
    </motion.div>
    <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Visitors</div>
    <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const GatewayNode = () => (
  <div className="flex flex-col items-center gap-2">
     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
        <GitMerge className="w-6 h-6 text-primary" />
     </div>
     <div className="text-[8px] font-black text-primary/60 uppercase tracking-widest whitespace-nowrap">Load Balancer</div>
     <Handle type="target" position={Position.Left} className="opacity-0" />
     <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const ServerNode = ({ data }: NodeProps<Node<ServerData>>) => (
  <div className="relative group">
    <motion.div
      animate={data.utilization >= 100 ? {
        borderColor: "rgba(239, 68, 68, 0.5)",
        boxShadow: "0 0 40px rgba(239,68,68,0.2)",
        x: [0, -1, 1, -1, 0]
      } : {
        borderColor: "rgba(112, 93, 232, 0.3)",
        boxShadow: "0 0 20px rgba(112,93,232,0.1)",
        x: 0
      }}
      transition={data.utilization >= 100 ? { x: { repeat: Infinity, duration: 0.1 } } : {}}
      className={`${data.isMonolith ? 'w-44 h-52' : 'w-24 h-28'} rounded-2xl border-2 bg-white/[0.03] backdrop-blur-xl flex flex-col items-center justify-center p-4 relative overflow-hidden`}
    >
      <Server className={`${data.isMonolith ? 'w-12 h-12 mb-3' : 'w-6 h-6 mb-2'} ${data.utilization >= 100 ? 'text-red-500' : 'text-primary'}`} />
      
      <div className="w-full space-y-1.5">
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${data.utilization}%` }} className={`h-full ${data.utilization >= 100 ? 'bg-red-500' : 'bg-primary'}`} />
         </div>
         <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
            <span>Utilization</span>
            <span className={data.utilization >= 100 ? 'text-red-500' : ''}>{data.utilization}%</span>
         </div>
      </div>

      {data.utilization >= 100 && (
        <div className="absolute inset-0 bg-red-900/20 flex flex-col items-center justify-center backdrop-blur-[2px]">
           <AlertTriangle className="text-red-500 w-8 h-8 mb-1" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest bg-red-500 px-2 rounded">OVERLOAD</span>
        </div>
      )}
    </motion.div>
    
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">
      {data.label}
    </div>

    {data.isMonolith && (
      <div className="absolute -top-3 -right-3 px-3 py-1 bg-red-500 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-xl z-20">SPOF</div>
    )}
    
    <Handle type="target" position={Position.Left} className="opacity-0" />
  </div>
);

// --- Custom Edge with Particles ---

const TrafficEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: 'rgba(112, 93, 232, 0.2)', strokeWidth: 2, strokeDasharray: '6,4' }} />
      <EdgeLabelRenderer>
         <ParticleSystem edgePath={edgePath} scale={data?.scale as number ?? 1} />
      </EdgeLabelRenderer>
    </>
  );
};

const ParticleSystem = ({ edgePath, scale }: { edgePath: string; scale: number }) => {
  const [particles, setParticles] = useState<{ id: number; key: number }[]>([]);

  useEffect(() => {
    // Dynamic interval: Starter (1000ms) down to Limit (~200ms)
    const intervalTime = Math.max(200, 600 - (scale - 1) * 200);
    const interval = setInterval(() => {
      setParticles((prev) => [...prev.slice(-12), { id: Math.random(), key: Date.now() }]);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [scale]);

  return (
    <>
      <svg style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', top: 0, left: 0 }}>
        <defs>
          <radialGradient id="particle-glow">
            <stop offset="0%" stopColor="#705DE8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {particles.map((p) => (
          <Particle key={p.key} path={edgePath} />
        ))}
      </svg>
    </>
  );
};

const Particle = ({ path }: { path: string }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let start: number;
    const duration = 2000;
    
    const animate = (time: number) => {
      if (!start) start = time;
      const progress = (time - start) / duration;
      
      if (progress < 1) {
        if (pathRef.current) {
          const point = pathRef.current.getPointAtLength(progress * pathRef.current.getTotalLength());
          setPos({ x: point.x, y: point.y });
          setVisible(true);
        }
        requestAnimationFrame(animate);
      } else {
        setVisible(false);
      }
    };
    
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  return (
    <>
       <path ref={pathRef} d={path} fill="none" style={{ display: 'none' }} />
       {visible && (
         <g transform={`translate(${pos.x}, ${pos.y})`}>
           <circle r="3" fill="#705DE8" className="shadow-lg" />
           <circle r="6" fill="url(#particle-glow)" opacity="0.4" />
         </g>
       )}
    </>
  );
};

// --- Main Component ---

const nodeTypes = {
  visitors: VisitorsNode,
  gateway: GatewayNode,
  server: ServerNode,
};

const edgeTypes = {
  traffic: TrafficEdge,
};

export function ScalingComparison() {
  return (
    <ReactFlowProvider>
      <ScalingComparisonInner />
    </ReactFlowProvider>
  );
}

function ScalingComparisonInner() {
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [scale, setScale] = useState(1);
  const { fitView } = useReactFlow();

  const currentSpec = CLOUD_SPECS[scale - 1];

  const graphData = useMemo(() => {
    const nodes: Node<any>[] = [
      {
        id: 'visitors',
        type: 'visitors',
        position: { x: 50, y: 300 },
        data: {},
      }
    ];

    const edges: Edge[] = [];

    if (mode === "vertical") {
      nodes.push({
        id: 'server-monolith',
        type: 'server',
        position: { x: 450, y: 220 },
        data: { id: 1, label: 'Monolith Server', utilization: scale * 20, isMonolith: true },
      } as Node<ServerData>);
      edges.push({
        id: 'e-v-1',
        source: 'visitors',
        target: 'server-monolith',
        type: 'traffic',
        data: { scale }
      });
    } else {
      nodes.push({
        id: 'gateway',
        type: 'gateway',
        position: { x: 250, y: 305 },
        data: {},
      });
      edges.push({
        id: 'e-h-source',
        source: 'visitors',
        target: 'gateway',
        type: 'traffic',
        data: { scale }
      });

      const numNodes = scale * 3 - 2;
      const verticalSpacing = 140;
      const startY = 300 - ((numNodes - 1) * verticalSpacing) / 2;

      for (let i = 0; i < numNodes; i++) {
        const nodeId = `server-${i}`;
        nodes.push({
          id: nodeId,
          type: 'server',
          position: { x: 550, y: startY + i * verticalSpacing },
          data: { id: i + 1, label: `Active Node ${i + 1}`, utilization: 25 },
        } as Node<ServerData>);
        edges.push({
          id: `e-h-${i}`,
          source: 'gateway',
          target: nodeId,
          type: 'traffic',
          data: { scale }
        });
      }
    }

    return { nodes, edges };
  }, [mode, scale]);

  useEffect(() => {
    fitView({ duration: 400, padding: 0.2 });
  }, [graphData.nodes.length, mode, scale, fitView]);

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 my-8 overflow-hidden relative min-h-[900px] flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
      
      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Network className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Architecture Lab</h3>
          </div>
          <p className="text-white/40 text-sm max-w-sm">
            Learn the core difference between <span className="text-primary italic">Scaling Up</span> vs <span className="text-primary italic">Scaling Out</span>.
          </p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => { setMode("vertical"); setScale(1); }}
            className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              mode === "vertical" ? "bg-primary text-white shadow-xl shadow-primary/30" : "text-white/40 hover:text-white"
            }`}
          >
            <span>Add More Power</span>
            <span className="text-[9px] opacity-60 uppercase tracking-tighter">(Vertical)</span>
            {mode === "vertical" && <motion.div layoutId="tab-active" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
          </button>
          <button
            onClick={() => { setMode("horizontal"); setScale(1); }}
            className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              mode === "horizontal" ? "bg-primary text-white shadow-xl shadow-primary/30" : "text-white/40 hover:text-white"
            }`}
          >
            <span>Add More Nodes</span>
            <span className="text-[9px] opacity-60 uppercase tracking-tighter">(Horizontal)</span>
            {mode === "horizontal" && <motion.div layoutId="tab-active" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
          </button>
        </div>
      </div>

      {/* Main Simulation Area: React Flow */}
      <div className="w-full h-[600px] bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-inner">
        <ReactFlow
          nodes={graphData.nodes}
          edges={graphData.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          style={{ width: '100%', height: '100%' }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={false}
          nodesDraggable={false}
          elementsSelectable={false}
          preventScrolling={false}
        >
          <Background color="rgba(112, 93, 232, 0.05)" gap={20} />
          <Controls 
            showInteractive={false} 
            className="bg-black/20 border-white/5! rounded-lg overflow-hidden backdrop-blur-md"
          />
        </ReactFlow>
        
        {mode === "horizontal" && scale >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.15)] backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Elastic High Availability</span>
          </motion.div>
        )}
      </div>

      {/* Control Footer */}
      <div className="relative z-10 mt-auto pt-10 space-y-8">
        <div className="flex justify-between items-end px-4">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block leading-none">Throughput Capacity (RPS)</span>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <span className="text-4xl font-bold text-white tracking-tighter">{currentSpec.rps}</span>
                   <span className="text-white/40 text-sm font-semibold uppercase tracking-wider">RPS</span>
                 </div>
                 <span className="text-[10px] text-primary font-black py-0.5 px-3 bg-primary/10 rounded-md border border-primary/20 uppercase tracking-[0.2em]">{currentSpec.label}</span>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Monthly Infrastructure Cost</span>
              <motion.span 
                key={currentSpec.cost}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-black text-primary font-mono tracking-tighter"
              >
                {currentSpec.cost}
              </motion.span>
           </div>
        </div>

        <div className="px-4 pb-8">
           <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              value={scale} 
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-full accent-primary appearance-none cursor-pointer hover:bg-white/10 transition-colors"
           />
           <div className="flex justify-between mt-5 px-1">
              {CLOUD_SPECS.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full transition-colors ${scale >= i + 1 ? 'bg-primary' : 'bg-white/10'}`} />
                   <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${scale === i + 1 ? 'text-primary' : 'text-white/20'}`}>
                      {s.label}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
