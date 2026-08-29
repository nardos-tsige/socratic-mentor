import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, KeyRound, CheckCircle2, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignupEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onResetPassword?: (email: string) => Promise<{ success: boolean; error?: string }>;
  onLoginGoogle: () => Promise<{ success: boolean; error?: string }>;
  authError?: string | null;
  onClearError?: () => void;
}

type AuthViewMode = 'signin' | 'signup' | 'forgot_password';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginEmail,
  onSignupEmail,
  onResetPassword,
  onLoginGoogle,
  authError: initialAuthError,
  onClearError,
}) => {
  const [viewMode, setViewMode] = useState<AuthViewMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const error = localError || initialAuthError;

  const handleModeSwitch = (mode: AuthViewMode) => {
    setViewMode(mode);
    setLocalError(null);
    setResetSuccessMessage(null);
    if (onClearError) onClearError();
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setLocalError(null);
    setResetSuccessMessage(null);
    if (onClearError) onClearError();

    try {
      if (viewMode === 'forgot_password') {
        if (!onResetPassword) {
          setLocalError('Password reset feature is not configured.');
          return;
        }
        const result = await onResetPassword(email);
        if (result.success) {
          setResetSuccessMessage(`A password reset link has been sent to ${email}. Please check your inbox (and spam folder) to reset your password.`);
        } else if (result.error) {
          setLocalError(result.error);
        }
      } else if (viewMode === 'signup') {
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters.');
          return;
        }
        const result = await onSignupEmail(email, password, name);
        if (!result.success && result.error) {
          setLocalError(result.error);
        }
      } else {
        const result = await onLoginEmail(email, password);
        if (!result.success && result.error) {
          setLocalError(result.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setLocalError(null);
    setResetSuccessMessage(null);
    if (onClearError) onClearError();
    try {
      const result = await onLoginGoogle();
      if (!result.success && result.error) {
        setLocalError(result.error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

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
          className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-[#0F172A] dark:text-[#F0F6FC]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#059669]/10 dark:bg-[#34D399]/15 border border-[#059669]/30 dark:border-[#34D399]/30 text-[#059669] dark:text-[#34D399] font-bold text-lg mb-1 shadow-xs">
              {viewMode === 'forgot_password' ? <KeyRound className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F0F6FC]">
              {viewMode === 'signup' && 'Create your Account'}
              {viewMode === 'signin' && 'Welcome to my-mentor'}
              {viewMode === 'forgot_password' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#8B949E] max-w-xs mx-auto">
              {viewMode === 'signup' && 'Sign up to securely sync your inquiries and progress to the cloud'}
              {viewMode === 'signin' && 'Sign in to access your saved dialogues and learning journey'}
              {viewMode === 'forgot_password' && 'Enter your email address to receive a secure password reset link'}
            </p>
          </div>

          {/* Success Notification for Password Reset */}
          {resetSuccessMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-1">
                <p className="font-semibold text-emerald-800 dark:text-emerald-200">Email Sent!</p>
                <p>{resetSuccessMessage}</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-red-800 dark:text-red-200">Authentication Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Social Sign In (Only in signin & signup modes) */}
          {viewMode !== 'forgot_password' && (
            <>
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#CBD5E1] dark:border-[#30363D] bg-white dark:bg-[#0D1117] hover:bg-[#F8FAFC] dark:hover:bg-[#21262D] text-sm font-semibold text-[#0F172A] dark:text-[#F0F6FC] transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#059669] dark:text-[#34D399]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CBD5E1] dark:border-[#30363D]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-[#161B22] px-3 text-[#64748B] dark:text-[#8B949E]">
                    or with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
            {viewMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#64748B] dark:text-[#8B949E] mb-1">
                  Your First Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Nardos"
                  icon={<User className="w-4 h-4" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#F8FAFC] dark:bg-[#0D1117]"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#8B949E] mb-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#F8FAFC] dark:bg-[#0D1117]"
                disabled={loading}
              />
            </div>

            {viewMode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#64748B] dark:text-[#8B949E]">
                    Password
                  </label>
                  {viewMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot_password')}
                      className="text-xs font-semibold text-[#059669] dark:text-[#34D399] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder={viewMode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#F8FAFC] dark:bg-[#0D1117]"
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-2.5 rounded-xl font-semibold bg-[#059669] dark:bg-[#34D399] hover:bg-[#047857] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0D1117] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {viewMode === 'signup' && 'Creating Account...'}
                    {viewMode === 'signin' && 'Signing In...'}
                    {viewMode === 'forgot_password' && 'Sending Reset Link...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {viewMode === 'signup' && 'Create Account'}
                    {viewMode === 'signin' && 'Sign In'}
                    {viewMode === 'forgot_password' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Mode Switcher */}
          <div className="mt-5 text-center text-xs text-[#64748B] dark:text-[#8B949E]">
            {viewMode === 'forgot_password' ? (
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="inline-flex items-center gap-1.5 text-[#059669] dark:text-[#34D399] hover:underline font-semibold cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            ) : viewMode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="text-[#059669] dark:text-[#34D399] hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className="text-[#059669] dark:text-[#34D399] hover:underline font-semibold cursor-pointer"
                >
                  Create one
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

