import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

interface RequestLog {
  id: number;
  status: "success" | "limited";
  timestamp: string;
}

export function RateLimitingSim() {
  const [capacity, setCapacity] = useState(5);
  const [tokens, setTokens] = useState(5);
  const [refillRate, setRefillRate] = useState(1); // tokens per second
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const logIdCounter = useRef(0);

  // Refill logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prev) => Math.min(prev + refillRate / 10, capacity));
    }, 100); // 10 ticks per second for smoothness

    return () => clearInterval(interval);
  }, [capacity, refillRate]);

  const handleRequest = useCallback(() => {
    const id = ++logIdCounter.current;
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (tokens >= 1) {
      setTokens((prev) => prev - 1);
      setLogs((prev) => [{ id, status: "success" as const, timestamp }, ...prev].slice(0, 5));
    } else {
      setLogs((prev) => [{ id, status: "limited" as const, timestamp }, ...prev].slice(0, 5));
    }
  }, [tokens]);

  const resetSim = () => {
    setTokens(capacity);
    setLogs([]);
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 my-8">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Visual Bucket */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-48 h-64 bg-white/[0.02] border-x-2 border-b-2 border-white/20 rounded-b-3xl overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
            {/* Water/Token Level */}
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-primary/40 to-primary/20 backdrop-blur-sm"
              initial={false}
              animate={{ height: `${(tokens / capacity) * 100}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
              <div className="absolute top-0 w-full h-1 bg-white/20" />
            </motion.div>

            {/* Floating Tokens inside bucket */}
            <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-4 pointer-events-none">
              <AnimatePresence>
                {Array.from({ length: Math.floor(tokens) }).map((_, i) => (
                  <motion.div
                    key={`token-${i}`}
                    initial={{ scale: 0, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="w-4 h-4 rounded-full bg-primary/60 border border-white/20 shadow-[0_0_10px_rgba(112,93,232,0.5)]"
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-3xl font-bold tracking-tighter text-white">
              {tokens.toFixed(1)}
            </span>
            <span className="text-white/40 text-sm ml-2">/ {capacity} Tokens</span>
          </div>

          <button
            onClick={handleRequest}
            className={`mt-8 group relative px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg active:scale-95 ${
              tokens >= 1 
              ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20" 
              : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-5 h-5 ${tokens >= 1 ? "fill-white animate-pulse" : ""}`} />
              Send API Request
            </div>
          </button>
        </div>

        {/* Controls & Logs */}
        <div className="flex-1 space-y-8">
          <div>
            <h3 className="text-micro mb-6">Bucket Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest font-bold">
                  <span>Capacity</span>
                  <span>{capacity} Tokens</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest font-bold">
                  <span>Refill Rate</span>
                  <span>{refillRate} / sec</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={refillRate}
                  onChange={(e) => setRefillRate(parseFloat(e.target.value))}
                  className="w-full accent-primary h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-micro">Traffic Logs</h3>
              <button onClick={resetSim} className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-tighter">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {logs.length === 0 ? (
                  <div className="text-[13px] text-white/20 italic py-4 border border-dashed border-white/5 rounded-xl text-center">
                    No traffic activity yet...
                  </div>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center justify-between p-3 rounded-xl border border-white/5 ${
                        log.status === "success" ? "bg-green-500/5" : "bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {log.status === "success" ? (
                          <ShieldCheck className="w-4 h-4 text-green-500/60" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500/60" />
                        )}
                        <span className={`text-[13px] font-medium ${
                          log.status === "success" ? "text-green-200/80" : "text-red-200/80"
                        }`}>
                          {log.status === "success" ? "Request Allowed" : "429 Too Many Requests"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/20">
                        {log.timestamp}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
