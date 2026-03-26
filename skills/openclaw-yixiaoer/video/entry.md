# 视频发布入口

适用场景：

- 发布视频到单个平台
- 需要处理视频路径、视频 Key、封面、标签、声明等字段

推荐流程：

1. 调用 `list_accounts` 查询目标平台账号
2. 调用 `get_platform_form_schema` 获取视频字段要求
3. 如果参数来自上游任务，先调用 `validate_form`
4. 调用 `publish_video`

说明：

- 如果已有 OSS 资源，优先传 `videoKey` / `coverKey`
- 如果没有封面，可由 MCP 服务内部统一处理自动抽帧逻辑
- 平台差异字段不要硬编码在 skill 文档，统一以下发 schema 为准
