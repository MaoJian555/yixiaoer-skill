# openclaw 蚁小二发布插件

用于在 OpenClaw 中通过蚁小二完成多平台内容发布。当前仓库只保留一套流程：`upload_media -> create/update draft -> requirements -> answers -> preview -> publish`。

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
- OpenClaw `>=2026.3.22`
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
- `src/publish/` 草稿驱动发布流程
- `src/api/` 蚁小二 API 客户端
- `src/config/` 平台规则与表单 schema
- `src/schema/` OpenClaw 参数 schema 转换
- `skills/openclaw-yixiaoer/tools.md` Prompt 参考文档

## 暴露的工具

- `upload_media`
- `create_publish_draft`
- `update_publish_draft`
- `get_publish_requirements`
- `submit_publish_answers`
- `preview_publish_draft`
- `publish_draft`

## 标准流程

1. 先用 `upload_media` 把本地文件或远程 URL 变成可复用素材 `key`
2. 用 `create_publish_draft` 建立统一草稿
3. 用 `get_publish_requirements` 获取各平台仍需补齐的字段
4. 必要时用 `submit_publish_answers` 回填平台答案
5. 用 `preview_publish_draft` 确认最终预览
6. 用户确认后调用 `publish_draft`

如果内容、平台、账号或素材发生变化，用 `update_publish_draft` 更新后重新拉取 requirements。

## 草稿字段

- `title` 可选标题
- `body` 正文内容
- `media[]` 已上传素材列表
- `tags[]` 话题标签
- `scheduleAt` 定时发布时间戳
- `platforms[]` 目标平台列表
- `platformAccountIds` 平台到账号 ID 的映射
- `publishType` 可选内容类型
- `publishChannel` / `clientId` 发布通道信息

平台专属字段不再允许直接手写底层 `contentPublishForm`。所有平台差异都通过 `get_publish_requirements` 与 `submit_publish_answers` 协商完成。

## 设计原则

- 只保留草稿协议，不再支持旧的自由态发布入口
- 草稿只接受稳定的跨平台字段
- 平台字段必须先协商，再预览，再发布
- 未接入的字段能力会明确返回限制说明
- 预览和正式发布都基于同一份已校验草稿

## 已知限制

- `location` 等动态字段当前只会返回限制说明，暂未开放直接填写
- 若同平台存在多个已登录账号，必须通过 `platformAccountIds` 明确指定
- 发布草稿是进程内短生命周期状态，进程重启后需要重新建立

## 验证

```bash
npm run verify
```
