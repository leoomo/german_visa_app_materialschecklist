# 设计文档：在系统浏览器中打开外部链接

## 背景
用户反映在 Tauri 桌面应用中点击"填写网址"等链接时无法正常打开。当前使用 HTML `<a>` 标签在 Webview 内部打开链接，但在桌面应用中应该调用系统默认浏览器。

## 方案
使用 Tauri 官方 `@tauri-apps/plugin-shell` 插件，通过 `shell.open()` 在系统浏览器中打开外部链接。

## 实现步骤

### 1. 安装 Shell 插件
```bash
npm install @tauri-apps/plugin-shell
```

### 2. 添加 Rust 依赖
在 `src-tauri/Cargo.toml` 添加：
```toml
tauri-plugin-shell = "2"
```

### 3. 初始化插件
在 `src-tauri/src/lib.rs` 注册插件

### 4. 配置权限
在 `src-tauri/capabilities/main.json` 添加：
```json
{
  "identifier": "main",
  "description": "Main capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "shell:allow-open"
  ]
}
```

### 5. 修改前端代码
在 `src/components/ChecklistItem.tsx` 中：
- 导入 shell 插件
- 修改 `renderTextWithLinks` 函数，点击链接时调用 `shell.open(url)` 而不是使用 `<a>` 标签

## 验证
1. 构建应用
2. 点击带链接的材料项（如"填写网址"）
3. 确认系统默认浏览器打开链接
