import { clsx } from 'clsx';

export interface PanelProps {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  /** 内边距 class；默认 p-5 */
  padding?: string;
}

export function Panel({ className, children, as: Tag = 'div', padding = 'p-5' }: PanelProps) {
  return (
    <Tag
      className={clsx(
        'rounded-[--radius-ca-panel] border border-[--color-ca-border-subtle]',
        'bg-[--color-ca-surface] shadow-[--shadow-ca-panel]',
        padding,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
