import { Star } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useFavoritesContext } from '../context/FavoritesContext';
import { allEntries } from '../data';
import { CommandCard } from '../components/CommandCard';
import { useState } from 'react';
import type { SectionId } from '../data/types';

export function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites } = useFavoritesContext();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const favorited = allEntries.filter((e) => favorites.has(e.id));
  const filtered = activeTag
    ? favorited.filter((e) => e.tags.includes(activeTag))
    : favorited;

  // Group by section
  const grouped = filtered.reduce<Record<string, typeof filtered>>(
    (acc, entry) => {
      const key = entry.section as SectionId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {},
  );

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Star size={22} className="text-amber-400" fill="currentColor" />
          {t.sections['favorites']}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.sectionDescriptions['favorites']}
        </p>
      </div>

      {favorited.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Star
            size={48}
            className="mb-4 text-slate-200 dark:text-slate-700"
            strokeWidth={1.2}
          />
          <p className="text-lg font-semibold text-slate-400 dark:text-slate-500">
            {t.favoritesEmpty}
          </p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 max-w-xs">
            {t.favoritesEmptyHint}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([section, entries]) => (
            <div key={section}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t.sections[section as SectionId] ?? section}
              </h2>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <CommandCard
                    key={entry.id}
                    entry={entry}
                    activeTag={activeTag}
                    onTagClick={(tag) =>
                      setActiveTag((prev) => (prev === tag ? null : tag))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
