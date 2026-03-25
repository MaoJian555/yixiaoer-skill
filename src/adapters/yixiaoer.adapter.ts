import { PlatformAdapter } from "./base.adapter.js";
import { PublishContent, Account, CloudTaskPushRequest } from "../types/publish.js";
import { getClient } from "../api/client.js";

/**
 * 蚁小二自适配器 (通用 HUB 模式)
 * 实现 TaskSet V2 接口对接
 */
export class YiXiaoErAdapter implements PlatformAdapter {
  async publish(content: PublishContent, account: Account): Promise<any> {
    const client = getClient();
    
    // 基础映射规则 (示例): title -> title, content -> body (YiXiaoEr 内核)
    // 根据 OpenAPI 规范，准备 CloudTaskPushRequest
    const request: CloudTaskPushRequest = {
      coverKey: content.coverKey || (content.images?.[0] || ""),
      description: content.description || content.title,
      platforms: [account.platform],
      publishType: content.publishType || "imageText", 
      isDraft: content.isDraft ?? false,
      publishArgs: {
        content: content.content || "", // 文章/图文必填
        accountForms: [
          {
            platformAccountId: account.platformAccountId || account.accessToken, // 必须携带 ID
            coverKey: content.coverKey || (content.images?.[0] || ""),
            images: content.images || [],
            contentPublishForm: {
              // 此处映射 YiXiaoEr 核心平台的自定义字段
              title: content.title,
              body: content.content, // 要求: content -> body
              ...content.platformExtra?.yixiaoer
            }
          }
        ]
      }
    };

    console.log(`[YiXiaoErAdapter] 正在向开放平台提交任务集: ${account.platform}`);
    return await client.publishTask(request);
  }
}
