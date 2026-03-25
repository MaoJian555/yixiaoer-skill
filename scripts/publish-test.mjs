import { publishContent } from '../dist/modules/publish.js';
import { setApiKey } from '../dist/api/client.js';

setApiKey('SwdbOYLjs1kwlh-4CZHZK');

const result = await publishContent({
  platform: '小红书',
  platformAccountId: '68d3cdebfc771bf62ab99f9d',
  title: '🍥火影忍者｜那些年我们追过的经典角色',
  description: `🔥 火影忍者，一代人的青春记忆！

✨ 【漩涡鸣人】
从被全村嫌弃的孤儿，到守护木叶的第七代火影。
"我绝对不会放弃！这就是我的忍道！"
他用努力和坚持告诉我们：天才是1%的天赋+99%的汗水 💪

⚡ 【宇智波佐助】
复仇与救赎的矛盾体，最帅的叛逆少年。
黑色长发、写轮眼、孤独背影——
多少人因为他爱上了动漫？

👁️ 【旗木卡卡西】
永远遮着半张脸的神秘老师，
懒散外表下藏着最深的痛苦与责任感。
"那些不遵守规则的人是废物，但抛弃同伴的人连废物都不如。"

🌸 【春野樱】
从花瓶到医忍天才，她的成长让人动容。

💛 你最喜欢哪个角色？评论区告诉我！

#火影忍者 #鸣人 #佐助 #卡卡西 #动漫 #二次元 #青春回忆 #经典动漫`,
  imagePaths: [
    'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg'
  ],
  publishType: 'imageText',
  publishChannel: 'cloud',
  platforms: ['小红书'],
  isDraft: false
});

console.log(JSON.stringify(result, null, 2));
