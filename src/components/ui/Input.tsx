import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-[#64748B] dark:text-[#8B949E] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] text-[#0F172A] dark:text-[#F0F6FC] rounded-xl px-4 py-2.5 text-sm',
            'placeholder:text-[#94A3B8] dark:placeholder:text-[#8B949E] focus:outline-none focus:border-[#059669] dark:focus:border-[#34D399] focus:ring-2 focus:ring-[#059669]/20 dark:focus:ring-[#34D399]/20 transition-all duration-200 shadow-xs',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

