import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { allEntries, sectionEntries } from '../data';
import { CommandCard } from '../components/CommandCard';
import { DecisionWorkbench } from '../components/decision/DecisionWorkbench';
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
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 space-y-10">
      <DecisionWorkbench />

      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        参考资料库仍保留 {allEntries.length} 条 Claude Code 命令、flag、设置与场景记录；它现在服务于决策工作台，而不是作为唯一入口。版本：{__APP_VERSION__} · 更新：{__APP_UPDATED_AT__}
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

