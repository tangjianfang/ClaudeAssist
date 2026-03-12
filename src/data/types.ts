export type Complexity = 'beginner' | 'intermediate' | 'advanced';

export type SectionId =
  | 'slash-commands'
  | 'cli-flags'
  | 'shortcuts'
  | 'skills'
  | 'modes'
  | 'settings'
  | 'env-vars';

export interface I18nContent {
  description: string;
  notes?: string;
}

export interface CommandEntry {
  id: string;
  name: string;
  syntax: string;
  section: SectionId;
  subCategory: string;
  complexity: Complexity;
  tags: string[];
  aliases?: string[];
  deprecated?: boolean;
  examples: string[];
  i18n: {
    en: I18nContent;
    'zh-CN': I18nContent;
  };
  addedIn?: string;
}

export type Language =
  | 'en'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko'
  | 'fr'
  | 'de'
  | 'es'
  | 'pt'
  | 'ru'
  | 'it'
  | 'nl'
  | 'tr';

/** Languages that have command-level i18n descriptions */
export type CommandLang = 'en' | 'zh-CN';
