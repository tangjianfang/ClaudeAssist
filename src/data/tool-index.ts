/**
 * Tool indexing utilities for fast search and filtering
 */

import { DATA_STORE, TOOL_CATEGORY_LABELS, TOOL_FEATURE_LABELS } from './ai-ecosystem';
import type { AiTool, AiToolCategory, AiToolFeature } from './ai-ecosystem';

// Index of tools by category
export const toolsByCategory: Record<AiToolCategory, AiTool[]> = {
  ide: DATA_STORE.tools.filter(t => t.category === 'ide'),
  editor: DATA_STORE.tools.filter(t => t.category === 'editor'),
  platform: DATA_STORE.tools.filter(t => t.category === 'platform'),
  specialized: DATA_STORE.tools.filter(t => t.category === 'specialized'),
  workflow: DATA_STORE.tools.filter(t => t.category === 'workflow'),
};

// Index of tools by vendor
export const toolsByVendor = new Map<string, AiTool[]>();
DATA_STORE.tools.forEach(tool => {
  if (!toolsByVendor.has(tool.vendor)) {
    toolsByVendor.set(tool.vendor, []);
  }
  toolsByVendor.get(tool.vendor)!.push(tool);
});

// Index of tools by feature
export const toolsByFeature = new Map<AiToolFeature, AiTool[]>();
DATA_STORE.tools.forEach(tool => {
  tool.features.forEach(feature => {
    if (!toolsByFeature.has(feature)) {
      toolsByFeature.set(feature, []);
    }
    toolsByFeature.get(feature)!.push(tool);
  });
});

// Index of tools by compatible IDE
export const toolsByCompatible = new Map<string, AiTool[]>();
DATA_STORE.tools.forEach(tool => {
  tool.compatible.forEach(compat => {
    if (!toolsByCompatible.has(compat)) {
      toolsByCompatible.set(compat, []);
    }
    toolsByCompatible.get(compat)!.push(tool);
  });
});

// Get all unique vendors
export const allVendors = Array.from(toolsByVendor.keys()).sort();

// Get all unique compatible IDEs
export const allCompatibleIDEs = Array.from(toolsByCompatible.keys()).sort();

// Get all unique features used
export const allFeatures: AiToolFeature[] = Array.from(toolsByFeature.keys()).sort() as AiToolFeature[];

// Helper: Get tools by multiple criteria
export function filterTools(options: {
  category?: AiToolCategory | 'all';
  vendor?: string;
  features?: AiToolFeature[];
  compatible?: string;
  minScoreType?: 'completion' | 'generation' | 'efficiency';
  minScore?: number;
  chinaAccessible?: boolean | 'any';
}): AiTool[] {
  let tools = DATA_STORE.tools;

  if (options.category && options.category !== 'all') {
    tools = tools.filter(t => t.category === options.category);
  }

  if (options.vendor) {
    tools = tools.filter(t => t.vendor === options.vendor);
  }

  if (options.features && options.features.length > 0) {
    tools = tools.filter(t =>
      options.features!.every(f => t.features.includes(f))
    );
  }

  if (options.compatible) {
    tools = tools.filter(t => t.compatible.includes(options.compatible!));
  }

  if (options.minScore !== undefined && options.minScore > 0) {
    const scoreType = options.minScoreType || 'completion';
    const scoreKey = scoreType === 'completion' ? 'codeCompletion' : scoreType === 'generation' ? 'codeGeneration' : 'efficiency';
    tools = tools.filter(t => t.scores[scoreKey as keyof typeof t.scores] >= options.minScore!);
  }

  if (options.chinaAccessible !== undefined && options.chinaAccessible !== 'any') {
    tools = tools.filter(t => t.china.accessible === options.chinaAccessible);
  }

  return tools;
}

// Helper: Get combinations for a tool ID
export function getToolCombinations(toolId: string) {
  const tool = DATA_STORE.tools.find(t => t.id === toolId);
  if (!tool) return [];

  return DATA_STORE.toolCombinations.filter(combo =>
    combo.tool === tool.name
  );
}

// Helper: Get combinations for a model name
export function getModelCombinations(modelName: string) {
  return DATA_STORE.toolCombinations.filter(combo =>
    combo.model.includes(modelName) || combo.model === modelName
  );
}

// Helper: Compare tools
export function compareTools(toolIds: string[]) {
  return toolIds
    .map(id => DATA_STORE.tools.find(t => t.id === id))
    .filter((t) => t !== undefined) as AiTool[];
}

// Helper: Get recommended tools based on criteria
export function getRecommendedTools(criteria: {
  category?: AiToolCategory;
  useCase?: 'beginners' | 'professionals' | 'enterprise' | 'privacy';
  maxCost?: 'free' | 'low' | 'medium' | 'high';
  needsChina?: boolean;
}): AiTool[] {
  let tools = DATA_STORE.tools;

  // Filter by category if specified
  if (criteria.category) {
    tools = tools.filter(t => t.category === criteria.category);
  }

  // Filter by use case
  if (criteria.useCase === 'beginners') {
    tools = tools.filter(t => {
      const hasEasySetup = t.tags.some(tag => tag.includes('simple') || tag.includes('easy'));
      const notTooExpensive = t.costTier !== 'high';
      return hasEasySetup || notTooExpensive;
    });
  } else if (criteria.useCase === 'professionals') {
    tools = tools.filter(t => {
      const hasPowerful = t.tags.some(tag => tag.includes('powerful') || tag.includes('advanced'));
      const hasGoodScore = Math.max(...Object.values(t.scores)) >= 8.5;
      return hasPowerful || hasGoodScore;
    });
  } else if (criteria.useCase === 'enterprise') {
    tools = tools.filter(t => {
      const isEnterprise = t.tags.some(tag => tag.includes('enterprise'));
      const hasSupport = t.tags.some(tag => tag.includes('professional') || tag.includes('mature'));
      return isEnterprise || hasSupport;
    });
  } else if (criteria.useCase === 'privacy') {
    tools = tools.filter(t => {
      const isPrivacyFocused = t.tags.some(tag => tag.includes('privacy') || tag.includes('local'));
      const isOffline = t.features.some(f => f === 'local-private');
      return isPrivacyFocused || isOffline;
    });
  }

  // Filter by cost
  if (criteria.maxCost) {
    const costOrder = { free: 0, low: 1, medium: 2, high: 3 };
    tools = tools.filter(t => costOrder[t.costTier] <= costOrder[criteria.maxCost!]);
  }

  // Filter by China accessibility
  if (criteria.needsChina !== undefined) {
    if (criteria.needsChina) {
      tools = tools.filter(t => t.china.accessible);
    }
  }

  // Sort by popularity/score
  tools.sort((a, b) => {
    const avgA = Object.values(a.scores).reduce((x, y) => x + y) / Object.values(a.scores).length;
    const avgB = Object.values(b.scores).reduce((x, y) => x + y) / Object.values(b.scores).length;
    return avgB - avgA;
  });

  return tools.slice(0, 5); // Return top 5
}
