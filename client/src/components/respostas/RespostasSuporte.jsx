/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { formatToDate } from "brazilian-values";
import {
  Send,
  Paperclip,
  Trash2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { tratarErro } from "../default/funcoes";
import { useNavigate } from "react-router-dom";
import {
  postResposta,
  getResposta,
} from "../../services/api/respostaServices.js";
import { socket } from "../../services/socket.js";

export default function RespostasSuporte({
  respostas,
  setRespostas,
  chamado,
  podeResponder,
  setLoading,
  setNotificacao,
  setConfirmacao,
}) {
  const navigate = useNavigate;

  const [showAnexoMenu, setShowAnexoMenu] = useState(false);
  const [anexoNome, setAnexoNome] = useState("");
  const [anexoArquivo, setAnexoArquivo] = useState(null);

  const [novaResposta, setNovaResposta] = useState("");
  const [anexos, setAnexos] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddAnexo = () => {
    if (!anexoArquivo) return;
    const id = crypto?.randomUUID?.() ?? Date.now().toString();
    setAnexos((prev) => [
      ...prev,
      { id, nome: anexoNome || anexoArquivo.name, file: anexoArquivo },
    ]);
    setAnexoNome("");
    setAnexoArquivo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAnexo = (id) => {
    setAnexos((prev) => prev.filter((a) => a.id !== id));
  };

  async function buscaRespostas() {
    const novasRespostas = await getResposta(chamado.chamado_id);
    setRespostas(novasRespostas);
  }

  async function enviarResposta() {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (novaResposta.trim() == "") {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados incorretos",
        mensagem: "A resposta não pode estar em branco",
      });
      return;
    }
    setLoading(true);
    try {
      const idUsuario = localStorage.getItem("usuario_id");

      const fd = new FormData();

      fd.append("descricao", novaResposta);
      fd.append("tipo", "suporte");

      (anexos || []).forEach((a) => {
        fd.append("nome[]", a.nome ?? (a.file?.name || "arquivo"));
        if (a.file) fd.append("arquivos", a.file);
      });

      await postResposta(idUsuario, chamado.chamado_id, fd);

      await buscaRespostas();

      setLoading(false);

      setNovaResposta("");
      setAnexos([]);
      setShowAnexoMenu(false);

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Resposta enviada",
        mensagem: "Sua resposta foi enviada com sucesso ao usuário",
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
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    socket.on("reply:new", buscaRespostas);
  }, []);

  return (
    <div className="w-1/2 p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Respostas</h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {respostas.length > 0 ? (
          respostas.map((resposta) => (
            <div
              key={resposta.resposta_id}
              className={`p-3 rounded-lg border ${
                resposta.resposta_tipo === "usuario"
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-green-500/10 border-green-500/20 text-end"
              }`}
            >
              <p className="text-sm text-gray-200 whitespace-pre-line">
                {resposta.resposta_descricao}
              </p>

              {resposta.anexos && resposta.anexos.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Anexos:</p>
                  <ul className="space-y-1">
                    {resposta.anexos.map((anexo, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                      >
                        <span className="truncate">{anexo.anexo_nome}</span>
                        <a
                          href={anexo.anexo_caminho}
                          download
                          className="cursor-pointer ml-3 bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {resposta.usuario?.usuario_nome} —{" "}
                {formatToDate(
                  new Date(resposta.resposta_data_emissao + "T03:00:00Z")
                )}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma resposta registrada.</p>
        )}
      </div>

      {podeResponder && (
        <div className="mt-4 flex flex-col gap-3">
          {showAnexoMenu && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setAnexoArquivo(e.target.files?.[0] ?? null)}
                  className="block w-full text-xs file:mr-3 file:py-2 file:px-3
                             file:rounded-md file:border-0 file:bg-[#6a5acd]/40
                             file:text-white/90 hover:file:bg-[#6a5acd]/60 file:cursor-pointer
                             bg-transparent"
                />
                <input
                  type="text"
                  value={anexoNome}
                  onChange={(e) => setAnexoNome(e.target.value)}
                  placeholder="Nome do arquivo"
                  className="flex-1 rounded-md bg-[#0e1033]/50 border border-white/10 p-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#6a5acd] text-white placeholder-white/40"
                />
                <button
                  onClick={handleAddAnexo}
                  disabled={!anexoArquivo}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg
                             bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 transition text-sm font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Paperclip className="h-4 w-4" />
                  Adicionar
                </button>
              </div>

              {anexos.length > 0 && (
                <ul className="space-y-2">
                  {anexos.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between rounded-md bg-[#0e1033]/40
                                 border border-white/10 p-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {a.file?.type?.startsWith("image/") ? (
                          <ImageIcon className="w-4 h-4 text-white/50" />
                        ) : (
                          <FileText className="w-4 h-4 text-white/50" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-white/90 truncate">
                            {a.nome}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {a.file?.name} • {(a.file.size / 1024).toFixed(1)}{" "}
                            KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAnexo(a.id)}
                        className="cursor-pointer p-2 rounded-md hover:bg-white/10 transition"
                        aria-label="Remover anexo"
                      >
                        <Trash2 className="w-4 h-4 text-white/60" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAnexoMenu((prev) => !prev)}
              className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 rounded-lg flex items-center"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              value={novaResposta}
              onChange={(e) => setNovaResposta(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm resize-none custom-scrollbar"
              rows={2}
              placeholder="Digite sua resposta..."
            />

            <button
              onClick={() =>
                setConfirmacao({
                  show: true,
                  titulo: "Gostaria de enviar essa resposta ao usuário?",
                  texto: "Confirme os dados, respostas não podem ser alteradas",
                  onSim: () => {
                    enviarResposta();
                  },
                })
              }
              disabled={!novaResposta.trim() && anexos.length === 0}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={16} /> Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
