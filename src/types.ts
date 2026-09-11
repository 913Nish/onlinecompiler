export type TargetArchitecture = 'x86_64' | 'arm64' | 'riscv' | 'wasm' | 'bytecode';

export type OptLevel = '-O0' | '-O1' | '-O2' | '-O3' | '-Os';

export interface ASTNode {
  id: string;
  type: string;
  name: string;
  detail?: string;
  value?: string | number | boolean;
  children?: ASTNode[];
  line?: number;
  column?: number;
}

export interface Diagnostic {
  severity: 'info' | 'warning' | 'error';
  message: string;
  line: number;
  column: number;
}

export interface SymbolEntry {
  name: string;
  kind: 'function' | 'variable' | 'constant' | 'type' | 'label';
  type: string;
  scope: 'global' | 'local';
  offsetOrReg: string;
}

export interface IRBlock {
  block: string;
  instructions: string[];
}

export interface OptimizationPass {
  pass: 'Constant Folding' | 'Dead Code Elimination' | 'Loop Invariant Code Motion' | 'Inlining' | 'SIMD Vectorization' | 'Register Allocation' | 'Algebraic Simplification';
  description: string;
  before: string;
  after: string;
  cyclesSaved: number;
}

export interface AssemblyOutput {
  architecture: TargetArchitecture;
  syntax: string;
  code: string;
  explanation: string;
}

export interface BinarySection {
  name: string;
  size: string;
  flags: string;
}

export interface HexDumpLine {
  address: string;
  hex: string;
  ascii: string;
}

export interface BinaryInfo {
  format: string;
  entryPoint: string;
  sections: BinarySection[];
  hexDump: HexDumpLine[];
}

export interface SimulatedExecution {
  stdout: string;
  exitCode: number;
  executionTimeMs: number;
  cpuCycles: number;
  peakMemoryBytes: number;
  registers: Record<string, string | number>;
}

export interface CrossPlatformMetrics {
  instructionCount: number;
  estimatedCycles: number;
  codeSizeBytes: number;
}

export interface CrossPlatformComparison {
  x86_64: CrossPlatformMetrics;
  arm64: CrossPlatformMetrics;
  riscv: CrossPlatformMetrics;
  wasm: CrossPlatformMetrics;
}

export interface CompileResult {
  success: boolean;
  language: string;
  targetArch: TargetArchitecture;
  optLevel: OptLevel;
  backend: 'cloud-ai' | 'local-jit';
  summary: {
    title: string;
    description: string;
    linesOfSource: number;
    linesOfAssembly: number;
    estimatedCycles: number;
    codeSizeRatio: string;
  };
  diagnostics: Diagnostic[];
  symbolTable: SymbolEntry[];
  ast: ASTNode;
  irCode: IRBlock[];
  optimizationsApplied: OptimizationPass[];
  assembly: AssemblyOutput;
  binary: BinaryInfo;
  simulatedExecution: SimulatedExecution;
  crossPlatformComparison: CrossPlatformComparison;
}

export interface LanguagePreset {
  id: string;
  name: string;
  shortName?: string;
  extension: string;
  category: 'Systems' | 'General Purpose' | 'Functional' | 'Low-Level' | 'Esoteric' | 'Web' | 'Data Science';
  badge: string;
  description: string;
  defaultCode: string;
  samples: {
    name: string;
    description: string;
    code: string;
  }[];
}

export interface VMInstruction {
  op: 'ICONST' | 'ILOAD' | 'ISTORE' | 'IADD' | 'ISUB' | 'IMUL' | 'IDIV' | 'ICMP' | 'JMP' | 'JZ' | 'JNZ' | 'PRINT' | 'PRINT_STR' | 'CALL' | 'RET' | 'HALT' | 'NOP';
  arg1?: any;
  arg2?: any;
  label?: string;
  sourceLine?: number;
  comment?: string;
}

export type EditorLayout = 'side-by-side' | 'stacked' | 'editor-only' | 'console-only';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryMb: number;
  isError?: boolean;
  compilerMessage?: string;
  engineUsed?: 'native-process' | 'gcc-native' | 'g++-native' | 'gemini-cloud' | 'deterministic-vm' | string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  status?: 'passed' | 'failed' | 'running' | 'pending';
  timeMs?: number;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  templates: Record<string, string>;
  testCases: TestCase[];
}

export interface TutorChatMessage {
  id: string;
  role: 'user' | 'tutor';
  title?: string;
  content: string;
  codeSnippet?: string;
  timestamp: string;
  metrics?: {
    timeComplexity?: string;
    spaceComplexity?: string;
  };
  action?: 'explain' | 'debug' | 'complexity' | 'optimize' | 'testcases' | 'chat' | 'socratic';
}

export interface AIAssistResponse {
  action: 'explain' | 'debug' | 'complexity' | 'optimize' | 'testcases' | 'chat' | 'socratic';
  title: string;
  content: string;
  codeSnippet?: string;
  metrics?: {
    timeComplexity?: string;
    spaceComplexity?: string;
  };
}

export interface VMState {
  pc: number;
  sp: number;
  registers: {
    R0: number;
    R1: number;
    R2: number;
    R3: number;
    R4: number;
    R5: number;
    R6: number;
    R7: number;
  };
  flags: {
    zero: boolean;
    negative: boolean;
    carry: boolean;
    overflow: boolean;
  };
  stack: number[];
  memory: Record<string, number>;
  stdout: string[];
  status: 'idle' | 'running' | 'paused' | 'halted' | 'error';
  cycles: number;
  error?: string;
}
