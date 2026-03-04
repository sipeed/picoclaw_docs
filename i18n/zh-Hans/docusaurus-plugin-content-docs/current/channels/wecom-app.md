---
id: wecom-app
title: WeCom App (企业微信自建应用)
---

# 企业微信自建应用

企业微信自建应用比机器人功能更丰富：支持私聊、主动推送消息等。

如需较简单的群聊机器人，请参见 [企业微信机器人](./wecom-bot)。如需官方智能机器人，请参见 [企业微信智能机器人](./wecom-aibot)。

## 功能

| 功能 | 是否支持 |
| --- | --- |
| 接收消息 | ✅ |
| 主动推送消息 | ✅ |
| 私聊 | ✅ |
| 群聊 | ❌ |

## 设置流程

### 1. 企业微信管理后台

1. 登录 [企业微信管理后台](https://work.weixin.qq.com/wework_admin)
2. 进入应用管理 → 选择自建应用
3. 记下以下信息：
   - **AgentId** — 应用详情页显示
   - **Secret** — 点击"查看"获取
4. 进入"我的企业"→ 复制 **CorpID**

### 2. 配置消息接收

1. 在应用详情页，点击"接收消息" → "设置 API"
2. 填写：
   - **URL**：`http://your-server:18790/webhook/wecom-app`
   - **Token**：自动生成或自定义
   - **EncodingAESKey**：点击"随机生成"获取 43 字符密钥
3. 点击"保存"——企业微信会向你的服务器发送验证请求

### 3. 配置 PicoClaw

```json
{
  "channels": {
    "wecom_app": {
      "enabled": true,
      "corp_id": "wwxxxxxxxxxxxxxxxx",
      "corp_secret": "YOUR_CORP_SECRET",
      "agent_id": 1000002,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-app",
      "allow_from": [],
      "reply_timeout": 5
    }
  }
}
```

### 4. 运行

```bash
picoclaw gateway
```

:::warning 端口要求
企业微信自建应用使用共享网关端口（默认 `18790`），该端口必须可从公网访问。如需 HTTPS，请使用反向代理。
:::

## 故障排查

### 回调 URL 验证失败

- 确认网关端口（默认 18790）已在防火墙中放行
- 验证 `corp_id`、`token` 和 `encoding_aes_key` 是否正确
- 查看 PicoClaw 日志确认请求是否到达服务器

### 中文消息解密错误（`invalid padding size`）

企业微信使用非标准的 PKCS7 填充（32 字节块大小而非 16 字节）。最新版 PicoClaw 已修复此问题。

### 端口冲突

如需更改端口，请修改 `gateway` 配置区域。

## 技术细节

- **加密方式**：AES-256-CBC
- **密钥**：EncodingAESKey 经 Base64 解码后的 32 字节
- **IV**：AES 密钥的前 16 字节
- **填充**：PKCS7（非标准 32 字节块大小）
- **消息格式**：XML

解密后的消息结构：
```
random(16B) + msg_len(4B) + msg + receiveid
```

## 参考资料

- [企业微信官方文档 — 接收消息](https://developer.work.weixin.qq.com/document/path/96211)
