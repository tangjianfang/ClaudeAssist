import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { flattenNavLinks, NAV_GROUPS } from '../src/data/navigation';

const groupIds = NAV_GROUPS.map((group) => group.id);

assert.deepEqual(
  groupIds,
  ['decision-lab', 'ai-coding-tools', 'models', 'reports', 'maintenance'],
  'top-level navigation must only contain V4 product domains',
);

assert.ok(
  !groupIds.includes('claude-code'),
  'Claude Code must not remain a top-level navigation group',
);

const aiCodingTools = NAV_GROUPS.find((group) => group.id === 'ai-coding-tools');
assert.ok(aiCodingTools, 'AI Coding Tools group must exist');

const decisionLab = NAV_GROUPS.find((group) => group.id === 'decision-lab');
assert.ok(decisionLab, 'Decision Lab group must exist');
assert.deepEqual(
  decisionLab.sections.map((section) => section.id),
  ['decision-workflows'],
  'Decision Lab must not expose Claude Code reference sections',
);
assert.deepEqual(
  decisionLab.sections.flatMap((section) => section.items.map((item) => item.id)),
  ['decision-workbench'],
  'Decision Lab should contain only scenario decisions; tool combinations belong to AI Coding Tools',
);

type TestNavLink = {
  id: string;
  path: string;
  children?: TestNavLink[];
};

type TestNavSection = {
  id: string;
  items: TestNavLink[];
};

const aiCodingToolsSections = (aiCodingTools as { sections?: TestNavSection[] }).sections;
assert.ok(
  Array.isArray(aiCodingToolsSections),
  'AI Coding Tools must use explicit sections instead of a flat item list',
);
assert.deepEqual(
  aiCodingToolsSections.map((section) => section.id),
  ['tool-decision', 'tool-profiles'],
  'AI Coding Tools must separate the workbench from peer tool profiles',
);

const toolProfiles = aiCodingToolsSections.find((section) => section.id === 'tool-profiles');
assert.ok(toolProfiles, 'AI Coding Tools must expose a tool profiles section');

const toolDecision = aiCodingToolsSections.find((section) => section.id === 'tool-decision');
assert.ok(toolDecision, 'AI Coding Tools must expose a tool decision section');
assert.deepEqual(
  toolDecision.items.map((item) => item.id),
  ['ai-tools-workbench', 'tool-combinations'],
  'Tool combinations should live under AI Coding Tools / Tool Decision',
);

const claudeCodeProfile = toolProfiles.items[0];
assert.equal(claudeCodeProfile.id, 'claude-code');
assert.equal(claudeCodeProfile.path, '/tools/claude-code');

const referenceItems = claudeCodeProfile.children ?? [];
assert.deepEqual(
  referenceItems.map((item) => item.id),
  [
    'claude-code-getting-started',
    'claude-code-reference',
    'claude-code-capabilities',
    'claude-code-config',
  ],
  'Claude Code children should be the four collapsible sub-groups',
);

// all leaf items should still be reachable under the sub-groups
function flattenChildren(items: TestNavLink[]): TestNavLink[] {
  return items.flatMap((item) => [item, ...flattenChildren(item.children ?? [])]);
}
const allClaudeChildren = flattenChildren(referenceItems);
const claudeReferencePaths = Object.fromEntries(allClaudeChildren.map((item) => [item.id, item.path]));
assert.equal(claudeReferencePaths['claude-code-scenarios'], '/scenarios');
assert.equal(claudeReferencePaths['claude-code-cheatsheet'], '/cheatsheet');
assert.equal(claudeReferencePaths['claude-code-commands'], '/slash-commands');
assert.equal(claudeReferencePaths['claude-code-features'], '/features');
assert.equal(claudeReferencePaths['claude-code-plugins'], '/plugins');
assert.equal(claudeReferencePaths['claude-code-onboarding'], '/tools/claude-code/onboarding');
assert.equal(claudeReferencePaths['claude-code-settings'], '/settings');
// every group must have sub-items
assert.ok(
  referenceItems.every((group) => (group.children?.length ?? 0) >= 1),
  'every Claude Code sub-group must have at least one child item',
);

const peerToolIds = toolProfiles.items.slice(1).map((item) => item.id);
assert.deepEqual(
  peerToolIds,
  ['opencode', 'gemini-cli', 'github-copilot-cli', 'codex-cli'],
  'OpenCode, Gemini CLI, GitHub Copilot CLI, and Codex CLI must remain peer tool profiles, not Claude Code children',
);
assert.ok(
  toolProfiles.items.slice(1).every((item) => (item.children?.length ?? 0) >= 4),
  'peer tool profiles must expose their own third-level profile sections',
);

const models = NAV_GROUPS.find((group) => group.id === 'models');
assert.ok(models, 'Models group must exist');
const modelSections = (models as { sections?: TestNavSection[] }).sections;
assert.ok(Array.isArray(modelSections), 'Models must use explicit sections');
const providers = modelSections.find((section) => section.id === 'frontier-models');
assert.ok(providers, 'Models must expose mainstream provider hierarchy');
assert.ok(
  providers.items.every((provider) => (provider.children?.length ?? 0) >= 1),
  'each mainstream provider should expose model-level children',
);

const links = flattenNavLinks();
const duplicatePaths = links
  .map((link) => link.path)
  .filter((path, index, paths) => paths.indexOf(path) !== index);
assert.deepEqual(
  duplicatePaths,
  [],
  'sidebar links must not reuse the same route for different menu entries',
);

const homeSource = readFileSync(new URL('../src/pages/Home.tsx', import.meta.url), 'utf8');
assert.ok(!homeSource.includes('Claude Code Reference'), 'AI scenario decision page must not render Claude Code reference blocks');
assert.ok(!homeSource.includes('初次使用 Claude Code'), 'AI scenario decision page must not render Claude onboarding links');

console.log('navigation architecture test passed');