import { motion } from "framer-motion";

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
  className?: string;
}

export function ProgressBar({ completed, total, percentage, className = "" }: ProgressBarProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">准备进度</span>
        <span className="text-sm font-bold text-slate-800">
          {completed} / {total}
        </span>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
        />
      </div>

      <div className="mt-2 flex justify-end">
        <motion.span
          key={percentage}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-bold text-emerald-600"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}
