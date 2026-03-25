# DaYuHao 平台发布字段

> 来源: `dayuhao.dto.ts`

## 1. DaYuHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `type` | 0 | ✅ 是 | 创作类型类型 - 1:原创 0:非原创 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |

## 2. DaYuHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `verticalCovers` | OldCover[] | ✅ 是 | 文章竖版封面图 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

