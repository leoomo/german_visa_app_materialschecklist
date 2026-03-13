'use client';

import { motion } from 'framer-motion';
import { SealCheck } from '@phosphor-icons/react';

interface SuccessBadgeProps {
  /** 禁用内部动画，由外部控制动画 */
  disableAnimation?: boolean;
}

export function SuccessBadge({ disableAnimation = false }: SuccessBadgeProps) {
  const badgeContent = (
    <>
      <SealCheck
        size={16}
        weight="fill"
        className="text-white"
      />
      <span className="text-xs font-semibold text-white whitespace-nowrap">
        材料齐备
      </span>
    </>
  );

  if (disableAnimation) {
    // 无动画版本 - 用于 AnimatePresence 过渡
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md">
        {badgeContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 8 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_4px_14px_-3px_rgba(16,185,129,0.4),0_6px_20px_-6px_rgba(16,185,129,0.2)]"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.1,
          type: 'spring',
          stiffness: 400,
          damping: 18
        }}
      >
        <SealCheck
          size={16}
          weight="fill"
          className="text-white"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, x: -3 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        className="text-xs font-semibold text-white whitespace-nowrap"
      >
        材料齐备
      </motion.span>
    </motion.div>
  );
}
