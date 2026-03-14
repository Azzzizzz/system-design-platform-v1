
import { Zap as ZapIcon } from "lucide-react";

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="my-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-4 text-sm tracking-wide uppercase">
        <ZapIcon className="w-5 h-5" />
        Key Takeaways
      </h3>
      
      <ul className="space-y-3 relative z-10">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500/50 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
