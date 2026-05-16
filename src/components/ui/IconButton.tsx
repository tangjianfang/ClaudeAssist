import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'p-1', md: 'p-2', lg: 'p-3' };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg',
        'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
        'dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800',
        'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
