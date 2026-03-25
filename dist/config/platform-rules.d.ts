/**
 * platform-rules.ts
 *
 * ⚠️  此文件由脚本自动生成，请勿手动修改！
 * 生成命令：node scripts/generate-platform-rules.mjs
 * 生成时间：2026/3/25 14:52:51
 */
export interface PlatformRule {
    code: string;
    name: string;
    supportedTypes: ('video' | 'imageText' | 'article')[];
    platformFields: string[];
}
export declare const PLATFORM_RULES: Record<string, PlatformRule>;
export declare enum TimeUnit {
    Day = "day",
    Minute = "minute"
}
export declare enum FormType {
    Platform = "platform",
    Task = "task"
}
export declare enum PublishChannel {
    Cloud = "cloud",
    Local = "local"
}
export declare enum PublishType {
    Article = "article",
    ImageText = "imageText",
    Video = "video"
}
export declare function getPlatformRule(platformCode: string): PlatformRule | undefined;
export declare function getAllPlatforms(): PlatformRule[];
export declare function buildContentPublishForm(publishType: 'video' | 'imageText' | 'article', params: {
    title?: string;
    description?: string;
    createType?: number;
    pubType?: number;
    tags?: string[];
}): Record<string, any>;
export declare function buildPlatformPublishForm(publishType: 'video' | 'imageText' | 'article', platformCode: string, params: {
    title?: string;
    description?: string;
    createType?: number;
    pubType?: number;
    tags?: string[];
}): Record<string, any>;
export declare function validatePublishParams(platformCode: string, publishType: 'video' | 'imageText' | 'article'): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=platform-rules.d.ts.map