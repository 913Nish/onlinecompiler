import React, { useState } from 'react';
import { IRBlock } from '../types';
import { GitCommit, Copy, Check, Terminal } from 'lucide-react';

interface IrViewerProps {
  irCode?: IRBlock[];
}

export const IrViewer: React.FC<IrViewerProps> = ({ irCode }) => {
  const [copied, setCopied] = useState(false);

  if (!irCode || irCode.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
        <GitCommit className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
        <p>No Intermediate Representation generated yet.</p>
      </div>
    );
  }

  const fullIrText = irCode
    .map((b) => `${b.block}\n${b.instructions.map((i) => `  ${i}`).join('\n')}`)
    .join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullIrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightInstruction = (line: string) => {
    // Basic syntax highlighting for SSA IR
    if (line.startsWith(';')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    const parts = line.split(/(\s+|[,=])/);
    return parts.map((part, pIdx) => {
      if (part.startsWith('%')) {
        return (
          <span key={pIdx} className="text-cyan-400 font-semibold">
            {part}
          </span>
        );
      }
      if (part.startsWith('@') || part.startsWith('.L')) {
        return (
          <span key={pIdx} className="text-amber-400 font-semibold">
            {part}
          </span>
        );
      }
      if (
        ['alloca', 'load', 'store', 'add', 'sub', 'mul', 'icmp', 'br', 'ret', 'phi', 'call'].includes(
          part
        )
      ) {
        return (
          <span key={pIdx} className="text-indigo-400 font-bold">
            {part}
          </span>
        );
      }
      if (['i32', 'i64', 'i1', 'ptr', 'void', 'label'].includes(part)) {
        return (
          <span key={pIdx} className="text-emerald-400">
            {part}
          </span>
        );
      }
      if (/^\d+$/.test(part)) {
        return (
          <span key={pIdx} className="text-purple-300">
            {part}
          </span>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">SSA Intermediate Representation</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            3-Address Code
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy IR'}</span>
        </button>
      </div>

      {/* Basic Blocks Display */}
      <div className="flex-1 p-4 overflow-auto space-y-4">
        {irCode.map((block, idx) => (
          <div
            key={idx}
            className="bg-[#0e111a] border border-slate-800 rounded-lg p-3 shadow-inner hover:border-slate-700 transition-colors"
          >
            {/* Block Label Header */}
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs font-bold text-cyan-300">{block.block}</span>
              <span className="text-[10px] text-slate-500 ml-auto">
                {block.instructions.length} instruction(s)
              </span>
            </div>

            {/* Block Instructions */}
            <div className="space-y-1 text-xs">
              {block.instructions.map((instr, iIdx) => (
                <div key={iIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-[10px] text-slate-600 select-none w-5 text-right">
                    {iIdx + 1}
                  </span>
                  <div className="flex-1 text-slate-300 leading-relaxed break-all">
                    {highlightInstruction(instr)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-500" />
          SSA Form: Static Single Assignment (Explicit Register Flow)
        </span>
        <span>{irCode.length} Basic Block(s)</span>
      </div>
    </div>
  );
};
