import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CircleCheck, CircleX, ExternalLink } from 'lucide-react';
import { getModelById } from '../data/models/index';
import { SCORE_KEYS, SCORE_LABELS } from '../data/ai-ecosystem';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricCell, MetricRow } from '../components/ui/MetricCell';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel } from '../components/ui/Panel';
import { SourceLink } from '../components/ui/SourceLink';

const CATEGORY_LABELS = {
  frontier: '前沿通用',
  coding: '编程强项',
  reasoning: '推理优先',
  multimodal: '多模态/长上下文',
  open: '开放/可本地',
};

const COST_LABELS = {
  low: '低成本',
  medium: '中等成本',
  high: '高成本',
};

export function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? getModelById(modelId) : undefined;

  if (!model) {
    return (
      <div className="px-4 md:px-6 py-8">
        <EmptyState
          title="模型不存在"
          description={`未找到 id 为 "${modelId}" 的模型。`}
          action={
            <Link to="/ai-ecosystem" className="text-sm text-indigo-600 hover:underline">
              返回模型工作台
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
      <Link
        to="/ai-ecosystem"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={15} />
        返回模型工作台
      </Link>

      <PageHeader
        title={model.name}
        description={`${model.vendor} · ${CATEGORY_LABELS[model.category]} · ${model.contextWindow}`}
        actions={
          <a
            href={model.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ExternalLink size={13} />
            {model.source.label}
          </a>
        }
      />

      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">能力概览</h2>
        <MetricRow>
          <MetricCell label="分类" value={CATEGORY_LABELS[model.category]} />
          <MetricCell label="成本层级" value={COST_LABELS[model.costTier]} tone={model.costTier === 'low' ? 'positive' : model.costTier === 'medium' ? 'warning' : 'danger'} />
          <MetricCell label="上下文窗口" value={model.contextWindow} />
          <MetricCell label="最大输出" value={model.capability?.maxOutput ?? '官方未明确'} />
        </MetricRow>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricCell label="工具调用" value={model.capability?.toolUse ? '支持' : '未确认'} tone={model.capability?.toolUse ? 'positive' : 'neutral'} />
          <MetricCell label="结构化输出" value={model.capability?.structuredOutput ? '支持' : '未确认'} tone={model.capability?.structuredOutput ? 'positive' : 'neutral'} />
          <MetricCell label="输入模态" value={model.capability?.multimodalIn?.join(' / ') ?? 'text'} />
          <MetricCell label="部署形态" value={model.capability?.deployment?.join(' / ') ?? 'cloud'} />
        </div>
      </Panel>

      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">能力评分</h2>
        <div className="space-y-3">
          {SCORE_KEYS.map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">{SCORE_LABELS[key]}</span>
                <span className="text-slate-500 dark:text-slate-400">{model.scores[key].toFixed(1)} / 10</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${model.scores[key] * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">定价与访问</h2>
        <MetricRow>
          <MetricCell label="输入 / 1M tokens" value={model.pricing.inputPerMTokens} />
          <MetricCell label="输出 / 1M tokens" value={model.pricing.outputPerMTokens} />
          <MetricCell label="缓存输入" value={model.pricing.cachedInputPerMTokens ?? '官方未列出'} />
          <MetricCell label="免费层" value={model.pricing.freeTier ?? '无或未列出'} />
        </MetricRow>
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
          {model.pricing.notes}
        </p>
      </Panel>

      <Panel>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">国内可用性与限制</h2>
        <MetricRow>
          <MetricCell label="国内直连" value={model.china.accessible ? '可用' : '受限'} tone={model.china.accessible ? 'positive' : 'warning'} />
          <MetricCell label="需要代理" value={model.china.needsProxy ? '是' : '否'} tone={model.china.needsProxy ? 'warning' : 'positive'} />
          <MetricCell label="本地部署" value={model.china.localDeploy ? '支持' : '不支持'} />
          <MetricCell label="合规风险" value={model.china.complianceRisk} />
        </MetricRow>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{model.china.note}</p>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Panel>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <CircleCheck size={15} className="text-emerald-500" />
            适合能力
          </h2>
          <ul className="space-y-1.5">
            {model.pros.map((item) => (
              <li key={item} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
            <CircleX size={15} className="text-amber-500" />
            使用限制
          </h2>
          <ul className="space-y-1.5">
            {model.cons.map((item) => (
              <li key={item} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        来源：<SourceLink url={model.source.url} label={model.source.label} checkedAt={model.source.checkedAt} />
      </div>
    </div>
  );
}
