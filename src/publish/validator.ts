import {
  getContentImages,
  getCoverMedia,
  getVerticalCoverMedia,
  getVideoMedia,
} from "./media-selection.js";
import type {
  DraftFieldDefinition,
  UniversalMediaInput,
  PublishDraftInput,
  PublishType,
} from "./types.js";

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items));
}

export function inferPublishType(input: PublishDraftInput): PublishType {
  if (input.publishType) {
    return input.publishType;
  }

  if (getVideoMedia(input.media)) {
    return "video";
  }

  if (getContentImages(input.media).length > 0) {
    return "imageText";
  }

  return "article";
}

export function validateDraftInput(input: PublishDraftInput): string[] {
  const blockers: string[] = [];
  const publishType = inferPublishType(input);

  if (!input.body?.trim()) {
    blockers.push("body 不能为空");
  }

  if (!input.platforms || input.platforms.length === 0) {
    blockers.push("platforms 至少需要一个目标平台");
  }

  blockers.push(...validateUploadedDraftMedia(input.media || []));
  blockers.push(...validatePublishTypeMedia(input, publishType));

  return blockers;
}

export function validateUploadedDraftMedia(media: UniversalMediaInput[]): string[] {
  const blockers: string[] = [];

  for (const [index, item] of media.entries()) {
    if (!item.key?.trim()) {
      blockers.push(`media[${index}] 缺少已上传素材 key，请先调用 upload_media 上传后再创建或更新草稿`);
    }

    if (item.localPath) {
      blockers.push(`media[${index}] 不能直接使用 localPath，请先调用 upload_media 上传并改用返回的 key`);
    }

    if (item.url) {
      blockers.push(`media[${index}] 不能直接使用 url，请先调用 upload_media 上传并改用返回的 key`);
    }
  }

  return dedupe(blockers);
}

function validatePublishTypeMedia(
  input: PublishDraftInput,
  publishType: PublishType,
): string[] {
  const blockers: string[] = [];
  const video = getVideoMedia(input.media);
  const images = getContentImages(input.media);
  const cover = getCoverMedia(input.media);
  const verticalCover = getVerticalCoverMedia(input.media);

  if (publishType === "video") {
    if (!video) {
      blockers.push("video 类型草稿需要先上传视频素材，再调用 create_publish_draft 或 update_publish_draft");
    }

    if (!cover) {
      blockers.push("video 类型草稿需要先上传封面素材，再调用 create_publish_draft 或 update_publish_draft");
    }

    return dedupe(blockers);
  }

  if (publishType === "imageText") {
    if (images.length === 0) {
      blockers.push("imageText 类型草稿需要先上传图片素材，再调用 create_publish_draft 或 update_publish_draft");
    }

    return dedupe(blockers);
  }

  if (!cover) {
    blockers.push("article 类型草稿需要先上传封面素材，再调用 create_publish_draft 或 update_publish_draft");
  }

  if (verticalCover && !verticalCover.key?.trim()) {
    blockers.push("article 类型草稿中的竖版封面必须先通过 upload_media 上传");
  }

  return dedupe(blockers);
}

export function collectProvidedFields(
  input: PublishDraftInput,
  publishType: PublishType,
  contentPublishForm: Record<string, unknown>,
): Set<string> {
  const fields = new Set<string>();
  const video = getVideoMedia(input.media);
  const images = getContentImages(input.media);
  const cover = getCoverMedia(input.media);
  const verticalCover = getVerticalCoverMedia(input.media);

  if (typeof contentPublishForm.title === "string" && contentPublishForm.title) {
    fields.add("title");
  }

  if (typeof contentPublishForm.description === "string" && contentPublishForm.description) {
    fields.add("description");
  }

  if (typeof contentPublishForm.content === "string" && contentPublishForm.content) {
    fields.add("content");
  }

  if (Array.isArray(contentPublishForm.tags) && contentPublishForm.tags.length > 0) {
    fields.add("tags");
  }

  if (video) {
    fields.add("video");
  }

  if (images.length > 0) {
    fields.add("images");
    fields.add("cover");
    fields.add("covers");
  }

  if (cover) {
    fields.add("cover");
    fields.add("covers");
    fields.add("horizontalCover");
    fields.add("headImage");
  }

  if (verticalCover) {
    fields.add("verticalCovers");
  }

  if (input.scheduleAt) {
    fields.add("scheduledTime");
  }

  return fields;
}

export function isValueTypeMatch(
  value: unknown,
  valueType: DraftFieldDefinition["valueType"],
): boolean {
  switch (valueType) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object" && value !== null && !Array.isArray(value);
    case "unknown":
    default:
      return true;
  }
}

export function validateFieldAnswer(
  field: DraftFieldDefinition,
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (field.availability !== "ready") {
    errors.push(field.limitation || `${field.platform} 的字段 ${field.name} 当前不可直接填写`);
    return errors;
  }

  if (!isValueTypeMatch(value, field.valueType)) {
    errors.push(
      `${field.platform} 的字段 ${field.name} 需要 ${field.valueType} 类型，当前收到 ${Array.isArray(value) ? "array" : typeof value}`,
    );
  }

  if (field.enumValues.length > 0) {
    const allowed = new Set(field.enumValues.map((item) => item.value));
    if (!allowed.has(value)) {
      errors.push(
        `${field.platform} 的字段 ${field.name} 只接受以下值: ${field.enumValues
          .map((item) => `${item.label}(${String(item.value)})`)
          .join("、")}`,
      );
    }
  }

  return dedupe(errors);
}
