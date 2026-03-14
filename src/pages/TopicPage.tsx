import { useParams } from "react-router-dom";

export function TopicPage() {
  const { categoryId, slug } = useParams();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="text-xs font-mono text-primary/60 tracking-wider uppercase">
          {categoryId}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter-plus text-foreground">
          {slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed pt-2">
          This is a placeholder page for the {slug} topic. MDX rendering will be implemented in Phase 2.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.6)] backdrop-blur-md">
        <div className="text-center text-muted-foreground text-sm">
          Interactive Architecture Diagram Placeholder
        </div>
      </div>
    </div>
  );
}
