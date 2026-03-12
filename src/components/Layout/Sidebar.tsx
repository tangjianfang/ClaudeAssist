import { NavLink } from 'react-router-dom';
import {
  Slash,
  Terminal,
  Keyboard,
  Zap,
  Layers,
  Settings,
  Variable,
  BookOpen,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../i18n';
import { sectionEntries, scenarios } from '../../data';
import type { SectionId } from '../../data/types';

interface SidebarItem {
  id: SectionId;
  icon: React.ReactNode;
}

const items: SidebarItem[] = [
  { id: 'slash-commands', icon: <Slash size={18} /> },
  { id: 'cli-flags', icon: <Terminal size={18} /> },
  { id: 'shortcuts', icon: <Keyboard size={18} /> },
  { id: 'skills', icon: <Zap size={18} /> },
  { id: 'modes', icon: <Layers size={18} /> },
  { id: 'settings', icon: <Settings size={18} /> },
  { id: 'env-vars', icon: <Variable size={18} /> },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
  );

export function Sidebar() {
  const { t } = useLanguage();

  return (
    <nav className="w-56 shrink-0 hidden md:flex flex-col gap-0.5 py-4 pr-2 border-r border-slate-100 dark:border-slate-800">
      {/* Scenarios link */}
      <NavLink to="/scenarios" className={navLinkClass}>
        <span className="opacity-70"><BookOpen size={18} /></span>
        <span className="truncate">{t.sections['scenarios']}</span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {scenarios.length}
        </span>
      </NavLink>

      {/* Divider */}
      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

      {items.map(({ id, icon }) => (
        <NavLink
          key={id}
          to={`/${id}`}
          className={navLinkClass}
        >
          <span className="opacity-70">{icon}</span>
          <span className="truncate">{t.sections[id]}</span>
          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
            {sectionEntries[id].length}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
