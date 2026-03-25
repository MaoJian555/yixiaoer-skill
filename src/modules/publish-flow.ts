import { getClient } from "../api/client.js";
import type { SkillResult } from "../../types.d.ts";
import * as publish from "./publish.js";

interface PublishFlowParams {
  // publish params
  platforms: string[];
  publishType: "video" | "article" | "imageText" | "image";
  platformAccountId: string;
  title: string;
  description: string;
  desc?: string;
  publishChannel?: string;
  clientId?: string;
  publishContentId?: string;
  createType?: number;
  pubType?: number;
  coverKey?: string;
  videoPath?: string;
  videoSize?: number;
  videoDuration?: number;
  videoWidth?: number;
  videoHeight?: number;
  coverPath?: string;
  verticalCoverPath?: string;
  verticalCoverKey?: string;
  imagePaths?: string[];
  coverSize?: number;
  verticalCoverSize?: number;
  coverWidth?: number;
  verticalCoverWidth?: number;
  coverHeight?: number;
  verticalCoverHeight?: number;
  contentPublishForm?: Record<string, any>;
}

export async function publishFlow(params: PublishFlowParams): Promise<SkillResult> {
  try {
    return await publish.publishContent(params);
  } catch (error) {
    return {
      success: false,
      message: `❌ 发布流程执行失败: ${(error as Error).message}`,
    };
  }
}
