import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Sparkles, Star } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface FinalCTAProps {
  onOrderClick?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderClick }) => {
  const { content } = useContent();
  const data = content?.finalCTA || {};

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 mt-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] text-white">
      {/* Animated Background Patterns & Blobs */}
      <div className="absolute inset-0 bg-[url('/images/cubes.png')] opacity-10 mix-blend-overlay"></div>
      
      <motion.div
        animate={{ y: [-20, 20], x: [-10, 10], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-48 h-48 bg-sky-300 rounded-full mix-blend-screen opacity-40 blur-[50px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        className="absolute bottom-10 right-10 w-64 h-64 bg-fuchsia-400 rounded-full mix-blend-screen opacity-40 blur-[60px]"
      />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [-15, 15] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatType: "reverse" }}
        className="absolute top-20 right-[15%] hidden md:block"
      >
        <Star className="w-12 h-12 text-yellow-300 fill-yellow-300 opacity-80" />
      </motion.div>
      <motion.div
        animate={{ y: [15, -15], rotate: [-10, 10] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", repeatType: "reverse" }}
        className="absolute bottom-32 left-[15%] hidden md:block"
      >
        <Sparkles className="w-16 h-16 text-sky-200 opacity-70" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        {/* Bouncing Rocket Icon */}
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 bg-white/20 p-5 rounded-full backdrop-blur-md border-4 border-white/30 shadow-2xl relative"
        >
            <motion.div
                animate={{ y: [-5, 5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "reverse" }}
            >
                <Rocket className="w-16 h-16 text-yellow-300" />
            </motion.div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 max-w-4xl mx-auto leading-tight drop-shadow-lg"
        >
          {data.title1 || 'آماده‌اید'} <span className="text-yellow-300 relative inline-block">
            {data.titleHighlight || 'ماجراجویی'}
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-300 opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
               <path d="M0,10 Q50,20 100,10" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span> {data.title2 || 'را شروع کنیم؟'}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-md"
        >
          {data.subtitle || 'همین حالا بسته استارتر را تهیه کنید و به جمع هزاران کودک خلاق و موفق بپیوندید!'}
        </motion.p>
        
        {/* Chunky 3D Bubbly Button */}
        <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={onOrderClick}
            className="group relative inline-flex items-center justify-center gap-3 bg-yellow-400 text-indigo-900 text-2xl md:text-3xl font-black py-5 px-12 rounded-full shadow-[0_8px_0_rgb(180,83,9),0_15px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_rgb(180,83,9),0_10px_15px_rgba(0,0,0,0.3)] transition-all"
        >
            <span>دریافت بسته استارتر</span>
            <Rocket className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};
