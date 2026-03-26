# ShiPinHao 平台发布字段

> 来源: `shipinghao.dto.ts`

## 1. ShiPingHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 视频标题 |
| `short_title` | string | ❌ 否 | 视频短标题 |
| `location` | PlatformDataItem | ❌ 否 | 视频位置 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |
| `type` | number | ✅ 是 | 视频原创类型1:非原创或2:原创 |
| `shoppingCart` | object | ❌ 否 | 关联商品 |
| `horizontalCover` | OldCover | ❌ 否 | 视频横版封面封面 |
| `collection` | object | ❌ 否 | 合集信息 |
| `activity` | object | ❌ 否 | 活动 |
| `createType` | 1 | ✅ 是 | 创建类型 1:草稿 2:直接发布 |
| `pubType` | 0 | ❌ 否 | 发布类型 0:草稿 1:直接发布 |

## 2. ShiPingHaoDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 标题 |
| `images` | OldImage[] | ✅ 是 | 图片 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `music` | PlatformDataItem | ❌ 否 | 音乐 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |
| `collection` | object | ❌ 否 | 合集信息 |
| `pubType` | number | ❌ 否 | 发布类型 0:草稿 1:直接发布 |

