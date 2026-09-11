import React from 'react';
import { SuggestionItem } from '../utils/suggestions';
import { Sparkles, Code2, Layers, Cpu, Hash, Variable } from 'lucide-react';

interface SuggestionPopupProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onApply: (item: SuggestionItem) => void;
  position: { top: number; left: number };
  isDark: boolean;
  prefix: string;
}

export const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestions,
  selectedIndex,
  onSelectIndex,
  onApply,
  position,
  isDark,
  prefix,
}) => {
  if (suggestions.length === 0) return null;

  const getKindBadge = (kind: SuggestionItem['kind']) => {
    switch (kind) {
      case 'keyword':
        return {
          icon: <Code2 className="w-3 h-3 text-purple-400" />,
          label: 'kw',
          cls: isDark ? 'bg-purple-950/80 text-purple-300 border-purple-800' : 'bg-purple-100 text-purple-700 border-purple-300',
        };
      case 'function':
        return {
          icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
          label: 'fn',
          cls: isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800' : 'bg-cyan-100 text-cyan-700 border-cyan-300',
        };
      case 'snippet':
        return {
          icon: <Layers className="w-3 h-3 text-amber-400" />,
          label: 'snip',
          cls: isDark ? 'bg-amber-950/80 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'type':
        return {
          icon: <Cpu className="w-3 h-3 text-sky-400" />,
          label: 'type',
          cls: isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-700 border-sky-300',
        };
      case 'constant':
        return {
          icon: <Hash className="w-3 h-3 text-rose-400" />,
          label: 'const',
          cls: isDark ? 'bg-rose-950/80 text-rose-300 border-rose-800' : 'bg-rose-100 text-rose-700 border-rose-300',
        };
      case 'variable':
      default:
        return {
          icon: <Variable className="w-3 h-3 text-emerald-400" />,
          label: 'var',
          cls: isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-700 border-emerald-300',
        };
    }
  };

  const selectedItem = suggestions[selectedIndex] || suggestions[0];

  return (
    <div
      id="code-suggestions-popup"
      role="listbox"
      aria-label="Code suggestions"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      className={`absolute z-30 w-80 max-w-[calc(100%-2rem)] rounded-xl shadow-2xl border backdrop-blur-md overflow-hidden transition-all duration-75 select-none ${
        isDark
          ? 'bg-[#0f172a]/95 border-slate-700/80 shadow-black/80 text-slate-200'
          : 'bg-white/95 border-slate-300 shadow-slate-400/40 text-slate-800'
      }`}
    >
      {/* Header with search context & count */}
      <div
        className={`px-2.5 py-1.5 border-b text-[10px] font-mono flex items-center justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Suggestions for: <strong className="text-cyan-400">"{prefix}"</strong></span>
        </div>
        <span>{selectedIndex + 1} of {suggestions.length}</span>
      </div>

      {/* Suggestion item list */}
      <div className="max-h-52 overflow-y-auto divide-y divide-transparent p-1">
        {suggestions.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          const badge = getKindBadge(item.kind);

          return (
            <div
              key={`${item.label}-${idx}`}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => onSelectIndex(idx)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur of textarea
                onApply(item);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                isSelected
                  ? isDark
                    ? 'bg-cyan-500/20 text-white font-semibold shadow-sm'
                    : 'bg-cyan-50 text-cyan-950 font-semibold shadow-sm'
                  : isDark
                  ? 'hover:bg-slate-800/60 text-slate-300'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 truncate">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${badge.cls}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
                <span className="truncate">
                  {/* Highlight matching prefix */}
                  {item.label.toLowerCase().startsWith(prefix.toLowerCase()) ? (
                    <>
                      <span className="text-cyan-400 font-bold underline decoration-cyan-400/50">
                        {item.label.slice(0, prefix.length)}
                      </span>
                      <span>{item.label.slice(prefix.length)}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              </div>

              {item.detail && (
                <span
                  className={`text-[10px] ml-2 shrink-0 truncate max-w-[110px] ${
                    isSelected
                      ? isDark ? 'text-cyan-300' : 'text-cyan-700'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {item.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Item Detail / Code Preview */}
      {selectedItem && (selectedItem.detail || selectedItem.insertText) && (
        <div
          className={`px-2.5 py-1.5 border-t text-[11px] font-mono ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="text-[10px] text-slate-400 mb-0.5 font-sans flex items-center justify-between">
            <span>Insert Preview:</span>
            <span className="text-[9px] text-cyan-400 font-mono">
              Press <kbd className="px-1 py-0.2 rounded bg-slate-800 text-white font-mono text-[9px]">Tab</kbd> or <kbd className="px-1 py-0.2 rounded bg-slate-800 text-white font-mono text-[9px]">↵</kbd>
            </span>
          </div>
          <div className="truncate max-h-12 text-slate-100 bg-black/40 px-2 py-1 rounded text-[10px] whitespace-pre font-mono">
            {selectedItem.insertText.slice(0, 80)}
            {selectedItem.insertText.length > 80 ? '...' : ''}
          </div>
        </div>
      )}

      {/* Footer navigation keyboard hint */}
      <div
        className={`px-2.5 py-1 border-t text-[9px] font-mono flex items-center justify-between ${
          isDark ? 'bg-slate-950 border-slate-800/80 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
        }`}
      >
        <span>↑↓ Navigate</span>
        <span>Tab / Enter Accept</span>
        <span>Esc Close</span>
      </div>
    </div>
  );
};
