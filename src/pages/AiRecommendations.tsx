import { ShieldCheck } from 'lucide-react';
import { DATA_STORE } from '../data/ai-ecosystem';

export function AiRecommendationsPage() {
  return (
    <div className="px-3 sm:px-6 py-6 sm:py-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 rounded-2xl sm:rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              <ShieldCheck size={24} className="text-emerald-500" />
              模型推荐组合
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-300">
              针对常见研发场景，综合模型能力、成本与国内可用性给出参考推荐。每个场景均附优缺点分析与风险提示。
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs h-fit shrink-0">
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">免责声明</div>
            以下推荐基于公开信息综合编辑，不构成任何商业建议，具体选型请结合实际需求评估。
          </div>
        </div>
      </div>

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {DATA_STORE.recommendations.map((rec) => (
          <article
            key={rec.scene}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 sm:p-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/30 transition-shadow"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{rec.scene}</h2>

            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                <dt className="text-slate-400 font-semibold mb-1">模型</dt>
                <dd className="text-slate-700 dark:text-slate-200">{rec.model}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                <dt className="text-slate-400 font-semibold mb-1">Agent</dt>
                <dd className="text-slate-700 dark:text-slate-200">{rec.agent}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5">
                <dt className="text-slate-400 font-semibold mb-1">工具链</dt>
                <dd className="text-slate-700 dark:text-slate-200">{rec.toolchain}</dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-300 mb-2">✓ 优点</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                  {rec.pros.map((item) => (
                    <li key={item} className="text-[11px]">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-amber-600 dark:text-amber-300 mb-2">✗ 限制</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                  {rec.cons.map((item) => (
                    <li key={item} className="text-[11px]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-3 rounded-lg bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-300">
              风险：{rec.risk}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
