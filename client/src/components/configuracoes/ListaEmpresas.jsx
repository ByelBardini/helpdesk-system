import { Building2 } from "lucide-react";

export default function ListaEmpresas({ empresas }) {
  return (
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

            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                e.empresa_ativa == 1
                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                  : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}
            >
              {e.empresa_ativa == 1 ? "Ativo" : "Inativo"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
