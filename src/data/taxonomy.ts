/**
 * src/data/taxonomy.ts
 * ─────────────────────────────────────────────────────────────────
 * 能力维度枚举 + 报表模板枚举
 * 整个 app 统一通过这里引用枚举值，避免各处硬编码字符串。
 */

// ── 评分维度 ──────────────────────────────────────────────────────

export const SCORE_DIMS = ['reasoning', 'coding', 'toolUse', 'consistency', 'latency'] as const;
export type ScoreDim = (typeof SCORE_DIMS)[number];

export const SCORE_DIM_LABELS: Record<ScoreDim, string> = {
  reasoning: '推理',
  coding: '编码',
  toolUse: '工具调用',
  consistency: '一致性',
  latency: '速度',
};

// ── AI Tool 能力特征（与 AiToolFeature 镜像，方便枚举操作） ───────

export const TOOL_FEATURES = [
  'code-completion',
  'code-generation',
  'code-execution',
  'refactoring',
  'testing',
  'documentation',
  'debugging',
  'optimization',
  'api-integration',
  'voice-control',
  'terminal',
  'agents',
  'multi-file',
  'chat',
  'file-editing',
  'security-scanning',
  'local-private',
  'git-integration',
  'web-search',
  'image-analysis',
] as const;
export type ToolFeature = (typeof TOOL_FEATURES)[number];

export const TOOL_FEATURE_LABELS: Record<ToolFeature, string> = {
  'code-completion': '代码补全',
  'code-generation': '代码生成',
  'code-execution': '代码执行',
  'refactoring': '重构',
  'testing': '测试',
  'documentation': '文档',
  'debugging': '调试',
  'optimization': '优化',
  'api-integration': 'API 集成',
  'voice-control': '语音控制',
  'terminal': '终端',
  'agents': 'Agent',
  'multi-file': '多文件',
  'chat': '对话',
  'file-editing': '文件编辑',
  'security-scanning': '安全扫描',
  'local-private': '本地/私有',
  'git-integration': 'Git 集成',
  'web-search': '网络搜索',
  'image-analysis': '图像分析',
};

// ── 报表模板 ──────────────────────────────────────────────────────

export type ReportTemplate = 'radar' | 'bar-compare' | 'pricing-table' | 'capability-matrix';

export const REPORT_TEMPLATES: ReportTemplate[] = [
  'radar',
  'bar-compare',
  'pricing-table',
  'capability-matrix',
];

export const REPORT_TEMPLATE_LABELS: Record<ReportTemplate, string> = {
  'radar': '雷达图',
  'bar-compare': '柱状对比',
  'pricing-table': '定价对比表',
  'capability-matrix': '能力矩阵',
};

// ── 模型/工具分类标签颜色映射 ─────────────────────────────────────

export const MODEL_CATEGORY_COLORS = {
  frontier: 'text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-900/30 dark:border-violet-700',
  coding: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700',
  reasoning: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700',
  multimodal: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-700',
  open: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700',
} as const;

export const COST_TIER_LABELS = {
  low: '低价',
  medium: '中价',
  high: '高价',
} as const;

export const COST_TIER_COLORS = {
  low: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700',
  medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700',
  high: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700',
} as const;
