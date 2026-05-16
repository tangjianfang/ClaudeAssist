import { useMemo, useState } from 'react';
import { Filter, Search, Zap, Target, TrendingUp, CircleAlert, CircleCheck, Clock } from 'lucide-react';
import { DATA_STORE } from '../data/ai-ecosystem';

export function ToolCombinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [developmentSpeedFilter, setDevelopmentSpeedFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all');
  const [learningCurveFilter, setLearningCurveFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [costRangeFilter, setCostRangeFilter] = useState<'all' | 'free' | 'low' | 'medium' | 'high'>('all');

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

    return result;
  }, [searchQuery, developmentSpeedFilter, learningCurveFilter, costRangeFilter]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{combo.tool}</div>
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
                  {combo.supportLevel === 'enterprise' ? '企业级' : combo.supportLevel === 'community' ? '社区支持' : '有限支持'}
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
