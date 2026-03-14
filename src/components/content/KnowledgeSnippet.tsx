import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";

interface KnowledgeSnippetProps {
  children: ReactNode;
  title?: string;
}

export function KnowledgeSnippet({ children, title = "Implementation Tip" }: KnowledgeSnippetProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/5 my-8">
      {/* Decorative accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/80 to-indigo-500/20" />
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-indigo-400">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-semibold text-sm tracking-wide uppercase">{title}</h3>
        </div>
        
        <div className="prose prose-invert prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/80 prose-strong:text-foreground prose-strong:font-semibold marker:text-indigo-400">
          {children}
        </div>
      </div>
    </div>
  );
}
