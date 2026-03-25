# AiQiYi 平台发布字段

> 来源: `aiqiyi.dto.ts`

## 1. AiQiYiVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ❌ 否 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `type` | 1 | ✅ 是 | 内容类型 0:草稿 1:直接发布 |
| `declaration` | number | ❌ 否 | '声明字段0:无需申明 1:内容由AI生成 2:虚构演绎仅供娱乐 3:取材网络 |
| `scheduledTime` | number | ❌ 否 | 定时任务 |

## 2. AiQiYiArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |

