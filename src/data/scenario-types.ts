import type { Language } from './types';

export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ScenarioCategory =
  | 'prototyping'
  | 'development'
  | 'maintenance'
  | 'teamwork'
  | 'learning';

/** Scenario content is bilingual (EN/ZH-CN); all other langs fall back to EN */
export type BiText = { en: string; 'zh-CN': string };

export function bi(text: BiText, lang: Language): string {
  return text[lang === 'zh-CN' ? 'zh-CN' : 'en'];
}

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
