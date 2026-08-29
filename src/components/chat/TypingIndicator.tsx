import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="flex items-start gap-2 sm:gap-2.5 mr-auto max-w-[80%] my-1"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-b from-[#161B22] to-[#0D1117] dark:from-[#21262D] dark:to-[#161B22] border border-[#059669]/40 dark:border-[#34D399]/40 text-[#059669] dark:text-[#34D399] flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5 relative">
        <Bot className="w-4 h-4 animate-bounce text-[#059669] dark:text-[#34D399]" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
      </div>

      <div className="bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2.5 shadow-xs min-h-[38px]">
        <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#8B949E]">
          Formulating Socratic question...
        </span>
        <div className="flex items-center gap-1.5 h-4 px-0.5">
          <motion.span
            animate={{
              y: [0, -7, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0,
            }}
            className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#34D399] shadow-xs"
          />
          <motion.span
            animate={{
              y: [0, -7, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0.18,
            }}
            className="w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#6EE7B7] shadow-xs"
          />
          <motion.span
            animate={{
              y: [0, -7, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 0.36,
            }}
            className="w-2 h-2 rounded-full bg-[#7C3AED] dark:bg-[#BC8CFF] shadow-xs"
          />
        </div>
      </div>
    </motion.div>
  );
};


