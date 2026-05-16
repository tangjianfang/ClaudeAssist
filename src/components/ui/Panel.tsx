import { clsx } from 'clsx';

export interface PanelProps {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Panel({ className, children, as: Tag = 'div' }: PanelProps) {
  return (
    <Tag
      className={clsx(
        'rounded-[--radius-ca-panel] border border-[--color-ca-border-subtle]',
        'bg-[--color-ca-surface] shadow-[--shadow-ca-panel]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
