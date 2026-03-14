import { Handle, Position } from "reactflow";
import { MonitorSmartphone } from "lucide-react";

export function ClientNode({ data }: { data: any }) {
  const { label, sublabel, status = 'healthy' } = data;
  
  return (
    <div className="node-standard !rounded-full !px-5 !py-2 flex items-center justify-center gap-3">
      {/* Status Indicator Dot */}
      <div className="status-dot -top-1 -right-1 flex h-2 w-2">
        {status === 'healthy' && <span className="status-dot-pulse bg-emerald-400"></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/20'}`}></span>
      </div>

      <div className="icon-box !p-1.5">
        <MonitorSmartphone className="w-4 h-4 text-white/80" />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-foreground/90 tracking-tight leading-tight">{label}</div>
        {sublabel && <div className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
    </div>
  );
}
