import { useState } from "react";
import { ChevronRight, LayoutDashboard, Grid, Database, Zap, BookOpen, Search, Command } from "lucide-react";
import "./index.css";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Fundamentals", items: ["CAP Theorem", "Latency vs Throughput", "Consistency Models", "Load Balancers"] },
  { icon: Grid, label: "Scaling", items: ["Database Sharding", "Caching Strategies"] },
  { icon: Database, label: "Databases", items: ["Indexing", "SQL vs NoSQL"] },
  { icon: Zap, label: "Messaging", items: ["Kafka", "RabbitMQ", "Event-Driven"] },
  { icon: BookOpen, label: "Patterns", items: ["Circuit Breaker", "Saga Pattern"] },
];

export default function App() {
  const [activeItem] = useState("Load Balancers");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-500">
      
      {/* Topbar (Linear Deep Glass Style) */}
      <header className="h-14 bg-background/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-6 z-50 fixed top-0 w-full">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-[4px] bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] shadow-[0_0_12px_rgba(112,93,232,0.5)]">
            SD
          </div>
          <h1 className="font-semibold text-[13px] tracking-tight text-foreground/90">System Design</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-muted-foreground text-xs hover:border-white/[0.1] hover:bg-white/[0.05] transition-all cursor-pointer">
            <Search className="w-3.5 h-3.5" />
            <span className="font-medium">Search docs...</span>
            <div className="flex items-center gap-0.5 ml-4 opacity-50">
              <Command className="w-3 h-3" /><span>K</span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-colors">
            <span className="text-[10px] font-semibold text-foreground/80">SA</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14 h-full relative">
        
        {/* Phase A/C: Atmospheric Background Lighting */}
        <div className="bg-glow top-0 left-1/4" />
        <div className="bg-glow bottom-0 right-1/4 opacity-10" />

        {/* Sidebar (Linear Minimalist Style) */}
        <aside className="w-64 border-r border-[rgba(255,255,255,0.04)] bg-transparent hidden md:block overflow-y-auto relative z-10">
          <div className="p-4 space-y-6">
            {SIDEBAR_LINKS.map((section, idx) => (
              <div key={idx}>
                {/* Micro-typography headers */}
                <h3 className="flex items-center gap-2 text-micro mb-2 px-2">
                  <section.icon className="w-3.5 h-3.5 opacity-60" />
                  {section.label}
                </h3>
                <ul className="space-y-[2px]">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className={`block px-3 py-[6px] text-[13px] rounded-md transition-all font-medium ${
                          activeItem === item 
                            ? "bg-white/[0.06] text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                        }`}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-14 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            
            {/* Header / Breadcrumbs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium uppercase tracking-[0.05em]">
                <span className="hover:text-foreground cursor-pointer transition-colors">Fundamentals</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                <span className="text-foreground">Load Balancers</span>
              </div>

              {/* Phase B: Dual-Tone High Contrast Headline */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter-plus text-foreground/90">
                <span className="text-white">Load Balancers.</span> <span className="text-muted-foreground">The traffic cops of system design.</span>
              </h1>
              <p className="text-[17px] text-[#8A8F98] max-w-2xl leading-relaxed tracking-normal">
                Sitting in front of your servers, they route client requests across all servers capable of fulfilling those requests, maximizing speed and capacity.
              </p>
            </div>

            {/* Simulated Diagram Area (Phase C: Line Art + Glowing Particles) */}
            <div className="w-full linear-card aspect-[16/9] flex items-center justify-center relative group">
              
              {/* Ultra-faint grid backing */}
              <div className="absolute inset-0 z-0 opacity-[0.2]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <div className="flex flex-col items-center gap-8 z-10 w-full">
                <div className="flex items-center justify-center w-full gap-12">
                  
                  {/* Client (Line Art Style) */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="px-5 py-2.5 rounded-lg bg-black/50 backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-[#ECECEC] font-medium text-[13px] flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                       Client
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="relative w-24 h-[1px] bg-[rgba(255,255,255,0.1)]">
                    <div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_#705DE8] -translate-y-1/2 animate-[ping-pong_2s_ease-in-out_infinite]" style={{ animationName: 'traffic-flow' }} />
                    <style>{`
                      @keyframes traffic-flow {
                        0% { left: 0; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { left: 100%; opacity: 0; }
                      }
                    `}</style>
                  </div>

                  {/* Load Balancer (Accent Focus) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="px-6 py-3.5 rounded-xl bg-[rgba(112,93,232,0.1)] border border-[rgba(112,93,232,0.4)] text-primary font-semibold text-[14px] shadow-[0_0_30px_rgba(112,93,232,0.1)] backdrop-blur-md">
                      Load Balancer
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="relative w-24 h-[1px] bg-[rgba(255,255,255,0.1)]">
                     <div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_#705DE8] -translate-y-1/2 animate-[ping-pong_2s_ease-in-out_infinite]" style={{ animationName: 'traffic-flow', animationDelay: '0.4s' }} />
                  </div>

                  {/* Servers (Line Art Minimal) */}
                  <div className="flex flex-col gap-4">
                    <div className="px-5 py-2 rounded-md bg-black/40 border border-[rgba(255,255,255,0.1)] text-[#ECECEC] text-[13px] font-medium">Server A</div>
                    <div className="px-5 py-2 rounded-md bg-black/40 border border-[rgba(255,255,255,0.2)] text-white text-[13px] font-medium relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                       <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                       <span className="pl-1">Server B</span>
                    </div>
                    <div className="px-5 py-2 rounded-md bg-black/40 border border-[rgba(255,255,255,0.1)] text-[#ECECEC] text-[13px] font-medium">Server C</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Tradeoffs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="linear-card p-6 border-[rgba(255,255,255,0.04)]">
                <h3 className="font-semibold text-[13px] text-white mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" /> Advantages
                </h3>
                <ul className="space-y-3 text-[14px] text-muted-foreground">
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Prevents requests from going to unhealthy servers.</li>
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Adds redundancy and mitigates failures seamlessly.</li>
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Scales horizontally by adding servers to the pool.</li>
                </ul>
              </div>
              <div className="linear-card p-6 border-[rgba(255,255,255,0.04)]">
                <h3 className="font-semibold text-[13px] text-white mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-30" /> Disadvantages
                </h3>
                <ul className="space-y-3 text-[14px] text-muted-foreground">
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Can become a single point of failure without active-passive setups.</li>
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Increases architectural complexity and infrastructure costs.</li>
                  <li className="flex gap-3 leading-snug"><span className="text-white/20 mt-0.5">•</span> Introduces slight latency due to the extra network hop.</li>
                </ul>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
