import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, CheckCircle2, Copy, Check, Info } from "lucide-react";

interface InterviewAnswerProps {
  children: React.ReactNode;
}

export function InterviewAnswer({ children }: InterviewAnswerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Extract text from children (simplified approach for demonstration)
    const text = document.getElementById("interview-answer-content")?.innerText || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group my-16"
    >
      {/* Background Decorative Elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
      
      {/* Outer Container with animated border */}
      <div className="relative group/panel">
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] opacity-50 group-hover/panel:opacity-100 transition-opacity" />
        
        <div className="relative glass-panel rounded-[2rem] overflow-hidden bg-[#050505]/80 backdrop-blur-2xl border border-white/5">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                <MessageSquare className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 leading-none mb-1">
                  Blueprint
                </span>
                <span className="text-sm font-semibold text-white/90">
                  Interview Response Guide
                </span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-white/40 hover:text-white/70"
              title="Copy answer text"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-[11px] font-medium text-green-400">Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-[11px] font-medium">Copy Blueprint</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Content Area */}
          <div className="relative p-8">
            {/* Structural vertical line */}
            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
            
            <div id="interview-answer-content" className="prose-interview pl-7">
              {children}
            </div>
          </div>

          {/* Tips / Insights Footer */}
          <div className="px-10 py-5 bg-white/[0.02] border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Info className="w-3 h-3 text-indigo-400" />
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed max-w-[400px]">
                Focus on these 5 pillars to show depth. Mentioning <span className="text-white/60">Distributed Challenges</span> often marks the difference between Mid and Senior candidates.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-green-500/40" />
              Verified Logic
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .prose-interview {
          color: rgba(236, 236, 236, 0.7);
          font-size: 0.9375rem;
          line-height: 1.7;
        }
        .prose-interview h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-top: 0;
          margin-bottom: 2rem;
          letter-spacing: -0.01em;
          position: relative;
        }
        .prose-interview h3:after {
          content: "";
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          width: 26px;
          height: 26px;
          background: #000;
          border: 1px solid var(--primary);
          border-radius: 7px;
          box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.2);
          z-index: 10;
        }
        .prose-interview h3:before {
          content: "?";
          position: absolute;
          left: -31px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary);
          font-size: 13px;
          font-weight: bold;
          z-index: 11;
        }
        
        /* Root List Context - Handle both ul and ol from MDX */
        .prose-interview > ul, 
        .prose-interview > ol {
          counter-reset: interview-steps;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
          position: relative;
        }
        
        /* Top-level LI */
        .prose-interview > ul > li,
        .prose-interview > ol > li {
          position: relative;
          padding-left: 2.25rem;
          margin-bottom: 2rem;
          color: rgba(236, 236, 236, 0.9);
          font-size: 0.9375rem;
          counter-increment: interview-steps;
        }
        
        /* Vertical Connector */
        .prose-interview > ul:after,
        .prose-interview > ol:after {
          content: "";
          position: absolute;
          left: 0;
          top: 22px;
          bottom: 22px;
          width: 1px;
          background: linear-gradient(to bottom, 
            var(--primary) 0%, 
            rgba(var(--primary-rgb), 0.3) 50%, 
            transparent 100%
          );
          opacity: 0.2;
          z-index: 1;
        }
        
        /* The Step Number Circle */
        .prose-interview > ul > li:before,
        .prose-interview > ol > li:before {
          content: counter(interview-steps);
          position: absolute;
          left: -11px;
          top: 0;
          width: 22px;
          height: 22px;
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: white;
          z-index: 5;
          box-shadow: 0 3px 8px rgba(0,0,0,1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .prose-interview > ul > li:hover:before,
        .prose-interview > ol > li:hover:before {
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4);
          transform: scale(1.1);
        }
        
        /* Top Level Headings - More Robust Selector for MDX paragraphs */
        .prose-interview > ul > li strong:first-of-type,
        .prose-interview > ol > li strong:first-of-type {
          display: block;
          width: fit-content;
          margin-bottom: 0.4rem;
          background: linear-gradient(to right, rgba(var(--primary-rgb), 0.1), transparent);
          border-left: 2px solid var(--primary);
          padding: 2px 10px;
          border-radius: 0 4px 4px 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-left: -6px;
          color: white;
        }
        
        /* Nested Lists Styling */
        .prose-interview ul ul {
          list-style: none !important;
          padding: 0 !important;
          margin: 1.25rem 0 0 0 !important;
          border-left: 1px dashed rgba(255, 255, 255, 0.1);
          padding-left: 1.5rem !important;
        }
        
        .prose-interview ul ul li {
          position: relative;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: rgba(236, 236, 236, 0.6);
          padding-left: 0;
        }
        
        .prose-interview ul ul li:before {
          content: "—";
          position: absolute;
          left: -1.25rem;
          color: var(--primary);
          opacity: 0.4;
          font-weight: bold;
        }
        
        /* Keyword Highlights */
        .prose-interview code {
            background: rgba(var(--primary-rgb), 0.15);
            color: var(--primary);
            padding: 2px 6px;
            border-radius: 5px;
            font-size: 0.85em;
            border: 1px solid rgba(var(--primary-rgb), 0.3);
            font-family: var(--font-mono);
            font-weight: 500;
        }
        
        /* Senior Insight Section Footer */
        .interview-footer-insight {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .insight-badge {
            background: rgba(var(--primary-rgb), 0.1);
            color: var(--primary);
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid rgba(var(--primary-rgb), 0.2);
            white-space: nowrap;
        }
      `}</style>
    </motion.div>
  );
}
