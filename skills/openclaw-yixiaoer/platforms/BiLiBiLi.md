# BiLiBiLi 平台发布字段

> 来源: `bilibili.dto.ts`

> 分类获取: 优先调用 `get_platform_account_categories`，并根据发布类型传 `publishType=video` 或 `publishType=article`。若返回带二级分类，发布时请传 `[父分类, 子分类]` 这样的数组结构。

## 1. BilibiliVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题字段，必填 |
| `description` | string | ✅ 是 | 描述字段，必填 |
| `tags` | string[] | ✅ 是 | 标签字段，必填 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 分类字段，必填 |
| `declaration` | number | ✅ 是 | '创作者申明 - 0:不申明 1:该视频使用人工智能合成技术 2:视频内含有危险行为 |
| `type` | number | ✅ 是 | 类型字段1:自制 2:转载 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段，选填 |
| `contentSourceUrl` | string | ❌ 否 | '原文url链接 |
| `collection` | object | ❌ 否 | 合集信息 |

## 2. BiLiBiLiArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `tags` | string[] | ❌ 否 | 标签 |
| `type` | number | ❌ 否 | 原创类型1:非原创或2:原创 |
| `category` | Category[] | ❌ 否 | 分类 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
