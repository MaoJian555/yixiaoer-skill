"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPlatformTextSnapshot = buildPlatformTextSnapshot;
exports.buildPlatformContentForm = buildPlatformContentForm;
const platform_rules_js_1 = require("../config/platform-rules.js");
const DEFAULT_TITLE_LIMIT = 50;
const DEFAULT_BODY_LIMIT = 2000;
const PLATFORM_TEXT_RULES = {
    WeiXinGongZhongHao: { titleMax: 64, bodyMax: 20000 },
    XinLangWeiBo: { titleMax: 50, bodyMax: 2000, inlineHashtags: true },
    XiaoHongShu: { titleMax: 20, bodyMax: 1000 },
    XiaoHongShuShangJiaHao: { titleMax: 20, bodyMax: 1000 },
    DouYin: { titleMax: 50, bodyMax: 2200 },
};
function deriveTitle(title, body) {
    const source = (title || body).trim();
    const firstLine = source.split(/\r?\n/)[0] || source;
    return firstLine.trim();
}
function truncateWithWarning(value, maxLength, label, warnings) {
    if (!maxLength || value.length <= maxLength) {
        return value;
    }
    warnings.push(`${label} 超过 ${maxLength} 字，已按预览规则截断`);
    return value.slice(0, maxLength);
}
function buildPlatformTextSnapshot(input, target) {
    const warnings = [];
    const rule = PLATFORM_TEXT_RULES[target.platformCode] || {};
    const baseBody = input.body.trim();
    const hashtags = rule.inlineHashtags && input.tags?.length
        ? `\n${input.tags.map((tag) => `#${tag}#`).join(" ")}`
        : "";
    const title = truncateWithWarning(deriveTitle(input.title, baseBody), rule.titleMax || DEFAULT_TITLE_LIMIT, `${target.platformName} 标题`, warnings);
    const body = truncateWithWarning(`${baseBody}${hashtags}`.trim(), rule.bodyMax || DEFAULT_BODY_LIMIT, `${target.platformName} 正文`, warnings);
    return { title, body, warnings };
}
function buildPlatformContentForm(input, target, publishType, overrides = {}) {
    const text = buildPlatformTextSnapshot(input, target);
    const rule = PLATFORM_TEXT_RULES[target.platformCode] || {};
    const baseForm = (0, platform_rules_js_1.buildContentPublishForm)(publishType, {
        title: text.title,
        description: text.body,
        tags: rule.inlineHashtags ? undefined : input.tags,
    });
    if (input.scheduleAt) {
        baseForm.scheduledTime = input.scheduleAt;
    }
    if (publishType === "article") {
        baseForm.content = text.body;
        baseForm.description = text.body;
    }
    return {
        contentPublishForm: {
            ...baseForm,
            ...overrides,
        },
        text,
    };
}
