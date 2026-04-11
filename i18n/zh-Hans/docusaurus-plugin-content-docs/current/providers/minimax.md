---
id: minimax-api
title: MiniMax
---

# MiniMax 配置指南

## 概述

**MiniMax** 是国内头部多模态大模型公司，旗下 MiniMax-M2 系列在长上下文理解、多模态处理和推理能力上均有亮眼表现

MiniMax 的 Token Plan 以订阅制提供高频次请求配额，极速版套餐更是为高并发场景提供了充足的吞吐保障，是追求稳定性和速度的开发者的优质选择

![MiniMax 概述](/img/providers/minimax-overview.png)

官方文档：https://platform.minimaxi.com/docs/token-plan/intro

## 获取 API Key

MiniMax 提供 **Token Plan 订阅套餐**和**按量付费**两种方式，均使用同一端点，但 API Key 不同，请在对应页面获取。

### Token Plan 专属 Key

1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)，注册并登录
2. 进入[订阅页面](https://platform.minimaxi.com/subscribe/token-plan)开通套餐
3. 在套餐管理页获取专属 API Key

### 按量付费 Key

1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)，注册并登录
2. 在控制台 API Keys 页面创建 API Key

   *⚠️ **注意**：API Key 仅显示一次，请立即保存*

### Token Plan 套餐用量（仅 M2.7 请求次数）

| 套餐 | 每 5 小时请求次数 |
|------|------------------|
| Starter | 600 次 |
| Plus | 1,500 次 |
| Max | 4,500 次 |
| Plus-极速版 | 1,500 次（M2.7-highspeed） |
| Max-极速版 | 4,500 次（M2.7-highspeed） |
| Ultra-极速版 | 30,000 次（M2.7-highspeed） |

极速版套餐可使用 MiniMax-M2.7-highspeed 模型，速度更快

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 minimax |
| 模型标识符 | minimax/MiniMax-M2.7（极速版用 minimax/MiniMax-M2.7-highspeed） |
| API Key | 你的 MiniMax API Key |
| API Base URL | 留空（自动使用默认端点） |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "minimax",
      "model": "minimax/MiniMax-M2.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "minimax"
    }
  }
}
```

*极速版将 model 改为 minimax/MiniMax-M2.7-highspeed*

~/.picoclaw/.security.yml：

```yaml
model_list:
  minimax:0:
    api_keys:
      - "your-minimax-api-key"
```

minimax 协议前缀已内置默认端点 https://api.minimaxi.com/v1，无需填写 api_base

## 注意事项

- Token Plan 和按量付费使用同一端点，但 API Key 不同，请在对应页面获取
- 极速版模型 MiniMax-M2.7-highspeed 仅在订阅了极速版套餐时可用
- 生产环境请将 API Key 存放在 .security.yml，避免明文写入 config.json