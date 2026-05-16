import { Link } from 'react-router-dom';
import { DatabaseZap, Puzzle, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../i18n';

const MAINTENANCE_LINKS = [
  {
    id: 'data-health',
    Icon: Sparkles,
    titleZh: '数据健康',
    titleEn: 'Data Health',
    summaryZh: '检查功能、模型、工具和场景数据是否可追踪、可验证。',
    summaryEn: 'Review whether feature, model, tool, and scenario data remains traceable and verifiable.',
    path: '/features',
  },
  {
    id: 'source-review',
    Icon: Puzzle,
    titleZh: '来源核验',
    titleEn: 'Source Review',
    summaryZh: '维护插件、来源和资料入口，减少过期信息进入决策结果。',
    summaryEn: 'Maintain plugin, source, and reference entry points so stale information stays out of decisions.',
    path: '/plugins',
  },
  {
    id: 'favorites',
    Icon: Star,
    titleZh: '收藏',
    titleEn: 'Favorites',
    summaryZh: '查看你标记过的命令和资料，用作日常维护清单。',
    summaryEn: 'Review saved commands and references as a personal maintenance list.',
    path: '/favorites',
  },
];

export function MaintenancePage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <DatabaseZap size={22} className="text-emerald-500" />
          {isZh ? '数据维护' : 'Data Maintenance'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isZh
            ? '把数据健康、来源核验和个人收藏收束到一个维护入口，避免侧边栏出现语义不一致的跳转。'
            : 'A focused maintenance entry for data health, source review, and saved references, keeping sidebar destinations semantically clear.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MAINTENANCE_LINKS.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <link.Icon size={18} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isZh ? link.titleZh : link.titleEn}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isZh ? link.summaryZh : link.summaryEn}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
