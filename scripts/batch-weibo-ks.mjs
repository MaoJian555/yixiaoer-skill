import { setApiKey, getClient } from '../dist/api/client.js';
import { YixiaoerService } from '../dist/services/yixiaoer.service.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');
const service = YixiaoerService.getInstance();

async function uploadFile(filePath) {
  const client = getClient();
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const uploadResult = await client.getUploadUrl(fileName, fileSize, contentType);
  await axios.put(uploadResult.uploadUrl, fs.createReadStream(filePath), {
    headers: { 'Content-Type': contentType, 'Content-Length': fileSize },
    maxContentLength: Infinity, maxBodyLength: Infinity,
  });
  console.log(`  ✅ ${fileName} → key: ${uploadResult.fileKey}`);
  return { key: uploadResult.fileKey, size: fileSize };
}

// 新浪微博 + 快手
const accounts = [
  { id: '695f1adea24f00bac8336f95', platform: '新浪微博' },
  { id: '690aeaeb7b38542dc23f9297', platform: '快手' },
];

async function main() {
  // 上传封面
  console.log('📤 上传封面...');
  const coverInfo = await uploadFile('C:\\Users\\18390\\Downloads\\v2-99e6cfe7bf790affc187b4e6787dabbf_1440w.png');

  // 上传图文图片
  console.log('📤 上传图文图片...');
  const img1 = await uploadFile('C:\\Users\\18390\\Downloads\\v2-1a623f9d225d10519fa9b155c920384c_1440w.jpg');
  const img2 = await uploadFile('C:\\Users\\18390\\Downloads\\v2-81590c517a06a94502b786c692db7610_1440w.png');

  const images = [
    { key: img1.key, width: 1440, height: 1080, size: img1.size },
    { key: img2.key, width: 1440, height: 1080, size: img2.size },
  ];
  const coverObj = { key: coverInfo.key, width: 1440, height: 1080, size: coverInfo.size };

  // 构建 accountForms
  const accountForms = accounts.map(a => ({
    platformAccountId: a.id,
    coverKey: coverInfo.key,
    cover: coverObj,
    images,
    contentPublishForm: {
      formType: 'task',
      covers: [coverObj],
      images,
      title: '爱火影',
      desc: '火影忍者，一代人的青春记忆。鸣人、佐助、卡卡西……那些热血的岁月永远不会忘记。#火影忍者 #鸣人 #佐助 #动漫',
      description: '火影忍者，一代人的青春记忆。鸣人、佐助、卡卡西……那些热血的岁月永远不会忘记。#火影忍者 #鸣人 #佐助 #动漫',
      declaration: 0,
      visibleType: 0,
    }
  }));

  const platforms = accounts.map(a => a.platform);

  console.log(`\n🚀 调用插件 batchPublish 批量发布图文（新浪微博 + 快手）...`);
  console.log(`📋 传入账号数: ${accounts.length} 个`);

  const result = await service.batchPublish({
    accountForms,
    platforms,
    publishType: 'imageText',
    publishChannel: 'local',
    clientId: 'aalB6qHL_6CHVkh-NPTOI',
    coverKey: coverInfo.key
  });

  console.log(`\n========== 发布结果 ==========`);
  console.log(`success: ${result.success}`);
  console.log(`message: ${result.message}`);
  if (result.data) {
    console.log(`有效账号: ${result.data.validCount} 个`);
    console.log(`过滤账号: ${result.data.filteredCount} 个`);
  }
}

main().catch(e => console.error('❌ 错误:', e.message));
