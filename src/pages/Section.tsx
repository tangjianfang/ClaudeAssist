import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { sectionEntries } from '../data';
import { CommandCard } from '../components/CommandCard';
import { FilterStrip } from '../components/FilterStrip';
import { useFilter, type FilterState } from '../hooks/useFilter';
import { useSearch } from '../hooks/useSearch';
import type { SectionId } from '../data/types';

interface SectionPageProps {
  globalQuery: string;
}

export function SectionPage({ globalQuery }: SectionPageProps) {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { lang, t } = useLanguage();

  const [filter, setFilter] = useState<FilterState>({
    section: (sectionId as SectionId) ?? 'all',
    complexity: 'all',
    tag: null,
  });

  // Update section when route changes
  const effectiveSection = (sectionId as SectionId) ?? 'all';
  const effectiveFilter: FilterState = { ...filter, section: effectiveSection };

  // Search across all entries, then filter to this section
  const searchResults = useSearch(globalQuery, lang);
  const filtered = useFilter(searchResults, effectiveFilter);

  // Group by subCategory
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((e) => {
      const key = e.subCategory;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [filtered]);

  // Build tag cloud from current section entries
  const availableTags = useMemo(() => {
    const base = sectionEntries[effectiveSection] ?? [];
    return Array.from(new Set(base.flatMap((e) => e.tags))).sort();
  }, [effectiveSection]);

  function handleFilterChange(partial: Partial<FilterState>) {
    setFilter((prev) => ({ ...prev, ...partial }));
  }

  if (!sectionId || !sectionEntries[sectionId as SectionId]) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Section not found.
      </div>
    );
  }

  const sectionLabel = t.sections[effectiveSection];
  const sectionDescription = t.sectionDescriptions[effectiveSection];

  return (
    <div className="flex flex-col min-h-0">
      {/* Section header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{sectionLabel}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sectionDescription}</p>
      </div>

      {/* Filter strip */}
      <FilterStrip
        filter={effectiveFilter}
        onFilterChange={handleFilterChange}
        availableTags={availableTags}
        resultCount={filtered.length}
      />

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <p className="text-slate-400 font-medium">{t.noResults}</p>
            <p className="text-sm text-slate-400">{t.noResultsHint}</p>
            <button
              onClick={() => handleFilterChange({ complexity: 'all', tag: null })}
              className="mt-2 text-sm text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          Array.from(groups.entries()).map(([subCat, entries]) => (
            <section key={subCat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">
                {subCat}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {entries.map((entry) => (
                  <CommandCard
                    key={entry.id}
                    entry={entry}
                    activeTag={filter.tag}
                    onTagClick={(tag) =>
                      handleFilterChange({ tag: filter.tag === tag ? null : tag })
                    }
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
