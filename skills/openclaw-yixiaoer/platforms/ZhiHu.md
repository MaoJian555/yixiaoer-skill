# ZhiHu 平台发布字段

> 来源: `zhihu.dto.ts`

## 1. ZhiHuVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `topics` | Category[] | ❌ 否 | 话题 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `declaration` | number | ❌ 否 | 视频创作申明 0:不声明 2:图片/视频由AI生成 |
| `type` | number | ❌ 否 | 视频类型 1:原创 2:非原创 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |

## 2. ZhiHuArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `topics` | Category[] | ❌ 否 | 话题 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `declaration` | number | ❌ 否 | 创作申明 0:无申明 1:包含剧透 2:包含医疗建议 3:虚构创作 4:包含理财内容 5:包含AI辅助创作 |

## 3. ZhiHuDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `images` | OldImage[] | ✅ 是 | 图片 |

