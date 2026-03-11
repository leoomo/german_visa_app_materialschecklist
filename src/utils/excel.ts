import * as XLSX from "xlsx";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeFile, readFile } from "@tauri-apps/plugin-fs";
import { getChecklistForRole, roles } from "../data/checklistData";
import { useAppStore } from "../stores/useAppStore";

export interface ExcelRow {
  编号: number;
  类别: string;
  材料名称: string;
  份数: string;
  备注: string;
  说明: string;
  完成状态: "是" | "否";
}

// 导出清单数据到 Excel
export async function exportToExcel(): Promise<boolean> {
  try {
    const store = useAppStore.getState();
    const completedItems = store.completedItems;

    // 为每个角色创建工作表
    const workbook = XLSX.utils.book_new();

    for (const role of roles) {
      const roleId = role.id;
      const items = getChecklistForRole(roleId);
      const completedSet = new Set(completedItems[roleId] || []);

      // 按原件/复印件分组
      const originalItems = items.filter((item) => item.section === "原件");
      const copyItems = items.filter((item) => item.section === "复印件");

      // 创建工作表数据
      const originalData: ExcelRow[] = originalItems.map((item) => ({
        编号: item.id,
        类别: item.section,
        材料名称: item.name,
        份数: item.requirement,
        备注: item.notes,
        说明: item.details?.join("\n") || "",
        完成状态: completedSet.has(item.itemId) ? "是" : "否",
      }));

      const copyData: ExcelRow[] = copyItems.map((item) => ({
        编号: item.id,
        类别: item.section,
        材料名称: item.name,
        份数: item.requirement,
        备注: item.notes,
        说明: item.details?.join("\n") || "",
        完成状态: completedSet.has(item.itemId) ? "是" : "否",
      }));

      // 创建工作表
      const originalSheet = XLSX.utils.json_to_sheet(originalData);
      const copySheet = XLSX.utils.json_to_sheet(copyData);

      // 设置列宽
      originalSheet["!cols"] = [
        { wch: 6 },  // 编号
        { wch: 8 },  // 类别
        { wch: 35 }, // 材料名称
        { wch: 10 }, // 份数
        { wch: 30 }, // 备注
        { wch: 40 }, // 说明
        { wch: 8 },  // 完成状态
      ];

      copySheet["!cols"] = originalSheet["!cols"];

      // 添加到工作簿
      XLSX.utils.book_append_sheet(
        workbook,
        originalSheet,
        `${role.name}-原件`
      );
      XLSX.utils.book_append_sheet(workbook, copySheet, `${role.name}-复印件`);
    }

    // 生成 Excel 文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 打开保存对话框
    const filePath = await save({
      defaultPath: "签证清单.xlsx",
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
    // 打开文件选择对话框
    const filePath = await open({
      multiple: false,
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (!filePath) return false;

    // 读取文件
    const fileData = await readFile(filePath as string);
    const workbook = XLSX.read(new Uint8Array(fileData), { type: "array" });

    const store = useAppStore.getState();
    const currentCompletedItems = { ...store.completedItems };

    // 解析每个工作表
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

      // 从工作表名称提取角色
      // 格式: "大学在读-原件", "大学在读-复印件" 等
      const roleName = sheetName.replace("-原件", "").replace("-复印件", "");
      const role = roles.find((r) => r.name === roleName);

      if (!role) continue;

      const roleId = role.id;

      // 更新勾选状态
      for (const row of data) {
        if (row.完成状态 === "是") {
          const itemId = `${row.类别}-${row.编号}`;
          if (!currentCompletedItems[roleId].includes(itemId)) {
            currentCompletedItems[roleId].push(itemId);
          }
        }
      }
    }

    // 更新 store
    store.completedItems = currentCompletedItems;

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
