import * as RadixTabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

export const Tabs = RadixTabs.Root;

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <RadixTabs.List
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1',
        className,
      )}
    >
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
        'text-slate-600 dark:text-slate-400',
        'data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
        'dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100',
        'transition-all duration-150',
        className,
      )}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <RadixTabs.Content value={value} className={clsx('focus:outline-none', className)}>
      {children}
    </RadixTabs.Content>
  );
}
