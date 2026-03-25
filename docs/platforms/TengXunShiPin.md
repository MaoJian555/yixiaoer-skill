# TengXunShiPin 平台发布字段

> 来源: `tengxunshipin.dto.ts`

## 1. TengXunShiPinVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `tags` | string[] | ❌ 否 | 视频标签 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |
| `declaration` | number | ✅ 是 | '视频原创类型腾讯视频申明 - 1:内容由AI生成2:剧情演绎 |

