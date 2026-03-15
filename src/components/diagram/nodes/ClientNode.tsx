import { Handle, Position } from "reactflow";
import { MonitorSmartphone, Users } from "lucide-react";

export function ClientNode({ data }: { data: any }) {
  const { label, sublabel, status = 'healthy' } = data;
  const isVisitors = label.toLowerCase().includes('visitor') || label.toLowerCase().includes('public');
  
  return (
    <div className={`
      relative px-6 py-3 rounded-full border bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center gap-4
      ${status === 'healthy' ? 'border-blue-500/30' : 'border-white/5'}
      transition-all duration-300
    `}>
      {/* Status Badge */}
      <div className="absolute top-2.5 right-4 flex h-2 w-2">
        {status === 'healthy' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'healthy' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-red-500'}`}></span>
      </div>

      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${status === 'healthy' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/20'}
      `}>
        {isVisitors ? <Users className="w-5 h-5" /> : <MonitorSmartphone className="w-5 h-5" />}
      </div>
      
      <div className="flex flex-col">
        <div className={`text-[13px] font-bold tracking-tight ${status === 'healthy' ? 'text-white' : 'text-white/20'}`}>
          {label}
        </div>
        {sublabel && (
          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
            {sublabel}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="right" className="w-2.5 h-2.5 !bg-blue-500/40 !border-white/10 -right-1.5" />
    </div>
  );
}
