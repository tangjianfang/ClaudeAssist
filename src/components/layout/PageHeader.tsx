import { clsx } from 'clsx';
import type { ReactNode } from 'react';

/**
 * PageHeader — 统一页面标题栏。
 * 用于所有新增页面，避免重复 hero gradients。
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  /** 右侧操作区（按钮、SegmentedControl 等） */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={clsx('border-b border-slate-100 dark:border-slate-800 pb-5 mb-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
