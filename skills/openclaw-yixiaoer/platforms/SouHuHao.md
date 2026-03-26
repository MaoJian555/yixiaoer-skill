# SouHuHao 平台发布字段

> 来源: `souhuhao.dto.ts`

## 1. SouHuHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `declaration` | number | ✅ 是 | 视频原创类型信息来源 - 0:无特别声明 1引用申明2自行拍摄3包含AI创作内容4包含虚构创作 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |

## 2. SouHuHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `desc` | string | ✅ 是 | 文章描述 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

