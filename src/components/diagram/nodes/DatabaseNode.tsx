import { Handle, Position } from "reactflow";
import { Database } from "lucide-react";

export function DatabaseNode({ data }: { data: any }) {
  const { label, sublabel, isPrimary, status = 'healthy' } = data;
  
  return (
    <div className={`
      node-standard flex flex-col items-center justify-center gap-3 pt-6
      ${isPrimary ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}
      ${status === 'down' ? 'opacity-60 grayscale-[0.5]' : ''}
    `}>
      {/* Cylinder top arch illusion */}
      <div className={`absolute top-0 left-0 right-0 h-4 rounded-t-xl border-t border-white/5 ${isPrimary ? 'bg-amber-500/5' : 'bg-white/[0.02]'}`} />

      {/* Status Indicator Dot */}
      <div className="status-dot flex h-2 w-2">
        {status === 'healthy' && (
          <span className={`status-dot-pulse ${isPrimary ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? (isPrimary ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]') : 'bg-white/20'}`}></span>
      </div>

      <div className={`icon-box ${isPrimary ? 'icon-box-active !text-amber-500 !bg-amber-500/10 !border-amber-500/20' : ''}`}>
        <Database className="w-5 h-5 shadow-sm" />
      </div>
      
      <div className="text-center">
        <div className="text-[13px] font-semibold text-foreground/90 tracking-tight">{label}</div>
        {sublabel && <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{sublabel}</div>}
      </div>

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary/50 !border-transparent" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-primary/50 !border-transparent" />
    </div>
  );
}
