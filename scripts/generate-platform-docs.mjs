import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const SOURCE_DIR = 'C:\\work\\yixiaoer\\yixiaoer-universal\\apps\\server-api\\packages\\yxr-open-platform\\src\\models\\platform';
const OUTPUT_DIR = 'C:\\work\\yixiaoer\\yixiaoer-skill\\docs\\platforms';

// 平台名称映射（用于生成文件名）
const PLATFORM_NAME_MAP = {
  'acfun': 'AcFun',
  'aiqiyi': 'AiQiYi',
  'baijiahao': 'BaiJiaHao',
  'bilibili': 'BiLiBiLi',
  'chejiahao': 'Chejiahao',
  'csdn': 'CSDN',
  'dayuhao': 'DaYuHao',
  'dewu': 'DeWu',
  'douban': 'DouBan',
  'douyin': 'DouYin',
  'duoduoshipin': 'DuoDuoShiPin',
  'fengwang': 'FengWang',
  'jianshu': 'JianShu',
  'kuaichuanhao': 'KuaiChuanHao',
  'kuaishou': 'KuaiShou',
  'meipai': 'MeiPai',
  'meiyou': 'MeiYou',
  'pipixia': 'PiPiXia',
  'qiehao': 'QiEHao',
  'shipinghao': 'ShiPinHao',
  'souhuhao': 'SouHuHao',
  'souhushipin': 'SouHuShiPin',
  'tengxunshipin': 'TengXunShiPin',
  'tengxunweishi': 'TengXunWeiShi',
  'toutiaohao': 'TouTiaoHao',
  'wangyihao': 'WangYiHao',
  'wifiwanneng': 'WiFiWanNeng',
  'wxgongzhonghao': 'WeiXinGongZhongHao',
  'xiaohongshu': 'XiaoHongShu',
  'xiaohongshushop': 'XiaoHongShuShop',
  'xinlangweibo': 'XinLangWeiBo',
  'xueqiuhao': 'XueQiuHao',
  'yichehao': 'YiCheHao',
  'yidianhao': 'YiDianHao',
  'zhihu': 'ZhiHu'
};

// 解析 TypeScript DTO 文件
function parseDTOFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.dto.ts');
  
  const result = {
    fileName: fileName,
    platformName: PLATFORM_NAME_MAP[fileName] || fileName,
    forms: []
  };

  // 匹配 class 定义 - 改进正则以处理嵌套花括号
  const classRegex = /export\s+class\s+(\w+Form)\s+extends\s+\w+\s*\{/g;
  let classMatch;
  
  while ((classMatch = classRegex.exec(content)) !== null) {
    const className = classMatch[1];
    const startIndex = classMatch.index + classMatch[0].length - 1;
    
    // 找到匹配的结束花括号
    let braceCount = 1;
    let endIndex = startIndex + 1;
    while (braceCount > 0 && endIndex < content.length) {
      if (content[endIndex] === '{') braceCount++;
      if (content[endIndex] === '}') braceCount--;
      endIndex++;
    }
    
    const classBody = content.substring(startIndex + 1, endIndex - 1);
    
    const form = {
      name: className,
      type: getFormType(className),
      fields: []
    };

    // 匹配字段定义 - 改进正则
    const fieldRegex = /@ApiProperty\(\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\)\s*(?:@[^\n]+\s*)*\s*(\w+)(\??):\s*(\w+(?:\[\])?)/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(classBody)) !== null) {
      const apiPropertyContent = fieldMatch[1];
      const fieldName = fieldMatch[2];
      const isOptional = fieldMatch[3] === '?';
      const fieldType = fieldMatch[4];
      
      // 解析 ApiProperty
      const description = extractValue(apiPropertyContent, 'description');
      const required = extractValue(apiPropertyContent, 'required');
      
      form.fields.push({
        name: fieldName,
        type: fieldType,
        required: required === 'true' ? true : (required === 'false' ? false : !isOptional),
        description: description || ''
      });
    }

    if (form.fields.length > 0) {
      result.forms.push(form);
    }
  }

  return result;
}

// 提取属性值
function extractValue(content, key) {
  const regex = new RegExp(`${key}:\\s*([^,\\n]+)`);
  const match = content.match(regex);
  if (match) {
    let value = match[1].trim();
    // 去除引号
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    return value;
  }
  return null;
}

// 获取表单类型
function getFormType(className) {
  if (className.includes('Video')) return '视频';
  if (className.includes('Dynamic') || className.includes('Image')) return '图文/动态';
  if (className.includes('Article')) return '文章';
  return '通用';
}

// 生成 Markdown 文档
function generateMarkdown(platformData) {
  let md = `# ${platformData.platformName} 平台发布字段\n\n`;
  md += `> 来源: \`${platformData.fileName}.dto.ts\`\n\n`;
  
  if (platformData.forms.length === 0) {
    md += '暂无表单字段定义。\n';
    return md;
  }

  platformData.forms.forEach((form, index) => {
    md += `## ${index + 1}. ${form.name} (${form.type})\n\n`;
    
    if (form.fields.length === 0) {
      md += '暂无字段定义。\n\n';
      return;
    }

    md += '| 字段名 | 类型 | 必填 | 描述 |\n';
    md += '|--------|------|------|------|\n';
    
    form.fields.forEach(field => {
      const requiredText = field.required ? '✅ 是' : '❌ 否';
      const description = field.description.replace(/\|/g, '\\|');
      md += `| \`${field.name}\` | ${field.type} | ${requiredText} | ${description} |\n`;
    });
    
    md += '\n';
  });

  return md;
}

// 主函数
function main() {
  console.log('开始解析平台 DTO 文件...\n');

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`创建目录: ${OUTPUT_DIR}`);
  }

  // 读取所有 DTO 文件
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.endsWith('.dto.ts') && 
      !file.includes('platform-base') && 
      !file.includes('publish-form-view'));

  console.log(`找到 ${files.length} 个平台 DTO 文件\n`);

  const summary = [];

  files.forEach(file => {
    const filePath = path.join(SOURCE_DIR, file);
    const platformData = parseDTOFile(filePath);
    
    if (platformData.forms.length > 0) {
      const mdContent = generateMarkdown(platformData);
      const outputFileName = `${platformData.platformName}.md`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);
      
      fs.writeFileSync(outputPath, mdContent, 'utf-8');
      
      console.log(`✅ ${file} -> ${outputFileName}`);
      console.log(`   表单数: ${platformData.forms.length}, 总字段数: ${platformData.forms.reduce((sum, f) => sum + f.fields.length, 0)}`);
      
      summary.push({
        platform: platformData.platformName,
        file: outputFileName,
        forms: platformData.forms.length,
        fields: platformData.forms.reduce((sum, f) => sum + f.fields.length, 0)
      });
    } else {
      console.log(`⚠️ ${file} - 未找到表单定义`);
    }
  });

  // 生成汇总文件
  generateSummary(summary);
  
  console.log('\n========================================');
  console.log('处理完成！');
  console.log(`共处理 ${summary.length} 个平台`);
  console.log(`总字段数: ${summary.reduce((sum, s) => sum + s.fields, 0)}`);
  console.log('========================================');
}

// 生成汇总文档
function generateSummary(summary) {
  let md = '# 平台发布字段汇总\n\n';
  md += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  md += `共 ${summary.length} 个平台\n\n`;
  
  md += '| 平台 | 文件 | 表单数 | 字段数 |\n';
  md += '|------|------|--------|--------|\n';
  
  summary.forEach(item => {
    md += `| ${item.platform} | [${item.file}](./${item.file}) | ${item.forms} | ${item.fields} |\n`;
  });

  md += '\n## 使用说明\n\n';
  md += '本文档由 DTO 文件自动生成，包含各平台的发布表单字段定义。\n\n';
  md += '- ✅ 表示必填字段\n';
  md += '- ❌ 表示可选字段\n';
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), md, 'utf-8');
  console.log('\n✅ 生成汇总文档: README.md');
}

main();
