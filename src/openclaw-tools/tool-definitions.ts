import type { SkillResult } from "../../types.d.ts";
import {
  createPublishDraft,
  getPublishRequirements,
  previewPublishDraft,
  publishDraft,
  submitPublishAnswers,
  updatePublishDraft,
} from "../publish/drafts.js";
import { uploadMediaAsset } from "../publish/media.js";
import type { UniversalMediaInput } from "../publish/types.js";
import type { JsonSchema } from "../schema/index.js";
import {
  answerDraftSchema,
  createDraftSchema,
  draftIdSchema,
  updateDraftSchema,
  uploadMediaSchema,
} from "./schemas.js";

export interface OpenClawToolDefinition {
  name: string;
  description: string;
  parameters: JsonSchema;
  optional?: boolean;
  execute: (_id: string, params: Record<string, unknown>) => Promise<SkillResult>;
}

async function uploadAll(mediaList: UniversalMediaInput[]): Promise<SkillResult> {
  if (mediaList.length === 0) {
    return {
      success: false,
      message: "media 不能为空",
    };
  }

  const uploaded = [];
  for (const media of mediaList) {
    const result = await uploadMediaAsset(media);
    uploaded.push({
      kind: media.kind,
      role: media.role || "content",
      key: result.key,
      width: result.width,
      height: result.height,
      size: result.size,
      duration: result.duration,
      mimeType: result.mimeType,
    });
  }

  return {
    success: true,
    message: `已完成 ${uploaded.length} 个素材的标准化上传，可直接用于创建发布草稿。`,
    data: {
      media: uploaded,
    },
  };
}

export const OPENCLAW_TOOLS: OpenClawToolDefinition[] = [
  {
    name: "create_publish_draft",
    description: "创建发布草稿。必须先调用 upload_media 上传素材，再用返回的 key 记录正文、素材、目标平台和账号选择，随后进入字段协商流程。",
    parameters: createDraftSchema,
    optional: true,
    async execute(_id, params) {
      return createPublishDraft(params as any);
    },
  },
  {
    name: "update_publish_draft",
    description: "更新已存在的发布草稿；若要替换素材，必须先调用 upload_media，再提交新的已上传素材 key。",
    parameters: updateDraftSchema,
    optional: true,
    async execute(_id, params) {
      return updatePublishDraft(params as any);
    },
  },
  {
    name: "get_publish_requirements",
    description: "读取草稿对应的平台字段要求、预设选项和当前不可填写的限制说明。该步骤默认建立在已上传素材的草稿之上。",
    parameters: draftIdSchema,
    optional: true,
    async execute(_id, params) {
      return getPublishRequirements({ draftId: String(params.draftId || "") });
    },
  },
  {
    name: "submit_publish_answers",
    description: "按平台提交字段回答；只能提交 get_publish_requirements 返回的协商字段。",
    parameters: answerDraftSchema,
    optional: true,
    async execute(_id, params) {
      return submitPublishAnswers({
        draftId: String(params.draftId || ""),
        answers: (params.answers as Record<string, Record<string, unknown>>) || {},
      });
    },
  },
  {
    name: "preview_publish_draft",
    description: "基于草稿和已验证字段答案生成发布预览，并返回剩余阻塞项；不会再隐式上传素材。",
    parameters: draftIdSchema,
    optional: true,
    async execute(_id, params) {
      return previewPublishDraft({ draftId: String(params.draftId || "") });
    },
  },
  {
    name: "publish_draft",
    description: "在用户确认预览后执行正式发布；只接受已完成校验且已附带上传素材 key 的草稿。",
    parameters: draftIdSchema,
    optional: true,
    async execute(_id, params) {
      return publishDraft({ draftId: String(params.draftId || "") });
    },
  },
  {
    name: "upload_media",
    description: "发布流程的必经前置步骤。当用户提供图片或视频 URL、本地文件路径时，先将素材标准化并上传为可复用的资源 key，再把返回结果写入草稿 media。",
    parameters: uploadMediaSchema,
    optional: true,
    async execute(_id, params) {
      return uploadAll(Array.isArray(params.media) ? (params.media as UniversalMediaInput[]) : []);
    },
  },
];
