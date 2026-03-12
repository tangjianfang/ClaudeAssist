import { useMemo } from 'react';
import type { CommandEntry, Complexity, SectionId } from '../data/types';

export interface FilterState {
  section: SectionId | 'all';
  complexity: Complexity | 'all';
  tag: string | null;
}

export function useFilter(
  entries: CommandEntry[],
  filter: FilterState
): CommandEntry[] {
  return useMemo(() => {
    return entries.filter((e) => {
      if (filter.section !== 'all' && e.section !== filter.section) return false;
      if (filter.complexity !== 'all' && e.complexity !== filter.complexity) return false;
      if (filter.tag && !e.tags.includes(filter.tag)) return false;
      return true;
    });
  }, [entries, filter]);
}
