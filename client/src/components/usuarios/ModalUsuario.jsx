/* eslint-disable react-hooks/exhaustive-deps */
import { X, Ban, RefreshCw, Save, Check } from "lucide-react";
import {
  putUsuarios,
  resetaSenha,
  ativaInativa,
} from "../../services/api/usuarioServices.js";
import { useState, useEffect } from "react";
import { tratarErro } from "../default/funcoes.js";

export default function ModalUsuario({
  setores,
  usuario,
  setEditaUsuario,
  buscaUsuarios,
  navigate,
  setNotificacao,
  setLoading,
  setConfirmacao,
}) {
  const [novoSetor, setNovoSetor] = useState(usuario.setor.setor_nome);
  const [novoRole, setNovoRole] = useState(usuario.usuario_role);

  async function realizaAcao(tipo) {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (
      tipo != "resetar" &&
      usuario.usuario_id == localStorage.getItem("usuario_id")
    ) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Ação inválida",
        mensagem:
          tipo === "editar"
            ? "Você não pode editar seu próprio usuário."
            : "Você não pode inativar seu próprio usuário.",
      });
      return;
    }
    setLoading(true);
    try {
      switch (tipo) {
        case "resetar": {
          await resetaSenha(usuario.usuario_id);
          setNotificacao({
            show: true,
            tipo: "sucesso",
            titulo: "Senha resetada com sucesso",
            mensagem: `Definida para o padrão "12345"`,
          });
          break;
        }
        case "editar": {
          await putUsuarios(usuario.usuario_id, novoSetor, novoRole);
          setNotificacao({
            show: true,
            tipo: "sucesso",
            titulo: "Usuário editado com sucesso",
            mensagem: `Os novos dados já estão valendo no sistema`,
          });
          break;
        }
        case "inativar": {
          await ativaInativa(usuario.usuario_id);
          setNotificacao({
            show: true,
            tipo: "sucesso",
            titulo:
              usuario.usuario_ativo == 0
                ? "Usuário reativado com sucesso"
                : "Usuário inativado com sucesso",
            mensagem:
              usuario.usuario_ativo == 0
                ? "O usuário voltou a ter acesso ao sistema"
                : "O usuário não terá mais acesso ao sistema",
          });
          break;
        }
      }
      await buscaUsuarios();
      setLoading(false);
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        setEditaUsuario({ show: false, usuario: null });
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
      console.error(err);
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setEditaUsuario({ show: false, usuario: false });
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Editar usuário</h3>
            <p className="text-xs text-white/60">
              Ajuste as informações abaixo
            </p>
          </div>
          <button
            onClick={() => {
              setEditaUsuario({ show: false, usuario: false });
            }}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Nome</span>
              <input
                type="text"
                value={usuario.usuario_nome}
                disabled
                className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/50 cursor-not-allowed"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Login</span>
              <input
                type="text"
                value={usuario.usuario_login}
                disabled
                className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/50 cursor-not-allowed"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Empresa</span>
              <input
                type="text"
                value={usuario.empresa.empresa_nome}
                disabled
                className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/50 cursor-not-allowed"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Setor</span>
              <select
                value={novoSetor}
                onChange={(e) => setNovoSetor(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                {setores.map((setor) => (
                  <option key={setor} value={setor}>
                    {setor}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs text-white/70">Tipo de usuário</span>
              <select
                value={novoRole}
                onChange={(e) => setNovoRole(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                {usuario.usuario_role == "suporte" ||
                usuario.usuario_role == "adm" ? (
                  <>
                    <option value="adm">Administrador</option>
                    <option value="suporte">Suporte</option>
                  </>
                ) : (
                  <>
                    <option value="gerente">Gerente</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="liderado">Liderado</option>
                  </>
                )}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70">Status</span>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
              Ativo
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {usuario.usuario_ativo == 1 ? (
              <button
                onClick={() =>
                  setConfirmacao({
                    show: true,
                    titulo: "Deseja inativar o usuário?",
                    texto: "Ele perderá o acesso ao aplicativo e suas funções",
                    onSim: () => realizaAcao("inativar"),
                  })
                }
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm text-red-300 hover:bg-red-500/25 transition"
              >
                <Ban className="h-4 w-4" />
                Inativar usuário
              </button>
            ) : (
              <button
                onClick={() =>
                  setConfirmacao({
                    show: true,
                    titulo: "Deseja reativar o usuário?",
                    texto:
                      "Ele voltará a ter acesso ao sistema e inteagir com as funções equivalentes à sua função",
                    onSim: () => realizaAcao("inativar"),
                  })
                }
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-green-400/30 bg-green-500/15 px-4 py-2 text-sm text-regreend-300 hover:bg-green-500/25 transition"
              >
                <Check className="h-4 w-4" />
                Ativar usuário
              </button>
            )}

            <button
              onClick={() =>
                setConfirmacao({
                  show: true,
                  titulo: "Deseja resetar a senha do usuário?",
                  texto: "A senha será resetada novamente ao padrão",
                  onSim: () => realizaAcao("resetar"),
                })
              }
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-500/15 px-4 py-2 text-sm text-yellow-200 hover:bg-yellow-500/25 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Resetar senha
            </button>
          </div>

          <button
            onClick={() =>
              setConfirmacao({
                show: true,
                titulo: "Deseja salvar os dados do usuário?",
                texto: "Confirme os dados antes de realizar a ação",
                onSim: () => realizaAcao("editar"),
              })
            }
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-green-400/30 bg-green-500/20 px-5 py-2 text-sm font-medium text-green-200 hover:bg-green-500/30 transition"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
