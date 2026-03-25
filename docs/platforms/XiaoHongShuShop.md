# XiaoHongShuShop 平台发布字段

> 来源: `xiaohongshushop.dto.ts`

## 1. XiaoHongShuShopVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 小红书视频标题 |
| `description` | string | ✅ 是 | 小红书视频描述 |
| `location` | PlatformDataItem | ❌ 否 | 小红书视频位置 |
| `scheduledTime` | number | ❌ 否 | 小红书视频定时发布时间 |
| `shoppingCart` | object[] | ❌ 否 | 关联商品 |

