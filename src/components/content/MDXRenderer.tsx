import { lazy, Suspense, useMemo } from "react";
import { TradeoffCard } from "./TradeoffCard";
import { InterviewAnswer } from "./InterviewAnswer";
import { KeyTakeaways } from "./KeyTakeaways";
import { RelatedTopics } from "./RelatedTopics";
import { ArchitectureCanvas } from "../diagram/ArchitectureCanvas";
import { LoadBalancerSim } from "../simulation/LoadBalancerSim";

// Import all MDX files
const mdxModules = import.meta.glob("../../content/**/*.mdx");

const mdxComponents = {
  TradeoffCard,
  InterviewAnswer,
  KeyTakeaways,
  RelatedTopics,
  ArchitectureCanvas,
  SimulationEmbed: ({ type }: { type: string }) => {
    if (type === 'load-balancer') return <LoadBalancerSim />;
    return (
      <div className="w-full h-64 border border-white/[0.08] bg-black/40 rounded-xl flex items-center justify-center text-sm text-white/50 my-8">
        SimulationEmbed: {type} (Pending Phase 4)
      </div>
    );
  },
  // Basic HTML element overrides for Linear typography
  h2: ({ children }: any) => <h2 className="text-2xl font-semibold tracking-tight text-foreground/90 mt-12 mb-6">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-semibold tracking-tight text-foreground/80 mt-8 mb-4">{children}</h3>,
  p: ({ children }: any) => <p className="text-base text-foreground/70 leading-relaxed mb-6">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc pl-5 mb-6 space-y-2 text-foreground/70">{children}</ul>,
  pre: ({ children }: any) => <pre className="p-4 rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-x-auto text-[13px] leading-relaxed mb-6 text-foreground/80 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">{children}</pre>,
  code: ({ children, className }: any) => {
    const isInline = !className;
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[13px] font-mono text-primary/80 border border-white/[0.04]">{children}</code>
    ) : (
      <code className={className}>{children}</code>
    );
  },
};

export function MDXRenderer({ categoryId, slug }: { categoryId: string; slug: string }) {
  // Find the matching MDX file loader function
  const modulePath = `../../content/${categoryId}/${slug}.mdx`;
  const loader = mdxModules[modulePath];

  // Lazy load the component
  const ContentComponent = useMemo(() => {
    if (!loader) return null;
    return lazy(loader as any);
  }, [loader]);

  if (!ContentComponent) {
    return (
      <div className="text-red-400 p-4 border border-red-500/20 bg-red-500/10 rounded-xl">
        Failed to load content: {modulePath} not found.
      </div>
    );
  }

  return (
    <div className="mdx-content pb-20">
      <Suspense fallback={<div className="animate-pulse h-32 bg-white/5 rounded-xl border border-white/10" />}>
        <ContentComponent components={mdxComponents} />
      </Suspense>
    </div>
  );
}
