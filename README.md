# openclaw 蚁小二发布插件

本插件用于调用蚁小二发布能力，实现多平台内容分发。

## ⚠️ 前置条件（必读）

> **使用本插件前必须先完成以下操作：**
>
> 1. **注册蚁小二账号** - 访问 [蚁小二官网](https://www.yixiaoer.cn) 注册账号
> 2. **绑定自媒体账号** - 在蚁小二后台绑定需要发布的自媒体平台账号（抖音、小红书、B站等）
> 3. **登录获取凭证** - 使用 `login` 命令登录蚁小二账号

**注意**：本插件依赖蚁小二平台的服务，需要用户自行注册蚁小二账号并完成自媒体账号绑定后才能正常使用。

## 安装与构建

```
npm install
npm run build
```

## 配置

- `YIXIAOER_USERNAME` / `YIXIAOER_PASSWORD` 仅供本地测试脚本使用
- `YIXIAOER_TEST_VIDEO` 本地测试视频路径

## 支持的动作

`plugin.json` 定义了以下动作：

- `login` 用户名密码登录
- `logout` 退出登录
- `list-accounts` 获取账号列表（仅登录有效账号，loginStatus=1）
- `get-teams` 获取团队列表
- `account-overviews` 账号概览-新版
- `content-overviews` 作品数据列表
- `publish-flow` **一键登录/选团队/发布（唯一推荐入口）**
- `get-publish-records` 获取发布记录
- `upload-url` 获取上传 URL

> **注意**：`publish` 为内部接口，不对外暴露。AI 发布内容时必须使用 `publish-flow`。

## 发布流程

标准 workflow 如下：

1. **检查登录状态** - 检查是否存在有效登录会话，如无会话或会话过期，自动调用 `login`
2. **获取团队列表（如需）** - 调用 `get-teams` 获取用户所属团队
3. **获取账号列表** - 调用 `list-accounts` 获取已绑定的自媒体账号
4. **匹配平台账号** - 根据指定的 `platform` 从账号列表中匹配对应的 `platformAccountId`
5. **处理素材** - 远程素材直接使用，本地素材先调用 `upload-url` 获取 key
6. **组装发布表单** - 根据内容类型（article/imageText/video）组装对应参数
7. **调用发布接口** - **必须使用** **`publish-flow`**

## publish-flow 参数说明

`publish-flow` 是唯一推荐的发布入口，在 `publish` 基础上增加：

- `username` / `password`（未登录时必填）
- `teamId` 或 `teamName`（二选一，必须提供）

并在执行前校验登录、团队存在以及账号有效性（loginStatus=1）。

## account-overviews 参数说明

- `platform`（必填）：平台中文名
- `page` / `size`
- `name` / `group`
- `loginStatus`（默认 1）

## content-overviews 参数说明

- `platformAccountId` / `publishUserId`
- `platform`（平台中文名）
- `type`（all/video/miniVideo/dynamic/article）
- `title`
- `publishStartTime` / `publishEndTime`（时间戳）
- `page` / `size`

## 平台与支持的发布类型

### 支持视频发布

抖音、快手、小红书、微信视频号、新浪微博、腾讯微视、知乎、企鹅号、搜狐号、一点号、网易号、爱奇艺、哔哩哔哩、百家号、头条号、大鱼号、搜狐视频、皮皮虾、腾讯视频、多多视频、美拍视频、ACFun视频、小红书商家号、车家号视频、易车号视频、蜂网视频、得物、美柚视频

### 支持图文发布

抖音、快手、新浪微博、小红书、微信视频号、百家号、知乎、头条

### 支持文章发布

爱奇艺、百家号、头条号、新浪微博、知乎、企鹅号、搜狐号、一点号、网易号、大鱼号、快传号、雪球号、哔哩哔哩、微信公众号、豆瓣、CSDN、AcFun、简书、wifi万能钥匙、车家号、易车号文章

## 素材处理规则

### 远程素材

```json
{
  "path": "https://example.com/image.jpg",
  "width": 1920,
  "height": 1080,
  "size": 1024000
}
```

### 本地素材

1. 先调用 `upload-url` 获取上传凭证和 key
2. 获取 key 后使用 key 进行发布

```json
{
  "key": "upload/key/path.jpg",
  "width": 1920,
  "height": 1080,
  "size": 1024000
}
```

### 视频素材特殊规则

视频素材**必须**包含 `duration` 字段，且封面**需要从视频上截图**获取：

```json
{
  "path": "https://example.com/video.mp4",
  "width": 1920,
  "height": 1080,
  "size": 10240000,
  "duration": 30
}
```

> **注意**：视频发布时，封面不能使用任意图片，必须从视频中截取一帧作为封面。

## 发布参数规则

所有发布请求必须包含以下字段：

| 字段                | 说明         | 必填 | 规则                                                                 |
| ----------------- | ---------- | -- | ------------------------------------------------------------------ |
| title             | 标题         | 是  | 最大 50 字                                                           |
| description       | 描述         | 是  | 最大 2000 字                                                         |
| platforms         | 发布平台数组     | 是  | 必须是数组，如 `["抖音", "小红书"]`                                       |
| platformAccountId | 平台账号ID     | 是  | 通过 list-accounts 获取，**应为账号列表中的 id 字段值**                      |
| publishType       | 内容类型       | 是  | 固定值：`article` / `imageText` / `video`                            |
| clientId          | 客户端ID      | 否  | 云发布时可选，本机发布时必填                                              |
| coverKey          | 封面 OSS Key | 否  | 本地封面上传后获取的 OSS key，与 coverPath 二选一                         |
| coverPath         | 封面远程 URL   | 否  | 远程封面 URL，与 coverKey 二选一                                       |
| videoPath         | 视频文件路径    | 否  | 本地路径会自动上传，远程URL直接使用（video类型必填）                        |

### publishChannel 发布渠道说明

- **云发布 (cloud)**：默认方式，无需客户端在线，任务提交后由云端服务器自动发布
- **本机发布 (local)**：需要客户端在线并运行**蚁小二客户端**，发布时需要在 `clientId` 中填写本机设备ID

### clientId 设备ID说明

- **云发布**：无需设置 `clientId`（或留空），系统会自动处理
- **本机发布**：必须设置 `clientId` 为本机设备ID，才能将发布任务下发到对应客户端

> 💡 **如何获取 clientId**：在蚁小二客户端中查看设备ID，或在账号详情中获取对应账号的客户端设备标识。

## 发布类型的最小必填字段

`video`

- `title` / `description`
- `videoPath`
- `platforms`
- `platformAccountId`

`imageText`

- `title` / `description`
- `imagePaths`
- `platforms`
- `platformAccountId`

`article`

- `title` / `description`
- `platforms`
- `platformAccountId`

## 发布表单规则（基于 publish-api.json）

发布请求的核心结构：

```
{
  "clientId": "客户端ID",
  "isDraft": false,
  "platforms": ["平台账号ID数组"],
  "publishType": "video|imageText|article",
  "taskSetId": "",
  "publishChannel": "cloud",
  "publishArgs": {
    "accountForms": [
      {
        "platformAccountId": "平台账号ID",
        "contentPublishForm": { ... },
        "cover": { ... },
        "coverKey": "封面key",
        "images": ["图文图片key"],
        "video": { ... }
      }
    ],
    "platformForms": {
      "DouYin": { ... },
      "BiLiBiLi": { ... }
    },
    "content": "文章/图文正文"
  }
}
```

最小可跑通的表单规则：

`contentPublishForm`（任务级/平台级表单基础）

- `title` 必填
- `description` 必填
- `type` / `declaration` / `visibleType` 等为平台可选字段

`video` 类型

- `accountForms[].video` 必填
- `video.key` 必填（上传后返回的 key）
- `video.size` / `video.duration` / `video.width` / `video.height` 建议填

`imageText` 类型

- `accountForms[].images` 必填（上传后返回的 key 列表）
- `publishArgs.content` 必填（正文）

`article` 类型

- `publishArgs.content` 必填（正文）

平台级表单 `platformForms`

- 字段依据平台不同，完整字段清单见 `src/config/platform-rules.ts` 中 `platformFields`
- 当前实现仅填入 `title`/`description` 的最小表单

## 本地测试脚本

`test-upload.ts` 仅用于验证上传流程，需设置环境变量：

```
发布记录YIXIAOER_USERNAME=your_username
YIXIAOER_PASSWORD=your_password
YIXIAOER_TEST_VIDEO=C:\path\to\test_video.mp4
```

