import { Bell, Container } from "lucide-react";
import { formatToDate, formatToCapitalized } from "brazilian-values";

export default function ListaAvisos({ avisos }) {
  function corImportancia(importancia) {
    switch (importancia.toLowerCase()) {
      case "baixa":
        return "border-l-4 border-green-400/80";
      case "media":
        return "border-l-4 border-yellow-400/80";
      case "alta":
        return "border-l-4 border-red-500/80";
      default:
        return "border-l-4 border-gray-400/80";
    }
  }

  function badgeCor(importancia) {
    switch (importancia.toLowerCase()) {
      case "baixa":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "media":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "alta":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  }

  return (
    <div className="flex-1 p-6 flex flex-col h-[95vh]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-6 w-6 text-blue-400" />
        <h2 className="text-lg font-semibold text-white/90">Avisos</h2>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {avisos.length > 0 ? (
          avisos.map((aviso) => (
            <div
              key={aviso.aviso_id}
              className={`
                bg-gradient-to-br from-[#1c214d]/60 to-[#14163d]/60 
                hover:from-[#22275a]/70 hover:to-[#1a1e46]/70
                rounded-xl p-4 shadow-md transition-all duration-300
                ${corImportancia(aviso.aviso_importancia)}
              `}
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
              <p className="text-xs text-white/50 mb-2">
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

