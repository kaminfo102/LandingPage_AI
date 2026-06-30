import React from 'react';
import { motion } from 'motion/react';
import { Zap, BrainCircuit, Timer, Trophy, Star, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const Benefits = () => {
  const { content } = useContent();
  const data = content?.benefits || {};

  const benefits = [
    {
      icon: <BrainCircuit className="w-10 h-10 lg:w-12 lg:h-12 text-white" />,
      title: 'افزایش تمرکز',
      description: 'کودک شما یاد می‌گیرد چگونه حواس خود را روی یک کار متمرکز کند و از یادگیری لذت ببرد.',
      color: 'from-blue-400 to-indigo-500',
      shadow: 'shadow-blue-500/40',
      borderHover: 'hover:border-blue-400',
      bgHover: 'group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/20'
    },
    {
      icon: <Zap className="w-10 h-10 lg:w-12 lg:h-12 text-white" />,
      title: 'تقویت حافظه',
      description: 'ساخت حافظه تصویری قدرتمند که مثل یک دوربین عکاسی در تمام دروس به او کمک می‌کند.',
      color: 'from-fuchsia-400 to-purple-500',
      shadow: 'shadow-purple-500/40',
      borderHover: 'hover:border-fuchsia-400',
      bgHover: 'group-hover:bg-fuchsia-50/50 dark:group-hover:bg-fuchsia-900/20'
    },
    {
      icon: <Timer className="w-10 h-10 lg:w-12 lg:h-12 text-white" />,
      title: 'سرعت محاسبه',
      description: 'سرعت محاسبات ذهنی کودک شما آنقدر بالا می‌رود که حتی از ماشین‌حساب هم سریع‌تر می‌شود!',
      color: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/40',
      borderHover: 'hover:border-amber-400',
      bgHover: 'group-hover:bg-amber-50/50 dark:group-hover:bg-amber-900/20'
    },
    {
      icon: <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-white" />,
      title: 'اعتماد به نفس',
      description: 'موفقیت در حل سریع مسائل باعث می‌شود کودک به توانایی‌های خود افتخار کند و بدرخشد.',
      color: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-emerald-500/40',
      borderHover: 'hover:border-emerald-400',
      bgHover: 'group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20'
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-950/10 dark:to-slate-900 transition-colors overflow-hidden">
      
      {/* Playful Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#8b5cf6 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-24 left-10 text-amber-300 dark:text-amber-500/50 hidden lg:block"
      >
        <Star className="w-12 h-12 fill-current" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 15, 0], scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 right-12 text-fuchsia-300 dark:text-fuchsia-800/50 hidden lg:block"
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-100 to-purple-100 dark:from-brand-900/50 dark:to-purple-900/50 text-brand-600 dark:text-brand-300 rounded-full px-5 py-2 font-bold text-sm tracking-wider mb-6 border-2 border-brand-200 dark:border-brand-700 shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{data.badge || 'دستاوردها و نتایج'}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 leading-tight relative inline-block">
            {data.title || 'چرا چرتکه جادویی است؟'}
            {/* Wavy Marker Underline */}
            <svg className="absolute w-[110%] h-6 -bottom-4 -left-[5%] text-brand-400 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 10, 50 5 T 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinecap="round" />
            </svg>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-4">
            {data.subtitle || 'با یادگیری چرتکه، ذهن کودک شما به یک ابررایانه تبدیل می‌شود! این فقط بخشی از قدرت‌های جدید اوست:'}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.5 }}
              className={`relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 lg:p-8 pt-12 mt-8 shadow-sm hover:shadow-2xl transition-all duration-300 border-4 border-slate-100 dark:border-slate-700 ${benefit.borderHover} group text-center flex flex-col items-center ${benefit.bgHover}`}
            >
              {/* Floating Icon Container (Popped out of the card) */}
              <div className={`absolute -top-12 w-20 h-20 lg:w-24 lg:h-24 rounded-[1.8rem] bg-gradient-to-br ${benefit.color} shadow-xl ${benefit.shadow} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 z-10 border-4 border-white dark:border-slate-800`}>
                <motion.div
                   animate={{ rotate: [0, 5, -5, 0] }}
                   transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                >
                  {benefit.icon}
                </motion.div>
              </div>

              {/* Sparkles on hover inside card */}
              <Sparkles className="absolute top-4 right-4 w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-300" />
              
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 mt-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-500 transition-colors">
                {benefit.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
