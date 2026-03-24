import * as account from './modules/account.js';
import * as publish from './modules/publish.js';
import * as publishFlow from './modules/publish-flow.js';
import * as overviews from './modules/overviews.js';
import { getClient, setApiKey, createClient } from './api/client.js';
import type { SkillResult, UploadUrlParams, OpenClawApi } from './types.js';

let openclawApi: OpenClawApi | null = null;

function initApiKey(): void {
  if (openclawApi?.config?.apiKey) {
    setApiKey(openclawApi.config.apiKey);
    console.log('✅ 已加载配置的 API Key');
  }
}

function ensureClient(): void {
  if (openclawApi?.config?.apiKey) {
    setApiKey(openclawApi.config.apiKey);
  }
  getClient();
}

export default function plugin(api?: OpenClawApi): ((action: string, params: any) => Promise<SkillResult>) | void {
  if (api) {
    openclawApi = api;
    initApiKey();
    ensureClient();
    
    if (api.logger?.info) {
      api.logger.info('yixiaoer-skill 插件已加载');
    }
  }

  return run;
}

async function run(action: string, params: any): Promise<SkillResult> {
  try {
    switch (action) {
      case 'list-accounts':
        return await account.listAccounts(params);

      case 'get-publish-preset':
        return await account.getPublishPreset(params);

      case 'account-overviews':
        return await overviews.getAccountOverviewsV2(params);

      case 'content-overviews':
        return await overviews.getContentOverviews(params);

      case 'publish-video':
        return await publishFlow.publishFlow({ ...params, publishType: 'video' });

      case 'publish-image-text':
        return await publishFlow.publishFlow({ ...params, publishType: 'imageText' });

      case 'publish-article':
        return await publishFlow.publishFlow({ ...params, publishType: 'article' });

      case 'get-publish-records':
        return await publish.getPublishRecords(params);

      case 'upload-url':
        return await getUploadUrl(params);
        
      case 'get-extended-api-docs':
        return {
          success: true,
          message: `你可以通过以下链接获取蚁小二 4.0 的完整 LLMS 文档以识别更多 API（如用户管理、设备日志、任务集详情等）：\nhttps://s.apifox.cn/e66df935-0c39-44d0-8096-abd39417fa6a/llms.txt`,
          data: { url: "https://s.apifox.cn/e66df935-0c39-44d0-8096-abd39417fa6a/llms.txt" }
        };

      default:
        return {
          success: false,
          message: `❌ 不支持的操作: ${action}\n\n支持的操作:\n- list-accounts: 获取账号列表\n- account-overviews: 账号概览-新版\n- content-overviews: 作品数据列表\n- publish-video: 发布视频\n- publish-image-text: 发布图文\n- publish-article: 发布文章\n- get-publish-records: 获取发布记录\n- upload-url: 获取上传URL`
        };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ 执行失败: ${(error as Error).message}`,
      data: null
    };
  }
}

async function getUploadUrl(params: UploadUrlParams): Promise<SkillResult> {
  try {
    const client = getClient();

    if (!params.fileName) {
      return {
        success: false,
        message: "❌ 参数错误: 请提供 fileName (文件名)"
      };
    }

    if (!params.fileSize) {
      return {
        success: false,
        message: "❌ 参数错误: 请提供 fileSize (文件大小)"
      };
    }

    if (!params.contentType) {
      return {
        success: false,
        message: "❌ 参数错误: 请提供 contentType (文件类型，如 video/mp4)"
      };
    }

    const result = await client.getUploadUrl(params.fileName, params.fileSize, params.contentType);

    return {
      success: true,
      message: `✅ 获取上传URL成功\n\n上传URL: ${result.uploadUrl}\n文件Key: ${result.fileKey}`,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ 获取上传URL失败: ${(error as Error).message}`,
      data: null
    };
  }
}
