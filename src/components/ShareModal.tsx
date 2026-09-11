import React, { useState } from 'react';
import { X, Copy, Check, Share2, Code2, Link } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, code, language }) => {
  const { isDark } = useTheme();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;
  const markdownSnippet = `\`\`\`${language}\n${code}\n\`\`\``;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(markdownSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 transition-colors border ${
          isDark
            ? 'bg-[#0d121f] border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400'
                  : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Share Your Code
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Collaborate or share with peers and interviewers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link */}
        <div className="space-y-1.5">
          <label
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Link className="w-3.5 h-3.5 text-cyan-500" />
            Shareable URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-mono select-all border ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Markdown Snippet */}
        <div className="space-y-1.5">
          <label
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            Markdown Snippet (for Discord, Slack, GitHub)
          </label>
          <pre
            className={`p-3 rounded-lg text-[11px] font-mono max-h-32 overflow-y-auto border ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {markdownSnippet}
          </pre>
          <button
            onClick={handleCopySnippet}
            className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {copiedSnippet ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSnippet ? 'Copied to Clipboard' : 'Copy Formatted Markdown'}</span>
          </button>
        </div>

        <div className={`pt-2 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Dark Web Online Compiler • Instant execution &amp; cross-platform code generator
        </div>
      </div>
    </div>
  );
};

