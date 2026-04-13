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
    id: 'opus-4-6-default',
    title: 'Claude Opus 4.6 Default with 1M Context',
    titleZh: 'Claude Opus 4.6 默认模型，支持 100 万上下文',
    summary:
      'Claude Code upgraded to Opus 4.6 as default model with 1M token context window (Max/Team/Enterprise), 128K max output, and adaptive thinking mode that automatically decides when deep reasoning is needed.',
    summaryZh:
      'Claude Code 升级为 Opus 4.6 默认模型，支持 100 万 token 上下文窗口（Max/Team/Enterprise 计划），128K 最大输出，以及自适应思考模式，可自动判断何时需要深度推理。',
    category: 'ai',
    addedIn: '2026-Q1',
    docsUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
    highlight: true,
  },
  {
    id: 'computer-use',
    title: 'Computer Use - Remote Desktop Control',
    titleZh: 'Computer Use - 远程桌面控制',
    summary:
      'Research Preview (2026.03): Control Mac desktop remotely — mouse clicks, browsing, file operations. macOS only, requires terminal to stay open. Available for Pro/Max plans.',
    summaryZh:
      '研究预览版（2026.03）：远程控制 Mac 桌面——鼠标点击、浏览、文件操作。仅限 macOS，需保持终端开启。Pro/Max 计划可用。',
    category: 'automation',
    addedIn: '2026.03',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/computer-use',
    highlight: true,
  },
  {
    id: 'loop-scheduled-tasks',
    title: '/loop - Scheduled Recurring Tasks',
    titleZh: '/loop - 计划循环任务',
    summary:
      'Cron-style recurring execution (e.g., PR checks, deployment monitoring). Up to 50 concurrent tasks per session, auto-expires after 3 days, terminates when session closes.',
    summaryZh:
      'Cron 式循环执行任务（如 PR 检查、部署监控）。每会话最多 50 个并发任务，3 天后自动过期，会话关闭即终止。',
    category: 'automation',
    addedIn: '2026.03',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands#loop',
    highlight: true,
  },
  {
    id: 'voice-mode',
    title: 'Voice Mode - Push-to-Talk Coding',
    titleZh: '语音模式 - 按键语音编码',
    summary:
      'Hold spacebar to voice code (Push-to-Talk), supporting 20 languages. Ideal for hands-busy scenarios or pair programming sessions.',
    summaryZh:
      '按住空格键语音编码（按键通话），支持 20 种语言。适合双手忙碌时或结对编程场景。',
    category: 'workflow',
    addedIn: '2026.03',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/voice-mode',
    highlight: true,
  },
  {
    id: 'remote-control',
    title: 'Remote Control via Browser/Mobile',
    titleZh: '通过浏览器/手机远程控制',
    summary:
      'Research Preview (2026.02): Access and monitor local Claude Code sessions from phone or web browser. Code never leaves your machine — only encrypted chat messages are transmitted.',
    summaryZh:
      '研究预览版（2026.02）：通过手机或浏览器访问和监控本地 Claude Code 会话。代码不离本地，仅加密传输聊天消息。',
    category: 'ide',
    addedIn: '2026.02',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/remote-control',
    highlight: true,
  },
  {
    id: 'auto-memory',
    title: 'Auto-Memory - Persistent Project Knowledge',
    titleZh: '自动记忆 - 持久化项目知识',
    summary:
      'Automatically persists project-specific knowledge (architecture decisions, naming conventions, team standards). Context accumulates over time instead of resetting each session. Available for all users including Free tier since 2026.03.',
    summaryZh:
      '自动持久化项目特定知识（架构决策、命名规范、团队标准）。上下文随时间积累而非每次会话重置。2026.03 起所有用户（含免费版）均可用。',
    category: 'context',
    addedIn: '2026.02',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/memory',
    highlight: true,
  },
  {
    id: 'parallel-agents',
    title: 'Parallel Agents - Multi-Agent Task Decomposition',
    titleZh: '并行代理 - 多智能体任务分解',
    summary:
      'Decompose large tasks into subtasks executed by multiple coordinated Claude instances simultaneously (e.g., parallel frontend/backend builds). Works with Git Worktree isolation.',
    summaryZh:
      '将大任务分解为多个子任务，由多个协调的 Claude 实例同时执行（如前后端并行构建）。配合 Git Worktree 隔离使用。',
    category: 'automation',
    addedIn: '2026.02',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/sub-agents',
    highlight: true,
  },
  {
    id: 'plugin-ecosystem',
    title: 'Plugin Ecosystem - One-Click MCP Bundles',
    titleZh: '插件生态系统 - 一键安装 MCP 套件',
    summary:
      'One-click installation of MCP + Skills + Tools bundles with community plugin marketplace. Standardized MCP integrations allow third-party tools (GitLab, Snowflake) to natively connect.',
    summaryZh:
      '一键安装 MCP + Skills + Tools 套件，拥有社区插件市场。标准化 MCP 集成允许第三方工具（GitLab、Snowflake）原生接入。',
    category: 'mcp',
    addedIn: '2026.02',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/plugins',
    highlight: true,
  },
  {
    id: 'security-scanning',
    title: 'Security Scanning - Auto Vulnerability Detection',
    titleZh: '安全扫描 - 自动漏洞检测',
    summary:
      'Automatic vulnerability detection using Opus 4.6 reasoning to analyze data flows and provide patch recommendations. Enterprise-grade security feature.',
    summaryZh:
      '利用 Opus 4.6 推理能力自动检测漏洞，分析数据流并提供补丁建议。企业级安全功能。',
    category: 'security',
    addedIn: '2026.02',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/security',
    highlight: true,
  },
  {
    id: 'adaptive-thinking',
    title: 'Adaptive Thinking Mode',
    titleZh: '自适应思考模式',
    summary:
      'Opus 4.6 API mode (`thinking: {type: \'adaptive\'}`) where the model autonomously evaluates whether extended reasoning is needed, without manually setting budget_tokens.',
    summaryZh:
      'Opus 4.6 API 模式（`thinking: {type: \'adaptive\'}`），模型自主评估是否需要扩展推理，无需手动设置 budget_tokens。',
    category: 'ai',
    addedIn: '2026-Q1',
    docsUrl: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking',
  },
  {
    id: 'fast-mode-enterprise',
    title: 'Fast Mode & Data Residency (Enterprise)',
    titleZh: '快速模式与数据驻地（企业级）',
    summary:
      'Enterprise acceleration mode (`speed: \'fast\'`) with data residency controls (e.g., `inference_geo` routing to US infrastructure).',
    summaryZh:
      '企业级加速模式（`speed: \'fast\'`）及数据驻地控制（如 `inference_geo` 路由至美国基础设施）。',
    category: 'workflow',
    addedIn: '2026-Q1',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/enterprise',
  },
  {
    id: 'claude-sonnet-4',
    title: 'Claude Sonnet 4 & Haiku 4.5',
    titleZh: 'Claude Sonnet 4 与 Haiku 4.5',
    summary:
      'Claude Sonnet 4 remains default for most tasks with better reasoning and longer context. Haiku 4.5 now supports Extended Thinking mode for cost-sensitive background tasks.',
    summaryZh:
      'Claude Sonnet 4 仍是大多数任务的默认选择，推理能力更强、上下文更长。Haiku 4.5 现在支持扩展思考模式，适合成本敏感的后台任务。',
    category: 'ai',
    addedIn: '2025-Q4',
    docsUrl: 'https://docs.anthropic.com/en/docs/about-claude/models',
  },
  {
    id: 'no-flicker-mode',
    title: 'No-Flicker Mode & Focus View',
    titleZh: '无闪烁模式与焦点视图',
    summary:
      'Set CLAUDE_CODE_NO_FLICKER=1 to enable flicker-free alt-screen rendering with virtualized scrollback, eliminating visual noise in long sessions. Press Ctrl+O to toggle Focus View — shows only the prompt, a one-line tool summary, and the final response.',
    summaryZh:
      '设置 CLAUDE_CODE_NO_FLICKER=1 可启用无闪烁的替代屏幕渲染和虚拟化滚动缓冲，消除长会话中的视觉干扰。按 Ctrl+O 切换焦点视图 — 仅显示提示、单行工具摘要和最终回复。',
    category: 'workflow',
    addedIn: 'v2.1.89',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/configuration',
    highlight: true,
  },
  {
    id: 'defer-permission-decision',
    title: 'Defer Permission Decision in Hooks',
    titleZh: '钩子中的延迟权限决策',
    summary:
      'PreToolUse hooks can now return a "defer" permission decision, allowing headless sessions to pause at a dangerous tool call and resume with `claude -p --resume` to have the hook re-evaluate. Enables safer CI/CD workflows with human-in-the-loop approval.',
    summaryZh:
      'PreToolUse 钩子现在可以返回 "defer" 权限决策，允许无头会话在危险工具调用处暂停，并通过 `claude -p --resume` 恢复以让钩子重新评估。实现带人工审批循环的更安全 CI/CD 工作流。',
    category: 'security',
    addedIn: 'v2.1.89',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/hooks',
    highlight: true,
  },
  {
    id: 'powerup-interactive-lessons',
    title: '/powerup — Interactive Feature Lessons',
    titleZh: '/powerup — 交互式功能课程',
    summary:
      'New /powerup command launches guided interactive lessons that teach Claude Code features with animated demos. Ideal for onboarding new users or discovering advanced capabilities you may have missed.',
    summaryZh:
      '新的 /powerup 命令通过动画演示启动引导式交互课程，教授 Claude Code 功能。非常适合新用户入门或发现你可能错过的高级功能。',
    category: 'workflow',
    addedIn: 'v2.1.90',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands',
    highlight: true,
  },
  {
    id: 'monitor-tool',
    title: 'Monitor Tool for Background Scripts',
    titleZh: '后台脚本监控工具',
    summary:
      'New Monitor tool allows streaming events from background scripts into a Claude session, enabling real-time observability of long-running processes like build pipelines, test suites, and deployment scripts.',
    summaryZh:
      '新的 Monitor 工具允许将后台脚本的事件流式传输到 Claude 会话中，为构建管道、测试套件和部署脚本等长时间运行的进程提供实时可观测性。',
    category: 'automation',
    addedIn: 'v2.1.98',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/tools',
    highlight: true,
  },
  {
    id: 'team-onboarding-command',
    title: '/team-onboarding — Auto-Generate Ramp-Up Guides',
    titleZh: '/team-onboarding — 自动生成入门指南',
    summary:
      'The new /team-onboarding command generates a customized onboarding guide for new developers based on your codebase structure and local Claude Code usage patterns. Reduces time-to-productivity for new team members.',
    summaryZh:
      '新的 /team-onboarding 命令根据你的代码库结构和本地 Claude Code 使用模式，为新开发者生成定制的入门指南。缩短新团队成员的生产力提升时间。',
    category: 'workflow',
    addedIn: 'v2.1.101',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code/slash-commands',
    highlight: true,
  },
];
