# 工具定义文档

本文档定义了蚁小二多平台发布插件的所有工具。每个工具包含名称、描述和参数 schema。

---

## 1. 核心发布工具

### multi_platform_publish

**描述**: 【核心能力】一键发布内容到多个平台。支持视频、图文、文章三种类型，批量执行并返回各平台独立状态。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "标题（必填，最大50字）"
    },
    "description": {
      "type": "string",
      "description": "描述/正文内容（必填，最大2000字）"
    },
    "publishType": {
      "type": "string",
      "enum": ["video", "imageText", "article"],
      "description": "内容类型：video=视频, imageText=图文, article=文章"
    },
    "platforms": {
      "type": "array",
      "items": { "type": "string" },
      "description": "目标平台列表，如 ['抖音', '小红书', 'B站']"
    },
    "videoPath": {
      "type": "string",
      "description": "视频URL或本地路径（与 videoKey 二选一）"
    },
    "videoKey": {
      "type": "string",
      "description": "【优化】视频 OSS Key，已有视频时直接使用"
    },
    "imagePaths": {
      "type": "array",
      "items": { "type": "string" },
      "description": "图片URL列表（图文类型必填）"
    },
    "coverPath": {
      "type": "string",
      "description": "封面图片URL或路径"
    },
    "isDraft": {
      "type": "boolean",
      "default": false,
      "description": "是否保存为草稿"
    },
    "scheduledTime": {
      "type": "number",
      "description": "定时发布时间戳（毫秒）"
    },
    "platformExtra": {
      "type": "object",
      "additionalProperties": true,
      "description": "平台特定字段，如声明类型、分类、标签等"
    }
  },
  "required": ["title", "description", "publishType", "platforms"]
}
```

**执行方法**: `service.publishMultiPlatform(params)`

---

### publish_video

**描述**: 发布视频到指定平台。支持抖音、快手、小红书、视频号、B站等28+平台。【新增】支持 videoKey/coverKey 直接使用已上传资源。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "目标平台名称，如 '抖音'、'小红书'"
    },
    "accountName": {
      "type": "string",
      "description": "账号名称关键字（用于匹配多账号）"
    },
    "title": {
      "type": "string",
      "description": "视频标题"
    },
    "description": {
      "type": "string",
      "description": "视频描述"
    },
    "videoPath": {
      "type": "string",
      "description": "视频URL或本地路径（与 videoKey 二选一）"
    },
    "videoKey": {
      "type": "string",
      "description": "【优化】视频 OSS Key，已有视频时直接使用，避免重复上传"
    },
    "coverPath": {
      "type": "string",
      "description": "封面图片URL或路径（与 coverKey 二选一）"
    },
    "coverKey": {
      "type": "string",
      "description": "【优化】封面 OSS Key，已有封面时直接使用"
    },
    "autoExtractCover": {
      "type": "boolean",
      "default": true,
      "description": "【优化】未提供封面时自动从视频提取（需要 ffmpeg）"
    },
    "isDraft": {
      "type": "boolean",
      "default": false
    },
    "scheduledTime": {
      "type": "number"
    },
    "declaration": {
      "type": "number",
      "description": "创作声明类型"
    },
    "category": {
      "type": "any",
      "description": "分类信息"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "标签列表"
    }
  },
  "required": ["platform", "title", "description"]
}
```

**执行方法**: `service.publishVideo(params)`

---

### publish_image_text

**描述**: 发布图文内容到指定平台。支持抖音、快手、小红书、视频号、微博等9个平台。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "目标平台名称"
    },
    "accountName": {
      "type": "string",
      "description": "账号名称关键字"
    },
    "title": {
      "type": "string",
      "description": "标题"
    },
    "description": {
      "type": "string",
      "description": "正文内容"
    },
    "imagePaths": {
      "type": "array",
      "items": { "type": "string" },
      "description": "图片URL列表"
    },
    "isDraft": {
      "type": "boolean",
      "default": false
    },
    "scheduledTime": {
      "type": "number"
    },
    "location": {
      "type": "any",
      "description": "位置信息"
    },
    "music": {
      "type": "any",
      "description": "音乐信息"
    }
  },
  "required": ["platform", "title", "description", "imagePaths"]
}
```

**执行方法**: `service.publishImageText(params)`

---

### publish_article

**描述**: 发布文章到指定平台。支持微信公众号、百家号、头条号、知乎、微博等20+平台。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "目标平台名称"
    },
    "accountName": {
      "type": "string",
      "description": "账号名称关键字"
    },
    "title": {
      "type": "string",
      "description": "文章标题"
    },
    "description": {
      "type": "string",
      "description": "文章正文（HTML或纯文本）"
    },
    "coverPath": {
      "type": "string",
      "description": "封面图片"
    },
    "isDraft": {
      "type": "boolean",
      "default": false
    },
    "scheduledTime": {
      "type": "number"
    },
    "category": {
      "type": "any",
      "description": "分类"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "isOriginal": {
      "type": "boolean",
      "description": "是否原创"
    }
  },
  "required": ["platform", "title", "description"]
}
```

**执行方法**: `service.publishArticle(params)`

---

## 2. 账号管理工具

### list_accounts

**描述**: 获取蚁小二已绑定的账号列表。返回所有登录状态正常的账号信息。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "平台名称筛选"
    },
    "loginStatus": {
      "type": "number",
      "default": 1,
      "description": "登录状态：1=正常"
    },
    "page": {
      "type": "number",
      "default": 1
    },
    "size": {
      "type": "number",
      "default": 50
    }
  }
}
```

**执行方法**: `service.listAccounts(params)`

---

### account_overviews

**描述**: 获取账号数据概览，包括粉丝数、作品数等统计信息。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "平台名称（必填）"
    },
    "page": {
      "type": "number",
      "default": 1
    },
    "size": {
      "type": "number",
      "default": 20
    },
    "name": {
      "type": "string",
      "description": "账号名称筛选"
    },
    "group": {
      "type": "string",
      "description": "分组筛选"
    }
  },
  "required": ["platform"]
}
```

**执行方法**: `service.getAccountOverviews(params)`

---

### list_groups

**描述**: 获取分组列表。通过分组可以查出分组里面的账号信息。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "分组名称筛选"
    },
    "onlySelf": {
      "type": "boolean",
      "description": "仅查看自己创建的分组"
    },
    "page": {
      "type": "number",
      "default": 1
    },
    "size": {
      "type": "number",
      "default": 10
    },
    "visibleScope": {
      "type": "string",
      "enum": ["all", "specific"],
      "description": "可见范围: all=所有用户可见, specific=指定用户可见"
    }
  }
}
```

**执行方法**: `service.listGroups(params)`

---

## 3. 数据查询工具

### content_overviews

**描述**: 查询已发布作品的数据列表，支持多维度筛选。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platformAccountId": {
      "type": "string",
      "description": "平台账号ID"
    },
    "platform": {
      "type": "string",
      "description": "平台名称"
    },
    "type": {
      "type": "string",
      "description": "内容类型：all/video/miniVideo/dynamic/article"
    },
    "title": {
      "type": "string",
      "description": "标题关键字"
    },
    "publishStartTime": {
      "type": "number",
      "description": "发布开始时间戳"
    },
    "publishEndTime": {
      "type": "number",
      "description": "发布结束时间戳"
    },
    "page": {
      "type": "number",
      "default": 1
    },
    "size": {
      "type": "number",
      "default": 20
    }
  }
}
```

**执行方法**: `service.getContentOverviews(params)`

---

## 4. 辅助工具

### upload_url

**描述**: 获取素材上传地址。本地文件需先调用此接口获取上传Key后再发布。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "fileName": {
      "type": "string",
      "description": "文件名"
    },
    "fileSize": {
      "type": "number",
      "description": "文件大小（字节）"
    },
    "contentType": {
      "type": "string",
      "description": "内容类型"
    }
  },
  "required": ["fileName", "fileSize"]
}
```

**执行方法**: `service.getUploadUrl(params)`

---

### get_publish_preset

**描述**: 获取平台发布预设数据，包括分类、话题、标签等选项。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platformAccountId": {
      "type": "string",
      "description": "平台账号ID"
    }
  },
  "required": ["platformAccountId"]
}
```

**执行方法**: `service.getPublishPreset(params)`

---

### get_platform_form_schema

**描述**: 获取指定平台的发布表单结构，包括支持的字段、字段说明和示例。用于了解如何组装发布数据。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "平台名称，如 '抖音'、'小红书'、'B站'"
    },
    "publishType": {
      "type": "string",
      "enum": ["video", "imageText", "article"],
      "description": "内容类型，不传则返回所有类型支持的字段"
    }
  },
  "required": ["platform"]
}
```

**执行方法**: `service.getPlatformFormSchema(params)`

---

### validate_form

**描述**: 验证发布表单是否符合平台要求，返回缺失字段和错误信息。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "平台名称"
    },
    "publishType": {
      "type": "string",
      "description": "内容类型"
    },
    "data": {
      "type": "object",
      "additionalProperties": true,
      "description": "表单数据"
    }
  },
  "required": ["platform", "publishType", "data"]
}
```

**执行方法**: `service.validateForm(params)`

---

## 5. 分组发布工具

### batch_publish

**描述**: 批量发布内容到多个平台。一次请求可传多个 accountForms，支持视频、图文、文章类型。

**参数**:
```json
{
  "type": "object",
  "properties": {
    "accountForms": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "platformAccountId": {
            "type": "string",
            "description": "平台账号ID"
          },
          "publishContentId": {
            "type": "string",
            "description": "发布内容ID"
          },
          "coverKey": {
            "type": "string",
            "description": "封面Key（OSS）"
          },
          "cover": {
            "type": "object",
            "properties": {
              "key": { "type": "string" },
              "path": { "type": "string" },
              "width": { "type": "number" },
              "height": { "type": "number" },
              "size": { "type": "number" }
            },
            "description": "封面对象"
          },
          "video": {
            "type": "object",
            "properties": {
              "key": { "type": "string" },
              "path": { "type": "string" },
              "duration": { "type": "number" },
              "width": { "type": "number" },
              "height": { "type": "number" },
              "size": { "type": "number" }
            },
            "description": "视频对象"
          },
          "images": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "key": { "type": "string" },
                "path": { "type": "string" },
                "width": { "type": "number" },
                "height": { "type": "number" },
                "size": { "type": "number" }
              }
            },
            "description": "图片列表"
          },
          "contentPublishForm": {
            "type": "object",
            "additionalProperties": true,
            "description": "平台发布表单数据"
          }
        }
      },
      "description": "账号表单列表，可传多个账号"
    },
    "platforms": {
      "type": "array",
      "items": { "type": "string" },
      "description": "目标平台列表，如 ['抖音', '小红书']"
    },
    "publishType": {
      "type": "string",
      "enum": ["video", "imageText", "article"],
      "description": "内容类型：video=视频, imageText=图文, article=文章"
    },
    "publishChannel": {
      "type": "string",
      "enum": ["local", "cloud"],
      "description": "发布渠道：local=本机发布, cloud=云发布"
    },
    "clientId": {
      "type": "string",
      "description": "客户端ID（本机发布时必填）"
    },
    "coverKey": {
      "type": "string",
      "description": "素材coverKey"
    }
  },
  "required": ["accountForms", "platforms", "publishType"]
}
```

**执行方法**: `service.batchPublish(params)`

---

## 工具-执行方法映射

| 工具名称 | 执行方法 |
|---------|---------|
| multi_platform_publish | service.publishMultiPlatform(params) |
| publish_video | service.publishVideo(params) |
| publish_image_text | service.publishImageText(params) |
| publish_article | service.publishArticle(params) |
| list_accounts | service.listAccounts(params) |
| account_overviews | service.getAccountOverviews(params) |
| list_groups | service.listGroups(params) |
| content_overviews | service.getContentOverviews(params) |
| upload_url | service.getUploadUrl(params) |
| get_publish_preset | service.getPublishPreset(params) |
| get_platform_form_schema | service.getPlatformFormSchema(params) |
| validate_form | service.validateForm(params) |
| batch_publish | service.batchPublish(params) |