import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface SocraticGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSample: (prompt: string, subject?: string) => void;
}

export const SocraticGuideModal: React.FC<SocraticGuideModalProps> = ({
  isOpen,
  onClose,
  onStartSample,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl p-5 sm:p-8 shadow-2xl z-10 text-[#0F172A] dark:text-[#F0F6FC] space-y-5 sm:space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/10 dark:bg-[#34D399]/15 border border-[#059669]/30 dark:border-[#34D399]/30 text-xs font-semibold text-[#059669] dark:text-[#34D399]">
              <Brain className="w-3.5 h-3.5" />
              Socratic Method
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F0F6FC]">
              How to learn with my-mentor
            </h3>
            <p className="text-sm text-[#64748B] dark:text-[#8B949E]">
              "I cannot teach anybody anything. I can only make them think." — Socrates
            </p>
          </div>

          {/* Core Method Breakdown */}
          <div className="space-y-4 text-sm text-[#64748B] dark:text-[#8B949E] leading-relaxed">
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] space-y-3 shadow-xs">
              <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F0F6FC] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#EA580C] dark:text-[#F0883E]" />
                The 4 Stages of Socratic Discovery
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D]/60 space-y-1 shadow-xs">
                  <div className="font-semibold text-[#059669] dark:text-[#34D399]">1. Elicit Intuition</div>
                  <p>We ask what you already know or guess about the subject before introducing formal rules.</p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D]/60 space-y-1 shadow-xs">
                  <div className="font-semibold text-[#7C3AED] dark:text-[#BC8CFF]">2. Test Hypotheses</div>
                  <p>We present gentle thought experiments to verify if your reasoning holds under edge cases.</p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D]/60 space-y-1 shadow-xs">
                  <div className="font-semibold text-[#D97706] dark:text-[#D29922]">3. Isolate Key Variables</div>
                  <p>Complex multi-part equations or mechanisms are simplified into single deductive steps.</p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D]/60 space-y-1 shadow-xs">
                  <div className="font-semibold text-[#16A34A] dark:text-[#3FB950]">4. The Eureka Breakthrough</div>
                  <p>You state the solution in your own words. The breakthrough is celebrated and permanently retained.</p>
                </div>
              </div>
            </div>

            {/* Tips for Students */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F0F6FC]">Tips for the Best Experience:</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#3FB950] shrink-0 mt-0.5" />
                  <span>
                    <strong>Don't be afraid to be wrong:</strong> Socratic inquiry uses partial mistakes to reveal how systems work.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#3FB950] shrink-0 mt-0.5" />
                  <span>
                    <strong>Think out loud:</strong> Type partial ideas, guesses, and "I think..." statements.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#3FB950] shrink-0 mt-0.5" />
                  <span>
                    <strong>Use the Hint Button:</strong> If you feel lost at any step, click <em>"I'm stuck"</em> to request scaffolding.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#64748B] dark:text-[#8B949E]">Ready to experience the method?</span>
            <Button
              onClick={() => {
                onClose();
                onStartSample('How do I solve 2x + 5 = 15?', 'Mathematics');
              }}
              className="w-full sm:w-auto"
            >
              <span>Try Algebra Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
