import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Gift, Sparkles, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContent } from '../../context/ContentContext';

interface ProductProps {
  onOrderClick?: () => void;
}

export const Product: React.FC<ProductProps> = ({ onOrderClick }) => {
  const { content } = useContent();
  const data = content?.product || {};
  const data1= content?.offer || {};

  const includes = [
    'چرتکه سوروبان دانش‌آموزی (۲۳ ستون)',
    'دفتر تمرین تمام رنگی استارتر (سطح پایه)',
    'پشتیبانی آنلاین و رفع اشکال توسط مربی'
  ];

  return (
    <section id="product" className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 overflow-hidden relative">
      
      {/* Background Floating Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Decorative Floating Icons */}
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, 10, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute top-20 left-10 text-orange-400 hidden lg:block"
      >
        <Star className="w-12 h-12 fill-current opacity-50" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-20 right-10 text-rose-400 hidden lg:block"
      >
        <Gift className="w-16 h-16 opacity-30" />
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-orange-200 text-orange-600 font-bold mb-6 text-sm shadow-sm">
              <Gift className="w-4 h-4" />
              <span>{data.badge || 'بسته ویژه استارتر'}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-slate-800">
              {data.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">{data.titleHighlight}</span>
            </h2>
            
            <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-8 font-medium">
              {data.subtitle}
            </p>

            <ul className="space-y-4 mb-10">
              {includes.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ x: -5, scale: 1.01 }}
                  className="flex items-center gap-4 p-4 rounded-[2rem] bg-white border-2 border-rose-100 shadow-[0_4px_20px_rgba(251,113,133,0.05)] hover:border-rose-300 hover:shadow-rose-100 transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-slate-700 font-bold text-base lg:text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block w-full sm:w-auto">
                <Button 
                    variant="accent" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg rounded-[2rem] shadow-xl shadow-orange-500/30 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-none" 
                    onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                >
                <Sparkles className="w-5 h-5 ml-2" />
                سفارش و شروع آموزش
                </Button>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative lg:h-full flex items-center justify-center p-4 mt-10 lg:mt-0"
          >
            {/* Main Image Box */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-500/20 border-[12px] border-white bg-white aspect-square w-full max-w-[500px] z-10 group rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 -z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img 
                  src="/images/Untitled-1.png" 
                  alt="بسته آموزش چرتکه" 
                  className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700 shadow-sm"
                />
              </div>
            </div>
            
            {/* Value Tag (Bouncing & Colorful) */}
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="absolute -right-2 md:-right-10 top-1/4 bg-yellow-400 text-slate-900 px-3 py-4 rounded-[2.5rem] font-black shadow-2xl shadow-yellow-500/40 border-[6px] border-white rotate-[12deg] z-20 text-center min-w-[160px]"
            >
              <div className="text-xs opacity-70 mb-1 tracking-wider">
               
              </div>
              <div className="font-tanha text-2xl text-green-700 opacity-60 mb-2">
                
              تخفیف ویژه
              </div>
              {/* <div className="text-lg line-through decoration-rose-500 decoration-4 opacity-60 mb-2">{data.realValue}</div> */}
              {/* <div className="text-xs opacity-70 mb-1 tracking-wider">قیمت با تخفیف</div>
              <div className="text-2xl text-green-700 drop-shadow-sm">{data1?.newPriceValue} تومان</div> */}
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
