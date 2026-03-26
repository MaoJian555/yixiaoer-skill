# YiDianHao 平台发布字段

> 来源: `yidianhao.dto.ts`

## 1. YiDianHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `description` | string | ✅ 是 | 描述 |
| `tags` | string[] | ✅ 是 | 标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 分类 |
| `declaration` | number | ❌ 否 | 声明 3:内容取材网络4:内容由AI生成5:虚构情节内容 |
| `scheduledTime` | number | ❌ 否 | 定时发布 |
| `type` | number | ✅ 是 | 视频原创类型0:非原创或1:原创 |

## 2. YiDianHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

