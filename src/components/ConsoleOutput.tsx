import React, { useState } from 'react';
import { ExecutionResult, AIAssistResponse, LanguagePreset } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AiTutorPanel } from './AiTutorPanel';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Bug,
  Activity,
  Zap,
  FlaskConical,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

interface ConsoleOutputProps {
  code?: string;
  selectedLanguage?: LanguagePreset;
  executionResult: ExecutionResult | null;
  isExecuting: boolean;
  onExecute: () => void;
  stdin: string;
  setStdin: (stdin: string) => void;
  onAIAssist: (
    action: 'explain' | 'debug' | 'complexity' | 'optimize' | 'testcases' | 'chat' | 'socratic' | 'linebyline' | 'diagnose_runtime',
    question?: string,
    runtimeContext?: { stdout?: string; stderr?: string; exitCode?: number }
  ) => Promise<void> | void;
  aiAssistData: AIAssistResponse | null;
  isAILoading: boolean;
  onApplyCodeSnippet?: (code: string) => void;
  activeSubTab?: 'output' | 'stdin' | 'ai';
  setActiveSubTab?: (tab: 'output' | 'stdin' | 'ai') => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  code = '',
  selectedLanguage,
  executionResult,
  isExecuting,
  onExecute,
  stdin,
  setStdin,
  onAIAssist,
  aiAssistData,
  isAILoading,
  onApplyCodeSnippet,
  activeSubTab = 'output',
  setActiveSubTab,
}) => {
  const { isDark } = useTheme();
  const [internalTab, setInternalTab] = useState<'output' | 'stdin' | 'ai'>(activeSubTab);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const currentTab = setActiveSubTab ? activeSubTab : internalTab;
  const setTab = (t: 'output' | 'stdin' | 'ai') => {
    if (setActiveSubTab) {
      setActiveSubTab(t);
    }
    setInternalTab(t);
  };

  const handleCopyOutput = () => {
    if (!executionResult) return;
    const text = (executionResult.stdout || '') + (executionResult.stderr ? '\n' + executionResult.stderr : '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div
      id="console-output-panel"
      className={`flex flex-col h-full rounded-xl overflow-hidden shadow-xl transition-colors border ${
        isDark ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Top Console Navigation Bar */}
      <div
        className={`flex items-center justify-between border-b px-3 py-2 select-none transition-colors ${
          isDark ? 'border-slate-800/80 bg-[#0f1422]' : 'border-slate-200 bg-slate-50'
        }`}
      >
        {/* Sub tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            id="tab-output-btn"
            onClick={() => setTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'output'
                ? isDark
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'bg-white text-cyan-700 shadow-2xs border border-slate-300 font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Output &amp; Terminal</span>
            {executionResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  executionResult.exitCode === 0 && !executionResult.stderr ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            )}
          </button>

          <button
            id="tab-stdin-btn"
            onClick={() => setTab('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'stdin'
                ? isDark
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'bg-white text-indigo-700 shadow-2xs border border-slate-300 font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>Custom Input</span>
            {stdin.trim().length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {stdin.trim().split('\n').length} line{stdin.trim().split('\n').length > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            id="tab-ai-btn"
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'ai'
                ? isDark
                  ? 'bg-indigo-950/60 text-indigo-300 shadow-sm border border-indigo-700/50'
                  : 'bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200 font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dark Web AI</span>
            <span
              className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold border ${
                isDark
                  ? 'bg-indigo-900/60 text-indigo-300 border-indigo-700/40'
                  : 'bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              Tutor
            </span>
          </button>
        </div>

        {/* Quick actions for Output */}
        <div className="flex items-center gap-2">
          {currentTab === 'output' && executionResult && (
            <>
              <button
                id="copy-output-btn"
                onClick={handleCopyOutput}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                }`}
                title="Copy Terminal Output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}

          <button
            id="quick-run-btn"
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RotateCcw className="w-3 h-3 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs">
        {/* 1. OUTPUT TAB */}
        {currentTab === 'output' && (
          <div className="h-full flex flex-col justify-between">
            {isExecuting ? (
              <div
                className={`flex flex-col items-center justify-center py-20 gap-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <div className="w-9 h-9 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className={`text-sm font-sans font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Executing program...
                </p>
                <span className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Running in native sandboxed environment with time &amp; memory limits
                </span>
              </div>
            ) : executionResult ? (
              <div className="space-y-4">
                {/* Meta stats bar */}
                <div
                  className={`flex flex-wrap items-center gap-2 pb-2.5 border-b text-[11px] ${
                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-sans font-semibold text-xs ${
                      executionResult.exitCode === 0 && !executionResult.stderr
                        ? isDark
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                        : isDark
                        ? 'bg-rose-950/90 text-rose-300 border border-rose-700/60 shadow-sm'
                        : 'bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs'
                    }`}
                  >
                    {executionResult.exitCode === 0 && !executionResult.stderr ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span>
                      {executionResult.exitCode === 0 && !executionResult.stderr
                        ? 'Exit Code: 0 (Success)'
                        : `Process Exited with Code: ${executionResult.exitCode}`}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-mono border ${
                      isDark
                        ? 'bg-slate-900 text-slate-300 border-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-cyan-500" />
                    <span>Time: {(executionResult.executionTimeMs / 1000).toFixed(3)}s</span>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-mono border ${
                      isDark
                        ? 'bg-slate-900 text-slate-300 border-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <HardDrive className="w-3 h-3 text-indigo-500" />
                    <span>Memory: {executionResult.memoryMb} MB</span>
                  </div>

                  {executionResult.engineUsed && (
                    <span
                      className={`text-[10px] font-sans ml-auto px-2 py-0.5 rounded border ${
                        isDark
                          ? 'text-slate-400 bg-slate-900 border-slate-800'
                          : 'text-slate-500 bg-slate-100 border-slate-200'
                      }`}
                    >
                      Engine:{' '}
                      <span className="text-cyan-500 font-medium capitalize">
                        {executionResult.engineUsed.replace('-', ' ')}
                      </span>
                    </span>
                  )}
                </div>

                {/* Standard Output stream */}
                <div className="space-y-1.5">
                  <div
                    className={`flex items-center justify-between text-[11px] font-sans font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="tracking-wide">TERMINAL OUTPUT (STDOUT)</span>
                    </div>
                    {executionResult.stdout && (
                      <button
                        onClick={handleCopyOutput}
                        className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          isDark
                            ? 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800'
                            : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy Output'}</span>
                      </button>
                    )}
                  </div>

                  {executionResult.stdout ? (
                    <div
                      className={`rounded-lg overflow-hidden border shadow-inner ${
                        isDark
                          ? 'border-slate-800/90 bg-[#060911]'
                          : 'border-slate-800 bg-[#0c1222]'
                      }`}
                    >
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#080d1a] border-b border-slate-800/80 text-[11px] text-slate-400 font-mono select-none">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span>Console stream active</span>
                        </div>
                        <span>UTF-8 text</span>
                      </div>
                      <pre
                        id="stdout-terminal"
                        className="p-4 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-cyan-900 selection:text-white"
                      >
                        {executionResult.stdout}
                      </pre>
                    </div>
                  ) : (
                    <div
                      className={`p-4 rounded-lg border text-xs font-sans space-y-2 ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-amber-500 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Program finished successfully, but produced no standard output.</span>
                      </div>
                      <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        If you expected a calculation or value to appear here, make sure you explicitly print it in your code:
                      </p>
                      <div
                        className={`p-2.5 rounded border font-mono text-[11px] space-y-1 ${
                          isDark
                            ? 'bg-[#070a12] border-slate-800 text-cyan-300'
                            : 'bg-slate-100 border-slate-200 text-cyan-700'
                        }`}
                      >
                        <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}># Python:</span> print(my_result)</div>
                        <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>// JavaScript / TS:</span> console.log(my_result);</div>
                        <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>// C / C++:</span> printf(&quot;%d\n&quot;, my_result); <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>or</span> std::cout &lt;&lt; my_result &lt;&lt; std::endl;</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Standard Error stream / Diagnostics */}
                {executionResult.stderr && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-sans font-semibold text-rose-500">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="tracking-wide">STANDARD ERROR &amp; DIAGNOSTICS (STDERR)</span>
                      </div>
                      <button
                        onClick={() => onAIAssist('debug')}
                        className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                      >
                        <Bug className="w-3 h-3" />
                        <span>Explain Error with AI</span>
                      </button>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-rose-900/50 shadow-inner bg-rose-950/20">
                      <pre
                        id="stderr-terminal"
                        className="p-3.5 text-rose-400 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-rose-900 selection:text-white"
                      >
                        {executionResult.stderr}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center py-16 text-center font-sans ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Ready to Execute
                </h3>
                <p className={`text-xs max-w-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Hit <kbd className={`px-1.5 py-0.5 rounded font-mono border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>Run</kbd> or press{' '}
                  <kbd className={`px-1.5 py-0.5 rounded font-mono border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>Ctrl + Enter</kbd> to execute your code in real-time.
                </p>
                <button
                  onClick={onExecute}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
                >
                  Run Code Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. CUSTOM INPUT (STDIN) TAB */}
        {currentTab === 'stdin' && (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Custom Standard Input (STDIN)
                </h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pass data directly into <code className="text-cyan-500 font-mono">input()</code>,{' '}
                  <code className="text-cyan-500 font-mono">scanf()</code>, <code className="text-cyan-500 font-mono">cin</code>, or{' '}
                  <code className="text-cyan-500 font-mono">readline()</code>.
                </p>
              </div>
              <button
                onClick={() => setStdin('')}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Clear STDIN
              </button>
            </div>

            {/* Quick input presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick Presets:
              </span>
              <button
                onClick={() => setStdin('10 20\n30 40')}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Pair Integers
              </button>
              <button
                onClick={() => setStdin('Hello Dark Web\n42')}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                String &amp; Number
              </button>
              <button
                onClick={() => setStdin('5\n1 2 3 4 5')}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Array of 5
              </button>
            </div>

            <textarea
              id="stdin-textarea"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter program input here (separated by spaces or line breaks)..."
              rows={8}
              className={`w-full rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y border ${
                isDark
                  ? 'bg-[#070a12] border-slate-800 text-slate-100 placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />

            <div
              className={`flex items-center justify-between text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              <span>Lines: {stdin ? stdin.split('\n').length : 0} | Characters: {stdin.length}</span>
              <button
                onClick={onExecute}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors"
              >
                Run with this STDIN
              </button>
            </div>
          </div>
        )}

        {/* 3. DARK WEB AI TUTOR TAB */}
        {currentTab === 'ai' && (
          <AiTutorPanel
            code={code}
            selectedLanguage={
              selectedLanguage || {
                id: 'python',
                name: 'Python',
                extension: 'py',
                category: 'General Purpose',
                badge: '3.11',
                description: '',
                defaultCode: '',
                samples: [],
              }
            }
            executionResult={executionResult}
            onApplyCodeSnippet={onApplyCodeSnippet}
            onAIAssist={async (action, q, ctx) => {
              await onAIAssist(action, q, ctx);
            }}
            aiAssistData={aiAssistData}
            isAILoading={isAILoading}
          />
        )}
      </div>
    </div>
  );
};
