# KuaiShou 平台发布字段

> 来源: `kuaishou.dto.ts`

## 1. KuaiShouVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 快手标题 |
| `description` | string | ❌ 否 | 快手描述 |
| `declaration` | number | ❌ 否 | '快手视频声明 内容为ai生成 -1:内容为ai生成 2:演绎情节 |
| `location` | PlatformDataItem | ❌ 否 | 快手视频位置 |
| `visibleType` | 0 | ❌ 否 | 可见类型0:公开1:私密3:好友可见 |
| `scheduledTime` | number | ❌ 否 | 快手视频定时发布时间 |
| `shopping_cart` | object | ❌ 否 | 关联商品 |
| `collection` | Category | ❌ 否 | 合集信息 |
| `mini_app` | object | ❌ 否 | 挂载小程序 购物车和小程序互斥 |
| `nearby_show` | boolean | ❌ 否 | '是否同城展示 |
| `allow_same_frame` | boolean | ❌ 否 | '是否允许同框 |
| `allow_download` | boolean | ❌ 否 | '是否允许下载 |

## 2. KuaiShouDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `images` | OldImage[] | ✅ 是 | 图片 |
| `location` | PlatformDataItem | ❌ 否 | 快手位置 |
| `music` | PlatformDataItem | ❌ 否 | 快手音乐 |
| `scheduledTime` | number | ❌ 否 | 快手定时发布时间 |
| `collection` | Category | ❌ 否 | 合集信息 |
| `visibleType` | 0 | ✅ 是 | 可见类型0:公开1:私密3:好友可见 |

