export { slashCommands } from './slash-commands';
export { cliFlags } from './cli-flags';
export { shortcuts } from './shortcuts';
export { skills } from './skills';
export { modes } from './modes';
export { settings, envVars } from './settings';
export { scenarios, scenarioCategories } from './scenarios';
export type { Scenario, ScenarioDifficulty, ScenarioCategory, ScenarioStep, ScenarioTip } from './scenario-types';

import { slashCommands } from './slash-commands';
import { cliFlags } from './cli-flags';
import { shortcuts } from './shortcuts';
import { skills } from './skills';
import { modes } from './modes';
import { settings, envVars } from './settings';

import type { CommandEntry, SectionId } from './types';
export type { CommandEntry, SectionId, Complexity, Language, I18nContent } from './types';

export const allEntries: CommandEntry[] = [
  ...slashCommands,
  ...cliFlags,
  ...shortcuts,
  ...skills,
  ...modes,
  ...settings,
  ...envVars,
];

export const sectionEntries: Record<SectionId, CommandEntry[]> = {
  'slash-commands': slashCommands,
  'cli-flags': cliFlags,
  'shortcuts': shortcuts,
  'skills': skills,
  'modes': modes,
  'settings': settings,
  'env-vars': envVars,
};

export const ALL_TAGS = Array.from(
  new Set(allEntries.flatMap((e) => e.tags))
).sort();
