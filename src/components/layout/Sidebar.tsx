import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { topicTree } from "../../data/topicTree";
import { BookOpen, TrendingUp, Database, MessageSquare, GitBranch, Briefcase, ChevronDown, ChevronRight } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  TrendingUp,
  Database,
  MessageSquare,
  GitBranch,
  Briefcase,
};

export function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([topicTree[0]?.id]);
  const location = useLocation();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-gradient-to-r from-white/[0.015] to-transparent hidden md:block overflow-y-auto relative z-10 transition-all">
      <div className="p-4 space-y-4">
        {topicTree.map((category) => {
          const IconComponent = ICON_MAP[category.icon];
          const isExpanded = expandedCategories.includes(category.id);
          const isCategoryActive = location.pathname.startsWith(`/${category.id}/`);

          return (
            <div key={category.id} className="space-y-1">
              {/* Micro-typography headers */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full group py-1 px-2 hover:bg-white/[0.04] rounded-sm transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className={`w-3.5 h-3.5 transition-all ${isCategoryActive ? "opacity-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "opacity-40"}`} />}
                  <span className={`text-micro transition-colors font-bold uppercase tracking-wider group-hover:!text-white ${isCategoryActive ? "!text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" : "text-foreground/40"}`}>
                    {category.label}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className={`w-3 h-3 transition-colors ${isCategoryActive ? "text-white" : "text-foreground/40 group-hover:text-white"}`} strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="w-3 h-3 text-foreground/40 opacity-80 group-hover:opacity-100 group-hover:text-white transition-all" strokeWidth={2.5} />
                )}
              </button>
              
              {isExpanded && (
                <div className="relative ml-4 mt-1">
                  {/* Structural vertical line track */}
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
                  
                  <ul className="space-y-[2px] pl-[14px] overflow-hidden">
                  {category.topics.map((topic) => (
                    <li key={topic.slug} className="relative">
                      <NavLink
                        to={`/${category.id}/${topic.slug}`}
                        className={({ isActive }) =>
                          `block px-3 py-[6px] text-[13px] rounded-md transition-all relative ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-foreground/50 hover:text-foreground hover:bg-white/[0.03] font-medium"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <>
                                {/* Vertical glowing trunk reaching upwards */}
                                <div className="absolute -left-[14px] bottom-1/2 top-[-1000px] w-[1px] bg-primary shadow-[0_0_8px_rgba(112,93,232,0.6)] z-40" />
                                {/* Horizontal branch connecting to topic */}
                                <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[1px] bg-primary shadow-[0_0_8px_rgba(112,93,232,0.6)] z-40" />
                              </>
                            )}
                            {topic.label}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
