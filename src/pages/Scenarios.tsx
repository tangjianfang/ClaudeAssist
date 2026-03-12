import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../i18n';
import { scenarios, scenarioCategories, allEntries } from '../data';
import type { Scenario, ScenarioTip, ScenarioDifficulty } from '../data/scenario-types';
import { bi } from '../data/scenario-types';
import { ComplexityBadge } from '../components/ui/ComplexityBadge';
import { CopyButton } from '../components/ui/CopyButton';

// ─── Difficulty pill ─────────────────────────────────────────────────────────
const DIFF_COLORS: Record<ScenarioDifficulty, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  intermediate: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  advanced: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

// Map scenario difficulty → CommandEntry complexity label
const DIFF_TO_COMPLEXITY: Record<ScenarioDifficulty, 'beginner' | 'intermediate' | 'advanced'> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

function DifficultyPill({ difficulty }: { difficulty: ScenarioDifficulty }) {
  const { lang } = useLanguage();
  const label: Record<ScenarioDifficulty, { en: string; 'zh-CN': string }> = {
    beginner: { en: 'Beginner', 'zh-CN': '入门' },
    intermediate: { en: 'Intermediate', 'zh-CN': '进阶' },
    advanced: { en: 'Advanced', 'zh-CN': '高级' },
  };
  return (
    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', DIFF_COLORS[difficulty])}>
      {bi(label[difficulty], lang)}
    </span>
  );
}

// ─── Tip row ──────────────────────────────────────────────────────────────────
function TipRow({ tip }: { tip: ScenarioTip }) {
  const { lang, t } = useLanguage();
  const icons = {
    tip: <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />,
    info: <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />,
  };
  const labels = {
    tip: t.scenarios.tip,
    warning: t.scenarios.warning,
    info: t.scenarios.info,
  };
  const bg = {
    tip: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40',
    warning: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40',
  };
  return (
    <div className={clsx('flex gap-2 rounded-lg border px-3 py-2 text-sm', bg[tip.type])}>
      {icons[tip.type]}
      <div>
        <span className="font-semibold mr-1">{labels[tip.type]}:</span>
        {bi(tip.text, lang)}
      </div>
    </div>
  );
}

// ─── Scenario card ────────────────────────────────────────────────────────────
function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Resolve related CommandEntry objects
  const relatedEntries = useMemo(
    () => allEntries.filter((e) => scenario.relatedCommandIds.includes(e.id)),
    [scenario.relatedCommandIds]
  );

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {bi(scenario.title, lang)}
            </h3>
            <DifficultyPill difficulty={scenario.difficulty} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {bi(scenario.description, lang)}
          </p>
        </div>
        <span className="shrink-0 mt-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-5">
          {/* Steps */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              {t.scenarios.steps}
            </h4>
            <ol className="space-y-3">
              {scenario.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  {/* Step number */}
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">
                      {bi(step.title, lang)}
                    </p>
                    {step.command && (
                      <div className="mt-1 flex items-center gap-2">
                        <code className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 text-xs font-mono px-2.5 py-1 rounded-md">
                          <Terminal size={11} className="opacity-60" />
                          {step.command}
                        </code>
                        <CopyButton text={step.command} />
                      </div>
                    )}
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {bi(step.description, lang)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Tips */}
          {scenario.tips.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                {t.scenarios.tips}
              </h4>
              <div className="space-y-2">
                {scenario.tips.map((tip, i) => (
                  <TipRow key={i} tip={tip} />
                ))}
              </div>
            </section>
          )}

          {/* Related commands */}
          {relatedEntries.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                {t.scenarios.relatedCommands}
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    to={`/${entry.section}?q=${encodeURIComponent(entry.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <CheckCircle2 size={11} className="opacity-60" />
                    {entry.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
type ActiveDiff = ScenarioDifficulty | 'all';

export function ScenariosPage() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDiff, setActiveDiff] = useState<ActiveDiff>('all');

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {
      const catOk = activeCategory === 'all' || s.category === activeCategory;
      const diffOk = activeDiff === 'all' || s.difficulty === activeDiff;
      return catOk && diffOk;
    });
  }, [activeCategory, activeDiff]);

  const difficulties: Array<{ id: ActiveDiff; label: { en: string; 'zh-CN': string } }> = [
    { id: 'all', label: { en: 'All', 'zh-CN': '全部' } },
    { id: 'beginner', label: { en: 'Beginner', 'zh-CN': '入门' } },
    { id: 'intermediate', label: { en: 'Intermediate', 'zh-CN': '进阶' } },
    { id: 'advanced', label: { en: 'Advanced', 'zh-CN': '高级' } },
  ];

  function pillClass(active: boolean) {
    return clsx(
      'px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors border',
      active
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          {t.scenarios.pageTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.scenarios.pageSubtitle}
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Category filter */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {t.scenarios.category}
          </p>
          <div className="flex flex-wrap gap-2">
            {scenarioCategories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={pillClass(activeCategory === id)}
              >
                {bi(label, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {t.scenarios.difficulty}
          </p>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveDiff(id)}
                className={pillClass(activeDiff === id)}
              >
                {bi(label, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">{t.noResults}</p>
        ) : (
          filtered.map((s) => <ScenarioCard key={s.id} scenario={s} />)
        )}
      </div>
    </div>
  );
}
