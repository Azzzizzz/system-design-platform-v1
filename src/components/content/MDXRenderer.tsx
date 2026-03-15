import { lazy, Suspense, useMemo } from "react";
import { TradeoffCard } from "./TradeoffCard";
import { FAQAccordion } from "./FAQAccordion";
import { KnowledgeSnippet } from "./KnowledgeSnippet";
import { KeyTakeaways } from "./KeyTakeaways";
import { RelatedTopics } from "./RelatedTopics";
import { ArchitectureCanvas } from "../diagram/ArchitectureCanvas";
import { LoadBalancerSim } from "../simulation/LoadBalancerSim";
import ConsistentHashingSim from "../simulation/ConsistentHashingSim";
import { LatencyThroughputSim } from "../simulation/LatencyThroughputSim";
import { CapTheoremSim } from "../simulation/CapTheoremSim";
import { ConsistencyModelsSim } from "../simulation/ConsistencyModelsSim";
import { TopicNotFound } from "./TopicNotFound";
import { InterviewAnswer } from "./InterviewAnswer";

import { RateLimitingSim } from "../simulation/RateLimitingSim";
import { ScalingComparison } from "../simulation/ScalingComparison";

// Import all MDX files
const mdxModules = import.meta.glob("../../content/**/*.mdx");

const mdxComponents = {
  TradeoffCard,
  FAQAccordion,
  KnowledgeSnippet,
  KeyTakeaways,
  RelatedTopics,
  ArchitectureCanvas,
  InterviewAnswer,
  ConsistentHashingSim,
  LatencyThroughputSim,
  CapTheoremSim,
  ConsistencyModelsSim,
  SimulationEmbed: ({ type }: { type: string }) => {
    if (type === 'load-balancer') return <LoadBalancerSim />;
    if (type === 'consistent-hashing') return <ConsistentHashingSim />;
    if (type === 'latency-throughput') return <LatencyThroughputSim />;
    if (type === 'cap-theorem') return <CapTheoremSim />;
    if (type === 'consistency-models') return <ConsistencyModelsSim />;
    if (type === 'rate-limiting') return <RateLimitingSim />;
    if (type === 'scaling-comparison') return <ScalingComparison />;
    return (
      <div className="w-full h-64 border border-white/[0.08] bg-black/40 rounded-xl flex items-center justify-center text-sm text-white/50 my-8">
        SimulationEmbed: {type} (Pending Phase 4)
      </div>
    );
  },
  // Basic HTML element overrides for Linear typography
  h2: ({ children }: any) => <h2 className="text-2xl font-semibold tracking-tighter-plus text-foreground/95 mt-16 mb-8 border-b border-white/5 pb-2">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-xl font-medium tracking-tight text-foreground/80 mt-10 mb-5">{children}</h3>,
  p: ({ children }: any) => <p className="text-base text-foreground/70 leading-relaxed mb-6">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc pl-5 mb-8 space-y-3 text-foreground/65 leading-relaxed">{children}</ul>,
  table: ({ children }: any) => (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden my-10 shadow-lg">
      <table className="w-full text-left border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-white/[0.03] border-b border-white/5">{children}</thead>,
  th: ({ children }: any) => <th className="px-6 py-4 font-semibold text-foreground/90">{children}</th>,
  td: ({ children }: any) => <td className="px-6 py-4 border-b border-white/[0.02] text-foreground/70">{children}</td>,
  pre: ({ children }: any) => <pre className="p-5 rounded-xl bg-[#080808] border border-white/[0.06] overflow-x-auto text-[13px] leading-relaxed my-8 text-foreground/85 font-mono shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">{children}</pre>,
  code: ({ children, className }: any) => {
    const isInline = !className;
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[13px] font-mono text-primary/90 border border-white/[0.04]">{children}</code>
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
    return <TopicNotFound categoryId={categoryId} slug={slug} />;
  }

  const Skeleton = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="h-8 w-1/3 animate-shimmer rounded-lg" />
      <div className="space-y-3">
        <div className="h-4 w-full animate-shimmer rounded-md" />
        <div className="h-4 w-5/6 animate-shimmer rounded-md" />
        <div className="h-4 w-4/6 animate-shimmer rounded-md" />
      </div>
      <div className="h-64 w-full animate-shimmer rounded-2xl" />
    </div>
  );

  return (
    <div className="mdx-content pb-20">
      <Suspense fallback={<Skeleton />}>
        <ContentComponent components={mdxComponents} />
      </Suspense>
    </div>
  );
}
