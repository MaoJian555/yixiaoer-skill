# AcFun 平台发布字段

> 来源: `acfun.dto.ts`

## 1. AcFunVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ❌ 否 | 视频描述 |
| `tags` | string[] | ❌ 否 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `type` | 0 | ✅ 是 | 内容类型 - 视频的内容类型，1:原创 0:非原创 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

## 2. AcFunArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `desc` | string | ❌ 否 | 文章描述 |
| `tags` | string[] | ✅ 是 | 标签 |
| `contentSourceUrl` | string | ❌ 否 | 原文链接，当创作类型为转载时必须填写 |
| `category` | Category[] | ✅ 是 | 文章分类 |
| `type` | 0 | ✅ 是 | 创作类型类型 - 0:不申明 1:申明原创 |

