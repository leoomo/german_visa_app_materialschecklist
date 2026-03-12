import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MagnifyingGlass, FolderOpen } from "@phosphor-icons/react";
import { useAppStore } from "../stores/useAppStore";
import { roles, getChecklistForRole } from "../data/checklistData";
import { ChecklistItemCard } from "../components/ChecklistItem";
import { ImportExportMenu } from "../components/ImportExportMenu";
import { FilterType, ChecklistItem } from "../types";

// 区块标题组件
function SectionHeader({
  title,
  subtitle,
  index
}: {
  title: string;
  subtitle?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.2),
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="mb-3"
    >
      <h2 className="text-[15px] font-semibold text-primary tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[12px] text-secondary mt-0.5">{subtitle}</p>
      )}
    </motion.div>
  );
}

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

  // Use Set for O(1) lookup
  const completedSet = useMemo(
    () => new Set(selectedRole ? (completedItems[selectedRole] || []) : []),
    [completedItems, selectedRole]
  );

  // 按区块分组并筛选
  const { filteredOriginalItems, filteredCopyItems } = useMemo(() => {
    const originals: ChecklistItem[] = [];
    const copies: ChecklistItem[] = [];

    allItems.forEach(item => {
      if (item.section === "原件") {
        originals.push(item);
      } else {
        copies.push(item);
      }
    });

    // 筛选逻辑
    const applyFilter = (items: ChecklistItem[]) => {
      let result = items;

      if (filter === "pending") {
        result = result.filter(item => !completedSet.has(item.itemId));
      } else if (filter === "completed") {
        result = result.filter(item => completedSet.has(item.itemId));
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          item =>
            item.name.toLowerCase().includes(query) ||
            item.notes.toLowerCase().includes(query)
        );
      }

      return result;
    };

    return {
      filteredOriginalItems: applyFilter(originals),
      filteredCopyItems: applyFilter(copies)
    };
  }, [allItems, searchQuery, filter, completedSet]);

  const completed = completedSet.size;
  const total = allItems.length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 进度颜色 - 使用固定的绿色确保对比度，使用 useMemo 避免重复计算
  const progressColor = useMemo(() => {
    const saturation = 85;
    const lightness = percentage < 25 ? 45 : 50;
    return `hsl(120, ${saturation}%, ${lightness}%)`;
  }, [percentage]);

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

  const hasNoResults = filteredOriginalItems.length === 0 && filteredCopyItems.length === 0;

  return (
    <div className="min-h-[100dvh] w-full bg-page flex flex-col">
      {/* 顶部导航 */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card/80 backdrop-blur-xl shrink-0 sticky top-0 z-10 relative"
      >
        <div className="max-w-full md:max-w-[600px] lg:max-w-[700px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              aria-label="返回选择角色"
              className="p-2 -ml-2 rounded-lg hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors"
            >
              <ArrowLeft size={22} weight="bold" className="text-primary" />
            </motion.button>

            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-semibold tracking-tight text-primary">
                {role.name}
              </h1>
              <p className="text-[13px] text-secondary">{role.description}</p>
            </div>

            {/* 进度数字 */}
            <div className="shrink-0 text-right">
              <div
                className="text-[24px] font-semibold tracking-tight leading-none"
                style={{ color: progressColor }}
              >
                {percentage}%
              </div>
              <div className="text-[11px] text-secondary mt-0.5">{completed}/{total}</div>
            </div>

            <ImportExportMenu />
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
            style={{ background: progressColor }}
          />
        </motion.div>
        <div className="absolute bottom-0 right-0 h-[2px] bg-border" style={{ left: `${percentage}%` }} />
      </motion.header>

      {/* 主内容 */}
      <div className="flex-1 max-w-full md:max-w-[600px] lg:max-w-[700px] mx-auto w-full px-6 py-5 space-y-4 overflow-y-auto">
        {/* 搜索 + 筛选 */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={18}
              weight="duotone"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..."
              aria-label="搜索材料名称或备注"
              className="w-full h-10 pl-11 pr-4 rounded-xl border-0 bg-card text-[14px] text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-success/20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all duration-200"
            />
          </div>

          <div className="flex bg-card rounded-xl p-1 shrink-0">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`
                  px-3 h-8 rounded-lg text-[13px] font-medium transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1
                  ${filter === f.key
                    ? "bg-success text-white"
                    : "text-secondary hover:text-primary"
                  }
                `}
              >
                {f.label}
                <span className={filter === f.key ? "text-white/70" : "text-secondary/60"}> {f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 清单列表 - 分区块显示 */}
        {hasNoResults ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-border flex items-center justify-center">
              <FolderOpen size={24} weight="duotone" className="text-secondary" />
            </div>
            <p className="text-[15px] text-secondary">未找到匹配的材料</p>
            <p className="text-[13px] text-secondary/60 mt-1">尝试其他关键词</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 区块一：以下材料须递交原件 */}
            {filteredOriginalItems.length > 0 && (
              <div>
                <SectionHeader
                  title="以下材料须递交原件"
                  index={0}
                />
                <div className="space-y-2">
                  {filteredOriginalItems.map((item, index) => (
                    <ChecklistItemCard
                      key={item.itemId}
                      item={item}
                      isCompleted={completedSet.has(item.itemId)}
                      onToggle={() => toggleItem(item.itemId)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 区块二：下列材料须按顺序整理，递交完整的一套 */}
            {filteredCopyItems.length > 0 && (
              <div>
                <SectionHeader
                  title="下列材料须按顺序整理，递交完整的一套"
                  subtitle="复印件单面打印，不可装订"
                  index={1}
                />
                <div className="space-y-2">
                  {filteredCopyItems.map((item, index) => (
                    <ChecklistItemCard
                      key={item.itemId}
                      item={item}
                      isCompleted={completedSet.has(item.itemId)}
                      onToggle={() => toggleItem(item.itemId)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 注意事项 */}
        <div className="mt-6 py-4 border-t border-border/50">
          <p className="text-[12px] text-secondary text-center">
            <span className="font-medium">注意事项:</span>
            {" "}公证件需复印
          </p>
        </div>
      </div>
    </div>
  );
}
