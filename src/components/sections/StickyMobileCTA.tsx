import React from 'react';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // یا motion/react بر اساس پروژه شما
import { useContent } from '../../context/ContentContext';

interface StickyMobileCTAProps {
  show: boolean;
  onOrderClick?: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ show, onOrderClick }) => {
  const { content, getUnifiedPrice } = useContent();
  const data = content || {};
  const { oldPrice, price, unit } = getUnifiedPrice();
  

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed bottom-6 left-4 right-4 p-4 bg-white/95 backdrop-blur-lg border-2 border-sky-100 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] z-50 md:hidden overflow-hidden"
        >
          {/* المان تزیینی پس‌زمینه */}
          <div className="absolute -top-2 -left-2 opacity-20">
            <Sparkles className="text-yellow-400 w-8 h-8 rotate-12" />
          </div>

          <div className="flex items-center justify-between gap-4 relative z-10">
            
            {/* بخش قیمت */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold mb-0.5">
                هدیه ویــژه امروز:
              </span>
              {oldPrice && (
                    <div className="text-rose-500 line-through text-2xl font-bold mb-2 decoration-rose-300 decoration-2">
                        {oldPrice}
                    </div>
                )}
              {/* <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                  {price}
                </span>
                <span className="text-xs font-bold text-indigo-400">
                  {unit}
                </span>
              </div> */}
            </div>

            {/* دکمه ۳ بعدی فانتزی */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95, y: 2 }}
              onClick={onOrderClick}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold py-3 px-6 rounded-2xl shadow-[0_5px_0_rgb(194,65,12)] active:shadow-none transition-all duration-75"
            >
              <ShoppingCart className="w-5 h-5 drop-shadow-sm" />
              <span className="text-xl text-with-600 tracking-tighter">{price}</span>
              <span className="text-xs font-bold text-with-400">
                  {unit}
                </span>
              {/* <span className="text-sm">سفارش سریع</span> */}
              
              {/* انیمیشن درخشش روی دکمه */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 bg-white/20 w-8 -skew-x-12 blur-sm"
              />
            </motion.button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
