import { setApiKey, getClient } from '../dist/api/client.js';
import { buildContentPublishForm, PLATFORM_RULES } from '../dist/config/platform-rules.js';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');

// 模拟上次小红书图文发布的参数
const publishType = 'imageText';
const platformCode = 'XiaoHongShu';
const rule = PLATFORM_RULES[platformCode];

const baseForm = buildContentPublishForm(publishType, {
  title: '🍥火影忍者｜那些年我们追过的经典角色',
  description: '分享一段精彩的视频内容，欢迎点赞关注！',
});

const finalContentPublishForm = {
  ...baseForm,
};

const accountForm = {
  platformAccountId: '68d3cdebfc771bf62ab99f9d',
  coverKey: undefined,
  contentPublishForm: finalContentPublishForm,
  images: [
    {
      path: 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg',
      width: 1080,
      height: 1920,
      size: 0,
    }
  ],
  cover: {
    path: 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg',
    width: 1080,
    height: 1920,
    size: 0,
  }
};

const publishArgs = {
  clientId: null,
  platforms: [rule.name],
  publishType,
  publishChannel: 'cloud',
  coverKey: '',
  publishArgs: {
    accountForms: [accountForm],
    platformForms: {
      [rule.name]: { formType: 'task' }
    },
    content: '🔥 火影忍者，一代人的青春记忆！...',
  },
};

console.log('========== 实际传给 API 的完整参数 ==========');
console.log(JSON.stringify(publishArgs, null, 2));
console.log('\n========== contentPublishForm 详情 ==========');
console.log(JSON.stringify(finalContentPublishForm, null, 2));
console.log('\n========== 平台规则字段 ==========');
console.log('平台:', rule.name);
console.log('支持类型:', rule.supportedTypes);
console.log('平台字段:', rule.platformFields);
