/* eslint-disable react-hooks/exhaustive-deps */
import CardChamado from "../components/chamados/CardChamado.jsx";
import ModalChamado from "../components/chamados/ModalChamado.jsx";
import ModalResolucao from "../components/chamados/ModalResolucao.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import { useEffect, useState } from "react";
import { getChamadosSuporte } from "../services/api/chamadosServices";
import { visualizaResposta } from "../services/api/respostaServices.js";
import { formatToCapitalized } from "brazilian-values";
import { tratarErro } from "../components/default/funcoes.js";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket.js";

export default function ChamadosSuporte() {
  const navigate = useNavigate();
  const colunas = [
    { titulo: "em aberto", cor: "border-red-400 text-red-300" },
    { titulo: "visualizado", cor: "border-yellow-400 text-yellow-300" },
    { titulo: "resolvendo", cor: "border-blue-400 text-blue-300" },
    { titulo: "resolvido", cor: "border-green-400 text-green-300" },
  ];

  const [chamados, setChamados] = useState([]);
  const [concluindo, setConcluindo] = useState({ show: false, chamado: null });
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [abreChamado, setAbreChamado] = useState(false);

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });

  async function buscaChamados() {
    setLoading(true);
    try {
      const chamados = await getChamadosSuporte();
      setLoading(false);
      setChamados(chamados);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function visualiza(naoLidas) {
    setLoading(true);
    try {
      for (const m of naoLidas) {
        await visualizaResposta(m.resposta_id);
      }
      setLoading(false);

      await buscaChamados();
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    buscaChamados();
  }, []);

  useEffect(() => {
    socket.on("chamado:new", buscaChamados);
  }, []);

  return (
    <div className="h-[calc(100vh-3rem)] bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-4">
      {abreChamado && (
        <ModalChamado
          chamado={chamadoSelecionado}
          setAbreChamado={setAbreChamado}
          setLoading={setLoading}
          setNotificacao={setNotificacao}
          setConfirmacao={setConfirmacao}
          navigate={navigate}
          buscaChamados={buscaChamados}
          setConcluindo={setConcluindo}
        />
      )}
      {concluindo.show && (
        <ModalResolucao
          setConcluindo={setConcluindo}
          concluindo={concluindo}
          setConfirmacao={setConfirmacao}
          setLoading={setLoading}
          buscaChamados={buscaChamados}
          navigate={navigate}
          setNotificacao={setNotificacao}
          setAbreChamado={setAbreChamado}
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
      {loading && <Loading />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {colunas.map((coluna) => (
          <div
            key={coluna.titulo}
            className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 h-full"
          >
            <h2 className={`font-semibold mb-4 border-b pb-2 ${coluna.cor}`}>
              {formatToCapitalized(coluna.titulo)}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-10rem)]">
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
                      visualiza={visualiza}
                      chamado={chamado}
                      conclusao={conclusao}
                      abertura={abertura}
                      setAbreChamado={setAbreChamado}
                      setChamadoSelecionado={setChamadoSelecionado}
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
