import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LanguagePreset, ExecutionResult } from '../types';
import { LANGUAGE_PRESETS } from '../data/languages';
import { useTheme } from '../context/ThemeContext';
import { highlightCodeToElements } from '../utils/highlighter';
import { getCompletions, SuggestionItem } from '../utils/suggestions';
import { SuggestionPopup } from './SuggestionPopup';
import { LanguageIcon } from './LanguageIcons';
import {
  Code,
  Upload,
  Download,
  Copy,
  Check,
  FileCode,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
  Wand2,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  Lightbulb,
  ArrowRight,
  CornerDownLeft,
  Braces,
  Quote,
} from 'lucide-react';

interface SourceEditorProps {
  code: string;
  setCode: (code: string) => void;
  selectedLanguage: LanguagePreset;
  setSelectedLanguage: (lang: LanguagePreset) => void;
  onRun: () => void;
  fontSize?: number;
  tabSize?: number;
  executionResult?: ExecutionResult | null;
  isExecuting?: boolean;
  onViewOutput?: () => void;
  syntaxHighlighting?: boolean;
  onToggleSyntaxHighlighting?: () => void;
  autocompleteEnabled?: boolean;
  onToggleAutocomplete?: () => void;
  autoClosePairs?: boolean;
  onToggleAutoClosePairs?: () => void;
  pointerPositionMode?: 'end-of-line' | 'inside';
  onTogglePointerPositionMode?: () => void;
}

export const SourceEditor: React.FC<SourceEditorProps> = ({
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
  onRun,
  fontSize = 14,
  tabSize = 4,
  executionResult,
  isExecuting = false,
  onViewOutput,
  syntaxHighlighting = true,
  onToggleSyntaxHighlighting,
  autocompleteEnabled = true,
  onToggleAutocomplete,
  autoClosePairs: propAutoClosePairs,
  onToggleAutoClosePairs,
  pointerPositionMode: propPointerPositionMode,
  onTogglePointerPositionMode,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Auto-close pairs & pointer position settings
  const [localAutoClose, setLocalAutoClose] = useState<boolean>(true);
  const autoClose = propAutoClosePairs !== undefined ? propAutoClosePairs : localAutoClose;
  const toggleAutoClose = onToggleAutoClosePairs || (() => setLocalAutoClose((prev) => !prev));

  const [localPointerMode, setLocalPointerMode] = useState<'end-of-line' | 'inside'>('end-of-line');
  const pointerMode = propPointerPositionMode !== undefined ? propPointerPositionMode : localPointerMode;
  const togglePointerMode = onTogglePointerPositionMode || (() => setLocalPointerMode((prev) => (prev === 'end-of-line' ? 'inside' : 'end-of-line')));

  // Real-time cursor position tracking
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Autocomplete / Suggestions State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [prefixStart, setPrefixStart] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ top: 40, left: 60 });

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solution.${selectedLanguage.extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        const ext = file.name.split('.').pop()?.toLowerCase();
        const matched = LANGUAGE_PRESETS.find((p) => p.extension === ext);
        if (matched) {
          setSelectedLanguage(matched);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        const ext = file.name.split('.').pop()?.toLowerCase();
        const matched = LANGUAGE_PRESETS.find((p) => p.extension === ext);
        if (matched) {
          setSelectedLanguage(matched);
        }
      }
    };
    reader.readAsText(file);
  };

  // Autocomplete Suggestions triggers and actions
  const triggerSuggestions = useCallback(
    (text: string, cursorPos: number) => {
      if (!autocompleteEnabled) {
        setShowSuggestions(false);
        return;
      }

      const textBefore = text.slice(0, cursorPos);
      // Match current word token being typed before cursor
      const match = textBefore.match(/([a-zA-Z_#@][a-zA-Z0-9_!.]*)$/);

      if (match && match[1].length >= 1) {
        const word = match[1];
        const results = getCompletions(word, selectedLanguage.id, text);
        if (results.length > 0) {
          setSuggestions(results);
          setSelectedSuggestionIndex(0);
          setCurrentPrefix(word);
          setPrefixStart(cursorPos - word.length);

          // Estimate cursor position relative to editor container
          const linesBefore = textBefore.split('\n');
          const lineIndex = linesBefore.length - 1;
          const colIndex = linesBefore[lineIndex].length;

          const lineHeightPx = 26;
          const charWidthPx = 8.4;
          const paddingY = 14;
          const paddingX = 14;

          const scrollY = textareaRef.current?.scrollTop || 0;
          const scrollX = textareaRef.current?.scrollLeft || 0;
          const containerH = textareaRef.current?.clientHeight || 400;
          const containerW = textareaRef.current?.clientWidth || 600;

          let top = paddingY + (lineIndex + 1) * lineHeightPx - scrollY;
          let left = paddingX + colIndex * charWidthPx - scrollX;

          if (top + 240 > containerH) {
            top = Math.max(10, paddingY + lineIndex * lineHeightPx - 240 - scrollY);
          }
          left = Math.max(10, Math.min(left, containerW - 330));

          setPopupPosition({ top, left });
          setShowSuggestions(true);
          return;
        }
      }

      setShowSuggestions(false);
    },
    [autocompleteEnabled, selectedLanguage.id]
  );

  const applySuggestion = useCallback(
    (item: SuggestionItem) => {
      if (!textareaRef.current) return;
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const start = prefixStart;

      const before = code.substring(0, start);
      const after = code.substring(cursorPos);
      const newCode = before + item.insertText + after;

      setCode(newCode);
      setShowSuggestions(false);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const offset = item.cursorOffset || 0;
          const newCursor = before.length + item.insertText.length + offset;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      });
    },
    [code, prefixStart, setCode]
  );

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    triggerSuggestions(newCode, e.target.selectionStart);
    updateCursorInfo();
  };

  // Helper to update line & col tracking from textarea
  const updateCursorInfo = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.slice(0, pos);
    const linesBefore = textBefore.split('\n');
    const line = linesBefore.length;
    const col = linesBefore[linesBefore.length - 1].length + 1;
    setCursorPos({ line, col });
  }, [code]);

  // Jump pointer to the end of a specific line (0-indexed) or current line
  const jumpPointerToEndOfLine = useCallback(
    (lineIndex?: number) => {
      if (!textareaRef.current) return;
      const linesArr = code.split('\n');
      const targetIdx = lineIndex !== undefined ? lineIndex : cursorPos.line - 1;
      if (targetIdx < 0 || targetIdx >= linesArr.length) return;

      let charPos = 0;
      for (let i = 0; i < targetIdx; i++) {
        charPos += linesArr[i].length + 1;
      }
      charPos += linesArr[targetIdx].length;

      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(charPos, charPos);
      setCursorPos({ line: targetIdx + 1, col: linesArr[targetIdx].length + 1 });
    },
    [code, cursorPos.line]
  );

  // Auto-close brackets & quotes definitions
  const PAIRS: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
    '`': '`',
  };
  const CLOSING_CHARS = new Set([')', ']', '}', '"', "'", '`']);

  // Smart Indent, Auto-close, and Tab Key Support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // Execution shortcut (Ctrl/Cmd + Enter)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Shift + Enter: Jump pointer straight to end of current line
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      const lineEnd = code.indexOf('\n', start);
      const effectiveLineEnd = lineEnd === -1 ? code.length : lineEnd;
      target.setSelectionRange(effectiveLineEnd, effectiveLineEnd);
      updateCursorInfo();
      return;
    }

    // Ctrl+Space manual suggestion trigger
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
      e.preventDefault();
      triggerSuggestions(code, e.currentTarget.selectionStart);
      return;
    }

    // Keyboard navigation when suggestions are open
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    // Auto-closing brackets and quotes
    if (autoClose && PAIRS[e.key]) {
      const opening = e.key;
      const closing = PAIRS[opening];

      // If user has selected text: wrap selection in brackets/quotes
      if (start !== end) {
        e.preventDefault();
        const selected = code.substring(start, end);
        const wrapped = opening + selected + closing;
        const newCode = code.substring(0, start) + wrapped + code.substring(end);
        setCode(newCode);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            if (pointerMode === 'end-of-line') {
              const lineEnd = newCode.indexOf('\n', start + wrapped.length);
              const effectiveLineEnd = lineEnd === -1 ? newCode.length : lineEnd;
              textareaRef.current.setSelectionRange(effectiveLineEnd, effectiveLineEnd);
            } else {
              textareaRef.current.setSelectionRange(start + 1, start + 1 + selected.length);
            }
            updateCursorInfo();
          }
        });
        return;
      }

      // If typing quote and current char is already that quote: skip over it
      if ((opening === '"' || opening === "'" || opening === '`') && code[start] === opening) {
        e.preventDefault();
        let nextPos = start + 1;
        if (pointerMode === 'end-of-line') {
          const lineEnd = code.indexOf('\n', start + 1);
          nextPos = lineEnd === -1 ? code.length : lineEnd;
        }
        target.setSelectionRange(nextPos, nextPos);
        updateCursorInfo();
        return;
      }

      // Insert matching pair
      e.preventDefault();
      const newCode = code.substring(0, start) + opening + closing + code.substring(end);
      setCode(newCode);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          if (pointerMode === 'end-of-line') {
            // Place pointer at the end of the line
            const lineEnd = newCode.indexOf('\n', start + 2);
            const effectiveLineEnd = lineEnd === -1 ? newCode.length : lineEnd;
            textareaRef.current.setSelectionRange(effectiveLineEnd, effectiveLineEnd);
          } else {
            // Place pointer inside the pair
            textareaRef.current.setSelectionRange(start + 1, start + 1);
          }
          updateCursorInfo();
        }
      });
      return;
    }

    // Overtype / Skip-over closing characters if already present
    if (autoClose && CLOSING_CHARS.has(e.key) && start === end && code[start] === e.key) {
      e.preventDefault();
      let nextPos = start + 1;
      if (pointerMode === 'end-of-line') {
        const lineEnd = code.indexOf('\n', start + 1);
        nextPos = lineEnd === -1 ? code.length : lineEnd;
      }
      target.setSelectionRange(nextPos, nextPos);
      updateCursorInfo();
      return;
    }

    // Backspace: delete both opening and closing character when adjacent
    if (autoClose && e.key === 'Backspace' && start === end && start > 0) {
      const prev = code[start - 1];
      const next = code[start];
      if (
        (prev === '(' && next === ')') ||
        (prev === '[' && next === ']') ||
        (prev === '{' && next === '}') ||
        (prev === '"' && next === '"') ||
        (prev === "'" && next === "'") ||
        (prev === '`' && next === '`')
      ) {
        e.preventDefault();
        const newCode = code.substring(0, start - 1) + code.substring(start + 1);
        setCode(newCode);
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(start - 1, start - 1);
            updateCursorInfo();
          }
        });
        return;
      }
    }

    // Enter between { and }: auto-expand with indented block
    if (autoClose && e.key === 'Enter' && start === end && start > 0) {
      const prev = code[start - 1];
      const next = code[start];
      if (prev === '{' && next === '}') {
        e.preventDefault();
        const lineStart = code.lastIndexOf('\n', start - 2) + 1;
        const currentLine = code.substring(lineStart, start - 1);
        const indentMatch = currentLine.match(/^\s*/);
        const baseIndent = indentMatch ? indentMatch[0] : '';
        const spaces = ' '.repeat(tabSize);
        const innerIndent = baseIndent + spaces;

        const insertion = `\n${innerIndent}\n${baseIndent}`;
        const newCode = code.substring(0, start) + insertion + code.substring(start);
        setCode(newCode);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            const newPos = start + 1 + innerIndent.length;
            textareaRef.current.setSelectionRange(newPos, newPos);
            updateCursorInfo();
          }
        });
        return;
      }
    }

    // Tab key: TabOut to end of line if closing punctuation exists ahead, or standard indentation
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const lineEnd = code.indexOf('\n', start);
      const effectiveLineEnd = lineEnd === -1 ? code.length : lineEnd;
      const textAhead = code.substring(start, effectiveLineEnd);

      // If inside brackets/quotes with closing punctuation ahead on line, Tab jumps to end of line
      if (autoClose && textAhead.trim().length > 0 && textAhead.match(/[)\]}"';]/)) {
        target.setSelectionRange(effectiveLineEnd, effectiveLineEnd);
        updateCursorInfo();
        return;
      }

      // Standard tab indent
      const spaces = ' '.repeat(tabSize);
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSize;
          updateCursorInfo();
        }
      });
      return;
    }
  };

  // Basic code beautify/formatter
  const handleFormatCode = () => {
    const formattedLines: string[] = [];
    let indentLevel = 0;
    const rawLines = code.split('\n');

    for (let rawLine of rawLines) {
      let line = rawLine.trim();
      if (!line) {
        formattedLines.push('');
        continue;
      }

      // Check for closing braces decreasing indent before line
      if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      formattedLines.push(' '.repeat(indentLevel * tabSize) + line);

      // Check for opening braces increasing indent for subsequent lines
      const openCount = (line.match(/{/g) || []).length;
      const closeCount = (line.match(/}/g) || []).length;
      indentLevel += openCount - closeCount;
      if (indentLevel < 0) indentLevel = 0;
    }

    setCode(formattedLines.join('\n'));
  };

  const filteredLanguages = LANGUAGE_PRESETS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.extension.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden shadow-xl transition-all border ${
        isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full'}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Editor Header Toolbar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b text-xs transition-colors ${
          isDark ? 'bg-[#0d121f] border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-picker-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <LanguageIcon id={selectedLanguage.id} className="w-4 h-4 text-cyan-400" />
              <span>{selectedLanguage.name}</span>
              <span
                className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                .{selectedLanguage.extension}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              />
            </button>

            {isLangMenuOpen && (
              <div
                className={`absolute left-0 mt-1 w-72 rounded-xl shadow-2xl p-2 z-50 border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xl'
                }`}
              >
                <input
                  type="text"
                  placeholder="Search languages (C, C++, Python, Java...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 mb-2 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                  autoFocus
                />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setCode(lang.defaultCode);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                        selectedLanguage.id === lang.id
                          ? isDark
                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded bg-slate-800/80 flex items-center justify-center shrink-0">
                          <LanguageIcon id={lang.id} className="w-4 h-4 text-slate-200" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`font-medium truncate ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {lang.name}
                          </div>
                          <div
                            className={`text-[10px] ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {lang.category}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        .{lang.extension}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sample Snippets */}
          {selectedLanguage.samples && selectedLanguage.samples.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              <span
                className={`text-[11px] ml-1 mr-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Presets:
              </span>
              {selectedLanguage.samples.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setCode(sample.code)}
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
                  }`}
                  title={sample.description}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Run, Format, Upload, Download, Copy, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            id="editor-run-btn"
            onClick={onRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs transition-all disabled:opacity-50 shadow-sm shadow-emerald-600/30"
            title="Execute Code (Ctrl + Enter)"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-white" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white text-white" />
                <span>Run</span>
              </>
            )}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".c,.cpp,.h,.rs,.py,.go,.ts,.js,.zig,.java,.swift,.kt,.hs,.s,.asm,.bf,.txt"
          />

          <button
            onClick={handleFormatCode}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title="Format Code (Auto-Indent)"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-500" />
          </button>

          <button
            id="editor-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title="Upload source file"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            id="editor-download-btn"
            onClick={handleDownload}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title="Save code to file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            id="editor-copy-btn"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-md border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          style={{ fontSize: `${fontSize}px` }}
          className={`w-12 select-none text-right pr-2.5 pt-3.5 border-r font-mono overflow-hidden transition-colors shrink-0 cursor-pointer ${
            isDark
              ? 'bg-[#090d16] text-slate-600 border-slate-800/80'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => {
            const isActive = i + 1 === cursorPos.line;
            return (
              <div
                key={i}
                onClick={() => jumpPointerToEndOfLine(i)}
                title={`Line ${i + 1} (Click to move pointer to end of line)`}
                className={`h-[1.625rem] leading-[1.625rem] transition-colors rounded-xs px-1 ${
                  isActive
                    ? isDark
                      ? 'text-cyan-400 font-bold bg-cyan-950/50'
                      : 'text-cyan-700 font-bold bg-cyan-100/70'
                    : 'hover:text-cyan-400'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Text Input Area & Syntax Highlighting Layer */}
        <div className="relative flex-1 h-full overflow-hidden">
          {syntaxHighlighting && (
            <pre
              aria-hidden="true"
              ref={highlightRef}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.625rem',
                tabSize,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
              className={`pointer-events-none absolute inset-0 p-3.5 overflow-hidden font-mono leading-[1.625rem] select-none whitespace-pre m-0 transition-colors ${
                isDark ? 'bg-[#0b0f1a]' : 'bg-white'
              }`}
            >
              {highlightCodeToElements(code, isDark)}
            </pre>
          )}

          <textarea
            ref={textareaRef}
            id="source-code-input"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onSelect={updateCursorInfo}
            onKeyUp={updateCursorInfo}
            onClick={() => {
              if (showSuggestions) setShowSuggestions(false);
              updateCursorInfo();
            }}
            onScroll={(e) => {
              if (highlightRef.current) {
                highlightRef.current.scrollTop = e.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
              if (gutterRef.current) {
                gutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.625rem',
              tabSize,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
            className={`relative z-10 w-full h-full p-3.5 resize-none focus:outline-none leading-[1.625rem] overflow-auto font-mono whitespace-pre ${
              syntaxHighlighting
                ? 'bg-transparent text-transparent caret-cyan-400 selection:bg-cyan-500/30 selection:text-transparent'
                : isDark
                ? 'bg-[#0b0f1a] text-slate-100 placeholder-slate-600 selection:bg-indigo-600/50 selection:text-white'
                : 'bg-white text-slate-900 placeholder-slate-400 selection:bg-indigo-500/20 selection:text-indigo-950'
            }`}
            placeholder="Write or paste your code here... (Type for smart autocomplete)"
          />

          {/* Autocomplete / IntelliSense Suggestion Popup */}
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionPopup
              suggestions={suggestions}
              selectedIndex={selectedSuggestionIndex}
              onSelectIndex={setSelectedSuggestionIndex}
              onApply={applySuggestion}
              position={popupPosition}
              isDark={isDark}
              prefix={currentPrefix}
            />
          )}
        </div>
      </div>

      {/* Editor Status Bar with Instant Execution Output Badge */}
      <div
        className={`px-3 py-2 border-t text-[11px] flex flex-wrap items-center justify-between gap-2 transition-colors ${
          isDark
            ? 'bg-[#090d16] border-slate-800/80 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1 text-cyan-500 font-mono font-medium">
            <Code className="w-3.5 h-3.5" />
            {selectedLanguage.badge}
          </span>
          <span>{lineCount} lines</span>
          <span>{code.length} chars</span>

          {/* Real-time Cursor Position */}
          <span
            className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            title="Current pointer line and column"
          >
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>

          {/* Quick Jump to End of Line button */}
          <button
            id="jump-line-end-btn"
            onClick={() => jumpPointerToEndOfLine()}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-cyan-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Move pointer to end of current line (Shift+Enter)"
          >
            <CornerDownLeft className="w-3 h-3 text-cyan-400" />
            <span>End of Line</span>
          </button>

          {/* Auto-Close Brackets & Quotes Toggle */}
          <button
            id="toggle-autoclose-btn"
            onClick={toggleAutoClose}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] border transition-colors ${
              autoClose
                ? isDark
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
            }`}
            title="Auto-close brackets () [] {} and quotes '' &quot;&quot; ``"
          >
            <Braces className="w-3 h-3 text-emerald-400" />
            <span>Auto-Close: {autoClose ? 'ON' : 'OFF'}</span>
          </button>

          {/* Pointer Placement Mode Toggle */}
          <button
            id="toggle-pointer-mode-btn"
            onClick={togglePointerMode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] border transition-colors ${
              pointerMode === 'end-of-line'
                ? isDark
                  ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/60'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-slate-100'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Where pointer is placed after inserting brackets/quotes: End of Line vs Inside Pair"
          >
            <ArrowRight className="w-3 h-3 text-indigo-400" />
            <span>Pointer: {pointerMode === 'end-of-line' ? 'End of Line' : 'Inside Pair'}</span>
          </button>

          {onToggleSyntaxHighlighting && (
            <button
              id="syntax-highlighting-badge-btn"
              onClick={onToggleSyntaxHighlighting}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                syntaxHighlighting
                  ? isDark
                    ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/60'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
              title="Toggle semantic syntax highlighting"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Syntax: {syntaxHighlighting ? 'ON' : 'OFF'}</span>
            </button>
          )}
          {onToggleAutocomplete && (
            <button
              id="autocomplete-toggle-btn"
              onClick={onToggleAutocomplete}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                autocompleteEnabled
                  ? isDark
                    ? 'bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/60'
                    : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
              title="Toggle code suggestions popup while typing (Ctrl+Space to trigger manually)"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>Suggestions: {autocompleteEnabled ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        {/* Interactive Output Quick Bar */}
        {isExecuting ? (
          <div className="flex items-center gap-2 text-cyan-500 font-medium animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling &amp; executing...</span>
          </div>
        ) : executionResult ? (
          <button
            id="editor-output-peek-btn"
            onClick={onViewOutput}
            className={`flex items-center gap-2 px-2.5 py-1 rounded text-left transition-all border ${
              executionResult.exitCode === 0 && !executionResult.stderr
                ? isDark
                  ? 'bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border-emerald-800/50 shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                : isDark
                ? 'bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border-rose-800/50 shadow-sm'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 shadow-2xs'
            }`}
            title="Click to view full terminal output"
          >
            {executionResult.exitCode === 0 && !executionResult.stderr ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="font-semibold">
              {executionResult.exitCode === 0 && !executionResult.stderr ? 'Output:' : 'Error:'}
            </span>
            <span
              className={`truncate max-w-[120px] sm:max-w-[200px] font-mono text-[10px] ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {executionResult.stdout?.trim()
                ? executionResult.stdout.trim().replace(/\n/g, ' ')
                : executionResult.stderr
                ? executionResult.stderr.trim().replace(/\n/g, ' ')
                : 'Code executed (No stdout)'}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-cyan-500 font-medium underline ml-1">
              <span>View Console</span>
              <ArrowDown className="w-3 h-3" />
            </span>
          </button>
        ) : (
          <div
            className={`flex items-center gap-2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <span className="hidden sm:inline">Press</span>
            <kbd
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              Ctrl + Enter
            </kbd>
            <span className="hidden sm:inline">to Run</span>
          </div>
        )}
      </div>
    </div>
  );
};
