import React from 'react';

interface LanguageIconProps {
  id: string;
  className?: string;
  isSelected?: boolean;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({ id, className = 'w-7 h-7' }) => {
  const normId = id.toLowerCase();

  switch (normId) {
    case 'c':
      // Circle with stylized hollow 'C' inside, as in the screenshot
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <circle cx="16" cy="16" r="13" strokeWidth="2.2" />
          <path
            d="M20.5 11.2A6.8 6.8 0 1 0 20.5 20.8"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'csharp':
    case 'cs':
      // Hexagon with C# monogram
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <polygon
            points="16,3 27.5,9.5 27.5,22.5 16,29 4.5,22.5 4.5,9.5"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* C arc */}
          <path
            d="M15 11A5 5 0 1 0 15 21"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* # symbol */}
          <path d="M18.5 12.5v7 M21.5 12.5v7" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17 14.5h6 M17 17.5h6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'cpp':
    case 'c++':
      // Hexagon with C++ monogram
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <polygon
            points="16,3 27.5,9.5 27.5,22.5 16,29 4.5,22.5 4.5,9.5"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* C arc */}
          <path
            d="M14 11A5 5 0 1 0 14 21"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* ++ symbol */}
          <path d="M17.5 14v4 M15.5 16h4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22.5 14v4 M20.5 16h4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'go':
    case 'golang':
      // Iconic -GO with speed trails
      return (
        <svg viewBox="0 0 38 24" className={className} fill="currentColor">
          {/* Left speed trails */}
          <rect x="1" y="7.5" width="5.5" height="2" rx="1" />
          <rect x="3.5" y="11" width="4.5" height="2" rx="1" />
          <rect x="0" y="14.5" width="7" height="2" rx="1" />
          {/* G */}
          <path
            d="M 18.5 4.5 C 13.5 4.5 10 8.2 10 13 C 10 17.8 13.8 21.5 19 21.5 C 23.5 21.5 26.5 18.5 26.8 14.2 L 18.5 14.2 L 18.5 11.8 L 29.2 11.8 C 29.5 12.8 29.6 13.8 29.6 14.8 C 29.6 20.2 25.2 24 19 24 C 12.2 24 7.2 19 7.2 13 C 7.2 7 12.5 2 19 2 C 23.2 2 26.8 3.8 28.8 6.8 L 26.2 8.5 C 24.8 6.1 22 4.5 18.5 4.5 Z"
          />
          {/* O */}
          <path
            d="M 33 5.5 C 29.5 5.5 26.8 8.8 26.8 13 C 26.8 17.2 29.5 20.5 33 20.5 C 36.5 20.5 39.2 17.2 39.2 13 C 39.2 8.8 36.5 5.5 33 5.5 Z M 33 2.5 C 38.5 2.5 42 7.2 42 13 C 42 18.8 38.5 23.5 33 23.5 C 27.5 23.5 24 18.8 24 13 C 24 7.2 27.5 2.5 33 2.5 Z"
            transform="scale(0.85) translate(6, 1)"
          />
        </svg>
      );

    case 'html':
      // HTML5 shield with 5 inside
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <path
            d="M6 4 L26 4 L23.8 24 L16 28 L8.2 24 Z"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Number 5 */}
          <path
            d="M21 9.5H11.5L12 14.5H20.5L19.8 21.5L16 23L12.2 21.5L12 18.5"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'java':
      // Java coffee cup with steaming wisps and saucer
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          {/* Steam wisps */}
          <path
            d="M13 5c-1 2 1 3 0 5 M16.5 4c-1 2 1 3 0 5 M20 5c-1 2 1 3 0 5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Cup */}
          <path
            d="M8.5 13h13c0 0 .5 7-6.5 7s-6.5-7-6.5-7z"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Cup handle */}
          <path
            d="M21.5 14.5c2 0 3.5 1 3.5 2.8s-1.5 2.7-3.5 2.7"
            strokeWidth="1.8"
          />
          {/* Saucer */}
          <path
            d="M6 24.5c4 2 16 2 20 0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'javascript':
    case 'js':
      // Shield outline with JS monogram
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <path
            d="M6 4 L26 4 L23.8 24 L16 28 L8.2 24 Z"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* J */}
          <path
            d="M13.5 12v6.5a2.5 2.5 0 0 1-5 0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* S */}
          <path
            d="M22 12.5c-1.5-.8-4.5-.5-4.5 1.8 0 2.2 4.5 1.5 4.5 4s-3 2.7-5 1.7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'jupyter':
    case 'ipynb':
      // Planet ring with jupyter text/dots
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <rect x="4" y="4" width="24" height="24" rx="4" strokeWidth="1.8" />
          {/* Orbit rings & moons */}
          <ellipse cx="16" cy="16" rx="8" ry="4" strokeWidth="1.8" transform="rotate(-20 16 16)" />
          <circle cx="9" cy="19" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="23" cy="13" r="1.8" fill="currentColor" stroke="none" />
          {/* Inner ring marker */}
          <path d="M12 16h8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'kotlin':
    case 'kt':
      // Kotlin angular flag geometric logo
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <polygon points="6,6 16,6 6,16" />
          <polygon points="16,6 26,6 16,16 6,26 6,16" />
          <polygon points="16,16 26,26 6,26" />
        </svg>
      );

    case 'python':
    case 'py':
      // Intertwined snakes
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M15.9 3c-4.4 0-7.9.6-7.9 3.5v2.8h7.9v1H6.1c-2.9 0-5.1 1.7-5.1 4.7 0 2.9 2.1 4.8 5.1 4.8h2.3v-2.3c0-2.3 2-4.1 4.3-4.1h7.8c1.9 0 3.5-1.5 3.5-3.4V6.5c0-2.9-3.5-3.5-8.1-3.5zm-2.4 2.2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z" />
          <path d="M16.1 29c4.4 0 7.9-.6 7.9-3.5v-2.8h-7.9v-1h9.8c2.9 0 5.1-1.7 5.1-4.7 0-2.9-2.1-4.8-5.1-4.8h-2.3v2.3c0 2.3-2 4.1-4.3 4.1H11.5c-1.9 0-3.5 1.5-3.5 3.4v3.4c0 2.9 3.5 3.6 8.1 3.6zm2.4-2.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z" />
        </svg>
      );

    case 'rust':
    case 'rs':
      // Gear with R
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <circle cx="16" cy="16" r="11" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="16" cy="16" r="8" strokeWidth="1.8" />
          <path
            d="M13 11h4.5a2.5 2.5 0 0 1 0 5H13v-5zm0 5h3.5l3 5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'typescript':
    case 'ts':
      // TS badge
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <rect x="4" y="4" width="24" height="24" rx="5" strokeWidth="2" />
          <path d="M8 12h8 M12 12v10" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M24 13c-1-.8-2.5-1-3.5 0-1 1 0 2.2 1.5 2.8 1.5.6 2.5 1.4 2.5 2.6 0 1.6-1.5 2.6-3.5 2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'php':
      // Oval pill with PHP
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <ellipse cx="16" cy="16" rx="13" ry="9" strokeWidth="2" />
          <text
            x="16"
            y="19.5"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            php
          </text>
        </svg>
      );

    case 'ruby':
    case 'rb':
      // Faceted gemstone
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <polygon
            points="9,6 23,6 29,13 16,27 3,13"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="3" y1="13" x2="29" y2="13" strokeWidth="1.5" />
          <polyline points="9,6 16,13 23,6" strokeWidth="1.5" strokeLinejoin="round" />
          <polyline points="9,6 16,27 23,6" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );

    case 'swift':
      // Swift flying bird
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <path d="M26 6c-3 4-7 8-12 9 4-1 8-4 10-7-5 7-11 11-17 11 8-2 15-8 19-15-5 5-11 7-17 7 6-2 11-6 14-11-7 4-13 5-19 4 3 6 8 11 14 13-6 0-11-3-15-7 2 6 7 11 14 13-5 0-10-2-14-6 3 7 9 11 17 12 7 1 15-2 20-8 2-3 3-8 3-12z" />
        </svg>
      );

    case 'lua':
      // Lua crescent planet and orbiting moon
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <circle cx="15" cy="17" r="9" strokeWidth="2" />
          <circle cx="19" cy="13" r="4.5" fill="currentColor" stroke="none" />
          <circle cx="24" cy="8" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'sql':
      // Database cylinders
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <ellipse cx="16" cy="8" rx="10" ry="4" strokeWidth="2" />
          <path d="M6 8v7c0 2.2 4.5 4 10 4s10-1.8 10-4V8" strokeWidth="2" />
          <path d="M6 15v7c0 2.2 4.5 4 10 4s10-1.8 10-4v-7" strokeWidth="2" />
        </svg>
      );

    case 'r':
      // Distinctive R
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <circle cx="16" cy="16" r="13" strokeWidth="2" />
          <path
            d="M12 10h5.5a3.5 3.5 0 0 1 0 7H12v-7zm0 7h4l4 5"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'zig':
      // Zig angular geometric monogram
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <polygon points="7,8 25,8 14,18 25,18 25,24 7,24 18,14 7,14" />
        </svg>
      );

    case 'dart':
      // Angular origami dart
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <polygon points="6,6 26,14 18,18 14,26" strokeWidth="2" strokeLinejoin="round" />
          <line x1="26" y1="14" x2="18" y2="18" strokeWidth="2" />
        </svg>
      );

    case 'assembly':
    case 'asm':
      // CPU Microchip
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <rect x="7" y="7" width="18" height="18" rx="2" strokeWidth="2" />
          <rect x="11" y="11" width="10" height="10" strokeWidth="1.5" />
          <path d="M11 3v4 M16 3v4 M21 3v4 M11 25v4 M16 25v4 M21 25v4" strokeWidth="1.5" />
          <path d="M3 11h4 M3 16h4 M3 21h4 M25 11h4 M25 16h4 M25 21h4" strokeWidth="1.5" />
        </svg>
      );

    case 'haskell':
    case 'hs':
      // Haskell lambda >>=
      return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <polygon points="5,5 11,16 5,27 9,27 13,19 18,27 22,27 15,16 9,5" />
          <polygon points="12,5 18,16 14,23 17,23 20,18 25,27 29,27 22,16 16,5" />
        </svg>
      );

    default:
      // Code brackets generic
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor">
          <rect x="5" y="5" width="22" height="22" rx="4" strokeWidth="2" />
          <path d="M12 11l-4 5 4 5 M20 11l4 5-4 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
