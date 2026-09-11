import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bug,
  Activity,
  Zap,
  FlaskConical,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  FileCode,
  GraduationCap,
  ArrowRight,
  Code2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import { AIAssistResponse, ExecutionResult, LanguagePreset, TutorChatMessage } from '../types';

interface AiTutorPanelProps {
  code: string;
  selectedLanguage: LanguagePreset;
  executionResult: ExecutionResult | null;
  onApplyCodeSnippet?: (code: string) => void;
  onAIAssist: (
    action: 'explain' | 'debug' | 'complexity' | 'optimize' | 'testcases' | 'chat' | 'socratic' | 'linebyline' | 'diagnose_runtime',
    question?: string,
    runtimeContext?: { stdout?: string; stderr?: string; exitCode?: number }
  ) => Promise<void>;
  aiAssistData: AIAssistResponse | null;
  isAILoading: boolean;
}

const QUICK_STARTERS = [
  'Explain line-by-line with an intuitive analogy',
  'What are the edge cases where this code could fail?',
  'Can we optimize this to O(1) auxiliary space?',
  'How would you write unit tests for this?',
  'Convert this to an iterative approach',
];

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  code,
  selectedLanguage,
  executionResult,
  onApplyCodeSnippet,
  onAIAssist,
  aiAssistData,
  isAILoading,
}) => {
  const { isDark } = useTheme();
  const [userPrompt, setUserPrompt] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'tutor',
      title: 'Dark Web AI Tutor Online',
      content: `Welcome to the **Dark Web AI Tutor**! 🎓\n\nI am your intelligent computer science coach and compiler mentor. I can help you understand algorithms, diagnose bugs, analyze Big-O complexities, optimize execution bottlenecks, and teach you best practices in **${selectedLanguage.name}**.\n\n*Choose a diagnostic tool above or ask me any question about your code below!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'chat',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when messages update or loading changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAILoading]);

  // Sync incoming aiAssistData into message thread if from an action
  useEffect(() => {
    if (aiAssistData) {
      setMessages((prev) => {
        // Prevent duplicate last message
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'tutor' && lastMsg.title === aiAssistData.title && lastMsg.content === aiAssistData.content) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'tutor-' + Date.now(),
            role: 'tutor',
            title: aiAssistData.title,
            content: aiAssistData.content,
            codeSnippet: aiAssistData.codeSnippet,
            metrics: aiAssistData.metrics,
            action: aiAssistData.action,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }
  }, [aiAssistData]);

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleTriggerAction = async (
    action: 'explain' | 'debug' | 'complexity' | 'optimize' | 'testcases' | 'socratic' | 'linebyline' | 'diagnose_runtime',
    customTitle?: string
  ) => {
    if (isAILoading) return;

    // Add user note in chat
    const titles: Record<string, string> = {
      explain: 'Explain this code',
      debug: 'Find potential bugs & edge cases',
      complexity: 'Analyze Big-O Complexity',
      optimize: 'Optimize this code',
      testcases: 'Generate test cases',
      socratic: 'Guide me with Socratic questions',
      linebyline: 'Walk through line-by-line',
      diagnose_runtime: 'Diagnose runtime error',
    };

    setMessages((prev) => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        role: 'user',
        content: customTitle || titles[action] || action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    const runtimeContext = executionResult
      ? {
          stdout: executionResult.stdout,
          stderr: executionResult.stderr,
          exitCode: executionResult.exitCode,
        }
      : undefined;

    await onAIAssist(action, customTitle, runtimeContext);
  };

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = (promptToSend ?? userPrompt).trim();
    if (!text || isAILoading) return;

    setUserPrompt('');

    // Append user query to conversation
    setMessages((prev) => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    const runtimeContext = executionResult
      ? {
          stdout: executionResult.stdout,
          stderr: executionResult.stderr,
          exitCode: executionResult.exitCode,
        }
      : undefined;

    await onAIAssist('chat', text, runtimeContext);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'tutor',
        title: 'Dark Web AI Tutor',
        content: `Chat history reset. Ready for your questions in **${selectedLanguage.name}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'chat',
      },
    ]);
  };

  const hasRuntimeError = executionResult && (executionResult.exitCode !== 0 || !!executionResult.stderr);

  return (
    <div className="flex flex-col h-full space-y-3 font-sans text-xs">
      {/* Top Banner / Tutor Status */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-indigo-50/70 border-indigo-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${
              isDark
                ? 'bg-indigo-950/80 border-indigo-700/60 text-indigo-400'
                : 'bg-white border-indigo-200 text-indigo-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dark Web AI Tutor
              </h3>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                  isDark ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/40' : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {selectedLanguage.name}
              </span>
            </div>
            <div className={`text-[11px] flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Contextual CS Coach &amp; Algorithmic Mentor</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Reset Tutor Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Runtime Crash / Diagnostic Quick Banner */}
      {hasRuntimeError && (
        <div
          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
            isDark
              ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-800 shadow-2xs'
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-xs text-rose-400">
                Runtime or Compiler Error Detected (Exit Code: {executionResult.exitCode})
              </div>
              <div className="text-[11px] text-rose-300/80 line-clamp-1 font-mono">
                {executionResult.stderr || 'Abnormal termination encountered in terminal run.'}
              </div>
            </div>
          </div>
          <button
            id="tutor-diagnose-error-btn"
            onClick={() => handleTriggerAction('diagnose_runtime')}
            disabled={isAILoading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors shrink-0 disabled:opacity-50"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Diagnose with Tutor</span>
          </button>
        </div>
      )}

      {/* Action Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        <button
          id="ai-tutor-explain-btn"
          onClick={() => handleTriggerAction('explain')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs'
          }`}
          title="High-level goal and step-by-step logic walkthrough"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Explain Code</span>
        </button>

        <button
          id="ai-tutor-debug-btn"
          onClick={() => handleTriggerAction('debug')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-rose-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-rose-400 text-slate-800 shadow-2xs'
          }`}
          title="Review code for subtle traps, bounds checks, and off-by-one bugs"
        >
          <Bug className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Find Bugs</span>
        </button>

        <button
          id="ai-tutor-complexity-btn"
          onClick={() => handleTriggerAction('complexity')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-cyan-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-400 text-slate-800 shadow-2xs'
          }`}
          title="Calculate Time and Space asymptotic Big-O bounds"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Big-O Bounds</span>
        </button>

        <button
          id="ai-tutor-optimize-btn"
          onClick={() => handleTriggerAction('optimize')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-emerald-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-800 shadow-2xs'
          }`}
          title="Refactor for algorithmic speedup and clean idioms"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Optimize</span>
        </button>

        <button
          id="ai-tutor-testcases-btn"
          onClick={() => handleTriggerAction('testcases')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-800 shadow-2xs'
          }`}
          title="Generate edge cases, nominal cases, and stress test suites"
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Test Suite</span>
        </button>

        <button
          id="ai-tutor-socratic-btn"
          onClick={() => handleTriggerAction('socratic')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-purple-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-400 text-slate-800 shadow-2xs'
          }`}
          title="Guided Socratic coaching questions to master the logic"
        >
          <Lightbulb className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Socratic Guide</span>
        </button>

        <button
          id="ai-tutor-linebyline-btn"
          onClick={() => handleTriggerAction('linebyline')}
          disabled={isAILoading}
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group disabled:opacity-50 col-span-2 sm:col-span-2 lg:col-span-1 ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-sky-500/50 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-800 shadow-2xs'
          }`}
          title="Step-by-step trace of every line"
        >
          <FileCode className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[11px] font-semibold">Line-by-Line</span>
        </button>
      </div>

      {/* Message Thread Scroll Area */}
      <div
        className={`flex-1 overflow-y-auto p-3.5 rounded-xl border space-y-3.5 min-h-[260px] max-h-[460px] transition-colors ${
          isDark ? 'bg-[#070b14] border-slate-800/80' : 'bg-slate-50/60 border-slate-200'
        }`}
      >
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${isTutor ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
                {isTutor ? (
                  <>
                    <Bot className="w-3 h-3 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">Dark Web AI Tutor</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-400">You</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-xl p-3.5 shadow-sm space-y-2.5 transition-all ${
                  isTutor
                    ? isDark
                      ? 'bg-[#0f1629] border border-slate-800 text-slate-200'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                    : isDark
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {/* Title & Complexity Pills */}
                {isTutor && msg.title && (
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 pb-2 border-b ${
                      isDark ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <h4 className="font-bold text-xs uppercase tracking-wide">
                        {msg.title}
                      </h4>
                    </div>

                    {msg.metrics && (
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {msg.metrics.timeComplexity && (
                          <span
                            className={`px-2 py-0.5 rounded font-semibold border ${
                              isDark
                                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            Time: {msg.metrics.timeComplexity}
                          </span>
                        )}
                        {msg.metrics.spaceComplexity && (
                          <span
                            className={`px-2 py-0.5 rounded font-semibold border ${
                              isDark
                                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            }`}
                          >
                            Space: {msg.metrics.spaceComplexity}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Markdown body */}
                <div
                  className={`leading-relaxed text-xs prose prose-invert max-w-none break-words ${
                    isTutor
                      ? isDark
                        ? 'text-slate-300 prose-headings:text-white prose-strong:text-indigo-300 prose-code:text-cyan-300'
                        : 'text-slate-700 prose-headings:text-slate-900 prose-strong:text-indigo-700 prose-code:text-indigo-600'
                      : 'text-white'
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Code Snippet Box */}
                {isTutor && msg.codeSnippet && (
                  <div
                    className={`mt-2 pt-2 border-t rounded-lg p-2.5 ${
                      isDark ? 'border-slate-800/80 bg-[#070a12]' : 'border-slate-200 bg-slate-900 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px]">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5" />
                        Suggested Code Implementation
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedSnippetId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedSnippetId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        {onApplyCodeSnippet && (
                          <button
                            onClick={() => onApplyCodeSnippet(msg.codeSnippet!)}
                            className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Insert into active source editor"
                          >
                            <span>Apply to Editor</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <pre className="font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed">
                      <code>{msg.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking / Loading Animation */}
        {isAILoading && (
          <div className="flex items-start gap-2">
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 shadow-sm ${
                isDark ? 'bg-[#0f1629] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-400">Dark Web AI Tutor</span> is analyzing code &amp; formulating advice...
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Question Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <span className={`shrink-0 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Quick Ask:
        </span>
        {QUICK_STARTERS.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(starter)}
            disabled={isAILoading}
            className={`shrink-0 px-2.5 py-1 rounded-full border transition-all text-left truncate max-w-[200px] sm:max-w-none disabled:opacity-50 ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-indigo-500/50 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 hover:border-indigo-300 text-slate-700 shadow-2xs'
            }`}
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div
        className={`flex items-end gap-2 p-2 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#0d1322] border-slate-800 focus-within:border-indigo-500/80'
            : 'bg-white border-slate-300 focus-within:border-indigo-500 shadow-2xs'
        }`}
      >
        <textarea
          ref={textareaRef}
          rows={2}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask Dark Web AI Tutor anything about your ${selectedLanguage.name} code... (Press Enter to send, Shift+Enter for newline)`}
          className={`flex-1 bg-transparent border-0 resize-none p-1 text-xs focus:outline-none focus:ring-0 ${
            isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
          }`}
          disabled={isAILoading}
        />

        <button
          id="tutor-send-btn"
          onClick={() => handleSendPrompt()}
          disabled={!userPrompt.trim() || isAILoading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-all shadow-md shadow-indigo-600/20 shrink-0"
          title="Send question to AI Tutor"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
