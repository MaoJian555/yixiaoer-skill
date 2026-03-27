"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPublishTask = submitPublishTask;
const client_js_1 = require("../api/client.js");
const platform_rules_js_1 = require("../config/platform-rules.js");
function handleError(error) {
    const errorMsg = error.message;
    if (errorMsg.includes("登录已失效") ||
        errorMsg.includes("请重新登录") ||
        errorMsg.includes("apiKey") ||
        errorMsg.includes("401")) {
        return {
            success: false,
            message: `❌ ${errorMsg}，请检查插件 API Key 是否配置正确且有效。`,
        };
    }
    return {
        success: false,
        message: `❌ ${errorMsg}`,
    };
}
function buildPlatformForms(targets, publishType) {
    const platformNames = [];
    const platformForms = {};
    for (const target of targets) {
        const rule = platform_rules_js_1.PLATFORM_RULES[target.platformCode];
        if (!rule) {
            throw new Error(`不支持的平台: ${target.platformName}`);
        }
        const validation = (0, platform_rules_js_1.validatePublishParams)(target.platformCode, publishType);
        if (!validation.valid) {
            throw new Error(`${target.platformName} 参数验证失败: ${validation.errors.join("; ")}`);
        }
        platformNames.push(target.platformName);
        platformForms[target.platformName] = { formType: "task" };
    }
    return {
        platformNames,
        platformForms,
    };
}
async function submitPublishTask(params) {
    try {
        if (!params.targets || params.targets.length === 0) {
            return {
                success: false,
                message: "❌ 参数错误: 缺少可发布的平台账号目标",
            };
        }
        const client = (0, client_js_1.getClient)();
        const publishChannel = params.publishChannel || "cloud";
        const finalPublishChannel = params.clientId ? "local" : publishChannel;
        const { platformNames, platformForms } = buildPlatformForms(params.targets, params.publishType);
        let publishArgs = {
            clientId: finalPublishChannel === "cloud" ? null : (params.clientId || null),
            platforms: platformNames,
            publishType: params.publishType,
            publishChannel: finalPublishChannel,
            coverKey: params.coverKey || "",
            proxyId: params.proxyId,
            publishArgs: {
                accountForms: params.accountForms,
                platformForms,
            },
        };
        let response;
        let isLocalPublish = finalPublishChannel === "local";
        try {
            response = await client.publishTask(publishArgs);
        }
        catch (error) {
            const errorMsg = error.message || "";
            if (errorMsg.includes("代理未设置") && params.clientId) {
                isLocalPublish = true;
                publishArgs = {
                    clientId: params.clientId,
                    platforms: platformNames,
                    publishType: params.publishType,
                    publishChannel: "local",
                    coverKey: params.coverKey || "",
                    proxyId: params.proxyId,
                    publishArgs: {
                        accountForms: params.accountForms,
                        platformForms,
                    },
                };
                response = await client.publishTask(publishArgs);
            }
            else {
                throw error;
            }
        }
        return {
            success: true,
            message: `✅ ${isLocalPublish ? "本机发布" : "云发布"}任务已提交到 ${platformNames.join(", ")}，共 ${params.accountForms.length} 个账号`,
            data: response,
        };
    }
    catch (error) {
        return handleError(error);
    }
}
