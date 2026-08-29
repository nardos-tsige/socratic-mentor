import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { SuggestionChipItem } from '../../types';

interface SuggestionChipsProps {
  suggestions: SuggestionChipItem[];
  onSelect: (prompt: string, category?: string) => void;
  className?: string;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSelect,
  className = '',
}) => {
  // Show at most 2 clean, high-relevance jumpstart questions
  const cleanList = suggestions.slice(0, 2);

  return (
    <div className={`w-full py-1.5 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {cleanList.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.prompt, item.category)}
            className="group flex-1 flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] hover:bg-[#F8FAFC] dark:hover:bg-[#1F242C] text-xs text-[#0F172A] dark:text-[#F0F6FC] transition-all duration-200 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 overflow-hidden text-left">
              <span className="text-[#059669] dark:text-[#34D399] font-bold shrink-0 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                {item.title}:
              </span>
              <span className="text-[#475569] dark:text-[#8B949E] group-hover:text-[#0F172A] dark:group-hover:text-[#F0F6FC] transition-colors truncate font-medium">
                "{item.prompt}"
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#64748B] dark:text-[#8B949E] group-hover:text-[#059669] dark:group-hover:text-[#34D399] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

