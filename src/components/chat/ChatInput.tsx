import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, HelpCircle, Paperclip, X, FileText, Image as ImageIcon, FileCode, File, Eye } from 'lucide-react';
import { ChatAttachment } from '../../types';

interface ChatInputProps {
  onSend: (message: string, attachments?: ChatAttachment[]) => void;
  isLoading: boolean;
  autoSaveStatus?: 'idle' | 'saving' | 'saved';
  placeholder?: string;
  onRequestHint?: () => void;
  onOpenFileViewer?: (file: ChatAttachment) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  placeholder = 'Type your answer or working thought here...',
  onRequestHint,
  onOpenFileViewer,
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleStuckClick = () => {
    if (onRequestHint) {
      onRequestHint();
    } else {
      onSend("I'm not quite sure where to start. Could you give me a small hint or break this down?");
    }
  };

  const processFiles = async (
    files: FileList | File[] | Blob[],
    customNames?: string[]
  ) => {
    const newAttachments: ChatAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const fileName =
        (customNames && customNames[i]) ||
        ('name' in file && (file as File).name) ||
        (file.type.startsWith('image/')
          ? `Pasted_Image_${new Date().toLocaleTimeString().replace(/:/g, '-')}.png`
          : `Pasted_File_${new Date().toLocaleTimeString().replace(/:/g, '-')}`);

      // Check if file is text/code/data
      const isText =
        file.type.startsWith('text/') ||
        file.type === 'application/json' ||
        file.type === 'application/javascript' ||
        Boolean(fileName.match(/\.(txt|md|js|ts|tsx|jsx|py|json|html|css|csv|sql|java|c|cpp|rb|go|rs|sh|log|xml|yaml|yml)$/i));

      let textContent: string | undefined = undefined;
      let url = '';

      if (isText && file.size < 1024 * 1024 * 5) {
        // Read text content up to 5MB
        textContent = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsText(file);
        });
      }

      if (file.type.startsWith('image/') && file.size < 1024 * 1024 * 12) {
        url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      } else {
        try {
          url = URL.createObjectURL(file);
        } catch {
          url = '';
        }
      }

      newAttachments.push({
        id,
        name: fileName,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url,
        textContent,
      });
    }

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  // Dedicated paste handler for clipboard images & files
  const handlePaste = async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    const filesToProcess: (File | Blob)[] = [];
    const customNames: string[] = [];

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const imageFile = item.getAsFile();
          if (imageFile) {
            const timeStr = new Date().toLocaleTimeString().replace(/:/g, '-');
            const customName =
              'name' in imageFile && imageFile.name && imageFile.name !== 'image.png'
                ? imageFile.name
                : `Pasted_Screenshot_${timeStr}.png`;

            filesToProcess.push(imageFile);
            customNames.push(customName);
          }
        } else if (item.kind === 'file') {
          const f = item.getAsFile();
          if (f) {
            filesToProcess.push(f);
            customNames.push(('name' in f && f.name) || `Pasted_File_${Date.now()}`);
          }
        }
      }
    }

    // Also check clipboardData.files for copied files
    if (filesToProcess.length === 0 && clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        const f = clipboardData.files[i];
        filesToProcess.push(f);
        customNames.push(f.name || `Pasted_File_${Date.now()}`);
      }
    }

    if (filesToProcess.length > 0) {
      await processFiles(filesToProcess, customNames);

      // If an image or file was pasted and no meaningful text was in clipboard, prevent default
      const textData = clipboardData.getData('text/plain');
      if (!textData || !textData.trim()) {
        e.preventDefault();
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0D1117] dark:via-[#0D1117]/95 dark:to-transparent pt-3 pb-4 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept="*/*"
        />

        {/* Main Prompting Text Box Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          className={`relative flex flex-col bg-white dark:bg-[#161B22] border ${
            isDragging
              ? 'border-[#059669] dark:border-[#34D399] ring-2 ring-[#059669]/20 bg-[#ECFDF5]/30 dark:bg-[#34D399]/10'
              : 'border-[#CBD5E1] dark:border-[#30363D] focus-within:border-[#059669] dark:focus-within:border-[#34D399] focus-within:ring-2 focus-within:ring-[#059669]/15 dark:focus-within:ring-[#34D399]/20'
          } rounded-2xl p-2.5 sm:p-3.5 shadow-md transition-all`}
        >
          {/* Staged Attachments Preview Bar */}
          {Array.isArray(attachments) && attachments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-[#E2E8F0] dark:border-[#30363D]/60">
              {attachments.map((att) => {
                if (!att) return null;
                const isImg =
                  (att.type && att.type.startsWith('image/')) ||
                  (att.url && att.url.startsWith('data:image/'));
                const isCode =
                  att.textContent !== undefined ||
                  (att.name && Boolean(att.name.match(/\.(js|ts|tsx|jsx|py|json|html|css|sql|cpp|java)$/i)));

                return (
                  <div
                    key={att.id}
                    onClick={() => onOpenFileViewer && onOpenFileViewer(att)}
                    title="Click to view file"
                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#21262D] hover:bg-[#E2E8F0] dark:hover:bg-[#30363D] border border-[#CBD5E1] dark:border-[#30363D] text-xs text-[#0F172A] dark:text-[#F0F6FC] transition-colors cursor-pointer max-w-xs"
                  >
                    {isImg ? (
                      <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-black/5">
                        <img
                          src={att.url}
                          alt={att.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : isCode ? (
                      <FileCode className="w-4 h-4 text-[#7C3AED] dark:text-[#BC8CFF] shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#059669] dark:text-[#34D399] shrink-0" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[11px] leading-tight">{att.name}</p>
                      <p className="text-[9px] text-[#64748B] dark:text-[#8B949E]">{formatSize(att.size)}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveAttachment(att.id, e)}
                        title="Remove file"
                        className="p-1 rounded-full hover:bg-red-500/20 text-[#64748B] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full bg-transparent text-[#0F172A] dark:text-[#F0F6FC] placeholder:text-[#94A3B8] dark:placeholder:text-[#8B949E] text-sm sm:text-base resize-none focus:outline-none max-h-44 min-h-[44px] py-1.5 px-2 leading-relaxed"
          />

          {/* Prompting Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#30363D]/50 mt-1 gap-2">
            {/* Left Actions: Attach File icon & Socratic Hint helper */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* File Upload Icon Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Attach document, image, or problem file (click to select or drag & drop)"
                aria-label="Attach file"
                className="text-xs text-[#64748B] dark:text-[#8B949E] hover:text-[#059669] dark:hover:text-[#34D399] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#30363D] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
              >
                <Paperclip className="w-4 h-4 text-[#059669] dark:text-[#34D399] shrink-0" />
                <span className="hidden sm:inline font-medium">Attach File</span>
              </button>

              <button
                type="button"
                onClick={handleStuckClick}
                disabled={isLoading}
                title="Ask Socratic mentor for a guiding hint"
                className="text-xs text-[#64748B] dark:text-[#8B949E] hover:text-[#059669] dark:hover:text-[#34D399] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] px-2 sm:px-2.5 py-1.5 rounded-xl border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#30363D] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#D97706] dark:text-[#D29922] shrink-0" />
                <span className="hidden sm:inline font-medium">I'm stuck / Need a hint</span>
                <span className="sm:hidden font-medium">Hint / Stuck?</span>
              </button>
            </div>

            {/* Right Actions: Send Button */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleSend}
                disabled={(!text.trim() && attachments.length === 0) || isLoading}
                aria-label="Send message"
                className={`min-w-[38px] min-h-[38px] sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  (text.trim() || attachments.length > 0) && !isLoading
                    ? 'bg-[#059669] dark:bg-[#34D399] text-white dark:text-[#0D1117] hover:bg-[#047857] dark:hover:bg-[#6EE7B7] shadow-sm hover:shadow-md active:scale-95'
                    : 'bg-[#F1F5F9] dark:bg-[#21262D] text-[#94A3B8] dark:text-[#8B949E] cursor-not-allowed opacity-50'
                }`}
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 font-bold stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


