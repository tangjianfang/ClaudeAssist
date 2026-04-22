# ClaudeAssist

**Claude Code 命令速查手册** · 面向新手和专家的快速参考指南

[![Deploy](https://img.shields.io/github/actions/workflow/status/tangjianfang/ClaudeAssist/deploy.yml?style=flat-square)](https://github.com/tangjianfang/ClaudeAssist/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.2.0-green.svg?style=flat-square)](https://github.com/tangjianfang/ClaudeAssist/releases)

🌐 **在线访问**: [https://tangjianfang.github.io/ClaudeAssist/](https://tangjianfang.github.io/ClaudeAssist/)

---

## 📖 简介

ClaudeAssist 是一个功能完整的 **Claude Code 命令速查网站**，提供所有斜杠命令、CLI 参数、键盘快捷键、设置选项、环境变量的 searchable 参考手册。

### ✨ 主要特性

- 🔍 **完全可搜索** - 快速查找任何 Claude Code 命令和参数
- 🌐 **双语支持** - 英文 / 中文 (EN / 简体中文)
- 📱 **响应式设计** - 完美适配桌面、平板、手机
- 🌙 **暗色模式** - 支持系统暗色模式偏好
- ⭐ **收藏功能** - 收藏常用命令，方便快速访问
- 📄 **速查表** - 可打印 / 保存为 PDF 的核心命令速查表
- 🎯 **应用场景** - 真实工作流指南，告诉你何时使用哪些命令

---

## 🚀 快速开始

### 在线使用

直接访问部署好的网站：[https://tangjianfang.github.io/ClaudeAssist/](https://tangjianfang.github.io/ClaudeAssist/)

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/tangjianfang/ClaudeAssist.git
cd ClaudeAssist

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

构建产物将输出到 `dist/` 目录。

---

## 📁 项目结构

```
ClaudeAssist/
├── src/
│   ├── components/         # React 组件
│   │   ├── Layout/         # 布局组件 (Sidebar, TopBar)
│   │   ├── ui/             # UI 基础组件
│   │   └── CommandCard.tsx # 命令卡片组件
│   ├── data/               # 数据文件
│   │   ├── features.ts     # 最新特性数据
│   │   ├── slash-commands.ts
│   │   ├── cli-flags.ts
│   │   ├── shortcuts.ts
│   │   ├── settings.ts
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── Section.tsx     # 分类页面
│   │   ├── SearchResults.tsx
│   │   ├── Favorites.tsx
│   │   ├── Features.tsx
│   │   ├── Plugins.tsx
│   │   ├── Scenarios.tsx
│   │   ├── Cheatsheet.tsx
│   │   └── ClawCode.tsx
│   ├── i18n/               # 国际化翻译文件
│   │   ├── en.ts           # 英文
│   │   ├── zh-CN.ts        # 简体中文
│   │   ├── zh-TW.ts        # 繁体中文
│   │   ├── ja.ts           # 日文
│   │   ├── ko.ts           # 韩文
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   │   └── useSearch.ts    # 搜索逻辑
│   ├── context/            # React Context
│   │   └── FavoritesContext.tsx
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── dist/                   # 构建产物 (GitHub Pages)
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.0.0 | UI 框架 |
| **TypeScript** | 5.7.2 | 类型安全 |
| **Vite** | 6.0.5 | 构建工具 |
| **Tailwind CSS** | 4.0.0 | 样式框架 |
| **React Router** | 7.1.3 | 路由管理 |
| **Fuse.js** | 7.0.0 | 模糊搜索 |
| **Lucide React** | 0.468.0 | 图标库 |

---

## 📚 内容分类

### 核心内容

| 分类 | 说明 |
|------|------|
| **斜杠命令** | 在 Claude Code 提示框中输入 `/` 可访问的内置命令 |
| **CLI 参数** | 启动 `claude` CLI 时传入的命令行参数 |
| **键盘快捷键** | 在交互会话中可用的键盘快捷键 |
| **内置技能** | Claude Code 内置的预制技能 |
| **特殊模式** | 改变 Claude Code 行为方式的操作模式 |
| **settings.json** | 配置文件选项详解 |
| **环境变量** | 全局配置行为的环境变量 |

### 扩展内容

| 分类 | 说明 |
|------|------|
| **应用场景** | 真实工作流指南，每种场景的最佳命令组合 |
| **收藏夹** | 你已加星标的命令，方便快速访问 |
| **最新特性** | Claude Code 最新功能、集成和更新（更新至 2026 年） |
| **插件指南** | 社区插件与增强配置使用指南 |
| **ClawCode** | Claw Code 代理 Harness 系统清洁室重构项目介绍 |

---

## 🌍 国际化支持

目前已支持以下语言：

- 🇺🇸 English (en)
- 🇨🇳 简体中文 (zh-CN)
- 🇹🇼 繁体中文 (zh-TW)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇪🇸 Español (es)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇮🇹 Italiano (it)
- 🇳🇱 Nederlands (nl)
- 🇹🇷 Türkçe (tr)

欢迎贡献更多语言翻译！

---

## 📝 更新日志

### v2.2.0 (2026-04-22)

**同步 Claude Code v2.1.117 最新特性**（自 v2.1.105 → v2.1.117 的官方更新）

新增斜杠命令：
- ✨ `/ultrareview` (v2.1.111) — 云端多智能体并行代码审查，支持当前分支或指定 GitHub PR 编号
- ✨ `/less-permission-prompts` (v2.1.111) — 扫描转录记录，提议优先级允许列表以减少权限弹窗
- ✨ `/tui` (v2.1.110) — 切换无闪烁全屏渲染模式，无需重启会话
- ✨ `/focus` (v2.1.110) — 焦点视图独立切换（原 Ctrl+O 仅切换详细转录视图）
- ✨ `/recap` (v2.1.108) — 回到会话时生成回顾摘要

更新斜杠命令：
- 🔄 `/effort` — 新增 `xhigh` 档（v2.1.111），介于 high 与 max 之间，仅 Opus 4.7 可用；不带参数时打开交互式滑块
- 🔄 `/loop` — 新增别名 `/proactive` (v2.1.105)
- 🔄 `/rewind` — 新增别名 `/undo` (v2.1.108)
- 🔄 `/reload-plugins` — 自动安装缺失插件依赖（v2.1.116）

新增 settings.json 配置：
- ✨ `tui` (v2.1.110) — 终端 UI 模式持久化默认值（fullscreen / inline）
- ✨ `autoScrollEnabled` (v2.1.110) — 全屏模式下禁用自动滚动
- ✨ `sandbox.network.deniedDomains` (v2.1.113) — 在沙箱中精确拒绝特定域名

新增环境变量：
- ✨ `CLAUDE_CODE_FORK_SUBAGENT` (v2.1.117) — 在外部构建中启用分叉子代理
- ✨ `CLAUDE_CODE_USE_POWERSHELL_TOOL` (v2.1.111) — 启用原生 PowerShell 工具
- ✨ `OTEL_LOG_RAW_API_BODIES` (v2.1.111) — 将完整 API 请求/响应体作为 OpenTelemetry 日志事件发出
- ✨ `ENABLE_PROMPT_CACHING_1H` (v2.1.108) — 启用 1 小时提示缓存 TTL（API key/Bedrock/Vertex/Foundry）
- ✨ `FORCE_PROMPT_CACHING_5M` (v2.1.108) — 强制 5 分钟提示缓存 TTL
- ✨ `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` (v2.1.108) — 强制启用/禁用会话回顾
- ✨ `CLAUDE_CODE_CERT_STORE` (v2.1.101) — 选择 TLS 信任库（os / bundled）

新增最新特性：
- ✨ Opus 4.7 + xhigh 努力档；Max 用户在 Opus 4.7 上自动获得 Auto Mode
- ✨ 原生 CLI 二进制分发（v2.1.113），macOS/Linux 上 Glob/Grep 由内置 `bfs`/`ugrep` 取代
- ✨ /tui 无闪烁全屏模式 + autoScrollEnabled 配置
- ✨ /ultrareview 云端多智能体代码审查
- ✨ 会话回顾（Session Recap），包括禁用遥测的环境
- ✨ 原生 PowerShell 工具
- ✨ "Auto（匹配终端）" 主题，自动同步终端深色/浅色模式

### v2.1.0 (2026-04-13)

**同步 Claude Code v2.1.101 最新特性**

新增斜杠命令：
- ✨ `/team-onboarding` (v2.1.101) — 自动生成新成员入门指南
- ✨ `/ultraplan` (v2.1.101) — 远程规划会话云端环境自动创建
- ✨ `/powerup` (v2.1.90) — 交互式功能课程（含动画演示）
- ✨ `/effort` (v2.1.94) — 会话推理努力程度控制（low/medium/high/max）
- ✨ `/reload-plugins` (v2.1.98) — 无需重启即可热重载插件

更新斜杠命令：
- 🔄 `/vim` — 已弃用（v2.1.92 移除），请改用 `/config`
- 🔄 `/agents` — 新增选项卡布局（Running / Library）
- 🔄 `/cost` — 新增按模型和缓存命中的明细
- 🔄 `/release-notes` — 改为交互式版本选择器

新增 CLI 参数：
- ✨ `--name` (v2.1.101) — 为会话指定可读名称
- ✨ `--exclude-dynamic-system-prompt-sections` (v2.1.98) — 提高跨用户提示缓存命中率

新增 settings.json 配置：
- ✨ `forceRemoteSettingsRefresh` (v2.1.92) — 企业托管环境故障关闭
- ✨ `disableSkillShellExecution` (v2.1.91) — 禁用技能内联 Shell 执行
- ✨ `statusLine.refreshInterval` (v2.1.97) — 状态栏实时刷新间隔

新增环境变量：
- ✨ `CLAUDE_CODE_NO_FLICKER` (v2.1.89) — 无闪烁渲染模式
- ✨ `CLAUDE_CODE_PERFORCE_MODE` (v2.1.98) — Perforce 只读文件保护
- ✨ `MCP_CONNECTION_NONBLOCKING` (v2.1.89) — 跳过 MCP 连接等待

新增最新特性：
- ✨ 无闪烁模式与焦点视图（Ctrl+O）
- ✨ PreToolUse 钩子延迟权限决策（`defer`）
- ✨ Monitor 工具 — 后台脚本事件流
- ✨ /powerup 交互式功能课程
- ✨ /team-onboarding 团队入门指南

### v2.0.0 (2026-04-01)

**最新特性更新**
- ✨ 新增 Claude Opus 4.6 默认模型，支持 100 万上下文
- ✨ 新增 Computer Use 远程桌面控制功能（2026.03）
- ✨ 新增 `/loop` 计划循环任务命令
- ✨ 新增 `/think` 扩展思考模式命令
- ✨ 新增语音模式（Voice Mode）- 按键语音编码
- ✨ 新增通过浏览器/手机远程控制功能
- ✨ 新增自动记忆（Auto-Memory）功能
- ✨ 新增并行代理（多智能体任务分解）
- ✨ 新增插件生态系统 - 一键安装 MCP 套件
- ✨ 新增安全扫描 - 自动漏洞检测
- ✨ 新增自适应思考模式
- ✨ 新增快速模式与数据驻地（企业级）

**新增页面**
- ✨ 新增 ClawCode 项目介绍页面

**改进**
- 🎨 主页添加版本号和更新时间显示
- 📝 完善 README.md 文档

### v1.0.0 (2025-Q4)

- 🎉 初始版本发布
- 📚 完整的 Claude Code 命令参考
- 🔍 全文搜索功能
- ⭐ 收藏功能
- 🌙 暗色模式支持

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 添加新命令

1. 在 `src/data/` 对应的数据文件中添加新条目
2. 确保包含中英文描述
3. 添加适当的标签和分类

### 添加翻译

1. 在 `src/i18n/` 对应的语言文件中添加翻译
2. 保持与英文版本的结构一致

### 开发流程

```bash
# Fork 仓库
git clone https://github.com/your-username/ClaudeAssist.git

# 创建分支
git checkout -b feature/your-feature

# 开发并提交
git commit -m "feat: add your feature"

# 推送并创建 PR
git push origin feature/your-feature
```

---

## 📄 许可证

本项目采用 [Apache 2.0](LICENSE) 许可证。

---

## 🔗 相关链接

- [Claude Code 官方文档](https://code.claude.com/docs)
- [ClawCode 项目](https://github.com/instructkr/claw-code)
- [Anthropic 官网](https://anthropic.com)

---

## 📧 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

<div align="center">

**Made with ❤️ for the Claude Code community**

[⭐ Star this repo](https://github.com/tangjianfang/ClaudeAssist) if you find it helpful!

</div>
