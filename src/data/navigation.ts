/**
 * src/data/navigation.ts
 * ─────────────────────────────────────────────────────────────────
 * 导航树配置。Sidebar 从此处读取数据渲染，无需手动维护 JSX 列表。
 * 顶级 group 表示产品域，section 表示域内语义分区，children 表示真实父子层级。
 */

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Sparkles,
  Puzzle,
  Code,
  BrainCircuit,
  Wrench,
  Target,
  Star,
  Slash,
  Terminal,
  Keyboard,
  Zap,
  Layers,
  Settings,
  Variable,
  ShieldCheck,
} from 'lucide-react';

// ── 类型 ─────────────────────────────────────────────────────────

export interface NavItem {
  /** 唯一 id，也作为 i18n 的 section key（若适用） */
  id: string;
  /** 路由路径 */
  path: string;
  /** Lucide 图标 */
  Icon: LucideIcon;
  /** 可选的 logo URL（用于工具/模型菜单项）；若提供则优先显示 */
  logo?: string;
  /** 中文标签（回退显示）；优先从 i18n 取 */
  labelZh: string;
  /** 英文标签 */
  labelEn: string;
  /**
   * 徽章类型：
   * - `'section-count'`：取 sectionEntries[id].length
   * - `'favorites-count'`：取 favorites.size
   * - `null`：无徽章
   */
  badge?: 'section-count' | 'favorites-count' | 'scenarios-count';
  /** 子导航项，用于表达真实层级，如工具 profile 下的知识页或厂商下的模型 */
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  labelZh: string;
  labelEn: string;
  items: NavItem[];
}

export interface NavGroup {
  id: string;
  labelZh: string;
  labelEn: string;
  sections: NavSection[];
}

// ── 数据 ─────────────────────────────────────────────────────────

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'decision-lab',
    labelZh: 'Decision Lab',
    labelEn: 'Decision Lab',
    sections: [
      {
        id: 'decision-workflows',
        labelZh: '决策工作流',
        labelEn: 'Decision Workflows',
        items: [
          { id: 'decision-workbench', path: '/', Icon: Target, labelZh: 'AI 场景决策', labelEn: 'AI Scenario Decisions' },
        ],
      },
    ],
  },
  {
    id: 'ai-coding-tools',
    labelZh: 'AI Coding Tools',
    labelEn: 'AI Coding Tools',
    sections: [
      {
        id: 'tool-decision',
        labelZh: '工具决策',
        labelEn: 'Tool Decision',
        items: [
          { id: 'ai-tools-workbench', path: '/ai-tools', Icon: Wrench, labelZh: '工具工作台', labelEn: 'Tool Workbench' },
          { id: 'tool-combinations', path: '/tool-combinations', Icon: Layers, labelZh: '组合方案', labelEn: 'Combinations' },
        ],
      },
      {
        id: 'tool-profiles',
        labelZh: '工具 Profiles',
        labelEn: 'Tool Profiles',
        items: [
          {
            id: 'claude-code',
            path: '/tools/claude-code',
            Icon: Code,
            logo: `${import.meta.env.BASE_URL}logos/claude.svg`,
            labelZh: 'Claude Code',
            labelEn: 'Claude Code',
            children: [
              {
                id: 'claude-code-getting-started',
                path: '/tools/claude-code?ref=getting-started',
                Icon: BookOpen,
                labelZh: '快速入门',
                labelEn: 'Getting Started',
                children: [
                  { id: 'claude-code-onboarding', path: '/tools/claude-code/onboarding', Icon: BookOpen, labelZh: '初次使用', labelEn: 'Onboarding' },
                  { id: 'claude-code-scenarios', path: '/scenarios', Icon: BookOpen, labelZh: 'Claude 场景库', labelEn: 'Claude Scenario Library', badge: 'scenarios-count' as const },
                ],
              },
              {
                id: 'claude-code-reference',
                path: '/tools/claude-code?ref=reference',
                Icon: Slash,
                labelZh: '参考手册',
                labelEn: 'Reference',
                children: [
                  { id: 'claude-code-cheatsheet', path: '/cheatsheet', Icon: BookOpen, labelZh: '速查表', labelEn: 'Cheatsheet' },
                  { id: 'claude-code-commands', path: '/slash-commands', Icon: Slash, labelZh: 'Commands', labelEn: 'Commands' },
                  { id: 'claude-code-cli-flags', path: '/cli-flags', Icon: Terminal, labelZh: 'CLI Flags', labelEn: 'CLI Flags' },
                  { id: 'claude-code-shortcuts', path: '/shortcuts', Icon: Keyboard, labelZh: 'Shortcuts', labelEn: 'Shortcuts' },
                  { id: 'claude-code-env-vars', path: '/env-vars', Icon: Variable, labelZh: 'Env Vars', labelEn: 'Env Vars' },
                ],
              },
              {
                id: 'claude-code-capabilities',
                path: '/tools/claude-code?ref=capabilities',
                Icon: Sparkles,
                labelZh: '特性与插件',
                labelEn: 'Features & Plugins',
                children: [
                  { id: 'claude-code-features', path: '/features', Icon: Sparkles, labelZh: '最新特性', labelEn: 'Features' },
                  { id: 'claude-code-skills', path: '/skills', Icon: Zap, labelZh: 'Skills', labelEn: 'Skills' },
                  { id: 'claude-code-modes', path: '/modes', Icon: Layers, labelZh: 'Modes', labelEn: 'Modes' },
                  { id: 'claude-code-plugins', path: '/plugins', Icon: Puzzle, labelZh: '插件指南', labelEn: 'Plugins' },
                ],
              },
              {
                id: 'claude-code-config',
                path: '/tools/claude-code?ref=config',
                Icon: Settings,
                labelZh: '配置',
                labelEn: 'Configuration',
                children: [
                  { id: 'claude-code-settings', path: '/settings', Icon: Settings, labelZh: 'Settings', labelEn: 'Settings' },
                ],
              },
            ],
          },
          {
            id: 'opencode',
            path: '/tools/opencode',
            Icon: Terminal,
            labelZh: 'OpenCode',
            labelEn: 'OpenCode',
            children: [
              { id: 'opencode-setup', path: '/tools/opencode/setup', Icon: Settings, labelZh: '安装与配置', labelEn: 'Setup' },
              { id: 'opencode-models', path: '/tools/opencode/models', Icon: BrainCircuit, labelZh: '模型接入', labelEn: 'Models' },
              { id: 'opencode-workflows', path: '/tools/opencode/workflows', Icon: Layers, labelZh: '工作流', labelEn: 'Workflows' },
              { id: 'opencode-risks', path: '/tools/opencode/risks', Icon: Target, labelZh: '风险与适配', labelEn: 'Risks' },
            ],
          },
          {
            id: 'gemini-cli',
            path: '/tools/gemini-cli',
            Icon: Sparkles,
            logo: `${import.meta.env.BASE_URL}logos/googlegemini.svg`,
            labelZh: 'Gemini CLI',
            labelEn: 'Gemini CLI',
            children: [
              { id: 'gemini-cli-setup', path: '/tools/gemini-cli/setup', Icon: Settings, labelZh: '认证与安装', labelEn: 'Auth & Setup' },
              { id: 'gemini-cli-models', path: '/tools/gemini-cli/models', Icon: BrainCircuit, labelZh: 'Gemini 模型', labelEn: 'Gemini Models' },
              { id: 'gemini-cli-workflows', path: '/tools/gemini-cli/workflows', Icon: Layers, labelZh: '长上下文工作流', labelEn: 'Long Context' },
              { id: 'gemini-cli-risks', path: '/tools/gemini-cli/risks', Icon: Target, labelZh: '访问与合规', labelEn: 'Access & Risk' },
            ],
          },
          {
            id: 'github-copilot-cli',
            path: '/tools/github-copilot-cli',
            Icon: Slash,
            logo: `${import.meta.env.BASE_URL}logos/githubcopilot.svg`,
            labelZh: 'GitHub Copilot CLI',
            labelEn: 'GitHub Copilot CLI',
            children: [
              { id: 'github-copilot-cli-setup', path: '/tools/github-copilot-cli/setup', Icon: Settings, labelZh: '安装与登录', labelEn: 'Setup' },
              { id: 'github-copilot-cli-commands', path: '/tools/github-copilot-cli/commands', Icon: Slash, labelZh: '命令能力', labelEn: 'Commands' },
              { id: 'github-copilot-cli-workflows', path: '/tools/github-copilot-cli/workflows', Icon: Layers, labelZh: 'GitHub 工作流', labelEn: 'GitHub Workflow' },
              { id: 'github-copilot-cli-enterprise', path: '/tools/github-copilot-cli/enterprise', Icon: Target, labelZh: '企业适配', labelEn: 'Enterprise' },
            ],
          },
          {
            id: 'codex-cli',
            path: '/tools/codex-cli',
            Icon: Terminal,
            logo: `${import.meta.env.BASE_URL}logos/openai.svg`,
            labelZh: 'Codex CLI',
            labelEn: 'Codex CLI',
            children: [
              { id: 'codex-cli-setup', path: '/tools/codex-cli/setup', Icon: Settings, labelZh: '安装与认证', labelEn: 'Setup & Auth' },
              { id: 'codex-cli-models', path: '/tools/codex-cli/models', Icon: BrainCircuit, labelZh: '推理模型', labelEn: 'Reasoning Models' },
              { id: 'codex-cli-workflows', path: '/tools/codex-cli/workflows', Icon: Layers, labelZh: '沙箱工作流', labelEn: 'Sandbox Workflows' },
              { id: 'codex-cli-risks', path: '/tools/codex-cli/risks', Icon: Target, labelZh: '访问与费用', labelEn: 'Access & Cost' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'models',
    labelZh: 'Models',
    labelEn: 'Models',
    sections: [
      {
        id: 'model-workbench',
        labelZh: '模型工作台',
        labelEn: 'Model Workbench',
        items: [
          { id: 'model-decision-table', path: '/ai-ecosystem', Icon: BrainCircuit, labelZh: '模型决策表', labelEn: 'Model Decisions' },
          { id: 'ai-recommendations', path: '/ai-recommendations', Icon: ShieldCheck, labelZh: '推荐组合', labelEn: 'Recommended Combos' },
        ],
      },
      {
        id: 'frontier-models',
        labelZh: '主流模型厂商',
        labelEn: 'Mainstream Providers',
        items: [
          {
            id: 'models-openai',
            path: '/ai-ecosystem?vendor=OpenAI',
            Icon: BrainCircuit,
            labelZh: 'OpenAI',
            labelEn: 'OpenAI',
            children: [
              { id: 'openai-gpt-5-5', path: '/models/openai-gpt-5-5', Icon: BrainCircuit, labelZh: 'GPT-5.5', labelEn: 'GPT-5.5' },
              { id: 'openai-gpt-5-4', path: '/models/openai-gpt-5-4', Icon: BrainCircuit, labelZh: 'GPT-5.4', labelEn: 'GPT-5.4' },
              { id: 'openai-gpt-5-4-mini', path: '/models/openai-gpt-5-4-mini', Icon: BrainCircuit, labelZh: 'GPT-5.4-mini', labelEn: 'GPT-5.4-mini' },
            ],
          },
          {
            id: 'models-anthropic',
            path: '/ai-ecosystem?vendor=Anthropic',
            Icon: BrainCircuit,
            logo: `${import.meta.env.BASE_URL}logos/claude.svg`,
            labelZh: 'Anthropic Claude',
            labelEn: 'Anthropic Claude',
            children: [
              { id: 'anthropic-claude-opus-4-7', path: '/models/anthropic-claude-opus-4-7', Icon: BrainCircuit, labelZh: 'Claude Opus 4.7', labelEn: 'Claude Opus 4.7' },
              { id: 'anthropic-claude-sonnet-4-6', path: '/models/anthropic-claude-sonnet-4-6', Icon: BrainCircuit, labelZh: 'Claude Sonnet 4.6', labelEn: 'Claude Sonnet 4.6' },
              { id: 'anthropic-claude-haiku-4-5', path: '/models/anthropic-claude-haiku-4-5', Icon: BrainCircuit, labelZh: 'Claude Haiku 4.5', labelEn: 'Claude Haiku 4.5' },
            ],
          },
          {
            id: 'models-google',
            path: '/ai-ecosystem?vendor=Google+DeepMind',
            Icon: BrainCircuit,
            logo: `${import.meta.env.BASE_URL}logos/googlegemini.svg`,
            labelZh: 'Google DeepMind',
            labelEn: 'Google DeepMind',
            children: [
              { id: 'google-gemini-3-1-pro', path: '/models/google-gemini-3-1-pro', Icon: BrainCircuit, labelZh: 'Gemini 3.1 Pro', labelEn: 'Gemini 3.1 Pro' },
              { id: 'google-gemini-3-flash', path: '/models/google-gemini-3-flash', Icon: BrainCircuit, labelZh: 'Gemini 3 Flash', labelEn: 'Gemini 3 Flash' },
              { id: 'google-gemini-2-5-pro', path: '/models/google-gemini-2-5-pro', Icon: BrainCircuit, labelZh: 'Gemini 2.5 Pro', labelEn: 'Gemini 2.5 Pro' },
              { id: 'google-gemma-4-27b', path: '/models/google-gemma-4-27b', Icon: BrainCircuit, labelZh: 'Gemma 4 27B', labelEn: 'Gemma 4 27B' },
              { id: 'google-gemma-4-9b', path: '/models/google-gemma-4-9b', Icon: BrainCircuit, labelZh: 'Gemma 4 9B', labelEn: 'Gemma 4 9B' },
            ],
          },
          {
            id: 'models-deepseek',
            path: '/ai-ecosystem?vendor=DeepSeek',
            Icon: BrainCircuit,
            labelZh: 'DeepSeek',
            labelEn: 'DeepSeek',
            children: [
              { id: 'deepseek-v4-pro', path: '/models/deepseek-v4-pro', Icon: BrainCircuit, labelZh: 'DeepSeek V4-Pro', labelEn: 'DeepSeek V4-Pro' },
              { id: 'deepseek-v4-flash', path: '/models/deepseek-v4-flash', Icon: BrainCircuit, labelZh: 'DeepSeek V4-Flash', labelEn: 'DeepSeek V4-Flash' },
              { id: 'deepseek-v4', path: '/models/deepseek-v4', Icon: BrainCircuit, labelZh: 'DeepSeek V4', labelEn: 'DeepSeek V4' },
            ],
          },
          {
            id: 'models-qwen',
            path: '/ai-ecosystem?vendor=Alibaba+Cloud',
            Icon: BrainCircuit,
            logo: `${import.meta.env.BASE_URL}logos/alibaba.svg`,
            labelZh: '通义千问',
            labelEn: 'Tongyi Qwen',
            children: [
              { id: 'alibaba-qwen3-6-max', path: '/models/alibaba-qwen3-6-max', Icon: BrainCircuit, labelZh: 'Qwen3.6-Max', labelEn: 'Qwen3.6-Max' },
              { id: 'alibaba-qwen3-6-plus', path: '/models/alibaba-qwen3-6-plus', Icon: BrainCircuit, labelZh: 'Qwen3.6-Plus', labelEn: 'Qwen3.6-Plus' },
              { id: 'alibaba-qwen3-6-flash', path: '/models/alibaba-qwen3-6-flash', Icon: BrainCircuit, labelZh: 'Qwen3.6-Flash', labelEn: 'Qwen3.6-Flash' },
            ],
          },
          {
            id: 'models-zhipu',
            path: '/ai-ecosystem?vendor=%E6%99%BA%E8%B0%B1AI+%28Zhipu+AI%29',
            Icon: BrainCircuit,
            labelZh: '智谱 AI',
            labelEn: 'Zhipu AI',
            children: [
              { id: 'zhipu-glm-5-1', path: '/models/zhipu-glm-5-1', Icon: BrainCircuit, labelZh: 'GLM-5.1', labelEn: 'GLM-5.1' },
            ],
          },
          {
            id: 'models-xai',
            path: '/ai-ecosystem?vendor=SpaceXAI+%28%E5%8E%9F+xAI%29',
            Icon: BrainCircuit,
            logo: `${import.meta.env.BASE_URL}logos/xai.svg`,
            labelZh: 'xAI / Grok',
            labelEn: 'xAI / Grok',
            children: [
              { id: 'spacexai-grok-4-3', path: '/models/spacexai-grok-4-3', Icon: BrainCircuit, labelZh: 'Grok 4.3', labelEn: 'Grok 4.3' },
            ],
          },
          {
            id: 'models-xiaomi',
            path: '/ai-ecosystem?vendor=Xiaomi',
            Icon: BrainCircuit,
            logo: `${import.meta.env.BASE_URL}logos/xiaomi.svg`,
            labelZh: '小米 MiMo',
            labelEn: 'Xiaomi MiMo',
            children: [
              { id: 'xiaomi-mimo-7b', path: '/models/xiaomi-mimo-7b', Icon: BrainCircuit, labelZh: 'MiMo 7B', labelEn: 'MiMo 7B' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'reports',
    labelZh: 'Reports',
    labelEn: 'Reports',
    sections: [
      {
        id: 'report-entrypoints',
        labelZh: '报告入口',
        labelEn: 'Report Entrypoints',
        items: [
          { id: 'reports-overview', path: '/reports', Icon: Target, labelZh: '报告中心', labelEn: 'Reports Center' },
        ],
      },
    ],
  },
  {
    id: 'maintenance',
    labelZh: 'Maintenance',
    labelEn: 'Maintenance',
    sections: [
      {
        id: 'maintenance-links',
        labelZh: '维护入口',
        labelEn: 'Maintenance Links',
        items: [
          { id: 'maintenance-overview', path: '/maintenance', Icon: Sparkles, labelZh: '数据维护', labelEn: 'Data Maintenance' },
          { id: 'favorites', path: '/favorites', Icon: Star, labelZh: '收藏', labelEn: 'Favorites', badge: 'favorites-count' },
        ],
      },
    ],
  },
];

export function flattenNavLinks(groups: NavGroup[] = NAV_GROUPS): NavItem[] {
  const flattenItem = (item: NavItem): NavItem[] => [item, ...(item.children ?? []).flatMap(flattenItem)];

  return groups.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.items.flatMap(flattenItem),
    ),
  );
}
