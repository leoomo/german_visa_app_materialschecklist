import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CaretRight, CaretDown } from "@phosphor-icons/react";
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
        <span
          key={i}
          className="text-link hover:underline cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            open(href).catch(console.error);
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

import { open } from "@tauri-apps/plugin-shell";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
  isHovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

export function ChecklistItemCard({ item, isCompleted, onToggle, index, isHovered, onHover, onLeave }: ChecklistItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasDetails = item.details && item.details.length > 0;

  // 处理鼠标悬停展开详情 - 受控模式
  useEffect(() => {
    if (isHovered && hasDetails && !isCompleted) {
      // 延迟50ms展开，避免快速划过时频繁展开
      hoverTimeoutRef.current = setTimeout(() => {
        setShowDetails(true);
      }, 50);
    } else {
      // 离开时立即收起
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // 如果不是手动展开的状态，则收起详情
      setShowDetails(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, [isHovered, hasDetails, isCompleted]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // 处理鼠标进入 - 取消待处理的收起
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    onHover?.();
  };

  // 处理鼠标离开 - 延迟收起
  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      onLeave?.();
    }, 400);
  };

  // 切换详情显示（支持键盘和点击）
  const toggleDetails = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.4),
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="rounded-xl overflow-hidden bg-card shadow-card hover:shadow-cardHover transition-shadow duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

        {/* 左侧色条 - 前提蓝色，原件黄色，复印件灰色 */}
        <div className={`
          w-[3px] self-stretch transition-colors duration-300
          ${isCompleted
            ? "bg-success"
            : item.section === "前提"
              ? "bg-accent"
              : item.section === "原件"
                ? "bg-warning"
                : "bg-borderLight"
          }
        `} />

        {/* 内容 */}
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              role="button"
              tabIndex={0}
              className={`
                font-medium text-[15px] tracking-tight transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded
                ${isCompleted ? "text-secondary line-through" : "text-primary"}
              `}
              onClick={onToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle();
                }
              }}
            >
              {item.id}. {item.name}
            </span>

            {/* 显示多个标签 */}
            {item.requirement === "复印件+翻译" && (
              <>
                <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                  复印件
                </span>
                <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                  翻译
                </span>
              </>
            )}
            {item.requirement === "原件+复印件+翻译" && (
              <>
                <span className={`
                  text-[12px] font-medium px-2 py-0.5 rounded-md
                  ${isCompleted ? "bg-successLight text-success" : "bg-warningLight text-warning"}
                `}>
                  原件
                </span>
                <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                  复印件
                </span>
                <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                  翻译
                </span>
              </>
            )}
            {item.requirement !== "原件+复印件+翻译" && item.requirement.includes("原件") && (
              <span className={`
                text-[12px] font-medium px-2 py-0.5 rounded-md
                ${isCompleted ? "bg-successLight text-success" : "bg-warningLight text-warning"}
              `}>
                原件
              </span>
            )}
            {item.requirement !== "原件+复印件+翻译" && item.requirement === "复印件" && (
              <span className="text-[12px] text-secondary bg-page px-2 py-0.5 rounded-md">
                复印件
              </span>
            )}
            {item.requirement === "确认" && (
              <span className="text-[12px] text-accent bg-accent-light px-2 py-0.5 rounded-md">
                确认
              </span>
            )}

            {/* 详情标识 - 有详情且未完成时显示，支持键盘和点击 */}
            {hasDetails && !isCompleted && (
              <button
                type="button"
                aria-expanded={showDetails}
                aria-label={showDetails ? "收起详情" : "展开详情"}
                onClick={toggleDetails}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDetails(e);
                  }
                }}
                className="p-1 -m-1 rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
              >
                {showDetails
                  ? <CaretDown size={14} weight="bold" className="text-secondary/60" />
                  : <CaretRight size={14} weight="bold" className="text-secondary/60" />
                }
              </button>
            )}
          </div>

          {item.notes && !isCompleted && (
            <p className="text-[13px] text-secondary mt-0.5">{renderTextWithLinks(item.notes)}</p>
          )}
        </div>
      </div>

      {/* 展开的详情内容 - 使用 grid-template-rows 动画 */}
      <AnimatePresence>
        {showDetails && hasDetails && !isCompleted && (
          <motion.div
            initial={{ gridTemplateRows: "0fr" }}
            animate={{ gridTemplateRows: "1fr" }}
            exit={{ gridTemplateRows: "0fr" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="overflow-hidden">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
