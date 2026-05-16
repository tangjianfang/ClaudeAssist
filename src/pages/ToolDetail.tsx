import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CircleCheck, CircleX, ExternalLink, Globe, ShieldAlert } from 'lucide-react';
import { getToolById } from '../data/tools/index';
import { DATA_STORE } from '../data/ai-ecosystem';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCell, MetricRow } from '../components/ui/MetricCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Panel } from '../components/ui/Panel';
import { SourceLink } from '../components/ui/SourceLink';
import { EmptyState } from '../components/ui/EmptyState';
import { TOOL_FEATURE_LABELS } from '../data/taxonomy';
import type { AiToolFeature } from '../data/ai-ecosystem';


export function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getToolById(toolId) : undefined;

  if (!tool) {
    return (
      <div className="px-4 md:px-6 py-8">
        <EmptyState
          title="工具不存在"
          description={`未找到 id 为 "${toolId}" 的工具。`}
          action={
            <Link to="/ai-tools" className="text-sm text-indigo-600 hover:underline">
              ← 返回工具列表
            </Link>
          }
        />
      </div>
    );
  }

  /* 相关组合方案 */
  const combos = DATA_STORE.toolCombinations.filter(
    (c) => c.tool === tool.name || tool.id === toolId,
  );

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/ai-tools"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={15} />
        返回工具列表
      </Link>

      {/* Header */}
      <PageHeader
        title={tool.name}
        description={`${tool.vendor} · ${tool.category}`}
        actions={
          <a
            href={tool.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink size={13} />
            {tool.source.label}
          </a>
        }
      />

      {/* Overview */}
      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">概览</h2>
        <MetricRow>
          <MetricCell label="版本" value={tool.version} />
          <MetricCell label="价格" value={tool.pricing.plan} />
          <MetricCell
            label="成本层级"
            value={tool.costTier}
            tone={tool.costTier === 'low' ? 'positive' : tool.costTier === 'medium' ? 'warning' : 'danger'}
          />
          <MetricCell label="状态" value={<StatusBadge status={tool.status ?? 'stable'} />} />
        </MetricRow>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCell label="定价备注" value={tool.pricing.notes} hint={tool.pricing.currency === 'USD' ? '单位：美元' : '单位：人民币'} />
          <MetricCell label="兼容环境" value={tool.compatible.join(' · ') || '—'} />
        </div>

        {tool.supportedModels.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">支持的模型</p>
            <div className="flex flex-wrap gap-1.5">
              {tool.supportedModels.map((m) => (
                <span key={m} className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[11px] font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </Panel>

      {/* Capabilities */}
      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">能力特征</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {tool.features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200"
            >
              <CircleCheck size={12} className="text-emerald-500 shrink-0" />
              {TOOL_FEATURE_LABELS[f as AiToolFeature] ?? f}
            </div>
          ))}
        </div>
      </Panel>

      {/* Scores */}
      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">评分</h2>
        <MetricRow>
          <MetricCell label="代码补全" value={`${tool.scores.codeCompletion} / 10`} tone={tool.scores.codeCompletion >= 8 ? 'positive' : 'neutral'} />
          <MetricCell label="代码生成" value={`${tool.scores.codeGeneration} / 10`} tone={tool.scores.codeGeneration >= 8 ? 'positive' : 'neutral'} />
          <MetricCell label="效率" value={`${tool.scores.efficiency} / 10`} tone={tool.scores.efficiency >= 8 ? 'positive' : 'neutral'} />
          <MetricCell label="准确性" value={`${tool.scores.accuracy} / 10`} tone={tool.scores.accuracy >= 8 ? 'positive' : 'neutral'} />
          <MetricCell label="上下文感知" value={`${tool.scores.contextAwareness} / 10`} tone={tool.scores.contextAwareness >= 8 ? 'positive' : 'neutral'} />
        </MetricRow>
      </Panel>

      {/* China Accessibility */}
      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Globe size={16} className="text-indigo-500" />
          国内可用性
        </h2>
        <MetricRow className="grid-cols-2 sm:grid-cols-4">
          <MetricCell
            label="可访问"
            value={tool.china.accessible ? '✓ 可用' : '✗ 受限'}
            tone={tool.china.accessible ? 'positive' : 'danger'}
          />
          <MetricCell
            label="需要代理"
            value={tool.china.needsProxy ? '是' : '否'}
            tone={tool.china.needsProxy ? 'warning' : 'positive'}
          />
          <MetricCell
            label="有替代方案"
            value={tool.china.alternativeAvailable ? '有' : '无'}
            tone={tool.china.alternativeAvailable ? 'positive' : 'neutral'}
          />
          <MetricCell label="合规说明" value={tool.china.note} />
        </MetricRow>
      </Panel>

      {/* Risk / Pros / Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Panel>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <CircleCheck size={15} className="text-emerald-500" />
            优点
          </h2>
          <ul className="space-y-1.5">
            {tool.pros.map((p) => (
              <li key={p} className="text-sm text-slate-700 dark:text-slate-300 flex gap-1.5">
                <span className="shrink-0 text-emerald-500 mt-0.5">+</span> {p}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <CircleX size={15} className="text-red-400" />
            缺点
          </h2>
          <ul className="space-y-1.5">
            {tool.cons.map((c) => (
              <li key={c} className="text-sm text-slate-700 dark:text-slate-300 flex gap-1.5">
                <span className="shrink-0 text-red-400 mt-0.5">−</span> {c}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Risk */}
      {tool.tags.includes('risk') && (
        <Panel className="border-amber-200 dark:border-amber-800">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-amber-500" />
            风险提示
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">请在实际使用前评估数据隐私和合规风险。</p>
        </Panel>
      )}

      {/* Tag badges */}
      {tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Combinations */}
      {combos.length > 0 && (
        <Panel>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">相关工具组合</h2>
          <div className="space-y-2">
            {combos.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-100 dark:border-slate-700 p-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.scenario}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Source */}
      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        来源：<SourceLink url={tool.source.url} label={tool.source.label} checkedAt={tool.source.checkedAt} />
      </div>

      {/* Compliance risk note */}

    </div>
  );
}
