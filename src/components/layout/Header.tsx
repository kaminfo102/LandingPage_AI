import React, { useState, useEffect } from 'react';
import { Moon, Sun, Phone } from 'lucide-react';

interface HeaderProps {
    onConsultationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onConsultationClick }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Init theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (

        <div className="sticky top-0 z-50 w-full flex flex-col">
            {/* Top Contact Bar */}
            {/* <div className="bg-brand-600 dark:bg-brand-800 text-white py-1.5 px-4 flex justify-center sm:justify-between items-center text-xs sm:text-sm font-bold tracking-wider shadow-sm z-50">
                <span className="hidden sm:inline-flex items-center gap-2">
                    ارتباط سریع با ما:
                </span>
                <div className="flex items-center gap-4 sm:gap-6">
                    <a href="tel:08791002848" dir="ltr" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        087-91002848
                    </a>
                    <a href="tel:09185227309" dir="ltr" className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        0933 329 5601
                    </a>
                </div>
            </div> */}

            <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-amber-400/40 rotate-[5deg] hover:rotate-[-5deg] transition-transform duration-300 border-2 border-amber-300">
                    <img 
                  src='/images/default-profile.png' 
                  alt="بسته آموزش چرتکه" 
                  className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700"
                />
                        {/* <span className="relative z-10 text-brand-900">هـ</span> */}
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
                    </div>
                    <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight flex items-center hidden sm:flex">
                        کودکان<span className="text-brand-500 dark:text-brand-400">هوشمـــند</span>
                        {/* <span className="text-xl ml-1">🚀</span> */}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Consultation Button */}
                    <button 
                        onClick={onConsultationClick}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-[2rem] bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold transition-colors border border-amber-200 dark:border-amber-800"
                    >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm">تماس / مشاوره</span>
                    </button>

                    {/* Theme Toggle */}
                    <button 
                    onClick={toggleTheme} 
                    className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-110 active:scale-95"
                    aria-label="Toggle Dark Mode"
                    >
                        {isDark ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6 text-brand-500" />}
                    </button>
                </div>
            </div>
        </header>
        </div>
    );
};
