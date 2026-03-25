# DouYin 平台发布字段

> 来源: `douyin.dto.ts`

## 1. DouYinVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 抖音视频标题 |
| `description` | string | ✅ 是 | 抖音视频描述 |
| `horizontalCover` | OldCover | ✅ 是 | 抖音视频横板封面 |
| `statement` | StatementType | ❌ 否 | 抖音视频声明 3:内容由AI生成 4:可能引人不适 5:虚构演绎，仅供娱乐 6:危险行为，请勿模仿 |
| `location` | PlatformDataItem | ❌ 否 | 抖音视频位置 |
| `scheduledTime` | number | ❌ 否 | 抖音视频定时发布时间 |
| `shoppingCart` | ShoppingCartDTO[] | ❌ 否 | 购物车列表 |
| `groupShopping` | GroupShoppingDTO | ❌ 否 | 团购信息 |
| `collection` | Category | ❌ 否 | 合集信息 |
| `sub_collection` | Category | ❌ 否 | 合集选集 |
| `sync_apps` | Category[] | ❌ 否 | 同时发布到的应用 |
| `hot_event` | Category | ❌ 否 | 热点事件 |
| `challenge` | Category | ❌ 否 | 挑战 |
| `allow_save` | number | ❌ 否 | '保存权限 |
| `mini_app` | object | ❌ 否 | 挂载小程序 购物车和小程序互斥 |
| `music` | object | ❌ 否 | 音乐 |
| `cooperation_info` | object | ❌ 否 | 共创信息 |
| `game` | object | ❌ 否 | 游戏 |
| `film` | object | ❌ 否 | 影视演绎 |

## 2. DouYinDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ❌ 否 | 抖音标题 |
| `images` | OldImage[] | ✅ 是 | 图片 |
| `location` | PlatformDataItem | ❌ 否 | 抖音地址/带货地址，来源于获取地址接口列表选项可选发布位置地址 / 带货地址（注意权限）-来源于地址搜索接口选项和用户输入地理位置、购物车、团购、小程序等互斥 |
| `musice` | PlatformDataItem | ❌ 否 | 图文发布的音乐 - 来自音乐搜索接口列表选项 |
| `scheduledTime` | number | ❌ 否 | 抖音定时发布时间 |
| `collection` | Category | ❌ 否 | 合集信息 |
| `sub_collection` | Category | ❌ 否 | 合集选集 |

## 3. DouyinArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `description` | string | ❌ 否 | 描述 |
| `content` | string | ✅ 是 | 正文 |
| `covers` | OldCover[] | ✅ 是 | 封面 |
| `headImage` | OldCover | ❌ 否 | 文章头图 |
| `music` | PlatformDataItem | ❌ 否 | 音乐 |
| `topics` | Category[] | ❌ 否 | 话题列表，最多5个 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `visibleType` | 0 | ✅ 是 | 可见性 0:公开 1:私密 3:好友可见 |

