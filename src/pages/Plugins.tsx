import { useState } from 'react';
import {
  ExternalLink, Puzzle, Star, ChevronDown, ChevronUp,
  Terminal, Users, Copy, Check, BarChart2, Lightbulb,
  ShieldCheck, Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../i18n';
import {
  plugins, PLUGIN_CATEGORIES,
  comparisonDimensions, comparisonUseCases,
} from '../data/plugins';
import type { Plugin, PluginInstallStep, PluginCategory, PickType } from '../data/plugins';

// ─── Category color map ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<PluginCategory, string> = {
  official:     'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  productivity: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  security:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  testing:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  learning:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  utility:      'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

// ─── Pick badge colors ────────────────────────────────────────────────────────
const PICK_LABEL: Record<PickType, { en: string; zh: string; cls: string }> = {
  official: { en: 'Official', zh: '官方',     cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  ecc:      { en: 'ECC',      zh: 'ECC',      cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  both:     { en: 'Both',     zh: '均可',     cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
};

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div className="relative group mt-2">
      <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 text-slate-100 text-xs px-4 py-3 leading-relaxed whitespace-pre">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-slate-700 hover:bg-slate-600 px-2 py-1 text-xs text-slate-200 flex items-center gap-1"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

// ─── Install accordion ────────────────────────────────────────────────────────
function InstallGuide({ steps, isZh }: { steps: PluginInstallStep[]; isZh: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Terminal size={15} className="text-indigo-500" />
          {t.plugins.installGuide}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 py-4 space-y-5 bg-white dark:bg-slate-900/40">
          {steps.map((step, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isZh ? step.stepZh : step.stepEn}
              </p>
              {step.code && <CodeBlock code={step.code} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Plugin groups (for official marketplace) ─────────────────────────────────
function PluginGroupsPanel({ plugin, isZh }: { plugin: Plugin; isZh: boolean }) {
  const { t } = useLanguage();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  if (!plugin.pluginGroups?.length) return null;

  function toggle(id: string) {
    setOpenGroups((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
        <Layers size={13} />
        {t.plugins.pluginGroups}
      </h3>
      <div className="space-y-2">
        {plugin.pluginGroups.map((group) => {
          const key = group.groupIdEn;
          const isOpen = openGroups.has(key);
          return (
            <div key={key} className="border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <span>{group.icon}</span>
                  {isZh ? group.groupIdZh : group.groupIdEn}
                  <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({group.items.length})</span>
                </span>
                {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-slate-900/30">
                  {group.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-2">
                      <code className="shrink-0 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 whitespace-nowrap">
                        {item.name}
                      </code>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isZh ? item.descZh : item.descEn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Plugin card ──────────────────────────────────────────────────────────────
function PluginCard({ plugin }: { plugin: Plugin }) {
  const { lang, t } = useLanguage();
  const [agentsOpen, setAgentsOpen] = useState(false);
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const catEntry = PLUGIN_CATEGORIES.find((c) => c.id === plugin.category);
  const hasAgents = plugin.agents && plugin.agents.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plugin.name}</h2>
              {plugin.highlight && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  <Star size={10} />{t.plugins.featured}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>by {plugin.author}</span>
              <span>·</span>
              <span>{plugin.version}</span>
              {catEntry && (
                <>
                  <span>·</span>
                  <span className={clsx('rounded-full px-2 py-0.5 font-medium', CATEGORY_COLORS[plugin.category])}>
                    {isZh ? catEntry.labelZh : catEntry.labelEn}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={plugin.repoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ExternalLink size={12} />
              {plugin.category === 'official' ? 'Docs' : 'GitHub'}
            </a>
            {plugin.docsUrl && plugin.category !== 'official' && (
              <a
                href={plugin.docsUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-medium text-white transition-colors"
              >
                <ExternalLink size={12} />{t.plugins.docs}
              </a>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isZh ? plugin.longDescZh : plugin.longDescEn}
        </p>
        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {plugin.stats.map((stat) => (
            <div key={stat.labelEn} className="text-center rounded-lg bg-slate-50 dark:bg-slate-900/40 px-2 py-2">
              <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{isZh ? stat.labelZh : stat.labelEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
          {t.plugins.keyFeatures}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plugin.highlights.map((hl) => (
            <div key={hl.titleEn} className="flex gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 px-4 py-3">
              <span className="text-xl shrink-0 mt-0.5">{hl.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                  {isZh ? hl.titleZh : hl.titleEn}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isZh ? hl.descZh : hl.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plugin groups (official only) */}
      <PluginGroupsPanel plugin={plugin} isZh={isZh} />

      {/* Key commands */}
      {plugin.keyCommands && plugin.keyCommands.length > 0 && (
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
            {t.plugins.keyCommands}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plugin.keyCommands.map((cmd) => (
              <div key={cmd.name} className="flex items-start gap-2">
                <code className="shrink-0 rounded bg-slate-100 dark:bg-slate-900/60 px-2 py-0.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 whitespace-nowrap">
                  {cmd.name}
                </code>
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isZh ? cmd.descZh : cmd.descEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-agents (ECC only) */}
      {hasAgents && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <button
            onClick={() => setAgentsOpen((o) => !o)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Users size={13} />
              {t.plugins.agents} ({plugin.agents!.length})
            </span>
            {agentsOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </button>
          {agentsOpen && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plugin.agents!.map((agent) => (
                <div key={agent.name} className="flex items-start gap-2">
                  <code className="shrink-0 rounded bg-slate-100 dark:bg-slate-900/60 px-2 py-0.5 text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                    {agent.name}
                  </code>
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isZh ? agent.descZh : agent.descEn}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Install guide */}
      <div className="px-6 py-5">
        <InstallGuide steps={plugin.installSteps} isZh={isZh} />
      </div>

      {/* Tags */}
      <div className="px-6 pb-5 flex flex-wrap gap-1.5">
        {plugin.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-700/50 px-2.5 py-0.5 text-xs text-slate-500 dark:text-slate-400">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function ComparisonTable({ isZh }: { isZh: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart2 size={16} className="text-indigo-500" />
          {t.plugins.comparisonTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.plugins.comparisonSubtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/3">
                {t.plugins.dimension}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-violet-500" />
                  {t.plugins.officialLabel}
                </span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/3">
                <span className="flex items-center gap-1.5">
                  <Star size={12} className="text-indigo-500" />
                  ECC
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonDimensions.map((row, i) => (
              <tr
                key={row.dimensionEn}
                className={clsx(
                  'border-b border-slate-50 dark:border-slate-800/50',
                  i % 2 === 0 ? 'bg-white dark:bg-slate-900/20' : 'bg-slate-50/50 dark:bg-slate-800/20',
                )}
              >
                <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300 text-sm">
                  {isZh ? row.dimensionZh : row.dimensionEn}
                </td>
                <td className={clsx(
                  'px-4 py-3 text-sm',
                  row.better === 'official' || row.better === 'both'
                    ? 'text-slate-800 dark:text-slate-200 font-medium'
                    : 'text-slate-400 dark:text-slate-500',
                )}>
                  {row.better === 'official' && <span className="mr-1 text-violet-500">✦</span>}
                  {row.better === 'both' && <span className="mr-1 text-emerald-500">✦</span>}
                  {row.official}
                </td>
                <td className={clsx(
                  'px-4 py-3 text-sm',
                  row.better === 'ecc' || row.better === 'both'
                    ? 'text-slate-800 dark:text-slate-200 font-medium'
                    : 'text-slate-400 dark:text-slate-500',
                )}>
                  {row.better === 'ecc' && <span className="mr-1 text-indigo-500">✦</span>}
                  {row.better === 'both' && <span className="mr-1 text-emerald-500">✦</span>}
                  {row.ecc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="text-violet-500">✦</span> {t.plugins.legendOfficial}</span>
        <span className="flex items-center gap-1"><span className="text-indigo-500">✦</span> {t.plugins.legendEcc}</span>
        <span className="flex items-center gap-1"><span className="text-emerald-500">✦</span> {t.plugins.legendBoth}</span>
      </div>
    </div>
  );
}

// ─── Use-case cards ───────────────────────────────────────────────────────────
function UseCaseGrid({ isZh }: { isZh: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/50">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          {t.plugins.useCasesTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.plugins.useCasesSubtitle}</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {comparisonUseCases.map((uc) => {
          const pick = PICK_LABEL[uc.pick];
          return (
            <div
              key={uc.titleEn}
              className="flex gap-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900/30 px-4 py-3"
            >
              <span className="text-2xl shrink-0 mt-0.5">{uc.icon}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {isZh ? uc.titleZh : uc.titleEn}
                  </span>
                  <span className={clsx('rounded-full px-2 py-0.5 text-xs font-bold shrink-0', pick.cls)}>
                    {isZh ? pick.zh : pick.en}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isZh ? uc.descZh : uc.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab nav ──────────────────────────────────────────────────────────────────
type Tab = 'plugins' | 'compare';

// ─── Page ─────────────────────────────────────────────────────────────────────
export function PluginsPage() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<PluginCategory | 'all'>('all');
  const [tab, setTab] = useState<Tab>('plugins');
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  const filtered =
    activeCategory === 'all'
      ? plugins
      : plugins.filter((p) => p.category === activeCategory);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Puzzle size={22} className="text-indigo-500" />
          {t.plugins.pageTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.plugins.pageSubtitle}</p>
      </div>

      {/* Tab strip */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {([['plugins', t.plugins.tabPlugins], ['compare', t.plugins.tabCompare]] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'plugins' && (
        <>
          {/* Category filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {PLUGIN_CATEGORIES.map(({ id, labelEn, labelZh }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id as PluginCategory | 'all')}
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

          {/* Plugin cards */}
          <div className="space-y-6">
            {filtered.map((plugin) => <PluginCard key={plugin.id} plugin={plugin} />)}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">{t.noResults}</div>
            )}
          </div>
        </>
      )}

      {tab === 'compare' && (
        <div className="space-y-6">
          <ComparisonTable isZh={isZh} />
          <UseCaseGrid isZh={isZh} />
        </div>
      )}
    </div>
  );
}
