import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Brain,
  Lightbulb,
  TrendingUp,
  Bot,
  CheckCircle2,
  HelpCircle,
  Zap,
  BookOpen,
  Compass,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { RobotMascot } from '../mascot/RobotMascot';

interface LandingPageProps {
  onStartQuestion: (question: string, subject?: string) => void;
  onOpenLoginModal: () => void;
  onOpenGuideModal: () => void;
  user: UserProfile;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuestion,
  onOpenLoginModal,
  onOpenGuideModal,
  user,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    onStartQuestion(inputQuestion.trim(), 'General');
  };

  const starterSuggestions = [
    { text: 'How do I solve 2x + 5 = 15?', subject: 'Mathematics' },
    { text: 'Explain photosynthesis to me', subject: 'Natural Sciences' },
    { text: 'What is the trolley problem?', subject: 'Philosophy & Logic' },
  ];

  const versatilitySubjects = [
    'Mathematics',
    'Natural Sciences',
    'Computer Science',
    'Philosophy & Logic',
    'History',
    'Languages',
    'Art',
    'Everyday Problem Solving',
  ];

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] dark:bg-[#0D1117] text-[#0F172A] dark:text-[#F0F6FC] transition-colors">
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-10 pt-8 pb-16 sm:py-14 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#059669]/10 dark:bg-[#34D399]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="text-center max-w-3xl z-10 w-full space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center pt-1"
          >
            <RobotMascot
              size="lg"
              speechText="What do you want to learn today?"
              subText="I'll ask guiding questions so you discover the answer!"
              onSpeechClick={() => {
                const el = document.getElementById('hero-inquiry-input');
                if (el) el.focus();
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
              Illuminating minds,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#10B981] dark:from-[#34D399] dark:to-[#6EE7B7] text-3d-emerald">
                one question
              </span>{' '}
              at a time.
            </h1>
            <p className="text-[#64748B] dark:text-[#8B949E] text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              The Socratic AI tutor that guides you through discovery instead of just giving away the answers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2"
          >
            <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059669] to-[#10B981] dark:from-[#34D399] dark:to-[#6EE7B7] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl p-2.5 shadow-xl card-3d">
                <div className="pl-3 pr-2 text-[#059669] dark:text-[#34D399]">
                  <Bot className="w-5 h-5" />
                </div>
                <input
                  id="hero-inquiry-input"
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="What would you like to learn today?"
                  className="flex-1 bg-transparent border-none outline-none px-2 text-sm sm:text-base text-[#0F172A] dark:text-[#F0F6FC] placeholder:text-[#94A3B8] dark:placeholder:text-[#8B949E] font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputQuestion.trim()}
                  aria-label="Submit question"
                  className="bg-gradient-to-r from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#10B981] text-white dark:text-[#0D1117] p-3 sm:px-5 sm:py-3 rounded-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md font-bold flex items-center gap-1.5 btn-3d"
                >
                  <span className="hidden sm:inline">Ask</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-2.5 pt-2"
          >
            {starterSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onStartQuestion(item.text, item.subject)}
                className="px-4 py-2 text-xs sm:text-sm rounded-full border border-[#CBD5E1] dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:border-[#059669] dark:hover:border-[#34D399] hover:text-[#059669] dark:hover:text-[#34D399] transition-all text-[#64748B] dark:text-[#8B949E] cursor-pointer select-none flex items-center gap-2 hover:scale-105 shadow-xs font-semibold"
              >
                <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                <span>"{item.text}"</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-10 border-t border-[#E2E8F0] dark:border-[#30363D] bg-[#F1F5F9]/50 dark:bg-[#161B22]/30">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-xs font-bold text-[#059669] dark:text-[#34D399] uppercase tracking-widest">
              Live Socratic Comparison
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
              See the Difference for Yourself
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22]/60 border border-red-500/20 space-y-4 shadow-sm flex flex-col justify-between card-3d">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-red-500/10">
                  <span className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5">
                    <span>❌</span> Generic AI Bot
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 font-bold">
                    0% retention
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#21262D] text-[#475569] dark:text-[#8B949E] font-medium">
                    <span className="font-bold text-[#0F172A] dark:text-[#F0F6FC]">Student:</span> "How do I solve 2x + 5 = 15?"
                  </div>
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-500/20 text-[#0F172A] dark:text-[#F0F6FC] space-y-1 font-mono text-[11px]">
                    <div className="font-bold text-red-600 dark:text-red-400">Bot:</div>
                    <p>"The answer is x=5.</p>
                    <p>Step 1: 2x=10.</p>
                    <p>Step 2: divide..."</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-red-600/90 dark:text-red-400/90 font-semibold">
                <strong>Result:</strong> Student copies without understanding
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border-2 border-[#059669]/50 dark:border-[#34D399]/50 space-y-4 shadow-lg flex flex-col justify-between card-3d">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#059669]/10 dark:border-[#34D399]/10">
                  <span className="font-bold text-[#059669] dark:text-[#34D399] flex items-center gap-1.5 text-3d-emerald">
                    <Bot className="w-4 h-4" /> Socratic Mentor
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                    100% deep comprehension
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#21262D] text-[#475569] dark:text-[#8B949E] font-medium">
                    <span className="font-bold text-[#0F172A] dark:text-[#F0F6FC]">Student:</span> "How do I solve 2x + 5 = 15?"
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#ECFDF5] dark:bg-[#34D399]/10 border border-[#A7F3D0] dark:border-[#34D399]/30 text-[#0F172A] dark:text-[#F0F6FC] space-y-1.5">
                    <div className="font-bold text-[#059669] dark:text-[#34D399] flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Socratic Mentor:
                    </div>
                    <p className="leading-relaxed font-medium">
                      "Great problem! Our goal is to isolate <code className="px-1 py-0.5 rounded bg-[#059669]/10 dark:bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] font-bold">x</code>. What operation would undo the <strong>+5</strong> first?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <strong>Result:</strong> Student understands the underlying concept
                </div>
                <button
                  onClick={() => onStartQuestion('How do I solve 2x + 5 = 15?', 'Mathematics')}
                  className="w-full sm:w-auto text-xs py-2 px-4 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#10B981] text-white dark:text-[#0D1117] font-bold transition-all cursor-pointer shadow-sm text-center btn-3d"
                >
                  Try this now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-10 bg-white dark:bg-[#0D1117]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-xs font-bold text-[#059669] dark:text-[#34D399] uppercase tracking-widest">
              Core Pedagogy
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
              How Socratic Mentor Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] hover:border-[#059669]/50 dark:hover:border-[#34D399]/50 transition-all space-y-3 card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#059669]/10 dark:bg-[#34D399]/10 flex items-center justify-center text-2xl mb-3 shadow-xs">
                🧠
              </div>
              <h4 className="font-extrabold text-lg text-[#0F172A] dark:text-[#F0F6FC]">No Answers Given</h4>
              <p className="text-sm text-[#64748B] dark:text-[#8B949E] leading-relaxed font-medium">
                We guide you with prompts and hints, ensuring you actually master the material.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] hover:border-[#7C3AED]/50 dark:hover:border-[#BC8CFF]/50 transition-all space-y-3 card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 dark:bg-[#BC8CFF]/10 flex items-center justify-center text-2xl mb-3 shadow-xs">
                💡
              </div>
              <h4 className="font-extrabold text-lg text-[#0F172A] dark:text-[#F0F6FC]">Guided Discovery</h4>
              <p className="text-sm text-[#64748B] dark:text-[#8B949E] leading-relaxed font-medium">
                Break down complex problems into smaller manageable steps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] hover:border-[#EA580C]/50 dark:hover:border-[#F0883E]/50 transition-all space-y-3 card-3d">
              <div className="w-12 h-12 rounded-xl bg-[#EA580C]/10 dark:bg-[#F0883E]/10 flex items-center justify-center text-2xl mb-3 shadow-xs">
                📈
              </div>
              <h4 className="font-extrabold text-lg text-[#0F172A] dark:text-[#F0F6FC]">Builds Critical Thinking</h4>
              <p className="text-sm text-[#64748B] dark:text-[#8B949E] leading-relaxed font-medium">
                Active participation builds deep retention and long-term memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-10 border-t border-[#E2E8F0] dark:border-[#30363D] bg-[#F1F5F9]/40 dark:bg-[#161B22]/20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-xs font-bold text-[#059669] dark:text-[#34D399] uppercase tracking-widest">
              Specialized Features
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
              What Makes Socratic Mentor Different
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] card-3d space-y-3 hover:border-[#059669]/40 dark:hover:border-[#34D399]/40 transition-colors">
              <h4 className="font-bold text-base sm:text-lg text-[#0F172A] dark:text-[#F0F6FC] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#059669]/15 dark:bg-[#34D399]/20 text-[#059669] dark:text-[#34D399] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Socratic Method</span>
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#8B949E] pl-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] dark:text-[#34D399] font-bold">•</span> We never give direct answers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] dark:text-[#34D399] font-bold">•</span> We ask questions that guide you to discovery
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#059669] dark:text-[#34D399] font-bold">•</span> You learn by thinking, not by copying
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] card-3d space-y-3 hover:border-[#7C3AED]/40 dark:hover:border-[#BC8CFF]/40 transition-colors">
              <h4 className="font-bold text-base sm:text-lg text-[#0F172A] dark:text-[#F0F6FC] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/15 dark:bg-[#BC8CFF]/20 text-[#7C3AED] dark:text-[#BC8CFF] flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <span>Active Recall & Scaffolding</span>
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#8B949E] pl-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#7C3AED] dark:text-[#BC8CFF] font-bold">•</span> Break complex topics into manageable steps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7C3AED] dark:text-[#BC8CFF] font-bold">•</span> Build on what you already know
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7C3AED] dark:text-[#BC8CFF] font-bold">•</span> Fill knowledge gaps through guided inquiry
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] card-3d space-y-3 hover:border-[#EA580C]/40 dark:hover:border-[#F0883E]/40 transition-colors">
              <h4 className="font-bold text-base sm:text-lg text-[#0F172A] dark:text-[#F0F6FC] flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#EA580C]/15 dark:bg-[#F0883E]/20 text-[#EA580C] dark:text-[#F0883E] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Eureka Moment Detection</span>
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B] dark:text-[#8B949E] pl-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#EA580C] dark:text-[#F0883E] font-bold">•</span> Celebrates when you discover the answer yourself
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#EA580C] dark:text-[#F0883E] font-bold">•</span> Reinforces learning through positive feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#EA580C] dark:text-[#F0883E] font-bold">•</span> You remember what you discovered on your own
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-10 border-t border-[#E2E8F0] dark:border-[#30363D] bg-white dark:bg-[#0D1117]">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#059669] dark:text-[#34D399] uppercase tracking-widest">
              Universal Versatility
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
              Learn Anything, Anywhere
            </h3>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-[#8B949E] max-w-2xl mx-auto leading-relaxed font-medium">
              Socratic Mentor works across every subject because it teaches you HOW to think, not WHAT to think.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-2">
            {versatilitySubjects.map((subject, idx) => (
              <button
                key={idx}
                onClick={() => onStartQuestion(`I want to explore ${subject} with you`, subject)}
                className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] hover:bg-[#ECFDF5] dark:hover:bg-[#34D399]/10 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F0F6FC] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group card-3d"
              >
                <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399] group-hover:scale-110 transition-transform" />
                <span className="truncate">{subject}</span>
              </button>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#8B949E] pt-2 italic font-medium">
            No matter what you're learning, our Socratic approach helps you build genuine understanding.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-10 border-t border-[#E2E8F0] dark:border-[#30363D] bg-[#F1F5F9]/60 dark:bg-[#161B22]/40">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC] text-3d-bold">
            Ready to Learn Differently?
          </h3>

          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] shadow-xl space-y-6 text-center card-3d">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] dark:bg-[#34D399]/15 text-xs font-bold text-[#059669] dark:text-[#34D399]">
              <Bot className="w-3.5 h-3.5" />
              <span>Instant Guest Mode</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC]">
                Start learning right away. No account needed.
              </p>
              <p className="text-sm text-[#64748B] dark:text-[#8B949E] font-medium">
                Your chats are auto-saved locally in your browser.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onStartQuestion('What is a challenging concept I can explore today?')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#059669] to-[#047857] dark:from-[#34D399] dark:to-[#10B981] text-white dark:text-[#0D1117] font-black text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer inline-flex items-center gap-2 btn-3d"
              >
                <Bot className="w-5 h-5" />
                <span>Start Learning Free →</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
