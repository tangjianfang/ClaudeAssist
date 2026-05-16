import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChartBar, Filter, Search, X, Zap, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { DATA_STORE, TOOL_CATEGORY_LABELS, TOOL_SCORE_KEYS, TOOL_SCORE_LABELS, COST_LABELS } from '../data/ai-ecosystem';
import type { AiToolCategory, CostTier } from '../data/ai-ecosystem';
import { ToolCard } from '../components/ToolCard';
import { ReportActions } from '../components/reports/ReportActions';
import { BarCompareChart } from '../components/charts/BarCompareChart';
import {
  buildToolCompareUrl,
  parseToolCompareParams,
  buildToolMarkdown,
  downloadSvgElement,
} from '../utils/report-share';

export function AiToolsPage() {
  const [searchParams] = useSearchParams();
  const svgRef = useRef<SVGSVGElement>(null);
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

  const [category, setCategory] = useState<AiToolCategory | 'all'>('all');
  const [costTier, setCostTier] = useState<CostTier | 'all'>('all');
  const [chinaAvailability, setChinaAvailability] = useState<'all' | 'accessible' | 'blocked'>('all');
  const [minScoreType, setMinScoreType] = useState<'completion' | 'generation' | 'efficiency'>('completion');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'name' | 'popularity'>('score');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'link' | 'md' | null>(null);

  // Step 29: mount 时从 URL 恢复对比选择（过滤未知 id，去重，最多 4 个）
  const validToolIds = useMemo(() => new Set(DATA_STORE.tools.map((t) => t.id)), []);
  useEffect(() => {
    const { ids } = parseToolCompareParams(searchParams, validToolIds);
    if (ids.length > 0) setSelectedIds(ids);
    // 仅在 mount 时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取所有不同的兼容环境
  const allCompatible = useMemo(() => {
    const compat = new Set<string>();
    DATA_STORE.tools.forEach(tool => {
      tool.compatible.forEach(c => compat.add(c));
    });
    return Array.from(compat).sort();
  }, []);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCompatible, setSelectedCompatible] = useState<string>('all');

  // 过滤和排序逻辑
  const filteredTools = useMemo(() => {
    let result = DATA_STORE.tools;

    // 按搜索文本
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.vendor.toLowerCase().includes(q) ||
        tool.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 按分类
    if (category !== 'all') {
      result = result.filter(tool => tool.category === category);
    }

    // 按成本
    if (costTier !== 'all') {
      result = result.filter(tool => tool.costTier === costTier);
    }

    // 按国内可用性
    if (chinaAvailability !== 'all') {
      result = result.filter(tool =>
        chinaAvailability === 'accessible' ? tool.china.accessible : !tool.china.accessible
      );
    }

    // 按评分类型
    const scoreField = minScoreType === 'completion' ? 'codeCompletion' : minScoreType === 'generation' ? 'codeGeneration' : 'efficiency';
    if (minScore > 0) {
      result = result.filter(tool => tool.scores[scoreField] >= minScore);
    }

    // 按功能特性
    if (selectedFeatures.length > 0) {
      result = result.filter(tool =>
        selectedFeatures.every(feature => tool.features.some(f => f === feature))
      );
    }

    // 按兼容环境
    if (selectedCompatible !== 'all') {
      result = result.filter(tool => tool.compatible.includes(selectedCompatible));
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'score') {
        return b.scores[scoreField] - a.scores[scoreField];
      } else if (sortBy === 'cost') {
        const costOrder = { low: 0, medium: 1, high: 2 };
        return costOrder[a.costTier] - costOrder[b.costTier];
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // popularity - by vendor prominence
        const vendorPriority: Record<string, number> = {
          'GitHub': 0, 'Anthropic': 1, 'OpenAI': 2, 'JetBrains': 3, 'Amazon Web Services': 4
        };
        return (vendorPriority[a.vendor] || 999) - (vendorPriority[b.vendor] || 999);
      }
    });

    return result;
  }, [searchQuery, category, costTier, chinaAvailability, minScore, minScoreType, sortBy, selectedFeatures, selectedCompatible]);

  const selectedTools = useMemo(() => {
    return DATA_STORE.tools.filter(tool => selectedIds.includes(tool.id));
  }, [selectedIds]);

  const toggleCompare = useCallback((toolId: string) => {
    setSelectedIds(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : prev.length < 4
          ? [...prev, toolId]
          : prev
    );
  }, []);

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Zap size={13} />
              AI 编码工具库 · {DATA_STORE.tools.length} 款工具
            </div>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              AI 编码助手与工具对比
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-300">
              从 Copilot、Claude Code 到 Cursor 和 Tabnine，找到最适合你的开发工具。对比能力、成本、国内可用性。
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm h-fit">
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">💡 提示</div>
            选择最多 4 款工具进行对比。查看它们的优缺点、兼容 IDE、国内可用性。
          </div>
        </div>
      </div>

      {/* Main layout */}
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
                搜索工具
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="工具名称或厂商..."
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">工具类型</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AiToolCategory | 'all')}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部类型</option>
                {Object.entries(TOOL_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            {/* Cost */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">价格</span>
              <select
                value={costTier}
                onChange={(e) => setCostTier(e.target.value as CostTier | 'all')}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部价格</option>
                {Object.entries(COST_LABELS).map(([value, label]) => (
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
                <option value="accessible">国内可用</option>
                <option value="blocked">需代理/海外</option>
              </select>
            </label>

            {/* Minimum Score */}
            <label className="block">
              <span className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>评分下限</span>
                <span className="text-indigo-600 dark:text-indigo-300">{minScore.toFixed(1)}</span>
              </span>
              <select
                value={minScoreType}
                onChange={(e) => setMinScoreType(e.target.value as typeof minScoreType)}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="completion">补全能力</option>
                <option value="generation">生成能力</option>
                <option value="efficiency">工作效率</option>
              </select>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 cursor-pointer"
              />
            </label>

            {/* Compatible IDE */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">支持环境</span>
              <select
                value={selectedCompatible}
                onChange={(e) => setSelectedCompatible(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">全部环境</option>
                {allCompatible.map((compat) => (
                  <option key={compat} value={compat}>{compat}</option>
                ))}
              </select>
            </label>

            {/* Reset filters */}
            <button
              onClick={() => {
                setSearchInput('');
                setCategory('all');
                setCostTier('all');
                setChinaAvailability('all');
                setMinScore(0);
                setSelectedFeatures([]);
                setSelectedCompatible('all');
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
                <span className="truncate">{filteredTools.length} / {DATA_STORE.tools.length} 款工具</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">最多选择 4 款进行对比</p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="score">按评分</option>
                <option value="cost">按成本</option>
                <option value="name">按名称</option>
                <option value="popularity">按热度</option>
              </select>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isSelected={selectedIds.includes(tool.id)}
                onToggle={() => toggleCompare(tool.id)}
                isDisabled={!selectedIds.includes(tool.id) && selectedIds.length >= 4}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-8 text-center">
              <p className="text-slate-600 dark:text-slate-300">未找到匹配的工具。请调整筛选条件。</p>
            </div>
          )}
        </section>
      </div>

      {/* Comparison drawer */}
      {selectedTools.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white dark:from-slate-900 via-white dark:via-slate-900 to-white/0 dark:to-slate-900/0 pt-4 pb-4">
          <div className="px-3 sm:px-6 max-w-screen-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <Layers size={16} className="text-indigo-500" />
                  工具对比 ({selectedTools.length}/4)
                  {copyFeedback && (
                    <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                      {copyFeedback === 'link' ? '链接已复制 ✓' : 'Markdown 已复制 ✓'}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-1">
                  <ReportActions
                    onCopyLink={() => {
                      navigator.clipboard.writeText(buildToolCompareUrl(selectedIds));
                      setCopyFeedback('link');
                      setTimeout(() => setCopyFeedback(null), 2000);
                    }}
                    onCopyMarkdown={() => {
                      navigator.clipboard.writeText(buildToolMarkdown(selectedTools));
                      setCopyFeedback('md');
                      setTimeout(() => setCopyFeedback(null), 2000);
                    }}
                    onDownloadSvg={() => {
                      if (svgRef.current) downloadSvgElement(svgRef.current, 'tool-compare.svg');
                    }}
                  />
                  <button
                    onClick={() => setSelectedIds([])}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    aria-label="清空对比"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="max-h-[55vh] overflow-y-auto">
                {/* Score bar chart (SVG, download target via svgRef) */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <BarCompareChart
                    ref={svgRef}
                    dims={TOOL_SCORE_KEYS.map((k) => ({ key: k, label: TOOL_SCORE_LABELS[k] }))}
                    series={selectedTools.map((t, i) => ({
                      id: t.id,
                      name: t.name,
                      color: ['#4f46e5', '#059669', '#d97706', '#dc2626'][i % 4],
                      values: Object.fromEntries(TOOL_SCORE_KEYS.map((k) => [k, t.scores[k]])),
                    }))}
                    className="w-full max-w-xl"
                  />
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="min-w-full text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    <thead>
                      <tr className="text-left text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-3 py-2 font-semibold">维度</th>
                        {selectedTools.map((tool) => (
                          <th key={tool.id} className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">{tool.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">类别</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">{tool.category}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">价格</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="px-3 py-2 text-slate-700 dark:text-slate-200">{tool.pricing.plan}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">补全</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="px-3 py-2">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-300">{tool.scores.codeCompletion.toFixed(1)}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">生成</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="px-3 py-2">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-300">{tool.scores.codeGeneration.toFixed(1)}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">国内可用</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="px-3 py-2">
                            <span className={clsx(
                              'rounded-full px-2 py-1 text-xs font-semibold',
                              tool.china.accessible ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            )}>
                              {tool.china.accessible ? '✓ 可用' : '✗ 受限'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
