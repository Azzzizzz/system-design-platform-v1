import { NavLink } from "react-router-dom";
import { topicTree } from "../../data/topicTree";
import { BookOpen, TrendingUp, Database, MessageSquare, GitBranch, Briefcase } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  TrendingUp,
  Database,
  MessageSquare,
  GitBranch,
  Briefcase,
};

export function Sidebar() {
  console.log("Sidebar rendered at:", new Date().toLocaleTimeString());
  return (
    <aside className="w-64 border-r border-[rgba(255,255,255,0.04)] bg-transparent hidden md:block overflow-y-auto relative z-10">
      <div className="p-4 space-y-6">
        {topicTree.map((category) => {
          const IconComponent = ICON_MAP[category.icon];
          return (
            <div key={category.id}>
              {/* Micro-typography headers */}
              <h3 className="flex items-center gap-2 text-micro mb-2 px-2">
                {IconComponent && <IconComponent className="w-3.5 h-3.5 opacity-60" />}
                {category.label}
              </h3>
              <ul className="space-y-[2px]">
                {category.topics.map((topic) => (
                  <li key={topic.slug}>
                    <NavLink
                      to={`/${category.id}/${topic.slug}`}
                      className={({ isActive }) =>
                        `block px-3 py-[6px] text-[13px] rounded-md transition-all font-medium ${
                          isActive
                            ? "bg-white/[0.06] text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                        }`
                      }
                    >
                      {topic.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
