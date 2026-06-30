import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'در حال پردازش...', fullScreen = false }) => {
  const { content } = useContent();
//   const defaultLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>";
  const defaultLogo='/images/logo.png';
  // Try to use a logo from our context if available, otherwise fallback
//   const logoUrl = content?.navbar?.logo || defaultLogo;
  const logoUrl = 'images/default-profile.png';

  const contentNode = (
    <div className="flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="relative w-24 h-24 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 dark:border-t-brand-500"
        ></motion.div>
        
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-brand-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-3 shadow-inner"
        >
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="w-full h-full object-contain drop-shadow-sm" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultLogo;
            }} 
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-brand-700 dark:text-brand-300 font-bold text-lg tracking-wide"
      >
        {message}
      </motion.div>
      
      <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400"
            />
          ))}
        </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        {contentNode}
      </div>
    );
  }

  return contentNode;
};
