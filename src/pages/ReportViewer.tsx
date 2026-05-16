import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ReportRenderer } from '../components/ReportRenderer';
import { EmptyState } from '../components/ui/EmptyState';
import type { Report } from '../data/reports';
import { useLanguage } from '../i18n';

export function ReportViewerPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  if (!reportId) {
    return (
      <div className="px-4 md:px-6 py-8">
        <EmptyState
          title={isZh ? '报告 ID 缺失' : 'Report ID Missing'}
          description={isZh ? '无法确定要显示的报告' : 'Unable to determine which report to display'}
          action={
            <button
              onClick={() => navigate('/reports')}
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              ← {isZh ? '返回报告库' : 'Back to Reports'}
            </button>
          }
        />
      </div>
    );
  }

  const reportJson = sessionStorage.getItem(`report:${reportId}`);
  const report: Report | null = reportJson
    ? (() => {
        try {
          const parsed = JSON.parse(reportJson);
          // Reconstruct Date objects
          return {
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
        } catch {
          return null;
        }
      })()
    : null;

  if (!report) {
    return (
      <div className="px-4 md:px-6 py-8">
        <EmptyState
          title={isZh ? '报告不存在' : 'Report Not Found'}
          description={isZh ? `未找到报告 "${reportId}"` : `Report "${reportId}" not found`}
          action={
            <button
              onClick={() => navigate('/reports')}
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              ← {isZh ? '返回报告库' : 'Back to Reports'}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors dark:hover:text-indigo-400"
      >
        <ArrowLeft size={15} />
        {isZh ? '返回' : 'Back'}
      </button>

      <ReportRenderer report={report} />
    </div>
  );
}
