import axios from "axios";
let configuredApiKey = null;
export class YixiaoerClient {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                "x-client": "openclaw",
            },
        });
        this.client.interceptors.response.use((response) => response.data, async (error) => {
            const apiResponse = error.response?.data;
            let message = apiResponse?.message || error.message;
            if (message.includes("timeout")) {
                message = "请求超时，请检查网络连接或稍后重试";
            }
            else if (message.includes("network") ||
                message.includes("ENOTFOUND") ||
                message.includes("ECONNREFUSED")) {
                message = "网络连接失败，请检查网络或服务器地址";
            }
            else if (message.includes("500") ||
                message.includes("Internal Server Error")) {
                message = "服务器内部错误，请稍后重试";
            }
            else if (message.includes("400") || message.includes("Bad Request")) {
                message = `请求参数错误: ${message}`;
            }
            else if (message.includes("403") || message.includes("Forbidden")) {
                message = "没有权限执行此操作";
            }
            else if (error.response?.status === 401) {
                message = "认证已失效，请检查 API Key 是否正确";
            }
            throw new Error(`蚁小二API错误: ${message}`);
        });
        this.client.interceptors.request.use((config) => {
            if (configuredApiKey) {
                config.headers["Authorization"] = configuredApiKey;
            }
            return config;
        });
    }
    async request(method, endpoint, data) {
        const config = { method, url: endpoint };
        if (method === "GET") {
            config.params = data;
        }
        else {
            config.data = data;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (await this.client.request(config));
        return response.data;
    }
    async getTeams() {
        return this.request("GET", "/teams");
    }
    async getAccounts(params) {
        return this.request("GET", "/platform-accounts", params || { page: 1, size: 20 });
    }
    async getAccountOverviewsV2(params) {
        return this.request("GET", "/platform-accounts/overviews-v2", params);
    }
    async getContentOverviews(params) {
        return this.request("GET", "/contents/overviews", params || { page: 1, size: 10 });
    }
    async getPublishRecords(params) {
        return this.request("GET", "/taskSets", params || { page: 1, size: 20 });
    }
    async getPublishPreset(platformAccountId) {
        return this.request("GET", `/v2/platform/accounts/${platformAccountId}/publish-preset`);
    }
    async getGroups(params) {
        return this.request("GET", "/groups", params || { page: 1, size: 10 });
    }
    async publishTask(taskData) {
        return this.request("POST", "/taskSets/v2", taskData);
    }
    async getUploadUrl(fileName, fileSize, contentType) {
        const result = await this.request("GET", "/storages/cloud-publish/upload-url", {
            fileName,
            fileSize,
            contentType,
        });
        return {
            uploadUrl: result.data?.serviceUrl || result.serviceUrl,
            fileKey: result.data?.key || result.key,
        };
    }
}
let clientInstance = null;
export function getClient() {
    if (!clientInstance) {
        createClient();
    }
    return clientInstance;
}
export function createClient(baseUrl) {
    const config = {
        baseUrl: baseUrl || "https://www.yixiaoer.cn/api",
    };
    clientInstance = new YixiaoerClient(config);
    return clientInstance;
}
export function clearClient() {
    clientInstance = null;
}
export function setApiKey(apiKey) {
    configuredApiKey = apiKey;
}
//# sourceMappingURL=client.js.map