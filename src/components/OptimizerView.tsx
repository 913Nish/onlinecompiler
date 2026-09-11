import React from 'react';
import { OptimizationPass, OptLevel } from '../types';
import { Sparkles, ArrowRight, Gauge, CheckCircle2, Flame } from 'lucide-react';

interface OptimizerViewProps {
  optimizations: OptimizationPass[];
  optLevel: OptLevel;
}

export const OptimizerView: React.FC<OptimizerViewProps> = ({
  optimizations,
  optLevel,
}) => {
  const totalCyclesSaved = optimizations.reduce((acc, curr) => acc + curr.cyclesSaved, 0);

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">Compiler Optimization Pipeline</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
            {optLevel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            ~{totalCyclesSaved} Cycles Saved
          </span>
        </div>
      </div>

      {/* Optimizations List */}
      <div className="flex-1 p-4 overflow-auto space-y-3 font-mono">
        {optimizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs text-center p-4">
            <Flame className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
            <p>No optimization passes applied at {optLevel}.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Select -O1, -O2, or -O3 to activate constant folding, dead code elimination, and SIMD vectorization.
            </p>
          </div>
        ) : (
          optimizations.map((opt, idx) => (
            <div
              key={idx}
              className="bg-[#0e111a] border border-slate-800 rounded-lg p-3.5 hover:border-slate-700 transition-colors"
            >
              {/* Pass Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">{opt.pass}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-semibold">
                  -{opt.cyclesSaved} cpu cycles
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 font-sans mb-3 leading-relaxed">
                {opt.description}
              </p>

              {/* Before vs After Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Before */}
                <div className="bg-[#131620] border border-rose-900/30 rounded p-2.5">
                  <div className="text-[10px] uppercase font-bold text-rose-400 mb-1 flex items-center justify-between">
                    <span>Unoptimized (Before)</span>
                    <span className="text-rose-500/70">Source IR</span>
                  </div>
                  <pre className="text-rose-200 text-[11px] whitespace-pre-wrap break-all leading-snug">
                    {opt.before}
                  </pre>
                </div>

                {/* After */}
                <div className="bg-[#131620] border border-emerald-900/30 rounded p-2.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center justify-between">
                    <span>Optimized (After)</span>
                    <span className="text-emerald-500/70">Hardware Emitted</span>
                  </div>
                  <pre className="text-emerald-200 text-[11px] whitespace-pre-wrap break-all leading-snug">
                    {opt.after}
                  </pre>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="px-3.5 py-2.5 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Passes: Constant Folding • Dead Code Elimination • SSA LICM • Vectorization
        </span>
        <span className="text-slate-500">{optimizations.length} active pass(es)</span>
      </div>
    </div>
  );
};
