# Yixiaoer 纯 Skill 接入蓝图

## 目标

将原先“插件式直连接口”的结构，重构为：

`skill 文档层 -> setup.sh -> mcporter -> openclaw-yixiaoer 远端 MCP 服务 -> 蚁小二 HTTP API`

## 不再保留

- 旧插件兼容层
- OpenClaw 插件注册文案
- 插件入口思维方式
- 本地 Node MCP 服务实现

## 保留并复用

- `platforms/` 平台规则知识
- `PLATFORM_FORMS.md` 表单知识
- skill 入口文档、调用工作流、鉴权脚本

## 新的职责边界

### skill 文档层

- 负责识别任务场景
- 指导 agent 选择正确工具
- 给出标准工作流
- 不直接执行业务

### 远端 MCP 服务层

- 对外注册工具
- 统一参数 schema
- 统一返回结构
- 封装蚁小二 API 调用
- 处理平台差异、资源上传、表单校验

## 对外工具建议

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

## 接入顺序

1. 保留并完善 skill 文档层
2. 部署远端 MCP HTTP 服务
3. 在 `setup.sh` 中写入远端地址
4. 用 `mcporter list` / `mcporter call` 验证工具
5. 最后统一返回结构与 trace id
