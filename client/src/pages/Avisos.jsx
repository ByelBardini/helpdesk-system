/* eslint-disable react-hooks/exhaustive-deps */
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import { getAvisos, deleteAviso } from "../services/api/avisosServices.js";
import { useEffect, useState } from "react";
import { tratarErro } from "../components/default/funcoes";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";

export default function Avisos() {
  const navigate = useNavigate();
  const [avisos, setAvisos] = useState([]);

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

  async function buscaAvisos() {
    try {
      setLoading(true);
      const avisos = await getAvisos();
      setLoading(false);
      setAvisos(avisos);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function excluirAviso(id) {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    try {
      setLoading(true);
      await deleteAviso(id);
      await buscaAvisos();
      setLoading(false);
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Aviso excluído com sucesso",
        mensagem:
          "Esse aviso não irá mais ser exibido para outros funcionários",
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    buscaAvisos();
  }, []);

  function badgeCor(importancia) {
    switch (importancia?.toLowerCase()) {
      case "baixa":
        return "bg-green-500/20 text-green-400";
      case "media":
        return "bg-yellow-500/20 text-yellow-400";
      case "alta":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  }

  return (
    <div className="h-[calc(100vh-3rem)] bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 flex flex-col">
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

      <div className="flex justify-end mb-6">
        <button
          className="cursor-pointer flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 
                     text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30 
                     transition"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Novo Aviso</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {avisos.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum aviso cadastrado.</p>
        ) : (
          avisos.map((aviso) => (
            <div
              key={aviso.aviso_id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 
                         hover:bg-white/10 transition flex flex-col gap-2 relative"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-base font-medium text-white">
                  {aviso.aviso_titulo}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(aviso.aviso_data).toLocaleDateString("pt-BR")}
                  </span>

                  <button
                    onClick={() =>
                      setConfirmacao({
                        show: true,
                        titulo: "Tem certeza que deseja excluir o aviso?",
                        texto: "Essa ação não pode ser desfeita",
                        onSim: () => excluirAviso(aviso.aviso_id),
                      })
                    }
                    className="cursor-pointer p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                    title="Remover aviso"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg w-fit ${badgeCor(
                  aviso.aviso_importancia
                )}`}
              >
                {aviso.aviso_importancia
                  ? aviso.aviso_importancia.toUpperCase()
                  : "SEM IMPORTÂNCIA"}
              </span>

              <p className="text-sm text-gray-300">{aviso.aviso_descricao}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
