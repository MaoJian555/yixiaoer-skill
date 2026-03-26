import { getClient } from '../api/client.js';
import { PLATFORM_FORM_SCHEMA } from '../config/platform-form-schema.js';
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
export async function getPlatformFormSchema(params) {
    try {
        const client = getClient();
        const { platform, publishType } = params;
        const accounts = await client.getAccounts({ page: 1, size: 200, loginStatus: 1 });
        const targetAccounts = accounts.data?.filter((a) => a.platformName.includes(platform) || platform.includes(a.platformName)) || [];
        if (targetAccounts.length === 0) {
            return {
                success: false,
                message: `❌ 未找到平台 '${platform}' 的账号`,
            };
        }
        const accountId = targetAccounts[0].id;
        const presetResult = await client.getPublishPreset(accountId);
        const { PLATFORM_RULES } = await import('../config/platform-rules.js');
        let platformCode = null;
        for (const [code, rule] of Object.entries(PLATFORM_RULES)) {
            if (rule.name === platform || code === platform) {
                platformCode = code;
                break;
            }
        }
        if (!platformCode) {
            return {
                success: false,
                message: `❌ 不支持的平台: ${platform}`,
            };
        }
        const rule = PLATFORM_RULES[platformCode];
        const supportedTypes = rule?.supportedTypes || [];
        const mdSchema = PLATFORM_FORM_SCHEMA[platformCode] ??
            Object.values(PLATFORM_FORM_SCHEMA).find((item) => item.platformTitle === platform);
        if (mdSchema) {
            const forms = publishType
                ? mdSchema.forms.filter((form) => form.publishType === publishType)
                : mdSchema.forms;
            if (forms.length === 0) {
                return {
                    success: false,
                    message: `❌ 平台 ${platform} 不支持 ${publishType} 类型`,
                };
            }
            const fieldsDetail = forms.flatMap((form) => form.fields.map((field) => ({
                ...field,
                formName: form.formName,
                formLabel: form.formLabel,
            })));
            let message = `📋 ${platform} 发布表单结构:\n\n`;
            message += `支持的内容类型: ${supportedTypes.join(', ')}\n\n`;
            for (const form of forms) {
                message += `【${form.formLabel}】${form.formName}\n`;
                for (const field of form.fields) {
                    const requiredText = field.required ? '必填' : '选填';
                    message += `- ${field.name} [${field.rawType}] ${requiredText}\n`;
                    message += `  说明: ${field.description}\n`;
                    if (field.valueRange) {
                        message += `  值范围: ${field.valueRange}\n`;
                    }
                    if (field.example) {
                        message += `  示例: ${field.example}\n`;
                    }
                }
                message += '\n';
            }
            message += `💡 使用说明:\n`;
            message += `1. 优先调用 get_publish_preset 获取分类/话题等动态选项\n`;
            message += `2. 按上述字段填写 contentPublishForm\n`;
            message += `3. 若值范围写有“互斥”，表示该字段不能与特定字段同时传入\n`;
            return {
                success: true,
                message,
                data: {
                    platform,
                    platformCode,
                    supportedTypes,
                    forms,
                    fields: fieldsDetail,
                    preset: presetResult,
                },
            };
        }
        let typeSpecificFields = [];
        if (publishType && supportedTypes.includes(publishType)) {
            typeSpecificFields = getFieldsForType(publishType, rule.platformFields);
        }
        else {
            typeSpecificFields = [...new Set(supportedTypes.flatMap(t => getFieldsForType(t, rule.platformFields)))];
        }
        const baseFields = ['title', 'description'];
        const allFields = [...new Set([...baseFields, ...typeSpecificFields])];
        const fieldsDetail = allFields.map(field => ({
            name: field,
            description: field,
            required: field === 'title' || field === 'description',
            example: getFieldExample(field, publishType || 'video'),
        }));
        let message = `📋 ${platform} 发布表单结构:\n\n`;
        message += `支持的内容类型: ${supportedTypes.join(', ')}\n\n`;
        message += `字段列表 (共 ${fieldsDetail.length} 个):\n\n`;
        for (const field of fieldsDetail) {
            const requiredStar = field.required ? '⭐' : '  ';
            message += `${requiredStar}${field.name}: ${field.description}\n`;
            if (field.example) {
                message += `   示例: ${field.example}\n`;
            }
        }
        message += `\n💡 使用说明:\n`;
        message += `1. 调用 get_publish_preset 获取该平台的分类/话题选项\n`;
        message += `2. 在 contentPublishForm 中传入以上字段\n`;
        message += `3. 示例:\n`;
        message += `   contentPublishForm: {\n`;
        message += `     title: "视频标题",\n`;
        message += `     description: "视频描述",\n`;
        message += `     tags: ["标签1"],\n`;
        message += `     category: ["分类1"],\n`;
        message += `     declaration: 0\n`;
        message += `   }`;
        return {
            success: true,
            message,
            data: {
                platform: platform,
                platformCode,
                supportedTypes,
                fields: fieldsDetail,
                preset: presetResult,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: `❌ 获取平台表单结构失败: ${error.message}`,
        };
    }
}
function getFieldsForType(publishType, platformFields) {
    const typeSpecificFields = {
        video: ['video', 'covers', 'horizontalCover', 'videoDuration', 'videoWidth', 'videoHeight'],
        article: ['content', 'verticalCovers', 'covers'],
        imageText: ['images', 'covers'],
    };
    const extra = typeSpecificFields[publishType] || [];
    return [...platformFields, ...extra];
}
function getFieldExample(field, publishType) {
    const examples = {
        title: '"我的第一个视频"',
        description: '"这是视频描述内容..."',
        tags: '["标签1", "标签2"]',
        category: '["科技"]',
        declaration: '0 (0=原创, 1=转载)',
        location: '{"name": "北京", "lat": 39.9, "lng": 116.4}',
        scheduledTime: '1704067200000',
        collection: '"合集ID"',
        visibleType: '0 (0=公开, 1=私密)',
        allow_save: '1',
        allow_download: '1',
        shopping_cart: '0',
        topics: '["#话题1#"]',
        covers: '[{"key": "oss-key", "width": 1080, "height": 1920}]',
        horizontalCover: '{"key": "oss-key"}',
        content: '"<p>文章内容</p>"',
        createType: '0',
        pubType: '0',
        contentSourceUrl: '"https://example.com"',
        music: '{"id": "音乐ID", "name": "音乐名"}',
        short_title: '"短标题"',
        images: '[{"key": "oss-key", "width": 1080, "height": 1920}]',
        sex: '0',
        country: '"中国"',
        province: '"北京"',
        city: '"北京"',
        notifySubscribers: '1',
    };
    return examples[field] || '根据平台要求填写';
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
