
import { Zap as ZapIcon } from "lucide-react";

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="my-10 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-6 relative overflow-hidden group hover:bg-amber-500/[0.05] transition-colors">
      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="flex items-center gap-2 text-amber-500/90 font-bold mb-5 text-[11px] tracking-widest uppercase font-mono">
        <ZapIcon className="w-4 h-4 fill-amber-500/20" />
        Key Takeaways
      </h3>
      
      <ul className="space-y-4 relative z-10">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[14px] text-foreground/75 leading-relaxed">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/40 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
