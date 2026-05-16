# Important Fixes Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 2 highest-priority problems from the feature audit: restore Claude Code plugin data registration, and implement Reports page report generation + export + sharing functionality.

**Architecture:** 
1. **Plugin Data Fix** (Quick Win): Register `plugins` in `sectionEntries` so ToolDetail can load the data file.
2. **Reports Page Rewrite** (Major Feature): Convert from static landing page to dynamic report generator with templates, rendering engine, and export/share capabilities. Use TDD with tsx behavior tests.
3. **Scenario Data Enrichment** (Content): Expand `reasons` and `risks` arrays in decision-scenarios.ts to meet minimum quality standards.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind v4, tsx for tests, Router v7 hash-based navigation

---

## Task 1: Fix Claude Code Plugin Data Registration

**Files:**
- Modify: `src/data/index.ts` (add `plugins` to sectionEntries)
- Test: Verify ToolDetail renders plugins data when knowledgeId='plugins'
- Verify: `npm run check` passes, `/tools/claude-code/plugins` returns 200 and has content

### Steps

- [ ] **Step 1: Check current sectionEntries in src/data/index.ts**

Run: `grep -A 20 "sectionEntries" src/data/index.ts | head -30`

Expected: See all 7 registered sections (slash-commands, cli-flags, shortcuts, settings, skills, modes, env-vars) but NOT plugins.

- [ ] **Step 2: Import plugins data**

In `src/data/index.ts`, add import at the top:
```typescript
import { plugins } from './plugins';
```

- [ ] **Step 3: Register plugins in sectionEntries**

Locate the `export const sectionEntries` object and add plugins entry:
```typescript
export const sectionEntries: Record<SectionId, SectionEntry[]> = {
  'slash-commands': slashCommands,
  'cli-flags': cliFlags,
  // ... existing entries ...
  'plugins': plugins,  // ADD THIS LINE
};
```

- [ ] **Step 4: Verify import path is correct**

Check `src/data/plugins.ts` exists and exports `plugins` as array:
```bash
grep -E "^export const plugins" src/data/plugins.ts
```

Expected: One line showing `export const plugins: SectionEntry[] = ...`

- [ ] **Step 5: Run compilation check**

```bash
npm run build 2>&1 | grep -i "error"
```

Expected: No TypeScript errors.

- [ ] **Step 6: Run full test suite**

```bash
npm run check
```

Expected: All tests pass (test:decision, test:navigation, test:tools), no new warnings.

- [ ] **Step 7: Quick manual verify**

Open browser and navigate to `http://127.0.0.1:5173/ClaudeAssist/#/tools/claude-code/plugins`.

Expected: Page loads, shows plugins data (not empty state).

- [ ] **Step 8: Commit**

```bash
git add src/data/index.ts
git commit -m "fix: register plugins data in sectionEntries for Claude Code child page"
```

---

## Task 2: Implement Reports Page Report Generation

This is a multi-step feature. We'll use TDD: write test first, then implement.

**Files:**
- Create: `src/data/reports/index.ts` (report templates and generation logic)
- Create: `src/pages/GenerateReport.tsx` (report generator UI)
- Create: `src/components/ReportRenderer.tsx` (report rendering engine)
- Modify: `src/pages/Reports.tsx` (convert from landing page to report hub)
- Modify: `src/App.tsx` (add /reports/:reportId route)
- Create: `tests/report-generation.test.ts` (behavior test for report logic)

### Task 2a: Define Report Data Models and Generation Logic

- [ ] **Step 1: Create src/data/reports/index.ts with types and logic**

Create file with:
```typescript
export type ReportType = 'scenario' | 'tools' | 'models';

export interface ReportTemplate {
  id: string;
  type: ReportType;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  generate: (params: Record<string, any>) => Promise<Report>;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: Date;
  content: ReportContent;
  sharingUrl?: string;
}

export interface ReportContent {
  sections: ReportSection[];
  conclusion: string;
  metadata: {
    sources: string[];
    checkedAt: Date;
  };
}

export interface ReportSection {
  title: string;
  content: string;
  recommendations?: Array<{ label: string; description: string; pros: string[]; cons: string[] }>;
}

// Report generation functions
export function generateScenarioReport(scenarioId: string): Promise<Report> {
  // Implementation in next step
}

export function generateToolComparisonReport(toolIds: string[]): Promise<Report> {
  // Implementation in next step
}

export function generateModelPricingReport(): Promise<Report> {
  // Implementation in next step
}
```

- [ ] **Step 2: Write test for scenario report generation**

Create `tests/report-generation.test.ts`:
```typescript
import { test } from 'tsx';
import { generateScenarioReport } from '../src/data/reports/index';

test('generateScenarioReport returns report with 3+ sections', async () => {
  const report = await generateScenarioReport('china-low-cost-coding');
  
  if (!report) throw new Error('Report is null');
  if (report.content.sections.length < 3) {
    throw new Error(`Expected 3+ sections, got ${report.content.sections.length}`);
  }
  if (!report.content.conclusion) {
    throw new Error('Report has no conclusion');
  }
  
  console.log('✓ Scenario report generated with', report.content.sections.length, 'sections');
});

test('generateScenarioReport includes sharing URL', async () => {
  const report = await generateScenarioReport('china-low-cost-coding');
  
  if (!report.sharingUrl) {
    throw new Error('Report missing sharingUrl');
  }
  
  console.log('✓ Report has sharing URL:', report.sharingUrl);
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test -- tests/report-generation.test.ts 2>&1
```

Expected: FAIL - "generateScenarioReport is not exported" or "function not found"

- [ ] **Step 4: Implement scenario report generation**

In `src/data/reports/index.ts`, add implementation:
```typescript
export async function generateScenarioReport(scenarioId: string): Promise<Report> {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) throw new Error(`Scenario ${scenarioId} not found`);

  const recommendation = getScenarioRecommendation(scenarioId);

  const report: Report = {
    id: `scenario-${scenarioId}-${Date.now()}`,
    type: 'scenario',
    title: `${scenario.nameZh} - 推荐方案`,
    generatedAt: new Date(),
    content: {
      sections: [
        {
          title: '推荐方案总结',
          content: `针对场景 "${scenario.nameZh}"，推荐使用 ${recommendation.primary.tool} 和 ${recommendation.primary.model}。`,
          recommendations: [
            {
              label: recommendation.primary.tool,
              description: '首选方案',
              pros: recommendation.primary.reasons || [],
              cons: recommendation.primary.risks || [],
            },
            ...recommendation.alternatives.map(alt => ({
              label: alt.tool,
              description: '替代方案',
              pros: alt.reasons || [],
              cons: alt.risks || [],
            })),
          ],
        },
        {
          title: '为什么选择这个方案',
          content: (recommendation.primary.reasons || []).join('\n'),
        },
        {
          title: '潜在风险与限制',
          content: (recommendation.primary.risks || []).join('\n'),
        },
      ],
      conclusion: `基于多维度评估，${recommendation.primary.tool} 是 "${scenario.nameZh}" 场景的最优选择。`,
      metadata: {
        sources: [`scenario:${scenarioId}`, `tool:${recommendation.primary.tool}`, `model:${recommendation.primary.model}`],
        checkedAt: new Date(),
      },
    },
    sharingUrl: `${window.location.origin}/#/reports/${`scenario-${scenarioId}-${Date.now()}`}`,
  };

  return report;
}
```

- [ ] **Step 5: Run test again to verify it passes**

```bash
npm run test -- tests/report-generation.test.ts 2>&1
```

Expected: PASS - "✓ Scenario report generated with 3+ sections"

### Task 2b: Implement Report Renderer Component

- [ ] **Step 6: Create src/components/ReportRenderer.tsx**

```typescript
import { Download, Share2 } from 'lucide-react';
import type { Report } from '../data/reports';
import { useLanguage } from '../i18n';

export function ReportRenderer({ report }: { report: Report }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  const handleExport = async () => {
    const markdown = renderToMarkdown(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.md`;
    a.click();
  };

  const handleShare = async () => {
    const url = report.sharingUrl || window.location.href;
    if (navigator.share) {
      await navigator.share({ url, title: report.title });
    } else {
      navigator.clipboard.writeText(url);
      alert('URL copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {report.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isZh ? '生成时间：' : 'Generated: '} {report.generatedAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download size={16} />
            {isZh ? '导出' : 'Export'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Share2 size={16} />
            {isZh ? '分享' : 'Share'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {report.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {section.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {section.content}
            </p>
            {section.recommendations && (
              <div className="mt-4 space-y-2">
                {section.recommendations.map((rec, ridx) => (
                  <div key={ridx} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/60">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {rec.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{rec.description}</p>
                    {rec.pros.length > 0 && (
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        {rec.pros.map((pro, pidx) => (
                          <li key={pidx}>{pro}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="rounded-lg border-2 border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/20">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {isZh ? '总结' : 'Conclusion'}
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          {report.content.conclusion}
        </p>
      </div>

      {/* Metadata */}
      <div className="space-y-2 border-t pt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>{isZh ? '数据来源' : 'Sources'}: {report.content.metadata.sources.join(', ')}</p>
        <p>{isZh ? '数据检查时间' : 'Last checked'}: {report.content.metadata.checkedAt.toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function renderToMarkdown(report: Report): string {
  let md = `# ${report.title}\n\n`;
  md += `*Generated: ${report.generatedAt.toISOString()}*\n\n`;

  report.content.sections.forEach(section => {
    md += `## ${section.title}\n\n${section.content}\n\n`;
  });

  md += `## Conclusion\n\n${report.content.conclusion}\n\n`;
  md += `---\n\n**Sources:** ${report.content.metadata.sources.join(', ')}\n`;
  md += `**Last checked:** ${report.content.metadata.checkedAt.toISOString()}\n`;

  return md;
}
```

### Task 2c: Create GenerateReport Page

- [ ] **Step 7: Create src/pages/GenerateReport.tsx**

(Large component - implement minimal version first, then iterate)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenarioById } from '../data/decision-scenarios';
import { generateScenarioReport } from '../data/reports';
import { useLanguage } from '../i18n';

export function GenerateReportPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('china-low-cost-coding');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const report = await generateScenarioReport(selectedScenario);
      // Save report to localStorage temporarily
      sessionStorage.setItem(`report:${report.id}`, JSON.stringify(report));
      navigate(`/reports/${report.id}`);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {lang === 'zh-CN' ? '生成报告' : 'Generate Report'}
        </h1>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {lang === 'zh-CN' ? '选择场景' : 'Select Scenario'}
          </span>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="china-low-cost-coding">
              {lang === 'zh-CN' ? '国内低成本编码' : 'China Low-Cost Coding'}
            </option>
          </select>
        </label>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? (lang === 'zh-CN' ? '生成中...' : 'Generating...') : (lang === 'zh-CN' ? '生成报告' : 'Generate Report')}
        </button>
      </div>
    </div>
  );
}
```

### Task 2d: Update Reports.tsx and App.tsx

- [ ] **Step 8: Rewrite src/pages/Reports.tsx**

Replace current content with report hub that lists generated reports and links to generator:

```typescript
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useLanguage } from '../i18n';

export function ReportsPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-CN' || lang === 'zh-TW';

  // Load reports from sessionStorage (temporary)
  const reports = Object.keys(sessionStorage)
    .filter(key => key.startsWith('report:'))
    .map(key => JSON.parse(sessionStorage.getItem(key) || '{}'));

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isZh ? '报告库' : 'Report Library'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isZh ? '已生成和历史报告' : 'Generated and archived reports'}
          </p>
        </div>
        <Link
          to="/generate-report"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          <Plus size={16} />
          {isZh ? '生成新报告' : 'New Report'}
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <FileText className="mx-auto mb-3 text-slate-400" size={40} />
          <p className="text-slate-500 dark:text-slate-400">
            {isZh ? '暂无报告。点击上方按钮生成第一份报告。' : 'No reports yet. Click the button above to generate one.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map(report => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:hover:border-sky-700 dark:hover:bg-sky-950/20"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {report.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Update src/App.tsx with new routes**

Add routes before the catch-all route:
```typescript
// Add these imports at top
import { GenerateReportPage } from './pages/GenerateReport';
import { ReportViewerPage } from './pages/ReportViewer'; // Create this in next step

// Add these routes in the Router, before <Route path="/:sectionId" ...>
<Route path="/generate-report" element={<GenerateReportPage />} />
<Route path="/reports/:reportId" element={<ReportViewerPage />} />
```

- [ ] **Step 10: Create src/pages/ReportViewer.tsx**

This page loads a report from sessionStorage and renders it:

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ReportRenderer } from '../components/ReportRenderer';
import { EmptyState } from '../components/ui/EmptyState';
import type { Report } from '../data/reports';

export function ReportViewerPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const reportJson = sessionStorage.getItem(`report:${reportId}`);
  const report: Report | null = reportJson ? JSON.parse(reportJson) : null;

  if (!report) {
    return (
      <div className="px-4 md:px-6 py-8">
        <EmptyState
          title="报告不存在"
          description={`未找到报告 "${reportId}"`}
          action={
            <button
              onClick={() => navigate('/reports')}
              className="text-sm text-indigo-600 hover:underline"
            >
              ← 返回报告库
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
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={15} />
        返回
      </button>

      <ReportRenderer report={report} />
    </div>
  );
}
```

- [ ] **Step 11: Run full test suite**

```bash
npm run check
```

Expected: All tests pass, no new errors.

- [ ] **Step 12: Test report generation manually**

```bash
# Start dev server (should already be running)
# Navigate to http://127.0.0.1:5173/ClaudeAssist/#/generate-report
# Click "Generate Report" button
# Verify report page renders with all sections
# Test Export and Share buttons
```

- [ ] **Step 13: Commit changes**

```bash
git add src/data/reports/index.ts src/components/ReportRenderer.tsx src/pages/GenerateReport.tsx src/pages/ReportViewer.tsx src/pages/Reports.tsx src/App.tsx tests/report-generation.test.ts
git commit -m "feat: implement complete reports workflow with generation, rendering, export, and share"
```

---

## Task 3: Enrich Scenario Recommendation Data

**Files:**
- Modify: `src/data/decision-scenarios.ts` (expand reasons and risks arrays)

### Steps

- [ ] **Step 1: Review current scenario data structure**

```bash
grep -A 30 "china-low-cost-coding" src/data/decision-scenarios.ts | head -40
```

Expected: See structure with `reasons` and `risks` arrays.

- [ ] **Step 2: Check minimum standards**

For each scenario in the file:
- `primary.reasons` should have >= 3 items (currently may have 1-2)
- `primary.risks` should have >= 1 item
- `alternatives` should each have reasons and risks

- [ ] **Step 3: Expand china-low-cost-coding reasons**

In `src/data/decision-scenarios.ts`, find `china-low-cost-coding` and update:
```typescript
primary: {
  tool: 'opencode',
  model: 'deepseek-v4-flash',
  reasons: [
    'OpenCode 作为开源项目，无许可证成本，完全免费使用',
    'DeepSeek V4 Flash 性价比最优，每百万 token 仅需约 ¥0.3，是 GPT-4o 的 1/100',
    '该组合特别适合国内用户，无需代理或 VPN，速度稳定',
    '支持本地部署，可完全控制数据和隐私',
  ],
  risks: [
    '开源工具社区支持程度不如商业产品，问题解决可能需要时间',
    'DeepSeek 虽然强大，但中文微调经验少于 Claude，某些专业领域可能不如 Claude',
    '本地部署需要足够的硬件资源和运维能力',
  ],
},
```

- [ ] **Step 4: Expand alternatives**

For each alternative in the scenario, ensure 2+ reasons and 1+ risks exist.

- [ ] **Step 5: Check all scenarios**

Repeat steps 2-4 for all scenarios in the file (not just china-low-cost-coding).

- [ ] **Step 6: Run test to verify data quality**

```bash
npm run validate:data
```

Expected: No errors about missing reasons/risks.

- [ ] **Step 7: Run full test suite**

```bash
npm run check
```

Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/data/decision-scenarios.ts
git commit -m "content: enrich scenario recommendation data with detailed reasons and risks"
```

---

## Summary

This plan addresses the top 2 Important problems in ~8-10 hours total:

| Task | Time | Priority | Status |
|------|------|----------|--------|
| 1. Plugin Data Fix | 30 min | P0 | TBD |
| 2. Reports Page Rewrite | 6-8 hours | P0 | TBD |
| 3. Scenario Data Enrichment | 1-2 hours | P1 | TBD |

Once complete:
- Run `npm run check` to ensure all tests pass
- Verify `/tools/claude-code/plugins` loads data
- Verify `/generate-report` → report generation → `/reports/:id` workflow works end-to-end
- Confirm DecisionWorkbench shows rich reasoning in recommendations
