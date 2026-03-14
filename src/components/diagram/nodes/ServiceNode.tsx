import { Handle, Position } from "reactflow";
import { Server } from "lucide-react";

export function ServiceNode({ data }: { data: any }) {
  const { label, sublabel, status, highlighted } = data;
  
  return (
    <div className={`
      relative rounded-lg border bg-[#0A0A0A]/90 p-4 min-w-[150px]
      backdrop-blur-md transition-all duration-300
      ${highlighted ? 'border-primary shadow-[0_0_15px_rgba(112,93,232,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'border-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'}
      ${status === 'down' ? 'opacity-60 grayscale-[0.5]' : ''}
    `}>
      {/* Status Indicator Dot */}
      <div className="absolute top-2 right-2 flex h-2 w-2">
        {status === 'healthy' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/20'}`}></span>
      </div>
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-primary/50 !border-transparent -left-1" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
      
      <div className="flex items-center gap-3">
        <div className={`p-2 border rounded-md ${highlighted ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-white/50'}`}>
          <Server className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground/90 tracking-tight">{label}</div>
          {sublabel && <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
        </div>
      </div>


    </div>
  );
}
