import React, { useState } from 'react';
import katex from 'katex';
import { Copy, Check, Terminal } from 'lucide-react';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

// Safely render KaTeX math string to HTML string
function renderMath(math: string, displayMode: boolean): string {
  const cleanMath = math.trim();
  if (!cleanMath) return '';

  try {
    return katex.renderToString(cleanMath, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch {
    // If KaTeX fails, return cleaned math with clean typographic styling
    return `<span class="font-serif italic font-medium">${cleanMath}</span>`;
  }
}

// Normalize incoming text to resolve double-escaped newlines and slashes from LLM JSON responses
function normalizeRawContent(raw: string): string {
  if (!raw) return '';
  let normalized = raw;

  // 1. Replace literal '\n' sequences with real newline characters
  normalized = normalized.replace(/\\n/g, '\n');

  // 2. Replace literal '\t' with spaces
  normalized = normalized.replace(/\\t/g, '  ');

  // 3. Clean up double-escaped math delimiters: \\( -> \(, \\) -> \), \\[ -> \[, \\] -> \]
  normalized = normalized.replace(/\\\\([()[\]])/g, '\\$1');

  return normalized;
}

// Modular Code Block with one-click copy and syntax label
const CodeBlockRenderer: React.FC<{ content: string; language?: string }> = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#CBD5E1] dark:border-[#30363D] bg-[#0F172A] dark:bg-[#0D1117] shadow-sm">
      {/* Code Header Bar */}
      <div className="px-3 py-1.5 bg-[#1E293B] dark:bg-[#161B22] border-b border-[#334155] dark:border-[#30363D] text-[11px] font-mono font-medium text-[#94A3B8] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#CBD5E1] dark:text-[#E6EDF3]">
          <Terminal className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
          <span>{language || 'code'}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer text-[10px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#10B981]" />
              <span className="text-[#10B981] font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3.5 text-xs font-mono text-[#F1F5F9] dark:text-[#E6EDF3] overflow-x-auto m-0 leading-relaxed font-['JetBrains_Mono',monospace]">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const normalized = normalizeRawContent(content);
  // Split content into blocks: Code blocks, Display Math blocks on standalone lines, and text blocks
  const blocks = parseBlocks(normalized);

  return (
    <div className={`socratic-prose space-y-2 text-sm leading-relaxed ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'displayMath') {
          const html = renderMath(block.content, true);
          return (
            <div
              key={index}
              className="my-3 py-2.5 px-3 sm:px-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] overflow-x-auto flex items-center justify-center text-center shadow-xs text-[#0F172A] dark:text-[#F0F6FC]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (block.type === 'codeBlock') {
          return (
            <CodeBlockRenderer
              key={index}
              content={block.content}
              language={block.language}
            />
          );
        }

        // Standard text lines / paragraphs
        const lines = block.content.split('\n');
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (trimmed === '') {
                return <div key={lineIdx} className="h-1" />;
              }

              // Headers (#, ##, ###)
              if (line.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="font-bold text-sm text-[#0F172A] dark:text-[#F0F6FC] mt-2 mb-1">
                    <InlineContent text={line.slice(4)} />
                  </h4>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h3 key={lineIdx} className="font-bold text-base text-[#0F172A] dark:text-[#F0F6FC] mt-2 mb-1">
                    <InlineContent text={line.slice(3)} />
                  </h3>
                );
              }
              if (line.startsWith('# ')) {
                return (
                  <h2 key={lineIdx} className="font-bold text-lg text-[#0F172A] dark:text-[#F0F6FC] mt-2.5 mb-1.5">
                    <InlineContent text={line.slice(2)} />
                  </h2>
                );
              }

              // Blockquote (> ...)
              if (line.startsWith('> ')) {
                return (
                  <blockquote
                    key={lineIdx}
                    className="border-l-3 border-[#059669] dark:border-[#34D399] pl-3 py-0.5 italic text-[#475569] dark:text-[#8B949E] bg-[#059669]/5 dark:bg-[#34D399]/5 rounded-r-lg"
                  >
                    <InlineContent text={line.replace(/^>\s*/, '')} />
                  </blockquote>
                );
              }

              // Bullet points (- or * or •)
              if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#059669] dark:text-[#34D399] font-bold text-sm mt-0.5 leading-none shrink-0">•</span>
                    <div className="flex-1">
                      <InlineContent text={line.replace(/^[-*•]\s*/, '')} />
                    </div>
                  </div>
                );
              }

              // Numbered list item (1. 2.)
              const numMatch = line.match(/^(\d+)\.\s*(.*)/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#7C3AED] dark:text-[#BC8CFF] font-semibold text-xs mt-0.5 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <div className="flex-1">
                      <InlineContent text={numMatch[2]} />
                    </div>
                  </div>
                );
              }

              // Standard paragraph line
              return (
                <p key={lineIdx}>
                  <InlineContent text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Subcomponent to parse and render inline tokens: Math ($$...$$, $...$, \(...\), \[...\]), Code `...`, Bold **...**, Italic *...*
const InlineContent: React.FC<{ text: string }> = ({ text }) => {
  const tokens = parseInlineTokens(text);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.type === 'math') {
          const html = renderMath(token.value, false);
          return (
            <span
              key={i}
              className="inline-math px-0.5 py-0.5 rounded text-[#0F172A] dark:text-[#F0F6FC] font-medium align-baseline inline-block"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (token.type === 'code') {
          return (
            <code
              key={i}
              className="bg-[#059669]/10 dark:bg-[#34D399]/10 text-[#059669] dark:text-[#34D399] px-1.5 py-0.5 rounded font-mono text-xs border border-[#059669]/20 dark:border-[#34D399]/20 font-medium font-['JetBrains_Mono',monospace]"
            >
              {token.value}
            </code>
          );
        }

        if (token.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-[#0F172A] dark:text-[#F0F6FC]">
              <InlineContent text={token.value} />
            </strong>
          );
        }

        if (token.type === 'italic') {
          return (
            <em key={i} className="italic text-[#475569] dark:text-[#8B949E]">
              <InlineContent text={token.value} />
            </em>
          );
        }

        return <span key={i}>{token.value}</span>;
      })}
    </>
  );
};

interface Block {
  type: 'text' | 'displayMath' | 'codeBlock';
  content: string;
  language?: string;
}

function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  let remaining = raw;

  while (remaining.length > 0) {
    // 1. Check for fenced code block: ```lang ... ```
    const codeMatch = remaining.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
    if (codeMatch && codeMatch.index === 0) {
      blocks.push({
        type: 'codeBlock',
        language: codeMatch[1] || undefined,
        content: codeMatch[2].replace(/\n$/, ''),
      });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 2. Check for display math block on its own line/block: \n$$ ... $$\n or ^$$ ... $$
    const displayMathMatch =
      remaining.match(/^(?:\n|^)\$\$([\s\S]*?)\$\$(?:\n|$)/) ||
      remaining.match(/^(?:\n|^)\\\[([\s\S]*?)\\\](?:\n|$)/);

    if (displayMathMatch && displayMathMatch.index === 0) {
      blocks.push({
        type: 'displayMath',
        content: displayMathMatch[1].trim(),
      });
      remaining = remaining.slice(displayMathMatch[0].length);
      continue;
    }

    // 3. Find next standalone code or display math block
    const nextCodeIdx = remaining.indexOf('```');
    const nextStandaloneMath = remaining.search(/(?:\n|^)\$\$[\s\S]*?\$\$/);

    const candidates = [nextCodeIdx, nextStandaloneMath].filter((idx) => idx > 0);
    const nextSpecialIdx = candidates.length > 0 ? Math.min(...candidates) : -1;

    if (nextSpecialIdx > 0) {
      blocks.push({
        type: 'text',
        content: remaining.slice(0, nextSpecialIdx),
      });
      remaining = remaining.slice(nextSpecialIdx);
    } else {
      blocks.push({
        type: 'text',
        content: remaining,
      });
      remaining = '';
    }
  }

  return blocks;
}

interface InlineToken {
  type: 'text' | 'math' | 'code' | 'bold' | 'italic';
  value: string;
}

function parseInlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let pos = 0;

  while (pos < text.length) {
    // Check for display-style $$...$$ written inside an inline paragraph
    if (text.startsWith('$$', pos)) {
      const endIdx = text.indexOf('$$', pos + 2);
      if (endIdx !== -1) {
        tokens.push({
          type: 'math',
          value: text.slice(pos + 2, endIdx),
        });
        pos = endIdx + 2;
        continue;
      }
    }

    // Check for LaTeX inline math: \[ ... \]
    if (text.startsWith('\\[', pos)) {
      const endIdx = text.indexOf('\\]', pos + 2);
      if (endIdx !== -1) {
        tokens.push({
          type: 'math',
          value: text.slice(pos + 2, endIdx),
        });
        pos = endIdx + 2;
        continue;
      }
    }

    // Check for LaTeX inline math: \( ... \)
    if (text.startsWith('\\(', pos)) {
      const endIdx = text.indexOf('\\)', pos + 2);
      if (endIdx !== -1) {
        tokens.push({
          type: 'math',
          value: text.slice(pos + 2, endIdx),
        });
        pos = endIdx + 2;
        continue;
      }
    }

    // Check for LaTeX inline math: $ ... $ (exclude standalone currency like $10 or $ 5)
    if (text[pos] === '$' && pos + 1 < text.length && text[pos + 1] !== ' ' && text[pos + 1] !== '$') {
      const endIdx = text.indexOf('$', pos + 1);
      if (endIdx !== -1 && text[endIdx - 1] !== ' ') {
        tokens.push({
          type: 'math',
          value: text.slice(pos + 1, endIdx),
        });
        pos = endIdx + 1;
        continue;
      }
    }

    // Check for inline code: `...`
    if (text[pos] === '`') {
      const endIdx = text.indexOf('`', pos + 1);
      if (endIdx !== -1) {
        tokens.push({
          type: 'code',
          value: text.slice(pos + 1, endIdx),
        });
        pos = endIdx + 1;
        continue;
      }
    }

    // Check for bold: **...**
    if (text.startsWith('**', pos)) {
      const endIdx = text.indexOf('**', pos + 2);
      if (endIdx !== -1) {
        tokens.push({
          type: 'bold',
          value: text.slice(pos + 2, endIdx),
        });
        pos = endIdx + 2;
        continue;
      }
    }

    // Check for italic: *...* (not **)
    if (text[pos] === '*' && (!text.startsWith('**', pos))) {
      const endIdx = text.indexOf('*', pos + 1);
      if (endIdx !== -1 && !text.startsWith('**', endIdx)) {
        tokens.push({
          type: 'italic',
          value: text.slice(pos + 1, endIdx),
        });
        pos = endIdx + 1;
        continue;
      }
    }

    // Accumulate plain text up to next special character
    let nextSpecial = pos + 1;
    while (
      nextSpecial < text.length &&
      text[nextSpecial] !== '$' &&
      text[nextSpecial] !== '`' &&
      text[nextSpecial] !== '*' &&
      !text.startsWith('\\(', nextSpecial) &&
      !text.startsWith('\\[', nextSpecial) &&
      !text.startsWith('$$', nextSpecial)
    ) {
      nextSpecial++;
    }

    tokens.push({
      type: 'text',
      value: text.slice(pos, nextSpecial),
    });
    pos = nextSpecial;
  }

  return tokens;
}
