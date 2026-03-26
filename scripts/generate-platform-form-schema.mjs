import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../skills/openclaw-yixiaoer/platforms');
const OUTPUT_FILE = path.join(__dirname, '../src/config/platform-form-schema.ts');

const FORM_TYPE_MAP = {
  '视频': 'video',
  '图文': 'imageText',
  '文章': 'article',
};

function inferPrimitiveType(typeText) {
  const normalized = (typeText || '').trim();
  if (!normalized) return 'unknown';
  if (normalized.endsWith('[]')) return 'array';
  if (/^(string)$/i.test(normalized)) return 'string';
  if (/^(number|StatementType|0|1|2|3|4|5|6)$/i.test(normalized)) return 'number';
  if (/^(boolean)$/i.test(normalized)) return 'boolean';
  if (/^(object|Category|OldCover|OldImage|PlatformDataItem|GroupShoppingDTO)$/i.test(normalized)) return 'object';
  return 'object';
}

function extractEnums(description) {
  const text = description || '';
  const matches = Array.from(text.matchAll(/(\d+)\s*[:：]\s*(.*?)(?=\d+\s*[:：]|$)/g));
  return matches.map((match) => ({
    value: Number(match[1]),
    label: match[2].trim().replace(/^[，。,；;'"`-]+|[，。,；;'"`-]+$/g, ''),
  })).filter((item) => item.label);
}

function extractValueRange(description) {
  const text = (description || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const parts = [];

  const enumMatches = extractEnums(text);
  if (enumMatches.length > 0) {
    parts.push(enumMatches.map((item) => `${item.value}=${item.label}`).join(', '));
  }

  const maxCount = text.match(/最多\s*(\d+)\s*个/);
  if (maxCount) {
    parts.push(`最多 ${maxCount[1]} 个`);
  }

  const minMax = text.match(/(\d+)\s*[-~到]\s*(\d+)/);
  if (minMax) {
    parts.push(`${minMax[1]}-${minMax[2]}`);
  }

  if (/互斥/.test(text)) {
    parts.push('存在互斥约束');
  }

  if (/秒或毫秒|时间戳/.test(text)) {
    parts.push('时间戳');
  }

  return Array.from(new Set(parts)).join('；');
}

function extractExamples(fieldName, rawType, description) {
  const examples = {
    title: '"示例标题"',
    description: '"示例描述"',
    content: '"<p>正文内容</p>"',
    tags: '["标签1", "标签2"]',
    category: '[{"yixiaoerId":"1","yixiaoerName":"分类"}]',
    covers: '[{"key":"oss-key","width":1080,"height":1920,"size":12345}]',
    cover: '{"key":"oss-key","width":1080,"height":1920,"size":12345}',
    horizontalCover: '{"key":"oss-key","width":1280,"height":720,"size":12345}',
    verticalCovers: '[{"key":"oss-key","width":1080,"height":1920,"size":12345}]',
    images: '[{"key":"oss-key","width":1080,"height":1920,"size":12345}]',
    location: '{"id":"loc-1","name":"北京"}',
    music: '{"id":"music-1","name":"背景音乐"}',
    musice: '{"id":"music-1","name":"背景音乐"}',
    scheduledTime: '1704067200000',
    visibleType: '0',
    declaration: '0',
    statement: '3',
    notifySubscribers: '1',
    pubType: '1',
    createType: '0',
  };

  if (examples[fieldName]) return examples[fieldName];

  if ((rawType || '').endsWith('[]')) return '[]';
  if (rawType === 'string') return '"示例值"';
  if (rawType === 'number') return '0';
  if (/^\d+$/.test(rawType || '')) return rawType;
  if ((description || '').includes('时间戳')) return '1704067200000';
  return '';
}

function parsePlatformFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const platformCode = path.basename(filePath, '.md');
  const titleMatch = content.match(/^#\s+(.+?)\s+平台发布字段/m);
  const platformTitle = titleMatch ? titleMatch[1].trim() : platformCode;

  const forms = [];
  let currentForm = null;
  let inTable = false;

  for (const line of lines) {
    const formMatch = line.match(/^##\s+\d+\.\s+(.+?)\s+\((.+?)\)\s*$/);
    if (formMatch) {
      currentForm = {
        formName: formMatch[1].trim(),
        formLabel: formMatch[2].trim(),
        publishType: FORM_TYPE_MAP[formMatch[2].trim()] || 'unknown',
        fields: [],
      };
      forms.push(currentForm);
      inTable = false;
      continue;
    }

    if (!currentForm) continue;

    if (line.includes('| 字段名 | 类型 | 必填 | 描述 |')) {
      inTable = true;
      continue;
    }

    if (inTable && line.startsWith('|')) {
      if (line.includes('|--------|')) continue;

      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());

      if (cells.length < 4) continue;

      const name = cells[0].replace(/^`|`$/g, '');
      const rawType = cells[1];
      const required = cells[2].includes('✅');
      const description = cells[3].replace(/\\\|/g, '|');
      const enumValues = extractEnums(description);
      const valueRange = extractValueRange(description);

      currentForm.fields.push({
        name,
        rawType,
        valueType: inferPrimitiveType(rawType),
        required,
        description,
        valueRange,
        enumValues,
        example: extractExamples(name, rawType, description),
      });
      continue;
    }

    if (inTable && !line.startsWith('|')) {
      inTable = false;
    }
  }

  return {
    platformCode,
    platformTitle,
    forms: forms.filter((form) => form.fields.length > 0),
  };
}

function generateTs(platforms) {
  const bannerTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const json = JSON.stringify(platforms, null, 2);

  return `/**
 * platform-form-schema.ts
 *
 * ⚠️ 此文件由脚本自动生成，请勿手动修改！
 * 生成命令：node scripts/generate-platform-form-schema.mjs
 * 生成时间：${bannerTime}
 */

export interface PlatformFormEnumOption {
  value: number;
  label: string;
}

export interface PlatformFormFieldSchema {
  name: string;
  rawType: string;
  valueType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'unknown';
  required: boolean;
  description: string;
  valueRange: string;
  enumValues: PlatformFormEnumOption[];
  example: string;
}

export interface PlatformFormSchemaItem {
  formName: string;
  formLabel: string;
  publishType: 'video' | 'imageText' | 'article' | 'unknown';
  fields: PlatformFormFieldSchema[];
}

export interface PlatformFormSchema {
  platformCode: string;
  platformTitle: string;
  forms: PlatformFormSchemaItem[];
}

export const PLATFORM_FORM_SCHEMA: Record<string, PlatformFormSchema> = ${json} as const;
`;
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`未找到平台文档目录: ${SOURCE_DIR}`);
  }

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .sort();

  const platforms = {};

  for (const file of files) {
    const parsed = parsePlatformFile(path.join(SOURCE_DIR, file));
    if (parsed.forms.length > 0) {
      platforms[parsed.platformCode] = parsed;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, generateTs(platforms), 'utf-8');

  console.log(`✅ 已生成 platform_form schema: ${OUTPUT_FILE}`);
  console.log(`   平台数: ${Object.keys(platforms).length}`);
  console.log(
    `   表单数: ${Object.values(platforms).reduce((sum, item) => sum + item.forms.length, 0)}`
  );
}

main();
