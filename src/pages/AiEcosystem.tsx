import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChartBar, ExternalLink, Filter, GitCompare, Search, ShieldCheck, X, ChevronDown, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { DATA_STORE, SCORE_KEYS, SCORE_LABELS } from '../data/ai-ecosystem';
import type { AiModel, AiModelCategory, CostTier } from '../data/ai-ecosystem';
import { RadarChart } from '../components/charts/RadarChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

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

function averageScore(model: AiModel) {
  return SCORE_KEYS.reduce((sum, key) => sum + model.scores[key], 0) / SCORE_KEYS.length;
}

function contextWindowTokens(model: AiModel) {
  const match = model.contextWindow.match(/([\d.]+)\s*([MK])/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return match[2].toUpperCase() === 'M' ? value * 1_000_000 : value * 1_000;
}

function AiModelRadarChart({ models }: { models: AiModel[] }) {
  const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626'];
  return (
    <RadarChart
      axisLabels={SCORE_KEYS.map((k) => SCORE_LABELS[k])}
      series={models.map((model, index) => ({
        id: model.id,
        name: model.name,
        color: colors[index % colors.length],
        values: SCORE_KEYS.map((k) => model.scores[k]),
      }))}
    />
  );
}

// Mobile-friendly model card component
function ModelCard({ 
  model, 
  isSelected, 
  onToggle,
  isDisabled
}: { 
  model: AiModel
  isSelected: boolean
  onToggle: () => void
  isDisabled: boolean
}) {
  const [expanded, setExpanded] = useState(false);
  const score = averageScore(model);
  
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/30">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{model.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{model.vendor}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="inline-block rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                {CATEGORY_LABELS[model.category]}
              </span>
              <span className={clsx(
                'inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold',
                model.costTier === 'low' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                model.costTier === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              )}>
                {COST_LABELS[model.costTier]}
              </span>
            </div>
          </div>
          <button
            onClick={onToggle}
            disabled={isDisabled}
            aria-label={isSelected ? '取消选择' : '选择对比'}
            className={clsx(
              'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            )}
          >
            {isSelected ? '✓' : '+'}
          </button>
        </div>

        {/* Quick info */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">评分</div>
            <div className="mt-1 font-bold text-indigo-600 dark:text-indigo-300">{score.toFixed(1)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">上下文</div>
            <div className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{model.contextWindow}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">国内</div>
            <div className={clsx(
              'mt-1 text-xs font-bold',
              model.china.accessible ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500'
            )}>
              {model.china.accessible ? '✓' : '✗'}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 text-xs">
          <div className="font-semibold text-slate-700 dark:text-slate-200 mb-2">定价 / 1M tokens</div>
          <div className="space-y-1 text-slate-600 dark:text-slate-300">
            <div>输入：<span className="font-semibold">{model.pricing.inputPerMTokens}</span></div>
            <div>输出：<span className="font-semibold">{model.pricing.outputPerMTokens}</span></div>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors"
          aria-expanded={expanded}
        >
          <span>{expanded ? '隐藏' : '显示'}详情</span>
          <ChevronDown size={14} className={clsx('transition-transform', expanded && 'rotate-180')} />
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-4 space-y-4">
          {/* Scores */}
          <div>
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-xs">能力评分</div>
            <div className="space-y-2">
              {SCORE_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">{SCORE_LABELS[key]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500"
                        style={{ width: `${model.scores[key] * 10}%` }}
                      />
                    </div>
                    <span className="w-6 font-semibold text-slate-700 dark:text-slate-200">{model.scores[key].toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {model.tags.length > 0 && (
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200 mb-2 text-xs">标签</div>
              <div className="flex flex-wrap gap-1">
                {model.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pros and Cons */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-300 mb-2 text-xs flex items-center gap-1">
                <span>✓</span> 优点
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                {model.pros.slice(0, 3).map((pro) => (
                  <li key={pro} className="line-clamp-2">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-amber-600 dark:text-amber-300 mb-2 text-xs flex items-center gap-1">
                <span>✗</span> 限制
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                {model.cons.slice(0, 3).map((con) => (
                  <li key={con} className="line-clamp-2">• {con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Source */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <a
              href={model.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 hover:underline"
            >
              <ExternalLink size={11} />
              {model.source.label}
            </a>
            <div className="text-[11px] text-slate-400 mt-1">核验：{model.source.checkedAt}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AiEcosystemPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchInput]);

  const [category, setCategory] = useState<AiModelCategory | 'all'>('all');
  const [chinaAvailability, setChinaAvailability] = useState<'all' | 'direct' | 'proxy' | 'local'>('all');
  const [costTier, setCostTier] = useState<CostTier | 'all'>('all');
  const [minScore, setMinScore] = useState(0);
  const [tag, setTag] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'context' | 'china'>('score');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // 对比面板 Tab：scores / pricing / capability
  type CompareTab = 'scores' | 'pricing' | 'capability';
  const rParam = searchParams.get('r');
  const compareTab: CompareTab =
    rParam === 'model-pricing' ? 'pricing' :
    rParam === 'model-capability' ? 'capability' : 'scores';

  const setCompareTab = useCallback((tab: CompareTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === 'scores') next.delete('r');
      else next.set('r', `model-${tab}`);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const allTags = useMemo(
    () => Array.from(new Set(DATA_STORE.models.flatMap((model) => model.tags))).sort(),
    [],
  );

  const filteredModels = useMemo(() => {
    const costOrder: Record<CostTier, number> = { low: 0, medium: 1, high: 2 };
    const query = searchQuery.toLowerCase().trim();
    return DATA_STORE.models
      .filter((model) => {
        if (!query) return true;
        return (
          model.name.toLowerCase().includes(query) ||
          model.vendor.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query) ||
          model.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      })
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
  }, [searchQuery, category, chinaAvailability, costTier, minScore, sortBy, tag]);

  const selectedModels = DATA_STORE.models.filter((model) => selectedIds.includes(model.id));

  const toggleCompare = useCallback((modelId: string) => {
    setSelectedIds((current) => {
      if (current.includes(modelId)) return current.filter((id) => id !== modelId);
      if (current.length >= 4) return current;
      return [...current, modelId];
    });
  }, []);

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Zap size={13} />
              v{DATA_STORE.version} · {DATA_STORE.lastUpdated}
            </div>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              AI 生态追踪
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-300">
              依据官方渠道数据，为开发者提供最新的模型定价、能力评分与国内可用性对比。
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm h-fit">
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">快速更新</div>
            仅需更新 <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 text-[11px]">DATA_STORE</code> 数据块即可同步所有模型信息。
          </div>
        </div>
      </div>

      {/* Main layout - responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4 sm:gap-6">
        {/* Sidebar - Filter Panel */}
        <aside className={clsx(
          'lg:sticky lg:top-20 self-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60',
          'transition-all duration-300',
          filterOpen ? 'block' : 'hidden lg:block'
        )}>
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <Filter size={16} className="text-indigo-500" />
              筛选
            </h2>
            <button
              onClick={() => setFilterOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              aria-label="关闭筛选"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
            {/* Search */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Search size={13} />
                搜索模型
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="模型名称或厂商..."
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition"
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">分类</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AiModelCategory | 'all')}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部分类</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            {/* China Availability */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">国内可用</span>
              <select
                value={chinaAvailability}
                onChange={(e) => setChinaAvailability(e.target.value as typeof chinaAvailability)}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部</option>
                <option value="direct">国内直连/官方</option>
                <option value="proxy">需代理/海外</option>
                <option value="local">支持本地部署</option>
              </select>
            </label>

            {/* Cost */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">成本</span>
              <select
                value={costTier}
                onChange={(e) => setCostTier(e.target.value as CostTier | 'all')}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部成本</option>
                {Object.entries(COST_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            {/* Score */}
            <label className="block">
              <span className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>能力评分下限</span>
                <span className="text-indigo-600 dark:text-indigo-300">{minScore.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 cursor-pointer"
                aria-label="最低评分过滤"
              />
            </label>

            {/* Tag */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">标签</span>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部标签</option>
                {allTags.map((tagName) => (
                  <option key={tagName} value={tagName}>{tagName}</option>
                ))}
              </select>
            </label>

            {/* Reset filters */}
            <button
              onClick={() => {
                setSearchInput('');
                setCategory('all');
                setChinaAvailability('all');
                setCostTier('all');
                setMinScore(0);
                setTag('all');
              }}
              className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              重置筛选
            </button>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <ChartBar size={17} className="text-indigo-500 shrink-0" />
                <span className="truncate">{filteredModels.length} / {DATA_STORE.models.length} 个模型</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">最多选择 4 个进行对比</p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                aria-label="排序方式"
              >
                <option value="score">按评分</option>
                <option value="cost">按成本</option>
                <option value="china">按国内可用</option>
                <option value="context">按上下文</option>
              </select>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Models grid / table view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedIds.includes(model.id)}
                onToggle={() => toggleCompare(model.id)}
                isDisabled={!selectedIds.includes(model.id) && selectedIds.length >= 4}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-8 text-center">
              <p className="text-slate-600 dark:text-slate-300">未找到匹配的模型。请调整筛选条件。</p>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck size={17} className="text-emerald-500" />
              推荐组合
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {DATA_STORE.recommendations.map((rec) => (
                <article key={rec.scene} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 sm:p-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/30 transition-shadow">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{rec.scene}</h3>
                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                      <dt className="text-slate-400 font-semibold mb-1">模型</dt>
                      <dd className="text-slate-700 dark:text-slate-200 line-clamp-2">{rec.model}</dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                      <dt className="text-slate-400 font-semibold mb-1">Agent</dt>
                      <dd className="text-slate-700 dark:text-slate-200 line-clamp-2">{rec.agent}</dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                      <dt className="text-slate-400 font-semibold mb-1">工具</dt>
                      <dd className="text-slate-700 dark:text-slate-200 line-clamp-2">{rec.toolchain}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-300 mb-2">✓ 优点</div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                        {rec.pros.slice(0, 2).map((item) => (
                          <li key={item} className="line-clamp-2 text-[11px]">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-amber-600 dark:text-amber-300 mb-2">✗ 限制</div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                        {rec.cons.slice(0, 2).map((item) => (
                          <li key={item} className="line-clamp-2 text-[11px]">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 rounded-lg bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-300 line-clamp-2">
                    风险：{rec.risk}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Comparison drawer - fixed bottom */}
      {selectedModels.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white dark:from-slate-900 via-white dark:via-slate-900 to-white/0 dark:to-slate-900/0 pt-4 pb-4">
          <div className="px-3 sm:px-6 max-w-screen-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <GitCompare size={16} className="text-indigo-500" />
                  对比 ({selectedModels.length}/4)
                </h2>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  aria-label="清空对比"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                <div className="p-4 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-4">
                  {/* Radar chart */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 flex flex-col">
                    <AiModelRadarChart models={selectedModels} />
                    <div className="mt-2 flex flex-wrap gap-1 text-xs">
                      {selectedModels.map((model, i) => (
                        <span key={model.id} className="rounded-full bg-white dark:bg-slate-900 px-2 py-0.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {i + 1}. {model.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Comparison tabs */}
                  <div className="overflow-x-auto">
                    <Tabs value={compareTab} onValueChange={(v) => setCompareTab(v as CompareTab)}>
                      <TabsList className="mb-3">
                        <TabsTrigger value="scores" className="text-xs py-1 px-2.5">评分</TabsTrigger>
                        <TabsTrigger value="pricing" className="text-xs py-1 px-2.5">定价</TabsTrigger>
                        <TabsTrigger value="capability" className="text-xs py-1 px-2.5">能力</TabsTrigger>
                      </TabsList>

                      {/* Scores tab */}
                      <TabsContent value="scores">
                        <table className="min-w-full text-xs divide-y divide-slate-100 dark:divide-slate-700">
                          <thead>
                            <tr className="text-left text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                              <th className="px-3 py-2 font-semibold">维度</th>
                              {selectedModels.map((model) => (
                                <th key={model.id} className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">{model.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {SCORE_KEYS.map((key) => (
                              <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">{SCORE_LABELS[key]}</td>
                                {selectedModels.map((model) => (
                                  <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-300">{model.scores[key].toFixed(1)}</span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </TabsContent>

                      {/* Pricing tab */}
                      <TabsContent value="pricing">
                        <table className="min-w-full text-xs divide-y divide-slate-100 dark:divide-slate-700">
                          <thead>
                            <tr className="text-left text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                              <th className="px-3 py-2 font-semibold">字段</th>
                              {selectedModels.map((model) => (
                                <th key={model.id} className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">{model.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {[
                              { label: '输入 /1M tokens', key: 'inputPerMTokens' as const },
                              { label: '输出 /1M tokens', key: 'outputPerMTokens' as const },
                              { label: '缓存输入 /1M', key: 'cachedInputPerMTokens' as const },
                              { label: '批量输入 /1M', key: 'batchInputPerMTokens' as const },
                              { label: '免费层', key: 'freeTier' as const },
                            ].map(({ label, key }) => (
                              <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{label}</td>
                                {selectedModels.map((model) => {
                                  const val = model.pricing[key];
                                  return (
                                    <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                      {val == null ? (
                                        <span className="text-slate-400 dark:text-slate-500">—</span>
                                      ) : (
                                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">{val}</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">官方链接</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2">
                                  <a
                                    href={model.pricing.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300 hover:underline"
                                  >
                                    <ExternalLink size={11} />
                                    <span>查看</span>
                                  </a>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </TabsContent>

                      {/* Capability tab */}
                      <TabsContent value="capability">
                        <table className="min-w-full text-xs divide-y divide-slate-100 dark:divide-slate-700">
                          <thead>
                            <tr className="text-left text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                              <th className="px-3 py-2 font-semibold">能力项</th>
                              {selectedModels.map((model) => (
                                <th key={model.id} className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">{model.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">最大输出</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                  {model.capability?.maxOutput ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">工具调用</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2">
                                  {model.capability == null ? (
                                    <span className="text-slate-400 dark:text-slate-500">—</span>
                                  ) : model.capability.toolUse ? (
                                    <span className="text-emerald-600 dark:text-emerald-300 font-bold">✓</span>
                                  ) : (
                                    <span className="text-red-500 dark:text-red-400 font-bold">✗</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">结构化输出</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2">
                                  {model.capability == null ? (
                                    <span className="text-slate-400 dark:text-slate-500">—</span>
                                  ) : model.capability.structuredOutput ? (
                                    <span className="text-emerald-600 dark:text-emerald-300 font-bold">✓</span>
                                  ) : (
                                    <span className="text-red-500 dark:text-red-400 font-bold">✗</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">输入模态</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                  {model.capability?.multimodalIn
                                    ? model.capability.multimodalIn.join(', ')
                                    : <span className="text-slate-400 dark:text-slate-500">—</span>}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">部署方式</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                  {model.capability?.deployment?.join(', ') ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">已知限制</td>
                              {selectedModels.map((model) => (
                                <td key={model.id} className="px-3 py-2 text-slate-600 dark:text-slate-300 max-w-[160px]">
                                  {model.capability?.limitations ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
