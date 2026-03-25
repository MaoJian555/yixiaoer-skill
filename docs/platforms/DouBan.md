# DouBan 平台发布字段

> 来源: `douban.dto.ts`

## 1. DouBanArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `type` | 0 | ✅ 是 | 创作类型类型 - 0:不申明 1:申明原创 |
| `tags` | string[] | ✅ 是 | 标签 |

