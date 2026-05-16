import { clsx } from 'clsx';

/**
 * MetricCell — 单个指标展示单元。
 * 用于详情页和对比表格的指标行。
 */
export interface MetricCellProps {
  label: string;
  value: React.ReactNode;
  /** 辅助说明文字 */
  hint?: string;
  /** 值的语义色：positive / warning / neutral */
  tone?: 'positive' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

const TONE_CLASS = {
  positive: 'text-emerald-700 dark:text-emerald-300',
  warning: 'text-amber-700 dark:text-amber-300',
  danger: 'text-red-600 dark:text-red-400',
  neutral: 'text-slate-700 dark:text-slate-200',
};

export function MetricCell({ label, value, hint, tone = 'neutral', className }: MetricCellProps) {
  return (
    <div className={clsx('flex flex-col gap-0.5', className)}>
      <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={clsx('text-sm font-semibold', TONE_CLASS[tone])}>
        {value ?? <span className="text-slate-400 dark:text-slate-500 font-normal">—</span>}
      </dd>
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

/** 一行多格的 MetricCell 容器，自动 responsive grid */
export function MetricRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <dl className={clsx('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {children}
    </dl>
  );
}
