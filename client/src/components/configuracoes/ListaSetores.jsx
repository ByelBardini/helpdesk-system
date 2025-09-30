import { Grid, Building2 } from "lucide-react";

export default function ListaSetores({ setores }) {
  const setoresPorEmpresa = setores?.reduce((acc, setor) => {
    const empresaNome = setor.empresa?.empresa_nome;
    if (!acc[empresaNome]) acc[empresaNome] = [];
    acc[empresaNome].push(setor);
    return acc;
  }, {});

  return (
    <div className="px-5 py-4 border-t border-white/10 space-y-6">
      {Object.entries(setoresPorEmpresa || {}).map(([empresaNome, lista]) => (
        <div key={empresaNome} className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
            <Building2 className="w-4 h-4" />
            {empresaNome}
          </div>

          <ul className="space-y-2">
            {lista.map((s) => (
              <li
                key={s.setor_id}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition"
              >
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/20">
                  <Grid className="w-5 h-5 text-green-300" />
                </div>

                <span className="font-medium text-white/90">{s.setor_nome}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
