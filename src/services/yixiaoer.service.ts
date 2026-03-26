import { getClient } from "../api/client.js";
import * as accountModule from "../modules/account.js";
import * as publishFlowModule from "../modules/publish-flow.js";
import * as publishModule from "../modules/publish.js";
import * as overviewModule from "../modules/overviews.js";
import type { SkillResult } from "../../types.d.ts";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

let ffmpegPath: string | undefined;

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);
  ffmpegPath = ffmpegStatic as unknown as string;
}

/**
 * 蚁小二核心服务层
 * 封装所有业务逻辑、参数校验及预检流程
 * 
 * 优化版本 v1.1.0:
 * - 增加 videoKey/coverKey 参数支持，避免重复上传
 * - 增加视频封面自动提取功能
 * - 增强错误处理和调试日志
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
   * 从视频中自动提取封面
   * 如果未提供封面路径，使用 ffmpeg 提取第一帧
   */
  private async extractCoverFromVideo(videoPath: string): Promise<{ path: string; width: number; height: number } | null> {
    // 检查 ffmpeg 是否可用
    if (!ffmpegPath) {
      console.warn("⚠️ ffmpeg-static 未安装，无法自动提取封面");
      return null;
    }

    // 检查视频文件是否存在
    if (!fs.existsSync(videoPath)) {
      console.warn(`⚠️ 视频文件不存在: ${videoPath}`);
      return null;
    }

    const tempDir = os.tmpdir();
    const coverPath = path.join(tempDir, `cover_${Date.now()}.jpg`);

    return new Promise((resolve) => {
      ffmpeg(videoPath)
        .screenshots({
          count: 1,
          folder: tempDir,
          filename: path.basename(coverPath),
          size: "1280x720",
        })
        .on("end", () => {
          console.log(`✅ 封面提取成功: ${coverPath}`);
          resolve({ path: coverPath, width: 1280, height: 720 });
        })
        .on("error", (err: Error) => {
          console.warn(`⚠️ 封面提取失败: ${err.message}`);
          resolve(null);
        });
    });
  }

  /**
   * 处理视频路径/Key
   * 支持三种模式：
   * 1. videoKey - 已有 OSS key，直接使用
   * 2. videoPath (http:// 或 https://) - 远程 URL，直接使用
   * 3. videoPath (本地路径) - 上传到 OSS
   */
  private async processVideoResource(params: {
    videoPath?: string;
    videoKey?: string;
    videoDuration?: number;
    videoWidth?: number;
    videoHeight?: number;
    videoSize?: number;
  }): Promise<{ key?: string; path?: string; duration: number; width: number; height: number; size: number }> {
    const defaultResult = {
      duration: params.videoDuration || 0,
      width: params.videoWidth || 1080,
      height: params.videoHeight || 1920,
      size: params.videoSize || 0,
    };

    // 模式1: 直接使用 videoKey
    if (params.videoKey) {
      console.log(`📎 使用已有视频Key: ${params.videoKey}`);
      return { key: params.videoKey, ...defaultResult };
    }

    // 模式2: 远程 URL
    if (params.videoPath?.startsWith("http")) {
      console.log(`🌐 使用远程视频URL: ${params.videoPath}`);
      return { path: params.videoPath, ...defaultResult };
    }

    // 模式3: 本地文件 - 需要上传到 OSS
    if (params.videoPath) {
      const client = getClient();
      console.log(`📤 上传本地视频到OSS: ${params.videoPath}`);
      const uploadResult = await this.uploadFileToOss(params.videoPath, client);
      console.log(`✅ 视频上传成功, key: ${uploadResult.key}`);
      return { key: uploadResult.key, ...defaultResult, size: uploadResult.size };
    }

    return defaultResult;
  }

  /**
   * 处理封面路径/Key
   * 支持三种模式：
   * 1. coverKey - 已有 OSS key，直接使用
   * 2. coverPath (http:// 或 https://) - 远程 URL，下载后上传
   * 3. coverPath (本地路径) - 直接上传
   */
  private async processCoverResource(params: {
    coverPath?: string;
    coverKey?: string;
    coverWidth?: number;
    coverHeight?: number;
    coverSize?: number;
  }): Promise<{ key?: string; path?: string; width: number; height: number; size: number } | null> {
    const defaultResult = {
      width: params.coverWidth || 1080,
      height: params.coverHeight || 1920,
      size: params.coverSize || 0,
    };

    // 模式1: 直接使用 coverKey
    if (params.coverKey) {
      console.log(`📎 使用已有封面Key: ${params.coverKey}`);
      return { key: params.coverKey, ...defaultResult };
    }

    // 模式2: 远程 URL
    if (params.coverPath?.startsWith("http")) {
      const client = getClient();
      console.log(`🖼️ 下载并上传远程封面: ${params.coverPath}`);
      const result = await this.downloadAndUploadCover(params.coverPath, client);
      return result;
    }

    // 模式3: 本地文件
    if (params.coverPath) {
      const client = getClient();
      console.log(`📤 上传本地封面到OSS: ${params.coverPath}`);
      const uploadResult = await this.uploadFileToOss(params.coverPath, client);
      console.log(`✅ 封面上传成功, key: ${uploadResult.key}`);
      return { key: uploadResult.key, ...defaultResult, size: uploadResult.size };
    }

    return null;
  }

  /**
   * 上传文件到 OSS
   */
  private async uploadFileToOss(filePath: string, client: any): Promise<{ key: string; size: number }> {
    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;

    let contentType = "application/octet-stream";
    if (fileName.endsWith(".mp4")) contentType = "video/mp4";
    else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
      contentType = "image/jpeg";
    else if (fileName.endsWith(".png")) contentType = "image/png";
    else if (fileName.endsWith(".gif")) contentType = "image/gif";

    const uploadResult = await client.getUploadUrl(fileName, fileSize, contentType);

    const fileStream = fs.createReadStream(filePath);

    await axios.put(uploadResult.uploadUrl, fileStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return { key: uploadResult.fileKey, size: fileSize };
  }

  /**
   * 下载远程封面并上传到 OSS
   */
  private async downloadAndUploadCover(remoteUrl: string, client: any): Promise<{ key: string; width: number; height: number; size: number } | null> {
    try {
      console.log(`📥 下载远程封面: ${remoteUrl}`);
      const response = await axios.get(remoteUrl, {
        responseType: "arraybuffer",
        timeout: 60000,
      });

      const tempDir = os.tmpdir();
      const tempPath = path.join(tempDir, `cover_${Date.now()}.jpg`);
      fs.writeFileSync(tempPath, Buffer.from(response.data));

      const uploadResult = await this.uploadFileToOss(tempPath, client);

      // 清理临时文件
      try {
        fs.unlinkSync(tempPath);
      } catch {}

      return { key: uploadResult.key, size: uploadResult.size, width: 1080, height: 1920 };
    } catch (e) {
      console.warn(`⚠️ 封面下载上传失败: ${(e as Error).message}`);
      return null;
    }
  }

  /**
   * 发布视频（优化版本）
   * 
   * 新增参数:
   * - videoKey: 直接使用已上传的视频OSS key，避免重复上传
   * - coverKey: 直接使用已上传的封面OSS key
   * - autoExtractCover: 未提供封面时自动从视频提取
   */
  public async publishVideo(params: any): Promise<SkillResult> {
    console.log('\n========== publishVideo 开始 ==========');
    console.log('输入参数:', JSON.stringify(params, null, 2));

    const check = await this.preflightCheck();
    if (check) {
      console.log('预检失败:', check.message);
      return check;
    }

    const discovery = await this.discoverAccountId(params.platform, params.accountName);
    if (typeof discovery === "string") {
      console.log('账号发现失败:', discovery);
      return { success: false, message: discovery };
    }

    if (!params.title) {
      return { success: false, message: "❌ 视频标题不能为空" };
    }

    // 校验视频资源
    if (!params.videoPath && !params.videoKey) {
      return { success: false, message: "❌ 视频资源不能为空，请提供 videoPath 或 videoKey" };
    }

    // 处理视频资源
    const videoResource = await this.processVideoResource({
      videoPath: params.videoPath,
      videoKey: params.videoKey,
      videoDuration: params.videoDuration,
      videoWidth: params.videoWidth,
      videoHeight: params.videoHeight,
      videoSize: params.videoSize,
    });
    console.log('视频资源处理结果:', JSON.stringify(videoResource, null, 2));

    // 处理封面资源
    let coverResource = await this.processCoverResource({
      coverPath: params.coverPath,
      coverKey: params.coverKey,
      coverWidth: params.coverWidth,
      coverHeight: params.coverHeight,
      coverSize: params.coverSize,
    });

    // 如果没有封面但启用了自动提取
    if (!coverResource && params.autoExtractCover !== false && params.videoPath) {
      console.log('📸 未提供封面，尝试自动提取...');
      const extracted = await this.extractCoverFromVideo(params.videoPath);
      if (extracted) {
        const client = getClient();
        const uploadResult = await this.uploadFileToOss(extracted.path, client);
        coverResource = { key: uploadResult.key, size: uploadResult.size, width: extracted.width, height: extracted.height };
        console.log(`✅ 自动封面提取并上传成功: ${uploadResult.key}`);
        
        // 清理提取的临时文件
        try {
          fs.unlinkSync(extracted.path);
        } catch {}
      }
    }

    // 如果仍然没有封面，报错
    if (!coverResource && params.publishType !== 'article') {
      return { success: false, message: "❌ 封面不能为空，请提供 coverPath、coverKey 或确保 autoExtractCover=true 以自动提取" };
    }

    console.log('封面资源处理结果:', JSON.stringify(coverResource, null, 2));

    const publishParams = {
      ...params,
      platformAccountId: discovery.id,
      publishType: "video",
      publishChannel: params.publishChannel || "cloud",
      platforms: [params.platform],
      // 传递处理后的资源
      videoKey: videoResource.key,
      videoPath: videoResource.path,
      videoDuration: videoResource.duration,
      videoWidth: videoResource.width,
      videoHeight: videoResource.height,
      videoSize: videoResource.size,
      coverKey: coverResource?.key,
      coverWidth: coverResource?.width,
      coverHeight: coverResource?.height,
      coverSize: coverResource?.size,
    };

    console.log('调用 publishFlowModule.publishFlow, 参数:', JSON.stringify(publishParams, null, 2));

    try {
      const result = await publishFlowModule.publishFlow(publishParams);
      console.log('publishFlow 结果:', JSON.stringify(result, null, 2));
      console.log('========== publishVideo 结束 ==========\n');
      return result;
    } catch (e) {
      console.error('publishFlow 执行异常:', e);
      return { success: false, message: `❌ 发布失败: ${(e as Error).message}` };
    }
  }

  /**
   * 多平台统一发布
   */
  public async publishMultiPlatform(params: any): Promise<SkillResult> {
    const check = await this.preflightCheck();
    if (check) return check;

    const { platforms, publishType, title, description, videoPath, videoKey, imagePaths, isDraft, scheduledTime, platformExtra } = params;

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

        if (publishType === "video") {
          if (videoKey) {
            publishParams.videoKey = videoKey;
          } else if (videoPath) {
            publishParams.videoPath = videoPath;
          }
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
   * 获取平台发布表单结构
   * 返回平台支持的字段列表及示例，用于组装发布数据
   */
  public async getPlatformFormSchema(params: { platform: string; publishType?: string }): Promise<SkillResult> {
    return accountModule.getPlatformFormSchema(params);
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
    if (publishType === "video" && !data.videoPath && !data.videoKey) {
      missingFields.push("videoPath 或 videoKey");
    }
    if (publishType === "imageText" && (!data.imagePaths || data.imagePaths.length === 0)) {
      missingFields.push("imagePaths");
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
      }
    };
  }

  /**
   * 批量发布内容
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

    return publishModule.batchPublishContent({
      accountForms,
      platforms,
      publishType,
      publishChannel,
      clientId,
      coverKey
    });
  }
}
