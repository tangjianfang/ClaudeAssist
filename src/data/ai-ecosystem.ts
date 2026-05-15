export type AiModelCategory = 'frontier' | 'coding' | 'reasoning' | 'multimodal' | 'open';
export type CostTier = 'low' | 'medium' | 'high';

export interface AiScores {
  reasoning: number;
  coding: number;
  toolUse: number;
  consistency: number;
  latency: number;
}

export interface AiModel {
  id: string;
  name: string;
  vendor: string;
  category: AiModelCategory;
  version: string;
  contextWindow: string;
  costTier: CostTier;
  pricing: {
    currency: 'USD' | 'CNY';
    inputPerMTokens: string;
    outputPerMTokens: string;
    notes: string;
    officialUrl: string;
  };
  scores: AiScores;
  china: {
    accessible: boolean;
    needsProxy: boolean;
    localDeploy: boolean;
    complianceRisk: 'low' | 'medium' | 'high';
    note: string;
  };
  tags: string[];
  pros: string[];
  cons: string[];
  changeLog: string[];
  source: {
    label: string;
    url: string;
    checkedAt: string;
  };
}

export interface AiRecommendation {
  scene: string;
  model: string;
  agent: string;
  toolchain: string;
  pros: string[];
  cons: string[];
  risk: string;
}

export interface AiEcosystemDataStore {
  lastUpdated: string;
  version: string;
  models: AiModel[];
  recommendations: AiRecommendation[];
}

export const DATA_STORE: AiEcosystemDataStore = {
  lastUpdated: '2026-05-15',
  version: '2026.05',
  models: [
    {
      id: 'openai-gpt-5-1',
      name: 'GPT-5.1',
      vendor: 'OpenAI',
      category: 'frontier',
      version: 'API',
      contextWindow: '400K tokens',
      costTier: 'medium',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$1.25',
        outputPerMTokens: '$10.00',
        notes: 'Cached input is listed separately by OpenAI; verify the pricing page before bulk usage.',
        officialUrl: 'https://platform.openai.com/docs/pricing',
      },
      scores: { reasoning: 9.5, coding: 9.3, toolUse: 9.4, consistency: 9.1, latency: 7.2 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: false,
        complianceRisk: 'high',
        note: 'Official API availability is region/account dependent; mainland China developers usually need compliant overseas access.',
      },
      tags: ['frontier', 'agent', 'coding', 'tool-use', 'multimodal'],
      pros: ['Strong general reasoning and tool calling', 'Mature API ecosystem', 'Good fit for agent orchestration'],
      cons: ['Higher output cost than local/open models', 'Mainland China availability is constrained'],
      changeLog: ['2026-05: Pricing/context fields checked against OpenAI official pricing documentation.'],
      source: {
        label: 'OpenAI API pricing',
        url: 'https://platform.openai.com/docs/pricing',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'anthropic-claude-sonnet-4-5',
      name: 'Claude Sonnet 4.5',
      vendor: 'Anthropic',
      category: 'coding',
      version: 'claude-sonnet-4-5',
      contextWindow: '200K tokens; extended context varies by provider/beta',
      costTier: 'high',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$3.00',
        outputPerMTokens: '$15.00',
        notes: 'Base API rate; prompt caching and long-context rates are priced separately.',
        officialUrl: 'https://docs.anthropic.com/en/docs/about-claude/pricing',
      },
      scores: { reasoning: 9.4, coding: 9.6, toolUse: 9.2, consistency: 9.3, latency: 7.0 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: false,
        complianceRisk: 'high',
        note: 'Direct Anthropic access is not generally available in mainland China; use compliant cloud/provider channels only.',
      },
      tags: ['coding', 'agent', 'long-context', 'tool-use'],
      pros: ['Excellent coding and refactoring behavior', 'Reliable instruction following', 'Strong long-document handling'],
      cons: ['Premium API pricing', 'Domestic access requires compliance planning'],
      changeLog: ['2026-05: Pricing/context fields checked against Anthropic official model and pricing docs.'],
      source: {
        label: 'Anthropic Claude pricing and model docs',
        url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'google-gemini-2-5-pro',
      name: 'Gemini 2.5 Pro',
      vendor: 'Google',
      category: 'multimodal',
      version: 'gemini-2.5-pro',
      contextWindow: '1M tokens',
      costTier: 'medium',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$1.25 / $2.50',
        outputPerMTokens: '$10.00 / $15.00',
        notes: 'Google lists separate rates for prompts up to and above 200K tokens.',
        officialUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
      },
      scores: { reasoning: 9.2, coding: 8.8, toolUse: 8.8, consistency: 8.7, latency: 7.5 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: false,
        complianceRisk: 'high',
        note: 'Google AI services are not directly reachable from many mainland China networks.',
      },
      tags: ['multimodal', 'long-context', 'research', 'document'],
      pros: ['Very large official context window', 'Strong multimodal and document workflows', 'Competitive input pricing'],
      cons: ['Output can be costly for long generations', 'Direct domestic network access is limited'],
      changeLog: ['2026-05: Context and tiered pricing checked against Google Gemini API documentation.'],
      source: {
        label: 'Google Gemini API pricing',
        url: 'https://ai.google.dev/gemini-api/docs/pricing',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'deepseek-v3-2',
      name: 'DeepSeek V3.2',
      vendor: 'DeepSeek',
      category: 'reasoning',
      version: 'deepseek-chat / deepseek-reasoner',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$0.14 cache miss / $0.028 cache hit',
        outputPerMTokens: '$0.28',
        notes: 'DeepSeek separates cache-hit and cache-miss input pricing.',
        officialUrl: 'https://api-docs.deepseek.com/quick_start/pricing/',
      },
      scores: { reasoning: 8.9, coding: 8.8, toolUse: 8.1, consistency: 8.2, latency: 8.4 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'medium',
        note: 'Official API is developer-friendly for China-based users; enterprise compliance still depends on data policy.',
      },
      tags: ['reasoning', 'low-cost', 'china-friendly', 'api'],
      pros: ['Very low API cost', 'Good reasoning/code value ratio', 'Mainland access is practical'],
      cons: ['Tool-use ecosystem is less mature than OpenAI/Anthropic', 'Enterprise controls vary by deployment path'],
      changeLog: ['2026-05: Pricing checked against DeepSeek official API pricing page.'],
      source: {
        label: 'DeepSeek API pricing',
        url: 'https://api-docs.deepseek.com/quick_start/pricing/',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'alibaba-qwen3-max',
      name: 'Qwen3-Max',
      vendor: 'Alibaba Cloud',
      category: 'frontier',
      version: 'qwen3-max',
      contextWindow: '262K tokens',
      costTier: 'medium',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$0.359–$3.00',
        outputPerMTokens: '$1.434–$15.00',
        notes: 'Alibaba Cloud Model Studio uses region and context-length tiers.',
        officialUrl: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing',
      },
      scores: { reasoning: 9.0, coding: 8.9, toolUse: 8.7, consistency: 8.6, latency: 8.0 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'low',
        note: 'Available through Alibaba Cloud Model Studio with domestic enterprise channels.',
      },
      tags: ['china-friendly', 'coding', 'tool-use', 'long-context'],
      pros: ['Strong domestic availability', 'Good Chinese/English coding balance', 'Enterprise cloud integration'],
      cons: ['Pricing varies by region and context tier', 'Exact model variants change frequently'],
      changeLog: ['2026-05: Pricing tiers checked against Alibaba Cloud Model Studio official pricing.'],
      source: {
        label: 'Alibaba Cloud Model Studio pricing',
        url: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'moonshot-kimi-k2',
      name: 'Kimi K2',
      vendor: 'Moonshot AI',
      category: 'open',
      version: 'kimi-k2',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$0.60 cache miss / $0.15 cache hit',
        outputPerMTokens: '$2.50',
        notes: 'Official Kimi API lists chat model pricing by model family and cache status.',
        officialUrl: 'https://platform.kimi.ai/docs/pricing/chat-k2',
      },
      scores: { reasoning: 8.7, coding: 9.0, toolUse: 8.8, consistency: 8.3, latency: 8.1 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: true,
        complianceRisk: 'medium',
        note: 'Kimi API is China-friendly; open-weight/local deployment depends on selected K2 release and license obligations.',
      },
      tags: ['open-weight', 'agent', 'coding', 'china-friendly'],
      pros: ['Strong agentic coding price/performance', 'Domestic API access', 'Open-weight ecosystem options'],
      cons: ['Compliance review is needed for self-hosted weights', 'Provider behavior differs between API and local deployment'],
      changeLog: ['2026-05: Pricing checked against Kimi official API platform documentation.'],
      source: {
        label: 'Kimi API pricing',
        url: 'https://platform.kimi.ai/docs/pricing/chat-k2',
        checkedAt: '2026-05-15',
      },
    },
  ],
  recommendations: [
    {
      scene: '个人全栈开发：代码生成 + Review + 单元测试',
      model: 'Claude Sonnet 4.5 / Qwen3-Max',
      agent: 'Claude Code、Cursor Agent 或 Continue',
      toolchain: 'GitHub + local IDE + Playwright/Vitest',
      pros: ['Claude 适合复杂重构', 'Qwen 在国内链路和中文需求上更稳', '测试工具链可闭环验证'],
      cons: ['Claude 国内直连受限', 'Qwen 长上下文价格需按区域核算'],
      risk: '生产代码不得直接提交未审查输出；敏感代码优先选择合规云或本地模型。',
    },
    {
      scene: '低成本持续问答/脚本自动化',
      model: 'DeepSeek V3.2',
      agent: '轻量 CLI Agent / Dify 工作流',
      toolchain: 'DeepSeek API + 本地脚本 + 定时任务',
      pros: ['价格低', '国内可用性好', '适合批处理和重复任务'],
      cons: ['复杂工具调用稳定性弱于一线闭源模型'],
      risk: '避免上传个人隐私、客户数据和未脱敏日志。',
    },
    {
      scene: '长文档、多模态资料研读',
      model: 'Gemini 2.5 Pro',
      agent: 'NotebookLM / Gemini API 文档助手',
      toolchain: 'Google AI Studio + 文档索引 + 摘要校验',
      pros: ['超长上下文', '多模态输入友好', '适合整仓/整份材料分析'],
      cons: ['国内网络可达性较差', '长输出费用需要预算控制'],
      risk: '跨境数据和网络访问需提前评估合规性。',
    },
    {
      scene: '国内可用的 Agentic Coding 组合',
      model: 'Kimi K2 / Qwen3-Max',
      agent: 'Qwen Code、OpenCode 或自建 MCP Agent',
      toolchain: 'Model Studio/Kimi API + MCP + 本地 Git 验证',
      pros: ['国内访问稳定', '中文需求理解好', '成本可控'],
      cons: ['不同代理框架的工具调用协议不完全一致'],
      risk: '企业内网落地时需统一审计、密钥管理和模型输出留痕。',
    },
  ],
};

export const SCORE_KEYS: Array<keyof AiScores> = ['reasoning', 'coding', 'toolUse', 'consistency', 'latency'];

export const SCORE_LABELS: Record<keyof AiScores, string> = {
  reasoning: '推理',
  coding: '编码',
  toolUse: '工具',
  consistency: '稳定',
  latency: '速度',
};
