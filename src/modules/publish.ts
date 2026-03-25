import { getClient } from "../api/client.js";
import type { GetPublishRecordsParams, SkillResult } from "../../types.d.ts";
import {
  PLATFORM_RULES,
  validatePublishParams,
  buildContentPublishForm,
} from "../config/platform-rules.js";
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
} else {
  console.warn("⚠️ ffmpeg-static 未安装，视频封面提取功能将不可用");
  console.warn("💡 请运行: npm install ffmpeg-static");
}

async function downloadRemoteCover(
  remoteUrl: string,
  client: ReturnType<typeof getClient>,
): Promise<{ key: string; size: number; width: number; height: number }> {
  console.log(`📥 正在下载远程封面: ${remoteUrl}`);

  const tempDir = path.join(os.tmpdir(), "yixiaoer-covers");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileName = `cover_${Date.now()}.jpg`;
  const tempPath = path.join(tempDir, fileName);

  const response = await axios.get(remoteUrl, {
    responseType: "arraybuffer",
    timeout: 60000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    maxRedirects: 5,
  });

  fs.writeFileSync(tempPath, Buffer.from(response.data));
  const stats = fs.statSync(tempPath);

  console.log(`📤 正在上传下载的封面到OSS: ${tempPath}`);
  const result = await uploadFileToOss(tempPath, client);
  console.log(`✅ 封面上传成功, key: ${result.key}`);

  let width = 1080;
  let height = 1920;

  const contentType = response.headers["content-type"] || "";
  if (contentType.includes("image")) {
    try {
      const image = await axios.get(remoteUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
      });
      const imageData = Buffer.from(image.data);
      const dims = getImageDimensions(imageData);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    } catch {
      console.log("⚠️ 无法获取图片尺寸，使用默认值");
    }
  }

  try {
    fs.unlinkSync(tempPath);
  } catch {
    console.log("⚠️ 清理临时文件失败");
  }

  return { key: result.key, size: result.size, width, height };
}

function getImageDimensions(
  buffer: Buffer,
): { width: number; height: number } | null {
  if (buffer.length < 24) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];

      if (marker === 0xc0 || marker === 0xc2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }

      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }

  return null;
}

interface PublishArgs {
  clientId: string | null;
  platforms: string[];
  publishType: "video" | "article" | "imageText";
  publishChannel?: string;
  coverKey: string;
  publishArgs: {
    accountForms: AccountForm[];
    platformForms: Record<string, any>;
    content?: string;
  };
}

interface AccountForm {
  platformAccountId: string;
  publishContentId?: string;
  cover?: {
    key?: string;
    path?: string;
    width: number;
    height: number;
    size: number;
  };
  video?: {
    key?: string;
    path?: string;
    duration: number;
    width: number;
    height: number;
    size: number;
  };
  images?: Array<{
    key?: string;
    path?: string;
    width: number;
    height: number;
    size: number;
  }>;
  coverKey?: string;
  contentPublishForm: Record<string, any>;
}

function normalizePlatform(input: string): string | null {
  if (PLATFORM_RULES[input]) return input;
  const fromName = Object.values(PLATFORM_RULES).find(
    (rule) => rule.name === input,
  );
  if (fromName) return fromName.code;
  // 平台别名映射
  const aliasMap: Record<string, string> = {
    "快手-Open": "KuaiShouOpen",
    "B站": "BiLiBiLi",
    "百家号": "BaiJiaHao",
    "知乎": "ZhiHu",
    "头条号": "TouTiaoHao",
    "搜狐号": "SouHuHao",
    "CSDN": "CSDN",
    "简书": "JianShu",
    "微博": "XinLangWeiBo",
    "新浪微博": "XinLangWeiBo",
    "网易号": "WangYiHao",
    "大鱼号": "DaYuHao",
    "一点号": "YiDianHao",
    "豆瓣": "DouBan",
    "视频号": "ShiPinHao",
    "小红书": "XiaoHongShu",
    "抖音": "DouYin",
    "快手": "KuaiShou",
    "哔哩哔哩": "BiLiBiLi",
    "皮皮虾": "PiPiXia",
    "AcFun": "AcFun",
    "腾讯视频": "TengXunShiPin",
    "爱奇艺": "AiQiYi",
    "搜狐视频": "SouHuShiPin",
    "得物": "DeWu",
    "美拍": "MeiPai",
    "汽车之家": "CheJiaHao",
    "车家号": "CheJiaHao",
    "易车号": "YiCheHao",
    "雪球号": "XueQiuHao",
    "快传号": "KuaiChuanHao",
  };
  if (aliasMap[input]) return aliasMap[input];
  return null;
}

function normalizePublishType(
  input: string,
): "video" | "article" | "imageText" | null {
  if (input === "image") return "imageText";
  if (input === "video" || input === "article" || input === "imageText")
    return input;
  return null;
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
      message: `❌ ${errorMsg}，请检查您的“龙虾插件” API Key 是否配置正确且有效。`,
    };
  }

  return {
    success: false,
    message: `❌ ${errorMsg}`,
  };
}

async function uploadFileToOss(
  filePath: string,
  client: ReturnType<typeof getClient>,
): Promise<{ key: string; size: number }> {
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;

  let contentType = "application/octet-stream";
  if (fileName.endsWith(".mp4")) contentType = "video/mp4";
  else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
    contentType = "image/jpeg";
  else if (fileName.endsWith(".png")) contentType = "image/png";
  else if (fileName.endsWith(".gif")) contentType = "image/gif";

  const uploadResult = await client.getUploadUrl(
    fileName,
    fileSize,
    contentType,
  );

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

export async function getPublishRecords(
  params: GetPublishRecordsParams,
): Promise<SkillResult> {
  try {
    const client = getClient();

    const response = await client.getPublishRecords({
      page: params.page || 1,
      size: params.size || 20,
    });

    if (!response.data || response.data.length === 0) {
      return {
        success: true,
        message: "暂无发布记录",
        data: { list: [], total: 0 },
      };
    }

    let message = `📋 获取到 ${response.totalSize} 条发布记录:\n\n`;
    for (const record of response.data.slice(0, 10)) {
      const typeEmoji = record.publishType === "video" ? "🎬" : "📝";
      message += `${typeEmoji} ${record.title || "无标题"}\n`;
      message += `   平台: ${record.platforms?.join(", ") || "-"} | 账号: ${record.nickName || "-"}\n`;
      if (record.createdAt) {
        const date = new Date(record.createdAt);
        message += `   时间: ${date.toLocaleString()}\n`;
      }
      message += "\n";
    }

    if (response.totalSize > 10) {
      message += `... 还有 ${response.totalSize - 10} 条记录`;
    }

    return {
      success: true,
      message,
      data: response,
    };
  } catch (error) {
    return handleError(error as Error);
  }
}

export async function batchPublishContent(params: {
  accountForms: any[];
  platforms: string[];
  publishType: string;
  publishChannel?: string;
  clientId?: string;
  proxyId?: string;
  coverKey?: string;
}): Promise<SkillResult> {
  try {
    const client = getClient();

    if (!params.platforms || params.platforms.length === 0) {
      return {
        success: false,
        message: "❌ 参数错误: 请选择发布平台",
      };
    }

    const publishType = normalizePublishType(params.publishType);
    if (!publishType) {
      return {
        success: false,
        message: "❌ 参数错误: publishType 只支持 video/article/imageText/image",
      };
    }

    const publishChannel = params.publishChannel || "cloud";
    const finalPublishChannel = params.clientId ? "local" : publishChannel;

    const platformCodes: string[] = [];
    const platformForms: Record<string, any> = {};
    
    for (const platformInput of params.platforms) {
      const platformCode = normalizePlatform(platformInput);
      if (!platformCode) {
        return {
          success: false,
          message: `❌ 不支持的平台: ${platformInput}`,
        };
      }
      platformCodes.push(platformCode);

      const rule = PLATFORM_RULES[platformCode];
      if (!rule) {
        continue;
      }

      const validation = validatePublishParams(platformCode, publishType);
      if (!validation.valid) {
        return {
          success: false,
          message: `❌ 参数验证失败: ${validation.errors.join('; ')}`,
        };
      }

      const platformForm = { 
        formType: "task",
      };
      const platformName = PLATFORM_RULES[platformCode]?.name;
      if (platformName) {
        platformForms[platformName] = platformForm;
      }
    }

    const platformNames = platformCodes.map(code => PLATFORM_RULES[code]?.name).filter(Boolean);
    const finalClientId = finalPublishChannel === "cloud" ? null : (params.clientId || null);

    let publishArgs: any = {
      clientId: finalClientId,
      platforms: platformNames,
      publishType,
      publishChannel: finalPublishChannel,
      coverKey: params.coverKey || '',
      proxyId: params.proxyId,
      publishArgs: {
        accountForms: params.accountForms,
        platformForms,
      },
    };

    let response;
    let isLocalPublish = finalPublishChannel === "local";

    try {
      response = await client.publishTask(publishArgs);
    } catch (error: any) {
      const errorMsg = error.message || "";
      console.log("📛 批量发布错误:", errorMsg);
      
      if (errorMsg.includes("代理未设置") && params.clientId) {
        console.log("⚠️ 云发布失败，检测到代理未设置，准备转为本机发布...");
        isLocalPublish = true;

        publishArgs = {
          clientId: params.clientId,
          platforms: platformNames,
          publishType,
          publishChannel: "local",
          coverKey: params.coverKey || '',
          proxyId: params.proxyId,
          publishArgs: {
            accountForms: params.accountForms,
            platformForms,
          },
        };

        console.log("🔄 正在重试本机发布...");
        response = await client.publishTask(publishArgs);
      } else {
        throw error;
      }
    }

    const platformNamesStr = platformNames.join(", ");
    const publishMode = isLocalPublish ? "本机发布" : "云发布";
    const accountCount = params.accountForms.length;

    return {
      success: true,
      message: `✅ ${publishMode}批量发布任务已提交到 ${platformNamesStr}，共 ${accountCount} 个账号`,
      data: response,
    };
  } catch (error) {
    return handleError(error as Error);
  }
}

export async function publishContent(params: {
  /** 素材coverKey（上传后返回） */
  coverKey?: string;
  /** 发布平台列表：抖音/小红书/知乎/B站/快手等 */
  platforms: string[];
  /** 内容类型：video-视频, article-文章, image-图文 */
  publishType: "video" | "article" | "imageText" | "image";
  /** 平台账号ID（从账号列表获取） */
  platformAccountId: string;
  /** 内容标题 */
  title: string;
  /** 内容正文 */
  description: string;
  /** 文章发布内容ID */
  publishContentId?: string;
  /** 创作类型 */
  createType?: number;
  /** 发布类型 */
  pubType?: number;
  /** 视频文件路径（本地路径或OSS URL） */
  videoPath?: string;
  /** 封面图片路径（本地路径或OSS URL） */
  coverPath?: string;
  /** 文章竖版封面路径（本地路径或URL） */
  verticalCoverPath?: string;
  /** 文章竖版封面key */
  verticalCoverKey?: string;
  /** 图片列表（图图文发布） */
  imagePaths?: string[];
  /** 视频文件大小（字节） */
  videoSize?: number;
  /** 视频时长（秒） */
  videoDuration?: number;
  /** 视频宽度 */
  videoWidth?: number;
  /** 视频高度 */
  videoHeight?: number;
  /** 封面图片大小（字节） */
  coverSize?: number;
  /** 竖版封面大小（字节） */
  verticalCoverSize?: number;
  /** 发布渠道：local-客户端发布, cloud-云发布 */
  /** 发布模式：local-本机发布, cloud-云端发布 */
  publishChannel?: string;
  /** 客户端识别符，本机发布必填 */
  clientId?: string;
  /** 封面宽度 */
  coverWidth?: number;
  /** 竖版封面宽度 */
  verticalCoverWidth?: number;
  /** 封面高度 */
  coverHeight?: number;
  /** 竖版封面高度 */
  verticalCoverHeight?: number;
  /** 平台特有表单数据 */
  contentPublishForm?: Record<string, any>;
}): Promise<SkillResult> {
  try {
    const client = getClient();

    if (!params.platforms || params.platforms.length === 0) {
      if (params.platformAccountId) {
        // Fallback: if platforms is empty but platformAccountId is provided, we'll try to get platform from account list later
      } else {
        return {
          success: false,
          message: "❌ 参数错误: 请选择发布平台或提供 platformAccountId",
        };
      }
    }

    const publishType = normalizePublishType(params.publishType);
    if (!publishType) {
      return {
        success: false,
        message:
          "❌ 参数错误: publishType 只支持 video/article/imageText/image",
      };
    }

    const publishChannel = params.publishChannel || "cloud";

    // Validate account and get platform name if platforms is missing
    const accounts = await client.getAccounts({
      page: 1,
      size: 200,
      loginStatus: 1,
    });
    const accountMatch = accounts.data?.find(
      (a) => a.id === params.platformAccountId,
    );

    if (!accountMatch) {
      return {
        success: false,
        message:
          "❌ 未找到有效的 platformAccountId，请先用 list-accounts 获取登录有效账号",
      };
    }

    const targetPlatforms =
      params.platforms && params.platforms.length > 0
        ? params.platforms
        : [accountMatch.platformName];

    // 有 clientId 则是本机发布，没有则是云发布
    const finalPublishChannel = params.clientId ? "local" : publishChannel;

    // 本机发布需要 clientId
    if (finalPublishChannel === "local" && !params.clientId) {
      return {
        success: false,
        message: "❌ 参数错误: 本机发布需要提供 clientId（设备号）",
      };
    }

    if (publishType === "video" && !params.videoPath) {
      return {
        success: false,
        message: "❌ 参数错误: video 类型需要提供 videoPath",
      };
    }

    // 视频发布：封面地址必填校验
    if (publishType === "video" && !params.coverPath && !params.coverKey) {
      return {
        success: false,
        message: "❌ 参数错误: video 类型需要提供封面图片地址 (coverPath)",
      };
    }

    if (
      publishType === "imageText" &&
      (!params.imagePaths || params.imagePaths.length === 0)
    ) {
      return {
        success: false,
        message: "❌ 参数错误: imageText 类型需要提供 imagePaths",
      };
    }

    const platformForms: Record<string, any> = {};
    const platformCodes: string[] = [];
    for (const platformInput of targetPlatforms) {
      const platformCode = normalizePlatform(platformInput);
      if (!platformCode) {
        return {
          success: false,
          message: `❌ 不支持的平台: ${platformInput}`,
        };
      }
      platformCodes.push(platformCode);

      const rule = PLATFORM_RULES[platformCode];
      if (!rule) {
        continue;
      }

      const validation = validatePublishParams(platformCode, publishType);
      if (!validation.valid) {
        return {
          success: false,
          message: `❌ 参数验证失败: ${validation.errors.join("; ")}`,
        };
      }

      // Merge dynamic form params
      const platformForm = {
        formType: "task",
        ...(params.contentPublishForm || {}),
      };
      const platformName = PLATFORM_RULES[platformCode]?.name;
      if (platformName) {
        platformForms[platformName] = platformForm;
      }
    }

    const baseForm = buildContentPublishForm(publishType, {
      title: params.title,
      description: params.description,
      createType: params.createType,
      pubType: params.pubType,
    });

    // Merge shared content form with platform specific form
    const finalContentPublishForm = {
      ...baseForm,
      ...(params.contentPublishForm || {}),
    };

    const accountForm: AccountForm = {
      platformAccountId: params.platformAccountId,
      publishContentId: params.publishContentId,
      coverKey: params.coverKey,
      contentPublishForm: finalContentPublishForm,
    };

    // 视频：远端 http 用 path，本地上传用 key
    if (publishType === "video" && params.videoPath) {
      // 检查是否是URL还是本地路径
      if (params.videoPath.startsWith("http")) {
        accountForm.video = {
          path: params.videoPath,
          duration: params.videoDuration || 0,
          width: params.videoWidth || 1080,
          height: params.videoHeight || 1920,
          size: params.videoSize || 0,
        };
      } else {
        // 本地路径 - 自动上传到OSS
        console.log(`📤 正在上传视频到OSS: ${params.videoPath}`);
        const videoInfo = await uploadFileToOss(params.videoPath, client);
        console.log(`✅ 视频上传成功, key: ${videoInfo.key}`);

        accountForm.video = {
          key: videoInfo.key,
          duration: params.videoDuration || 0,
          width: params.videoWidth || 1080,
          height: params.videoHeight || 1920,
          size: videoInfo.size,
        };
      }
    }

    // 文章发布：封面地址必填校验
    if (publishType === "article" && !params.coverPath && !params.coverKey) {
      return {
        success: false,
        message:
          "❌ 参数错误: article 类型需要提供封面图片地址 (coverPath 或 coverKey)",
      };
    }

    // 图文发布：如果未提供封面也没有图片，返回错误提示
    if (
      publishType === "imageText" &&
      !params.coverPath &&
      (!params.imagePaths || params.imagePaths.length === 0)
    ) {
      return {
        success: false,
        message:
          "❌ 图文发布需要提供封面图片或图片列表，请提供 coverPath 或 imagePaths 参数",
      };
    }

    // 封面图片：远端 http 自动下载上传到OSS获取coverKey
    if (params.coverPath) {
      if (params.coverPath.startsWith("http")) {
        console.log(`🖼️ 检测到远端封面URL，自动下载并上传到OSS...`);
        const coverInfo = await downloadRemoteCover(params.coverPath, client);

        if (publishType === "article") {
          const covers = finalContentPublishForm.covers || [];
          covers.push({
            key: coverInfo.key,
            width: params.coverWidth || coverInfo.width,
            height: params.coverHeight || coverInfo.height,
            size: coverInfo.size,
          });
          finalContentPublishForm.covers = covers;
          accountForm.coverKey = coverInfo.key;
        } else {
          accountForm.coverKey = coverInfo.key;
          accountForm.cover = {
            key: coverInfo.key,
            width: params.coverWidth || coverInfo.width,
            height: params.coverHeight || coverInfo.height,
            size: coverInfo.size,
          };
        }
      } else {
        console.log(`📤 正在上传封面到OSS: ${params.coverPath}`);
        const coverInfo = await uploadFileToOss(params.coverPath, client);
        console.log(`✅ 封面上传成功, key: ${coverInfo.key}`);

        if (publishType === "article") {
          const covers = finalContentPublishForm.covers || [];
          covers.push({
            key: coverInfo.key,
            width: params.coverWidth || 0,
            height: params.coverHeight || 0,
            size: coverInfo.size,
          });
          finalContentPublishForm.covers = covers;
          accountForm.coverKey = coverInfo.key;
        } else {
          accountForm.coverKey = coverInfo.key;
          accountForm.cover = {
            key: coverInfo.key,
            width: params.coverWidth || 1080,
            height: params.coverHeight || 1920,
            size: coverInfo.size,
          };
        }
      }
    }

    // 文章竖版封面：远端 http 自动下载上传到OSS获取coverKey
    if (publishType === "article" && params.verticalCoverPath) {
      const verticalCovers = finalContentPublishForm.verticalCovers || [];
      if (params.verticalCoverPath.startsWith("http")) {
        console.log(`🖼️ 检测到远端竖版封面URL，自动下载并上传到OSS...`);
        const verticalInfo = await downloadRemoteCover(
          params.verticalCoverPath,
          client,
        );
        verticalCovers.push({
          key: verticalInfo.key,
          width: params.verticalCoverWidth || verticalInfo.width,
          height: params.verticalCoverHeight || verticalInfo.height,
          size: verticalInfo.size,
        });
      } else {
        console.log(`📤 正在上传竖版封面到OSS: ${params.verticalCoverPath}`);
        const verticalInfo = await uploadFileToOss(
          params.verticalCoverPath,
          client,
        );
        console.log(`✅ 竖版封面上传成功, key: ${verticalInfo.key}`);
        verticalCovers.push({
          key: verticalInfo.key,
          width: params.verticalCoverWidth || 0,
          height: params.verticalCoverHeight || 0,
          size: verticalInfo.size,
        });
      }
      finalContentPublishForm.verticalCovers = verticalCovers;
    }

    // 文章封面/竖版封面直接传 key
    if (publishType === "article" && params.coverKey && !params.coverPath) {
      const covers = finalContentPublishForm.covers || [];
      covers.push({
        key: params.coverKey,
        width: params.coverWidth || 0,
        height: params.coverHeight || 0,
        size: params.coverSize || 0,
      });
      finalContentPublishForm.covers = covers;
    }
    if (
      publishType === "article" &&
      params.verticalCoverKey &&
      !params.verticalCoverPath
    ) {
      const verticalCovers = finalContentPublishForm.verticalCovers || [];
      verticalCovers.push({
        key: params.verticalCoverKey,
        width: params.verticalCoverWidth || 0,
        height: params.verticalCoverHeight || 0,
        size: params.verticalCoverSize || 0,
      });
      finalContentPublishForm.verticalCovers = verticalCovers;
    }

    // 图文图片：远端 http 用 path，本地上传用 key
    if (
      publishType === "imageText" &&
      params.imagePaths &&
      params.imagePaths.length > 0
    ) {
      const imageObjects: Array<{
        key?: string;
        path?: string;
        width: number;
        height: number;
        size: number;
      }> = [];
      for (const imagePath of params.imagePaths) {
        if (imagePath.startsWith("http")) {
          imageObjects.push({
            path: imagePath,
            width: params.coverWidth || 1080,
            height: params.coverHeight || 1920,
            size: params.coverSize || 0,
          });
        } else {
          console.log(`📤 正在上传图片到OSS: ${imagePath}`);
          const imageInfo = await uploadFileToOss(imagePath, client);
          console.log(`✅ 图片上传成功, key: ${imageInfo.key}`);
          imageObjects.push({
            key: imageInfo.key,
            width: params.coverWidth || 1080,
            height: params.coverHeight || 1920,
            size: imageInfo.size,
          });
        }
      }
      accountForm.images = imageObjects;

      // 若未显式传封面，默认使用第一张图作为封面
      if (!accountForm.coverKey && imageObjects.length > 0) {
        const first = imageObjects[0];
        if (first.key) accountForm.coverKey = first.key;
        accountForm.cover = {
          key: first.key,
          path: first.path,
          width: first.width,
          height: first.height,
          size: first.size,
        };
      }
    }

    // 构建发布参数
    // platforms 使用平台中文名数组
    const platformNames = platformCodes
      .map((code) => PLATFORM_RULES[code]?.name)
      .filter(Boolean);

    // 云发布时 clientId 设置为 null，本机发布时使用传入的 clientId
    const finalClientId =
      finalPublishChannel === "cloud" ? null : params.clientId || null;

    let publishArgs: PublishArgs = {
      clientId: finalClientId,
      platforms: platformNames, // 使用平台中文名数组
      publishType,
      publishChannel: finalPublishChannel,
      coverKey: accountForm.coverKey || "",
      publishArgs: {
        accountForms: [accountForm],
        platformForms,
        content: publishType !== "video" ? params.description : undefined,
      },
    };

    let response;
    let isLocalPublish = finalPublishChannel === "local";

    try {
      // 尝试发布
      response = await client.publishTask(publishArgs);
    } catch (error: any) {
      // 检测代理未设置错误，自动转为本机发布
      const errorMsg = error.message || "";
      console.log("📛 发布错误:", errorMsg);

      if (errorMsg.includes("代理未设置") && params.clientId) {
        console.log("⚠️ 云发布失败，检测到代理未设置，准备转为本机发布...");
        isLocalPublish = true;

        // 本机发布：使用 clientId 作为设备标识，设置 publishChannel 为 local
        publishArgs = {
          clientId: params.clientId, // 设备号
          platforms: platformNames, // 使用平台中文名数组
          publishType,
          publishChannel: "local", // 本机发布
          coverKey: accountForm.coverKey || "",
          publishArgs: {
            accountForms: [accountForm],
            platformForms,
            content: publishType !== "video" ? params.description : undefined,
          },
        };

        console.log("🔄 正在重试本机发布...");
        response = await client.publishTask(publishArgs);
      } else {
        throw error;
      }
    }

    const platformNamesStr = platformCodes
      .map((code) => PLATFORM_RULES[code]?.name || code)
      .join(", ");

    const publishMode = isLocalPublish ? "本机发布" : "云发布";

    return {
      success: true,
      message: `✅ ${publishMode}任务已提交到 ${platformNamesStr}`,
      data: response,
    };
  } catch (error) {
    return handleError(error as Error);
  }
}
