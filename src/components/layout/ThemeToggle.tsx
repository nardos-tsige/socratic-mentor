import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8B949E] dark:hover:text-[#F0F6FC] bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#21262D]/70 dark:hover:bg-[#30363D] border border-[#CBD5E1] dark:border-[#30363D] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#58A6FF] cursor-pointer shadow-xs active:scale-95"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-[#58A6FF]" />
        ) : (
          <Sun className="w-4 h-4 text-[#D97706]" />
        )}
      </motion.div>
    </button>
  );
};
