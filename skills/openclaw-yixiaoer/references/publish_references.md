# 发布工作流参考

本文件给出视频、图文、文章、多平台分发的统一工作流。

## 发布前通用步骤

1. 调用 `list_accounts` 获取目标账号
2. 调用 `get_platform_form_schema` 获取平台字段要求
3. 结合 `platforms/` 目录规则补齐平台差异字段
4. 调用 `validate_form` 执行发布前校验
5. 调用目标发布接口

## 视频发布

- 接口：`publish_video`
- 典型扩展字段：`videoKey`、`coverKey`、`declaration`、`tags`
- 如果没有封面，建议由 MCP 服务统一实现自动抽帧

## 图文发布

- 接口：`publish_image_text`
- 典型扩展字段：`location`、`music`
- 图片数量、顺序、尺寸限制优先以平台 schema 为准

## 文章发布

- 接口：`publish_article`
- 典型扩展字段：`coverPath`、`category`、`tags`、`isOriginal`
- 正文格式透传或由 MCP 服务统一转换

## 多平台分发

- 接口：`multi_platform_publish`、`batch_publish`
- 平台差异字段由服务层标准化拆分
- 返回值建议为逐平台结果数组，便于上层展示成功、失败和待补字段
