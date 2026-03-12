# ClaudeAssist

> **Claude Code 命令速查助手 / Claude Code Command Quick Reference**

A fast, elegant, bilingual (EN/中文) reference for every Claude Code slash command, CLI flag, keyboard shortcut, setting, and mode — curated for both beginners and power users.

🌐 **Live site**: [https://tangjianfang.github.io/ClaudeAssist/](https://tangjianfang.github.io/ClaudeAssist/)

---

## 快速访问 / Quick Access

| 页面 | 链接 | 说明 |
|------|------|------|
| 🏠 首页 | [/](https://tangjianfang.github.io/ClaudeAssist/) | 命令总览与入门推荐 |
| 🗺️ 应用场景 | [/#/scenarios](https://tangjianfang.github.io/ClaudeAssist/#/scenarios) | 真实工作流指南（Demo / 项目 / CI 等） |
| ⚡ 速查表 | [/#/cheatsheet](https://tangjianfang.github.io/ClaudeAssist/#/cheatsheet) | 可打印的核心命令一页纸 |
| `/` 斜杠命令 | [/#/slash-commands](https://tangjianfang.github.io/ClaudeAssist/#/slash-commands) | /init · /compact · /review … |
| 🏳️ CLI 参数 | [/#/cli-flags](https://tangjianfang.github.io/ClaudeAssist/#/cli-flags) | --print · --model · --add-dir … |
| ⌨️ 快捷键 | [/#/shortcuts](https://tangjianfang.github.io/ClaudeAssist/#/shortcuts) | Ctrl+C · Esc · Ctrl+R … |
| ⚙️ 配置项 | [/#/settings](https://tangjianfang.github.io/ClaudeAssist/#/settings) | settings.json 全量选项 |
| 🔧 环境变量 | [/#/env-vars](https://tangjianfang.github.io/ClaudeAssist/#/env-vars) | ANTHROPIC_API_KEY 等 |

---

## Features

- **200+ documented entries** — slash commands, CLI flags, keyboard shortcuts, settings.json options, environment variables, bundled skills, and special modes
- **Fuzzy full-text search** — Ctrl+K to focus, searches across all fields including descriptions and examples
- **Bilingual** — full English and 简体中文 support, auto-detected from browser language
- **Complexity levels** — filter by Beginner / Intermediate / Advanced
- **Tag filtering** — cross-section tag cloud for quick discovery
- **Dark mode** — toggle with the sun/moon icon, persists across sessions
- **Cheat sheet** — printable single-page view of the most essential commands
- **Copy buttons** — one-click copy on every code example
- **Deep-linkable** — every filter state and search is encoded in the URL
- **Verified** — all entries cross-referenced against official Claude Code documentation

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Fuse.js](https://www.fusejs.io/) for fuzzy search
- [React Router v7](https://reactrouter.com/) (HashRouter for GitHub Pages)
- [Lucide React](https://lucide.dev/) icons
- Static — zero backend, deployable anywhere

## Development

```bash
npm install
npm run dev        # start dev server at http://localhost:5173/ClaudeAssist/
npm run build      # production build to ./dist
npm run preview    # preview the production build
```

## Contributing

Found a missing or incorrect command? Please open an issue or PR!

All command data lives in `src/data/` as typed TypeScript files. Each entry has:
- `id`, `name`, `syntax`, `section`, `subCategory`, `complexity`
- `tags[]`, `aliases[]`, `examples[]`
- `i18n.en` and `i18n['zh-CN']` with `description` and optional `notes`

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the included GitHub Actions workflow.

Make sure to:
1. Enable GitHub Pages in repository Settings → Pages → Source: `gh-pages` branch
2. Update the `base` in `vite.config.ts` if your repo name differs from `ClaudeAssist`

## License

[Apache 2.0](LICENSE)
