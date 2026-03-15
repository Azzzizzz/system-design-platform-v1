import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Cpu, Layers, AlertTriangle, Users, ShieldCheck, Network, GitMerge } from "lucide-react";

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

export function ScalingComparison() {
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [scale, setScale] = useState(1);
  const [traffic, setTraffic] = useState<{ id: number; nodeIdx?: number }[]>([]);

  // Generate traffic particles
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const numNodes = mode === "horizontal" ? scale * 3 - 2 : 1;
      const nodeIdx = Math.floor(Math.random() * numNodes);
      
      setTraffic((prev) => [...prev.slice(-20), { id, nodeIdx }]);
    }, 400 / scale);
    return () => clearInterval(interval);
  }, [scale, mode]);

  const currentSpec = CLOUD_SPECS[scale - 1];

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 my-8 overflow-hidden relative min-h-[600px] flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
      
      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
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

      {/* Main Simulation Area: Left to Right */}
      <div className="flex-1 flex items-center justify-between gap-4 relative py-12 px-4 bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
        
        {/* LEFT: TRAFFIC SOURCE */}
        <div className="flex flex-col items-center gap-4 z-20 min-w-[80px]">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(112,93,232,0.2)]"
            >
              <Users className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
              Visitors
            </div>
          </div>
        </div>

        {/* MIDDLE: LOAD BALANCER / GATEWAY */}
        <div className="relative flex flex-col items-center z-20 min-w-[100px]">
          <AnimatePresence mode="wait">
             {mode === "horizontal" && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex flex-col items-center gap-3"
               >
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:border-primary transition-colors">
                    <GitMerge className="w-6 h-6 text-primary/60 group-hover:text-primary" />
                 </div>
                 <div className="text-[8px] font-black text-primary/60 uppercase tracking-widest whitespace-nowrap">Load Balancer</div>
               </motion.div>
             )}
          </AnimatePresence>
          
          {/* SVG Connection Lines */}
          <div className="absolute inset-x-0 h-full w-[400px] -translate-x-1/2 pointer-events-none overflow-visible">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(112, 93, 232, 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Source -> Mid */}
              <line x1="12%" y1="50%" x2="50%" y2="50%" stroke="rgba(112, 93, 232, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Mid -> Destination */}
              {mode === "vertical" ? (
                <line x1="50%" y1="50%" x2="88%" y2="50%" stroke="url(#flow-gradient)" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
              ) : (
                <>
                  {Array.from({ length: scale * 3 - 2 }).map((_, i) => {
                    const numNodes = scale * 3 - 2;
                    const targetY = (i / (numNodes - 1 || 1)) * 100;
                    return (
                      <motion.path
                        key={`line-${i}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        d={`M 50% 50% C 70% 50%, 70% ${targetY}%, 88% ${targetY}%`}
                        stroke="rgba(112, 93, 232, 0.15)"
                        strokeWidth="1"
                        fill="none"
                      />
                    );
                  })}
                </>
              )}
            </svg>

            {/* Traffic Particles */}
            <AnimatePresence>
              {traffic.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ left: "12%", top: "50%", opacity: 1, scale: 0.5 }}
                  animate={mode === 'vertical' ? {
                    left: ["12%", "50%", "88%"],
                    top: "50%",
                    opacity: [1, 1, 0]
                  } : {
                    left: ["12%", "50%", "88%"],
                    top: ["50%", "50%", `${(req.nodeIdx! / (scale * 3 - 2 - 1 || 1)) * 100}%`],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ duration: 1.2, ease: "linear" }}
                  className="absolute w-1.5 h-1.5 -ml-0.5 -mt-0.5 rounded-full bg-primary shadow-[0_0_12px_rgba(112,93,232,1)] z-30 pointer-events-none"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: DESTINATION */}
        <div className="flex flex-col items-center justify-center min-w-[320px] gap-4 z-20">
           <AnimatePresence mode="wait">
             {mode === "vertical" ? (
               <motion.div
                 key="vertical-target"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex flex-col items-center gap-6"
               >
                 <div className="relative">
                   <motion.div
                     animate={scale === 5 ? {
                       borderColor: "rgba(239, 68, 68, 0.5)",
                       boxShadow: "0 0 40px rgba(239,68,68,0.2)",
                       x: [0, -1, 1, -1, 0]
                     } : {
                       borderColor: "rgba(112, 93, 232, 0.3)",
                       boxShadow: "0 0 20px rgba(112,93,232,0.1)",
                       x: 0
                     }}
                     transition={scale === 5 ? { x: { repeat: Infinity, duration: 0.1 } } : {}}
                     className="w-40 h-48 rounded-3xl border-2 bg-white/[0.03] backdrop-blur-xl flex flex-col items-center justify-center p-6 relative overflow-hidden"
                   >
                     <Server className={`w-12 h-12 mb-4 ${scale === 5 ? 'text-red-500' : 'text-primary'}`} />
                     
                     <div className="w-full space-y-2">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div animate={{ width: `${scale * 20}%` }} className={`h-full ${scale === 5 ? 'bg-red-500' : 'bg-primary'}`} />
                        </div>
                        <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                           <span>Utilization</span>
                           <span className={scale === 5 ? 'text-red-500' : ''}>{scale * 20}%</span>
                        </div>
                     </div>

                     {scale === 5 && (
                       <div className="absolute inset-0 bg-red-900/10 flex flex-col items-center justify-center backdrop-blur-[2px]">
                          <AlertTriangle className="text-red-500 w-8 h-8 mb-1" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest bg-red-500 px-1.5 rounded">Hardware Limit</span>
                       </div>
                     )}
                   </motion.div>
                   
                   <div className="absolute -top-3 -right-3 px-2.5 py-1 bg-red-500 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-xl">SPOF</div>
                 </div>

                 <div className="grid grid-cols-2 gap-2 w-full max-w-[180px]">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                       <Cpu className="w-3 h-3 text-white/10 mb-1" />
                       <span className="text-[10px] font-mono text-white/60">{currentSpec.cpu}</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                       <Layers className="w-3 h-3 text-white/10 mb-1" />
                       <span className="text-[10px] font-mono text-white/60">{currentSpec.ram}</span>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div
                 key="horizontal-target"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[380px]"
               >
                 <AnimatePresence>
                   {Array.from({ length: scale * 3 - 2 }).map((_, i) => (
                     <motion.div
                       key={`node-${i}`}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0, opacity: 0 }}
                       className="w-16 h-20 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1.5 relative group hover:border-primary/40 transition-colors"
                     >
                       <Server className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
                       <div className="w-6 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500/40 w-[30%]" />
                       </div>
                       <span className="text-[7px] font-bold text-white/10 uppercase tracking-widest">Node {i+1}</span>
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 
                 {scale >= 3 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="absolute -top-10 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                   >
                     <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                     <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Elastic Resilience</span>
                   </motion.div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Control Footer */}
      <div className="relative z-10 mt-auto pt-10 space-y-6">
        <div className="flex justify-between items-end px-4">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block leading-none">Throughput Capacity (RPS)</span>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <span className="text-3xl font-bold text-white tracking-tighter">{currentSpec.rps}</span>
                   <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">RPS</span>
                 </div>
                 <span className="text-[10px] text-primary font-black py-0.5 px-2 bg-primary/10 rounded-md border border-primary/20 uppercase tracking-widest">{currentSpec.label}</span>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Relative Cost</span>
              <motion.span 
                key={currentSpec.cost}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-black text-primary font-mono tracking-tighter"
              >
                {currentSpec.cost}
              </motion.span>
           </div>
        </div>

        <div className="px-4 pb-6">
           <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              value={scale} 
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-full accent-primary appearance-none cursor-pointer hover:bg-white/10 transition-colors"
           />
           <div className="flex justify-between mt-4 px-1">
              {CLOUD_SPECS.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-1 h-1 rounded-full transition-colors ${scale >= i + 1 ? 'bg-primary' : 'bg-white/10'}`} />
                   <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${scale === i + 1 ? 'text-primary' : 'text-white/20'}`}>
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
