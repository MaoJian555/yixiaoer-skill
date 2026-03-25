# CSDN 平台发布字段

> 来源: `csdn.dto.ts`

## 1. CSDNArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `covers` | OldCover[] | ✅ 是 | 文章封面 |
| `title` | string | ✅ 是 | 文章标题 |
| `content` | string | ✅ 是 | 文章内容 |
| `desc` | string | ✅ 是 | 文章描述 |
| `tags` | string[] | ✅ 是 | 标签 |
| `type` | 1 | ✅ 是 | '创作类型 |
| `contentSourceUrl` | string | ❌ 否 | 原文链接，当创作类型为转载时必须填写 |
| `declaration` | number | ❌ 否 | '0:无声明 - 1:不分内容由AI辅助生成 2:内容来源网络 |
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |

