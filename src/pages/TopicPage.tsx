import { useParams } from "react-router-dom";
import { MDXRenderer } from "../components/content/MDXRenderer";

export function TopicPage() {
  const { categoryId, slug } = useParams();

  if (!categoryId || !slug) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
      <div className="space-y-4 mb-12">
        <div className="text-[11px] font-mono text-primary/70 tracking-widest uppercase bg-primary/10 inline-block px-2 py-1 rounded-md border border-primary/20 shadow-[0_0_15px_rgba(112,93,232,0.15)]">
          {categoryId}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter-plus text-foreground">
          {slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
      </div>

      <MDXRenderer categoryId={categoryId} slug={slug} />
    </div>
  );
}
