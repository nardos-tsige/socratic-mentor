import React from 'react';
import { Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: React.ReactNode;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  fallback,
  src,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden select-none bg-[#21262D] border border-[#30363D] text-[#34D399] font-semibold',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{fallback || <Bot className="w-4 h-4 text-[#34D399]" />}</span>
      )}
    </div>
  );
};
