# MeiPai 平台发布字段

> 来源: `meipai.dto.ts`

## 1. MeiPaiVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ❌ 否 | 视频描述 |
| `category` | CascadingPlatformDataItem[] | ❌ 否 | 视频分类 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |

