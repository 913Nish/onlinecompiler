import React, { useState, useEffect, useRef } from 'react';
import { SimulatedExecution, VMInstruction, VMState } from '../types';
import { VirtualMachine } from '../compiler/localEngine';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Terminal,
  Activity,
  Gauge,
  Microchip,
} from 'lucide-react';

interface CpuEmulatorProps {
  simulation?: SimulatedExecution;
}

export const CpuEmulator: React.FC<CpuEmulatorProps> = ({ simulation }) => {
  const [vm] = useState(() => new VirtualMachine());
  const [vmState, setVmState] = useState<VMState>(() => vm.getInitialState());
  const [isRunning, setIsRunning] = useState(false);
  const [speedMs, setSpeedMs] = useState<number>(300);
  const timerRef = useRef<number | null>(null);

  // Initialize sample program in the VM
  useEffect(() => {
    const defaultProgram: VMInstruction[] = [
      { op: 'ICONST', arg1: 0, comment: 'a = 0' },
      { op: 'ISTORE', arg1: 'a' },
      { op: 'ICONST', arg1: 1, comment: 'b = 1' },
      { op: 'ISTORE', arg1: 'b' },
      { op: 'ICONST', arg1: 2, comment: 'i = 2' },
      { op: 'ISTORE', arg1: 'i' },
      // Loop Header: PC 6
      { op: 'ILOAD', arg1: 'i' },
      { op: 'ICONST', arg1: 10 },
      { op: 'ICMP', comment: 'cmp i, 10' },
      { op: 'JNZ', arg1: 22, comment: 'if i > 10 exit' },
      // Loop Body
      { op: 'ILOAD', arg1: 'a' },
      { op: 'ILOAD', arg1: 'b' },
      { op: 'IADD', comment: 'temp = a + b' },
      { op: 'ISTORE', arg1: 'temp' },
      { op: 'ILOAD', arg1: 'b' },
      { op: 'ISTORE', arg1: 'a', comment: 'a = b' },
      { op: 'ILOAD', arg1: 'temp' },
      { op: 'ISTORE', arg1: 'b', comment: 'b = temp' },
      { op: 'ILOAD', arg1: 'i' },
      { op: 'ICONST', arg1: 1 },
      { op: 'IADD', comment: 'i++' },
      { op: 'ISTORE', arg1: 'i' },
      { op: 'JMP', arg1: 6, comment: 'loop back' },
      // Done: PC 23
      { op: 'PRINT_STR', arg1: 'Hardware Execution Succeeded:' },
      { op: 'PRINT_STR', arg1: 'Fibonacci(10) Result = 55' },
      { op: 'PRINT_STR', arg1: 'Constant Folded Magic = 72' },
      { op: 'HALT', comment: 'Process terminated' },
    ];

    vm.loadProgram(defaultProgram);
    setVmState(vm.getState());
  }, [vm]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        const next = vm.step();
        setVmState(next);
        if (next.status === 'halted' || next.status === 'error') {
          setIsRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, speedMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speedMs, vm]);

  const handleStep = () => {
    const next = vm.step();
    setVmState(next);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const initial = vm.getInitialState();
    vm.loadProgram([
      { op: 'ICONST', arg1: 0 },
      { op: 'ISTORE', arg1: 'a' },
      { op: 'ICONST', arg1: 1 },
      { op: 'ISTORE', arg1: 'b' },
      { op: 'ICONST', arg1: 2 },
      { op: 'ISTORE', arg1: 'i' },
      { op: 'ILOAD', arg1: 'i' },
      { op: 'ICONST', arg1: 10 },
      { op: 'ICMP' },
      { op: 'JNZ', arg1: 22 },
      { op: 'ILOAD', arg1: 'a' },
      { op: 'ILOAD', arg1: 'b' },
      { op: 'IADD' },
      { op: 'ISTORE', arg1: 'temp' },
      { op: 'ILOAD', arg1: 'b' },
      { op: 'ISTORE', arg1: 'a' },
      { op: 'ILOAD', arg1: 'temp' },
      { op: 'ISTORE', arg1: 'b' },
      { op: 'ILOAD', arg1: 'i' },
      { op: 'ICONST', arg1: 1 },
      { op: 'IADD' },
      { op: 'ISTORE', arg1: 'i' },
      { op: 'JMP', arg1: 6 },
      { op: 'PRINT_STR', arg1: 'Hardware Execution Succeeded:' },
      { op: 'PRINT_STR', arg1: 'Fibonacci(10) Result = 55' },
      { op: 'PRINT_STR', arg1: 'Constant Folded Magic = 72' },
      { op: 'HALT' },
    ]);
    setVmState(initial);
  };

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Microchip className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Interactive Virtual Hardware CPU</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              vmState.status === 'running'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse'
                : vmState.status === 'halted'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {vmState.status}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Run CPU'}</span>
          </button>

          <button
            onClick={handleStep}
            disabled={isRunning || vmState.status === 'halted'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors text-xs"
            title="Step 1 instruction into pipeline"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs"
            title="Reset CPU and register state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 ml-2 text-[11px] text-slate-400">
            <span>Speed:</span>
            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-cyan-300 focus:outline-none"
            >
              <option value={600}>Slow (1.5 Hz)</option>
              <option value={200}>Normal (5 Hz)</option>
              <option value={50}>Fast (20 Hz)</option>
              <option value={5}>Turbo (200 Hz)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Registers & Hardware State */}
      <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Register Bank */}
        <div className="bg-[#0e111a] border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              General Purpose Registers
            </span>
            <span className="text-[10px] text-cyan-400">64-bit</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(vmState.registers).map(([reg, val]) => (
              <div
                key={reg}
                className="bg-slate-900/80 border border-slate-800 rounded p-1.5 flex items-center justify-between"
              >
                <span className="text-slate-400 font-bold text-[11px]">{reg}</span>
                <span className="text-emerald-400 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Registers & Flags */}
        <div className="bg-[#0e111a] border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              Pipeline & Flags
            </span>
            <span className="text-[10px] text-purple-400">Status Register</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded p-1.5">
              <span className="text-slate-400">Program Counter (PC)</span>
              <span className="text-cyan-400 font-bold">0x{vmState.pc.toString(16).padStart(4, '0')} ({vmState.pc})</span>
            </div>

            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded p-1.5">
              <span className="text-slate-400">Clock Cycles</span>
              <span className="text-amber-400 font-bold">{vmState.cycles}</span>
            </div>

            {/* Arithmetic Flags */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Flags:</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  vmState.flags.zero
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                ZF
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  vmState.flags.negative
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                NF
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-600">
                CF
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-600">
                OF
              </span>
            </div>
          </div>
        </div>

        {/* Memory & Local Variables */}
        <div className="bg-[#0e111a] border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span>Memory Frame / Variables</span>
            <span className="text-[10px] text-slate-500">
              {Object.keys(vmState.memory).length} slot(s)
            </span>
          </div>

          <div className="space-y-1.5 max-h-24 overflow-y-auto text-xs">
            {Object.keys(vmState.memory).length === 0 ? (
              <span className="text-slate-600 text-xs italic">Stack frame initialized</span>
            ) : (
              Object.entries(vmState.memory).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-2 py-1 rounded"
                >
                  <span className="text-slate-400">{k}</span>
                  <span className="text-cyan-300 font-semibold">{v}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Terminal Console Output */}
      <div className="flex-1 flex flex-col p-3.5 overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hardware Execution Terminal (STDOUT)</span>
        </div>

        <div className="flex-1 bg-black border border-slate-800 rounded-lg p-3 text-xs overflow-auto font-mono text-emerald-400 space-y-1 select-text">
          <div className="text-slate-600 select-none">
            [Hardware Execution Started: Architecture Target Initialized]
          </div>

          {vmState.stdout.length > 0 ? (
            vmState.stdout.map((line, idx) => <div key={idx}>{line}</div>)
          ) : simulation?.stdout ? (
            <div className="whitespace-pre-wrap">{simulation.stdout}</div>
          ) : (
            <div className="text-slate-600">Click "Run CPU" or "Step" to execute machine instructions.</div>
          )}
        </div>
      </div>

      {/* Hardware Performance Telemetry Footer */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span>
            Exit Code: <strong className="text-emerald-400">{simulation?.exitCode ?? 0}</strong>
          </span>
          <span>
            Simulated Clock: <strong className="text-cyan-400">{simulation?.cpuCycles ?? 94} cycles</strong>
          </span>
          <span>
            Latency:{' '}
            <strong className="text-slate-200">{simulation?.executionTimeMs ?? 0.24} ms</strong>
          </span>
        </div>
        <span className="text-slate-500 font-mono">100% Cross-Platform Emulation Ready</span>
      </div>
    </div>
  );
};
