import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, Info, Database, AlertCircle } from 'lucide-react';

type CAPSelection = 'CP' | 'AP' | 'CA' | null;

interface TopicInfo {
  title: string;
  description: string;
  dbs: string[];
  tradeoff: string;
  icon: React.ReactNode;
  color: string;
}

const TOPIC_DETAILS: Record<string, TopicInfo> = {
  CP: {
    title: "Consistency + Partition Tolerance",
    description: "The system ensures all nodes see the same data at the same time, but it may become unavailable during a network partition to maintain that consistency.",
    dbs: ["MongoDB", "HBase", "Redis", "Etcd"],
    tradeoff: "Availability is sacrificed. If nodes can't talk, the system refuses requests.",
    icon: <Shield className="w-5 h-5" />,
    color: "from-blue-500 to-indigo-600"
  },
  AP: {
    title: "Availability + Partition Tolerance",
    description: "The system stays available and processes requests even during a partition, but individual nodes might return stale or inconsistent data.",
    dbs: ["Cassandra", "DynamoDB", "CouchDB", "Riak"],
    tradeoff: "Consistency is sacrificed. Data may diverge and requires 'Eventual Consistency' resolutions later.",
    icon: <Zap className="w-5 h-5" />,
    color: "from-orange-500 to-yellow-600"
  },
  CA: {
    title: "Consistency + Availability",
    description: "The system is consistent and available as long as no network partitions occur. Note: In distributed systems, P is usually mandatory!",
    dbs: ["PostgreSQL", "MySQL", "Oracle", "SQL Server"],
    tradeoff: "Partition Tolerance is sacrificed. This model essentially describes a single-node database or a system on a 'perfect' network.",
    icon: <Globe className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600"
  }
};

export const CapTheoremSim: React.FC = () => {
  const [selection, setSelection] = useState<CAPSelection>(null);

  const trianglePoints = {
    C: { x: 200, y: 50, label: "Consistency" },
    A: { x: 350, y: 300, label: "Availability" },
    P: { x: 50, y: 300, label: "Partition Tolerance" }
  };

  const getCombinationCenter = (sel: CAPSelection) => {
    if (sel === 'CP') return { x: 125, y: 175 };
    if (sel === 'AP') return { x: 200, y: 300 };
    if (sel === 'CA') return { x: 275, y: 175 };
    return null;
  };

  const activeCenter = getCombinationCenter(selection);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 glass-panel rounded-2xl border border-white/10 bg-black/20 shadow-2xl overflow-hidden min-h-[500px]">
      {/* Triangle Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-10 border-r border-white/5 pr-8">
        <svg width="400" height="350" viewBox="0 0 400 350" className="drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          {/* Connecting Lines */}
          <path 
            d={`M ${trianglePoints.C.x} ${trianglePoints.C.y} L ${trianglePoints.A.x} ${trianglePoints.A.y} L ${trianglePoints.P.x} ${trianglePoints.P.y} Z`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="opacity-10"
          />

          {/* Side Selectors (Interactive areas) */}
          <motion.path
            d={`M ${trianglePoints.C.x} ${trianglePoints.C.y} L ${trianglePoints.P.x} ${trianglePoints.P.y}`}
            strokeWidth="12"
            stroke="transparent"
            className="cursor-pointer"
            onClick={() => setSelection('CP')}
            data-testid="cap-cp-path"
          />
          <motion.path
            d={`M ${trianglePoints.P.x} ${trianglePoints.P.y} L ${trianglePoints.A.x} ${trianglePoints.A.y}`}
            strokeWidth="12"
            stroke="transparent"
            className="cursor-pointer"
            onClick={() => setSelection('AP')}
            data-testid="cap-ap-path"
          />
           <motion.path
            d={`M ${trianglePoints.A.x} ${trianglePoints.A.y} L ${trianglePoints.C.x} ${trianglePoints.C.y}`}
            strokeWidth="12"
            stroke="transparent"
            className="cursor-pointer"
            onClick={() => setSelection('CA')}
            data-testid="cap-ca-path"
          />

          {/* Highlighted active edge */}
          <AnimatePresence>
            {selection === 'CP' && (
              <motion.line 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={trianglePoints.C.x} y1={trianglePoints.C.y} x2={trianglePoints.P.x} y2={trianglePoints.P.y}
                stroke="#6366f1" strokeWidth="3"
              />
            )}
            {selection === 'AP' && (
              <motion.line 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={trianglePoints.P.x} y1={trianglePoints.P.y} x2={trianglePoints.A.x} y2={trianglePoints.A.y}
                stroke="#f59e0b" strokeWidth="3"
              />
            )}
            {selection === 'CA' && (
              <motion.line 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={trianglePoints.A.x} y1={trianglePoints.A.y} x2={trianglePoints.C.x} y2={trianglePoints.C.y}
                stroke="#10b981" strokeWidth="3"
              />
            )}
          </AnimatePresence>

          {/* Vertices */}
          {Object.entries(trianglePoints).map(([key, point]) => (
            <g key={key}>
              <circle cx={point.x} cy={point.y} r="6" fill="white" className="opacity-40" />
              <text 
                x={point.x} 
                y={point.y + (point.y < 100 ? -20 : 30)} 
                textAnchor="middle" 
                className="text-[12px] fill-white/60 font-medium uppercase tracking-widest"
              >
                {point.label}
              </text>
            </g>
          ))}

          {/* Active indicator dot */}
          {activeCenter && (
            <motion.circle 
              layoutId="cap-dot"
              cx={activeCenter.x} 
              cy={activeCenter.y} 
              r="10" 
              className={`fill-current ${selection === 'CP' ? 'text-indigo-500' : selection === 'AP' ? 'text-orange-500' : 'text-green-500'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
        </svg>

        <p className="mt-8 text-xs text-white/30 text-center max-w-[200px] leading-relaxed italic">
          Click an edge representating a combination to see its characteristics.
        </p>
      </div>

      {/* Info Panel */}
      <div className="flex-1 flex flex-col gap-6 h-full justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {!selection ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center gap-4 py-20"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-2">
                <Info className="w-6 h-6 text-white/20" />
              </div>
              <h3 className="text-xl font-medium text-white/90">Pick a Strategy</h3>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                The CAP theorem states that a distributed system can only provide 2 out of 3 guarantees simultaneously.
              </p>
            </motion.div>
          ) : (
            <motion.div 
               key={selection}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex flex-col gap-6"
            >
              <div className={`p-4 rounded-xl bg-gradient-to-br ${TOPIC_DETAILS[selection].color} flex flex-col gap-3 shadow-lg`}>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {TOPIC_DETAILS[selection].icon}
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    {selection} Strategy
                  </h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  {TOPIC_DETAILS[selection].title}
                </p>
              </div>

              <div className="grid gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-xl">
                    <p className="text-sm text-white/70 leading-relaxed">
                      {TOPIC_DETAILS[selection].description}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 tracking-widest pl-1">
                      <AlertCircle className="w-3 h-3 text-red-500/50" />
                      The Trade-off
                   </div>
                   <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl text-sm text-red-400/80 italic leading-relaxed">
                      {TOPIC_DETAILS[selection].tradeoff}
                   </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                   <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 tracking-widest pl-1">
                      <Database className="w-3 h-3 text-white/30" />
                      Common Examples
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {TOPIC_DETAILS[selection].dbs.map(db => (
                        <span key={db} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 font-mono">
                          {db}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
