import { Handle, Position } from "reactflow";
import { MonitorSmartphone } from "lucide-react";

export function ClientNode({ data }: { data: any }) {
  const { label, sublabel } = data;
  
  return (
    <div className="relative rounded-full border border-white/10 bg-white/5 px-5 py-2 min-w-[120px] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center flex items-center justify-center gap-2">
      <MonitorSmartphone className="w-4 h-4 text-white/60" />
      <div>
        <div className="text-xs font-semibold text-foreground/90 tracking-tight">{label}</div>
        {sublabel && <div className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent -right-1" />
    </div>
  );
}
