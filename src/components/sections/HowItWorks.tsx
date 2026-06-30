import React from 'react';
import { Package, Video, Target, Map, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../../context/ContentContext';

// کامپوننت SVG برای خط زیرین موج‌دار و انیمیشنی
const WavyUnderline = () => (
    <svg className="w-48 h-4 text-amber-400" viewBox="0 0 194 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            d="M2 13.5225C31.5435 6.05346 114.619 -10.3603 192 13.5225"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
        />
    </svg>
);


export const HowItWorks = () => {
  const { content } = useContent();
  const data = content?.howItWorks || {};

  const steps = [
    {
      num: '۰۱',
      icon: <Package className="w-10 h-10 text-rose-500" />,
      title: 'دریافت بسته',
      description: 'پس از ثبت سفارش، بسته استارتر برای شما ارسال می‌شود و طی ۲ تا ۴ روز کاری به دستتان می‌رسد.',
      colors: {
        bg: 'bg-rose-100',
        border: 'border-rose-200',
        text: 'text-rose-600',
        numBg: 'bg-rose-500',
        shadow: 'shadow-rose-400/10'
      }
    },
    {
      num: '۰۲',
      icon: <Video className="w-10 h-10 text-teal-500" />,
      title: 'شروع آموزش در خانه',
      description: 'همراه با فرزندتان ویدیوهای آموزشی گام‌به‌گام را ببینید و تمرینات دفتر را روزی ۱۵ دقیقه انجام دهید.',
      colors: {
        bg: 'bg-teal-100',
        border: 'border-teal-200',
        text: 'text-teal-600',
        numBg: 'bg-teal-500',
        shadow: 'shadow-teal-400/10'
      }
    },
    {
      num: '۰۳',
      icon: <Target className="w-10 h-10 text-amber-500" />,
      title: 'ادامه مسیر هیجان‌انگیز',
      description: 'در صورت علاقه و مشاهده پیشرفت، می‌توانید پس از یک ماه در ترم‌های پیشرفته‌تر ما ثبت‌نام کنید.',
      colors: {
        bg: 'bg-amber-100',
        border: 'border-amber-200',
        text: 'text-amber-600',
        numBg: 'bg-amber-500',
        shadow: 'shadow-amber-400/10'
      }
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-teal-50 via-green-50 to-amber-50 overflow-hidden relative">
      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [-10, 10], x: [-5, 5] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', repeatType: 'reverse' }}
        className="absolute -top-10 -left-10 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [15, -15] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', repeatType: 'reverse' }}
        className="absolute -bottom-16 -right-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl"
      />
      <Sparkles className="absolute top-24 right-1/4 w-8 h-8 text-amber-300 opacity-80 animate-pulse hidden lg:block" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-teal-200 text-teal-600 font-bold mb-6 text-sm shadow-sm">
                <Map className="w-4 h-4" />
                <span>{data.badge || 'نقشه راه یادگیری'}</span>
            </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            {data.title || 'چطور کار می‌کنه؟'}
          </h2>
          <div className="flex justify-center mb-6">
            <WavyUnderline />
          </div>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto">
            {data.subtitle || 'ما یک مسیر ۳ مرحله‌ای ساده و جذاب طراحی کردیم تا فرزند شما به راحتی وارد دنیای شگفت‌انگیز چرتکه شود.'}
          </p>
        </div>

        <div className="relative">
          {/* Dashed & Wavy Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-full -mt-10">
            <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <motion.path
                d="M 100,50 C 300,10 400,90 600,50 C 800,10 900,50 900,50"
                fill="none"
                stroke="#d1fae5" /* emerald-100 */
                strokeWidth="6"
                strokeDasharray="15 15"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                className={`relative z-10 flex flex-col items-center text-center bg-white/60 backdrop-blur-md border-4 p-6 lg:p-8 rounded-[2.5rem] shadow-lg group ${step.colors.border} ${step.colors.shadow}`}
              >
                <div className={`w-28 h-28 ${step.colors.bg} rounded-full flex items-center justify-center mb-6 border-8 ${step.colors.border} relative transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {step.icon}
                  <div className={`absolute -top-4 -right-2 w-12 h-12 rounded-full ${step.colors.numBg} text-white flex items-center justify-center font-black text-lg border-4 border-white`}>
                    {step.num}
                  </div>
                </div>
                <h3 className={`text-2xl font-black ${step.colors.text} mb-4`}>{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
