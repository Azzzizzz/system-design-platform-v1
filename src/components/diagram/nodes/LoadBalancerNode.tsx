import { Handle, Position } from "reactflow";
import { GitPullRequestDraft } from "lucide-react";

export function LoadBalancerNode({ data }: { data: any }) {
  const { label, sublabel, status } = data;
  
  return (
    <div className={`
      relative rounded-lg border bg-[#050510]/90 p-3 min-w-[140px]
      backdrop-blur-md shadow-[0_0_20px_rgba(112,93,232,0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
      border-primary/30 text-center
      ${status === 'down' ? 'opacity-60 grayscale-[0.5]' : ''}
    `}>
      {/* Status Indicator Dot */}
      <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
        {status !== 'down' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status !== 'down' ? 'bg-primary shadow-[0_0_8px_rgba(112,93,232,0.8)]' : 'bg-white/20'}`}></span>
      </div>
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-primary/50 !border-transparent -left-1" />
      
      <div className="flex flex-col items-center justify-center gap-1.5">
        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
          <GitPullRequestDraft className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-primary/90 tracking-tight">{label}</div>
          {sublabel && <div className="text-[9px] uppercase tracking-wider font-mono text-primary/60">{sublabel}</div>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent" />
    </div>
  );
}
