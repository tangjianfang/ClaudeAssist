import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, CircleCheck, ExternalLink, Target } from 'lucide-react';
import { getHydratedScenarioRecommendation } from '../../data/decision-scenarios';
import { Panel } from '../ui/Panel';
import { StatusBadge } from '../ui/StatusBadge';
import { SourceLink } from '../ui/SourceLink';

const recommendation = getHydratedScenarioRecommendation('china-low-cost-coding');

export function DecisionWorkbench() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            AI Decision Lab
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            从场景直接得到工具、模型与风险结论
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            当前纵切先覆盖“{recommendation.title}”：不再让你从一堆卡片里猜，而是直接给出首选组合、备选组合、不要选的方案和来源依据。
          </p>
        </div>
        <Link
          to="/ai-tools"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:opacity-90 transition-opacity"
        >
          打开工具工作台
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_320px] gap-4">
        <Panel className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">场景</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              先从使用约束出发，而不是从厂商列表出发。
            </p>
          </div>
          <button className="w-full rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-3 text-left">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              已选场景
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-900 dark:text-slate-100">
              {recommendation.shortTitle}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-300">
              {recommendation.userGoal}
            </span>
          </button>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            下一步会补齐企业安全、本地隐私、最快原型和多 Agent 工作流。当前先把一条真实决策链跑通。
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                  <CircleCheck size={13} />
                  首选组合
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">
                  {recommendation.primary.tool.name} + {recommendation.primary.model.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {recommendation.report.summary}
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-right">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">月成本判断</p>
                <p className="mt-1 max-w-56 text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {recommendation.primary.monthlyCost}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DecisionEntityCard
                label="工具"
                name={recommendation.primary.tool.name}
                vendor={recommendation.primary.tool.vendor}
                meta={`${recommendation.primary.tool.pricing.plan} · ${recommendation.primary.tool.china.accessible ? '国内可用' : '国内受限'}`}
                href={`/tools/${recommendation.primary.tool.id}`}
                status={recommendation.primary.tool.status}
              />
              <DecisionEntityCard
                label="模型"
                name={recommendation.primary.model.name}
                vendor={recommendation.primary.model.vendor}
                meta={`${recommendation.primary.model.pricing.inputPerMTokens} 输入 / ${recommendation.primary.model.pricing.outputPerMTokens} 输出`}
                href="/ai-ecosystem"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ReasonList title="为什么选它" items={recommendation.primary.reasons} tone="positive" />
              <ReasonList title="需要盯住的风险" items={recommendation.primary.risks} tone="warning" />
            </div>
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendation.alternatives.map((option) => (
              <Panel key={`${option.toolId}-${option.modelId}`} className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-300">备选</p>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {option.tool.name} + {option.model.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{option.monthlyCost}</p>
                <ul className="space-y-1.5">
                  {option.reasons.slice(0, 2).map((reason) => (
                    <li key={reason} className="flex gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      <CircleCheck size={12} className="mt-1 shrink-0 text-blue-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
            {recommendation.avoid.map((option) => (
              <Panel key={`${option.toolId}-${option.modelId}`} className="space-y-3 border-amber-200 dark:border-amber-800">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">不作为默认</p>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {option.tool.name} + {option.model.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{option.monthlyCost}</p>
                <ul className="space-y-1.5">
                  {option.reasons.slice(0, 2).map((reason) => (
                    <li key={reason} className="flex gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      <CircleAlert size={12} className="mt-1 shrink-0 text-amber-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </div>

        <Panel className="space-y-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <Target size={13} />
              报告结论
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {recommendation.report.decision}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">来源</h3>
            <div className="mt-2 space-y-2">
              {recommendation.evidence.sources.map((source) => (
                <SourceLink key={source.url} url={source.url} label={source.label} checkedAt={source.checkedAt} />
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {recommendation.evidence.freshness}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">未确认项</h3>
            <ul className="mt-2 space-y-1.5">
              {recommendation.evidence.unknowns.map((item) => (
                <li key={item} className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function DecisionEntityCard({
  label,
  name,
  vendor,
  meta,
  href,
  status,
}: {
  label: string;
  name: string;
  vendor: string;
  meta: string;
  href: string;
  status?: 'stable' | 'preview' | 'unverified' | 'deprecated';
}) {
  return (
    <Link
      to={href}
      className="block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
          <h3 className="mt-1 text-sm font-bold text-slate-950 dark:text-white">{name}</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{vendor}</p>
        </div>
        <ExternalLink size={13} className="shrink-0 text-slate-400" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span>{meta}</span>
        {status && <StatusBadge status={status} />}
      </div>
    </Link>
  );
}

function ReasonList({ title, items, tone }: { title: string; items: string[]; tone: 'positive' | 'warning' }) {
  const Icon = tone === 'positive' ? CircleCheck : CircleAlert;
  const iconClass = tone === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400';

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            <Icon size={14} className={`mt-1 shrink-0 ${iconClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
