# 蚁小二 MCP 鉴权与配置

## 第一步：检查本地状态

```bash
bash ./setup.sh yixiaoer_check
```

返回值说明：

- `READY`
  - 已配置 `mcporter` 且检测到 `YIXIAOER_API_KEY`
  - 可以直接执行用户任务
- `CONFIG_REQUIRED`
  - 还未将 `openclaw-yixiaoer` MCP 服务注册到 `mcporter`
- `API_KEY_REQUIRED`
  - 未检测到 `YIXIAOER_API_KEY`
- `ERROR:mcporter_not_found`
  - 本机缺少 `mcporter`

## 第二步：写入 MCP 配置

确保已设置环境变量：

```bash
export YIXIAOER_API_KEY="your_api_key"
export YIXIAOER_MCP_URL="http://127.0.0.1:3737/mcp"
```

然后执行：

```bash
bash ./setup.sh yixiaoer_configure
```

脚本内部会执行：

```bash
mcporter config add openclaw-yixiaoer "http://127.0.0.1:3737/mcp" \
  --header "Authorization=Bearer $YIXIAOER_API_KEY" \
  --transport http \
  --scope home
```

## 第三步：验证

```bash
mcporter list openclaw-yixiaoer
```

若能看到工具列表，说明配置成功。
