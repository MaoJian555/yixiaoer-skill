import { PlatformAdapter } from "./base.adapter.js";
import { YiXiaoErAdapter } from "./yixiaoer.adapter.js";
import { 
  StandardAdapter, 
  TouTiaoHaoAdapter, 
  BilibiliAdapter,
  ShiPingHaoAdapter,
  WeChatPublicAdapter,
  BaiJiaHaoAdapter,
  DouYinAdapter,
  ZhiHuAdapter,
  XiaoHongShuAdapter
} from "./standard_platforms.js";

/**
 * 适配器工厂/注册表
 * 集中管理所有平台适配器的实例化。
 */
export function getAdapter(platform: string): PlatformAdapter | null {
  const lowerPlatform = platform.toLowerCase();

  // 物理平台短 ID 到 中文名称 的映射 (基于 OpenAPI 枚举)
  const physicsPlatforms: Record<string, string> = {
    "dy": "抖音",
    "ks": "快手",
    "sph": "视频号",
    "bili": "哔哩哔哩",
    "xhs": "小红书",
    "bjh": "百家号",
    "tth": "头条号",
    "xg": "西瓜视频",
    "zh": "知乎",
    "qie": "企鹅号",
    "weibo": "新浪微博",
    "souhu": "搜狐号",
    "yidian": "一点号",
    "dyh": "大鱼号",
    "wy": "网易号",
    "iqiyi": "爱奇艺",
    "weishi": "腾讯微视",
    "tiktok": "TikTok",
    "youtube": "Youtube",
    "x": "X",
    "fb": "Facebook",
    "ins": "Instagram",
    "ppx": "皮皮虾",
    "tv": "腾讯视频",
    "duoduo": "多多视频",
    "meipai": "美拍",
    "acfun": "AcFun",
    "kch": "快传号",
    "xq": "雪球号",
    "cjh": "车家号",
    "ych": "易车号",
    "fw": "蜂网",
    "douban": "豆瓣",
    "csdn": "CSDN",
    "dewu": "得物",
    "jianshu": "简书",
    "meiyou": "美柚",
    "wx-open": "微信公众号-Open",
    "bili-open": "哔哩哔哩-Open",
    "ks-open": "快手-Open",
    "souhu-video": "搜狐视频",
    "xhs-shop": "小红书商家号",
    "others": "其他账号",
    "wechat": "微信公众号",
    "wx": "微信公众号",
    "wechat-p": "微信"
  };

  // 获取标准的平台中文名称
  const platformRealName = physicsPlatforms[lowerPlatform] || platform;

  // 特殊逻辑适配器注册表 (支持短 ID 和中文名双重匹配)
  const specialAdapters: Record<string, () => PlatformAdapter> = {
    "yixiaoer": () => new YiXiaoErAdapter(),
    "抖音": () => new DouYinAdapter(),
    "dy": () => new DouYinAdapter(),
    "视频号": () => new ShiPingHaoAdapter(),
    "sph": () => new ShiPingHaoAdapter(),
    "哔哩哔哩": () => new BilibiliAdapter(),
    "bili": () => new BilibiliAdapter(),
    "小红书": () => new XiaoHongShuAdapter(),
    "xhs": () => new XiaoHongShuAdapter(),
    "头条号": () => new TouTiaoHaoAdapter(),
    "tth": () => new TouTiaoHaoAdapter(),
    "西瓜视频": () => new TouTiaoHaoAdapter("西瓜视频"),
    "xg": () => new TouTiaoHaoAdapter("西瓜视频"),
    "百家号": () => new BaiJiaHaoAdapter(),
    "bjh": () => new BaiJiaHaoAdapter(),
    "知乎": () => new ZhiHuAdapter(),
    "zh": () => new ZhiHuAdapter(),
    "微信公众号": () => new WeChatPublicAdapter(),
    "wechat": () => new WeChatPublicAdapter(),
    "wx": () => new WeChatPublicAdapter(),
    "微信": () => new WeChatPublicAdapter("微信")
  };

  // 1. 优先尝试特殊适配器匹配
  if (specialAdapters[lowerPlatform]) {
    return specialAdapters[lowerPlatform]();
  }
  
  if (specialAdapters[platformRealName]) {
    return specialAdapters[platformRealName]();
  }

  // 2. 兜底逻辑：使用通用适配器
  return new StandardAdapter(platformRealName);
}
