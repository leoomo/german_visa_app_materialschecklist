# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

German Student Visa Checklist Desktop Application (德国留学签证材料清单) - A bilingual (Chinese) desktop app helping students in Shanghai prepare German student visa application materials based on official requirements from the German Consulate Shanghai.

## Tech Stack

- **Tauri v2** - Desktop framework (Rust backend)
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management with localStorage persistence
- **Framer Motion** - Animations
- **Vite** - Build tool

## Common Commands

```bash
# Install dependencies
npm install

# Start Vite dev server (port 1420)
npm run dev

# TypeScript check + Vite build
npm run build

# Preview built app
npm run preview

# Build desktop app (.exe/.dmg)
npm run tauri build
```

## Architecture

```
src/
├── App.tsx                 # Main app component
├── main.tsx               # React entry point
├── components/            # Reusable components
│   └── ChecklistItem.tsx  # Checklist item component
├── pages/                 # Page components
│   ├── RoleSelectPage.tsx # Role selection page
│   └── ChecklistPage.tsx  # Main checklist page
├── stores/                # State management
│   └── useAppStore.ts     # Zustand store with persistence
├── data/                  # Static data
│   └── checklistData.ts   # Visa checklist data (source of truth)
└── types/                 # TypeScript types
    └── index.ts           # Type definitions

src-tauri/
├── src/
│   ├── lib.rs             # Tauri entry point
│   └── main.rs            # Rust main
├── Cargo.toml             # Rust dependencies
└── tauri.conf.json        # Tauri config
```

## Key Features

1. **Role-based checklists** - Four academic backgrounds: Bachelor in progress, Bachelor graduated, Master in progress, Master graduated
2. **Material categorization** - Divided into "Originals" (原件) and "Copies" (复印件)
3. **Progress tracking** - Real-time completion percentage with visual progress bar
4. **Search** - Quick filtering of checklist items
5. **Persistence** - Checked items saved to localStorage

## Data Source

Checklist data in `src/data/checklistData.ts` is based on:
- "Shanghai Student Visa Special Notice" (上海留学签证特别提示) October 2025 edition
- German Embassy official website

## Important Notes

- The app window is configured to 900x700 pixels in `src-tauri/tauri.conf.json`
- State persistence uses Zustand with localStorage in `src/stores/useAppStore.ts`
- Tailwind theme uses custom colors defined in `tailwind.config.js`
