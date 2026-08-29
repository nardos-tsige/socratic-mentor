import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  onStartNewSession: () => void;
  sessionTitle?: string;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  onStartNewSession,
  sessionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl p-6 shadow-2xl z-10 text-[#0F172A] dark:text-[#F0F6FC]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#EA580C]/10 dark:bg-[#F0883E]/15 border border-[#EA580C]/30 dark:border-[#F0883E]/30 flex items-center justify-center text-[#EA580C] dark:text-[#F0883E] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F0F6FC]">
                Reset Dialogue
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8B949E]">
                Choose how you would like to reset this conversation
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] mb-5 space-y-1.5 text-xs text-[#64748B] dark:text-[#8B949E]">
            <div className="font-semibold text-[#0F172A] dark:text-[#F0F6FC] truncate">
              {sessionTitle || 'Current Socratic Session'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#16A34A] dark:text-[#3FB950]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Other saved dialogue topics remain safe.</span>
            </div>
          </div>

          <div className="space-y-2.5 mb-5">
            <button
              onClick={() => {
                onConfirmReset();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#CBD5E1] dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:bg-[#ECFDF5] dark:hover:bg-[#1F242C] hover:border-[#059669]/40 dark:hover:border-[#34D399]/40 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#0F172A] dark:text-[#F0F6FC] group-hover:text-[#059669] dark:group-hover:text-[#34D399] flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart this Topic</span>
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#8B949E]">
                  Clears the messages and starts fresh from the opening question.
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                onStartNewSession();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#CBD5E1] dark:border-[#30363D] bg-white dark:bg-[#161B22] hover:bg-[#F0FDF4] dark:hover:bg-[#15231B] hover:border-[#16A34A]/40 dark:hover:border-[#3FB950]/40 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#0F172A] dark:text-[#F0F6FC] group-hover:text-[#16A34A] dark:group-hover:text-[#3FB950] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Blank Dialogue</span>
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#8B949E]">
                  Creates a separate new session to ask about a different topic.
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs cursor-pointer text-[#64748B] dark:text-[#8B949E]"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
