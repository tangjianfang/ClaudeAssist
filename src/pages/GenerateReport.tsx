import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, CircleAlert, CircleCheck, Lightbulb, Loader, X, Wrench } from 'lucide-react';
import { generateScenarioReport, generateToolComparisonReport, generateModelPricingReport } from '../data/reports';
import { scenarios } from '../data/scenarios';
import { getTools } from '../data/tools/index';
import { useLanguage } from '../i18n';
import type { Scenario } from '../data/scenario-types';

export function GenerateReportPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  const [reportType, setReportType] = useState<'scenario' | 'tools' | 'models'>('scenario');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tools = getTools();

  // Set default scenario on mount
  if (scenarios.length > 0 && !selectedScenario) {
    setSelectedScenario(scenarios[0].id);
  }

  const clearFeedback = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleGenerateScenarioReport = async () => {
    clearFeedback();

    if (!selectedScenario) {
      setError(
        isZh
          ? '请选择场景。选择一个您想了解的决策场景。'
          : 'Please select a scenario. Choose a decision scenario you want to explore.'
      );
      return;
    }

    setLoading(true);

    try {
      const report = await generateScenarioReport(selectedScenario);
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      setSuccessMessage(isZh ? '报告生成成功！' : 'Report generated successfully!');
      // Brief delay to show success message before navigation
      setTimeout(() => navigate(`/reports/${report.id}`), 600);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      const userFriendlyError = isZh
        ? `无法生成报告: ${errorMsg}。请检查您的选择或重试。`
        : `Failed to generate report: ${errorMsg}. Please check your selection and try again.`;
      setError(userFriendlyError);
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToolsReport = async () => {
    clearFeedback();

    if (selectedTools.size === 0) {
      setError(
        isZh
          ? '请至少选择一个工具。选择 2 个或更多工具进行对比效果更佳。'
          : 'Please select at least one tool. Comparing 2 or more tools works best.'
      );
      return;
    }

    setLoading(true);

    try {
      const report = await generateToolComparisonReport(Array.from(selectedTools));
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      setSuccessMessage(isZh ? '报告生成成功！' : 'Report generated successfully!');
      setTimeout(() => navigate(`/reports/${report.id}`), 600);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      const userFriendlyError = isZh
        ? `无法生成报告: ${errorMsg}。请确保选择的工具有效。`
        : `Failed to generate report: ${errorMsg}. Please ensure selected tools are valid.`;
      setError(userFriendlyError);
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateModelsReport = async () => {
    clearFeedback();
    setLoading(true);

    try {
      const report = await generateModelPricingReport();
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      setSuccessMessage(isZh ? '报告生成成功！' : 'Report generated successfully!');
      setTimeout(() => navigate(`/reports/${report.id}`), 600);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      const userFriendlyError = isZh
        ? `无法生成报告: ${errorMsg}。请检查数据连接后重试。`
        : `Failed to generate report: ${errorMsg}. Please check data connection and try again.`;
      setError(userFriendlyError);
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTool = (toolId: string) => {
    const newSelected = new Set(selectedTools);
    if (newSelected.has(toolId)) {
      newSelected.delete(toolId);
    } else {
      newSelected.add(toolId);
    }
    setSelectedTools(newSelected);
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {isZh ? '生成报告' : 'Generate Report'}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {isZh
            ? '选择报告类型并配置参数以生成定制报告'
            : 'Select a report type and configure parameters to generate a customized report'}
        </p>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <CircleAlert size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{isZh ? '生成失败' : 'Generation Failed'}</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button
              onClick={clearFeedback}
              className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
              title={isZh ? '关闭' : 'Close'}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-start gap-3">
            <CircleCheck size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Type Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {isZh ? '报告类型' : 'Report Type'}
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: 'scenario',
              label: isZh ? '场景推荐' : 'Scenario',
              desc: isZh ? '针对具体使用场景推荐最佳工具组合' : 'Best tools for your workflow',
              Icon: Lightbulb,
              activeColor: 'border-sky-500 bg-sky-50 dark:border-sky-600 dark:bg-sky-950/30',
              iconColor: 'text-sky-600 dark:text-sky-400',
            },
            {
              value: 'tools',
              label: isZh ? '工具对比' : 'Tools',
              desc: isZh ? '多工具功能与价格横向对比' : 'Compare features & pricing',
              Icon: Wrench,
              activeColor: 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              value: 'models',
              label: isZh ? '模型价格' : 'Models',
              desc: isZh ? '所有 AI 模型价格与可用性一览' : 'All AI models pricing sheet',
              Icon: BrainCircuit,
              activeColor: 'border-violet-500 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/30',
              iconColor: 'text-violet-600 dark:text-violet-400',
            },
          ].map((type) => {
            const selected = reportType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => {
                  setReportType(type.value as typeof reportType);
                  setError(null);
                }}
                className={`rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                  selected
                    ? type.activeColor
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <type.Icon size={18} className={`mb-2 ${selected ? type.iconColor : 'text-slate-400 dark:text-slate-500'}`} />
                <p className={`text-sm font-semibold ${selected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                  {type.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{type.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Selection */}
      {reportType === 'scenario' && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/30">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isZh ? '选择场景' : 'Select Scenario'}
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="" disabled>
              {isZh ? '-- 请选择 --' : '-- Select --'}
            </option>
            {scenarios.map((scenario: Scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {isZh ? scenario.title['zh-CN'] : scenario.title.en}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isZh
              ? '选择一个场景以生成针对性的推荐报告'
              : 'Choose a scenario to generate a targeted recommendation report'}
          </p>
        </div>
      )}

      {/* Tools Selection */}
      {reportType === 'tools' && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/30">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isZh ? '选择工具（可多选）' : 'Select Tools (Multiple Selection)'}
          </label>
          <div className="grid gap-2 md:grid-cols-2">
            {tools.map((tool) => (
              <label key={tool.id} className="flex items-center gap-2 rounded-lg border border-slate-300 p-3 hover:bg-white dark:border-slate-600 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedTools.has(tool.id)}
                  onChange={() => handleToggleTool(tool.id)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isZh ? `已选择 ${selectedTools.size} 个工具` : `${selectedTools.size} tools selected`}
          </p>
        </div>
      )}

      {/* Models Selection */}
      {reportType === 'models' && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/30">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isZh
              ? '将生成包含所有 AI 模型的价格和可用性对比报告'
              : 'This will generate a comprehensive report comparing pricing and availability of all AI models'}
          </p>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={
            reportType === 'scenario'
              ? handleGenerateScenarioReport
              : reportType === 'tools'
                ? handleGenerateToolsReport
                : handleGenerateModelsReport
          }
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-white font-medium hover:bg-sky-700 disabled:opacity-50 dark:bg-sky-700 dark:hover:bg-sky-600"
        >
          {loading && <Loader size={16} className="animate-spin" />}
          {loading ? (isZh ? '生成中...' : 'Generating...') : isZh ? '生成报告' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
}
