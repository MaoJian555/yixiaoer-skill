import * as publish from "./publish.js";
export async function publishFlow(params) {
    try {
        return await publish.publishContent(params);
    }
    catch (error) {
        return {
            success: false,
            message: `❌ 发布流程执行失败: ${error.message}`,
        };
    }
}
//# sourceMappingURL=publish-flow.js.map