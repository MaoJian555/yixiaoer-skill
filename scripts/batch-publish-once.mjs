import { setApiKey, getClient } from '../dist/api/client.js';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');
const client = getClient();

const videoKey = 'yfb/test/t-6821ac8d50bc5fd636fa9801/anbz1jnpyq3sl5ckdzkpn';
const coverKey = 'yfb/test/t-6821ac8d50bc5fd636fa9801/ib-ijcaajrqn7gfae96jg';
const clientId = 'aalB6qHL_6CHVkh-NPTOI';

const accounts = [
  { id: '698c344085b58ebe16a1b328', platform: '快手-Open' },
  { id: '69843b44e035256613814280', platform: '爱奇艺' },
  { id: '6981ab6b6bc8016c64d5077f', platform: '腾讯视频' },
  { id: '698162c16bc8016c64d4a43d', platform: '得物' },
  { id: '695f1adea24f00bac8336f95', platform: '新浪微博' },
  { id: '694ce3375ed9f3e7e42209e6', platform: '网易号' },
  { id: '693a3a25dc277ba9fb393c62', platform: '哔哩哔哩' },
  { id: '691307511a22fc430aeebf49', platform: '知乎' },
  { id: '690aeaeb7b38542dc23f9297', platform: '快手' },
  { id: '68d3d0eafc771bf62ab9a6fc', platform: 'AcFun' },
  { id: '68d23ef16373d7f9b456e790', platform: '皮皮虾' },
  { id: '68d12f706373d7f9b456c140', platform: '一点号' },
  { id: '68d10de8d1a3e03a3e68982a', platform: '头条号' },
  { id: '68ccc97ea54f45fdfdbcc0e3', platform: '大鱼号' },
  { id: '68cbcd31c938ba504f80ec58', platform: '搜狐视频' },
  { id: '68cbcc11c938ba504f80e9f2', platform: '美拍' },
  { id: '68c94c0eaa91a43b3ea2f2a3', platform: '小红书' },
];

const accountForms = accounts.map(a => ({
  platformAccountId: a.id,
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
}));

const platformForms = {};
accounts.forEach(a => { platformForms[a.platform] = { formType: 'task' }; });

console.log(`🚀 一次请求批量发布 ${accounts.length} 个账号（本机发布）...`);

try {
  const res = await client.publishTask({
    clientId,
    platforms: accounts.map(a => a.platform),
    publishType: 'video',
    publishChannel: 'local',
    coverKey,
    publishArgs: {
      accountForms,
      platformForms,
    }
  });

  console.log(`\n✅ 批量发布成功！`);
  console.log(`taskSetId: ${JSON.stringify(res)}`);
  console.log(`发布账号数: ${accounts.length}`);
  console.log(`平台列表: ${accounts.map(a => a.platform).join('、')}`);
} catch (e) {
  console.error(`❌ 批量发布失败: ${e.message}`);
}
