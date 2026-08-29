import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile, UserPreferences } from '../types';
import { extractFirstName, getAvatarInitial } from '../lib/utils';

const STORAGE_KEY = 'my-mentor-user-profile';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  soundEnabled: true,
  socraticLevel: 'balanced',
  autoSpeakResponse: false,
};

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest-user',
  name: 'Curious Learner',
  email: '',
  avatar: 'C',
  isAnonymous: true,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalQuestionsAsked: 0,
  totalBreakthroughs: 0,
  masteredConcepts: [],
  savedSessions: [],
  preferences: DEFAULT_PREFERENCES,
};

export function useAuth() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load user profile from storage', e);
    }
    return DEFAULT_GUEST_USER;
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user profile to storage', e);
    }
  }, [user]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const lastDate = new Date(user.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setUser((prev) => {
        let newStreak = prev.streakDays;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        return {
          ...prev,
          lastActiveDate: today,
          streakDays: Math.max(1, newStreak),
        };
      });
    }
  }, [user.lastActiveDate]);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoginModalOpen(false);
    return { success: true };
  }, []);

  const signupWithEmail = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    const firstNameOnly = extractFirstName(name.trim() || email.split('@')[0]);
    setUser((prev) => ({
      ...prev,
      name: firstNameOnly,
      email: email.trim(),
      avatar: getAvatarInitial(firstNameOnly),
      isAnonymous: false,
    }));
    setIsLoginModalOpen(false);
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoginModalOpen(false);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    const freshGuest: UserProfile = {
      ...DEFAULT_GUEST_USER,
      id: `guest-${Date.now()}`,
      streakDays: 1,
    };
    setUser(freshGuest);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, []);

  const recordQuestionAsked = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      totalQuestionsAsked: prev.totalQuestionsAsked + 1,
    }));
  }, []);

  const recordBreakthrough = useCallback((concept?: string) => {
    setUser((prev) => {
      const newConcepts = concept && !prev.masteredConcepts.includes(concept)
        ? [concept, ...prev.masteredConcepts]
        : prev.masteredConcepts;

      return {
        ...prev,
        totalBreakthroughs: prev.totalBreakthroughs + 1,
        masteredConcepts: newConcepts,
      };
    });
  }, []);

  const updateUserProfile = useCallback((name: string, avatar?: string) => {
    setUser((prev) => {
      const cleanName = extractFirstName(name.trim() || prev.name);
      const cleanAvatar = avatar || getAvatarInitial(cleanName);
      return {
        ...prev,
        name: cleanName,
        avatar: cleanAvatar,
      };
    });
  }, []);

  const addMasteredConcept = useCallback((concept: string) => {
    const trimmed = concept.trim();
    if (!trimmed) return;
    setUser((prev) => {
      if (prev.masteredConcepts.includes(trimmed)) return prev;
      return {
        ...prev,
        masteredConcepts: [trimmed, ...prev.masteredConcepts],
      };
    });
  }, []);

  const removeMasteredConcept = useCallback((conceptToRemove: string) => {
    setUser((prev) => ({
      ...prev,
      masteredConcepts: prev.masteredConcepts.filter((c) => c !== conceptToRemove),
    }));
  }, []);

  const resetLearningStats = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      totalQuestionsAsked: 0,
      totalBreakthroughs: 0,
      masteredConcepts: [],
      streakDays: 1,
    }));
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPrefs,
      },
    }));
  }, []);

  return {
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
    updateUserProfile,
    addMasteredConcept,
    removeMasteredConcept,
    resetLearningStats,
    updatePreferences,
  };
}