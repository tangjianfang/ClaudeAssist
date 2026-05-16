import { getModelById } from './models/index';
import { getToolById } from './tools/index';
import type { AiModel, AiTool } from './ai-ecosystem';

export type DecisionScenarioId = 'china-low-cost-coding' | 'enterprise-reliability-coding';

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
  'enterprise-reliability-coding': {
    id: 'enterprise-reliability-coding',
    title: '企业级高可靠性 AI 编码方案',
    shortTitle: '企业级高可靠',
    description: '面向企业研发团队和金融科技公司：优先选择生产级稳定性、支持企业部署、可审计追溯的工具与模型组合。',
    userGoal: '在严格的合规、安全和可靠性要求下，获得高质量的代码生成、审查和重构能力，同时支持团队协作和企业级服务保障。',
    primary: {
      toolId: 'claude-code',
      modelId: 'claude-opus-4-plus',
      monthlyCost: 'Claude Code $20/月；模型通过 Claude API 按量计费或企业合约',
      fit: 'primary',
      reasons: [
        'Claude Code 是成熟的生产级工具，支持企业级功能如代码审查、多文件编辑和工作流集成，已被数千家企业采用。',
        'Claude 3.7 Opus 在复杂推理、长上下文代码分析和工具调用稳定性上超过开源模型和国内模型，适合金融和医疗等高风险场景。',
        '支持企业部署方案、合同级 SLA、完整审计日志和合规认证（SOC 2、ISO 等），满足严格监管要求。',
      ],
      risks: [
        '国内直接访问需要合规安排，企业可采用 API 代理或私有部署方案，但需要额外的基础设施投入。',
        '订阅费用相比开源方案较高，企业需评估 ROI；但稳定性和支持价值通常可以抵消成本。',
      ],
    },
    alternatives: [
      {
        toolId: 'cursor',
        modelId: 'claude-opus-4-plus',
        monthlyCost: 'Cursor 订阅 $20/月；Claude API 按量计费或企业合约',
        fit: 'alternative',
        reasons: [
          'Cursor 是广泛使用的商业级编辑器，与 Claude 集成紧密，UI/UX 对开发者友好且功能丰富。',
          'Claude Opus 提供与 Claude Code 相同的推理和代码质量，通过 Cursor 界面使用同样可靠。',
          '企业可根据 Cursor 的定价和功能灵活选择，同时保留 Claude 的稳定性和企业支持选项。',
        ],
        risks: [
          'Cursor 作为第三方工具，企业级支持和合规认证不如 Anthropic 原生产品完整。',
          '需要确认 Cursor 的隐私政策和数据处理流程是否符合企业内部安全标准。',
        ],
      },
      {
        toolId: 'jetbrains-ai',
        modelId: 'claude-opus-4-plus',
        monthlyCost: 'JetBrains All Products 企业订阅；Claude API 按量计费或企业合约',
        fit: 'alternative',
        reasons: [
          'JetBrains IDE 是企业 Java/Kotlin 开发的标准工具，深度集成的 AI 功能提供无缝工作流。',
          'Claude Opus 通过 JetBrains AI 使用可获得同等推理能力，同时保留 IDE 的完整工具链支持。',
          '企业可通过 JetBrains 统一许可管理，降低采购和部署复杂性。',
        ],
        risks: [
          'JetBrains 的 AI 功能相比 Claude Code/Cursor 仍在演进中，某些高级工作流可能不如专业 AI 工具完整。',
          'IDE 重度依赖可能限制跨平台灵活性；企业需评估是否适合多语言和微服务架构团队。',
        ],
      },
    ],
    avoid: [
      {
        toolId: 'deepseek-tui',
        modelId: 'deepseek-v4-pro',
        monthlyCost: 'DeepSeek API 按量计费，相比 Claude 便宜 50-70%',
        fit: 'avoid',
        reasons: [
          'DeepSeek V4-Pro 虽然在中文代码生成上表现不错，但在多语言混合、复杂推理和工具链集成上仍弱于 Opus。',
          'DeepSeek TUI 是社区工具而非商业级产品，不提供企业级 SLA、审计日志或安全合规认证。',
          '对于需要完整可追溯性和审计的企业场景，缺乏必要的企业级功能和支持承诺。',
        ],
        risks: [
          '如果后续遭遇关键 bug 或性能问题，社区支持响应速度和企业级修复承诺不可靠。',
          '某些企业的安全审查和合规部门可能不接受非商业化、无企业支持的工具在生产环境中使用。',
        ],
      },
    ],
    evidence: {
      sources: [
        { label: 'Claude Code 官方文档', url: 'https://claude.ai/code', checkedAt: '2026-05-16' },
        { label: 'Claude API 定价和企业方案', url: 'https://www.anthropic.com/pricing', checkedAt: '2026-05-16' },
        { label: 'Anthropic 企业合规认证', url: 'https://www.anthropic.com/security', checkedAt: '2026-05-16' },
        { label: 'Cursor 官方网站', url: 'https://www.cursor.com/', checkedAt: '2026-05-15' },
        { label: 'JetBrains AI 集成指南', url: 'https://www.jetbrains.com/help/idea/ai-assistant.html', checkedAt: '2026-05-15' },
      ],
      freshness: '企业级工具、API 定价和合规信息均在 2026-05-15 至 2026-05-16 核验；企业部署方案需企业与厂商直接沟通。',
      unknowns: [
        '不同企业对"高可靠性"和"合规"的定义存在差异，选择需根据具体行业和地域法规调整。',
        'Claude API 企业合约定价和 SLA 条款因客户规模和需求不同有较大差异，正式采购前需直接咨询 Anthropic。',
        '国内企业部署 Claude 相关工具涉及网络和数据合规，需单独评估和规划。',
      ],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 Claude Code + Claude Opus 作为企业级高可靠性编码默认方案；Cursor + Opus 和 JetBrains + Opus 作为工具选型灵活的备选。',
      decision: '优先选择 Claude Code 以获得端到端的企业支持和安全保障；如企业已有 Cursor 或 JetBrains 投资，可保留工具选择灵活性。',
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
