# start-dev.ps1 - 酒馆助手一键开发启动脚本
# 功能：启动 Chrome 调试模式 + webpack watch + CDP 验证
#
# 用法：
#   .\start-dev.ps1              # 启动 Chrome + webpack watch
#   .\start-dev.ps1 -ChromeOnly  # 仅启动 Chrome
#   .\start-dev.ps1 -NoKill      # 不关闭现有 Chrome
#   .\start-dev.ps1 -Port 9333   # 自定义调试端口

param(
    [switch]$ChromeOnly,
    [switch]$NoKill,
    [int]$Port = 9222,
    [string]$UserDataDir = "$env:TEMP\chrome-debug-$Port",
    [string]$TavernUrl = "http://localhost:8000"
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "`n[>] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [!!] $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "  [X] $msg" -ForegroundColor Red }

# 1. 查找 Chrome
Write-Step "查找 Chrome 安装路径"

$candidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($p in $candidates) {
    if (Test-Path $p) { $chromePath = $p; break }
}
if (-not $chromePath) {
    $found = Get-Command chrome.exe -ErrorAction SilentlyContinue
    if ($found) { $chromePath = $found.Source }
}
if (-not $chromePath) {
    Write-Fail "未找到 Chrome，请确认已安装 Google Chrome"
    exit 1
}
Write-OK "Chrome: $chromePath"

# 2. 检查端口状态
Write-Step "检查端口 $Port 状态"

$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Where-Object { $_.State -eq 'Listen' }

$chromeRunning = $false
if ($portInUse) {
    $procId = $portInUse[0].OwningProcess
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -like '*chrome*') {
        Write-OK "Chrome 已在端口 $Port 监听 (PID: $procId)，跳过启动"
        $chromeRunning = $true
    } else {
        Write-Fail "端口 $Port 被非 Chrome 进程占用 (PID: $procId)"
        exit 1
    }
} else {
    Write-OK "端口 $Port 空闲"
}

# 3. 关闭现有 Chrome（交互确认）
if (-not $chromeRunning -and -not $NoKill) {
    $chromeProcesses = Get-Process -Name chrome -ErrorAction SilentlyContinue
    if ($chromeProcesses) {
        Write-Step "关闭现有 Chrome 进程 ($($chromeProcesses.Count) 个)"
        $resp = Read-Host "  是否关闭所有 Chrome 窗口？(y/N)"
        if ($resp -eq 'y' -or $resp -eq 'Y') {
            Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-OK "已关闭"
        } else {
            Write-Warn "保留现有 Chrome，调试端口可能不生效"
        }
    }
}

# 4. 启动 Chrome
if (-not $chromeRunning) {
    Write-Step "启动 Chrome 调试模式"
    $chromeArgs = @(
        "--remote-debugging-port=$Port",
        "--user-data-dir=`"$UserDataDir`"",
        "--no-first-run",
        "--no-default-browser-check"
    )
    Start-Process -FilePath $chromePath -ArgumentList $chromeArgs
    Write-OK "Chrome 已启动，等待就绪..."

    $waited = 0
    $maxWait = 15
    while ($waited -lt $maxWait) {
        Start-Sleep -Seconds 1
        $waited++
        $check = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
            Where-Object { $_.State -eq 'Listen' }
        if ($check) {
            Write-OK "端口 $Port 已就绪 (等待了 ${waited}s)"
            break
        }
        Write-Host "." -NoNewline
    }
    if ($waited -ge $maxWait) {
        Write-Fail "Chrome 未能在 ${maxWait}s 内启动调试端口"
        exit 1
    }
}

# 5. 验证 CDP 端点
Write-Step "验证 CDP 端点"
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 5
    Write-OK "浏览器: $($response.Browser)"
    Write-OK "WebSocket: $($response.webSocketDebuggerUrl)"
} catch {
    Write-Fail "CDP 端点无响应: $_"
    exit 1
}

# 6. 启动 webpack watch
if (-not $ChromeOnly) {
    Write-Step "启动 webpack watch"
    $projectRoot = Split-Path $MyInvocation.MyCommand.Path -Parent
    if (-not (Test-Path "$projectRoot\package.json")) {
        $projectRoot = Get-Location
    }
    Write-OK "项目目录: $projectRoot"
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "Set-Location '$projectRoot'; pnpm watch"
    )
    Write-OK "webpack watch 已在新窗口启动"
}

# 7. 汇总
Write-Step "启动完成"
Write-Host ""
Write-Host "  调试端口:    http://127.0.0.1:$Port" -ForegroundColor White
Write-Host "  CDP 验证:    http://127.0.0.1:$Port/json/version" -ForegroundColor White
Write-Host "  酒馆页面:    $TavernUrl" -ForegroundColor White
Write-Host "  MCP 配置:    .mcp.json (browserUrl=http://127.0.0.1:$Port)" -ForegroundColor White
Write-Host ""
Write-Host "  下一步:" -ForegroundColor Yellow
Write-Host "    1. 在酒馆中打开角色卡" -ForegroundColor White
Write-Host "    2. 启用「酒馆助手-实时监听-允许监听」" -ForegroundColor White
Write-Host "    3. 使用 MCP chrome-devtools 调试" -ForegroundColor White
Write-Host ""
