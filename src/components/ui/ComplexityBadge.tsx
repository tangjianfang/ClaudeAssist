import { clsx } from 'clsx';
import { useLanguage } from '../../i18n';
import type { Complexity } from '../../data/types';

interface ComplexityBadgeProps {
  level: Complexity;
  className?: string;
}

const colors: Record<Complexity, string> = {
  beginner:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800',
  intermediate:
    'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800',
  advanced:
    'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-800',
};

export function ComplexityBadge({ level, className }: ComplexityBadgeProps) {
  const { t } = useLanguage();
  const label = { beginner: t.beginner, intermediate: t.intermediate, advanced: t.advanced }[level];
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        colors[level],
        className
      )}
    >
      {label}
    </span>
  );
}
