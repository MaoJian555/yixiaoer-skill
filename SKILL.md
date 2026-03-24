---
name: yixiaoer-skill
description: 蚁小二（龙虾插件）执行规范。集成多平台内容一键发布、作品数据监控及账号状态管理。支持基于 API Key 的全自动化分发流程。
---

# 蚁小二（龙虾插件）执行规范

## 1. 核心职能
本插件是 AI 与“蚁小二”自媒体分发平台之间的标准合规接口，核心能力包括：
- **全平台分发**：支持 40+ 主流媒体平台（抖音、小红书、视频号等）的文章、图文、视频一键同步发布。
- **数据回流**：实时查询各平台的账号概览及作品播放/阅读数据。
- **自动化发布流**：支持云端（Cloud）无人值守发布与本地（Local）控制权发布。

## 触发机制 (Intents & Triggers)
AI 在识别到以下语境或关键词时，应优先考虑调用本插件：
- **分发/集群类**：一键分发、同步发布、多端同步、群发、分发到所有平台、发作品。
- **特定内容类**：发布视频、发抖音/快手/B站、视频号同步、发笔记、发图文、发动态、同步小红书、发说说、发文章、同步公众号、发布长文、写博客。
- **数据/监控类**：查播放量、看阅读数、查询粉丝、账号概览、数据监控、作品表现、收益查询。
- **日常管理**：获取账号列表、查发布记录、上传视频/图片到蚁小二。

## 2. 强制性预检流程 (Pre-flight Checks)
AI 在执行任何发布操作前，**必须**按顺序完成以下校验：
1.  **API Key 校验**：确认插件配置中已填写“龙虾插件”授权令牌。
2.  **VIP 状态检查**：调用相关接口检查当前团队是否为 **VIP**。
    *   *非 VIP 处理*：若非 VIP 团队，必须中断操作并告知用户：“该团队未开通 VIP 权限，不支持使用龙虾插件进行自动化操作。”

## 3. 标准操作指南

### 3.1 内容发布流程 (Step-by-Step)
1.  **账号准备**：调用 `list-accounts` 获取当前团队下登录状态有效 (`loginStatus=1`) 的账号 ID (`platformAccountId`)。
2.  **素材处理**：
    *   若为视频/图片，需调用 `upload-url` 获取直传地址。
    *   上传采用 **Binary (Binary)** 模式，保持 `contentType` 一致。
3.  **个性化参数 (contentPublishForm)**：
    *   **核心准则**：AI **必须** 先阅读 [PLATFORM_FORMS.md](file:///c:/work/yixiaoer/yixiaoer-skill/PLATFORM_FORMS.md) 确定目标平台所需的 `contentPublishForm` 字段。
    *   **预设查询**：调用 `get-publish-preset` 获取平台的动态分类 (`category`) 和话题标签 (`tags`) 备选项。
    *   **数据填充**：将上述信息填入 `contentPublishForm` 对象中提交。
4.  **最终提交**：根据内容类型触发 `publish-video`、`publish-image-text` 或 `publish-article`。

### 3.2 关键参数约束
- **云发布 (Cloud - 推荐)**：`publishChannel='cloud'`。此时 `clientId` 必须设为 **null**（禁止传空字符串 `""`）。前提是该账号已配置代理（Agent）。
- **本机发布 (Local)**：`publishChannel='local'`。必须由用户提供其运行中的客户端 `clientId`。

## 4. 操作列表 (Action Manifest)

| 操作 | 场景建议 | 核心参数说明 |
| --- | --- | --- |
| `list-accounts` | 发布前导，选择目标账号 | `loginStatus=1` 为过滤项 |
| `publish-video` | 发布短视频/长视频 | `videoPath` (必填), `platforms`, `platformAccountId` |
| `publish-image-text` | 发布图文、动态、笔记 | `imagePaths` (数组), `description` (正文) |
| `publish-article` | 发布长篇文章、公众号内容 | `title`, `description` (HTML/正文) |
| `account-overviews` | 查询粉丝数、账号权重等概览 | `platform`, `name` |
| `content-overviews` | 查询特定作品的播放/阅读数据 | `platformAccountId`, `type` |
| `upload-url` | 获取素材直传 OSS Key 及 URL | `fileName`, `contentType` |
| `get-extended-api-docs` | 获取除发布外的用户、任务、设备等其他 API | 无 |

## 6. 其他接口识别 (Extended Discovery)
当 AI 被要求执行本插件显式定义的技能以外的操作（如：查询财务数据、管理分组、更新设备日志等）时，**必须**按以下步骤操作：
1.  调用 `get-extended-api-docs` 获取 LLMS 文档链接。
2.  访问该链接并识别对应的 API 定义。
3.  引导用户或告知用户这些非核心技能的调用方式。

## 5. 平台支持矩阵 (Platform Matrix)

### 支持视频发布 (Video)
抖音、快手、小红书、微信视频号、新浪微博、腾讯微视、知乎、企鹅号、搜狐号、一点号、网易号、爱奇艺、哔哩哔哩、百家号、头条号、大鱼号、搜狐视频、皮皮虾、腾讯视频、多多视频、美拍视频、ACFun视频、小红书商家号、车家号视频、易车号视频、蜂网视频、得物、美柚视频

### 支持图文发布 (ImageText)
抖音、快手、新浪微博、小红书、微信视频号、百家号、知乎、头条

### 支持文章发布 (Article)
爱奇艺、百家号、头条号、新浪微博、知乎、企鹅号、搜狐号、一点号、网易号、大鱼号、快传号、雪球号、哔哩哔哩、微信公众号、豆瓣、CSDN、AcFun、简书、车家号、易车号文章


