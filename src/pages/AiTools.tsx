import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CircleAlert, CircleCheck, Filter, Search, Terminal } from 'lucide-react';
import { clsx } from 'clsx';
import { getToolProfilePreview, getToolWorkbenchCandidates } from '../data/tools/index';
import type { ToolDecisionFit, ToolWorkbenchCandidate } from '../data/tools/index';
import { getDecisionScenarioIds, getScenarioRecommendation } from '../data/decision-scenarios';
import type { DecisionScenarioId } from '../data/decision-scenarios';
import { DATA_STORE } from '../data/ai-ecosystem';
import { Panel } from '../components/ui/Panel';
import { SourceLink } from '../components/ui/SourceLink';
import { StatusBadge } from '../components/ui/StatusBadge';

type ScenarioFilter = DecisionScenarioId | 'all';
type ConstraintFilter = 'all' | 'china-accessible' | 'low-cost' | 'overseas-frontier';

const scenarioOptions: Array<{ id: ScenarioFilter; label: string; description: string }> = [
  ...getDecisionScenarioIds().map((id) => {
    const scenario = getScenarioRecommendation(id);
    return { id, label: scenario.shortTitle, description: scenario.description };
  }),
  { id: 'all', label: '全部工具 profile', description: '浏览所有工具，但仍按决策摘要展示。' },
];

const constraintOptions: Array<{ id: ConstraintFilter; label: string }> = [
  { id: 'all', label: '全部约束' },
  { id: 'china-accessible', label: '国内可用' },
  { id: 'low-cost', label: '低成本' },
  { id: 'overseas-frontier', label: '海外前沿能力' },
];

const fitLabels: Record<ToolDecisionFit, string> = {
  primary: '首选',
  alternative: '备选',
  avoid: '不作为默认',
  neutral: '候选',
};

export function AiToolsPage() {
  const [scenario, setScenario] = useState<ScenarioFilter>('china-low-cost-coding');
  const [constraint, setConstraint] = useState<ConstraintFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [childPagesExpanded, setChildPagesExpanded] = useState(true);

  const candidates = useMemo(() => getToolWorkbenchCandidates({
    scenarioId: scenario === 'all' ? undefined : scenario,
    query,
    chinaAccessible: constraint === 'china-accessible' ? true : constraint === 'overseas-frontier' ? false : undefined,
    costTier: constraint === 'low-cost' ? 'low' : undefined,
  }), [constraint, query, scenario]);

  const selectedCandidate = candidates.find((candidate) => candidate.tool.id === selectedToolId) ?? candidates[0];
  const preview = selectedCandidate ? getToolProfilePreview(selectedCandidate.tool.id) : null;
  const selectedToolCombinations = useMemo(() => {
    if (!preview) return [];
    const toolName = preview.tool.name.toLowerCase();

    return DATA_STORE.toolCombinations.filter((combo) => {
      const comboTool = combo.tool.toLowerCase();
      return comboTool.includes(toolName) || toolName.includes(comboTool);
    });
  }, [preview]);
  const combinationToolFilter = selectedToolCombinations[0]?.tool ?? preview?.tool.name ?? '';

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-8 max-w-screen-2xl mx-auto space-y-5">
      <header className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          AI Coding Tools
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              从场景约束选择工具，而不是浏览卡片墙
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Claude Code 现在是 AI Coding Tools 的第一个工具 profile；同级还有 OpenCode、Gemini CLI、GitHub Copilot CLI 等候选工具。
            </p>
          </div>
          <Link
            to="/tools/claude-code"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            查看 Claude Code profile
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_360px] gap-4">
        <Panel className="space-y-5" padding="p-4">
          <section>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Filter size={15} className="text-slate-500" />
              场景与约束
            </div>
            <div className="mt-3 space-y-2">
              {scenarioOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setScenario(option.id);
                    setSelectedToolId(null);
                  }}
                  className={clsx(
                    'w-full rounded-lg border px-3 py-3 text-left transition-colors',
                    scenario === option.id
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
                  )}
                >
                  <span className="block text-sm font-bold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{option.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              搜索工具
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <Search size={15} className="text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="OpenCode / Claude / CLI"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              约束
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {constraintOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setConstraint(option.id);
                    setSelectedToolId(null);
                  }}
                  className={clsx(
                    'rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors',
                    constraint === option.id
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        </Panel>

        <section className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">候选工具</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">{candidates.length} 个结果</span>
          </div>

          {candidates.length === 0 ? (
            <Panel className="text-sm text-slate-500 dark:text-slate-400">当前约束下没有匹配工具。</Panel>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <CandidateRow
                  key={`${candidate.tool.id}-${candidate.decisionFit}`}
                  candidate={candidate}
                  selected={candidate.tool.id === selectedCandidate?.tool.id}
                  onSelect={() => setSelectedToolId(candidate.tool.id)}
                />
              ))}
            </div>
          )}
        </section>

        {preview && selectedCandidate && (
          <Panel className="space-y-5 xl:sticky xl:top-4 xl:self-start" padding="p-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Profile Preview</p>
                  <h2 className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">{preview.tool.name}</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{preview.tool.vendor} · {fitLabels[selectedCandidate.decisionFit]}</p>
                </div>
                <StatusBadge status={preview.tool.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{preview.fitSummary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Metric label="价格" value={preview.tool.pricing.plan} />
              <Metric label="国内可用" value={preview.tool.china.accessible ? '可用' : '受限'} tone={preview.tool.china.accessible ? 'positive' : 'warning'} />
              <Metric label="推荐模型" value={selectedCandidate.recommendedModel?.name ?? preview.recommendedModels[0] ?? '待确认'} />
              <Metric label="安装入口" value={preview.installation} />
            </div>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">能力评分</h3>
              <div className="mt-2 space-y-1.5">
                {(
                  [
                    { key: 'codeCompletion', label: '代码补全' },
                    { key: 'codeGeneration', label: '代码生成' },
                    { key: 'efficiency', label: '效率' },
                    { key: 'accuracy', label: '精准度' },
                    { key: 'contextAwareness', label: '上下文' },
                  ] as const
                ).map(({ key, label }) => {
                  const score = preview.tool.scores[key];
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-16 shrink-0 text-xs text-slate-500 dark:text-slate-400">{label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="w-7 text-right text-xs font-bold text-slate-700 dark:text-slate-200">{score.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">常用工作流</h3>
              <ul className="mt-2 space-y-2">
                {preview.workflows.map((workflow) => (
                  <li key={workflow} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    <Terminal size={14} className="mt-1 shrink-0 text-slate-400" />
                    {workflow}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">风险摘要</h3>
              <p className="mt-2 text-sm leading-6 text-amber-700 dark:text-amber-300">{preview.riskSummary}</p>
            </section>

            {preview.childPages.length > 0 && (
              <section>
                <button
                  onClick={() => setChildPagesExpanded(!childPagesExpanded)}
                  className="w-full flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                >
                  <span>工具子知识</span>
                  {childPagesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {childPagesExpanded && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preview.childPages.map((page) => (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
                      >
                        {page.label}
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {selectedToolCombinations.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">组合方案</h3>
                  <Link
                    to={`/tool-combinations?tool=${encodeURIComponent(combinationToolFilter)}`}
                    className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    查看完整
                  </Link>
                </div>
                <div className="mt-2 space-y-2">
                  {selectedToolCombinations.slice(0, 3).map((combo) => (
                    <Link
                      key={combo.id}
                      to={`/tool-combinations?tool=${encodeURIComponent(combinationToolFilter)}`}
                      className="block rounded-lg border border-slate-200 px-3 py-2 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
                    >
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{combo.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{combo.scenario}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <SourceLink label={preview.tool.source.label} url={preview.tool.source.url} checkedAt={preview.tool.source.checkedAt} />
              <Link
                to={`/tools/${preview.tool.id}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[--color-ca-accent] dark:text-slate-100"
              >
                打开完整 profile
                <ArrowRight size={14} />
              </Link>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function CandidateRow({
  candidate,
  selected,
  onSelect,
}: {
  candidate: ToolWorkbenchCandidate;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = candidate.decisionFit === 'avoid' ? CircleAlert : CircleCheck;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'w-full rounded-lg border bg-white p-4 text-left transition-colors dark:bg-slate-900',
        selected
          ? 'border-slate-950 shadow-sm dark:border-white'
          : 'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500',
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={clsx(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold',
              candidate.decisionFit === 'primary' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
              candidate.decisionFit === 'alternative' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
              candidate.decisionFit === 'avoid' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
              candidate.decisionFit === 'neutral' && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
            )}>
              <Icon size={12} />
              {fitLabels[candidate.decisionFit]}
            </span>
            <StatusBadge status={candidate.tool.status} />
          </div>
          <h3 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{candidate.tool.name}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{candidate.tool.vendor}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs lg:w-72">
          <Metric label="成本" value={candidate.monthlyCost} />
          <Metric label="国内" value={candidate.tool.china.accessible ? '可用' : '受限'} tone={candidate.tool.china.accessible ? 'positive' : 'warning'} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <CompactList title="选择理由" items={candidate.reasons.slice(0, 3)} />
        <CompactList title="风险" items={candidate.risks.slice(0, 2)} tone="warning" />
      </div>
    </button>
  );
}

function CompactList({ title, items, tone = 'neutral' }: { title: string; items: string[]; tone?: 'neutral' | 'warning' }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item} className={clsx(
            'text-xs leading-5',
            tone === 'warning' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300',
          )}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'positive' | 'warning' }) {
  return (
    <div className={clsx(
      'rounded-lg border px-3 py-2',
      tone === 'positive'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100'
        : tone === 'warning'
          ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100'
          : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100',
    )}>
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-5">{value}</p>
    </div>
  );
}