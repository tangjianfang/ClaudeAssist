import { Github, Star, Code, Cpu, Bot, Shield, TrendingUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../i18n';

export function ClawCodePage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Code size={24} />,
      title: t.clawcode.pythonPort,
      description: t.clawcode.pythonPortDesc,
    },
    {
      icon: <Cpu size={24} />,
      title: t.clawcode.rustPort,
      description: t.clawcode.rustPortDesc,
    },
    {
      icon: <Bot size={24} />,
      title: t.clawcode.aiAssisted,
      description: t.clawcode.aiAssistedDesc,
    },
    {
      icon: <Shield size={24} />,
      title: t.clawcode.compliance,
      description: t.clawcode.complianceDesc,
    },
    {
      icon: <TrendingUp size={24} />,
      title: t.clawcode.community,
      description: t.clawcode.communityDesc,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t.clawcode.pageTitle}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {t.clawcode.pageSubtitle}
        </p>
      </div>

      {/* GitHub Stats Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <Github size={32} className="text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                instructkr/claw-code
              </h3>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mt-1">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold">104,000+</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {t.clawcode.githubStars}
                </span>
              </div>
            </div>
          </div>
          <a
            href="https://github.com/instructkr/claw-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20"
          >
            <ExternalLink size={18} />
            {t.clawcode.visitRepo}
          </a>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Shield size={20} />
          {t.clawcode.introduction}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.clawcode.description}
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Star size={20} />
          {t.clawcode.features}
        </h2>
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg text-amber-700 dark:text-amber-300 shrink-0">
            <Star size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              {t.clawcode.community}
            </h4>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              {t.clawcode.communityDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
