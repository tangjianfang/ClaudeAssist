import { clsx } from 'clsx';

interface TagChipProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagChip({ tag, active, onClick, className }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
        active
          ? 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:ring-indigo-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-700',
        className
      )}
    >
      #{tag}
    </button>
  );
}
