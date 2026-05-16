/**
 * src/data/reports/index.ts
 * ─────────────────────────────────────────────────────────────────
 * 报告生成逻辑和数据模型
 */

import { getScenarioRecommendation } from '../decision-scenarios';
import { scenarios } from '../scenarios';
import { getToolById } from '../tools/index';
import { getModels, getModelById } from '../models/index';

// ── 类型定义 ──────────────────────────────────────────────────

export type ReportType = 'scenario' | 'tools-comparison' | 'models-pricing';

export interface ReportSection {
  title: string;
  titleZh?: string;
  content: string;
  recommendations?: Array<{
    label: string;
    description?: string;
    pros: string[];
    cons: string[];
  }>;
}

export interface ReportMetadata {
  sources: string[];
  checkedAt: Date;
  dataVersion: string;
}

export interface ReportContent {
  sections: ReportSection[];
  conclusion: string;
  titleZh?: string;
  metadata: ReportMetadata;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  titleZh?: string;
  generatedAt: Date;
  content: ReportContent;
  sharingUrl?: string;
}

// ── 报告生成函数 ─────────────────────────────────────────────────

/**
 * 根据场景 ID 生成推荐报告
 */
export async function generateScenarioReport(scenarioId: string): Promise<Report> {
  // Find scenario from scenarios list
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) throw new Error(`Scenario ${scenarioId} not found`);

  const recommendation = getScenarioRecommendation(scenarioId as 'china-low-cost-coding');
  if (!recommendation) throw new Error(`No recommendation found for scenario ${scenarioId}`);

  const primaryTool = getToolById(recommendation.primary.toolId);
  const primaryModel = getModelById(recommendation.primary.modelId);

  if (!primaryTool || !primaryModel) {
    throw new Error('Referenced tool or model not found');
  }

  const reportId = `scenario-${scenarioId}-${Date.now()}`;
  const sharingUrl = `/#/reports/${reportId}`;

  const report: Report = {
    id: reportId,
    type: 'scenario',
    title: `${scenario.title.en} - Recommendation Report`,
    titleZh: `${scenario.title['zh-CN']} - 推荐方案报告`,
    generatedAt: new Date(),
    content: {
      sections: [
        {
          title: 'Summary',
          titleZh: '推荐方案总结',
          content: `For the scenario "${scenario.title['zh-CN']}" (${scenario.title.en}), the recommended combination is ${recommendation.primary.toolId} with ${recommendation.primary.modelId} model.`,
          recommendations: [
            {
              label: `${recommendation.primary.toolId} + ${recommendation.primary.modelId}`,
              description: 'Primary Recommendation',
              pros: recommendation.primary.reasons || [],
              cons: recommendation.primary.risks || [],
            },
            ...(recommendation.alternatives || []).map((alt) => ({
              label: `${alt.toolId} + ${alt.modelId}`,
              description: 'Alternative Option',
              pros: alt.reasons || [],
              cons: alt.risks || [],
            })),
          ],
        },
        {
          title: 'Why This Combination?',
          titleZh: '为什么选择这个组合?',
          content: `\n${(recommendation.primary.reasons || []).map((r) => `• ${r}`).join('\n')}`,
        },
        {
          title: 'Potential Risks & Limitations',
          titleZh: '潜在风险与限制',
          content: `\n${(recommendation.primary.risks || []).map((r) => `• ${r}`).join('\n')}`,
        },
        {
          title: 'Tool Details',
          titleZh: '工具详情',
          content: `**${primaryTool.name}** v${primaryTool.version}\n\nVendor: ${primaryTool.vendor}\nCategory: ${primaryTool.category}\nPrice Tier: ${primaryTool.costTier}\nStatus: ${primaryTool.status || 'stable'}\n\nFor more information, visit: ${primaryTool.source.url}`,
        },
        {
          title: 'Model Details',
          titleZh: '模型详情',
          content: `**${primaryModel.name}** - ${primaryModel.vendor}\n\nContext Window: ${primaryModel.contextWindow}\nInput Price: ${primaryModel.pricing.inputPerMTokens}\nOutput Price: ${primaryModel.pricing.outputPerMTokens}\nCurrency: ${primaryModel.pricing.currency}\n\nCategory: ${primaryModel.category}`,
        },
      ],
      conclusion: `Based on comprehensive evaluation, ${recommendation.primary.toolId} with ${recommendation.primary.modelId} is the optimal choice for "${scenario.title['zh-CN']}" scenario. This combination offers the best balance of cost, availability, and feature completeness for your use case.`,
      titleZh: `${scenario.title['zh-CN']} - 推荐报告`,
      metadata: {
        sources: [
          `scenario:${scenarioId}`,
          `tool:${recommendation.primary.toolId}`,
          `model:${recommendation.primary.modelId}`,
        ],
        checkedAt: new Date(),
        dataVersion: '4.0.0',
      },
    },
    sharingUrl,
  };

  return report;
}

/**
 * 生成工具对比报告
 */
export async function generateToolComparisonReport(toolIds: string[]): Promise<Report> {
  const tools = toolIds
    .map((id) => getToolById(id))
    .filter((t): t is ReturnType<typeof getToolById> & {} => t !== undefined);

  if (tools.length === 0) throw new Error('No valid tools found');

  const reportId = `tools-${toolIds.join('-')}-${Date.now()}`;
  const sharingUrl = `/#/reports/${reportId}`;

  const report: Report = {
    id: reportId,
    type: 'tools-comparison',
    title: `Tool Comparison: ${tools.map((t) => t.name).join(' vs ')}`,
    titleZh: `工具对比: ${tools.map((t) => t.name).join(' vs ')}`,
    generatedAt: new Date(),
    content: {
      sections: [
        {
          title: 'Tools Compared',
          titleZh: '对比工具',
          content: tools
            .map(
              (t) =>
                `• **${t.name}** (${t.vendor}) - ${t.category}\n  Version: ${t.version}, Price Tier: ${t.costTier}, Status: ${t.status}`,
            )
            .join('\n\n'),
        },
        {
          title: 'Feature Comparison',
          titleZh: '功能对比',
          content: `All compared tools support AI-assisted coding, file editing, and workflow integration.`,
        },
        {
          title: 'Pricing & Availability',
          titleZh: '价格与可用性',
          content: tools
            .map(
              (t) =>
                `**${t.name}:** ${t.pricing.plan}\n${t.vendor}\n\nStatus: ${t.status || 'stable'}`,
            )
            .join('\n\n'),
        },
      ],
      conclusion: `This report compares ${tools.length} major AI coding tools. Choose based on your priorities: cost, feature set, or availability.`,
      titleZh: `工具对比报告`,
      metadata: {
        sources: tools.map((t) => `tool:${t.id}`),
        checkedAt: new Date(),
        dataVersion: '4.0.0',
      },
    },
    sharingUrl,
  };

  return report;
}

/**
 * 生成模型价格报告
 */
export async function generateModelPricingReport(vendorFilters?: string[]): Promise<Report> {
  const allModels = getModels();
  const models = vendorFilters
    ? allModels.filter((m) => vendorFilters.includes(m.vendor))
    : allModels;

  const reportId = `models-pricing-${Date.now()}`;
  const sharingUrl = `/#/reports/${reportId}`;

  const modelsByVendor: Record<string, typeof models> = {};
  models.forEach((m) => {
    if (!modelsByVendor[m.vendor]) modelsByVendor[m.vendor] = [];
    modelsByVendor[m.vendor].push(m);
  });

  const report: Report = {
    id: reportId,
    type: 'models-pricing',
    title: 'AI Model Pricing & Availability Report',
    titleZh: 'AI 模型价格与可用性报告',
    generatedAt: new Date(),
    content: {
      sections: [
        {
          title: 'Overview',
          titleZh: '概览',
          content: `This report compares ${models.length} AI models across ${Object.keys(modelsByVendor).length} vendors, including pricing, capabilities, and availability.`,
        },
        ...Object.entries(modelsByVendor).map(([vendor, vendorModels]) => ({
          title: `${vendor} Models`,
          titleZh: `${vendor} 模型`,
          content: vendorModels
            .map(
              (m) =>
                `• **${m.name}** - Context: ${m.contextWindow}\n  Input: ${m.pricing.inputPerMTokens}, Output: ${m.pricing.outputPerMTokens}\n  China: ${m.china.accessible ? '✓ Available' : '✗ Not accessible'}`,
            )
            .join('\n\n'),
        })),
      ],
      conclusion: `For China-based use cases, models marked "Available" offer direct access. Consider pricing, capabilities, and China accessibility when selecting models.`,
      titleZh: `AI 模型价格报告`,
      metadata: {
        sources: models.map((m) => `model:${m.id}`),
        checkedAt: new Date(),
        dataVersion: '4.0.0',
      },
    },
    sharingUrl,
  };

  return report;
}
