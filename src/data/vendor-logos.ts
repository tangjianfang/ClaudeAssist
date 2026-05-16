/**
 * src/data/vendor-logos.ts
 * ─────────────────────────────────────────────────────────────────
 * 厂商 logo 映射表
 * 优先级：官方 CDN > Simple Icons > Google Favicon API
 */

export const VENDOR_LOGOS: Record<string, { url: string; alt: string }> = {
  // AI Model Vendors
  OpenAI: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg',
    alt: 'OpenAI Logo',
  },
  Anthropic: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Anthropic_company_logo.png',
    alt: 'Anthropic Logo',
  },
  'Google DeepMind': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg',
    alt: 'Google DeepMind Logo',
  },
  DeepSeek: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/deepseek.svg',
    alt: 'DeepSeek Logo',
  },
  'Alibaba Cloud': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/alibaba.svg',
    alt: 'Alibaba Cloud Logo',
  },

  // AI Tool Vendors
  GitHub: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg',
    alt: 'GitHub Logo',
  },
  'GitHub/OpenAI': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg',
    alt: 'GitHub Logo',
  },
  Cursor: {
    url: 'https://www.cursor.com/favicon.ico',
    alt: 'Cursor IDE Logo',
  },
  'JetBrains': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/jetbrains.svg',
    alt: 'JetBrains Logo',
  },
  Tabnine: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tabnine.svg',
    alt: 'Tabnine Logo',
  },
  Amazon: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazon.svg',
    alt: 'Amazon Logo',
  },
  Codeium: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/codeium.svg',
    alt: 'Codeium Logo',
  },
  Alibaba: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/alibaba.svg',
    alt: 'Alibaba Logo',
  },
  Baidu: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/baidu.svg',
    alt: 'Baidu Logo',
  },
  'Mozilla / OpenWeb': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/mozilla.svg',
    alt: 'Mozilla Logo',
  },
  'Hugging Face': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/huggingface.svg',
    alt: 'Hugging Face Logo',
  },
  Continue: {
    url: 'https://continue.dev/favicon.ico',
    alt: 'Continue Logo',
  },
  Aider: {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg',
    alt: 'Aider Logo',
  },
  'Void': {
    url: 'https://www.voideditor.dev/favicon.ico',
    alt: 'Void Editor Logo',
  },
  'Codex': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg',
    alt: 'Codex Logo',
  },
  'Factory': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/factory.svg',
    alt: 'Factory Droid Logo',
  },
  'Gemini': {
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg',
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
