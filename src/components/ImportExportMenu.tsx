import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DotsThree,
  Export,
  ArrowCounterClockwise,
  DownloadSimple,
} from "@phosphor-icons/react";
import { message, confirm } from "@tauri-apps/plugin-dialog";
import { exportToExcel, importFromExcel, resetToDefault } from "../utils/excel";

export function ImportExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async () => {
    setIsOpen(false);
    const success = await exportToExcel();
    if (success) {
      await message("导出成功！", { title: "提示", kind: "info" });
    }
  };

  const handleImport = async () => {
    setIsOpen(false);
    const success = await importFromExcel();
    if (success) {
      await message("导入成功！", { title: "提示", kind: "info" });
    }
  };

  const handleReset = async () => {
    setIsOpen(false);
    const confirmed = await confirm(
      "确定要重置当前角色的清单吗？\n这将清除所有已勾选的项目。",
      {
        title: "确认重置",
        kind: "warning",
      }
    );

    if (confirmed) {
      resetToDefault();
      await message("已重置到默认清单。", { title: "提示", kind: "info" });
    }
  };

  const menuItems = [
    {
      icon: Export,
      label: "导出清单",
      onClick: handleExport,
      color: "text-success",
    },
    {
      icon: DownloadSimple,
      label: "导入清单",
      onClick: handleImport,
      color: "text-accent",
    },
    {
      icon: ArrowCounterClockwise,
      label: "重置清单",
      onClick: handleReset,
      color: "text-warning",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="更多操作"
        className="p-2 rounded-lg hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors"
      >
        <DotsThree size={24} weight="bold" className="text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 bg-card rounded-xl shadow-lg border border-border/50 py-2 z-50"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-page transition-colors text-left"
              >
                <item.icon
                  size={20}
                  weight="duotone"
                  className={item.color}
                />
                <span className="text-[14px] text-primary">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
