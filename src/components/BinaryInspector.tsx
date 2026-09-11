import React, { useState } from 'react';
import { BinaryInfo } from '../types';
import { Binary, Search, ShieldCheck } from 'lucide-react';

interface BinaryInspectorProps {
  binary?: BinaryInfo;
}

export const BinaryInspector: React.FC<BinaryInspectorProps> = ({ binary }) => {
  const [searchAddr, setSearchAddr] = useState('');

  if (!binary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
        <Binary className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
        <p>No binary machine code layout generated yet.</p>
      </div>
    );
  }

  const filteredHex = binary.hexDump.filter(
    (line) =>
      !searchAddr ||
      line.address.toLowerCase().includes(searchAddr.toLowerCase()) ||
      line.hex.toLowerCase().includes(searchAddr.toLowerCase()) ||
      line.ascii.toLowerCase().includes(searchAddr.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-pink-400" />
          <span className="font-semibold text-slate-200">Executable Binary & Hex Layout</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 font-semibold">
            {binary.format}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search address/hex..."
              value={searchAddr}
              onChange={(e) => setSearchAddr(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Binary Metadata Header */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Format</div>
          <div className="text-slate-200 truncate">{binary.format}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Entry Point</div>
          <div className="text-cyan-400 font-mono font-bold">{binary.entryPoint}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Endianness</div>
          <div className="text-slate-200">Little Endian (x86/ARM/RISC-V)</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Security / PIE</div>
          <div className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NX / DEP Enabled</span>
          </div>
        </div>
      </div>

      {/* Section Headers Table */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-b border-slate-800/80">
        <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Section Headers (.text / .rodata / .data)</span>
          <span className="text-[10px] text-slate-500">{binary.sections.length} sections</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {binary.sections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1.5 flex items-center justify-between"
            >
              <span className="text-cyan-300 font-bold">{sec.name}</span>
              <span className="text-slate-400 text-[11px]">{sec.size}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                {sec.flags}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hex Dump Table */}
      <div className="flex-1 p-3.5 overflow-auto text-xs leading-relaxed">
        <div className="min-w-[600px] border border-slate-800/80 rounded-lg overflow-hidden">
          {/* Hex Table Header */}
          <div className="grid grid-cols-12 bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-800">
            <div className="col-span-2">Offset (Hex)</div>
            <div className="col-span-7">Byte Sequence (Hex Values 00-FF)</div>
            <div className="col-span-3">ASCII Dump</div>
          </div>

          {/* Hex Lines */}
          <div className="divide-y divide-slate-800/40 bg-[#0c0e14]">
            {filteredHex.map((row, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-12 px-3 py-1 hover:bg-slate-800/50 transition-colors font-mono"
              >
                <div className="col-span-2 text-pink-400/90 font-bold select-none">
                  {row.address}
                </div>
                <div className="col-span-7 text-slate-300 tracking-wider">
                  {row.hex.split(' ').map((byte, bIdx) => (
                    <span
                      key={bIdx}
                      className={`inline-block mr-1.5 ${
                        byte === '00'
                          ? 'text-slate-600'
                          : byte === '7f' || byte === '45' || byte === '4c' || byte === '46'
                          ? 'text-pink-400 font-bold'
                          : 'text-slate-200'
                      }`}
                    >
                      {byte}
                    </span>
                  ))}
                </div>
                <div className="col-span-3 text-cyan-300 font-mono tracking-widest border-l border-slate-800/60 pl-2 select-none">
                  {row.ascii}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Raw Machine Opcode Inspection</span>
        <span>{binary.hexDump.length * 16} bytes visualized</span>
      </div>
    </div>
  );
};
