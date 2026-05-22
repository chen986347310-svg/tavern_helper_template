# Chrome 调试端口连接指南

## 一键启动（推荐）

在项目根目录运行：

```powershell
.\start-dev.ps1
```

脚本自动完成：查找 Chrome → 关闭旧进程（交互确认）→ 启动调试模式 → 验证 CDP 端点 → 启动 webpack watch。

**参数：**

| 参数 | 说明 |
|------|------|
| `-ChromeOnly` | 仅启动 Chrome，不启动 webpack watch |
| `-NoKill` | 不关闭现有 Chrome（保留已打开的标签页）|
| `-Port 9333` | 自定义调试端口（默认 9222）|

```powershell
.\start-dev.ps1 -ChromeOnly          # 只开 Chrome
.\start-dev.ps1 -NoKill -Port 9333   # 保留现有 Chrome + 自定义端口
```

## 核心原理

Chrome 默认不启用远程调试端口。MCP `chrome-devtools` 通过 `http://127.0.0.1:9222` 连接 CDP（Chrome DevTools Protocol），需要特定启动参数：

| 参数 | 作用 | 必要性 |
|------|------|--------|
| `--remote-debugging-port=9222` | 启用远程调试端口 | **必须** |
| `--user-data-dir=<path>` | 独立用户数据目录，防止复用已有进程 | **必须** |

**为什么 `--user-data-dir` 是必须的？** 如果 Chrome 已在运行，新实例会复用旧进程，导致调试端口参数被忽略。独立目录强制创建新实例。

## 手动操作

不使用脚本时，手动执行以下步骤：

```powershell
# 1. 关闭现有 Chrome
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. 启动调试模式
Start-Process 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' `
    -ArgumentList '--remote-debugging-port=9222', '--user-data-dir="C:\temp-chrome-debug"'

# 3. 验证（等待 3 秒后）
Invoke-RestMethod http://localhost:9222/json/version
```

## 验证清单

```powershell
# 端口监听
Get-NetTCPConnection -LocalPort 9222 -ErrorAction SilentlyContinue | Where-Object State -eq Listen

# CDP 端点
Invoke-RestMethod http://localhost:9222/json/version

# MCP 连接（在 Codex 中）
# mcp__chrome-devtools__list_pages
```

## 常见问题

| 现象 | 原因 | 解决 |
|------|------|------|
| 端口无监听 | Chrome 复用了旧进程 | 关闭所有 Chrome 后用 `--user-data-dir` 重新启动 |
| MCP 报 "fetch failed" | 调试端口未启用 | 确保使用 `--user-data-dir` 参数 |
| 找不到 chrome.exe | 路径错误 | 脚本会自动搜索常见安装路径 |
| 端口被占用 | 其他程序占用了 9222 | 用 `-Port 9333` 换个端口 |

## 连接成功后的操作

1. 在酒馆中打开角色卡，页面通过 `http://127.0.0.1:9222` 连接调试端口
2. 启用扩展设置：「酒馆助手 → 实时监听 → 允许监听」
3. 修改代码后，webpack watch 自动重编译，酒馆页面自动重载

## MCP 配置

`.mcp.json` 已预配置：
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--browserUrl", "http://127.0.0.1:9222"]
    }
  }
}
```