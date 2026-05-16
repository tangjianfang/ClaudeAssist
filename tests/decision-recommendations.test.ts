import assert from 'node:assert/strict';
import {
	getDecisionScenarioIds,
	getHydratedScenarioRecommendation,
	getScenarioRecommendation,
} from '../src/data/decision-scenarios';

const recommendation = getScenarioRecommendation('china-low-cost-coding');
const highPerformanceRecommendation = getHydratedScenarioRecommendation('china-high-performance-coding');
const enterpriseRecommendation = getHydratedScenarioRecommendation('enterprise-reliability-coding');

assert.equal(recommendation.id, 'china-low-cost-coding');
assert.equal(recommendation.title, '国内可用 + 低成本 AI 编码方案');
assert.ok(recommendation.primary.toolId, 'primary recommendation must reference a tool id');
assert.ok(recommendation.primary.modelId, 'primary recommendation must reference a model id');
assert.ok(recommendation.primary.reasons.length >= 3, 'primary recommendation needs decision reasons');
assert.ok(recommendation.primary.risks.length >= 1, 'primary recommendation needs risk notes');
assert.ok(recommendation.evidence.sources.length >= 2, 'recommendation needs traceable sources');
assert.ok(recommendation.report.summary.includes('推荐'), 'report summary should be conclusion-oriented');

assert.equal(highPerformanceRecommendation.id, 'china-high-performance-coding');
assert.equal(highPerformanceRecommendation.primary.tool.id, 'aider-cli');
assert.equal(highPerformanceRecommendation.primary.model.id, 'moonshot-kimi-k2-6');
assert.ok(highPerformanceRecommendation.title.includes('国内高性能'), 'high-performance scenario should be clearly labeled');
assert.ok(highPerformanceRecommendation.report.summary.includes('最高性能'), 'high-performance report should be performance-oriented');
assert.ok(highPerformanceRecommendation.evidence.sources.length >= 4, 'high-performance scenario needs traceable sources');

assert.equal(enterpriseRecommendation.primary.model.id, 'anthropic-claude-opus-4-7');
assert.ok(
	enterpriseRecommendation.primary.reasons.some((reason) => reason.includes('Claude Opus 4.7')),
	'enterprise reliability scenario should describe the current Claude Opus model version',
);

const serializedScenarios = getDecisionScenarioIds()
	.map((scenarioId) => JSON.stringify(getScenarioRecommendation(scenarioId)))
	.join('\n');
assert.ok(!serializedScenarios.includes('Claude 3.7'), 'decision scenarios must not reference stale Claude 3.7 model names');

for (const scenarioId of getDecisionScenarioIds()) {
	const hydrated = getHydratedScenarioRecommendation(scenarioId);
	assert.equal(hydrated.id, scenarioId, `${scenarioId} should hydrate without missing tool/model references`);
	assert.ok(hydrated.primary.tool.id, `${scenarioId} primary option should resolve a tool`);
	assert.ok(hydrated.primary.model.id, `${scenarioId} primary option should resolve a model`);
	assert.ok(hydrated.alternatives.every((option) => option.tool.id && option.model.id), `${scenarioId} alternatives should resolve tools/models`);
	assert.ok(hydrated.avoid.every((option) => option.tool.id && option.model.id), `${scenarioId} avoid options should resolve tools/models`);
}

console.log('decision recommendation test passed');
