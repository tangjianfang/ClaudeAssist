import * as RadixPopover from '@radix-ui/react-popover';
import { clsx } from 'clsx';

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;

export function PopoverContent({
  className,
  children,
  align = 'center',
  sideOffset = 8,
}: {
  className?: string;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={sideOffset}
        className={clsx(
          'z-50 rounded-xl border border-[--color-ca-border-subtle]',
          'bg-[--color-ca-surface] shadow-lg p-4',
          'animate-in fade-in-0 zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
      >
        {children}
        <RadixPopover.Arrow className="fill-[--color-ca-border-subtle]" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}
