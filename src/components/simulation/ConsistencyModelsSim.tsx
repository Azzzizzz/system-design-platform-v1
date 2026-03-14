import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Clock, RefreshCw, AlertCircle, CheckCircle2, Server } from 'lucide-react';

type ModelType = 'strong' | 'eventual';

interface LogEntry {
  id: string;
  type: 'write' | 'read' | 'replicate';
  node: 'A' | 'B';
  value: string | number;
  time: number;
  status: 'pending' | 'success' | 'stale';
}

export const ConsistencyModelsSim: React.FC = () => {
  const [model, setModel] = useState<ModelType>('strong');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nodeAValue, setNodeAValue] = useState<number>(0);
  const [nodeBValue, setNodeBValue] = useState<number>(0);
  const [isReplicating, setIsReplicating] = useState(false);
  const nextId = useRef(0);

  const reset = () => {
    setLogs([]);
    setNodeAValue(0);
    setNodeBValue(0);
    setIsReplicating(false);
  };

  const addLog = (entry: Omit<LogEntry, 'id' | 'time'>) => {
    const id = `log-${nextId.current++}`;
    const newEntry: LogEntry = {
      ...entry,
      id,
      time: Date.now()
    };
    setLogs(prev => [newEntry, ...prev].slice(0, 8));
  };

  const handleWrite = () => {
    const newValue = nodeAValue + 1;
    setNodeAValue(newValue);
    addLog({ type: 'write', node: 'A', value: newValue, status: 'success' });

    if (model === 'strong') {
      setIsReplicating(true);
      // Simulating blocking sync replication
      setTimeout(() => {
        setNodeBValue(newValue);
        setIsReplicating(false);
        addLog({ type: 'replicate', node: 'B', value: newValue, status: 'success' });
      }, 800);
    } else {
      // Async replication for eventual
      setTimeout(() => {
        setIsReplicating(true);
        setTimeout(() => {
          setNodeBValue(newValue);
          setIsReplicating(false);
          addLog({ type: 'replicate', node: 'B', value: newValue, status: 'success' });
        }, 800);
      }, 2000); // Significant delay for visual effect
    }
  };

  const handleRead = (node: 'A' | 'B') => {
    const val = node === 'A' ? nodeAValue : nodeBValue;
    const isStale = node === 'B' && val !== nodeAValue;
    
    addLog({ 
      type: 'read', 
      node, 
      value: val, 
      status: isStale ? 'stale' : 'success' 
    });
  };

  useEffect(() => {
    reset();
  }, [model]);

  return (
    <div className="flex flex-col gap-6 p-8 glass-panel rounded-2xl border border-white/10 bg-black/20 shadow-2xl overflow-hidden min-h-[550px]">
      {/* Model Selector */}
      <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 self-start">
        <button 
          onClick={() => setModel('strong')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${model === 'strong' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Strong Consistency
        </button>
        <button 
          onClick={() => setModel('eventual')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${model === 'eventual' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Eventual Consistency
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
        {/* Nodes Visualization */}
        <div className="flex flex-col gap-12 justify-center py-4 relative">
          {/* Node A */}
          <div className="flex items-center gap-6 relative z-10">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)] group-hover:border-indigo-500/60 transition-colors">
                <Server className="w-8 h-8 text-indigo-400" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Node A (Leader)</span>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-end px-2">
                <span className="text-[10px] uppercase font-bold text-white/20">Stored Value</span>
                <span className="text-3xl font-mono text-indigo-400 leading-none">{nodeAValue}</span>
              </div>
              <button 
                onClick={handleWrite}
                className="w-full py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Write Value
              </button>
            </div>
          </div>

          {/* Replication Path */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 h-24 w-[2px] bg-white/5 mx-auto">
             <AnimatePresence>
               {isReplicating && (
                 <motion.div 
                   initial={{ top: 0, opacity: 0 }}
                   animate={{ top: "100%", opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.8, ease: "linear" }}
                   className="absolute w-1.5 h-6 -left-[2px] bg-gradient-to-b from-indigo-500 to-transparent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                 />
               )}
             </AnimatePresence>
          </div>

          {/* Node B */}
          <div className="flex items-center gap-6 relative z-10">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                <Server className="w-8 h-8 text-white/40" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Node B (Follower)</span>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-end px-2">
                <span className="text-[10px] uppercase font-bold text-white/20">Stored Value</span>
                <span className={`text-3xl font-mono leading-none ${nodeBValue === nodeAValue ? 'text-white/60' : 'text-orange-400'}`}>
                  {nodeBValue}
                </span>
              </div>
              <button 
                onClick={() => handleRead('B')}
                className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                Read Follower
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Panel */}
        <div className="bg-black/40 rounded-xl border border-white/[0.08] flex flex-col overflow-hidden shadow-inner">
          <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-2">
              <Database className="w-3 h-3" />
              System Event Log
            </span>
            <button onClick={reset} className="text-[9px] uppercase font-bold text-white/20 hover:text-white/40 transition-colors">Clear</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-mono">
            <AnimatePresence initial={false}>
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[10px] text-white/20 uppercase tracking-tighter italic">
                  Waiting for system operations...
                </div>
              ) : (
                logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-[11px] py-1 border-b border-white/[0.02] last:border-0"
                  >
                    <span className="text-white/20 w-16">[{new Date(log.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    
                    {log.type === 'write' && (
                      <span className="text-indigo-400 flex items-center gap-1.5 marker:bg-indigo-400">
                        <CheckCircle2 className="w-3 h-3" />
                        WRITE Node A → {log.value}
                      </span>
                    )}
                    
                    {log.type === 'replicate' && (
                      <span className="text-green-500 flex items-center gap-1.5 marker:bg-green-500">
                        <RefreshCw className="w-3 h-3" />
                        SYNC Node B ← {log.value}
                      </span>
                    )}
                    
                    {log.type === 'read' && (
                      <span className={`flex items-center gap-1.5 ${log.status === 'stale' ? 'text-orange-400' : 'text-white/60'}`}>
                        {log.status === 'stale' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        READ Node {log.node}: val={log.value} {log.status === 'stale' ? '(STALE)' : '(OK)'}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          
          {/* Explanation Footer */}
          <div className="p-4 bg-white/[0.03] border-t border-white/[0.05]">
            <p className="text-[11px] text-white/40 leading-relaxed italic">
              {model === 'strong' 
                ? "In Strong Consistency, Node B is updated before the system acknowledges the write. Readers always see the latest data."
                : "In Eventual Consistency, replication happens lazily in the background. Readers might see old values for a brief window."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
