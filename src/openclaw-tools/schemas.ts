import type { JsonSchema } from "../schema/index.js";

const universalMediaSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: {
      type: "string",
      enum: ["image", "video"],
      description: "素材类型",
    },
    role: {
      type: "string",
      enum: ["content", "cover", "verticalCover"],
      description: "素材用途；默认 content",
    },
    url: {
      type: "string",
      description: "远程可访问的素材 URL",
    },
    key: {
      type: "string",
      description: "已上传到蚁小二的资源 key",
    },
    localPath: {
      type: "string",
      description: "本地文件路径",
    },
    mimeType: {
      type: "string",
      description: "MIME 类型，可选",
    },
    width: {
      type: "number",
      description: "宽度",
    },
    height: {
      type: "number",
      description: "高度",
    },
    size: {
      type: "number",
      description: "文件大小（字节）",
    },
    duration: {
      type: "number",
      description: "视频时长（秒）",
    },
  },
  required: ["kind"],
};

const uploadedDraftMediaSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: {
      type: "string",
      enum: ["image", "video"],
      description: "素材类型",
    },
    role: {
      type: "string",
      enum: ["content", "cover", "verticalCover"],
      description: "素材用途；默认 content",
    },
    key: {
      type: "string",
      description: "upload_media 返回的已上传素材 key",
    },
    mimeType: {
      type: "string",
      description: "MIME 类型，可选",
    },
    width: {
      type: "number",
      description: "宽度",
    },
    height: {
      type: "number",
      description: "高度",
    },
    size: {
      type: "number",
      description: "文件大小（字节）",
    },
    duration: {
      type: "number",
      description: "视频时长（秒）",
    },
  },
  required: ["kind", "key"],
};

const draftContentProperties: Record<string, JsonSchema> = {
  title: {
    type: "string",
    description: "内容标题；可选，不传时会从正文自动生成",
  },
  body: {
    type: "string",
    description: "正文内容",
  },
  media: {
    type: "array",
    description: "已通过 upload_media 标准化上传后的素材列表；草稿里不接受 localPath 或 url",
    items: uploadedDraftMediaSchema,
  },
  tags: {
    type: "array",
    description: "标签或话题列表",
    items: {
      type: "string",
    },
  },
  scheduleAt: {
    type: "number",
    description: "定时发布时间戳（毫秒）；不传表示立即发布",
  },
  platforms: {
    type: "array",
    description: "目标平台列表，如 ['微博', '小红书']",
    items: {
      type: "string",
    },
  },
  publishType: {
    type: "string",
    enum: ["video", "imageText", "article"],
    description: "内容类型；不传时会根据素材自动推断",
  },
  platformAccountIds: {
    type: "object",
    additionalProperties: true,
    description:
      "按平台显式指定账号 ID 的映射，例如 { '微博': '123456', '小红书': ['acc-1', 'acc-2'] }；值既可为单个账号 ID，也可为账号 ID 数组；当前不会自动查询账号列表",
  },
  publishChannel: {
    type: "string",
    enum: ["cloud", "local"],
    description: "发布方式；默认 cloud",
  },
  clientId: {
    type: "string",
    description: "本机发布时的设备 ID",
  },
};

export const createDraftSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: draftContentProperties,
  required: ["body", "platforms", "platformAccountIds"],
};

export const updateDraftSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    draftId: {
      type: "string",
      description: "已创建草稿的唯一标识",
    },
    ...draftContentProperties,
  },
  required: ["draftId"],
};

export const draftIdSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    draftId: {
      type: "string",
      description: "已创建草稿的唯一标识",
    },
  },
  required: ["draftId"],
};

export const answerDraftSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    draftId: {
      type: "string",
      description: "已创建草稿的唯一标识",
    },
    answers: {
      type: "object",
      description:
        "按目标填写的字段回答；单账号平台可继续使用平台名，若同平台存在多个账号，请使用 get_publish_requirements 返回的 targetKey 或 platformAccountId，例如 { 'DouYin:acc-1': { category: [...] } }",
      additionalProperties: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  required: ["draftId", "answers"],
};

export const uploadMediaSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    media: {
      type: "array",
      description: "待上传的媒体资源列表",
      items: universalMediaSchema,
    },
  },
  required: ["media"],
};

export const platformAccountCategoriesSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    platformAccountId: {
      type: "string",
      description: "蚁小二平台账号 ID",
    },
    publishType: {
      type: "string",
      enum: ["video", "imageText", "article"],
      description: "平台发布类型",
    },
  },
  required: ["platformAccountId", "publishType"],
};
