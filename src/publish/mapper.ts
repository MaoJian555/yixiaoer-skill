import { buildContentPublishForm } from "../config/platform-rules.js";
import type {
  PlatformTextSnapshot,
  PublishDraftInput,
  PublishType,
  ResolvedPlatformAccount,
} from "./types.js";

const DEFAULT_TITLE_LIMIT = 50;
const DEFAULT_BODY_LIMIT = 2000;

const PLATFORM_TEXT_RULES: Record<
  string,
  { titleMax?: number; bodyMax?: number; inlineHashtags?: boolean }
> = {
  WeiXinGongZhongHao: { titleMax: 64, bodyMax: 20000 },
  XinLangWeiBo: { titleMax: 50, bodyMax: 2000, inlineHashtags: true },
  XiaoHongShu: { titleMax: 20, bodyMax: 1000 },
  XiaoHongShuShangJiaHao: { titleMax: 20, bodyMax: 1000 },
  DouYin: { titleMax: 50, bodyMax: 2200 },
};

function deriveTitle(title: string | undefined, body: string): string {
  const source = (title || body).trim();
  const firstLine = source.split(/\r?\n/)[0] || source;
  return firstLine.trim();
}

function truncateWithWarning(
  value: string,
  maxLength: number | undefined,
  label: string,
  warnings: string[],
): string {
  if (!maxLength || value.length <= maxLength) {
    return value;
  }

  warnings.push(`${label} 超过 ${maxLength} 字，已按预览规则截断`);
  return value.slice(0, maxLength);
}

export function buildPlatformTextSnapshot(
  input: PublishDraftInput,
  target: ResolvedPlatformAccount,
): PlatformTextSnapshot {
  const warnings: string[] = [];
  const rule = PLATFORM_TEXT_RULES[target.platformCode] || {};
  const baseBody = input.body.trim();
  const hashtags =
    rule.inlineHashtags && input.tags?.length
      ? `\n${input.tags.map((tag) => `#${tag}#`).join(" ")}`
      : "";

  const title = truncateWithWarning(
    deriveTitle(input.title, baseBody),
    rule.titleMax || DEFAULT_TITLE_LIMIT,
    `${target.platformName} 标题`,
    warnings,
  );

  const body = truncateWithWarning(
    `${baseBody}${hashtags}`.trim(),
    rule.bodyMax || DEFAULT_BODY_LIMIT,
    `${target.platformName} 正文`,
    warnings,
  );

  return { title, body, warnings };
}

export function buildPlatformContentForm(
  input: PublishDraftInput,
  target: ResolvedPlatformAccount,
  publishType: PublishType,
  overrides: Record<string, unknown> = {},
): { contentPublishForm: Record<string, unknown>; text: PlatformTextSnapshot } {
  const text = buildPlatformTextSnapshot(input, target);
  const rule = PLATFORM_TEXT_RULES[target.platformCode] || {};
  const baseForm = buildContentPublishForm(publishType, {
    title: text.title,
    description: text.body,
    tags: rule.inlineHashtags ? undefined : input.tags,
  }) as Record<string, unknown>;

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
