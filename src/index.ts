import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { setApiKey } from "./api/client.js";
import { registerOpenClawTools, type OpenClawPluginAPI } from "./openclaw-tools/index.js";

interface PluginConfig {
  apiKey?: string;
}

const pluginConfigJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["apiKey"],
  properties: {
    apiKey: {
      type: "string",
      description: "蚁小二 API Key（必填，从蚁小二后台获取）",
    },
  },
} as const;

const pluginConfigUiHints = {
  apiKey: {
    label: "蚁小二 API Key",
    sensitive: true,
    placeholder: "从蚁小二后台获取",
    help: "在蚁小二开放平台获取 API Key",
  },
} as const;

const yixiaoerPlugin = definePluginEntry({
  id: "openclaw-yixiaoer",
  name: "蚁小二多平台发布",
  description: "蚁小二自媒体多平台发布插件。集成40+主流平台内容一键发布、账号管理、数据监控。支持视频、图文、文章三种内容类型的批量同步发布。",

  configSchema: {
    jsonSchema: pluginConfigJsonSchema,
    uiHints: pluginConfigUiHints,
    validate(value) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {
          ok: false,
          errors: ["插件配置必须是对象"],
        };
      }

      const apiKey = (value as PluginConfig).apiKey;
      if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
        return {
          ok: false,
          errors: ["apiKey 为必填字符串"],
        };
      }

      return {
        ok: true,
        value,
      };
    },
  },

  register(api: OpenClawPluginAPI) {
    const pluginConfig = api.pluginConfig as PluginConfig | undefined;
    const fallbackConfig = api.config as PluginConfig | undefined;
    const apiKey = pluginConfig?.apiKey || fallbackConfig?.apiKey;

    if (apiKey) {
      setApiKey(apiKey);
    }

    registerOpenClawTools(api);
  }
});

export default yixiaoerPlugin;
