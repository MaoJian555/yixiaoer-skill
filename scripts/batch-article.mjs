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
  const contentType = ext === '.mp4' ? 'video/mp4' : 'image/jpeg';
  const uploadResult = await client.getUploadUrl(fileName, fileSize, contentType);
  const fileStream = fs.createReadStream(filePath);
  await axios.put(uploadResult.uploadUrl, fileStream, {
    headers: { 'Content-Type': contentType, 'Content-Length': fileSize },
    maxContentLength: Infinity, maxBodyLength: Infinity,
  });
  return { key: uploadResult.fileKey, size: fileSize };
}

const accounts = [
  { id: '69843bece03525661381465a', platform: '搜狐号' },
  { id: '6967455fce1b53b827c89544', platform: '快传号' },
  { id: '695f1adea24f00bac8336f95', platform: '新浪微博' },
  { id: '694ce3375ed9f3e7e42209e6', platform: '网易号' },
  { id: '693a3a25dc277ba9fb393c62', platform: '哔哩哔哩' },
  { id: '691307511a22fc430aeebf49', platform: '知乎' },
  { id: '68d3d0eafc771bf62ab9a6fc', platform: 'AcFun' },
  { id: '68d23e64d1a3e03a3e68e234', platform: '雪球号' },
  { id: '68d12f706373d7f9b456c140', platform: '一点号' },
  { id: '68d12ecfd1a3e03a3e68bf93', platform: '豆瓣' },
  { id: '68d12e7ad1a3e03a3e68bed2', platform: '易车号' },
  { id: '68d12e4cd1a3e03a3e68be78', platform: '车家号' },
  { id: '68d12dc16373d7f9b456be5e', platform: '简书' },
  { id: '68d12d56d1a3e03a3e68bcb7', platform: 'CSDN' },
  { id: '68d10de8d1a3e03a3e68982a', platform: '头条号' },
  { id: '68ccc97ea54f45fdfdbcc0e3', platform: '大鱼号' },
];

const title = '爱火影';
const content = `# 爱火影——那些年，我们一起追过的忍者

火影忍者，不只是一部动漫，更是一代人的青春印记。

## 🍥 漩涡鸣人——永不放弃的信念

"我绝对不会放弃！这就是我的忍道！"

鸣人从一个被全村嫌弃的孤儿，一步步成长为守护木叶的第七代火影。
他的故事告诉我们：天赋不是最重要的，坚持才是。
没有人天生就是英雄，但每个人都可以选择成为英雄。

## ⚡ 宇智波佐助——孤独与救赎

佐助是整部作品最复杂的角色。
复仇、背叛、迷失、回归……
他走过了最黑暗的路，却也完成了最深刻的救赎。
"我一个人就够了"——这句话背后，藏着多少不为人知的孤独。

## 👁️ 旗木卡卡西——责任与牺牲

永远遮着半张脸的神秘老师。
懒散的外表下，是最深沉的痛苦与最坚定的责任感。
"那些不遵守规则的人是废物，但抛弃同伴的人连废物都不如。"
这句话，影响了多少人对友情的理解。

## 🌸 春野樱——成长的力量

从被嘲笑的"花瓶"，到令人敬畏的医忍天才。
樱的成长，是整部作品里最真实的蜕变。
她告诉我们：弱小不是罪，放弃才是。

## 💛 为什么爱火影？

因为它不只是打斗，更是关于：
- **友情**：鸣人与佐助，二十年的羁绊
- **成长**：每个角色都在用自己的方式变强
- **牺牲**：自来也、卡卡西、日向雏田……每一次告别都让人泪目
- **梦想**：成为火影，不只是一个职位，更是一种信念

## 结语

火影忍者陪伴了我们最重要的青春岁月。
那些热血的战斗、感人的羁绊、催泪的牺牲……
永远留在记忆深处。

**相信自己，永不放弃——这是火影教会我们最重要的事。**

#火影忍者 #鸣人 #佐助 #卡卡西 #动漫 #二次元 #青春 #经典`;

// 上传封面
console.log('📤 上传封面...');
const coverInfo = await uploadFile('C:\\Users\\18390\\Pictures\\1.jpg');
console.log('✅ 封面上传成功, key:', coverInfo.key);

const accountForms = accounts.map(a => ({
  platformAccountId: a.id,
  coverKey: coverInfo.key,
  cover: { key: coverInfo.key, width: 1080, height: 720, size: coverInfo.size },
  contentPublishForm: {
    formType: 'task',
    covers: [{ key: coverInfo.key, width: 1080, height: 720, size: coverInfo.size }],
    verticalCovers: [{ key: coverInfo.key, width: 1080, height: 720, size: coverInfo.size }],
    title,
    description: content,
    content,
    declaration: 0,
    type: 0,
    visibleType: 0,
  }
}));

const platformForms = {};
accounts.forEach(a => { platformForms[a.platform] = { formType: 'task' }; });

console.log(`\n🚀 一次请求批量发布文章到 ${accounts.length} 个账号（本机发布）...`);

try {
  const res = await client.publishTask({
    clientId: 'aalB6qHL_6CHVkh-NPTOI',
    platforms: accounts.map(a => a.platform),
    publishType: 'article',
    publishChannel: 'local',
    coverKey: coverInfo.key,
    publishArgs: { accountForms, platformForms, content }
  });

  console.log(`\n✅ 批量发布成功！`);
  console.log(`taskSetId: ${JSON.stringify(res)}`);
  console.log(`发布账号数: ${accounts.length}`);
  console.log(`平台列表: ${accounts.map(a => a.platform).join('、')}`);
} catch (e) {
  console.error(`❌ 批量发布失败: ${e.message}`);
}
