import { Handle, Position } from "reactflow";
import { Server } from "lucide-react";

export function ServiceNode({ data }: { data: any }) {
  const { label, status = 'healthy', highlighted } = data;
  
  return (
    <div className={`
      node-standard flex flex-col items-center justify-center gap-3
      ${highlighted ? 'border-primary shadow-[0_0_15px_rgba(112,93,232,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : ''}
      ${status === 'down' ? 'opacity-60 grayscale-[0.5]' : ''}
    `}>
      {/* Status Indicator Dot */}
      <div className="status-dot h-2 w-2">
        {status === 'healthy' && (
          <span className="status-dot-pulse bg-emerald-400"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/20'}`}></span>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary/50 !border-transparent -left-1" />
      
      <div className="icon-box">
        <Server className="w-5 h-5 text-white/70" />
      </div>

      <div className="text-center">
        <div className="text-[13px] font-semibold text-foreground/90 tracking-tight leading-none mb-1">{label}</div>
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Active Node</div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
    </div>
  );
}
