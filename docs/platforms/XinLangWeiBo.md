# XinLangWeiBo 平台发布字段

> 来源: `xinlangweibo.dto.ts`

## 1. XinLangWeiBoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `description` | string | ✅ 是 | 描述 |
| `type` | number | ❌ 否 | 类型字段 1原创 3二次创作内容 2转载内容 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |
| `collection` | object | ❌ 否 | 合集字段 |

## 2. XinLangWeiBoDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `images` | OldImage[] | ✅ 是 | 图片 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |

## 3. XinLangWeiBoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

