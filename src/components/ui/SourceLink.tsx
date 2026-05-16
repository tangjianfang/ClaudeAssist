import { ExternalLink } from 'lucide-react';

export interface SourceLinkProps {
  label: string;
  url: string;
  checkedAt?: string;
}

export function SourceLink({ label, url, checkedAt }: SourceLinkProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 hover:text-[--color-ca-accent] transition-colors"
      >
        {label}
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
      {checkedAt && (
        <span className="text-slate-400 dark:text-slate-500">· 核验于 {checkedAt}</span>
      )}
    </span>
  );
}
