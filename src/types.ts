export type GuidanceType = 
  | 'question' 
  | 'hint' 
  | 'validation' 
  | 'breakthrough' 
  | 'challenge';

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  textContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  guidanceType?: GuidanceType;
  suggestedReplies?: string[];
  eurekaMoment?: boolean;
  conceptLearned?: string;
  isLoading?: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  conceptsMastered: string[];
  streakContributed?: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  socraticLevel: 'guided' | 'balanced' | 'rigorous';
  autoSpeakResponse?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAnonymous: boolean;
  streakDays: number;
  lastActiveDate: string;
  totalQuestionsAsked: number;
  totalBreakthroughs: number;
  masteredConcepts: string[];
  savedSessions: string[]; // session IDs
  preferences: UserPreferences;
}

export interface SuggestionChipItem {
  id: string;
  title: string;
  prompt: string;
  category: 'Math' | 'Science' | 'Computer Science' | 'Philosophy' | 'Language' | 'Everyday';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SubjectArea {
  id: string;
  name: string;
  iconName: string;
  description: string;
  sampleQuestions: string[];
}
