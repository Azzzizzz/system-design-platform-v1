import { Handle, Position } from "reactflow";
import { GitPullRequestDraft } from "lucide-react";

export function LoadBalancerNode({ data }: { data: any }) {
  const { label, sublabel, status = 'healthy' } = data;
  
  return (
    <div className={`
      node-standard flex flex-col items-center justify-center gap-3
      ${status === 'down' ? 'opacity-60 grayscale-[0.5]' : ''}
    `}>
      {/* Status Indicator Dot */}
      <div className="status-dot h-2 w-2">
        {status === 'healthy' && (
          <span className="status-dot-pulse bg-primary/40"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-primary shadow-[0_0_8px_rgba(112,93,232,0.8)]' : 'bg-white/20'}`}></span>
      </div>

      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-primary/50 !border-transparent -left-1" />
      
      <div className="icon-box icon-box-active">
        <GitPullRequestDraft className="w-5 h-5" />
      </div>

      <div className="text-center">
        <div className="text-[13px] font-semibold text-foreground/90 tracking-tight">{label}</div>
        {sublabel && <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
    </div>
  );
}
