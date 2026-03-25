import { setApiKey, getClient } from '../dist/api/client.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');
const client = getClient();

async function uploadFile(filePath) {
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

const accounts = [
  { id: '698c344085b58ebe16a1b328', platform: '快手-Open' },
  { id: '695f1adea24f00bac8336f95', platform: '新浪微博' },
  { id: '693a3a25dc277ba9fb393c62', platform: '哔哩哔哩' },
  { id: '690aeaeb7b38542dc23f9297', platform: '快手' },
  { id: '68d23ef16373d7f9b456e790', platform: '皮皮虾' },
  { id: '68c94c0eaa91a43b3ea2f2a3', platform: '小红书' },
];

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
    description: '火影忍者，一代人的青春记忆。鸣人、佐助、卡卡西……那些热血的岁月永远不会忘记。#火影忍者 #鸣人 #佐助 #动漫 #二次元',
    declaration: 0,
    visibleType: 0,
  }
}));

const platformForms = {};
accounts.forEach(a => { platformForms[a.platform] = { formType: 'task' }; });

console.log(`\n🚀 一次请求批量发布图文到 ${accounts.length} 个账号（本机发布）...`);

try {
  const res = await client.publishTask({
    clientId: 'aalB6qHL_6CHVkh-NPTOI',
    platforms: accounts.map(a => a.platform),
    publishType: 'imageText',
    publishChannel: 'local',
    coverKey: coverInfo.key,
    publishArgs: { accountForms, platformForms }
  });

  console.log(`\n✅ 批量发布成功！`);
  console.log(`taskSetId: ${JSON.stringify(res)}`);
  console.log(`发布账号数: ${accounts.length}`);
  console.log(`平台列表: ${accounts.map(a => a.platform).join('、')}`);
} catch (e) {
  console.error(`❌ 批量发布失败: ${e.message}`);
}
