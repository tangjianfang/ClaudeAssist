import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { AiTool } from '../data/ai-ecosystem';
import { TOOL_FEATURE_LABELS } from '../data/ai-ecosystem';
import { StatusBadge } from './ui/StatusBadge';

interface ToolCardProps {
  tool: AiTool;
  isSelected: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}

export function ToolCard({ tool, isSelected, onToggle, isDisabled }: ToolCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx(
      'rounded-2xl border transition-all duration-300',
      isSelected
        ? 'border-indigo-500 bg-white dark:bg-slate-800/80 shadow-lg dark:shadow-lg dark:shadow-indigo-500/10'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/30'
    )}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{tool.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tool.vendor}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                {tool.category === 'ide' ? 'IDE' : tool.category === 'editor' ? '编辑器' : '平台'}
              </span>
              <span className={clsx(
                'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                tool.costTier === 'low' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                tool.costTier === 'medium' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              )}>
                {tool.pricing.plan}
              </span>
              {tool.china.accessible && (
                <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:text-green-300">
                  国内可用 ✓
                </span>
              )}
              <StatusBadge status={tool.status} />
            </div>
          </div>
          <button
            onClick={onToggle}
            disabled={isDisabled}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0',
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-200'
            )}
            aria-label={isSelected ? '已选择' : '选择工具'}
          >
            {isSelected ? '✓ 选中' : '选择'}
          </button>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">补全</div>
            <div className="mt-1 font-bold text-indigo-600 dark:text-indigo-300">{tool.scores.codeCompletion.toFixed(1)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">生成</div>
            <div className="mt-1 font-bold text-indigo-600 dark:text-indigo-300">{tool.scores.codeGeneration.toFixed(1)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">效率</div>
            <div className="mt-1 font-bold text-indigo-600 dark:text-indigo-300">{tool.scores.efficiency.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="px-4 sm:px-5">
        {/* Features */}
        <div className="border-b border-slate-100 dark:border-slate-700 py-3">
          <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">功能特性</div>
            <ChevronDown
              size={14}
              className={clsx('transition-transform duration-300', expanded && 'rotate-180')}
            />
          </div>
          {expanded && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tool.features.slice(0, 6).map((feature) => (
                <span key={feature} className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                  {TOOL_FEATURE_LABELS[feature] || feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Scoring details */}
        {expanded && (
          <>
            <div className="border-b border-slate-100 dark:border-slate-700 py-3">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">能力评分</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">精准度</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{tool.scores.accuracy.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">上下文</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{tool.scores.contextAwareness.toFixed(1)}/10</span>
                </div>
              </div>
            </div>

            {/* Compatible IDEs */}
            <div className="border-b border-slate-100 dark:border-slate-700 py-3">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">兼容环境</div>
              <div className="flex flex-wrap gap-1">
                {tool.compatible.map((compat) => (
                  <span key={compat} className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">
                    {compat}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="border-b border-slate-100 dark:border-slate-700 py-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-300 mb-2">✓ 优点</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                    {tool.pros.slice(0, 3).map((item) => (
                      <li key={item} className="line-clamp-2 text-[10px]">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-amber-600 dark:text-amber-300 mb-2">✗ 限制</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                    {tool.cons.slice(0, 3).map((item) => (
                      <li key={item} className="line-clamp-2 text-[10px]">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Source link */}
            <div className="py-3">
              <a
                href={tool.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                {tool.source.label}
                <ExternalLink size={11} />
              </a>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                核验: {tool.source.checkedAt}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
