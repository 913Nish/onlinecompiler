import React from 'react';
import { CrossPlatformComparison } from '../types';
import { Layers, HardDrive, Cpu, Zap, Box } from 'lucide-react';

interface ArchitectureMatrixProps {
  comparison?: CrossPlatformComparison;
}

export const ArchitectureMatrix: React.FC<ArchitectureMatrixProps> = ({ comparison }) => {
  if (!comparison) return null;

  const archs = [
    {
      id: 'x86_64',
      name: 'x86-64 (AMD64 / Intel 64)',
      tag: 'CISC / Pipelined',
      registers: '16 GPRs (RAX-R15) + 32 ZMM',
      abi: 'System V AMD64 ABI',
      vectorIsa: 'AVX-512 / AVX2 (256/512-bit)',
      data: comparison.x86_64,
      accentColor: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    },
    {
      id: 'arm64',
      name: 'ARM64 (Apple Silicon / Graviton)',
      tag: 'RISC / Load-Store',
      registers: '31 GPRs (X0-X30) + 32 V-Regs',
      abi: 'AAPCS64 Standard ABI',
      vectorIsa: 'ARM NEON / SVE2 (128-bit)',
      data: comparison.arm64,
      accentColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
    {
      id: 'riscv',
      name: 'RISC-V (RV64GC Standard)',
      tag: 'Open Modular RISC',
      registers: '32 GPRs (x0-x31, a0-a7)',
      abi: 'Standard RISC-V Calling Conv',
      vectorIsa: 'RVV Vector Extension (VLEN)',
      data: comparison.riscv,
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      id: 'wasm',
      name: 'WebAssembly (WASM Edge / Web)',
      tag: 'Stack Machine Bytecode',
      registers: 'Virtual Stack + Local Indices',
      abi: 'W3C WebAssembly Specification',
      vectorIsa: 'WASM SIMD128 (v128)',
      data: comparison.wasm,
      accentColor: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Cross-Platform Hardware Comparison Matrix</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          Target ISAs
        </span>
      </div>

      {/* Grid of Architectures */}
      <div className="p-4 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        {archs.map((arch) => (
          <div
            key={arch.id}
            className={`border rounded-xl p-3.5 flex flex-col justify-between ${arch.accentColor} transition-all hover:scale-[1.01]`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                <span className="font-bold text-slate-100 text-xs">{arch.name}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                  {arch.tag}
                </span>
              </div>

              {/* Hardware Specifications */}
              <div className="space-y-1.5 text-[11px] text-slate-400 mb-3">
                <div>
                  <span className="text-slate-500">Registers:</span> {arch.registers}
                </div>
                <div>
                  <span className="text-slate-500">ABI:</span> {arch.abi}
                </div>
                <div>
                  <span className="text-slate-500">SIMD:</span> {arch.vectorIsa}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-[#0c0e14]/90 border border-slate-800/80 rounded-lg p-2.5 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Instruction Count
                </span>
                <span className="font-bold text-slate-200">{arch.data.instructionCount} insns</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Estimated Latency
                </span>
                <span className="font-bold text-amber-300">~{arch.data.estimatedCycles} cycles</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> Code Footprint
                </span>
                <span className="font-bold text-emerald-400">{arch.data.codeSizeBytes} bytes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          Hardware Target Emitting: Zero-cost abstractions across RISC and CISC pipelines
        </span>
        <span>Cross-Compiled Successfully</span>
      </div>
    </div>
  );
};
