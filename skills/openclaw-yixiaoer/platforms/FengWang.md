# FengWang 平台发布字段

> 来源: `fengwang.dto.ts`

## 1. FengWangVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |

