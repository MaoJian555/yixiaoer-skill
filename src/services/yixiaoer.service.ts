import { getClient } from "../api/client.js";
import * as accountModule from "../modules/account.js";
import * as publishFlowModule from "../modules/publish-flow.js";
import * as overviewModule from "../modules/overviews.js";
import type { SkillResult } from "../../types.d.ts";

/**
 * 蚁小二核心服务层
 * 封装所有业务逻辑、参数校验及预检流程
 */
export class YixiaoerService {
  private static instance: YixiaoerService;

  private constructor() {}

  public static getInstance(): YixiaoerService {
    if (!YixiaoerService.instance) {
      YixiaoerService.instance = new YixiaoerService();
    }
    return YixiaoerService.instance;
  }

  /**
   * 预检流程：校验 VIP 状态及基础权限
   */
  private async preflightCheck(): Promise<SkillResult | null> {
    try {
      const client = getClient();
      const teams = await client.getTeams();
      const currentTeam = teams.data?.[0];
      
      if (!currentTeam) {
        return {
          success: false,
          message: "❌ 未找到团队信息，请检查 API Key 是否正确。",
        };
      }

      if (!currentTeam.isVip) {
        return {
          success: false,
          message: "❌ 该团队未开通 VIP，不支持使用此插件进行自动化操作。",
        };
      }

      return null;
    } catch (e) {
      return {
        success: false,
        message: `❌ 预检失败: ${(e as Error).message}`,
      };
    }
  }

  /**
   * 自动发现账号 ID
   */
  public async discoverAccountId(platform: string, accountName?: string): Promise<{ id: string } | string> {
    const client = getClient();
    const res = await client.getAccounts({ page: 1, size: 200, loginStatus: 1 });
    
    if (!res.data || res.data.length === 0) {
      return "❌ 蚁小二账号下暂无已登录账号，请先在蚁小二官网绑定并登录。";
    }

    // 1. 过滤平台
    let matches = res.data.filter(a => a.platformName.includes(platform) || platform.includes(a.platformName));
    
    if (matches.length === 0) {
      const list = Array.from(new Set(res.data.map(a => a.platformName))).join("、");
      return `❌ 未找到名为'${platform}'的平台。当前可用平台: ${list}`;
    }

    // 2. 过滤账号名
    if (accountName) {
      matches = matches.filter(a => a.platformAccountName.includes(accountName));
    }

    if (matches.length > 1) {
      const list = matches.map(a => `${a.platformName}(${a.platformAccountName}) - ID: ${a.id}`).join("\n");
      return `❌ 匹配到多个账号，请指定 accountName 参数以区分:\n${list}`;
    }

    if (matches.length === 0) {
      return `❌ 在平台'${platform}'下未找到包含关键字'${accountName}'的账号。`;
    }

    return { id: matches[0].id || (matches[0] as any).accountId };
  }

  /**
   * 多平台统一发布
   */
  public async publishMultiPlatform(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const { platforms, publishType, title, description, videoPath, imagePaths, isDraft, scheduledTime, platformExtra } = params;

    if (!platforms || platforms.length === 0) {
      return { success: false, message: "❌ 请指定至少一个目标平台" };
    }

    if (!title || !description) {
      return { success: false, message: "❌ 标题和描述不能为空" };
    }

    const results: any[] = [];
    const errors: string[] = [];

    for (const platform of platforms) {
      try {
        const discovery = await this.discoverAccountId(platform);
        if (typeof discovery === "string") {
          errors.push(`[${platform}] ${discovery}`);
          continue;
        }

        const publishParams: any = {
          platform,
          title,
          description,
          platformAccountId: discovery.id,
          publishType,
          publishChannel: "cloud",
          platforms: [platform],
          isDraft,
          scheduledTime,
          ...platformExtra
        };

        if (publishType === "video" && videoPath) {
          publishParams.videoPath = videoPath;
        } else if (publishType === "imageText" && imagePaths) {
          publishParams.imagePaths = imagePaths;
        }

        const result = await publishFlowModule.publishFlow(publishParams);
        results.push({ platform, success: result.success, message: result.message });
      } catch (e: any) {
        errors.push(`[${platform}] ${(e as Error).message}`);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = errors.length + results.filter(r => !r.success).length;

    return {
      success: successCount > 0,
      message: `✅ 发布完成: 成功 ${successCount} 个, 失败 ${failCount} 个\n${results.map(r => `- ${r.platform}: ${r.success ? '✅' : '❌'} ${r.message}`).join('\n')}${errors.length ? '\n' + errors.join('\n') : ''}`,
      data: { results, errors }
    };
  }

  /**
   * 发布视频
   */
  public async publishVideo(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const discovery = await this.discoverAccountId(params.platform, params.accountName);
    if (typeof discovery === "string") {
      return { success: false, message: discovery };
    }

    if (!params.title || !params.videoPath) {
      return { success: false, message: "❌ 视频标题和视频资源不能为空" };
    }

    return publishFlowModule.publishFlow({
      ...params,
      platformAccountId: discovery.id,
      publishType: "video",
      publishChannel: "cloud",
      platforms: [params.platform]
    });
  }

  /**
   * 发布图文
   */
  public async publishImageText(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const discovery = await this.discoverAccountId(params.platform, params.accountName);
    if (typeof discovery === "string") {
      return { success: false, message: discovery };
    }

    if (!params.title || !params.description || !params.imagePaths?.length) {
      return { success: false, message: "❌ 标题、正文和图片不能为空" };
    }

    return publishFlowModule.publishFlow({
      ...params,
      platformAccountId: discovery.id,
      publishType: "imageText",
      publishChannel: "cloud",
      platforms: [params.platform]
    });
  }

  /**
   * 发布文章
   */
  public async publishArticle(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const discovery = await this.discoverAccountId(params.platform, params.accountName);
    if (typeof discovery === "string") {
      return { success: false, message: discovery };
    }

    if (!params.title || !params.description) {
      return { success: false, message: "❌ 文章标题和正文不能为空" };
    }

    return publishFlowModule.publishFlow({
      ...params,
      platformAccountId: discovery.id,
      publishType: "article",
      publishChannel: "cloud",
      platforms: [params.platform]
    });
  }

  /**
   * 获取账号列表
   */
  public async listAccounts(params: any): Promise<SkillResult> {
    return accountModule.listAccounts(params);
  }

  /**
   * 获取账号概览
   */
  public async getAccountOverviews(params: any): Promise<SkillResult> {
    return overviewModule.getAccountOverviewsV2(params);
  }

  /**
   * 获取作品概览
   */
  public async getContentOverviews(params: any): Promise<SkillResult> {
    return overviewModule.getContentOverviews(params);
  }

  /**
   * 获取素材上传地址
   */
  public async getUploadUrl(params: any): Promise<SkillResult> {
    try {
      const client = getClient();
      const res = await client.getUploadUrl(params.fileName, params.fileSize, params.contentType);
      return { success: true, message: `✅ 上传地址已生成\nKey: ${res.fileKey}`, data: res };
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  }

  /**
   * 获取发布预设
   */
  public async getPublishPreset(params: { platformAccountId: string }): Promise<SkillResult> {
    return accountModule.getPublishPreset(params);
  }

  /**
   * 验证表单字段
   */
  public async validateForm(params: { platform: string; publishType: string; data: any }): Promise<SkillResult> {
    const { platform, publishType, data } = params;
    const errors: string[] = [];
    const missingFields: string[] = [];

    // 基础字段校验
    if (!data.title) missingFields.push("title");
    if (!data.description) missingFields.push("description");

    // 类型特定校验
    if (publishType === "video" && !data.videoPath) {
      missingFields.push("videoPath");
    }
    if (publishType === "imageText" && (!data.imagePaths || data.imagePaths.length === 0)) {
      missingFields.push("imagePaths");
    }

    // 平台特定校验
    const platformRules: Record<string, string[]> = {
      "B站": ["tags", "category", "declaration", "type"],
      "百家号": ["tags", "declaration"],
      "知乎": ["category"],
      "头条号": ["tags"]
    };

    const requiredFields = platformRules[platform] || [];
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }

    const valid = missingFields.length === 0;

    return {
      success: valid,
      message: valid 
        ? "✅ 表单验证通过" 
        : `❌ 缺少必填字段: ${missingFields.join(", ")}`,
      data: {
        valid,
        missingFields,
        providedFields: Object.keys(data).filter(k => data[k] !== undefined),
        requiredFields: ["title", "description", ...requiredFields]
      }
    };
  }
}