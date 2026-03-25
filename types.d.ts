/**
 * 蚁小二多平台发布 - TypeScript 类型定义
 * @version 2.0.0
 */

// ============================================================================
// 基础类型
// ============================================================================

/** 技能结果返回类型 */
export interface SkillResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/** API 响应 */
export interface ApiResponse {
  code: number;
  message: string;
  data?: unknown;
}

/** 团队信息 */
export interface TeamInfo {
  id: string;
  name: string;
  isVip: boolean;
  vipExpireTime?: number;
}

/** 媒体账号 */
export interface MediaAccount {
  id: string;
  accountId: string;
  platformName: string;
  platformAccountName: string;
  loginStatus: number;
  avatar?: string;
}

/** 列表账号参数 */
export interface ListAccountsParams {
  page?: number;
  size?: number;
  loginStatus?: number;
  platform?: string;
}

/** 账号概览参数 */
export interface AccountOverviewsParams {
  platform: string;
  page?: number;
  size?: number;
  name?: string;
  group?: string;
  loginStatus?: number;
}

/** 内容概览参数 */
export interface ContentOverviewsParams {
  platformAccountId?: string;
  publishUserId?: string;
  platform?: string;
  type?: "all" | "video" | "miniVideo" | "dynamic" | "article";
  title?: string;
  publishStartTime?: number;
  publishEndTime?: number;
  page?: number;
  size?: number;
}

/** 获取发布记录参数 */
export interface GetPublishRecordsParams {
  page?: number;
  size?: number;
  platformAccountId?: string;
  platform?: string;
  publishStartTime?: number;
  publishEndTime?: number;
}

/** 内容类型 */
export type ContentType = 'video' | 'article' | 'imageText';

/** 可见范围 all: 所有用户可见; specific: 指定用户可见 */
export enum VisibleScope {
  All = "all",
  Specific = "specific",
}

/** 分组参数 */
export interface ListGroupsParams {
  name?: string;
  onlySelf?: boolean;
  page?: number;
  size?: number;
  visibleScope?: VisibleScope;
}

/** 分组信息 */
export interface Group {
  id: string;
  name: string;
  visibleScope?: VisibleScope;
  accountCount?: number;
  createTime?: number;
  updateTime?: number;
}

/** 发布类型 */
export type PubType = 0 | 1; // 0=草稿, 1=直接发布

/** 原创类型 */
export type CreateType = 0 | 1 | 2; // 0=非原创, 1=原创, 2=转载

// ============================================================================
// 平台数据类型
// ============================================================================

/** 平台定义 */
export interface PlatformDefinition {
  name: string;
  nameEn: string;
  icon?: string;
  supports: ContentType[];
  limits?: PlatformLimits;
  forms: Record<string, FormDefinition>;
}

/** 平台限制 */
export interface PlatformLimits {
  videoDuration?: number;  // 秒
  titleLength?: number;    // 字符
  descriptionLength?: number;
  imageCount?: number;
  tagCount?: number;
}

/** 表单定义 */
export interface FormDefinition {
  name: string;
  type: ContentType;
  description?: string;
  fields: FieldDefinition[];
}

/** 字段定义 */
export interface FieldDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: unknown;
  enum?: number[];
  enumLabels?: Record<number, string>;
  maxLength?: number;
  minLength?: number;
  validation?: FieldValidation;
}

/** 字段验证 */
export interface FieldValidation {
  pattern?: string;
  message?: string;
}

// ============================================================================
// 媒体类型
// ============================================================================

/** 图片 */
export interface Image {
  width: number;
  height: number;
  size: number;
  pathOrUrl: string;
  format: string;
}

/** 旧版图片 */
export interface OldImage {
  width: number;
  height: number;
  size: number;
  path?: string;
  key?: string;
  format: string;
}

/** 封面 */
export interface Cover {
  width: number;
  height: number;
  size: number;
  pathOrUrl: string;
  format: string;
}

/** 旧版封面 */
export interface OldCover {
  width: number;
  height: number;
  size: number;
  path?: string;
  key?: string;
}

/** 视频 */
export interface Video {
  duration: number;
  width: number;
  height: number;
  size: number;
  url: string;
  localPath: string;
}

// ============================================================================
// 平台数据项
// ============================================================================

/** 平台数据项 */
export interface PlatformDataItem<TRaw = unknown> {
  id: string;
  text: string;
  raw: TRaw;
}

/** 级联平台数据项 */
export interface CascadingPlatformDataItem<TRaw = unknown> {
  id: string;
  text: string;
  children?: PlatformDataItem<TRaw>[];
  raw: TRaw;
}

/** 分类 */
export interface Category {
  yixiaoerId: string;
  yixiaoerName: string;
  yixiaoerImageUrl: string;
  yixiaoerDesc: string;
  viewNum: string;
  raw: object;
}

/** 声明类型 */
export interface StatementType {
  type: number;
}

// ============================================================================
// 小红书
// ============================================================================

export interface XiaoHongShuVideoForm {
  title: string;
  description: string;
  declaration?: number;  // 1=虚构演绎, 2=AI合成
  type?: number;         // 0=不申明, 1=原创
  location?: PlatformDataItem;
  scheduledTime?: number;
  collection?: object;
  group?: object;
  bind_live_info?: object;
  shopping_cart?: object[];
}

export interface XiaoHongShuDynamicForm {
  title: string;
  description: string;
  images: OldImage[];
  location?: PlatformDataItem;
  music?: PlatformDataItem;
  scheduledTime?: number;
  collection?: object;
}

// ============================================================================
// 抖音
// ============================================================================

export interface ShoppingBase {
  sale_title: string;
  data: object;
}

export interface ShoppingCartDTO extends ShoppingBase {}

export interface GroupShoppingDTO extends ShoppingBase {
  brand_switch_value: number;
}

export interface DouYinVideoForm {
  title: string;
  description: string;
  horizontalCover: OldCover;
  statement?: StatementType;
  location?: PlatformDataItem;
  scheduledTime?: number;
  shoppingCart?: ShoppingCartDTO[];
  groupShopping?: GroupShoppingDTO;
  collection?: Category;
  sub_collection?: Category;
  sync_apps?: Category[];
  hot_event?: Category;
  challenge?: Category;
  allow_save?: number;
  mini_app?: object;
  music?: object;
  cooperation_info?: object;
  game?: object;
  film?: object;
}

export interface DouYinDynamicForm {
  title: string;
  description: string;
  images: OldImage[];
  location?: PlatformDataItem;
  musice?: PlatformDataItem;
  scheduledTime?: number;
  collection?: Category;
  sub_collection?: Category;
}

export interface DouyinArticleForm {
  title: string;
  description?: string;
  content: string;
  covers: OldCover[];
  headImage?: OldCover;
  music?: PlatformDataItem;
  topics?: Category[];
  scheduledTime?: number;
}

// ============================================================================
// B站
// ============================================================================

export interface BilibiliVideoForm {
  title: string;
  description: string;
  tags: string[];
  category: CascadingPlatformDataItem[];
  declaration: number;
  type: number;  // 1=自制, 2=转载
  scheduledTime?: number;
  contentSourceUrl?: string;
  collection?: object;
}

export interface BiLiBiLiArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  tags?: string[];
  type?: number;
  category?: Category[];
  scheduledTime?: number;
}

// ============================================================================
// 快手
// ============================================================================

export interface KuaiShouVideoForm {
  title: string;
  description: string;
  declaration?: number;
  location?: PlatformDataItem;
  scheduledTime?: number;
  shopping_cart?: object;
  collection?: Category;
  mini_app?: object;
  nearby_show?: boolean;
  allow_same_frame?: boolean;
  allow_download?: boolean;
}

export interface KuaiShouDynamicForm {
  description: string;
  images: OldImage[];
  location?: PlatformDataItem;
  music?: PlatformDataItem;
  scheduledTime?: number;
  collection?: Category;
}

// ============================================================================
// 视频号
// ============================================================================

export interface ShiPingHaoVideoForm {
  title?: string;
  short_title?: string;
  description?: string;
  location?: PlatformDataItem;
  scheduledTime?: number;
  type: number;
  shoppingCart?: object;
  horizontalCover?: OldCover;
  collection?: object;
  activity?: object;
}

export interface ShiPingHaoDynamicForm {
  title: string;
  description: string;
  images: OldImage[];
  location?: PlatformDataItem;
  music?: PlatformDataItem;
  scheduledTime?: number;
  collection?: object;
  pubType?: number;
}

// ============================================================================
// 微信公众号
// ============================================================================

export interface WxGongZhongHaoContentFrom {
  title: string;
  content: string;
  digest?: string;
  cover: Cover;
  createType: 0 | 1;
  authorName?: string;
  quickRepost?: 0 | 1;
  categories?: Category[];
  contentSourceUrl?: Category;
  quickPrivateMessage?: 0 | 1;
}

export interface WxGongZhongHaoArticleForm {
  scheduledTime?: number;
  notifySubscribers: 0 | 1;
  sex?: 0 | 1 | 2;
  country?: string;
  province?: string;
  city?: string;
  contentList: WxGongZhongHaoContentFrom[];
}

// ============================================================================
// 头条号
// ============================================================================

export interface TouTiaoHaoVideoForm {
  title: string;
  description: string;
  tags: string[];
  declaration?: number;
  scheduledTime?: number;
}

export interface TouTiaoHaoArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  isFirst?: boolean;
  location?: PlatformDataItem;
  scheduledTime?: number;
  advertisement: number;
  declaration?: number;
}

export interface TouTiaoHaoDynamicForm {
  description: string;
  images: OldImage[];
  declaration?: number;
  pubType: number;
}

// ============================================================================
// 知乎
// ============================================================================

export interface ZhiHuVideoForm {
  title: string;
  description: string;
  topics?: Category[];
  category: CascadingPlatformDataItem[];
  declaration?: number;
  type?: number;
  scheduledTime?: number;
}

export interface ZhiHuArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  topics?: Category[];
  scheduledTime?: number;
  declaration?: number;
}

export interface ZhiHuDynamicForm {
  title: string;
  description: string;
  images: OldImage[];
}

// ============================================================================
// 百家号
// ============================================================================

export interface BaiJiaHaoVideoForm {
  title: string;
  description: string;
  tags: string[];
  declaration: number;
  location?: PlatformDataItem;
  scheduledTime?: number;
  collection?: object;
  activity?: object;
}

export interface BaiJiaHaoArticleForm {
  title: string;
  content: string;
  covers: OldCover[];
  category: Category[];
  declaration: number;
  scheduledTime?: number;
  activity?: object;
}

export interface BaiJiaHaoDynamicForm {
  title: string;
  description: string;
  cover: OldCover;
  location?: PlatformDataItem;
  declaration: number;
  scheduledTime?: number;
}

// ============================================================================
// 企鹅号
// ============================================================================

export interface QiEHaoVideoForm {
  title: string;
  description: string;
  tags: string[];
  category: CascadingPlatformDataItem[];
  declaration?: number;
  scheduledTime?: number;
}

export interface QiEHaoArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  tags: string[];
  declaration?: number;
}

// ============================================================================
// 大鱼号
// ============================================================================

export interface DaYuHaoVideoForm {
  title: string;
  description: string;
  tags: string[];
  category: CascadingPlatformDataItem[];
  type: 0 | 1;
  scheduledTime?: number;
}

export interface DaYuHaoArticleForm {
  covers: OldCover[];
  verticalCovers: OldCover[];
  title: string;
  content: string;
  scheduledTime?: number;
}

// ============================================================================
// 搜狐号
// ============================================================================

export interface SouHuHaoVideoForm {
  title: string;
  description: string;
  tags: string[];
  category: CascadingPlatformDataItem[];
  declaration?: number;
  scheduledTime?: number;
}

export interface SouHuHaoArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  description: string;
  scheduledTime?: number;
}

// ============================================================================
// 新浪微博
// ============================================================================

export interface XinLangWeiBoVideoForm {
  title: string;
  description: string;
  type?: number;
  location?: PlatformDataItem;
  scheduledTime?: number;
  collection?: object;
}

export interface XinLangWeiBoDynamicForm {
  description: string;
  images: OldImage[];
  location?: PlatformDataItem;
  scheduledTime?: number;
}

export interface XinLangWeiBoArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  scheduledTime?: number;
}

// ============================================================================
// 简书
// ============================================================================

export interface JianShuArticleForm {
  title: string;
  content: string;
}

// ============================================================================
// CSDN
// ============================================================================

export interface CSDNArticleForm {
  covers: OldCover[];
  title: string;
  content: string;
  description: string;
  tags: string[];
  type: 1 | 2 | 4;
  contentSourceUrl?: string;
  declaration?: number;
  scheduledTime?: number;
}

// ============================================================================
// 发布参数
// ============================================================================

export interface BatchPublishParams {
  accountForms: AccountForm[];
  platforms: string[];
  publishType: "video" | "article" | "imageText";
  publishChannel?: string;
  clientId?: string;
  coverKey?: string;
}

export interface AccountForm {
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

export interface PublishArgs {
  cover?: OldImage;
  categories?: Record<string, unknown>;
  accounts?: Array<{
    accountId: string;
    video: Video;
    cover?: OldCover;
  }>;
  bPlatform?: { title?: string; description?: string; tags?: unknown };
  aPlatform?: { title?: string; description?: string };
  title?: string;
  description?: string;
  isDraft?: boolean;
  isOriginal?: boolean;
  contentSourceUrl?: Record<string, unknown>;
  images?: OldImage[];
  location?: unknown;
  createType?: Record<string, unknown>;
  music?: unknown;
  topic?: Record<string, unknown>;
  tags?: Record<string, unknown>;
  verticalCover?: unknown;
  content?: unknown;
  isFirst?: boolean;
}

// ============================================================================
// 平台工具类型
// ============================================================================

export interface ListPlatformsResult {
  platforms: Array<{
    id: string;
    name: string;
    nameEn: string;
    supports: ContentType[];
    limits?: PlatformLimits;
  }>;
  total: number;
}

export interface GetPlatformFormResult {
  platform: string;
  supports: ContentType[];
  limits?: PlatformLimits;
  forms: Record<string, FormDefinition>;
}

export interface PublishContentResult {
  success: boolean;
  message: string;
  platform: string;
  contentType: ContentType;
  title: string;
  timestamp: number;
}

export interface BatchPublishResult {
  success: boolean;
  total: number;
  results: Array<{
    platform: string;
    platformName: string;
    success: boolean;
    timestamp: number;
  }>;
}

export interface ValidateFormResult {
  valid: boolean;
  platform: string;
  form: string;
  errors: string[];
  providedFields: string[];
  requiredFields: string[];
}

// ============================================================================
// 平台枚举
// ============================================================================

export type PlatformId = 
  | 'xiaohongshu'
  | 'douyin'
  | 'bilibili'
  | 'kuaishou'
  | 'shipinghao'
  | 'wechat'
  | 'toutiao'
  | 'zhihu'
  | 'baijiahao'
  | 'qiehao'
  | 'dayuhao'
  | 'souhuhao'
  | 'weibo'
  | 'jianshu'
  | 'csdn'
  | 'acfun'
  | 'aiqiyi'
  | 'chejiahao'
  | 'dewu'
  | 'douban'
  | 'duoduoshipin'
  | 'fengwang'
  | 'kuaichuanhao'
  | 'meipai'
  | 'meiyou'
  | 'pipixia'
  | 'souhushipin'
  | 'tengxunshipin'
  | 'tengxunweishi'
  | 'wangyihao'
  | 'wifiwanneng'
  | 'xiaohongshushop'
  | 'xueqiuhao'
  | 'yichehao'
  | 'yidianhao';

// ============================================================================
// 内容类型枚举
// ============================================================================

export enum ContentTypeEnum {
  Video = 'video',
  Article = 'article',
  Dynamic = 'dynamic',
  ImageText = 'imageText'
}

// ============================================================================
// 创作声明枚举
// ============================================================================

export enum DeclarationType {
  None = 0,
  AIGenerated = 1,
  Fictional = 2,
  PersonalOpinion = 3,
  FromInternet = 4,
  Dangerous = 5,
  AISynthetic = 6
}

// ============================================================================
// 工具函数类型
// ============================================================================

export type PlatformValidator = (data: unknown, platform: PlatformId, contentType: ContentType) => ValidateFormResult;

export type PlatformAdapter = <T extends Record<string, unknown>>(
  content: T,
  sourcePlatform: PlatformId,
  targetPlatform: PlatformId
) => T;

export type ContentTransformer = (
  content: string,
  options?: { maxLength?: number; preserveFormatting?: boolean }
) => string;

// ============================================================================
// 配置类型
// ============================================================================

export interface YixiaoerConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  retryCount?: number;
  defaultPlatforms?: PlatformId[];
}

export interface PublishOptions {
  scheduledTime?: number;
  isDraft?: boolean;
  notifySubscribers?: boolean;
  customFields?: Record<string, unknown>;
}

// ============================================================================
// 错误类型
// ============================================================================

export class YixiaoerError extends Error {
  constructor(
    message: string,
    public code: string,
    public platform?: PlatformId,
    public details?: unknown
  ) {
    super(message);
    this.name = 'YixiaoerError';
  }
}

export class ValidationError extends YixiaoerError {
  constructor(message: string, public fields: string[]) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class PlatformNotSupportedError extends YixiaoerError {
  constructor(platform: PlatformId) {
    super(`平台 ${platform} 不支持`, 'PLATFORM_NOT_SUPPORTED', platform);
    this.name = 'PlatformNotSupportedError';
  }
}

export class ContentTypeNotSupportedError extends YixiaoerError {
  constructor(platform: PlatformId, contentType: ContentType) {
    super(
      `平台 ${platform} 不支持内容类型 ${contentType}`,
      'CONTENT_TYPE_NOT_SUPPORTED',
      platform
    );
    this.name = 'ContentTypeNotSupportedError';
  }
}
