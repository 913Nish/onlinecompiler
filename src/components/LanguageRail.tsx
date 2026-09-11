import React, { useState, useRef, useEffect } from 'react';
import { LanguagePreset } from '../types';
import { LanguageIcon } from './LanguageIcons';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface LanguageRailProps {
  languages: LanguagePreset[];
  selectedLanguage: LanguagePreset;
  onSelectLanguage: (language: LanguagePreset) => void;
  isDark?: boolean;
}

export const LanguageRail: React.FC<LanguageRailProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  isDark = true,
}) => {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the active language into view
  useEffect(() => {
    if (activeBtnRef.current && railRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedLanguage.id]);

  const filteredLanguages = languages.filter((lang) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      lang.id.toLowerCase().includes(query) ||
      (lang.shortName && lang.shortName.toLowerCase().includes(query)) ||
      lang.name.toLowerCase().includes(query) ||
      lang.extension.toLowerCase().includes(query)
    );
  });

  const scrollUp = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ top: -160, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ top: 160, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Horizontal Language Carousel (< md screens) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1 w-full shrink-0">
        {languages.map((lang) => {
          const isSelected = selectedLanguage.id === lang.id;
          const displayLabel = lang.shortName || lang.id.toUpperCase();

          return (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang)}
              className={`shrink-0 w-16 h-[72px] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#dcf5d8] text-[#102213] shadow-md border border-[#c2eebb] scale-[1.02]'
                  : 'bg-[#181a20] text-white hover:bg-[#232733] border border-slate-800'
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  isSelected ? 'text-[#102213]' : 'text-white'
                }`}
              >
                <LanguageIcon id={lang.id} className="w-7 h-7" isSelected={isSelected} />
              </div>
              <span
                className={`text-[12px] font-bold tracking-tight mt-0.5 leading-none text-center ${
                  isSelected ? 'text-[#102213]' : 'text-white'
                }`}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Language Rail (md+ screens) - Exactly matches the screenshot */}
      <aside
        id="language-rail-sidebar"
        aria-label="Language Selector Rail"
        className={`hidden md:flex flex-col items-center rounded-2xl py-2 px-1.5 transition-all select-none border shrink-0 ${
          isDark
            ? 'bg-[#0a0d13] border-slate-800/90 shadow-2xl'
            : 'bg-[#0f1422] border-slate-800 shadow-xl'
        } w-[76px] self-stretch`}
      >
        {/* Search / Filter Button */}
        <div className="w-full flex flex-col items-center mb-1.5 gap-1">
          <button
            id="toggle-lang-search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            title="Search languages (C, C#, Go, Java, Python...)"
            className="w-14 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {isSearchOpen && (
            <div className="w-full px-1 mb-1">
              <input
                type="text"
                placeholder="Find..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-[10px] px-1.5 py-1 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
          )}

          {/* Mini scroll up indicator button */}
          <button
            onClick={scrollUp}
            title="Scroll up languages"
            className="w-14 h-4 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>

        {/* Vertical Rail of Language Tiles */}
        <div
          ref={railRef}
          className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden max-h-[580px] py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguage.id === lang.id;
            const displayLabel = lang.shortName || lang.id.toUpperCase();

            return (
              <button
                key={lang.id}
                ref={isSelected ? activeBtnRef : undefined}
                id={`lang-btn-${lang.id}`}
                onClick={() => onSelectLanguage(lang)}
                title={`${lang.name} (.${lang.extension}) - ${lang.badge}\n${lang.description}`}
                className={`group relative w-16 h-[72px] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#dcf5d8] text-[#102213] shadow-md border border-[#c2eebb] scale-[1.03]'
                    : 'bg-[#181a20] text-white hover:bg-[#232733] border border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Language Logo/Icon */}
                <div
                  className={`flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected ? 'text-[#102213]' : 'text-white'
                  }`}
                >
                  <LanguageIcon id={lang.id} className="w-7 h-7" isSelected={isSelected} />
                </div>

                {/* Language Name/Label - bold and centered */}
                <span
                  className={`text-[12px] font-bold tracking-tight mt-0.5 leading-none text-center ${
                    isSelected ? 'text-[#102213]' : 'text-white'
                  }`}
                >
                  {displayLabel}
                </span>

                {/* Left active selection indicator bar */}
                {isSelected && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 rounded-r-full" />
                )}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="text-[10px] text-slate-500 text-center py-4 px-1">
              No match
            </div>
          )}
        </div>

        {/* Mini scroll down indicator button */}
        <button
          onClick={scrollDown}
          title="Scroll down languages"
          className="w-14 h-4 mt-1 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Language count label */}
        <div className="mt-1 text-[9px] font-mono text-slate-500 tracking-wider">
          {languages.length}
        </div>
      </aside>
    </>
  );
};
