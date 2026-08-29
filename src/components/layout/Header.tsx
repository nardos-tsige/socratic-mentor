import React, { useState } from 'react';
import { Bot, Menu, X, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from '../../types';

interface HeaderProps {
  currentView: 'landing' | 'chat';
  onNavigate: (view: 'landing' | 'chat') => void;
  user: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenLoginModal: () => void;
  onOpenGuideModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  theme,
  onToggleTheme,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'landing' | 'chat') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    handleNav('landing');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] dark:border-[#30363D] bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md transition-colors shrink-0">
      <div className="flex items-center gap-6 sm:gap-8">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer py-1"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#059669] flex items-center justify-center text-white dark:text-[#0D1117] shadow-sm group-hover:scale-105 transition-transform relative">
            <Bot className="w-4.5 h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34D399] dark:bg-[#6EE7B7] animate-ping" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0F172A] dark:text-[#F0F6FC] group-hover:text-[#059669] dark:group-hover:text-[#34D399] transition-colors text-3d-bold">
            Socratic Mentor
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#8B949E]">
          <button
            onClick={() => handleNav('landing')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'landing'
                ? 'text-[#0F172A] dark:text-[#F0F6FC] bg-[#F1F5F9] dark:bg-[#21262D] font-bold'
                : 'hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F8FAFC] dark:hover:bg-[#1F242C]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'chat'
                ? 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#34D399]/15 font-bold'
                : 'hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F8FAFC] dark:hover:bg-[#1F242C]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Socratic Tutor</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] bg-[#F1F5F9] dark:bg-[#21262D] border border-[#CBD5E1] dark:border-[#30363D] cursor-pointer transition-all"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-14 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          />
          <div className="absolute top-14 left-0 right-0 z-50 bg-white dark:bg-[#161B22] border-b border-[#E2E8F0] dark:border-[#30363D] p-3 shadow-xl flex flex-col gap-1 md:hidden animate-fade-in">
            <button
              onClick={() => handleNav('landing')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                currentView === 'landing'
                  ? 'bg-[#059669]/10 dark:bg-[#34D399]/15 text-[#059669] dark:text-[#34D399] font-bold'
                  : 'text-[#0F172A] dark:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNav('chat')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                currentView === 'chat'
                  ? 'bg-[#059669]/10 dark:bg-[#34D399]/15 text-[#059669] dark:text-[#34D399] font-bold'
                  : 'text-[#0F172A] dark:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D]'
              }`}
            >
              <Bot className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              <span>Socratic Tutor</span>
            </button>
          </div>
        </>
      )}
    </header>
  );
};
