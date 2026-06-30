import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, MessageCircle, Lightbulb, Sparkles } from 'lucide-react';
import { Accordion } from '../ui/Accordion';
import { useContent } from '../../context/ContentContext';

export const FAQ = () => {
  const { content } = useContent();
  const data = content?.faq || {};

  const faqs = [
    {
      title: data.q1 || 'از چه سنی می‌توانیم ثبت‌نام کنیم؟',
      content: data.a1 || 'بهترین سن برای شروع یادگیری چرتکه بین ۵ تا ۱۲ سال است، زمانی که ذهن کودک بیشترین آمادگی را برای یادگیری دارد.'
    },
    {
      title: data.q2 || 'آیا یادگیری چرتکه به درس ریاضی مدرسه کمک می‌کند؟',
      content: data.a2 || 'بله کاملاً! چرتکه نه تنها سرعت محاسبات را بالا می‌برد، بلکه درک پایه‌ای کودک از اعداد و مفاهیم ریاضی را به شدت تقویت می‌کند.'
    },
    {
      title: data.q3 || 'چقدر طول می‌کشد تا کودک نتایج را نشان دهد؟',
      content: data.a3 || 'معمولاً پس از گذشت ۲ تا ۳ ماه تمرین مداوم، والدین متوجه افزایش تمرکز و سرعت محاسبات ذهنی کودک خود می‌شوند.'
    },
    {
      title: data.q4 || 'آیا نیاز به خرید چرتکه مخصوص داریم؟',
      content: data.a4 || 'بله، در جلسه اول یک پک کامل شامل چرتکه استاندارد سوروبان، کتاب‌های تمرین و لوازم تحریر جذاب به کودک شما تقدیم می‌شود.'
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-white via-cyan-50/40 to-slate-50 dark:from-slate-900 dark:via-cyan-950/10 dark:to-slate-900 transition-colors overflow-hidden">
      
      {/* Playful Background Patterns */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#06b6d4 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0] }} 
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-20 right-10 text-cyan-300 dark:text-cyan-800/50 hidden lg:block"
      >
        <HelpCircle className="w-16 h-16" />
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-12 text-amber-300 dark:text-amber-600/50 hidden lg:block"
      >
        <Lightbulb className="w-14 h-14" />
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 text-cyan-700 dark:text-cyan-300 rounded-full px-5 py-2 font-bold text-sm tracking-wider mb-6 border-2 border-cyan-200 dark:border-cyan-700 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-cyan-500" />
            <span>پاسخ به سوالات شما</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 leading-tight relative inline-block">
            {data.title || 'سوالاتی که مامان باباها می‌پرسند'}
            {/* Playful Marker Underline */}
            <svg className="absolute w-[105%] h-4 -bottom-2 -left-[2%] text-cyan-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10, 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
            </svg>
            <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-amber-400 animate-pulse" />
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mt-4">
            {data.subtitle || 'جواب مهم‌ترین دغدغه‌های شما درباره کلاس‌های چرتکه اینجاست. اگر سوال دیگری دارید حتماً از ما بپرسید!'}
          </p>
        </div>

        {/* FAQ Container (Card Wrap for Accordion) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-8 lg:p-10 border-4 border-slate-100 dark:border-slate-700 shadow-xl shadow-cyan-500/10 relative"
        >
          {/* Decorative small bubble inside card */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full border-4 border-white dark:border-slate-800 z-10 hidden md:block animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-cyan-400 rounded-full border-4 border-white dark:border-slate-800 z-10 hidden md:block animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>

          {/* Accordion Component */}
          <Accordion items={faqs} />
          
        </motion.div>
      </div>
    </section>
  );
};
