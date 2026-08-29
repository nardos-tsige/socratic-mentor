import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'streak' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary: 'bg-[#059669] dark:bg-[#34D399] text-white dark:text-[#0D1117] font-semibold hover:bg-[#047857] dark:hover:bg-[#6EE7B7] hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] focus:ring-[#059669] dark:focus:ring-[#34D399]',
      secondary: 'bg-white dark:bg-[#161B22] text-[#0F172A] dark:text-[#F0F6FC] border border-[#E2E8F0] dark:border-[#30363D] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] hover:border-[#CBD5E1] dark:hover:border-[#8B949E] focus:ring-[#059669] dark:focus:ring-[#34D399]',
      outline: 'bg-transparent text-[#059669] dark:text-[#34D399] border border-[#059669]/40 dark:border-[#34D399]/40 hover:bg-[#059669]/10 dark:hover:bg-[#34D399]/10 hover:border-[#059669] dark:hover:border-[#34D399] focus:ring-[#059669] dark:focus:ring-[#34D399]',
      ghost: 'bg-transparent text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] focus:ring-[#E2E8F0] dark:focus:ring-[#30363D]',
      streak: 'bg-[#EA580C]/15 dark:bg-[#F0883E]/15 text-[#EA580C] dark:text-[#F0883E] border border-[#EA580C]/30 dark:border-[#F0883E]/30 hover:bg-[#EA580C]/25 dark:hover:bg-[#F0883E]/25 hover:border-[#EA580C]/60 dark:hover:border-[#F0883E]/60 focus:ring-[#EA580C] dark:focus:ring-[#F0883E]',
      danger: 'bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25 dark:hover:bg-red-500/30 focus:ring-red-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2 gap-2 rounded-xl',
      lg: 'text-base px-6 py-3 gap-2.5 rounded-2xl',
      icon: 'p-2 rounded-xl aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

