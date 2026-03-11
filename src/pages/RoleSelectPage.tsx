import { motion } from "framer-motion";
import { roles } from "../data/checklistData";
import { useAppStore } from "../stores/useAppStore";
import { GraduationCap, CaretRight, DownloadSimple, ClipboardText, ArrowSquareOut } from "@phosphor-icons/react";
import { RoleType } from "../types";

export function RoleSelectPage() {
  const { setCurrentPage, setSelectedRole } = useAppStore();

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId as RoleType);
    setCurrentPage("checklist");
  };

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] mx-auto px-6 py-12"
      >
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className="mb-10"
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-2xl shrink-0 shadow-lg shadow-[#0071e3]/20">
              <ClipboardText size={24} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
                  上海地区 德国留学签证
                </h1>
                <GraduationCap size={18} weight="fill" className="text-[#ff9500] shrink-0" />
              </div>
              <p className="text-[17px] font-medium text-[#1d1d1f] -mt-0.5">准备材料清单</p>
              <div className="mt-2.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff9500] to-[#ffb340] text-white font-semibold text-[11px] shadow-sm shadow-[#ff9500]/30">
                  2025-10版
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* 提示区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-3 bg-[#fff9e6] rounded-xl border border-[#ff9500]/20"
        >
          {/* 免责申明 */}
          <p className="text-[11px] text-[#8c7000] leading-relaxed">
            <span className="font-semibold">特别提示：</span>本清单基于《上海留学签证特别提示》2025年10月版整理，后续可能存在变化，请以德国驻华使领馆官方最新发布为准
          </p>

          {/* PDF下载链接 */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <a
              href="/上海留学签证特别提示2025-10版.pdf"
              download
              className="inline-flex items-center gap-1.5 text-[12px] text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>特别提示2025-10版</span>
            </a>
            <a
              href="https://china.diplo.de/resource/blob/1341652/8530b9e1b8358030d76875b658bcc09c/pdf-merkblatt-natvisum-studium-data.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors"
            >
              <ArrowSquareOut size={12} weight="bold" />
              <span>申请须知2025-01</span>
            </a>
          </div>
        </motion.div>

        <p className="text-[13px] text-[#86868b] mb-3">选择您的学历背景</p>

        <div className="space-y-2.5">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + index * 0.05,
                type: "spring",
                stiffness: 280,
                damping: 24
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectRole(role.id)}
              className="group w-full p-4 bg-white rounded-2xl text-left flex items-center justify-between border border-transparent hover:border-[#0071e3]/30 hover:bg-[#f0f7ff] transition-colors duration-150"
            >
              <div>
                <h3 className="text-[15px] font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                  {role.name}
                </h3>
                <p className="text-[13px] text-[#86868b] mt-0.5 group-hover:text-[#6e6e73] transition-colors">
                  {role.description}
                </p>
              </div>
              <CaretRight
                size={18}
                weight="bold"
                className="text-[#d1d1d6] group-hover:text-[#0071e3] group-hover:translate-x-0.5 transition-all duration-150"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
