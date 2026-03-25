import { PlatformAdapter } from "./base.adapter.js";
import { PublishContent, Account, CloudTaskPushRequest } from "../types/publish.js";
import { getClient } from "../api/client.js";

/**
 * 哔哩哔哩平台适配器
 */
export class BilibiliAdapter implements PlatformAdapter {
  async publish(content: PublishContent, account: Account): Promise<any> {
    const client = getClient();

    const bilibiliForm = {
      title: content.title,
      description: content.content,
      tags: content.tags || [],
      // B站特有字段要求：category, declaration, type
      category: content.platformExtra?.bilibili?.category || [],
      declaration: content.platformExtra?.bilibili?.declaration || 0,
      type: content.platformExtra?.bilibili?.type || 1, // 1:自制
      ...content.platformExtra?.bilibili
    };

    const request: CloudTaskPushRequest = {
      coverKey: content.coverKey || (content.images?.[0] || ""),
      description: content.description || content.title,
      platforms: ["哔哩哔哩"],
      publishType: content.publishType, 
      isDraft: content.isDraft ?? false,
      publishArgs: {
        content: content.content || "",
        accountForms: [
          {
            platformAccountId: account.platformAccountId || account.accessToken,
            coverKey: content.coverKey || (content.images?.[0] || ""),
            contentPublishForm: bilibiliForm
          }
        ]
      }
    };

    console.log(`[BilibiliAdapter] 提交 B 站任务到枢纽`);
    return await client.publishTask(request);
  }
}
