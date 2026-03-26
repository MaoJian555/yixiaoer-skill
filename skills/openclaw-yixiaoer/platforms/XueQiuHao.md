# XueQiuHao 平台发布字段

> 来源: `xueqiuhao.dto.ts`

## 1. XueQiuHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

