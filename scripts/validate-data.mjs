/**
 * validate-data.mjs
 * 数据完整性校验脚本 (Slice A)
 * 运行方式: node scripts/validate-data.mjs
 *
 * 策略：对 ai-ecosystem.ts 做 TS→JS 剥离后 eval，失败则回退到正则文本提取。
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const ecosystemSrc = readFileSync(
  join(rootDir, 'src/data/ai-ecosystem.ts'),
  'utf8'
);

// -------- 文本级正则提取（不执行 TS，直接扫描源码） --------

const errors = [];
const warnings = [];

function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUSES = new Set(['stable', 'preview', 'unverified', 'deprecated']);
const TARGET_TOOL_IDS = [
  'claude-code',
  'codex-cli',
  'codex-app',
  'factory-droid',
  'gemini-cli',
  'opencode',
  'cursor-ide',
  'github-copilot-cli',
];

// ---- 提取 tools 数组中的各 id ----
// 匹配形如  id: 'xxx',  的字符串，限定在 tools: [ ... ] 区块内
// 简化方案：匹配 ai-ecosystem.ts 中所有 id: '...' 出现（含工具和模型），再分别定位

const toolsBlockMatch = ecosystemSrc.match(/tools:\s*\[([\s\S]*?)\],\s*toolCombinations:/);
const modelsBlockMatch = ecosystemSrc.match(/models:\s*\[([\s\S]*?)\],\s*tools:/);
const combosBlockMatch = ecosystemSrc.match(/toolCombinations:\s*\[([\s\S]*)\]/);

function extractIds(block) {
  if (!block) return [];
  const ids = [];
  const re = /\bid:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function extractField(block, fieldName) {
  // 提取 fieldName: '...' 或 fieldName: "..." 的所有值（含对应偏移位置）
  const re = new RegExp(`\\b${fieldName}:\\s*['"]([^'"]+)['"]`, 'g');
  const results = [];
  let m;
  while ((m = re.exec(block)) !== null) {
    results.push({ value: m[1], index: m.index });
  }
  return results;
}

// 将 tools 块和 models 块拆分成各条目，用于关联 id 和 source 字段
function splitIntoEntries(block) {
  if (!block) return [];
  // 每个条目以 {   id: '...' 开头，用 { 分割块再逐个提取
  const entries = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (block[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        entries.push(block.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return entries;
}

function getFieldFromEntry(entry, fieldName) {
  const m = entry.match(new RegExp(`\\b${fieldName}:\\s*['"]([^'"]+)['"]`));
  return m ? m[1] : null;
}

// ---- 校验工具 ----
const toolEntries = splitIntoEntries(toolsBlockMatch?.[1] ?? '');
const toolIds = new Set();

for (const entry of toolEntries) {
  const id = getFieldFromEntry(entry, 'id');
  if (!id) continue; // 跳过嵌套子对象（pricing/china/source等）误提取的幻影条目
  if (toolIds.has(id)) {
    error(`工具 id 重复: "${id}"`);
  }
  toolIds.add(id);

  const status = getFieldFromEntry(entry, 'status');
  if (status && !VALID_STATUSES.has(status)) {
    error(`工具 "${id}" 的 status "${status}" 不在枚举范围 [${[...VALID_STATUSES].join(', ')}]`);
  }

  // source.url / source.checkedAt：在 source: { ... } 子块中提取
  const sourceMatch = entry.match(/source:\s*\{([^}]+)\}/);
  if (!sourceMatch) {
    error(`工具 "${id}" 缺少 source 块`);
  } else {
    const sourceBlock = sourceMatch[1];
    const url = getFieldFromEntry(sourceBlock, 'url');
    const checkedAt = getFieldFromEntry(sourceBlock, 'checkedAt');
    if (!url) error(`工具 "${id}" 缺少 source.url`);
    if (!checkedAt) {
      error(`工具 "${id}" 缺少 source.checkedAt`);
    } else if (!DATE_RE.test(checkedAt)) {
      error(`工具 "${id}" 的 source.checkedAt "${checkedAt}" 不是 yyyy-MM-dd 格式`);
    }
  }
}

// ---- 校验模型 ----
const modelEntries = splitIntoEntries(modelsBlockMatch?.[1] ?? '');
const modelIds = new Set();

for (const entry of modelEntries) {
  const id = getFieldFromEntry(entry, 'id');
  if (!id) continue; // 跳过嵌套子对象误提取的幻影条目
  if (modelIds.has(id)) {
    error(`模型 id 重复: "${id}"`);
  }
  modelIds.add(id);

  const sourceMatch = entry.match(/source:\s*\{([^}]+)\}/);
  if (!sourceMatch) {
    error(`模型 "${id}" 缺少 source 块`);
  } else {
    const sourceBlock = sourceMatch[1];
    const url = getFieldFromEntry(sourceBlock, 'url');
    const checkedAt = getFieldFromEntry(sourceBlock, 'checkedAt');
    if (!url) error(`模型 "${id}" 缺少 source.url`);
    if (!checkedAt) {
      error(`模型 "${id}" 缺少 source.checkedAt`);
    } else if (!DATE_RE.test(checkedAt)) {
      error(`模型 "${id}" 的 source.checkedAt "${checkedAt}" 不是 yyyy-MM-dd 格式`);
    }
  }
}

// ---- 校验 toolCombinations ----
const comboEntries = splitIntoEntries(combosBlockMatch?.[1] ?? '');
const comboIds = new Set();
for (const entry of comboEntries) {
  const id = getFieldFromEntry(entry, 'id');
  if (!id) { warn(`工具组合条目缺少 id`); continue; }
  if (comboIds.has(id)) {
    warn(`工具组合 id 重复: "${id}"`);
  }
  comboIds.add(id);

  const tool = getFieldFromEntry(entry, 'tool');
  const model = getFieldFromEntry(entry, 'model');
  if (!tool) warn(`工具组合 "${id}" 缺少 tool 字段`);
  if (!model) warn(`工具组合 "${id}" 缺少 model 字段`);
}

// ---- 8 个目标工具核验 ----
for (const tid of TARGET_TOOL_IDS) {
  if (!toolIds.has(tid)) {
    error(`目标工具 "${tid}" 未在 DATA_STORE.tools 中找到`);
  }
}

// -------- 输出结果 --------
console.log(`\n📊 数据校验报告`);
console.log(`   工具数量: ${toolEntries.length} (含 ${TARGET_TOOL_IDS.filter(id => toolIds.has(id)).length}/${TARGET_TOOL_IDS.length} 个目标工具)`);
console.log(`   模型数量: ${modelEntries.length}`);
console.log(`   工具组合: ${comboEntries.length}\n`);

if (warnings.length > 0) {
  console.warn(`⚠️  警告 (${warnings.length}):`);
  warnings.forEach(w => console.warn(`   • ${w}`));
  console.log();
}

if (errors.length > 0) {
  console.error(`❌ 错误 (${errors.length}):`);
  errors.forEach(e => console.error(`   • ${e}`));
  console.log();
  process.exit(1);
}

console.log('✅ 数据校验通过\n');
