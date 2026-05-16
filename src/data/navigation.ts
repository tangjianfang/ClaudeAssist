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
} from 'lucide-react';

// ── 类型 ─────────────────────────────────────────────────────────

export interface NavItem {
  /** 唯一 id，也作为 i18n 的 section key（若适用） */
  id: string;
  /** 路由路径 */
  path: string;
  /** Lucide 图标 */
  Icon: LucideIcon;
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
  /** 子导航项，用于表达真实层级，如 Claude Code 下的知识页 */
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
          { id: 'decision-workbench', path: '/', Icon: Target, labelZh: '场景决策', labelEn: 'Scenario Decisions' },
          { id: 'tool-combinations', path: '/tool-combinations', Icon: Layers, labelZh: '组合方案', labelEn: 'Combinations' },
          { id: 'scenarios', path: '/scenarios', Icon: BookOpen, labelZh: '场景库', labelEn: 'Scenario Library', badge: 'scenarios-count' as const },
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
            labelZh: 'Claude Code',
            labelEn: 'Claude Code',
            children: [
              { id: 'claude-code-commands', path: '/tools/claude-code/commands', Icon: Slash, labelZh: 'Commands', labelEn: 'Commands' },
              { id: 'claude-code-cli-flags', path: '/tools/claude-code/cli-flags', Icon: Terminal, labelZh: 'CLI Flags', labelEn: 'CLI Flags' },
              { id: 'claude-code-shortcuts', path: '/tools/claude-code/shortcuts', Icon: Keyboard, labelZh: 'Shortcuts', labelEn: 'Shortcuts' },
              { id: 'claude-code-settings', path: '/tools/claude-code/settings', Icon: Settings, labelZh: 'Settings', labelEn: 'Settings' },
              { id: 'claude-code-skills', path: '/tools/claude-code/skills', Icon: Zap, labelZh: 'Skills', labelEn: 'Skills' },
              { id: 'claude-code-modes', path: '/tools/claude-code/modes', Icon: Layers, labelZh: 'Modes', labelEn: 'Modes' },
              { id: 'claude-code-plugins', path: '/tools/claude-code/plugins', Icon: Puzzle, labelZh: 'Plugins', labelEn: 'Plugins' },
              { id: 'claude-code-env-vars', path: '/tools/claude-code/env-vars', Icon: Variable, labelZh: 'Env Vars', labelEn: 'Env Vars' },
            ],
          },
          { id: 'opencode', path: '/tools/opencode', Icon: Terminal, labelZh: 'OpenCode', labelEn: 'OpenCode' },
          { id: 'gemini-cli', path: '/tools/gemini-cli', Icon: Sparkles, labelZh: 'Gemini CLI', labelEn: 'Gemini CLI' },
          { id: 'github-copilot-cli', path: '/tools/github-copilot-cli', Icon: Slash, labelZh: 'GitHub Copilot CLI', labelEn: 'GitHub Copilot CLI' },
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
  return groups.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.items.flatMap((item) => [item, ...(item.children ?? [])]),
    ),
  );
}
