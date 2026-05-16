/**
 * src/data/vendor-logos.ts
 * ─────────────────────────────────────────────────────────────────
 * 厂商 logo 映射表 - 本地缓存版本
 * 所有 logo 存储在 public/logos/ 目录中
 */

export const VENDOR_LOGOS: Record<string, { url: string; alt: string }> = {
  // AI Model Vendors
  OpenAI: {
    url: '/ClaudeAssist/logos/openai.svg',
    alt: 'OpenAI Logo',
  },
  Anthropic: {
    url: '/ClaudeAssist/logos/anthropic.svg',
    alt: 'Anthropic Logo',
  },
  'Google DeepMind': {
    url: '/ClaudeAssist/logos/google.svg',
    alt: 'Google DeepMind Logo',
  },
  DeepSeek: {
    url: '/ClaudeAssist/logos/deepseek.svg',
    alt: 'DeepSeek Logo',
  },
  'Alibaba Cloud': {
    url: '/ClaudeAssist/logos/alibaba.svg',
    alt: 'Alibaba Cloud Logo',
  },

  // AI Tool Vendors
  GitHub: {
    url: '/ClaudeAssist/logos/github.svg',
    alt: 'GitHub Logo',
  },
  'GitHub/OpenAI': {
    url: '/ClaudeAssist/logos/github.svg',
    alt: 'GitHub Logo',
  },
  Cursor: {
    url: '/ClaudeAssist/logos/cursor.svg',
    alt: 'Cursor IDE Logo',
  },
  'JetBrains': {
    url: '/ClaudeAssist/logos/jetbrains.svg',
    alt: 'JetBrains Logo',
  },
  Tabnine: {
    url: '/ClaudeAssist/logos/tabnine.svg',
    alt: 'Tabnine Logo',
  },
  Amazon: {
    url: '/ClaudeAssist/logos/amazon.svg',
    alt: 'Amazon Logo',
  },
  Codeium: {
    url: '/ClaudeAssist/logos/codeium.svg',
    alt: 'Codeium Logo',
  },
  Alibaba: {
    url: '/ClaudeAssist/logos/alibaba.svg',
    alt: 'Alibaba Logo',
  },
  Baidu: {
    url: '/ClaudeAssist/logos/baidu.svg',
    alt: 'Baidu Logo',
  },
  'Mozilla / OpenWeb': {
    url: '/ClaudeAssist/logos/mozilla.svg',
    alt: 'Mozilla Logo',
  },
  'Hugging Face': {
    url: '/ClaudeAssist/logos/huggingface.svg',
    alt: 'Hugging Face Logo',
  },
  Continue: {
    url: '/ClaudeAssist/logos/continue.svg',
    alt: 'Continue Logo',
  },
  Aider: {
    url: '/ClaudeAssist/logos/github.svg',
    alt: 'Aider Logo',
  },
  'Void': {
    url: '/ClaudeAssist/logos/github.svg',
    alt: 'Void Editor Logo',
  },
  'Codex': {
    url: '/ClaudeAssist/logos/openai.svg',
    alt: 'Codex Logo',
  },
  'Factory': {
    url: '/ClaudeAssist/logos/github.svg',
    alt: 'Factory Droid Logo',
  },
  'Gemini': {
    url: '/ClaudeAssist/logos/google.svg',
    alt: 'Gemini Logo',
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
