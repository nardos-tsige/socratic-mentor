import React from 'react';
import { getAvatarInitial } from '../../lib/utils';

interface UserAvatarProps {
  name?: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = '',
}) => {
  
  const initial = avatar && avatar.length === 1 && !avatar.match(/\p{Extended_Pictographic}/u)
    ? avatar.toUpperCase()
    : getAvatarInitial(name || avatar || 'N');

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs font-semibold rounded-lg',
    sm: 'w-7 h-7 text-xs font-bold rounded-lg',
    md: 'w-8 h-8 text-sm font-bold rounded-xl',
    lg: 'w-10 h-10 text-base font-bold rounded-xl',
    xl: 'w-13 h-13 text-xl font-extrabold rounded-2xl',
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none bg-gradient-to-br from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#059669] text-white dark:text-[#0D1117] shadow-2xs border border-[#047857]/20 dark:border-[#34D399]/30 tracking-tight font-sans ${sizeClasses[size]} ${className}`}
      aria-label={`Profile of ${name || initial}`}
    >
      {initial}
    </div>
  );
};
