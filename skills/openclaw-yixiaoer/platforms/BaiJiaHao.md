# BaiJiaHao 平台发布字段

> 来源: `baijiahao.dto.ts`

## 1. BaiJiaHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题字段，必填 |
| `description` | string | ✅ 是 | 描述字段，必填 |
| `tags` | string[] | ✅ 是 | 标签字段，必填 |
| `declaration` | number | ✅ 是 | 声明字段，百家号申明 - 0:不声明 1:内容由AI生成 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段，选填 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段，选填 |
| `collection` | object | ❌ 否 | 合集信息 |
| `activity` | object | ❌ 否 | 活动 |

## 2. BaiJiaHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `category` | Category[] | ✅ 是 | 文章分类 |
| `declaration` | number | ❌ 否 | 内容声明 - 0:不声明 1:内容由AI生成 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `activity` | object | ❌ 否 | 征文活动数据，来源于获取活动接口 |

## 3. BaiJiaHaoDynamicForm (图文/动态)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 标题 |
| `cover` | OldCover | ✅ 是 | 封面 |
| `location` | PlatformDataItem | ❌ 否 | 位置字段 |
| `declaration` | number | ✅ 是 | 创作声明 - 0:不声明 1:内容由AI生成 |
| `scheduledTime` | number | ❌ 否 | 定时发布字段 |

