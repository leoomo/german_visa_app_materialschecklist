import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { ChecklistItem as ChecklistItemType } from "../types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
}

export function ChecklistItemCard({ item, isCompleted, onToggle }: ChecklistItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-sm hover:shadow-md"
    >
      <div className="flex items-stretch">
        {/* 复选框 */}
        <div className="flex items-center px-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onToggle}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center
              transition-all duration-200
              ${isCompleted
                ? "bg-[#34c759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)]"
                : "bg-[#e8e8ed] hover:bg-[#d1d1d6]"
              }
            `}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check size={14} weight="bold" />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* 左侧色条 */}
        <div className={`
          w-[3px] self-stretch transition-colors duration-300
          ${isCompleted
            ? "bg-[#34c759]"
            : item.isKey
              ? "bg-[#ff9500]"
              : "bg-transparent"
          }
        `} />

        {/* 内容 */}
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`
                  font-medium text-[15px] tracking-tight transition-all duration-200
                  ${isCompleted ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}
                `}>
                  {item.id}. {item.name}
                </span>
              </div>

              {/* 详情信息 - 非原件时显示 */}
              {item.requirement !== "原件" && (
                <div className="flex items-center gap-2 flex-wrap text-[13px]">
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-md
                    ${isCompleted ? "bg-[#e8f5e9] text-[#34c759]" : "bg-[#f5f5f7] text-[#86868b]"}
                  `}>
                    {item.requirement}
                  </span>
                  {item.notes && (
                    <span className={isCompleted ? "text-[#81c784]" : "text-[#86868b]"}>
                      {item.notes}
                    </span>
                  )}
                </div>
              )}

              {/* 原件 + 重要标签 */}
              {(item.requirement.includes("原件") || item.isKey) && (
                <div className="flex items-center gap-2 mt-1">
                  {item.requirement.includes("原件") && (
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium
                      ${isCompleted
                        ? "bg-[#e8f5e9] text-[#34c759]"
                        : "bg-[#fff7e6] text-[#ff9500]"
                      }
                    `}>
                      原件
                    </span>
                  )}
                  {item.isKey && !isCompleted && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium bg-[#fff7e6] text-[#ff9500]">
                      重要
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
