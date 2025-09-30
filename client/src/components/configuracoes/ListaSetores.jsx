import { Grid, Building2, Power } from "lucide-react";

export default function ListaSetores({ setores, cor, ativaInativa }) {
  const setoresPorEmpresa = setores?.reduce((acc, setor) => {
    const empresaNome = setor.empresa?.empresa_nome;
    if (!acc[empresaNome]) acc[empresaNome] = [];
    acc[empresaNome].push(setor);
    return acc;
  }, {});

  return (
    <>
      <div className="px-5 py-4 border-t border-white/10 space-y-6">
        {Object.entries(setoresPorEmpresa || {}).map(([empresaNome, lista]) => (
          <div key={empresaNome} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-300 border-b border-white/10 pb-1">
              <Building2 className="w-4 h-4" />
              {empresaNome}
            </div>

            <ul className="space-y-2">
              {lista.map((s) => (
                <li
                  key={s.setor_id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/20">
                      <Grid className="w-5 h-5 text-green-300" />
                    </div>
                    <span className="font-medium text-white/90">
                      {s.setor_nome}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.setor_ativo == 1
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : "bg-red-500/20 text-red-300 border border-red-400/30"
                      }`}
                    >
                      {s.setor_ativo == 1 ? "Ativo" : "Inativo"}
                    </span>

                    <button
                      onClick={() =>
                        ativaInativa(s.setor_id, "setor", s.setor_ativo == 1)
                      }
                      className={`cursor-pointer p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1
                      ${
                        s.setor_ativo == 1
                          ? "bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30"
                          : "bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {s.setor_ativo == 1 ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex p-2 justify-end">
        <button
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:opacity-80 transition ${cor}`}
        >
          + Adicionar Setor
        </button>
      </div>
    </>
  );
}
