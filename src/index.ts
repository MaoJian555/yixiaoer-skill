import { Type } from "@sinclair/typebox";
import { YixiaoerService } from "./services/yixiaoer.service.js";
import { loadToolsFromMarkdown, schemaToTypebox } from "./tools/index.js";
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

const executeMethodMap: Record<string, (service: YixiaoerService, params: any) => Promise<SkillResult>> = {
  "service.publishMultiPlatform(params)": (service, params) => service.publishMultiPlatform(params),
  "service.publishVideo(params)": (service, params) => service.publishVideo(params),
  "service.publishImageText(params)": (service, params) => service.publishImageText(params),
  "service.publishArticle(params)": (service, params) => service.publishArticle(params),
  "service.listAccounts(params)": (service, params) => service.listAccounts(params),
  "service.getAccountOverviews(params)": (service, params) => service.getAccountOverviews(params),
  "service.listGroups(params)": (service, params) => service.listGroups(params),
  "service.getContentOverviews(params)": (service, params) => service.getContentOverviews(params),
  "service.getUploadUrl(params)": (service, params) => service.getUploadUrl(params),
  "service.getPublishPreset(params)": (service, params) => service.getPublishPreset(params),
  "service.getPlatformFormSchema(params)": (service, params) => service.getPlatformFormSchema(params),
  "service.validateForm(params)": (service, params) => service.validateForm(params),
  "service.batchPublish(params)": (service, params) => service.batchPublish(params),
};

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
    const pluginConfig = await api.pluginConfig;

    if (pluginConfig?.apiKey) {
      const client = await import("./api/client.js");
      client.setApiKey(pluginConfig.apiKey);
    }

    const tools = loadToolsFromMarkdown();
    console.log(`📋 从 tools.md 加载了 ${tools.length} 个工具定义`);

    for (const tool of tools) {
      const typeboxSchema = schemaToTypebox(tool.parameters as any);

      api.registerTool({
        name: tool.name,
        description: tool.description,
        parameters: typeboxSchema,
        async execute(_id: string, params: any) {
          const execFn = executeMethodMap[tool.executeMethod];
          if (!execFn) {
            return { success: false, message: `❌ 未找到执行方法: ${tool.executeMethod}` };
          }
          return execFn(service, params);
        }
      });
    }

    if (api.logger?.info) {
      api.logger.info("✅ 蚁小二多平台发布 Skill 已就绪");
    }
  }
};

export default yixiaoerPlugin;

export function definePluginEntry() {
  return yixiaoerPlugin;
}