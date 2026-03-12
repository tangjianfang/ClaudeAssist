import type { CommandEntry } from './types';

export const modes: CommandEntry[] = [
  {
    id: 'mode-print',
    name: 'Print / SDK Mode',
    syntax: 'claude -p "<prompt>"',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'beginner',
    tags: ['automation', 'ci', 'non-interactive', 'scripting'],
    examples: [
      'claude -p "explain this codebase"',
      'cat logs.txt | claude -p "find errors"',
      'claude -p "refactor main.py" --output-format json',
    ],
    i18n: {
      en: {
        description: 'Non-interactive mode — executes a single prompt and exits. Perfect for scripts, CI/CD pipelines, and automation.',
        notes: 'Activate with: -p or --print flag. Supports --output-format, --max-turns, --max-budget-usd',
      },
      'zh-CN': {
        description: '非交互模式 — 执行单个提示后退出。非常适合脚本、CI/CD 流水线和自动化场景。',
        notes: '通过 -p 或 --print 标志激活。支持 --output-format、--max-turns、--max-budget-usd',
      },
    },
  },
  {
    id: 'mode-plan',
    name: 'Plan Mode',
    syntax: '/plan or Shift+Tab',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['planning', 'safety', 'review'],
    examples: ['/plan', 'claude --permission-mode plan', 'Shift+Tab (to cycle to Plan Mode)'],
    i18n: {
      en: {
        description: 'Claude proposes a full plan before taking any actions. You must approve the plan before execution begins.',
        notes: 'Activate with: /plan command, Shift+Tab to cycle, or --permission-mode plan flag',
      },
      'zh-CN': {
        description: 'Claude 在采取任何行动前提出完整方案。必须批准计划后才开始执行。',
        notes: '通过 /plan 命令、Shift+Tab 循环或 --permission-mode plan 标志激活',
      },
    },
  },
  {
    id: 'mode-auto-accept',
    name: 'Auto-Accept Edits Mode',
    syntax: 'Shift+Tab (cycle) or --permission-mode acceptEdits',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['permissions', 'safety', 'speed'],
    examples: ['Shift+Tab', 'claude --permission-mode acceptEdits'],
    i18n: {
      en: {
        description: 'Claude automatically accepts all file edits without prompting. Speeds up development but reduces manual oversight.',
        notes: 'Activate with Shift+Tab to cycle through modes',
      },
      'zh-CN': {
        description: 'Claude 自动接受所有文件编辑，无需提示。加快开发速度，但降低手动监督。',
        notes: '通过 Shift+Tab 循环切换模式来激活',
      },
    },
  },
  {
    id: 'mode-sandbox',
    name: 'Sandbox Mode',
    syntax: '/sandbox or sandbox.enabled: true',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'advanced',
    tags: ['security', 'isolation', 'safety'],
    examples: ['/sandbox', '{ "sandbox": { "enabled": true } }  # in settings.json'],
    i18n: {
      en: {
        description: 'Isolates all Bash commands from the filesystem and network. Supported on macOS, Linux, and WSL2.',
        notes: 'Configure filesystem/network access in settings.json via sandbox.filesystem and sandbox.network',
      },
      'zh-CN': {
        description: '将所有 Bash 命令与文件系统和网络隔离。支持 macOS、Linux 和 WSL2。',
        notes: '通过 settings.json 中的 sandbox.filesystem 和 sandbox.network 配置文件系统/网络访问权限',
      },
    },
  },
  {
    id: 'mode-headless-ci',
    name: 'Headless / CI Mode',
    syntax: 'claude -p --dangerously-skip-permissions',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'advanced',
    tags: ['ci', 'automation', 'scripting', 'security'],
    examples: [
      'claude -p --dangerously-skip-permissions "run all tests and fix failures"',
      'claude -p --dangerously-skip-permissions --max-turns 20 "implement the feature"',
    ],
    i18n: {
      en: {
        description: 'Full automation mode — skips all permission prompts. Use only in fully trusted, sandboxed CI/CD environments.',
        notes: 'Combine --sandbox with this for safe CI usage on supported platforms',
      },
      'zh-CN': {
        description: '完全自动化模式 — 跳过所有权限提示。仅在完全可信的沙盒化 CI/CD 环境中使用。',
        notes: '在支持的平台上，将 --sandbox 与此结合使用可实现安全的 CI 用法',
      },
    },
  },
  {
    id: 'mode-vim',
    name: 'Vim Mode',
    syntax: '/vim',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['editor', 'vim', 'keyboard'],
    examples: ['/vim'],
    i18n: {
      en: {
        description: 'Enable Vim keybindings (Normal/Insert/Visual modes) for the prompt input editor.',
      },
      'zh-CN': {
        description: '为提示输入编辑器启用 Vim 键位绑定（普通/插入/可视模式）。',
      },
    },
  },
  {
    id: 'mode-worktree',
    name: 'Worktree Mode',
    syntax: 'claude -w <branch>',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['git', 'isolation', 'worktree', 'branch'],
    examples: ['claude -w feature-auth', 'claude --worktree hotfix-btn'],
    i18n: {
      en: {
        description: 'Start Claude in an isolated git worktree on a new branch, keeping all changes separate from the main working tree.',
      },
      'zh-CN': {
        description: '在新分支的隔离 git worktree 中启动 Claude，使所有更改与主工作区保持独立。',
      },
    },
  },
  {
    id: 'mode-fast',
    name: 'Fast Mode',
    syntax: '/fast on',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'beginner',
    tags: ['performance', 'speed', 'cost'],
    examples: ['/fast', '/fast on', '/fast off'],
    i18n: {
      en: {
        description: 'Lower-latency, lower-cost responses by using a smaller model internally. Trades response quality for speed.',
      },
      'zh-CN': {
        description: '通过内部使用较小模型实现更低延迟、更低成本的响应。以响应质量换取速度。',
      },
    },
  },
  {
    id: 'mode-remote',
    name: 'Remote / Teleport Mode',
    syntax: 'claude --remote "<task>"',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'advanced',
    tags: ['remote', 'web', 'cloud'],
    examples: [
      'claude --remote "Fix the login bug"',
      'claude --teleport  # resume a web session locally',
    ],
    i18n: {
      en: {
        description: 'Start a session on claude.ai and optionally transfer it to your local terminal (or vice versa) for seamless context switching.',
        notes: 'Use --teleport to pull a running web session into your terminal',
      },
      'zh-CN': {
        description: '在 claude.ai 上启动会话，并可选择将其转移到本地终端（或反之），实现无缝上下文切换。',
        notes: '使用 --teleport 将正在运行的 Web 会话拉取到你的终端',
      },
    },
  },
  {
    id: 'mode-simple',
    name: 'Simple Mode',
    syntax: 'CLAUDE_CODE_SIMPLE=1 claude',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['minimal', 'scripting', 'performance'],
    examples: ['CLAUDE_CODE_SIMPLE=1 claude', 'CLAUDE_CODE_SIMPLE=1 claude -p "query"'],
    i18n: {
      en: {
        description: 'Use a minimal system prompt with only Bash, Read, and Edit tools. Ideal for focused scripting tasks where full capability is not needed.',
      },
      'zh-CN': {
        description: '使用仅包含 Bash、Read 和 Edit 工具的最小系统提示。适合不需要完整功能的专注脚本任务。',
      },
    },
  },
  {
    id: 'mode-extended-thinking',
    name: 'Extended Thinking Mode',
    syntax: 'Option+T / Alt+T',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'intermediate',
    tags: ['reasoning', 'quality', 'thinking'],
    examples: ['Option+T  # toggle extended thinking', 'Alt+T     # Windows/Linux'],
    i18n: {
      en: {
        description: 'Claude spends more tokens "thinking" through the problem before responding, producing higher-quality answers for complex tasks.',
        notes: 'Requires /terminal-setup first. Can also set alwaysThinkingEnabled: true in settings.json',
      },
      'zh-CN': {
        description: 'Claude 在回复前花更多 token"思考"问题，为复杂任务生成更高质量的答案。',
        notes: '需要先运行 /terminal-setup。也可在 settings.json 中设置 alwaysThinkingEnabled: true',
      },
    },
  },
  {
    id: 'mode-agent-team',
    name: 'Agent Team Mode',
    syntax: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude',
    section: 'modes',
    subCategory: 'Operating Modes',
    complexity: 'advanced',
    tags: ['agents', 'parallel', 'experimental'],
    examples: ['CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude', 'claude --teammate-mode tmux'],
    i18n: {
      en: {
        description: 'Run multiple coordinated Claude agents simultaneously, each handling part of a complex task. Experimental feature.',
        notes: 'Configure display with --teammate-mode: auto, in-process, or tmux',
      },
      'zh-CN': {
        description: '同时运行多个协调的 Claude 代理，每个代理处理复杂任务的一部分。实验性功能。',
        notes: '通过 --teammate-mode 配置显示方式：auto、in-process 或 tmux',
      },
    },
  },
];
