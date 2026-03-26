# WeiXinGongZhongHao 平台发布字段

> 来源: `wxgongzhonghao.dto.ts`

## 1. WxGongZhongHaoArticleForm (文章)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| `scheduledTime` | number | ❌ 否 | 定时发布时间 |
| `notifySubscribers` | 0 | ✅ 是 | 是否群发 - 0:不群发 1:群发 |
| `sex` | 0 | ❌ 否 | '群发性别 |
| `country` | string | ❌ 否 | 群发地区-国家名称，默认全部 |
| `province` | string | ❌ 否 | 群发地区-省份名称 |
| `city` | string | ❌ 否 | 群发地区-城市名称 |
| `contentList` | WxGongZhongHaoContentFrom[] | ❌ 否 | 消息中的文章列表 |

