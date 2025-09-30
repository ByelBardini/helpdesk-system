import { formatToCapitalized } from "brazilian-values";
import { Layers } from "lucide-react";

export default function ListaAreas({ areas }) {
  const areasAgrupadas = areas?.reduce((acc, area) => {
    if (!acc[area.area_nome]) acc[area.area_nome] = new Set();
    area.tipos.split(",").forEach((tipo) => acc[area.area_nome].add(tipo));
    return acc;
  }, {});

  return (
    <div className="px-5 py-4 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(areasAgrupadas || {}).map(([nome, tipos]) => (
          <div
            key={nome}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-purple-300" />
              <span className="font-medium text-white/90">{nome}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {[...tipos].map((tipo) => (
                <span
                  key={tipo}
                  className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30"
                >
                  {tipo == "solicitacao"
                    ? "Solicitação"
                    : formatToCapitalized(tipo)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
