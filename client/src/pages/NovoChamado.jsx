import { ArrowLeft, PlusCircle } from "lucide-react";
import { formatToNumber } from "brazilian-values";
import { useEffect, useState } from "react";
import { getAreas } from "../services/api/areaServices.js";

export default function NovoChamado() {
  const [areas, setAreas] = useState([]);

  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");

  async function buscarAreas() {
    try {
      const areas = await getAreas();

      console.log(areas);

      setAreas(areas);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    buscarAreas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 lg:p-10 relative">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-4 py-2 transition">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Novo Chamado</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-[#2a2d5a]/60 backdrop-blur-sm rounded-2xl p-6 space-y-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">Tipo</label>
          <select
            onChange={(e) => setTipo(e.target.value)}
            className="bg-[#1c1f4a] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40"
          >
            <option value={""} hidden>
              Selecione...
            </option>
            <option value={"solicitacao"}>Solicitação</option>
            <option value={"melhoria"}>Melhoria</option>
            <option value={"erro"}>Erro</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/70">
            Área / Sistema
          </label>
          <select
            onChange={(e) => setArea(e.target.value)}
            disabled={tipo === ""}
            className={`rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40
      ${
        tipo === ""
          ? "bg-[#1c1f4a]/40 text-white/40 cursor-not-allowed"
          : "bg-[#1c1f4a] text-white/90"
      }`}
          >
            <option value={""} hidden>
              Selecione...
            </option>
            {areas
              .filter((area) => area.area_tipo === tipo)
              .map((area) => (
                <option key={area.area_id} value={area.area_id}>
                  {area.area_nome}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">Motivo</label>
            <span
              className={`text-xs ${
                motivo.length < 75 ? "text-white/50" : "text-red-400/50"
              }`}
            >
              {motivo.length}/75
            </span>
          </div>
          <input
            onChange={(e) => setMotivo(e.target.value)}
            type="text"
            maxLength={75}
            placeholder="Digite o título do chamado..."
            className="bg-[#1c1f4a] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">
              Descrição
            </label>
            <span
              className={`text-xs ${
                descricao.length < 1000 ? "text-white/50" : "text-red-400/50"
              }`}
            >
              {formatToNumber(descricao.length)}/1.000
            </span>
          </div>
          <textarea
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={1000}
            rows="5"
            placeholder="Descreva o problema ou solicitação..."
            className="bg-[#1c1f4a] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40 resize-none"
          ></textarea>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70">Anexos</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              className="bg-[#1c1f4a] rounded-lg px-2 py-2 text-sm flex-1 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#6a5acd]/40 file:text-white/80 file:cursor-pointer"
            />
            <input
              type="text"
              placeholder="Nome do anexo"
              className="bg-[#1c1f4a] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40 flex-1"
            />
            <button className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 rounded-lg transition">
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="cursor-pointer px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-medium transition">
            Cancelar
          </button>
          <button className="cursor-pointer px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-medium transition">
            Confirmar
          </button>
        </div>
      </main>
    </div>
  );
}
