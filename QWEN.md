# ClaudeAssist 项目上下文

## 项目概述

**ClaudeAssist** 是一个 Claude Code 命令快速参考网站，提供所有斜杠命令、CLI 标志、键盘快捷键、设置和模式的可搜索参考。

### 主要特性
- 🔍 **完全可搜索** - 快速查找任何 Claude Code 命令
- 🌐 **双语支持** - 英文/中文 (EN/中文)
- 📱 **响应式设计** - 适配各种设备
- 🎨 **现代 UI** - 使用 Tailwind CSS 构建的精美界面
- 🌙 **暗色模式** - 支持系统暗色模式偏好

### 技术栈
| 技术 | 版本/说明 |
|------|----------|
| **框架** | React 19.2.4 |
| **构建工具** | Vite |
| **样式** | Tailwind CSS v4.2.1 |
| **部署** | GitHub Pages |

## 目录结构

```
ClaudeAssist/
├── index.html          # 主入口 HTML 文件
├── favicon.svg         # 网站图标 (机器人 emoji)
├── .nojekyll           # GitHub Pages 配置 (禁用 Jekyll)
├── .gitignore          # Git 忽略规则
├── assets/             # 构建后的静态资源
│   ├── index-*.js      # 打包后的 JavaScript (React 应用)
│   └── index-*.css     # 打包后的 CSS (Tailwind)
├── dist/               # 部署目录 (GitHub Pages 内容)
│   ├── index.html
│   ├── favicon.svg
│   └── assets/
└── node_modules/       # 依赖项
```

## 关键文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主入口，包含 React 应用挂载点和 GitHub 链接 |
| `assets/index-*.js` | 打包后的 React 应用代码 |
| `assets/index-*.css` | 打包后的 Tailwind CSS 样式 |
| `dist/` | GitHub Pages 部署目录 |

## 构建与运行

由于项目仅包含构建后的文件，源代码不在当前目录中。

### 部署方式
项目通过 **GitHub Pages** 部署：
- 部署目录：`/ClaudeAssist/`
- 通过 `.nojekyll` 文件禁用 Jekyll 处理

### 本地预览
可以使用任意静态文件服务器预览：

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js (npx)
npx serve .

# 使用 PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080/ClaudeAssist/`

## 开发约定

### 代码风格
- 使用 React 函数式组件和 Hooks
- Tailwind CSS 实用类优先
- 响应式设计 (移动优先)

### 国际化
- 双语内容 (英文/中文)
- 元数据包含双语描述

### 设计系统
- **主色调**: Indigo (#6366f1)
- **字体**: 系统字体栈 (ui-sans-serif)
- **圆角**: 使用 Tailwind 的 rounded-* 类
- **阴影**: 使用 shadow-lg, shadow-xl 等

## 元数据与 SEO

项目包含完整的 Open Graph 元数据：
- `og:title`: ClaudeAssist — Claude Code Command Reference
- `og:description`: The fastest way to find any Claude Code command
- `og:type`: website

## 相关链接

- **GitHub**: https://github.com/instructkr/claw-code
