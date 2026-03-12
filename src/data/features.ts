export interface Feature {
  id: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  category: FeatureCategory;
  addedIn: string; // version or date string like "v1.x" or "2025-Q4"
  docsUrl?: string;
  highlight?: boolean; // show a "New" badge
}

export type FeatureCategory =
  | 'ai'
  | 'ide'
  | 'automation'
  | 'security'
  | 'workflow'
  | 'context'
  | 'mcp';

export const FEATURE_CATEGORIES: Array<{ id: FeatureCategory | 'all'; labelEn: string; labelZh: string }> = [
  { id: 'all',        labelEn: 'All',         labelZh: '全部' },
  { id: 'ai',         labelEn: 'AI Model',    labelZh: 'AI 模型' },
  { id: 'ide',        labelEn: 'IDE',         labelZh: 'IDE 集成' },
  { id: 'automation', labelEn: 'Automation',  labelZh: '自动化' },
  { id: 'security',   labelEn: 'Security',    labelZh: '安全权限' },
  { id: 'workflow',   labelEn: 'Workflow',    labelZh: '工作流' },
  { id: 'context',    labelEn: 'Context',     labelZh: '上下文' },
  { id: 'mcp',        labelEn: 'MCP',         labelZh: 'MCP 协议' },
];

export const features: Feature[] = [
  {
    id: 'claude-4-sonnet',
    title: 'Claude Sonnet 4 & Haiku 3.5 Default',
    titleZh: 'Claude Sonnet 4 / Haiku 3.5 成为默认模型',
    summary:
      'Claude Code now uses Claude Sonnet 4 by default — offering better reasoning, longer context, and faster iteration. Haiku 3.5 is available for cost-sensitive background tasks.',
    summaryZh:
      'Claude Code 现在默认使用 Claude Sonnet 4，推理能力更强、上下文更长、迭代更快。针对成本敏感的后台任务可选用 Haiku 3.5。',
    category: 'ai',
    addedIn: '2025-Q4',
    docsUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
    highlight: true,
  },
  {
    id: 'extended-thinking',
    title: 'Extended Thinking Mode',
    titleZh: '扩展思考模式（Extended Thinking）',
    summary:
      'Trigger deep reasoning with /think or --think flag. Claude spends additional compute budget "thinking" through complex problems step-by-step before responding, ideal for architecture decisions or tricky bugs.',
    summaryZh:
      '通过 /think 或 --think 参数开启深度推理。Claude 会在回答前花费额外算力逐步"思考"复杂问题，特别适合架构决策或难以排查的 Bug。',
    category: 'ai',
    addedIn: '2025-Q3',
    docsUrl: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking',
    highlight: true,
  },
  {
    id: 'vs-code-extension',
    title: 'VS Code & JetBrains IDE Integration',
    titleZh: 'VS Code / JetBrains IDE 原生扩展',
    summary:
      'Official extensions bring Claude Code inline into your editor: see diffs, accept changes, and run agentic tasks without leaving your IDE. Side-by-side diff viewer included.',
    summaryZh:
      '官方扩展将 Claude Code 内嵌到编辑器中，可直接查看 diff、接受修改、运行智能体任务，无需切换窗口，内置并排 diff 视图。',
    category: 'ide',
    addedIn: '2025-Q3',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/ide-integrations',
    highlight: true,
  },
  {
    id: 'github-actions',
    title: 'GitHub Actions CI Integration',
    titleZh: 'GitHub Actions CI 集成',
    summary:
      'Run Claude Code as a headless GitHub Actions step: auto-fix failing tests, summarize pull requests, generate changelogs, or triage issues — all triggered by push/PR events.',
    summaryZh:
      '在 GitHub Actions 中以无头模式运行 Claude Code：自动修复失败测试、汇总 Pull Request、生成 Changelog、分类 Issue，全部由 push/PR 事件触发。',
    category: 'automation',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/github-actions',
    highlight: true,
  },
  {
    id: 'mcp-protocol',
    title: 'Model Context Protocol (MCP) Support',
    titleZh: '模型上下文协议（MCP）支持',
    summary:
      'Claude Code can act as an MCP client or server. Connect external tools — databases, APIs, file systems — and expose them to Claude as structured context via the open MCP standard.',
    summaryZh:
      'Claude Code 既可作为 MCP 客户端，也可作为 MCP 服务端。通过开放的 MCP 标准，将数据库、API、文件系统等外部工具以结构化上下文形式提供给 Claude。',
    category: 'mcp',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/mcp',
  },
  {
    id: 'permission-system',
    title: 'Fine-Grained Permission System',
    titleZh: '细粒度权限管理系统',
    summary:
      'settings.json now supports allowedTools / deniedTools to whitelist or blacklist specific tools (Bash, file read/write, web fetch) per project or globally, with user-level overrides.',
    summaryZh:
      'settings.json 现在支持 allowedTools / deniedTools，可对特定工具（Bash、文件读写、网络请求等）进行白名单/黑名单管控，支持项目级和全局级，并可由用户配置覆盖。',
    category: 'security',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/settings',
  },
  {
    id: 'auto-compact',
    title: 'Auto-Compact Long Conversations',
    titleZh: '长对话自动压缩（Auto-Compact）',
    summary:
      '/compact summarizes the current conversation to free up context window space. Auto-compact can be triggered by Claude when the context approaches its limit, preserving critical information.',
    summaryZh:
      '/compact 命令可将当前对话摘要化，释放上下文窗口空间。当上下文接近上限时，Claude 会自动触发压缩，保留关键信息。',
    category: 'context',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands',
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent & Sub-Agent Tasks',
    titleZh: '多智能体 & 子任务并发',
    summary:
      'Claude Code can spawn sub-agents to work on parallel tasks — e.g., writing tests while simultaneously fixing code. Orchestration is handled through claude -p headless invocations.',
    summaryZh:
      'Claude Code 可以派生子智能体并行处理任务，例如在修复代码的同时并行编写测试。编排通过 claude -p 无头调用方式实现。',
    category: 'automation',
    addedIn: '2025-Q3',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/sub-agents',
    highlight: true,
  },
  {
    id: 'memory-files',
    title: 'Persistent Memory with CLAUDE.md',
    titleZh: '基于 CLAUDE.md 的持久化记忆',
    summary:
      'Place a CLAUDE.md file in your project root (or ~/.claude/CLAUDE.md globally) to give Claude persistent instructions: code style, team conventions, forbidden commands, preferred libraries.',
    summaryZh:
      '在项目根目录（或 ~/.claude/CLAUDE.md 全局路径）放置 CLAUDE.md 文件，向 Claude 提供持久指令：代码风格、团队规范、禁用命令、首选库等。',
    category: 'context',
    addedIn: '2025-Q1',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/memory',
  },
  {
    id: 'web-search-tool',
    title: 'Web Search Tool',
    titleZh: '内置网络搜索工具',
    summary:
      'Claude Code can search the web in real time during a session to fetch latest docs, check current APIs, or research unfamiliar libraries — no manual copy-paste required.',
    summaryZh:
      'Claude Code 可在会话中实时搜索网络，获取最新文档、查询当前 API 或了解陌生库，无需手动复制粘贴。',
    category: 'workflow',
    addedIn: '2025-Q3',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/tools',
  },
  {
    id: 'headless-mode',
    title: 'Headless / Pipe Mode (claude -p)',
    titleZh: '无头/管道模式（claude -p）',
    summary:
      'Run Claude Code non-interactively with claude -p "prompt" for scripting and automation. Combine with --output-format json for structured output, perfect for CI pipelines.',
    summaryZh:
      '通过 claude -p "提示词" 以非交互方式运行，配合 --output-format json 可输出结构化数据，是 CI/CD 流水线的理想选择。',
    category: 'automation',
    addedIn: '2025-Q1',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/headless-mode',
  },
  {
    id: 'custom-slash-commands',
    title: 'Custom Slash Commands via Markdown',
    titleZh: '自定义斜杠命令（Markdown 文件）',
    summary:
      'Create .claude/commands/your-command.md files to define reusable slash commands for your team. Supports $ARGUMENTS placeholder for dynamic inputs and version control sharing.',
    summaryZh:
      '创建 .claude/commands/your-command.md 文件为团队定义可复用的斜杠命令，支持 $ARGUMENTS 占位符用于动态输入，可通过版本控制共享。',
    category: 'workflow',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands#custom-slash-commands',
  },
  {
    id: 'streaming-json-output',
    title: 'Streaming & Structured JSON Output',
    titleZh: '流式输出与结构化 JSON 响应',
    summary:
      'Use --output-format stream-json for real-time streaming output in automation pipelines. Parse Claude\'s tool use, text deltas, and cost metadata programmatically.',
    summaryZh:
      '使用 --output-format stream-json 在自动化流水线中获取实时流式输出，可通过编程方式解析工具调用、文本增量和费用元数据。',
    category: 'automation',
    addedIn: '2025-Q2',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/output-formats',
  },
];
