import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RoleType } from "../types";
import { getChecklistForRole } from "../data/checklistData";

interface AppState {
  currentPage: "role-select" | "checklist";
  selectedRole: RoleType | null;
  completedItems: Record<RoleType, string[]>;

  // Actions
  setCurrentPage: (page: "role-select" | "checklist") => void;
  setSelectedRole: (role: RoleType | null) => void;
  toggleItem: (itemId: string) => void;
  isItemCompleted: (itemId: string) => boolean;
  getProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
  cleanupInvalidItems: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: "role-select",
      selectedRole: null,
      completedItems: {
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

        const allItems = getChecklistForRole(selectedRole);
        const validItemIds = new Set(allItems.map(item => item.itemId));
        const total = allItems.length;

        // 只统计存在于当前角色清单中的已完成项
        const roleCompleted = completedItems[selectedRole] || [];
        const completed = roleCompleted.filter(itemId => validItemIds.has(itemId)).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
      },

      resetProgress: () => set({
        completedItems: {
          bachelor_in_progress: [],
          bachelor_graduated: [],
          master_in_progress: [],
          master_graduated: [],
        },
      }),

      cleanupInvalidItems: () => {
        const { completedItems } = get();
        const roles: RoleType[] = ["bachelor_in_progress", "bachelor_graduated", "master_in_progress", "master_graduated"];

        const cleanedItems = { ...completedItems };

        roles.forEach(role => {
          const validItems = new Set(getChecklistForRole(role).map(item => item.itemId));
          const roleCompleted = completedItems[role] || [];
          cleanedItems[role] = roleCompleted.filter(itemId => validItems.has(itemId));
        });

        set({ completedItems: cleanedItems });
      },
    }),
    {
      name: "visa-checklist-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // 从 localStorage 恢复后，清理无效的 completedItems
        if (state) {
          state.cleanupInvalidItems();
        }
      },
    }
  )
);
