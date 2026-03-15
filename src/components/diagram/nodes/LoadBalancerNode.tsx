import { Handle, Position } from "reactflow";
import { GitPullRequestDraft } from "lucide-react";

export function LoadBalancerNode({ data }: { data: any }) {
  const { label, sublabel, status = 'healthy' } = data;
  
  return (
    <div className={`
      relative p-4 rounded-xl border bg-[#0A0A0A]/80 backdrop-blur-xl flex flex-col items-center gap-3 min-w-[140px]
      ${status === 'healthy' ? 'border-primary/30 shadow-[0_0_20px_rgba(112,93,232,0.2)]' : 'border-white/5'}
      ${status === 'down' ? 'opacity-40 grayscale-[0.8]' : ''}
      transition-all duration-300
    `}>
      {/* Background Glow */}
      {status === 'healthy' && (
        <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full pointer-events-none" />
      )}

      {/* Status Badge */}
      <div className="absolute top-2.5 right-2.5 flex h-2 w-2">
        {status === 'healthy' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
      </div>

      <Handle type="target" position={Position.Left} id="left" className="w-2.5 h-2.5 !bg-primary/40 !border-white/10 -left-1.5" />
      
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
        <GitPullRequestDraft className={`w-6 h-6 ${status === 'healthy' ? 'text-primary' : 'text-white/20'}`} />
      </div>

      <div className="text-center space-y-0.5">
        <div className="text-[13px] font-bold text-white tracking-tight leading-none mb-1">{label}</div>
        {sublabel && (
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
            {sublabel}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2.5 h-2.5 !bg-primary/40 !border-white/10 -right-1.5" />
    </div>
  );
}
