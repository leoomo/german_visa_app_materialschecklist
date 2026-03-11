import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MagnifyingGlass, FolderOpen } from "@phosphor-icons/react";
import { useAppStore } from "../stores/useAppStore";
import { roles, getChecklistForRole } from "../data/checklistData";
import { ChecklistItemCard } from "../components/ChecklistItem";

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
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col">
      {/* 顶部导航 */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/80 backdrop-blur-xl shrink-0 sticky top-0 z-10"
      >
        <div className="max-w-[680px] mx-auto px-5 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-[#f5f5f7] transition-colors"
            >
              <ArrowLeft size={22} weight="bold" className="text-[#1d1d1f]" />
            </motion.button>

            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] truncate">
                {role.name}
              </h1>
              <p className="text-[12px] text-[#86868b] truncate">{role.description}</p>
            </div>

            {/* 进度指示器 */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">
                  {percentage}%
                </div>
                <div className="text-[11px] text-[#86868b] -mt-0.5">
                  {completed}/{total}
                </div>
              </div>
              {/* 圆形进度 */}
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#e8e8ed"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#34c759"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: percentage / 100 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    strokeDasharray="100.53"
                    strokeDashoffset="0"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 主内容 */}
      <div className="flex-1 max-w-[680px] mx-auto w-full px-5 py-5 space-y-3 overflow-y-auto">
        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <MagnifyingGlass
            size={18}
            weight="duotone"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索材料..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border-0 bg-[#e8e8ed] text-[15px] text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#34c759]/20 transition-all duration-200"
          />
        </motion.div>

        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="h-2 bg-[#e8e8ed] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="h-full bg-[#34c759] rounded-full"
            />
          </div>
        </motion.div>

        {/* 清单列表 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2.5"
        >
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#e8e8ed] flex items-center justify-center">
                <FolderOpen size={28} weight="duotone" className="text-[#86868b]" />
              </div>
              <p className="text-[15px] text-[#86868b]">未找到匹配的材料</p>
              <p className="text-[13px] text-[#86868b]/60 mt-1">尝试其他关键词</p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25 + index * 0.03,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
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
