import { getModelById } from './models/index';
import { getToolById } from './tools/index';
import type { AiModel, AiTool } from './ai-ecosystem';

export type DecisionScenarioId =
  | 'first-ai-coding-tool'
  | 'china-low-cost-coding'
  | 'china-high-performance-coding'
  | 'enterprise-reliability-coding'
  | 'privacy-local-coding'
  | 'long-context-research-coding';

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
  'first-ai-coding-tool': {
    id: 'first-ai-coding-tool',
    title: '初次选择 AI 编码工具',
    shortTitle: '首次上手',
    description: '面向刚开始使用 AI 编码的个人开发者：优先选择学习成本低、体验完整、容易回滚的工具与模型组合。',
    userGoal: '快速建立可靠的 AI 编码习惯，能解释代码、生成小改动、跑测试，并且不会一上来陷入复杂配置。',
    primary: {
      toolId: 'cursor-ide',
      modelId: 'anthropic-claude-sonnet-4-6',
      monthlyCost: 'Cursor 订阅约 $20/月；模型能力随套餐或 API 配置变化',
      fit: 'primary',
      reasons: [
        'Cursor 把聊天、上下文选择、diff 应用和回滚放在同一个编辑器里，新手心智负担低。',
        'Claude Sonnet 4.6 在日常编码、解释和重构中质量/速度平衡好，不必一开始使用最贵模型。',
        '适合先养成“小步修改、查看 diff、运行测试”的工作习惯。',
      ],
      risks: [
        '国内访问和账号可用性需要提前确认。',
        '新手容易一次性接受过大 diff，建议限制每轮任务范围。',
      ],
    },
    alternatives: [
      {
        toolId: 'github-copilot-individual',
        modelId: 'openai-gpt-5-4-mini',
        monthlyCost: 'Copilot Individual 订阅；模型由 GitHub 托管选择',
        fit: 'alternative',
        reasons: ['VS Code/GitHub 用户上手顺滑，补全和解释体验稳定。', '适合先从补全、Chat 和简单命令辅助开始。'],
        risks: ['深度 Agentic 多文件自主修改不如专门 Agent 工具直接。'],
      },
      {
        toolId: 'claude-code',
        modelId: 'anthropic-claude-sonnet-4-6',
        monthlyCost: 'Claude Code 订阅或 Claude API 按量计费',
        fit: 'alternative',
        reasons: ['适合愿意用终端工作流的新手，计划、修改和验证链路清晰。', '和 Claude 模型配合时复杂代码理解能力强。'],
        risks: ['终端权限、文件修改和命令执行需要更谨慎地学习。'],
      },
    ],
    avoid: [
      {
        toolId: 'openhands',
        modelId: 'anthropic-claude-opus-4-7',
        monthlyCost: '自主 Agent 基础设施 + 高端模型按量计费',
        fit: 'avoid',
        reasons: ['自主 Agent 能力强，但配置、权限和失败排查成本对新手偏高。', '首次上手阶段更需要可解释、可回滚的小步反馈。'],
        risks: ['容易把学习问题变成环境和权限问题。'],
      },
    ],
    evidence: {
      sources: [
        { label: 'Cursor 官方网站', url: 'https://www.cursor.com/', checkedAt: '2026-05-15' },
        { label: 'Anthropic Claude models', url: 'https://platform.claude.com/docs/en/docs/about-claude/models/overview', checkedAt: '2026-05-15' },
        { label: 'GitHub Copilot plans', url: 'https://github.com/features/copilot/plans', checkedAt: '2026-05-15' },
      ],
      freshness: '工具入口、模型能力和套餐信息均基于官方或主流公开资料核验。',
      unknowns: ['不同地区账号和网络可达性会影响新手体验。', '实际模型可选项可能随套餐和产品策略变化。'],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 Cursor + Claude Sonnet 作为首次 AI 编码默认组合；Copilot 和 Claude Code 分别适合 VS Code/GitHub 用户与终端用户。',
      decision: '先选择低学习成本、可回滚的编辑器内工作流，等形成验证习惯后再升级到更自主的 Agent 工具。',
    },
  },
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
  'china-high-performance-coding': {
    id: 'china-high-performance-coding',
    title: '国内高性能 AI 编码能力栈',
    shortTitle: '国内高性能',
    description: '面向国内专业开发者和高要求团队：优先搭建可直连、强 Agent、多模型备份的最高性能 AI 编码能力。',
    userGoal: '在不依赖海外服务直连的前提下，获得尽可能强的代码理解、多文件重构、工具调用和长任务执行能力。',
    primary: {
      toolId: 'aider-cli',
      modelId: 'moonshot-kimi-k2-6',
      monthlyCost: 'Aider 免费开源；Kimi K2.6 API 按量计费，适合高价值复杂任务优先使用',
      fit: 'primary',
      reasons: [
        'Aider 深度集成 Git 和多文件 diff，适合把复杂改动拆成可审查、可回滚的工程步骤。',
        'Kimi K2.6 在当前数据集中具备突出的编码和工具调用评分，且国内 API 可直连。',
        '组合适合搭建“高性能默认能力层”：复杂规划、跨文件重构、测试修复和长任务执行优先走这条链路。',
      ],
      risks: [
        '纯 CLI 工作流对团队成员有一定门槛，需要统一 Git 分支、diff review 和测试规范。',
        '高性能模型成本高于 Flash/轻量模型，应按任务价值分层调用，避免所有请求都走旗舰模型。',
      ],
    },
    alternatives: [
      {
        toolId: 'cline-extension',
        modelId: 'alibaba-qwen3-6-max',
        monthlyCost: 'Cline 免费开源；Qwen3.6-Max 通过阿里云 Model Studio 按量计费',
        fit: 'alternative',
        reasons: [
          'Cline 在 VS Code 内提供文件系统、终端和多步骤 Agent 工作流，更适合偏 IDE 的团队。',
          'Qwen3.6-Max 国内合规渠道成熟，推理、编码和工具调用能力均衡。',
          '适合企业希望使用阿里云通道、统一账号和账单治理的高性能方案。',
        ],
        risks: [
          'Cline 的 Agent 权限较强，需要明确命令执行和敏感目录边界。',
          'Qwen Max 长上下文和高输出任务需要预算控制。',
        ],
      },
      {
        toolId: 'continue-dev',
        modelId: 'zhipu-glm-5-1',
        monthlyCost: 'Continue 免费开源；GLM-5.1 通过智谱开放平台按量计费或企业采购',
        fit: 'alternative',
        reasons: [
          'Continue 支持 VS Code/JetBrains 多 IDE 和多模型配置，适合团队渐进推广。',
          'GLM-5.1 国内合规友好，企业 SLA、数据协议和工具调用场景更容易进入采购流程。',
          '适合作为高性能能力栈中的企业合规备份链路。',
        ],
        risks: [
          '复杂多文件自动修改能力弱于 Aider/Cline 这类强 Agent 工作流。',
          '模型能力、额度和企业策略需要在正式采购前复核。',
        ],
      },
    ],
    avoid: [
      {
        toolId: 'opencode',
        modelId: 'deepseek-v4-flash',
        monthlyCost: '工具免费；模型低价按量计费',
        fit: 'avoid',
        reasons: [
          'OpenCode + DeepSeek V4-Flash 很适合低成本高频迭代，但不是“最高性能”默认链路。',
          'Flash 模型更适合批量解释、轻量生成和快速试错，高风险重构应升级到 Kimi/Qwen Max/GLM 等高能力模型。',
        ],
        risks: [
          '如果把低成本链路用于关键复杂任务，可能增加返工、误改和人工 review 成本。',
        ],
      },
    ],
    evidence: {
      sources: [
        { label: 'Aider 官方文档', url: 'https://aider.chat', checkedAt: '2026-05-16' },
        { label: 'Kimi API 定价', url: 'https://platform.kimi.ai/docs/pricing/chat-k2.6', checkedAt: '2026-05-15' },
        { label: 'Cline GitHub', url: 'https://github.com/cline/cline', checkedAt: '2026-05-16' },
        { label: '阿里云 Model Studio 定价', url: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing', checkedAt: '2026-05-15' },
        { label: '智谱AI 开放平台', url: 'https://open.bigmodel.cn/pricing', checkedAt: '2026-05-15' },
      ],
      freshness: '工具、模型能力和价格来源均来自官方或主流公开资料，核验时间集中在 2026-05-15 至 2026-05-16。',
      unknowns: [
        '“最高性能”会随模型版本快速变化，应定期复核 Kimi、Qwen、GLM、DeepSeek 的旗舰版本和评测表现。',
        '不同团队的代码库规模、语言栈和权限策略会影响 Aider/Cline/Continue 的实际效果。',
        '正式落地前需要用团队真实任务做小样本评测：规划质量、diff 正确率、测试通过率和人工 review 成本。',
      ],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 Aider + Kimi K2.6 作为国内最高性能 AI 编码主链路；Cline + Qwen3.6-Max 和 Continue + GLM-5.1 作为 IDE Agent 与企业合规备选。',
      decision: '以 Aider + Kimi K2.6 承担复杂重构和高价值任务，用 Qwen Max/GLM 作为 IDE 与合规备份，用 Flash/低成本模型承接轻量批处理。',
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
      modelId: 'anthropic-claude-opus-4-7',
      monthlyCost: 'Claude Code $20/月；模型通过 Claude API 按量计费或企业合约',
      fit: 'primary',
      reasons: [
        'Claude Code 是成熟的生产级工具，支持企业级功能如代码审查、多文件编辑和工作流集成，已被数千家企业采用。',
        'Claude Opus 4.7 是当前企业高可靠场景的旗舰选择，在复杂推理、长上下文代码分析和工具调用稳定性上表现突出，适合金融和医疗等高风险场景。',
        '支持企业部署方案、合同级 SLA、完整审计日志和合规认证（SOC 2、ISO 等），满足严格监管要求。',
      ],
      risks: [
        '国内直接访问需要合规安排，企业可采用 API 代理或私有部署方案，但需要额外的基础设施投入。',
        '订阅费用相比开源方案较高，企业需评估 ROI；但稳定性和支持价值通常可以抵消成本。',
      ],
    },
    alternatives: [
      {
        toolId: 'cursor-ide',
        modelId: 'anthropic-claude-opus-4-7',
        monthlyCost: 'Cursor 订阅 $20/月；Claude API 按量计费或企业合约',
        fit: 'alternative',
        reasons: [
          'Cursor 是广泛使用的商业级编辑器，与 Claude 集成紧密，UI/UX 对开发者友好且功能丰富。',
          'Claude Opus 4.7 提供与 Claude Code 主链路一致的旗舰推理和代码质量，通过 Cursor 界面使用同样可靠。',
          '企业可根据 Cursor 的定价和功能灵活选择，同时保留 Claude 的稳定性和企业支持选项。',
        ],
        risks: [
          'Cursor 作为第三方工具，企业级支持和合规认证不如 Anthropic 原生产品完整。',
          '需要确认 Cursor 的隐私政策和数据处理流程是否符合企业内部安全标准。',
        ],
      },
      {
        toolId: 'jetbrains-ai-assistant',
        modelId: 'anthropic-claude-opus-4-7',
        monthlyCost: 'JetBrains All Products 企业订阅；Claude API 按量计费或企业合约',
        fit: 'alternative',
        reasons: [
          'JetBrains IDE 是企业 Java/Kotlin 开发的标准工具，深度集成的 AI 功能提供无缝工作流。',
          'Claude Opus 4.7 通过 JetBrains AI 使用可获得同等旗舰推理能力，同时保留 IDE 的完整工具链支持。',
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
        toolId: 'opencode',
        modelId: 'deepseek-v4-pro',
        monthlyCost: 'DeepSeek API 按量计费，相比 Claude 便宜 50-70%',
        fit: 'avoid',
        reasons: [
          'DeepSeek V4-Pro 虽然在中文代码生成上表现不错，但在多语言混合、复杂推理和工具链集成上仍弱于 Opus。',
          'OpenCode 是开源 BYOK 工具而非商业级企业套件，不提供合同级 SLA、审计日志或安全合规认证。',
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
      summary: '推荐 Claude Code + Claude Opus 4.7 作为企业级高可靠性编码默认方案；Cursor + Opus 4.7 和 JetBrains + Opus 4.7 作为工具选型灵活的备选。',
      decision: '优先选择 Claude Code 以获得端到端的企业支持和安全保障；如企业已有 Cursor 或 JetBrains 投资，可保留工具选择灵活性。',
    },
  },
  'privacy-local-coding': {
    id: 'privacy-local-coding',
    title: '本地隐私优先 AI 编码方案',
    shortTitle: '本地隐私',
    description: '面向敏感代码、内网项目和强隐私约束：优先选择本地优先、可自托管或 BYOK 的工具链。',
    userGoal: '尽量减少代码外传，同时保留补全、解释、重构建议和可审计的模型接入路径。',
    primary: {
      toolId: 'void-ide',
      modelId: 'meta-llama-4',
      monthlyCost: '工具开源免费；本地推理依赖硬件成本',
      fit: 'primary',
      reasons: ['Void IDE 强调隐私和开源，可减少遥测与供应商锁定。', 'Llama 4 适合本地或私有云部署，便于内部安全评估。', '对敏感仓库更容易建立“代码不出内网”的默认边界。'],
      risks: ['本地模型编码质量和工具调用稳定性弱于头部闭源模型。', '需要显卡、推理服务和模型更新维护。'],
    },
    alternatives: [
      {
        toolId: 'continue-dev',
        modelId: 'deepseek-v4',
        monthlyCost: 'Continue 开源免费；DeepSeek API 或私有化渠道按量/合同计费',
        fit: 'alternative',
        reasons: ['Continue 支持 BYOK 和多模型配置，适合企业渐进接入。', 'DeepSeek 成本低且国内链路更友好。'],
        risks: ['如果使用云 API，仍需评估代码和上下文外发边界。'],
      },
    ],
    avoid: [
      {
        toolId: 'gemini-cli',
        modelId: 'google-gemini-3-1-pro',
        monthlyCost: 'Gemini API 按量计费',
        fit: 'avoid',
        reasons: ['能力强，但默认云端调用和跨境访问不适合作为隐私优先默认方案。', '账号、网络和数据合规都需要额外设计。'],
        risks: ['敏感代码外发风险和团队环境一致性风险较高。'],
      },
    ],
    evidence: {
      sources: [
        { label: 'Void IDE GitHub', url: 'https://github.com/voideditor/void', checkedAt: '2026-05-16' },
        { label: 'Meta Llama', url: 'https://www.llama.com/', checkedAt: '2026-05-15' },
        { label: 'Continue documentation', url: 'https://docs.continue.dev/', checkedAt: '2026-05-15' },
      ],
      freshness: '本地优先工具、开源模型和 BYOK 工作流来源均基于官方/主流资料。',
      unknowns: ['本地模型实际效果高度依赖硬件、量化版本和提示词策略。', '企业内网部署需要额外安全基线和日志审计。'],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 Void IDE + Llama 4 作为本地隐私优先组合；Continue + DeepSeek 适合作为 BYOK/国内链路备选。',
      decision: '先用本地或自托管链路保护敏感仓库，再按任务复杂度为低风险代码引入云端强模型。',
    },
  },
  'long-context-research-coding': {
    id: 'long-context-research-coding',
    title: '长上下文研读与重构方案',
    shortTitle: '长上下文研读',
    description: '面向整仓理解、日志分析、长文档和多模态资料：优先选择 1M 上下文与强资料理解能力。',
    userGoal: '把大型代码库、长文档和问题日志快速转化为可执行的改造计划，再交给编码工具分步落地。',
    primary: {
      toolId: 'gemini-cli',
      modelId: 'google-gemini-3-1-pro',
      monthlyCost: 'Gemini API 按量计费；长上下文需重点控制预算',
      fit: 'primary',
      reasons: ['Gemini 3.1 Pro 具备 1M 上下文和多模态输入能力，适合整仓/长资料研读。', 'CLI 形态适合把分析结果带回本地仓库和脚本。', '对代码迁移、架构理解和技术文档总结特别有价值。'],
      risks: ['国内网络和账号可达性受限。', '长上下文输入会放大费用和敏感数据暴露风险。'],
    },
    alternatives: [
      {
        toolId: 'claude-code',
        modelId: 'anthropic-claude-sonnet-4-6',
        monthlyCost: 'Claude Code 订阅或 API 按量计费',
        fit: 'alternative',
        reasons: ['Claude Sonnet 4.6 在代码理解和分步重构中稳定。', 'Claude Code 更适合把分析转化为实际文件修改和测试闭环。'],
        risks: ['超长上下文和国内访问仍需规划。'],
      },
    ],
    avoid: [
      {
        toolId: 'github-copilot-cli',
        modelId: 'openai-gpt-5-4-mini',
        monthlyCost: 'Copilot 订阅或 GitHub 托管能力',
        fit: 'avoid',
        reasons: ['Copilot CLI 更偏命令辅助，不适合作为整仓长上下文研读的默认入口。', '适合补充 GitHub 命令和 shell 操作，而不是承担主要分析。'],
        risks: ['容易把架构理解任务拆得过碎，丢失全局上下文。'],
      },
    ],
    evidence: {
      sources: [
        { label: 'Google Gemini models', url: 'https://ai.google.dev/gemini-api/docs/models', checkedAt: '2026-05-15' },
        { label: 'Google Gemini pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing', checkedAt: '2026-05-15' },
        { label: 'Anthropic Claude models', url: 'https://platform.claude.com/docs/en/docs/about-claude/models/overview', checkedAt: '2026-05-15' },
      ],
      freshness: '长上下文和价格依据官方模型页、价格页与主流厂商文档核验。',
      unknowns: ['不同地区 API 可用性和速率限制可能影响大规模使用。', '超长上下文输出质量仍需用抽样验证和引用回查控制。'],
    },
    report: {
      templateId: 'scenario-recommendation',
      summary: '推荐 Gemini CLI + Gemini 3.1 Pro 负责长上下文研读；Claude Code + Sonnet 负责把结论转为代码改动。',
      decision: '先用长上下文模型完成理解和规划，再切到编码 Agent 做小步实现与测试验证。',
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
