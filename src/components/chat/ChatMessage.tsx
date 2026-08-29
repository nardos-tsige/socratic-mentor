import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Volume2, Bot, Trophy, Lightbulb, HelpCircle, ArrowRight, FileText, Image as ImageIcon, FileCode, File, ExternalLink, Zap } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatAttachment } from '../../types';
import { Badge } from '../ui/Badge';
import { UserAvatar } from '../ui/UserAvatar';
import { MathMarkdown } from './MathMarkdown';

interface ChatMessageProps {
  message: ChatMessageType;
  userName?: string;
  userAvatar?: string;
  onSelectReply?: (reply: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  isLoading?: boolean;
  soundEnabled?: boolean;
  isLatestMessage?: boolean;
  onOpenFileViewer?: (file: ChatAttachment) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userName,
  userAvatar,
  onSelectReply,
  isLoading = false,
  soundEnabled = true,
  isLatestMessage = true,
  onOpenFileViewer,
}) => {

  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasClickedOption, setHasClickedOption] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const cleanText = message.content
      .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
      .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/[*#_`]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/✦/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const cleanSuggestedReplies = message.suggestedReplies
    ? message.suggestedReplies.filter((r) => r && r.trim().length > 0).slice(0, 2)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col w-full ${isUser ? 'items-end ml-auto max-w-[90%] sm:max-w-[80%]' : 'items-start mr-auto max-w-[96%] sm:max-w-[88%]'}`}
    >
      <div className={`flex items-start gap-2 sm:gap-2.5 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {isUser ? (
          <UserAvatar name={userName || 'Learner'} avatar={userAvatar} size="xs" className="mt-0.5" />
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs shrink-0 bg-gradient-to-b from-[#161B22] to-[#0D1117] dark:from-[#21262D] dark:to-[#161B22] border border-[#059669]/40 dark:border-[#34D399]/40 text-[#059669] dark:text-[#34D399] shadow-sm relative group hover:scale-105 transition-transform">
            <Bot className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          </div>
        )}

        <div className="flex flex-col gap-1 w-full min-w-0">
          {!isUser && (
            <div className="flex items-center flex-wrap gap-2 mb-1 text-xs text-[#64748B] dark:text-[#8B949E]">
              <span className="font-bold text-[#059669] dark:text-[#34D399] flex items-center gap-1.5 bg-[#059669]/10 dark:bg-[#34D399]/15 px-2 py-0.5 rounded-lg border border-[#059669]/20 dark:border-[#34D399]/30">
                <Bot className="w-3.5 h-3.5" />
                <span className="tracking-tight">Socratic Mentor</span>
              </span>
              {message.guidanceType && (
                <Badge variant={message.guidanceType} className="text-[10px] py-0.5 px-2 font-medium">
                  {message.guidanceType === 'question' && (
                    <>
                      <HelpCircle className="w-3 h-3 text-[#059669] dark:text-[#34D399]" />
                      <span>Socratic Guidance Step</span>
                    </>
                  )}
                  {message.guidanceType === 'hint' && (
                    <>
                      <Lightbulb className="w-3 h-3 text-[#D97706] dark:text-[#D29922]" />
                      <span>Guided Hint</span>
                    </>
                  )}
                  {message.guidanceType === 'breakthrough' && (
                    <>
                      <Trophy className="w-3 h-3 text-[#EA580C] dark:text-[#F0883E]" />
                      <span>Eureka Moment!</span>
                    </>
                  )}
                  {message.guidanceType === 'validation' && (
                    <>
                      <Check className="w-3 h-3 text-[#16A34A] dark:text-[#3FB950]" />
                      <span>Thought Validated</span>
                    </>
                  )}
                  {message.guidanceType === 'challenge' && (
                    <>
                      <Zap className="w-3 h-3 text-[#7C3AED] dark:text-[#BC8CFF]" />
                      <span>Deep Dive Challenge</span>
                    </>
                  )}
                </Badge>
              )}
            </div>
          )}

          <div
            className={`p-3 sm:p-4 rounded-2xl relative group break-words overflow-hidden ${
              isUser
                ? 'bg-[#ECFDF5] dark:bg-[#34D399]/15 border border-[#A7F3D0] dark:border-[#34D399]/30 text-[#0F172A] dark:text-[#F0F6FC] rounded-tr-sm shadow-xs'
                : 'bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] text-[#0F172A] dark:text-[#F0F6FC] rounded-tl-sm shadow-xs'
            }`}
          >
            {Array.isArray(message.attachments) && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2.5">
                {message.attachments.map((att) => {
                  if (!att) return null;
                  const isImg =
                    (att.type && att.type.startsWith('image/')) ||
                    (att.url && att.url.startsWith('data:image/'));
                  const isCode =
                    att.textContent !== undefined ||
                    (att.name && Boolean(att.name.match(/\.(js|ts|tsx|jsx|py|json|html|css|sql|cpp|java|sh)$/i)));

                  const formatSize = (bytes?: number) => {
                    if (!bytes) return '0 B';
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                  };

                  return (
                    <div
                      key={att.id || att.name}
                      onClick={() => onOpenFileViewer && onOpenFileViewer(att)}
                      title="Click to open and view file"
                      className="group/att flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#161B22]/80 hover:bg-white dark:hover:bg-[#21262D] border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] transition-all cursor-pointer shadow-xs max-w-sm"
                    >
                      {isImg ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/5 border border-black/5 dark:border-white/5">
                          <img
                            src={att.url || ''}
                            alt={att.name || 'Image'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/att:scale-105 transition-transform"
                          />
                        </div>
                      ) : isCode ? (
                        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 dark:bg-[#BC8CFF]/10 text-[#7C3AED] dark:text-[#BC8CFF] flex items-center justify-center shrink-0">
                          <FileCode className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#059669]/10 dark:bg-[#34D399]/10 text-[#059669] dark:text-[#34D399] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-[#0F172A] dark:text-[#F0F6FC] truncate group-hover/att:text-[#059669] dark:group-hover/att:text-[#34D399]">
                          {att.name || 'Attached file'}
                        </p>
                        <p className="text-[10px] text-[#64748B] dark:text-[#8B949E]">
                          {formatSize(att.size)} • Click to open
                        </p>
                      </div>

                      <div className="p-1 rounded-lg text-[#64748B] dark:text-[#8B949E] group-hover/att:text-[#059669] dark:group-hover/att:text-[#34D399] transition-colors shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {isUser ? (
              <div className="text-sm leading-relaxed select-text">
                <MathMarkdown content={message.content} />
              </div>
            ) : (
              <MathMarkdown content={message.content} />
            )}

            <div className="mt-2 pt-1 flex items-center justify-end text-xs text-[#64748B] dark:text-[#8B949E]">
              <div className="flex items-center gap-1">
                {!isUser && 'speechSynthesis' in window && (
                  <button
                    onClick={handleSpeak}
                    title={isPlayingAudio ? 'Stop speaking' : 'Read aloud'}
                    className={`min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] transition-colors cursor-pointer ${
                      isPlayingAudio ? 'text-[#059669] dark:text-[#34D399] bg-[#059669]/10 dark:bg-[#34D399]/10' : 'text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  title="Copy message"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
                  aria-label="Copy message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {!isUser && isLatestMessage && !isLoading && !hasClickedOption && cleanSuggestedReplies.length > 0 && onSelectReply && (
            <div className="mt-1.5 pl-1 space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {cleanSuggestedReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setHasClickedOption(true);
                      onSelectReply(reply);
                    }}
                    className="text-xs text-left px-3 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] hover:border-[#059669] dark:hover:border-[#34D399] hover:bg-[#F1F5F9] dark:hover:bg-[#1C2128] text-[#0F172A] dark:text-[#F0F6FC] hover:text-[#059669] dark:hover:text-[#34D399] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs font-medium"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399] shrink-0" />
                    <span>{reply}</span>
                    <ArrowRight className="w-3 h-3 opacity-60 ml-0.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};