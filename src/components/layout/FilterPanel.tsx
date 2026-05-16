import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

/**
 * FilterPanel — 侧边筛选面板外壳。
 * 在移动端可折叠，lg 及以上始终展示。
 */
export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterPanel({ open, onClose, children, className }: FilterPanelProps) {
  return (
    <aside
      className={clsx(
        'lg:sticky lg:top-20 self-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60',
        'transition-all duration-300',
        open ? 'block' : 'hidden lg:block',
        className,
      )}
    >
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          <Filter size={16} className="text-indigo-500" />
          筛选
        </h2>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          aria-label="关闭筛选"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">{children}</div>
    </aside>
  );
}
