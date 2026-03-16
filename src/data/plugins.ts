// ─── Plugin data ─────────────────────────────────────────────────────────────

export type PluginCategory = 'productivity' | 'security' | 'testing' | 'utility' | 'learning' | 'official';

export interface PluginInstallStep {
  stepEn: string;
  stepZh: string;
  code?: string;
}

export interface PluginCommand {
  name: string;
  descEn: string;
  descZh: string;
}

export interface PluginAgent {
  name: string;
  descEn: string;
  descZh: string;
}

export interface PluginStat {
  labelEn: string;
  labelZh: string;
  value: string;
}

export interface PluginHighlight {
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  icon: string;
}

export interface PluginSubItem {
  name: string;
  descEn: string;
  descZh: string;
  installCmd?: string;
}

export interface PluginGroup {
  groupIdEn: string;
  groupIdZh: string;
  icon: string;
  items: PluginSubItem[];
}

export interface Plugin {
  id: string;
  name: string;
  author: string;
  repo: string;
  repoUrl: string;
  docsUrl?: string;
  version: string;
  category: PluginCategory;
  stars: string;
  descEn: string;
  descZh: string;
  longDescEn: string;
  longDescZh: string;
  tags: string[];
  stats: PluginStat[];
  installSteps: PluginInstallStep[];
  highlights: PluginHighlight[];
  keyCommands?: PluginCommand[];
  agents?: PluginAgent[];
  pluginGroups?: PluginGroup[];
  highlight?: boolean;
}

// ─── Comparison types ─────────────────────────────────────────────────────────

export type PickType = 'official' | 'ecc' | 'both';

export interface ComparisonDimension {
  dimensionEn: string;
  dimensionZh: string;
  official: string;
  ecc: string;
  better: PickType;
}

export interface ComparisonUseCase {
  icon: string;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  pick: PickType;
}

// ─── Category labels ──────────────────────────────────────────────────────────

export const PLUGIN_CATEGORIES: Array<{ id: PluginCategory | 'all'; labelEn: string; labelZh: string }> = [
  { id: 'all',          labelEn: 'All',          labelZh: '全部' },
  { id: 'official',     labelEn: 'Official',      labelZh: '官方' },
  { id: 'productivity', labelEn: 'Productivity', labelZh: '效率提升' },
  { id: 'security',     labelEn: 'Security',     labelZh: '安全审计' },
  { id: 'testing',      labelEn: 'Testing',      labelZh: '测试' },
  { id: 'learning',     labelEn: 'Learning',     labelZh: '持续学习' },
  { id: 'utility',      labelEn: 'Utility',      labelZh: '工具集成' },
];

// ─── Plugin entries ───────────────────────────────────────────────────────────

export const plugins: Plugin[] = [
  // ── 1. Official Anthropic Marketplace ─────────────────────────────────────
  {
    id: 'claude-plugins-official',
    name: 'Claude Plugins — Official Marketplace',
    author: 'Anthropic',
    repo: 'anthropics/claude-code',
    repoUrl: 'https://code.claude.com/docs/en/discover-plugins',
    docsUrl: 'https://code.claude.com/docs/en/discover-plugins',
    version: 'Built-in',
    category: 'official',
    stars: 'Built-in',
    highlight: true,
    descEn:
      'The official Anthropic plugin marketplace — pre-configured and auto-updated. LSP code intelligence for 11 languages, 12+ external service integrations, dev-workflow agents, and output-style plugins.',
    descZh:
      'Anthropic 官方插件市场 — 自动内置、自动更新。涵盖 11 种语言的 LSP 代码智能、12+ 外部服务集成、开发工作流代理和输出风格插件。',
    longDescEn:
      'The official marketplace (`claude-plugins-official`) is automatically available in every Claude Code installation — no setup required. It is maintained by Anthropic, has auto-update enabled by default, and all plugins are security-audited. Plugins span four groups: Code Intelligence (LSP servers that give Claude real-time diagnostics and jump-to-definition), External Integrations (pre-configured MCP for GitHub, Jira, Figma, Supabase, etc.), Development Workflows (commit helpers, PR review agents), and Output Styles. Install any plugin with `/plugin install <name>@claude-plugins-official` and activate changes without restarting using `/reload-plugins`.',
    longDescZh:
      '官方插件市场（`claude-plugins-official`）在每个 Claude Code 安装中自动可用，无需额外配置，由 Anthropic 维护、默认启用自动更新、所有插件均经过安全审核。插件分四组：代码智能（LSP 服务器，提供实时诊断与跳转功能）、外部集成（GitHub、Jira、Figma、Supabase 等预置 MCP 插件）、开发工作流（提交助手、PR 审查代理）和输出风格。用 `/plugin install <name>@claude-plugins-official` 一命令安装，`/reload-plugins` 无需重启即时生效。',
    tags: ['official', 'anthropic', 'lsp', 'mcp', 'language-server', 'integrations', 'built-in'],
    stats: [
      { labelEn: 'LSP Languages',     labelZh: 'LSP 语言',   value: '11' },
      { labelEn: 'Integrations',       labelZh: '外部集成',   value: '12+' },
      { labelEn: 'Workflow Plugins',   labelZh: '工作流插件', value: '4' },
      { labelEn: 'Output Styles',      labelZh: '输出风格',   value: '2' },
      { labelEn: 'Marketplace',        labelZh: '插件市场',   value: '内置' },
      { labelEn: 'Auto-update',        labelZh: '自动更新',   value: '✓' },
    ],
    installSteps: [
      {
        stepEn: 'The official marketplace is pre-configured — no marketplace setup needed. Install any plugin directly:',
        stepZh: '官方插件市场已自动预置，无需配置，直接安装所需插件：',
        code: '# Install a plugin (user scope by default)\n/plugin install typescript-lsp@claude-plugins-official\n\n# Install with specific scope\nclaude plugin install github@claude-plugins-official --scope project',
      },
      {
        stepEn: 'Browse the full catalog interactively:',
        stepZh: '通过交互式管理器浏览完整目录：',
        code: '# Open the plugin manager\n/plugin\n# → Navigate to the "Discover" tab to browse all available plugins\n# → Press Enter on a plugin to choose installation scope (user / project / local)',
      },
      {
        stepEn: 'Apply plugin changes without restarting:',
        stepZh: '无需重启即可应用插件变更：',
        code: '# After installing/enabling/disabling plugins:\n/reload-plugins\n\n# Note: LSP server changes still require a full restart',
      },
      {
        stepEn: 'Manage plugins after installation:',
        stepZh: '安装后管理插件：',
        code: '# Disable (keeps installed)\n/plugin disable typescript-lsp@claude-plugins-official\n\n# Re-enable\n/plugin enable typescript-lsp@claude-plugins-official\n\n# Uninstall\n/plugin uninstall typescript-lsp@claude-plugins-official',
      },
    ],
    highlights: [
      {
        icon: '🔭',
        titleEn: 'Code Intelligence — 11 LSP Languages',
        titleZh: '代码智能 — 11 种 LSP 语言',
        descEn: 'After each file edit, Claude sees type errors, missing imports, and syntax issues via the language server without running a compiler. Supports TypeScript, Python, Go, Rust, Swift, Java, Kotlin, C/C++, C#, PHP, and Lua.',
        descZh: '每次文件编辑后，Claude 通过语言服务器自动获得类型错误、缺失导入和语法问题，无需运行编译器。支持 TypeScript、Python、Go、Rust、Swift、Java、Kotlin、C/C++、C#、PHP 和 Lua。',
      },
      {
        icon: '🔌',
        titleEn: 'External Integrations — 12+ MCP Plugins',
        titleZh: '外部集成 — 12+ 个 MCP 插件',
        descEn: 'Pre-configured MCP plugins for GitHub, GitLab, Jira/Confluence, Linear, Notion, Figma, Vercel, Supabase, Firebase, Slack, Sentry, and Asana. Zero manual MCP JSON configuration.',
        descZh: '预置 MCP 插件接入 GitHub、GitLab、Jira/Confluence、Linear、Notion、Figma、Vercel、Supabase、Firebase、Slack、Sentry 和 Asana，无需手动编写 MCP JSON 配置。',
      },
      {
        icon: '⚙️',
        titleEn: 'Development Workflow Plugins',
        titleZh: '开发工作流插件',
        descEn: 'commit-commands handles Git staging, commit message generation, and PR creation. pr-review-toolkit adds specialized PR review agents. agent-sdk-dev and plugin-dev help build extensions.',
        descZh: 'commit-commands 处理 Git 暂存、提交信息生成与 PR 创建；pr-review-toolkit 添加专用 PR 审查代理；agent-sdk-dev 和 plugin-dev 辅助构建扩展。',
      },
      {
        icon: '🤖',
        titleEn: 'Built-in & Auto-updated',
        titleZh: '内置且自动更新',
        descEn: 'No marketplace setup needed. Auto-update is on by default. Choose scope: user (all projects), project (team via .claude/settings.json), or local (private this repo).',
        descZh: '无需配置插件市场，默认自动更新。支持三种安装范围：用户级（所有项目）、项目级（团队共享）或本地级（仅本仓库）。',
      },
      {
        icon: '✍️',
        titleEn: 'Output Style Plugins',
        titleZh: '输出风格插件',
        descEn: 'explanatory-output-style adds educational commentary about implementation choices. learning-output-style enables an interactive mode where Claude teaches as it codes.',
        descZh: 'explanatory-output-style 添加关于实现选择的教学注释；learning-output-style 开启互动模式，让 Claude 边写代码边教学。',
      },
      {
        icon: '🛡️',
        titleEn: 'Security-Audited by Anthropic',
        titleZh: 'Anthropic 安全审核',
        descEn: 'All official plugins undergo security review. Submit community plugins via claude.ai/settings/plugins/submit or platform.claude.com/plugins/submit.',
        descZh: '所有官方插件均经 Anthropic 安全审核。可通过 claude.ai/settings/plugins/submit 提交社区插件。',
      },
    ],
    keyCommands: [
      { name: '/plugin',                                          descEn: 'Open plugin manager (Discover / Installed / Marketplaces / Errors)', descZh: '打开插件管理器（发现/已安装/市场/错误）' },
      { name: '/plugin install <n>@claude-plugins-official',     descEn: 'Install a plugin from the official marketplace',                     descZh: '从官方市场安装插件' },
      { name: '/plugin disable <n>@claude-plugins-official',     descEn: 'Disable without uninstalling',                                       descZh: '禁用但不卸载' },
      { name: '/plugin enable <n>@claude-plugins-official',      descEn: 'Re-enable a disabled plugin',                                        descZh: '重新启用已禁用插件' },
      { name: '/plugin uninstall <n>@claude-plugins-official',   descEn: 'Completely remove a plugin',                                         descZh: '完全卸载插件' },
      { name: '/reload-plugins',                                  descEn: 'Apply changes without restarting Claude Code',                       descZh: '无需重启即时应用插件变更' },
      { name: '/plugin marketplace list',                         descEn: 'List all configured marketplaces',                                   descZh: '列出所有已配置的插件市场' },
      { name: '/plugin marketplace update <name>',                descEn: 'Refresh plugin listings from a specific marketplace',                descZh: '刷新指定市场的插件列表' },
    ],
    agents: [],
    pluginGroups: [
      {
        groupIdEn: 'Code Intelligence (LSP)',
        groupIdZh: '代码智能（LSP）',
        icon: '🔭',
        items: [
          { name: 'typescript-lsp',    descEn: 'TypeScript / JavaScript', descZh: 'TypeScript / JavaScript', installCmd: '/plugin install typescript-lsp@claude-plugins-official' },
          { name: 'pyright-lsp',       descEn: 'Python',                  descZh: 'Python',                  installCmd: '/plugin install pyright-lsp@claude-plugins-official' },
          { name: 'gopls-lsp',         descEn: 'Go',                      descZh: 'Go',                      installCmd: '/plugin install gopls-lsp@claude-plugins-official' },
          { name: 'rust-analyzer-lsp', descEn: 'Rust',                    descZh: 'Rust',                    installCmd: '/plugin install rust-analyzer-lsp@claude-plugins-official' },
          { name: 'swift-lsp',         descEn: 'Swift',                   descZh: 'Swift',                   installCmd: '/plugin install swift-lsp@claude-plugins-official' },
          { name: 'jdtls-lsp',         descEn: 'Java',                    descZh: 'Java',                    installCmd: '/plugin install jdtls-lsp@claude-plugins-official' },
          { name: 'kotlin-lsp',        descEn: 'Kotlin',                  descZh: 'Kotlin',                  installCmd: '/plugin install kotlin-lsp@claude-plugins-official' },
          { name: 'clangd-lsp',        descEn: 'C / C++',                 descZh: 'C / C++',                 installCmd: '/plugin install clangd-lsp@claude-plugins-official' },
          { name: 'csharp-lsp',        descEn: 'C#',                      descZh: 'C#',                      installCmd: '/plugin install csharp-lsp@claude-plugins-official' },
          { name: 'php-lsp',           descEn: 'PHP',                     descZh: 'PHP',                     installCmd: '/plugin install php-lsp@claude-plugins-official' },
          { name: 'lua-lsp',           descEn: 'Lua',                     descZh: 'Lua',                     installCmd: '/plugin install lua-lsp@claude-plugins-official' },
        ],
      },
      {
        groupIdEn: 'External Integrations (MCP)',
        groupIdZh: '外部集成（MCP）',
        icon: '🔌',
        items: [
          { name: 'github',    descEn: 'GitHub repos, issues & PRs',         descZh: 'GitHub 仓库、Issue 与 PR',   installCmd: '/plugin install github@claude-plugins-official' },
          { name: 'gitlab',    descEn: 'GitLab repositories & CI/CD',        descZh: 'GitLab 仓库与 CI/CD',        installCmd: '/plugin install gitlab@claude-plugins-official' },
          { name: 'atlassian', descEn: 'Jira & Confluence',                  descZh: 'Jira 与 Confluence',         installCmd: '/plugin install atlassian@claude-plugins-official' },
          { name: 'linear',    descEn: 'Linear issue tracking',              descZh: 'Linear 工单管理',             installCmd: '/plugin install linear@claude-plugins-official' },
          { name: 'notion',    descEn: 'Notion pages & databases',           descZh: 'Notion 文档与数据库',         installCmd: '/plugin install notion@claude-plugins-official' },
          { name: 'figma',     descEn: 'Figma design files',                 descZh: 'Figma 设计稿',               installCmd: '/plugin install figma@claude-plugins-official' },
          { name: 'vercel',    descEn: 'Vercel deployments & projects',      descZh: 'Vercel 部署与项目',           installCmd: '/plugin install vercel@claude-plugins-official' },
          { name: 'supabase',  descEn: 'Supabase database & auth',           descZh: 'Supabase 数据库与认证',      installCmd: '/plugin install supabase@claude-plugins-official' },
          { name: 'firebase',  descEn: 'Firebase services',                  descZh: 'Firebase 服务',              installCmd: '/plugin install firebase@claude-plugins-official' },
          { name: 'slack',     descEn: 'Slack messaging & channels',         descZh: 'Slack 消息与频道',            installCmd: '/plugin install slack@claude-plugins-official' },
          { name: 'sentry',    descEn: 'Error monitoring & alerts',          descZh: '错误监控与告警',              installCmd: '/plugin install sentry@claude-plugins-official' },
          { name: 'asana',     descEn: 'Asana project management',           descZh: 'Asana 项目管理',             installCmd: '/plugin install asana@claude-plugins-official' },
        ],
      },
      {
        groupIdEn: 'Development Workflows',
        groupIdZh: '开发工作流',
        icon: '⚙️',
        items: [
          { name: 'commit-commands',   descEn: 'Git commit, push & PR creation',           descZh: 'Git 提交、推送与创建 PR',   installCmd: '/plugin install commit-commands@claude-plugins-official' },
          { name: 'pr-review-toolkit', descEn: 'Specialized PR review agents',             descZh: '专用 PR 审查代理',          installCmd: '/plugin install pr-review-toolkit@claude-plugins-official' },
          { name: 'agent-sdk-dev',     descEn: 'Tools for building with Claude Agent SDK', descZh: 'Claude Agent SDK 开发工具', installCmd: '/plugin install agent-sdk-dev@claude-plugins-official' },
          { name: 'plugin-dev',        descEn: 'Toolkit for creating your own plugins',    descZh: '自定义插件开发工具包',       installCmd: '/plugin install plugin-dev@claude-plugins-official' },
        ],
      },
      {
        groupIdEn: 'Output Styles',
        groupIdZh: '输出风格',
        icon: '✍️',
        items: [
          { name: 'explanatory-output-style', descEn: 'Educational commentary on implementation choices', descZh: '关于实现选择的教学注释', installCmd: '/plugin install explanatory-output-style@claude-plugins-official' },
          { name: 'learning-output-style',    descEn: 'Interactive learning mode for skill-building',    descZh: '互动技能学习模式',          installCmd: '/plugin install learning-output-style@claude-plugins-official' },
        ],
      },
    ],
  },

  // ── 2. Everything Claude Code ──────────────────────────────────────────────
  {
    id: 'everything-claude-code',
    name: 'Everything Claude Code (ECC)',
    author: 'affaan-m',
    repo: 'affaan-m/everything-claude-code',
    repoUrl: 'https://github.com/affaan-m/everything-claude-code',
    docsUrl: 'https://ecc.tools',
    version: 'v1.8.0',
    category: 'productivity',
    stars: '77k+',
    highlight: true,
    descEn: 'The agent harness performance optimization system for Claude Code. Skills, instincts, memory, security, and research-first development.',
    descZh: '专为 Claude Code 打造的智能体增强系统，涵盖技能、记忆持久化、安全审计与研究优先开发流程。',
    longDescEn:
      'Everything Claude Code (ECC) is a production-ready agent harness built over 10+ months of intensive daily use building real products. It provides 16 specialized sub-agents, 65+ skills, 40+ slash commands, automatic session hooks, rules, and MCP configurations. Winner of the Anthropic x Forum Ventures hackathon. Works across Claude Code, Cursor, Codex, and OpenCode.',
    longDescZh:
      'Everything Claude Code (ECC) 是经过 10 个月实战打磨的生产级智能体增强系统，提供 16 个专用子代理、65+ 技能、40+ 斜杠命令、自动化会话钩子、规则与 MCP 配置，荣获 Anthropic x Forum Ventures 黑客松冠军，支持 Claude Code、Cursor、Codex 和 OpenCode。',
    tags: ['agents', 'skills', 'hooks', 'mcp', 'memory', 'security', 'tdd', 'multi-agent'],
    stats: [
      { labelEn: 'Agents',   labelZh: '子代理', value: '16' },
      { labelEn: 'Skills',   labelZh: '技能',   value: '65+' },
      { labelEn: 'Commands', labelZh: '命令',   value: '40+' },
      { labelEn: 'Rules',    labelZh: '规则',   value: '34' },
      { labelEn: 'Stars',    labelZh: '星标',   value: '77k+' },
      { labelEn: 'Tests',    labelZh: '测试',   value: '997' },
    ],
    installSteps: [
      {
        stepEn: 'Step 1 — Add the marketplace and install the plugin inside Claude Code:',
        stepZh: '第一步 — 在 Claude Code 中添加插件市场并安装插件：',
        code: `# Add marketplace\n/plugin marketplace add affaan-m/everything-claude-code\n\n# Install plugin\n/plugin install everything-claude-code@everything-claude-code`,
      },
      {
        stepEn: 'Step 2 — Install rules (required, manual step — plugins cannot distribute rules automatically):',
        stepZh: '第二步 — 安装规则（必须手动操作，插件无法自动分发规则）：',
        code: `git clone https://github.com/affaan-m/everything-claude-code.git\ncd everything-claude-code\n\n# Recommended: use the installer script\n./install.sh typescript    # or python / golang / swift / php`,
      },
      {
        stepEn: 'Step 3 — Start using ECC commands (namespaced form when installed via plugin):',
        stepZh: '第三步 — 开始使用 ECC 命令（通过插件安装时使用命名空间形式）：',
        code: `/everything-claude-code:plan "Add user authentication"\n\n# Check all available commands\n/plugin list everything-claude-code@everything-claude-code`,
      },
      {
        stepEn: 'Alternative — Manual installation (copy components directly):',
        stepZh: '替代方案 — 手动安装（直接复制组件）：',
        code: `# Copy agents\ncp everything-claude-code/agents/*.md ~/.claude/agents/\n\n# Copy commands\ncp everything-claude-code/commands/*.md ~/.claude/commands/\n\n# Copy core skills\ncp -r everything-claude-code/.agents/skills/* ~/.claude/skills/`,
      },
    ],
    highlights: [
      {
        icon: '🤖',
        titleEn: '16 Specialized Sub-agents',
        titleZh: '16 个专用子代理',
        descEn: 'Delegate tasks to purpose-built agents: planner, architect, tdd-guide, code-reviewer, security-reviewer, e2e-runner, refactor-cleaner, go-reviewer, python-reviewer, and more.',
        descZh: '将任务委托给专用代理：规划器、架构师、TDD 指导、代码审查、安全审查、E2E 测试、重构清理、Go/Python 代码审查等。',
      },
      {
        icon: '🧠',
        titleEn: 'Continuous Learning (Instincts)',
        titleZh: '持续学习（直觉系统）',
        descEn: 'The instinct-based learning system auto-extracts patterns from sessions. Use /instinct-status, /instinct-export, /evolve to build reusable skills from your work.',
        descZh: '基于直觉的学习系统可自动从会话中提取规律，通过 /instinct-status、/instinct-export、/evolve 将经验构建成可复用技能。',
      },
      {
        icon: '🔒',
        titleEn: 'AgentShield Security Auditor',
        titleZh: 'AgentShield 安全审计器',
        descEn: 'Run /security-scan to audit your Claude Code configuration for vulnerabilities — 102 rules, 1282 tests, covering secrets, permissions, hook injection, and MCP risk.',
        descZh: '运行 /security-scan 对 Claude Code 配置进行漏洞审计，涵盖秘钥泄露、权限、钩子注入和 MCP 风险，102 条规则、1282 个测试。',
      },
      {
        icon: '🎣',
        titleEn: 'Session Hooks & Memory',
        titleZh: '会话钩子与记忆持久化',
        descEn: 'Hooks fire automatically on SessionStart, Stop, PreToolUse, PostToolUse events to save/restore session context, warn about console.log, detect secrets, and more.',
        descZh: '钩子在 SessionStart、Stop、PreToolUse、PostToolUse 事件上自动触发，实现上下文存储/恢复、console.log 警告、秘钥检测等。',
      },
      {
        icon: '⚡',
        titleEn: 'Token Optimization',
        titleZh: 'Token 使用优化',
        descEn: 'Recommended settings cut costs 60–70%: Sonnet as default, cap thinking tokens at 10k, auto-compact at 50%. Switch to Opus only for deep architectural reasoning.',
        descZh: '推荐配置降低 60–70% 成本：Sonnet 默认、思考 Token 限 10k、自动压缩 50%，仅深度推理时切换 Opus。',
      },
      {
        icon: '🌐',
        titleEn: 'Cross-Platform Support',
        titleZh: '全平台支持',
        descEn: 'Works across Claude Code, Cursor IDE, OpenCode, and Codex (macOS + CLI). Single AGENTS.md is read natively by all four platforms. DRY adapter pattern for hooks.',
        descZh: '支持 Claude Code、Cursor IDE、OpenCode 和 Codex（macOS + CLI）。根目录 AGENTS.md 被四个平台原生读取，钩子使用 DRY 适配器模式。',
      },
    ],
    keyCommands: [
      { name: '/plan',            descEn: 'Create an implementation plan for a feature',        descZh: '为功能创建实施计划' },
      { name: '/tdd',             descEn: 'Enforce test-driven development workflow',            descZh: '强制执行测试驱动开发工作流' },
      { name: '/code-review',     descEn: 'Review code for quality and security',                descZh: '审查代码质量与安全性' },
      { name: '/build-fix',       descEn: 'Diagnose and fix build errors automatically',         descZh: '自动诊断并修复构建错误' },
      { name: '/e2e',             descEn: 'Generate Playwright end-to-end tests',                descZh: '生成 Playwright 端对端测试' },
      { name: '/security-scan',   descEn: 'Audit Claude Code config for vulnerabilities',        descZh: '审计 Claude Code 配置漏洞' },
      { name: '/refactor-clean',  descEn: 'Remove dead code and clean up the codebase',          descZh: '清除死代码，整理代码库' },
      { name: '/learn',           descEn: 'Extract reusable patterns from current session',      descZh: '从当前会话中提取可复用规律' },
      { name: '/checkpoint',      descEn: 'Save the current verification state',                 descZh: '保存当前验证状态' },
      { name: '/orchestrate',     descEn: 'Coordinate multiple sub-agents for complex tasks',    descZh: '协调多个子代理处理复杂任务' },
      { name: '/multi-plan',      descEn: 'Decompose a task for multi-agent parallel execution', descZh: '将任务分解为多代理并行执行' },
      { name: '/harness-audit',   descEn: 'Audit harness reliability and risk posture',          descZh: '审计代理框架可靠性与风险' },
      { name: '/instinct-status', descEn: 'View learned instincts with confidence scores',       descZh: '查看已学习的直觉及置信分数' },
      { name: '/evolve',          descEn: 'Cluster instincts into reusable skills',              descZh: '将直觉聚合为可复用技能' },
      { name: '/model-route',     descEn: 'Route tasks to models by complexity and budget',      descZh: '按复杂度和预算将任务路由到合适模型' },
      { name: '/update-docs',     descEn: 'Sync documentation with current code state',          descZh: '将文档与当前代码状态同步' },
    ],
    agents: [
      { name: 'planner',              descEn: 'Feature implementation planning',          descZh: '功能实施规划' },
      { name: 'architect',            descEn: 'System design decisions',                  descZh: '系统架构设计' },
      { name: 'tdd-guide',            descEn: 'Test-driven development enforcement',      descZh: '测试驱动开发指导' },
      { name: 'code-reviewer',        descEn: 'Quality and security code review',         descZh: '质量与安全代码审查' },
      { name: 'security-reviewer',    descEn: 'OWASP vulnerability analysis',             descZh: 'OWASP 漏洞分析' },
      { name: 'build-error-resolver', descEn: 'Build error diagnosis and resolution',     descZh: '构建错误诊断与修复' },
      { name: 'e2e-runner',           descEn: 'Playwright E2E test generation',           descZh: 'Playwright E2E 测试生成' },
      { name: 'refactor-cleaner',     descEn: 'Dead code cleanup and refactoring',        descZh: '死代码清理与重构' },
      { name: 'doc-updater',          descEn: 'Documentation sync with codebase',         descZh: '文档与代码库同步' },
      { name: 'go-reviewer',          descEn: 'Go-specific code review',                  descZh: 'Go 专项代码审查' },
      { name: 'go-build-resolver',    descEn: 'Go build error resolution',                descZh: 'Go 构建错误修复' },
      { name: 'python-reviewer',      descEn: 'Python code review (PEP 8, type hints)',   descZh: 'Python 代码审查（PEP 8、类型提示）' },
      { name: 'database-reviewer',    descEn: 'Database / Supabase query review',         descZh: '数据库 / Supabase 查询审查' },
    ],
  },
];

// ─── Comparison data ──────────────────────────────────────────────────────────

export const comparisonDimensions: ComparisonDimension[] = [
  { dimensionEn: 'Maintained by',               dimensionZh: '维护方',           official: 'Anthropic (official)',           ecc: 'Community (affaan-m)',             better: 'both'     },
  { dimensionEn: 'Setup required',              dimensionZh: '安装配置',          official: 'None — pre-installed',           ecc: 'Marketplace + rules install',     better: 'official' },
  { dimensionEn: 'Auto-update',                 dimensionZh: '自动更新',          official: '✓ Default ON',                  ecc: 'Via marketplace',                  better: 'official' },
  { dimensionEn: 'Code intelligence (LSP)',     dimensionZh: '代码智能（LSP）',   official: '11 languages built-in',          ecc: '— (relies on official LSP)',       better: 'official' },
  { dimensionEn: 'External integrations',       dimensionZh: '外部服务集成',      official: '12+ pre-configured MCP',         ecc: 'MCP configs (manual keys)',        better: 'official' },
  { dimensionEn: 'Custom sub-agents',           dimensionZh: '自定义子代理',      official: 'PR review, commit agents',       ecc: '16 specialized agents',           better: 'ecc'      },
  { dimensionEn: 'Slash commands',              dimensionZh: '斜杠命令',          official: '~10 workflow commands',          ecc: '40+ commands',                    better: 'ecc'      },
  { dimensionEn: 'Skills library',              dimensionZh: '技能库',            official: '2 output-style skills',          ecc: '65+ domain skills',               better: 'ecc'      },
  { dimensionEn: 'Session hooks',               dimensionZh: '会话钩子',          official: 'Basic hooks',                    ecc: '20+ hook scripts',                better: 'ecc'      },
  { dimensionEn: 'Continuous learning',         dimensionZh: '持续学习',          official: '—',                              ecc: 'Instinct system + /evolve',        better: 'ecc'      },
  { dimensionEn: 'Security auditing',           dimensionZh: '安全审计',          official: 'Anthropic-reviewed plugins',     ecc: 'AgentShield (102 rules)',          better: 'both'     },
  { dimensionEn: 'Cross-platform',              dimensionZh: '跨平台支持',        official: 'Claude Code only',               ecc: 'CC + Cursor + Codex + OpenCode',  better: 'ecc'      },
  { dimensionEn: 'Token optimization',          dimensionZh: 'Token 优化',       official: '—',                              ecc: 'strategic-compact + settings',    better: 'ecc'      },
  { dimensionEn: 'Multi-agent orchestration',   dimensionZh: '多代理编排',        official: '—',                              ecc: '/multi-plan + /multi-execute',     better: 'ecc'      },
];

export const comparisonUseCases: ComparisonUseCase[] = [
  { icon: '🚀', titleEn: 'Quick start — zero config',                titleZh: '快速上手 — 零配置',                  descEn: 'Just installed Claude Code and want immediate value without any setup. Official plugins are pre-loaded.',                                                                     descZh: '刚安装好 Claude Code，希望无配置立刻上手，官方插件已预置，直接 /plugin 选装即可。',                              pick: 'official' },
  { icon: '🔭', titleEn: 'Real-time type errors & code navigation',  titleZh: '实时类型错误与代码导航',              descEn: 'Want Claude to see TypeScript / Python / Go type errors immediately after every edit and jump to definitions precisely.',                                               descZh: '希望 Claude 在每次编辑后立即看到 TS/Python/Go 类型错误并能精准跳转到定义。',                                       pick: 'official' },
  { icon: '🔌', titleEn: 'Connect to GitHub / Jira / Figma',         titleZh: '接入 GitHub / Jira / Figma',          descEn: 'Need Claude to query Jira tickets, create GitHub PRs, or read Figma designs without writing any MCP JSON config manually.',                                            descZh: '需要 Claude 接入 Jira、GitHub PR 或 Figma 设计稿，且不想手写任何 MCP JSON 配置。',                                 pick: 'official' },
  { icon: '🤖', titleEn: 'Complex feature — multi-component build',  titleZh: '大型功能 — 多模块建设',               descEn: "Building auth + DB + API + frontend. ECC's /plan → /tdd → /code-review → /e2e pipeline with specialized agents at each stage.",                                        descZh: '开发涉及认证、数据库、API 和前端的功能，通过 ECC 的 /plan→/tdd→/code-review→/e2e 流水线，每环节由专用代理把关。', pick: 'ecc'      },
  { icon: '🔒', titleEn: 'Harden your Claude Code configuration',    titleZh: '强化 Claude Code 安全配置',           descEn: 'Audit CLAUDE.md, hooks, MCP configs, and settings for prompt injection, leaked secrets, and permission issues via /security-scan.',                                   descZh: '通过 /security-scan 审计 CLAUDE.md、钩子、MCP 配置，排查提示注入、秘钥泄露和权限问题。',                          pick: 'ecc'      },
  { icon: '🧠', titleEn: 'Accumulate project-specific knowledge',    titleZh: '积累项目专属知识',                   descEn: 'Let Claude learn your codebase patterns via /learn and /evolve, building reusable instinct-based skills from your actual sessions.',                                  descZh: '通过 /learn 和 /evolve 让 Claude 从实际会话中学习代码库规律，构建可复用的项目专属技能。',                           pick: 'ecc'      },
  { icon: '💰', titleEn: 'Minimize API costs',                       titleZh: '最小化 API 成本',                    descEn: "ECC's token optimization (Sonnet default, 10k think tokens, 50% auto-compact) + strategic-compact skill cuts costs 60–70%.",                                       descZh: '使用 ECC 的 Token 优化配置与 strategic-compact 技能，降低 60–70% 成本。',                                          pick: 'ecc'      },
  { icon: '🌐', titleEn: 'Use across Cursor / Codex / OpenCode',     titleZh: '同时在 Cursor / Codex / OpenCode 使用', descEn: "ECC's AGENTS.md is read natively by all four platforms. One repo = consistent skills, agents, and hooks everywhere.",                                            descZh: 'ECC 的 AGENTS.md 被四个平台原生读取，一个仓库在所有平台上获得一致体验。',                                            pick: 'ecc'      },
  { icon: '✅', titleEn: 'Everyday coding — any stack',              titleZh: '日常编码 — 任意技术栈',               descEn: 'Install official LSP + integration plugins for your stack, then add ECC for advanced workflows. The two complement each other perfectly.',                           descZh: '为技术栈安装官方 LSP + 集成插件，叠加 ECC 获得高级代理工作流，两者完美互补。',                                     pick: 'both'     },
  { icon: '👥', titleEn: 'Team onboarding — shared repo config',     titleZh: '团队上手 — 共享仓库配置',             descEn: 'Add both to .claude/settings.json (extraKnownMarketplaces + enabledPlugins). Teammates get prompted to install on first open.',                                     descZh: '将两者写入 .claude/settings.json，团队成员首次打开时收到安装提示，实现零摩擦团队共享。',                            pick: 'both'     },
];
