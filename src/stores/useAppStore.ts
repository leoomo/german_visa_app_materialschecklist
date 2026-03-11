import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RoleType } from "../types";

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

        // 根据角色计算总数
        const totals: Record<RoleType, number> = {
          high_school: 21,
          bachelor_in_progress: 21,
          bachelor_graduated: 21,
          master_in_progress: 21,
          master_graduated: 23,
        };

        const total = totals[selectedRole] || 21;
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
