import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Report } from '../data/reports';
import { useLanguage } from '../i18n';

export function ReportRenderer({ report }: { report: Report }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const [copied, setCopied] = useState(false);

  const handleExportMarkdown = async () => {
    const markdown = renderToMarkdown(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    if (report.sharingUrl) {
      const fullUrl = `${window.location.origin}${report.sharingUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {isZh ? report.titleZh || report.title : report.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isZh ? '生成于' : 'Generated'}: {report.generatedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportMarkdown}
            title={isZh ? '导出为 Markdown' : 'Export as Markdown'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download size={16} />
            {isZh ? 'Markdown' : 'MD'}
          </button>
          <button
            onClick={handleExportJSON}
            title={isZh ? '导出为 JSON' : 'Export as JSON'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download size={16} />
            JSON
          </button>
          <button
            onClick={handleCopyLink}
            title={isZh ? '复制分享链接' : 'Copy sharing link'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check size={16} />
                {isZh ? '已复制' : 'Copied'}
              </>
            ) : (
              <>
                <Copy size={16} />
                {isZh ? '分享' : 'Share'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        {report.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isZh ? section.titleZh || section.title : section.title}
            </h2>

            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {section.content}
            </div>

            {section.recommendations && section.recommendations.length > 0 && (
              <div className="mt-4 space-y-3">
                {section.recommendations.map((rec, ridx) => (
                  <div
                    key={ridx}
                    className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {rec.label}
                    </h3>
                    {rec.description && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {rec.description}
                      </p>
                    )}

                    {rec.pros && rec.pros.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                          {isZh ? '优点' : 'Pros'}:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          {rec.pros.map((pro, pidx) => (
                            <li key={pidx}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rec.cons && rec.cons.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                          {isZh ? '风险/限制' : 'Risks/Limitations'}:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          {rec.cons.map((con, cidx) => (
                            <li key={cidx}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="rounded-lg border-2 border-sky-200 bg-sky-50 p-6 dark:border-sky-900 dark:bg-sky-950/20">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">
          {isZh ? '结论' : 'Conclusion'}
        </h3>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          {report.content.conclusion}
        </p>
      </div>

      {/* Metadata Footer */}
      <div className="space-y-2 border-t pt-6 text-xs text-slate-500 dark:text-slate-400">
        <p>
          <strong>{isZh ? '数据来源' : 'Sources'}:</strong> {report.content.metadata.sources.join(', ')}
        </p>
        <p>
          <strong>{isZh ? '最后检查' : 'Last checked'}:</strong>{' '}
          {report.content.metadata.checkedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
        </p>
        <p>
          <strong>{isZh ? '数据版本' : 'Data version'}:</strong> {report.content.metadata.dataVersion}
        </p>
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
