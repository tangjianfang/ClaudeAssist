import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Share2 } from 'lucide-react';
import { CopyButton } from './ui/CopyButton';
import { ComplexityBadge } from './ui/ComplexityBadge';
import { TagChip } from './ui/TagChip';
import { useLanguage } from '../i18n';
import type { CommandEntry } from '../data/types';

interface CommandCardProps {
  entry: CommandEntry;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

export function CommandCard({ entry, activeTag, onTagClick }: CommandCardProps) {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  // Command descriptions only exist for en / zh-CN; fall back to en for all others
  const content = entry.i18n[lang === 'zh-CN' ? 'zh-CN' : 'en'];

  function handleShare() {
    const url = new URL(window.location.href);
    url.hash = `/${entry.section}?q=${encodeURIComponent(entry.name)}`;
    navigator.clipboard.writeText(url.toString()).catch(() => undefined);
  }

  return (
    <div
      className={`group relative rounded-xl border bg-white dark:bg-slate-800/60 dark:border-slate-700/60 transition-shadow hover:shadow-md ${
        entry.deprecated ? 'opacity-60 border-dashed border-slate-300 dark:border-slate-600' : 'border-slate-200'
      }`}
    >
      {/* ── Header ── */}
      <div className="flex items-start gap-3 p-4">
        {/* Syntax chip */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <code className="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 select-all">
              {entry.syntax}
            </code>
            {entry.deprecated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800">
                <AlertTriangle size={10} />
                {t.deprecated}
              </span>
            )}
            <ComplexityBadge level={entry.complexity} />
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Share + Copy buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <CopyButton text={entry.syntax} />
          <button
            onClick={handleShare}
            title={t.shareCommand}
            className="inline-flex items-center rounded px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Share2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Tags ── */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {entry.tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => onTagClick(tag)}
            />
          ))}
        </div>
      )}

      {/* ── Expandable Examples / Aliases / Notes ── */}
      {(entry.examples.length > 0 || entry.aliases || content.notes) && (
        <>
          <button
            onClick={() => setExpanded((x) => !x)}
            className="w-full flex items-center gap-1 px-4 py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border-t border-slate-100 dark:border-slate-700/50 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? t.examples : t.examples}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-3">
              {/* Examples */}
              {entry.examples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    {t.examples}
                  </p>
                  <div className="space-y-1.5">
                    {entry.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 group/ex">
                        <code className="flex-1 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto select-all">
                          {ex}
                        </code>
                        <CopyButton text={ex} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aliases */}
              {entry.aliases && entry.aliases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">
                    {t.aliases}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.aliases.map((alias) => (
                      <code
                        key={alias}
                        className="rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-mono text-slate-600 dark:text-slate-300"
                      >
                        {alias}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {content.notes && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 px-3 py-2">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5 uppercase tracking-wide">
                    {t.notes}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">{content.notes}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
