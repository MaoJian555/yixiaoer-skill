# Chejiahao 平台发布字段

> 来源: `chejiahao.dto.ts`

## 1. ChejiahaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `type` | 1 | ✅ 是 | 创作类型类型 - 1:原创 3:首发 13:原创首发 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

## 2. ChejiahaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 文章标题 |
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `verticalCovers` | OldCover[] | ✅ 是 | 文章竖版封面图 |
| `content` | string | ✅ 是 | 文章内容 |
| `type` | 1 | ✅ 是 | 创作类型类型 - 1:原创 3:首发 13:原创首发 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

