import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  YixiaoerConfig,
  ApiResponse,
  LoginResponse,
  MediaAccount,
  TeamInfo,
} from "../types.js";

let cachedCredentials: { username: string; password: string } | null = null;

export class YixiaoerClient {
  private client: AxiosInstance;
  private config: YixiaoerConfig;
  private accessToken: string | null = null;

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
        const status = error.response?.status;

        if (status === 401) {
          console.log("🔄 Token已失效，尝试重新登录...");

          if (cachedCredentials) {
            try {
              await this.loginInternal(
                cachedCredentials.username,
                cachedCredentials.password,
              );
              console.log("✅ 重新登录成功，正在重试请求...");

              const originalRequest = error.config;
              originalRequest.headers["Authorization"] = this.accessToken;
              return this.client.request(originalRequest);
            } catch (reloginError) {
              cachedCredentials = null;
              throw new Error("登录已失效，请重新登录");
            }
          } else {
            throw new Error("登录已失效，请重新登录");
          }
        }

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
        }

        throw new Error(`蚁小二API错误: ${message}`);
      },
    );

    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers["Authorization"] = this.accessToken;
      }
      return config;
    });
  }

  private async loginInternal(
    username: string,
    password: string,
  ): Promise<void> {
    const response = await this.request<{ authorization: string }>(
      "POST",
      "/users/auth/v2",
      {
        username,
        password,
      },
    );
    this.accessToken = response.authorization;
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

  async login(username: string, password: string): Promise<LoginResponse> {
    cachedCredentials = { username, password };
    await this.loginInternal(username, password);

    return {
      token: this.accessToken!,
      expiresIn: 7 * 24 * 3600,
      user: { id: "", username },
    };
  }

  logout(): void {
    this.accessToken = null;
    cachedCredentials = null;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
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

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

let clientInstance: YixiaoerClient | null = null;

export function getClient(): YixiaoerClient {
  if (!clientInstance) {
    throw new Error("请先调用 login 登录");
  }
  return clientInstance;
}

export function createClient(baseUrl?: string): YixiaoerClient {
  const config: YixiaoerConfig = {
    baseUrl: baseUrl || "https://www.yixiaoer.cn/api",
  };
  clientInstance = new YixiaoerClient(config);
  return clientInstance;
}

export function clearClient(): void {
  if (clientInstance) {
    clientInstance.logout();
    clientInstance = null;
  }
}
