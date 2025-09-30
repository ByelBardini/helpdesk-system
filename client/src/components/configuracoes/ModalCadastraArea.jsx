/* eslint-disable react-hooks/exhaustive-deps */
import { postGeral } from "../../services/api/configServices.js";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { tratarErro } from "../default/funcoes.js";

export default function ModalCadastraArea({
  setCadastro,
  buscarDados,
  setNotificacao,
  setLoading,
  navigate,
}) {
  const [nome, setNome] = useState("");
  const [tipos, setTipos] = useState([]);

  function toggleTipo(tipo) {
    setTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  }

  async function cadastraArea() {
    if (nome == "" || tipos.length == 0) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados inválidos",
        mensagem:
          "Preencha o nome e selecione ao menos uma situação onde essa área deve aparecer para os usuários",
      });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("operacao", "area");

      fd.append("nome", nome);
      fd.append("tipos", tipos);

      await postGeral(fd);

      await buscarDados();
      setLoading(false);

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Área cadastrada com sucesso",
        mensagem: "Usuários já podem abrir chamados relacioados à essa área",
      });

      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        setCadastro("");
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
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
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Cadastrar Area</h3>
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
            <span className="text-xs text-white/70">Nome da Área</span>
            <input
              type="text"
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nome !== "" && tipos.length > 0) {
                  e.preventDefault();
                  cadastraArea();
                }
              }}
              placeholder="Digite o nome"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/10 
                     px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
            />
          </label>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Erro", value: "erro" },
              { label: "Solicitação", value: "solicitacao" },
              { label: "Melhoria", value: "melhoria" },
            ].map(({ label, value }) => (
              <label
                key={label}
                className="flex flex-col items-center gap-2 text-xs text-white/70"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={tipos.includes(value)}
                  onChange={() => toggleTipo(value)}
                  className="h-5 w-5 rounded border border-white/20 bg-white/10 
                         checked:bg-blue-500 checked:border-blue-400 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            disabled={nome == "" || tipos.length == 0}
            onClick={cadastraArea}
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
