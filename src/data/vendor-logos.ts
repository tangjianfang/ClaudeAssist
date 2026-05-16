/**
 * src/data/vendor-logos.ts
 * ─────────────────────────────────────────────────────────────────
 * 厂商 logo 映射表 - 本地缓存版本
 * 所有 logo 存储在 public/logos/ 目录中
 */

export const VENDOR_LOGOS: Record<string, { url: string; alt: string }> = {
  // AI Model Vendors
  OpenAI: {
    url: '/AINav/logos/openai.svg',
    alt: 'OpenAI Logo',
  },
  Anthropic: {
    url: '/AINav/logos/anthropic.svg',
    alt: 'Anthropic Logo',
  },
  'Google DeepMind': {
    url: '/AINav/logos/google.svg',
    alt: 'Google DeepMind Logo',
  },
  DeepSeek: {
    url: '/AINav/logos/deepseek.svg',
    alt: 'DeepSeek Logo',
  },
  'Alibaba Cloud': {
    url: '/AINav/logos/alibaba.svg',
    alt: 'Alibaba Cloud Logo',
  },
  'SpaceXAI (原 xAI)': {
    url: '/AINav/logos/xai.svg',
    alt: 'xAI / SpaceXAI Logo',
  },
  Xiaomi: {
    url: '/AINav/logos/xiaomi.svg',
    alt: 'Xiaomi Logo',
  },

  // AI Tool Vendors
  GitHub: {
    url: '/AINav/logos/github.svg',
    alt: 'GitHub Logo',
  },
  'GitHub/OpenAI': {
    url: '/AINav/logos/github.svg',
    alt: 'GitHub Logo',
  },
  Cursor: {
    url: '/AINav/logos/cursor.svg',
    alt: 'Cursor IDE Logo',
  },
  'JetBrains': {
    url: '/AINav/logos/jetbrains.svg',
    alt: 'JetBrains Logo',
  },
  Tabnine: {
    url: '/AINav/logos/tabnine.svg',
    alt: 'Tabnine Logo',
  },
  Amazon: {
    url: '/AINav/logos/amazon.svg',
    alt: 'Amazon Logo',
  },
  Codeium: {
    url: '/AINav/logos/codeium.svg',
    alt: 'Codeium Logo',
  },
  Alibaba: {
    url: '/AINav/logos/alibaba.svg',
    alt: 'Alibaba Logo',
  },
  Baidu: {
    url: '/AINav/logos/baidu.svg',
    alt: 'Baidu Logo',
  },
  'Mozilla / OpenWeb': {
    url: '/AINav/logos/mozilla.svg',
    alt: 'Mozilla Logo',
  },
  'Hugging Face': {
    url: '/AINav/logos/huggingface.svg',
    alt: 'Hugging Face Logo',
  },
  Continue: {
    url: '/AINav/logos/continue.svg',
    alt: 'Continue Logo',
  },
  Aider: {
    url: '/AINav/logos/github.svg',
    alt: 'Aider Logo',
  },
  'Void': {
    url: '/AINav/logos/github.svg',
    alt: 'Void Editor Logo',
  },
  'Codex': {
    url: '/AINav/logos/openai.svg',
    alt: 'Codex Logo',
  },
  'Factory': {
    url: '/AINav/logos/github.svg',
    alt: 'Factory Droid Logo',
  },
  'Gemini': {
    url: '/AINav/logos/google.svg',
    alt: 'Gemini Logo',
  },
};

/**
 * 工具专属 logo 映射表（按工具 id）
 * 优先级高于厂商 logo，适用于工具与厂商 logo 不同的情况
 * 如：Claude Code 与 Anthropic、GitHub Copilot 与 GitHub
 */
export const TOOL_LOGOS: Record<string, { url: string; alt: string }> = {
  // Claude Code 使用 Claude 品牌 logo（不同于 Anthropic 通用 logo）
  'claude-code': {
    url: '/AINav/logos/claude.svg',
    alt: 'Claude Code Logo',
  },
  // GitHub Copilot 使用 Copilot 专属 logo（不同于 GitHub Octocat）
  'github-copilot-individual': {
    url: '/AINav/logos/githubcopilot.svg',
    alt: 'GitHub Copilot Logo',
  },
  'github-copilot-cli': {
    url: '/AINav/logos/githubcopilot.svg',
    alt: 'GitHub Copilot Logo',
  },
  // Gemini CLI 使用 Gemini 专属 logo（不同于 Google 通用 logo）
  'gemini-cli': {
    url: '/AINav/logos/googlegemini.svg',
    alt: 'Gemini CLI Logo',
  },
  // OpenAI Codex CLI 使用 OpenAI logo
  'codex-cli': {
    url: '/AINav/logos/openai.svg',
    alt: 'OpenAI Codex CLI Logo',
  },
};

/**
 * 根据厂商名称获取 logo，支持备选方案
 */
export function getVendorLogo(vendor: string): { url: string; alt: string } | undefined {
  // 精确匹配
  if (VENDOR_LOGOS[vendor]) {
    return VENDOR_LOGOS[vendor];
  }

  // 部分匹配（用于 vendor 包含多个部分的情况，如 "GitHub/OpenAI"）
  for (const [key, logo] of Object.entries(VENDOR_LOGOS)) {
    if (vendor.includes(key) || key.includes(vendor)) {
      return logo;
    }
  }

  return undefined;
}
