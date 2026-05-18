/**
 * src/data/vendor-logos.ts
 * ─────────────────────────────────────────────────────────────────
 * 厂商 logo 映射表 - 本地缓存版本
 * 所有 logo 存储在 public/logos/ 目录中
 */

export const VENDOR_LOGOS: Record<string, { url: string; alt: string }> = {
  // AI Model Vendors
  OpenAI: {
    url: `${import.meta.env.BASE_URL}logos/openai.svg`,
    alt: 'OpenAI Logo',
  },
  Anthropic: {
    url: `${import.meta.env.BASE_URL}logos/anthropic.svg`,
    alt: 'Anthropic Logo',
  },
  'Google DeepMind': {
    url: `${import.meta.env.BASE_URL}logos/google.svg`,
    alt: 'Google DeepMind Logo',
  },
  DeepSeek: {
    url: `${import.meta.env.BASE_URL}logos/deepseek.svg`,
    alt: 'DeepSeek Logo',
  },
  'Alibaba Cloud': {
    url: `${import.meta.env.BASE_URL}logos/alibaba.svg`,
    alt: 'Alibaba Cloud Logo',
  },
  'SpaceXAI (原 xAI)': {
    url: `${import.meta.env.BASE_URL}logos/xai.svg`,
    alt: 'xAI / SpaceXAI Logo',
  },
  Xiaomi: {
    url: `${import.meta.env.BASE_URL}logos/xiaomi.svg`,
    alt: 'Xiaomi Logo',
  },

  // AI Tool Vendors
  GitHub: {
    url: `${import.meta.env.BASE_URL}logos/github.svg`,
    alt: 'GitHub Logo',
  },
  'GitHub/OpenAI': {
    url: `${import.meta.env.BASE_URL}logos/github.svg`,
    alt: 'GitHub Logo',
  },
  Cursor: {
    url: `${import.meta.env.BASE_URL}logos/cursor.svg`,
    alt: 'Cursor IDE Logo',
  },
  'JetBrains': {
    url: `${import.meta.env.BASE_URL}logos/jetbrains.svg`,
    alt: 'JetBrains Logo',
  },
  Tabnine: {
    url: `${import.meta.env.BASE_URL}logos/tabnine.svg`,
    alt: 'Tabnine Logo',
  },
  Amazon: {
    url: `${import.meta.env.BASE_URL}logos/amazon.svg`,
    alt: 'Amazon Logo',
  },
  Codeium: {
    url: `${import.meta.env.BASE_URL}logos/codeium.svg`,
    alt: 'Codeium Logo',
  },
  Alibaba: {
    url: `${import.meta.env.BASE_URL}logos/alibaba.svg`,
    alt: 'Alibaba Logo',
  },
  Baidu: {
    url: `${import.meta.env.BASE_URL}logos/baidu.svg`,
    alt: 'Baidu Logo',
  },
  'Mozilla / OpenWeb': {
    url: `${import.meta.env.BASE_URL}logos/mozilla.svg`,
    alt: 'Mozilla Logo',
  },
  'Hugging Face': {
    url: `${import.meta.env.BASE_URL}logos/huggingface.svg`,
    alt: 'Hugging Face Logo',
  },
  Continue: {
    url: `${import.meta.env.BASE_URL}logos/continue.svg`,
    alt: 'Continue Logo',
  },
  Aider: {
    url: `${import.meta.env.BASE_URL}logos/github.svg`,
    alt: 'Aider Logo',
  },
  'Void': {
    url: `${import.meta.env.BASE_URL}logos/github.svg`,
    alt: 'Void Editor Logo',
  },
  'Codex': {
    url: `${import.meta.env.BASE_URL}logos/openai.svg`,
    alt: 'Codex Logo',
  },
  'Factory': {
    url: `${import.meta.env.BASE_URL}logos/github.svg`,
    alt: 'Factory Droid Logo',
  },
  'Gemini': {
    url: `${import.meta.env.BASE_URL}logos/google.svg`,
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
    url: `${import.meta.env.BASE_URL}logos/claude.svg`,
    alt: 'Claude Code Logo',
  },
  // GitHub Copilot 使用 Copilot 专属 logo（不同于 GitHub Octocat）
  'github-copilot-individual': {
    url: `${import.meta.env.BASE_URL}logos/githubcopilot.svg`,
    alt: 'GitHub Copilot Logo',
  },
  'github-copilot-cli': {
    url: `${import.meta.env.BASE_URL}logos/githubcopilot.svg`,
    alt: 'GitHub Copilot Logo',
  },
  // Gemini CLI 使用 Gemini 专属 logo（不同于 Google 通用 logo）
  'gemini-cli': {
    url: `${import.meta.env.BASE_URL}logos/googlegemini.svg`,
    alt: 'Gemini CLI Logo',
  },
  // OpenAI Codex CLI 使用 OpenAI logo
  'codex-cli': {
    url: `${import.meta.env.BASE_URL}logos/openai.svg`,
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
