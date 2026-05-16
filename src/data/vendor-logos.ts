/**
 * src/data/vendor-logos.ts
 * ─────────────────────────────────────────────────────────────────
 * 厂商 logo 映射表 - 本地缓存版本
 * 所有 logo 存储在 public/logos/ 目录中
 */

export const VENDOR_LOGOS: Record<string, { url: string; alt: string }> = {
  // AI Model Vendors
  OpenAI: {
    url: '/logos/openai.svg',
    alt: 'OpenAI Logo',
  },
  Anthropic: {
    url: '/logos/anthropic.svg',
    alt: 'Anthropic Logo',
  },
  'Google DeepMind': {
    url: '/logos/google.svg',
    alt: 'Google DeepMind Logo',
  },
  DeepSeek: {
    url: '/logos/deepseek.svg',
    alt: 'DeepSeek Logo',
  },
  'Alibaba Cloud': {
    url: '/logos/alibaba.svg',
    alt: 'Alibaba Cloud Logo',
  },

  // AI Tool Vendors
  GitHub: {
    url: '/logos/github.svg',
    alt: 'GitHub Logo',
  },
  'GitHub/OpenAI': {
    url: '/logos/github.svg',
    alt: 'GitHub Logo',
  },
  Cursor: {
    url: '/logos/cursor.svg',
    alt: 'Cursor IDE Logo',
  },
  'JetBrains': {
    url: '/logos/jetbrains.svg',
    alt: 'JetBrains Logo',
  },
  Tabnine: {
    url: '/logos/tabnine.svg',
    alt: 'Tabnine Logo',
  },
  Amazon: {
    url: '/logos/amazon.svg',
    alt: 'Amazon Logo',
  },
  Codeium: {
    url: '/logos/codeium.svg',
    alt: 'Codeium Logo',
  },
  Alibaba: {
    url: '/logos/alibaba.svg',
    alt: 'Alibaba Logo',
  },
  Baidu: {
    url: '/logos/baidu.svg',
    alt: 'Baidu Logo',
  },
  'Mozilla / OpenWeb': {
    url: '/logos/mozilla.svg',
    alt: 'Mozilla Logo',
  },
  'Hugging Face': {
    url: '/logos/huggingface.svg',
    alt: 'Hugging Face Logo',
  },
  Continue: {
    url: '/logos/continue.svg',
    alt: 'Continue Logo',
  },
  Aider: {
    url: '/logos/github.svg',
    alt: 'Aider Logo',
  },
  'Void': {
    url: '/logos/github.svg',
    alt: 'Void Editor Logo',
  },
  'Codex': {
    url: '/logos/openai.svg',
    alt: 'Codex Logo',
  },
  'Factory': {
    url: '/logos/github.svg',
    alt: 'Factory Droid Logo',
  },
  'Gemini': {
    url: '/logos/google.svg',
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
