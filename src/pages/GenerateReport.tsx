import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
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

  const tools = getTools();

  // Set default scenario on mount
  if (scenarios.length > 0 && !selectedScenario) {
    setSelectedScenario(scenarios[0].id);
  }

  const handleGenerateScenarioReport = async () => {
    if (!selectedScenario) {
      setError(isZh ? '请选择场景' : 'Please select a scenario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await generateScenarioReport(selectedScenario);
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToolsReport = async () => {
    if (selectedTools.size === 0) {
      setError(isZh ? '请至少选择一个工具' : 'Please select at least one tool');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await generateToolComparisonReport(Array.from(selectedTools));
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateModelsReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const report = await generateModelPricingReport();
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
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

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Report Type Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {isZh ? '报告类型' : 'Report Type'}
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { value: 'scenario', label: isZh ? '场景推荐' : 'Scenario Recommendation' },
            { value: 'tools', label: isZh ? '工具对比' : 'Tool Comparison' },
            { value: 'models', label: isZh ? '模型价格' : 'Model Pricing' },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setReportType(type.value as typeof reportType);
                setError(null);
              }}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                reportType === type.value
                  ? 'border-sky-500 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-950/30 dark:text-sky-300'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {type.label}
            </button>
          ))}
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
