import { setApiKey, getClient } from '../dist/api/client.js';
import { publishContent } from '../dist/modules/publish.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');
const client = getClient();

// 上传文件到 OSS
async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.mp4' ? 'video/mp4' : 'image/jpeg';

  const uploadResult = await client.getUploadUrl(fileName, fileSize, contentType);
  const fileStream = fs.createReadStream(filePath);
  await axios.put(uploadResult.uploadUrl, fileStream, {
    headers: { 'Content-Type': contentType, 'Content-Length': fileSize },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  return { key: uploadResult.fileKey, size: fileSize };
}

// 测试发布分组的视频账号
const accounts = [
  { id: '698c344085b58ebe16a1b328', name: 'M、',           platform: '快手-Open' },
  { id: '69843b44e035256613814280', name: '瓜子爱测试',     platform: '爱奇艺' },
  { id: '6981ab6b6bc8016c64d5077f', name: '王者体验服',     platform: '腾讯视频' },
  { id: '698162c16bc8016c64d4a43d', name: '得物er-Y3M1P0L3', platform: '得物' },
  { id: '695f1adea24f00bac8336f95', name: '快乐的嘻鱼',     platform: '新浪微博' },
  { id: '694ce3375ed9f3e7e42209e6', name: '爱分享的瓜子',   platform: '网易号' },
  { id: '693a3a25dc277ba9fb393c62', name: '看剧的瓜子',     platform: '哔哩哔哩' },
  { id: '691307511a22fc430aeebf49', name: '瓜子',           platform: '知乎' },
  { id: '690aeaeb7b38542dc23f9297', name: '瓜子',           platform: '快手' },
  { id: '68d3d0eafc771bf62ab9a6fc', name: 'XxXxXxXxCc',    platform: 'AcFun' },
  { id: '68d23ef16373d7f9b456e790', name: '皮皮侠115534574', platform: '皮皮虾' },
  { id: '68d12f706373d7f9b456c140', name: '聪明的一点SIA',  platform: '一点号' },
  { id: '68d10de8d1a3e03a3e68982a', name: '爱剪辑的瓜子',  platform: '头条号' },
  { id: '68ccc97ea54f45fdfdbcc0e3', name: '瓜子爱生活',     platform: '大鱼号' },
  { id: '68cbcd31c938ba504f80ec58', name: '搜狐视频瓜子',   platform: '搜狐视频' },
  { id: '68cbcc11c938ba504f80e9f2', name: 'M120930519...',  platform: '美拍' },
  { id: '68c94c0eaa91a43b3ea2f2a3', name: '瓜子',           platform: '小红书' },
];

const videoPath = 'C:\\Users\\18390\\Videos\\飞书20250722-092749.mp4';
const coverPath = 'C:\\Users\\18390\\AppData\\Local\\Temp\\cover_batch.jpg';

console.log('📤 上传视频到 OSS（只上传一次）...');
const videoInfo = await uploadFile(videoPath);
console.log('✅ 视频上传成功, key:', videoInfo.key);

console.log('📤 上传封面到 OSS...');
const coverInfo = await uploadFile(coverPath);
console.log('✅ 封面上传成功, key:', coverInfo.key);

console.log(`\n🚀 开始批量发布到 ${accounts.length} 个账号...\n`);

const results = [];
for (const account of accounts) {
  try {
    const res = await client.publishTask({
      clientId: null,
      platforms: [account.platform],
      publishType: 'video',
      publishChannel: 'cloud',
      coverKey: coverInfo.key,
      publishArgs: {
        accountForms: [{
          platformAccountId: account.id,
          coverKey: coverInfo.key,
          cover: { key: coverInfo.key, width: 1280, height: 720, size: coverInfo.size },
          video: { key: videoInfo.key, duration: 0, width: 1280, height: 720, size: videoInfo.size },
          contentPublishForm: {
            formType: 'task',
            covers: [{ key: coverInfo.key, width: 1280, height: 720, size: coverInfo.size }],
            title: '雨一直下',
            description: '雨一直下，气氛不算融洽...',
            declaration: 0,
            visibleType: 0,
          }
        }],
        platformForms: { [account.platform]: { formType: 'task' } },
      }
    });
    console.log(`✅ ${account.platform}(${account.name}): 发布成功 taskId=${res}`);
    results.push({ platform: account.platform, name: account.name, success: true, taskId: res });
  } catch (e) {
    console.log(`❌ ${account.platform}(${account.name}): ${e.message}`);
    results.push({ platform: account.platform, name: account.name, success: false, error: e.message });
  }
}

const successCount = results.filter(r => r.success).length;
const failCount = results.filter(r => !r.success).length;
console.log(`\n========== 批量发布完成 ==========`);
console.log(`✅ 成功: ${successCount} 个`);
console.log(`❌ 失败: ${failCount} 个`);
if (failCount > 0) {
  console.log('\n失败列表:');
  results.filter(r => !r.success).forEach(r => console.log(`  - ${r.platform}(${r.name}): ${r.error}`));
}
