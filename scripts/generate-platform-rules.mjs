/**
 * generate-platform-rules.mjs
 * 
 * 自动读取 DTO 文件，生成 src/config/platform-rules.ts
 * 
 * 用法：node scripts/generate-platform-rules.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 配置 ====================

const SOURCE_DIR = 'C:\\work\\yixiaoer\\yixiaoer-universal\\apps\\server-api\\packages\\yxr-open-platform\\src\\models\\platform';
const DOCS_DIR = 'C:\\work\\yixiaoer\\yixiaoer-skill\\docs\\platforms';
const OUTPUT_FILE = path.join(__dirname, '../src/config/platform-rules.ts');

// DTO 文件名 -> 平台 code + name + supportedTypes 映射
// supportedTypes 根据 DTO 中存在的 Form 类型自动推断
const PLATFORM_META = {
  'acfun':           { code: 'AcFun',                name: 'AcFun',       },
  'aiqiyi':          { code: 'AiQiYi',               name: '爱奇艺',      },
  'baijiahao':       { code: 'BaiJiaHao',            name: '百家号',      },
  'bilibili':        { code: 'BiLiBiLi',             name: '哔哩哔哩',    },
  'chejiahao':       { code: 'CheJiaHao',            name: '车家号',      },
  'csdn':            { code: 'CSDN',                 name: 'CSDN',        },
  'dayuhao':         { code: 'DaYuHao',              name: '大鱼号',      },
  'dewu':            { code: 'DeWu',                 name: '得物',        },
  'douban':          { code: 'DouBan',               name: '豆瓣',        },
  'douyin':          { code: 'DouYin',               name: '抖音',        },
  'duoduoshipin':    { code: 'DuoDuoShiPin',         name: '多多视频',    },
  'fengwang':        { code: 'FengWang',             name: '蜂网',        },
  'jianshu':         { code: 'JianShu',              name: '简书',        },
  'kuaichuanhao':    { code: 'KuaiChuanHao',         name: '快传号',      },
  'kuaishou':        { code: 'KuaiShou',             name: '快手',        },
  'meipai':          { code: 'MeiPai',               name: '美拍',        },
  'meiyou':          { code: 'MeiYou',               name: '美柚',        },
  'pipixia':         { code: 'PiPiXia',              name: '皮皮虾',      },
  'qiehao':          { code: 'QiEHao',               name: '企鹅号',      },
  'shipinghao':      { code: 'ShiPinHao',            name: '视频号',      },
  'souhuhao':        { code: 'SouHuHao',             name: '搜狐号',      },
  'souhushipin':     { code: 'SouHuShiPin',          name: '搜狐视频',    },
  'tengxunshipin':   { code: 'TengXunShiPin',        name: '腾讯视频',    },
  'tengxunweishi':   { code: 'TengXunWeiShi',        name: '腾讯微视',    },
  'toutiaohao':      { code: 'TouTiaoHao',           name: '头条号',      },
  'wangyihao':       { code: 'WangYiHao',            name: '网易号',      },
  'wifiwanneng':     { code: 'WiFiWanNengYaoShi',    name: 'wifi万能钥匙', },
  'wxgongzhonghao':  { code: 'WeiXinGongZhongHao',  name: '微信公众号',  },
  'xiaohongshu':     { code: 'XiaoHongShu',          name: '小红书',      },
  'xiaohongshushop': { code: 'XiaoHongShuShangJiaHao', name: '小红书商家号', },
  'xinlangweibo':    { code: 'XinLangWeiBo',         name: '新浪微博',    },
  'xueqiuhao':       { code: 'XueQiuHao',            name: '雪球号',      },
  'yichehao':        { code: 'YiCheHao',             name: '易车号',      },
  'yidianhao':       { code: 'YiDianHao',            name: '一点号',      },
  'zhihu':           { code: 'ZhiHu',                name: '知乎',        },
};

// ==================== 解析工具 ====================

/**
 * 从 md 文件解析必填字段
 * 解析 docs/platforms/*.md 中的表格，提取必填字段
 */
function parseMdFiles() {
  const mdFiles = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  
  const platformRequiredFields = {};
  
  for (const file of mdFiles) {
    const filePath = path.join(DOCS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const platformCode = file.replace('.md', '');
    
    const requiredFields = new Set();
    const optionalFields = new Set();
    
    const lines = content.split('\n');
    let headerFound = false;
    
    for (const line of lines) {
      if (line.includes('字段名') && line.includes('必填')) {
        headerFound = true;
        continue;
      }
      
      if (headerFound && line.startsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        
        if (cells.length >= 2) {
          const fieldCell = cells[0];
          const required = cells.length >= 3 ? cells[2] : '';
          
          const fieldNameMatch = fieldCell.match(/`([^`]+)`/);
          const fieldName = fieldNameMatch ? fieldNameMatch[1] : fieldCell;
          
          if (fieldName && !fieldName.includes('---') && !fieldName.includes('字段名')) {
            if (required.includes('✅')) {
              requiredFields.add(fieldName);
            } else if (required.includes('❌') || required === '' || required === '否') {
              optionalFields.add(fieldName);
            }
          }
        }
      } else if (headerFound && !line.startsWith('|')) {
        headerFound = false;
      }
    }
    
    if (requiredFields.size > 0 || optionalFields.size > 0) {
      platformRequiredFields[platformCode] = {
        required: Array.from(requiredFields),
        optional: Array.from(optionalFields)
      };
    }
  }
  
  return platformRequiredFields;
}

/**
 * 从 DTO 内容中提取所有 class 定义及其字段
 * 策略：逐行扫描，找到 class 块后提取 `fieldName:` 或 `fieldName?:` 格式的字段
 */
function parseDtoFile(content) {
  const classes = [];
  const lines = content.split('\n');
  
  let inClass = false;
  let currentClass = null;
  let braceDepth = 0;
  let inDecorator = false;
  let decoratorParenDepth = 0;

  // 不允许作为字段名的关键字（装饰器参数属性名）
  const SKIP_WORDS = new Set([
    'constructor', 'super', 'return', 'if', 'else', 'for', 'while',
    'const', 'let', 'var', 'type', 'interface', 'description',
    'required', 'default', 'example', 'enum', 'message', 'each',
    'groups', 'always', 'context', 'min', 'max', 'length', 'pattern'
  ]);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 检测 class 开始（在 inClass 之外）
    if (!inClass) {
      const classMatch = line.match(/^export\s+class\s+(\w+)/);
      if (classMatch && classMatch[1].endsWith('Form')) {
        inClass = true;
        braceDepth = 0;
        inDecorator = false;
        decoratorParenDepth = 0;
        currentClass = { className: classMatch[1], fields: [] };
        // class 开头行本身含有 {，计入深度
        for (const ch of line) {
          if (ch === '{') braceDepth++;
          if (ch === '}') braceDepth--;
        }
        continue;
      }
    }
    
    if (!inClass) continue;

    // --- 装饰器括号跟踪 ---
    if (trimmed.startsWith('@')) {
      inDecorator = true;
      decoratorParenDepth = 0;
    }
    if (inDecorator) {
      for (const ch of line) {
        if (ch === '(') decoratorParenDepth++;
        if (ch === ')') {
          decoratorParenDepth--;
          if (decoratorParenDepth <= 0) {
            inDecorator = false;
            decoratorParenDepth = 0;
          }
        }
      }
      // 装饰器行不计入 class 花括号深度，直接跳过
      continue;
    }

    // --- class 花括号深度（非装饰器行）---
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }

    // --- 提取字段 ---
    // 跳过注释行
    if (!trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('/*')) {
      const fieldMatch = line.match(/^\s{2,}(\w+)\s*\??\s*:/);
      if (fieldMatch && currentClass) {
        const fieldName = fieldMatch[1];
        if (!SKIP_WORDS.has(fieldName) && !currentClass.fields.includes(fieldName)) {
          currentClass.fields.push(fieldName);
        }
      }
    }

    // --- class 结束 ---
    if (braceDepth === 0 && currentClass) {
      if (currentClass.fields.length > 0) {
        classes.push(currentClass);
      }
      inClass = false;
      currentClass = null;
    }
  }
  
  return classes;
}

/**
 * 根据 class 名称推断内容类型
 */
function inferContentType(className) {
  const lower = className.toLowerCase();
  if (lower.includes('video') || lower.includes('shipin') || lower.includes('video')) return 'video';
  if (lower.includes('imagetext') || lower.includes('image') || lower.includes('tuwenform') || lower.includes('dynamic')) return 'imageText';
  if (lower.includes('article') || lower.includes('wenzhang') || lower.includes('post')) return 'article';
  return null;
}

/**
 * 合并多个 Form 的字段（去重）
 */
function mergeFields(classes) {
  const allFields = new Set();
  for (const cls of classes) {
    for (const field of cls.fields) {
      allFields.add(field);
    }
  }
  return Array.from(allFields);
}

/**
 * 从 class 名称列表推断 supportedTypes
 */
function inferSupportedTypes(classes) {
  const types = new Set();
  for (const cls of classes) {
    const lower = cls.className.toLowerCase();
    if (lower.includes('video')) types.add('video');
    if (lower.includes('imagetext') || lower.includes('image') || lower.includes('dynamic') || lower.includes('tuwen')) types.add('imageText');
    if (lower.includes('article') || lower.includes('wenzhang') || lower.includes('post') || lower.includes('article')) types.add('article');
  }
  // 如果只有一个 Form 且无法推断，默认 video
  if (types.size === 0) types.add('video');
  return Array.from(types);
}

// ==================== 主流程 ====================

console.log('🔄 开始从 DTO 文件生成 platform-rules.ts...\n');

const dtoFiles = fs.readdirSync(SOURCE_DIR)
  .filter(f => f.endsWith('.dto.ts') && !['platform-base.dto.ts', 'publish-form-view.dto.ts'].includes(f));

console.log(`📂 找到 ${dtoFiles.length} 个平台 DTO 文件\n`);

console.log('📂 正在解析 md 文档中的必填字段...');
const mdRequiredFields = parseMdFiles();
console.log(`   解析完成: ${Object.keys(mdRequiredFields).length} 个平台\n`);

const platformRules = {};
const stats = { success: 0, skipped: 0, noFields: 0 };

for (const file of dtoFiles) {
  const slug = file.replace('.dto.ts', '');
  const meta = PLATFORM_META[slug];
  
  if (!meta) {
    console.log(`⚠️  跳过未配置的平台: ${file}`);
    stats.skipped++;
    continue;
  }
  
  const filePath = path.join(SOURCE_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const classes = parseDtoFile(content);
  
  if (classes.length === 0) {
    console.log(`⚠️  ${file}: 未找到 Form 类，跳过`);
    stats.noFields++;
    continue;
  }
  
  const supportedTypes = inferSupportedTypes(classes);
  const platformFields = mergeFields(classes);
  
  const mdFields = mdRequiredFields[meta.code] || { required: [], optional: [] };
  
  platformRules[meta.code] = {
    code: meta.code,
    name: meta.name,
    supportedTypes,
    platformFields,
    fields: mdFields
  };
  
  console.log(`✅ ${slug} -> ${meta.code} (${meta.name})`);
  console.log(`   类型: [${supportedTypes.join(', ')}] | 字段数: ${platformFields.length} | 必填: ${mdFields.required.length}`);
  stats.success++;
}

// 额外添加豆包（无 DTO 文件）
const mdFieldsDouBao = mdRequiredFields['AI_DouBao'] || { required: [], optional: [] };
platformRules['AI_DouBao'] = {
  code: 'AI_DouBao',
  name: '豆包',
  supportedTypes: ['article'],
  platformFields: ['title', 'description', 'content', 'tags', 'category', 'subCategory'],
  fields: mdFieldsDouBao
};

// 额外添加西瓜视频（无独立 DTO）
const mdFieldsXiGua = mdRequiredFields['XiGuaShiPin'] || { required: [], optional: [] };
platformRules['XiGuaShiPin'] = {
  code: 'XiGuaShiPin',
  name: '西瓜视频',
  supportedTypes: ['video'],
  platformFields: ['title', 'description', 'covers', 'video', 'tags', 'category', 'subCategory', 'prePubTime', 'statement', 'pubType'],
  fields: mdFieldsXiGua
};

// ==================== 特殊规则 ====================
if (platformRules['CheJiaHao']) {
  platformRules['CheJiaHao'].titleLength = { min: 6, max: 30 };
  platformRules['CheJiaHao'].fields = platformRules['CheJiaHao'].fields || { required: [], optional: [] };
}

if (platformRules['WangYiHao']) {
  platformRules['WangYiHao'].titleLength = { min: 5, max: 50 };
  platformRules['WangYiHao'].fields = platformRules['WangYiHao'].fields || { required: [], optional: [] };
}

if (platformRules['YiCheHao']) {
  platformRules['YiCheHao'].titleLength = { min: 5, max: 28 };
  platformRules['YiCheHao'].fields = platformRules['YiCheHao'].fields || { required: [], optional: [] };
  if (!platformRules['YiCheHao'].fields.required.includes('category')) {
    platformRules['YiCheHao'].fields.required.push('category');
  }
}

if (platformRules['BiLiBiLi']) {
  platformRules['BiLiBiLi'].fields = platformRules['BiLiBiLi'].fields || { required: [], optional: [] };
  if (!platformRules['BiLiBiLi'].fields.required.includes('category')) {
    platformRules['BiLiBiLi'].fields.required.push('category');
  }
}

// ==================== 生成 TS 文件 ====================

function generateTs(rules) {
  const lines = [];
  
  lines.push(`/**`);
  lines.push(` * platform-rules.ts`);
  lines.push(` * `);
  lines.push(` * ⚠️  此文件由脚本自动生成，请勿手动修改！`);
  lines.push(` * 生成命令：node scripts/generate-platform-rules.mjs`);
  lines.push(` * 生成时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`export interface FieldRule {`);
  lines.push(`  required?: boolean;`);
  lines.push(`  type?: 'string' | 'number' | 'array' | 'object';`);
  lines.push(`  minLength?: number;`);
  lines.push(`  maxLength?: number;`);
  lines.push(`  min?: number;`);
  lines.push(`  max?: number;`);
  lines.push(`  pattern?: string;`);
  lines.push(`  patternMessage?: string;`);
  lines.push(`  items?: {`);
  lines.push(`    type?: 'string' | 'number' | 'object';`);
  lines.push(`    minLength?: number;`);
  lines.push(`    maxLength?: number;`);
  lines.push(`  };`);
  lines.push(`  options?: string[];`);
  lines.push(`  optionsMessage?: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PlatformRule {`);
  lines.push(`  code: string;`);
  lines.push(`  name: string;`);
  lines.push(`  supportedTypes: ('video' | 'imageText' | 'article')[];`);
  lines.push(`  platformFields: string[];`);
  lines.push(`  titleLength?: {`);
  lines.push(`    min: number;`);
  lines.push(`    max: number;`);
  lines.push(`  };`);
  lines.push(`  fields?: Record<string, FieldRule>;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const PLATFORM_RULES: Record<string, PlatformRule> = {`);
  
  for (const [key, rule] of Object.entries(rules)) {
    const types = rule.supportedTypes.map(t => `'${t}'`).join(', ');
    const fields = rule.platformFields.map(f => `'${f}'`).join(', ');
    
    let fieldsOutput = '';
    if (rule.fields && (rule.fields.required.length > 0 || rule.fields.optional.length > 0)) {
      const requiredArr = rule.fields.required.map(f => `'${f}'`).join(', ');
      const optionalArr = rule.fields.optional.map(f => `'${f}'`).join(', ');
      
      const fieldRules = [];
      if (rule.fields.required.length > 0) {
        fieldRules.push(`required: [${requiredArr}]`);
      }
      if (rule.fields.optional.length > 0) {
        fieldRules.push(`optional: [${optionalArr}]`);
      }
      fieldsOutput = `, fields: { ${fieldRules.join(', ')} }`;
    }
    
    let titleLengthOutput = '';
    if (rule.titleLength) {
      titleLengthOutput = `, titleLength: { min: ${rule.titleLength.min}, max: ${rule.titleLength.max} }`;
    }
    
    lines.push(`  ${key}: { code: '${rule.code}', name: '${rule.name}', supportedTypes: [${types}], platformFields: [${fields}]${fieldsOutput}${titleLengthOutput} },`);
  }
  
  lines.push(`};`);
  lines.push(``);
  lines.push(`export enum TimeUnit {`);
  lines.push(`  Day = 'day',`);
  lines.push(`  Minute = 'minute',`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export enum FormType {`);
  lines.push(`  Platform = 'platform',`);
  lines.push(`  Task = 'task',`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export enum PublishChannel {`);
  lines.push(`  Cloud = 'cloud',`);
  lines.push(`  Local = 'local',`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export enum PublishType {`);
  lines.push(`  Article = 'article',`);
  lines.push(`  ImageText = 'imageText',`);
  lines.push(`  Video = 'video',`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function getPlatformRule(platformCode: string): PlatformRule | undefined {`);
  lines.push(`  return PLATFORM_RULES[platformCode];`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function getAllPlatforms(): PlatformRule[] {`);
  lines.push(`  return Object.values(PLATFORM_RULES);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function buildContentPublishForm(`);
  lines.push(`  publishType: 'video' | 'imageText' | 'article',`);
  lines.push(`  params: {`);
  lines.push(`    title?: string;`);
  lines.push(`    description?: string;`);
  lines.push(`    createType?: number;`);
  lines.push(`    pubType?: number;`);
  lines.push(`    tags?: string[];`);
  lines.push(`  }`);
  lines.push(`): Record<string, any> {`);
  lines.push(`  const form: Record<string, any> = {`);
  lines.push(`    formType: 'task',`);
  lines.push(`    covers: [],`);
  lines.push(`  };`);
  lines.push(``);
  lines.push(`  if (publishType === 'video') {`);
  lines.push(`    form.title = params.title || '';`);
  lines.push(`    form.description = params.description || '';`);
  lines.push(`    form.declaration = 0;`);
  lines.push(`    form.tagType = '位置';`);
  lines.push(`    form.visibleType = 0;`);
  lines.push(`    form.allow_save = 1;`);
  lines.push(`  } else if (publishType === 'imageText') {`);
  lines.push(`    form.title = params.title || '';`);
  lines.push(`    form.description = params.description || '';`);
  lines.push(`    form.declaration = 0;`);
  lines.push(`    form.type = 0;`);
  lines.push(`    form.visibleType = 0;`);
  lines.push(`  } else if (publishType === 'article') {`);
  lines.push(`    form.title = params.title || '';`);
  lines.push(`    form.description = params.description || '';`);
  lines.push(`    form.type = 0;`);
  lines.push(`    form.visibleType = 0;`);
  lines.push(`    form.verticalCovers = [];`);
  lines.push(`    if (typeof params.createType === 'number') form.createType = params.createType;`);
  lines.push(`    if (typeof params.pubType === 'number') form.pubType = params.pubType;`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  if (params.tags && params.tags.length > 0) {`);
  lines.push(`    form.tags = params.tags;`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return form;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function buildPlatformPublishForm(`);
  lines.push(`  publishType: 'video' | 'imageText' | 'article',`);
  lines.push(`  platformCode: string,`);
  lines.push(`  params: {`);
  lines.push(`    title?: string;`);
  lines.push(`    description?: string;`);
  lines.push(`    createType?: number;`);
  lines.push(`    pubType?: number;`);
  lines.push(`    tags?: string[];`);
  lines.push(`  }`);
  lines.push(`): Record<string, any> {`);
  lines.push(`  const rule = getPlatformRule(platformCode);`);
  lines.push(`  if (!rule) return {};`);
  lines.push(`  return buildContentPublishForm(publishType, params);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function validatePublishParams(`);
  lines.push(`  platformCode: string,`);
  lines.push(`  publishType: 'video' | 'imageText' | 'article'`);
  lines.push(`): { valid: boolean; errors: string[] } {`);
  lines.push(`  const rule = getPlatformRule(platformCode);`);
  lines.push(`  if (!rule) {`);
  lines.push(`    return { valid: false, errors: [\`不支持的平台: \${platformCode}\`] };`);
  lines.push(`  }`);
  lines.push(`  if (!rule.supportedTypes.includes(publishType)) {`);
  lines.push(`    return { valid: false, errors: [\`\${rule.name}不支持\${publishType}类型\`] };`);
  lines.push(`  }`);
  lines.push(`  return { valid: true, errors: [] };`);
  lines.push(`}`);
  
  return lines.join('\n');
}

const tsContent = generateTs(platformRules);
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

const totalPlatforms = Object.keys(platformRules).length;
const totalFields = Object.values(platformRules).reduce((sum, r) => sum + r.platformFields.length, 0);

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ 生成完成！`);
console.log(`   输出文件: ${OUTPUT_FILE}`);
console.log(`   平台总数: ${totalPlatforms} 个`);
console.log(`   字段总数: ${totalFields} 个`);
console.log(`   成功解析: ${stats.success} 个`);
console.log(`   跳过: ${stats.skipped} 个`);
console.log(`${'='.repeat(50)}\n`);
console.log(`📦 下一步：运行 npm run build 重新构建`);
