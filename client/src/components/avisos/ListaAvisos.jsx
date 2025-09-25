import { Bell } from "lucide-react";
import { formatToDate, formatToCapitalized } from "brazilian-values";

export default function ListaAvisos({ avisos }) {
  function corImportancia(importancia) {
    switch (importancia.toLowerCase()) {
      case "baixa":
        return "border-l-4 border-green-400/50";
      case "media":
        return "border-l-4 border-yellow-400/50";
      case "alta":
        return "border-l-4 border-red-500/50";
      default:
        return "border-l-4 border-gray-500";
    }
  }

  function badgeCor(importancia) {
    switch (importancia) {
      case "baixa":
        return "bg-green-500/20 text-green-200";
      case "media":
        return "bg-yellow-500/20 text-yellow-200";
      case "alta":
        return "bg-red-500/20 text-red-200";
      default:
        return "bg-gray-500/20 text-gray-200";
    }
  }

  return (
    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col max-h-[83vh]">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Avisos</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {avisos.length > 0 ? (
          avisos.map((aviso) => (
            <div
              key={aviso.aviso_id}
              className={`bg-[#14163d]/60 hover:bg-[#1c1f4a]/80 
              rounded-xl p-4 shadow-md
              transition ${corImportancia(aviso.aviso_importancia)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#6bb7ff]">
                  {aviso.aviso_titulo}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeCor(
                    aviso.aviso_importancia
                  )}`}
                >
                  {formatToCapitalized(aviso.aviso_importancia)}
                </span>
              </div>
              <p className="text-xs text-white/60 mb-2">
                {formatToDate(new Date(aviso.aviso_data + "T03:00:00Z"))}
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {aviso.aviso_descricao}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-white/60 text-sm italic h-full">
            Nenhum aviso no momento
          </div>
        )}
      </div>
    </div>
  );
}
