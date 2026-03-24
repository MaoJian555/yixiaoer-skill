export interface YixiaoerConfig {
    baseUrl?: string;
    apiKey?: string;
}
export interface OpenClawApi {
    config?: {
        apiKey?: string;
    };
    logger?: {
        info?: (msg: string) => void;
        warn?: (msg: string) => void;
        error?: (msg: string) => void;
    };
}
export interface LoginResponse {
    token: string;
    expiresIn?: number;
    user: {
        id: string;
        username: string;
        nickname?: string;
        avatar?: string;
    };
}
export interface MediaAccount {
    id?: string;
    platformName: string;
    platformAvatar: string;
    platformAccountName: string;
    platformType: number;
    platformCode?: string;
    proxyId?: string;
    remark?: string;
    accountId?: string;
}
export interface TeamInfo {
    id: string;
    name: string;
    logoUrl: string;
    isVip: boolean;
    expiredAt: number;
}
export interface ApiResponse<T = any> {
    statusCode: number;
    data: T;
    message?: string;
}
export interface SkillResult<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
export interface LoginParams {
    username: string;
    password: string;
}
export interface ListAccountsParams {
    page?: number;
    size?: number;
    loginStatus?: number;
}
export interface GetPublishRecordsParams {
    page?: number;
    size?: number;
}
export interface UploadUrlParams {
    fileName: string;
    fileSize: number;
    contentType: string;
}
export interface UploadUrlResult {
    uploadUrl: string;
    fileKey: string;
}
export interface AccountOverviewsParams {
    platform: string;
    page?: number;
    size?: number;
    name?: string;
    group?: string;
    loginStatus?: number;
}
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
export interface PublishPreset {
    videoCategory?: string;
    videoTopics?: string;
    articleCategory?: string;
    articleTopics?: string;
    dynamicCategory?: string;
    dynamicTopics?: string;
}
export interface VideoFormItem {
    duration: number;
    width: number;
    height: number;
    size: number;
    key: string;
    path: string;
}
export interface ImageFormItem {
    width: number;
    height: number;
    size: number;
    key: string;
    path: string;
}
export interface PublishAccountRequestNew {
    platformAccountId: string;
    coverKey?: string;
    cover?: ImageFormItem;
    video?: VideoFormItem;
    images?: string[];
    publishContentId?: string;
    contentPublishForm?: any;
}
export interface CloudPublishArgs {
    accountForms: PublishAccountRequestNew[];
    content?: string;
}
export interface CloudTaskPushRequest {
    taskSetId?: string;
    coverKey: string;
    desc?: string;
    clientId?: string;
    platforms: string[];
    publishType: "video" | "imageText" | "article";
    isDraft: boolean;
    publishArgs: CloudPublishArgs;
    publishChannel: "local" | "cloud";
}
