import React from 'react';
import { cn } from '../../lib/utils';
import { GuidanceType } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'streak' | 'eureka' | 'category' | 'outline' | GuidanceType;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants: Record<string, string> = {
    default: 'bg-[#F1F5F9] dark:bg-[#21262D] text-[#475569] dark:text-[#8B949E] border border-[#CBD5E1] dark:border-[#30363D]',
    streak: 'bg-[#EA580C]/15 dark:bg-[#F0883E]/15 text-[#EA580C] dark:text-[#F0883E] border border-[#EA580C]/30 dark:border-[#F0883E]/30 font-semibold',
    eureka: 'bg-[#16A34A]/15 dark:bg-[#3FB950]/15 text-[#16A34A] dark:text-[#3FB950] border border-[#16A34A]/30 dark:border-[#3FB950]/30 font-semibold',
    category: 'bg-[#7C3AED]/15 dark:bg-[#BC8CFF]/15 text-[#7C3AED] dark:text-[#BC8CFF] border border-[#7C3AED]/30 dark:border-[#BC8CFF]/30',
    outline: 'bg-transparent text-[#475569] dark:text-[#8B949E] border border-[#CBD5E1] dark:border-[#30363D]',
    question: 'bg-[#059669]/15 dark:bg-[#34D399]/15 text-[#059669] dark:text-[#34D399] border border-[#059669]/30 dark:border-[#34D399]/30',
    hint: 'bg-[#D97706]/15 dark:bg-[#D29922]/15 text-[#D97706] dark:text-[#D29922] border border-[#D97706]/30 dark:border-[#D29922]/30',
    validation: 'bg-[#16A34A]/15 dark:bg-[#3FB950]/15 text-[#16A34A] dark:text-[#3FB950] border border-[#16A34A]/30 dark:border-[#3FB950]/30',
    breakthrough: 'bg-[#EA580C]/20 dark:bg-[#F0883E]/20 text-[#EA580C] dark:text-[#F0883E] border border-[#EA580C]/40 dark:border-[#F0883E]/40 font-bold animate-pulse',
    challenge: 'bg-[#7C3AED]/15 dark:bg-[#BC8CFF]/15 text-[#7C3AED] dark:text-[#BC8CFF] border border-[#7C3AED]/30 dark:border-[#BC8CFF]/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

