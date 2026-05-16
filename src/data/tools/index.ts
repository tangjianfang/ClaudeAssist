/**
 * src/data/tools/index.ts
 * ─────────────────────────────────────────────────────────────────
 * 工具查询 API barrel。数据仍存储在 ai-ecosystem.ts 中，此文件
 * 提供类型安全的查询入口和 defineTool() 注册辅助。
 */

import { DATA_STORE } from '../ai-ecosystem';
import { getHydratedScenarioRecommendation } from '../decision-scenarios';
import type { AiModel, AiTool, AiToolCategory, AiToolFeature } from '../ai-ecosystem';
import type { DecisionScenarioId } from '../decision-scenarios';

export type { AiTool, AiToolCategory, AiToolFeature };

export type ToolDecisionFit = 'primary' | 'alternative' | 'avoid' | 'neutral';

export interface ToolWorkbenchCandidate {
  tool: AiTool;
  decisionFit: ToolDecisionFit;
  recommendedModel?: AiModel;
  monthlyCost: string;
  reasons: string[];
  risks: string[];
}

export interface ToolProfilePreview {
  tool: AiTool;
  installation: string;
  workflows: string[];
  recommendedModels: string[];
  fitSummary: string;
  riskSummary: string;
  sourceSummary: string;
  childPages: Array<{
    label: string;
    path: string;
  }>;
}

/**
 * defineTool — 类型安全的工具定义辅助，无运行时开销。
 * 使用示例：`export const myCopilot = defineTool({ id: '...', ... })`
 */
export function defineTool(tool: AiTool): AiTool {
  return tool;
}

/** 获取所有工具列表（可选过滤） */
export function getTools(filter?: {
  category?: AiToolCategory;
  vendor?: string;
  features?: AiToolFeature[];
  compatible?: string;
  chinaAccessible?: boolean;
}): AiTool[] {
  let result = DATA_STORE.tools;

  if (filter?.category) {
    result = result.filter((t) => t.category === filter.category);
  }
  if (filter?.vendor) {
    result = result.filter((t) => t.vendor === filter.vendor);
  }
  if (filter?.features && filter.features.length > 0) {
    result = result.filter((t) => filter.features!.every((f) => t.features.includes(f)));
  }
  if (filter?.compatible) {
    result = result.filter((t) => t.compatible.includes(filter.compatible!));
  }
  if (filter?.chinaAccessible !== undefined) {
    result = result.filter((t) => t.china.accessible === filter.chinaAccessible);
  }

  return result;
}

/** 按 id 查找工具；找不到返回 undefined */
export function getToolById(id: string): AiTool | undefined {
  return DATA_STORE.tools.find((t) => t.id === id);
}

/** 按名称（大小写不敏感）查找工具 */
export function getToolByName(name: string): AiTool | undefined {
  const lower = name.toLowerCase();
  return DATA_STORE.tools.find((t) => t.name.toLowerCase() === lower);
}

/** 获取所有工具 id 列表 */
export function getToolIds(): string[] {
  return DATA_STORE.tools.map((t) => t.id);
}

/** 获取去重 vendor 列表 */
export function getToolVendors(): string[] {
  return Array.from(new Set(DATA_STORE.tools.map((t) => t.vendor))).sort();
}

/** 获取去重 feature 列表 */
export function getAllToolFeatures(): AiToolFeature[] {
  return Array.from(new Set(DATA_STORE.tools.flatMap((t) => t.features))).sort() as AiToolFeature[];
}

/** 获取去重 compatible IDE 列表 */
export function getAllCompatibleIDEs(): string[] {
  return Array.from(new Set(DATA_STORE.tools.flatMap((t) => t.compatible))).sort();
}

export function getToolWorkbenchCandidates(filter?: {
  scenarioId?: DecisionScenarioId;
  chinaAccessible?: boolean;
  costTier?: 'low' | 'medium' | 'high';
  query?: string;
}): ToolWorkbenchCandidate[] {
  if (filter?.scenarioId) {
    const recommendation = getHydratedScenarioRecommendation(filter.scenarioId);
    const scenarioCandidates: ToolWorkbenchCandidate[] = [
      toScenarioCandidate(recommendation.primary),
      ...recommendation.alternatives.map(toScenarioCandidate),
      ...recommendation.avoid.map(toScenarioCandidate),
    ];

    return applyWorkbenchCandidateFilters(scenarioCandidates, filter);
  }

  const candidates = DATA_STORE.tools.map((tool): ToolWorkbenchCandidate => ({
    tool,
    decisionFit: 'neutral',
    monthlyCost: tool.pricing.plan,
    reasons: tool.pros.slice(0, 3),
    risks: tool.cons.slice(0, 2),
  }));

  return applyWorkbenchCandidateFilters(candidates, filter).sort((a, b) => averageToolScore(b.tool) - averageToolScore(a.tool));
}

export function getToolProfilePreview(toolId: string): ToolProfilePreview {
  const tool = getToolById(toolId);

  if (!tool) {
    throw new Error(`Unknown tool profile: ${toolId}`);
  }

  const isClaudeCode = tool.id === 'claude-code';

  return {
    tool,
    installation: getInstallationEntry(tool),
    workflows: getQuickWorkflows(tool),
    recommendedModels: tool.supportedModels.slice(0, 4),
    fitSummary: getFitSummary(tool),
    riskSummary: getRiskSummary(tool),
    sourceSummary: `${tool.source.label} · checked ${tool.source.checkedAt}`,
    childPages: isClaudeCode ? getClaudeCodeChildPages() : [],
  };
}

function toScenarioCandidate(option: ReturnType<typeof getHydratedScenarioRecommendation>['primary']): ToolWorkbenchCandidate {
  return {
    tool: option.tool,
    decisionFit: option.fit,
    recommendedModel: option.model,
    monthlyCost: option.monthlyCost,
    reasons: option.reasons,
    risks: option.risks,
  };
}

function applyWorkbenchCandidateFilters(
  candidates: ToolWorkbenchCandidate[],
  filter?: {
    chinaAccessible?: boolean;
    costTier?: 'low' | 'medium' | 'high';
    query?: string;
  },
): ToolWorkbenchCandidate[] {
  let result = candidates;

  if (filter?.chinaAccessible !== undefined) {
    result = result.filter((candidate) => candidate.tool.china.accessible === filter.chinaAccessible);
  }

  if (filter?.costTier) {
    result = result.filter((candidate) => candidate.tool.costTier === filter.costTier);
  }

  if (filter?.query?.trim()) {
    const query = filter.query.trim().toLowerCase();
    result = result.filter((candidate) => {
      const tool = candidate.tool;
      return [tool.name, tool.vendor, tool.category, ...tool.tags].some((value) => value.toLowerCase().includes(query));
    });
  }

  return result;
}

function averageToolScore(tool: AiTool): number {
  const values = Object.values(tool.scores);
  return values.reduce((sum, score) => sum + score, 0) / values.length;
}

function getInstallationEntry(tool: AiTool): string {
  if (tool.id === 'claude-code') return 'npm install -g @anthropic-ai/claude-code';
  if (tool.id === 'gemini-cli') return 'npm install -g @google/gemini-cli';
  if (tool.id === 'opencode') return '按官方文档安装 OpenCode CLI，并配置模型 API Key';
  if (tool.compatible.some((value) => value.toLowerCase().includes('vscode'))) return '安装对应 VS Code/编辑器扩展后登录账户';
  return '查看官方安装文档并完成账户或 API Key 配置';
}

function getQuickWorkflows(tool: AiTool): string[] {
  if (tool.id === 'claude-code') {
    return ['在终端中读取项目并生成修改计划', '跨文件编辑后运行测试验证', '把长任务拆成可 review 的提交'];
  }
  if (tool.id === 'opencode') {
    return ['使用 BYOK 接入 DeepSeek/Qwen', '让 Agent 修改多文件并通过 Git 审查', '在终端中完成低成本代码迭代'];
  }
  if (tool.features.includes('code-completion')) {
    return ['行内补全常规代码', '用聊天解释当前文件', '生成测试或重构建议'];
  }
  return ['生成代码修改建议', '处理多文件上下文', '输出可复核的实现步骤'];
}

function getFitSummary(tool: AiTool): string {
  if (tool.china.accessible && tool.costTier === 'low') return '适合低预算、国内可用优先的个人或小团队。';
  if (!tool.china.accessible) return '适合可以稳定访问海外服务，并优先追求前沿能力的团队。';
  return '适合需要在成熟能力和成本之间取得平衡的团队。';
}

function getRiskSummary(tool: AiTool): string {
  if (!tool.china.accessible) return `国内访问受限：${tool.china.note}`;
  if (tool.status === 'preview') return '仍处 preview 或快速迭代阶段，落地前需要项目内试用验证。';
  return tool.cons[0] ?? '暂无已知重大风险，仍需按项目数据和合规要求复核。';
}

function getClaudeCodeChildPages(): ToolProfilePreview['childPages'] {
  return [
    { label: 'Overview', path: '/tools/claude-code' },
    { label: 'Commands', path: '/tools/claude-code/commands' },
    { label: 'CLI Flags', path: '/tools/claude-code/cli-flags' },
    { label: 'Shortcuts', path: '/tools/claude-code/shortcuts' },
    { label: 'Settings', path: '/tools/claude-code/settings' },
    { label: 'Skills', path: '/tools/claude-code/skills' },
    { label: 'Modes', path: '/tools/claude-code/modes' },
    { label: 'Plugins', path: '/tools/claude-code/plugins' },
    { label: 'Env Vars', path: '/tools/claude-code/env-vars' },
  ];
}
