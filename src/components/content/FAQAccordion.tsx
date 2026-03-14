import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 my-8">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index}
            className={`group rounded-xl border border-white/[0.08] transition-all duration-300 overflow-hidden ${
              isOpen ? 'bg-white/[0.04] border-white/[0.15] shadow-lg' : 'bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40 group-hover:text-white/60'}`}>
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                  {item.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-white/20"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="px-11 pb-5 pt-0">
                    <div className="h-px w-full bg-white/[0.05] mb-4" />
                    <div className="text-sm leading-relaxed text-white/50 bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent">
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
