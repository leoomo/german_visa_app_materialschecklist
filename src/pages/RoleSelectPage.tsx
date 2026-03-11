import { motion } from "framer-motion";
import { roles } from "../data/checklistData";
import { useAppStore } from "../stores/useAppStore";
import { GraduationCap } from "@phosphor-icons/react";

export function RoleSelectPage() {
  const { setCurrentPage, setSelectedRole } = useAppStore();

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId as any);
    setCurrentPage("checklist");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mb-6 shadow-lg shadow-purple-500/25"
          >
            <GraduationCap size={40} weight="duotone" className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            德国留学签证清单
          </h1>
          <p className="text-slate-500 text-lg">
            选择您的学历背景，获取专属材料清单
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole(role.id)}
              className={`relative p-6 rounded-3xl text-left transition-all duration-300 bg-gradient-to-br ${role.gradient} shadow-lg hover:shadow-xl group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">
                  {role.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <motion.div
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
