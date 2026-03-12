import * as XLSX from "xlsx";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeFile, readFile } from "@tauri-apps/plugin-fs";
import { getChecklistForRole, roles } from "../data/checklistData";
import { useAppStore } from "../stores/useAppStore";

export interface ExcelRow {
  类别: string;
  清单名称: string;
  详情: string;
}

// 导出清单数据到 Excel
export async function exportToExcel(): Promise<boolean> {
  try {
    const store = useAppStore.getState();
    const { selectedRole } = store;

    if (!selectedRole) return false;

    const role = roles.find((r) => r.id === selectedRole);
    if (!role) return false;

    const items = getChecklistForRole(selectedRole);

    // 3列格式：类别、清单名称、详情
    const data: ExcelRow[] = items.map((item) => ({
      类别: item.section,
      清单名称: item.name,
      详情: item.details?.join("\n") || item.notes || "",
    }));

    // 创建工作簿和单个工作表
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 设置列宽
    worksheet["!cols"] = [
      { wch: 10 }, // 类别
      { wch: 50 }, // 清单名称
      { wch: 50 }, // 详情
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, role.name);

    // 生成 Excel 文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 打开保存对话框
    const filePath = await save({
      defaultPath: `上海签证递签材料清单-${role.name}.xlsx`,
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (!filePath) return false;

    // 写入文件
    await writeFile(filePath, new Uint8Array(excelBuffer));
    return true;
  } catch (error) {
    console.error("导出失败:", error);
    return false;
  }
}

// 从 Excel 导入勾选状态
export async function importFromExcel(): Promise<boolean> {
  try {
    const store = useAppStore.getState();
    const { selectedRole } = store;

    if (!selectedRole) return false;

    // 打开文件选择对话框
    const filePath = await open({
      multiple: false,
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (!filePath) return false;

    // 读取文件
    const fileData = await readFile(filePath as string);
    const workbook = XLSX.read(new Uint8Array(fileData), { type: "array" });

    // 获取当前角色的所有清单项
    const items = getChecklistForRole(selectedRole);

    // 创建名称到itemId的映射
    const nameToItemId = new Map<string, string>();
    for (const item of items) {
      nameToItemId.set(item.name, item.itemId);
    }

    const roleItemsSet = new Set(store.completedItems[selectedRole] || []);

    // 解析第一个工作表
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error("Excel 文件为空或格式不正确");
    }
    const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    // 根据清单名称匹配并更新勾选状态 (使用 Set 实现 O(1) 查找)
    for (const row of data) {
      const itemId = nameToItemId.get(row.清单名称);
      if (itemId) {
        roleItemsSet.add(itemId);
      }
    }

    const roleItems = Array.from(roleItemsSet);

    // 更新 store
    store.completedItems = {
      ...store.completedItems,
      [selectedRole]: roleItems,
    };

    return true;
  } catch (error) {
    console.error("导入失败:", error);
    return false;
  }
}

// 重置当前角色的清单到默认状态
export function resetToDefault(): void {
  const store = useAppStore.getState();
  const selectedRole = store.selectedRole;

  if (!selectedRole) return;

  // 清空当前角色的已完成项目
  store.completedItems = {
    ...store.completedItems,
    [selectedRole]: [],
  };
}
