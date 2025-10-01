/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useEffect } from "react";

export default function ModalMotivoRecusa({ setMotivoRecusa, motivoRecusa }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMotivoRecusa({ show: false, motivo: null });
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setMotivoRecusa({ show: false, motivo: null })}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold">Motivo da Recusa</h3>
          <button
            onClick={() => setMotivoRecusa({ show: false, motivo: null })}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/80 whitespace-pre-wrap">
            {motivoRecusa.motivo || (
              <span className="italic text-gray-400">
                Nenhum motivo informado
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 px-6 py-4">
          <button
            onClick={() => setMotivoRecusa({ show: false, motivo: null })}
            className="cursor-pointer px-5 py-2 rounded-lg border border-blue-400/30 bg-blue-500/20 text-blue-200 text-sm font-medium hover:bg-blue-500/30 transition"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
