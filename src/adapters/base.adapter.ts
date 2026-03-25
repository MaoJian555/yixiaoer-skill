import { PublishContent, Account } from "../types/publish.js";

/**
 * 平台适配器接口
 */
export interface PlatformAdapter {
  /**
   * 发布内容到指定账号
   */
  publish(content: PublishContent, account: Account): Promise<any>;
}
