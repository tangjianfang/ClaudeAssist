import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, Zap, Target, TrendingUp, CircleAlert, CircleCheck, Clock } from 'lucide-react';
import { DATA_STORE } from '../data/ai-ecosystem';
import type { AiToolCombination } from '../data/ai-ecosystem';
import { getToolByName } from '../data/tools/index';

type ScenarioCategoryFilter = 'all' | 'startup' | 'enterprise' | 'privacy' | 'learning' | 'automation' | 'china' | 'local';
type PriorityFilter = 'all' | 'speed' | 'quality' | 'cost' | 'privacy' | 'china' | 'enterprise' | 'agentic';
type RiskTypeFilter = 'all' | 'privacy' | 'network' | 'cost' | 'security' | 'vendor' | 'no-risk';
type SetupTimeFilter = 'all' | 'instant' | 'quick' | 'standard' | 'advanced';

const scenarioCategoryOptions: Array<{ id: ScenarioCategoryFilter; label: string }> = [
  { id: 'all', label: '全部场景' },
  { id: 'startup', label: '初创/快速原型' },
  { id: 'enterprise', label: '企业/金融/政府' },
  { id: 'privacy', label: '隐私/敏感代码' },
  { id: 'learning', label: '学习/个人成长' },
  { id: 'automation', label: '自动化/Agent' },
  { id: 'china', label: '国内可用/合规' },
  { id: 'local', label: '本地/离线部署' },
];

const priorityOptions: Array<{ id: PriorityFilter; label: string }> = [
  { id: 'all', label: '全部优先级' },
  { id: 'speed', label: '速度优先' },
  { id: 'quality', label: '质量/复杂重构' },
  { id: 'cost', label: '成本优先' },
  { id: 'privacy', label: '隐私优先' },
  { id: 'china', label: '国内链路优先' },
  { id: 'enterprise', label: '企业支持优先' },
  { id: 'agentic', label: 'Agent 自主能力' },
];

const riskTypeOptions: Array<{ id: RiskTypeFilter; label: string }> = [
  { id: 'all', label: '全部风险' },
  { id: 'privacy', label: '隐私/数据风险' },
  { id: 'network', label: '网络/国内可用性' },
  { id: 'cost', label: '成本不可控' },
  { id: 'security', label: '权限/安全风险' },
  { id: 'vendor', label: '供应商/生态锁定' },
  { id: 'no-risk', label: '低显性风险' },
];

const setupTimeOptions: Array<{ id: SetupTimeFilter; label: string }> = [
  { id: 'all', label: '全部启动时间' },
  { id: 'instant', label: '即开即用' },
  { id: 'quick', label: '30 分钟内' },
  { id: 'standard', label: '1 小时内' },
  { id: 'advanced', label: '需要深度配置' },
];

function comboText(combo: AiToolCombination) {
  return [
    combo.name,
    combo.scenario,
    combo.model,
    combo.tool,
    combo.totalMonthlyCost,
    combo.supportLevel,
    combo.setupTime,
    ...(combo.complementaryTools ?? []),
    ...combo.pros,
    ...combo.cons,
    ...combo.bestFor,
    ...combo.riskFactors,
  ].join(' ').toLowerCase();
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function matchesScenarioCategory(combo: AiToolCombination, filter: ScenarioCategoryFilter) {
  if (filter === 'all') return true;
  const text = comboText(combo);
  const categoryKeywords: Record<Exclude<ScenarioCategoryFilter, 'all'>, string[]> = {
    startup: ['初创', '敏捷', '快速原型', '原型', 'startup', 'crud'],
    enterprise: ['企业', '金融', '政府', '军工', '医疗', '合规', '长期稳定'],
    privacy: ['隐私', '敏感', '数据不出', '离线', '零数据', '安全'],
    learning: ['学生', '学习', '学习者', '个人开发者', '开源贡献者'],
    automation: ['自动化', 'agent', '自主', '多步骤', 'devops', '迁移'],
    china: ['国内', '中国', '阿里云', 'qwen', 'deepseek', 'glm', '通义', '智谱', '零代理'],
    local: ['本地', '离线', 'ollama', 'local', '自托管', '私有化'],
  };
  return includesAny(text, categoryKeywords[filter]);
}

function matchesPriority(combo: AiToolCombination, filter: PriorityFilter) {
  if (filter === 'all') return true;
  const text = comboText(combo);
  const priorityKeywords: Record<Exclude<PriorityFilter, 'all'>, string[]> = {
    speed: ['快速', '最快', '效率', 'fast', '5 分钟', '5 minutes'],
    quality: ['质量', '复杂', '重构', '推理', '最高', '专业', '架构', '算法'],
    cost: ['免费', '低成本', '性价比', '$0', '¥0', '预算', '成本低'],
    privacy: ['隐私', '离线', '数据不出', '零数据', '本地'],
    china: ['国内', '零代理', '阿里云', 'qwen', 'deepseek', 'glm', '通义', '智谱'],
    enterprise: ['企业', '官方支持', '商业支持', 'sla', '合规', '采购'],
    agentic: ['agent', '自主', '多步骤', '终端', '文件系统', '自动化'],
  };
  return includesAny(text, priorityKeywords[filter]);
}

function getModelProvider(combo: AiToolCombination) {
  const model = combo.model.toLowerCase();
  if (includesAny(model, ['claude', 'anthropic'])) return 'Anthropic Claude';
  if (includesAny(model, ['gpt', 'openai'])) return 'OpenAI';
  if (includesAny(model, ['qwen', '通义', '阿里'])) return 'Alibaba Qwen';
  if (includesAny(model, ['deepseek'])) return 'DeepSeek';
  if (includesAny(model, ['glm', '智谱', 'codegeex'])) return 'Zhipu GLM';
  if (includesAny(model, ['kimi', 'moonshot'])) return 'Moonshot Kimi';
  if (includesAny(model, ['gemini', 'google'])) return 'Google Gemini';
  if (includesAny(model, ['local', 'ollama', 'starcoder', 'llama'])) return 'Local/Open Models';
  return 'Other';
}

function getSetupCategory(combo: AiToolCombination): SetupTimeFilter {
  const setup = combo.setupTime.toLowerCase();
  if (includesAny(setup, ['0 分钟', '0 minutes'])) return 'instant';
  if (includesAny(setup, ['2-3 hours', '2 hours', '3 hours'])) return 'advanced';
  const number = Number(setup.match(/\d+/)?.[0] ?? Number.NaN);
  if (Number.isNaN(number)) return 'standard';
  if (setup.includes('hour') || setup.includes('小时')) return number <= 1 ? 'standard' : 'advanced';
  if (number <= 5) return 'instant';
  if (number <= 30) return 'quick';
  if (number <= 60) return 'standard';
  return 'advanced';
}

function matchesRiskType(combo: AiToolCombination, filter: RiskTypeFilter) {
  if (filter === 'all') return true;
  if (filter === 'no-risk') return combo.riskFactors.length === 0;
  const text = combo.riskFactors.join(' ').toLowerCase();
  const riskKeywords: Record<Exclude<RiskTypeFilter, 'all' | 'no-risk'>, string[]> = {
    privacy: ['隐私', '数据', '上传', '出境'],
    network: ['国内', '代理', '访问', '可用性', '网络'],
    cost: ['成本', '费用', 'api', '预算', '配额'],
    security: ['安全', '权限', '沙箱', '错误指令', '审查', '不可预测'],
    vendor: ['供应商', '锁定', '生态', '政策', '运营', '依赖'],
  };
  return includesAny(text, riskKeywords[filter]);
}

function getSupportLabel(level: string) {
  if (level === 'enterprise') return '企业级';
  if (level === 'professional') return '专业支持';
  if (level === 'community') return '社区支持';
  return '有限支持';
}

export function ToolCombinationsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [toolFilter, setToolFilter] = useState(() => searchParams.get('tool') ?? 'all');
  const [scenarioCategoryFilter, setScenarioCategoryFilter] = useState<ScenarioCategoryFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [modelProviderFilter, setModelProviderFilter] = useState('all');
  const [developmentSpeedFilter, setDevelopmentSpeedFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all');
  const [learningCurveFilter, setLearningCurveFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [costRangeFilter, setCostRangeFilter] = useState<'all' | 'free' | 'low' | 'medium' | 'high'>('all');
  const [supportLevelFilter, setSupportLevelFilter] = useState('all');
  const [riskTypeFilter, setRiskTypeFilter] = useState<RiskTypeFilter>('all');
  const [setupTimeFilter, setSetupTimeFilter] = useState<SetupTimeFilter>('all');

  useEffect(() => {
    setToolFilter(searchParams.get('tool') ?? 'all');
  }, [searchParams]);

  const toolOptions = useMemo(
    () => Array.from(new Set(DATA_STORE.toolCombinations.map((combo) => combo.tool))).sort(),
    [],
  );
  const modelProviderOptions = useMemo(
    () => Array.from(new Set(DATA_STORE.toolCombinations.map(getModelProvider))).sort(),
    [],
  );
  const supportLevelOptions = useMemo(
    () => Array.from(new Set(DATA_STORE.toolCombinations.map((combo) => combo.supportLevel))).sort(),
    [],
  );

  const filteredCombinations = useMemo(() => {
    let result = DATA_STORE.toolCombinations;

    // 按搜索文本
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(combo =>
        combo.name.toLowerCase().includes(q) ||
        combo.scenario.toLowerCase().includes(q) ||
        combo.model.toLowerCase().includes(q) ||
        combo.tool.toLowerCase().includes(q) ||
        combo.bestFor.some(item => item.toLowerCase().includes(q))
      );
    }

    if (toolFilter !== 'all') {
      const selectedTool = toolFilter.toLowerCase();
      result = result.filter((combo) => {
        const comboTool = combo.tool.toLowerCase();
        return comboTool.includes(selectedTool) || selectedTool.includes(comboTool);
      });
    }

    if (scenarioCategoryFilter !== 'all') {
      result = result.filter((combo) => matchesScenarioCategory(combo, scenarioCategoryFilter));
    }

    if (priorityFilter !== 'all') {
      result = result.filter((combo) => matchesPriority(combo, priorityFilter));
    }

    if (modelProviderFilter !== 'all') {
      result = result.filter((combo) => getModelProvider(combo) === modelProviderFilter);
    }

    // 按开发速度
    if (developmentSpeedFilter !== 'all') {
      result = result.filter(combo => combo.developmentSpeed === developmentSpeedFilter);
    }

    // 按学习曲线
    if (learningCurveFilter !== 'all') {
      result = result.filter(combo => combo.learningCurve === learningCurveFilter);
    }

    // 按成本范围
    if (costRangeFilter !== 'all') {
      const getCostCategory = (costStr: string) => {
        if (costStr.includes('¥0') || costStr === '$0-20') return 'free';
        if (costStr.includes('¥') && parseInt(costStr) < 500) return 'low';
        if (costStr.includes('$') && parseInt(costStr) < 50) return 'low';
        if (costStr.includes('¥') && parseInt(costStr) < 1000) return 'medium';
        if (costStr.includes('$') && parseInt(costStr) < 100) return 'medium';
        return 'high';
      };
      result = result.filter(combo => getCostCategory(combo.totalMonthlyCost) === costRangeFilter);
    }

    if (supportLevelFilter !== 'all') {
      result = result.filter((combo) => combo.supportLevel === supportLevelFilter);
    }

    if (riskTypeFilter !== 'all') {
      result = result.filter((combo) => matchesRiskType(combo, riskTypeFilter));
    }

    if (setupTimeFilter !== 'all') {
      result = result.filter((combo) => getSetupCategory(combo) === setupTimeFilter);
    }

    return result;
  }, [searchQuery, toolFilter, scenarioCategoryFilter, priorityFilter, modelProviderFilter, developmentSpeedFilter, learningCurveFilter, costRangeFilter, supportLevelFilter, riskTypeFilter, setupTimeFilter]);

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast':
        return '⚡';
      case 'medium':
        return '→';
      case 'slow':
        return '🐢';
      default:
        return '?';
    }
  };

  const getSpeedLabel = (speed: string) => {
    switch (speed) {
      case 'fast':
        return '快速';
      case 'medium':
        return '中等';
      case 'slow':
        return '稳妥';
      default:
        return speed;
    }
  };

  const getLearningLabel = (curve: string) => {
    switch (curve) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '陡峭';
      default:
        return curve;
    }
  };

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 rounded-2xl sm:rounded-3xl border border-amber-100 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
              <Target size={13} />
              模型 + 工具最佳组合
            </div>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              AI 编码组合方案选择器
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-300">
              基于不同场景（初创、企业、隐私）和优先级（速度、成本、隐私），找到最优的大模型 + 编码工具组合方案。
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm h-fit">
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">🎯 场景驱动</div>
            每个组合都针对特定场景优化（初创、企业、隐私、学习）。
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Search size={13} />
              搜索
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="场景、模型、工具..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>

          {/* Tool */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Target size={13} />
              编码工具
            </label>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部工具</option>
              {toolOptions.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Scenario Category */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Target size={13} />
              场景类型
            </label>
            <select
              value={scenarioCategoryFilter}
              onChange={(e) => setScenarioCategoryFilter(e.target.value as ScenarioCategoryFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              {scenarioCategoryOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Filter size={13} />
              决策优先级
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              {priorityOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Model Provider */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Search size={13} />
              模型厂商
            </label>
            <select
              value={modelProviderFilter}
              onChange={(e) => setModelProviderFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部模型厂商</option>
              {modelProviderOptions.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          {/* Development Speed */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <TrendingUp size={13} />
              开发速度
            </label>
            <select
              value={developmentSpeedFilter}
              onChange={(e) => setDevelopmentSpeedFilter(e.target.value as typeof developmentSpeedFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部速度</option>
              <option value="fast">快速 ⚡</option>
              <option value="medium">中等 →</option>
              <option value="slow">稳妥 🐢</option>
            </select>
          </div>

          {/* Learning Curve */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Zap size={13} />
              学习曲线
            </label>
            <select
              value={learningCurveFilter}
              onChange={(e) => setLearningCurveFilter(e.target.value as typeof learningCurveFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">陡峭</option>
            </select>
          </div>

          {/* Cost Range */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Filter size={13} />
              成本范围
            </label>
            <select
              value={costRangeFilter}
              onChange={(e) => setCostRangeFilter(e.target.value as typeof costRangeFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部成本</option>
              <option value="free">免费</option>
              <option value="low">低成本</option>
              <option value="medium">中等成本</option>
              <option value="high">高成本</option>
            </select>
          </div>

          {/* Support Level */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <CircleCheck size={13} />
              支持级别
            </label>
            <select
              value={supportLevelFilter}
              onChange={(e) => setSupportLevelFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              <option value="all">全部支持</option>
              {supportLevelOptions.map((level) => (
                <option key={level} value={level}>{getSupportLabel(level)}</option>
              ))}
            </select>
          </div>

          {/* Risk Type */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <CircleAlert size={13} />
              风险类型
            </label>
            <select
              value={riskTypeFilter}
              onChange={(e) => setRiskTypeFilter(e.target.value as RiskTypeFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              {riskTypeOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Setup Time */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-2">
              <Clock size={13} />
              启动时间
            </label>
            <select
              value={setupTimeFilter}
              onChange={(e) => setSetupTimeFilter(e.target.value as SetupTimeFilter)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            >
              {setupTimeOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            当前匹配 {filteredCombinations.length} / {DATA_STORE.toolCombinations.length} 个组合
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setToolFilter('all');
              setScenarioCategoryFilter('all');
              setPriorityFilter('all');
              setModelProviderFilter('all');
              setDevelopmentSpeedFilter('all');
              setLearningCurveFilter('all');
              setCostRangeFilter('all');
              setSupportLevelFilter('all');
              setRiskTypeFilter('all');
              setSetupTimeFilter('all');
            }}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* Combinations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCombinations.map((combo) => (
          <article key={combo.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-slate-900/30 transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{combo.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{combo.scenario}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-900/60 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-300">
                    {getSpeedIcon(combo.developmentSpeed)} {getSpeedLabel(combo.developmentSpeed)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-5 py-4 space-y-4">
              {/* Model and Tool */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3">
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 mb-1">大模型</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{combo.model}</div>
                </div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 mb-1">编码工具</div>
                  {(() => {
                    const tool = getToolByName(combo.tool);
                    return tool ? (
                      <Link
                        to={`/tools/${tool.id}`}
                        className="text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                      >
                        {combo.tool}
                      </Link>
                    ) : (
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{combo.tool}</div>
                    );
                  })()}
                </div>
              </div>

              {/* Complementary tools if any */}
              {combo.complementaryTools && combo.complementaryTools.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">推荐辅助工具</div>
                  <div className="flex flex-wrap gap-1">
                    {combo.complementaryTools.map((tool) => (
                      <span key={tool} className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 mb-1">月度成本</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{combo.totalMonthlyCost}</div>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 mb-1">学习难度</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{getLearningLabel(combo.learningCurve)}</div>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 mb-1">启动时间</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{combo.setupTime}</div>
                </div>
              </div>

              {/* Best for */}
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">🎯 适合场景</div>
                <ul className="space-y-1">
                  {combo.bestFor.map((scenario) => (
                    <li key={scenario} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <CircleCheck size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      {scenario}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros */}
              <div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mb-2">✓ 优点</div>
                <ul className="space-y-1">
                  {combo.pros.slice(0, 4).map((pro, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">
                      • {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-300 mb-2">✗ 限制</div>
                <ul className="space-y-1">
                  {combo.cons.slice(0, 4).map((con, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">
                      • {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk factors */}
              {combo.riskFactors.length > 0 && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-900/50">
                  <div className="flex items-start gap-2">
                    <CircleAlert size={13} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">⚠️ 风险因素</div>
                      <ul className="space-y-0.5">
                        {combo.riskFactors.map((risk, i) => (
                          <li key={i} className="text-xs text-red-700 dark:text-red-300">
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Support level */}
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">支持级别：</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {getSupportLabel(combo.supportLevel)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredCombinations.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">未找到匹配的组合方案。请调整筛选条件。</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-5">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">📖 说明</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700 dark:text-slate-300">
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">开发速度</div>
            <ul className="space-y-0.5">
              <li>⚡ 快速：几小时内快速原型</li>
              <li>→ 中等：1-3 天标准开发</li>
              <li>🐢 稳妥：优先稳定性和安全</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">学习曲线</div>
            <ul className="space-y-0.5">
              <li>简单：30分钟内上手</li>
              <li>中等：1-2小时学习</li>
              <li>陡峭：需要深入配置和学习</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">月度成本</div>
            <ul className="space-y-0.5">
              <li>免费：无需费用</li>
              <li>低成本：$0-20/月</li>
              <li>中等成本：$20-50/月</li>
              <li>高成本：$50+/月</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">支持级别</div>
            <ul className="space-y-0.5">
              <li>企业级：官方商业支持</li>
              <li>社区支持：开源/社区维护</li>
              <li>有限支持：基础文档和帮助</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
