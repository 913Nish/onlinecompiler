import React from 'react';
import { ExecutionResult } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Code2,
  Play,
  RotateCcw,
  Share2,
  Settings,
  RefreshCw,
  Terminal,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onExecute: () => void;
  isExecuting: boolean;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onResetCode: () => void;
  executionResult?: ExecutionResult | null;
  onViewOutput?: () => void;
  onOpenAiTutor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExecute,
  isExecuting,
  onOpenShare,
  onOpenSettings,
  onResetCode,
  executionResult,
  onViewOutput,
  onOpenAiTutor,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`border-b px-3 sm:px-6 py-2.5 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 ${
        isDark ? 'border-slate-800/90 bg-[#0d121f]' : 'border-slate-200/90 bg-white/95 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/25 flex items-center justify-center">
              <div
                className={`w-full h-full rounded-[6px] flex items-center justify-center transition-colors ${
                  isDark ? 'bg-[#0d121f]' : 'bg-white'
                }`}
              >
                <Code2 className="w-4 h-4 text-cyan-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-base font-extrabold tracking-tight font-sans transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Dark Web
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider transition-colors ${
                    isDark
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold'
                  }`}
                >
                  Compiler
                </span>
              </div>
              <p
                className={`text-[11px] hidden sm:block transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Online Multi-Language Code Execution IDE
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls: Theme Toggle, Reset, Share, Settings, Output Status, Run Button */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800 hover:border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-indigo-700 border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
                <span className="hidden sm:inline text-slate-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 animate-in fade-in zoom-in-75 duration-200" />
                <span className="hidden sm:inline text-slate-700">Dark</span>
              </>
            )}
          </button>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Reset code to default template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* AI Tutor Button */}
          {onOpenAiTutor && (
            <button
              id="header-ai-tutor-btn"
              onClick={onOpenAiTutor}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isDark
                  ? 'text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-700/60'
                  : 'text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 shadow-2xs'
              }`}
              title="Open Dark Web AI Tutor"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>
          )}

          {/* Share Modal Trigger */}
          <button
            onClick={onOpenShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDark
                ? 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200 shadow-2xs'
            }`}
            title="Share Code"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Output status badge & Run Button */}
          <div className="flex items-center gap-2">
            {executionResult && (
              <button
                id="header-output-badge-btn"
                onClick={onViewOutput}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  executionResult.exitCode === 0 && !executionResult.stderr
                    ? isDark
                      ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800/50'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                    : isDark
                    ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-800/50'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 shadow-2xs'
                }`}
                title="Click to view output in terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    executionResult.exitCode === 0 && !executionResult.stderr
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span>
                  {executionResult.exitCode === 0 && !executionResult.stderr
                    ? 'Exit 0'
                    : `Code ${executionResult.exitCode}`}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({(executionResult.executionTimeMs / 1000).toFixed(2)}s)
                </span>
              </button>
            )}

            <button
              id="main-run-btn"
              onClick={onExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs md:text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Run</span>
                  <kbd className="hidden sm:inline text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded font-mono font-normal">
                    Ctrl+↵
                  </kbd>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

