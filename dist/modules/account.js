import { getClient } from '../api/client.js';
export async function listAccounts(params) {
    try {
        const client = getClient();
        const response = await client.getAccounts({
            page: params.page || 1,
            size: params.size || 20,
            loginStatus: 1
        });
        if (!response.data || response.data.length === 0) {
            return {
                success: true,
                message: '暂无绑定的自媒体账号',
                data: { list: [], total: 0 }
            };
        }
        const platformSummary = {};
        for (const account of response.data) {
            const platform = account.platformName;
            platformSummary[platform] = (platformSummary[platform] || 0) + 1;
        }
        let message = `📋 共获取到 ${response.totalSize} 个账号（仅展示登录有效账号）:\n\n`;
        for (const [platform, count] of Object.entries(platformSummary)) {
            message += `- ${platform}: ${count} 个\n`;
        }
        message += '\n📝 账号详情:\n';
        for (const account of response.data.slice(0, 10)) {
            message += `- ${account.platformName} - ${account.platformAccountName}\n`;
            message += `  ID: ${account.id || account.accountId}\n`;
        }
        if (response.totalSize > 10) {
            message += `\n... 还有 ${response.totalSize - 10} 个账号`;
        }
        return {
            success: true,
            message,
            data: response
        };
    }
    catch (error) {
        const errorMsg = error.message;
        if (errorMsg.includes('认证已失效') || errorMsg.includes('API Key')) {
            return {
                success: false,
                message: `❌ ${errorMsg}，请检查配置的 API Key`
            };
        }
        return {
            success: false,
            message: `❌ 获取账号列表失败: ${errorMsg}`
        };
    }
}
export async function getPublishPreset(params) {
    try {
        const client = getClient();
        const result = await client.getPublishPreset(params.platformAccountId);
        if (!result) {
            return {
                success: false,
                message: "❌ 获取发布预设失败，账号可能不存在或已离线",
            };
        }
        let message = "📋 发布预设信息:\n\n";
        if (result.videoCategory)
            message += `🎬 视频分类: ${result.videoCategory}\n`;
        if (result.videoTopics)
            message += `🎬 视频话题: ${result.videoTopics}\n`;
        if (result.articleCategory)
            message += `📝 文章分类: ${result.articleCategory}\n`;
        if (result.articleTopics)
            message += `📝 文章话题: ${result.articleTopics}\n`;
        if (result.dynamicCategory)
            message += `🖼️ 图文分类: ${result.dynamicCategory}\n`;
        if (result.dynamicTopics)
            message += `🖼️ 图文话题: ${result.dynamicTopics}\n`;
        message += "\n💡 提示: 在发布请求的 contentPublishForm 中，category 和 tags 字段应参考以上内容。示例: { \"category\": [\"美食\"], \"tags\": [\"健康\"] }";
        return {
            success: true,
            message,
            data: result,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `❌ 获取发布预设失败: ${error.message}`,
        };
    }
}
export async function listGroups(params) {
    try {
        const client = getClient();
        const response = await client.getGroups({
            name: params.name,
            onlySelf: params.onlySelf,
            page: params.page || 1,
            size: params.size || 10,
            visibleScope: params.visibleScope
        });
        if (!response.data || response.data.length === 0) {
            return {
                success: true,
                message: '暂无分组信息',
                data: { list: [], total: 0 }
            };
        }
        let message = `📂 共获取到 ${response.totalSize} 个分组:\n\n`;
        for (const group of response.data) {
            message += `• ${group.name}`;
            if (group.accountCount !== undefined) {
                message += ` (${group.accountCount} 个账号)`;
            }
            message += '\n';
            if (group.visibleScope) {
                message += `  可见范围: ${group.visibleScope === 'all' ? '所有用户' : '指定用户'}\n`;
            }
            message += `  ID: ${group.id}\n\n`;
        }
        return {
            success: true,
            message,
            data: response
        };
    }
    catch (error) {
        const errorMsg = error.message;
        if (errorMsg.includes('认证已失效') || errorMsg.includes('API Key')) {
            return {
                success: false,
                message: `❌ ${errorMsg}，请检查配置的 API Key`
            };
        }
        return {
            success: false,
            message: `❌ 获取分组列表失败: ${errorMsg}`
        };
    }
}
//# sourceMappingURL=account.js.map