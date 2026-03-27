import {
  PLATFORM_FORM_SCHEMA,
  type PlatformFormFieldSchema,
  type PlatformFormSchema,
  type PlatformFormSchemaItem,
} from "../config/platform-form-schema.js";
import { PLATFORM_RULES } from "../config/platform-rules.js";
import type { PublishType } from "./types.js";

const PLATFORM_ALIASES: Record<string, string> = {
  AcFun: "AcFun",
  B站: "BiLiBiLi",
  Bilibili: "BiLiBiLi",
  CSDN: "CSDN",
  xhs: "XiaoHongShu",
  XHS: "XiaoHongShu",
  小红书: "XiaoHongShu",
  小红书商家号: "XiaoHongShuShangJiaHao",
  抖音: "DouYin",
  快手: "KuaiShou",
  快手开放平台: "KuaiShouOpen",
  快手Open: "KuaiShouOpen",
  "快手-Open": "KuaiShouOpen",
  视频号: "ShiPinHao",
  微信公众号: "WeiXinGongZhongHao",
  微博: "XinLangWeiBo",
  新浪微博: "XinLangWeiBo",
  百家号: "BaiJiaHao",
  头条: "TouTiaoHao",
  头条号: "TouTiaoHao",
  知乎: "ZhiHu",
  哔哩哔哩: "BiLiBiLi",
  哔哩哔哩开放平台: "BiLiBiLiOpen",
  "哔哩哔哩-Open": "BiLiBiLiOpen",
  企鹅号: "QiEHao",
  搜狐号: "SouHuHao",
  搜狐视频: "SouHuShiPin",
  一点号: "YiDianHao",
  网易号: "WangYiHao",
  大鱼号: "DaYuHao",
  快传号: "KuaiChuanHao",
  豆瓣: "DouBan",
  简书: "JianShu",
  爱奇艺: "AiQiYi",
  得物: "DeWu",
  雪球号: "XueQiuHao",
  车家号: "CheJiaHao",
  易车号: "YiCheHao",
  腾讯视频: "TengXunShiPin",
  腾讯微视: "TengXunWeiShi",
  多多视频: "DuoDuoShiPin",
  美拍: "MeiPai",
  美柚: "MeiYou",
  蜂网: "FengWang",
  豆包: "AI_DouBao",
  西瓜视频: "XiGuaShiPin",
};

const DYNAMIC_FIELDS = new Set([
  "category",
  "topics",
  "location",
  "music",
  "collection",
  "sub_collection",
  "shoppingCart",
  "shopping_cart",
  "activity",
  "challenge",
  "hot_event",
  "sync_apps",
  "game",
  "film",
  "groupShopping",
  "group",
]);

export function isDynamicFieldName(fieldName: string): boolean {
  return DYNAMIC_FIELDS.has(fieldName);
}

export function normalizePlatformLookupKey(input: string): string {
  return input.replace(/\s+/g, "").trim();
}

export function resolvePlatformCode(input: string): string | null {
  const normalized = normalizePlatformLookupKey(input);

  if (PLATFORM_RULES[input]) {
    return input;
  }

  if (PLATFORM_RULES[normalized]) {
    return normalized;
  }

  if (PLATFORM_ALIASES[input]) {
    return PLATFORM_ALIASES[input];
  }

  if (PLATFORM_ALIASES[normalized]) {
    return PLATFORM_ALIASES[normalized];
  }

  for (const [code, rule] of Object.entries(PLATFORM_RULES)) {
    if (
      normalizePlatformLookupKey(rule.name) === normalized ||
      normalizePlatformLookupKey(code) === normalized
    ) {
      return code;
    }
  }

  return null;
}

export function resolvePlatformName(input: string): string | null {
  const code = resolvePlatformCode(input);
  if (!code) {
    return null;
  }
  return PLATFORM_RULES[code]?.name || code;
}

export function getSupportedPublishTypes(platformCode: string): PublishType[] {
  return (PLATFORM_RULES[platformCode]?.supportedTypes || []) as PublishType[];
}

export function getPlatformSchema(platformCode: string): PlatformFormSchema | null {
  const schemaRecord = PLATFORM_FORM_SCHEMA as Record<string, PlatformFormSchema>;
  return schemaRecord[platformCode] || null;
}

export function getFormsForPublishType(
  platformCode: string,
  publishType?: PublishType,
): PlatformFormSchemaItem[] {
  const schema = getPlatformSchema(platformCode);
  if (!schema) {
    return [];
  }

  if (!publishType) {
    return schema.forms.filter(
      (form) => form.publishType === "video" || form.publishType === "imageText" || form.publishType === "article",
    );
  }

  return schema.forms.filter((form) => form.publishType === publishType);
}

export function getRequiredFields(
  platformCode: string,
  publishType: PublishType,
): PlatformFormFieldSchema[] {
  return getFormsForPublishType(platformCode, publishType)
    .flatMap((form) => form.fields)
    .filter((field) => field.required);
}

export function getDynamicFields(
  platformCode: string,
  publishType?: PublishType,
): PlatformFormFieldSchema[] {
  return getFormsForPublishType(platformCode, publishType).flatMap((form) =>
    form.fields.filter((field) => isDynamicFieldName(field.name)),
  );
}

export function platformHasField(
  platformCode: string,
  publishType: PublishType,
  fieldName: string,
): boolean {
  return getFormsForPublishType(platformCode, publishType).some((form) =>
    form.fields.some((field) => field.name === fieldName),
  );
}

export function listAvailablePlatforms(): Array<{ code: string; name: string }> {
  return Object.values(PLATFORM_RULES).map((rule) => ({
    code: rule.code,
    name: rule.name,
  }));
}
