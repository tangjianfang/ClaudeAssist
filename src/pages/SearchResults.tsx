import { useLanguage } from '../i18n';
import { CommandCard } from '../components/CommandCard';
import type { CommandEntry } from '../data/types';
import type { AiModel, AiTool } from '../data/ai-ecosystem';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: CommandEntry[];
  aiResults: AiModel[];
  toolResults?: AiTool[];
  query: string;
}

export function SearchResults({ results, aiResults, toolResults = [], query }: SearchResultsProps) {
  const { t } = useLanguage();
  const totalResults = results.length + aiResults.length + toolResults.length;

  if (totalResults === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
        <p className="text-slate-400 font-medium">{t.noResults}</p>
        <p className="text-sm text-slate-400">{t.noResultsHint}</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-4 space-y-8">
      {/* Summary */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t.filter.filterResults(totalResults)}{' '}
        {query && (
          <span>
            {' '}for <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span>
          </span>
        )}
      </p>

      {/* AI Models Section */}
      {aiResults.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            AI 模型 ({aiResults.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {aiResults.map((model) => (
              <a
                key={model.id}
                href="#/ai-ecosystem"
                className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{model.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{model.vendor}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 shrink-0" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {model.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  {model.contextWindow} · {model.pricing.currency} {model.pricing.inputPerMTokens}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* AI Tools Section */}
      {toolResults.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            AI 编码工具 ({toolResults.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {toolResults.map((tool) => (
              <a
                key={tool.id}
                href={`#/tools/${tool.id}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{tool.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tool.vendor} · {tool.category}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 shrink-0" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tool.features.slice(0, 4).map((f) => (
                    <span key={f} className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  {tool.pricing.plan}
                  {tool.china.accessible && (
                    <span className="ml-2 text-emerald-600 dark:text-emerald-400">✓ 国内可用</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Commands Section */}
      {results.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            命令和功能 ({results.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {results.map((entry) => (
              <CommandCard
                key={entry.id}
                entry={entry}
                activeTag={null}
                onTagClick={() => undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
