/**
 * 统一发布模型 (增强版)
 */
export interface PublishContent {
  title?: string;
  content?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  publishTime?: number;
  platforms: string[]; // 目标平台枚举列表
  publishType: "video" | "imageText" | "article";
  
  // 视频特有参数 (V2)
  duration?: number;
  width?: number;
  height?: number;
  size?: number;
  videoKey?: string;
  videoPath?: string;

  // 平台私有参数，对应 OpenAPI 中的 contentPublishForm
  platformExtra?: Record<string, any>;
  
  // OA 规范中的其他字段
  desc?: string;
  coverKey?: string;
  isDraft?: boolean;
}

/**
 * 蚁小二任务集 V2 请求模型 (基于 OpenAPI Spec)
 */
export interface CloudTaskPushRequest {
  taskSetId?: string;
  coverKey: string;
  desc?: string;
  clientId?: string;
  platforms: string[];
  publishType: "video" | "imageText" | "article";
  isDraft: boolean;
  publishArgs: {
    accountForms: PublishAccountRequestNew[];
    content: string;
  };
  publishChannel?: "local" | "cloud";
  isAppContent?: boolean;
}

export interface PublishAccountRequestNew {
  platformAccountId: string;
  mediaId?: string;
  coverKey: string;
  video?: {
    duration: number;
    width: number;
    height: number;
    size: number;
    key: string;
    path: string;
  };
  images?: string[];
  contentPublishForm: Record<string, any>; // 这里适配各平台的具体表单，如 DouYinVideoForm
}

/**
 * 账号模型
 */
export interface Account {
  platform: string;
  accessToken: string;
  platformAccountId?: string; // 蚁小二内部账号 ID
}

/**
 * 发布结果模型
 */
export interface PublishResult {
  platform: string;
  success: boolean;
  data?: any;
  error?: string;
}
