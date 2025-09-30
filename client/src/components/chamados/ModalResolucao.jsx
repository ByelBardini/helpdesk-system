/* eslint-disable react-hooks/exhaustive-deps */
import { X, Check, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { tratarErro } from "../default/funcoes";
import { alterarStatus } from "../../services/api/chamadosServices.js";

export default function ModalResolucao({
  setConcluindo,
  concluindo,
  setConfirmacao,
  setLoading,
  buscaChamados,
  navigate,
  setNotificacao,
  setAbreChamado,
}) {
  const [resolucao, setResolucao] = useState("");

  async function alteraStatus() {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    setLoading(true);
    try {
      await alterarStatus(
        concluindo.chamado.chamado_id,
        "resolvido",
        resolucao
      );
      await buscaChamados();
      setLoading(false);
      setConcluindo({ show: false, chamado: null });
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: `Chamado concluído com sucesso`,
        mensagem:
          "O chamado foi concluído com sucesso e o usuário foi notificado",
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        setAbreChamado(false);
      }, 700);
    } catch (err) {
      console.log(err);
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setConcluindo({ show: false, chamado: null });
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold">Resolução</h3>
          <button
            onClick={() => setConcluindo({ show: false, chamado: null })}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs text-white/70">
              <span>Descreva a resolução</span>
              <span className="text-white/50">{resolucao.length}/255</span>
            </div>
            <textarea
              placeholder="Digite aqui..."
              rows={4}
              maxLength={255}
              onChange={(e) => setResolucao(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400 resize-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() => setConcluindo({ show: false, chamado: null })}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
                       border-red-400/30 bg-red-500/20 px-5 py-2 text-sm font-medium text-red-200 
                       hover:bg-red-500/30 transition"
          >
            <XCircle className="h-4 w-4" />
            Cancelar
          </button>

          <button
            onClick={() =>
              setConfirmacao({
                show: true,
                titulo: "Deseja mesmo concluir esse chamado?",
                texto: "Essa ação não pode ser desfeita",
                onSim: () => alteraStatus(),
              })
            }
            disabled={!resolucao.trim()}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
    border-green-400/30 bg-green-500/20 px-5 py-2 text-sm font-medium text-green-200 
    hover:bg-green-500/30 transition
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500/20`}
          >
            <Check className="h-4 w-4" />
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
