---
id: docker
title: Docker 部署
---

# Docker 部署

使用 Docker Compose 运行 PicoClaw，无需本地安装任何依赖。

## Docker Compose 配置

```bash
# 1. 克隆仓库
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. 首次运行 — 自动生成 docker/data/config.json 后退出
docker compose -f docker/docker-compose.yml --profile gateway up
# 容器输出 "First-run setup complete." 后停止。

# 3. 设置 API Key
vim docker/data/config.json   # 填入模型 API Key、机器人 Token 等

# 4. 启动
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Docker 网络
默认情况下，网关监听 `127.0.0.1`。设置 `PICOCLAW_GATEWAY_HOST=0.0.0.0`（在环境变量或 config.json 中）以暴露到 Docker 宿主机网络。
:::

:::note 网关 Profile
`gateway` profile 仅提供 Webhook 处理（包括启用时的 Pico 通道）和健康检查端点。不提供通用 REST 聊天接口。启动器模式在 18800 端口提供浏览器 UI。
:::

:::info 重启策略
网关和启动器服务使用 `restart: unless-stopped`，因此在崩溃或系统重启后会自动重启，除非被明确停止。
:::

## 启动器模式（Web 控制台）

启动器提供基于浏览器的配置界面，监听端口 **18800**：

```bash
docker compose -f docker/docker-compose.yml --profile launcher up -d
```

打开 `http://localhost:18800` 即可管理模型、渠道和网关进程。

:::warning Dashboard Token
Web 控制台使用 Dashboard Token（每次运行时在内存中生成，除非设置了 `PICOCLAW_LAUNCHER_TOKEN`）。切勿将启动器暴露到不受信任的网络或公网，请自行添加认证层（反向代理、VPN 等）。
:::

## Agent 模式

```bash
# 单次提问
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "1+1 等于几？"

# 交互模式
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

## 更新

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## 快速开始

### 1. 初始化

```bash
picoclaw onboard
```

### 2. 配置 `~/.picoclaw/config.json`

#### 模型列表

添加一个或多个模型提供商：

```json
{
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-volcengine-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-openai-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

#### 网络搜索工具（可选）

为 Agent 配置网络搜索提供商：

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      },
      "tavily": {
        "enabled": false,
        "api_key": "YOUR_TAVILY_API_KEY",
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": false,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_key": "YOUR_PERPLEXITY_API_KEY"
      },
      "searxng": {
        "enabled": false,
        "base_url": "http://localhost:8080"
      }
    }
  }
}
```

**获取 API Key：**

| 服务 | 链接 |
| --- | --- |
| Brave Search | [brave.com/search/api](https://brave.com/search/api)（每月 2000 次免费查询） |
| Tavily | [tavily.com](https://tavily.com)（每月 1000 次免费查询） |
| DuckDuckGo | 无需 Key |
| Perplexity | [perplexity.ai](https://docs.perplexity.ai) |
| SearXNG | 自托管，参见 [docs.searxng.org](https://docs.searxng.org) |

### 3. 开始对话

```bash
picoclaw agent -m "总结一下最新的 Rust 版本更新"
```
