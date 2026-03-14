import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { topicTree } from "../../data/topicTree";

export function RelatedTopics({ slugs }: { slugs: string[] }) {
  // Find full topic data based on slugs
  const relatedTopics = slugs.map((slug) => {
    for (const category of topicTree) {
      const found = category.topics.find((t) => t.slug === slug);
      if (found) {
        return { ...found, categoryId: category.id };
      }
    }
    return null;
  }).filter(Boolean);

  if (relatedTopics.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold tracking-tight text-foreground/90 mb-4">Related Topics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedTopics.map((topic: any) => (
          <Link
            key={topic.slug}
            to={`/${topic.categoryId}/${topic.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-primary/60 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                {topic.categoryId}
              </div>
              <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:-rotate-45 transition-all text-primary" />
            </div>
            <span className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">
              {topic.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
