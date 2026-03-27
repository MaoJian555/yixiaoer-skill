"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDynamicFieldName = isDynamicFieldName;
exports.normalizePlatformLookupKey = normalizePlatformLookupKey;
exports.resolvePlatformCode = resolvePlatformCode;
exports.resolvePlatformName = resolvePlatformName;
exports.getSupportedPublishTypes = getSupportedPublishTypes;
exports.getPlatformSchema = getPlatformSchema;
exports.getFormsForPublishType = getFormsForPublishType;
exports.getRequiredFields = getRequiredFields;
exports.getDynamicFields = getDynamicFields;
exports.platformHasField = platformHasField;
exports.listAvailablePlatforms = listAvailablePlatforms;
const platform_form_schema_js_1 = require("../config/platform-form-schema.js");
const platform_rules_js_1 = require("../config/platform-rules.js");
const PLATFORM_ALIASES = {
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
function isDynamicFieldName(fieldName) {
    return DYNAMIC_FIELDS.has(fieldName);
}
function normalizePlatformLookupKey(input) {
    return input.replace(/\s+/g, "").trim();
}
function resolvePlatformCode(input) {
    const normalized = normalizePlatformLookupKey(input);
    if (platform_rules_js_1.PLATFORM_RULES[input]) {
        return input;
    }
    if (platform_rules_js_1.PLATFORM_RULES[normalized]) {
        return normalized;
    }
    if (PLATFORM_ALIASES[input]) {
        return PLATFORM_ALIASES[input];
    }
    if (PLATFORM_ALIASES[normalized]) {
        return PLATFORM_ALIASES[normalized];
    }
    for (const [code, rule] of Object.entries(platform_rules_js_1.PLATFORM_RULES)) {
        if (normalizePlatformLookupKey(rule.name) === normalized ||
            normalizePlatformLookupKey(code) === normalized) {
            return code;
        }
    }
    return null;
}
function resolvePlatformName(input) {
    const code = resolvePlatformCode(input);
    if (!code) {
        return null;
    }
    return platform_rules_js_1.PLATFORM_RULES[code]?.name || code;
}
function getSupportedPublishTypes(platformCode) {
    return (platform_rules_js_1.PLATFORM_RULES[platformCode]?.supportedTypes || []);
}
function getPlatformSchema(platformCode) {
    const schemaRecord = platform_form_schema_js_1.PLATFORM_FORM_SCHEMA;
    return schemaRecord[platformCode] || null;
}
function getFormsForPublishType(platformCode, publishType) {
    const schema = getPlatformSchema(platformCode);
    if (!schema) {
        return [];
    }
    if (!publishType) {
        return schema.forms.filter((form) => form.publishType === "video" || form.publishType === "imageText" || form.publishType === "article");
    }
    return schema.forms.filter((form) => form.publishType === publishType);
}
function getRequiredFields(platformCode, publishType) {
    return getFormsForPublishType(platformCode, publishType)
        .flatMap((form) => form.fields)
        .filter((field) => field.required);
}
function getDynamicFields(platformCode, publishType) {
    return getFormsForPublishType(platformCode, publishType).flatMap((form) => form.fields.filter((field) => isDynamicFieldName(field.name)));
}
function platformHasField(platformCode, publishType, fieldName) {
    return getFormsForPublishType(platformCode, publishType).some((form) => form.fields.some((field) => field.name === fieldName));
}
function listAvailablePlatforms() {
    return Object.values(platform_rules_js_1.PLATFORM_RULES).map((rule) => ({
        code: rule.code,
        name: rule.name,
    }));
}
