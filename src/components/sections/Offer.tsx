import React from 'react';
import { motion } from 'motion/react';
import { Gift, Clock, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface OfferProps {
  onOrderClick?: () => void;
}

export const Offer: React.FC<OfferProps> = ({ onOrderClick }) => {
  const { content, wooProduct, getUnifiedPrice } = useContent();
  const data = content?.offer || {};
  
  const { price, oldPrice, unit } = getUnifiedPrice();
  const displayTitle = wooProduct ? wooProduct.name : (data.title || 'بسته شگفت‌انگیز یادگیری!');

  return (
    <section id="offer" className="py-24 bg-gradient-to-b from-violet-50 to-fuchsia-50 relative overflow-hidden">
      {/* Animated Background Blobs & Decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-[80px]"
      />
      <motion.div
        animate={{ y: [-20, 20], x: [-10, 10] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', repeatType: 'reverse' }}
        className="absolute bottom-0 -left-20 w-96 h-96 bg-violet-200/40 rounded-full blur-[80px]"
      />
      <Star className="absolute top-1/4 left-10 w-8 h-8 text-amber-400 animate-spin-slow opacity-60 hidden md:block" />
      <Sparkles className="absolute bottom-1/4 right-10 w-10 h-10 text-fuchsia-400 animate-pulse opacity-60 hidden md:block" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
          className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-violet-100 flex flex-col md:flex-row relative"
        >
          {/* Main Info Section */}
          <div className="p-8 md:p-14 md:w-3/5 lg:w-2/3 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-rose-100 text-rose-600 font-black text-sm rounded-full mb-6 border-2 border-rose-200 w-max shadow-sm"
            >
              <Clock className="w-5 h-5 animate-pulse" />
              <span>{data.badge || 'فرصت محدود'}</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-8 leading-tight"
            >
              {displayTitle}
            </motion.h2>

            <ul className="space-y-5 mb-2">
               {[
                 { text: "ارسال سریع با پست پیشتاز", color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
                 { text: "پشتیبانی اختصاصی و مهربان", color: "text-violet-600", bg: "bg-violet-100", border: "border-violet-200" }
               ].map((item, idx) => (
                 <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-center gap-4 text-slate-700 font-bold text-lg"
                 >
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} border-2 ${item.border} flex items-center justify-center transform rotate-3`}>
                       <ShieldCheck className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span>{item.text}</span>
                 </motion.li>
               ))}
            </ul>
          </div>

          {/* Pricing Box - Styled like a fun gift card */}
          <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-white p-8 md:p-12 md:w-2/5 lg:w-1/3 flex flex-col justify-center items-center text-center relative overflow-hidden border-t-4 md:border-t-0 md:border-r-4 border-white/20">
            {/* Inner background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
            
            <motion.div
                animate={{ y: [-5, 5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatType: "reverse" }}
                className="relative z-10 bg-white/20 p-4 rounded-[2rem] backdrop-blur-sm mb-6 border-2 border-white/30 shadow-lg"
            >
                {wooProduct && wooProduct.images && wooProduct.images.length > 0 ? (
                  <img src={wooProduct.images[0].src} alt={wooProduct.images[0].alt || wooProduct.name} className="w-32 h-32 object-cover rounded-xl shadow-inner" />
                ) : (
                  <Gift className="w-12 h-12 text-white" />
                )}
            </motion.div>
            
            <div className="relative z-10 w-full">
                {oldPrice && (
                    <div className="text-rose-100 line-through text-2xl font-bold mb-2 decoration-rose-600 decoration-4">
                        {oldPrice}
                    </div>
                )}
                <div className="text-5xl lg:text-6xl font-black mb-10 flex items-baseline justify-center gap-2 drop-shadow-xl">
                <span>{price}</span>
                <span className="text-xl font-bold opacity-90">{unit}</span>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOrderClick}
                    className="w-full bg-white text-rose-600 text-2xl font-black py-4 px-8 rounded-2xl shadow-[0_8px_0_rgb(225,29,72)] hover:shadow-[0_4px_0_rgb(225,29,72)] hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-6 h-6" />
                    ثبت سفارش
                </motion.button>
                
                <div className="inline-block mt-8 bg-black/15 border border-white/20 px-5 py-2 rounded-full text-sm font-bold shadow-inner">
                    {data.capacity || 'ظرفیت رو به اتمام است!'}
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
