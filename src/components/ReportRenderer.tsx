import {
  BrainCircuit,
  CircleAlert,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Database,
  Download,
  FileText,
  Info,
  Lightbulb,
  Tag,
  TriangleAlert,
  Wrench,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import type { Report, ReportType } from '../data/reports';
import { useLanguage } from '../i18n';

// ── Report type metadata ──────────────────────────────────────────────────────

type TypeMeta = {
  labelZh: string;
  label: string;
  colorClass: string;
  bgClass: string;
  Icon: typeof FileText;
};

const REPORT_TYPE_META: Record<ReportType, TypeMeta> = {
  scenario: {
    label: 'Scenario',
    labelZh: '场景推荐',
    colorClass: 'text-sky-700 dark:text-sky-300',
    bgClass: 'bg-sky-100 dark:bg-sky-900/50',
    Icon: Lightbulb,
  },
  'tools-comparison': {
    label: 'Tools',
    labelZh: '工具对比',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/50',
    Icon: Wrench,
  },
  'models-pricing': {
    label: 'Models',
    labelZh: '模型价格',
    colorClass: 'text-violet-700 dark:text-violet-300',
    bgClass: 'bg-violet-100 dark:bg-violet-900/50',
    Icon: BrainCircuit,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSectionIcon(title: string): typeof Info {
  const t = title.toLowerCase();
  if (t.includes('risk') || t.includes('风险') || t.includes('limitation') || t.includes('限制'))
    return TriangleAlert;
  if (t.includes('why') || t.includes('为什么') || t.includes('recommend') || t.includes('推荐'))
    return Lightbulb;
  if (t.includes('tool') || t.includes('工具')) return Wrench;
  if (t.includes('model') || t.includes('模型')) return BrainCircuit;
  if (t.includes('summary') || t.includes('总结')) return FileText;
  return Info;
}

function isRiskTitle(title: string) {
  const t = title.toLowerCase();
  return t.includes('risk') || t.includes('风险') || t.includes('limitation') || t.includes('限制');
}

/**
 * Smart renderer: turns • bullet lines, **bold** markers and Key: value patterns
 * into properly styled elements instead of raw whitespace-pre-wrap text.
 */
function RichContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;

        // • or - bullet line
        if (trimmed.startsWith('•') || /^[-–] /.test(trimmed)) {
          const content = trimmed.replace(/^[•\-–]\s*/, '');
          return (
            <div key={i} className="flex items-start gap-2">
              <ChevronRight size={13} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="text-sm leading-5 text-slate-700 dark:text-slate-300">{content}</span>
            </div>
          );
        }

        // **standalone bold heading**
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
          return (
            <p key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {trimmed.slice(2, -2)}
            </p>
          );
        }

        // **Key**: value bold prefix
        const kvBoldMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
        if (kvBoldMatch) {
          return (
            <div key={i} className="flex flex-wrap gap-1.5 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{kvBoldMatch[1]}:</span>
              {kvBoldMatch[2] && (
                <span className="text-slate-600 dark:text-slate-300">{kvBoldMatch[2]}</span>
              )}
            </div>
          );
        }

        // Key: value plain (e.g., "Vendor: Anthropic")
        const kvMatch = trimmed.match(/^([A-Za-z\u4e00-\u9fa5][A-Za-z\u4e00-\u9fa5 ]{1,30}):\s*(.+)$/);
        if (kvMatch) {
          return (
            <div key={i} className="flex flex-wrap gap-1.5 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{kvMatch[1]}:</span>
              <span className="text-slate-600 dark:text-slate-300">{kvMatch[2]}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm leading-6 text-slate-700 dark:text-slate-300">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export function ReportRenderer({ report }: { report: Report }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const [copied, setCopied] = useState(false);
  const [exportInProgress, setExportInProgress] = useState<'md' | 'json' | null>(null);

  const typeMeta = REPORT_TYPE_META[report.type] ?? REPORT_TYPE_META['scenario'];
  const TypeIcon = typeMeta.Icon;

  const handleExportMarkdown = async () => {
    setExportInProgress('md');
    try {
      const markdown = renderToMarkdown(report);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
      setTimeout(() => setExportInProgress(null), 500);
    } catch (err) {
      console.error('Markdown export error:', err);
      alert(isZh ? '导出失败，请重试' : 'Export failed. Please try again.');
      setExportInProgress(null);
    }
  };

  const handleExportJSON = async () => {
    setExportInProgress('json');
    try {
      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setTimeout(() => setExportInProgress(null), 500);
    } catch (err) {
      console.error('JSON export error:', err);
      alert(isZh ? '导出失败，请重试' : 'Export failed. Please try again.');
      setExportInProgress(null);
    }
  };

  const handleCopyLink = async () => {
    if (report.sharingUrl) {
      try {
        const fullUrl = `${window.location.origin}${report.sharingUrl}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Copy to clipboard error:', err);
        alert(isZh ? '复制失败，请手动复制' : 'Copy failed. Please copy manually.');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header banner ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-sky-100 dark:border-sky-900/40 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <span className={clsx(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold mb-3',
              typeMeta.bgClass,
              typeMeta.colorClass,
            )}>
              <TypeIcon size={12} />
              {isZh ? typeMeta.labelZh : typeMeta.label}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {isZh ? report.titleZh || report.title : report.title}
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {isZh ? '生成于' : 'Generated'}: {report.generatedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleExportMarkdown}
              disabled={exportInProgress !== null}
              title={isZh ? '导出为 Markdown' : 'Export as Markdown'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download size={13} />
              {exportInProgress === 'md' ? (
                <span className="animate-pulse">{isZh ? '导出中' : 'Exporting'}</span>
              ) : 'MD'}
            </button>
            <button
              onClick={handleExportJSON}
              disabled={exportInProgress !== null}
              title={isZh ? '导出为 JSON' : 'Export as JSON'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download size={13} />
              {exportInProgress === 'json' ? (
                <span className="animate-pulse">{isZh ? '导出中' : 'Exporting'}</span>
              ) : 'JSON'}
            </button>
            <button
              onClick={handleCopyLink}
              title={isZh ? '复制分享链接' : 'Copy sharing link'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">{isZh ? '已复制' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  {isZh ? '分享' : 'Share'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Content sections ──────────────────────────────────── */}
      <div className="space-y-4">
        {report.content.sections.map((section, idx) => {
          const sectionTitle = isZh ? section.titleZh || section.title : section.title;
          const SectionIcon = getSectionIcon(sectionTitle);
          const riskSection = isRiskTitle(sectionTitle);

          return (
            <section
              key={idx}
              className={clsx(
                'rounded-2xl border p-4 sm:p-5',
                riskSection
                  ? 'border-amber-200 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50',
              )}
            >
              <h2 className={clsx(
                'flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3',
                riskSection
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-slate-500 dark:text-slate-400',
              )}>
                <SectionIcon
                  size={14}
                  className={riskSection ? 'text-amber-500' : 'text-sky-500'}
                />
                {sectionTitle}
              </h2>

              {section.content && <RichContent text={section.content} />}

              {/* Recommendation cards */}
              {section.recommendations && section.recommendations.length > 0 && (
                <div className="mt-4 space-y-3">
                  {section.recommendations.map((rec, ridx) => (
                    <div
                      key={ridx}
                      className="rounded-xl border border-sky-200 dark:border-sky-800/40 bg-sky-50 dark:bg-sky-950/20 overflow-hidden"
                    >
                      {/* Card header */}
                      <div className="px-4 py-2.5 bg-sky-100/70 dark:bg-sky-900/30 border-b border-sky-200 dark:border-sky-800/40">
                        <h3 className="font-semibold text-sm text-sky-900 dark:text-sky-100">
                          {rec.label}
                        </h3>
                        {rec.description && (
                          <p className="text-xs text-sky-700 dark:text-sky-400 mt-0.5">
                            {rec.description}
                          </p>
                        )}
                      </div>

                      {/* Pros / Cons */}
                      <div className={clsx(
                        'px-4 py-3',
                        rec.pros?.length && rec.cons?.length ? 'grid sm:grid-cols-2 gap-4' : '',
                      )}>
                        {rec.pros && rec.pros.length > 0 && (
                          <div>
                            <p className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                              <Check size={12} />
                              {isZh ? '优点' : 'Pros'}
                            </p>
                            <div className="space-y-1.5">
                              {rec.pros.map((pro, pidx) => (
                                <div key={pidx} className="flex items-start gap-2">
                                  <Check size={12} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-xs leading-5 text-slate-700 dark:text-slate-300">{pro}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {rec.cons && rec.cons.length > 0 && (
                          <div>
                            <p className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                              <CircleAlert size={12} />
                              {isZh ? '风险/限制' : 'Risks/Limitations'}
                            </p>
                            <div className="space-y-1.5">
                              {rec.cons.map((con, cidx) => (
                                <div key={cidx} className="flex items-start gap-2">
                                  <X size={12} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
                                  <span className="text-xs leading-5 text-slate-700 dark:text-slate-300">{con}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Conclusion ────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-3">
          <Lightbulb size={14} className="text-emerald-500" />
          {isZh ? '结论' : 'Conclusion'}
        </h3>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          {report.content.conclusion}
        </p>
      </div>

      {/* ── Metadata footer ───────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 px-4 py-3 grid sm:grid-cols-3 gap-3">
        <div className="flex items-start gap-2 text-xs">
          <Database size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              {isZh ? '数据来源' : 'Sources'}
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              {report.content.metadata.sources.join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <Calendar size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              {isZh ? '最后检查' : 'Last checked'}
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              {report.content.metadata.checkedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <Tag size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              {isZh ? '数据版本' : 'Data version'}
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              {report.content.metadata.dataVersion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderToMarkdown(report: Report): string {
  let md = `# ${report.title}\n\n`;
  md += `*Generated: ${report.generatedAt.toISOString()}*\n\n`;

  report.content.sections.forEach((section) => {
    md += `## ${section.title}\n\n${section.content}\n\n`;
    if (section.recommendations) {
      section.recommendations.forEach((rec) => {
        md += `### ${rec.label}\n\n`;
        if (rec.description) md += `${rec.description}\n\n`;
        if (rec.pros && rec.pros.length > 0) {
          md += `**Pros:**\n${rec.pros.map((p) => `- ${p}`).join('\n')}\n\n`;
        }
        if (rec.cons && rec.cons.length > 0) {
          md += `**Risks/Limitations:**\n${rec.cons.map((c) => `- ${c}`).join('\n')}\n\n`;
        }
      });
    }
  });

  md += `## Conclusion\n\n${report.content.conclusion}\n\n`;
  md += `---\n\n**Sources:** ${report.content.metadata.sources.join(', ')}\n`;
  md += `**Last checked:** ${report.content.metadata.checkedAt.toISOString()}\n`;
  md += `**Data version:** ${report.content.metadata.dataVersion}\n`;
  return md;
}

