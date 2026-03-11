import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "@phosphor-icons/react";
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
          className="text-link hover:underline"
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
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDetails = item.details && item.details.length > 0;

  // 处理鼠标悬停展开详情
  useEffect(() => {
    if (isHovered && hasDetails && !isCompleted) {
      // 延迟150ms展开，避免快速划过时频繁展开
      hoverTimeoutRef.current = setTimeout(() => {
        setShowDetails(true);
      }, 150);
    } else {
      // 离开时立即收起
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowDetails(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered, hasDetails, isCompleted]);

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
      className="rounded-2xl overflow-hidden bg-card transition-shadow duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-stretch group">
        {/* 复选框 - 最小 44x44px 触摸区域 (Apple HIG 标准) */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={isCompleted ? "取消完成" : "标记为已完成"}
          className="flex items-center justify-center min-h-[44px] min-w-[44px] px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
          onClick={onToggle}
        >
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center
              transition-all duration-200
              ${isCompleted
                ? "bg-success text-white"
                : "bg-border group-hover:bg-borderLight"
              }
            `}
          >
            {isCompleted && <Check size={14} weight="bold" />}
          </div>
        </button>

        {/* 左侧色条 - 原件黄色，复印件灰色 */}
        <div className={`
          w-[3px] self-stretch transition-colors duration-300
          ${isCompleted
            ? "bg-success"
            : item.section === "原件"
              ? "bg-warning"
              : "bg-borderLight"
          }
        `} />

        {/* 内容 */}
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`
                font-medium text-[15px] tracking-tight transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded
                ${isCompleted ? "text-secondary line-through" : "text-primary"}
              `}
              onClick={onToggle}
            >
              {item.id}. {item.name}
            </span>

            {item.requirement !== "原件" && (
              <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                {item.requirement}
              </span>
            )}
            {item.requirement.includes("原件") && (
              <span className={`
                text-[12px] font-medium px-2 py-0.5 rounded-md
                ${isCompleted ? "bg-successLight text-success" : "bg-warningLight text-warning"}
              `}>
                原件
              </span>
            )}
          </div>

          {item.notes && !isCompleted && (
            <p className="text-[13px] text-secondary mt-0.5">{renderTextWithLinks(item.notes)}</p>
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
            <div className="px-4 pb-3 pt-1 ml-[35px] border-t border-border/50 mt-2">
              <ul className="space-y-1.5">
                {item.details!.map((detail, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-secondary flex items-start gap-2"
                  >
                    <span className="text-success mt-0.5 shrink-0">•</span>
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
