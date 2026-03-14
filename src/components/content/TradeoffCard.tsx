import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TradeoffCard({ pros, cons }: { pros: string[]; cons: string[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-panel rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.4)] backdrop-blur-md overflow-hidden my-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white/[0.02] border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.04] transition-colors"
      >
        <span className="font-semibold text-sm tracking-tight text-foreground/90">Tradeoffs</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row"
          >
            <div className="flex-1 p-5 md:border-r border-[rgba(255,255,255,0.04)]">
              <h4 className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3 tracking-widest uppercase">
                <Check className="w-3.5 h-3.5" /> Pros
              </h4>
              <ul className="space-y-2">
                {pros.map((pro, i) => (
                  <li key={i} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500/50 mt-1">•</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 p-5 border-t md:border-t-0 border-[rgba(255,255,255,0.04)]">
              <h4 className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-3 tracking-widest uppercase">
                <X className="w-3.5 h-3.5" /> Cons
              </h4>
              <ul className="space-y-2">
                {cons.map((con, i) => (
                  <li key={i} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
                    <span className="text-rose-500/50 mt-1">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
