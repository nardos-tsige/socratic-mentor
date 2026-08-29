import React from 'react';
import { Bot } from 'lucide-react';

interface FooterProps {
  onSelectPrompt: (prompt: string, subject?: string) => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide }) => {
  return (
    <footer className="border-t border-[#E2E8F0] dark:border-[#30363D] bg-white dark:bg-[#090D13] text-[#64748B] dark:text-[#8B949E] text-sm py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#059669] flex items-center justify-center text-white dark:text-[#0D1117] shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-[#0F172A] dark:text-[#F0F6FC] tracking-tight text-3d-bold">
                Socratic Mentor
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#8B949E] leading-relaxed">
              "Education is the kindling of a flame, not the filling of a vessel." — <span className="italic text-[#059669] dark:text-[#34D399] font-medium">Socrates</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] dark:text-[#8B949E]">
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] hover:text-[#059669] dark:hover:text-[#34D399] bg-[#F8FAFC] dark:bg-[#161B22] transition-colors cursor-pointer"
            >
              How Guiding Works
            </button>
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] hover:text-[#059669] dark:hover:text-[#34D399] bg-[#F8FAFC] dark:bg-[#161B22] transition-colors cursor-pointer"
            >
              Socratic Ethics
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#30363D]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B] dark:text-[#8B949E] uppercase tracking-widest gap-3 font-medium">
          <div className="flex items-center gap-4 sm:gap-6">
            <span>© 2026 Socratic Mentor</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#059669] dark:text-[#34D399] font-bold">Guided Discovery Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
