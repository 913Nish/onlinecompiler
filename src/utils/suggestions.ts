export interface SuggestionItem {
  label: string;
  insertText: string;
  kind: 'keyword' | 'function' | 'snippet' | 'type' | 'variable' | 'constant';
  detail?: string;
  documentation?: string;
  cursorOffset?: number; // Cursor offset from end of insertText (negative number to move cursor back)
}

// Common snippets and keywords per language
const LANGUAGE_SUGGESTIONS: Record<string, SuggestionItem[]> = {
  python: [
    { label: 'print', insertText: 'print()', kind: 'function', detail: 'print(*values)', cursorOffset: -1 },
    { label: 'def', insertText: 'def function_name():\n    pass', kind: 'snippet', detail: 'Function definition', cursorOffset: -17 },
    { label: 'if', insertText: 'if condition:\n    ', kind: 'snippet', detail: 'if statement', cursorOffset: -6 },
    { label: 'elif', insertText: 'elif condition:\n    ', kind: 'snippet', detail: 'elif clause', cursorOffset: -6 },
    { label: 'else', insertText: 'else:\n    ', kind: 'snippet', detail: 'else clause' },
    { label: 'for in range', insertText: 'for i in range(10):\n    ', kind: 'snippet', detail: 'Loop 10 times' },
    { label: 'for in', insertText: 'for item in collection:\n    ', kind: 'snippet', detail: 'Iterate collection' },
    { label: 'while', insertText: 'while condition:\n    ', kind: 'snippet', detail: 'while loop', cursorOffset: -6 },
    { label: 'class', insertText: 'class MyClass:\n    def __init__(self):\n        pass', kind: 'snippet', detail: 'Class declaration' },
    { label: 'try except', insertText: 'try:\n    pass\nexcept Exception as e:\n    print(e)', kind: 'snippet', detail: 'try/except block' },
    { label: 'if __name__', insertText: 'if __name__ == "__main__":\n    main()', kind: 'snippet', detail: 'Main entrypoint' },
    { label: 'import', insertText: 'import ', kind: 'keyword', detail: 'import module' },
    { label: 'from import', insertText: 'from module import name', kind: 'snippet', detail: 'from ... import ...' },
    { label: 'return', insertText: 'return ', kind: 'keyword', detail: 'return value' },
    { label: 'lambda', insertText: 'lambda x: x', kind: 'snippet', detail: 'Anonymous function' },
    { label: 'len', insertText: 'len()', kind: 'function', detail: 'Return length of object', cursorOffset: -1 },
    { label: 'range', insertText: 'range(start, stop)', kind: 'function', detail: 'range generator' },
    { label: 'enumerate', insertText: 'enumerate(iterable)', kind: 'function', detail: 'Return index and item' },
    { label: 'zip', insertText: 'zip(a, b)', kind: 'function', detail: 'Combine iterables' },
    { label: 'input', insertText: 'input("Enter: ")', kind: 'function', detail: 'Read standard input' },
    { label: 'append', insertText: 'append(item)', kind: 'function', detail: 'Add element to list' },
    { label: 'extend', insertText: 'extend(items)', kind: 'function', detail: 'Extend list' },
    { label: 'True', insertText: 'True', kind: 'constant', detail: 'Boolean True' },
    { label: 'False', insertText: 'False', kind: 'constant', detail: 'Boolean False' },
    { label: 'None', insertText: 'None', kind: 'constant', detail: 'None object' },
  ],

  java: [
    { label: 'System.out.println', insertText: 'System.out.println();', kind: 'snippet', detail: 'Print line to stdout', cursorOffset: -2 },
    { label: 'sout', insertText: 'System.out.println();', kind: 'snippet', detail: 'System.out.println shortcut', cursorOffset: -2 },
    { label: 'System.out.print', insertText: 'System.out.print();', kind: 'snippet', detail: 'Print to stdout', cursorOffset: -2 },
    { label: 'main (psvm)', insertText: 'public static void main(String[] args) {\n    \n}', kind: 'snippet', detail: 'Main method', cursorOffset: -3 },
    { label: 'public', insertText: 'public ', kind: 'keyword', detail: 'Public access modifier' },
    { label: 'private', insertText: 'private ', kind: 'keyword', detail: 'Private access modifier' },
    { label: 'protected', insertText: 'protected ', kind: 'keyword', detail: 'Protected modifier' },
    { label: 'static', insertText: 'static ', kind: 'keyword', detail: 'Static modifier' },
    { label: 'final', insertText: 'final ', kind: 'keyword', detail: 'Final modifier' },
    { label: 'class', insertText: 'public class Main {\n    \n}', kind: 'snippet', detail: 'Class definition', cursorOffset: -3 },
    { label: 'for i', insertText: 'for (int i = 0; i < n; i++) {\n    \n}', kind: 'snippet', detail: 'Standard for loop', cursorOffset: -3 },
    { label: 'for each', insertText: 'for (var item : items) {\n    \n}', kind: 'snippet', detail: 'Enhanced for loop', cursorOffset: -3 },
    { label: 'if', insertText: 'if (condition) {\n    \n}', kind: 'snippet', detail: 'if statement', cursorOffset: -3 },
    { label: 'while', insertText: 'while (condition) {\n    \n}', kind: 'snippet', detail: 'while loop', cursorOffset: -3 },
    { label: 'try catch', insertText: 'try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}', kind: 'snippet', detail: 'Exception block', cursorOffset: -45 },
    { label: 'ArrayList', insertText: 'List<String> list = new ArrayList<>();', kind: 'snippet', detail: 'List instantiation' },
    { label: 'HashMap', insertText: 'Map<String, Integer> map = new HashMap<>();', kind: 'snippet', detail: 'Map instantiation' },
    { label: 'Scanner', insertText: 'Scanner scanner = new Scanner(System.in);', kind: 'snippet', detail: 'Standard input scanner' },
    { label: 'String', insertText: 'String ', kind: 'type', detail: 'String type' },
    { label: 'int', insertText: 'int ', kind: 'type', detail: '32-bit signed integer' },
    { label: 'boolean', insertText: 'boolean ', kind: 'type', detail: 'Boolean primitive' },
    { label: 'double', insertText: 'double ', kind: 'type', detail: 'Double primitive' },
    { label: 'return', insertText: 'return ;', kind: 'keyword', detail: 'Return statement', cursorOffset: -1 },
    { label: '@Override', insertText: '@Override\n', kind: 'keyword', detail: 'Override annotation' },
  ],

  c: [
    { label: '#include <stdio.h>', insertText: '#include <stdio.h>\n', kind: 'snippet', detail: 'Standard I/O header' },
    { label: '#include <stdlib.h>', insertText: '#include <stdlib.h>\n', kind: 'snippet', detail: 'Standard library header' },
    { label: '#include <string.h>', insertText: '#include <string.h>\n', kind: 'snippet', detail: 'String functions header' },
    { label: '#include <math.h>', insertText: '#include <math.h>\n', kind: 'snippet', detail: 'Math library header' },
    { label: 'main', insertText: 'int main() {\n    \n    return 0;\n}', kind: 'snippet', detail: 'Main entry function', cursorOffset: -16 },
    { label: 'printf', insertText: 'printf("%s\\n", msg);', kind: 'snippet', detail: 'Formatted print', cursorOffset: -1 },
    { label: 'scanf', insertText: 'scanf("%d", &val);', kind: 'snippet', detail: 'Formatted input' },
    { label: 'for', insertText: 'for (int i = 0; i < n; i++) {\n    \n}', kind: 'snippet', detail: 'for loop', cursorOffset: -3 },
    { label: 'while', insertText: 'while (condition) {\n    \n}', kind: 'snippet', detail: 'while loop', cursorOffset: -3 },
    { label: 'if', insertText: 'if (condition) {\n    \n}', kind: 'snippet', detail: 'if statement', cursorOffset: -3 },
    { label: 'struct', insertText: 'struct Point {\n    int x;\n    int y;\n};', kind: 'snippet', detail: 'struct declaration' },
    { label: 'typedef struct', insertText: 'typedef struct {\n    int x;\n} Point_t;', kind: 'snippet', detail: 'Typedef struct' },
    { label: 'malloc', insertText: 'malloc(sizeof() * n)', kind: 'function', detail: 'Dynamic memory allocation', cursorOffset: -6 },
    { label: 'free', insertText: 'free(ptr);', kind: 'function', detail: 'Free allocated memory' },
    { label: 'sizeof', insertText: 'sizeof()', kind: 'function', detail: 'Size in bytes', cursorOffset: -1 },
    { label: 'return', insertText: 'return 0;', kind: 'keyword', detail: 'Return statement' },
    { label: 'NULL', insertText: 'NULL', kind: 'constant', detail: 'Null pointer constant' },
  ],

  cpp: [
    { label: '#include <iostream>', insertText: '#include <iostream>\n', kind: 'snippet', detail: 'C++ Stream I/O' },
    { label: '#include <vector>', insertText: '#include <vector>\n', kind: 'snippet', detail: 'vector container' },
    { label: '#include <string>', insertText: '#include <string>\n', kind: 'snippet', detail: 'std::string class' },
    { label: '#include <algorithm>', insertText: '#include <algorithm>\n', kind: 'snippet', detail: 'STL algorithms' },
    { label: 'cout', insertText: 'std::cout <<  << std::endl;', kind: 'snippet', detail: 'Print to stdout', cursorOffset: -15 },
    { label: 'cin', insertText: 'std::cin >> val;', kind: 'snippet', detail: 'Read from stdin' },
    { label: 'main', insertText: 'int main() {\n    \n    return 0;\n}', kind: 'snippet', detail: 'Main entrypoint', cursorOffset: -16 },
    { label: 'vector', insertText: 'std::vector<int> vec;', kind: 'snippet', detail: 'Vector container' },
    { label: 'for range', insertText: 'for (const auto& item : items) {\n    \n}', kind: 'snippet', detail: 'Range-based for loop', cursorOffset: -3 },
    { label: 'for i', insertText: 'for (int i = 0; i < n; ++i) {\n    \n}', kind: 'snippet', detail: 'Indexed for loop', cursorOffset: -3 },
    { label: 'class', insertText: 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};', kind: 'snippet', detail: 'Class template' },
    { label: 'auto', insertText: 'auto ', kind: 'keyword', detail: 'Automatic type deduction' },
    { label: 'nullptr', insertText: 'nullptr', kind: 'constant', detail: 'Pointer literal' },
  ],

  rust: [
    { label: 'println!', insertText: 'println!("{}", );', kind: 'snippet', detail: 'Print line macro', cursorOffset: -3 },
    { label: 'print!', insertText: 'print!("{}", );', kind: 'snippet', detail: 'Print macro', cursorOffset: -3 },
    { label: 'fn main', insertText: 'fn main() {\n    \n}', kind: 'snippet', detail: 'Main function', cursorOffset: -3 },
    { label: 'fn', insertText: 'fn function_name() {\n    \n}', kind: 'snippet', detail: 'Function definition', cursorOffset: -3 },
    { label: 'let mut', insertText: 'let mut name = ;', kind: 'snippet', detail: 'Mutable binding', cursorOffset: -1 },
    { label: 'let', insertText: 'let name = ;', kind: 'snippet', detail: 'Immutable binding', cursorOffset: -1 },
    { label: 'match', insertText: 'match val {\n    Some(x) => {},\n    None => {},\n}', kind: 'snippet', detail: 'Pattern match' },
    { label: 'for in', insertText: 'for item in iter {\n    \n}', kind: 'snippet', detail: 'Iterator loop', cursorOffset: -3 },
    { label: 'struct', insertText: 'struct Name {\n    field: i32,\n}', kind: 'snippet', detail: 'Struct declaration' },
    { label: 'enum', insertText: 'enum Name {\n    VariantA,\n    VariantB,\n}', kind: 'snippet', detail: 'Enum declaration' },
    { label: 'impl', insertText: 'impl Name {\n    pub fn new() -> Self {\n        Self {}\n    }\n}', kind: 'snippet', detail: 'Implementation block' },
    { label: 'vec!', insertText: 'vec![]', kind: 'snippet', detail: 'Vector macro', cursorOffset: -1 },
    { label: 'Vec::new', insertText: 'Vec::new()', kind: 'function', detail: 'New empty vector' },
    { label: 'String::from', insertText: 'String::from("")', kind: 'function', detail: 'Create owned String', cursorOffset: -2 },
  ],

  go: [
    { label: 'fmt.Println', insertText: 'fmt.Println()', kind: 'function', detail: 'Print with newline', cursorOffset: -1 },
    { label: 'fmt.Printf', insertText: 'fmt.Printf("%v\\n", )', kind: 'snippet', detail: 'Formatted print', cursorOffset: -1 },
    { label: 'func main', insertText: 'func main() {\n    \n}', kind: 'snippet', detail: 'Main function', cursorOffset: -3 },
    { label: 'package main', insertText: 'package main\n\nimport "fmt"\n', kind: 'snippet', detail: 'Go main package header' },
    { label: 'func', insertText: 'func name(params) returnType {\n    \n}', kind: 'snippet', detail: 'Function declaration', cursorOffset: -3 },
    { label: 'for range', insertText: 'for i, v := range slice {\n    \n}', kind: 'snippet', detail: 'Range loop', cursorOffset: -3 },
    { label: 'for i', insertText: 'for i := 0; i < n; i++ {\n    \n}', kind: 'snippet', detail: 'Classic for loop', cursorOffset: -3 },
    { label: 'if err != nil', insertText: 'if err != nil {\n    return err\n}', kind: 'snippet', detail: 'Error check' },
    { label: 'make slice', insertText: 'make([]int, 0, 10)', kind: 'function', detail: 'Make slice with capacity' },
    { label: 'make map', insertText: 'make(map[string]int)', kind: 'function', detail: 'Make map' },
    { label: 'struct', insertText: 'type Name struct {\n    Field string\n}', kind: 'snippet', detail: 'Type struct definition' },
    { label: 'defer', insertText: 'defer ', kind: 'keyword', detail: 'Defer statement' },
    { label: 'go', insertText: 'go func() {\n    \n}()', kind: 'snippet', detail: 'Goroutine launch', cursorOffset: -5 },
  ],

  typescript: [
    { label: 'console.log', insertText: 'console.log();', kind: 'function', detail: 'Log to console', cursorOffset: -2 },
    { label: 'clg', insertText: 'console.log();', kind: 'snippet', detail: 'console.log shortcut', cursorOffset: -2 },
    { label: 'console.error', insertText: 'console.error();', kind: 'function', detail: 'Log error', cursorOffset: -2 },
    { label: 'const', insertText: 'const name = ;', kind: 'keyword', detail: 'Constant variable', cursorOffset: -1 },
    { label: 'let', insertText: 'let name = ;', kind: 'keyword', detail: 'Mutable variable', cursorOffset: -1 },
    { label: 'function', insertText: 'function name() {\n    \n}', kind: 'snippet', detail: 'Function declaration', cursorOffset: -3 },
    { label: 'arrow function', insertText: 'const fn = () => {\n    \n};', kind: 'snippet', detail: 'Arrow function', cursorOffset: -4 },
    { label: 'interface', insertText: 'interface Name {\n    id: string;\n}', kind: 'snippet', detail: 'TypeScript interface' },
    { label: 'type', insertText: 'type Name = string;', kind: 'snippet', detail: 'Type alias' },
    { label: 'for of', insertText: 'for (const item of items) {\n    \n}', kind: 'snippet', detail: 'for...of loop', cursorOffset: -3 },
    { label: 'for i', insertText: 'for (let i = 0; i < n; i++) {\n    \n}', kind: 'snippet', detail: 'Indexed loop', cursorOffset: -3 },
    { label: 'if', insertText: 'if (condition) {\n    \n}', kind: 'snippet', detail: 'if statement', cursorOffset: -3 },
    { label: 'try catch', insertText: 'try {\n    \n} catch (err) {\n    console.error(err);\n}', kind: 'snippet', detail: 'try/catch block', cursorOffset: -38 },
    { label: 'async function', insertText: 'async function name(): Promise<void> {\n    \n}', kind: 'snippet', detail: 'Async function', cursorOffset: -3 },
    { label: 'return', insertText: 'return ;', kind: 'keyword', detail: 'Return statement', cursorOffset: -1 },
  ],
};

// Also support common aliases
LANGUAGE_SUGGESTIONS['js'] = LANGUAGE_SUGGESTIONS['typescript'];
LANGUAGE_SUGGESTIONS['javascript'] = LANGUAGE_SUGGESTIONS['typescript'];
LANGUAGE_SUGGESTIONS['py'] = LANGUAGE_SUGGESTIONS['python'];
LANGUAGE_SUGGESTIONS['c++'] = LANGUAGE_SUGGESTIONS['cpp'];
LANGUAGE_SUGGESTIONS['golang'] = LANGUAGE_SUGGESTIONS['go'];

// Extract user identifiers (variables, functions, classes) from the current document
export function extractDocumentSymbols(code: string): SuggestionItem[] {
  const words = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]{2,}\b/g) || [];
  const freq = new Map<string, number>();

  for (const w of words) {
    // Skip very short or all-uppercase noise
    if (w.length < 3) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  const items: SuggestionItem[] = [];
  for (const [word] of freq.entries()) {
    items.push({
      label: word,
      insertText: word,
      kind: 'variable',
      detail: 'Document identifier',
    });
  }

  return items;
}

// Get filtered completions based on active language and the word prefix being typed
export function getCompletions(
  prefix: string,
  languageId: string,
  code: string,
  maxResults = 9
): SuggestionItem[] {
  const cleanPrefix = prefix.trim().toLowerCase();
  if (!cleanPrefix) return [];

  const langKey = languageId.toLowerCase();
  const builtins = LANGUAGE_SUGGESTIONS[langKey] || LANGUAGE_SUGGESTIONS['c'] || [];
  const docSymbols = extractDocumentSymbols(code);

  const combined = [...builtins, ...docSymbols];
  const seen = new Set<string>();
  const matches: SuggestionItem[] = [];

  // 1. Exact prefix match first
  for (const item of combined) {
    if (seen.has(item.label)) continue;
    const lower = item.label.toLowerCase();
    if (lower.startsWith(cleanPrefix) && lower !== cleanPrefix) {
      seen.add(item.label);
      matches.push(item);
      if (matches.length >= maxResults) return matches;
    }
  }

  // 2. Substring / contains match second
  for (const item of combined) {
    if (seen.has(item.label)) continue;
    const lower = item.label.toLowerCase();
    if (lower.includes(cleanPrefix) && lower !== cleanPrefix) {
      seen.add(item.label);
      matches.push(item);
      if (matches.length >= maxResults) return matches;
    }
  }

  return matches;
}
