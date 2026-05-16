import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  claudePreview.childPages.some((page) => page.path === '/slash-commands'),
  'Claude Code commands should link to the real command reference page',
);
assert.ok(
  claudePreview.childPages.some((page) => page.path === '/scenarios'),
  'Claude Code scenario library should be exposed from the profile preview',
);
assert.ok(
  claudePreview.childPages.some((page) => page.path === '/env-vars'),
  'Claude Code environment variables should link to the real reference page',
);

const toolDetailSource = readFileSync(new URL('../src/pages/ToolDetail.tsx', import.meta.url), 'utf8');
assert.ok(!toolDetailSource.includes('相关工具组合'), 'tool profile pages should not render related tool combinations');
assert.ok(!toolDetailSource.includes('toolCombinations.filter'), 'tool profiles should not query tool combinations directly');

const aiToolsSource = readFileSync(new URL('../src/pages/AiTools.tsx', import.meta.url), 'utf8');
assert.ok(aiToolsSource.includes('/tool-combinations'), 'tool decision workbench should link to the complete combinations page');

const toolCombinationsSource = readFileSync(new URL('../src/pages/ToolCombinations.tsx', import.meta.url), 'utf8');
for (const expectedFilter of [
  'scenarioCategoryFilter',
  'priorityFilter',
  'modelProviderFilter',
  'supportLevelFilter',
  'riskTypeFilter',
  'setupTimeFilter',
]) {
  assert.ok(toolCombinationsSource.includes(expectedFilter), `combination selector should expose ${expectedFilter}`);
}

console.log('tool workbench test passed');