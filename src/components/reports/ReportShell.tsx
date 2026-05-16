import { clsx } from 'clsx';

interface ReportShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/** 可分享报表的外壳容器，提供统一的标题栏与内容区 */
export function ReportShell({ title, subtitle, children, className }: ReportShellProps) {
  return (
    <section
      className={clsx(
        'rounded-xl border border-[--color-ca-border-subtle]',
        'bg-[--color-ca-surface] shadow-[--shadow-ca-panel] overflow-hidden',
        className,
      )}
    >
      <div className="px-5 py-4 border-b border-[--color-ca-border-subtle]">
        <h2 className="text-sm font-semibold text-[--color-ca-text] leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[--color-ca-text-muted]">{subtitle}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
