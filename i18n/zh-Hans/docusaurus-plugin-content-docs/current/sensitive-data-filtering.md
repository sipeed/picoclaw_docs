---
id: sensitive-data-filtering
title: 敏感数据过滤
---

# 敏感数据过滤

PicoClaw 会自动从工具结果中过滤敏感值 —— 如 API 密钥、令牌和密钥 —— 在将其发送给 LLM 之前。这可以防止凭据泄漏到模型上下文中，被回显给用户或被记录到日志中。

## 值的收集方式

敏感值在启动时从 `.security.yml` 文件中收集。该文件中定义的每个字符串值都被视为潜在的密钥。

## 配置

过滤在 `tools` 部分下进行配置：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filter_sensitive_data` | bool | `true` | 启用或禁用敏感数据过滤。 |
| `filter_min_length` | int | `8` | 被视为需要过滤的值的最小长度。短于此长度的值将被忽略，以避免误报。 |

也可以通过环境变量切换过滤：

```bash
export PICOCLAW_TOOLS_FILTER_SENSITIVE_DATA=false
```

## 工作原理

1. **启动时**，PicoClaw 读取 `.security.yml` 并收集所有满足最小长度要求的字符串值。
2. 这些值被组装成一个 `strings.Replacer`。
3. **对于每个工具结果**，替换器扫描输出并将任何匹配的值替换为 `[FILTERED]`。

### 示例

假设 `.security.yml` 包含：

```yaml
openai:
  api_key: "sk-abc123xxxxxxxxxxxxxxxxxx"
database:
  password: "super-secret-db-pass"
```

工具返回的内容为：

```
Connected to database with password super-secret-db-pass
API response from sk-abc123xxxxxxxxxxxxxxxxxx: {"status": "ok"}
```

LLM 将看到：

```
Connected to database with password [FILTERED]
API response from [FILTERED]: {"status": "ok"}
```

## 性能

- **短内容快速路径** —— 工具结果短于最小过滤长度时，直接返回而不进行扫描。
- **O(n+m) 替换** —— 底层 `strings.Replacer` 使用高效的类 Aho-Corasick 算法，其中 `n` 是内容长度，`m` 是所有模式的总长度。
- **延迟初始化** —— 替换器在启动时构建一次，后续所有工具调用复用。

## 安全注意事项

- **过滤是尽力而为的。** 如果密钥未列在 `.security.yml` 中，则不会被过滤。请始终保持安全文件的更新。
- **不过滤部分匹配。** 值必须完全按定义出现。子字符串或编码变体（例如 base64）不会被捕获。
- **`filter_min_length` 默认值为 8**，旨在避免过滤短的常见字符串导致过多误报。请根据你的安全需求调整此值。
- **工具输入不会被过滤** —— 只扫描工具结果（输出）。如果敏感数据出现在发送给工具的参数中，不会被脱敏。
- **日志和存储** —— 过滤发生在结果发送给 LLM 之前，但原始工具输出可能仍然出现在本地日志中，具体取决于你的日志配置。
