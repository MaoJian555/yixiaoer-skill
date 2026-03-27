---
name: openclaw-yixiaoer
description: 蚁小二多平台内容发布 OpenClaw 插件。当前仅保留草稿驱动发布流程，适用于 upload -> draft -> requirements -> answers -> preview -> publish 协议。
license: MIT
metadata:
  author: yixiaoer
  homepage: https://www.yixiaoer.cn
  repository: https://github.com/yixiaoer888/yixiaoer-skill.git
  version: 1.2.0
  tags:
    - yixiaoer
    - openclaw
    - publisher
    - publish-draft
---

# 蚁小二多平台发布 OpenClaw 插件

基于蚁小二开放平台的多平台发布 Skill。当前版本只保留一套新流程，不再暴露旧的自由态发布、账号概览、表单直传等工具。

## 当前工具

- `upload_media`
- `create_publish_draft`
- `update_publish_draft`
- `get_publish_requirements`
- `submit_publish_answers`
- `preview_publish_draft`
- `publish_draft`

## 唯一推荐流程

1. `upload_media`
2. `create_publish_draft`
3. `get_publish_requirements`
4. `submit_publish_answers`
5. `preview_publish_draft`
6. `publish_draft`

如果草稿内容、素材、平台或账号发生变化，先调用 `update_publish_draft`，再重新获取 requirements。

## 使用原则

- 不要让模型直接拼底层 `contentPublishForm`
- 平台专属字段统一通过 requirements / answers 协商
- 草稿里只放稳定跨平台字段
- 本地路径和远程 URL 必须先经 `upload_media` 转换为 `key`
- 未接入的动态字段要明确说明限制，不要猜测值结构

## 当前目录

```text
yixiaoer-skill/
├── src/
│   ├── index.ts
│   ├── api/
│   ├── config/
│   ├── openclaw-tools/
│   ├── publish/
│   └── schema/
├── skills/
│   └── openclaw-yixiaoer/
│       ├── SKILL.md
│       ├── tools.md
│       ├── PLATFORM_FORMS.md
│       └── platforms/
└── tests/
```

## 关键说明

- 运行时工具注册以 `src/openclaw-tools/index.ts` 为准
- 平台字段真源以 `src/config/platform-form-schema.ts` 为准
- 草稿流程实现集中在 `src/publish/`
- 参数 schema 转换集中在 `src/schema/`
- `src/openclaw-tools/` 内部已拆为 `api.ts`、`schemas.ts`、`tool-definitions.ts`、`index.ts`
- `tools.md` 只作为 Prompt 参考，不参与运行时注册

## 验证

```bash
npm run verify
```
