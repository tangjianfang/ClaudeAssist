import type { Scenario, ScenarioCategory } from './scenario-types';

export const scenarios: Scenario[] = [
  // ─── PROTOTYPING ───────────────────────────────────────────────────────────
  {
    id: 'quick-demo',
    category: 'prototyping',
    difficulty: 'beginner',
    title: {
      en: 'Build a Quick Demo',
      'zh-CN': '快速构建 Demo',
    },
    description: {
      en: 'Spin up a working prototype in minutes. Claude writes the scaffolding while you focus on the core idea.',
      'zh-CN': '在几分钟内搭建工作原型。让 Claude 处理脚手架，你专注核心创意。',
    },
    relatedCommandIds: ['init', 'clear', 'compact', 'review', 'auto-accept', 'plan'],
    steps: [
      {
        title: { en: 'Start a new session', 'zh-CN': '启动新会话' },
        command: 'claude',
        description: {
          en: 'Open Claude Code in your project directory.',
          'zh-CN': '在项目目录中打开 Claude Code。',
        },
      },
      {
        title: { en: 'Initialize the project', 'zh-CN': '初始化项目' },
        command: '/init',
        description: {
          en: 'Let Claude scan the codebase and generate a CLAUDE.md that captures the project context.',
          'zh-CN': '让 Claude 扫描代码库，生成 CLAUDE.md 捕获项目上下文。',
        },
      },
      {
        title: { en: 'Describe your idea', 'zh-CN': '描述你的想法' },
        description: {
          en: 'Prompt Claude with a brief description: "Build a minimal REST API with Express that does X".',
          'zh-CN': '用简单描述提示 Claude："用 Express 构建一个实现 X 功能的最小 REST API"。',
        },
      },
      {
        title: { en: 'Enable auto-accept for speed', 'zh-CN': '启用自动接受以提速' },
        command: '--dangerously-skip-permissions',
        description: {
          en: 'For a throw-away demo in a sandbox, skip confirmation prompts so Claude can move fast.',
          'zh-CN': '在沙盒环境中临时演示时，跳过确认提示让 Claude 快速执行。',
        },
      },
      {
        title: { en: 'Review and iterate', 'zh-CN': '审查并迭代' },
        command: '/review',
        description: {
          en: 'Ask Claude to review the generated code for obvious issues before you demo it.',
          'zh-CN': '在演示前让 Claude 检查生成代码中的明显问题。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Use /compact frequently in long sessions to keep context tight.',
          'zh-CN': '在长时间会话中频繁使用 /compact 保持上下文精简。',
        },
      },
      {
        type: 'warning',
        text: {
          en: 'Never use --dangerously-skip-permissions on a real project with sensitive data.',
          'zh-CN': '切勿在包含敏感数据的真实项目中使用 --dangerously-skip-permissions。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Commit early and often so you can roll back if the demo goes sideways.',
          'zh-CN': '尽早且频繁提交，这样演示出问题时可以回滚。',
        },
      },
    ],
  },
  {
    id: 'small-tool',
    category: 'prototyping',
    difficulty: 'beginner',
    title: {
      en: 'Build a Small CLI Tool',
      'zh-CN': '构建小型 CLI 工具',
    },
    description: {
      en: 'Create a focused command-line utility — a script, converter, or automation helper — using Claude as your pair programmer.',
      'zh-CN': '创建专注的命令行工具 — 脚本、转换器或自动化助手 — 以 Claude 为结对编程伙伴。',
    },
    relatedCommandIds: ['init', 'compact', 'review', 'memory', 'plan'],
    steps: [
      {
        title: { en: 'Plan the interface first', 'zh-CN': '先规划接口' },
        command: '/plan',
        description: {
          en: 'Tell Claude to plan the CLI interface (flags, sub-commands, I/O) before writing any code.',
          'zh-CN': '让 Claude 在写代码前先规划 CLI 接口（参数、子命令、I/O）。',
        },
      },
      {
        title: { en: 'Initialize project memory', 'zh-CN': '初始化项目记忆' },
        command: '/memory',
        description: {
          en: 'Store the agreed interface spec in Claude\'s memory so it stays consistent across turns.',
          'zh-CN': '将商定的接口规范存入 Claude 的记忆，保持跨轮次的一致性。',
        },
      },
      {
        title: { en: 'Implement incrementally', 'zh-CN': '增量实现' },
        description: {
          en: 'Build one feature at a time. Confirm each works before moving on.',
          'zh-CN': '每次构建一个功能，确认正常运行后再继续。',
        },
      },
      {
        title: { en: 'Write tests', 'zh-CN': '编写测试' },
        description: {
          en: 'Ask Claude to generate unit tests for each command path.',
          'zh-CN': '让 Claude 为每个命令路径生成单元测试。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Provide a sample input/output in your prompt — Claude will match the format exactly.',
          'zh-CN': '在提示中提供示例输入/输出 — Claude 会精确匹配格式。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Add a README section in CLAUDE.md explaining the tool\'s purpose for future sessions.',
          'zh-CN': '在 CLAUDE.md 中添加 README 章节说明工具用途，方便未来的会话。',
        },
      },
    ],
  },

  // ─── DEVELOPMENT ───────────────────────────────────────────────────────────
  {
    id: 'side-project',
    category: 'development',
    difficulty: 'intermediate',
    title: {
      en: 'Solo Side Project',
      'zh-CN': '个人副项目',
    },
    description: {
      en: 'Maintain momentum on a personal project with Claude handling boilerplate, refactors, and tests while you drive the vision.',
      'zh-CN': '让 Claude 处理样板代码、重构和测试，你专注驱动愿景，保持个人项目的持续动力。',
    },
    relatedCommandIds: ['init', 'compact', 'memory', 'pr-comments', 'review', 'plan', 'vim-mode'],
    steps: [
      {
        title: { en: 'Set up CLAUDE.md', 'zh-CN': '配置 CLAUDE.md' },
        command: '/init',
        description: {
          en: 'Run /init once. Edit CLAUDE.md to add your coding style preferences, tech stack, and naming conventions.',
          'zh-CN': '运行一次 /init，然后编辑 CLAUDE.md 添加编码风格偏好、技术栈和命名规范。',
        },
      },
      {
        title: { en: 'Use persistent memory for decisions', 'zh-CN': '用持久记忆记录决策' },
        command: '/memory',
        description: {
          en: 'Log architectural decisions ("we use Zustand not Redux") so Claude stays consistent across sessions.',
          'zh-CN': '记录架构决策（"我们使用 Zustand 而非 Redux"），让 Claude 跨会话保持一致。',
        },
      },
      {
        title: { en: 'Plan before big features', 'zh-CN': '大功能前先规划' },
        command: '/plan',
        description: {
          en: 'For any feature spanning multiple files, use /plan to get a change outline before execution.',
          'zh-CN': '对于跨多个文件的功能，使用 /plan 在执行前获取变更大纲。',
        },
      },
      {
        title: { en: 'Keep context lean', 'zh-CN': '保持上下文精简' },
        command: '/compact',
        description: {
          en: 'Compact before switching between features to avoid context bloat.',
          'zh-CN': '切换功能前先 compact，避免上下文膨胀。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Use /review before every git push — catches issues before they land in history.',
          'zh-CN': '每次 git push 前使用 /review — 在进入历史记录前捕获问题。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Vim mode (Esc → Vim keybindings) is great for editing Claude\'s output in-terminal.',
          'zh-CN': 'Vim 模式（Esc → Vim 键绑定）非常适合在终端内编辑 Claude 的输出。',
        },
      },
    ],
  },
  {
    id: 'large-project',
    category: 'teamwork',
    difficulty: 'advanced',
    title: {
      en: 'Large Team Project',
      'zh-CN': '大型团队项目',
    },
    description: {
      en: 'Scale Claude Code across a sizeable codebase and team. Govern permissions, standardize context, and integrate with CI.',
      'zh-CN': '在大型代码库和团队中规模化使用 Claude Code。管理权限、标准化上下文并与 CI 集成。',
    },
    relatedCommandIds: [
      'init', 'memory', 'plan', 'pr-comments', 'review',
      'headless', 'auto-accept', 'add-dir', 'ignore-gitignore',
      'allowed-tools', 'disallowed-tools',
    ],
    steps: [
      {
        title: { en: 'Commit a shared CLAUDE.md', 'zh-CN': '提交共享的 CLAUDE.md' },
        command: '/init',
        description: {
          en: 'Generate and commit a CLAUDE.md that documents project conventions. Everyone\'s Claude sees the same context.',
          'zh-CN': '生成并提交记录项目规范的 CLAUDE.md。团队每个人的 Claude 看到相同的上下文。',
        },
      },
      {
        title: { en: 'Set team-wide permissions policy', 'zh-CN': '设置团队权限策略' },
        description: {
          en: 'Create a project-scoped settings.json with allowedTools / disallowedTools to prevent surprises.',
          'zh-CN': '创建项目范围的 settings.json，使用 allowedTools / disallowedTools 防止意外操作。',
        },
      },
      {
        title: { en: 'Add subdirectory context', 'zh-CN': '添加子目录上下文' },
        command: '--add-dir',
        description: {
          en: 'Point Claude at sibling repos (shared libs, API specs) so cross-repo changes stay correct.',
          'zh-CN': '将 Claude 指向兄弟仓库（共享库、API 规范），确保跨仓库变更保持正确。',
        },
      },
      {
        title: { en: 'Automate PR reviews in CI', 'zh-CN': '在 CI 中自动化 PR 审查' },
        command: '--print',
        description: {
          en: 'Use headless mode (claude --print "review this PR") inside GitHub Actions to post automated review comments.',
          'zh-CN': '在 GitHub Actions 中使用无头模式（claude --print "review this PR"）发布自动审查评论。',
        },
      },
      {
        title: { en: 'Review before merge', 'zh-CN': '合并前审查' },
        command: '/pr-comments',
        description: {
          en: 'Fetch and address open PR comments with /pr-comments before merging.',
          'zh-CN': '合并前用 /pr-comments 获取并处理未解决的 PR 评论。',
        },
      },
    ],
    tips: [
      {
        type: 'warning',
        text: {
          en: 'Scope settings.json permissions tightly. Broad tool access is a security risk in shared repos.',
          'zh-CN': '严格限定 settings.json 权限范围。共享仓库中宽泛的工具访问权限是安全风险。',
        },
      },
      {
        type: 'tip',
        text: {
          en: 'Keep subdirectory CLAUDE.md files for modules with different conventions (e.g., /frontend, /backend).',
          'zh-CN': '为具有不同规范的模块保留子目录 CLAUDE.md 文件（例如 /frontend、/backend）。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Headless CI runs can be rate-limited — cache results or gate on PR labels to control cost.',
          'zh-CN': '无头 CI 运行可能受速率限制 — 缓存结果或通过 PR 标签控制以管理成本。',
        },
      },
    ],
  },

  // ─── MAINTENANCE ───────────────────────────────────────────────────────────
  {
    id: 'code-review',
    category: 'maintenance',
    difficulty: 'beginner',
    title: {
      en: 'Thorough Code Review',
      'zh-CN': '彻底的代码审查',
    },
    description: {
      en: 'Use Claude as a review partner — checking logic, security, style, and test coverage before a PR lands.',
      'zh-CN': '使用 Claude 作为审查伙伴 — 在 PR 合并前检查逻辑、安全性、风格和测试覆盖率。',
    },
    relatedCommandIds: ['review', 'pr-comments', 'compact', 'plan'],
    steps: [
      {
        title: { en: 'Review the diff', 'zh-CN': '审查差异' },
        command: '/review',
        description: {
          en: 'Ask Claude to review the staged changes or open files for correctness, edge cases, and style.',
          'zh-CN': '让 Claude 审查暂存更改或当前文件的正确性、边界情况和风格。',
        },
      },
      {
        title: { en: 'Check open PR comments', 'zh-CN': '检查未解决的 PR 评论' },
        command: '/pr-comments',
        description: {
          en: 'Pull in review comments from GitHub and ask Claude to address each one.',
          'zh-CN': '从 GitHub 获取审查评论，让 Claude 逐一处理。',
        },
      },
      {
        title: { en: 'Ask for a security pass', 'zh-CN': '请求安全审查' },
        description: {
          en: 'Prompt: "Check this code for common security issues: injection, SSRF, auth bypass, secret leakage."',
          'zh-CN': '提示："检查此代码中常见的安全问题：注入、SSRF、认证绕过、密钥泄露。"',
        },
      },
      {
        title: { en: 'Verify test coverage', 'zh-CN': '验证测试覆盖率' },
        description: {
          en: 'Ask Claude to list untested code paths and generate tests for the critical ones.',
          'zh-CN': '让 Claude 列出未覆盖的代码路径，并为关键路径生成测试。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Paste the diff directly into the prompt for focused review — no need to open files.',
          'zh-CN': '将差异直接粘贴到提示中进行专注审查 — 无需打开文件。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Asking "what did I miss?" after /review often surfaces one more issue.',
          'zh-CN': '/review 之后问"我遗漏了什么？"通常还能发现一个问题。',
        },
      },
    ],
  },
  {
    id: 'debugging',
    category: 'maintenance',
    difficulty: 'intermediate',
    title: {
      en: 'Debugging a Hard Bug',
      'zh-CN': '调试疑难 Bug',
    },
    description: {
      en: 'Systematically hunt down a bug that resists obvious fixes — stack traces, hypothesis generation, bisecting.',
      'zh-CN': '系统性排查抵抗明显修复的 Bug — 堆栈跟踪、假设生成、二分定位。',
    },
    relatedCommandIds: ['compact', 'clear', 'plan', 'memory', 'extended-thinking'],
    steps: [
      {
        title: { en: 'Paste the error in full', 'zh-CN': '粘贴完整错误信息' },
        description: {
          en: 'Give Claude the full stack trace, not a summary. Include the failing test or reproduction steps.',
          'zh-CN': '给 Claude 完整的堆栈跟踪，而非摘要。包含失败的测试或复现步骤。',
        },
      },
      {
        title: { en: 'Ask Claude to hypothesize', 'zh-CN': '让 Claude 生成假设' },
        description: {
          en: 'Prompt: "List the 3 most likely root causes ranked by probability. Don\'t fix yet, just hypothesize."',
          'zh-CN': '提示："列出按可能性排序的 3 个最可能的根本原因。先不要修复，只需假设。"',
        },
      },
      {
        title: { en: 'Enable extended thinking for complex bugs', 'zh-CN': '针对复杂 Bug 启用扩展思考' },
        command: 'ultrathink',
        description: {
          en: 'For tricky concurrency or state bugs say "ultrathink" to let Claude reason longer before proposing a fix.',
          'zh-CN': '对于棘手的并发或状态 Bug，说"ultrathink"让 Claude 在提出修复前进行更长时间的推理。',
        },
      },
      {
        title: { en: 'Fix one hypothesis at a time', 'zh-CN': '逐一验证假设' },
        description: {
          en: 'Implement, test, then report back. Iterate until resolved.',
          'zh-CN': '实施、测试，然后反馈结果。迭代直到解决。',
        },
      },
      {
        title: { en: 'Compact after resolution', 'zh-CN': '解决后压缩上下文' },
        command: '/compact',
        description: {
          en: 'After the fix, compact context to remove the debugging noise before continuing feature work.',
          'zh-CN': '修复后压缩上下文，去除调试噪音，再继续功能开发。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Add a failing test first — it gives Claude a precise success criterion.',
          'zh-CN': '先添加失败的测试 — 这为 Claude 提供了精确的成功标准。',
        },
      },
      {
        type: 'warning',
        text: {
          en: 'For flaky tests, ask Claude to explain why the test is intermittent before trying to fix it.',
          'zh-CN': '对于不稳定的测试，在尝试修复前让 Claude 解释测试不稳定的原因。',
        },
      },
    ],
  },
  {
    id: 'refactoring',
    category: 'maintenance',
    difficulty: 'intermediate',
    title: {
      en: 'Large-Scale Refactoring',
      'zh-CN': '大规模重构',
    },
    description: {
      en: 'Refactor a messy module or migrate to a new pattern safely, with Claude tracking changes across files.',
      'zh-CN': '安全地重构混乱模块或迁移到新模式，让 Claude 跨文件跟踪变更。',
    },
    relatedCommandIds: ['plan', 'compact', 'review', 'memory', 'auto-accept', 'add-dir'],
    steps: [
      {
        title: { en: 'Create a refactor plan', 'zh-CN': '制定重构计划' },
        command: '/plan',
        description: {
          en: 'Ask Claude to produce a numbered list of all files/functions that need to change before touching anything.',
          'zh-CN': '让 Claude 在修改任何内容前，生成所有需要变更的文件/函数的编号列表。',
        },
      },
      {
        title: { en: 'Store the plan in memory', 'zh-CN': '将计划存入记忆' },
        command: '/memory',
        description: {
          en: 'Save the refactor plan so Claude can resume mid-way without losing track.',
          'zh-CN': '保存重构计划，让 Claude 能够在中途恢复而不迷失方向。',
        },
      },
      {
        title: { en: 'Work file-by-file', 'zh-CN': '逐文件处理' },
        description: {
          en: 'Tackle one file at a time, run tests, then move to the next.',
          'zh-CN': '每次处理一个文件，运行测试，然后继续下一个。',
        },
      },
      {
        title: { en: 'Run a final review', 'zh-CN': '最终审查' },
        command: '/review',
        description: {
          en: 'After all files are done, ask Claude to do a consistency review across the whole change.',
          'zh-CN': '所有文件完成后，让 Claude 对整个变更进行一致性审查。',
        },
      },
    ],
    tips: [
      {
        type: 'warning',
        text: {
          en: 'Keep refactor PRs atomic — one pattern change per PR makes review and rollback much easier.',
          'zh-CN': '保持重构 PR 的原子性 — 每个 PR 只做一种模式变更，便于审查和回滚。',
        },
      },
      {
        type: 'tip',
        text: {
          en: 'Use type-safe rename hints: "Rename all occurrences of X to Y, update tests and imports."',
          'zh-CN': '使用类型安全的重命名提示："将所有 X 重命名为 Y，更新测试和导入。"',
        },
      },
    ],
  },

  // ─── LEARNING ───────────────────────────────────────────────────────────────
  {
    id: 'learning-codebase',
    category: 'learning',
    difficulty: 'beginner',
    title: {
      en: 'Learning a New Codebase',
      'zh-CN': '学习新代码库',
    },
    description: {
      en: 'Onboard to an unfamiliar repo quickly — get oriented, understand architecture, and make your first confident change.',
      'zh-CN': '快速上手陌生仓库 — 了解结构、理解架构，自信地做出第一个变更。',
    },
    relatedCommandIds: ['init', 'compact', 'memory', 'plan', 'extended-thinking'],
    steps: [
      {
        title: { en: 'Generate a project overview', 'zh-CN': '生成项目概览' },
        command: '/init',
        description: {
          en: 'Run /init so Claude creates a CLAUDE.md summarizing the architecture, entry points, and key patterns.',
          'zh-CN': '运行 /init，让 Claude 创建概括架构、入口点和关键模式的 CLAUDE.md。',
        },
      },
      {
        title: { en: 'Ask architectural questions', 'zh-CN': '提问架构问题' },
        description: {
          en: 'Prompt: "Explain the data-flow from HTTP request to database write in this app."',
          'zh-CN': '提示："解释此应用中从 HTTP 请求到数据库写入的数据流。"',
        },
      },
      {
        title: { en: 'Trace a feature end-to-end', 'zh-CN': '端到端追踪一个功能' },
        description: {
          en: 'Pick a concrete feature and ask Claude to walk you through every file that touches it.',
          'zh-CN': '选择一个具体功能，让 Claude 带你浏览涉及它的每个文件。',
        },
      },
      {
        title: { en: 'Make a small change safely', 'zh-CN': '安全地做小改动' },
        command: '/plan',
        description: {
          en: 'Before your first PR, use /plan to map out the change and confirm you\'re not missing side-effects.',
          'zh-CN': '在第一个 PR 之前，使用 /plan 规划变更，确认没有遗漏副作用。',
        },
      },
    ],
    tips: [
      {
        type: 'tip',
        text: {
          en: 'Save key architectural insights in CLAUDE.md — future you (and teammates) will thank you.',
          'zh-CN': '将关键架构洞察保存在 CLAUDE.md 中 — 未来的你（和队友）会感谢你。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Ask "What are the most common mistakes new contributors make in this codebase?" — Claude will flag patterns.',
          'zh-CN': '问"新贡献者在此代码库中最常犯什么错误？" — Claude 会标出常见模式。',
        },
      },
    ],
  },

  // ─── AUTOMATION ───────────────────────────────────────────────────────────
  {
    id: 'ci-automation',
    category: 'development',
    difficulty: 'advanced',
    title: {
      en: 'CI/CD Automation',
      'zh-CN': 'CI/CD 自动化',
    },
    description: {
      en: 'Integrate Claude Code into your CI pipeline for automated code review, change summaries, or migration tasks.',
      'zh-CN': '将 Claude Code 集成到 CI 流水线中，实现自动化代码审查、变更摘要或迁移任务。',
    },
    relatedCommandIds: [
      'headless', 'auto-accept', 'allowed-tools', 'disallowed-tools',
      'max-turns', 'output-format', 'system-prompt',
    ],
    steps: [
      {
        title: { en: 'Run Claude headlessly', 'zh-CN': '无头运行 Claude' },
        command: '--print',
        description: {
          en: 'Use `claude --print "<task>"` in shell scripts or CI steps. Output is sent to stdout — pipe it anywhere.',
          'zh-CN': '在 shell 脚本或 CI 步骤中使用 `claude --print "<task>"`。输出发送到 stdout — 可以管道传输到任意位置。',
        },
      },
      {
        title: { en: 'Lock down permissions', 'zh-CN': '锁定权限' },
        command: '--allowedTools',
        description: {
          en: 'Restrict to read-only tools in CI: `--allowedTools "Read,Grep,Glob"` to prevent unintended writes.',
          'zh-CN': '在 CI 中限制为只读工具：`--allowedTools "Read,Grep,Glob"` 防止意外写入。',
        },
      },
      {
        title: { en: 'Set a turn limit', 'zh-CN': '设置轮次限制' },
        command: '--max-turns',
        description: {
          en: 'Add --max-turns 10 to ensure CI jobs don\'t run indefinitely.',
          'zh-CN': '添加 --max-turns 10 确保 CI 任务不会无限运行。',
        },
      },
      {
        title: { en: 'Use JSON output for parsing', 'zh-CN': '使用 JSON 输出便于解析' },
        command: '--output-format',
        description: {
          en: 'Pass --output-format json to get structured output that scripts can reliably parse.',
          'zh-CN': '传入 --output-format json 获取脚本可靠解析的结构化输出。',
        },
      },
      {
        title: { en: 'Inject a custom system prompt', 'zh-CN': '注入自定义系统提示' },
        command: '--system-prompt',
        description: {
          en: 'Override the default system prompt to tune Claude\'s behavior for CI tasks (e.g., "respond in JSON only").',
          'zh-CN': '覆盖默认系统提示，为 CI 任务调整 Claude 的行为（例如"仅以 JSON 响应"）。',
        },
      },
    ],
    tips: [
      {
        type: 'warning',
        text: {
          en: 'Always set ANTHROPIC_API_KEY as a secret — never hard-code it in CI config files.',
          'zh-CN': '始终将 ANTHROPIC_API_KEY 设为密钥 — 绝不要硬编码在 CI 配置文件中。',
        },
      },
      {
        type: 'tip',
        text: {
          en: 'Cache Claude\'s tool results when the same files haven\'t changed to reduce API costs.',
          'zh-CN': '当相同文件未更改时缓存 Claude 的工具结果，降低 API 成本。',
        },
      },
      {
        type: 'info',
        text: {
          en: 'Use --output-format stream-json for real-time progress in long-running CI steps.',
          'zh-CN': '在长时间运行的 CI 步骤中使用 --output-format stream-json 获取实时进度。',
        },
      },
    ],
  },
];

export const scenarioCategories: Array<{
  id: string;
  label: { en: string; 'zh-CN': string };
}> = [
  { id: 'all', label: { en: 'All', 'zh-CN': '全部' } },
  { id: 'prototyping', label: { en: 'Prototyping', 'zh-CN': '原型开发' } },
  { id: 'development', label: { en: 'Development', 'zh-CN': '项目开发' } },
  { id: 'maintenance', label: { en: 'Maintenance', 'zh-CN': '维护迭代' } },
  { id: 'teamwork', label: { en: 'Team', 'zh-CN': '团队协作' } },
  { id: 'learning', label: { en: 'Learning', 'zh-CN': '学习探索' } },
];
