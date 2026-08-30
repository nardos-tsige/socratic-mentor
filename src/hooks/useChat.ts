import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ChatMessage, ChatSession, GuidanceType, ChatAttachment } from '../types';
import { generateId } from '../lib/utils';
import { generateLocalSocraticResponse, generateMeaningfulTitle } from '../lib/ai/socraticPrompt';
import { playEurekaTone } from '../lib/audio';

const SESSIONS_STORAGE_KEY = 'socratic-mentor-chat-history';
const ACTIVE_SESSION_ID_KEY = 'socratic-mentor-active-session-id';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Hello! I'm **Socratic Mentor**, your Socratic learning partner. 🤖

Instead of just handing you solutions, I'll ask guided questions to help you understand the core concepts and arrive at the answers yourself.

What subject or problem would you like to explore today?`,
  timestamp: Date.now(),
  guidanceType: 'question',
  suggestedReplies: [
    'How do I solve 2x + 5 = 15?',
    'Why is the sky blue?',
    'Explain the Pythagorean theorem',
    'How do binary search trees work?'
  ],
  eurekaMoment: false,
};

export function useChat(
  onQuestionAsked?: () => void,
  onBreakthrough?: (concept?: string) => void,
  soundEnabled: boolean = true
) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved sessions', e);
    }
    const defaultSession: ChatSession = {
      id: 'session-default',
      title: 'New Exploration',
      subject: 'General Inquiry',
      messages: [INITIAL_WELCOME_MESSAGE],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      conceptsMastered: [],
    };
    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(ACTIVE_SESSION_ID_KEY);
      if (storedId) return storedId;
    } catch (e) {}
    return sessions[0]?.id || 'session-default';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [eurekaAlert, setEurekaAlert] = useState<{ active: boolean; concept: string } | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [INITIAL_WELCOME_MESSAGE];

  useEffect(() => {
    setAutoSaveStatus('saving');
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, activeSessionId);
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [sessions, activeSessionId]);

  const playEurekaSound = useCallback(() => {
    if (!soundEnabled) return;
    playEurekaTone();
  }, [soundEnabled]);

  const sendMessage = useCallback(
    async (content: string, attachments?: ChatAttachment[], customSubject?: string) => {
      const trimmed = content.trim();
      const hasAttachments = Array.isArray(attachments) && attachments.length > 0;
      if ((!trimmed && !hasAttachments) || isLoading) return;

      const currentSession = sessions.find((s) => s.id === activeSessionId) || activeSession;
      if (!currentSession) return;

      const userMsgId = generateId();
      const displayContent = trimmed || (hasAttachments ? `[Attached: ${attachments.map((a) => a.name).join(', ')}]` : '');

      const userMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: displayContent,
        timestamp: Date.now(),
        attachments: hasAttachments ? attachments : undefined,
      };

      const isFirstUserMessage = currentSession.messages.filter((m) => m.role === 'user').length === 0;
      const initialSmartTitle = isFirstUserMessage
        ? generateMeaningfulTitle(displayContent, customSubject || currentSession.subject)
        : currentSession.title;

      const updatedSession: ChatSession = {
        ...currentSession,
        title: initialSmartTitle,
        subject: customSubject || currentSession.subject,
        messages: [...currentSession.messages, userMessage],
        updatedAt: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
      );

      setIsLoading(true);
      if (onQuestionAsked) onQuestionAsked();

      try {
        const historyForApi = currentSession.messages
          .filter((m) => !m.id.startsWith('welcome'))
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: displayContent,
            history: historyForApi,
            subject: currentSession.subject,
            topic: currentSession.title,
            attachments: hasAttachments
              ? attachments.map((a) => ({
                  name: a.name,
                  type: a.type,
                  size: a.size,
                  url: a.url || undefined,
                  textContent: a.textContent ? a.textContent.slice(0, 25000) : undefined,
                }))
              : undefined,
          }),
        });

        let data;
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        data = await response.json();

        const tutorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.response || "What do you think is our best next step?",
          timestamp: Date.now(),
          guidanceType: data.guidanceType as GuidanceType,
          suggestedReplies: data.suggestedReplies || [],
          eurekaMoment: Boolean(data.eurekaMoment),
          conceptLearned: data.conceptLearned || '',
        };

        if (data.eurekaMoment) {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.65 },
            colors: ['#2563EB', '#60A5FA', '#F59E0B', '#10B981', '#EC4899'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 60,
              origin: { x: 0.1, y: 0.7 },
              colors: ['#2563EB', '#F59E0B', '#10B981'],
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 60,
              origin: { x: 0.9, y: 0.7 },
              colors: ['#2563EB', '#F59E0B', '#EC4899'],
            });
          }, 250);
          playEurekaSound();
          if (onBreakthrough) onBreakthrough(data.conceptLearned);
        }

        const mastered = data.conceptLearned && !updatedSession.conceptsMastered.includes(data.conceptLearned)
          ? [...updatedSession.conceptsMastered, data.conceptLearned]
          : updatedSession.conceptsMastered;

        const finalTitle = data.sessionTitle || updatedSession.title;

        const finalSession: ChatSession = {
          ...updatedSession,
          title: finalTitle,
          messages: [...updatedSession.messages, tutorMessage],
          conceptsMastered: mastered,
          updatedAt: Date.now(),
        };

        setSessions((prev) =>
          prev.map((s) => (s.id === currentSession.id ? finalSession : s))
        );
      } catch (err) {
        console.warn('API error, executing resilient local fallback', err);
        const fallback = generateLocalSocraticResponse(trimmed, updatedSession.messages);
        
        const tutorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fallback.response,
          timestamp: Date.now(),
          guidanceType: fallback.guidanceType,
          suggestedReplies: fallback.suggestedReplies,
          eurekaMoment: fallback.eurekaMoment,
          conceptLearned: fallback.conceptLearned,
        };

        if (fallback.eurekaMoment) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#58A6FF', '#BC8CFF', '#F0883E'],
          });
          playEurekaSound();
          if (onBreakthrough) onBreakthrough(fallback.conceptLearned);
        }

        const finalFallbackTitle = fallback.sessionTitle || updatedSession.title;

        const fallbackSession: ChatSession = {
          ...updatedSession,
          title: finalFallbackTitle,
          messages: [...updatedSession.messages, tutorMessage],
          updatedAt: Date.now(),
        };

        setSessions((prev) =>
          prev.map((s) => (s.id === currentSession.id ? fallbackSession : s))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [sessions, activeSessionId, activeSession, isLoading, onQuestionAsked, onBreakthrough, playEurekaSound]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const trimmed = newContent.trim();
      if (!trimmed || isLoading) return;

      const currentSession = sessions.find((s) => s.id === activeSessionId) || activeSession;
      if (!currentSession) return;

      const msgIndex = currentSession.messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      const priorMessages = currentSession.messages.slice(0, msgIndex);
      const updatedUserMessage: ChatMessage = {
        ...currentSession.messages[msgIndex],
        content: trimmed,
        timestamp: Date.now(),
      };

      const newMessages = [...priorMessages, updatedUserMessage];

      const isFirstUserMessage = priorMessages.filter((m) => m.role === 'user').length === 0;
      const newTitle = isFirstUserMessage
        ? generateMeaningfulTitle(trimmed, currentSession.subject)
        : currentSession.title;

      const updatedSession: ChatSession = {
        ...currentSession,
        title: newTitle,
        messages: newMessages,
        updatedAt: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
      );

      setIsLoading(true);
      if (onQuestionAsked) onQuestionAsked();

      try {
        const historyForApi = newMessages
          .filter((m) => !m.id.startsWith('welcome'))
          .slice(0, -1)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historyForApi,
            subject: currentSession.subject,
            topic: currentSession.title,
          }),
        });

        let data;
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        data = await response.json();

        const tutorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.response || "What do you think is our best next step?",
          timestamp: Date.now(),
          guidanceType: (data.guidanceType as GuidanceType) || 'question',
          suggestedReplies: data.suggestedReplies || [],
          eurekaMoment: Boolean(data.eurekaMoment),
          conceptLearned: data.conceptLearned || '',
        };

        if (data.eurekaMoment) {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.65 },
            colors: ['#2563EB', '#60A5FA', '#F59E0B', '#10B981', '#EC4899'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 60,
              origin: { x: 0.1, y: 0.7 },
              colors: ['#2563EB', '#F59E0B', '#10B981'],
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 60,
              origin: { x: 0.9, y: 0.7 },
              colors: ['#2563EB', '#F59E0B', '#EC4899'],
            });
          }, 250);
          playEurekaSound();
          if (onBreakthrough) onBreakthrough(data.conceptLearned);
        }

        const mastered = data.conceptLearned && !updatedSession.conceptsMastered.includes(data.conceptLearned)
          ? [...updatedSession.conceptsMastered, data.conceptLearned]
          : updatedSession.conceptsMastered;

        const finalTitle = data.sessionTitle || updatedSession.title;

        const finalSession: ChatSession = {
          ...updatedSession,
          title: finalTitle,
          messages: [...newMessages, tutorMessage],
          conceptsMastered: mastered,
          updatedAt: Date.now(),
        };

        setSessions((prev) =>
          prev.map((s) => (s.id === currentSession.id ? finalSession : s))
        );
      } catch (err) {
        console.warn('API error during edit, using resilient local fallback', err);
        const fallback = generateLocalSocraticResponse(trimmed, newMessages);

        const tutorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fallback.response,
          timestamp: Date.now(),
          guidanceType: fallback.guidanceType,
          suggestedReplies: fallback.suggestedReplies,
          eurekaMoment: fallback.eurekaMoment,
          conceptLearned: fallback.conceptLearned,
        };

        if (fallback.eurekaMoment) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#58A6FF', '#BC8CFF', '#F0883E'],
          });
          playEurekaSound();
          if (onBreakthrough) onBreakthrough(fallback.conceptLearned);
        }

        const finalFallbackTitle = fallback.sessionTitle || updatedSession.title;

        const fallbackSession: ChatSession = {
          ...updatedSession,
          title: finalFallbackTitle,
          messages: [...newMessages, tutorMessage],
          updatedAt: Date.now(),
        };

        setSessions((prev) =>
          prev.map((s) => (s.id === currentSession.id ? fallbackSession : s))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [sessions, activeSessionId, activeSession, isLoading, onQuestionAsked, onBreakthrough, playEurekaSound]
  );

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    const clean = newTitle.trim();
    if (!clean) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, title: clean, updatedAt: Date.now() };
        }
        return s;
      })
    );
  }, []);

  const autoGenerateSessionTitle = useCallback(async (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target) return;

    const firstUserMsg = target.messages.find((m) => m.role === 'user')?.content || '';
    const fallbackSmartTitle = generateMeaningfulTitle(firstUserMsg, target.subject);

    try {
      const res = await fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: target.messages,
          currentTitle: target.title,
          subject: target.subject,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && data.title !== target.title) {
          renameSession(sessionId, data.title);
          return;
        }
      }
    } catch (e) {
      console.warn('Auto-generate title failed, falling back to local synthesizer', e);
    }

    if (fallbackSmartTitle && fallbackSmartTitle !== target.title) {
      renameSession(sessionId, fallbackSmartTitle);
    }
  }, [sessions, renameSession]);

  const createNewSession = useCallback((initialPrompt?: string, subject?: string) => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Hello! I'm **Socratic Mentor**, your Socratic learning partner. 🤖

Instead of just handing you solutions, I'll ask guided questions to help you understand the core concepts and arrive at the answers yourself.

What subject or problem would you like to explore today?`,
      timestamp: Date.now(),
      guidanceType: 'question',
      suggestedReplies: [
        'How do I solve 2x + 5 = 15?',
        'Why is the sky blue?',
        'Explain the Pythagorean theorem',
        'How do binary search trees work?'
      ],
      eurekaMoment: false,
    };

    const newSession: ChatSession = {
      id: newSessionId,
      title: initialPrompt ? generateMeaningfulTitle(initialPrompt, subject) : 'New Exploration',
      subject: subject || 'General Inquiry',
      messages: [welcomeMessage],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      conceptsMastered: [],
    };

    setEurekaAlert(null);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);

    if (initialPrompt) {
      setTimeout(() => {
        sendMessage(initialPrompt, subject);
      }, 50);
    }
  }, [sendMessage]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const freshSession: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Exploration',
          subject: 'General Inquiry',
          messages: [INITIAL_WELCOME_MESSAGE],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          conceptsMastered: [],
        };
        setActiveSessionId(freshSession.id);
        return [freshSession];
      }
      if (sessionId === activeSessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  const clearCurrentSession = useCallback(() => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [INITIAL_WELCOME_MESSAGE],
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );
  }, [activeSessionId]);

  return {
    sessions,
    activeSession,
    activeSessionId,
    messages,
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
  };
}