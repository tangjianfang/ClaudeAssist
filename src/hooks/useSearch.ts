import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { allEntries, aiEcosystem } from '../data';
import type { CommandEntry, Language } from '../data/types';
import type { AiModel } from '../data/ai-ecosystem';

/** Only these langs have command-level i18n descriptions */
const COMMAND_LANGS = new Set(['en', 'zh-CN']);

function buildCommandFuse(lang: Language) {
  const descLang = COMMAND_LANGS.has(lang) ? lang : 'en';
  return new Fuse(allEntries, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'syntax', weight: 2 },
      { name: 'aliases', weight: 2 },
      { name: `i18n.${descLang}.description`, weight: 2 },
      { name: 'tags', weight: 1 },
      { name: 'examples', weight: 1 },
      { name: 'subCategory', weight: 1 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
  });
}

function buildAiModelFuse() {
  return new Fuse(aiEcosystem.models, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'vendor', weight: 2 },
      { name: 'id', weight: 2 },
      { name: 'tags', weight: 1 },
      { name: 'category', weight: 1 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
  });
}

export function useSearch(query: string, lang: Language): CommandEntry[] {
  const commandFuse = useMemo(() => buildCommandFuse(lang), [lang]);

  return useMemo(() => {
    if (!query.trim()) return allEntries;
    return commandFuse.search(query).map((r) => r.item);
  }, [commandFuse, query]);
}

export function useAiModelSearch(query: string): AiModel[] {
  const aiModelFuse = useMemo(() => buildAiModelFuse(), []);

  return useMemo(() => {
    if (!query.trim()) return [];
    return aiModelFuse.search(query).map((r) => r.item);
  }, [aiModelFuse, query]);
}
