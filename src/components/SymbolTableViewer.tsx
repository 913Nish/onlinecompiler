import React from 'react';
import { SymbolEntry } from '../types';
import { Database, Tag } from 'lucide-react';

interface SymbolTableViewerProps {
  symbols: SymbolEntry[];
}

export const SymbolTableViewer: React.FC<SymbolTableViewerProps> = ({ symbols }) => {
  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Compiler Symbol Table & Scopes</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          {symbols.length} symbol(s)
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 p-3.5 overflow-auto text-xs">
        <table className="w-full border border-slate-800 rounded-lg overflow-hidden text-left">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
            <tr>
              <th className="p-2.5">Identifier</th>
              <th className="p-2.5">Kind</th>
              <th className="p-2.5">Data Type</th>
              <th className="p-2.5">Scope</th>
              <th className="p-2.5">Hardware Memory Offset / Register</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-[#0c0e14]">
            {symbols.map((sym, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-2.5 font-bold text-cyan-300">{sym.name}</td>
                <td className="p-2.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      sym.kind === 'function'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {sym.kind}
                  </span>
                </td>
                <td className="p-2.5 text-slate-300">{sym.type}</td>
                <td className="p-2.5 text-slate-400">{sym.scope}</td>
                <td className="p-2.5 text-amber-300 font-mono text-[11px]">{sym.offsetOrReg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3 text-cyan-400" />
          Lexical scope resolution & stack frame offset tracking
        </span>
        <span>Symbols resolved</span>
      </div>
    </div>
  );
};
