# Chrome 调试端口连接指南

## 问题背景

在使用 MCP chrome-devtools 连接浏览器时，经常遇到连接失败的问题。本指南总结了成功连接 Chrome 调试端口的方法和经验。

## 核心问题

Chrome 默认不会启用远程调试端口，需要通过特定参数启动才能被 MCP 工具连接。

## 成功启动方法

### 方法一：完整启动流程（推荐）

```bash
# 1. 关闭所有 Chrome 进程
taskkill //F //IM chrome.exe

# 2. 等待进程完全关闭
sleep 2

# 3. 启动带调试端口的 Chrome（使用完整路径）
"/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir="C:\temp-chrome-debug"
```

### 方法二：PowerShell 启动

```powershell
Start-Process 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' \
  -ArgumentList '--remote-debugging-port=9222', '--user-data-dir="C:\temp-chrome-debug"'
```

## 关键参数说明

| 参数 | 作用 | 必要性 |
|------|------|--------|
| `--remote-debugging-port=9222` | 启用远程调试端口 | **必须** |
| `--user-data-dir="C:\temp-chrome-debug"` | 使用独立用户数据目录 | **推荐** |

## 为什么需要 `--user-data-dir`？

1. **避免冲突**：如果 Chrome 已经在运行，新实例会复用已有进程，导致调试端口参数被忽略
2. **独立配置**：使用独立目录可以避免影响日常使用的 Chrome 配置
3. **确保生效**：强制 Chrome 创建新实例，确保调试端口参数生效

## 验证步骤

### 1. 检查端口是否监听

```bash
netstat -ano | findstr :9222
```

预期输出：
```
TCP    127.0.0.1:9222         0.0.0.0:0              LISTENING       [PID]
```

### 2. 检查 Chrome 进程

```bash
tasklist | findstr chrome
```

### 3. 测试 CDP 端点

```bash
curl http://localhost:9222/json/version
```

### 4. 使用 MCP 工具连接

```javascript
// 列出页面
mcp__chrome-devtools__list_pages

// 打开新页面
mcp__chrome-devtools__new_page(url="about:blank")
```

## 常见问题及解决

### 问题 1：端口未监听

**现象**：`netstat` 无输出或端口未显示

**原因**：Chrome 未正确启动或复用了已有进程

**解决**：
```bash
# 强制关闭所有 Chrome 进程
taskkill //F //IM chrome.exe

# 等待后重新启动
sleep 2
"/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir="C:\temp-chrome-debug"
```

### 问题 2：连接失败 "fetch failed"

**现象**：MCP 工具报错 "Failed to fetch browser webSocket URL"

**原因**：Chrome 进程存在但调试端口未启用

**解决**：确保使用 `--user-data-dir` 参数启动新实例

### 问题 3：找不到 Chrome 路径

**现象**：启动命令报错 "No such file or directory"

**解决**：
```bash
# 查找 Chrome 安装路径
ls -la "/c/Program Files/Google/Chrome/Application/chrome.exe" 2>/dev/null
ls -la "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" 2>/dev/null

# 使用找到的路径启动
"/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" --version
```

## 启动脚本模板

### Bash 脚本

```bash
#!/bin/bash
# start-chrome-debug.sh

CHROME_PATH="/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
DEBUG_PORT=9222
USER_DATA_DIR="C:\temp-chrome-debug"

# 关闭现有 Chrome 进程
echo "关闭现有 Chrome 进程..."
taskkill //F //IM chrome.exe 2>/dev/null
sleep 2

# 启动带调试端口的 Chrome
echo "启动 Chrome (端口: $DEBUG_PORT)..."
"$CHROME_PATH" \
  --remote-debugging-port=$DEBUG_PORT \
  --user-data-dir="$USER_DATA_DIR" &

# 等待启动
sleep 3

# 验证端口
echo "验证调试端口..."
if netstat -ano | findstr :$DEBUG_PORT > /dev/null; then
  echo "✅ Chrome 调试端口已启用"
  echo "✅ 可以使用 MCP chrome-devtools 连接"
else
  echo "❌ 调试端口未启用，请检查启动参数"
fi
```

### PowerShell 脚本

```powershell
# start-chrome-debug.ps1

$ChromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
$DebugPort = 9222
$UserDataDir = "C:\temp-chrome-debug"

# 关闭现有 Chrome 进程
Write-Host "关闭现有 Chrome 进程..."
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 启动带调试端口的 Chrome
Write-Host "启动 Chrome (端口: $DebugPort)..."
Start-Process $ChromePath -ArgumentList "--remote-debugging-port=$DebugPort", "--user-data-dir=`"$UserDataDir`""

# 等待启动
Start-Sleep -Seconds 3

# 验证端口
Write-Host "验证调试端口..."
$portCheck = netstat -ano | Select-String ":$DebugPort"
if ($portCheck) {
  Write-Host "✅ Chrome 调试端口已启用" -ForegroundColor Green
  Write-Host "✅ 可以使用 MCP chrome-devtools 连接" -ForegroundColor Green
} else {
  Write-Host "❌ 调试端口未启用，请检查启动参数" -ForegroundColor Red
}
```

## 最佳实践

1. **始终使用 `--user-data-dir`**：避免与现有 Chrome 实例冲突
2. **先关闭再启动**：确保新实例使用调试参数
3. **验证端口状态**：连接前先检查端口是否监听
4. **使用完整路径**：避免 PATH 环境变量问题
5. **等待足够时间**：Chrome 启动需要时间，建议等待 2-3 秒

## 连接成功后的操作

1. **打开酒馆网页**：访问 http://localhost:8000
2. **启用允许监听**：在扩展设置中启用"酒馆助手-实时监听-允许监听"
3. **开始开发**：修改代码后，前端界面会自动重载

## 总结

成功连接 Chrome 调试端口的关键是：
- 使用 `--remote-debugging-port=9222` 参数
- 使用 `--user-data-dir` 避免进程复用
- 先关闭现有 Chrome 进程
- 验证端口监听状态

遵循以上步骤，可以稳定地连接 Chrome 进行前端调试。
