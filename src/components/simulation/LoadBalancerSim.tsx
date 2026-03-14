import { useEffect, useState, useOptimistic, useTransition, useRef } from "react";
import { useSimulation } from "../../hooks/useSimulation";
import { SimulationControls } from "./SimulationControls";
import { Server, MonitorSmartphone, GitPullRequestDraft, Power, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNextTargetServer, calculateNewServerLoad } from "../../lib/simulation-logic";

export function LoadBalancerSim() {
  const { isPlaying, speed, tick, advanceTick } = useSimulation();
  const [algorithm, setAlgorithm] = useState<"round-robin" | "least-conn" | "ip-hash">("round-robin");
  const [isUpdating, startTransition] = useTransition();
  
  const [requests, setRequests] = useState<{ id: number; source: number; target: number; color: string }[]>([]);
  const [serverLoad, setServerLoad] = useState([0, 0, 0]);
  const [serverStatuses, setServerStatuses] = useState([true, true, true]);
  const [lastDecision, setLastDecision] = useState("Waiting for simulation to start...");

  const loadRef = useRef(serverLoad);
  useEffect(() => {
    loadRef.current = serverLoad;
  }, [serverLoad]);

  // React 19 useOptimistic for instant Interactive Failover feedback
  const [optimisticStatuses, addOptimisticStatus] = useOptimistic(
    serverStatuses,
    (state, { index, status }: { index: number; status: boolean }) => {
      const next = [...state];
      next[index] = status;
      return next;
    }
  );

  // Simulated Async Health Check Update
  const toggleServerHealth = async (index: number) => {
    const newStatus = !serverStatuses[index];
    
    // Instant UI reaction via Optimistic Hook
    addOptimisticStatus({ index, status: newStatus });
    
    startTransition(async () => {
      // Simulate architecture latency/health check time (800ms)
      await new Promise(resolve => setTimeout(resolve, 800));
      setServerStatuses(prev => {
        const next = [...prev];
        next[index] = newStatus;
        return next;
      });
      setLastDecision(`Health Check: Server ${index + 1} is now marked as ${newStatus ? 'Healthy' : 'Down'}.`);
    });
  };

  // Handle local reset
  const resetLocalState = () => {
    setRequests([]);
    setServerLoad([0, 0, 0]);
    setLastDecision("Simulation reset.");
  };

  useEffect(() => {
    if (tick === 0 && !isPlaying) {
      resetLocalState();
    }
  }, [tick, isPlaying]);

  // Handle simulation loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      const currentTick = useSimulation.getState().tick;
      const nextTick = currentTick + 1;
      const clientColors = ['#f43f5e', '#3b82f6', '#10b981']; 
      const clientIdx = Math.floor(Math.random() * 3);

      const { targetIdx, reason, isDropped } = getNextTargetServer({
        algorithm,
        tick: nextTick,
        serverLoad: loadRef.current,
        clientIdx,
        serverStatuses: optimisticStatuses
      });

      setLastDecision(reason);
      advanceTick();
      const newReqId = Date.now();
      
      if (!isDropped) {
        setRequests(prev => [...prev.slice(-10), { 
          id: newReqId, 
          source: clientIdx, 
          target: targetIdx, 
          color: clientColors[clientIdx] 
        }]);
      }
      
      // Delay server load update to match animation impact (roughly 2s)
      setTimeout(() => {
        setServerLoad(prev => calculateNewServerLoad(prev, targetIdx, isDropped));
      }, 2000 / speed);

    }, 2400 / speed);

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, algorithm, advanceTick, optimisticStatuses]);

  // Helper to generate curved path string for SVG (using coordinate system 0-100)
  const getPath = (source: number, target: number) => {
    const yArr = [15, 50, 85];
    const sY = yArr[source];
    const tY = yArr[target];
    // Pure horizontal flow avoid loops: CP1 at 20%, CP2 at 40%, Center at 50%, CP3 at 60%, CP4 at 80%
    return `M 0,${sY} C 25,${sY} 35,50 50,50 C 65,50 75,${tY} 100,${tY}`;
  };

  return (
    <div className="w-full border border-white/10 bg-[#0A0A0A]/50 rounded-xl overflow-hidden glass-panel my-8">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-2 mb-4 md:mb-0">
          {(["round-robin", "least-conn", "ip-hash"] as const).map(algo => (
            <button
              key={algo}
              id={`algo-${algo}`}
              onClick={() => {
                startTransition(() => {
                   setAlgorithm(algo);
                   resetLocalState();
                });
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${algorithm === algo ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/80'} ${isUpdating ? 'opacity-50 grayscale cursor-wait' : ''}`}
            >
              {algo.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <SimulationControls />
      </div>

      <div className="relative h-96 p-8 py-12 flex items-center justify-between overflow-hidden">
        {/* Clients */}
        <div className="flex flex-col justify-between h-full z-20 py-4">
          {[
            { name: 'Client A', color: 'rose', lucideColor: 'text-rose-400' },
            { name: 'Client B', color: 'blue', lucideColor: 'text-blue-400' },
            { name: 'Client C', color: 'emerald', lucideColor: 'text-emerald-400' }
          ].map((client, i) => (
            <div key={i} className="node-standard !min-w-0 !p-3 !rounded-full flex items-center gap-3">
              <div className="icon-box !p-1.5 bg-white/5 border-white/10">
                <MonitorSmartphone className={`w-4 h-4 ${client.lucideColor}`} />
              </div>
              <span className={`text-[11px] font-mono uppercase tracking-tighter ${client.lucideColor} font-semibold`}>{client.name}</span>
            </div>
          ))}
        </div>

        {/* Paths and Packets - Centered Container */}
        <div className="absolute inset-x-24 inset-y-12 pointer-events-none z-10">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Base Paths */}
            {[0, 1, 2].map(s => [0, 1, 2].map(t => (
               <path key={`path-${s}-${t}`} d={getPath(s, t)} fill="none" stroke="rgba(112,93,232,0.08)" strokeWidth="0.5" />
            )))}

            {/* Moving Packets */}
            <AnimatePresence>
              {requests.map((req) => (
                <motion.circle
                  key={req.id}
                  r="1.2"
                  fill={req.color}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    offsetDistance: ["0%", "100%"]
                  }}
                  transition={{ 
                    duration: 2.2 / speed, 
                    ease: "easeInOut",
                    times: [0, 0.1, 0.9, 1]
                  }}
                  style={{ 
                    offsetPath: `path("${getPath(req.source, req.target)}")`,
                    filter: `drop-shadow(0 0 6px currentColor)`
                  }}
                />
              ))}
            </AnimatePresence>
          </svg>
        </div>

        {/* Load Balancer - Higher Z */}
        <div className="flex flex-col items-center gap-4 z-20">
          <motion.div 
            animate={isPlaying && requests.length > 0 ? { 
              scale: [1, 1.05, 1],
              borderColor: ["rgba(112,93,232,0.3)", "rgba(112,93,232,1)", "rgba(112,93,232,0.3)"],
              boxShadow: ["0 0 10px rgba(112,93,232,0.1)", "0 0 30px rgba(112,93,232,0.4)", "0 0 10px rgba(112,93,232,0.1)"]
            } : {}}
            transition={{ repeat: Infinity, duration: 2 / speed }}
            className="node-standard !min-w-0 !p-4 !border-primary/40 shadow-[0_0_20px_rgba(112,93,232,0.2)] relative"
          >
            {/* Status Dot for LB */}
            <div className="status-dot -top-1 -right-1 flex h-2 w-2">
              <span className="status-dot-pulse bg-emerald-400"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>

            <div className="icon-box icon-box-active !p-0 !bg-transparent !border-transparent">
              <GitPullRequestDraft className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
          <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest font-semibold">Load Balancer</span>
        </div>

        {/* Servers - Higher Z */}
        <div className="flex flex-col justify-between h-full z-20 w-52 py-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <motion.div 
                animate={serverLoad[i] > 0.5 && optimisticStatuses[i] ? {
                  scale: [1, 1.03, 1],
                  borderColor: ["rgba(255,255,255,0.1)", "rgba(112,93,232,0.4)", "rgba(255,255,255,0.1)"]
                } : {}}
                className={`node-standard !p-3 flex items-center gap-3 relative transition-all duration-500 ${!optimisticStatuses[i] ? 'opacity-40 grayscale border-red-500/30 bg-red-500/[0.02]' : ''}`}
              >
                {!optimisticStatuses[i] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/5 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500/40" />
                  </div>
                )}
                
                <div className={`icon-box !p-1.5 ${optimisticStatuses[i] ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/20'}`}>
                  <Server className={`w-4 h-4 ${optimisticStatuses[i] ? 'text-white/80' : 'text-red-500/60'}`} />
                </div>
                
                <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 shadow-[0_0_8px_rgba(112,93,232,0.5)] ${optimisticStatuses[i] ? 'bg-primary' : 'bg-red-500/20'}`}
                    style={{ width: `${Math.round(serverLoad[i] * 10)}%` }}
                  />
                </div>

                <button 
                  id={`server-power-${i}`}
                  onClick={() => toggleServerHealth(i)}
                  className={`p-1.5 rounded-md border transition-all ${optimisticStatuses[i] ? 'border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-white/30 hover:text-red-500' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                  title={optimisticStatuses[i] ? "Simulate Failure" : "Restore Server"}
                >
                  <Power className="w-3 h-3" />
                </button>
              </motion.div>
              <div className="flex justify-between items-center px-1">
                <span className={`text-[9px] font-mono uppercase tracking-tighter font-semibold ${optimisticStatuses[i] ? 'text-white/40' : 'text-red-400/60'}`}>
                  Web Server {i + 1} {optimisticStatuses[i] ? '' : '[OFFLINE]'}
                </span>
                <span className={`text-[9px] font-mono font-bold ${optimisticStatuses[i] ? 'text-primary/80' : 'text-red-500/40'}`}>
                  {Math.round(serverLoad[i] * 10)}% Load
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time reasoning log */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <p className="text-xs font-mono text-white/50 tracking-tight">
          <span className="text-primary/70 mr-2">LOG:</span>
          {lastDecision}
        </p>
      </div>
    </div>
  );
}
