import assert from 'node:assert/strict';
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

const claudeCodeProfile = toolProfiles.items[0];
assert.equal(claudeCodeProfile.id, 'claude-code');
assert.equal(claudeCodeProfile.path, '/tools/claude-code');

const referenceItems = claudeCodeProfile.children ?? [];
assert.deepEqual(
  referenceItems.map((item) => item.id),
  [
    'claude-code-commands',
    'claude-code-cli-flags',
    'claude-code-shortcuts',
    'claude-code-settings',
    'claude-code-skills',
    'claude-code-modes',
    'claude-code-plugins',
    'claude-code-env-vars',
  ],
  'legacy reference items should be children of the Claude Code profile',
);
assert.ok(
  referenceItems.every((item) => item.path.startsWith('/tools/claude-code/')),
  'legacy reference items should route through Claude Code child paths',
);

const peerToolIds = toolProfiles.items.slice(1).map((item) => item.id);
assert.deepEqual(
  peerToolIds,
  ['opencode', 'gemini-cli', 'github-copilot-cli'],
  'OpenCode, Gemini CLI, and GitHub Copilot CLI must remain peer tool profiles, not Claude Code children',
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

console.log('navigation architecture test passed');