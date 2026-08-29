import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  sessionTitle?: string;
}

export const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
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
          className="relative w-full max-w-sm bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl p-6 shadow-2xl z-10 text-[#0F172A] dark:text-[#F0F6FC]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F0F6FC]">
                Delete Dialogue?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8B949E]">
                This will permanently delete this conversation
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] mb-5 text-xs text-[#64748B] dark:text-[#8B949E]">
            <span className="font-semibold text-[#0F172A] dark:text-[#F0F6FC] line-clamp-2">
              "{sessionTitle || 'Untitled Session'}"
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs cursor-pointer text-[#64748B] dark:text-[#8B949E]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onConfirmDelete();
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
