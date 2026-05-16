/**
 * src/data/models/index.ts
 * ─────────────────────────────────────────────────────────────────
 * 模型查询 API barrel。数据仍存储在 ai-ecosystem.ts 中，此文件
 * 只提供类型安全的查询入口，不重复数据。
 */

import { DATA_STORE } from '../ai-ecosystem';
import type { AiModel, AiModelCategory, CostTier } from '../ai-ecosystem';

export type { AiModel, AiModelCategory, CostTier };

/** 获取所有模型列表（可选按分类/成本过滤） */
export function getModels(filter?: {
  category?: AiModelCategory;
  costTier?: CostTier;
  chinaAccessible?: boolean;
  tags?: string[];
}): AiModel[] {
  let result = DATA_STORE.models;

  if (filter?.category) {
    result = result.filter((m) => m.category === filter.category);
  }
  if (filter?.costTier) {
    result = result.filter((m) => m.costTier === filter.costTier);
  }
  if (filter?.chinaAccessible !== undefined) {
    result = result.filter((m) => m.china.accessible === filter.chinaAccessible);
  }
  if (filter?.tags && filter.tags.length > 0) {
    result = result.filter((m) => filter.tags!.some((tag) => m.tags.includes(tag)));
  }

  return result;
}

/** 按 id 查找模型；找不到返回 undefined */
export function getModelById(id: string): AiModel | undefined {
  return DATA_STORE.models.find((m) => m.id === id);
}

/** 获取所有模型 id 列表 */
export function getModelIds(): string[] {
  return DATA_STORE.models.map((m) => m.id);
}

/** 获取去重 vendor 列表 */
export function getModelVendors(): string[] {
  return Array.from(new Set(DATA_STORE.models.map((m) => m.vendor))).sort();
}
