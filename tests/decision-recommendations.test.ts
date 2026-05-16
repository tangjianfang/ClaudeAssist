import assert from 'node:assert/strict';
import { getScenarioRecommendation } from '../src/data/decision-scenarios';

const recommendation = getScenarioRecommendation('china-low-cost-coding');

assert.equal(recommendation.id, 'china-low-cost-coding');
assert.equal(recommendation.title, '国内可用 + 低成本 AI 编码方案');
assert.ok(recommendation.primary.toolId, 'primary recommendation must reference a tool id');
assert.ok(recommendation.primary.modelId, 'primary recommendation must reference a model id');
assert.ok(recommendation.primary.reasons.length >= 3, 'primary recommendation needs decision reasons');
assert.ok(recommendation.primary.risks.length >= 1, 'primary recommendation needs risk notes');
assert.ok(recommendation.evidence.sources.length >= 2, 'recommendation needs traceable sources');
assert.ok(recommendation.report.summary.includes('推荐'), 'report summary should be conclusion-oriented');

console.log('decision recommendation test passed');
