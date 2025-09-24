/* eslint-disable react-hooks/exhaustive-deps */
import AnexosNovoChamado from "../components/anexos/AnexosNovoChamado.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import Loading from "../components/default/Loading.jsx";
import { ArrowLeft } from "lucide-react";
import { formatToNumber } from "brazilian-values";
import { useEffect, useState } from "react";
import { getAreas } from "../services/api/areaServices.js";
import { postChamado } from "../services/api/chamadosServices.js";
import { tratarErro } from "../components/default/funcoes.js";
import { useNavigate } from "react-router-dom";

export default function NovoChamado() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);

  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexos, setAnexos] = useState([]);
  const [valido, setValido] = useState(false);

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });
  const [loading, setLoading] = useState(false);

  async function buscarAreas() {
    try {
      setLoading(true);
      const areas = await getAreas();
      setLoading(false);

      console.log(areas);

      setAreas(areas);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
      console.error(err);
    }
  }

  async function enviarChamado() {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (
      tipo == "" ||
      area == "" ||
      motivo.trim() == "" ||
      descricao.trim() == ""
    ) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Preencha todos os dados",
        mensagem: "Todas as informações do chamado são obrigatórias",
      });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();

      fd.append("chamado_empresa_id", localStorage.getItem("empresa_id"));
      fd.append("chamado_setor_id", localStorage.getItem("setor_id"));
      fd.append("chamado_usuario_id", localStorage.getItem("usuario_id"));
      fd.append("chamado_area_id", area);
      fd.append("chamado_tipo", tipo);
      fd.append("chamado_motivo", motivo);
      fd.append("chamado_descricao", descricao);

      (anexos || []).forEach((a) => {
        fd.append("nome[]", a.nome ?? (a.file?.name || "arquivo"));
        if (a.file) fd.append("arquivos", a.file);
      });

      await postChamado(fd);
      setLoading(false);
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Chamado enviado",
        mensagem: `O chamado foi enviado com sucesso, atualizações sobre ele estarão disponíveis na sessão "Chamados" do menu inicial`,
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        navigate("/home", { replace: true });
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
      console.error(err);
    }
  }

  useEffect(() => {
    buscarAreas();
  }, []);

  useEffect(() => {
    setValido(
      tipo != "" && area != "" && motivo.trim() != "" && descricao.trim() != ""
    );
  }, [tipo, area, motivo, descricao]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 lg:p-10 relative">
      {confirmacao.show && (
        <Confirmacao
          texto={confirmacao.texto}
          titulo={confirmacao.titulo}
          onSim={confirmacao.onSim}
          onNao={() =>
            setConfirmacao({
              show: false,
              titulo: "",
              texto: "",
              onSim: null,
            })
          }
        />
      )}
      {notificacao.show && (
        <Notificacao
          titulo={notificacao.titulo}
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClick={() =>
            setNotificacao({
              show: false,
              tipo: "sucesso",
              titulo: "",
              mensagem: "",
            })
          }
        />
      )}
      {loading && <Loading />}
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-4 py-2 transition"
          >
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

        <AnexosNovoChamado anexos={anexos} setAnexos={setAnexos} />

        <div className="flex justify-end gap-4 pt-4">
          <button
            disabled={!valido}
            className={`px-6 py-2 rounded-lg font-medium transition 
                        ${
                          valido
                            ? "cursor-pointer bg-green-600 hover:bg-green-500 text-white"
                            : "cursor-not-allowed bg-gray-500 text-gray-300 opacity-70"
                        }`}
            onClick={() =>
              setConfirmacao({
                show: true,
                titulo: "Deseja enviar o chamado?",
                texto: "Verifique todos os dados antes de confirmar.",
                onSim: () => enviarChamado(),
              })
            }
          >
            Confirmar
          </button>
        </div>
      </main>
    </div>
  );
}
