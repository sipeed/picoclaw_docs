---
id: web-search-setup
title: 网络搜索配置
---

# 网络搜索配置

当前版本中，网络搜索需通过配置文件（`config.json` + `.security.yml`）配置，WebUI 暂无对应配置入口。

## 配置方式：`config.json` + `.security.yml`

在 schema v2 下，将结构配置放在 `config.json`，将密钥放在 `.security.yml`。

编辑 `~/.picoclaw/config.json`：

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      }
    }
  }
}
```

然后在 `~/.picoclaw/.security.yml` 中填写密钥：

```yaml
web:
  brave:
    api_keys:
      - "YOUR_BRAVE_API_KEY"
```

申请 Key：
- [Baidu Search](https://www.baidu.com/)（单日 1000 次免费查询，更偏向国内内容）
- [Brave Search API](https://brave.com/search/api)（每月 2000 次免费查询）
- [Tavily API](https://tavily.com)（每月 1000 次免费查询）

更多搜索引擎和高级配置项见 [工具配置](./tools.md)。
