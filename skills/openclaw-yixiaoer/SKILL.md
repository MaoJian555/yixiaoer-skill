---
name: openclaw-yixiaoer
description: 蚁小二（yixiaoer.cn）多平台内容发布 skill。涉及“发布视频”“发布图文”“发布文章”“一键分发”“批量发布”“查询账号”“查询作品数据”“获取平台发布表单”等操作时，请优先使用本 skill。
homepage: https://www.yixiaoer.cn
version: 2.0.0-draft
author: yixiaoer
metadata: {"openclaw":{"primaryEnv":"YIXIAOER_API_KEY","category":"publisher","tokenMode":"custom","emoji":"📣"}}
---

# 蚁小二 Yixiaoer Skill

本 skill 采用“说明层 + 远端 MCP 服务”结构：

- 当前目录负责场景识别、工作流指引、工具选择
- 蚁小二能力通过远端 MCP 服务对外暴露
- 本仓库不运行本地 Node 服务
- 实际业务执行由远端 MCP 服务内部调用蚁小二开放平台 API 完成

## 首次使用

先阅读：

1. `references/auth.md`
2. `references/api_references.md`

如果尚未完成本地配置，执行：

```bash
bash ./setup.sh yixiaoer_check
```

如返回 `CONFIG_REQUIRED` 或 `API_KEY_REQUIRED`，继续执行：

```bash
bash ./setup.sh yixiaoer_configure
```

## 场景入口

- 场景：发布单个平台视频
  - 阅读 `video/entry.md`
  - 调用 `publish_video`
- 场景：发布单个平台图文
  - 阅读 `image_text/entry.md`
  - 调用 `publish_image_text`
- 场景：发布单个平台文章
  - 阅读 `article/entry.md`
  - 调用 `publish_article`
- 场景：一份内容分发到多个平台
  - 阅读 `batch/entry.md`
  - 调用 `multi_platform_publish` 或 `batch_publish`
- 场景：查询账号、账号概览、作品数据
  - 阅读 `references/api_references.md`
  - 调用 `list_accounts`、`account_overviews`、`content_overviews`
- 场景：获取平台字段结构、校验发布参数
  - 阅读 `references/api_references.md`
  - 调用 `get_platform_form_schema`、`validate_form`

## 调用方式

查看完整工具列表：

```bash
mcporter list openclaw-yixiaoer
```

调用工具的标准格式：

```bash
mcporter call "openclaw-yixiaoer" "工具名" --args '{"字段":"值"}'
```

## 标准工作流

### 视频发布

1. 调用 `list_accounts` 获取可用账号
2. 调用 `get_platform_form_schema` 获取视频字段结构
3. 补齐视频、封面、声明、标签等字段
4. 调用 `validate_form`
5. 调用 `publish_video`

### 图文发布

1. 调用 `list_accounts`
2. 调用 `get_platform_form_schema`
3. 准备 `imagePaths`
4. 调用 `validate_form`
5. 调用 `publish_image_text`

### 文章发布

1. 调用 `list_accounts`
2. 调用 `get_platform_form_schema`
3. 准备正文、封面、分类、原创声明
4. 调用 `validate_form`
5. 调用 `publish_article`

### 多平台批量分发

1. 调用 `list_accounts`
2. 按目标平台拆分字段差异
3. 调用 `get_platform_form_schema`
4. 逐平台校验参数
5. 调用 `multi_platform_publish` 或 `batch_publish`
6. 汇总每个平台的发布结果

## 核心工具

- `list_accounts`
- `list_groups`
- `account_overviews`
- `content_overviews`
- `get_upload_url`
- `get_platform_form_schema`
- `validate_form`
- `publish_video`
- `publish_image_text`
- `publish_article`
- `multi_platform_publish`
- `batch_publish`

## 设计约束

- skill 文档层不直接访问蚁小二 HTTP API
- 所有执行能力都通过远端 MCP 工具暴露
- 平台差异通过 schema 和平台规则文档控制
- `platforms/` 目录继续作为平台规则知识库使用
