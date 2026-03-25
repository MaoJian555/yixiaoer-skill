---
name: yixiaoer-skill
description: 蚁小二多平台内容发布 OpenClaw Skill。支持抖音、小红书、B站、快手、视频号等40+平台一键发布，集成账号管理与数据监控。
license: MIT
metadata:
  author: yixiaoer
  homepage: https://www.yixiaoer.cn
  repository: https://github.com/MaoJian555/yixiaoer-skill
  version: 1.0.4
  tags:
    - yixiaoer
    - openclaw-skill
    - publisher
    - social-media
    - multi-platform
    - content-distribution
---

# 蚁小二多平台发布 Skill

基于 [蚁小二开放平台](https://www.yixiaoer.cn) 的多平台内容发布 OpenClaw Skill。

## ✨ 功能特性

- 🚀 **一键多平台发布** - 支持 40+ 主流平台
- 📹 **视频发布** - 抖音、快手、小红书、视频号、B站等 28+ 平台
- 🖼️ **图文发布** - 抖音、快手、小红书、视频号、微博等 9 平台
- 📝 **文章发布** - 微信公众号、百家号、头条号、知乎等 20+ 平台
- 🔄 **批量发布** - 一次操作，多平台同步
- ⏰ **定时发布** - 支持预约发布时间
- 📊 **数据监控** - 作品数据、账号概览查询
- 🔍 **自动发现** - 智能匹配平台账号

## 📋 支持平台

### 视频发布 (28+ 平台)
抖音、快手、小红书、视频号、B站、微博、知乎、百家号、头条号、企鹅号、大鱼号、搜狐号、一点号、网易号、爱奇艺、腾讯视频、搜狐视频、AcFun、皮皮虾、多多视频、美拍、得物、车家号、易车号、蜂网、美柚等

### 图文发布 (9 平台)
抖音、快手、小红书、视频号、微博、百家号、知乎、头条号

### 文章发布 (20+ 平台)
微信公众号、百家号、头条号、知乎、微博、B站、CSDN、简书、豆瓣、企鹅号、搜狐号、一点号、网易号、大鱼号、快传号、雪球号、AcFun、爱奇艺、车家号、易车号等

## 🔧 安装配置

### 前置条件

1. 注册 [蚁小二](https://www.yixiaoer.cn) 账号
2. 在蚁小二后台绑定自媒体账号
3. 获取 API Key

### 配置

```json
{
  "apiKey": "your_yixiaoer_api_key"
}
```

## 🛠️ 工具列表

### 发布工具

| 工具 | 描述 |
|------|------|
| `multi-platform-publish` | 一键发布到多个平台 |
| `publish-video` | 发布视频内容 |
| `publish-image-text` | 发布图文内容 |
| `publish-article` | 发布文章内容 |

### 账号工具

| 工具 | 描述 |
|------|------|
| `list-accounts` | 获取账号列表 |
| `account-overviews` | 获取账号概览 |

### 数据工具

| 工具 | 描述 |
|------|------|
| `content-overviews` | 获取作品数据 |

### 辅助工具

| 工具 | 描述 |
|------|------|
| `upload-url` | 获取上传地址 |
| `get-publish-preset` | 获取发布预设 |
| `validate-form` | 验证表单字段 |

## 📖 使用示例

### 发布视频到多平台

```
使用 multi-platform-publish 工具：
- title: "视频标题"
- description: "视频描述"
- publishType: "video"
- platforms: ["抖音", "小红书", "B站"]
- videoPath: "https://example.com/video.mp4"
```

### 发布图文到小红书

```
使用 publish-image-text 工具：
- platform: "小红书"
- title: "图文标题"
- description: "正文内容"
- imagePaths: ["https://example.com/1.jpg", "https://example.com/2.jpg"]
```

### 发布文章到微信公众号

```
使用 publish-article 工具：
- platform: "微信公众号"
- title: "文章标题"
- description: "文章正文（支持HTML）"
```

## 📊 发布参数

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 标题（最大50字） |
| description | string | 描述/正文（最大2000字） |
| publishType | enum | video / imageText / article |
| platforms | string[] | 目标平台列表 |

### 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| videoPath | string | 视频URL/路径 |
| imagePaths | string[] | 图片URL列表 |
| coverPath | string | 封面图片 |
| isDraft | boolean | 是否草稿 |
| scheduledTime | number | 定时发布时间戳 |

## 🔒 创作声明

各平台支持的创作声明类型：

| 平台 | 声明值 | 说明 |
|------|--------|------|
| 小红书 | 1, 2 | 虚构演绎 / AI合成 |
| 抖音 | 3, 4, 5, 6 | AI生成 / 引人不适 / 虚构演绎 / 危险行为 |
| B站 | 0-6 | 不申明 / AI合成 / 危险行为 / 仅供娱乐等 |

## 📁 项目结构

```
yixiaoer-skill/
├── src/
│   ├── index.ts           # Skill 入口
│   ├── api/               # API 客户端
│   ├── modules/           # 功能模块
│   ├── services/          # 服务层
│   └── types/             # 类型定义
├── dist/                  # 编译输出
├── docs/                  # 平台文档
├── SKILL.md               # 本文档
├── PLATFORM_FORMS.md      # 平台字段百科
└── openclaw.plugin.json   # 插件配置
```

## ⚠️ 注意事项

1. **API Key 必填** - 需在蚁小二后台获取
2. **账号绑定** - 发布前需绑定目标平台账号
3. **VIP 权限** - 部分功能需要 VIP 权限
4. **素材处理** - 本地文件需先通过 upload-url 上传

## 📄 许可证

MIT

## 🔗 相关链接

- [蚁小二官网](https://www.yixiaoer.cn)
- [OpenClaw 文档](https://docs.openclaw.ai)
- [问题反馈](https://github.com/MaoJian555/yixiaoer-skill/issues)