# KuaiChuanHao 平台发布字段

> 来源: `kuaichuanhao.dto.ts`

## 1. KuaiChuanHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `tags` | string[] | ❌ 否 | 标签 |
| `type` | 0 | ✅ 是 | 创作类型类型 - 0:不申明 1:申明原创 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

