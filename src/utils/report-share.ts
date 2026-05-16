import type { AiTool, AiModel } from '../data/ai-ecosystem';
import { TOOL_SCORE_KEYS, TOOL_SCORE_LABELS, SCORE_KEYS, SCORE_LABELS } from '../data/ai-ecosystem';

// ── 白名单常量 ────────────────────────────────────────────────────────────────
export const VALID_TOOL_DIMS = TOOL_SCORE_KEYS as readonly string[];

const REPORT_TYPE = 'tool-compare';
const VERSION = '1';

// ── URL 构建 / 解析 ───────────────────────────────────────────────────────────

/**
 * 根据选中的 tool ids（和可选维度）构建可分享 URL。
 * 格式：<origin><pathname>#/ai-tools?r=tool-compare&v=1&ids=a,b,c&dims=d1,d2
 */
export function buildToolCompareUrl(ids: string[], dims: string[] = []): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  const dimsParam = dims.filter((d) => VALID_TOOL_DIMS.includes(d));
  const params = new URLSearchParams({
    r: REPORT_TYPE,
    v: VERSION,
    ids: ids.join(','),
    ...(dimsParam.length ? { dims: dimsParam.join(',') } : {}),
  });
  return `${base}#/ai-tools?${params.toString()}`;
}

/**
 * 从 react-router useSearchParams 返回的对象中解析 tool-compare 参数。
 * 未知 id / 重复 id / 超过 4 个 id 均被安全处理（调用方传入 validIds 集合）。
 */
export function parseToolCompareParams(
  searchParams: URLSearchParams,
  validIds: Set<string>,
): { ids: string[]; dims: string[] } {
  if (searchParams.get('r') !== REPORT_TYPE) return { ids: [], dims: [] };

  const rawIds = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];
  const ids = [...new Set(rawIds.filter((id) => validIds.has(id)))].slice(0, 4);

  const rawDims = searchParams.get('dims')?.split(',').filter(Boolean) ?? [];
  const dims = rawDims.filter((d) => VALID_TOOL_DIMS.includes(d));

  return { ids, dims };
}

// ── Markdown 摘要 ─────────────────────────────────────────────────────────────

/** 生成包含来源链接和 checkedAt 的 Markdown 对比摘要 */
export function buildToolMarkdown(tools: AiTool[], dims: string[] = []): string {
  const activeDims = (dims.length ? dims : [...TOOL_SCORE_KEYS]).filter((d) =>
    TOOL_SCORE_KEYS.includes(d as keyof AiTool['scores']),
  ) as Array<keyof AiTool['scores']>;

  const now = new Date().toISOString().slice(0, 10);
  const header = ['维度', ...tools.map((t) => t.name)].join(' | ');
  const sep = ['---', ...tools.map(() => '---')].join(' | ');
  const rows = activeDims.map((dim) => {
    const label = TOOL_SCORE_LABELS[dim];
    const cells = tools.map((t) => t.scores[dim].toFixed(1));
    return [label, ...cells].join(' | ');
  });

  const sources = tools
    .map((t) => `- **${t.name}**: [${t.source.label}](${t.source.url}) — 核验于 ${t.source.checkedAt}`)
    .join('\n');

  return [
    `## AI 工具对比`,
    '',
    `| ${header} |`,
    `| ${sep} |`,
    ...rows.map((r) => `| ${r} |`),
    '',
    `### 来源`,
    sources,
    '',
    `> 生成时间：${now}`,
  ].join('\n');
}

// ── 模型对比 URL 构建 / 解析 ─────────────────────────────────────────────────

export const VALID_MODEL_DIMS = SCORE_KEYS as readonly string[];
const MODEL_REPORT_TYPE = 'model-compare';

/**
 * 构建模型对比可分享 URL。
 * 格式：<origin><pathname>#/ai-ecosystem?r=model-compare&v=1&ids=a,b&tab=pricing
 */
export function buildModelCompareUrl(
  ids: string[],
  tab: 'scores' | 'pricing' | 'capability' = 'scores',
): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams({
    r: MODEL_REPORT_TYPE,
    v: VERSION,
    ids: ids.join(','),
    tab,
  });
  return `${base}#/ai-ecosystem?${params.toString()}`;
}

/**
 * 从 useSearchParams 解析模型对比参数。
 * 未知 id / 超过 4 个 id 均被安全处理。
 */
export function parseModelCompareParams(
  searchParams: URLSearchParams,
  validIds: Set<string>,
): { ids: string[]; tab: 'scores' | 'pricing' | 'capability' } {
  if (searchParams.get('r') !== MODEL_REPORT_TYPE) return { ids: [], tab: 'scores' };

  const rawIds = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];
  const ids = [...new Set(rawIds.filter((id) => validIds.has(id)))].slice(0, 4);

  const rawTab = searchParams.get('tab') ?? 'scores';
  const tab: 'scores' | 'pricing' | 'capability' =
    rawTab === 'pricing' ? 'pricing' :
    rawTab === 'capability' ? 'capability' : 'scores';

  return { ids, tab };
}

/** 生成模型对比 Markdown 摘要（含定价与来源）*/
export function buildModelMarkdown(models: AiModel[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const header = ['维度', ...models.map((m) => m.name)].join(' | ');
  const sep = ['---', ...models.map(() => '---')].join(' | ');
  const scoreRows = SCORE_KEYS.map((key) => {
    const label = SCORE_LABELS[key];
    const cells = models.map((m) => m.scores[key].toFixed(1));
    return `| ${[label, ...cells].join(' | ')} |`;
  });

  const pricingRows = [
    ['输入 /1M', ...models.map((m) => m.pricing.inputPerMTokens)],
    ['输出 /1M', ...models.map((m) => m.pricing.outputPerMTokens)],
  ].map((row) => `| ${row.join(' | ')} |`);

  const sources = models
    .map((m) => `- **${m.name}**: [${m.source.label}](${m.source.url}) — 核验于 ${m.source.checkedAt}`)
    .join('\n');

  return [
    `## AI 模型对比`,
    '',
    `### 能力评分`,
    `| ${header} |`,
    `| ${sep} |`,
    ...scoreRows,
    '',
    `### 定价`,
    `| ${['定价项', ...models.map((m) => m.name)].join(' | ')} |`,
    `| ${['---', ...models.map(() => '---')].join(' | ')} |`,
    ...pricingRows,
    '',
    `### 来源`,
    sources,
    '',
    `> 生成时间：${now}`,
  ].join('\n');
}

// ── SVG 下载 ──────────────────────────────────────────────────────────────────

/**
 * 将 SVGSVGElement 序列化并触发浏览器下载。
 * 仅序列化传入的元素，避免误抓页面第一个 SVG。
 */
export function downloadSvgElement(svgEl: SVGSVGElement, filename = 'report.svg'): void {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
