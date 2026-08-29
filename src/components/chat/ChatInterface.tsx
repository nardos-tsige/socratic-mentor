import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Share2,
  PanelLeftClose,
  PanelLeft,
  Bot,
  Trophy,
  X,
  BookOpen,
  MessageSquare,
  Volume2,
  VolumeX,
  RotateCcw,
  Search,
  Check,
  ChevronUp,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { SuggestionChips } from './SuggestionChips';
import { Badge } from '../ui/Badge';
import { UserAvatar } from '../ui/UserAvatar';
import { ShareModal } from '../modals/ShareModal';
import { ResetModal } from '../modals/ResetModal';
import { DeleteSessionModal } from '../modals/DeleteSessionModal';
import { FileViewerModal } from '../modals/FileViewerModal';
import { ChatSession, UserProfile, ChatAttachment } from '../../types';
import { CURATED_SUGGESTIONS } from '../../lib/ai/socraticPrompt';

interface ChatInterfaceProps {
  sessions: ChatSession[];
  activeSession: ChatSession;
  activeSessionId: string;
  isLoading: boolean;
  autoSaveStatus: 'idle' | 'saving' | 'saved';
  eurekaAlert: { active: boolean; concept: string } | null;
  user: UserProfile;
  onSendMessage: (message: string, attachments?: ChatAttachment[], subject?: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onSelectSession: (id: string) => void;
  onCreateNewSession: (initialPrompt?: string, subject?: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => void;
  onAutoGenerateTitle?: (id: string) => Promise<void>;
  onClearCurrentSession: () => void;
  onDismissEureka: () => void;
  onOpenLoginModal?: () => void;
  onOpenGuideModal?: () => void;
  onLogout?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessions,
  activeSession,
  activeSessionId,
  isLoading,
  autoSaveStatus,
  eurekaAlert,
  user,
  onSendMessage,
  onEditMessage,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  onRenameSession,
  onAutoGenerateTitle,
  onClearCurrentSession,
  onDismissEureka,
  onOpenLoginModal,
  onOpenGuideModal,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);
  const [showExportNotice, setShowExportNotice] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [starterSuggestionClicked, setStarterSuggestionClicked] = useState(false);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [viewingFile, setViewingFile] = useState<ChatAttachment | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dialogueContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDialogueScroll = () => {
    if (!dialogueContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = dialogueContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setIsScrolledUp(distanceToBottom > 150);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  useEffect(() => {
    setStarterSuggestionClicked(false);
  }, [activeSessionId]);

  const handleExportSession = () => {
    if (!activeSession) return;
    const formatted = activeSession.messages
      .map((m) => `[${m.role.toUpperCase()}] (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.content}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([`🤖 Socratic Mentor Session: ${activeSession.title}\n\n${formatted}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socratic-session-${activeSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setShowExportNotice(true);
    setTimeout(() => setShowExportNotice(false), 3000);
  };

  const handleConfirmReset = () => {
    onClearCurrentSession();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (s.subject && s.subject.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const isNewSession = !activeSession || activeSession.messages.length <= 1;

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)] bg-[#F8FAFC] dark:bg-[#0D1117] text-[#0F172A] dark:text-[#F0F6FC] transition-colors relative">
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-20 flex flex-col h-full bg-white dark:bg-[#161B22] border-r border-[#E2E8F0] dark:border-[#30363D] transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
          mobileSidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${
          desktopSidebarExpanded ? 'md:w-72' : 'md:w-0 md:border-r-0'
        }`}
      >
        <div className="p-3.5 border-b border-[#E2E8F0] dark:border-[#30363D] shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onCreateNewSession();
                setMobileSidebarOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#059669] dark:bg-[#34D399] text-white dark:text-[#0D1117] text-xs sm:text-sm font-semibold hover:bg-[#047857] dark:hover:bg-[#6EE7B7] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Dialogue</span>
            </button>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                setDesktopSidebarExpanded(false);
              }}
              title="Close sidebar"
              className="p-2 rounded-xl text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#8B949E]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search dialogues..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F1F5F9] dark:bg-[#0D1117] border border-[#CBD5E1] dark:border-[#30363D] rounded-lg text-[#0F172A] dark:text-[#F0F6FC] placeholder:text-[#94A3B8] dark:placeholder:text-[#8B949E] focus:outline-none focus:border-[#059669] dark:focus:border-[#34D399]"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#64748B] dark:text-[#8B949E] uppercase tracking-wider flex items-center justify-between">
            <span>Recent Sessions</span>
            <span className="text-[10px] font-normal">{filteredSessions.length}</span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#94A3B8] dark:text-[#8B949E]">
              No sessions found
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectSession(session.id);
                      setMobileSidebarOpen(false);
                    }
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#ECFDF5] dark:bg-[#1F242C] text-[#059669] dark:text-[#34D399] font-medium border border-[#A7F3D0] dark:border-[#30363D] shadow-xs'
                      : 'text-[#475569] dark:text-[#8B949E] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] hover:text-[#0F172A] dark:hover:text-[#F0F6FC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 pr-1.5 min-w-0">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#059669] dark:text-[#34D399]' : 'opacity-60'}`} />
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitleText}
                          onChange={(e) => setEditingTitleText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (onRenameSession && editingTitleText.trim()) {
                                onRenameSession(session.id, editingTitleText.trim());
                              }
                              setEditingSessionId(null);
                            } else if (e.key === 'Escape') {
                              setEditingSessionId(null);
                            }
                          }}
                          autoFocus
                          className="w-full bg-white dark:bg-[#0D1117] border border-[#059669] dark:border-[#34D399] text-[#0F172A] dark:text-[#F0F6FC] px-1.5 py-0.5 rounded text-xs focus:outline-hidden"
                        />
                        <button
                          onClick={() => {
                            if (onRenameSession && editingTitleText.trim()) {
                              onRenameSession(session.id, editingTitleText.trim());
                            }
                            setEditingSessionId(null);
                          }}
                          className="p-1 rounded hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                          title="Save title"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingSessionId(null)}
                          className="p-1 rounded hover:bg-slate-500/20 text-slate-500 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="truncate text-left flex-1 min-w-0">
                        <div className="truncate font-medium">{session.title || 'Untitled Session'}</div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      {onRenameSession && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(session.id);
                            setEditingTitleText(session.title || '');
                          }}
                          title="Rename session"
                          className="p-1 rounded hover:bg-[#059669]/10 dark:hover:bg-[#34D399]/15 hover:text-[#059669] dark:hover:text-[#34D399] text-[#94A3B8] opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label={`Rename ${session.title}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session);
                        }}
                        title="Delete session"
                        className="p-1 rounded hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 text-[#94A3B8] opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label={`Delete ${session.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="relative mt-auto border-t border-[#E2E8F0] dark:border-[#30363D] p-2.5 bg-[#F8FAFC] dark:bg-[#0D1117]/80 shrink-0">
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-transparent">
            <div className="flex items-center gap-2.5 text-left flex-1 overflow-hidden">
              <UserAvatar name={user.name || 'Learner'} avatar={user.avatar || '👤'} size="md" />
              <div className="truncate">
                <div className="font-semibold text-xs text-[#0F172A] dark:text-[#F0F6FC] truncate">
                  {user.name || 'Learner'}
                </div>
                <div className="text-[10px] text-[#64748B] dark:text-[#8B949E] font-medium truncate">
                  Auto-saved locally
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
        <div className="h-14 px-3 sm:px-6 border-b border-[#E2E8F0] dark:border-[#30363D] bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 z-10 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileSidebarOpen(true);
                } else {
                  setDesktopSidebarExpanded(!desktopSidebarExpanded);
                }
              }}
              title="Toggle sessions sidebar"
              className="p-2 rounded-xl text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] border border-[#CBD5E1] dark:border-[#30363D] transition-colors cursor-pointer shrink-0"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 truncate">
              {editingSessionId === activeSession?.id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editingTitleText}
                    onChange={(e) => setEditingTitleText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (onRenameSession && activeSession && editingTitleText.trim()) {
                          onRenameSession(activeSession.id, editingTitleText.trim());
                        }
                        setEditingSessionId(null);
                      } else if (e.key === 'Escape') {
                        setEditingSessionId(null);
                      }
                    }}
                    autoFocus
                    className="bg-white dark:bg-[#0D1117] border border-[#059669] dark:border-[#34D399] text-[#0F172A] dark:text-[#F0F6FC] px-2 py-0.5 rounded-lg text-sm font-semibold focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (onRenameSession && activeSession && editingTitleText.trim()) {
                        onRenameSession(activeSession.id, editingTitleText.trim());
                      }
                      setEditingSessionId(null);
                    }}
                    className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                    title="Save title"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingSessionId(null)}
                    className="p-1 rounded-lg hover:bg-slate-500/20 text-slate-500 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/header">
                  <span className="font-semibold text-sm sm:text-base text-[#0F172A] dark:text-[#F0F6FC] truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                    {activeSession?.title || 'Socratic Dialogue'}
                  </span>

                  {onRenameSession && activeSession && (
                    <button
                      onClick={() => {
                        setEditingSessionId(activeSession.id);
                        setEditingTitleText(activeSession.title || '');
                      }}
                      title="Rename conversation"
                      className="p-1 rounded-lg text-[#64748B] dark:text-[#8B949E] hover:text-[#059669] dark:hover:text-[#34D399] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] transition-colors cursor-pointer opacity-60 hover:opacity-100"
                      aria-label="Rename conversation"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsResetModalOpen(true)}
              title="Reset current conversation"
              className="p-2 rounded-xl text-[#64748B] dark:text-[#8B949E] hover:text-[#EA580C] dark:hover:text-[#F0883E] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              aria-label="Reset current conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              title="Share dialogue"
              className="p-2 rounded-xl text-[#64748B] dark:text-[#8B949E] hover:text-[#059669] dark:hover:text-[#34D399] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              aria-label="Share dialogue"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showResetNotice && (
          <div className="absolute top-16 right-4 z-30 bg-white dark:bg-[#161B22] border border-[#059669] dark:border-[#34D399]/60 text-[#059669] dark:text-[#34D399] px-3.5 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 animate-fadeIn">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dialogue restarted fresh from opening question!</span>
          </div>
        )}

        {showExportNotice && (
          <div className="absolute top-16 right-4 z-30 bg-white dark:bg-[#161B22] border border-[#16A34A] dark:border-[#3FB950]/50 text-[#16A34A] dark:text-[#3FB950] px-3.5 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Transcript downloaded successfully!</span>
          </div>
        )}

        <div
          ref={dialogueContainerRef}
          onScroll={handleDialogueScroll}
          className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-6 py-6 space-y-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {activeSession && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-[#059669]/10 dark:bg-[#34D399]/15 border border-[#059669]/30 dark:border-[#34D399]/30 flex items-center justify-center text-[#059669] dark:text-[#34D399] shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="truncate text-xs">
                    <span className="font-semibold text-[#0F172A] dark:text-[#F0F6FC]">
                      {activeSession.title}
                    </span>
                    <span className="mx-2 opacity-40">•</span>
                    <span className="text-[#64748B] dark:text-[#8B949E]">
                      {activeSession.messages.length} exchanges
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {activeSession.subject && (
                    <Badge variant="category" className="text-[10px] shrink-0">
                      {activeSession.subject}
                    </Badge>
                  )}
                  {onOpenGuideModal && (
                    <button
                      onClick={onOpenGuideModal}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-[#059669]/10 dark:bg-[#34D399]/15 hover:bg-[#059669]/20 text-[#059669] dark:text-[#34D399] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      title="Learn how Socratic guidance works"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>How Guiding Works</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#059669]/5 via-purple-500/5 to-transparent dark:from-[#34D399]/10 dark:via-purple-500/10 border border-[#059669]/20 dark:border-[#34D399]/20 flex items-center justify-between text-xs text-[#64748B] dark:text-[#8B949E]">
              <div className="flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[#0F172A] dark:text-[#F0F6FC] font-medium">
                  AI Socratic Dialogue
                </span>
                <span className="hidden sm:inline opacity-60">•</span>
                <span className="hidden sm:inline">
                  Guided reasoning, conceptual breakthroughs & code analysis
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#059669] dark:text-[#34D399] flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Active Mentor</span>
              </span>
            </div>

            {activeSession?.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                userName={user.name}
                userAvatar={user.avatar}
                isLatestMessage={index === (activeSession?.messages.length ?? 0) - 1}
                onSelectReply={(reply) => onSendMessage(reply, undefined, activeSession.subject)}
                onEditMessage={onEditMessage}
                onOpenFileViewer={(file) => setViewingFile(file)}
                isLoading={isLoading}
              />
            ))}

            {isLoading && <TypingIndicator />}

            {isNewSession && !isLoading && !starterSuggestionClicked && activeSession?.messages.length <= 1 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#8B949E] mb-2 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                  <span>Choose a concept to explore together:</span>
                </div>
                <SuggestionChips
                  suggestions={CURATED_SUGGESTIONS.slice(0, 2)}
                  onSelect={(prompt, cat) => {
                    setStarterSuggestionClicked(true);
                    onSendMessage(prompt, undefined, cat);
                  }}
                />
              </div>
            )}

            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {isScrolledUp && (
          <div className="absolute bottom-28 right-6 sm:right-10 z-30">
            <button
              onClick={scrollToBottom}
              title="Scroll to bottom"
              aria-label="Scroll to bottom"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] text-[#059669] dark:text-[#34D399] shadow-md hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-fade-in"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="shrink-0 z-20">
          <ChatInput
            onSend={(msg, atts) => onSendMessage(msg, atts, activeSession?.subject)}
            onOpenFileViewer={(file) => setViewingFile(file)}
            isLoading={isLoading}
            autoSaveStatus={autoSaveStatus}
            placeholder={
              !isNewSession
                ? 'Type your answer, hypothesis, or reasoning here...'
                : 'What concept or question would you like to explore together?'
            }
            onRequestHint={() =>
              onSendMessage("I'm feeling stuck on this step. Could you offer a guided hint or ask a simpler sub-question?")
            }
          />
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        session={activeSession}
        user={user}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        onStartNewSession={() => onCreateNewSession()}
        sessionTitle={activeSession?.title}
      />

      <DeleteSessionModal
        isOpen={sessionToDelete !== null}
        onClose={() => setSessionToDelete(null)}
        onConfirmDelete={() => {
          if (sessionToDelete) {
            onDeleteSession(sessionToDelete.id);
            setSessionToDelete(null);
          }
        }}
        sessionTitle={sessionToDelete?.title}
      />

      <FileViewerModal
        isOpen={viewingFile !== null}
        onClose={() => setViewingFile(null)}
        file={viewingFile}
      />
    </div>
  );
};
