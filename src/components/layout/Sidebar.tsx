import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
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

function SubsectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx('px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-500 select-none', className)}>
      {children}
    </p>
  );
}

const navLinkClass = ({ isActive, depth }: { isActive: boolean; depth: number }) =>
  clsx(
    'flex min-w-0 items-center gap-2.5 rounded-lg transition-colors',
    depth === 0 ? 'px-3 py-2.5 text-[15px]' : depth === 1 ? 'px-2.5 py-2 text-sm' : 'px-2 py-1.5 text-xs',
    isActive
      ? depth === 0
        ? 'bg-sky-50 text-sky-800 font-semibold dark:bg-sky-900/30 dark:text-sky-200'
        : depth === 1
          ? 'bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-slate-100'
          : 'bg-slate-100/80 text-slate-800 font-medium dark:bg-slate-800/70 dark:text-slate-200'
      : depth === 0
        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'
        : depth === 1
          ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-500 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/40 dark:hover:text-slate-300'
  );

function itemMatchesLocation(item: NavItem, locationPath: string, locationUrl: string) {
  return locationUrl === item.path || (!item.path.includes('?') && locationPath === item.path);
}

function hasActiveDescendant(item: NavItem, locationPath: string, locationUrl: string): boolean {
  return Boolean(item.children?.some((child) => itemMatchesLocation(child, locationPath, locationUrl) || hasActiveDescendant(child, locationPath, locationUrl)));
}

function NavItemLink({
  item,
  label,
  badgeVal,
  depth,
  isActive,
  isOpen,
  onToggle,
  onClose,
}: {
  item: NavItem;
  label: string;
  badgeVal: number | null;
  depth: number;
  isActive: boolean;
  isOpen: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  const iconSize = depth === 0 ? 18 : depth === 1 ? 15 : 13;
  const hasChildren = Boolean(item.children?.length);
  const [logoFailed, setLogoFailed] = React.useState(false);
  const shouldShowLogo = item.logo && !logoFailed;

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Link
        to={item.path}
        className={clsx(navLinkClass({ isActive, depth }), 'flex-1')}
        onClick={onClose}
      >
        <span className={clsx('shrink-0', depth === 0 ? 'opacity-75' : 'opacity-60')}>
          {shouldShowLogo ? (
            <img
              src={item.logo}
              alt={label}
              className="w-[18px] h-[18px] rounded object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <item.Icon size={iconSize} />
          )}
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
      </Link>
      {hasChildren && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={isOpen ? `折叠 ${label}` : `展开 ${label}`}
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </div>
  );
}

export function Sidebar({ onClose }: SidebarProps) {
  const { lang } = useLanguage();
  const { favorites } = useFavoritesContext();
  const location = useLocation();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  // NAV_GROUP level collapse: all groups open by default
  const [groupOpen, setGroupOpen] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(NAV_GROUPS.map((g) => [g.id, true])),
  );
  const locationUrl = `${location.pathname}${location.search}`;

  React.useEffect(() => {
    const nextExpanded: Record<string, boolean> = {};

    function collectActiveAncestors(item: NavItem) {
      if (hasActiveDescendant(item, location.pathname, locationUrl)) {
        nextExpanded[item.id] = true;
      }
      item.children?.forEach(collectActiveAncestors);
    }

    NAV_GROUPS.forEach((group) => group.sections.forEach((section) => section.items.forEach(collectActiveAncestors)));
    setExpanded((current) => ({ ...current, ...nextExpanded }));
  }, [location.pathname, locationUrl]);

  function getBadgeValue(badge?: string, id?: string): number | null {
    if (!badge) return null;
    if (badge === 'scenarios-count') return scenarios.length;
    if (badge === 'favorites-count') return favorites.size > 0 ? favorites.size : null;
    if (badge === 'section-count' && id && id in sectionEntries) {
      return sectionEntries[id as SectionId].length;
    }
    return null;
  }

  function renderItem(item: NavItem, depth = 0) {
    const label = isZh ? item.labelZh : item.labelEn;
    const badgeVal = getBadgeValue(item.badge, item.id);
    const hasChildren = Boolean(item.children?.length);
    const isActive = itemMatchesLocation(item, location.pathname, locationUrl);
    const isOpen = hasChildren && Boolean(expanded[item.id]);

    return (
      <div key={item.id} className="min-w-0">
        <NavItemLink
          item={item}
          label={label}
          badgeVal={badgeVal}
          depth={depth}
          isActive={isActive}
          isOpen={isOpen}
          onToggle={hasChildren ? () => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] })) : undefined}
          onClose={onClose}
        />
        {hasChildren && isOpen && (
          <div className={clsx('mt-1 border-l border-slate-200 pl-2 dark:border-slate-800', depth === 0 ? 'ml-4' : 'ml-3')}>
            {item.children!.map((child) => renderItem(child, depth + 1))}
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

      {NAV_GROUPS.map((group, groupIndex) => {
        const isGroupOpen = groupOpen[group.id] ?? true;
        return (
          <div key={group.id} className="pb-1">
            <button
              type="button"
              onClick={() => setGroupOpen((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
              className={clsx(
                'flex w-full items-center justify-between px-3 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 select-none hover:text-slate-600 dark:hover:text-slate-400 transition-colors',
                groupIndex > 0 ? 'pt-3' : 'pt-2',
              )}
            >
              <span>{isZh ? group.labelZh : group.labelEn}</span>
              {isGroupOpen
                ? <ChevronDown size={11} className="shrink-0 opacity-60" />
                : <ChevronRight size={11} className="shrink-0 opacity-60" />
              }
            </button>
            {isGroupOpen && group.sections.map((section) => (
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
        );
      })}
    </nav>
  );
}
