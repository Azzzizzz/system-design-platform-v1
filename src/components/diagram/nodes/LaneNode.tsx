import type { NodeProps } from 'reactflow';

export function LaneNode({ data }: NodeProps) {
  const { label, sublabel, type = 'vertical' } = data;
  const isVertical = type === 'vertical';
  
  return (
    <div 
      className={`
        w-full h-full rounded-2xl border pointer-events-none relative transition-all duration-500
        ${isVertical 
          ? 'bg-blue-500/[0.03] border-blue-500/10 shadow-[inset_0_0_40px_rgba(59,130,246,0.05)]' 
          : 'bg-primary/[0.03] border-primary/10 shadow-[inset_0_0_40px_rgba(112,93,232,0.05)]'
        }
      `}
    >
      {/* Approach Header Badge */}
      <div className="absolute top-4 left-6 flex items-center gap-3 opacity-80">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          isVertical ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-primary/10 border-primary/20 text-primary'
        }`}>
          {isVertical ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isVertical ? 'text-blue-400' : 'text-primary'}`}>
            {label}
          </span>
          <span className="text-xs font-bold text-white/40">
            {sublabel}
          </span>
        </div>
      </div>

    </div>
  );
}
