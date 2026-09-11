import React from 'react';

// Specific keywords
const KEYWORDS = new Set([
  // Declarations & OOP
  'class', 'interface', 'struct', 'enum', 'trait', 'impl', 'type', 'typedef', 'union',
  'public', 'private', 'protected', 'static', 'final', 'const', 'let', 'mut', 'var',
  'def', 'fn', 'func', 'function', 'package', 'namespace', 'using', 'extends', 'implements',
  'new', 'delete', 'pub', 'self', 'this', 'super',

  // Control Flow
  'return', 'if', 'else', 'elif', 'for', 'while', 'do', 'switch', 'case', 'default',
  'break', 'continue', 'goto', 'match', 'loop', 'select', 'defer', 'go', 'yield',
  'try', 'catch', 'finally', 'throw', 'throws', 'except', 'raise', 'with', 'pass',
  'import', 'from', 'as', 'export', 'async', 'await', 'in', 'of', 'is', 'not', 'and', 'or',
]);

const BUILTIN_TYPES = new Set([
  // C / C++ / Java / Rust / Go / Python types
  'int', 'float', 'double', 'char', 'void', 'bool', 'boolean', 'byte', 'short', 'long',
  'usize', 'isize', 'u8', 'u16', 'u32', 'u64', 'i8', 'i16', 'i32', 'i64', 'f32', 'f64',
  'string', 'String', 'str', 'Integer', 'Double', 'Float', 'Boolean', 'Character', 'Long',
  'vector', 'Vec', 'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'dict', 'list',
  'tuple', 'int32', 'int64', 'float32', 'float64', 'rune', 'error', 'any', 'auto', 'size_t',
  'Option', 'Result', 'Scanner', 'StringBuilder', 'Object', 'Promise'
]);

const LITERALS = new Set([
  'true', 'false', 'True', 'False', 'null', 'None', 'nil', 'undefined', 'NULL', 'nullptr',
  'Some', 'None', 'Ok', 'Err', 'NaN', 'Infinity'
]);

export function highlightCodeToElements(code: string, isDark: boolean): React.ReactNode {
  // Regex to tokenize code accurately:
  // 1. Comments: //... or #... or /*...*/
  // 2. Preprocessor / Directives: #[...] or #include... or @...
  // 3. Strings: "...", '...', `...` (handling escaped quotes)
  // 4. Numbers: hex (0x...), binary (0b...), decimal / float
  // 5. Macro calls: word followed by ! e.g. println!
  // 6. Word identifiers
  // 7. Operators: multi-char and single-char
  // 8. Brackets and Punctuation
  // 9. Newlines & Spaces
  const masterRegex = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)|(#[a-zA-Z_]\w*(?:\s*<[^>\n]+>)?|@[a-zA-Z_]\w*|#\[[^\]\n]+\])|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b0x[0-9a-fA-F]+\b|\b0b[01]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\b[a-zA-Z_]\w*!|\b[a-zA-Z_]\w*\b)|(==|!=|<=|>=|=>|->|::|\+\+|--|\+=|-=|\*=|\/=|%=|:=|&&|\|\||[+\-*/%=&|<>!^~?:])|([{}()[\];,.])|(\n)|(\s+)|([^\s\w]+)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = masterRegex.exec(code)) !== null) {
    const [full, comment, directive, str, num, word, op, punct, newline, spaces, other] = match;
    const key = `tok-${match.index}`;

    if (comment) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}
        >
          {comment}
        </span>
      );
    } else if (directive) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-amber-300 font-semibold' : 'text-amber-700 font-semibold'}
        >
          {directive}
        </span>
      );
    } else if (str) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
        >
          {str}
        </span>
      );
    } else if (num) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium'}
        >
          {num}
        </span>
      );
    } else if (word) {
      const cleanWord = word.endsWith('!') ? word.slice(0, -1) : word;

      if (LITERALS.has(word) || LITERALS.has(cleanWord)) {
        elements.push(
          <span
            key={key}
            className={isDark ? 'text-rose-400 font-medium' : 'text-rose-600 font-medium'}
          >
            {word}
          </span>
        );
      } else if (KEYWORDS.has(word) || KEYWORDS.has(cleanWord)) {
        elements.push(
          <span
            key={key}
            className={isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold'}
          >
            {word}
          </span>
        );
      } else if (BUILTIN_TYPES.has(word) || BUILTIN_TYPES.has(cleanWord)) {
        elements.push(
          <span
            key={key}
            className={isDark ? 'text-sky-400 font-semibold' : 'text-sky-700 font-semibold'}
          >
            {word}
          </span>
        );
      } else {
        // Lookahead to see if followed by '(' to color function names
        const nextChars = code.slice(masterRegex.lastIndex, masterRegex.lastIndex + 10);
        const isFunc = word.endsWith('!') || /^\s*\(/.test(nextChars);

        if (isFunc) {
          elements.push(
            <span
              key={key}
              className={isDark ? 'text-cyan-400 font-medium' : 'text-cyan-600 font-medium'}
            >
              {word}
            </span>
          );
        } else {
          // Regular identifier / variable
          elements.push(
            <span
              key={key}
              className={isDark ? 'text-slate-100' : 'text-slate-900'}
            >
              {word}
            </span>
          );
        }
      }
    } else if (op) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-pink-400 font-medium' : 'text-pink-600 font-medium'}
        >
          {op}
        </span>
      );
    } else if (punct) {
      elements.push(
        <span
          key={key}
          className={isDark ? 'text-slate-400' : 'text-slate-500'}
        >
          {punct}
        </span>
      );
    } else if (newline) {
      elements.push('\n');
    } else if (spaces) {
      elements.push(spaces);
    } else {
      elements.push(full);
    }

    lastIndex = masterRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    elements.push(code.slice(lastIndex));
  }

  return elements;
}
