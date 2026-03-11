import { motion, AnimatePresence } from "framer-motion";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";
import { useState } from "react";
import { ChecklistItem as ChecklistItemType } from "../types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
}

export function ChecklistItemCard({ item, isCompleted, onToggle }: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        ${isCompleted
          ? "bg-emerald-50 border-2 border-emerald-200"
          : item.isKey
            ? "bg-white border-2 border-amber-200 hover:border-amber-300"
            : "bg-white border border-slate-200 hover:border-slate-300"
        }
        ${item.isKey && !isCompleted ? "ring-2 ring-amber-100" : ""}
      `}
    >
      <div className="flex items-start p-4 gap-4">
        {/* 复选框 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`
            flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isCompleted
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 hover:bg-slate-200 border-2 border-slate-300"
            }
          `}
        >
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={18} weight="bold" />
            </motion.div>
          )}
        </motion.button>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`
              font-medium text-slate-900
              ${isCompleted ? "line-through text-slate-500" : ""}
            `}>
              {item.id}. {item.name}
            </span>

            {/* 原件标识 */}
            {item.requirement.includes("原件") && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                ★ 原件
              </motion.span>
            )}

            {/* 重要标识 */}
            {item.isKey && !isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                重要
              </span>
            )}
          </div>

          {/* 展开详情按钮 */}
          {(item.notes || item.requirement !== "原件") && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              {isExpanded ? (
                <CaretUp size={16} />
              ) : (
                <CaretDown size={16} />
              )}
              {isExpanded ? "收起" : "查看详情"}
            </button>
          )}
        </div>
      </div>

      {/* 展开详情 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 pl-12">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {item.requirement !== "原件" && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">要求：</span>
                    {item.requirement}
                  </p>
                )}
                {item.notes && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">备注：</span>
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
