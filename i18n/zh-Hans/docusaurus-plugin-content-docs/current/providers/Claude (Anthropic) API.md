# Claude (Anthropic)  配置指南

## 概述

**Claude (Anthropic)**  提供**订阅套餐**与**按量付费**两种方式，均使用 OpenAI 兼容接口，**订阅套餐与按量付费共用同一端点**，仅 API Key 与计费方式不同

官方文档：<https://docs.anthropic.com/en/api/getting-started>
***
## 订阅套餐（推荐）
Claude 订阅套餐面向开发者，提供固定额度内高频使用，适合日常编码、长上下文、代码理解场景

![image-20260409215655752](./Anthropic/image-20260409215655752.png)
## 获取 API Key
1. 访问 Anthropic 控制台
2. 注册并登录，开通对应订阅套餐（Pro / Max 5× / Max 20×）
3. 在控制台 API Keys 页面获取**订阅专属 API Key**
4. ![image-20260409215733096](./Anthropic/image-20260409215733096.png)
### 套餐用量（编码场景参考）
|  套餐   | 月度价格  |            适用场景            |
| :-----: | :-------: | :----------------------------: |
|   Pro   | $20 / 月  |  个人轻度开发、短会话、小仓库  |
| Max 5×  | $100 / 月 | 日常高频、多文件读仓、稳定使用 |
| Max 20× | $200 / 月 |   重度多仓并行、长期主力协作   |
### 支持的模型
|             模型             |         说明        |
| :------------------------: | :---------------: |
|      claude-sonnet-4-6     | 推荐，均衡性能与成本，长上下文优秀 |
|       claude-opus-4-6      |  高阶模型，复杂推理、超大上下文  |
|      claude-haiku-4-6      |   轻量模型，快速响应、低成本   |
| claude-3-5-sonnet-20241022 |     经典稳定版，兼容广泛    |
> 日常编码优先使用 **claude-sonnet-4-6**，复杂任务再切换 Opus，避免额度消耗过快
## 配置 PicoClaw

### 网页端配置

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」

![image-20260409221239555](./Anthropic/image-20260409221239555.png)
|      字段      |                 填写内容                 |
| :----------: | :----------------------------------: |
|     模型别名     |           自定义名称，如 anthropic          |
|     模型标识符    | anthropic/claude-sonnet-4-6（或其他支持模型） |
|    API Key   |        Anthropic 订阅专属 API Key        |
| API Base URL |    <https://api.anthropic.com/v1>    |
### 编辑配置文件
config.json 配置
```
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_base": "https://api.anthropic.com/v1"
    },
```
***
`~/.picoclaw/.security.yml`：
```YAML
model_list:
  claude-sonnet-4.6:0:
    api_keys:
      - "your-volcengine-api-key"
```
## 注意事项
- 订阅套餐与按量付费**共用端点**：`https://api.anthropic.com/v1`，但**API Key 不可混用**，请在对应页面获取

* 按量付费按 Token 实时扣除账户余额，高频使用建议优先订阅套餐
  - Claude Opus 系列模型消耗额度 / 费用更高，非必要不长期使用
* 订阅额度与 API 额度**相互独立**，不可互通使用

