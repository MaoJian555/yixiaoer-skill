import { jsonSchemaToTypeBox } from "../schema/index.js";
import type { SkillResult } from "../../types.d.ts";
import type { OpenClawPluginAPI } from "./api.js";
import { OPENCLAW_TOOLS } from "./tool-definitions.js";

function toAgentToolResult(result: SkillResult) {
  return {
    content: [
      {
        type: "text" as const,
        text: result.message,
      },
    ],
    details: {
      success: result.success,
      message: result.message,
      data: result.data,
    },
  };
}

export function registerOpenClawTools(api: OpenClawPluginAPI): void {
  for (const tool of OPENCLAW_TOOLS) {
    api.registerTool(
      {
        name: tool.name,
        label: tool.name,
        description: tool.description,
        parameters: jsonSchemaToTypeBox(tool.parameters),
        async execute(toolCallId, params) {
          return toAgentToolResult(await tool.execute(toolCallId, params as Record<string, unknown>));
        },
      },
      tool.optional ? { optional: true } : undefined,
    );
  }

  api.logger?.info?.(
    "✅ 技能内发布工具已按 optional 方式注册：upload -> create/update draft -> requirements -> answers -> preview -> publish",
  );
}

export type { OpenClawToolDefinition } from "./tool-definitions.js";
export type { OpenClawPluginAPI } from "./api.js";
