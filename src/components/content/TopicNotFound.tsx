import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Search, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopicNotFoundProps {
  categoryId: string;
  slug: string;
}

export const TopicNotFound: React.FC<TopicNotFoundProps> = ({ categoryId, slug }) => {
  const navigate = useNavigate();
  const topicName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
          <AlertCircle className="w-12 h-12 text-red-500/50" />
        </div>
        <div className="absolute -top-2 -right-2 bg-black border border-white/10 p-2 rounded-xl shadow-xl">
          <Search className="w-4 h-4 text-white/40" />
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
        Topic Not Found
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-12 leading-relaxed">
        We couldn't find the content for <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">"{topicName}"</span> in the <span className="text-white capitalize">{categoryId}</span> category. It might be under development or moved.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go Back</span>
        </button>
        <button 
          onClick={() => navigate('/fundamentals/latency-throughput')}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all text-primary hover:scale-[1.02] active:scale-[0.98]"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm font-medium">Browse Fundamentals</span>
        </button>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 rounded-2xl border border-white/[0.03] bg-white/[0.01]">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold">
          Phase 3: Scaling & Databases Sprint 
        </p>
      </div>
    </motion.div>
  );
};
