/* eslint-disable react-hooks/exhaustive-deps */
import { getDados } from "../../services/api/usuarioServices.js";
import { tratarErro } from "../default/funcoes.js";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function CadastraUsuario({
  setCadastrando,
  buscaUsuarios,
  setNotificacao,
  setLoading,
  navigate,
}) {
  const [setores, setSetores] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [role, setRole] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [setor, setSetor] = useState("");

  async function buscaDados() {
    setLoading(true);
    try {
      const dados = await getDados();
      setLoading(false);
      setEmpresas(dados.empresas);
      setSetores(dados.setores);
    } catch (err) {
      tratarErro();
      setLoading(false);
      console.error("Erro ao buscar dados:", err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    buscaDados();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setCadastrando(false);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Cadastrar usuário</h3>
            <p className="text-xs text-white/60">
              Preencha as informações abaixo
            </p>
          </div>

          <button
            onClick={() => setCadastrando(false)}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Nome completo</span>
              <input
                onChange={(e) => setNome(e.target.value)}
                type="text"
                placeholder="Digite o nome completo"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Login</span>
              <input
                onChange={(e) => setLogin(e.target.value)}
                type="text"
                placeholder="Digite o login do usuário"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400"
              />
            </label>

            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs text-white/70">Tipo de usuário</span>
              <select
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1c1f4a] px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option hidden value="">
                  Selecione o tipo
                </option>
                <option value="adm">Administrador</option>
                <option value="suporte">Suporte</option>
                <option value="gerente">Gerente</option>
                <option value="supervisor">Supervisor</option>
                <option value="liderado">Liderado</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Empresa</span>
              <select
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1c1f4a] px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option hidden value="">
                  Selecione a empresa
                </option>
                {empresas?.map((empresa) => (
                  <option
                    key={empresa.empresa_id}
                    value={empresa.empresa_id}
                    className="bg-[#0e1033]"
                  >
                    {empresa.empresa_nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Setor</span>
              <select
                disabled={empresa == ""}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1c1f4a] px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option hidden value="">
                  Selecione o setor
                </option>
                {setores
                  ?.filter((setor) => setor.setor_empresa_id == empresa)
                  .map((setor) => (
                    <option
                      key={setor.setor_id}
                      value={setor.setor_id}
                      className="bg-[#0e1033]"
                    >
                      {setor.setor_nome}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-green-400/30 bg-green-500/20 px-5 py-2 text-sm font-medium text-green-200 hover:bg-green-500/30 transition">
            <Save className="h-4 w-4" />
            Salvar Usuário
          </button>
        </div>
      </div>
    </div>
  );
}
