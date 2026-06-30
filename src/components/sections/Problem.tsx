import React from 'react';
import { motion } from 'motion/react';
import { Brain, Calculator, Frown, HelpCircle, AlertCircle } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const Problem = () => {
  const { content } = useContent();
  const data = content?.problem || {};

  const problems = [
    {
      icon: <Brain className="w-10 h-10 text-rose-500 dark:text-rose-400" />,
      title: 'تمرکز پایین',
      description: 'حواس‌پرتی کودک در حین انجام تکالیف و ناتوانی در حفظ تمرکز برای مدت طولانی.',
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      border: 'border-rose-200 dark:border-rose-800/50',
      shadow: 'hover:shadow-[0_10px_30px_rgba(244,63,94,0.2)]'
    },
    {
      icon: <Frown className="w-10 h-10 text-amber-500 dark:text-amber-400" />,
      title: 'ترس از ریاضی',
      description: 'اضطراب و ترس از روبرو شدن با مسائل ریاضی و اعداد بزرگ که باعث کاهش اعتماد به نفس می‌شود.',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-800/50',
      shadow: 'hover:shadow-[0_10px_30px_rgba(245,158,11,0.2)]'
    },
    {
      icon: <Calculator className="w-10 h-10 text-sky-500 dark:text-sky-400" />,
      title: 'محاسبه کُند',
      description: 'وابستگی به انگشتان برای محاسبات ساده و کند بودن در حل مسائل پایه‌ای.',
      bg: 'bg-sky-100 dark:bg-sky-900/30',
      border: 'border-sky-200 dark:border-sky-800/50',
      shadow: 'hover:shadow-[0_10px_30px_rgba(14,165,233,0.2)]'
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/10 dark:to-slate-900 transition-colors">
      
      {/* Playful Background Elements */}
      <div className="absolute top-20 right-[-5%] w-72 h-72 bg-rose-200/20 dark:bg-rose-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob -z-10" />
      <div className="absolute bottom-10 left-[-10%] w-80 h-80 bg-sky-200/20 dark:bg-sky-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob animation-delay-2000 -z-10" />

      {/* Floating Decorative Icons */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [-10, 10, -10] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-32 right-16 text-indigo-200 dark:text-indigo-800/50 hidden lg:block"
      >
        <HelpCircle className="w-16 h-16" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-16 text-rose-200 dark:text-rose-800/50 hidden lg:block"
      >
        <AlertCircle className="w-12 h-12" />
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          {/* Fun Badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>آیا این مشکلات برایتان آشناست؟</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-[1.5] mb-6 relative inline-block">
            {data.title || "چالش‌های همیشگی یادگیری..."}
            {/* Playful SVG Underline */}
            <svg className="absolute w-full h-4 -bottom-3 left-0 text-rose-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15 100 0" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" strokeDasharray="4 4" />
            </svg>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-4">
            {data.subtitle || "بسیاری از کودکان با این مسائل دست و پنجه نرم می‌کنند، اما راه حل ساده‌تر از چیزی است که فکر می‌کنید!"}
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {problems.map((problem, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: index * 0.15 }}
              className={`p-8 rounded-[2.5rem] border-4 ${problem.border} bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group hover:-translate-y-3 ${problem.shadow}`}
            >
              {/* Card Hover Sparkle Effect */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:animate-shimmer" />

              {/* Icon Container with playful bounce */}
              <div className={`w-20 h-20 rounded-[1.5rem] ${problem.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-inner`}>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                >
                  {problem.icon}
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 drop-shadow-sm">
                {problem.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {problem.description}
              </p>

              {/* Decorative dots in card */}
              <div className="absolute top-6 right-6 flex gap-1 opacity-20">
                <div className={`w-2 h-2 rounded-full ${problem.bg.split(' ')[0]}`}></div>
                <div className={`w-2 h-2 rounded-full ${problem.bg.split(' ')[0]}`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Shimmer Animation to global CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(12deg); }
        }
        .group-hover\\:animate-shimmer:hover {
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </section>
  );
};
