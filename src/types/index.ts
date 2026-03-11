export type RoleType =
  | "bachelor_in_progress"
  | "bachelor_graduated"
  | "master_in_progress"
  | "master_graduated";

export interface Role {
  id: RoleType;
  name: string;
  description: string;
}

export interface ChecklistItem {
  id: number;
  name: string;
  requirement: "原件" | "复印件" | "原件+复印件";
  isKey: boolean;
  notes: string;
  details?: string[];  // 完整详情列表（悬浮显示）
}

export interface ChecklistData {
  common: ChecklistItem[];
  roleSpecific: Record<string, ChecklistItem[]>;
}

export interface UserProgress {
  roleId: RoleType;
  completedItems: number[];
  lastUpdated: string;
}

export type FilterType = "all" | "pending" | "completed";
