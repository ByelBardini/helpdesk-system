/* eslint-disable react-hooks/exhaustive-deps */
import { postGeral } from "../../services/api/configServices.js";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function ModalCadastraSetor({
  setCadastro,
  buscarDados,
  empresas,
}) {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");

  const [listaEmpresas, setListaEmpresas] = useState([]);

  useEffect(() => {
    setListaEmpresas(empresas);
    console.log(empresas);
  }, [empresas]);

  async function cadastraSetor() {
    try {
      const fd = new FormData();
      fd.append("operacao", "setor");

      fd.append("nome", nome);
      fd.append("empresa_id", empresa);

      await postGeral(fd);

      await buscarDados();
      setCadastro("");
      alert("Setor Cadastrado");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setCadastro("");
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Cadastrar Setor</h3>
            <p className="text-xs text-white/60">Preencha os dados abaixo</p>
          </div>

          <button
            onClick={() => setCadastro("")}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Empresa</span>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/10 
             bg-[#1c1f4a] px-3 text-sm text-white 
             outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
             appearance-none"
            >
              <option value={""} hidden>
                Selecione a empresa
              </option>
              {listaEmpresas.map((empresa) => (
                <option
                  key={empresa.empresa_id}
                  value={empresa.empresa_id}
                  className="bg-[#1c1f4a] text-white"
                >
                  {empresa.empresa_nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Nome do Setor</span>
            <input
              onChange={(e) => setNome(e.target.value)}
              type="text"
              placeholder="Digite o nome"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/10 px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={cadastraSetor}
            disabled={empresa == "" || nome === ""}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
             border-green-400/30 bg-green-500/20 px-5 py-2 text-sm font-medium text-green-200 
             hover:bg-green-500/30 transition 
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500/20"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
