---
id: anthropic-api
title: Claude(Anthropic) API
---
# Claude (Anthropic) 配置指南

## 概述

**Claude (Anthropic)** 提供 **按量付费** （Pay-as-you-go）方式，通过 Anthropic 官方 API Key 调用，按实际消耗的 Token 数量计费。

> ⚠️ **重要说明**
>
> * Claude  **订阅套餐** （Pro / Max / Team / Enterprise）与 **API** 是**完全独立**的两套产品，订阅套餐仅用于 claude.ai 网页端、桌面端、移动端， **不包含 API 调用权限** ，无法用于 PicoClaw 等开发工具
> * Anthropic 原生 API 使用 `/v1/messages` 接口格式，**不是** OpenAI 兼容接口（`/v1/chat/completions`）；使用 OpenAI 兼容模式会导致 Prompt Caching、Extended Thinking、PDF 处理等核心功能不可用
> * 通过订阅账号 OAuth Token 在第三方工具中调用 Claude  **违反 Anthropic ToS** ，且该路径已于 2026 年 4 月被官方封堵，请勿尝试

官方文档：https://docs.anthropic.com/en/api/getting-started

---

![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)

## 获取 API Key

1. 访问 Anthropic 控制台 [Anthropic Console](https://console.anthropic.com/)，注册并登录
2. 在左侧导航进入 API Keys 页面，点击「Create Key」生成 API Key
3. Billing 页面添加付款方式并充值，API 调用将按实际 Token 用量从余额中扣除

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### 计费方式

按量付费，按实际消耗的输入/输出 Token 数量计费，无月费，不用不扣款。费率参考（价格可能随 Anthropic 官方调整）：

|       模型       | 输入（每百万 Token） | 输出（每百万 Token） |
| :---------------: | :------------------: | :------------------: |
| claude-sonnet-4.6 |         \$3         |         \$15         |
|  claude-opus-4.7  |         \$15        |         \$75         |
| claude-haiku-4.5  |        \$0.8        |          \$4         |

> 最新价格以 Anthropic 官方定价页为准

### 支持的模型

|            模型            |                说明                |
| :------------------------: | :--------------------------------: |
|     claude-sonnet-4.6      | 推荐，均衡性能与成本，长上下文优秀 |
|      claude-opus-4.7       |   高阶模型，复杂推理、超大上下文   |
|      claude-haiku-4.5      |     轻量模型，快速响应、低成本     |
| claude-3-5-sonnet-20241022 |        经典稳定版，兼容广泛        |

> 日常编码优先使用 **claude-sonnet-4.6**，复杂任务再切换 Opus，避免额度消耗过快

## 配置 PicoClaw

### 网页端配置

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)

|     字段     |                   填写内容                   |
| :----------: | :-------------------------------------------: |
|   模型别名   |           自定义名称，如 anthropic           |
|  模型标识符  | anthropic/claude-sonnet-4.6（或其他支持模型） |
|   API Key   |       Anthropic Console 生成的 API Key       |
| API Base URL |         https://api.anthropic.com/v1         |

### 编辑配置文件

config.json 配置

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_base": "https://api.anthropic.com/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "claude-sonnet-4.6"
    }
  }
}
```

---

`~/.picoclaw/.security.yml`：

```yaml
model_list:
  claude-sonnet-4.6:0:
    api_keys:
      - "your-anthropic-api-key"
```

## 注意事项

* 按量计费，用多少扣多少：高频、长上下文任务费用增长较快，建议在 Console Billing 页面设置用量告警
* Claude Opus 系列成本显著高于 Sonnet，非必要不长期使用
* 订阅套餐与 API 余额相互独立，不可互通：充值到 Console 的余额仅用于 API 调用，与 claude.ai 的订阅套餐无关
