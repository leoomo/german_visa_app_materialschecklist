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

export type ItemSection = "原件" | "复印件" | "前提";

export interface ChecklistItem {
  id: number;  // 显示编号（在section内）
  section: ItemSection;  // 所属部分
  itemId: string;  // 唯一标识符（用于追踪完成状态）
  name: string;
  requirement: "原件" | "复印件" | "原件+复印件" | "原件+复印件+翻译" | "复印件+翻译" | "确认";
  isKey: boolean;
  notes: string;
  details?: string[];
}

export interface UserProgress {
  roleId: RoleType;
  completedItems: string[];  // 使用 itemId 字符串
  lastUpdated: string;
}

export type FilterType = "all" | "pending" | "completed";
