import { Link } from 'react-router-dom';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import type { Report } from '../data/reports';

export function ReportsPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const [reports, setReports] = useState<Report[]>([]);

  // Load reports from sessionStorage on mount
  useEffect(() => {
    const loadReports = () => {
      const reportList: Report[] = [];
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('report:')) {
          try {
            const reportJson = sessionStorage.getItem(key);
            if (reportJson) {
              const parsed = JSON.parse(reportJson);
              const report: Report = {
                ...parsed,
                generatedAt: new Date(parsed.generatedAt),
                content: {
                  ...parsed.content,
                  metadata: {
                    ...parsed.content.metadata,
                    checkedAt: new Date(parsed.content.metadata.checkedAt),
                  },
                },
              };
              reportList.push(report);
            }
          } catch {
            // Ignore parse errors
          }
        }
      });
      // Sort by most recent first
      reportList.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
      setReports(reportList);
    };

    loadReports();
  }, []);

  const handleDeleteReport = (reportId: string) => {
    if (confirm(isZh ? '确定删除这份报告吗?' : 'Are you sure you want to delete this report?')) {
      sessionStorage.removeItem(`report:${reportId}`);
      setReports(reports.filter((r) => r.id !== reportId));
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            <FileText size={28} className="text-sky-500" />
            {isZh ? '报告库' : 'Report Library'}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {isZh
              ? '已生成的报告及决策记录'
              : 'Generated reports and decision records'}
          </p>
        </div>
        <Link
          to="/generate-report"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600"
        >
          <Plus size={18} />
          {isZh ? '生成报告' : 'Generate Report'}
        </Link>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
          <FileText className="mx-auto mb-3 text-slate-400" size={40} />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {isZh ? '暂无报告' : 'No reports yet'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
            {isZh
              ? '点击上方"生成报告"按钮创建第一份报告'
              : 'Click the "Generate Report" button above to create your first report'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="group flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-sky-700 dark:hover:bg-sky-950/20"
            >
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {isZh ? report.titleZh || report.title : report.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{report.type}</span>
                  <span>•</span>
                  <span>
                    {isZh ? '生成于' : 'Generated'}: {report.generatedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
                  </span>
                  {report.content.metadata.sources.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{isZh ? '来源' : 'Sources'}: {report.content.metadata.sources.length}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteReport(report.id);
                }}
                className="ml-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-700 opacity-0 group-hover:opacity-100"
                title={isZh ? '删除' : 'Delete'}
              >
                <Trash2 size={14} />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
