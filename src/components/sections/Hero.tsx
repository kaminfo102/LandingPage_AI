import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { PlayCircle, Star, Sparkles, Phone, Rocket, Heart, Smile } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface HeroProps {
  onOrderClick?: () => void;
  onConsultationClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onConsultationClick }) => {
  const { content } = useContent();
  const data = content?.hero || {};
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-28 lg:pb-28 overflow-hidden dark:bg-slate-900 transition-colors">
      {/* Background Magical Gradients */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-50/50 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 -z-20 transition-colors" />
      
      {/* Playful Colorful Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-pink-300/30 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10" />
      <div className="absolute bottom-[-10%] right-[20%] w-80 h-80 bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000 -z-10" />

      {/* Floating Elements (Playful Icons) */}
      <motion.div 
         animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} 
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
         className="absolute top-24 right-12 text-yellow-400 hidden lg:block drop-shadow-md"
      >
        <Star className="w-10 h-10 fill-yellow-400" />
      </motion.div>
      <motion.div 
         animate={{ y: [0, 25, 0], rotate: [0, -20, 0] }} 
         transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
         className="absolute bottom-32 left-16 text-pink-400 hidden lg:block drop-shadow-md"
      >
        <Heart className="w-12 h-12 fill-pink-400" />
      </motion.div>
      <motion.div 
         animate={{ y: [0, -15, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }} 
         transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2 }}
         className="absolute top-40 left-1/3 text-cyan-400 hidden lg:block drop-shadow-md opacity-60"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Top Attention Grabber */}
        <div className="flex justify-center lg:justify-start w-full mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-sm sm:text-base shadow-[0_4px_15px_rgba(236,72,153,0.4)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.6)] hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <Rocket className="w-5 h-5 animate-pulse" />
            <span>تغییر در کودکان خود را باور نخواهید کرد!</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1 text-center lg:text-right flex flex-col items-center lg:items-start"
          >
            {/* Small Badge */}
            <div className="group mb-6 relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-indigo-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-700 dark:text-indigo-300 font-extrabold text-xs sm:text-sm tracking-wide">
                {data.badge || "شروع یک مسیر هیجان‌انگیز"}
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="font-tanha text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-[1.5] mb-6 drop-shadow-sm">
              {/* {data.title1}{' '} */}
              آموزش چرتکه هدیه‌ای است که تاثیر آن تا پایان عمر برای کودک شما مفید خواهد بود .
              <span className="font-shabnam text-2xl lg:text-4xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 relative inline-block">
                {/* {data.title2} */}
                از این فرصت ویژه استفاده کنید
                <svg className="absolute w-[110%] h-4 -bottom-2 -right-2 text-yellow-400 opacity-90 drop-shadow-md" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 0" stroke="currentColor" strokeWidth="5" fill="transparent" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            {/* Subtitle / Fun Fact */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 font-bold text-sm lg:text-xl mb-10 border-2 border-dashed border-teal-200 dark:border-teal-800/60 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <Smile className="w-6 h-6 text-teal-500" />
              <span>{data.subtitle || "یادگیری ریاضی با طعم بازی و شادی!"}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 w-full lg:w-auto px-4 lg:px-0">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 rounded-2xl text-lg font-bold transition-all duration-300 hover:-translate-y-1" 
                onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}
              >
                دریافت بسته شروع چرتکه
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto gap-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-lg font-bold transition-all duration-300 hover:-translate-y-1" 
                onClick={onConsultationClick}
              >
                <Phone className="w-5 h-5 flex-shrink-0 text-indigo-500" />
                <span>مشاوره رایگان</span>
              </Button>
            </div>
          </motion.div>
          
          {/* Video / Visual */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ type: "spring", duration: 1.2, delay: 0.2 }}
             className="order-1 lg:order-2 relative"
          >
            {/* Playful Background Frames */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400 to-orange-300 rounded-[2.5rem] -z-20 rotate-6 transform transition-transform duration-500 hover:rotate-12 opacity-50 blur-sm"></div>
            <div className="absolute -inset-2 bg-gradient-to-bl from-indigo-400 to-cyan-300 rounded-[2.5rem] -z-10 -rotate-3 transform transition-transform duration-500 hover:-rotate-6 opacity-70"></div>
            
            {/* Main Video Container */}
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative bg-slate-900 border-4 border-white dark:border-slate-800 group z-10 w-full flex">
              <video 
                ref={videoRef}
                src="/videos/why_abacus.mp4" 
                poster={data.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                controls={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
              />
              {!isPlaying && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80"></div>
                  <button 
                    onClick={handlePlayClick}
                    className="absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer focus:outline-none"
                    aria-label="پخش ویدیو"
                  >
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {/* Play Button Glow */}
                      <div className="absolute inset-0 bg-white/40 dark:bg-slate-800/60 rounded-full backdrop-blur-md animate-ping opacity-70"></div>
                      <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                        <PlayCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400 ml-1.5" />
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
            
          </motion.div>
          
        </div>
      </div>

      {/* Add keyframes for blob animation in your global css or tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </section>
  );
};
