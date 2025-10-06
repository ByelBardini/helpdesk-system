import { Lock, Eye, EyeOff } from "lucide-react";
import { novaSenha } from "../../services/api/usuarioServices.js";
import { useEffect, useState } from "react";
import { tratarErro } from "../default/funcoes.js";

export default function ModalPrimeiroAcesso({
  setTrocaSenha,
  setLoading,
  setNotificacao,
  navigate,
}) {
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const [isOk, setIsOk] = useState(false);
  const [isErroConfirma, setIsErroConfirma] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  useEffect(() => {
    setIsOk(senha.length >= 5 && senha === confirmaSenha);
    setIsErroConfirma(confirmaSenha.length > 0 && senha !== confirmaSenha);
  }, [senha, confirmaSenha]);

  function enter(e) {
    if (e.key === "Enter" && isOk) {
      trocarSenha();
    }
  }

  async function trocarSenha() {
    if (senha !== confirmaSenha || senha.length < 5) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados inválidos",
        mensagem: "As senhas não coincidem ou são muito curtas.",
      });
      return;
    }
    setLoading(true);
    try {
      await novaSenha(localStorage.getItem("usuario_id"), senha);

      localStorage.setItem("usuario_troca_senha", "0");

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Senha alterada",
        mensagem: "Senha alterada com sucesso!",
      });
      setTimeout(() => {
        setTrocaSenha(false);
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-[92vw] max-w-md rounded-2xl border border-white/10 bg-[#121437] text-white shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/30">
            <Lock className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-tight">
              Definir nova senha
            </h3>
            <p className="text-xs text-white/60">
              Este é seu primeiro acesso. Crie uma senha segura.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Nova senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={enter}
                placeholder="••••••••"
                className="w-full pr-10 rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none
                           placeholder:text-white/40 focus:ring-2 focus:ring-indigo-400/40"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={mostrarSenha}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              >
                {mostrarSenha ? (
                  <EyeOff className="h-5 w-5 text-white/70" />
                ) : (
                  <Eye className="h-5 w-5 text-white/70" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                type={mostrarConfirma ? "text" : "password"}
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                onKeyDown={enter}
                aria-invalid={isErroConfirma}
                placeholder="••••••••"
                className={`w-full pr-10 rounded-lg px-3 py-2 outline-none placeholder:text-white/40
                  bg-white/10 border focus:ring-2
                  ${
                    isErroConfirma
                      ? "border-red-400/70 focus:ring-red-400/40 bg-red-500/5"
                      : "border-white/15 focus:ring-indigo-400/40"
                  }`}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirma((v) => !v)}
                aria-label={mostrarConfirma ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={mostrarConfirma}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              >
                {mostrarConfirma ? (
                  <EyeOff className="h-5 w-5 text-white/70" />
                ) : (
                  <Eye className="h-5 w-5 text-white/70" />
                )}
              </button>
            </div>

            {isErroConfirma && (
              <p className="text-xs text-red-300">As senhas não coincidem.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-white/5 border-t border-white/10">
          <button
            type="button"
            disabled={!isOk}
            aria-disabled={!isOk}
            onClick={trocarSenha}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2
                       text-sm font-semibold transition-colors outline-none
                       bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-400/60
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
