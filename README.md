# openclaw 蚁小二发布插件

用于在 OpenClaw 中通过蚁小二完成多平台内容发布。当前仓库保留一套主发布流程：`upload_media -> create/update draft -> requirements -> answers -> preview -> publish`，并补充只读的分类查询工具。

## 当前执行结构

当前实现可以理解为下面这条调用链：

```text
Skill 约束模型如何用插件
  -> Plugin 向 OpenClaw 注册一组 draft-based tools
  -> tools 调用内部 publish 编排层
  -> 编排层再调用蚁小二 API
```

对应职责如下：

- `Skill` 只负责提示模型遵循草稿协议，不负责运行时注册和执行
- `Plugin` 负责读取配置并向 OpenClaw 注册工具
- `src/openclaw-tools/` 是对外工具边界，暴露稳定的 draft-based tools
- `src/publish/` 负责账号解析、字段协商、答案校验、预览和发布物化
- `src/api/client.ts` 负责最终调用蚁小二 API

## 前置条件

1. 注册蚁小二账号，并在后台绑定目标平台账号
2. 在插件配置中填写 `apiKey`
3. 发布前确认相关账号已登录且具备对应平台权限

## 安装与构建

```bash
npm install
npm run build
```

运行环境要求：

- Node.js `>=22.14.0`
- OpenClaw `>=2026.3.13`
- 蚁小二可用 `apiKey`

## OpenClaw 插件接入说明

- 插件入口使用 OpenClaw 官方 `definePluginEntry`
- 发布相关工具按 `optional` 方式注册，避免默认暴露带副作用的上传与发布能力
- 在 OpenClaw 中使用前，需要把插件 id `openclaw-yixiaoer` 或对应工具名加入 `tools.allow`

### 安装插件

```bash
openclaw plugins install @yixiaoermail/openclaw-yixiaoer
```

### 最小配置示例

```json5
{
  plugins: {
    entries: {
      "openclaw-yixiaoer": {
        apiKey: "YOUR_YIXIAOER_API_KEY"
      }
    }
  },
  tools: {
    allow: ["openclaw-yixiaoer"]
  }
}
```

说明：

- `tools.allow` 写插件 id `openclaw-yixiaoer` 时，会一次性允许该插件注册的全部 optional 工具
- 如果只想放开部分能力，也可以只允许单个工具名，例如 `upload_media`、`preview_publish_draft`

### 按工具名精细放开示例

```json5
{
  tools: {
    allow: [
      "upload_media",
      "get_platform_account_categories",
      "create_publish_draft",
      "get_publish_requirements",
      "submit_publish_answers",
      "preview_publish_draft",
      "publish_draft"
    ]
  }
}
```

## 当前目录

- `src/index.ts` 插件入口
- `src/openclaw-tools/` OpenClaw 工具注册，内部拆分为 schema、工具定义、注册入口
- `src/publish/` 内部 publish 编排层，负责草稿驱动发布流程
- `src/api/` 蚁小二 API 客户端
- `src/config/` 平台规则与表单 schema
- `src/schema/` OpenClaw 参数 schema 转换
- `skills/openclaw-yixiaoer/tools.md` Prompt 参考文档

## 暴露的工具

- `upload_media`
- `get_platform_account_categories`
- `create_publish_draft`
- `update_publish_draft`
- `get_publish_requirements`
- `submit_publish_answers`
- `preview_publish_draft`
- `publish_draft`

## 标准流程

1. 先用 `upload_media` 把本地文件或远程 URL 变成可复用素材 `key`
2. 用 `create_publish_draft` 建立统一草稿，并显式传入 `platformAccountIds`
3. 用 `get_publish_requirements` 获取各平台仍需补齐的字段
4. 必要时用 `submit_publish_answers` 回填平台答案
5. 用 `preview_publish_draft` 确认最终预览
6. 用户确认后调用 `publish_draft`

如果内容、平台、账号或素材发生变化，用 `update_publish_draft` 更新后重新拉取 requirements。

如需单独为某个账号查询 `category` 候选值，可调用 `get_platform_account_categories`，并传入 `platformAccountId` 与 `publishType`。返回结果同时包含树形分类和可直接提交给发布字段的扁平数组；若存在二级分类，会生成 `[父分类, 子分类]` 这样的值。

## 草稿字段

- `title` 可选标题
- `body` 正文内容
- `media[]` 已上传素材列表
- `tags[]` 话题标签
- `scheduleAt` 定时发布时间戳
- `platforms[]` 目标平台列表
- `platformAccountIds` 平台到账号 ID 的映射，当前为必填；值既可以是单个账号 ID，也可以是同平台多个账号 ID 组成的数组
- `publishType` 可选内容类型
- `publishChannel` / `clientId` 发布通道信息

平台专属字段不再允许直接手写底层 `contentPublishForm`。所有平台差异都通过 `get_publish_requirements` 与 `submit_publish_answers` 协商完成。若同一平台存在多个目标账号，`get_publish_requirements` 会为每个账号返回单独的 `targetKey`，后续提交答案时请使用 `targetKey` 或对应的 `platformAccountId`。底层 `contentPublishForm` 仅在 `src/publish/` 内部物化后用于最终提交。

## 设计原则

- 只保留草稿协议，不再支持旧的自由态发布入口
- 草稿只接受稳定的跨平台字段
- 平台字段必须先协商，再预览，再发布
- 未接入的字段能力会明确返回限制说明
- 预览和正式发布都基于同一份已校验草稿

## 已知限制

- `location` 等动态字段当前只会返回限制说明，暂未开放直接填写
- 当前没有账号列表查询接口，创建草稿时必须通过 `platformAccountIds` 为每个平台显式指定账号 ID；同平台多账号时请传账号 ID 数组
- `group`、`groupShopping` 等分组字段当前没有接口支持，只会返回限制说明
- 发布草稿是进程内短生命周期状态，进程重启后需要重新建立

## 验证

```bash
npm run verify
```
