---
id: qq
title: QQ
---

# QQ

PicoClaw 通过 [QQ 开放平台](https://q.qq.com/)的官方机器人 API 支持 QQ，使用 WebSocket 模式实现实时通信。

## 设置流程

### 1. 创建机器人应用

1. 前往 [QQ 开放平台](https://q.qq.com/#)注册/登录
2. 点击 **创建应用** → 选择 **机器人**
3. 填写应用信息并提交审核

### 2. 获取凭据

1. 应用审核通过后，进入应用仪表盘
2. 在凭据页面复制 **AppID** 和 **AppSecret**

### 3. 配置沙箱模式

:::info
新创建的机器人默认处于 **沙箱模式**。必须先将测试用户和群添加到沙箱中，才能与机器人交互。
:::

1. 在应用仪表盘中，进入 **沙箱配置**
2. 将你的测试 QQ 用户添加到沙箱
3. 将测试群添加到沙箱
4. 在通过审核之前，机器人只会响应沙箱中的用户和群

### 4. 配置 PicoClaw

```json
{
  "channels": {
    "qq": {
      "enabled": true,
      "app_id": "YOUR_APP_ID",
      "app_secret": "YOUR_APP_SECRET",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 5. 运行

```bash
picoclaw gateway
```

## 字段参考

| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `app_id` | string | 是 | QQ 机器人 AppID |
| `app_secret` | string | 是 | QQ 机器人 AppSecret |
| `allow_from` | array | 否 | 用户 ID 白名单（空数组 = 允许所有用户） |
| `group_trigger` | object | 否 | 群聊触发设置（见[通用通道字段](../#通用通道字段)） |
| `reasoning_channel_id` | string | 否 | 将推理过程输出到单独的聊天 |

## 工作原理

### 消息类型

PicoClaw 处理两种 QQ 机器人消息类型：

| 类型 | 场景 | 触发条件 |
| --- | --- | --- |
| **C2C** | 私聊（一对一） | 用户的任意消息 |
| **GroupAT** | 群聊 | 用户必须 @提及机器人 |

### 关键行为

- **群聊必须 @提及**：在群聊中，只有 @机器人 才会触发响应（GroupAT 意图）。这是 QQ 平台的规定。
- **消息去重**：PicoClaw 跟踪已处理的消息 ID，防止重复处理
- **Token 自动刷新**：Bot SDK 自动管理 access token 的续期
- **WebSocket 模式**：使用 QQ Bot SDK 的 WebSocket 连接实现实时消息投递

### 沙箱 vs 正式环境

| | 沙箱 | 正式环境 |
| --- | --- | --- |
| 访问范围 | 仅沙箱注册的用户/群 | 所有用户 |
| 启用条件 | 新机器人默认 | 审核通过后 |
| 用途 | 开发和测试 | 正式上线 |
