# TouTiaoHao 平台发布字段

> 来源: `toutiaohao.dto.ts`

## 1. TouTiaoHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `declaration` | number | ❌ 否 | '视频原创类型1:自行拍摄2:取自站外3:AI生成6:虚构演绎 |
| `scheduledTime` | number | ❌ 否 | 视频定时发布时间 |

## 2. TouTiaoHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `isFirst` | boolean | ❌ 否 | 头条首发 - 是否在头条首发，可选字段 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `advertisement` | number | ✅ 是 | 广告投放赚取收益 |
| `declaration` | number | ❌ 否 | '创作类型1:自行拍摄2:取自站外3:AI生成6:虚构演绎 |

## 3. TouTiaoHaoDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `images` | OldImage[] | ✅ 是 | 图片 |
| `declaration` | number | ❌ 否 | '创作类型 1:自行拍摄 2:取自站外 3:AI生成 6:虚构演绎 |
| `pubType` | number | ✅ 是 | 发布类型 0:草稿 1:直接发布 |

