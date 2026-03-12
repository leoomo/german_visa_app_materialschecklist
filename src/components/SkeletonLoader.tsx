import { motion } from "framer-motion";

// 骨架屏项组件
function SkeletonItem({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-border animate-pulse rounded-lg ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.7, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export function ChecklistSkeleton() {
  return (
    <div className="space-y-6">
      {/* 区块标题 */}
      <div className="mb-3">
        <SkeletonItem className="h-4 w-32 mb-2" />
        <SkeletonItem className="h-3 w-48" />
      </div>

      {/* 骨架卡片 */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-card shadow-card"
        >
          <div className="flex items-stretch">
            {/* 复选框占位 */}
            <div className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center">
              <SkeletonItem className="w-6 h-6 rounded-full" />
            </div>

            {/* 左侧色条占位 */}
            <SkeletonItem className="w-[3px] self-stretch rounded-none" />

            {/* 内容区 */}
            <div className="flex-1 min-w-0 px-4 py-3 space-y-2">
              <SkeletonItem className="h-5 w-3/4" />
              <SkeletonItem className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="bg-card/80 backdrop-blur-xl shrink-0 sticky top-0 z-10 relative">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* 返回按钮 */}
          <SkeletonItem className="w-9 h-9 rounded-lg" />

          {/* 标题 */}
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonItem className="h-5 w-32" />
            <SkeletonItem className="h-4 w-48" />
          </div>

          {/* 移动端进度 */}
          <div className="lg:hidden shrink-0 text-right space-y-1">
            <SkeletonItem className="h-7 w-12 ml-auto" />
            <SkeletonItem className="h-3 w-8 ml-auto" />
          </div>

          {/* 菜单 */}
          <SkeletonItem className="w-9 h-9 rounded-lg" />
        </div>
      </div>

      {/* 进度底边占位 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-border">
        <SkeletonItem className="h-full w-1/4" />
      </div>
    </div>
  );
}
