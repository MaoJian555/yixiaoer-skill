import { setApiKey, getClient } from '../dist/api/client.js';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');
const client = getClient();

// 失败的 4 个账号，改用本机发布
const accounts = [
  { id: '695f1adea24f00bac8336f95', name: '快乐的嘻鱼',     platform: '新浪微博' },
  { id: '694ce3375ed9f3e7e42209e6', name: '爱分享的瓜子',   platform: '网易号' },
  { id: '68d23ef16373d7f9b456e790', name: '皮皮侠115534574', platform: '皮皮虾' },
  { id: '68c94c0eaa91a43b3ea2f2a3', name: '瓜子',           platform: '小红书' },
];

// 复用上次已上传的 OSS key
const videoKey  = 'yfb/test/t-6821ac8d50bc5fd636fa9801/anbz1jnpyq3sl5ckdzkpn';
const coverKey  = 'yfb/test/t-6821ac8d50bc5fd636fa9801/ib-ijcaajrqn7gfae96jg';
const clientId  = 'aalB6qHL_6CHVkh-NPTOI';

console.log(`🚀 本机发布重试 ${accounts.length} 个账号...\n`);

const results = [];
for (const account of accounts) {
  try {
    const res = await client.publishTask({
      clientId,
      platforms: [account.platform],
      publishType: 'video',
      publishChannel: 'local',
      coverKey,
      publishArgs: {
        accountForms: [{
          platformAccountId: account.id,
          coverKey,
          cover:  { key: coverKey, width: 1280, height: 720, size: 0 },
          video:  { key: videoKey, duration: 0, width: 1280, height: 720, size: 0 },
          contentPublishForm: {
            formType: 'task',
            covers: [{ key: coverKey, width: 1280, height: 720, size: 0 }],
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
const failCount    = results.filter(r => !r.success).length;
console.log(`\n========== 本机发布完成 ==========`);
console.log(`✅ 成功: ${successCount} 个`);
console.log(`❌ 失败: ${failCount} 个`);
if (failCount > 0) {
  results.filter(r => !r.success).forEach(r =>
    console.log(`  - ${r.platform}(${r.name}): ${r.error}`)
  );
}
