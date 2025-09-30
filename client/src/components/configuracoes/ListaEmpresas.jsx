import { Building2, Power } from "lucide-react";

export default function ListaEmpresas({
  empresas,
  cor,
  ativaInativa,
  setCadastro,
}) {
  return (
    <>
      <div className="px-5 py-4 border-t border-white/10 space-y-3">
        <ul className="space-y-2">
          {empresas.map((e) => (
            <li
              key={e.empresa_id}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/20">
                  <Building2 className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white/90">
                    {e.empresa_nome}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: #{e.empresa_id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    e.empresa_ativa == 1
                      ? "bg-green-500/20 text-green-300 border border-green-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-400/30"
                  }`}
                >
                  {e.empresa_ativa == 1 ? "Ativo" : "Inativo"}
                </span>

                <button
                  onClick={() =>
                    ativaInativa(
                      e.empresa_ativa,
                      "empresa",
                      e.empresa_ativa == 1
                    )
                  }
                  className={`cursor-pointer p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1
                  ${
                    e.empresa_ativa == 1
                      ? "bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30"
                      : "bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30"
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {e.empresa_ativa == 1 ? "Desativar" : "Ativar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex p-2 justify-end">
        <button
          onClick={() => setCadastro("empresa")}
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:opacity-80 transition ${cor}`}
        >
          + Adicionar Empresa
        </button>
      </div>
    </>
  );
}
