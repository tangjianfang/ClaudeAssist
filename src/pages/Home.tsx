import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../i18n';
import { allEntries, sectionEntries } from '../data';
import { CommandCard } from '../components/CommandCard';
import type { SectionId } from '../data/types';

const BEGINNER_PICKS: Array<{ section: SectionId; id: string }> = [
  { section: 'slash-commands', id: 'init' },
  { section: 'slash-commands', id: 'help' },
  { section: 'slash-commands', id: 'clear' },
  { section: 'slash-commands', id: 'compact' },
  { section: 'cli-flags', id: 'flag-print' },
  { section: 'cli-flags', id: 'flag-model' },
  { section: 'shortcuts', id: 'shortcut-ctrl-c' },
  { section: 'shortcuts', id: 'shortcut-backslash-enter' },
];

export function HomePage() {
  const { t } = useLanguage();

  const beginnerCards = BEGINNER_PICKS.map(({ section, id }) =>
    sectionEntries[section].find((e) => e.id === id)
  ).filter(Boolean) as (typeof allEntries)[number][];

  const sectionIds = Object.keys(sectionEntries) as SectionId[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3 pt-4 pb-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white whitespace-pre-line leading-tight">
          {t.home.heroTitle}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.home.heroSubtitle}
        </p>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
          {t.home.stats(allEntries.length)}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            to="/slash-commands"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {t.home.getStarted}
            <ArrowRight size={14} />
          </Link>
          <a
            href="https://code.claude.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t.openDocs}
            <Globe size={14} />
          </a>
        </div>
      </section>

      {/* Section overview */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          {t.home.viewAll}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {sectionIds.map((id) => (
            <Link
              key={id}
              to={`/${id}`}
              className="flex flex-col gap-1 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 p-4 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm transition-all"
            >
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {sectionEntries[id].length}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t.sections[id]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Beginner picks */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.home.beginnerGuide}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.home.beginnerGuideDesc}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beginnerCards.map((entry) => (
            <CommandCard
              key={entry.id}
              entry={entry}
              activeTag={null}
              onTagClick={() => undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}


