---
name: yixiaoer-plugin
description: openClaw 插件执行规范。用于蚁小二登录、团队与账号查询、素材上传、文章/图文/视频发布与发布记录查询的标准流程与参数约束。
---

# 蚁小二发布插件（openClaw 执行规范）

## 执行环境

插件按 Node.js 运行时执行。调用与流程均基于 Node.js 的执行上下文。

## 适用范围

openClaw 在执行以下意图时使用本插件：

- 发布文章/图文/视频
- 多平台分发
- 上传素材并发布
- 查询账号/作品/发布记录

## 操作列表

| 操作 | 说明 | 备注 |
| --- | --- | --- |
| `login` | 用户名密码登录 | 无会话或过期时调用 |
| `logout` | 退出登录 | 按需 |
| `get-teams` | 获取团队列表 | 发布前必须 |
| `list-accounts` | 获取账号列表 | 发布前必须 |
| `account-overviews` | 账号概览 | 按需 |
| `content-overviews` | 作品列表 | 按需 |
| `publish-flow` | 一键登录/选团队/发布 | 唯一推荐入口 |
| `get-publish-records` | 发布记录 | 按需 |
| `upload-url` | 获取上传 URL | 本地素材必需 |

注意：`publish` 为内部接口，不对外暴露。

## 标准发布流程

1. 检查会话，无效则 `login`
2. `get-teams` 选择团队
3. `list-accounts` 获取账号
4. 匹配 `platformAccountId`
5. 素材处理（远程直用 / 本地 `upload-url`）
6. 组装表单
7. `publish-flow` 提交发布

## 关键参数规则

| 字段 | 说明 | 必填 | 规则 |
| --- | --- | --- | --- |
| `title` | 标题 | 是 | 最大 50 字 |
| `description` | 描述 | 是 | 最大 2000 字 |
| `platforms` | 发布平台数组 | 是 | 例如 `["抖音", "小红书"]` |
| `platformAccountId` | 平台账号 ID | 是 | 来自 `list-accounts` 的 `id` |
| `publishType` | 内容类型 | 是 | `article` / `imageText` / `video` |
| `clientId` | 客户端 ID | **云发布：否** | 云发布传 `null`，本机发布传设备 ID |
| `publishChannel` | 发布渠道 | 否 | `cloud`（默认） / `local` |
| `coverKey` | 封面 OSS Key | 否 | 与 `coverPath` 二选一 |
| `coverPath` | 封面路径/URL | 否 | 与 `coverKey` 二选一 |
| `videoPath` | 视频路径/URL | 否 | `video` 类型必填 |

> ⚠️ **重要提示**：云发布（默认）时，`clientId` 必须设置为 `null`（不是空字符串），表示不需要客户端在线即可发布。

## 素材规则

远程素材：

```json
{
  "path": "https://example.com/image.jpg",
  "width": 1920,
  "height": 1080,
  "size": 1024000
}
```

本地素材：

1. `upload-url` 获取 key
2. 使用 key 发布

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

## 平台枚举

支持视频发布：
抖音、快手、小红书、微信视频号、新浪微博、腾讯微视、知乎、企鹅号、搜狐号、一点号、网易号、爱奇艺、哔哩哔哩、百家号、头条号、大鱼号、搜狐视频、皮皮虾、腾讯视频、多多视频、美拍视频、ACFun视频、小红书商家号、车家号视频、易车号视频、蜂网视频、得物、美柚视频

支持图文发布：
抖音、快手、新浪微博、小红书、微信视频号、百家号、知乎、头条

支持文章发布：
爱奇艺、百家号、头条号、新浪微博、知乎、企鹅号、搜狐号、一点号、网易号、大鱼号、快传号、雪球号、哔哩哔哩、微信公众号、豆瓣、CSDN、AcFun、简书、wifi万能钥匙、车家号、易车号文章
