import { clsx } from 'clsx';
import { useLanguage } from '../i18n';
import type { Complexity } from '../data/types';
import type { FilterState } from '../hooks/useFilter';

const COMPLEXITIES: Array<Complexity | 'all'> = ['all', 'beginner', 'intermediate', 'advanced'];

interface FilterStripProps {
  filter: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
  availableTags: string[];
  resultCount: number;
}

export function FilterStrip({ filter, onFilterChange, availableTags, resultCount }: FilterStripProps) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 py-2 space-y-2">
      {/* Complexity pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-400 shrink-0">{t.filter.complexity}:</span>
        {COMPLEXITIES.map((c) => (
          <button
            key={c}
            onClick={() => onFilterChange({ complexity: c })}
            className={clsx(
              'rounded-full px-3 py-0.5 text-xs font-medium transition-colors',
              filter.complexity === c
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-700'
            )}
          >
            {c === 'all' ? t.all : { beginner: t.beginner, intermediate: t.intermediate, advanced: t.advanced }[c]}
          </button>
        ))}

        <span className="ml-auto text-xs text-slate-400">
          {t.filter.filterResults(resultCount)}
        </span>
      </div>

      {/* Tag cloud */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 shrink-0">{t.filter.tags}:</span>
          {availableTags.slice(0, 20).map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterChange({ tag: filter.tag === tag ? null : tag })}
              className={clsx(
                'rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
                filter.tag === tag
                  ? 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:ring-indigo-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              )}
            >
              #{tag}
            </button>
          ))}
          {(filter.complexity !== 'all' || filter.tag) && (
            <button
              onClick={() => onFilterChange({ complexity: 'all', tag: null })}
              className="ml-1 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
