import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../i18n';
import { sectionEntries, scenarios } from '../../data';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { NAV_GROUPS } from '../../data/navigation';
import type { SectionId } from '../../data/types';

interface SidebarProps {
  onClose?: () => void;
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx('px-3 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 select-none', className)}>
      {children}
    </p>
  );
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
  );

export function Sidebar({ onClose }: SidebarProps) {
  const { lang } = useLanguage();
  const { favorites } = useFavoritesContext();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  function getBadgeValue(badge?: string, id?: string): number | null {
    if (!badge) return null;
    if (badge === 'scenarios-count') return scenarios.length;
    if (badge === 'favorites-count') return favorites.size > 0 ? favorites.size : null;
    if (badge === 'section-count' && id && id in sectionEntries) {
      return sectionEntries[id as SectionId].length;
    }
    return null;
  }

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

      {NAV_GROUPS.map((group, gi) => (
        <div key={group.id}>
          <SectionLabel className={gi > 0 ? 'mt-1' : undefined}>
            {isZh ? group.labelZh : group.labelEn}
          </SectionLabel>
          {group.items.map((item) => {
            const badgeVal = getBadgeValue(item.badge, item.id);
            const label = isZh ? item.labelZh : item.labelEn;
            return (
              <NavLink key={item.id} to={item.path} className={navLinkClass} onClick={onClose}>
                <span className="opacity-70"><item.Icon size={18} /></span>
                <span className="truncate">{label}</span>
                {badgeVal !== null && (
                  <span className={clsx(
                    'ml-auto text-xs font-semibold',
                    item.badge === 'favorites-count'
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-500',
                  )}>
                    {badgeVal}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

