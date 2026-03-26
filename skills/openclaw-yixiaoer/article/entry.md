# 文章发布入口

适用场景：

- 发布公众号文章
- 发布百家号、头条号、知乎、CSDN、简书等文章内容

推荐流程：

1. 调用 `list_accounts`
2. 调用 `get_platform_form_schema`
3. 确认正文格式、封面、分类、标签、原创声明
4. 调用 `validate_form`
5. 调用 `publish_article`

说明：

- 正文格式由 MCP 服务统一转换或透传
- 平台差异字段优先通过 schema 和 platform rules 解决
