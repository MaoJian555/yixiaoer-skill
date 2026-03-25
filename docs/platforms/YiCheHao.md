# YiCheHao 平台发布字段

> 来源: `yichehao.dto.ts`

## 1. YiCheHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `description` | string | ✅ 是 | 描述 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |

## 2. YiCheHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `verticalCovers` | OldCover[] | ✅ 是 | 文章竖版封面图 |
| `declaration` | number | ❌ 否 | 创作申明 - 0:不申明 1:个人观点，仅供参考 2:内容来源于网络 3:AI生成 4:引用站内 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `allowForward` | boolean | ❌ 否 | 允许转发 |
| `allowAbstract` | boolean | ❌ 否 | 允许生成摘要 |

