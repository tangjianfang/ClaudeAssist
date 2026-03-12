import { useLanguage } from '../i18n';
import { CommandCard } from '../components/CommandCard';
import type { CommandEntry } from '../data/types';

interface SearchResultsProps {
  results: CommandEntry[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const { t } = useLanguage();

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
        <p className="text-slate-400 font-medium">{t.noResults}</p>
        <p className="text-sm text-slate-400">{t.noResultsHint}</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {t.filter.filterResults(results.length)}{' '}
        {query && (
          <span>
            {' '}for <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span>
          </span>
        )}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {results.map((entry) => (
          <CommandCard
            key={entry.id}
            entry={entry}
            activeTag={null}
            onTagClick={() => undefined}
          />
        ))}
      </div>
    </div>
  );
}
