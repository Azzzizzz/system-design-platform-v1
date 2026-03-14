import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Gauge, Timer, Info, AlertTriangle } from 'lucide-react';

interface Packet {
  id: number;
  startTime: number;
}

export const LatencyThroughputSim: React.FC = () => {
  // Simulation State
  const [latency, setLatency] = useState(2000); // ms for a packet to travel
  const [throughput, setThroughput] = useState(2); // packets per second
  
  // Internal State
  const [packets, setPackets] = useState<Packet[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  // Stats calculation
  useEffect(() => {

    const interval = setInterval(() => {
      const now = Date.now();
      
      // Spawn new packet based on throughput
      if (now - lastSpawn.current > 1000 / throughput) {
        setPackets(prev => [...prev, { id: nextId.current++, startTime: now }]);
        lastSpawn.current = now;
      }

      // Remove packets that have finished their "journey"
      setPackets(prev => {
        const finished = prev.filter(p => now - p.startTime >= latency);
        if (finished.length > 0) {
          setProcessedCount(c => c + finished.length);
        }
        return prev.filter(p => now - p.startTime < latency);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [throughput, latency]);

  // Calculate congestion
  const maxCapacity = 10; 
  const currentLoad = packets.length;
  const isCongested = currentLoad > maxCapacity * 0.8;

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel rounded-2xl border border-white/10 bg-black/20 shadow-2xl overflow-hidden min-h-[500px]">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1.5">
            <Timer className="w-3 h-3 text-blue-400" />
            Current Latency
          </span>
          <span className="text-2xl font-mono text-blue-400">{(latency / 1000).toFixed(1)}s</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1.5">
            <FastForward className="w-3 h-3 text-purple-400" />
            Request Rate
          </span>
          <span className="text-2xl font-mono text-purple-400">{throughput} req/s</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-green-400" />
            Total Processed
          </span>
          <span className="text-2xl font-mono text-green-400">{processedCount}</span>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="relative flex-1 flex flex-col justify-center gap-12 mt-4">
        <div className="relative h-24 w-full">
          {/* Legend: Entry and Exit */}
          <div className="absolute top-[-24px] left-0 text-[10px] text-white/30 uppercase tracking-tighter">Gateway In</div>
          <div className="absolute top-[-24px] right-0 text-[10px] text-white/30 uppercase tracking-tighter text-right">Service Out</div>

          {/* The "Pipe" */}
          <div className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/[0.08] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Animated background stripes */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ 
                   backgroundImage: 'linear-gradient(90deg, transparent 50%, #fff 50%)', 
                   backgroundSize: '100px 100%',
                   animation: `scroll ${latency/5}ms linear infinite`
                 }} 
            />
            
            <AnimatePresence>
              {packets.map(packet => (
                <motion.div
                  key={packet.id}
                  initial={{ x: -20, opacity: 0, scale: 0.8 }}
                  animate={{ 
                    x: 'calc(100% - 30px)', 
                    opacity: 1, 
                    scale: 1,
                    transition: { duration: latency / 1000, ease: "linear" }
                  }}
                  exit={{ scale: 1.2, opacity: 0, x: '100%' }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-8 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Informational Toast / Botttleneck Warning */}
        {isCongested && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span><strong>Potential Bottleneck:</strong> High throughput at this latency is saturating the queue. System performance may degrade.</span>
          </motion.div>
        )}
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
        {/* Latency Control */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/70">Network Latency (System Speed)</span>
            <span className="text-xs font-mono text-blue-400">{latency}ms</span>
          </div>
          <input 
            type="range" 
            min="500" 
            max="5000" 
            step="100"
            value={latency} 
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[11px] text-white/40 leading-relaxed italic">
            Lower latency = data travels faster from A to B.
          </p>
        </div>

        {/* Throughput Control */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/70">Requests/sec (Throughput Content)</span>
            <span className="text-xs font-mono text-purple-400">{throughput}/s</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="15" 
            step="1"
            value={throughput} 
            onChange={(e) => setThroughput(Number(e.target.value))}
            className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[11px] text-white/40 leading-relaxed italic">
            Higher throughput = more data handled in the same time window.
          </p>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-white/80">The "Little's Law" Insight</p>
          <p className="text-[11px] text-white/40 leading-tight">
            Average items in system = Arrival Rate (Throughput) × Time spent in system (Latency). 
            Try increasing both and see how the pipe gets crowded!
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { background-position: 0 0; }
          to { background-position: 100px 0; }
        }
      `}</style>
    </div>
  );
};
