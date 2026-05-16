import { clsx } from 'clsx';

/** 操作条：水平排列一组操作按钮/控件，两端对齐支持 start/end 插槽 */
export function Toolbar({
  start,
  end,
  className,
}: {
  start?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">{start}</div>
      <div className="flex items-center gap-2">{end}</div>
    </div>
  );
}
