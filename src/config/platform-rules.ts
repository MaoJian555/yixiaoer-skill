/**
 * platform-rules.ts
 * 
 * ⚠️  此文件由脚本自动生成，请勿手动修改！
 * 生成命令：node scripts/generate-platform-rules.mjs
 * 生成时间：2026/3/25 14:52:51
 */

export interface PlatformRule {
  code: string;
  name: string;
  supportedTypes: ('video' | 'imageText' | 'article')[];
  platformFields: string[];
}

export const PLATFORM_RULES: Record<string, PlatformRule> = {
  AcFun: { code: 'AcFun', name: 'AcFun', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'scheduledTime', 'covers', 'content', 'desc', 'contentSourceUrl'] },
  AiQiYi: { code: 'AiQiYi', name: '爱奇艺', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'content'] },
  BaiJiaHao: { code: 'BaiJiaHao', name: '百家号', supportedTypes: ['video', 'article', 'imageText'], platformFields: ['title', 'tags', 'declaration', 'location', 'scheduledTime', 'collection', 'activity', 'content', 'covers', 'category', 'cover'] },
  BiLiBiLi: { code: 'BiLiBiLi', name: '哔哩哔哩', supportedTypes: ['video', 'article', 'imageText'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'contentSourceUrl', 'collection', 'covers', 'content'] },
  CheJiaHao: { code: 'CheJiaHao', name: '车家号', supportedTypes: ['video', 'article'], platformFields: ['title', 'scheduledTime', 'covers', 'verticalCovers', 'content'] },
  CSDN: { code: 'CSDN', name: 'CSDN', supportedTypes: ['article'], platformFields: ['covers', 'title', 'content', 'desc', 'tags', 'contentSourceUrl', 'declaration', 'scheduledTime'] },
  DaYuHao: { code: 'DaYuHao', name: '大鱼号', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'scheduledTime', 'covers', 'verticalCovers', 'content'] },
  DeWu: { code: 'DeWu', name: '得物', supportedTypes: ['video'], platformFields: ['title', 'category', 'declaration'] },
  DouBan: { code: 'DouBan', name: '豆瓣', supportedTypes: ['article'], platformFields: ['title', 'content', 'tags'] },
  DouYin: { code: 'DouYin', name: '抖音', supportedTypes: ['video', 'imageText', 'article'], platformFields: ['title', 'horizontalCover', 'statement', 'location', 'scheduledTime', 'shoppingCart', 'groupShopping', 'collection', 'sub_collection', 'sync_apps', 'hot_event', 'challenge', 'allow_save', 'mini_app', 'music', 'cooperation_info', 'game', 'film', 'images', 'musice', 'content', 'covers', 'headImage', 'topics', 'visibleType'] },
  DuoDuoShiPin: { code: 'DuoDuoShiPin', name: '多多视频', supportedTypes: ['video'], platformFields: ['scheduledTime', 'shopping_cart'] },
  FengWang: { code: 'FengWang', name: '蜂网', supportedTypes: ['video'], platformFields: ['title', 'tags', 'category', 'scheduledTime'] },
  JianShu: { code: 'JianShu', name: '简书', supportedTypes: ['article'], platformFields: ['title', 'content'] },
  KuaiChuanHao: { code: 'KuaiChuanHao', name: '快传号', supportedTypes: ['article'], platformFields: ['covers', 'title', 'content', 'tags', 'scheduledTime'] },
  KuaiShou: { code: 'KuaiShou', name: '快手', supportedTypes: ['video', 'imageText'], platformFields: ['title', 'declaration', 'location', 'visibleType', 'scheduledTime', 'shopping_cart', 'collection', 'mini_app', 'nearby_show', 'allow_same_frame', 'allow_download', 'images', 'music'] },
  KuaiShouOpen: { code: 'KuaiShouOpen', name: '快手-Open', supportedTypes: ['video'], platformFields: ['title', 'declaration', 'location', 'visibleType', 'scheduledTime', 'shopping_cart', 'collection', 'mini_app', 'nearby_show', 'allow_same_frame', 'allow_download', 'music'] },
  MeiPai: { code: 'MeiPai', name: '美拍', supportedTypes: ['video'], platformFields: ['title', 'category', 'scheduledTime'] },
  MeiYou: { code: 'MeiYou', name: '美柚', supportedTypes: ['video'], platformFields: ['title', 'scheduledTime'] },
  QiEHao: { code: 'QiEHao', name: '企鹅号', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'covers', 'content'] },
  ShiPinHao: { code: 'ShiPinHao', name: '视频号', supportedTypes: ['video', 'imageText'], platformFields: ['title', 'short_title', 'location', 'scheduledTime', 'shoppingCart', 'horizontalCover', 'collection', 'activity', 'createType', 'pubType', 'images', 'music'] },
  SouHuHao: { code: 'SouHuHao', name: '搜狐号', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'covers', 'content', 'desc'] },
  SouHuShiPin: { code: 'SouHuShiPin', name: '搜狐视频', supportedTypes: ['video'], platformFields: ['title', 'tags', 'declaration'] },
  TengXunShiPin: { code: 'TengXunShiPin', name: '腾讯视频', supportedTypes: ['video'], platformFields: ['title', 'tags', 'scheduledTime', 'declaration'] },
  TengXunWeiShi: { code: 'TengXunWeiShi', name: '腾讯微视', supportedTypes: ['video'], platformFields: ['title', 'scheduledTime'] },
  TouTiaoHao: { code: 'TouTiaoHao', name: '头条号', supportedTypes: ['video', 'article', 'imageText'], platformFields: ['title', 'tags', 'declaration', 'scheduledTime', 'covers', 'content', 'isFirst', 'location', 'advertisement', 'images', 'pubType'] },
  WangYiHao: { code: 'WangYiHao', name: '网易号', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'covers', 'content'] },
  WiFiWanNengYaoShi: { code: 'WiFiWanNengYaoShi', name: 'wifi万能钥匙', supportedTypes: ['article'], platformFields: ['covers', 'title', 'content', 'category'] },
  WeiXinGongZhongHao: { code: 'WeiXinGongZhongHao', name: '微信公众号', supportedTypes: ['article'], platformFields: ['scheduledTime', 'notifySubscribers', 'sex', 'country', 'province', 'city', 'contentList'] },
  XiaoHongShu: { code: 'XiaoHongShu', name: '小红书', supportedTypes: ['video', 'imageText'], platformFields: ['title', 'declaration', 'location', 'scheduledTime', 'collection', 'group', 'bind_live_info', 'shopping_cart', 'visibleType', 'images', 'music'] },
  XiaoHongShuShangJiaHao: { code: 'XiaoHongShuShangJiaHao', name: '小红书商家号', supportedTypes: ['video'], platformFields: ['title', 'location', 'scheduledTime', 'shoppingCart'] },
  XinLangWeiBo: { code: 'XinLangWeiBo', name: '新浪微博', supportedTypes: ['video', 'imageText', 'article'], platformFields: ['title', 'location', 'scheduledTime', 'collection', 'images', 'covers', 'content'] },
  XueQiuHao: { code: 'XueQiuHao', name: '雪球号', supportedTypes: ['article'], platformFields: ['covers', 'title', 'content', 'scheduledTime'] },
  YiCheHao: { code: 'YiCheHao', name: '易车号', supportedTypes: ['video', 'article'], platformFields: ['title', 'scheduledTime', 'covers', 'content', 'verticalCovers', 'declaration', 'allowForward', 'allowAbstract'] },
  YiDianHao: { code: 'YiDianHao', name: '一点号', supportedTypes: ['video', 'article'], platformFields: ['title', 'tags', 'category', 'declaration', 'scheduledTime', 'covers', 'content'] },
  ZhiHu: { code: 'ZhiHu', name: '知乎', supportedTypes: ['video', 'article', 'imageText'], platformFields: ['title', 'topics', 'category', 'declaration', 'scheduledTime', 'covers', 'content', 'images'] },
  AI_DouBao: { code: 'AI_DouBao', name: '豆包', supportedTypes: ['article'], platformFields: ['title', 'desc', 'content', 'tags', 'category', 'subCategory'] },
  XiGuaShiPin: { code: 'XiGuaShiPin', name: '西瓜视频', supportedTypes: ['video'], platformFields: ['title', 'desc', 'covers', 'video', 'tags', 'category', 'subCategory', 'prePubTime', 'statement', 'pubType'] },
};

export enum TimeUnit {
  Day = 'day',
  Minute = 'minute',
}

export enum FormType {
  Platform = 'platform',
  Task = 'task',
}

export enum PublishChannel {
  Cloud = 'cloud',
  Local = 'local',
}

export enum PublishType {
  Article = 'article',
  ImageText = 'imageText',
  Video = 'video',
}

export function getPlatformRule(platformCode: string): PlatformRule | undefined {
  return PLATFORM_RULES[platformCode];
}

export function getAllPlatforms(): PlatformRule[] {
  return Object.values(PLATFORM_RULES);
}

export function buildContentPublishForm(
  publishType: 'video' | 'imageText' | 'article',
  params: {
    title?: string;
    description?: string;
    createType?: number;
    pubType?: number;
    tags?: string[];
  }
): Record<string, any> {
  const form: Record<string, any> = {
    formType: 'task',
    covers: [],
  };

  if (publishType === 'video') {
    form.title = params.title || '';
    form.description = params.description || '';
    form.declaration = 0;
    form.tagType = '位置';
    form.visibleType = 0;
    form.allow_save = 1;
  } else if (publishType === 'imageText') {
    form.title = params.title || '';
    form.description = params.description || '';
    form.declaration = 0;
    form.type = 0;
    form.visibleType = 0;
  } else if (publishType === 'article') {
    form.title = params.title || '';
    form.description = params.description || '';
    form.type = 0;
    form.visibleType = 0;
    form.verticalCovers = [];
    if (typeof params.createType === 'number') form.createType = params.createType;
    if (typeof params.pubType === 'number') form.pubType = params.pubType;
  }

  if (params.tags && params.tags.length > 0) {
    form.tags = params.tags;
  }

  return form;
}

export function buildPlatformPublishForm(
  publishType: 'video' | 'imageText' | 'article',
  platformCode: string,
  params: {
    title?: string;
    description?: string;
    createType?: number;
    pubType?: number;
    tags?: string[];
  }
): Record<string, any> {
  const rule = getPlatformRule(platformCode);
  if (!rule) return {};
  return buildContentPublishForm(publishType, params);
}

export function validatePublishParams(
  platformCode: string,
  publishType: 'video' | 'imageText' | 'article'
): { valid: boolean; errors: string[] } {
  const rule = getPlatformRule(platformCode);
  if (!rule) {
    return { valid: false, errors: [`不支持的平台: ${platformCode}`] };
  }
  if (!rule.supportedTypes.includes(publishType)) {
    return { valid: false, errors: [`${rule.name}不支持${publishType}类型`] };
  }
  return { valid: true, errors: [] };
}