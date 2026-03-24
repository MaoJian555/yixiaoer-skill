import type { YixiaoerConfig, MediaAccount, TeamInfo } from "../types.js";
export declare class YixiaoerClient {
    private client;
    private config;
    constructor(config: YixiaoerConfig);
    request<T = any>(method: string, endpoint: string, data?: any): Promise<T>;
    getTeams(): Promise<{
        data: TeamInfo[];
    }>;
    getAccounts(params?: {
        page?: number;
        size?: number;
        loginStatus?: number;
    }): Promise<{
        data: MediaAccount[];
        totalSize: number;
        page: number;
        size: number;
    }>;
    getAccountOverviewsV2(params: {
        platform: string;
        page?: number;
        size?: number;
        name?: string;
        group?: string;
        loginStatus?: number;
    }): Promise<{
        data: any[];
        page: number;
        size: number;
        totalSize: number;
        totalPage: number;
    }>;
    getContentOverviews(params?: {
        platformAccountId?: string;
        publishUserId?: string;
        platform?: string;
        type?: "all" | "video" | "miniVideo" | "dynamic" | "article";
        title?: string;
        publishStartTime?: number;
        publishEndTime?: number;
        page?: number;
        size?: number;
    }): Promise<{
        data: any[];
        headData: Array<{
            name: string;
            key: string;
        }>;
        page: number;
        size: number;
        totalSize: number;
        totalPage: number;
    }>;
    getPublishRecords(params?: {
        page?: number;
        size?: number;
    }): Promise<any>;
    getPublishPreset(platformAccountId: string): Promise<any>;
    publishTask(taskData: any): Promise<any>;
    getUploadUrl(fileName: string, fileSize: number, contentType: string): Promise<{
        uploadUrl: string;
        fileKey: string;
    }>;
}
export declare function getClient(): YixiaoerClient;
export declare function createClient(baseUrl?: string): YixiaoerClient;
export declare function clearClient(): void;
export declare function setApiKey(apiKey: string): void;
