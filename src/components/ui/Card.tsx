import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] rounded-2xl p-6 transition-all duration-200 text-[#0F172A] dark:text-[#F0F6FC] shadow-sm',
          glow && 'shadow-[0_0_20px_rgba(37,99,235,0.1)] dark:shadow-[0_0_20px_rgba(88,166,255,0.15)] border-[#2563EB]/40 dark:border-[#58A6FF]/40',
          interactive && 'hover:border-[#2563EB]/60 dark:hover:border-[#58A6FF]/60 hover:bg-[#F8FAFC] dark:hover:bg-[#1C2128] hover:shadow-md cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

