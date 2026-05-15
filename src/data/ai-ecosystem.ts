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
  version: '2026.05.3',
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
    {
      id: 'zhipu-glm-5-1',
      name: 'GLM-5.1',
      vendor: '智谱AI (Zhipu AI)',
      category: 'frontier',
      version: 'glm-5.1',
      contextWindow: '128K tokens',
      costTier: 'medium',
      pricing: {
        currency: 'CNY',
        inputPerMTokens: '¥15',
        outputPerMTokens: '¥60',
        notes: '智谱 AI 开放平台按 Token 计费，具体价格以官方定价页为准。',
        officialUrl: 'https://open.bigmodel.cn/pricing',
      },
      scores: { reasoning: 9.1, coding: 8.9, toolUse: 8.6, consistency: 8.8, latency: 8.2 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'low',
        note: '智谱 AI 为国内合规平台，企业接入有完善的数据协议和等保支持。',
      },
      tags: ['frontier', 'china-friendly', 'coding', 'tool-use', 'long-context'],
      pros: ['国内访问稳定，合规友好', '中英文双语能力均衡', '工具调用和 Agent 场景表现出色'],
      cons: ['国际 Benchmark 生态不如 OpenAI/Anthropic 成熟', '价格相较部分国内竞品偏高'],
      changeLog: ['2026-05: 新增 GLM-5.1 条目，依据智谱 AI 开放平台公开资料。'],
      source: {
        label: '智谱AI 开放平台',
        url: 'https://open.bigmodel.cn/pricing',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'deepseek-v4',
      name: 'DeepSeek V4',
      vendor: 'DeepSeek',
      category: 'reasoning',
      version: 'deepseek-v4',
      contextWindow: '256K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$0.10 cache miss / $0.02 cache hit',
        outputPerMTokens: '$0.20',
        notes: 'DeepSeek 延续分离缓存命中/未命中的计费模式；价格以官方 API 定价页为准。',
        officialUrl: 'https://api-docs.deepseek.com/quick_start/pricing/',
      },
      scores: { reasoning: 9.3, coding: 9.1, toolUse: 8.5, consistency: 8.6, latency: 8.6 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'medium',
        note: '官方 API 面向国内开发者开放；企业合规需评估数据出境和模型输出审计策略。',
      },
      tags: ['reasoning', 'low-cost', 'china-friendly', 'api', 'long-context'],
      pros: ['极低 API 成本，性价比突出', '推理和编码能力相比 V3 进一步提升', '上下文窗口扩展至 256K'],
      cons: ['工具调用生态成熟度仍低于 OpenAI/Anthropic', '开源权重合规使用需关注许可证条款'],
      changeLog: ['2026-05: 新增 DeepSeek V4 条目，依据 DeepSeek 官方 API 文档和公开发布信息。'],
      source: {
        label: 'DeepSeek API pricing',
        url: 'https://api-docs.deepseek.com/quick_start/pricing/',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'alibaba-qwen3-6',
      name: 'Qwen3.6',
      vendor: 'Alibaba Cloud',
      category: 'open',
      version: 'qwen3.6',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'CNY',
        inputPerMTokens: '¥0.8',
        outputPerMTokens: '¥3.2',
        notes: 'Qwen3.6 属于中轻量级开源模型，阿里云 DashScope 提供低价 API 调用；也可本地部署免费推理。',
        officialUrl: 'https://help.aliyun.com/zh/model-studio/getting-started/models',
      },
      scores: { reasoning: 8.5, coding: 8.6, toolUse: 8.2, consistency: 8.3, latency: 9.0 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: true,
        complianceRisk: 'low',
        note: '开源模型，支持本地部署；阿里云 DashScope API 国内直连，合规基础良好。',
      },
      tags: ['open-weight', 'china-friendly', 'low-cost', 'local-deploy', 'coding'],
      pros: ['开源可本地部署，数据不出境', '推理速度快，适合高并发轻量场景', '阿里云 API 价格极低'],
      cons: ['模型体量较小，复杂多步推理能力弱于大参数版本', '本地部署需配置显存资源'],
      changeLog: ['2026-05: 新增 Qwen3.6 条目，依据阿里云模型广场和 DashScope 文档。'],
      source: {
        label: '阿里云模型广场',
        url: 'https://help.aliyun.com/zh/model-studio/getting-started/models',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'xai-grok-4-3',
      name: 'Grok 4.3',
      vendor: 'xAI',
      category: 'frontier',
      version: 'grok-4.3',
      contextWindow: '256K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$1.25',
        outputPerMTokens: '$2.50',
        notes: 'xAI pricing and tool-call costs are documented separately and can change by cluster/region.',
        officialUrl: 'https://docs.x.ai/developers/pricing',
      },
      scores: { reasoning: 9.1, coding: 8.9, toolUse: 9.0, consistency: 8.6, latency: 8.3 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: false,
        complianceRisk: 'high',
        note: 'xAI official services generally require overseas network/account channels for mainland teams.',
      },
      tags: ['frontier', 'agent', 'tool-use', 'multimodal'],
      pros: ['Strong tool integration orientation', 'Good balance of quality and output cost', 'API docs are improving quickly'],
      cons: ['Domestic direct access is limited', 'Model/version cadence is fast and requires frequent re-validation'],
      changeLog: ['2026-05: Added Grok 4.3 with xAI official models/pricing docs as source.'],
      source: {
        label: 'xAI models and pricing docs',
        url: 'https://docs.x.ai/developers/models',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'mistral-medium-3-1',
      name: 'Mistral Medium 3.1',
      vendor: 'Mistral AI',
      category: 'reasoning',
      version: 'mistral-medium-3.1',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$0.40',
        outputPerMTokens: '$2.00',
        notes: 'Use mistral.ai pricing as source of truth; rates vary by model tier and may be revised.',
        officialUrl: 'https://mistral.ai/pricing/',
      },
      scores: { reasoning: 8.8, coding: 8.7, toolUse: 8.5, consistency: 8.4, latency: 8.5 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: true,
        complianceRisk: 'medium',
        note: 'API access usually needs overseas channels; some open/open-weight paths enable controlled self-hosting.',
      },
      tags: ['reasoning', 'open-weight', 'low-cost', 'agent'],
      pros: ['Competitive price/performance', 'Open ecosystem for self-hosted strategy', 'Good multilingual support'],
      cons: ['Direct domestic API access is limited', 'Enterprise support model differs across deployment paths'],
      changeLog: ['2026-05: Added Mistral Medium 3.1 based on official models and pricing pages.'],
      source: {
        label: 'Mistral models and pricing',
        url: 'https://docs.mistral.ai/models',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'cohere-command-a',
      name: 'Cohere Command A',
      vendor: 'Cohere',
      category: 'coding',
      version: 'command-a',
      contextWindow: '256K tokens',
      costTier: 'high',
      pricing: {
        currency: 'USD',
        inputPerMTokens: '$2.50',
        outputPerMTokens: '$10.00',
        notes: 'Command family has tiered rates; verify latest values on Cohere pricing before production rollout.',
        officialUrl: 'https://cohere.com/pricing',
      },
      scores: { reasoning: 8.7, coding: 8.9, toolUse: 8.6, consistency: 8.6, latency: 8.4 },
      china: {
        accessible: false,
        needsProxy: true,
        localDeploy: false,
        complianceRisk: 'high',
        note: 'Cohere API is typically consumed through overseas cloud channels for mainland teams.',
      },
      tags: ['coding', 'agent', 'enterprise', 'tool-use'],
      pros: ['Strong enterprise-facing API documentation', 'Good balance for coding + enterprise NLP', 'Stable product line'],
      cons: ['Domestic direct access constraints', 'Ecosystem mindshare is lower than top-tier competitors'],
      changeLog: ['2026-05: Added Command A with official model and pricing references.'],
      source: {
        label: 'Cohere Command models',
        url: 'https://docs.cohere.com/docs/command-models',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'meta-llama-4',
      name: 'Llama 4',
      vendor: 'Meta',
      category: 'open',
      version: 'llama-4',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'USD',
        inputPerMTokens: 'N/A (self-host/open provider pricing varies)',
        outputPerMTokens: 'N/A (self-host/open provider pricing varies)',
        notes: 'Meta provides model docs; API pricing depends on the selected cloud/provider or self-hosted stack.',
        officialUrl: 'https://www.llama.com/docs/models/',
      },
      scores: { reasoning: 8.8, coding: 8.7, toolUse: 8.3, consistency: 8.2, latency: 8.7 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: true,
        complianceRisk: 'medium',
        note: 'Open model deployment is possible; commercial usage still requires license and compliance review.',
      },
      tags: ['open-weight', 'local-deploy', 'multilingual', 'coding'],
      pros: ['Open model route for private deployment', 'Good ecosystem support across inference frameworks', 'Suitable for cost-controlled local pipelines'],
      cons: ['Quality/tooling depends on serving stack and fine-tuning', 'License obligations must be reviewed before commercial rollout'],
      changeLog: ['2026-05: Added Llama 4 ecosystem entry using Meta official model documentation.'],
      source: {
        label: 'Meta Llama model docs',
        url: 'https://www.llama.com/docs/models/',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'baidu-ernie-4-5-turbo',
      name: 'ERNIE 4.5 Turbo',
      vendor: '百度智能云 千帆',
      category: 'frontier',
      version: 'ERNIE 4.5 Turbo',
      contextWindow: '128K tokens',
      costTier: 'low',
      pricing: {
        currency: 'CNY',
        inputPerMTokens: '¥0.8',
        outputPerMTokens: '¥3.2',
        notes: '百度千帆模型价格会按版本和能力层变化，建议以上线控制台定价为准。',
        officialUrl: 'https://cloud.baidu.com/doc/Qianfan/index.html',
      },
      scores: { reasoning: 8.7, coding: 8.4, toolUse: 8.3, consistency: 8.5, latency: 8.8 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'low',
        note: '千帆平台具备国内合规交付能力，适合企业内地落地与审计要求。',
      },
      tags: ['china-friendly', 'enterprise', 'low-cost', 'api'],
      pros: ['国内可达性强', '价格竞争力较好', '千帆平台有成熟企业接入流程'],
      cons: ['国际开源生态协同不如海外头部平台', '模型迭代快需定期回归评估'],
      changeLog: ['2026-05: 新增 ERNIE 4.5 Turbo 条目，依据百度千帆官方文档。'],
      source: {
        label: '百度千帆官方文档',
        url: 'https://cloud.baidu.com/doc/Qianfan/index.html',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'tencent-hunyuan-standard',
      name: 'Hunyuan Standard',
      vendor: '腾讯混元',
      category: 'multimodal',
      version: 'hunyuan-standard',
      contextWindow: '256K tokens',
      costTier: 'low',
      pricing: {
        currency: 'CNY',
        inputPerMTokens: '¥4.5',
        outputPerMTokens: '¥5.0',
        notes: '具体价格与上下文规格在腾讯云定价中心动态调整，企业采购需按最新账单规则核算。',
        officialUrl: 'https://cloud.tencent.com/document/product/1729/101266',
      },
      scores: { reasoning: 8.6, coding: 8.2, toolUse: 8.4, consistency: 8.4, latency: 8.9 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'low',
        note: '腾讯云生态内接入便捷，适合已有腾讯云基础设施的团队。',
      },
      tags: ['china-friendly', 'multimodal', 'enterprise', 'api'],
      pros: ['腾讯云生态集成便利', '支持较长上下文规格', '国内企业接入流程成熟'],
      cons: ['跨云迁移成本可能较高', '高级型号成本波动较大'],
      changeLog: ['2026-05: 新增腾讯混元 Standard 条目，依据腾讯云官方文档。'],
      source: {
        label: '腾讯混元 API 文档',
        url: 'https://cloud.tencent.com/document/product/1729/101266',
        checkedAt: '2026-05-15',
      },
    },
    {
      id: 'doubao-seed-1-6',
      name: 'Doubao Seed 1.6',
      vendor: '火山方舟 (Volcengine Ark)',
      category: 'multimodal',
      version: 'doubao-seed-1.6',
      contextWindow: '256K tokens',
      costTier: 'low',
      pricing: {
        currency: 'CNY',
        inputPerMTokens: '¥1.8',
        outputPerMTokens: '¥1.8',
        notes: '当前记录值按 ¥1.8 / 1M tokens 作为基准，官方常见区间约 ¥1.5–¥2.0；正式上线前请在控制台核对。',
        officialUrl: 'https://www.volcengine.com/docs/82379',
      },
      scores: { reasoning: 8.7, coding: 8.5, toolUse: 8.6, consistency: 8.5, latency: 9.1 },
      china: {
        accessible: true,
        needsProxy: false,
        localDeploy: false,
        complianceRisk: 'low',
        note: '火山方舟在国内可稳定接入，并提供企业级账号和权限治理能力。',
      },
      tags: ['china-friendly', 'multimodal', 'agent', 'api', 'low-cost'],
      pros: ['国内可用性高', '接口兼容 OpenAI 风格', '多模态能力覆盖较全'],
      cons: ['模型命名和版本更新较快', '跨平台迁移时需注意参数差异'],
      changeLog: ['2026-05: 新增 Doubao Seed 1.6 条目，依据火山方舟官方文档。'],
      source: {
        label: '火山方舟 API 文档',
        url: 'https://www.volcengine.com/docs/82379',
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
      model: 'Kimi K2 / Qwen3-Max / GLM-5.1',
      agent: 'Qwen Code、OpenCode 或自建 MCP Agent',
      toolchain: 'Model Studio/Kimi API + MCP + 本地 Git 验证',
      pros: ['国内访问稳定', '中文需求理解好', '成本可控', 'GLM-5.1 合规基础强'],
      cons: ['不同代理框架的工具调用协议不完全一致'],
      risk: '企业内网落地时需统一审计、密钥管理和模型输出留痕。',
    },
    {
      scene: '极低成本批处理与轻量自动化',
      model: 'DeepSeek V4 / Qwen3.6',
      agent: '轻量 CLI Agent / Dify 工作流',
      toolchain: 'DeepSeek API 或 DashScope + 本地脚本 + 定时任务',
      pros: ['API 成本极低', '国内网络可用性好', 'Qwen3.6 支持本地部署零成本推理'],
      cons: ['复杂多步工具调用稳定性弱于头部闭源模型', '本地部署需评估硬件资源'],
      risk: '避免上传个人隐私、客户数据和未脱敏日志；本地模型需关注显卡驱动和依赖安全。',
    },
    {
      scene: '国际多模型并行开发与评测',
      model: 'GPT-5.1 / Claude Sonnet 4.5 / Grok 4.3 / Mistral Medium 3.1',
      agent: 'Cursor / Windsurf / Cline / Continue',
      toolchain: 'OpenRouter + LangChain/LlamaIndex + GitHub Actions',
      pros: ['可并行对比闭源与开源路线', '便于按成本与延迟做智能路由', '适合多供应商容灾'],
      cons: ['跨供应商鉴权与计费治理复杂', '提示词与工具调用协议需要统一抽象层'],
      risk: '生产环境必须配置模型路由审计、敏感信息脱敏与供应商故障回退策略。',
    },
    {
      scene: '国内企业知识库与业务 Agent 落地',
      model: 'GLM-5.1 / ERNIE 4.5 Turbo / Hunyuan Standard / Doubao Seed 1.6',
      agent: 'Dify / Flowise / 自建 MCP Agent',
      toolchain: '千帆/混元/火山 API + 向量库 + AutoGen/CrewAI 编排',
      pros: ['国内网络与合规链路更稳定', '成本可控，适合大规模问答与流程自动化', '低代码平台上线速度快'],
      cons: ['不同厂商生态接口不完全一致', '模型质量和价格会随版本频繁变化'],
      risk: '需落实数据分级、日志留痕、密钥轮换和输出审计，避免业务敏感信息泄露。',
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
