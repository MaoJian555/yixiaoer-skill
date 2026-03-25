import { setApiKey } from '../dist/api/client.js';
import { buildContentPublishForm, PLATFORM_RULES } from '../dist/config/platform-rules.js';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');

const publishType = 'imageText';
const rule = PLATFORM_RULES['XiaoHongShu'];

const baseForm = buildContentPublishForm(publishType, {
  title: '🍥火影忍者｜那些年我们追过的经典角色',
  description: '🔥 火影忍者，一代人的青春记忆！\n\n✨ 【漩涡鸣人】从被全村嫌弃的孤儿，到守护木叶的第七代火影。',
});

console.log('========== 修复后 contentPublishForm ==========');
console.log(JSON.stringify(baseForm, null, 2));

console.log('\n========== 修复验证 ==========');
console.log('✅ description 字段:', baseForm.description ? '已填入' : '❌ 缺失');
console.log('✅ covers 初始值:', JSON.stringify(baseForm.covers));
console.log('\n说明：covers 会在图片上传后自动填入第一张图片 key');
