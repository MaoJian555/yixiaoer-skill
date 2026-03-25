import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  YixiaoerConfig,
  ApiResponse,
  MediaAccount,
  TeamInfo,
} from "../../types.d.ts";

let configuredApiKey: string | null = null;

export class YixiaoerClient {
  private client: AxiosInstance;
  private config: YixiaoerConfig;

  constructor(config: YixiaoerConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "x-client": "openclaw",
      },
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const apiResponse = error.response?.data as ApiResponse;
        let message = apiResponse?.message || error.message;

        if (message.includes("timeout")) {
          message = "请求超时，请检查网络连接或稍后重试";
        } else if (
          message.includes("network") ||
          message.includes("ENOTFOUND") ||
          message.includes("ECONNREFUSED")
        ) {
          message = "网络连接失败，请检查网络或服务器地址";
        } else if (
          message.includes("500") ||
          message.includes("Internal Server Error")
        ) {
          message = "服务器内部错误，请稍后重试";
        } else if (message.includes("400") || message.includes("Bad Request")) {
          message = `请求参数错误: ${message}`;
        } else if (message.includes("403") || message.includes("Forbidden")) {
          message = "没有权限执行此操作";
        } else if (error.response?.status === 401) {
          message = "认证已失效，请检查 API Key 是否正确";
        }

        throw new Error(`蚁小二API错误: ${message}`);
      },
    );

    this.client.interceptors.request.use((config) => {
      if (configuredApiKey) {
        config.headers["Authorization"] = configuredApiKey;
      }
      return config;
    });
  }

  async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
  ): Promise<T> {
    const config: AxiosRequestConfig = { method, url: endpoint };

    if (method === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await this.client.request(config)) as any;
    return response.data as T;
  }

  async getTeams(): Promise<{ data: TeamInfo[] }> {
    return this.request("GET", "/teams");
  }

  async getAccounts(params?: {
    page?: number;
    size?: number;
    loginStatus?: number;
  }): Promise<{
    data: MediaAccount[];
    totalSize: number;
    page: number;
    size: number;
  }> {
    return this.request(
      "GET",
      "/platform-accounts",
      params || { page: 1, size: 20 },
    );
  }

  async getAccountOverviewsV2(params: {
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
  }> {
    return this.request("GET", "/platform-accounts/overviews-v2", params);
  }

  async getContentOverviews(params?: {
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
    headData: Array<{ name: string; key: string }>;
    page: number;
    size: number;
    totalSize: number;
    totalPage: number;
  }> {
    return this.request(
      "GET",
      "/contents/overviews",
      params || { page: 1, size: 10 },
    );
  }

  async getPublishRecords(params?: {
    page?: number;
    size?: number;
  }): Promise<any> {
    return this.request("GET", "/taskSets", params || { page: 1, size: 20 });
  }

  async getPublishPreset(platformAccountId: string): Promise<any> {
    return this.request(
      "GET",
      `/v2/platform/accounts/${platformAccountId}/publish-preset`,
    );
  }

  async publishTask(taskData: any): Promise<any> {
    return this.request("POST", "/taskSets/v2", taskData);
  }

  async getUploadUrl(
    fileName: string,
    fileSize: number,
    contentType: string,
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
  }> {
    const result = await this.request<any>(
      "GET",
      "/storages/cloud-publish/upload-url",
      {
        fileName,
        fileSize,
        contentType,
      },
    );
    return {
      uploadUrl: result.data?.serviceUrl || result.serviceUrl,
      fileKey: result.data?.key || result.key,
    };
  }
}

let clientInstance: YixiaoerClient | null = null;

export function getClient(): YixiaoerClient {
  if (!clientInstance) {
    createClient();
  }
  return clientInstance!;
}

export function createClient(baseUrl?: string): YixiaoerClient {
  const config: YixiaoerConfig = {
    baseUrl: baseUrl || "https://www-test.yixiaoer.cn/api",
  };
  clientInstance = new YixiaoerClient(config);
  return clientInstance;
}

export function clearClient(): void {
  clientInstance = null;
}

export function setApiKey(apiKey: string): void {
  configuredApiKey = apiKey;
}
