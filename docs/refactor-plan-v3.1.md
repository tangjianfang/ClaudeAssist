# 多工具知识库重构计划 V3.1

将 ClaudeAssist 重构为“AI 编程工具知识库/对比平台”。V3.1 保留 V3 的纵切片路线，但补上实施前会卡住的执行约束：校验脚本运行方式、ESLint 9 配置前置、`AiTool.status` 类型、报表 URL 恢复、nullable 字段规范、详情页路由顺序，以及后续页面/报表可复用的 UI Foundation。Claude Code、Codex CLI、Codex App、Factory Droid、Gemini CLI、OpenCode、Cursor、GitHub Copilot CLI 作为一等工具进入统一工具模型；Claude Code 现有命令/模式/设置/插件作为 tool-specific knowledge 关联到 Claude Code 详情下，仍可作为速查分类访问。

**核心修订**
- 按纵切片增量，而非分层重写。
- 严格区分 MVP 与增强项，已砍/已推迟项写入 Decisions。
- Slice A 先保证验证链可运行：确认 ESLint flat config，明确 `validate:data` 的执行方式。
- Slice B0 拆为两步：B0.1（必需，阻塞 Slice B）提供 design tokens（统一 `ca-` 前缀）+ 最小基础/报表组件 + Radix primitives 决策落地；B0.2（增量，可与 B/C/D 交错）按页面需要陆续补 Tooltip、EmptyState、FilterPanel、CompareTray、PageHeader 等。
- UI 交互 primitive 在 B0.1 起明确采用 `@radix-ui/react-*` + Tailwind 样式，不再保留"可选 Radix"的歧义说法。
- 数据迁移期保留 `ai-ecosystem.ts` 作为 re-export barrel；Slice D 后页面改用显式查询 API，不再直接读 `DATA_STORE` 内部结构。
- 报表分享走紧凑 URL query，不用 base64 JSON；页面必须能从 URL 恢复选择状态。
- 工具/模型/报表描述只维护 `en` + `zh-CN`，其他语言运行时回退英文。
- 收藏 key 暂不做破坏性迁移，仅在出现冲突时用 `cmd:` / `tool:` / `model:` 前缀。

**Steps**

Slice A: 8 个工具最小可用（先解锁用户最直接的需求）
1. 验证链前置：确认仓库是否已有可用 ESLint 9 flat config。若没有，新增最小 `eslint.config.js`，覆盖 React/TypeScript 当前规则集；若暂不补 lint，则 Slice A 首轮验收降为 `npm run build && npm run validate:data`，并在 Slice E 前补回 lint。
2. 明确数据校验脚本运行方式：优先新增 `scripts/validate-data.mjs`，避免引入 `tsx`/`ts-node`；若坚持 TypeScript，则必须新增 `tsx` devDependency 并把脚本写为 `tsx scripts/validate-data.ts`。推荐选择 `.mjs`。
3. Phase 0 来源核验：对 8 个目标工具产出 `{toolId, officialUrl, productStatus, version, source: { label, url, checkedAt }, notes}`。统一使用现有 `source.checkedAt`，不新增并行的 `verifiedAt` 字段。无法核验的工具进入 `status: 'preview' | 'unverified'`，UI 打标但不阻塞其他工具发布。
4. 修复 `src/data/ai-ecosystem.ts` 中重复的 `AiEcosystemDataStore` 接口定义，保留包含 `tools` 与 `toolCombinations` 的完整版本。
5. 扩展工具类型：新增 `AiToolStatus = 'stable' | 'preview' | 'unverified' | 'deprecated'`，并在 `AiTool` 上声明 `status?: AiToolStatus`。已有工具未显式声明时按 `stable` 展示。
6. 在 `DATA_STORE.tools` 中补齐缺失的 5 个工具：`codex-app`、`factory-droid`、`gemini-cli`、`opencode`、`github-copilot-cli`；核验已有的 `claude-code`、`codex-cli`、`cursor-ide` 字段与 source。
7. 在 `src/components/ToolCard.tsx` 显示 `status` 标记：`preview`/`unverified` 用低干扰 badge；`stable` 默认不显示，避免卡片变吵。此处临时复用 `src/index.css` 中已有的 `.badge` 工具类，待 Slice B0.1 完成后由 `StatusBadge` 组件替换（见 B0.1 step 15）。
8. 引入最小数据校验脚本：检查 `tool.id` 唯一、`toolCombinations.tool/model` 引用存在、`source.checkedAt` 是 `yyyy-MM-dd` 格式合法日期、`source.url` 非空、`status` 属于枚举。`package.json` 增加 `validate:data` 脚本，不阻塞 `build`。
9. 验证：根据第 1 步结果运行 `npm run build && npm run validate:data` 或 `npm run lint && npm run build && npm run validate:data`；`/ai-tools` 页面能看到 8 个目标工具，搜索“Codex App”“Gemini CLI”等命中工具卡。

Slice B0.1: UI Foundation 必需（阻塞 Slice B；统一视觉与报表外壳的最小集合）
10. `git mv src/components/Layout src/components/layout`，全部小写；同步更新 `App.tsx` 及任何引用 `components/Layout/*` 的 import 路径；该 step 作为独立 commit，避免与后续组件改动混在同一 diff。
11. 锁定交互 primitive 决策：本轮固定采用 `@radix-ui/react-*`（`Dialog`、`Popover`、`Tabs`、`Tooltip`、`DropdownMenu`）+ Tailwind 样式，不再保留"可选 Radix"的歧义说法；新增对应 dependencies，并约定本地基础组件统一以 Radix primitive 作为底层实现。
12. 在 `src/index.css` 通过 Tailwind v4 `@theme` 注入语义化 design tokens，统一 `ca-` 前缀：`--ca-surface`、`--ca-surface-muted`、`--ca-border-subtle`、`--ca-text`、`--ca-text-muted`、`--ca-accent`、`--ca-accent-fg`、`--ca-status-stable`、`--ca-status-preview`、`--ca-status-unverified`、`--ca-status-deprecated`、`--ca-status-success`、`--ca-status-warning`、`--ca-status-danger`、`--ca-shadow-panel`、`--ca-radius-panel`；同时定义图表调色 `--ca-chart-1` 至 `--ca-chart-6`（blue / emerald / amber / rose / slate / cyan）。
13. 新增基础组件（最小必需集，承载 Slice B/C/D 共用元素）：`src/components/ui/Button.tsx`、`IconButton.tsx`、`Badge.tsx`、`StatusBadge.tsx`、`Panel.tsx`、`Tabs.tsx`、`Popover.tsx`、`SourceLink.tsx`。
14. 新增报表 UI pattern（最小必需集，作为 Slice B 报表分享与 SVG 下载的稳定容器）：`src/components/reports/ReportShell.tsx`、`ReportActions.tsx`、`ReportSvg.tsx`。
15. 回填 Slice A：将 `ToolCard` 中临时复用的 `.badge` 状态标记替换为 `StatusBadge`；将 TopBar、Sidebar、ToolCard 中重复的按钮、badge、panel 样式逐步替换为本地 UI 组件，每次替换都保持页面行为不变。
16. 视觉风格原则：平台整体走"安静、密集、可扫描"的资料库/对比工作台风格；压低营销式大渐变 hero；状态色仅用于语义状态。Slice B 之后所有新增页面（详情页、报表页）禁止新增渐变 hero，统一通过 `PageHeader`（在 B0.2 落地后）或 `Panel`+标题占位呈现。
17. 验证（B0.1 出口条件）：在 375px / 768px / 1280px 三个断点下，顶部栏、侧边栏、工具卡、对比浮层均无横向滚动；正文与状态 badge 文本对比度抽样 ≥4.5；Radix 弹层键盘可达且 Esc 可关闭；`npm run build` 通过。

Slice B0.2: UI Foundation 增量（不阻塞，按需与 Slice B/C/D 交错完成）
18. 在 Slice B 落地报表分享时新增 `src/components/ui/Tooltip.tsx`、`EmptyState.tsx`、`Toolbar.tsx`、`SegmentedControl.tsx`，承载分享按钮提示、空态、操作条与维度切换。
19. 在 Slice B 对比浮层提取受控 `src/components/layout/CompareTray.tsx`：`selectedIds` 由父组件传入，组件本身不持有选择状态，方便 URL 状态恢复。
20. 在 Slice C 落地模型定价/能力时新增 `src/components/ui/MetricCell.tsx`、`src/components/layout/FilterPanel.tsx`，承载指标行与筛选面板。
21. 在 Slice D 落地工具详情页前提取 `src/components/layout/PageHeader.tsx`，统一详情页与列表页页眉；同步以纯视觉方式将 Sidebar 现有静态分组（Claude Code / AI Tools / Models / Reports / Maintenance）显式区段化，数据驱动版本仍由 Slice D 完成。
22. 验证（B0.2 出口条件，分批次随对应 Slice 验收）：新增组件出现在 Slice B/C/D 对应页面中；项目内未出现第二套按钮/badge/panel 风格；新页面 100% 走 `PageHeader`，无新增渐变 hero。

Slice B: 可分享报表与图表（兑现"能力对比可分享"）
23. 抽出当前 `src/pages/AiEcosystem.tsx` 的 `RadarChart` 到 `src/components/charts/RadarChart.tsx`，并接受通用 `{ label, value }[]` 输入，让工具和模型都能复用。
24. 新增 `src/components/charts/BarCompareChart.tsx`，用原生 SVG 绘制能力/价格条形对比；不引入图表库。
25. 使用 Slice B0.1 的 `ReportSvg` 作为下载目标容器；SVG 下载只序列化该容器，避免从页面中误抓第一个 SVG。
26. 在 `src/pages/AiTools.tsx` 的对比浮层增加 "复制分享链接 / 复制 Markdown / 下载 SVG" 三个按钮，操作区复用 `ReportActions`，对比浮层本体使用 B0.2 的受控 `CompareTray`。
27. 定义报表分享 URL 编码规范并在工具对比浮层落地：`#/ai-tools?r=tool-compare&v=1&ids=claude-code,cursor-ide,codex-cli&dims=codeCompletion,codeGeneration,efficiency`。不用 base64 JSON。
28. 新增 `src/utils/report-share.ts`：负责 URL 解析/序列化、Markdown 摘要生成、SVG 序列化下载；字段走白名单，未知字段忽略。
29. `AiToolsPage` mount 时必须从 URL 恢复状态：过滤未知 id，去重，最多恢复 4 个工具；未知 dims 忽略；恢复选择不改变用户已有筛选条件。
30. 报表/Markdown 必须包含来源链接、`checkedAt`、生成时间，避免脱离上下文误导。
31. 验证：选 3 个工具生成对比 → 复制链接 → 在新标签恢复选择项；手动测试未知 id、重复 id、超过 4 个 id；复制 Markdown 粘贴到外部编辑器格式正确；下载的 SVG 能被浏览器直接打开。

Slice C: 模型定价与能力披露
32. 先定义 nullable 规范：展示型"已核验但缺失/未披露"的值使用 `null`，类型显式写 `string | null` / `number | null` / `boolean | null`；真正的增强字段才用 optional。UI 必须把 `null` 显示为保守措辞，不把缺失价格显示为 0。
33. 扩展 `AiModel` 字段（在 `src/data/ai-ecosystem.ts` 内直接演进，暂不拆文件）：pricing 新增 `unit`、`cachedInputPerMTokens`、`batchInputPerMTokens`、`freeTier`、`plans`；capability 新增 `maxOutput`、`toolUse`、`structuredOutput`、`multimodalIn`、`multimodalOut`、`deployment`、`regions`、`limitations`。按第 32 步规范决定 nullable/optional。
34. 已有模型按上述字段补齐；缺失信息写 `null` 或保守措辞，不臆测。校验脚本扩展：要求 `pricing.officialUrl` 和 `source.checkedAt` 必填，价格字段单位一致，nullable 字段不允许混入空字符串。
35. 在 `src/pages/AiEcosystem.tsx` 增加"定价 / 能力披露"两个子视图（Tab 或锚点），复用 Slice B0.1 的 `Tabs`/`Panel`、B0.2 的 `MetricCell`/`FilterPanel`，以及 Slice B 的图表与分享工具，支持 `r=model-pricing` / `r=model-capability` 报表模板。
36. 模型报表 URL 复用 Slice B 规则：白名单 ids/dims，未知字段忽略，版本号为 `v=1`。
37. 验证：模型卡和报表展示价格单位、缓存价、官方链接、`checkedAt`；分享链接可恢复模型选择与维度选择；缺失字段显示保守文案而非 0 或空白。

Slice D: 架构沉淀（在字段稳定后做抽象，避免提前抽象）
38. 抽出 `src/data/tools/` 目录：`index.ts` 通过 `defineTool({...})` 汇总每个工具的注册项 + profile（命令入口、典型工作流、限制、官方链接）。
39. 同步新增显式查询 API：`getTools()`、`getToolById(id)`、`getModels()`、`getModelById(id)`、`getReportTemplate(id)`。页面从这些 API 读取数据，而不是直接读 `DATA_STORE` 内部结构。
40. `src/data/ai-ecosystem.ts` 改为兼容 barrel：继续 re-export legacy `DATA_STORE`，同时导出新查询 API；迁移期旧 imports 不立即断掉。
41. 抽出 `src/data/models/index.ts`，同样以 barrel 暴露；`AiEcosystemDataStore` 类型保留用于过渡。
42. 新增 `src/data/taxonomy.ts`：能力维度枚举 + 报表模板枚举 + 显示标签 i18n key；让图表和报表都从 taxonomy 取维度，避免字符串散落。
43. 将 `src/hooks/useSearch.ts` 升级为统一搜索，返回按 `entityType` 分组的结果（commands、tools、models、scenarios、combinations、reports）；`SearchEntity` 走适配器模式，每类数据各自实现 `toSearchEntity()`，不强行共享大接口。
44. 改造 `src/pages/SearchResults.tsx` 渲染多实体分组；保留旧 `CommandCard` / `ToolCard` 复用。
45. 新增工具详情页 `src/pages/ToolDetail.tsx` 与路由 `/tools/:toolId`，承载概览、安装入口、核心功能、命令/工作流（仅 Claude Code 当前有）、模型兼容、成本、国内可用、风险、来源、可分享摘要。
46. 工具详情页复用 Slice B0.1 的 `Panel`/`SourceLink`、B0.2 的 `PageHeader`/`MetricCell`，采用固定模板：概览、安装、能力、模型兼容、价格、国内可用、风险、来源。
47. 在 `src/App.tsx` 中将 `/tools/:toolId` 路由放在 `/:sectionId` 之前，避免被动态 section 路由吞掉。
48. 将 `src/components/layout/Sidebar.tsx` 改为数据驱动，导航配置放 `src/data/navigation.ts`；导航分组为 Claude Code、AI Tools、Models、Reports、Maintenance。
49. `src/pages/ToolCombinations.tsx` 改为引用 tool/model `id`，不再仅靠显示名称匹配；校验脚本同步加强。
50. 验证：搜索 8 个目标工具均命中工具分组；`/tools/claude-code` 等详情页可访问；`/cheatsheet`、`/slash-commands`、`/favorites`、`/scenarios` 等旧路径不退化；收藏不丢失。

Slice E: 维护体系
51. 新增维护文档 `MAINTENANCE.md`（仅当用户后续明确需要时再创建；当前默认不写新 md），暂以 README 章节形式呈现：内容更新来源、频率、校验清单、目标工具白名单、模型定价来源、报表输出规则、UI 复用规则、禁止事项。
52. 完整版定时更新提示词在 V2 草案基础上同步更新到"仅 en + zh-CN 描述""紧凑 URL 报表分享""pricing/capability 必填字段""nullable 字段规范""source.checkedAt 统一口径""复用 UI Foundation"等约束，文件位置待用户确认后再写入仓库。
53. CI/lint 集成：在 `package.json` 增加 `npm run check`。若 Slice A 已补 ESLint，则 `check = lint && build && validate:data`；若 Slice A 暂缓 lint，则必须在本 Slice 先补 ESLint flat config，再启用完整 check。

**Relevant files**
- `src/data/ai-ecosystem.ts` — Slice A 修接口、补工具、加 `AiToolStatus`；Slice C 扩展模型字段；Slice D 转为兼容 barrel。
- `scripts/validate-data.mjs` — Slice A 推荐新增，承担数据引用和 source/status 校验。
- `eslint.config.js` — Slice A/E 视当前仓库状态新增，保证 `npm run lint` 可执行。
- `src/index.css` — Slice B0.1 通过 Tailwind v4 `@theme` 注入 `ca-` 前缀的 design tokens（含 `chart-1` 至 `chart-6`）。
- `src/components/layout/` — Slice B0.1 step 10 由 `src/components/Layout/` 重命名为小写；后续在 B0.2 / D 内补充 `CompareTray.tsx`、`FilterPanel.tsx`、`PageHeader.tsx`。
- `src/components/ui/Button.tsx`、`IconButton.tsx`、`Badge.tsx`、`StatusBadge.tsx`、`Panel.tsx`、`Tabs.tsx`、`Popover.tsx`、`SourceLink.tsx` — Slice B0.1 必需集。
- `src/components/ui/Tooltip.tsx`、`EmptyState.tsx`、`Toolbar.tsx`、`SegmentedControl.tsx`、`MetricCell.tsx` — Slice B0.2 增量集，按 Slice B/C 需要补齐。
- `src/components/reports/ReportShell.tsx`、`ReportActions.tsx`、`ReportSvg.tsx` — Slice B0.1 报表外壳必需集，作为 SVG 下载稳定容器。
- `package.json` — Slice B0.1 新增 `@radix-ui/react-*` 依赖；Slice A/E 增加 `validate:data` 与最终 `check` 脚本。
- `src/data/tools/index.ts`、`src/data/models/index.ts`、`src/data/taxonomy.ts`、`src/data/navigation.ts` — Slice D 新增。
- `src/data/tool-index.ts` — Slice D 起复用 taxonomy 与 registry。
- `src/data/types.ts` — Claude Code 命令类型继续沿用，不动。
- `src/components/charts/RadarChart.tsx`、`src/components/charts/BarCompareChart.tsx` — Slice B 新增。
- `src/utils/report-share.ts` — Slice B 新增，承担 URL 编码/解析、Markdown 摘要、SVG 下载。
- `src/pages/AiTools.tsx` — Slice B0.1 替换为本地基础组件；Slice B 接入对比浮层分享和 URL 状态恢复（CompareTray 受控）；Slice D 接 ToolDetail 跳转。
- `src/pages/AiEcosystem.tsx` — Slice C 增加定价/能力 Tab；Slice D 抽 RadarChart 后简化。
- `src/pages/ToolCombinations.tsx` — Slice D 改为 id 引用。
- `src/pages/SearchResults.tsx`、`src/hooks/useSearch.ts` — Slice D 统一搜索。
- `src/pages/ToolDetail.tsx` — Slice D 新增，使用 `PageHeader`，无新增渐变 hero。
- `src/components/layout/Sidebar.tsx`、`src/App.tsx` — Slice D 路由与数据驱动导航；`/tools/:toolId` 必须放在 `/:sectionId` 前。
- `src/components/ToolCard.tsx` — Slice A 临时用 `.badge` 工具类显示 `status`；Slice B0.1 step 15 替换为 `StatusBadge`。
- `src/i18n/*.ts` — Slice B/C/D 增加导航、报表、定价、能力披露文案；工具/模型核心描述仅维护 `en` + `zh-CN`。
- `package.json` — Slice A/E 增加 `validate:data` 和最终 `check` 脚本。
- `README.md` — Slice E 维护章节。

**Verification**
1. Slice A 首轮必须能跑通 `npm run build && npm run validate:data`；若 ESLint flat config 已补齐，则同时跑 `npm run lint`。
2. Slice A：`/ai-tools` 出现 8 个目标工具；未核验工具卡带 `preview` 或 `unverified` 标记；校验脚本通过；`source.checkedAt` 统一为 `yyyy-MM-dd`。
3. Slice B0.1：`src/components/Layout` 已重命名为 `layout` 小写且 build 通过；`ca-` 前缀 design tokens 全部生效；ToolCard 状态标记已切换至 `StatusBadge`；在 375px / 768px / 1280px 三个断点下顶部栏、侧边栏、工具卡、对比浮层均无横向滚动；正文与状态 badge 文本对比度抽样 ≥4.5；Radix 弹层键盘可达，Esc 可关闭；暗色模式可读。Slice B0.2 验证随对应 Slice 出口同时检查：新增组件已落地、无第二套按钮/badge/panel 风格、新页面统一走 `PageHeader` 且无新增渐变 hero。
4. Slice B：工具对比分享链接可在新标签恢复选择；未知 id、重复 id、超过 4 个 id 都被安全处理；Markdown 摘要包含来源/时间；下载的 SVG 来自 `ReportSvg`，可直接打开。
5. Slice C：模型卡展示新增定价/能力字段；模型对比分享链接可恢复；缺失数据展示为保守措辞而非 0、空字符串或布局空洞。
6. Slice D：搜索 8 个目标工具命中工具分组；`/tools/:toolId` 详情页可访问且未被 `/:sectionId` 吞掉；`/cheatsheet`、`/slash-commands`、`/favorites`、`/scenarios` 等旧路径不退化；收藏不丢失。
7. Slice E：`npm run check` 一条命令完成 lint + build + 数据校验；定时更新提示词与当前数据约束一致。

**Decisions（含明确不做项）**
- 重构定位：多工具知识库/对比平台。
- Claude Code 不删除、不降级；速查能力作为 Claude Code 深度知识保留。
- 校验脚本推荐 `.mjs`，除非明确引入 `tsx`；不使用无法直接运行的 TS 脚本作为验收门。
- UI 基础采用 "Tailwind v4 `@theme` design tokens（`ca-` 前缀） + 本地组件 + Radix primitives"，不引入完整 UI 框架；Radix 在 B0.1 起作为本地组件底层实现，不再保留"可选"措辞。
- 不引入 Ant Design、MUI、Chakra、Bootstrap；不让项目同时存在两套 UI 风格体系。
- B0 拆为 B0.1（必需，阻塞 Slice B）与 B0.2（增量，与 B/C/D 交错），避免一次性堆 16+ 个组件造成范围蔓延。
- `CompareTray` 必须是受控组件：`selectedIds` 由父页面持有，确保 URL 状态恢复与多页面复用一致。
- Slice B 之后所有新增页面（详情页、报表页）禁止新增渐变 hero，必须使用 `PageHeader`（B0.2 完成后）或 `Panel`+标题占位。
- 页面风格定位为资料库/对比工作台：安静、密集、可扫描，避免营销页式大 hero、过度渐变和装饰性卡片。
- 迁移期 `ai-ecosystem.ts` 必须保持 re-export barrel；Slice D 后页面使用 `getTools()` / `getToolById()` / `getModels()` / `getModelById()` / `getReportTemplate()` 等 API。
- 工具/模型/报表描述只维护 `en` + `zh-CN`，其他语言运行时回退英文。
- 报表分享 URL 用紧凑 query：`r=<preset>&v=1&ids=...&dims=...`；字段白名单 + 版本号；不用 base64 JSON。
- 报表 URL 恢复必须过滤未知 id、重复 id、超限 id 和未知维度。
- MVP 报表导出范围：分享链接 + Markdown 摘要 + 单个 SVG 下载；整张报表 PNG 推迟。
- 不引入图表库（Recharts/Nivo/ECharts）；继续用原生 SVG。
- 不做收藏 key 破坏性迁移；如出现冲突，新写入使用 `cmd:` / `tool:` / `model:` 前缀，旧 key 兼容读取。
- 不引入 `pricing-snapshots.ts` / `pricingHistory`；价格变更由 git history 体现。
- 不单独建 `compatibility-matrix.ts` / `model-capability-matrix.ts`；用 `tool.supportedModelIds` 与 `model` 字段反推。
- 不引入后端、数据库、登录、用户云同步、自动爬虫或付费 API。
- Factory Droid、OpenCode、GitHub Copilot CLI 必须先完成 Phase 0 来源核验，否则进入 `preview` 或 `unverified` 状态发布。
- `null` 表示“已核验但缺失/未披露”；optional 表示“增强字段不存在或不适用于该实体”。两者不混用。

**Scheduled update prompt（待沉淀到 prompts/scheduled-content-update.prompt.md，路径以用户确认为准）**

角色：你是 ClaudeAssist 的内容更新代理，负责定期同步 AI 编程工具、模型、命令、定价、能力披露和工作流组合的最新可信信息。

目标：维持工具库、模型库（含定价与能力披露）、工具组合、Claude Code 速查、报表模板和 README 更新日志一致。

范围：`src/data/ai-ecosystem.ts`（迁移期 barrel）、`src/data/tools/`、`src/data/models/`、`src/data/taxonomy.ts`、`src/data/tool-index.ts`、`src/data/slash-commands.ts`、`src/data/cli-flags.ts`、`src/data/features.ts`、`src/data/plugins.ts`、`src/data/scenarios.ts`、`src/data/settings.ts`、`src/components/ui/`、`src/components/reports/`、`src/index.css`、`src/i18n/en.ts`、`src/i18n/zh-CN.ts`、`README.md`、`TOOL_COMBINATIONS_GUIDE.md`。

来源优先级：官方文档 > 官方 release notes > 官方 pricing 页 > 官方 GitHub 仓库 > 厂商博客；其余来源仅在官方缺失时使用并在 `source.note` 标注不确定性。不要凭印象新增能力、价格或版本。

更新步骤：
1. 核验 8 个目标工具（Claude Code、Codex CLI、Codex App、Factory Droid、Gemini CLI、OpenCode、Cursor、GitHub Copilot CLI）的 officialUrl、版本、安装入口、能力、支持模型、定价、国内可用性、source.checkedAt。无法核验的工具维持 `status: 'preview' | 'unverified'`。
2. 检查 Claude Code 斜杠命令、CLI flags、模式、settings、插件和最新特性；新增保留稳定 id，废弃用 `deprecated: true`，不删除旧条目。
3. 检查其他 7 个工具的新增命令、配置、权限、安全模式、MCP/工具调用；可速查内容写入对应 tool profile。
4. 更新 AI 模型定价：输入价、输出价、缓存价、批处理价、计费单位、币种、免费额度、订阅/企业计划、officialUrl、checkedAt。
5. 更新 AI 模型能力披露：上下文窗口、最大输出、工具调用、结构化输出、多模态、代码、推理、延迟、部署形态、区域可用性、限制说明。
6. 缺失/未披露字段按 nullable 规范写 `null`，不要写空字符串、0 或猜测值。
7. 同步工具兼容（`tool.supportedModelIds`）与工具组合（必须用存在的 tool/model id）。
8. 复核 UI Foundation：新增页面或报表必须优先复用 `src/components/ui/`、`src/components/reports/` 和 design tokens，不新增第二套按钮、badge、panel、tabs、popover 样式。
9. 复核报表模板：`tool-compare`、`model-pricing`、`model-capability`；确认维度仍存在于 `taxonomy.ts`。
10. 仅更新英文与简体中文关键描述，其他语言保持回退。
11. 更新 README 的 lastUpdated 与变更摘要。

质量规则：id 不可变；checkedAt 用 `yyyy-MM-dd`；价格必须含币种、计费单位、officialUrl；国内可用性区分 accessible/needsProxy/alternativeAvailable；评分变化注明依据；不确定信息保守措辞；报表/图表必须含来源、checkedAt、生成时间；分享 URL 只使用白名单 ids/dims 并保留 `v=1`；UI 组件必须复用 design tokens，桌面/移动/暗色模式均不能出现文字重叠、按钮溢出或不可读状态。

验证：`npm run check`（= `lint && build && validate:data`，若 lint 尚未启用则先补 ESLint flat config）。手动验证 `/ai-tools`、`/ai-ecosystem`、`/tool-combinations`、`/tools/:toolId`、Claude Code 速查页；检查桌面/移动/暗色模式下 TopBar、Sidebar、ToolCard、FilterPanel、CompareTray、ReportShell 无重叠和溢出；至少生成一份 `tool-compare` 报表和一份 `model-pricing` 报表，确认分享链接、Markdown、SVG 下载均正常。最终输出更新摘要、来源列表、未确认项、报表样例链接、验证命令结果。

**Further Considerations**
1. Slice 之间应至少各一次 commit + 手动验证，避免一次性合并大 PR 难以回滚。
2. 如果用户后续需要真正自动化更新，再规划 GitHub Actions 定时任务；当前仅靠提示词驱动 AI/人工维护。
3. PNG 报表、`pricing-snapshots`、收藏迁移、独立 capability/compatibility 文件、多语言描述扩展、完整 UI 框架迁移，视真实使用反馈再启动，不在本轮范围。
