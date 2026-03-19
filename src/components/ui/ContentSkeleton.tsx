export function ContentSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Article Header Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-20 animate-shimmer rounded-md border border-white/5" />
        <div className="h-12 w-3/4 animate-shimmer rounded-xl" />
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-1/4 animate-shimmer rounded-lg mb-6" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-shimmer rounded-md" />
              <div className="h-4 w-[95%] animate-shimmer rounded-md" />
              <div className="h-4 w-[98%] animate-shimmer rounded-md" />
              <div className="h-4 w-[85%] animate-shimmer rounded-md" />
            </div>
          </div>
        ))}

        {/* Big Block (Diagram/Sim placeholder) */}
        <div className="space-y-4">
          <div className="h-72 w-full animate-shimmer rounded-2xl border border-white/[0.05] bg-white/[0.01]" />
          <div className="h-4 w-1/2 animate-shimmer rounded-md mx-auto opacity-50" />
        </div>

        {/* More text content */}
        <div className="space-y-3">
          <div className="h-4 w-full animate-shimmer rounded-md" />
          <div className="h-4 w-[92%] animate-shimmer rounded-md" />
          <div className="h-4 w-[40%] animate-shimmer rounded-md" />
        </div>
      </div>

      {/* Footer / Related Items Skeleton */}
      <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="h-32 animate-shimmer rounded-xl border border-white/5" />
        <div className="h-32 animate-shimmer rounded-xl border border-white/5" />
      </div>
    </div>
  );
}
