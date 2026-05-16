import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CircleCheck, CircleX, ExternalLink, Globe, ShieldAlert } from 'lucide-react';
import { getToolById } from '../data/tools/index';
import { sectionEntries } from '../data';
import { PageHeader } from '../components/layout/PageHeader';
import { CommandCard } from '../components/CommandCard';
import { MetricCell, MetricRow } from '../components/ui/MetricCell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Panel } from '../components/ui/Panel';
import { SourceLink } from '../components/ui/SourceLink';
import { EmptyState } from '../components/ui/EmptyState';
import { TOOL_FEATURE_LABELS } from '../data/taxonomy';
import type { AiToolFeature } from '../data/ai-ecosystem';
import type { SectionId } from '../data/types';


export function ToolDetailPage() {
  const { toolId, knowledgeId } = useParams<{ toolId: string; knowledgeId?: string }>();
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

  const childPage = knowledgeId ? TOOL_CHILD_PAGE_MAP[tool.id]?.[knowledgeId] : undefined;
  const childEntries = childPage?.sectionId ? sectionEntries[childPage.sectionId] ?? [] : [];

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
        description={childPage ? `${tool.name} · ${childPage.label}` : `${tool.vendor} · ${tool.category}`}
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

      {childPage && (
        <Panel className="border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            AI Coding Tools / {tool.name}
          </p>
          <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{childPage.label}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {childPage.description}
          </p>
          {childPage.legacyPath && (
            <Link
              to={childPage.legacyPath}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
            >
              打开现有参考内容
              <ExternalLink size={13} />
            </Link>
          )}
          {childPage.highlights && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {childPage.highlights.map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          )}
          {childEntries.length > 0 && (
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {childEntries.map((entry) => (
                <CommandCard key={entry.id} entry={entry} activeTag={null} onTagClick={() => undefined} />
              ))}
            </div>
          )}
        </Panel>
      )}

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

      {/* Source */}
      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        来源：<SourceLink url={tool.source.url} label={tool.source.label} checkedAt={tool.source.checkedAt} />
      </div>

      {/* Compliance risk note */}

    </div>
  );
}

type ToolChildPage = {
  label: string;
  description: string;
  legacyPath?: string;
  sectionId: SectionId | null;
  highlights?: string[];
};

const TOOL_CHILD_PAGE_MAP: Record<string, Record<string, ToolChildPage>> = {
  'claude-code': {
    onboarding: {
      label: '初次使用',
      legacyPath: '/scenarios',
      sectionId: null,
      description: 'Claude Code 的初学内容现在独立归到 Claude Code profile 下，避免和通用 AI 场景决策混在一起。',
      highlights: ['从 /help、/init 和项目上下文开始', '先让 Claude 读仓库并给计划，再执行修改', '每次修改后运行测试或构建验证'],
    },
    commands: { label: 'Commands', legacyPath: '/slash-commands', sectionId: 'slash-commands', description: 'Claude Code 内置 slash commands 的完整参考。' },
    'cli-flags': { label: 'CLI Flags', legacyPath: '/cli-flags', sectionId: 'cli-flags', description: 'Claude Code CLI 启动参数、认证和脚本化入口。' },
    shortcuts: { label: 'Shortcuts', legacyPath: '/shortcuts', sectionId: 'shortcuts', description: 'Claude Code 交互会话中的键盘快捷键。' },
    settings: { label: 'Settings', legacyPath: '/settings', sectionId: 'settings', description: 'Claude Code 用户级、项目级和企业级配置项。' },
    skills: { label: 'Skills', legacyPath: '/skills', sectionId: 'skills', description: 'Claude Code 内置或自定义 skill 的调用方式与适用场景。' },
    modes: { label: 'Modes', legacyPath: '/modes', sectionId: 'modes', description: 'Claude Code 特殊运行模式和行为差异。' },
    plugins: { label: 'Plugins', legacyPath: '/plugins', sectionId: null, description: 'Claude Code 插件生态、安装入口和风险边界。' },
    'env-vars': { label: 'Env Vars', legacyPath: '/env-vars', sectionId: 'env-vars', description: '影响 Claude Code 行为的环境变量参考。' },
  },
  opencode: {
    setup: { label: '安装与配置', sectionId: null, description: 'OpenCode 的核心价值是开源、BYOK 和终端工作流，落地前先确认安装方式、API Key 管理和项目权限。', highlights: ['按官方文档安装 OpenCode CLI', '用环境变量或配置文件接入 DeepSeek/Qwen/OpenAI 等模型', '把 Git diff 和测试命令作为默认验收闭环'] },
    models: { label: '模型接入', sectionId: null, description: 'OpenCode 适合承载多模型策略：低成本任务走 DeepSeek/Qwen，复杂规划任务切到 Claude/OpenAI。', highlights: ['DeepSeek V4-Flash：高频低成本迭代', 'Qwen3.6-Flash/Plus：国内链路和中文需求', 'Claude/OpenAI：复杂重构和高风险 review'] },
    workflows: { label: '工作流', sectionId: null, description: 'OpenCode 更像可替换模型后端的 CLI Agent，适合小团队把编码、测试和 Git 审查串起来。', highlights: ['让 Agent 先写计划再修改文件', '每轮变更后查看 diff 并运行测试', '把长任务拆成可回滚的小步提交'] },
    risks: { label: '风险与适配', sectionId: null, description: 'OpenCode 仍需按团队项目验证 preview 稳定性、模型工具调用表现和密钥治理。', highlights: ['避免把生产密钥暴露给模型上下文', '复杂多步任务保留人工 review', '企业落地需统一审计和供应商策略'] },
  },
  'gemini-cli': {
    setup: { label: '认证与安装', sectionId: null, description: 'Gemini CLI 适合可以稳定访问 Google AI 服务的用户，重点是账号、API Key 和本地项目权限配置。', highlights: ['确认 Google AI Studio 或 Vertex AI 访问路径', '配置 API Key 与项目配额', '在代码目录内限定文件访问和执行命令范围'] },
    models: { label: 'Gemini 模型', sectionId: null, description: 'Gemini CLI 的模型能力集中在长上下文、多模态和快速低成本变体。', highlights: ['Gemini 3.1 Pro：前沿推理和多模态', 'Gemini 2.5 Pro：1M 上下文资料研读', 'Gemini Flash：快速低成本代码解释和生成'] },
    workflows: { label: '长上下文工作流', sectionId: null, description: 'Gemini CLI 适合整仓阅读、文档总结、日志分析和多模态资料辅助，但提交前仍要本地验证。', highlights: ['整仓结构梳理和重构计划', '长日志/长文档归纳', '用测试和静态检查验证代码输出'] },
    risks: { label: '访问与合规', sectionId: null, description: 'Google AI 服务在中国大陆多数网络环境不可直连，团队默认方案需要先解决合规访问和账号一致性。', highlights: ['跨境数据合规需单独评估', '免费层有速率限制', '企业更适合走正式云账号和配额治理'] },
  },
  'github-copilot-cli': {
    setup: { label: '安装与登录', sectionId: null, description: 'GitHub Copilot CLI 适合 GitHub 生态用户，重点是 GitHub 账号、Copilot 权限和本机 shell 集成。', highlights: ['确认 Copilot 订阅或企业许可', '完成 GitHub 认证', '把命令建议限定在可 review 的 shell 工作流中'] },
    commands: { label: '命令能力', sectionId: null, description: 'Copilot CLI 更偏命令解释、命令生成和 GitHub 工作流辅助，而不是完整多文件自主 Agent。', highlights: ['解释复杂 shell 命令', '生成 git/gh/npm 等常见命令', '把自然语言转换成可确认的终端操作'] },
    workflows: { label: 'GitHub 工作流', sectionId: null, description: '它适合和 gh CLI、GitHub Issues、PR review 流程组合，帮助用户更快完成仓库维护动作。', highlights: ['生成 PR/issue 相关命令', '辅助定位 CI 和 Git 操作', '与 IDE 中的 Copilot Chat 互补'] },
    enterprise: { label: '企业适配', sectionId: null, description: '企业采用时主要看 GitHub Enterprise、组织策略、数据保留和审计能力。', highlights: ['统一管理 Copilot seats', '配置组织级策略', '审查命令执行和敏感仓库边界'] },
  },
};
