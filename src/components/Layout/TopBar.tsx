import { Search, Moon, Sun, Github, FileText, Languages, ChevronDown, QrCode, Menu } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { Language } from '../../data/types';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { QRCodeSVG } from 'qrcode.react';

const SITE_URL = 'https://tangjianfang.github.io/ClaudeAssist/';

const LANG_OPTIONS: Array<{ value: Language; label: string; short: string }> = [
  { value: 'en',    label: 'English',              short: 'EN' },
  { value: 'zh-CN', label: '简体中文',              short: '简中' },
  { value: 'zh-TW', label: '繁體中文',              short: '繁中' },
  { value: 'ja',    label: '日本語',                short: '日本語' },
  { value: 'ko',    label: '한국어',                short: '한국어' },
  { value: 'fr',    label: 'Français',              short: 'FR' },
  { value: 'de',    label: 'Deutsch',               short: 'DE' },
  { value: 'es',    label: 'Español',               short: 'ES' },
  { value: 'pt',    label: 'Português',             short: 'PT' },
  { value: 'ru',    label: 'Русский',               short: 'RU' },
  { value: 'it',    label: 'Italiano',              short: 'IT' },
  { value: 'nl',    label: 'Nederlands',            short: 'NL' },
  { value: 'tr',    label: 'Türkçe',               short: 'TR' },
];

interface TopBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onMenuOpen: () => void;
}

export function TopBar({ query, onQueryChange, darkMode, onToggleDark, onMenuOpen }: TopBarProps) {
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (qrRef.current && !qrRef.current.contains(e.target as Node)) {
        setQrOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = LANG_OPTIONS.find((o) => o.value === lang)?.short ?? 'EN';

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <a
          href="#/"
          className="flex items-center gap-2 shrink-0 font-bold text-slate-900 dark:text-white"
        >
          <span className="text-lg">🤖</span>
          <span className="hidden sm:block text-sm font-semibold">ClaudeAssist</span>
        </a>

        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuOpen}
          className="md:hidden rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="flex-1 relative max-w-xl">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Language selector — custom dropdown for dark mode support */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Switch language"
            >
              <Languages size={13} className="opacity-70" />
              <span>{currentLabel}</span>
              <ChevronDown size={11} className={clsx('opacity-60 transition-transform', langOpen && 'rotate-180')} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 max-h-72 overflow-y-auto">
                {LANG_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { setLang(value); setLangOpen(false); }}
                    className={clsx(
                      'w-full text-left px-3 py-1.5 text-sm transition-colors',
                      value === lang
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={t.toggleDark}
            className="rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Cheat sheet */}
          <a
            href="#/cheatsheet"
            title={t.cheatsheet}
            className="rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FileText size={16} />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github size={16} />
          </a>

          {/* QR Code popover */}
          <div ref={qrRef} className="relative">
            <button
              onClick={() => setQrOpen((o) => !o)}
              title="Scan QR code to open on mobile"
              className={clsx(
                'rounded-md p-1.5 transition-colors',
                qrOpen
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              <QrCode size={16} />
            </button>

            {qrOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-4 flex flex-col items-center gap-3 w-52">
                {/* QR SVG on white bg for reliable scanning */}
                <div className="rounded-lg bg-white p-2">
                  <QRCodeSVG
                    value={SITE_URL}
                    size={172}
                    bgColor="#ffffff"
                    fgColor="#1e1b4b"
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  扫码用手机访问
                  <br />
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px] break-all">
                    {SITE_URL}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
