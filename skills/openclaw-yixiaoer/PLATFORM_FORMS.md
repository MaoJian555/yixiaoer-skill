# 蚁小二全平台分发字段百科 (contentPublishForm)

本文档用于说明内部 `contentPublishForm` 物化时会涉及的平台字段形态，便于理解 requirements / answers 背后的平台能力。

当前实现的真实调用链是：

```text
Skill 约束模型如何用插件
  -> Plugin 向 OpenClaw 注册一组 draft-based tools
  -> tools 调用内部 publish 编排层
  -> 编排层再调用蚁小二 API
```

因此：

- OpenClaw 对外调用方不应直接手写 `contentPublishForm`
- 模型应优先走 `upload_media -> create/update draft -> requirements -> answers -> preview -> publish`
- 本文档主要作为内部字段参考，而不是对外工具契约

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
    包含 `yixiaoerId`, `yixiaoerName` 等。推荐优先使用 `get_platform_account_categories` 获取后整体填入；若分类带二级结构，发布字段应传扁平数组，例如 `[父分类, 子分类]`。
3.  **定时发布 (`scheduledTime`)**:
    Unix 时间戳（秒或毫秒，根据文档示例通常为 10 位或 13 位，视具体平台而定）。
4.  **申明/类型 (`declaration/type/pubType`)**:
    数值枚举，详见文档或预设接口。

---
**注意**：模型应优先通过 `get_publish_requirements` 理解当前草稿缺失字段，再结合 `get_platform_account_categories` 和账号预设结果补齐答案，而不是直接按本手册手写整份 `contentPublishForm`。
