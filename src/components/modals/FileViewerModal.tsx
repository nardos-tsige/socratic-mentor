import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, FileCode, File, Copy, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ChatAttachment } from '../../types';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ChatAttachment | null;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith('image/') || file.url.startsWith('data:image/');
  const isTextOrCode =
    file.textContent !== undefined ||
    file.type.startsWith('text/') ||
    file.name.endsWith('.txt') ||
    file.name.endsWith('.md') ||
    file.name.endsWith('.js') ||
    file.name.endsWith('.ts') ||
    file.name.endsWith('.tsx') ||
    file.name.endsWith('.jsx') ||
    file.name.endsWith('.py') ||
    file.name.endsWith('.json') ||
    file.name.endsWith('.html') ||
    file.name.endsWith('.css') ||
    file.name.endsWith('.csv') ||
    file.name.endsWith('.sql');
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleCopyText = () => {
    if (file.textContent) {
      navigator.clipboard.writeText(file.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    if (file.url) {
      const win = window.open();
      if (win) {
        if (isImage) {
          win.document.write(`<img src="${file.url}" style="max-width:100%; height:auto; margin: auto; display:block;" />`);
        } else if (file.textContent) {
          win.document.write(`<pre style="font-family:monospace; padding:20px; white-space:pre-wrap;">${file.textContent.replace(/</g, '&lt;')}</pre>`);
        } else {
          win.location.href = file.url;
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/80">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-2 rounded-lg bg-[#2563EB]/10 dark:bg-[#58A6FF]/10 text-[#2563EB] dark:text-[#58A6FF] shrink-0">
              {isImage ? (
                <ImageIcon className="w-4 h-4" />
              ) : isTextOrCode ? (
                <FileCode className="w-4 h-4" />
              ) : isPdf ? (
                <FileText className="w-4 h-4" />
              ) : (
                <File className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-[#0F172A] dark:text-[#F0F6FC] truncate">
                {file.name}
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8B949E]">
                {formatFileSize(file.size)} • {file.type || 'File'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isTextOrCode && file.textContent && (
              <button
                type="button"
                onClick={handleCopyText}
                title="Copy file content"
                className="p-2 rounded-lg text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] hover:bg-[#E2E8F0] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}

            {isImage && (
              <div className="hidden sm:flex items-center gap-1 mr-1 bg-[#E2E8F0]/60 dark:bg-[#21262D] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  title="Zoom out"
                  className="p-1 rounded text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] px-1 font-mono text-[#64748B] dark:text-[#8B949E]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  title="Zoom in"
                  className="p-1 rounded text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  title="Reset zoom"
                  className="p-1 rounded text-[#64748B] dark:text-[#8B949E] hover:text-[#0F172A] dark:hover:text-[#F0F6FC] cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenNewTab}
              title="Open in new window"
              className="p-2 rounded-lg text-[#64748B] dark:text-[#8B949E] hover:text-[#2563EB] dark:hover:text-[#58A6FF] hover:bg-[#E2E8F0] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              title="Download file"
              className="p-2 rounded-lg text-[#64748B] dark:text-[#8B949E] hover:text-[#2563EB] dark:hover:text-[#58A6FF] hover:bg-[#E2E8F0] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close modal"
              className="p-2 rounded-lg text-[#64748B] dark:text-[#8B949E] hover:text-red-600 dark:hover:text-red-400 hover:bg-[#E2E8F0] dark:hover:bg-[#21262D] transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#F1F5F9]/50 dark:bg-[#0D1117]/50 min-h-[300px]">
          {isImage ? (
            <div className="flex items-center justify-center overflow-auto max-h-[70vh] w-full">
              <img
                src={file.url}
                alt={file.name}
                referrerPolicy="no-referrer"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md transition-transform duration-150"
              />
            </div>
          ) : isTextOrCode && file.textContent ? (
            <div className="w-full h-full max-h-[65vh] overflow-auto bg-white dark:bg-[#0D1117] border border-[#CBD5E1] dark:border-[#30363D] rounded-xl p-4 font-mono text-xs sm:text-sm text-[#0F172A] dark:text-[#F0F6FC] leading-relaxed whitespace-pre-wrap select-text">
              {file.textContent}
            </div>
          ) : isPdf ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8 bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl max-w-md">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                <FileText className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A] dark:text-[#F0F6FC] text-base mb-1">
                  PDF Document: {file.name}
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#8B949E]">
                  Size: {formatFileSize(file.size)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#58A6FF] text-white dark:text-[#0D1117] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF in New Tab</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-[#30363D] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] text-[#0F172A] dark:text-[#F0F6FC] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8 bg-white dark:bg-[#161B22] border border-[#CBD5E1] dark:border-[#30363D] rounded-2xl max-w-md">
              <div className="p-4 rounded-2xl bg-[#2563EB]/10 dark:bg-[#58A6FF]/10 text-[#2563EB] dark:text-[#58A6FF]">
                <File className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A] dark:text-[#F0F6FC] text-base mb-1">
                  {file.name}
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#8B949E]">
                  {formatFileSize(file.size)} • {file.type || 'Binary / Document'}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#58A6FF] text-white dark:text-[#0D1117] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-[#30363D] hover:bg-[#F1F5F9] dark:hover:bg-[#21262D] text-[#0F172A] dark:text-[#F0F6FC] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Browser</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] dark:border-[#30363D] bg-[#F8FAFC] dark:bg-[#0D1117]/80">
          <span className="text-xs text-[#64748B] dark:text-[#8B949E]">
            Click anywhere outside or press Esc to close
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#21262D] hover:bg-[#E2E8F0] dark:hover:bg-[#30363D] text-[#0F172A] dark:text-[#F0F6FC] text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
