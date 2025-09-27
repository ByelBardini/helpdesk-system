import TempoResolucao from "./TempoResolucao.jsx";
import Responsaveis from "./Responsaveis.jsx";
import { useEffect, useState } from "react";
import {
  getDadosRelatorios,
  getTempoResolucao,
  getResponsaveis,
  getChamadosAbertos,
} from "../../services/api/relatorioServices.js";

export default function TelaRelatorios({
  getSelectedTitle,
  getSelectedDesc,
  selecionado,
  resultado,
  setResultado,
}) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [empresa, setEmpresa] = useState(0);
  const [empresas, setEmpresas] = useState([]);

  async function buscaRelatorio() {
    setResultado([]);
    try {
      let busca;
      if (selecionado === "tempo") {
        busca = await getTempoResolucao(dataInicio, dataFim, empresa);
      } else if (selecionado === "responsaveis") {
        busca = await getResponsaveis(dataInicio, dataFim, empresa);
      } else if (selecionado === "abertos") {
        console.log("teste");
        await getChamadosAbertos(dataInicio, dataFim, empresa);
      }
      if (busca) setResultado(busca);

      setDataFim("");
      setDataInicio("");
      setEmpresa(0);
    } catch (err) {
      console.error(err);
    }
  }

  async function buscaDados() {
    return await getDadosRelatorios();
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscaDados();
        setEmpresas(dados);
      } catch (err) {
        console.error(err);
      }
    }
    carregarDados();
  }, []);

  return (
    <section className="col-span-12 md:col-span-9 flex flex-col items-center gap-8">
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-lg">
        <h1 className="text-xl font-semibold text-white mb-2">
          {getSelectedTitle()}
        </h1>
        <p className="text-sm text-white/60 mb-8">{getSelectedDesc()}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Data inicial</label>
            <input
              value={dataInicio}
              type="date"
              onChange={(e) => setDataInicio(e.target.value)}
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Data final</label>
            <input
              value={dataFim}
              type="date"
              onChange={(e) => setDataFim(e.target.value)}
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Empresa</label>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Todas</option>
              {empresas.map((empresa) => (
                <option key={empresa.empresa_id} value={empresa.empresa_id}>
                  {empresa.empresa_nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={buscaRelatorio}
            className="cursor-pointer px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 
                       transition font-semibold shadow-lg text-white"
          >
            Gerar relatório
          </button>
        </div>
      </div>

      {resultado.length !== 0 && (
        <div className="w-full flex justify-center">
          {selecionado === "tempo" ? (
            <TempoResolucao resultado={resultado} />
          ) : selecionado === "responsaveis" ? (
            <Responsaveis resultado={resultado} />
          ) : null}
        </div>
      )}
    </section>
  );
}
