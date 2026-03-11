import { motion } from "framer-motion";

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ completed, total, percentage }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">准备进度</span>
        <span className="text-sm font-bold text-slate-900">
          {completed} / {total}
        </span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
        />
      </div>

      <div className="mt-2 text-center">
        <motion.span
          key={percentage}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}
