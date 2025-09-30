/* eslint-disable no-unused-vars */
import ListaEmpresas from "../components/configuracoes/ListaEmpresas.jsx";
import ListaSetores from "../components/configuracoes/ListaSetores.jsx";
import ListaAreas from "../components/configuracoes/ListaAreas.jsx";
import ModalCadastraEmpresa from "../components/configuracoes/ModalCadastraEmpresa.jsx";
import { useEffect, useState } from "react";
import { getDados, ativaInativaGeral } from "../services/api/configServices.js";
import { Building2, Grid, Layers, ChevronDown, ChevronUp } from "lucide-react";

export default function Configuracoes() {
  const [dados, setDados] = useState([]);
  const [open, setOpen] = useState(null);

  const [cadastro, setCadastro] = useState("");

  const secoes = [
    { titulo: "Empresas", cor: "bg-blue-500", icone: Building2 },
    { titulo: "Setores", cor: "bg-green-500", icone: Grid },
    { titulo: "Áreas", cor: "bg-purple-500", icone: Layers },
  ];

  const toggle = (secao) => {
    setOpen(open === secao ? null : secao);
  };

  async function buscarDados() {
    try {
      const dados = await getDados();
      console.log(dados);

      setDados(dados);
    } catch (err) {
      console.error(err);
    }
  }

  async function ativaInativa(id, tipo, ativo) {
    try {
      await ativaInativaGeral(id, tipo);
      await buscarDados();
      alert(`${ativo == true ? "Inativado" : "Ativado"} com sucesso`);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <div className="min-h-screen h-screen pb-18 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 overflow-y-auto">
      {cadastro == "empresa" && (
        <ModalCadastraEmpresa
          buscarDados={buscarDados}
          setCadastro={setCadastro}
        />
      )}
      <div className="space-y-4">
        {secoes.map(({ titulo, cor, icone: Icon }) => (
          <div
            key={titulo}
            className="rounded-xl border border-white/10 overflow-hidden shadow-lg"
          >
            <button
              onClick={() => toggle(titulo)}
              className="cursor-pointer w-full flex flex-col px-5 py-4 text-left font-semibold bg-[#1c1f4a]/70 hover:bg-[#1c1f4a]/90 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-white/80" />
                  <span>{titulo}</span>
                </div>
                {open === titulo ? (
                  <ChevronUp className="w-5 h-5 text-white/70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/70" />
                )}
              </div>
              <div className={`mt-2 h-1 rounded-full ${cor}`} />
            </button>

            {open == "Empresas" && titulo == open && (
              <ListaEmpresas
                empresas={dados.empresas}
                cor={cor}
                ativaInativa={ativaInativa}
                setCadastro={setCadastro}
              />
            )}
            {open == "Setores" && titulo == open && (
              <ListaSetores
                setores={dados.setores}
                cor={cor}
                ativaInativa={ativaInativa}
              />
            )}
            {open == "Áreas" && titulo == open && (
              <ListaAreas
                areas={dados.areas}
                cor={cor}
                ativaInativa={ativaInativa}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
