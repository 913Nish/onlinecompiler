import React from 'react';
import { Challenge, TestCase } from '../types';
import { CODING_CHALLENGES } from '../data/challenges';
import { Trophy, ChevronRight, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';

interface ChallengeViewProps {
  activeChallenge: Challenge;
  onSelectChallenge: (challenge: Challenge) => void;
  testCases: TestCase[];
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  activeChallenge,
  onSelectChallenge,
  testCases,
}) => {
  const passedCount = testCases.filter((t) => t.passed).length;

  return (
    <div className="flex flex-col h-full bg-[#0d121f] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
      {/* Header */}
      <div className="p-3 bg-[#0f1527] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            NextLeap DSA Problem Set
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          {CODING_CHALLENGES.length} Curated Questions
        </span>
      </div>

      {/* Challenge Selector List */}
      <div className="p-2 border-b border-slate-800/80 bg-[#090d16] flex gap-1.5 overflow-x-auto scrollbar-none">
        {CODING_CHALLENGES.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelectChallenge(ch)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeChallenge.id === ch.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{ch.title}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                ch.difficulty === 'Easy'
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-amber-950 text-amber-300'
              }`}
            >
              {ch.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Problem Description & Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {/* Title & tags */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">{activeChallenge.title}</h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                activeChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : activeChallenge.difficulty === 'Medium'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/60'
              }`}
            >
              {activeChallenge.difficulty}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {activeChallenge.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-slate-300 leading-relaxed whitespace-pre-line bg-[#070a12] p-3 rounded-lg border border-slate-800/80">
          {activeChallenge.description}
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Examples
          </h4>
          {activeChallenge.examples.map((ex, i) => (
            <div
              key={i}
              className="p-2.5 bg-[#090d16] border border-slate-800/80 rounded-lg space-y-1 text-xs font-mono"
            >
              <div className="text-slate-400">
                <strong className="text-slate-200 font-sans">Example {i + 1}:</strong>
              </div>
              <div className="text-slate-300">
                <span className="text-cyan-400">Input: </span>
                {ex.input}
              </div>
              <div className="text-slate-300">
                <span className="text-emerald-400">Output: </span>
                {ex.output}
              </div>
              {ex.explanation && (
                <div className="text-slate-500 text-[11px] font-sans italic">
                  Explanation: {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Constraints:</h4>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-xs font-mono">
            {activeChallenge.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
