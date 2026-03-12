import type { CommandEntry } from './types';

export const settings: CommandEntry[] = [
  // ─── Core Model Settings ──────────────────────────────────────────────
  {
    id: 'setting-model',
    name: 'model',
    syntax: '"model": "claude-sonnet-4-6"',
    section: 'settings',
    subCategory: 'Model & Performance',
    complexity: 'beginner',
    tags: ['model', 'config'],
    examples: ['"model": "claude-sonnet-4-6"', '"model": "claude-opus-4-5"', '"model": "claude-haiku-4-5"'],
    i18n: {
      en: { description: 'Override the default AI model for all sessions using this settings file.', notes: 'Location: .claude/settings.json or ~/.claude/settings.json' },
      'zh-CN': { description: '覆盖使用此设置文件的所有会话的默认 AI 模型。', notes: '位置：.claude/settings.json 或 ~/.claude/settings.json' },
    },
  },
  {
    id: 'setting-always-thinking',
    name: 'alwaysThinkingEnabled',
    syntax: '"alwaysThinkingEnabled": true',
    section: 'settings',
    subCategory: 'Model & Performance',
    complexity: 'intermediate',
    tags: ['thinking', 'reasoning', 'quality'],
    examples: ['"alwaysThinkingEnabled": true'],
    i18n: {
      en: { description: 'Enable extended thinking mode by default for all sessions.' },
      'zh-CN': { description: '默认为所有会话启用扩展思考模式。' },
    },
  },
  {
    id: 'setting-available-models',
    name: 'availableModels',
    syntax: '"availableModels": ["claude-sonnet-4-6", "claude-haiku-4-5"]',
    section: 'settings',
    subCategory: 'Model & Performance',
    complexity: 'advanced',
    tags: ['model', 'enterprise', 'restriction'],
    examples: ['"availableModels": ["claude-sonnet-4-6"]'],
    i18n: {
      en: { description: 'Restrict which models users can select in the model picker. Useful for enterprise cost control.', notes: 'Managed setting — use in managed-settings.json' },
      'zh-CN': { description: '限制用户可在模型选择器中选择的模型。适用于企业成本控制。', notes: '管理配置项 — 在 managed-settings.json 中使用' },
    },
  },

  // ─── Permissions ──────────────────────────────────────────────────────
  {
    id: 'setting-permissions-allow',
    name: 'permissions.allow',
    syntax: '"permissions": { "allow": ["Bash(git *)", "Read"] }',
    section: 'settings',
    subCategory: 'Permissions',
    complexity: 'intermediate',
    tags: ['permissions', 'tools', 'security'],
    examples: [
      '"permissions": { "allow": ["Bash(git *)", "Read", "Edit"] }',
      '"permissions": { "allow": ["Bash(npm run *)", "Write(src/**)"] }',
    ],
    i18n: {
      en: { description: 'Tools that always execute without prompting. Supports glob patterns for Bash commands and path restrictions for file tools.' },
      'zh-CN': { description: '始终无需提示即可执行的工具。支持 Bash 命令的通配符模式和文件工具的路径限制。' },
    },
  },
  {
    id: 'setting-permissions-deny',
    name: 'permissions.deny',
    syntax: '"permissions": { "deny": ["Bash(rm -rf *)", "WebFetch"] }',
    section: 'settings',
    subCategory: 'Permissions',
    complexity: 'intermediate',
    tags: ['permissions', 'security', 'restriction'],
    examples: [
      '"permissions": { "deny": ["Bash(curl *)", "WebFetch", "WebSearch"] }',
    ],
    i18n: {
      en: { description: 'Tools that are always denied and cannot be used in any session using this settings file.' },
      'zh-CN': { description: '始终被拒绝的工具，使用此设置文件的任何会话都无法使用这些工具。' },
    },
  },
  {
    id: 'setting-permissions-default-mode',
    name: 'permissions.defaultMode',
    syntax: '"permissions": { "defaultMode": "acceptEdits" }',
    section: 'settings',
    subCategory: 'Permissions',
    complexity: 'intermediate',
    tags: ['permissions', 'mode', 'config'],
    examples: [
      '"permissions": { "defaultMode": "acceptEdits" }',
      '"permissions": { "defaultMode": "plan" }',
      '"permissions": { "defaultMode": "bypassPermissions" }',
    ],
    i18n: {
      en: { description: 'Set the default permission mode for new sessions: acceptEdits, plan, or bypassPermissions.' },
      'zh-CN': { description: '为新会话设置默认权限模式：acceptEdits、plan 或 bypassPermissions。' },
    },
  },

  // ─── Sandbox ──────────────────────────────────────────────────────────
  {
    id: 'setting-sandbox-enabled',
    name: 'sandbox.enabled',
    syntax: '"sandbox": { "enabled": true }',
    section: 'settings',
    subCategory: 'Sandbox',
    complexity: 'advanced',
    tags: ['security', 'sandbox', 'isolation'],
    examples: ['"sandbox": { "enabled": true }'],
    i18n: {
      en: { description: 'Enable bash sandboxing to isolate Claude from the filesystem and network (macOS, Linux, WSL2).' },
      'zh-CN': { description: '启用 bash 沙盒，将 Claude 与文件系统和网络隔离（macOS、Linux、WSL2）。' },
    },
  },
  {
    id: 'setting-sandbox-network',
    name: 'sandbox.network.allowedDomains',
    syntax: '"sandbox": { "network": { "allowedDomains": ["api.example.com"] } }',
    section: 'settings',
    subCategory: 'Sandbox',
    complexity: 'advanced',
    tags: ['security', 'sandbox', 'network'],
    examples: ['"sandbox": { "network": { "allowedDomains": ["api.github.com", "registry.npmjs.org"] } }'],
    i18n: {
      en: { description: 'Allowlist specific domains for outbound network traffic when sandbox mode is enabled.' },
      'zh-CN': { description: '启用沙盒模式时，将特定域名加入出站网络流量白名单。' },
    },
  },

  // ─── Session & Cleanup ────────────────────────────────────────────────
  {
    id: 'setting-cleanup-period',
    name: 'cleanupPeriodDays',
    syntax: '"cleanupPeriodDays": 30',
    section: 'settings',
    subCategory: 'Session & Storage',
    complexity: 'intermediate',
    tags: ['storage', 'cleanup', 'session'],
    examples: ['"cleanupPeriodDays": 7', '"cleanupPeriodDays": 90'],
    i18n: {
      en: { description: 'Number of days to retain sessions before automatic cleanup. Default is 30 days.' },
      'zh-CN': { description: '自动清理前保留会话的天数。默认为 30 天。' },
    },
  },
  {
    id: 'setting-language',
    name: 'language',
    syntax: '"language": "zh-CN"',
    section: 'settings',
    subCategory: 'Session & Storage',
    complexity: 'beginner',
    tags: ['language', 'localization'],
    examples: ['"language": "zh-CN"', '"language": "ja"', '"language": "en"'],
    i18n: {
      en: { description: 'Force Claude to respond in a specific language, regardless of the input language.' },
      'zh-CN': { description: '强制 Claude 以指定语言回复，不受输入语言影响。' },
    },
  },
  {
    id: 'setting-output-style',
    name: 'outputStyle',
    syntax: '"outputStyle": "Explanatory"',
    section: 'settings',
    subCategory: 'Session & Storage',
    complexity: 'intermediate',
    tags: ['output', 'style', 'customization'],
    examples: ['"outputStyle": "Explanatory"', '"outputStyle": "Concise"'],
    i18n: {
      en: { description: 'Adjust the default output verbosity style via the system prompt.' },
      'zh-CN': { description: '通过系统提示调整默认输出详细程度风格。' },
    },
  },

  // ─── Hooks ────────────────────────────────────────────────────────────
  {
    id: 'setting-hooks',
    name: 'hooks',
    syntax: '"hooks": { "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command", "command": "echo pre-bash" }] }] }',
    section: 'settings',
    subCategory: 'Hooks & Automation',
    complexity: 'advanced',
    tags: ['hooks', 'automation', 'tools'],
    examples: [
      '"hooks": { "PostToolUse": [{ "matcher": "Write", "hooks": [{ "type": "command", "command": "prettier --write {{file}}" }] }] }',
    ],
    i18n: {
      en: { description: 'Define shell commands to run at tool lifecycle events: PreToolUse, PostToolUse, Stop, SubagentStop.' },
      'zh-CN': { description: '定义在工具生命周期事件（PreToolUse、PostToolUse、Stop、SubagentStop）时运行的 Shell 命令。' },
    },
  },

  // ─── Attribution ──────────────────────────────────────────────────────
  {
    id: 'setting-attribution-commit',
    name: 'attribution.commit',
    syntax: '"attribution": { "commit": false }',
    section: 'settings',
    subCategory: 'Git & Attribution',
    complexity: 'intermediate',
    tags: ['git', 'attribution'],
    examples: ['"attribution": { "commit": false }', '"attribution": { "commit": true }'],
    i18n: {
      en: { description: 'Control whether Claude adds "Co-Authored-By: Claude" attribution to git commits.' },
      'zh-CN': { description: '控制 Claude 是否在 git 提交中添加"Co-Authored-By: Claude"署名。' },
    },
  },
  {
    id: 'setting-auto-updates',
    name: 'autoUpdatesChannel',
    syntax: '"autoUpdatesChannel": "stable"',
    section: 'settings',
    subCategory: 'Updates & Telemetry',
    complexity: 'intermediate',
    tags: ['updates', 'config'],
    examples: ['"autoUpdatesChannel": "stable"', '"autoUpdatesChannel": "latest"'],
    i18n: {
      en: { description: 'Set the auto-update channel: "stable" for tested releases or "latest" (default) for the newest version.' },
      'zh-CN': { description: '设置自动更新通道："stable" 表示已测试版本，"latest"（默认）表示最新版本。' },
    },
  },
];

export const envVars: CommandEntry[] = [
  // ─── API & Auth ───────────────────────────────────────────────────────
  {
    id: 'env-api-key',
    name: 'ANTHROPIC_API_KEY',
    syntax: 'export ANTHROPIC_API_KEY="sk-ant-..."',
    section: 'env-vars',
    subCategory: 'API & Auth',
    complexity: 'beginner',
    tags: ['auth', 'api', 'new-user'],
    examples: ['export ANTHROPIC_API_KEY="sk-ant-api03-..."'],
    i18n: {
      en: { description: 'Your Anthropic API key for direct API-key-based authentication (bypasses claude.ai login).' },
      'zh-CN': { description: '用于直接 API 密钥身份验证的 Anthropic API 密钥（绕过 claude.ai 登录）。' },
    },
  },
  {
    id: 'env-model',
    name: 'ANTHROPIC_MODEL',
    syntax: 'export ANTHROPIC_MODEL="claude-sonnet-4-6"',
    section: 'env-vars',
    subCategory: 'API & Auth',
    complexity: 'beginner',
    tags: ['model', 'config'],
    examples: ['export ANTHROPIC_MODEL="claude-opus-4-5"'],
    i18n: {
      en: { description: 'Override the default AI model via environment variable.' },
      'zh-CN': { description: '通过环境变量覆盖默认 AI 模型。' },
    },
  },

  // ─── Cloud Providers ──────────────────────────────────────────────────
  {
    id: 'env-bedrock',
    name: 'CLAUDE_CODE_USE_BEDROCK',
    syntax: 'export CLAUDE_CODE_USE_BEDROCK=1',
    section: 'env-vars',
    subCategory: 'Cloud Providers',
    complexity: 'advanced',
    tags: ['aws', 'bedrock', 'enterprise'],
    examples: ['export CLAUDE_CODE_USE_BEDROCK=1'],
    i18n: {
      en: { description: 'Route API calls through AWS Bedrock instead of the Anthropic API.' },
      'zh-CN': { description: '通过 AWS Bedrock 而非 Anthropic API 路由 API 调用。' },
    },
  },
  {
    id: 'env-vertex',
    name: 'CLAUDE_CODE_USE_VERTEX',
    syntax: 'export CLAUDE_CODE_USE_VERTEX=1',
    section: 'env-vars',
    subCategory: 'Cloud Providers',
    complexity: 'advanced',
    tags: ['gcp', 'vertex', 'enterprise'],
    examples: ['export CLAUDE_CODE_USE_VERTEX=1'],
    i18n: {
      en: { description: 'Route API calls through Google Cloud Vertex AI instead of the Anthropic API.' },
      'zh-CN': { description: '通过 Google Cloud Vertex AI 而非 Anthropic API 路由 API 调用。' },
    },
  },

  // ─── Behavior & Limits ────────────────────────────────────────────────
  {
    id: 'env-effort-level',
    name: 'CLAUDE_CODE_EFFORT_LEVEL',
    syntax: 'export CLAUDE_CODE_EFFORT_LEVEL=high',
    section: 'env-vars',
    subCategory: 'Behavior & Limits',
    complexity: 'intermediate',
    tags: ['reasoning', 'quality', 'performance'],
    examples: ['export CLAUDE_CODE_EFFORT_LEVEL=low', 'export CLAUDE_CODE_EFFORT_LEVEL=medium', 'export CLAUDE_CODE_EFFORT_LEVEL=high'],
    i18n: {
      en: { description: 'Control reasoning effort level: low (fast/cheap), medium (balanced), high (most capable).' },
      'zh-CN': { description: '控制推理努力程度：low（快速/低成本）、medium（均衡）、high（最强能力）。' },
    },
  },
  {
    id: 'env-max-output-tokens',
    name: 'CLAUDE_CODE_MAX_OUTPUT_TOKENS',
    syntax: 'export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000',
    section: 'env-vars',
    subCategory: 'Behavior & Limits',
    complexity: 'intermediate',
    tags: ['limits', 'output', 'tokens'],
    examples: ['export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000'],
    i18n: {
      en: { description: 'Set the maximum output tokens per response. Default: 32,000. Max: 64,000.' },
      'zh-CN': { description: '设置每次响应的最大输出 token 数。默认：32,000。最大：64,000。' },
    },
  },
  {
    id: 'env-autocompact-pct',
    name: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE',
    syntax: 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80',
    section: 'env-vars',
    subCategory: 'Behavior & Limits',
    complexity: 'advanced',
    tags: ['memory', 'context', 'performance'],
    examples: ['export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70'],
    i18n: {
      en: { description: 'Override the context usage percentage (1-100) that triggers auto-compaction.' },
      'zh-CN': { description: '覆盖触发自动压缩的上下文使用百分比（1-100）。' },
    },
  },
  {
    id: 'env-disable-auto-memory',
    name: 'CLAUDE_CODE_DISABLE_AUTO_MEMORY',
    syntax: 'export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1',
    section: 'env-vars',
    subCategory: 'Behavior & Limits',
    complexity: 'intermediate',
    tags: ['memory', 'disable'],
    examples: ['export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1'],
    i18n: {
      en: { description: 'Disable automatic memory saving to CLAUDE.md files.' },
      'zh-CN': { description: '禁用自动保存记忆到 CLAUDE.md 文件。' },
    },
  },
  {
    id: 'env-simple',
    name: 'CLAUDE_CODE_SIMPLE',
    syntax: 'export CLAUDE_CODE_SIMPLE=1',
    section: 'env-vars',
    subCategory: 'Behavior & Limits',
    complexity: 'intermediate',
    tags: ['minimal', 'performance', 'scripting'],
    examples: ['CLAUDE_CODE_SIMPLE=1 claude -p "query"'],
    i18n: {
      en: { description: 'Use a minimal system prompt with only Bash, Read, and Edit tools available.' },
      'zh-CN': { description: '使用仅提供 Bash、Read 和 Edit 工具的最小系统提示。' },
    },
  },

  // ─── Privacy & Telemetry ──────────────────────────────────────────────
  {
    id: 'env-disable-telemetry',
    name: 'DISABLE_TELEMETRY',
    syntax: 'export DISABLE_TELEMETRY=1',
    section: 'env-vars',
    subCategory: 'Privacy & Telemetry',
    complexity: 'beginner',
    tags: ['privacy', 'telemetry'],
    examples: ['export DISABLE_TELEMETRY=1'],
    i18n: {
      en: { description: 'Opt out of Statsig telemetry collection.' },
      'zh-CN': { description: '选择退出 Statsig 遥测数据收集。' },
    },
  },
  {
    id: 'env-disable-error-reporting',
    name: 'DISABLE_ERROR_REPORTING',
    syntax: 'export DISABLE_ERROR_REPORTING=1',
    section: 'env-vars',
    subCategory: 'Privacy & Telemetry',
    complexity: 'beginner',
    tags: ['privacy', 'sentry'],
    examples: ['export DISABLE_ERROR_REPORTING=1'],
    i18n: {
      en: { description: 'Opt out of Sentry error reporting.' },
      'zh-CN': { description: '选择退出 Sentry 错误报告。' },
    },
  },
  {
    id: 'env-disable-nonessential',
    name: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
    syntax: 'export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1',
    section: 'env-vars',
    subCategory: 'Privacy & Telemetry',
    complexity: 'intermediate',
    tags: ['privacy', 'network', 'enterprise'],
    examples: ['export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1'],
    i18n: {
      en: { description: 'Disable all non-essential traffic: auto-updater, bug reporting, error reporting, and telemetry. Ideal for air-gapped or strict-network environments.' },
      'zh-CN': { description: '禁用所有非必要流量：自动更新、缺陷报告、错误报告和遥测。适合网络隔离或严格网络环境。' },
    },
  },

  // ─── Shell & Terminal ─────────────────────────────────────────────────
  {
    id: 'env-bash-timeout',
    name: 'BASH_DEFAULT_TIMEOUT_MS',
    syntax: 'export BASH_DEFAULT_TIMEOUT_MS=30000',
    section: 'env-vars',
    subCategory: 'Shell & Terminal',
    complexity: 'intermediate',
    tags: ['bash', 'timeout', 'performance'],
    examples: ['export BASH_DEFAULT_TIMEOUT_MS=60000'],
    i18n: {
      en: { description: 'Set the default timeout (in milliseconds) for bash command execution.' },
      'zh-CN': { description: '设置 bash 命令执行的默认超时时间（毫秒）。' },
    },
  },
  {
    id: 'env-bash-max-output',
    name: 'BASH_MAX_OUTPUT_LENGTH',
    syntax: 'export BASH_MAX_OUTPUT_LENGTH=100000',
    section: 'env-vars',
    subCategory: 'Shell & Terminal',
    complexity: 'intermediate',
    tags: ['bash', 'output', 'limits'],
    examples: ['export BASH_MAX_OUTPUT_LENGTH=200000'],
    i18n: {
      en: { description: 'Maximum number of characters in bash command output before it gets truncated.' },
      'zh-CN': { description: 'bash 命令输出在被截断前的最大字符数。' },
    },
  },
  {
    id: 'env-config-dir',
    name: 'CLAUDE_CONFIG_DIR',
    syntax: 'export CLAUDE_CONFIG_DIR=/custom/path',
    section: 'env-vars',
    subCategory: 'Shell & Terminal',
    complexity: 'advanced',
    tags: ['config', 'storage', 'enterprise'],
    examples: ['export CLAUDE_CONFIG_DIR=/opt/claude-config'],
    i18n: {
      en: { description: 'Customize the directory used to store Claude Code configuration and data files.' },
      'zh-CN': { description: '自定义用于存储 Claude Code 配置和数据文件的目录。' },
    },
  },
  {
    id: 'env-proxy',
    name: 'HTTP_PROXY / HTTPS_PROXY',
    syntax: 'export HTTPS_PROXY=http://proxy:8080',
    section: 'env-vars',
    subCategory: 'Shell & Terminal',
    complexity: 'intermediate',
    tags: ['network', 'proxy', 'enterprise'],
    examples: ['export HTTPS_PROXY=http://corporate-proxy:8080', 'export HTTP_PROXY=http://proxy:3128'],
    i18n: {
      en: { description: 'Configure HTTP or HTTPS proxy servers for all Claude Code outbound network requests.' },
      'zh-CN': { description: '为 Claude Code 所有出站网络请求配置 HTTP 或 HTTPS 代理服务器。' },
    },
  },
];
