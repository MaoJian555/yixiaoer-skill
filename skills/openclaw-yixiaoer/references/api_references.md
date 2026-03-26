# 蚁小二 MCP 工具完整参考

本文件定义 `openclaw-yixiaoer` MCP 服务的对外工具、参数结构与推荐工作流。

## 通用说明

统一调用格式：

```bash
mcporter call "openclaw-yixiaoer" "工具名" --args '{"字段":"值"}'
```

统一响应建议：

```json
{
  "success": true,
  "message": "执行结果说明",
  "data": {},
  "trace_id": "optional-trace-id"
}
```

## 账号类工具

### list_accounts

用途：获取已登录的可发布账号。

示例：

```bash
mcporter call "openclaw-yixiaoer" "list_accounts" --args '{"page":1,"size":100,"loginStatus":1}'
```

### account_overviews

用途：查询账号概览数据。

### list_groups

用途：查询账号分组。

## 内容数据类工具

### content_overviews

用途：查询作品数据列表。

## 表单与校验类工具

### get_platform_form_schema

用途：获取某平台、某内容类型的发布字段结构。

示例：

```bash
mcporter call "openclaw-yixiaoer" "get_platform_form_schema" --args '{
  "platform":"小红书",
  "publishType":"imageText"
}'
```

### validate_form

用途：校验发布参数是否合法，避免直接发布时报错。

## 发布类工具

### publish_video

用途：发布视频到单个平台。

最小参数：

```json
{
  "platform": "抖音",
  "title": "视频标题",
  "description": "视频描述",
  "videoPath": "https://example.com/demo.mp4"
}
```

### publish_image_text

用途：发布图文到单个平台。

最小参数：

```json
{
  "platform": "小红书",
  "title": "图文标题",
  "description": "图文正文",
  "imagePaths": [
    "https://example.com/1.jpg",
    "https://example.com/2.jpg"
  ]
}
```

### publish_article

用途：发布文章到单个平台。

最小参数：

```json
{
  "platform": "微信公众号",
  "title": "文章标题",
  "description": "<p>文章正文</p>"
}
```

### multi_platform_publish

用途：将同一份内容分发到多个平台。

### batch_publish

用途：批量提交多个发布任务。

## 推荐工作流

### 单平台发布

1. `list_accounts`
2. `get_platform_form_schema`
3. `validate_form`
4. `publish_video` / `publish_image_text` / `publish_article`

### 多平台分发

1. `list_accounts`
2. `get_platform_form_schema`
3. 按平台整理差异字段
4. `validate_form`
5. `multi_platform_publish`
