# yixiaoer-skill

蚁小二多平台发布的纯 skill 仓库。

这个仓库不再内置本地 Node 服务，也不再承担 MCP 服务实现，定位与腾讯文档 skill 类似：

`skills/openclaw-yixiaoer -> setup.sh -> mcporter -> 远端 MCP 服务 -> 蚁小二 HTTP API`

## 设计目标

- 本地只保留 skill 说明层
- 通过 `setup.sh` 完成配置与接入
- 通过 `mcporter` 调用远端 MCP 服务
- 将平台规则、表单知识、发布流程文档集中沉淀在 skill 目录

## 仓库结构

```text
yixiaoer-skill/
├── skills/
│   └── openclaw-yixiaoer/
│       ├── SKILL.md
│       ├── setup.sh
│       ├── _meta.json
│       ├── references/
│       │   ├── auth.md
│       │   ├── api_references.md
│       │   └── publish_references.md
│       ├── video/
│       │   └── entry.md
│       ├── image_text/
│       │   └── entry.md
│       ├── article/
│       │   └── entry.md
│       ├── batch/
│       │   └── entry.md
│       ├── platforms/
│       └── PLATFORM_FORMS.md
├── scripts/
└── llms.txt
```

## 工作方式

1. 进入 `skills/openclaw-yixiaoer`
2. 执行 `bash ./setup.sh yixiaoer_check`
3. 如返回 `CONFIG_REQUIRED` 或 `API_KEY_REQUIRED`，执行 `bash ./setup.sh yixiaoer_configure`
4. 通过 `mcporter list openclaw-yixiaoer` 查看可用工具
5. 通过 `mcporter call "openclaw-yixiaoer" "工具名" --args '{...}'` 调用远端 MCP 服务

## 环境变量

- `YIXIAOER_API_KEY`
  - 蚁小二 API Key
- `YIXIAOER_MCP_URL`
  - 远端 MCP HTTP 服务地址
  - 默认值为 `http://127.0.0.1:3737/mcp`

## skill 文档入口

- [SKILL.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/SKILL.md)
  - skill 总入口，定义场景和调用方式
- [auth.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/references/auth.md)
  - 配置与鉴权说明
- [api_references.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/references/api_references.md)
  - 工具调用格式与工作流参考
- [publish_references.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/references/publish_references.md)
  - 发布任务工作流

## 场景入口

- [video/entry.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/video/entry.md)
  - 单平台视频发布
- [image_text/entry.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/image_text/entry.md)
  - 单平台图文发布
- [article/entry.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/article/entry.md)
  - 单平台文章发布
- [batch/entry.md](C:/work/yixiaoer/yixiaoer-skill/skills/openclaw-yixiaoer/batch/entry.md)
  - 多平台批量分发

## 当前职责边界

本仓库负责：

- skill 入口文档
- 平台规则沉淀
- 表单知识沉淀
- 本地接入脚本

本仓库不负责：

- 远端 MCP 服务实现
- 蚁小二 API 具体执行逻辑
- 本地 Node 常驻服务

## 远端服务要求

远端 `openclaw-yixiaoer` MCP 服务建议至少提供以下工具：

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

## 说明

- 如果你要让这个 skill 真正可用，关键前提是先部署好远端 MCP HTTP 服务
- 本地 `setup.sh` 只是将服务地址注册到 `mcporter`
- 平台差异说明仍以 `platforms/` 和 `PLATFORM_FORMS.md` 为准
