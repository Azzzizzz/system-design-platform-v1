import { Handle, Position } from "reactflow";
import { MonitorSmartphone } from "lucide-react";

export function ClientNode({ data }: { data: any }) {
  const { label, sublabel, status = 'healthy' } = data;
  
  return (
    <div className="node-standard !rounded-full !px-5 !py-2 flex items-center justify-center gap-3">
      <div className={`icon-box !p-1.5 transition-all duration-500 ${status === 'healthy' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
        <MonitorSmartphone className={`w-4 h-4 transition-colors duration-500 ${status === 'healthy' ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-white/20'}`} />
      </div>
      <div>
        <div className={`text-[13px] font-semibold tracking-tight leading-tight transition-colors duration-500 ${status === 'healthy' ? 'text-foreground/90' : 'text-muted-foreground/40'}`}>{label}</div>
        {sublabel && <div className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground/40">{sublabel}</div>}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
    </div>
  );
}
