import { PublishContent, Account, PublishResult } from "../types/publish.js";
import { getAdapter } from "../adapters/index.js";

/**
 * 发布服务 (核心)
 */
export class PublishService {
  /**
   * 执行多平台发布调度
   * @param content 统一发布模型
   * @param accounts 账号列表 (实际中应从数据库/环境变量获取)
   */
  async execute(content: PublishContent, accounts: Account[]): Promise<PublishResult[]> {
    const results: PublishResult[] = [];

    // 根据 platforms 循环调度不同的 Adapter
    for (const platform of content.platforms) {
      try {
        const adapter = getAdapter(platform);
        if (!adapter) {
          throw new Error(`Platform adapter for '${platform}' not found`);
        }

        // 找到对应平台的账号
        const account = accounts.find(a => a.platform === platform);
        if (!account) {
          throw new Error(`Account for '${platform}' not provided`);
        }

        // 同步调用 (本版本不带队列)
        const data = await adapter.publish(content, account);
        
        results.push({
          platform,
          success: true,
          data
        });
      } catch (error: any) {
        // 独立 try/catch，不影响其他平台发布
        console.error(`[PublishService] ${platform} 发布失败:`, error?.message);
        results.push({
          platform,
          success: false,
          error: error?.message || "Internal server error"
        });
      }
    }

    return results;
  }
}

// 导出单例，方便 Skill 层直接调用
export const publishService = new PublishService();
