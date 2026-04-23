# Hermes Agent 部署指南

## 快速安装（Windows）

### 方法一：一键安装（推荐）
```powershell
irm https://raw.githubusercontent.com/WATE88/hermes-agent/main/scripts/install.ps1 | iex
```

### 方法二：手动安装
```powershell
# 1. 克隆仓库
git clone https://github.com/WATE88/hermes-agent.git
cd hermes-agent

# 2. 安装依赖
pip install -e .

# 3. 构建前端（Dashboard 需要）
cd web && npm install && npm run build && cd ..

# 4. 配置 API Key
hermes setup
```

## 启动 Dashboard

```powershell
# 方式一：命令行
hermes web

# 方式二：使用启动脚本
python start_dashboard.py
```

Dashboard 地址：http://127.0.0.1:9119

## 聊天功能（新增强）

### 访问聊天
http://127.0.0.1:9119/chat

### 功能
- ✅ 对话管理（创建/切换/删除）
- ✅ 历史记录保存
- 🚧 文件工具集成（需要支持 function calling 的模型）

## API 配置

编辑 `~/.hermes/config.yaml`:
```yaml
model:
  provider: siliconflow
  default: Pro/zai-org/GLM-5

# 或使用 OpenAI
model:
  provider: openai
  default: gpt-4
```

设置 API Key:
```powershell
# 方式一：环境变量
$env:SILICONFLOW_API_KEY = "sk-xxx"

# 方式二：.env 文件
echo "SILICONFLOW_API_KEY=sk-xxx" > ~/.hermes/.env
```

## 数据存储

- 配置文件：`~/.hermes/config.yaml`
- 环境变量：`~/.hermes/.env`
- 聊天记录：`~/.hermes/chat_conversations/`
- 会话数据：`~/.hermes/sessions/`

## 故障排除

### 前端未构建
```
Error: Dashboard 静态文件不存在
```
解决：`cd web && npm run build`

### API Key 未配置
```
Error: No API key configured
```
解决：`hermes setup` 或手动设置环境变量

### 端口被占用
```
Error: [Errno 10048] 通常每个套接字地址只允许使用一次
```
解决：`taskkill /F /IM python.exe` 或更换端口

---

## 当前版本

- 分支：chat-ui-wate88
- 版本：v0.10.0 + 聊天增强
- 更新日期：2026-04-23
