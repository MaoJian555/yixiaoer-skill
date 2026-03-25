import { PlatformAdapter } from "./base.adapter.js";
import { PublishContent, Account, CloudTaskPushRequest, PublishAccountRequestNew } from "../types/publish.js";
import { getClient } from "../api/client.js";

/**
 * 基础 HUB 开放平台适配器
 * 核心逻辑：封装了对接蚁小二枢纽 V2 接口的通用发布逻辑
 */
export abstract class BaseHubAdapter implements PlatformAdapter {
  constructor(protected platformName: string) {}

  async publish(content: PublishContent, account: Account): Promise<any> {
    const client = getClient();
    const type = content.publishType || "article";

    // 默认表单映射
    const form = this.buildPlatformForm(content);

    // 构建统一的账号表单项
    const accountForm: PublishAccountRequestNew = {
      platformAccountId: account.platformAccountId || account.accessToken,
      coverKey: content.coverKey || (content.images?.[0] || ""),
      contentPublishForm: form
    };

    // 视频特有数据补充
    if (type === "video") {
      accountForm.video = {
        duration: content.duration || 10,
        width: content.width || 1080,
        height: content.height || 1920,
        size: content.size || 5000000,
        key: content.videoKey || content.videos?.[0] || "",
        path: content.videoPath || content.videos?.[0] || ""
      };
    } else if (type === "imageText") {
      accountForm.images = content.images || [];
    }

    const request: CloudTaskPushRequest = {
      coverKey: content.coverKey || (content.images?.[0] || ""),
      description: content.description || content.title,
      platforms: [this.platformName],
      publishType: type,
      isDraft: content.isDraft ?? false,
      publishArgs: {
        content: content.content || "", // 统一内容字段 (HTML/Text)
        accountForms: [accountForm]
      }
    };

    console.log(`[BaseHubAdapter] 正在向统一枢纽提交任务: ${this.platformName}`);
    return await client.publishTask(request);
  }

  /**
   * 构建特定平台的表单内容，支持不同发布类型
   */
  protected buildPlatformForm(content: PublishContent): any {
    const type = content.publishType;
    const platformKey = this.getPlatformKey();
    
    // 默认映射逻辑
    const baseForm: any = {
      formType: "task",
      title: content.title,
      tags: content.tags || [],
      ...content.platformExtra?.[platformKey]
    };

    if (type === "video") {
      baseForm.description = content.content; // 视频描述通常使用 content
    } else if (type === "article") {
      baseForm.content = content.content; // 文章正文
      baseForm.covers = (content.images || []).map(path => ({ path, width: 800, height: 600, size: 50000 }));
    } else if (type === "imageText") {
      baseForm.description = content.content; // 图文描述
      baseForm.images = (content.images || []).map(path => ({ path, width: 800, height: 600, size: 50000, format: "jpg" }));
    }

    return baseForm;
  }

  protected getPlatformKey(): string {
    // 映射到 platformExtra 中的 key，同步物理平台 ID
    const mapping: Record<string, string> = {
      "抖音": "dy",
      "快手": "ks",
      "视频号": "sph",
      "哔哩哔哩": "bili",
      "小红书": "xhs",
      "百家号": "bjh",
      "头条号": "tth",
      "西瓜视频": "xg",
      "知乎": "zh",
      "企鹅号": "qie",
      "新浪微博": "weibo",
      "搜狐号": "souhu",
      "一点号": "yidian",
      "大鱼号": "dyh",
      "网易号": "wy",
      "爱奇艺": "iqiyi",
      "腾讯微视": "weishi",
      "TikTok": "tiktok",
      "Youtube": "youtube",
      "X": "x",
      "Facebook": "fb",
      "Instagram": "ins",
      "皮皮虾": "ppx",
      "腾讯视频": "tv",
      "多多视频": "duoduo",
      "美拍": "meipai",
      "AcFun": "acfun",
      "快传号": "kch",
      "雪球号": "xq",
      "车家号": "cjh",
      "易车号": "ych",
      "蜂网": "fw",
      "豆瓣": "douban",
      "CSDN": "csdn",
      "得物": "dewu",
      "简书": "jianshu",
      "美柚": "meiyou",
      "微信公众号-Open": "wx-open",
      "哔哩哔哩-Open": "bili-open",
      "快手-Open": "ks-open",
      "搜狐视频": "souhu-video",
      "小红书商家号": "xhs-shop",
      "微信公众号": "wechat",
      "微信": "wechat"
    };
    return mapping[this.platformName] || this.platformName.toLowerCase();
  }
}

/**
 * 标准平台适配器 (直接通过名称区分)
 */
export class StandardAdapter extends BaseHubAdapter {
  constructor(name: string) {
    super(name);
  }
}

/**
 * 针对头条号/西瓜视频的增强适配
 */
export class TouTiaoHaoAdapter extends BaseHubAdapter {
  constructor(name: string = "头条号") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    return {
      ...form,
      advertisement: 1, // 总是开启广告收益
      declaration: content.platformExtra?.tth?.declaration || 3, // 默认 AI 生成
      ...content.platformExtra?.tth
    };
  }
}

/**
 * 针对 B 站的增强适配
 */
export class BilibiliAdapter extends BaseHubAdapter {
  constructor(name: string = "哔哩哔哩") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    if (content.publishType === "video") {
      return {
        ...form,
        category: content.platformExtra?.bili?.category || [],
        declaration: 1, // 声明
        type: content.platformExtra?.bili?.type || 1, // 自制
        ...content.platformExtra?.bili
      };
    }
    return form;
  }
}

/**
 * 针对视频号的增强适配
 */
export class ShiPingHaoAdapter extends BaseHubAdapter {
  constructor(name: string = "视频号") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    if (content.publishType === "video") {
      return {
        ...form,
        short_title: content.title?.slice(0, 20) || "",
        type: content.platformExtra?.sph?.type || 2, // 1:非原创, 2:原创
        ...content.platformExtra?.sph
      };
    }
    return form;
  }
}

/**
 * 针对微信公众号的增强适配 (特殊的 contentList 结构)
 */
export class WeChatPublicAdapter extends BaseHubAdapter {
  constructor(name: string = "微信公众号") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const platformKey = this.getPlatformKey();
    // 微信表单比较特殊，文章都在 contentList 里
    return {
      notifySubscribers: 1, // 默认群发
      contentList: [
        {
          title: content.title || "未命名文章",
          content: content.content || "",
          digest: content.description || content.title?.slice(0, 50) || "",
          cover: {
            pathOrUrl: content.images?.[0] || content.coverKey || "",
            width: 1000, 
            height: 1000,
            size: 50000,
            format: "jpg"
          },
          createType: 0 // 默认为原创声明
        }
      ],
      ...content.platformExtra?.[platformKey]
    };
  }
}

/**
 * 针对百家号的增强适配
 */
export class BaiJiaHaoAdapter extends BaseHubAdapter {
  constructor(name: string = "百家号") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    return {
      ...form,
      declaration: content.platformExtra?.bjh?.declaration || 1, // 默认 AI 生成
      category: content.platformExtra?.bjh?.category || [],
      ...content.platformExtra?.bjh
    };
  }
}

/**
 * 针对抖音的增强适配
 */
export class DouYinAdapter extends BaseHubAdapter {
  constructor(name: string = "抖音") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    if (content.publishType === "video") {
      return {
        ...form,
        horizontalCover: {
          path: content.coverKey || content.images?.[0] || "",
          width: 1080,
          height: 1920,
          size: 50000
        },
        statement: { type: 3 }, // 默认内容声明：AI生成
        ...content.platformExtra?.dy
      };
    }
    return form;
  }
}

/**
 * 针对知乎的增强适配
 */
export class ZhiHuAdapter extends BaseHubAdapter {
  constructor(name: string = "知乎") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    return {
      ...form,
      declaration: content.platformExtra?.zh?.declaration || 5, // 默认 AI 辅助创作
      topics: content.platformExtra?.zh?.topics || [],
      ...content.platformExtra?.zh
    };
  }
}

/**
 * 针对小红书的增强适配
 */
export class XiaoHongShuAdapter extends BaseHubAdapter {
  constructor(name: string = "小红书") { super(name); }
  protected override buildPlatformForm(content: PublishContent): any {
    const form = super.buildPlatformForm(content);
    return {
      ...form,
      declaration: content.platformExtra?.xhs?.declaration || 2, // 默认笔记包含AI合成
      type: content.platformExtra?.xhs?.type || 1, // 1: 原创
      ...content.platformExtra?.xhs
    };
  }
}
