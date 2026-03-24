import { getClient } from "../api/client.js";
import * as publish from "./publish.js";
export async function publishFlow(params) {
    try {
        const client = getClient();
        // Check VIP status
        const teams = await client.getTeams();
        const currentTeam = teams.data?.[0]; // API Key is bound to a single team
        if (!currentTeam?.isVip) {
            return {
                success: false,
                message: "❌ 该团队未开通 VIP，不支持使用一键发布功能（龙虾插件）。",
            };
        }
        // Validate account exists (loginStatus=1)
        const accounts = await client.getAccounts({ page: 1, size: 200, loginStatus: 1 });
        const accountMatch = accounts.data?.find(a => a.id === params.platformAccountId);
        if (!accountMatch) {
            return {
                success: false,
                message: "❌ 未找到有效的 platformAccountId，请先用 list-accounts 获取登录有效账号\n" +
                    "💡 提示: platformAccountId 应为账号列表中的 id 字段值",
            };
        }
        return await publish.publishContent(params);
    }
    catch (error) {
        return {
            success: false,
            message: `❌ 发布流程执行失败: ${error.message}`,
        };
    }
}
