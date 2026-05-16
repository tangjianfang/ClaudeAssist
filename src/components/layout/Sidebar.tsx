import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../i18n';
import { sectionEntries, scenarios } from '../../data';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { NAV_GROUPS } from '../../data/navigation';
import type { NavItem } from '../../data/navigation';
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

function SubsectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx('px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-500 select-none', className)}>
      {children}
    </p>
  );
}

const navLinkClass = ({ isActive, depth }: { isActive: boolean; depth: 0 | 1 }) =>
  clsx(
    'flex min-w-0 items-center gap-2.5 rounded-lg transition-colors',
    depth === 0 ? 'px-3 py-2.5 text-[15px]' : 'px-2.5 py-2 text-sm',
    isActive
      ? depth === 0
        ? 'bg-sky-50 text-sky-800 font-semibold dark:bg-sky-900/30 dark:text-sky-200'
        : 'bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-slate-100'
      : depth === 0
        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-500 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
  );

function NavItemLink({
  item,
  label,
  badgeVal,
  depth,
  onClose,
}: {
  item: NavItem;
  label: string;
  badgeVal: number | null;
  depth: 0 | 1;
  onClose?: () => void;
}) {
  const iconSize = depth === 0 ? 18 : 15;
  const hasChildren = Boolean(item.children?.length);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/' || !hasChildren}
      className={({ isActive }) => navLinkClass({ isActive, depth })}
      onClick={onClose}
    >
      <span className={clsx('shrink-0', depth === 0 ? 'opacity-75' : 'opacity-60')}>
        <item.Icon size={iconSize} />
      </span>
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
}

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

  function renderItem(item: NavItem, depth: 0 | 1 = 0) {
    const label = isZh ? item.labelZh : item.labelEn;
    const badgeVal = getBadgeValue(item.badge, item.id);

    return (
      <div key={item.id} className="min-w-0">
        <NavItemLink item={item} label={label} badgeVal={badgeVal} depth={depth} onClose={onClose} />
        {item.children && item.children.length > 0 && (
          <div className="ml-4 mt-1 border-l border-slate-200 pl-2 dark:border-slate-800">
            {item.children.map((child) => renderItem(child, 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <nav className="w-56 shrink-0 flex flex-col gap-0.5 py-4 pr-2 border-r border-slate-100 dark:border-slate-800">
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

      {NAV_GROUPS.map((group, groupIndex) => (
        <div key={group.id} className="pb-1">
          <SectionLabel className={groupIndex > 0 ? 'mt-1' : undefined}>
            {isZh ? group.labelZh : group.labelEn}
          </SectionLabel>
          {group.sections.map((section) => (
            <div key={section.id} className="mt-1">
              <SubsectionLabel>
                {isZh ? section.labelZh : section.labelEn}
              </SubsectionLabel>
              <div className="space-y-0.5">
                {section.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
