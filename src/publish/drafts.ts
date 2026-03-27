import type { SkillResult } from "../../types.d.ts";
import { getClient } from "../api/client.js";
import { buildPublishCategoryValues } from "../api/category-utils.js";
import type { PlatformFormFieldSchema } from "../config/platform-form-schema.js";
import { resolvePlatformAccounts as resolvePlatformAccountsInternal } from "./account-resolver.js";
import { submitPublishTask as submitPublishTaskInternal } from "./executor.js";
import { buildPlatformContentForm } from "./mapper.js";
import {
  describeMediaSource,
  getContentImages,
  getCoverMedia,
  getVerticalCoverMedia,
  getVideoMedia,
} from "./media-selection.js";
import {
  toImagePublishAsset as toImagePublishAssetInternal,
  toVideoPublishAsset as toVideoPublishAssetInternal,
} from "./media.js";
import { getFormsForPublishType, isDynamicFieldName } from "./platforms.js";
import type {
  DraftFieldAvailability,
  DraftFieldDefinition,
  DraftFieldOption,
  DraftPlatformRequirements,
  DraftPreviewState,
  DraftValidationIssue,
  DraftValidationState,
  PlatformPreviewItem,
  PublishDraftInput,
  PublishDraftRecord,
  PublishDraftSnapshot,
  PublishType,
  ResolvedPlatformAccount,
  UpdatePublishDraftInput,
} from "./types.js";
import {
  collectProvidedFields,
  inferPublishType,
  validateDraftInput,
  validateFieldAnswer,
} from "./validator.js";

const draftStore = new Map<string, PublishDraftRecord>();

let draftCounter = 0;

const defaultDraftDependencies = {
  resolvePlatformAccounts: resolvePlatformAccountsInternal,
  getPublishPreset: (platformAccountId: string) => getClient().getPublishPreset(platformAccountId),
  getPlatformAccountCategories: (platformAccountId: string, publishType: PublishType) =>
    getClient().getPlatformAccountCategories(platformAccountId, publishType),
  submitPublishTask: submitPublishTaskInternal,
  toImagePublishAsset: toImagePublishAssetInternal,
  toVideoPublishAsset: toVideoPublishAssetInternal,
};

const draftDependencies = {
  ...defaultDraftDependencies,
};

function buildDraftId(): string {
  draftCounter += 1;
  return `publish_draft_${Date.now()}_${draftCounter}`;
}

function cloneSnapshot(record: PublishDraftRecord): PublishDraftSnapshot {
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

function formatBlockerSummary(blockers: string[], fallback: string): string {
  return blockers.length > 0 ? blockers.join("；") : fallback;
}

function formatTargetLabel(target: {
  platformName?: string;
  platform?: string;
  platformAccountName?: string;
  accountName?: string;
}): string {
  const platform = target.platformName || target.platform || "未知平台";
  const account = target.platformAccountName || target.accountName || "未知账号";
  return `${platform} / ${account}`;
}

function getTargetKey(target: {
  targetKey?: string;
  platformCode: string;
  platformAccountId?: string;
  accountId?: string;
}): string {
  return target.targetKey || `${target.platformCode}:${target.platformAccountId || target.accountId || "unknown"}`;
}

function addAnswerAlias(
  lookup: Map<string, string | null>,
  alias: string | undefined,
  targetKey: string,
): void {
  const normalizedAlias = alias?.trim();
  if (!normalizedAlias) {
    return;
  }

  const current = lookup.get(normalizedAlias);
  if (current === undefined) {
    lookup.set(normalizedAlias, targetKey);
    return;
  }

  if (current !== targetKey) {
    lookup.set(normalizedAlias, null);
  }
}

function buildAnswerTargetLookup(targets: ResolvedPlatformAccount[]): Map<string, string | null> {
  const lookup = new Map<string, string | null>();
  const platformCounts = new Map<string, number>();

  for (const target of targets) {
    platformCounts.set(target.platformCode, (platformCounts.get(target.platformCode) || 0) + 1);
  }

  for (const target of targets) {
    const targetKey = getTargetKey(target);
    addAnswerAlias(lookup, targetKey, targetKey);
    addAnswerAlias(lookup, target.platformAccountId, targetKey);

    if ((platformCounts.get(target.platformCode) || 0) === 1) {
      addAnswerAlias(lookup, target.platformCode, targetKey);
      addAnswerAlias(lookup, target.platformInput, targetKey);
      addAnswerAlias(lookup, target.platformName, targetKey);
    } else {
      lookup.set(target.platformCode, null);
      lookup.set(target.platformInput, null);
      lookup.set(target.platformName, null);
    }
  }

  return lookup;
}

function summarizePresetTopicsByType(
  preset: any,
  publishType: PublishType,
): unknown {
  switch (publishType) {
    case "video":
      return preset?.videoTopics ?? null;
    case "imageText":
      return preset?.dynamicTopics ?? null;
    case "article":
    default:
      return preset?.articleTopics ?? null;
  }
}

function dedupeFieldSchemas(fields: PlatformFormFieldSchema[]): PlatformFormFieldSchema[] {
  const seen = new Set<string>();
  const result: PlatformFormFieldSchema[] = [];

  for (const field of fields) {
    if (seen.has(field.name)) {
      continue;
    }
    seen.add(field.name);
    result.push(field);
  }

  return result;
}

function enumOptionsToDraftOptions(options: Array<{ value: number; label: string }>): DraftFieldOption[] {
  return options.map((item) => ({
    value: item.value,
    label: item.label,
  }));
}

function getUnsupportedFieldLimitation(target: ResolvedPlatformAccount, fieldName: string): string | undefined {
  const targetLabel = formatTargetLabel(target);
  if (fieldName === "location") {
    return `${targetLabel} 的 location 字段需要位置检索能力，当前版本还未接入，暂时不能直接填写。`;
  }

  if (fieldName === "group" || fieldName === "groupShopping") {
    return `${targetLabel} 的 ${fieldName} 字段需要分组接口支持，当前项目没有该接口，暂时不能直接填写。`;
  }

  if (isDynamicFieldName(fieldName)) {
    return `${targetLabel} 的 ${fieldName} 字段依赖平台专属解析，当前版本还未开放直接填写。`;
  }

  return undefined;
}

async function buildRequirementsForTarget(
  input: PublishDraftInput,
  target: ResolvedPlatformAccount,
  publishType: PublishType,
): Promise<DraftPlatformRequirements> {
  const targetKey = getTargetKey(target);
  const targetLabel = formatTargetLabel(target);
  const forms = getFormsForPublishType(target.platformCode, publishType);
  const blockers: string[] = [];
  const warnings: string[] = [];
  const { contentPublishForm } = buildPlatformContentForm(input, target, publishType);
  const providedFields = collectProvidedFields(input, publishType, contentPublishForm);
  let categoryOptions: unknown = null;
  let topicOptions: unknown = null;
  const unresolvedFields = dedupeFieldSchemas(forms.flatMap((form) => form.fields)).filter(
    (field) => !providedFields.has(field.name),
  );
  const needsCategory = unresolvedFields.some((field) => field.name === "category");
  const needsTopics = unresolvedFields.some((field) => field.name === "topics");

  try {
    if (needsCategory) {
      const categories = await draftDependencies.getPlatformAccountCategories(
        target.platformAccountId,
        publishType,
      );
      categoryOptions = buildPublishCategoryValues(categories);
    }
  } catch {
    warnings.push(`${targetLabel} 的分类接口获取失败，可填写字段将只返回静态结构。`);
  }

  try {
    if (needsTopics) {
      const preset = await draftDependencies.getPublishPreset(target.platformAccountId);
      topicOptions = summarizePresetTopicsByType(preset, publishType);
    }
  } catch {
    warnings.push(`${targetLabel} 的话题预设获取失败，可填写字段将只返回静态结构。`);
  }

  if (forms.length === 0) {
    blockers.push(`${targetLabel} 不支持 ${publishType} 类型`);
  }

  const fields = unresolvedFields.map((field): DraftFieldDefinition => {
      let source: DraftFieldDefinition["source"] = "static";
      let availability: DraftFieldAvailability = "ready";
      let options: unknown;
      let limitation: string | undefined;

      if (field.name === "category" || field.name === "topics") {
        source = "preset";
        options = field.name === "category" ? categoryOptions : topicOptions;
        if (!options) {
          availability = "limited";
          limitation =
            field.name === "category"
              ? `${targetLabel} 的 ${field.name} 需要账号分类接口支持，当前未能获取可用选项。`
              : `${targetLabel} 的 ${field.name} 需要账号预设支持，当前未能获取可用选项。`;
        }
      } else if (field.name === "location") {
        source = "resolver";
        availability = "unsupported";
        limitation = getUnsupportedFieldLimitation(target, field.name);
      } else if (isDynamicFieldName(field.name)) {
        source = "resolver";
        availability = "unsupported";
        limitation = getUnsupportedFieldLimitation(target, field.name);
      }

      return {
        targetKey,
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
      blockers.push(field.limitation || `${targetLabel} 缺少必填字段 ${field.name}`);
    }
  }

  return {
    targetKey,
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

async function buildDraftRequirements(record: PublishDraftRecord): Promise<DraftPlatformRequirements[]> {
  const groups: DraftPlatformRequirements[] = [];

  for (const target of record.targets) {
    groups.push(await buildRequirementsForTarget(record.input, target, record.publishType));
  }

  return groups;
}

function validateAnswersForRequirements(
  answers: Record<string, Record<string, unknown>>,
  requirements: DraftPlatformRequirements[],
): DraftValidationState {
  const issues: DraftValidationIssue[] = [];
  const blockers: string[] = [];
  const warnings = requirements.flatMap((item) => item.warnings);

  for (const requirement of requirements) {
    const targetLabel = formatTargetLabel(requirement);
    blockers.push(...requirement.blockers);

    const platformAnswers = answers[requirement.targetKey] || {};
    const allowedFields = new Map(requirement.fields.map((field) => [field.name, field]));

    for (const fieldName of Object.keys(platformAnswers)) {
      const field = allowedFields.get(fieldName);
      if (!field) {
        const message = `${targetLabel} 不接受字段 ${fieldName}，请只提交协商结果中声明的字段。`;
        issues.push({
          platform: requirement.platform,
          platformCode: requirement.platformCode,
          field: fieldName,
          message,
        });
        blockers.push(message);
        continue;
      }

      const fieldErrors = validateFieldAnswer(field, platformAnswers[fieldName]);
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
        const message = `${targetLabel} 缺少必填字段 ${field.name}`;
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

function buildMediaSummary(input: PublishDraftInput, publishType: PublishType): string[] {
  const video = getVideoMedia(input.media);
  const images = getContentImages(input.media);
  const cover = getCoverMedia(input.media);
  const verticalCover = getVerticalCoverMedia(input.media);
  const summary: string[] = [];

  if (publishType === "video") {
    summary.push(video ? `视频: ${describeMediaSource(video)}` : "视频: 未提供");
    summary.push(cover ? `封面: ${describeMediaSource(cover)}` : "封面: 未提供");
    return summary;
  }

  if (publishType === "imageText") {
    summary.push(`配图: ${images.length} 张`);
    summary.push(cover ? `封面: ${describeMediaSource(cover)}` : "封面: 默认取第一张配图");
    return summary;
  }

  summary.push(cover ? `封面: ${describeMediaSource(cover)}` : "封面: 未提供");
  if (verticalCover) {
    summary.push(`竖版封面: ${describeMediaSource(verticalCover)}`);
  }
  return summary;
}

function buildMissingFieldList(
  requirement: DraftPlatformRequirements,
  answers: Record<string, unknown>,
): string[] {
  const missing: string[] = [];

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

async function buildPreviewState(record: PublishDraftRecord): Promise<DraftPreviewState> {
  const requirements = await buildDraftRequirements(record);
  const validation = validateAnswersForRequirements(record.answers, requirements);
  const previewItems: PlatformPreviewItem[] = [];

  for (const target of record.targets) {
    const targetKey = getTargetKey(target);
    const requirement = requirements.find((item) => item.targetKey === targetKey);
    if (!requirement) {
      continue;
    }

    const answers = record.answers[targetKey] || {};
    const { text } = buildPlatformContentForm(record.input, target, record.publishType, answers);
    previewItems.push({
      targetKey,
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

async function buildDraftRecord(input: PublishDraftInput): Promise<{
  publishType: PublishType;
  targets: ResolvedPlatformAccount[];
  validation: DraftValidationState;
}> {
  const inputBlockers = validateDraftInput(input);
  if (inputBlockers.length > 0) {
    return {
      publishType: inferPublishType(input),
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

  const publishType = inferPublishType(input);
  const resolution = await draftDependencies.resolvePlatformAccounts(input.platforms, input.platformAccountIds);
  const validation: DraftValidationState = {
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

function getDraftOrThrow(draftId: string): PublishDraftRecord {
  const record = draftStore.get(draftId);
  if (!record) {
    throw new Error(`未找到 draftId=${draftId} 对应的发布草稿`);
  }
  return record;
}

async function refreshDraftValidation(record: PublishDraftRecord): Promise<void> {
  const requirements = await buildDraftRequirements(record);
  record.validation = validateAnswersForRequirements(record.answers, requirements);
}

async function resolveAndApplyRecord(
  record: PublishDraftRecord,
  nextInput: PublishDraftInput,
  resetAnswers: boolean,
): Promise<void> {
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

export async function createPublishDraft(input: PublishDraftInput): Promise<SkillResult> {
  const resolved = await buildDraftRecord(input);

  if (resolved.validation.blockers.length > 0) {
    return {
      success: false,
      message: formatBlockerSummary(resolved.validation.blockers, "发布草稿创建失败"),
      data: resolved.validation,
    };
  }

  const now = Date.now();
  const record: PublishDraftRecord = {
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

export async function updatePublishDraft(params: UpdatePublishDraftInput): Promise<SkillResult> {
  try {
    const record = getDraftOrThrow(params.draftId);
    const keysThatResetAnswers = new Set(["platforms", "publishType", "platformAccountIds"]);
    let resetAnswers = false;
    const nextInput: PublishDraftInput = structuredClone(record.input);

    for (const [key, value] of Object.entries(params)) {
      if (key === "draftId") {
        continue;
      }
      (nextInput as unknown as Record<string, unknown>)[key] = value;
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
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getPublishRequirements(params: { draftId: string }): Promise<SkillResult> {
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
      message:
        blockers.length > 0
          ? `已整理草稿字段要求，但仍存在阻塞项: ${Array.from(new Set(blockers)).join("；")}`
          : `已整理 ${requirements.length} 个平台的可填写字段。`,
      data: {
        draft: cloneSnapshot(record),
        requirements,
        blockers: Array.from(new Set(blockers)),
        warnings: Array.from(new Set(warnings)),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function submitPublishAnswers(params: {
  draftId: string;
  answers: Record<string, Record<string, unknown>>;
}): Promise<SkillResult> {
  try {
    const record = getDraftOrThrow(params.draftId);
    const requirements = await buildDraftRequirements(record);
    const nextAnswers = structuredClone(record.answers);
    const targetLookup = buildAnswerTargetLookup(record.targets);

    for (const [platformKey, answers] of Object.entries(params.answers || {})) {
      const normalizedKey = platformKey.trim();
      const targetKey = targetLookup.get(normalizedKey);
      if (targetKey === undefined) {
        return {
          success: false,
          message: `草稿中不存在目标 ${normalizedKey}，请使用 requirements 返回的 targetKey、platformAccountId 或单账号平台别名提交字段答案。`,
        };
      }
      if (targetKey === null) {
        return {
          success: false,
          message: `目标 ${normalizedKey} 对应多个账号，请改用 requirements 返回的 targetKey 或 platformAccountId 提交字段答案。`,
        };
      }
      nextAnswers[targetKey] = {
        ...(nextAnswers[targetKey] || {}),
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
      message:
        validation.blockers.length > 0
          ? `草稿字段已更新，但仍有阻塞项: ${validation.blockers.join("；")}`
          : `草稿字段已更新，可继续预览或发布。`,
      data: cloneSnapshot(record),
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function previewPublishDraft(params: { draftId: string }): Promise<SkillResult> {
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

    const messageSections: string[] = [`已生成 ${preview.previewItems.length} 个平台的发布预览。`];
    if (preview.blockers.length > 0) {
      messageSections.push(`发布前还需要补齐: ${preview.blockers.join("；")}`);
    }

    for (const item of preview.previewItems) {
      messageSections.push(
        [
          `【${item.platform} / ${item.accountName}】`,
          `目标键: ${item.targetKey}`,
          `标题: ${item.title}`,
          `正文预览: ${item.body}`,
          `素材: ${item.mediaSummary.join("，")}`,
          item.missingFields.length > 0 ? `缺失字段: ${item.missingFields.join("、")}` : "缺失字段: 无",
          item.warnings.length > 0 ? `提示: ${item.warnings.join("；")}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
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
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

async function buildAccountFormFromDraft(
  record: PublishDraftRecord,
  target: ResolvedPlatformAccount,
): Promise<Record<string, unknown>> {
  const answers = record.answers[getTargetKey(target)] || {};
  const { contentPublishForm } = buildPlatformContentForm(record.input, target, record.publishType, answers);
  const accountForm: Record<string, unknown> = {
    platformAccountId: target.platformAccountId,
    contentPublishForm,
  };

  if (record.publishType === "video") {
    const video = getVideoMedia(record.input.media);
    const cover = getCoverMedia(record.input.media);

    if (!video || !cover) {
      throw new Error(`${formatTargetLabel(target)} 的视频或封面素材缺失`);
    }

    const videoAsset = await draftDependencies.toVideoPublishAsset(video);
    const coverAsset = await draftDependencies.toImagePublishAsset(cover, "cover");

    accountForm.video = videoAsset;
    accountForm.coverKey = coverAsset.key;
    accountForm.cover = coverAsset;
    return accountForm;
  }

  if (record.publishType === "imageText") {
    const images = getContentImages(record.input.media);

    if (images.length === 0) {
      throw new Error(`${formatTargetLabel(target)} 的图片素材缺失`);
    }

    const imageAssets = await Promise.all(
      images.map((image) => draftDependencies.toImagePublishAsset(image, "content")),
    );
    const coverAsset = getCoverMedia(record.input.media)
      ? await draftDependencies.toImagePublishAsset(getCoverMedia(record.input.media)!, "content")
      : imageAssets[0];

    accountForm.images = imageAssets;
    accountForm.coverKey = coverAsset.key;
    accountForm.cover = coverAsset;
    return accountForm;
  }

  const cover = getCoverMedia(record.input.media);
  if (!cover) {
    throw new Error(`${formatTargetLabel(target)} 的文章封面缺失`);
  }

  const coverAsset = await draftDependencies.toImagePublishAsset(cover, "cover");
  const articleForm = contentPublishForm as Record<string, unknown>;
  const covers = Array.isArray(articleForm.covers) ? [...(articleForm.covers as unknown[])] : [];
  covers.push(coverAsset);
  articleForm.covers = covers;

  const verticalCover = getVerticalCoverMedia(record.input.media);
  if (verticalCover) {
    const verticalCoverAsset = await draftDependencies.toImagePublishAsset(verticalCover, "cover");
    const verticalCovers = Array.isArray(articleForm.verticalCovers)
      ? [...(articleForm.verticalCovers as unknown[])]
      : [];
    verticalCovers.push(verticalCoverAsset);
    articleForm.verticalCovers = verticalCovers;
  }

  accountForm.coverKey = coverAsset.key;
  accountForm.cover = coverAsset;
  return accountForm;
}

export async function publishDraft(params: { draftId: string }): Promise<SkillResult> {
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

    const accountForms: Record<string, unknown>[] = [];
    for (const target of record.targets) {
      accountForms.push(await buildAccountFormFromDraft(record, target));
    }

    const result = await draftDependencies.submitPublishTask({
      accountForms,
      targets: record.targets,
      publishType: record.publishType,
      publishChannel: record.input.publishChannel,
      clientId: record.input.clientId,
      coverKey:
        (accountForms.find((item) => typeof item.coverKey === "string")?.coverKey as string | undefined) || "",
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
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export function getPublishDraftSnapshot(draftId: string): PublishDraftSnapshot | null {
  const record = draftStore.get(draftId);
  return record ? cloneSnapshot(record) : null;
}

export function clearPublishDraftStore(): void {
  draftStore.clear();
}

export function __setDraftTestDependencies(
  overrides: Partial<typeof defaultDraftDependencies>,
): void {
  Object.assign(draftDependencies, overrides);
}

export function __resetDraftTestDependencies(): void {
  Object.assign(draftDependencies, defaultDraftDependencies);
}
