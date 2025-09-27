import TempoResolucao from "./TempoResolucao.jsx";
import { useEffect } from "react";
import {
  getDadosRelatorios,
  getTempoResolucao,
} from "../../services/api/relatorioServices.js";
import { useState } from "react";

export default function TelaRelatorios({ getSelectedTitle, getSelectedDesc }) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [empresa, setEmpresa] = useState(0);

  const [gerado, setGerado] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  const [resultado, setResultado] = useState([]);

  async function buscaTempoResolucao() {
    setGerado(false);
    setResultado(0);
    try {
      const busca = await getTempoResolucao(dataInicio, dataFim, empresa);

      console.log(busca);

      setResultado(busca);
      setGerado(true);

      setDataFim("");
      setDataInicio("");
      setEmpresa(0);
    } catch (err) {
      console.error(err);
    }
  }

  async function buscaDados() {
    const dados = await getDadosRelatorios();
    return dados;
  }

  useEffect(() => {
    try {
      async function carregarDados() {
        try {
          const dados = await buscaDados();
          console.log(dados);

          setEmpresas(dados);
        } catch (err) {
          console.error(err);
        }
      }

      carregarDados();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <section className="col-span-12 md:col-span-9 flex flex-col items-center gap-6">
      <div className="h-80 w-full flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-lg">
        <h1 className="text-xl font-semibold mb-2">{getSelectedTitle()}</h1>
        <p className="text-sm text-white/60 mb-6">{getSelectedDesc()}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Data inicial</label>
            <input
              value={dataInicio}
              type="date"
              onChange={(e) => setDataInicio(e.target.value)}
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Data final</label>
            <input
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              type="date"
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-white/70 mb-1">Empresa</label>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="bg-[#1f2347] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Todas</option>
              {empresas.map((empresa) => {
                return (
                  <option key={empresa.empresa_id} value={empresa.empresa_id}>
                    {empresa.empresa_nome}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          onClick={buscaTempoResolucao}
          className="cursor-pointer mt-8 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Gerar relatório
        </button>
      </div>

      {gerado && (
        <div className="w-full flex justify-center">
          <TempoResolucao resultado={resultado} />
        </div>
      )}
    </section>
  );
}
