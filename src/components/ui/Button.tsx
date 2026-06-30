import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-[2rem] font-bold transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 hover:-translate-y-1';
    
    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-[0_8px_0_0_#1d4ed8] hover:shadow-[0_4px_0_0_#1d4ed8] active:shadow-none active:translate-y-2',
      secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-[0_8px_0_0_#065f46] hover:shadow-[0_4px_0_0_#065f46] active:shadow-none active:translate-y-2',
      accent: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-[0_8px_0_0_#b45309] hover:shadow-[0_4px_0_0_#b45309] active:shadow-none active:translate-y-2',
      outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30 focus:ring-brand-200 dark:focus:ring-brand-900',
    };

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-8 py-3.5 text-base',
      lg: 'px-10 py-5 text-lg',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
