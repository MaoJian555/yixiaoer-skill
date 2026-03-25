# DeWu 平台发布字段

> 来源: `dewu.dto.ts`

## 1. DeWuVideoForm (视频)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `title` | string | ✅ 是 | 视频标题 |
| `description` | string | ✅ 是 | 视频描述 |
| `category` | CascadingPlatformDataItem[] | ✅ 是 | 视频分类 |
| `declaration` | number | ✅ 是 | '创作者申明 - 0:不添加自主声明 1:内容由AI生成 2:内容不含营销推广属性 3:内容涉及专业运动 4:剧情演绎 |

