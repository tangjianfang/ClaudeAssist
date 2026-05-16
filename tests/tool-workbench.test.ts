import assert from 'node:assert/strict';
import { getToolProfilePreview, getToolWorkbenchCandidates } from '../src/data/tools/index';

const candidates = getToolWorkbenchCandidates({ scenarioId: 'china-low-cost-coding' });
assert.ok(candidates.length >= 3, 'tool workbench should expose primary, alternative, and avoid candidates');

const primary = candidates[0];
assert.equal(primary.tool.id, 'opencode');
assert.equal(primary.decisionFit, 'primary');
assert.equal(primary.recommendedModel?.id, 'deepseek-v4-flash');
assert.ok(primary.reasons.length >= 3, 'primary workbench candidate must include decision reasons');
assert.ok(primary.risks.length >= 1, 'primary workbench candidate must include risks');

const claudePreview = getToolProfilePreview('claude-code');
assert.equal(claudePreview.tool.id, 'claude-code');
assert.ok(claudePreview.installation.length > 0, 'profile preview needs an installation entry');
assert.ok(claudePreview.workflows.length >= 2, 'profile preview needs quick workflows');
assert.ok(
  claudePreview.childPages.some((page) => page.path === '/tools/claude-code/commands'),
  'Claude Code child knowledge must be nested under /tools/claude-code',
);
assert.ok(
  claudePreview.childPages.some((page) => page.path === '/tools/claude-code/env-vars'),
  'Claude Code environment variables should have a nested child route',
);

console.log('tool workbench test passed');