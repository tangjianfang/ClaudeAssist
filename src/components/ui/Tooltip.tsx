import * as RadixTooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';

export const TooltipProvider = RadixTooltip.Provider;

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}) {
  return (
    <RadixTooltip.Root delayDuration={300}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={clsx(
            'z-50 max-w-xs rounded-lg px-3 py-1.5 text-xs font-medium shadow-md',
            'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900',
            'animate-in fade-in-0 zoom-in-95',
            className,
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
