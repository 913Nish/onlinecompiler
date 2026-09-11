import React from 'react';
import { X, Settings, Palette, Type, Indent, Sun, Moon, Sparkles, Lightbulb } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (tab: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
  syntaxHighlighting: boolean;
  setSyntaxHighlighting: (val: boolean) => void;
  autocompleteEnabled?: boolean;
  setAutocompleteEnabled?: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  tabSize,
  setTabSize,
  theme,
  setTheme,
  syntaxHighlighting,
  setSyntaxHighlighting,
  autocompleteEnabled = true,
  setAutocompleteEnabled,
}) => {
  const { isDark, setThemeMode } = useTheme();

  if (!isOpen) return null;

  const handleSelectTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    if (selectedTheme === 'nextleap-light') {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6 transition-colors border ${
          isDark
            ? 'bg-[#0d121f] border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark
                  ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-400'
                  : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Editor Preferences
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Customize appearance and coding ergonomics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Mode / Color Palette */}
        <div className="space-y-2">
          <label
            className={`text-xs font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-500" />
            Theme &amp; Appearance
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Dark Mode Option */}
            <button
              id="theme-option-dark"
              onClick={() => handleSelectTheme('nextleap-dark')}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme === 'nextleap-dark'
                  ? isDark
                    ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500'
                    : 'bg-slate-900 border-cyan-500 text-white ring-1 ring-cyan-500'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <div className={`text-xs font-semibold ${theme === 'nextleap-dark' || isDark ? 'text-white' : 'text-slate-900'}`}>
                  Dark Mode
                </div>
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Modern high-contrast navy
              </div>
            </button>

            {/* Light Mode Option */}
            <button
              id="theme-option-light"
              onClick={() => handleSelectTheme('nextleap-light')}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme === 'nextleap-light'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500 text-slate-900'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <div className={`text-xs font-semibold ${theme === 'nextleap-light' ? 'text-amber-800 dark:text-amber-300 font-bold' : isDark ? 'text-white' : 'text-slate-900'}`}>
                  Light Mode
                </div>
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Clean daylight paper theme
              </div>
            </button>

            {/* Obsidian Option */}
            <button
              id="theme-option-obsidian"
              onClick={() => handleSelectTheme('obsidian')}
              className={`col-span-2 p-3 rounded-xl border text-left transition-all ${
                theme === 'obsidian'
                  ? 'bg-black border-cyan-500 text-white ring-1 ring-cyan-500'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <div className={`text-xs font-semibold ${theme === 'obsidian' || isDark ? 'text-white' : 'text-slate-900'}`}>
                    Obsidian Pitch (OLED Dark)
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  #000000
                </span>
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pure blacks for ultra contrast
              </div>
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label
            className={`text-xs font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Type className="w-4 h-4 text-cyan-500" />
            Font Size ({fontSize}px)
          </label>
          <div className="flex items-center gap-2">
            {[12, 14, 16, 18].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  fontSize === size
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Tab Size */}
        <div className="space-y-2">
          <label
            className={`text-xs font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Indent className="w-4 h-4 text-indigo-500" />
            Tab Indentation
          </label>
          <div className="flex items-center gap-2">
            {[2, 4].map((spaces) => (
              <button
                key={spaces}
                onClick={() => setTabSize(spaces)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  tabSize === spaces
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {spaces} Spaces
              </button>
            ))}
          </div>
        </div>

        {/* Semantic Syntax Highlighting Toggle */}
        <div
          className={`p-3.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div>
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Semantic Syntax Highlighting
                </div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Keywords, strings, numbers &amp; token styling
                </div>
              </div>
            </div>

            <button
              id="syntax-highlighting-toggle"
              type="button"
              role="switch"
              aria-checked={syntaxHighlighting}
              onClick={() => setSyntaxHighlighting(!syntaxHighlighting)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                syntaxHighlighting
                  ? 'bg-cyan-600'
                  : isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  syntaxHighlighting ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className={`text-[10px] mt-2 pt-2 border-t font-medium ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}>
            {syntaxHighlighting
              ? 'Multi-color tokenization enabled (keywords in purple, strings in green, numbers in amber).'
              : 'Disabled for enhanced screen reader accessibility & high-speed typing performance.'}
          </div>
        </div>

        {/* Smart Autocomplete & Code Suggestions Toggle */}
        {setAutocompleteEnabled && (
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <div>
                  <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Smart Autocomplete &amp; Suggestions
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    IntelliSense popups while typing &amp; snippets
                  </div>
                </div>
              </div>

              <button
                id="autocomplete-settings-toggle"
                type="button"
                role="switch"
                aria-checked={autocompleteEnabled}
                onClick={() => setAutocompleteEnabled(!autocompleteEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  autocompleteEnabled
                    ? 'bg-amber-500'
                    : isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autocompleteEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className={`text-[10px] mt-2 pt-2 border-t font-medium ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              {autocompleteEnabled
                ? 'Shows live keywords, functions, snippet expansions & document symbols with Tab / Enter to insert.'
                : 'Disabled. You can always press Ctrl+Space inside the editor to invoke manually.'}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
        >
          Save &amp; Apply
        </button>
      </div>
    </div>
  );
};

