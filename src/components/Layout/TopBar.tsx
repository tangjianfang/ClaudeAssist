import { Search, Moon, Sun, Github, FileText, Languages } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { Language } from '../../data/types';

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
}

export function TopBar({ query, onQueryChange, darkMode, onToggleDark }: TopBarProps) {
  const { lang, setLang, t } = useLanguage();

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
          {/* Language selector */}
          <div className="relative flex items-center">
            <Languages size={14} className="absolute left-2 text-slate-400 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="appearance-none rounded-md pl-6 pr-2 py-1.5 text-xs font-semibold bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Switch language"
            >
              {LANG_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
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
        </div>
      </div>
    </header>
  );
}
