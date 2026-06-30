import React from 'react';
import { Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 transition-colors text-center">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col items-center justify-center space-y-6">
        
        {/* شماره تماس فوتر */}
        
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 shadow-md">
                    <Phone className="w-5 h-5" />
                </div>
                <a href="tel:08791002848" dir="ltr" className="text-xl font-black tracking-widest text-white">087-91002848</a>
            </div>
            
            <div className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md">
                    <Phone className="w-5 h-5" />
                </div>
                <a href="tel:09185227309" dir="ltr" className="text-xl font-black tracking-widest text-white">0933 329 5601</a>
            </div>
        </div> */}

        <div className="w-full max-w-md border-t border-slate-800/50 pt-6 mt-4">
            <p className="text-sm font-medium text-slate-500">
                © {new Date().getFullYear()} کلیه حقوق محفوظ است.
            </p>
        </div>

      </div>
    </footer>
  );
};

