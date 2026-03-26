import { Type } from "@sinclair/typebox";
import { YixiaoerService } from "./services/yixiaoer.service.js";
import type { SkillResult } from "../types.d.ts";

interface PluginAPI {
  registerTool: (tool: {
    name: string;
    description: string;
    parameters: unknown;
    execute: (_id: string, params: Record<string, unknown>) => Promise<SkillResult>;
  }, opts?: { optional?: boolean }) => void;
  pluginConfig?: { apiKey?: string; platformAccounts?: Record<string, string> };
  config?: { apiKey?: string; platformAccounts?: Record<string, string> };
  logger?: { info?: (msg: string) => void; error?: (msg: string) => void };
}

const yixiaoerPlugin = {
  id: "openclaw-yixiaoer",
  name: "蚁小二多平台发布",
  description: "蚁小二自媒体多平台发布插件。集成40+主流平台内容一键发布、账号管理、数据监控。支持视频、图文、文章三种内容类型的批量同步发布。",
  kind: "tool" as const,

  configSchema: Type.Object({
    apiKey: Type.String({ minLength: 1 }),
    platformAccounts: Type.Optional(Type.Record(Type.String(), Type.String()))
  }),
  uiHints: {
    apiKey: {
      label: "蚁小二 API Key",
      sensitive: true,
      placeholder: "从蚁小二后台获取",
      help: "在蚁小二开放平台获取 API Key"
    }
  },

  async register(api: PluginAPI) {
    const service = YixiaoerService.getInstance();
    const pluginConfig = api.pluginConfig ?? api.config;

    if (pluginConfig?.apiKey) {
      const client = await import("./api/client.js");
      client.setApiKey(pluginConfig.apiKey);
    }

  // ==================== 核心发布工具 ====================

  /**
   * 多平台统一发布（核心能力）
   * 
   * 优化版本 v1.1.0:
   * - 支持 videoKey 参数，直接使用已上传的 OSS 视频 key
   */
  api.registerTool({
    name: "multi_platform_publish",
    description: "【核心能力】一键发布内容到多个平台。支持视频、图文、文章三种类型，批量执行并返回各平台独立状态。",
    parameters: Type.Object({
      title: Type.String({ description: "标题（必填，最大50字）" }),
      description: Type.String({ description: "描述/正文内容（必填，最大2000字）" }),
      publishType: Type.Union([
        Type.Literal("video"),
        Type.Literal("imageText"),
        Type.Literal("article")
      ], { description: "内容类型：video=视频, imageText=图文, article=文章" }),
      platforms: Type.Array(Type.String(), { 
        description: "目标平台列表，如 ['抖音', '小红书', 'B站']" 
      }),
      videoPath: Type.Optional(Type.String({ description: "视频URL或本地路径（与 videoKey 二选一）" })),
      videoKey: Type.Optional(Type.String({ description: "【优化】视频 OSS Key，已有视频时直接使用" })),
      imagePaths: Type.Optional(Type.Array(Type.String(), { description: "图片URL列表（图文类型必填）" })),
      coverPath: Type.Optional(Type.String({ description: "封面图片URL或路径" })),
      isDraft: Type.Optional(Type.Boolean({ default: false, description: "是否保存为草稿" })),
      scheduledTime: Type.Optional(Type.Number({ description: "定时发布时间戳（毫秒）" })),
      platformExtra: Type.Optional(Type.Object({}, { 
        additionalProperties: true, 
        description: "平台特定字段，如声明类型、分类、标签等" 
      }))
    }),
    async execute(_id: string, params: any) {
      return service.publishMultiPlatform(params);
    }
  });

  /**
   * 发布视频
   * 
   * 优化版本 v1.1.0:
   * - 支持 videoKey 参数，直接使用已上传的 OSS 视频 key
   * - 支持 coverKey 参数，直接使用已上传的 OSS 封面 key
   * - 未提供封面时自动从视频提取（需安装 ffmpeg-static）
   */
  api.registerTool({
    name: "publish_video",
    description: "发布视频到指定平台。支持抖音、快手、小红书、视频号、B站等28+平台。【新增】支持 videoKey/coverKey 直接使用已上传资源。",
    parameters: Type.Object({
      platform: Type.String({ description: "目标平台名称，如 '抖音'、'小红书'" }),
      accountName: Type.Optional(Type.String({ description: "账号名称关键字（用于匹配多账号）" })),
      title: Type.String({ description: "视频标题" }),
      description: Type.String({ description: "视频描述" }),
      videoPath: Type.Optional(Type.String({ description: "视频URL或本地路径（与 videoKey 二选一）" })),
      videoKey: Type.Optional(Type.String({ description: "【优化】视频 OSS Key，已有视频时直接使用，避免重复上传" })),
      coverPath: Type.Optional(Type.String({ description: "封面图片URL或路径（与 coverKey 二选一）" })),
      coverKey: Type.Optional(Type.String({ description: "【优化】封面 OSS Key，已有封面时直接使用" })),
      autoExtractCover: Type.Optional(Type.Boolean({ default: true, description: "【优化】未提供封面时自动从视频提取（需要 ffmpeg）" })),
      isDraft: Type.Optional(Type.Boolean({ default: false })),
      scheduledTime: Type.Optional(Type.Number()),
      declaration: Type.Optional(Type.Number({ description: "创作声明类型" })),
      category: Type.Optional(Type.Any({ description: "分类信息" })),
      tags: Type.Optional(Type.Array(Type.String(), { description: "标签列表" }))
    }),
    async execute(_id: string, params: any) {
      return service.publishVideo(params);
    }
  });

  /**
   * 发布图文
   */
  api.registerTool({
    name: "publish_image_text",
    description: "发布图文内容到指定平台。支持抖音、快手、小红书、视频号、微博等9个平台。",
    parameters: Type.Object({
      platform: Type.String({ description: "目标平台名称" }),
      accountName: Type.Optional(Type.String({ description: "账号名称关键字" })),
      title: Type.String({ description: "标题" }),
      description: Type.String({ description: "正文内容" }),
      imagePaths: Type.Array(Type.String(), { description: "图片URL列表" }),
      isDraft: Type.Optional(Type.Boolean({ default: false })),
      scheduledTime: Type.Optional(Type.Number()),
      location: Type.Optional(Type.Any({ description: "位置信息" })),
      music: Type.Optional(Type.Any({ description: "音乐信息" }))
    }),
    async execute(_id: string, params: any) {
      return service.publishImageText(params);
    }
  });

  /**
   * 发布文章
   */
  api.registerTool({
    name: "publish_article",
    description: "发布文章到指定平台。支持微信公众号、百家号、头条号、知乎、微博等20+平台。",
    parameters: Type.Object({
      platform: Type.String({ description: "目标平台名称" }),
      accountName: Type.Optional(Type.String({ description: "账号名称关键字" })),
      title: Type.String({ description: "文章标题" }),
      description: Type.String({ description: "文章正文（HTML或纯文本）" }),
      coverPath: Type.Optional(Type.String({ description: "封面图片" })),
      isDraft: Type.Optional(Type.Boolean({ default: false })),
      scheduledTime: Type.Optional(Type.Number()),
      category: Type.Optional(Type.Any({ description: "分类" })),
      tags: Type.Optional(Type.Array(Type.String())),
      isOriginal: Type.Optional(Type.Boolean({ description: "是否原创" }))
    }),
    async execute(_id: string, params: any) {
      return service.publishArticle(params);
    }
  });

  // ==================== 账号管理工具 ====================

  /**
   * 获取账号列表
   */
  api.registerTool({
    name: "list_accounts",
    description: "获取蚁小二已绑定的账号列表。返回所有登录状态正常的账号信息。",
    parameters: Type.Object({
      platform: Type.Optional(Type.String({ description: "平台名称筛选" })),
      loginStatus: Type.Optional(Type.Number({ default: 1, description: "登录状态：1=正常" })),
      page: Type.Optional(Type.Number({ default: 1 })),
      size: Type.Optional(Type.Number({ default: 50 }))
    }),
    async execute(_id: string, params: any) {
      return service.listAccounts(params);
    }
  });

  /**
   * 获取账号概览
   */
  api.registerTool({
    name: "account_overviews",
    description: "获取账号数据概览，包括粉丝数、作品数等统计信息。",
    parameters: Type.Object({
      platform: Type.String({ description: "平台名称（必填）" }),
      page: Type.Optional(Type.Number({ default: 1 })),
      size: Type.Optional(Type.Number({ default: 20 })),
      name: Type.Optional(Type.String({ description: "账号名称筛选" })),
      group: Type.Optional(Type.String({ description: "分组筛选" }))
    }),
    async execute(_id: string, params: any) {
      return service.getAccountOverviews(params);
    }
  });

  /**
   * 获取分组列表
   */
  api.registerTool({
    name: "list_groups",
    description: "获取分组列表。通过分组可以查出分组里面的账号信息。",
    parameters: Type.Object({
      name: Type.Optional(Type.String({ description: "分组名称筛选" })),
      onlySelf: Type.Optional(Type.Boolean({ description: "仅查看自己创建的分组" })),
      page: Type.Optional(Type.Number({ default: 1 })),
      size: Type.Optional(Type.Number({ default: 10 })),
      visibleScope: Type.Optional(Type.Union([
        Type.Literal("all"),
        Type.Literal("specific")
      ], { description: "可见范围: all=所有用户可见, specific=指定用户可见" }))
    }),
    async execute(_id: string, params: any) {
      return service.listGroups(params);
    }
  });

  // ==================== 数据查询工具 ====================

  /**
   * 获取作品数据
   */
  api.registerTool({
    name: "content_overviews",
    description: "查询已发布作品的数据列表，支持多维度筛选。",
    parameters: Type.Object({
      platformAccountId: Type.Optional(Type.String({ description: "平台账号ID" })),
      platform: Type.Optional(Type.String({ description: "平台名称" })),
      type: Type.Optional(Type.String({ description: "内容类型：all/video/miniVideo/dynamic/article" })),
      title: Type.Optional(Type.String({ description: "标题关键字" })),
      publishStartTime: Type.Optional(Type.Number({ description: "发布开始时间戳" })),
      publishEndTime: Type.Optional(Type.Number({ description: "发布结束时间戳" })),
      page: Type.Optional(Type.Number({ default: 1 })),
      size: Type.Optional(Type.Number({ default: 20 }))
    }),
    async execute(_id: string, params: any) {
      return service.getContentOverviews(params);
    }
  });

  // ==================== 辅助工具 ====================

  /**
   * 获取上传地址
   */
  api.registerTool({
    name: "upload_url",
    description: "获取素材上传地址。本地文件需先调用此接口获取上传Key后再发布。",
    parameters: Type.Object({
      fileName: Type.String({ description: "文件名" }),
      fileSize: Type.Number({ description: "文件大小（字节）" }),
      contentType: Type.Optional(Type.String({ description: "内容类型" }))
    }),
    async execute(_id: string, params: any) {
      return service.getUploadUrl(params);
    }
  });

  /**
   * 获取发布预设
   */
  api.registerTool({
    name: "get_publish_preset",
    description: "获取平台发布预设数据，包括分类、话题、标签等选项。",
    parameters: Type.Object({
      platformAccountId: Type.String({ description: "平台账号ID" })
    }),
    async execute(_id: string, params: any) {
      return service.getPublishPreset(params);
    }
  });

  /**
   * 验证表单字段
   */
  api.registerTool({
    name: "validate_form",
    description: "验证发布表单是否符合平台要求，返回缺失字段和错误信息。",
    parameters: Type.Object({
      platform: Type.String({ description: "平台名称" }),
      publishType: Type.String({ description: "内容类型" }),
      data: Type.Object({}, { additionalProperties: true, description: "表单数据" })
    }),
    async execute(_id: string, params: any) {
      return service.validateForm(params);
    }
  });

  /**
   * 批量发布（一次请求多账号）
   */
  api.registerTool({
    name: "batch_publish",
    description: "批量发布内容到多个平台。一次请求可传多个 accountForms，支持视频、图文、文章类型。",
    parameters: Type.Object({
      accountForms: Type.Array(Type.Object({
        platformAccountId: Type.String({ description: "平台账号ID" }),
        publishContentId: Type.Optional(Type.String({ description: "发布内容ID" })),
        coverKey: Type.Optional(Type.String({ description: "封面Key（OSS）" })),
        cover: Type.Optional(Type.Object({
          key: Type.Optional(Type.String({ description: "封面Key" })),
          path: Type.Optional(Type.String({ description: "封面路径或URL" })),
          width: Type.Number({ description: "封面宽度" }),
          height: Type.Number({ description: "封面高度" }),
          size: Type.Number({ description: "封面大小" })
        })),
        video: Type.Optional(Type.Object({
          key: Type.Optional(Type.String({ description: "视频Key" })),
          path: Type.Optional(Type.String({ description: "视频路径或URL" })),
          duration: Type.Number({ description: "视频时长（秒）" }),
          width: Type.Number({ description: "视频宽度" }),
          height: Type.Number({ description: "视频高度" }),
          size: Type.Number({ description: "视频大小" })
        })),
        images: Type.Optional(Type.Array(Type.Object({
          key: Type.Optional(Type.String({ description: "图片Key" })),
          path: Type.Optional(Type.String({ description: "图片路径或URL" })),
          width: Type.Number({ description: "图片宽度" }),
          height: Type.Number({ description: "图片高度" }),
          size: Type.Number({ description: "图片大小" })
        }))),
        contentPublishForm: Type.Object({}, { additionalProperties: true, description: "平台发布表单数据" })
      }), { description: "账号表单列表，可传多个账号" }),
      platforms: Type.Array(Type.String(), { description: "目标平台列表，如 ['抖音', '小红书']" }),
      publishType: Type.Union([
        Type.Literal("video"),
        Type.Literal("imageText"),
        Type.Literal("article")
      ], { description: "内容类型：video=视频, imageText=图文, article=文章" }),
      publishChannel: Type.Optional(Type.Union([
        Type.Literal("local"),
        Type.Literal("cloud")
      ], { description: "发布渠道：local=本机发布, cloud=云发布" })),
      clientId: Type.Optional(Type.String({ description: "客户端ID（本机发布时必填）" })),
      coverKey: Type.Optional(Type.String({ description: "素材coverKey" }))
    }),
    async execute(_id: string, params: any) {
      return service.batchPublish(params);
    }
  });

  if (api.logger?.info) {
    api.logger.info("✅ 蚁小二多平台发布 Skill 已就绪");
  }
  }
};

export default yixiaoerPlugin;

export function definePluginEntry() {
  return yixiaoerPlugin;
}
