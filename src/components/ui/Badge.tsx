import { clsx } from 'clsx';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  success:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  warning:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  danger:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  muted:    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
