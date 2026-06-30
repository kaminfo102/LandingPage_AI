import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => {
  return (
    <div className={`border-2 rounded-[1.5rem] mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'border-brand-500 shadow-md bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-brand-300 dark:hover:border-brand-700'}`}>
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-right focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-relaxed">{title}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 transition-colors ${isOpen ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-300 leading-loose">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: { title: string; content: string }[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => toggleItem(index)}
        />
      ))}
    </div>
  );
};
