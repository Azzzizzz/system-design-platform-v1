import { Link } from "react-router-dom";
import { Search, Command } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 bg-background/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-6 z-50 fixed top-0 w-full">
      <Link to="/" className="flex items-center gap-4">
        <div className="w-5 h-5 rounded-[4px] bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] shadow-[0_0_12px_rgba(112,93,232,0.5)]">
          SD
        </div>
        <h1 className="font-semibold text-[13px] tracking-tight text-foreground/90">System Design</h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Placeholder for ⌘K Search */}
        <button 
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-muted-foreground text-xs hover:border-white/[0.1] hover:bg-white/[0.05] transition-all cursor-text"
          onClick={() => console.log('Open search')}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="font-medium">Search docs...</span>
          <div className="flex items-center gap-0.5 ml-4 opacity-50">
            <Command className="w-3 h-3" /><span>K</span>
          </div>
        </button>
        
        {/* User Profile Stub */}
        <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-colors">
          <span className="text-[10px] font-semibold text-foreground/80">SA</span>
        </div>
      </div>
    </header>
  );
}
