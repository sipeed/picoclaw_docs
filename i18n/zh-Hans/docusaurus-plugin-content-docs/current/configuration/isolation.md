---
id: isolation
title: 子进程隔离
---

# 子进程隔离

PicoClaw 可以把它启动的子进程放进一个按实例隔离的环境里运行。生效范围包括：

- `exec` 工具
- 基于 CLI 的 provider（`claude-cli`、`codex-cli` 等）
- 进程型 hooks
- MCP `stdio` server

PicoClaw 主进程本身**不会**被沙箱化 —— 只有它启动的子进程才会被隔离。

隔离功能**默认关闭**，以保持现有部署的行为一致。当你需要在 Agent 工具调用与宿主文件系统之间建立更强的边界时，再显式启用它。

:::caution Linux 需要 bubblewrap
Linux 后端依赖 `bwrap`（bubblewrap 包）。如果系统里没有 `bwrap`，启动会**直接失败**，没有自动回退。请用包管理器安装：

- Debian/Ubuntu：`apt install bubblewrap`
- Fedora/RHEL：`dnf install bubblewrap`
- Arch：`pacman -S bubblewrap`
- Alpine：`apk add bubblewrap`
:::

## 配置

在 `~/.picoclaw/config.json` 里加入 `isolation` 配置块：

```json
{
  "isolation": {
    "enabled": false,
    "expose_paths": []
  }
}
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 是否启用子进程隔离 |
| `expose_paths` | array | `[]` | 显式带入隔离环境的宿主路径（仅 Linux） |

### `expose_paths` 条目

```json
{
  "source": "/opt/toolchains/go",
  "target": "/opt/toolchains/go",
  "mode": "ro"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `source` | string | 是 | 宿主机路径 |
| `target` | string | 否 | 隔离环境内的目标路径，省略时默认等于 `source` |
| `mode` | string | 是 | `ro`（只读）或 `rw`（读写） |

规则：

- 同一个 `target` 最终只保留一条规则 —— 后加载的配置会覆盖先加载的同目标规则
- `expose_paths` **仅 Linux 支持**；在 Windows 上配置 `expose_paths` 会导致启动失败

### 示例

```json
{
  "isolation": {
    "enabled": true,
    "expose_paths": [
      {
        "source": "/opt/toolchains/go",
        "target": "/opt/toolchains/go",
        "mode": "ro"
      },
      {
        "source": "/data/shared-assets",
        "target": "/opt/picoclaw-instance-a/workspace/assets",
        "mode": "rw"
      }
    ]
  }
}
```

## 工作原理

实现可以分为四层：

1. **配置层** —— 读取 `isolation` 配置并在运行时注入
2. **实例目录层** —— 解析 `PICOCLAW_HOME`（或 `~/.picoclaw`），准备实例目录，构建运行时用户环境
3. **平台后端** —— Linux 使用 `bwrap`；Windows 使用受限 token、低完整性级别和 Job Object；macOS 等其他平台未实现
4. **统一启动入口** —— 所有需要启动子进程的代码路径都走 `PrepareCommand` / `Start` / `Run`，而不是直接调用 `cmd.Start`

启用隔离后，子进程会拿到一份重定向的运行时用户环境：

- **Linux**：`HOME`、`TMPDIR`、`XDG_CONFIG_HOME`、`XDG_CACHE_HOME`、`XDG_STATE_HOME`
- **Windows**：`USERPROFILE`、`HOME`、`TEMP`、`TMP`、`APPDATA`、`LOCALAPPDATA`

这些路径都指向 PicoClaw 实例根目录下的 `runtime-user-env/` 子目录。Agent 的工具和 CLI provider 看到的是这套环境，而非用户的常规环境。

## 平台行为

### Linux（bubblewrap）

- 通过 `bwrap` 提供最小文件系统视图
- IPC 命名空间隔离
- 只读 / 读写的 `source -> target` 绑定挂载
- 默认挂载点包括实例根、`/usr`、`/bin`、`/lib`、`/lib64`、`/etc/resolv.conf`
- 运行时还会自动挂载可执行文件路径、所在目录、工作目录、以及参数中需要的绝对路径

Linux 后端目前**不**默认启用独立的 PID 命名空间。

### Windows

- 受限主 token
- 低完整性级别
- 进程位于 Job Object 中
- 重定向的运行时用户环境

Windows 隔离**不**实现真正的 `source -> target` 文件系统重映射。在 Windows 上配置 `expose_paths` 会让启动失败。

### macOS 及其他平台

尚未实现。在不支持的平台上设置 `enabled: true` 时，运行时应该把这个判定为「不支持的配置」而不是假装隔离已生效。

## 日志与调试

启用隔离后，PicoClaw 会在启动时打印生成的隔离方案：

- **Linux**：日志条目 `linux isolation mount plan`
- **Windows**：日志条目 `windows isolation access rules`

如果怀疑隔离没生效，可以从这两条日志里查是否有意外的宿主路径出现。

## 与 `restrict_to_workspace` 的关系

`restrict_to_workspace` 与 `isolation` 解决的是不同问题，二者互补：

| | `restrict_to_workspace` | `isolation` |
| --- | --- | --- |
| **层级** | 工具调用层校验 | OS 级子进程沙箱 |
| **拦截内容** | Agent **能请求**的文件路径 | 子进程**实际能看见**的内容 |
| **执行点** | 在 picoclaw 进程内 | bwrap / Job Object |
| **绕过风险** | 某个有 bug 的工具可能忘记校验 | 由内核强制 |

建议两者同时启用以实现纵深防御。

## 当前限制

- Linux 后端使用 `bwrap`，而非自研的进程内沙箱
- Linux 默认未启用独立 PID 命名空间
- Windows 尚未对每条允许/拒绝路径都强制宿主 ACL
- macOS 未实现
- 仅子进程被隔离，PicoClaw 主进程不受影响
