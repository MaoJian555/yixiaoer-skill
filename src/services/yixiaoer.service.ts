import { getClient } from "../api/client.js";
import * as accountModule from "../modules/account.js";
import * as publishFlowModule from "../modules/publish-flow.js";
import * as publishModule from "../modules/publish.js";
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
   * 获取分组列表
   */
  public async listGroups(params: any): Promise<SkillResult> {
    return accountModule.listGroups(params);
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
      "头条号": ["tags"],
      "一点号": ["tags", "category"],
      "网易号": ["tags", "category"]
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

  /**
   * 批量发布内容（一次请求传多个账号）
   * 支持平台兼容性校验、自动过滤不支持的平台
   */
  public async batchPublish(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const { accountForms, platforms, publishType, publishChannel, clientId, coverKey } = params;

    if (!accountForms || accountForms.length === 0) {
      return { success: false, message: "❌ 请提供 accountForms（账号表单列表）" };
    }

    if (!platforms || platforms.length === 0) {
      return { success: false, message: "❌ 请指定至少一个目标平台" };
    }

    if (!publishType) {
      return { success: false, message: "❌ 请指定 publishType（video/imageText/article）" };
    }

    // ==================== 平台兼容性校验 ====================
    
    // 定义各平台支持的内容类型
    const platformCapabilities: Record<string, string[]> = {
      // 视频平台
      "抖音": ["video", "imageText", "article"],
      "快手": ["video", "imageText"],
      "快手-Open": ["video"],
      "小红书": ["video", "imageText"],
      "视频号": ["video", "imageText"],
      "哔哩哔哩": ["video", "article"],
      "B站": ["video", "article"],
      "腾讯视频": ["video"],
      "爱奇艺": ["video"],
      "搜狐视频": ["video"],
      "得物": ["video"],
      "美拍": ["video"],
      "皮皮虾": ["video"],
      "AcFun": ["video", "article"],
      "一点号": ["video", "imageText", "article"],
      "大鱼号": ["video", "article"],
      "DuoDuoShiPin": ["video"],
      "多多视频": ["video"],
      
      // 文章平台
      "微信公众号": ["article"],
      "百家号": ["imageText", "article"],
      "头条号": ["imageText", "article"],
      "知乎": ["imageText", "article"],
      "搜狐号": ["article"],
      "简书": ["article"],
      "CSDN": ["article"],
      "网易号": ["imageText", "article"],
      "新浪微博": ["imageText", "article"],
      "雪球号": ["article"],
      "易车号": ["article"],
      "车家号": ["article"],
      "豆瓣": ["article"],
      "快传号": ["article"],
    };

    // 获取所有账号信息以便查询平台
    const client = getClient();
    const allAccounts = await client.getAccounts({ page: 1, size: 200, loginStatus: 1 });
    const accountMap = new Map(allAccounts.data.map(a => [a.id, a]));

    // 过滤支持该 publishType 的账号
    const validForms: any[] = [];
    const filteredForms: any[] = [];
    const warnings: string[] = [];

    for (const form of accountForms) {
      const account = accountMap.get(form.platformAccountId);
      if (!account) {
        warnings.push(`⚠️ 账号 ${form.platformAccountId} 不存在`);
        filteredForms.push({ ...form, reason: "账号不存在" });
        continue;
      }

      const platformName = account.platformName;
      const supportedTypes = platformCapabilities[platformName] || [];

      if (supportedTypes.includes(publishType)) {
        validForms.push(form);
      } else {
        warnings.push(`⚠️ 平台 ${platformName} 不支持 ${publishType === 'video' ? '视频' : publishType === 'imageText' ? '图文' : '文章'} 发布，已过滤`);
        filteredForms.push({ ...form, reason: `不支持 ${publishType}` });
      }
    }

    // 如果没有有效账号，返回错误
    if (validForms.length === 0) {
      return {
        success: false,
        message: `❌ 没有账号支持该内容类型 (${publishType})\n${warnings.join('\n')}`,
        data: { filteredForms, warnings }
      };
    }

    // 如果有被过滤的账号，返回警告
    const warningMessage = filteredForms.length > 0 
      ? `\n⚠️ 已过滤 ${filteredForms.length} 个不支持的账号:\n${filteredForms.map(f => `  - ${accountMap.get(f.platformAccountId)?.platformName || f.platformAccountId}: ${f.reason}`).join('\n')}`
      : '';

    // 调用发布模块
    const result = await publishModule.batchPublishContent({
      accountForms: validForms,
      platforms: platforms.filter((p: string) => validForms.some(f => accountMap.get(f.platformAccountId)?.platformName === p)),
      publishType,
      publishChannel,
      clientId,
      coverKey
    });

    // 在结果中添加过滤信息
    return {
      ...result,
      message: (result.message || '') + warningMessage,
      data: {
        ...(result.data || {}),
        validCount: validForms.length,
        filteredCount: filteredForms.length,
        filteredForms,
        warnings
      }
    };
  }
}