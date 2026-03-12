# ClaudeAssist

> **Claude Code 命令速查助手 / Claude Code Command Quick Reference**

A fast, elegant, bilingual (EN/中文) reference for every Claude Code slash command, CLI flag, keyboard shortcut, setting, and mode — curated for both beginners and power users.

🌐 **Live site**: [https://your-username.github.io/ClaudeAssist/](https://your-username.github.io/ClaudeAssist/)

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
