import { X } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

/**
 * CompareTray — 受控对比浮层外壳。
 * selectedIds 和 onClear 由父组件持有，组件本身不维护选择状态，
 * 方便 URL 状态恢复。
 */
export interface CompareTrayProps {
  /** 已选中的实体名称列表（仅用于展示标签） */
  labels: string[];
  /** 当前已选数量 */
  count: number;
  /** 最大可选数量 */
  max?: number;
  /** 标题文字 */
  title?: string;
  /** 清空回调 */
  onClear: () => void;
  /** 对比内容区（图表 + 表格等） */
  children: ReactNode;
  className?: string;
}

export function CompareTray({
  labels,
  count,
  max = 4,
  title = '对比',
  onClear,
  children,
  className,
}: CompareTrayProps) {
  if (count === 0) return null;

  return (
    <div className={clsx('fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white dark:from-slate-900 via-white dark:via-slate-900 to-white/0 dark:to-slate-900/0 pt-4 pb-4', className)}>
      <div className="px-3 sm:px-6 max-w-screen-2xl mx-auto">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              {title} ({count}/{max})
            </h2>
            <div className="flex flex-wrap gap-1 flex-1 min-w-0 justify-center">
              {labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-300"
                >
                  {label}
                </span>
              ))}
            </div>
            <button
              onClick={onClear}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors shrink-0"
              aria-label="清空对比"
            >
              <X size={16} />
            </button>
          </div>
          {/* Content */}
          <div className="max-h-[50vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
