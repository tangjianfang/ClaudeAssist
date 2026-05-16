import { getModelById } from './models/index';
import { getToolById } from './tools/index';
import type { AiModel, AiTool } from './ai-ecosystem';

export type DecisionScenarioId = 'china-low-cost-coding';

export interface DecisionRecommendationOption {
  toolId: string;
  modelId: string;
  monthlyCost: string;
  fit: 'primary' | 'alternative' | 'avoid';
  reasons: string[];
  risks: string[];
}

export interface DecisionScenarioRecommendation {
  id: DecisionScenarioId;
  title: string;
  shortTitle: string;
  description: string;
  userGoal: string;
  primary: DecisionRecommendationOption;
  alternatives: DecisionRecommendationOption[];
  avoid: DecisionRecommendationOption[];
  evidence: {
    sources: Array<{
      label: string;
      url: string;
      checkedAt: string;
    }>;
    freshness: string;
    unknowns: string[];
  };
  report: {
    templateId: 'scenario-recommendation';
    summary: string;
    decision: string;
  };
}

export interface HydratedDecisionRecommendationOption extends DecisionRecommendationOption {
  tool: AiTool;
  model: AiModel;
}

export interface HydratedDecisionScenarioRecommendation extends Omit<DecisionScenarioRecommendation, 'primary' | 'alternatives' | 'avoid'> {
  primary: HydratedDecisionRecommendationOption;
  alternatives: HydratedDecisionRecommendationOption[];
  avoid: HydratedDecisionRecommendationOption[];
}

const SCENARIO_RECOMMENDATIONS: Record<DecisionScenarioId, DecisionScenarioRecommendation> = {
  'china-low-cost-coding': {
    id: 'china-low-cost-coding',
    title: '国内可用 + 低成本 AI 编码方案',
    shortTitle: '国内低成本',
    description: '面向国内个人开发者和小团队：优先选择可直连、低成本、可 BYOK 的工具与模型组合。',
    userGoal: '用尽量低的月成本获得可用的 Agentic 编码、文件编辑和终端工作流，同时避免海外服务不可达。',
    primary: {
      toolId: 'opencode',
      modelId: 'deepseek-v4-flash',
      monthlyCost: '工具免费；模型按量计费，适合从低预算起步',
      fit: 'primary',
      reasons: [
        'OpenCode 本体开源免费，可自带国内模型 API Key，避免工具订阅锁定。',
        'DeepSeek V4-Flash 官方 API 国内可用，输入/输出价格适合高频编码试错。',
        '组合覆盖终端、多文件编辑、Agent 工作流和 Git 集成，能完成真实项目改动。',
      ],
      risks: [
        'OpenCode 仍处 preview 状态，企业级稳定性和生态成熟度需要项目内试用验证。',
        'DeepSeek 的复杂工具调用稳定性仍弱于头部闭源模型，长任务建议保留人工 review。',
      ],
    },
    alternatives: [
      {
        toolId: 'opencode',
        modelId: 'alibaba-qwen3-6-flash',
        monthlyCost: '工具免费；模型低价按量计费',
        fit: 'alternative',
        reasons: [
          'Qwen3.6-Flash 国内云服务渠道明确，延迟和合规路径更适合企业内网环境。',
          '价格仍在低成本区间，适合代码生成、解释和轻量 Agent 任务。',
          'OpenCode 的 BYOK 模式允许后续平滑切换模型供应商。',
        ],
        risks: [
          '推理与复杂代码规划能力弱于 DeepSeek V4-Pro 或国际前沿模型。',
        ],
      },
    ],
    avoid: [
      {
        toolId: 'gemini-cli',
        modelId: 'google-gemini-2-5-flash',
        monthlyCost: '工具免费；Gemini API 有免费层但国内不可直连',
        fit: 'avoid',
        reasons: [
          'Gemini CLI 能力强，但 Google AI 服务在中国大陆不可直连。',
          '如果目标是国内稳定可用，它会把主要风险转移到网络和账号可用性。',
          '免费层对海外个人开发者友好，但不符合本场景的可访问优先级。',
        ],
        risks: [
          '需要合规海外网络；团队成员环境不一致时很难作为默认方案。',
        ],
      },
    ],
    evidence: {
      sources: [
        { label: 'OpenCode GitHub (SST)', url: 'https://github.com/sst/opencode', checkedAt: '2026-05-16' },
        { label: 'DeepSeek API 定价', url: 'https://api-docs.deepseek.com/quick_start/pricing/', checkedAt: '2026-05-15' },
        { label: '阿里云 Model Studio 定价', url: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing', checkedAt: '2026-05-15' },
      ],
      freshness: '核心工具与模型来源均在 2026-05-15 至 2026-05-16 核验。',
      unknowns: [
        'OpenCode preview 阶段的长期兼容性仍需按团队项目验证。',
        '模型价格和折扣可能随厂商政策调整，正式采购前需要复核官方定价页。',
      ],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 OpenCode + DeepSeek V4-Flash 作为国内低成本 AI 编码默认组合；Qwen3.6-Flash 作为合规和延迟优先的备选。',
      decision: '先用 OpenCode 的 BYOK 形态承载工作流，再按任务复杂度在 DeepSeek V4-Flash 与 Qwen3.6-Flash 之间切换。',
    },
  },
};

function hydrateOption(option: DecisionRecommendationOption): HydratedDecisionRecommendationOption {
  const tool = getToolById(option.toolId);
  const model = getModelById(option.modelId);

  if (!tool) {
    throw new Error(`Decision scenario references missing tool: ${option.toolId}`);
  }
  if (!model) {
    throw new Error(`Decision scenario references missing model: ${option.modelId}`);
  }

  return { ...option, tool, model };
}

export function getScenarioRecommendation(id: DecisionScenarioId): DecisionScenarioRecommendation {
  return SCENARIO_RECOMMENDATIONS[id];
}

export function getHydratedScenarioRecommendation(id: DecisionScenarioId): HydratedDecisionScenarioRecommendation {
  const recommendation = getScenarioRecommendation(id);
  return {
    ...recommendation,
    primary: hydrateOption(recommendation.primary),
    alternatives: recommendation.alternatives.map(hydrateOption),
    avoid: recommendation.avoid.map(hydrateOption),
  };
}

export function getDecisionScenarioIds(): DecisionScenarioId[] {
  return Object.keys(SCENARIO_RECOMMENDATIONS) as DecisionScenarioId[];
}
