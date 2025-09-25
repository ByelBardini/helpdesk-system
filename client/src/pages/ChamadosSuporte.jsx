/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function ChamadosSuporte() {
  const colunas = [
    { titulo: "Em Aberto", cor: "border-red-400 text-red-300" },
    { titulo: "Visualizado", cor: "border-yellow-400 text-yellow-300" },
    { titulo: "Resolvendo", cor: "border-blue-400 text-blue-300" },
    { titulo: "Resolvido", cor: "border-green-400 text-green-300" },
  ];

  const [chamados, setChamados] = useState([
    { id: 1, titulo: "Erro no login", status: "Em Aberto", data: "24/09/2025" },
    {
      id: 2,
      titulo: "Bug no relatório",
      status: "Resolvendo",
      data: "23/09/2025",
    },
    {
      id: 3,
      titulo: "Ajustar permissão",
      status: "Visualizado",
      data: "22/09/2025",
    },
    {
      id: 4,
      titulo: "Novo campo no cadastro",
      status: "Resolvido",
      data: "20/09/2025",
    },
  ]);

  return (
    <div className="h-[calc(100vh-3rem)]  bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {colunas.map((coluna) => (
          <div
            key={coluna.titulo}
            className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 h-full"
          >
            <h2 className={`font-semibold mb-4 border-b pb-2 ${coluna.cor}`}>
              {coluna.titulo}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-12rem)]">
              {chamados
                .filter((c) => c.status === coluna.titulo)
                .map((chamado) => (
                  <div
                    key={chamado.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-3 shadow hover:bg-white/20 transition"
                  >
                    <p className="font-medium">{chamado.titulo}</p>
                    <p className="text-xs text-gray-300 mt-1">{chamado.data}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
