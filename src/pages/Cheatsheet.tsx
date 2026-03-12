import { Printer } from 'lucide-react';
import { useLanguage } from '../i18n';
import { allEntries } from '../data';
import { ComplexityBadge } from '../components/ui/ComplexityBadge';
import { CopyButton } from '../components/ui/CopyButton';

const CHEATSHEET_IDS = [
  'init', 'help', 'clear', 'compact', 'memory', 'config', 'model', 'plan',
  'diff', 'copy', 'doctor', 'logout', 'login',
  'flag-print', 'flag-continue', 'flag-model', 'flag-append-system-prompt',
  'flag-permission-mode', 'flag-max-turns', 'flag-dangerously-skip-permissions',
  'shortcut-ctrl-c', 'shortcut-ctrl-d', 'shortcut-ctrl-l', 'shortcut-esc-esc',
  'shortcut-shift-tab', 'shortcut-backslash-enter', 'prefix-slash', 'prefix-exclamation', 'prefix-at',
  'mode-plan', 'mode-print', 'mode-fast',
  'skill-simplify', 'skill-batch',
];

export function CheatsheetPage() {
  const { lang, t } = useLanguage();

  const entries = CHEATSHEET_IDS
    .map((id) => allEntries.find((e) => e.id === id))
    .filter(Boolean) as typeof allEntries;

  const groups = new Map<string, typeof entries>();
  entries.forEach((e) => {
    const sec = t.sections[e.section];
    if (!groups.has(sec)) groups.set(sec, []);
    groups.get(sec)!.push(e);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.cheatsheetTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.cheatsheetSubtitle}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Printer size={14} />
          {t.printBtn}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {Array.from(groups.entries()).map(([section, sectionEntries]) => (
          <section key={section}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">
              {section}
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sectionEntries.map((entry) => (
                <div key={entry.id} className="py-3 flex items-start gap-4">
                  <div className="shrink-0 w-56">
                    <code className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {entry.syntax}
                    </code>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {(entry.i18n[lang === 'zh-CN' ? 'zh-CN' : 'en']).description}
                    </p>
                    {entry.examples[0] && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <code className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 rounded px-2 py-0.5 flex-1 truncate print:hidden">
                          {entry.examples[0]}
                        </code>
                        <CopyButton text={entry.examples[0]} className="print:hidden" />
                      </div>
                    )}
                  </div>
                  <ComplexityBadge level={entry.complexity} className="shrink-0" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 print:block">
        ClaudeAssist — {t.footer} — {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
