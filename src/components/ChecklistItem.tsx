import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CaretDown, Info } from "@phosphor-icons/react";
import { ChecklistItem as ChecklistItemType } from "../types";

// 渲染带可点击链接的文本
function renderTextWithLinks(text: string) {
  // 匹配 https:// 或 domain.com 格式的URL
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}[^\s]*)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007aff] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

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
      className="rounded-2xl overflow-hidden bg-white transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex items-stretch">
        {/* 复选框 */}
        <div
          className="flex items-center px-4 cursor-pointer"
          onClick={onToggle}
        >
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
            <span
              className={`
                font-medium text-[15px] tracking-tight transition-all duration-200 cursor-pointer
                ${isCompleted ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}
              `}
              onClick={onToggle}
            >
              {item.section === "复印件" ? `${item.id}.` : `${item.id}.`} {item.name}
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
          </div>

          {item.notes && !isCompleted && (
            <p className="text-[13px] text-[#86868b] mt-0.5">{renderTextWithLinks(item.notes)}</p>
          )}

          {/* 详情展开按钮 */}
          {hasDetails && !isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="flex items-center gap-1 mt-2 text-[12px] text-[#34c759] font-medium hover:text-[#30d158] transition-colors"
            >
              <Info size={12} weight="fill" />
              <span>详情</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <CaretDown size={12} weight="bold" />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* 展开的详情内容 */}
      <AnimatePresence>
        {showDetails && hasDetails && !isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 ml-[35px] border-t border-[#e8e8ed]/50 mt-2">
              <ul className="space-y-1.5">
                {item.details!.map((detail, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#86868b] flex items-start gap-2"
                  >
                    <span className="text-[#34c759] mt-0.5 shrink-0">•</span>
                    <span>{renderTextWithLinks(detail)}</span>
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
