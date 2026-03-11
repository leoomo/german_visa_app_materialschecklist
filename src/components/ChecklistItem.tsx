import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info } from "@phosphor-icons/react";
import { ChecklistItem as ChecklistItemType } from "../types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}

export function ChecklistItemCard({ item, isCompleted, onToggle, index }: ChecklistItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const hasDetails = item.details && item.details.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.4),
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="relative"
      onMouseEnter={() => hasDetails && setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <motion.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl overflow-hidden bg-white cursor-pointer transition-shadow duration-200 hover:shadow-md"
        onClick={onToggle}
      >
        <div className="flex items-stretch">
          {/* 复选框 */}
          <div className="flex items-center px-4">
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                transition-all duration-200
                ${isCompleted
                  ? "bg-[#34c759] text-white"
                  : "bg-[#e8e8ed]"
                }
              `}
            >
              {isCompleted && <Check size={14} weight="bold" />}
            </div>
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`
                font-medium text-[15px] tracking-tight transition-all duration-200
                ${isCompleted ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}
              `}>
                {item.id}. {item.name}
              </span>

              {item.requirement !== "原件" && (
                <span className="text-[12px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-md">
                  {item.requirement}
                </span>
              )}
              {item.requirement.includes("原件") && (
                <span className={`
                  text-[12px] font-medium px-2 py-0.5 rounded-md
                  ${isCompleted ? "bg-[#e8f5e9] text-[#34c759]" : "bg-[#fff7e6] text-[#ff9500]"}
                `}>
                  原件
                </span>
              )}
              {item.isKey && !isCompleted && (
                <span className="text-[12px] font-medium bg-[#fff7e6] text-[#ff9500] px-2 py-0.5 rounded-md">
                  重要
                </span>
              )}
              {hasDetails && !isCompleted && (
                <Info size={14} weight="fill" className="text-[#86868b]/50" />
              )}
            </div>

            {item.notes && !isCompleted && (
              <p className="text-[13px] text-[#86868b] mt-0.5">{item.notes}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 悬浮详情面板 */}
      <AnimatePresence>
        {showDetails && hasDetails && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-full top-0 ml-3 z-20 w-64"
          >
            <div className="bg-white rounded-xl shadow-lg border border-[#e8e8ed] p-4">
              <div className="text-[13px] font-medium text-[#1d1d1f] mb-2 flex items-center gap-2">
                <Info size={14} weight="fill" className="text-[#34c759]" />
                {item.name}
              </div>
              <ul className="space-y-1.5">
                {item.details!.map((detail, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#86868b] flex items-start gap-2"
                  >
                    <span className="text-[#34c759] mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
