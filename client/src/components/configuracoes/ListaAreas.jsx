import { formatToCapitalized } from "brazilian-values";
import { Layers, Power } from "lucide-react";

export default function ListaAreas({ areas, cor, ativaInativa, setCadastro }) {
  const areasAgrupadas = (areas ?? []).reduce((acc, area) => {
    const nome = area.area_nome;
    const ativa =
      area.area_ativa === true ||
      area.area_ativa === 1 ||
      area.area_ativa === "1";

    if (!acc[nome]) {
      acc[nome] = { tipos: new Set(), ativa };
    } else if (ativa) {
      acc[nome].ativa = true;
    }

    const tiposArray = Array.isArray(area.tipos)
      ? area.tipos
      : typeof area.tipos === "string"
      ? area.tipos.split(",")
      : [];

    tiposArray
      .map((t) => String(t).trim())
      .filter(Boolean)
      .forEach((t) => acc[nome].tipos.add(t));

    return acc;
  }, {});

  return (
    <>
      <div className="px-5 py-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(areasAgrupadas).map(([nome, dados]) => (
            <div
              key={nome}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-300" />
                  <span className="font-medium text-white/90">{nome}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      dados.ativa
                        ? "bg-green-500/20 text-green-300 border border-green-400/30"
                        : "bg-red-500/20 text-red-300 border border-red-400/30"
                    }`}
                  >
                    {dados.ativa ? "Ativo" : "Inativo"}
                  </span>

                  <button
                    onClick={() => ativaInativa(nome, "area", dados.ativa)}
                    className={`cursor-pointer p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1
                    ${
                      dados.ativa
                        ? "bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30"
                        : "bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {dados.ativa ? "Desativar" : "Ativar"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {[...dados.tipos].map((tipo) => (
                  <span
                    key={tipo}
                    className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30"
                  >
                    {tipo === "solicitacao"
                      ? "Solicitação"
                      : formatToCapitalized(tipo)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex p-2 justify-end">
        <button
          onClick={() => setCadastro("area")}
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:opacity-80 transition ${cor}`}
        >
          + Adicionar Área
        </button>
      </div>
    </>
  );
}
