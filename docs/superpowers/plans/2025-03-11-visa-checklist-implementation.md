# 德国留学签证清单 - 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一款Tauri + React桌面应用，根据用户角色（高中毕业/大学在读/大学毕业/硕士在读/硕士毕业）生成对应的德国留学签证材料清单，支持标记完成状态和搜索功能。

**Architecture:** 采用Tauri v2作为桌面框架，React作为前端框架，使用Zustand进行状态管理，Framer Motion实现动画效果，数据存储在本地JSON文件。

**Tech Stack:** Tauri v2, React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand, Phosphor Icons

---

## 文件结构

```
visa_checklist/
├── src/
│   ├── components/
│   │   ├── RoleCard.tsx          # 角色选择卡片
│   │   ├── ChecklistItem.tsx     # 清单项组件
│   │   ├── SearchBar.tsx        # 搜索栏
│   │   ├── ProgressBar.tsx      # 进度条
│   │   └── Layout.tsx           # 布局组件
│   ├── data/
│   │   └── checklistData.ts      # 清单数据
│   ├── pages/
│   │   ├── RoleSelectPage.tsx   # 角色选择页
│   │   └── ChecklistPage.tsx    # 清单页
│   ├── stores/
│   │   └── useAppStore.ts       # Zustand状态管理
│   ├── types/
│   │   └── index.ts             # 类型定义
│   ├── utils/
│   │   └── storage.ts           # 本地存储工具
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src-tauri/
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Chunk 1: 项目初始化

### Task 1: 初始化Tauri + React项目

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/src/main.rs`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "visa-checklist",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "@phosphor-icons/react": "^2.1.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
```

- [ ] **Step 4: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
        },
        accent: {
          orange: '#F97316',
          sky: '#0EA5E9',
          teal: '#14B8A6',
          green: '#22C55E',
          yellow: '#EAB308',
          rose: '#F43F5E',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: 创建 src-tauri/Cargo.toml**

```toml
[package]
name = "visa-checklist"
version = "1.0.0"
description = "德国留学签证清单"
authors = []
edition = "2021"

[lib]
name = "visa_checklist_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-fs = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

- [ ] **Step 6: 创建 src-tauri/tauri.conf.json**

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "签证清单",
  "version": "1.0.0",
  "identifier": "com.visachecklist.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist",
    "devtools": true
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "title": "签证清单",
        "width": 900,
        "height": 700,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false,
        "center": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "plugins": {
    "fs": {
      "scope": {
        "allow": ["$APPDATA/**", "$HOME/.visachecklist/**"],
        "deny": []
      }
    }
  }
}
```

- [ ] **Step 7: 创建 src-tauri/src/main.rs**

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    visa_checklist_lib::run();
}
```

- [ ] **Step 8: 创建 src-tauri/src/lib.rs**

```rust
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("签证清单").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 9: 创建 src-tauri/build.rs**

```rust
fn main() {
    tauri_build::build()
}
```

- [ ] **Step 10: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>签证清单</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 11: 安装依赖**

Run: `npm install`
Expected: 安装完成

- [ ] **Step 12: 验证项目结构**

Run: `ls -la`
Expected: 看到 package.json 和 src-tauri 目录

---

### Task 2: 创建基础React结构

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 2: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700&display=swap');

:root {
  font-family: 'Satoshi', system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #1E293B;
  background-color: #F8FAFC;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}
```

- [ ] **Step 3: 创建 src/main.tsx**

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 4: 创建 src/App.tsx**

```typescript
import { useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState<"role-select" | "checklist">("role-select");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === "role-select" ? (
        <div>角色选择页开发中...</div>
      ) : (
        <div>清单页开发中...</div>
      )}
    </div>
  );
}

export default App;
```

- [ ] **Step 5: 运行开发服务器测试**

Run: `npm run dev -- --host`
Expected: Vite开发服务器启动成功

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: 初始化Tauri + React项目结构"
```

---

## Chunk 2: 数据和类型定义

### Task 3: 定义类型和清单数据

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/checklistData.ts`

- [ ] **Step 1: 创建 src/types/index.ts**

```typescript
export type RoleType =
  | "high_school"
  | "bachelor_in_progress"
  | "bachelor_graduated"
  | "master_in_progress"
  | "master_graduated";

export interface Role {
  id: RoleType;
  name: string;
  description: string;
  gradient: string;
}

export interface ChecklistItem {
  id: number;
  name: string;
  requirement: "原件" | "复印件" | "原件+复印件";
  isKey: boolean;
  notes: string;
}

export interface ChecklistData {
  common: ChecklistItem[];
  roleSpecific: Record<RoleType, ChecklistItem[]>;
}

export interface UserProgress {
  roleId: RoleType;
  completedItems: number[];
  lastUpdated: string;
}
```

- [ ] **Step 2: 创建 src/data/checklistData.ts**

```typescript
import { Role, ChecklistItem, ChecklistData } from "../types";

export const roles: Role[] = [
  {
    id: "high_school",
    name: "高中毕业",
    description: "高中毕业，去德国读本科",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "bachelor_in_progress",
    name: "大学在读",
    description: "本科在读，申请德国硕士",
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    id: "bachelor_graduated",
    name: "大学毕业",
    description: "本科毕业，申请德国硕士",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    id: "master_in_progress",
    name: "硕士在读",
    description: "硕士在读，申请德国博士或二硕",
    gradient: "from-indigo-400 to-blue-500",
  },
  {
    id: "master_graduated",
    name: "硕士毕业",
    description: "硕士毕业，申请德国博士或二硕",
    gradient: "from-rose-400 to-pink-500",
  },
];

// 通用材料（所有角色）
export const commonItems: ChecklistItem[] = [
  { id: 1, name: "护照", requirement: "原件", isKey: false, notes: "" },
  { id: 2, name: "照片", requirement: "原件", isKey: false, notes: "35x45mm，白底，六个月内近照" },
  { id: 3, name: "VIDEX二维码打印件的第七页", requirement: "原件", isKey: false, notes: "" },
  {
    id: 4,
    name: "德国高校录取通知书或大学预备语言班报名证明",
    requirement: "原件",
    isKey: true,
    notes: ""
  },
  { id: 5, name: "经济来源证明", requirement: "原件", isKey: true, notes: "" },
  { id: 6, name: "入境后医疗保险证明", requirement: "原件", isKey: true, notes: "" },
  { id: 7, name: "留德人员审核部的审核证书/审核证明/审核传真", requirement: "原件", isKey: true, notes: "" },
  { id: 8, name: "语言水平证明", requirement: "原件", isKey: true, notes: "" },
  { id: 9, name: "签证申请表原件", requirement: "复印件", isKey: false, notes: "首页粘贴护照照片，末页亲笔签名" },
  { id: 10, name: "《居留法》条款告知书", requirement: "复印件", isKey: false, notes: "亲笔签名" },
  { id: 11, name: "护照照片页复印件", requirement: "复印件", isKey: false, notes: "" },
  {
    id: 12,
    name: "德国高校录取通知书复印件 或 大学预备语言班报名证明复印件",
    requirement: "复印件",
    isKey: false,
    notes: ""
  },
  { id: 13, name: "大学授课语言和要求达到的语言级别的说明", requirement: "复印件", isKey: false, notes: "" },
  { id: 14, name: "经济来源证明复印件", requirement: "复印件", isKey: false, notes: "" },
  { id: 15, name: "语言水平证明复印件", requirement: "复印件", isKey: false, notes: "中文证明须附德文或英文翻译" },
  { id: 16, name: "德文或英文个人简历", requirement: "复印件", isKey: false, notes: "至今为止无间断经历" },
  { id: 17, name: "德文或英文留学动机说明", requirement: "复印件", isKey: false, notes: "亲笔签名" },
  { id: 18, name: "留德人员审核部审核证书/审核证明/审核传真的复印件", requirement: "复印件", isKey: false, notes: "" },
  { id: 19, name: "入境后医疗保险证明复印件", requirement: "复印件", isKey: false, notes: "" },
];

// 角色特定材料
export const roleSpecificItems = {
  high_school: [
    { id: 20, name: "高中毕业证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "高中毕业证书复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  bachelor_in_progress: [
    { id: 20, name: "中国高校在读证明/休学证明/退学证明", requirement: "原件", isKey: true, notes: "适用于中国高校在读生，需翻译" },
    { id: 21, name: "中国高校在读证明/休学证明/退学证明的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  bachelor_graduated: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  master_in_progress: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  master_graduated: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "硕士毕业证书和硕士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 22, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
    { id: 23, name: "硕士毕业证书和硕士学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
} as const;

export const checklistData: ChecklistData = {
  common: commonItems,
  roleSpecific: roleSpecificItems as Record<string, ChecklistItem[]>,
};

export function getChecklistForRole(roleId: string): ChecklistItem[] {
  const common = [...commonItems];
  const specific = roleSpecificItems[roleId as keyof typeof roleSpecificItems] || [];
  return [...common, ...specific];
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/data/checklistData.ts
git commit -m "feat: 添加类型定义和清单数据"
```

---

## Chunk 3: 状态管理

### Task 4: 创建Zustand状态管理

**Files:**
- Create: `src/stores/useAppStore.ts`

- [ ] **Step 1: 创建 src/stores/useAppStore.ts**

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RoleType, UserProgress } from "../types";

interface AppState {
  currentPage: "role-select" | "checklist";
  selectedRole: RoleType | null;
  completedItems: Record<RoleType, number[]>;

  // Actions
  setCurrentPage: (page: "role-select" | "checklist") => void;
  setSelectedRole: (role: RoleType | null) => void;
  toggleItem: (itemId: number) => void;
  isItemCompleted: (itemId: number) => boolean;
  getProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: "role-select",
      selectedRole: null,
      completedItems: {
        high_school: [],
        bachelor_in_progress: [],
        bachelor_graduated: [],
        master_in_progress: [],
        master_graduated: [],
      },

      setCurrentPage: (page) => set({ currentPage: page }),

      setSelectedRole: (role) => set({ selectedRole: role }),

      toggleItem: (itemId) => {
        const { selectedRole, completedItems } = get();
        if (!selectedRole) return;

        const roleItems = completedItems[selectedRole];
        const newItems = roleItems.includes(itemId)
          ? roleItems.filter((id) => id !== itemId)
          : [...roleItems, itemId];

        set({
          completedItems: {
            ...completedItems,
            [selectedRole]: newItems,
          },
        });
      },

      isItemCompleted: (itemId) => {
        const { selectedRole, completedItems } = get();
        if (!selectedRole) return false;
        return completedItems[selectedRole]?.includes(itemId) || false;
      },

      getProgress: () => {
        const { selectedRole, completedItems } = get();
        if (!selectedRole) return { completed: 0, total: 0, percentage: 0 };

        const total = 21; // 高中毕业21项，其他角色更多
        const completed = completedItems[selectedRole]?.length || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
      },

      resetProgress: () => set({
        completedItems: {
          high_school: [],
          bachelor_in_progress: [],
          bachelor_graduated: [],
          master_in_progress: [],
          master_graduated: [],
        },
      }),
    }),
    {
      name: "visa-checklist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/useAppStore.ts
git commit -m "feat: 添加Zustand状态管理"
```

---

## Chunk 4: UI组件

### Task 5: 创建角色选择页面

**Files:**
- Create: `src/pages/RoleSelectPage.tsx`

- [ ] **Step 1: 创建 src/pages/RoleSelectPage.tsx**

```typescript
import { motion } from "framer-motion";
import { roles } from "../data/checklistData";
import { useAppStore } from "../stores/useAppStore";
import { GraduationCap } from "@phosphor-icons/react";

export function RoleSelectPage() {
  const { setCurrentPage, setSelectedRole } = useAppStore();

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId as any);
    setCurrentPage("checklist");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mb-6 shadow-lg shadow-purple-500/25"
          >
            <GraduationCap size={40} weight="duotone" className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            德国留学签证清单
          </h1>
          <p className="text-slate-500 text-lg">
            选择您的学历背景，获取专属材料清单
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole(role.id)}
              className={`relative p-6 rounded-3xl text-left transition-all duration-300 bg-gradient-to-br ${role.gradient} shadow-lg hover:shadow-xl group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">
                  {role.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <motion.div
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: 更新 App.tsx 使用 RoleSelectPage**

```typescript
import { RoleSelectPage } from "./pages/RoleSelectPage";

function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === "role-select" ? (
        <RoleSelectPage />
      ) : (
        <div>清单页开发中...</div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 测试页面**

Run: `npm run dev -- --host`
Expected: 看到角色选择页面

- [ ] **Step 4: Commit**

```bash
git add src/pages/RoleSelectPage.tsx src/App.tsx
git commit -m "feat: 添加角色选择页面"
```

---

### Task 6: 创建清单页面组件

**Files:**
- Create: `src/components/ChecklistItem.tsx`
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/ProgressBar.tsx`
- Create: `src/pages/ChecklistPage.tsx`

- [ ] **Step 1: 创建 src/components/ChecklistItem.tsx**

```typescript
import { motion, AnimatePresence } from "framer-motion";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";
import { useState } from "react";
import { ChecklistItem } from "../types";

interface ChecklistItemProps {
  item: ChecklistItem;
  isCompleted: boolean;
  onToggle: () => void;
}

export function ChecklistItemCard({ item, isCompleted, onToggle }: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        ${isCompleted
          ? "bg-emerald-50 border-2 border-emerald-200"
          : item.isKey
            ? "bg-white border-2 border-amber-200 hover:border-amber-300"
            : "bg-white border border-slate-200 hover:border-slate-300"
        }
        ${item.isKey && !isCompleted ? "ring-2 ring-amber-100" : ""}
      `}
    >
      <div className="flex items-start p-4 gap-4">
        {/* 复选框 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`
            flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isCompleted
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 hover:bg-slate-200 border-2 border-slate-300"
            }
          `}
        >
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={18} weight="bold" />
            </motion.div>
          )}
        </motion.button>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`
              font-medium text-slate-900
              ${isCompleted ? "line-through text-slate-500" : ""}
            `}>
              {item.id}. {item.name}
            </span>

            {/* 原件标识 */}
            {item.requirement.includes("原件") && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                ★ 原件
              </motion.span>
            )}

            {/* 重要标识 */}
            {item.isKey && !isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                重要
              </span>
            )}
          </div>

          {/* 展开详情按钮 */}
          {(item.notes || item.requirement !== "原件") && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              {isExpanded ? (
                <CaretUp size={16} />
              ) : (
                <CaretDown size={16} />
              )}
              {isExpanded ? "收起" : "查看详情"}
            </button>
          )}
        </div>
      </div>

      {/* 展开详情 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 pl-12">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {item.requirement !== "原件" && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">要求：</span>
                    {item.requirement}
                  </p>
                )}
                {item.notes && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">备注：</span>
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: 创建 src/components/SearchBar.tsx**

```typescript
import { MagnifyingGlass } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [placeholder, setPlaceholder] = useState("");
  const fullText = "搜索材料名称...";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setPlaceholder(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <MagnifyingGlass
        size={20}
        weight="duotone"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 shadow-sm"
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: 创建 src/components/ProgressBar.tsx**

```typescript
import { motion } from "framer-motion";

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ completed, total, percentage }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">准备进度</span>
        <span className="text-sm font-bold text-slate-900">
          {completed} / {total}
        </span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
        />
      </div>

      <div className="mt-2 text-center">
        <motion.span
          key={percentage}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 src/pages/ChecklistPage.tsx**

```typescript
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, HouseLine } from "@phosphor-icons/react";
import { useAppStore } from "../stores/useAppStore";
import { roles, getChecklistForRole } from "../data/checklistData";
import { ChecklistItemCard } from "../components/ChecklistItem";
import { SearchBar } from "../components/SearchBar";
import { ProgressBar } from "../components/ProgressBar";

export function ChecklistPage() {
  const {
    selectedRole,
    setCurrentPage,
    setSelectedRole,
    toggleItem,
    isItemCompleted,
    completedItems
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");

  const role = roles.find((r) => r.id === selectedRole);
  const allItems = useMemo(() => {
    if (!selectedRole) return [];
    return getChecklistForRole(selectedRole);
  }, [selectedRole]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const query = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query)
    );
  }, [allItems, searchQuery]);

  const completed = selectedRole ? completedItems[selectedRole]?.length || 0 : 0;
  const total = allItems.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleBack = () => {
    setCurrentPage("role-select");
    setSelectedRole(null);
  };

  if (!role) {
    return <div>请先选择角色</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-10"
      >
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={24} weight="bold" className="text-slate-600" />
            </motion.button>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">
                {role.name} - 签证清单
              </h1>
              <p className="text-sm text-slate-500">{role.description}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <HouseLine size={24} weight="bold" className="text-slate-600" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 主内容 */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 搜索栏 */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* 进度条 */}
        <ProgressBar completed={completed} total={total} percentage={percentage} />

        {/* 清单列表 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              未找到匹配的材料
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ChecklistItemCard
                  item={item}
                  isCompleted={isItemCompleted(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 更新 App.tsx**

```typescript
import { RoleSelectPage } from "./pages/RoleSelectPage";
import { ChecklistPage } from "./pages/ChecklistPage";
import { useAppStore } from "./stores/useAppStore";

function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === "role-select" ? (
        <RoleSelectPage />
      ) : (
        <ChecklistPage />
      )}
    </div>
  );
}

export default App;
```

- [ ] **Step 6: 测试应用**

Run: `npm run dev -- --host`
Expected: 可以选择角色，查看清单，勾选材料

- [ ] **Step 7: Commit**

```bash
git add src/components/ src/pages/
git commit -m "feat: 添加清单页面和组件"
```

---

## Chunk 5: 构建和测试

### Task 7: 构建桌面应用

**Files:**
- Modify: `src-tauri/tauri.conf.json`
- Run: 构建命令

- [ ] **Step 1: 更新 tauri.conf.json 添加构建配置**

```json
{
  "build": {
    "devtools": true
  }
}
```

- [ ] **Step 2: 运行前端构建测试**

Run: `npm run build`
Expected: 构建成功，dist目录生成

- [ ] **Step 3: 构建Tauri应用**

Run: `npm run tauri build`
Expected: 构建成功，生成可执行文件

- [ ] **Step 4: 最终Commit**

```bash
git add .
git commit -m "feat: 完成德国留学签证清单应用"
```

---

## 计划完成

计划已保存到 `docs/superpowers/plans/2025-03-11-visa-checklist-implementation.md`。准备执行？
