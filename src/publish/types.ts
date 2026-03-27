export type PublishType = "video" | "imageText" | "article";

export type MediaKind = "image" | "video";

export type MediaRole = "content" | "cover" | "verticalCover";

export type PublishChannel = "cloud" | "local";

export type PlatformAccountIdInput = string | string[];

export interface UniversalMediaInput {
  kind: MediaKind;
  role?: MediaRole;
  url?: string;
  key?: string;
  localPath?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: number;
}

export interface PublishDraftInput {
  title?: string;
  body: string;
  media?: UniversalMediaInput[];
  tags?: string[];
  scheduleAt?: number;
  platforms: string[];
  publishType?: PublishType;
  platformAccountIds?: Record<string, PlatformAccountIdInput>;
  publishChannel?: PublishChannel;
  clientId?: string;
}

export interface UpdatePublishDraftInput {
  draftId: string;
  title?: string;
  body?: string;
  media?: UniversalMediaInput[];
  tags?: string[];
  scheduleAt?: number;
  platforms?: string[];
  publishType?: PublishType;
  platformAccountIds?: Record<string, PlatformAccountIdInput>;
  publishChannel?: PublishChannel;
  clientId?: string;
}

export interface ResolvedPlatformAccount {
  targetKey: string;
  platformInput: string;
  platformCode: string;
  platformName: string;
  platformAccountId: string;
  platformAccountName: string;
}

export interface PlatformTextSnapshot {
  title: string;
  body: string;
  warnings: string[];
}

export interface PlatformPreviewItem {
  targetKey: string;
  platform: string;
  platformCode: string;
  accountId: string;
  accountName: string;
  publishType: PublishType;
  title: string;
  body: string;
  requiredFields: string[];
  missingFields: string[];
  mediaSummary: string[];
  warnings: string[];
}

export interface DraftFieldOption {
  value: unknown;
  label: string;
}

export type DraftFieldSource = "static" | "preset" | "resolver";

export type DraftFieldAvailability = "ready" | "limited" | "unsupported";

export interface DraftFieldDefinition {
  targetKey: string;
  name: string;
  platform: string;
  platformCode: string;
  accountId: string;
  accountName: string;
  publishType: PublishType;
  rawType: string;
  valueType: "string" | "number" | "boolean" | "array" | "object" | "unknown";
  required: boolean;
  description: string;
  example: string;
  enumValues: DraftFieldOption[];
  source: DraftFieldSource;
  availability: DraftFieldAvailability;
  options?: unknown;
  limitation?: string;
}

export interface DraftPlatformRequirements {
  targetKey: string;
  platform: string;
  platformCode: string;
  accountId: string;
  accountName: string;
  publishType: PublishType;
  fields: DraftFieldDefinition[];
  blockers: string[];
  warnings: string[];
}

export interface DraftValidationIssue {
  platform: string;
  platformCode: string;
  field?: string;
  message: string;
}

export interface DraftValidationState {
  issues: DraftValidationIssue[];
  blockers: string[];
  warnings: string[];
}

export interface DraftPreviewState {
  publishType: PublishType;
  previewItems: PlatformPreviewItem[];
  blockers: string[];
  warnings: string[];
}

export interface PublishDraftRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  input: PublishDraftInput;
  publishType: PublishType;
  targets: ResolvedPlatformAccount[];
  answers: Record<string, Record<string, unknown>>;
  validation: DraftValidationState;
  preview?: DraftPreviewState;
}

export interface PublishDraftSnapshot {
  id: string;
  createdAt: number;
  updatedAt: number;
  publishType: PublishType;
  input: PublishDraftInput;
  targets: ResolvedPlatformAccount[];
  answers: Record<string, Record<string, unknown>>;
  validation: DraftValidationState;
  preview?: DraftPreviewState;
}
