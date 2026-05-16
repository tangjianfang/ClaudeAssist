import { Link } from 'react-router-dom';
import { BrainCircuit, FileText, Lightbulb, Plus, Trash2, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import type { Report, ReportType } from '../data/reports';

const TYPE_META: Record<ReportType, {
  labelZh: string;
  label: string;
  Icon: typeof FileText;
  colorClass: string;
  bgClass: string;
}> = {
  scenario: {
    labelZh: '场景推荐', label: 'Scenario', Icon: Lightbulb,
    colorClass: 'text-sky-700 dark:text-sky-300',
    bgClass: 'bg-sky-100 dark:bg-sky-900/40',
  },
  'tools-comparison': {
    labelZh: '工具对比', label: 'Tools', Icon: Wrench,
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  'models-pricing': {
    labelZh: '模型价格', label: 'Models', Icon: BrainCircuit,
    colorClass: 'text-violet-700 dark:text-violet-300',
    bgClass: 'bg-violet-100 dark:bg-violet-900/40',
  },
};

export function ReportsPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';
  const [reports, setReports] = useState<Report[]>([]);

  // Load reports from sessionStorage on mount
  useEffect(() => {
    const loadReports = () => {
      const reportList: Report[] = [];
      const invalidReports: string[] = [];
      
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('report:')) {
          try {
            const reportJson = sessionStorage.getItem(key);
            if (reportJson) {
              const parsed = JSON.parse(reportJson);
              
              // Safe date parsing
              const safeParseDate = (dateValue: unknown): Date => {
                try {
                  if (dateValue instanceof Date) return dateValue;
                  if (typeof dateValue === 'string') return new Date(dateValue);
                  if (typeof dateValue === 'number') return new Date(dateValue);
                  return new Date();
                } catch {
                  return new Date();
                }
              };

              const report: Report = {
                ...parsed,
                generatedAt: safeParseDate(parsed.generatedAt),
                content: {
                  ...parsed.content,
                  metadata: {
                    ...parsed.content?.metadata,
                    checkedAt: safeParseDate(parsed.content?.metadata?.checkedAt),
                  },
                },
              };
              reportList.push(report);
            }
          } catch (err) {
            // Track invalid reports for potential cleanup
            console.warn(`Failed to load report ${key}:`, err);
            invalidReports.push(key);
          }
        }
      });
      
      // Sort by most recent first
      reportList.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
      setReports(reportList);
      
      // Clean up invalid reports silently
      invalidReports.forEach((key) => {
        try {
          sessionStorage.removeItem(key);
        } catch {
          // Ignore cleanup errors
        }
      });
    };

    loadReports();
  }, []);

  const handleDeleteReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    const reportName = report 
      ? (isZh ? report.titleZh || report.title : report.title)
      : reportId;
    
    if (confirm(isZh 
      ? `确定删除报告 "${reportName}" 吗?此操作无法撤销。` 
      : `Are you sure you want to delete "${reportName}"? This action cannot be undone.`
    )) {
      try {
        sessionStorage.removeItem(`report:${reportId}`);
        setReports(reports.filter((r) => r.id !== reportId));
      } catch (err) {
        console.error('Failed to delete report:', err);
        alert(isZh ? '删除失败，请重试' : 'Failed to delete. Please try again.');
      }
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
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-14 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
            <FileText size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-semibold">
            {isZh ? '暂无报告' : 'No reports yet'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isZh
              ? '点击「生成报告」按钮创建第一份报告'
              : 'Click "Generate Report" above to create your first report'}
          </p>
          <Link
            to="/generate-report"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white font-medium hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600"
          >
            <Plus size={15} />
            {isZh ? '立即生成' : 'Generate now'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const meta = TYPE_META[report.type] ?? TYPE_META['scenario'];
            const TypeIcon = meta.Icon;
            return (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="group flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-sky-700"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`mt-0.5 rounded-lg p-2 shrink-0 ${meta.bgClass}`}>
                    <TypeIcon size={16} className={meta.colorClass} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {isZh ? report.titleZh || report.title : report.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.bgClass} ${meta.colorClass}`}>
                        <TypeIcon size={10} />
                        {isZh ? meta.labelZh : meta.label}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {report.generatedAt.toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
                      </span>
                      {report.content.metadata.sources.length > 0 && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {report.content.metadata.sources.length} {isZh ? '个来源' : 'sources'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteReport(report.id);
                  }}
                  className="ml-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-700 opacity-0 group-hover:opacity-100 shrink-0"
                  title={isZh ? '删除' : 'Delete'}
                >
                  <Trash2 size={14} />
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
