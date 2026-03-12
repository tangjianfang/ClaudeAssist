import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { allEntries } from '../data';
import type { CommandEntry, Language } from '../data/types';

/** Only these langs have command-level i18n descriptions */
const COMMAND_LANGS = new Set(['en', 'zh-CN']);

function buildFuse(lang: Language) {
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

export function useSearch(query: string, lang: Language): CommandEntry[] {
  const fuse = useMemo(() => buildFuse(lang), [lang]);

  return useMemo(() => {
    if (!query.trim()) return allEntries;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query]);
}
