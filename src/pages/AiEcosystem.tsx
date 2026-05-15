import { useMemo, useState } from 'react';
import { BarChart3, ExternalLink, Filter, GitCompare, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { clsx } from 'clsx';
import { DATA_STORE, SCORE_KEYS, SCORE_LABELS } from '../data/ai-ecosystem';
import type { AiModel, AiModelCategory, CostTier } from '../data/ai-ecosystem';

const CATEGORY_LABELS: Record<AiModelCategory, string> = {
  frontier: '前沿通用',
  coding: '编程强项',
  reasoning: '推理优先',
  multimodal: '多模态/长上下文',
  open: '开放/可本地',
};

const COST_LABELS: Record<CostTier, string> = {
  low: '低成本',
  medium: '中等',
  high: '高成本',
};

const RISK_CLASS = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

function averageScore(model: AiModel) {
  return SCORE_KEYS.reduce((sum, key) => sum + model.scores[key], 0) / SCORE_KEYS.length;
}

function contextWindowTokens(model: AiModel) {
  const match = model.contextWindow.match(/([\d.]+)\s*([MK])/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return match[2].toUpperCase() === 'M' ? value * 1_000_000 : value * 1_000;
}

function scorePolygon(model: AiModel, size = 180) {
  const center = size / 2;
  const radius = size * 0.38;
  return SCORE_KEYS.map((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / SCORE_KEYS.length;
    const valueRadius = radius * (model.scores[key] / 10);
    return `${center + Math.cos(angle) * valueRadius},${center + Math.sin(angle) * valueRadius}`;
  }).join(' ');
}

function gridPolygon(step: number, size = 180) {
  const center = size / 2;
  const radius = size * 0.38 * step;
  return SCORE_KEYS.map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / SCORE_KEYS.length;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  }).join(' ');
}

function RadarChart({ models }: { models: AiModel[] }) {
  const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626'];
  return (
    <svg viewBox="0 0 180 180" className="h-56 w-full max-w-sm">
      {[0.25, 0.5, 0.75, 1].map((step) => (
        <polygon key={step} points={gridPolygon(step)} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
      ))}
      {SCORE_KEYS.map((key, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / SCORE_KEYS.length;
        const endX = 90 + Math.cos(angle) * 76;
        const endY = 90 + Math.sin(angle) * 76;
        const labelX = 90 + Math.cos(angle) * 86;
        const labelY = 90 + Math.sin(angle) * 86;
        return (
          <g key={key}>
            <line x1="90" y1="90" x2={endX} y2={endY} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px]">
              {SCORE_LABELS[key]}
            </text>
          </g>
        );
      })}
      {models.map((model, index) => (
        <polygon
          key={model.id}
          points={scorePolygon(model)}
          fill={colors[index % colors.length]}
          fillOpacity="0.12"
          stroke={colors[index % colors.length]}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function AiEcosystemPage() {
  const [category, setCategory] = useState<AiModelCategory | 'all'>('all');
  const [chinaAvailability, setChinaAvailability] = useState<'all' | 'direct' | 'proxy' | 'local'>('all');
  const [costTier, setCostTier] = useState<CostTier | 'all'>('all');
  const [minScore, setMinScore] = useState(0);
  const [tag, setTag] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'context' | 'china'>('score');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set(DATA_STORE.models.flatMap((model) => model.tags))).sort(),
    [],
  );

  const filteredModels = useMemo(() => {
    const costOrder: Record<CostTier, number> = { low: 0, medium: 1, high: 2 };
    return DATA_STORE.models
      .filter((model) => category === 'all' || model.category === category)
      .filter((model) => costTier === 'all' || model.costTier === costTier)
      .filter((model) => tag === 'all' || model.tags.includes(tag))
      .filter((model) => averageScore(model) >= minScore)
      .filter((model) => {
        if (chinaAvailability === 'all') return true;
        if (chinaAvailability === 'direct') return model.china.accessible && !model.china.needsProxy;
        if (chinaAvailability === 'proxy') return model.china.needsProxy;
        return model.china.localDeploy;
      })
      .sort((a, b) => {
        if (sortBy === 'cost') return costOrder[a.costTier] - costOrder[b.costTier];
        if (sortBy === 'china') return Number(b.china.accessible) - Number(a.china.accessible);
        if (sortBy === 'context') return contextWindowTokens(b) - contextWindowTokens(a);
        return averageScore(b) - averageScore(a);
      });
  }, [category, chinaAvailability, costTier, minScore, sortBy, tag]);

  const selectedModels = DATA_STORE.models.filter((model) => selectedIds.includes(model.id));

  function toggleCompare(modelId: string) {
    setSelectedIds((current) => {
      if (current.includes(modelId)) return current.filter((id) => id !== modelId);
      if (current.length >= 4) return current;
      return [...current, modelId];
    });
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-screen-2xl mx-auto">
      <div className="mb-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <RefreshCw size={13} />
              DATA_STORE v{DATA_STORE.version} · {DATA_STORE.lastUpdated}
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              AI 生态动态追踪
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              面向个人开发者的本地化决策看板：按模型、工具能力、价格与国内可用性筛选，并排比较最多 4 个候选组合。事实字段保留官方来源链接；能力分是便于排序的人工校准运营评分。
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">更新模式</div>
            定期仅更新 <code className="rounded bg-slate-100 dark:bg-slate-800 px-1">DATA_STORE</code> 数据块即可；UI 筛选、排序与对比逻辑无需改动。
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 self-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Filter size={16} className="text-indigo-500" />
            筛选面板
          </h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">分类</span>
              <select value={category} onChange={(event) => setCategory(event.target.value as AiModelCategory | 'all')} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="all">全部分类</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">国内可用性</span>
              <select value={chinaAvailability} onChange={(event) => setChinaAvailability(event.target.value as typeof chinaAvailability)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="all">全部</option>
                <option value="direct">国内直连/官方渠道</option>
                <option value="proxy">通常需要代理/海外渠道</option>
                <option value="local">支持本地部署路径</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">成本区间</span>
              <select value={costTier} onChange={(event) => setCostTier(event.target.value as CostTier | 'all')} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="all">全部成本</option>
                {Object.entries(COST_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>能力评分下限</span>
                <span>{minScore.toFixed(1)}</span>
              </span>
              <input type="range" min="0" max="10" step="0.5" value={minScore} onChange={(event) => setMinScore(Number(event.target.value))} className="mt-2 w-full accent-indigo-600" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">标签</span>
              <select value={tag} onChange={(event) => setTag(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="all">全部标签</option>
                {allTags.map((tagName) => <option key={tagName} value={tagName}>{tagName}</option>)}
              </select>
            </label>
          </div>
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                  <BarChart3 size={17} className="text-indigo-500" />
                  主表格
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">已筛选 {filteredModels.length} / {DATA_STORE.models.length} 项 · 最多选择 4 项对比</p>
              </div>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="score">按综合评分</option>
                <option value="cost">按成本从低到高</option>
                <option value="china">按国内可用性</option>
                <option value="context">按上下文窗口</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">模型</th>
                    <th className="px-4 py-3 text-left">定价 / 1M tokens</th>
                    <th className="px-4 py-3 text-left">上下文</th>
                    <th className="px-4 py-3 text-left">国内可用</th>
                    <th className="px-4 py-3 text-left">评分</th>
                    <th className="px-4 py-3 text-left">来源</th>
                    <th className="px-4 py-3 text-center">对比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredModels.map((model) => (
                    <tr key={model.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800">
                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{model.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{model.vendor} · {CATEGORY_LABELS[model.category]}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {model.tags.slice(0, 4).map((tagName) => (
                            <span key={tagName} className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-300">{tagName}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-xs text-slate-600 dark:text-slate-300">
                        <div>输入：{model.pricing.inputPerMTokens}</div>
                        <div>输出：{model.pricing.outputPerMTokens}</div>
                        <div className="mt-1 text-slate-400">{COST_LABELS[model.costTier]}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600 dark:text-slate-300">{model.contextWindow}</td>
                      <td className="px-4 py-4 align-top">
                        <span className={clsx('rounded-full px-2 py-1 text-xs font-semibold', model.china.accessible ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>
                          {model.china.accessible ? '可用' : '受限'}
                        </span>
                        {model.china.needsProxy && <div className="mt-1 text-xs text-amber-600 dark:text-amber-300">需代理/海外渠道</div>}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold text-indigo-600 dark:text-indigo-300">{averageScore(model).toFixed(1)}</div>
                        <div className="mt-1 h-1.5 w-20 rounded-full bg-slate-100 dark:bg-slate-700">
                          <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${averageScore(model) * 10}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <a href={model.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 hover:underline">
                          {model.source.label}
                          <ExternalLink size={11} />
                        </a>
                        <div className="mt-1 text-[11px] text-slate-400">核验：{model.source.checkedAt}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-center">
                        <button
                          onClick={() => toggleCompare(model.id)}
                          disabled={!selectedIds.includes(model.id) && selectedIds.length >= 4}
                          className={clsx(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                            selectedIds.includes(model.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-200',
                          )}
                        >
                          {selectedIds.includes(model.id) ? '已选' : '选择'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck size={17} className="text-emerald-500" />
              推荐组合卡片
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {DATA_STORE.recommendations.map((rec) => (
                <article key={rec.scene} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{rec.scene}</h3>
                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3"><dt className="text-slate-400">模型</dt><dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{rec.model}</dd></div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3"><dt className="text-slate-400">Agent</dt><dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{rec.agent}</dd></div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3"><dt className="text-slate-400">工具链</dt><dd className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{rec.toolchain}</dd></div>
                  </dl>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-300">优点</div>
                      <ul className="mt-2 list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">{rec.pros.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <div className="font-semibold text-amber-600 dark:text-amber-300">限制</div>
                      <ul className="mt-2 list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">{rec.cons.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  </div>
                  <p className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-300">风险：{rec.risk}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {selectedModels.length > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-screen-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-4 py-3">
            <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <GitCompare size={17} className="text-indigo-500" />
              对比抽屉（{selectedModels.length}/4）
            </h2>
            <button onClick={() => setSelectedIds([])} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="清空对比">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3">
                <RadarChart models={selectedModels} />
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {selectedModels.map((model, index) => (
                    <span key={model.id} className="rounded-full bg-white dark:bg-slate-900 px-2 py-1 text-slate-600 dark:text-slate-300">{index + 1}. {model.name}</span>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="px-3 py-2">维度</th>
                      {selectedModels.map((model) => <th key={model.id} className="px-3 py-2">{model.name}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {SCORE_KEYS.map((key) => (
                      <tr key={key}>
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">{SCORE_LABELS[key]}</td>
                        {selectedModels.map((model) => <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">{model.scores[key].toFixed(1)}</td>)}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">优点</td>
                      {selectedModels.map((model) => <td key={model.id} className="px-3 py-2 text-slate-600 dark:text-slate-300">{model.pros.join('；')}</td>)}
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">限制</td>
                      {selectedModels.map((model) => <td key={model.id} className="px-3 py-2 text-slate-600 dark:text-slate-300">{model.cons.join('；')}</td>)}
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">合规风险</td>
                      {selectedModels.map((model) => (
                        <td key={model.id} className="px-3 py-2">
                          <span className={clsx('rounded-full px-2 py-0.5 font-semibold', RISK_CLASS[model.china.complianceRisk])}>{model.china.complianceRisk}</span>
                          <p className="mt-1 text-slate-500 dark:text-slate-400">{model.china.note}</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
