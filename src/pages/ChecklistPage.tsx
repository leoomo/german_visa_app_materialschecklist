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
