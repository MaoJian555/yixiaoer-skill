# 图文发布入口

适用场景：

- 发布图文到小红书、微博、抖音、快手、视频号等平台

推荐流程：

1. 调用 `list_accounts`
2. 调用 `get_platform_form_schema`
3. 确认 `imagePaths` 数量、封面、位置、音乐等扩展字段
4. 调用 `validate_form`
5. 调用 `publish_image_text`

说明：

- 图文类平台差异较大，字段组装前必须先读 schema
- 统一由 MCP 服务层完成平台字段转换
