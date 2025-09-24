/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function Confirmacao({ titulo, texto, onSim, onNao }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="rounded-2xl shadow-2xl p-6 
                     bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] 
                     text-white border border-white/10"
        >
          {/* Título */}
          {titulo && (
            <h3 className="text-xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              {titulo}
            </h3>
          )}

          {/* Texto */}
          <p className="text-base text-white/80 text-center leading-relaxed">
            {texto}
          </p>

          {/* Ações */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onNao}
              className="cursor-pointer px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition"
            >
              Não
            </button>
            <button
              onClick={onSim}
              className="cursor-pointer px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold shadow-sm transition"
            >
              Sim
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
