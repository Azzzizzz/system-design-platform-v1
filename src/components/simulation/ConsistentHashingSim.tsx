import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, GitCommit, Plus, Minus, Info } from 'lucide-react';

interface Node {
  id: number;
  angle: number; // 0 to 360
  name: string;
}

interface Key {
  id: string;
  angle: number;
  targetNodeId: number;
}

export default function ConsistentHashingSim() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, angle: 45, name: 'Server A' },
    { id: 2, angle: 165, name: 'Server B' },
    { id: 3, angle: 285, name: 'Server C' },
  ]);
  const [keys, setKeys] = useState<Key[]>([]);

  // Find the next node clockwise for a given angle
  const findTargetNode = (angle: number, currentNodes: Node[]) => {
    if (currentNodes.length === 0) return -1;
    const sortedNodes = [...currentNodes].sort((a, b) => a.angle - b.angle);
    const target = sortedNodes.find(n => n.angle >= angle);
    return target ? target.id : sortedNodes[0].id; // Wrap around to the first node
  };

  const addNode = () => {
    if (nodes.length >= 8) return;
    const newId = Math.max(0, ...nodes.map(n => n.id)) + 1;
    const newAngle = Math.floor(Math.random() * 360);
    const newNodes = [...nodes, { id: newId, angle: newAngle, name: `Server ${String.fromCharCode(64 + newId)}` }];
    setNodes(newNodes);
    
    // Recalculate key mappings for visual migration effect
    setKeys(prev => prev.map(k => ({
      ...k,
      targetNodeId: findTargetNode(k.angle, newNodes)
    })));
  };

  const removeNode = (id: number) => {
    if (nodes.length <= 1) return;
    const newNodes = nodes.filter(n => n.id !== id);
    setNodes(newNodes);
    
    // Recalculate key mappings
    setKeys(prev => prev.map(k => ({
      ...k,
      targetNodeId: findTargetNode(k.angle, newNodes)
    })));
  };

  const spawnKey = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const angle = Math.floor(Math.random() * 360);
    const targetNodeId = findTargetNode(angle, nodes);
    const newKey = { id, angle, targetNodeId };
    setKeys(prev => [...prev.slice(-15), newKey]);
  };

  // Auto-spawn keys
  useEffect(() => {
    const timer = setInterval(spawnKey, 2000);
    return () => clearInterval(timer);
  }, [nodes]);

  const centerX = 200;
  const centerY = 200;
  const radius = 150;

  const getCoordinates = (angle: number, r: number = radius) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad)
    };
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden relative group my-8">
      {/* Header & Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Hash Ring Simulation
          </h3>
          <p className="text-sm text-white/40 font-mono mt-1">
            Consistent Hashing: Minimal movement on scale
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={addNode}
            disabled={nodes.length >= 8}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-30"
          >
            <Plus className="w-3 h-3" /> Add Node
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center py-8">
        {/* The SVG Hash Ring */}
        <div className="relative w-[400px] h-[400px]">
          <svg width="400" height="400" className="drop-shadow-[0_0_30px_rgba(112,93,232,0.15)] overflow-visible">
            {/* Main Ring Orbit */}
            <circle 
              cx={centerX} cy={centerY} r={radius} 
              fill="none" 
              stroke="rgba(112,93,232,0.1)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <circle 
              cx={centerX} cy={centerY} r={radius} 
              fill="none" 
              stroke="url(#ring-gradient)" 
              strokeWidth="2" 
              className="opacity-20"
            />
            
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#705de8" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>

            {/* Keys/Requests travelling on the ring */}
            <AnimatePresence>
              {keys.map(key => {
                const startPos = getCoordinates(key.angle);
                const targetNode = nodes.find(n => n.id === key.targetNodeId);
                const endPos = targetNode ? getCoordinates(targetNode.angle) : startPos;

                return (
                  <motion.circle
                    key={key.id}
                    r="3"
                    fill="#705de8"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                    }}
                    transition={{ duration: 2.5, times: [0, 0.1, 0.9, 1] }}
                  >
                    <animateMotion
                      dur="2.5s"
                      repeatCount="0"
                      path={`M ${startPos.x} ${startPos.y} A ${radius} ${radius} 0 ${
                        (key.angle > (targetNode?.angle || 0) ? 1 : 0)
                      } 1 ${endPos.x} ${endPos.y}`}
                    />
                  </motion.circle>
                );
              })}
            </AnimatePresence>

            {/* Nodes on the Ring */}
            {nodes.map(node => {
              const { x, y } = getCoordinates(node.angle);
              return (
                <g key={node.id}>
                  <motion.circle
                    layoutId={`node-bg-${node.id}`}
                    cx={x} cy={y} r="18"
                    className="fill-black/80 stroke-primary/40"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                  <foreignObject x={x - 10} y={y - 10} width="20" height="20">
                    <div className="w-full h-full flex items-center justify-center text-primary">
                      <Server className="w-3 h-3" />
                    </div>
                  </foreignObject>
                  
                  {/* Remove Node Handle */}
                  <motion.foreignObject 
                    x={x + 12} y={y - 12} width="16" height="16"
                    className="cursor-pointer"
                    onClick={() => removeNode(node.id)}
                  >
                    <div className="w-4 h-4 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center border border-red-500/30 hover:bg-red-500/40 transition-colors">
                      <Minus className="w-2 h-2" />
                    </div>
                  </motion.foreignObject>

                  {/* Label */}
                  <text 
                    x={x} y={y + 35} 
                    textAnchor="middle" 
                    className="text-[10px] font-mono fill-white/60 uppercase tracking-tighter"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Centered Stats Info */}
          <div className="absolute inset-0 flex flex-center pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold font-mono text-white/20">{nodes.length}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/10 font-bold">Active Nodes</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 max-w-sm space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
             <div className="flex items-center gap-2 text-primary/80">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">How it works</span>
             </div>
             <p className="text-xs text-white/50 leading-relaxed">
               Requests and nodes are mapped to the same 360° circle. A request is assigned to the 
               <span className="text-primary font-bold"> first server encountered</span> when moving clockwise on the ring.
             </p>
             <div className="pt-2 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                  <p className="text-[11px] text-white/40"><span className="text-white/60 font-semibold">Minimal Rehash:</span> Only the data between the new node and its predecessor needs to be moved.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                  <p className="text-[11px] text-white/40"><span className="text-white/60 font-semibold">Decoupled:</span> Adding/removing a server doesn't break every single user session (like Modulo hashing would).</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
            <GitCommit className="w-4 h-4 text-orange-500/50" />
            <span className="text-[10px] font-mono text-orange-500/70">Observe how key paths change instantly when nodes move.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
