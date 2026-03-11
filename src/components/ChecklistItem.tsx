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
      className={`
        group relative rounded-2xl overflow-hidden transition-all duration-200
        ${isCompleted
          ? "bg-emerald-50/60"
          : "bg-white"
        }
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
        hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)]
        border border-slate-100
      `}
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
                ? "bg-emerald-500 text-white shadow-[0_2px_8px_-2px_rgba(16,185,129,0.4)]"
                : "bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 group-hover:border-slate-400"
              }
            `}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check size={16} weight="bold" />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* 左侧色条 */}
        <div className={`
          w-[3px] self-stretch transition-colors duration-300
          ${isCompleted
            ? "bg-emerald-400"
            : item.isKey
              ? "bg-amber-400"
              : "bg-slate-200 group-hover:bg-slate-300"
          }
        `} />

        {/* 内容 */}
        <div className="flex-1 min-w-0 px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`
                  font-medium text-[15px] text-slate-800
                  ${isCompleted ? "line-through text-slate-400" : ""}
                `}>
                  {item.id}. {item.name}
                </span>
              </div>

              {/* 详情信息 - 非原件时显示 */}
              {item.requirement !== "原件" && (
                <div className="flex items-center gap-2 flex-wrap text-[13px]">
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-md
                    ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}
                  `}>
                    {item.requirement}
                  </span>
                  {item.notes && (
                    <span className="text-slate-500">
                      {item.notes}
                    </span>
                  )}
                </div>
              )}

              {/* 原件 + 重要标签 */}
              {(item.requirement.includes("原件") || item.isKey) && (
                <div className="flex items-center gap-2 mt-1.5">
                  {item.requirement.includes("原件") && (
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium
                      ${isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }
                    `}>
                      原件
                    </span>
                  )}
                  {item.isKey && !isCompleted && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium bg-amber-100 text-amber-700">
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
