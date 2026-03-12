export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ScenarioCategory =
  | 'prototyping'
  | 'development'
  | 'maintenance'
  | 'teamwork'
  | 'learning';

export interface ScenarioStep {
  /** Short title for this step */
  title: { en: string; 'zh-CN': string };
  /** Command or action to perform */
  command?: string;
  /** Description of what this step does */
  description: { en: string; 'zh-CN': string };
}

export interface ScenarioTip {
  type: 'tip' | 'warning' | 'info';
  text: { en: string; 'zh-CN': string };
}

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  title: { en: string; 'zh-CN': string };
  description: { en: string; 'zh-CN': string };
  /** IDs of CommandEntry items referenced */
  relatedCommandIds: string[];
  steps: ScenarioStep[];
  tips: ScenarioTip[];
}
