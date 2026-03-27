"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublishDraft = createPublishDraft;
exports.updatePublishDraft = updatePublishDraft;
exports.getPublishRequirements = getPublishRequirements;
exports.submitPublishAnswers = submitPublishAnswers;
exports.previewPublishDraft = previewPublishDraft;
exports.publishDraft = publishDraft;
exports.getPublishDraftSnapshot = getPublishDraftSnapshot;
exports.clearPublishDraftStore = clearPublishDraftStore;
exports.__setDraftTestDependencies = __setDraftTestDependencies;
exports.__resetDraftTestDependencies = __resetDraftTestDependencies;
const client_js_1 = require("../api/client.js");
const account_resolver_js_1 = require("./account-resolver.js");
const executor_js_1 = require("./executor.js");
const mapper_js_1 = require("./mapper.js");
const media_selection_js_1 = require("./media-selection.js");
const media_js_1 = require("./media.js");
const platforms_js_1 = require("./platforms.js");
const validator_js_1 = require("./validator.js");
const draftStore = new Map();
let draftCounter = 0;
const defaultDraftDependencies = {
    resolvePlatformAccounts: account_resolver_js_1.resolvePlatformAccounts,
    getPublishPreset: (platformAccountId) => (0, client_js_1.getClient)().getPublishPreset(platformAccountId),
    submitPublishTask: executor_js_1.submitPublishTask,
    toImagePublishAsset: media_js_1.toImagePublishAsset,
    toVideoPublishAsset: media_js_1.toVideoPublishAsset,
};
const draftDependencies = {
    ...defaultDraftDependencies,
};
function buildDraftId() {
    draftCounter += 1;
    return `publish_draft_${Date.now()}_${draftCounter}`;
}
function cloneSnapshot(record) {
    return structuredClone({
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        publishType: record.publishType,
        input: record.input,
        targets: record.targets,
        answers: record.answers,
        validation: record.validation,
        preview: record.preview,
    });
}
function formatBlockerSummary(blockers, fallback) {
    return blockers.length > 0 ? blockers.join("；") : fallback;
}
function summarizePresetByType(preset, publishType) {
    switch (publishType) {
        case "video":
            return {
                categories: preset?.videoCategory ?? null,
                topics: preset?.videoTopics ?? null,
            };
        case "imageText":
            return {
                categories: preset?.dynamicCategory ?? null,
                topics: preset?.dynamicTopics ?? null,
            };
        case "article":
        default:
            return {
                categories: preset?.articleCategory ?? null,
                topics: preset?.articleTopics ?? null,
            };
    }
}
function dedupeFieldSchemas(fields) {
    const seen = new Set();
    const result = [];
    for (const field of fields) {
        if (seen.has(field.name)) {
            continue;
        }
        seen.add(field.name);
        result.push(field);
    }
    return result;
}
function enumOptionsToDraftOptions(options) {
    return options.map((item) => ({
        value: item.value,
        label: item.label,
    }));
}
function getUnsupportedFieldLimitation(target, fieldName) {
    if (fieldName === "location") {
        return `${target.platformName} 的 location 字段需要位置检索能力，当前版本还未接入，暂时不能直接填写。`;
    }
    if ((0, platforms_js_1.isDynamicFieldName)(fieldName)) {
        return `${target.platformName} 的 ${fieldName} 字段依赖平台专属解析，当前版本还未开放直接填写。`;
    }
    return undefined;
}
async function buildRequirementsForTarget(input, target, publishType) {
    const forms = (0, platforms_js_1.getFormsForPublishType)(target.platformCode, publishType);
    const blockers = [];
    const warnings = [];
    const { contentPublishForm } = (0, mapper_js_1.buildPlatformContentForm)(input, target, publishType);
    const providedFields = (0, validator_js_1.collectProvidedFields)(input, publishType, contentPublishForm);
    let presetSummary = {
        categories: null,
        topics: null,
    };
    try {
        const preset = await draftDependencies.getPublishPreset(target.platformAccountId);
        presetSummary = summarizePresetByType(preset, publishType);
    }
    catch {
        warnings.push(`${target.platformName} 的分类/话题预设获取失败，可填写字段将只返回静态结构。`);
    }
    if (forms.length === 0) {
        blockers.push(`${target.platformName} 不支持 ${publishType} 类型`);
    }
    const fields = dedupeFieldSchemas(forms.flatMap((form) => form.fields))
        .filter((field) => !providedFields.has(field.name))
        .map((field) => {
        let source = "static";
        let availability = "ready";
        let options;
        let limitation;
        if (field.name === "category" || field.name === "topics") {
            source = "preset";
            options = field.name === "category" ? presetSummary.categories : presetSummary.topics;
            if (!options) {
                availability = "limited";
                limitation = `${target.platformName} 的 ${field.name} 需要账号预设支持，当前未能获取可用选项。`;
            }
        }
        else if (field.name === "location") {
            source = "resolver";
            availability = "unsupported";
            limitation = getUnsupportedFieldLimitation(target, field.name);
        }
        else if ((0, platforms_js_1.isDynamicFieldName)(field.name)) {
            source = "resolver";
            availability = "unsupported";
            limitation = getUnsupportedFieldLimitation(target, field.name);
        }
        return {
            name: field.name,
            platform: target.platformName,
            platformCode: target.platformCode,
            accountId: target.platformAccountId,
            accountName: target.platformAccountName,
            publishType,
            rawType: field.rawType,
            valueType: field.valueType,
            required: field.required,
            description: field.description,
            example: field.example,
            enumValues: enumOptionsToDraftOptions(field.enumValues),
            source,
            availability,
            options,
            limitation,
        };
    });
    for (const field of fields) {
        if (field.required && field.availability !== "ready") {
            blockers.push(field.limitation || `${target.platformName} 缺少必填字段 ${field.name}`);
        }
    }
    return {
        platform: target.platformName,
        platformCode: target.platformCode,
        accountId: target.platformAccountId,
        accountName: target.platformAccountName,
        publishType,
        fields,
        blockers,
        warnings,
    };
}
async function buildDraftRequirements(record) {
    const groups = [];
    for (const target of record.targets) {
        groups.push(await buildRequirementsForTarget(record.input, target, record.publishType));
    }
    return groups;
}
function validateAnswersForRequirements(answers, requirements) {
    const issues = [];
    const blockers = [];
    const warnings = requirements.flatMap((item) => item.warnings);
    for (const requirement of requirements) {
        blockers.push(...requirement.blockers);
        const platformAnswers = answers[requirement.platformCode] || {};
        const allowedFields = new Map(requirement.fields.map((field) => [field.name, field]));
        for (const fieldName of Object.keys(platformAnswers)) {
            const field = allowedFields.get(fieldName);
            if (!field) {
                const message = `${requirement.platform} 不接受字段 ${fieldName}，请只提交协商结果中声明的字段。`;
                issues.push({
                    platform: requirement.platform,
                    platformCode: requirement.platformCode,
                    field: fieldName,
                    message,
                });
                blockers.push(message);
                continue;
            }
            const fieldErrors = (0, validator_js_1.validateFieldAnswer)(field, platformAnswers[fieldName]);
            for (const message of fieldErrors) {
                issues.push({
                    platform: requirement.platform,
                    platformCode: requirement.platformCode,
                    field: fieldName,
                    message,
                });
                blockers.push(message);
            }
        }
        for (const field of requirement.fields) {
            if (!field.required || field.availability !== "ready") {
                continue;
            }
            if (!(field.name in platformAnswers)) {
                const message = `${requirement.platform} 缺少必填字段 ${field.name}`;
                issues.push({
                    platform: requirement.platform,
                    platformCode: requirement.platformCode,
                    field: field.name,
                    message,
                });
                blockers.push(message);
            }
        }
    }
    return {
        issues,
        blockers: Array.from(new Set(blockers)),
        warnings: Array.from(new Set(warnings)),
    };
}
function buildMediaSummary(input, publishType) {
    const video = (0, media_selection_js_1.getVideoMedia)(input.media);
    const images = (0, media_selection_js_1.getContentImages)(input.media);
    const cover = (0, media_selection_js_1.getCoverMedia)(input.media);
    const verticalCover = (0, media_selection_js_1.getVerticalCoverMedia)(input.media);
    const summary = [];
    if (publishType === "video") {
        summary.push(video ? `视频: ${(0, media_selection_js_1.describeMediaSource)(video)}` : "视频: 未提供");
        summary.push(cover ? `封面: ${(0, media_selection_js_1.describeMediaSource)(cover)}` : "封面: 未提供");
        return summary;
    }
    if (publishType === "imageText") {
        summary.push(`配图: ${images.length} 张`);
        summary.push(cover ? `封面: ${(0, media_selection_js_1.describeMediaSource)(cover)}` : "封面: 默认取第一张配图");
        return summary;
    }
    summary.push(cover ? `封面: ${(0, media_selection_js_1.describeMediaSource)(cover)}` : "封面: 未提供");
    if (verticalCover) {
        summary.push(`竖版封面: ${(0, media_selection_js_1.describeMediaSource)(verticalCover)}`);
    }
    return summary;
}
function buildMissingFieldList(requirement, answers) {
    const missing = [];
    for (const field of requirement.fields) {
        if (!field.required) {
            continue;
        }
        if (field.availability !== "ready") {
            missing.push(field.name);
            continue;
        }
        if (!(field.name in answers)) {
            missing.push(field.name);
        }
    }
    return Array.from(new Set(missing));
}
async function buildPreviewState(record) {
    const requirements = await buildDraftRequirements(record);
    const validation = validateAnswersForRequirements(record.answers, requirements);
    const previewItems = [];
    for (const target of record.targets) {
        const requirement = requirements.find((item) => item.platformCode === target.platformCode);
        if (!requirement) {
            continue;
        }
        const answers = record.answers[target.platformCode] || {};
        const { text } = (0, mapper_js_1.buildPlatformContentForm)(record.input, target, record.publishType, answers);
        previewItems.push({
            platform: target.platformName,
            platformCode: target.platformCode,
            accountId: target.platformAccountId,
            accountName: target.platformAccountName,
            publishType: record.publishType,
            title: text.title,
            body: text.body,
            requiredFields: requirement.fields.filter((field) => field.required).map((field) => field.name),
            missingFields: buildMissingFieldList(requirement, answers),
            mediaSummary: buildMediaSummary(record.input, record.publishType),
            warnings: [...text.warnings, ...requirement.warnings],
        });
    }
    return {
        publishType: record.publishType,
        previewItems,
        blockers: Array.from(new Set([...record.validation.blockers, ...validation.blockers])),
        warnings: Array.from(new Set([...record.validation.warnings, ...validation.warnings])),
    };
}
async function buildDraftRecord(input) {
    const inputBlockers = (0, validator_js_1.validateDraftInput)(input);
    if (inputBlockers.length > 0) {
        return {
            publishType: (0, validator_js_1.inferPublishType)(input),
            targets: [],
            validation: {
                issues: inputBlockers.map((message) => ({
                    platform: "global",
                    platformCode: "global",
                    message,
                })),
                blockers: inputBlockers,
                warnings: [],
            },
        };
    }
    const publishType = (0, validator_js_1.inferPublishType)(input);
    const resolution = await draftDependencies.resolvePlatformAccounts(input.platforms, input.platformAccountIds);
    const validation = {
        issues: resolution.blockers.map((message) => ({
            platform: "global",
            platformCode: "global",
            message,
        })),
        blockers: [...resolution.blockers],
        warnings: [...resolution.warnings],
    };
    return {
        publishType,
        targets: resolution.targets,
        validation,
    };
}
function getDraftOrThrow(draftId) {
    const record = draftStore.get(draftId);
    if (!record) {
        throw new Error(`未找到 draftId=${draftId} 对应的发布草稿`);
    }
    return record;
}
async function refreshDraftValidation(record) {
    const requirements = await buildDraftRequirements(record);
    record.validation = validateAnswersForRequirements(record.answers, requirements);
}
async function resolveAndApplyRecord(record, nextInput, resetAnswers) {
    const resolved = await buildDraftRecord(nextInput);
    record.input = nextInput;
    record.publishType = resolved.publishType;
    record.targets = resolved.targets;
    record.updatedAt = Date.now();
    record.preview = undefined;
    if (resetAnswers) {
        record.answers = {};
    }
    record.validation = resolved.validation;
    if (resolved.validation.blockers.length === 0) {
        await refreshDraftValidation(record);
    }
}
async function createPublishDraft(input) {
    const resolved = await buildDraftRecord(input);
    if (resolved.validation.blockers.length > 0) {
        return {
            success: false,
            message: formatBlockerSummary(resolved.validation.blockers, "发布草稿创建失败"),
            data: resolved.validation,
        };
    }
    const now = Date.now();
    const record = {
        id: buildDraftId(),
        createdAt: now,
        updatedAt: now,
        input: structuredClone(input),
        publishType: resolved.publishType,
        targets: resolved.targets,
        answers: {},
        validation: resolved.validation,
    };
    await refreshDraftValidation(record);
    draftStore.set(record.id, record);
    return {
        success: true,
        message: `已创建发布草稿 ${record.id}，当前可继续获取字段要求并填写平台答案。`,
        data: cloneSnapshot(record),
    };
}
async function updatePublishDraft(params) {
    try {
        const record = getDraftOrThrow(params.draftId);
        const keysThatResetAnswers = new Set(["platforms", "publishType", "platformAccountIds"]);
        let resetAnswers = false;
        const nextInput = structuredClone(record.input);
        for (const [key, value] of Object.entries(params)) {
            if (key === "draftId") {
                continue;
            }
            nextInput[key] = value;
            if (keysThatResetAnswers.has(key)) {
                resetAnswers = true;
            }
        }
        await resolveAndApplyRecord(record, nextInput, resetAnswers);
        if (record.validation.blockers.length > 0) {
            return {
                success: false,
                message: formatBlockerSummary(record.validation.blockers, "发布草稿更新失败"),
                data: cloneSnapshot(record),
            };
        }
        return {
            success: true,
            message: `已更新发布草稿 ${record.id}。`,
            data: cloneSnapshot(record),
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
async function getPublishRequirements(params) {
    try {
        const record = getDraftOrThrow(params.draftId);
        if (record.targets.length === 0) {
            return {
                success: false,
                message: formatBlockerSummary(record.validation.blockers, "当前草稿还没有可用的发布目标"),
                data: cloneSnapshot(record),
            };
        }
        const requirements = await buildDraftRequirements(record);
        const blockers = requirements.flatMap((item) => item.blockers);
        const warnings = requirements.flatMap((item) => item.warnings);
        return {
            success: blockers.length === 0,
            message: blockers.length > 0
                ? `已整理草稿字段要求，但仍存在阻塞项: ${Array.from(new Set(blockers)).join("；")}`
                : `已整理 ${requirements.length} 个平台的可填写字段。`,
            data: {
                draft: cloneSnapshot(record),
                requirements,
                blockers: Array.from(new Set(blockers)),
                warnings: Array.from(new Set(warnings)),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
async function submitPublishAnswers(params) {
    try {
        const record = getDraftOrThrow(params.draftId);
        const requirements = await buildDraftRequirements(record);
        const nextAnswers = structuredClone(record.answers);
        const platformLookup = new Map();
        for (const target of record.targets) {
            platformLookup.set(target.platformCode, target.platformCode);
            platformLookup.set(target.platformInput, target.platformCode);
            platformLookup.set(target.platformName, target.platformCode);
        }
        for (const [platformKey, answers] of Object.entries(params.answers || {})) {
            const platformCode = platformLookup.get(platformKey);
            if (!platformCode) {
                return {
                    success: false,
                    message: `草稿中不存在平台 ${platformKey}，请只按草稿里的目标平台提交字段答案。`,
                };
            }
            nextAnswers[platformCode] = {
                ...(nextAnswers[platformCode] || {}),
                ...answers,
            };
        }
        const validation = validateAnswersForRequirements(nextAnswers, requirements);
        record.answers = nextAnswers;
        record.validation = validation;
        record.updatedAt = Date.now();
        record.preview = undefined;
        return {
            success: validation.blockers.length === 0,
            message: validation.blockers.length > 0
                ? `草稿字段已更新，但仍有阻塞项: ${validation.blockers.join("；")}`
                : `草稿字段已更新，可继续预览或发布。`,
            data: cloneSnapshot(record),
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
async function previewPublishDraft(params) {
    try {
        const record = getDraftOrThrow(params.draftId);
        const preview = await buildPreviewState(record);
        record.preview = preview;
        record.validation = {
            issues: preview.blockers.map((message) => ({
                platform: "global",
                platformCode: "global",
                message,
            })),
            blockers: preview.blockers,
            warnings: preview.warnings,
        };
        record.updatedAt = Date.now();
        const messageSections = [`已生成 ${preview.previewItems.length} 个平台的发布预览。`];
        if (preview.blockers.length > 0) {
            messageSections.push(`发布前还需要补齐: ${preview.blockers.join("；")}`);
        }
        for (const item of preview.previewItems) {
            messageSections.push([
                `【${item.platform} / ${item.accountName}】`,
                `标题: ${item.title}`,
                `正文预览: ${item.body}`,
                `素材: ${item.mediaSummary.join("，")}`,
                item.missingFields.length > 0 ? `缺失字段: ${item.missingFields.join("、")}` : "缺失字段: 无",
                item.warnings.length > 0 ? `提示: ${item.warnings.join("；")}` : "",
            ]
                .filter(Boolean)
                .join("\n"));
        }
        if (preview.warnings.length > 0) {
            messageSections.push(`统一提示: ${preview.warnings.join("；")}`);
        }
        return {
            success: preview.blockers.length === 0,
            message: messageSections.join("\n\n"),
            data: {
                draft: cloneSnapshot(record),
                preview,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
async function buildAccountFormFromDraft(record, target) {
    const answers = record.answers[target.platformCode] || {};
    const { contentPublishForm } = (0, mapper_js_1.buildPlatformContentForm)(record.input, target, record.publishType, answers);
    const accountForm = {
        platformAccountId: target.platformAccountId,
        contentPublishForm,
    };
    if (record.publishType === "video") {
        const video = (0, media_selection_js_1.getVideoMedia)(record.input.media);
        const cover = (0, media_selection_js_1.getCoverMedia)(record.input.media);
        if (!video || !cover) {
            throw new Error(`${target.platformName} 的视频或封面素材缺失`);
        }
        const videoAsset = await draftDependencies.toVideoPublishAsset(video);
        const coverAsset = await draftDependencies.toImagePublishAsset(cover, "cover");
        accountForm.video = videoAsset;
        accountForm.coverKey = coverAsset.key;
        accountForm.cover = coverAsset;
        return accountForm;
    }
    if (record.publishType === "imageText") {
        const images = (0, media_selection_js_1.getContentImages)(record.input.media);
        if (images.length === 0) {
            throw new Error(`${target.platformName} 的图片素材缺失`);
        }
        const imageAssets = await Promise.all(images.map((image) => draftDependencies.toImagePublishAsset(image, "content")));
        const coverAsset = (0, media_selection_js_1.getCoverMedia)(record.input.media)
            ? await draftDependencies.toImagePublishAsset((0, media_selection_js_1.getCoverMedia)(record.input.media), "content")
            : imageAssets[0];
        accountForm.images = imageAssets;
        accountForm.coverKey = coverAsset.key;
        accountForm.cover = coverAsset;
        return accountForm;
    }
    const cover = (0, media_selection_js_1.getCoverMedia)(record.input.media);
    if (!cover) {
        throw new Error(`${target.platformName} 的文章封面缺失`);
    }
    const coverAsset = await draftDependencies.toImagePublishAsset(cover, "cover");
    const articleForm = contentPublishForm;
    const covers = Array.isArray(articleForm.covers) ? [...articleForm.covers] : [];
    covers.push(coverAsset);
    articleForm.covers = covers;
    const verticalCover = (0, media_selection_js_1.getVerticalCoverMedia)(record.input.media);
    if (verticalCover) {
        const verticalCoverAsset = await draftDependencies.toImagePublishAsset(verticalCover, "cover");
        const verticalCovers = Array.isArray(articleForm.verticalCovers)
            ? [...articleForm.verticalCovers]
            : [];
        verticalCovers.push(verticalCoverAsset);
        articleForm.verticalCovers = verticalCovers;
    }
    accountForm.coverKey = coverAsset.key;
    accountForm.cover = coverAsset;
    return accountForm;
}
async function publishDraft(params) {
    try {
        const record = getDraftOrThrow(params.draftId);
        const preview = await buildPreviewState(record);
        record.preview = preview;
        record.validation = {
            issues: preview.blockers.map((message) => ({
                platform: "global",
                platformCode: "global",
                message,
            })),
            blockers: preview.blockers,
            warnings: preview.warnings,
        };
        if (preview.blockers.length > 0) {
            return {
                success: false,
                message: `草稿仍未满足发布条件: ${preview.blockers.join("；")}`,
                data: {
                    draft: cloneSnapshot(record),
                    preview,
                },
            };
        }
        const accountForms = [];
        for (const target of record.targets) {
            accountForms.push(await buildAccountFormFromDraft(record, target));
        }
        const result = await draftDependencies.submitPublishTask({
            accountForms,
            targets: record.targets,
            publishType: record.publishType,
            publishChannel: record.input.publishChannel,
            clientId: record.input.clientId,
            coverKey: accountForms.find((item) => typeof item.coverKey === "string")?.coverKey || "",
        });
        record.updatedAt = Date.now();
        return {
            ...result,
            message: `草稿 ${record.id} 已通过校验并提交发布。\n\n${result.message}`,
            data: {
                draft: cloneSnapshot(record),
                publishResult: result.data,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
function getPublishDraftSnapshot(draftId) {
    const record = draftStore.get(draftId);
    return record ? cloneSnapshot(record) : null;
}
function clearPublishDraftStore() {
    draftStore.clear();
}
function __setDraftTestDependencies(overrides) {
    Object.assign(draftDependencies, overrides);
}
function __resetDraftTestDependencies() {
    Object.assign(draftDependencies, defaultDraftDependencies);
}
