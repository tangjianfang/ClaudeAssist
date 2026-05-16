/**
 * src/data/navigation.ts
 * ─────────────────────────────────────────────────────────────────
 * 导航树配置。Sidebar 从此处读取数据渲染，无需手动维护 JSX 列表。
 * 新增页面只需在对应 group 中追加一条 NavItem，不用改 Sidebar 代码。
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
}

export interface NavGroup {
  id: string;
  labelZh: string;
  labelEn: string;
  items: NavItem[];
}

// ── 数据 ─────────────────────────────────────────────────────────

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'claude-code',
    labelZh: 'Claude Code',
    labelEn: 'Claude Code',
    items: [
      { id: 'scenarios',  path: '/scenarios',  Icon: BookOpen,    labelZh: '使用场景',        labelEn: 'Scenarios',    badge: 'scenarios-count' as const },
      { id: 'features',   path: '/features',   Icon: Sparkles,    labelZh: '新特性',          labelEn: "What's New" },
      { id: 'plugins',    path: '/plugins',    Icon: Puzzle,      labelZh: '插件指南',        labelEn: 'Plugin Guides' },
      { id: 'clawcode',   path: '/clawcode',   Icon: Code,        labelZh: 'ClawCode',        labelEn: 'ClawCode' },
    ],
  },
  {
    id: 'ai-tools-models',
    labelZh: 'AI 工具 & 模型',
    labelEn: 'AI Tools & Models',
    items: [
      { id: 'ai-ecosystem',    path: '/ai-ecosystem',    Icon: BrainCircuit, labelZh: 'AI 生态追踪',   labelEn: 'AI Ecosystem' },
      { id: 'ai-tools',        path: '/ai-tools',        Icon: Wrench,       labelZh: 'AI 编码工具',   labelEn: 'AI Tools' },
      { id: 'tool-combinations', path: '/tool-combinations', Icon: Target,   labelZh: '工具组合方案', labelEn: 'Combinations' },
    ],
  },
  {
    id: 'personal',
    labelZh: '个人',
    labelEn: 'Personal',
    items: [
      { id: 'favorites', path: '/favorites', Icon: Star, labelZh: '收藏', labelEn: 'Favorites', badge: 'favorites-count' },
    ],
  },
  {
    id: 'reference',
    labelZh: '参考手册',
    labelEn: 'Reference',
    items: [
      { id: 'slash-commands', path: '/slash-commands', Icon: Slash,    labelZh: '斜杠命令',  labelEn: 'Slash Commands', badge: 'section-count' },
      { id: 'cli-flags',      path: '/cli-flags',      Icon: Terminal, labelZh: 'CLI 标志', labelEn: 'CLI Flags',      badge: 'section-count' },
      { id: 'shortcuts',      path: '/shortcuts',      Icon: Keyboard, labelZh: '快捷键',   labelEn: 'Shortcuts',      badge: 'section-count' },
      { id: 'skills',         path: '/skills',         Icon: Zap,      labelZh: 'Skills',   labelEn: 'Skills',         badge: 'section-count' },
      { id: 'modes',          path: '/modes',          Icon: Layers,   labelZh: 'Modes',    labelEn: 'Modes',          badge: 'section-count' },
      { id: 'settings',       path: '/settings',       Icon: Settings, labelZh: '设置',     labelEn: 'Settings',       badge: 'section-count' },
      { id: 'env-vars',       path: '/env-vars',       Icon: Variable, labelZh: '环境变量', labelEn: 'Env Vars',       badge: 'section-count' },
    ],
  },
];
