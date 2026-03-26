# QiEHao 平台发布字段

> 来源: `qiehao.dto.ts`

## 1. QiEHaoVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `tags` | string[] | ✅ 是 | 视频标签 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `declaration` | number | ❌ 否 | 视频创作申明 0:暂不申明 1:该内容由AI生成 2:个人观点，仅供参考 3:剧情演绎，仅供娱乐 4:取材网络，谨慎甄别 5:旧闻 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

## 2. QiEHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `tags` | string[] | ✅ 是 | 文章标签 |
| `declaration` | number | ❌ 否 | 创作申明 0:暂不申明 1:该内容由AI生成 2:个人观点，仅供参考 3:剧情演绎，仅供娱乐 4:取材网络，谨慎甄别 5:旧闻 |

