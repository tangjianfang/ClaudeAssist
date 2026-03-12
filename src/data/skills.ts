import type { CommandEntry } from './types';

export const skills: CommandEntry[] = [
  {
    id: 'skill-simplify',
    name: '/simplify',
    syntax: '/simplify',
    section: 'skills',
    subCategory: 'Bundled Skills',
    complexity: 'intermediate',
    tags: ['code-quality', 'refactor', 'review'],
    examples: ['/simplify'],
    i18n: {
      en: {
        description: 'Review recently changed code for opportunities to reuse existing abstractions, improve quality, and increase efficiency. Spawns 3 parallel review agents and applies their suggestions.',
      },
      'zh-CN': {
        description: '审查最近更改的代码，寻找重用现有抽象、提高质量和效率的机会。启动 3 个并行审查代理并应用其建议。',
      },
    },
  },
  {
    id: 'skill-batch',
    name: '/batch',
    syntax: '/batch <instruction>',
    section: 'skills',
    subCategory: 'Bundled Skills',
    complexity: 'advanced',
    tags: ['automation', 'parallel', 'refactor', 'agents'],
    examples: [
      '/batch add JSDoc comments to every function in src/',
      '/batch convert all test files from Jest to Vitest',
      '/batch add missing null checks in the API layer',
    ],
    i18n: {
      en: {
        description: 'Orchestrate large-scale codebase changes in parallel. Spawns one agent per work unit, each operating in an isolated git worktree, then merges results.',
        notes: 'Best for repetitive changes across many files. Each agent gets its own git worktree.',
      },
      'zh-CN': {
        description: '并行编排大规模代码库变更。为每个工作单元启动一个代理，各自在隔离的 git worktree 中操作，最后合并结果。',
        notes: '最适合跨多个文件的重复性变更。每个代理都有独立的 git worktree。',
      },
    },
  },
  {
    id: 'skill-debug',
    name: '/debug',
    syntax: '/debug [description]',
    section: 'skills',
    subCategory: 'Bundled Skills',
    complexity: 'intermediate',
    tags: ['debug', 'diagnostic', 'troubleshoot'],
    examples: ['/debug', '/debug session keeps disconnecting after 5 minutes'],
    i18n: {
      en: {
        description: 'Troubleshoot the current Claude Code session by analyzing debug logs and diagnosing issues.',
      },
      'zh-CN': {
        description: '通过分析调试日志和诊断问题来排查当前 Claude Code 会话的故障。',
      },
    },
  },
  {
    id: 'skill-loop',
    name: '/loop',
    syntax: '/loop [interval] <prompt>',
    section: 'skills',
    subCategory: 'Bundled Skills',
    complexity: 'advanced',
    tags: ['automation', 'scheduling', 'background', 'cron'],
    examples: [
      '/loop 5m check if the build pipeline has finished',
      '/loop 1h summarize new GitHub issues',
      '/loop 30s tail the error log and alert on new errors',
    ],
    i18n: {
      en: {
        description: 'Run a prompt repeatedly on a defined schedule. Interval supports s (seconds), m (minutes), h (hours).',
        notes: 'Use Ctrl+T to monitor background task status',
      },
      'zh-CN': {
        description: '按定义的时间间隔重复执行提示。间隔支持 s（秒）、m（分钟）、h（小时）。',
        notes: '使用 Ctrl+T 监控后台任务状态',
      },
    },
  },
  {
    id: 'skill-claude-api',
    name: '/claude-api',
    syntax: '/claude-api',
    section: 'skills',
    subCategory: 'Bundled Skills',
    complexity: 'intermediate',
    tags: ['sdk', 'api', 'development'],
    examples: [
      '/claude-api',
      '(also activates automatically when the anthropic SDK is imported)',
    ],
    i18n: {
      en: {
        description: 'Load the Claude API reference documentation for the current project\'s language into context. Activates automatically when an anthropic SDK import is detected.',
        notes: 'Auto-activates when `anthropic` SDK is imported in your code',
      },
      'zh-CN': {
        description: '将当前项目语言对应的 Claude API 参考文档加载到上下文中。当检测到 anthropic SDK 导入时自动激活。',
        notes: '当代码中导入 `anthropic` SDK 时自动激活',
      },
    },
  },
];
