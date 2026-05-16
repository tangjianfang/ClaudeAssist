/**
 * src/data/tools/index.ts
 * ─────────────────────────────────────────────────────────────────
 * 工具查询 API barrel。数据仍存储在 ai-ecosystem.ts 中，此文件
 * 提供类型安全的查询入口和 defineTool() 注册辅助。
 */

import { DATA_STORE } from '../ai-ecosystem';
import type { AiTool, AiToolCategory, AiToolFeature } from '../ai-ecosystem';

export type { AiTool, AiToolCategory, AiToolFeature };

/**
 * defineTool — 类型安全的工具定义辅助，无运行时开销。
 * 使用示例：`export const myCopilot = defineTool({ id: '...', ... })`
 */
export function defineTool(tool: AiTool): AiTool {
  return tool;
}

/** 获取所有工具列表（可选过滤） */
export function getTools(filter?: {
  category?: AiToolCategory;
  vendor?: string;
  features?: AiToolFeature[];
  compatible?: string;
  chinaAccessible?: boolean;
}): AiTool[] {
  let result = DATA_STORE.tools;

  if (filter?.category) {
    result = result.filter((t) => t.category === filter.category);
  }
  if (filter?.vendor) {
    result = result.filter((t) => t.vendor === filter.vendor);
  }
  if (filter?.features && filter.features.length > 0) {
    result = result.filter((t) => filter.features!.every((f) => t.features.includes(f)));
  }
  if (filter?.compatible) {
    result = result.filter((t) => t.compatible.includes(filter.compatible!));
  }
  if (filter?.chinaAccessible !== undefined) {
    result = result.filter((t) => t.china.accessible === filter.chinaAccessible);
  }

  return result;
}

/** 按 id 查找工具；找不到返回 undefined */
export function getToolById(id: string): AiTool | undefined {
  return DATA_STORE.tools.find((t) => t.id === id);
}

/** 按名称（大小写不敏感）查找工具 */
export function getToolByName(name: string): AiTool | undefined {
  const lower = name.toLowerCase();
  return DATA_STORE.tools.find((t) => t.name.toLowerCase() === lower);
}

/** 获取所有工具 id 列表 */
export function getToolIds(): string[] {
  return DATA_STORE.tools.map((t) => t.id);
}

/** 获取去重 vendor 列表 */
export function getToolVendors(): string[] {
  return Array.from(new Set(DATA_STORE.tools.map((t) => t.vendor))).sort();
}

/** 获取去重 feature 列表 */
export function getAllToolFeatures(): AiToolFeature[] {
  return Array.from(new Set(DATA_STORE.tools.flatMap((t) => t.features))).sort() as AiToolFeature[];
}

/** 获取去重 compatible IDE 列表 */
export function getAllCompatibleIDEs(): string[] {
  return Array.from(new Set(DATA_STORE.tools.flatMap((t) => t.compatible))).sort();
}
