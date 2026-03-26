# 批量分发入口

适用场景：

- 一份内容分发多个平台
- 一次提交多个发布任务

推荐流程：

1. 调用 `list_accounts`
2. 拆分目标平台列表
3. 分平台读取 `get_platform_form_schema`
4. 逐平台调用 `validate_form`
5. 调用 `multi_platform_publish` 或 `batch_publish`
6. 汇总平台结果并输出成功、失败、待补充字段

说明：

- 多平台批量分发不应假设所有平台字段完全相同
- MCP 服务层应负责标准化结果结构，便于上层汇总
