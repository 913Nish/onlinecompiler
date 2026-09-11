import { LanguagePreset } from '../types';

export const LANGUAGE_PRESETS: LanguagePreset[] = [
  {
    id: 'c',
    name: 'C (C99 / C11)',
    shortName: 'C',
    extension: 'c',
    category: 'Systems',
    badge: 'Hardware Native',
    description: 'Direct memory addressing, low-level control, pointers, zero-cost runtime',
    defaultCode: `// Multi-Language Compiler: Fast Fibonacci & Optimization Benchmark
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0;
    int b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

int main() {
    int count = 10;
    int result = fibonacci(count);
    
    // Constant folding test: (16 * 4) + 12 - 4
    int magic = 16 * 4 + 12 - 4;
    
    printf("Fibonacci(%d) = %d\\n", count, result);
    printf("Folded Constant Magic: %d\\n", magic);
    return 0;
}`,
    samples: [
      {
        name: 'Fibonacci Iterative',
        description: 'Iterative Fibonacci calculation with loop variable reuse',
        code: `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return a;
}

int main() {
    int res = fib(12);
    return res;
}`
      }
    ]
  },
  {
    id: 'csharp',
    name: 'C# (.NET Core)',
    shortName: 'C#',
    extension: 'cs',
    category: 'General Purpose',
    badge: 'C# .NET',
    description: 'Modern object-oriented language with high-performance CLR and async task scheduling',
    defaultCode: `using System;

class Program {
    static int Factorial(int n) {
        if (n <= 1) return 1;
        return n * Factorial(n - 1);
    }

    static void Main() {
        int count = 8;
        int result = Factorial(count);
        Console.WriteLine($"Factorial of {count} = {result}");
        
        // Loop accumulation test
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i * i;
        }
        Console.WriteLine($"Sum of squares (1..10) = {sum}");
    }
}`,
    samples: []
  },
  {
    id: 'cpp',
    name: 'C++ (C++20)',
    shortName: 'C++',
    extension: 'cpp',
    category: 'Systems',
    badge: 'High Performance',
    description: 'Template metaprogramming, RAII, low-latency game engines & financial systems',
    defaultCode: `#include <iostream>
#include <vector>

template <typename T>
T inline_multiply_add(T a, T b, T c) {
    return (a * b) + c;
}

int main() {
    int a = 14;
    int b = 3;
    int c = 10;
    
    // Inlined call + Constant folding
    int output = inline_multiply_add(a, b, c);
    
    std::cout << "Hardware output: " << output << std::endl;
    return 0;
}`,
    samples: []
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    shortName: 'Go',
    extension: 'go',
    category: 'Systems',
    badge: 'Concurrent',
    description: 'Statically typed, fast compilation, built-in concurrency primitives',
    defaultCode: `package main

import "fmt"

func ProcessBatch(size int) int {
	accumulator := 0
	stride := 4 * 2 // Folded to 8
	
	for i := 0; i < size; i++ {
		accumulator += i * stride
	}
	return accumulator
}

func main() {
	count := 16
	res := ProcessBatch(count)
	fmt.Printf("Processed %d items -> %d\\n", count, res)
}`,
    samples: []
  },
  {
    id: 'html',
    name: 'HTML / CSS / Web',
    shortName: 'HTML',
    extension: 'html',
    category: 'Web',
    badge: 'Web Standard',
    description: 'HyperText Markup Language with structured DOM, modern CSS, and script hooks',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniCompile Web Canvas</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; }
    h1 { color: #38bdf8; margin-bottom: 8px; }
    .card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }
    .btn { background: #0ea5e9; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: #0284c7; }
  </style>
</head>
<body>
  <div class="card">
    <h1>HTML5 Interactive Runtime</h1>
    <p>Declarative DOM tree structure rendered with full standard CSS3 styling.</p>
    <button class="btn" onclick="console.log('Web engine event triggered')">Run Engine Hook</button>
  </div>
</body>
</html>`,
    samples: []
  },
  {
    id: 'java',
    name: 'Java (OpenJDK 21)',
    shortName: 'Java',
    extension: 'java',
    category: 'General Purpose',
    badge: 'JVM Native',
    description: 'Object-oriented industrial programming compiling to bytecode and AOT machine binary',
    defaultCode: `public class Main {
    public static int sumArray(int[] numbers) {
        int sum = 0;
        for (int n : numbers) {
            sum += n;
        }
        return sum;
    }

    public static void main(String[] args) {
        int[] data = {10, 20, 30, 40, 50};
        int total = sumArray(data);
        System.out.println("Sum of array elements: " + total);
    }
}`,
    samples: []
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node / ES6)',
    shortName: 'JS',
    extension: 'js',
    category: 'Web',
    badge: 'V8 Engine',
    description: 'Dynamic scripting language powering the modern web and server-side runtimes',
    defaultCode: `// JavaScript ES6+ High-Performance Algorithms
function calculatePrimes(max) {
  const primes = [];
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

const primes = calculatePrimes(30);
console.log("Calculated primes up to 30:", primes);
console.log("Sum of primes:", primes.reduce((acc, curr) => acc + curr, 0));`,
    samples: []
  },
  {
    id: 'jupyter',
    name: 'Jupyter Notebook (Python)',
    shortName: 'Jupyter',
    extension: 'ipynb',
    category: 'Data Science',
    badge: 'Data Science',
    description: 'Interactive computational notebook combining live code, math, and data analysis',
    defaultCode: `# %% [markdown]
# # Jupyter Computational Exploration
# Statistical variance and numerical computation cell.

# %% [code]
import math

data = [12, 18, 24, 30, 36, 42, 48, 54, 60]
mean = sum(data) / len(data)
variance = sum((x - mean) ** 2 for x in data) / len(data)
std_dev = math.sqrt(variance)

print(f"[Cell 1] Dataset Size: {len(data)}")
print(f"[Cell 1] Mean: {mean:.2f}, Std Dev: {std_dev:.2f}")

# %% [code]
# Centered vector output
centered = [(x - mean) for x in data]
print(f"[Cell 2] Centered Deltas: {centered}")`,
    samples: []
  },
  {
    id: 'kotlin',
    name: 'Kotlin (JVM / Multiplatform)',
    shortName: 'Kotlin',
    extension: 'kt',
    category: 'General Purpose',
    badge: 'Modern JVM',
    description: 'Modern, concise, safe programming language with seamless Java interoperability',
    defaultCode: `fun main() {
    val technologies = listOf("Kotlin", "Coroutines", "JVM", "Multiplatform", "Native")
    val filtered = technologies.filter { it.length > 3 }.map { it.uppercase() }
    
    println("Filtered & Transformed Pipelines:")
    filtered.forEachIndexed { index, name ->
        println("  [$index] -> $name")
    }
}`,
    samples: []
  },
  {
    id: 'python',
    name: 'Python (3.11+)',
    shortName: 'Python',
    extension: 'py',
    category: 'General Purpose',
    badge: 'Dynamic / Scientific',
    description: 'High-level, readable syntax compiled to bytecode and optimized SSA intermediate representation',
    defaultCode: `# Multi-Language Compiler: Matrix Vector Math & Optimization
def vector_dot_product(vec_a, vec_b):
    """Calculates dot product between two numerical vectors"""
    total = 0
    # Constant expression test: 4 * 16
    stride = 4 * 16
    for a, b in zip(vec_a, vec_b):
        total += (a * b)
    return total + (stride - 64)

def main():
    vec_1 = [1, 2, 3, 4, 5]
    vec_2 = [10, 20, 30, 40, 50]
    
    result = vector_dot_product(vec_1, vec_2)
    print(f"Dot Product: {result}")
    
    # Range sum
    squares = [x**2 for x in range(6)]
    print(f"Squares list: {squares}")

if __name__ == "__main__":
    main()`,
    samples: []
  },
  {
    id: 'rust',
    name: 'Rust (Edition 2021)',
    shortName: 'Rust',
    extension: 'rs',
    category: 'Systems',
    badge: 'Memory Safe',
    description: 'Zero-cost abstractions, move semantics, guaranteed thread safety without a garbage collector',
    defaultCode: `// Rust High-Performance Memory-Safe Math Kernel
pub fn compute_sum_of_squares(limit: u64) -> u64 {
    let mut sum: u64 = 0;
    let factor: u64 = 8 * 4; // Constant folded to 32
    
    for i in 1..=limit {
        sum += i * i;
    }
    sum + (factor - 32)
}

fn main() {
    let limit = 10;
    let total = compute_sum_of_squares(limit);
    println!("Sum of squares (1..{}): {}", limit, total);
}`,
    samples: []
  },
  {
    id: 'typescript',
    name: 'TypeScript (TS 5.4)',
    shortName: 'TS',
    extension: 'ts',
    category: 'General Purpose',
    badge: 'Typed Web/Node',
    description: 'Strongly-typed ECMAScript compiling directly to machine assembly and WASM',
    defaultCode: `// TypeScript to Native Assembly & WebAssembly
interface MathKernel {
  dimension: number;
  compute(): number;
}

class FastKernel implements MathKernel {
  constructor(public dimension: number) {}

  compute(): number {
    let acc = 0;
    const factor = 12 * 8; // Constant folding: 96
    
    for (let i = 0; i < this.dimension; i++) {
      acc += (i & 7) * factor;
    }
    return acc;
  }
}

const kernel = new FastKernel(64);
const output = kernel.compute();
console.log("Execution Kernel Result:", output);`,
    samples: []
  },
  {
    id: 'php',
    name: 'PHP (8.3)',
    shortName: 'PHP',
    extension: 'php',
    category: 'Web',
    badge: 'Server Scripting',
    description: 'Popular general-purpose scripting language suited for web development and CLI jobs',
    defaultCode: `<?php
function fibonacciSequence(int $n): array {
    $seq = [0, 1];
    for ($i = 2; $i < $n; $i++) {
        $seq[] = $seq[$i - 1] + $seq[$i - 2];
    }
    return $seq;
}

$result = fibonacciSequence(10);
echo "PHP 8.3 CLI Execution:\\n";
echo "Sequence: " . implode(", ", $result) . "\\n";
echo "Sum: " . array_sum($result) . "\\n";
?>`,
    samples: []
  },
  {
    id: 'ruby',
    name: 'Ruby (3.3)',
    shortName: 'Ruby',
    extension: 'rb',
    category: 'General Purpose',
    badge: 'Dynamic OOP',
    description: 'Dynamic, open-source programming language with a focus on simplicity and productivity',
    defaultCode: `# Ruby Modern Script
def quick_sort(arr)
  return arr if arr.length <= 1
  pivot = arr[arr.length / 2]
  left  = arr.select { |x| x < pivot }
  mid   = arr.select { |x| x == pivot }
  right = arr.select { |x| x > pivot }
  quick_sort(left) + mid + quick_sort(right)
end

numbers = [42, 12, 88, 3, 27, 64, 1, 99]
puts "Sorted array: #{quick_sort(numbers).inspect}"
puts "Max value: #{numbers.max}"`,
    samples: []
  },
  {
    id: 'swift',
    name: 'Swift (5.9)',
    shortName: 'Swift',
    extension: 'swift',
    category: 'Systems',
    badge: 'LLVM Native',
    description: 'Fast, modern, type-safe compiled systems language developed by Apple',
    defaultCode: `func calculateFactorial(_ n: Int) -> Int {
    guard n > 1 else { return 1 }
    var result = 1
    for i in 2...n {
        result *= i
    }
    return result
}

let value = 7
let output = calculateFactorial(value)
print("Swift LLVM Output for factorial(\\(value)): \\(output)")`,
    samples: []
  },
  {
    id: 'lua',
    name: 'Lua (5.4 / JIT)',
    shortName: 'Lua',
    extension: 'lua',
    category: 'General Purpose',
    badge: 'Lightweight JIT',
    description: 'Lightweight, high-level, multi-paradigm programming language designed for embedded use',
    defaultCode: `-- Lua 5.4 Algorithm Execution
local function binarySearch(arr, target)
    local low = 1
    local high = #arr
    while low <= high do
        local mid = math.floor((low + high) / 2)
        if arr[mid] == target then
            return mid
        elseif arr[mid] < target then
            low = mid + 1
        else
            high = mid - 1
        end
    end
    return -1
end

local tbl = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
print("Lua Search Result for 23: Index " .. binarySearch(tbl, 23))`,
    samples: []
  },
  {
    id: 'sql',
    name: 'SQL (PostgreSQL / SQLite)',
    shortName: 'SQL',
    extension: 'sql',
    category: 'General Purpose',
    badge: 'Relational DB',
    description: 'Structured Query Language for managing data held in relational database management systems',
    defaultCode: `-- SQL Relational Query Execution
CREATE TABLE developers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    language TEXT NOT NULL,
    years_xp INTEGER
);

INSERT INTO developers (name, language, years_xp) VALUES
('Ada Lovelace', 'Assembly', 10),
('Dennis Ritchie', 'C', 15),
('Bjarne Stroustrup', 'C++', 20),
('Guido van Rossum', 'Python', 18);

SELECT language, COUNT(*) as dev_count, AVG(years_xp) as avg_experience
FROM developers
GROUP BY language
ORDER BY avg_experience DESC;`,
    samples: []
  },
  {
    id: 'r',
    name: 'R (Statistics & Math)',
    shortName: 'R',
    extension: 'r',
    category: 'Data Science',
    badge: 'Statistical',
    description: 'Programming language and free software environment for statistical computing and graphics',
    defaultCode: `# R Statistical Script
numbers <- c(2.4, 3.8, 5.1, 7.3, 8.9, 11.2, 14.5)
m <- mean(numbers)
s <- sd(numbers)

cat(sprintf("R Vector Analysis:\\nMean: %.3f\\nStdDev: %.3f\\nMedian: %.3f\\n", m, s, median(numbers)))`,
    samples: []
  },
  {
    id: 'zig',
    name: 'Zig (0.12)',
    shortName: 'Zig',
    extension: 'zig',
    category: 'Systems',
    badge: 'Comptime Safe',
    description: 'Modern replacement for C with compile-time code execution and no hidden control flow',
    defaultCode: `const std = @import("std");

pub fn fast_power(base: u32, exp: u32) u32 {
    var result: u32 = 1;
    var b = base;
    var e = exp;
    while (e > 0) {
        if (e % 2 == 1) {
            result *= b;
        }
        b *= b;
        e /= 2;
    }
    return result;
}

pub fn main() void {
    const res = fast_power(2, 10);
    std.debug.print("2^10 = {d}\\n", .{res});
}`,
    samples: []
  },
  {
    id: 'dart',
    name: 'Dart (Flutter / 3.3)',
    shortName: 'Dart',
    extension: 'dart',
    category: 'General Purpose',
    badge: 'Client Optimized',
    description: 'Client-optimized language for fast apps on any platform with AOT machine compilation',
    defaultCode: `void main() {
  final scores = [88, 92, 79, 95, 100, 67, 85];
  final passing = scores.where((s) => s >= 80).toList();
  
  print('Total tests: \${scores.length}');
  print('Passing scores (>=80): \$passing');
  print('Pass rate: \${(passing.length / scores.length * 100).toStringAsFixed(1)}%');
}`,
    samples: []
  },
  {
    id: 'assembly',
    name: 'Assembly (x86-64 / NASM)',
    shortName: 'ASM',
    extension: 's',
    category: 'Low-Level',
    badge: 'Bare Metal',
    description: 'Direct ISA machine instructions, register manipulation, and raw hardware interrupts',
    defaultCode: `.globl _start
.section .text
_start:
    # Set up hardware registers
    movq $60, %rax       # sys_exit syscall
    movq $42, %rdi       # return code 42
    syscall              # invoke kernel`,
    samples: []
  },
  {
    id: 'haskell',
    name: 'Haskell (GHC 9.6)',
    shortName: 'Haskell',
    extension: 'hs',
    category: 'Functional',
    badge: 'Pure Functional',
    description: 'Purely functional, statically typed, with type inference and lazy evaluation',
    defaultCode: `fib :: Int -> Integer
fib 0 = 0
fib 1 = 1
fib n = fib (n - 1) + fib (n - 2)

main :: IO ()
main = do
    let result = fib 10
    putStrLn ("Fibonacci 10 is: " ++ show result)`,
    samples: []
  },
  {
    id: 'brainfuck',
    name: 'Brainfuck (Esoteric)',
    shortName: 'BF',
    extension: 'bf',
    category: 'Esoteric',
    badge: 'Turing Minimal',
    description: '8-symbol esoteric Turing-complete programming language compiling to optimized jump loops',
    defaultCode: `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`,
    samples: []
  }
];
