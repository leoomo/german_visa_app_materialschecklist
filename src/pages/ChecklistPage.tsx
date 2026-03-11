import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MagnifyingGlass, FolderOpen } from "@phosphor-icons/react";
import { useAppStore } from "../stores/useAppStore";
import { roles, getChecklistForRole } from "../data/checklistData";
import { ChecklistItemCard } from "../components/ChecklistItem";
import { FilterType } from "../types";

export function ChecklistPage() {
  const {
    selectedRole,
    setCurrentPage,
    setSelectedRole,
    toggleItem,
    completedItems
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const role = roles.find((r) => r.id === selectedRole);
  const allItems = useMemo(() => {
    if (!selectedRole) return [];
    return getChecklistForRole(selectedRole);
  }, [selectedRole]);

  // Use Set for O(1) lookup instead of repeated Array.includes()
  const completedSet = useMemo(
    () => new Set(selectedRole ? (completedItems[selectedRole] || []) : []),
    [completedItems, selectedRole]
  );

  const filteredItems = useMemo(() => {
    let items = allItems;

    // 先按状态筛选
    if (filter === "pending") {
      items = items.filter(item => !completedSet.has(item.id));
    } else if (filter === "completed") {
      items = items.filter(item => completedSet.has(item.id));
    }

    // 再按搜索词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query)
      );
    }

    return items;
  }, [allItems, searchQuery, filter, completedSet]);

  const completed = completedSet.size;
  const total = allItems.length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 进度颜色：使用 easeInOutQuad 缓动函数从红色过渡到绿色
  const getProgressColor = (pct: number): string => {
    const t = pct / 100;
    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const hue = Math.round(eased * 120);
    return `hsl(${hue}, 85%, 50%)`;
  };

  const handleBack = () => {
    setCurrentPage("role-select");
    setSelectedRole(null);
  };

  if (!role) {
    return <div>请先选择角色</div>;
  }

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "全部", count: total },
    { key: "pending", label: "未完成", count: pending },
    { key: "completed", label: "已完成", count: completed },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col">
      {/* 顶部导航 - 带渐变进度底边 */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/80 backdrop-blur-xl shrink-0 sticky top-0 z-10 relative"
      >
        <div className="max-w-[560px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-[#f5f5f7] transition-colors"
            >
              <ArrowLeft size={22} weight="bold" className="text-[#1d1d1f]" />
            </motion.button>

            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
                {role.name}
              </h1>
              <p className="text-[13px] text-[#86868b]">{role.description}</p>
            </div>

            {/* 进度数字 */}
            <div className="shrink-0 text-right">
              <div
                className="text-[24px] font-semibold tracking-tight leading-none"
                style={{ color: getProgressColor(percentage) }}
              >
                {percentage}%
              </div>
              <div className="text-[11px] text-[#86868b] mt-0.5">{completed}/{total}</div>
            </div>
          </div>
        </div>

        {/* 渐变进度底边 */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div
            className="h-full w-full"
            style={{ background: getProgressColor(percentage) }}
          />
        </motion.div>

        {/* 底部剩余部分淡色线 */}
        <div className="absolute bottom-0 right-0 h-[2px] bg-[#e8e8ed]" style={{ left: `${percentage}%` }} />
      </motion.header>

      {/* 主内容 */}
      <div className="flex-1 max-w-[560px] mx-auto w-full px-6 py-5 space-y-4 overflow-y-auto">
        {/* 搜索 + 筛选 */}
        <div className="flex gap-3">
          {/* 搜索栏 */}
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              weight="duotone"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..."
              className="w-full h-10 pl-11 pr-4 rounded-xl border-0 bg-white text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#34c759]/20 transition-all duration-200"
            />
          </div>

          {/* 筛选标签 */}
          <div className="flex bg-white rounded-xl p-1 shrink-0">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`
                  px-3 h-8 rounded-lg text-[13px] font-medium transition-all duration-200
                  ${filter === f.key
                    ? "bg-[#34c759] text-white"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                  }
                `}
              >
                {f.label}
                <span className={filter === f.key ? "text-white/70" : "text-[#86868b]/60"}> {f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 清单列表 */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#e8e8ed] flex items-center justify-center">
                <FolderOpen size={24} weight="duotone" className="text-[#86868b]" />
              </div>
              <p className="text-[15px] text-[#86868b]">未找到匹配的材料</p>
              <p className="text-[13px] text-[#86868b]/60 mt-1">尝试其他关键词</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <ChecklistItemCard
                key={item.id}
                item={item}
                isCompleted={completedSet.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                index={index}
              />
            ))
          )}
        </div>

        {/* 注意事项 */}
        <div className="mt-6 py-4 border-t border-[#e8e8ed]/50">
          <p className="text-[12px] text-[#86868b] text-center">
            <span className="font-medium">注意事项:</span>
            {" "}复印件单面打印 · 不可装订 · 公证件需复印
          </p>
        </div>
      </div>
    </div>
  );
}
