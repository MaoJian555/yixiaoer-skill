# 蚁小二全平台分发字段百科 (contentPublishForm)

在调用发布技能时，AI 必须根据 `platformAccountId` 对应的平台，参照下表填充 `contentPublishForm`。

## 1. 视频发布 (Video Forms)

| 平台编码 | 必填字段 (Required) | 可选字段 (Optional) | 特殊说明 |
| :--- | :--- | :--- | :--- |
| **DouYin** | `title`, `description`, `horizontalCover` | `statement`, `location`, `scheduledTime`, `shoppingCart`, `groupShopping`, `collection`, `sub_collection`, `sync_apps`, `hot_event`, `challenge`, `allow_save`, `mini_app`, `music`, `cooperation_info`, `game`, `film` | `horizontalCover` 为横版封面对象 |
| **KuaiShou** | `title`, `description` | `declaration`, `location`, `scheduledTime`, `shopping_cart`, `collection`, `mini_app`, `nearby_show`, `allow_same_frame`, `allow_download` | - |
| **ShiPingHao** | `type` (1非原创, 2原创) | `title`, `short_title`, `description`, `location`, `scheduledTime`, `shoppingCart`, `horizontalCover`, `collection`, `activity` | - |
| **XiaoHongShu** | `title`, `description` | `declaration`, `type`, `location`, `scheduledTime`, `collection`, `group`, `bind_live_info`, `shopping_cart` | - |
| **BiLiBiLi** | `title`, `description`, `tags`, `category`, `declaration`, `type` | `scheduledTime`, `contentSourceUrl`, `collection` | - |
| **BaiJiaHao** | `title`, `description`, `tags`, `declaration` | `location`, `scheduledTime`, `collection`, `activity` | - |
| **ZhiHu** | `title`, `description`, `category` | `topics`, `declaration`, `type`, `scheduledTime` | - |
| **TouTiaoHao** | `title`, `description`, `tags` | `declaration`, `scheduledTime` | - |
| **XiGuaShiPin** | `title`, `description`, `tags` | `declaration`, `scheduledTime` | 参考 TouTiaoHao |
| **XinLangWeiBo** | `title`, `description` | `type`, `location`, `scheduledTime`, `collection` | - |
| **AcFun** | `title`, `category`, `type` | `description`, `tags`, `scheduledTime` | - |
| **AiQiYi** | `title`, `description`, `category`, `type` | `tags`, `declaration`, `scheduledTime` | - |
| **QiEHao** | `title`, `description`, `tags`, `category` | `declaration`, `scheduledTime` | - |
| **WangYiHao** | `title`, `description`, `tags`, `category` | `declaration`, `scheduledTime`, `type` | - |
| **DaYuHao** | `title`, `description`, `tags`, `category`, `type` | `scheduledTime` | - |
| **YiDianHao** | `title`, `description`, `tags`, `category`, `type` | `declaration`, `scheduledTime` | - |
| **SouHuHao** | `title`, `description`, `tags`, `category`, `declaration` | `scheduledTime` | - |
| **SouHuShiPin** | `title` | `description`, `tags`, `declaration` | - |
| **TengXunShiPin**| `title`, `declaration` | `tags`, `scheduledTime` | - |
| **TengXunWeiShi** | `title`, `description` | `scheduledTime` | - |
| **PiPiXia** | - | `description` | 极简模式 |
| **DuoDuoShiPin** | - | `description`, `scheduledTime`, `shopping_cart` | - |
| **MeiPai** | `title` | `description`, `category`, `scheduledTime` | - |
| **MeiYou** | `title` | `scheduledTime` | - |
| **DeWu** | `title`, `description`, `category`, `declaration` | - | - |
| **CheJiaHao** | `title`, `description`, `type` | `scheduledTime` | - |
| **YiCheHao** | `title`, `description` | `scheduledTime` | - |
| **FengWang** | `title`, `description`, `tags`, `category` | `scheduledTime` | - |
| **XiaoHongShuShop**| `title`, `description` | `location`, `scheduledTime`, `shoppingCart` | 商家号专用 |

## 2. 文章发布 (Article Forms)

| 平台编码 | 必填字段 (Required) | 可选字段 (Optional) | 特殊说明 |
| :--- | :--- | :--- | :--- |
| **WeiXinGongZhongHao** | `notifySubscribers` (0/1), `contentList` | `scheduledTime`, `sex`, `province`, `city` | `contentList` 内文章必填: `title`, `content`, `cover`, `createType` |
| **BaiJiaHao** | `title`, `content`, `covers`, `category` | `declaration`, `scheduledTime`, `activity` | - |
| **TouTiaoHao** | `covers`, `title`, `content`, `advertisement` | `isFirst`, `location`, `scheduledTime`, `declaration` | - |
| **ZhiHu** | `covers`, `title`, `content` | `topics`, `scheduledTime`, `declaration` | - |
| **XinLangWeiBo** | `covers`, `title`, `content` | `scheduledTime` | - |
| **BiLiBiLi** | `covers`, `title`, `content` | `tags`, `type`, `category`, `scheduledTime` | - |
| **CSDN** | `covers`, `title`, `content`, `desc`, `tags`, `type` | `contentSourceUrl`, `declaration`, `scheduledTime` | - |
| **AcFun** | `covers`, `title`, `content`, `tags`, `category`, `type` | `desc`, `contentSourceUrl` | - |
| **QiEHao** | `covers`, `title`, `content`, `tags` | `declaration` | - |
| **SouHuHao** | `covers`, `title`, `content`, `desc` | `scheduledTime` | - |
| **WangYiHao** | `covers`, `title`, `content` | `declaration`, `type`, `scheduledTime` | - |
| **DaYuHao** | `covers`, `verticalCovers`, `title`, `content` | `scheduledTime` | 需要竖版封面 |
| **YiDianHao** | `covers`, `title`, `content` | `scheduledTime` | - |
| **KuaiChuanHao** | `covers`, `title`, `content`, `type` | `tags`, `scheduledTime` | - |
| **XueQiuHao** | `covers`, `title`, `content` | `scheduledTime` | - |
| **DouBan** | `title`, `content`, `type`, `tags` | - | - |
| **JianShu** | `title`, `content` | - | - |
| **CheJiaHao** | `title`, `covers`, `verticalCovers`, `content`, `type` | `scheduledTime` | - |
| **YiCheHao** | `covers`, `title`, `content`, `verticalCovers` | `declaration`, `scheduledTime`, `allowForward`, `allowAbstract` | - |
| **DouYin** | `title`, `description` | `content`, `covers`, `headImage`, `music`, `topics`, `scheduledTime` | - |
| **AiQiYi** | `title`, `content` | - | - |

## 3. 图文/动态发布 (ImageText Forms)

| 平台编码 | 必填字段 (Required) | 可选字段 (Optional) | 特殊说明 |
| :--- | :--- | :--- | :--- |
| **DouYin** | `title`, `description`, `images` | `location`, `musice`, `scheduledTime`, `collection`, `sub_collection` | - |
| **KuaiShou** | `description`, `images` | `location`, `music`, `scheduledTime`, `collection` | - |
| **XiaoHongShu** | `title`, `description`, `images` | `location`, `music`, `scheduledTime`, `collection` | - |
| **ShiPingHao** | `title`, `description`, `images` | `location`, `music`, `scheduledTime`, `collection`, `pubType` | - |
| **XinLangWeiBo** | `description`, `images` | `location`, `scheduledTime` | - |
| **BaiJiaHao** | `title`, `description`, `cover`, `declaration` | `location`, `scheduledTime` | 此处 `cover` 为单个封面对象 |
| **ZhiHu** | `title`, `description`, `images` | - | - |
| **TouTiaoHao** | `description`, `images`, `pubType` | `declaration` | `pubType`: 0草稿, 1直发 |

---

## 参数类型说明

1.  **图片/封面对象 (`Cover/OldCover`)**:
    包含 `width`, `height`, `size`, `key`, `path` (或 `pathOrUrl`)。
2.  **分类对象 (`Category`)**:
    包含 `yixiaoerId`, `yixiaoerName` 等。推荐使用 `get-publish-preset` 获取后整体填入。
3.  **定时发布 (`scheduledTime`)**:
    Unix 时间戳（秒或毫秒，根据文档示例通常为 10 位或 13 位，视具体平台而定）。
4.  **申明/类型 (`declaration/type/pubType`)**:
    数值枚举，详见文档或预设接口。

---
**注意**：AI 应先调用 `get-publish-preset` 获取分类。若接口未返回，则参考本手册组装表单。
