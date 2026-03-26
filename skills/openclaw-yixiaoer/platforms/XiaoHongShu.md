# XiaoHongShu 平台发布字段

> 来源: `xiaohongshu.dto.ts`

## 1. XiaoHongShuVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 标题 |
| `description` | string | ❌ 否 | 描述 |
| `declaration` | number | ❌ 否 | '内容类型申明 - 1:虚构演绎 |
| `type` | number | ❌ 否 | 类型字段申明创作类型 1:原创 0:不申明 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |
| `collection` | object | ❌ 否 | 合集信息 |
| `group` | object | ❌ 否 | 群聊信息 |
| `bind_live_info` | object | ❌ 否 | 直播预告信息 |
| `shopping_cart` | object[] | ❌ 否 | 商品信息 |
| `visibleType` | number | ✅ 是 | 可见类型0：公开1：私密3：好友可见 |

## 2. XiaoHongShuDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 标题 |
| `images` | OldImage[] | ✅ 是 | 图片 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `music` | PlatformDataItem | ❌ 否 | 音乐 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |
| `collection` | object | ❌ 否 | 合集信息 |
| `visibleType` | number | ✅ 是 | 可见类型0：公开1：私密3：好友可见 |

