# 在系统浏览器中打开外部链接 - 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 点击应用中的链接时，在系统默认浏览器中打开，而非在 Webview 内部导航

**Architecture:** 使用 Tauri 官方 shell 插件，在前端通过 `shell.open()` 调用系统浏览器打开外部链接

**Tech Stack:**
- @tauri-apps/plugin-shell (npm)
- tauri-plugin-shell (Rust)
- React + TypeScript

---

## 文件结构

需要修改的文件：
- `package.json` - 添加 npm 依赖
- `src-tauri/Cargo.toml` - 添加 Rust 依赖
- `src-tauri/src/lib.rs` - 注册 shell 插件
- `src-tauri/capabilities/main.json` - 添加 shell:allow-open 权限
- `src/components/ChecklistItem.tsx` - 修改链接点击行为

---

## 实现步骤

### Task 1: 安装 Shell 插件

**Files:**
- Modify: `package.json`
- Modify: `src-tauri/Cargo.toml`
- Modify: `src-tauri/src/lib.rs`
- Modify: `src-tauri/capabilities/main.json`

- [ ] **Step 1: 安装 npm 依赖**

Run: `npm install @tauri-apps/plugin-shell`

- [ ] **Step 2: 添加 Rust 依赖**

Modify `src-tauri/Cargo.toml`, 在 dependencies 部分添加：
```toml
tauri-plugin-shell = "2"
```

- [ ] **Step 3: 注册插件**

Modify `src-tauri/src/lib.rs`, 在 `Builder::new()` 之后添加：
```rust
.plugin(tauri_plugin_shell::init())
```

- [ ] **Step 4: 添加权限**

Modify `src-tauri/capabilities/main.json`, 在 permissions 数组中添加：
```json
"shell:allow-open"
```

- [ ] **Step 5: 提交**

```bash
git add package.json package-lock.json src-tauri/Cargo.toml src-tauri/src/lib.rs src-tauri/capabilities/main.json
git commit -m "feat: 添加 shell 插件支持"
```

---

### Task 2: 修改前端链接点击行为

**Files:**
- Modify: `src/components/ChecklistItem.tsx`

- [ ] **Step 1: 导入 shell 插件**

在文件顶部添加导入：
```typescript
import { open } from '@tauri-apps/plugin-shell';
```

- [ ] **Step 2: 修改 renderTextWithLinks 函数**

将 `renderTextWithLinks` 函数中的 `<a>` 标签点击行为改为调用 `open()`：

原代码 (第 16-25 行)：
```typescript
<a
  key={i}
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  className="text-link hover:underline"
  onClick={(e) => e.stopPropagation()}
>
  {part}
</a>
```

改为：
```typescript
<span
  key={i}
  className="text-link hover:underline cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    open(href).catch(console.error);
  }}
>
  {part}
</span>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ChecklistItem.tsx
git commit -m "feat: 点击链接时在系统浏览器中打开"
```

---

### Task 3: 验证

- [ ] **Step 1: 构建应用**

Run: `npm run tauri build`

- [ ] **Step 2: 测试链接点击**

1. 打开构建后的应用
2. 找到带"填写网址"的材料项（如编号7）
3. 点击链接
4. 确认系统默认浏览器打开链接

- [ ] **Step 3: 发布新版本**

```bash
git tag v2.0.2
git push origin v2.0.2
```

---

## 验证命令

```bash
# 构建
npm run tauri build

# 开发模式测试
npm run dev
```
