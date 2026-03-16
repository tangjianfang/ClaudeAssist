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
  Star,
  Sparkles,
  Puzzle,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../i18n';
import { sectionEntries, scenarios } from '../../data';
import { useFavoritesContext } from '../../context/FavoritesContext';
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

interface SidebarProps {
  onClose?: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
  );

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useLanguage();
  const { favorites } = useFavoritesContext();

  return (
    <nav className="w-56 shrink-0 flex flex-col gap-0.5 py-4 pr-2 border-r border-slate-100 dark:border-slate-800">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-end pr-1 mb-1">
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {/* Scenarios link */}
      <NavLink to="/scenarios" className={navLinkClass} onClick={onClose}>
        <span className="opacity-70"><BookOpen size={18} /></span>
        <span className="truncate">{t.sections['scenarios']}</span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {scenarios.length}
        </span>
      </NavLink>

      {/* What's New */}
      <NavLink to="/features" className={navLinkClass} onClick={onClose}>
        <span className="opacity-70"><Sparkles size={18} /></span>
        <span className="truncate">{t.sections['features']}</span>
      </NavLink>

      {/* Plugins */}
      <NavLink to="/plugins" className={navLinkClass} onClick={onClose}>
        <span className="opacity-70"><Puzzle size={18} /></span>
        <span className="truncate">{t.sections['plugins']}</span>
      </NavLink>

      {/* Favorites */}
      <NavLink to="/favorites" className={navLinkClass} onClick={onClose}>
        <span className="opacity-70"><Star size={18} /></span>
        <span className="truncate">{t.sections['favorites']}</span>
        {favorites.size > 0 && (
          <span className="ml-auto text-xs text-amber-500 dark:text-amber-400 font-semibold">
            {favorites.size}
          </span>
        )}
      </NavLink>

      {/* Divider */}
      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

      {items.map(({ id, icon }) => (
        <NavLink
          key={id}
          to={`/${id}`}
          className={navLinkClass}
          onClick={onClose}
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
