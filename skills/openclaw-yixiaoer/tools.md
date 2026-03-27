# 工具 Prompt 参考

本文档只用于帮助模型理解插件的对话式工作流与工具意图。

- 不是运行时工具注册源
- 不是参数 schema 真源
- 不是执行方法映射真源

运行时工具定义以 [`src/openclaw-tools/index.ts`](../../src/openclaw-tools/index.ts) 为准，平台字段真源以 [`src/config/platform-form-schema.ts`](../../src/config/platform-form-schema.ts) 为准。

当前仓库职责分层：

- `src/openclaw-tools/` 负责对外工具注册
  其中 `schemas.ts` 定义参数结构，`tool-definitions.ts` 定义工具清单，`index.ts` 负责注册
- `src/publish/` 负责草稿、校验、预览与发布执行
- `src/schema/` 负责把 JSON Schema 转成 TypeBox 参数定义

---

## 当前唯一推荐流程

1. `upload_media`
2. `create_publish_draft`
3. `get_publish_requirements`
4. `submit_publish_answers`
5. `preview_publish_draft`
6. `publish_draft`

如果草稿内容、素材、目标平台或账号选择变化，可在第 2 步之后调用 `update_publish_draft`，然后重新获取 requirements。

---

## 工具心智

### `upload_media`

把本地文件路径或远程 URL 标准化为可复用素材 `key`。

- 输入可以是 `localPath` 或 `url`
- 输出必须写回草稿 `media[]`
- 创建草稿后不再接受原始 `localPath` / `url`

### `create_publish_draft`

创建统一草稿，只接收跨平台稳定字段。

常见字段：

- `title`
- `body`
- `media[]`
- `tags[]`
- `scheduleAt`
- `platforms[]`
- `platformAccountIds`
- `publishType`
- `publishChannel`
- `clientId`

### `get_publish_requirements`

读取每个平台仍需补齐的字段、可用预设、受限字段和阻塞项。

- 平台静态字段来自统一 schema
- `category` / `topics` 等尽量走账号预设
- `location` 等未接入能力会明确标成限制，而不是让调用方猜对象结构

### `submit_publish_answers`

按平台提交字段答案。

- 只能提交 requirements 中声明过的字段
- 答案按平台分组
- 必填字段未补齐时，预览和发布都会继续阻塞

### `preview_publish_draft`

基于草稿和答案生成最终发布预览。

- 不会隐式上传素材
- 不会隐式补字段
- 会明确返回剩余缺失项和风险提示

### `publish_draft`

在预览通过且用户确认后正式发布。

- 只接受已完成校验的草稿
- 发布参数由代码层从草稿物化
- 调用方不应手写底层 `contentPublishForm`

---

## Prompt 原则

- 引导用户先上传素材，再建草稿
- 优先使用草稿协议，不回退到旧的自由态发布接口
- 平台专属字段统一通过 requirements / answers 交互，不让模型直接拼平台对象
- 当字段能力未接入时，应明确说明限制，而不是猜测值结构
