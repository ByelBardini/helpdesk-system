import CardChamado from "../components/chamados/CardChamado.jsx";
import { useEffect, useState } from "react";
import { getChamadosSuporte } from "../services/api/chamadosServices";
import { formatToCapitalized } from "brazilian-values";

export default function ChamadosSuporte() {
  const colunas = [
    { titulo: "em aberto", cor: "border-red-400 text-red-300" },
    { titulo: "visualizado", cor: "border-yellow-400 text-yellow-300" },
    { titulo: "resolvendo", cor: "border-blue-400 text-blue-300" },
    { titulo: "resolvido", cor: "border-green-400 text-green-300" },
  ];

  const [chamados, setChamados] = useState([]);

  async function buscaChamados() {
    try {
      const chamados = await getChamadosSuporte();
      console.log(chamados);
      setChamados(chamados);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    buscaChamados();
  }, []);

  return (
    <div className="h-[calc(100vh-3rem)] bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {colunas.map((coluna) => (
          <div
            key={coluna.titulo}
            className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 h-full"
          >
            <h2 className={`font-semibold mb-4 border-b pb-2 ${coluna.cor}`}>
              {formatToCapitalized(coluna.titulo)}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-12rem)]">
              {chamados
                .filter((chamado) => chamado.chamado_status === coluna.titulo)
                .map((chamado) => {
                  const abertura = new Date(
                    chamado.chamado_data_abertura + "T03:00:00Z"
                  );
                  const conclusao = chamado.chamado_data_conclusao
                    ? new Date(chamado.chamado_data_conclusao + "T03:00:00Z")
                    : null;

                  return (
                    <CardChamado
                      chamado={chamado}
                      conclusao={conclusao}
                      abertura={abertura}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
