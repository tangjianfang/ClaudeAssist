# ClaudeAssist 工具重构计划 V4

> 本文取代旧 V3.1 的 Slice A-E checklist。V3.1 的主要问题是把“补字段、拆组件、加 getter、跑 lint”当成重构目标，导致 UI、输出和用户任务几乎没有变化。V4 重新把目标拉回产品本身：ClaudeAssist 要从 Claude Code 速查页，升级为 AI 编程工具决策工作台。

## 1. 重新评估

### 1.1 旧 V3.1 哪里错了

V3.1 不是完全没价值，但它把手段写成了目标：

- 组件清单太重：`Tooltip`、`Toolbar`、`SegmentedControl`、`CompareTray` 等被写成必须完成的任务，却没有先证明它们能改变用户工作流。
- 数据抽象太薄：`getTools()`、`getModels()` 只是包了一层 `DATA_STORE`，没有承载 profile、关系、推荐和来源可信度。
- 报表太像导出按钮：分享链接、Markdown、SVG 是输出形式，不是报告本身；报告应该先有结论和依据。
- UI 仍被旧页面牵引：工具卡片墙、模型卡片、底部对比抽屉仍是核心体验，新增数据被塞进次级 tab。
- 验收标准偏工程：build/lint 通过只是底线，不能证明重构成功。

### 1.2 旧实现可保留的东西

以下内容可以作为材料保留，但不能继续主导架构：

- `npm run check`：保留，并加入行为测试。
- `validate-data.mjs`：保留，但升级为语义校验。
- `Panel`、`StatusBadge`、`SourceLink`、`MetricCell`、`PageHeader`：可复用，但必须服务新页面。
- `decision-scenarios.ts` 与首页 `DecisionWorkbench`：作为 V4 第一条纵切的起点。
- `AiModel` 的 pricing/capability 字段：保留，但要变成决策表和报告依据，而不是藏在 tab 中。

### 1.3 需要解除的枷锁

这些约束不再作为硬性目标：

- 不再要求按旧 Slice A/B/C/D/E 顺序推进。
- 不再为了“UI Foundation 完整”一次性补齐组件清单。
- 不再把 Radix/Tailwind/token 决策写成产品目标。
- 不再把“所有页面必须使用某组件”作为验收标准。
- 不再把报表限定为 SVG/Markdown/链接三件套；这些只是输出渠道。
- 不再要求 `ai-ecosystem.ts` 立刻变成漂亮 barrel；迁移价值必须来自页面和校验使用。
- 不再把“工具详情页存在”视为完成；详情页必须能回答“怎么装、何时用、搭配什么、风险在哪”。

## 2. 新目标

### 2.1 产品定位

ClaudeAssist V4 是 AI 编程工具决策工作台。它帮助用户回答：

- 我在某个约束下应该用哪套工具和模型？
- 为什么选它，而不是另一个？
- 成本、风险、国内可用性、来源可信度如何？
- 如果我要分享给团队，能不能生成带结论和依据的报告？

### 2.2 核心工作流

新的主路径是：

```text
Scenario → Decision → Evidence → Report
```

含义：

1. Scenario：用户先选择场景和约束，而不是先浏览工具列表。
2. Decision：系统给首选、备选、不推荐默认方案。
3. Evidence：每个推荐带理由、成本、风险、来源和未确认项。
4. Report：输出可分享的结论型报告，而不是裸表格。

### 2.3 第一条纵切

先打通一条完整纵切：`国内可用 + 低成本 AI 编码方案`。

已经开始：

- `src/data/decision-scenarios.ts`
- `src/components/decision/DecisionWorkbench.tsx`
- `tests/decision-recommendations.test.ts`
- 首页展示首选/备选/不推荐默认方案

接下来所有 V4 工作都必须能增强这条纵切，或者新增同等完整的纵切。

## 3. 信息架构与整体布局

### 3.1 顶层布局

V4 的整体 UI 要重新设计为“决策工作台 + 产品域导航”，不再让 Claude Code 速查占据主页或默认心智。

应用骨架：

```text
TopBar: 全局搜索 / 当前数据更新时间 / 主题与辅助动作
Sidebar: 产品域导航（Decision Lab、AI Coding Tools、Models、Reports、Maintenance）
Main Workspace: 当前产品域的工作台、详情页或报告页
Context Rail: 可选右侧上下文面板，展示选择对象的摘要、风险、来源和下一步动作
```

布局原则：

- 首页默认进入 Decision Lab，不再进入 Claude Code 或 Claude Code 速查。
- Claude Code 是 AI Coding Tools 大类下的第一个工具子类，而不是产品顶层。
- Claude Code 的 slash commands、CLI flags、settings、skills、modes、plugins 都是 Claude Code 工具 profile 的子内容，同时可以保留直达路由用于兼容旧链接。
- 侧边栏不再按历史页面文件排列，而按用户任务排列：先决策，再工具，再模型，再报告，再维护。
- 旧速查页可以存在，但它们不再定义整体布局。

### 3.2 导航重组

导航按产品域组织，不按历史文件类型组织：

| 产品域 | 首批入口 | 说明 |
| --- | --- | --- |
| Decision Lab | 场景决策、组合方案、低成本/国内可用方案、企业安全方案 | 首页默认进入决策工作流。 |
| AI Coding Tools | Claude Code、Cursor、Codex CLI / Codex App、Gemini CLI、OpenCode、GitHub Copilot CLI、Factory Droid | Claude Code 是第一个工具子类，不再是主页或全站顶级域。 |
| Models | 模型决策表、价格视图、能力视图、国内可用视图 | 默认按决策列展示，而不是模型卡片。 |
| Reports | 场景推荐报告、工具对比报告、模型价格报告、能力矩阵报告 | 输出结论、依据、风险、来源和未确认项。 |
| Maintenance | 数据健康、来源核验、更新指南 | 服务数据可信度和长期维护。 |

所有 AI Coding Tools 都是结构上的 peer profiles。Claude Code 拥有更多子知识页，是因为现有资料更深，而不是因为它仍然是产品中心。

### 3.3 首页

首页不再是介绍页，也不再是 Claude Code 入口。首页是 Decision Lab 的默认工作台：

- 左侧/顶部：场景选择。
- 中部：推荐结果矩阵。
- 右侧/下方：成本、风险、国内可用性、来源 freshness、未确认项。
- “继续查看 Claude Code”只能作为 AI Coding Tools 下的工具入口或推荐结果中的工具链接出现，不能成为首页主 CTA。
- 参考资料入口保留，但降级为辅助区，不再用 Slash Commands/CLI Flags 卡片占据主要首屏。

### 3.4 AI Coding Tools 大类

AI Coding Tools 是所有工具 profile 的统一入口。Claude Code 是第一个子类，但与 Cursor、OpenCode、Gemini CLI 等同属工具集合。

该大类页面应提供：

- 工具族列表：Claude Code、Cursor、Codex、Gemini CLI、OpenCode、GitHub Copilot CLI 等。
- 场景过滤：国内低成本、企业安全、本地隐私、最快原型、多 Agent 工作流。
- 工具 profile 预览：安装、模型兼容、价格、国内可用、适合/不适合。
- 工具内知识导航：当选中 Claude Code 时，右侧或二级导航展示 Commands / Flags / Settings / Skills 等子内容。

路由策略：

- `/ai-tools`：AI Coding Tools 工作台。
- `/tools/:toolId`：完整工具 profile。
- `/tools/claude-code/commands`、`/tools/claude-code/cli-flags`、`/tools/claude-code/settings` 等：Claude Code 子知识页。
- 旧 `/slash-commands`、`/cli-flags`、`/settings` 作为兼容入口保留；视觉上必须提示它们属于 Claude Code，后续可 redirect。

Claude Code 子类的页面结构：

```text
/tools/claude-code
  Overview
  Commands
  CLI Flags
  Shortcuts
  Settings
  Skills
  Modes
  Plugins
  Workflows
  Reports
```

旧路由如 `/slash-commands`、`/cli-flags`、`/settings` 可以继续存在，但视觉上应提示它们属于 Claude Code，而不是全站顶级模块。

### 3.5 工具页

`AiToolsPage` 不再是卡片墙主导，而是三栏工具工作台：

- 左：场景和约束筛选，例如国内可用、低成本、本地隐私、企业安全、最快原型。
- 中：候选工具列表，每个候选直接显示价格、状态、核心能力、国内可用性和适合场景。
- 右：选中工具的 profile 预览，显示安装入口、常用工作流、推荐模型、风险和来源。

Profile preview 与完整详情页的边界：

| 层级 | 负责回答 | 首批内容 |
| --- | --- | --- |
| Profile preview | 这个工具现在适不适合我？ | 推荐结论、安装入口、2-3 个常用工作流、推荐模型、国内可用/风险/来源摘要。 |
| Tool detail | 我要落地使用它，需要哪些完整资料？ | 完整工作流库、命令文档、配置、兼容矩阵、价格细节、来源历史、分享报告。 |

### 3.6 模型页

`AiEcosystemPage` 不再以模型卡片和底部抽屉为核心。默认应是模型决策表：

- 关键列：输入价、输出价、缓存价、上下文、工具调用、结构化输出、国内可用、风险。
- 视图切换：编码、推理、低成本、国内可用、本地/开源、企业合规。
- 对比输出：为什么选 A、何时别选 A、替代项是什么。

### 3.7 详情页

`ToolDetailPage` 必须成为工具 profile 页面，而不是通用指标页：

- 安装入口。
- 常用命令/工作流。
- 适合与不适合。
- 推荐模型搭配。
- 价格和授权。
- 国内可用性和合规风险。
- 来源与核验时间。
- 一键生成分享摘要。

## 4. 数据架构

### 4.1 原则

数据层必须服务决策，不是只服务渲染。

必须表达：

- profile：工具/模型自己的深度信息。
- relationship：工具、模型、场景、组合之间的 id 关系。
- evidence：来源、checkedAt、未确认项、可信度。
- decision：为什么推荐、为什么不推荐。

### 4.2 文件结构

建议结构：

```text
src/data/
  legacy/
    ai-ecosystem-adapter.ts
  tools/
    registry.ts
    index.ts
  models/
    registry.ts
    index.ts
  scenarios/
    registry.ts
    index.ts
  reports/
    templates.ts
    index.ts
  relationships.ts
  taxonomy.ts
  search-registry.ts
```

迁移期可以继续从 `ai-ecosystem.ts` 读旧数据，但页面不应该直接读 `DATA_STORE`。

### 4.3 Tool Profile

`ToolProfile` 至少包含：

```ts
interface ToolProfile {
  id: string;
  name: string;
  vendor: string;
  status: 'stable' | 'preview' | 'unverified' | 'deprecated';
  installation: Array<{ label: string; command?: string; url?: string }>;
  workflows: Array<{ title: string; steps: string[]; bestFor: string[] }>;
  limitations: string[];
  supportedModelIds: string[];
  pricing: {
    summary: string;
    officialUrl: string;
  };
  china: {
    accessible: boolean;
    needsProxy: boolean;
    note: string;
  };
  source: {
    label: string;
    url: string;
    checkedAt: string;
  };
}
```

### 4.4 Model Profile

`ModelProfile` 至少包含：

```ts
interface ModelProfile {
  id: string;
  name: string;
  vendor: string;
  costTier: 'low' | 'medium' | 'high';
  pricing: {
    currency: 'USD' | 'CNY';
    inputPerMTokens: string | null;
    outputPerMTokens: string | null;
    cachedInputPerMTokens: string | null;
    batchInputPerMTokens: string | null;
    officialUrl: string;
  };
  capability: {
    contextWindow: string | null;
    maxOutput: string | null;
    toolUse: boolean | null;
    structuredOutput: boolean | null;
    multimodalIn: string[] | null;
    deployment: string[];
    limitations: string | null;
  };
  china: {
    accessible: boolean;
    needsProxy: boolean;
    risk: 'low' | 'medium' | 'high';
    note: string;
  };
  source: {
    label: string;
    url: string;
    checkedAt: string;
  };
}
```

### 4.5 Scenario Recommendation

`ScenarioRecommendation` 是 V4 的核心实体：

```ts
interface ScenarioRecommendation {
  id: string;
  title: string;
  userGoal: string;
  primary: RecommendationOption;
  alternatives: RecommendationOption[];
  avoid: RecommendationOption[];
  evidence: {
    sources: SourceRef[];
    freshness: string;
    unknowns: string[];
  };
  report: {
    templateId: 'scenario-recommendation';
    summary: string;
    decision: string;
  };
}
```

### 4.6 Query API

页面只使用这些 API：

- `getToolProfile(id)`
- `getTools(filter)`
- `getModelProfile(id)`
- `getModels(filter)`
- `getScenarioRecommendation(id)`
- `getScenarioRecommendations(filter)`
- `getReportTemplate(id)`
- `searchEntities(query, context)`

`DATA_STORE` 只允许 legacy adapter 使用。

## 5. 报表设计

### 5.1 报表必须有结论

所有报表都要包含：

- decision：推荐结论。
- rationale：理由。
- alternatives：备选。
- risks：风险。
- sources：来源。
- unknowns：未确认项。
- generatedAt：生成时间。

### 5.2 报表模板

MVP 模板：

1. `scenario-recommendation`
   - 输入：scenario id。
   - 输出：首选、备选、不推荐默认项、成本、风险、来源。

2. `tool-compare`
   - 输入：tool ids + scenario context。
   - 输出：按场景约束排序的工具对比结论。

3. `model-pricing`
   - 输入：model ids + usage profile。
   - 输出：按输入/输出/cache/batch 估算的成本结论。

4. `model-capability`
   - 输入：model ids + capability dims。
   - 输出：工具调用、结构化输出、多模态、部署限制和推荐用途。

### 5.3 分享 URL

继续使用紧凑 query，但含义升级：

```text
#/reports/scenario?v=1&scenario=china-low-cost-coding
#/reports/tool-compare?v=1&scenario=china-low-cost-coding&ids=opencode,gemini-cli
#/reports/model-pricing?v=1&usage=solo-dev&ids=deepseek-v4-flash,alibaba-qwen3-6-flash
```

URL 恢复必须过滤未知 id、重复 id、超限 id 和未知模板。

## 6. 搜索设计

搜索不再只是 Fuse 三份列表。新增 `search-registry.ts`，每类实体实现 adapter：

- commands
- tools
- models
- scenarios
- reports
- combinations

搜索结果展示应接近 command palette：

- entity type。
- title。
- short summary。
- primary action。
- secondary metadata，例如国内可用、价格、source freshness。

搜索 `国内可用`、`低成本`、`OpenCode`、`Claude` 应该能返回工具、模型、场景和报告模板，而不是只返回旧卡片。

## 7. UI 方向

### 7.1 风格

产品仍是工具型应用，不做营销页。但必须明显区别于旧界面：

- 更强的信息层级。
- 关键数值前置。
- 推荐结论前置。
- 风险和来源可见。
- 列表服务决策，而不是列表本身成为目的。

### 7.2 组件去留

保留并改造：

- `Panel`
- `StatusBadge`
- `SourceLink`
- `MetricCell`
- `PageHeader`
- `EmptyState`
- `Tooltip`

重做或替换：

- `CompareTray` → `DecisionComparePanel`，显示结论和理由，不只是表格容器。
- `SegmentedControl`：只有在场景/视图切换里真实使用时保留。
- `Toolbar`：没有具体使用场景就删除。

### 7.3 禁止项

- 禁止新增只为完成计划而存在的空组件。
- 禁止新增没有页面使用的 registry/helper。
- 禁止把重要数据藏进第二层 tab 作为完成证明。
- 禁止只改组件外壳不改用户路径。
- 禁止用 build/lint 通过替代产品验收。

## 8. 执行路线

### Phase 1: 决策纵切补强

目标：让 `china-low-cost-coding` 从首页纵切扩展成完整可分享报告。

任务：

1. 把当前 `decision-scenarios.ts` 拆到 `src/data/scenarios/registry.ts`。
2. 增加 `getScenarioRecommendations()`。
3. 新增 `src/data/reports/templates.ts` 和 `getReportTemplate()`。
4. 新增 `/reports/scenario` 页面。
5. 报告 Markdown 输出必须包含结论、理由、风险、来源、未确认项。
6. `npm run test:decision` 覆盖报告模板和 URL 恢复。

验收：

- 用户从首页 5 秒内能读到首选推荐和为什么推荐。
- 场景报告 Markdown 包含结论、至少 3 条理由、至少 1 条风险、来源和未确认项。
- 用户不进入工具详情页，也能判断该方案是否适合当前场景。
- `#/reports/scenario?v=1&scenario=china-low-cost-coding` 可恢复。
- `npm run check` 通过。

### Phase 2: 工具工作台

目标：让 `/ai-tools` 成为 AI Coding Tools 大类工作台，并让 Claude Code 成为该大类的第一个子类，而不是首页或顶层模块。

任务：

1. 重做 `/ai-tools` 布局为 AI Coding Tools 工作台：左侧工具族导航，中间工具候选/工作区，右侧 profile/context rail。
2. 工具族导航第一项固定为 Claude Code，后续为 Cursor、Codex、Gemini CLI、OpenCode、GitHub Copilot CLI、Factory Droid 等。
3. 中间候选卡片显示适合场景、价格、国内可用、状态和来源时间。
4. 右侧加入 selected tool profile preview；选中 Claude Code 时显示 Overview / Commands / CLI Flags / Settings / Skills 等二级入口。
5. `Claude Code`、`OpenCode`、`Gemini CLI` 至少有 profile preview。
6. 从工具页可进入场景报告或工具详情。

验收：

- Claude Code 出现在 AI Coding Tools 的第一子类位置，而不是首页主入口或全站顶级 Reference。
- 选择“国内低成本”后，OpenCode 成为明显首选候选。
- Gemini CLI 被标记为能力强但国内受限。
- 页面不依赖用户打开详情页才获得核心判断。

### Phase 3: 模型决策表

目标：让 `/ai-ecosystem` 默认展示价格/能力/风险决策表。

任务：

1. 默认列前置：输入价、输出价、缓存价、上下文、工具调用、国内可用、风险。
2. 增加视图：低成本、编码、推理、国内可用、本地/开源。
3. 选择模型后显示“适合/不适合/替代项”。
4. 模型价格报告接入 `model-pricing` 模板。

验收：

- 用户不需要打开比较抽屉，就能判断低成本国内模型优先级。
- 缺失字段显示保守文案，不显示 0 或空白。

### Phase 4: Profile 与关系层

目标：让数据层表达真实关系。

任务：

1. 新增 `tools/registry.ts` 与 `models/registry.ts`。
2. 新增 `relationships.ts`，所有组合使用 id。
3. 合并 `tool-index.ts` 到 `tools/index.ts`。
4. 页面不再直接读 `DATA_STORE.tools/models/toolCombinations`。
5. `validate-data.mjs` 检查跨表引用。

验收：

- 无效 tool/model/scenario/report id 会让校验失败。
- `ToolCombinations` 不再靠显示名称匹配。

### Phase 5: 搜索与导航

目标：让搜索和导航反映新产品形态。

任务：

1. `navigation.ts` 改为 Decision Lab / AI Coding Tools / Models / Reports / Maintenance。
2. 在 AI Coding Tools 下挂载 Claude Code 作为第一子类，并把 Slash Commands / CLI Flags / Shortcuts / Settings / Skills / Modes / Plugins 作为 Claude Code 的子内容或兼容直达项。
3. 新增 `search-registry.ts`。
4. SearchResults 改为 command palette 式多实体结果。
5. 搜索场景词能返回场景和报告。

验收：

- 搜索“国内可用”“低成本”“OpenCode”“Claude”均能出现跨实体结果。
- 旧速查页仍可访问，但视觉归属必须是 Claude Code 子内容，不再主导首页和导航。

## 9. 验收标准

V4 每个阶段至少满足：

1. 有行为测试先行或同步补齐。
2. `npm run check` 通过。
3. 能用一句话说明它如何增强 `Scenario → Decision → Evidence → Report`。
4. 视觉或交互上能看出不是旧卡片页换文案。
5. 没有新增无页面使用的抽象。

最终 V4 验收：

- 首页默认能完成一个工具/模型选择决策。
- Claude Code 不再是主页或顶级产品域；它是 AI Coding Tools 下的第一子类。
- `/ai-tools` 是工具工作台，不是卡片墙。
- `/ai-ecosystem` 是模型决策表，不是模型卡片墙。
- `/reports/scenario` 能分享场景推荐报告。
- 搜索能命中 scenarios/tools/models/reports。
- 数据校验能阻止无效 id 和缺来源数据。

## 10. 维护规则

- 来源优先级：官方文档 > 官方 release notes > 官方 pricing 页 > 官方 GitHub 仓库 > 厂商博客。
- 不确定内容必须写进 unknowns 或 limitations，不能装作确定。
- `checkedAt` 使用 `yyyy-MM-dd`。
- id 不可变；显示名称可以改。
- 价格和能力必须有 officialUrl。
- 组合、兼容、推荐必须用 id。
- 每次新增工具或模型，必须说明它服务哪个场景或报告。
- 每次新增 UI 组件，必须先有页面使用场景。

## 11. 当前状态

- `13bf0fc`：上一版 B0.2/D/E 工程脚手架提交。保留作材料，但不作为 V4 架构成功依据。
- `51a3a69`：V4 第一条纵切起点，新增 `china-low-cost-coding` 场景推荐与首页 DecisionWorkbench。
- 当前优先级：先补强场景报告，再改工具工作台，然后再做模型决策表。
