# WangYiHao 平台发布字段

> 来源: `wangyihao.dto.ts`

## 1. WangYiHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `declaration` | number | ❌ 否 | 视频声明 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |
| `type` | number | ❌ 否 | 原创 - 默认不勾选0:不勾选1:勾选原创 |

## 2. WangYiHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `declaration` | number | ❌ 否 | '创作申明 - 1:内容由AI生成2:个人原创 |
| `type` | number | ❌ 否 | 原创 - 默认不勾选0:不勾选1:勾选原创 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

