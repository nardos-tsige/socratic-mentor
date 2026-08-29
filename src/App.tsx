import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ChatInterface } from './components/chat/ChatInterface';
import { LoginModal } from './components/auth/LoginModal';
import { SocraticGuideModal } from './components/modals/SocraticGuideModal';

const THEME_KEY = 'socratic-mentor-theme-preference';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return 'dark';
  });

  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const {
    user,
    authError,
    setAuthError,
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    loginWithGoogle,
    logout,
    recordQuestionAsked,
    recordBreakthrough,
  } = useAuth();

  const {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    autoSaveStatus,
    eurekaAlert,
    setEurekaAlert,
    setActiveSessionId,
    sendMessage,
    editMessage,
    createNewSession,
    deleteSession,
    clearCurrentSession,
    renameSession,
    autoGenerateSessionTitle,
  } = useChat(
    () => recordQuestionAsked(),
    (concept) => recordBreakthrough(concept),
    user.preferences.soundEnabled
  );

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartQuestionFromLanding = (question: string, subject?: string) => {
    createNewSession(question, subject);
    setCurrentView('chat');
  };

  return (
    <div className={`flex flex-col font-sans selection:bg-[#34D399]/30 ${
      currentView === 'chat'
        ? 'h-screen overflow-hidden'
        : 'min-h-screen'
    } ${theme === 'dark' ? 'bg-[#0D1117] text-[#F0F6FC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {currentView === 'landing' && (
        <LandingPage
          onStartQuestion={handleStartQuestionFromLanding}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          user={user}
        />
      )}

      {currentView === 'chat' && (
        <ChatInterface
          sessions={sessions}
          activeSession={activeSession}
          activeSessionId={activeSessionId}
          isLoading={isLoading}
          autoSaveStatus={autoSaveStatus}
          eurekaAlert={eurekaAlert}
          user={user}
          onSendMessage={(msg, attachments, subject) => sendMessage(msg, attachments, subject)}
          onEditMessage={(msgId, newText) => editMessage(msgId, newText)}
          onSelectSession={(id) => setActiveSessionId(id)}
          onCreateNewSession={(prompt, subject) => createNewSession(prompt, subject)}
          onDeleteSession={(id) => deleteSession(id)}
          onRenameSession={renameSession}
          onAutoGenerateTitle={autoGenerateSessionTitle}
          onClearCurrentSession={clearCurrentSession}
          onDismissEureka={() => setEurekaAlert(null)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onLogout={logout}
        />
      )}

      {currentView === 'landing' && (
        <Footer
          onSelectPrompt={handleStartQuestionFromLanding}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginEmail={loginWithEmail}
        onSignupEmail={signupWithEmail}
        onResetPassword={resetPassword}
        onLoginGoogle={loginWithGoogle}
        authError={authError}
        onClearError={() => setAuthError(null)}
      />

      <SocraticGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartSample={handleStartQuestionFromLanding}
      />
    </div>
  );
}
