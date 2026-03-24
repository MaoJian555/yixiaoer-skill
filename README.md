# openclaw 蚁小二发布插件

用于调用蚁小二发布能力，实现多平台内容分发与发布相关查询。

## 前置条件

1. 注册蚁小二账号，并在后台绑定自媒体账号
2. 在插件配置中填写 `apiKey` (从蚁小二后台获取)
3. 插件会自动在请求头 `Authorization` 中携带该 Key 进行鉴权

## 安装与构建

```bash
npm install
npm run build
```

## 配置（仅本地测试）

- `YIXIAOER_API_KEY` 蚁小二 API Key
- `YIXIAOER_TEST_VIDEO` 本地测试视频路径

## 支持的动作

- `list-accounts` 获取账号列表（loginStatus=1）
- `account-overviews` 账号概览（新版）
- `content-overviews` 作品数据列表
- `publish-video` 发布视频
- `publish-image-text` 发布图文
- `publish-article` 发布文章
- `get-publish-records` 获取发布记录
- `upload-url` 获取上传 URL

注意：`publish` 为内部接口，不对外暴露。针对不同内容类型，请根据意图选择 `publish-video`、`publish-image-text` 或 `publish-article`。

## 发布流程（标准）

1. `list-accounts` 获取有效账号列表
2. 匹配 `platformAccountId`
3. 按需准备素材（若为本地文件，先通过 `upload-url` 获 Key）
4. 检查账号发布能力（见下表：平台与支持的发布类型）
5. 组装表单调用对应发布接口（`publish-video` / `publish-image-text` / `publish-article`）

## account-overviews 参数

- `platform`（必填，平台中文名）
- `page` / `size`
- `name` / `group`
- `loginStatus`（默认 1）

## content-overviews 参数

- `platformAccountId` / `publishUserId`
- `platform`（平台中文名）
- `type`（all/video/miniVideo/dynamic/article）
- `title`
- `publishStartTime` / `publishEndTime`（时间戳）
- `page` / `size`

## 平台与支持的发布类型

支持视频发布：
抖音、快手、小红书、微信视频号、新浪微博、腾讯微视、知乎、企鹅号、搜狐号、一点号、网易号、爱奇艺、哔哩哔哩、百家号、头条号、大鱼号、搜狐视频、皮皮虾、腾讯视频、多多视频、美拍视频、ACFun视频、小红书商家号、车家号视频、易车号视频、蜂网视频、得物、美柚视频

支持图文发布：
抖音、快手、新浪微博、小红书、微信视频号、百家号、知乎、头条

支持文章发布：
爱奇艺、百家号、头条号、新浪微博、知乎、企鹅号、搜狐号、一点号、网易号、大鱼号、快传号、雪球号、哔哩哔哩、微信公众号、豆瓣、CSDN、AcFun、简书、wifi万能钥匙、车家号、易车号文章

## 素材处理规则

远程素材示例：

```json
{
  "path": "https://example.com/image.jpg",
  "width": 1920,
  "height": 1080,
  "size": 1024000
}
```

本地素材：

1. 先调用 `upload-url` 获取 key
2. 使用 key 进行发布

```json
{
  "key": "upload/key/path.jpg",
  "width": 1920,
  "height": 1080,
  "size": 1024000
}
```

视频素材必须包含 `duration`，封面需从视频截图：

```json
{
  "path": "https://example.com/video.mp4",
  "width": 1920,
  "height": 1080,
  "size": 10240000,
  "duration": 30
}
```

## 发布参数规则

| 字段 | 说明 | 必填 | 规则 |
| --- | --- | --- | --- |
| `title` | 标题 | 是 | 最大 50 字 |
| `description` | 描述 | 是 | 最大 2000 字 |
| `platforms` | 发布平台数组 | 是 | 例如 `["抖音", "小红书"]` |
| `platformAccountId` | 平台账号 ID | 是 | 来自 `list-accounts` 的 `id` |
| `publishType` | 内容类型 | 是 | `article` / `imageText` / `video` |
| `clientId` | 客户端 ID | **云发布：否** | 云发布传 `null`，本机发布传设备 ID |
| `coverKey` | 封面 OSS Key | 否 | 与 `coverPath` 二选一 |
| `coverPath` | 封面路径/URL | 否 | 与 `coverKey` 二选一 |
| `videoPath` | 视频路径/URL | 否 | `video` 类型必填 |

> ⚠️ **重要提示**：云发布（默认）时，`clientId` 必须设置为 `null`（不是空字符串），表示不需要客户端在线即可发布。

### publishChannel

- `cloud`（默认）：云端自动发布，**无需客户端在线**，但需要设置 `clientId: null`
- `local`：本机发布，需填写 `clientId`（设备ID）并保持蚁小二客户端在线

## 发布类型最小必填字段

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