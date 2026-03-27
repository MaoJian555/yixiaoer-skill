import { getClient } from "../api/client.js";
import type { SkillResult } from "../../types.d.ts";
import { PLATFORM_RULES, validatePublishParams } from "../config/platform-rules.js";
import type { PublishChannel, PublishType, ResolvedPlatformAccount } from "./types.js";

interface SubmitPublishTaskInput {
  accountForms: Record<string, unknown>[];
  targets: ResolvedPlatformAccount[];
  publishType: PublishType;
  publishChannel?: PublishChannel;
  clientId?: string;
  proxyId?: string;
  coverKey?: string;
}

function handleError(error: Error): SkillResult {
  const errorMsg = error.message;

  if (
    errorMsg.includes("登录已失效") ||
    errorMsg.includes("请重新登录") ||
    errorMsg.includes("apiKey") ||
    errorMsg.includes("401")
  ) {
    return {
      success: false,
      message: `❌ ${errorMsg}，请检查插件 API Key 是否配置正确且有效。`,
    };
  }

  return {
    success: false,
    message: `❌ ${errorMsg}`,
  };
}

function buildPlatformForms(
  targets: ResolvedPlatformAccount[],
  publishType: PublishType,
): {
  platformNames: string[];
  platformForms: Record<string, { formType: "task" }>;
} {
  const platformNames: string[] = [];
  const platformForms: Record<string, { formType: "task" }> = {};
  const seenPlatformNames = new Set<string>();

  for (const target of targets) {
    const rule = PLATFORM_RULES[target.platformCode];
    if (!rule) {
      throw new Error(`不支持的平台: ${target.platformName}`);
    }

    const validation = validatePublishParams(target.platformCode, publishType);
    if (!validation.valid) {
      throw new Error(`${target.platformName} 参数验证失败: ${validation.errors.join("; ")}`);
    }

    if (!seenPlatformNames.has(target.platformName)) {
      seenPlatformNames.add(target.platformName);
      platformNames.push(target.platformName);
    }
    platformForms[target.platformName] = { formType: "task" };
  }

  return {
    platformNames,
    platformForms,
  };
}

export async function submitPublishTask(
  params: SubmitPublishTaskInput,
): Promise<SkillResult> {
  try {
    if (!params.targets || params.targets.length === 0) {
      return {
        success: false,
        message: "❌ 参数错误: 缺少可发布的平台账号目标",
      };
    }

    const client = getClient();
    const publishChannel = params.publishChannel || "cloud";
    const finalPublishChannel = params.clientId ? "local" : publishChannel;
    const { platformNames, platformForms } = buildPlatformForms(params.targets, params.publishType);

    let publishArgs: Record<string, unknown> = {
      clientId: finalPublishChannel === "cloud" ? null : (params.clientId || null),
      platforms: platformNames,
      publishType: params.publishType,
      publishChannel: finalPublishChannel,
      coverKey: params.coverKey || "",
      proxyId: params.proxyId,
      publishArgs: {
        accountForms: params.accountForms,
        platformForms,
      },
    };

    let response: unknown;
    let isLocalPublish = finalPublishChannel === "local";

    try {
      response = await client.publishTask(publishArgs);
    } catch (error) {
      const errorMsg = (error as Error).message || "";
      if (errorMsg.includes("代理未设置") && params.clientId) {
        isLocalPublish = true;
        publishArgs = {
          clientId: params.clientId,
          platforms: platformNames,
          publishType: params.publishType,
          publishChannel: "local",
          coverKey: params.coverKey || "",
          proxyId: params.proxyId,
          publishArgs: {
            accountForms: params.accountForms,
            platformForms,
          },
        };
        response = await client.publishTask(publishArgs);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      message: `✅ ${isLocalPublish ? "本机发布" : "云发布"}任务已提交到 ${platformNames.join(", ")}，共 ${params.accountForms.length} 个账号`,
      data: response,
    };
  } catch (error) {
    return handleError(error as Error);
  }
}
