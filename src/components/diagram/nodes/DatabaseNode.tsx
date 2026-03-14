import { Handle, Position } from "reactflow";
import { Database } from "lucide-react";

export function DatabaseNode({ data }: { data: any }) {
  const { label, sublabel, isPrimary, status } = data;
  
  return (
    <div className={`
      relative rounded-xl border bg-[#0A0A0A]/90 p-4 min-w-[150px]
      backdrop-blur-md transition-all
      ${isPrimary ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-[rgba(255,255,255,0.08)]'}
      shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
      ${status === 'down' ? 'opacity-50 grayscale' : ''}
    `}>
       {/* Cylinder top arch illusion */}
      <div className={`absolute top-0 left-0 right-0 h-4 rounded-t-[50%] border-t border-[rgba(255,255,255,0.05)] ${isPrimary ? 'bg-amber-500/5' : 'bg-white/[0.02]'}`} />

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-primary/50 !border-transparent" />
      
      <div className="flex flex-col items-center justify-center gap-2 mt-2">
        <Database className={`w-6 h-6 ${isPrimary ? 'text-amber-500/80' : 'text-white/50'}`} />
        <div className="text-center">
          <div className="text-sm font-medium text-foreground/90 tracking-tight">{label}</div>
          {sublabel && <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent" />
    </div>
  );
}
