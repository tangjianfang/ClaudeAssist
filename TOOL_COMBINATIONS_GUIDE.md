# 📋 AI 工具与组合功能说明

## 🎯 功能概述

本更新为 ClaudeAssist 添加了全面的 **AI 编码工具对比** 和 **模型+工具组合推荐** 功能，补充了现有的模型能力对比。

### 新增页面

#### 1. **AI 工具对比页面** (`/ai-tools`)
- 📱 展示 7 款主流 AI 编码工具
- 🔍 多维度筛选（工具类型、价格、国内可用性、评分）
- ⚡ 工具卡片设计（快速查看 vs 展开详情）
- 🔀 最多选择 4 款工具进行并排对比
- 📊 对比表格显示（评分、价格、国内可用性）

#### 2. **工具组合推荐页面** (`/tool-combinations`)
- 🎯 6 个场景驱动的模型+工具最优组合
- 🏃 开发速度维度（快速/中等/稳妥）
- 📚 学习难度维度（简单/中等/陡峭）
- 💰 成本范围维度（免费/低/中/高）
- ⚠️ 风险分析和应对方案
- 🌍 每个组合的国内可用性评估

## 📊 数据结构

### 新增数据模型

```typescript
// AI 工具定义
interface AiTool {
  id: string;
  name: string;
  vendor: string;
  category: 'ide' | 'editor' | 'platform' | 'specialized' | 'workflow';
  version: string;
  compatible: string[]; // 兼容的 IDE/编辑器
  costTier: 'low' | 'medium' | 'high';
  pricing: { ... };
  features: AiToolFeature[];
  scores: {
    codeCompletion: number;    // 代码补全
    codeGeneration: number;    // 代码生成
    efficiency: number;         // 工作效率
    accuracy: number;           // 精准度
    contextAwareness: number;  // 上下文理解
  };
  china: {
    accessible: boolean;
    needsProxy: boolean;
    alternativeAvailable: boolean;
    note: string;
  };
  tags: string[];
  pros: string[];
  cons: string[];
  source: { ... };
}

// 工具+模型组合推荐
interface AiToolCombination {
  id: string;
  name: string;
  scenario: string;                    // 适用场景
  model: string;                       // 推荐的大模型
  tool: string;                        // 推荐的编码工具
  complementaryTools?: string[];       // 辅助工具
  totalMonthlyCost: string;           // 月度成本
  developmentSpeed: 'fast' | 'medium' | 'slow';
  learningCurve: 'easy' | 'medium' | 'hard';
  supportLevel: 'enterprise' | 'community' | 'limited';
  pros: string[];
  cons: string[];
  bestFor: string[];                  // 最适合的场景
  riskFactors: string[];              // 风险因素
  setupTime: string;                  // 启动时间
}
```

## 🛠️ 支持的 AI 编码工具

| 工具 | 厂商 | 类型 | 价格 | 国内可用 |
|------|------|------|------|---------|
| GitHub Copilot | GitHub/OpenAI | 编辑器 | ¥/月 | ✗ 需代理 |
| Claude Code | Anthropic | 平台 | $20/月 | ✗ 需代理 |
| Cursor IDE | Cursor | IDE | $20/月 | ✗ 需代理 |
| JetBrains AI Assistant | JetBrains | IDE | 包含在IDE中 | ✓ 可用 |
| Tabnine | Tabnine | 编辑器 | 免费/15/月 | ✓ 可用 |
| Amazon CodeWhisperer | AWS | 编辑器 | 免费/$99/年 | ✗ 需代理 |
| Cline | 开源社区 | 编辑器扩展 | 免费 | ✓ 可用 |

## 🎯 推荐组合场景

### 1. **快速迭代初创** ⚡
- **模型**: GPT-4.5
- **工具**: GitHub Copilot
- **成本**: $30-40/月
- **适合**: 初创技术团队、开源项目、CRUD 快速开发
- **优点**: 最佳补全体验、无缝集成、生态成熟
- **风险**: 国内网络受限、隐私敏感

### 2. **高质量代码生成** 🎨
- **模型**: Claude 3.5 Sonnet
- **工具**: Cursor IDE
- **成本**: $40-60/月
- **适合**: 专业开发团队、复杂重构、算法设计
- **优点**: Claude 最强推理、Cursor AI原生设计
- **风险**: 国内访问受限、学习曲线较陡

### 3. **国内企业合规** 🛡️
- **模型**: 阿里 Qwen Max / 百度 ERNIE
- **工具**: JetBrains AI Assistant
- **成本**: ¥300-800/月
- **适合**: 国内大型企业、政府和金融机构
- **优点**: 数据不出境、国内支持、IDE集成好
- **风险**: 模型能力略低、生态工具少

### 4. **隐私优先开发** 🔐
- **模型**: 本地开源模型 (Starcoder/Deepseek-Coder)
- **工具**: Tabnine Free
- **成本**: $0-15/月
- **适合**: 政府/军事项目、金融核心系统、隐私敏感场景
- **优点**: 完整隐私保护、离线工作、成本极低
- **风险**: 代码质量较低、性能不足

### 5. **学生和学习者** 📚
- **模型**: Claude 3.5 Sonnet (免费/Pro)
- **工具**: Claude Code (Web UI)
- **成本**: 免费或 $20/月
- **适合**: 编程学生、算法学习、快速原型
- **优点**: 无需安装、实时执行、优秀教学
- **风险**: 非本地开发、项目管理能力弱

### 6. **自动化任务编排** 🤖
- **模型**: GLM-5.1
- **工具**: Cline (VSCode 扩展)
- **成本**: ¥200-500/月
- **适合**: DevOps 自动化、批量迁移、项目脚手架
- **优点**: Cline 智能体能力强、国内数据流通方便
- **风险**: 系统权限风险、需人工验证

## 🎓 如何选择最优组合

### 第一步：确定优先级
- 💨 **开发速度** > 成本 > 学习时间？→ 选择快速组合（Copilot + GPT-4.5）
- 🎯 **代码质量** > 成本 > 学习时间？→ 选择高质量组合（Claude + Cursor）
- 🛡️ **安全合规** > 性能 > 其他？→ 选择国内合规组合（Qwen + JetBrains）
- 🔐 **隐私保护** > 所有其他？→ 选择隐私组合（本地模型 + Tabnine）

### 第二步：检查国内可用性
- ✓ 项目在国内？是否允许代理/海外访问？
- ✓ 国内企业？→ 优先考虑国内 IDE（JetBrains）
- ✓ 政府/金融？→ 必须本地部署或国内云厂商

### 第三步：评估学习成本
- 简单上手（30 分钟）：GitHub Copilot、Claude Code
- 中等难度（1-2 小时）：Cursor IDE、JetBrains AI
- 高难度（2-3 小时）：Cline + 智能体框架

### 第四步：成本核算
- 个人开发：优先免费/低成本方案
- 小团队（2-5人）：<$20/人/月
- 中等团队（5-20人）：<$15/人/月
- 大团队（>20人）：需企业版议价

## 🔧 API 使用

### 在代码中使用工具和组合数据

```typescript
import { DATA_STORE, getToolById, getCombinationsForTool } from './data/ai-ecosystem';
import { filterTools, getRecommendedTools, getToolCombinations } from './data/tool-index';

// 获取单个工具
const copilot = getToolById('github-copilot-individual');

// 按条件筛选工具
const enterpriseTools = filterTools({
  costTier: 'medium',
  chinaAccessible: true
});

// 获取推荐工具
const beginnerTools = getRecommendedTools({
  useCase: 'beginners',
  maxCost: 'low',
  needsChina: true
});

// 获取工具的推荐组合
const copilotCombos = getToolCombinations('github-copilot-individual');
```

## 📈 数据更新信息

| 部分 | 记录数 | 最后更新 | 数据来源 |
|------|--------|---------|---------|
| AI 工具 | 7 款 | 2026-05-16 | 官方网站核实 |
| 工具组合 | 6 个 | 2026-05-16 | 社区实践总结 |

## 🚀 后续计划

- [ ] 添加更多工具（Windsurf、Continue 等）
- [ ] 工具评测表单（用户可提交自己的评测）
- [ ] 组合对比功能（对比两个组合的差异）
- [ ] 国内替代品推荐（每款海外工具建议国内替代）
- [ ] 技能树选择器（根据技能等级推荐组合）
- [ ] 工具集成指南（快速启动手册）

## 📞 反馈

如发现数据不准确或有新工具建议，欢迎提交 Issue 或 PR。
