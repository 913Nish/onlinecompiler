import React, { useState } from 'react';
import { AssemblyOutput } from '../types';
import { Cpu, Copy, Check, Download, Info } from 'lucide-react';

interface AssemblyViewerProps {
  assembly?: AssemblyOutput;
}

export const AssemblyViewer: React.FC<AssemblyViewerProps> = ({ assembly }) => {
  const [copied, setCopied] = useState(false);

  if (!assembly) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
        <Cpu className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
        <p>No target hardware assembly generated yet.</p>
      </div>
    );
  }

  const lines = assembly.code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(assembly.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext =
      assembly.architecture === 'wasm'
        ? 'wat'
        : assembly.architecture === 'bytecode'
        ? 'vm'
        : 's';
    const blob = new Blob([assembly.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compiled_target_${assembly.architecture}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const highlightAssemblyLine = (line: string) => {
    const trimmed = line.trim();

    // Directives
    if (trimmed.startsWith('.') || trimmed.startsWith('(module') || trimmed.startsWith(')')) {
      return <span className="text-purple-400 font-semibold">{line}</span>;
    }

    // Comments
    if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith(';') || trimmed.startsWith(';;')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Labels
    if (trimmed.endsWith(':')) {
      return <span className="text-amber-300 font-bold">{line}</span>;
    }

    // Instructions and operands
    const parts = line.split(/(\s+|[,#;()])/);
    return parts.map((token, tIdx) => {
      // Registers (x86 %rax, ARM x0-x30/w0, RISC-V a0-a7, sp, ra)
      if (
        token.startsWith('%') ||
        /^[xwafrs][0-9]+$/i.test(token) ||
        ['sp', 'ra', 'fp', 'lr', 'zero', 'pc', '$p0', '$l0', '$l1', '$l2', '$l3'].includes(
          token
        )
      ) {
        return (
          <span key={tIdx} className="text-cyan-400 font-semibold">
            {token}
          </span>
        );
      }

      // Opcodes
      if (
        [
          'mov', 'movq', 'movl', 'add', 'addl', 'addq', 'addi', 'sub', 'subl', 'subq',
          'mul', 'imul', 'imull', 'div', 'xor', 'xorl', 'cmp', 'cmpl', 'je', 'jne',
          'jg', 'jle', 'jge', 'jl', 'jmp', 'ret', 'call', 'pushq', 'popq', 'leave',
          'stp', 'ldp', 'bl', 'b', 'b.le', 'b.gt', 'b.eq', 'jal', 'jalr', 'sd', 'ld',
          'li', 'mv', 'jr', 'i32.const', 'i32.add', 'i32.sub', 'i32.mul', 'local.get',
          'local.set', 'drop', 'loop', 'if', 'else', 'end', 'br'
        ].includes(token.toLowerCase())
      ) {
        return (
          <span key={tIdx} className="text-indigo-400 font-bold">
            {token}
          </span>
        );
      }

      // Immediate numbers or constants
      if (/^\$?-?\d+$/.test(token) || token.startsWith('#')) {
        return (
          <span key={tIdx} className="text-emerald-400">
            {token}
          </span>
        );
      }

      return <span key={tIdx}>{token}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Hardware Target Assembly</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-semibold">
            {assembly.architecture}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs"
            title="Download target assembly file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs"
            title="Copy assembly code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Architecture Explanation Banner */}
      {assembly.explanation && (
        <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800/80 text-[11px] text-slate-400 font-sans flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-snug">{assembly.explanation}</p>
        </div>
      )}

      {/* Assembly Listing */}
      <div className="flex-1 flex overflow-hidden text-xs leading-relaxed">
        {/* Line Numbers */}
        <div className="w-12 select-none bg-[#0e111a] text-slate-600 text-right pr-3 pt-3.5 border-r border-slate-800/80 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code View */}
        <div className="flex-1 p-3.5 overflow-auto text-slate-200 whitespace-pre">
          {lines.map((line, lIdx) => (
            <div key={lIdx} className="hover:bg-slate-800/40 px-1 rounded transition-colors">
              {highlightAssemblyLine(line)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Syntax: {assembly.syntax}</span>
        <span>{lines.length} lines of assembly</span>
      </div>
    </div>
  );
};
