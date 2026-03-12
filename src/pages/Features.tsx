import { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';
import { features, FEATURE_CATEGORIES } from '../data/features';
import type { FeatureCategory } from '../data/features';
import { clsx } from 'clsx';

const CATEGORY_COLORS: Record<FeatureCategory, string> = {
  ai:         'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  ide:        'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  automation: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  security:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  workflow:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  context:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  mcp:        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

export function FeaturesPage() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FeatureCategory | 'all'>('all');

  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  const filtered =
    activeCategory === 'all'
      ? features
      : features.filter((f) => f.category === activeCategory);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Sparkles size={22} className="text-indigo-500" />
          {t.features.pageTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.features.pageSubtitle}
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FEATURE_CATEGORIES.map(({ id, labelEn, labelZh }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id as FeatureCategory | 'all')}
            className={clsx(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors border',
              activeCategory === id
                ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
            )}
          >
            {isZh ? labelZh : labelEn}
          </button>
        ))}
      </div>

      {/* Feature cards */}
      <div className="space-y-4">
        {filtered.map((feature) => {
          const catEntry = FEATURE_CATEGORIES.find((c) => c.id === feature.category);
          return (
            <div
              key={feature.id}
              className="relative rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-5 hover:shadow-md transition-shadow"
            >
              {/* New badge */}
              {feature.highlight && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  <Sparkles size={10} />
                  {t.newBadge}
                </span>
              )}

              <div className="flex flex-wrap items-start gap-2 mb-2">
                {/* Category chip */}
                <span
                  className={clsx(
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    CATEGORY_COLORS[feature.category],
                  )}
                >
                  {catEntry ? (isZh ? catEntry.labelZh : catEntry.labelEn) : feature.category}
                </span>
                {/* Version/date */}
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {feature.addedIn}
                </span>
              </div>

              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 pr-12">
                {isZh ? feature.titleZh : feature.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isZh ? feature.summaryZh : feature.summary}
              </p>

              {feature.docsUrl && (
                <a
                  href={feature.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {t.features.learnMore}
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
