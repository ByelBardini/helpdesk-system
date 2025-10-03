/* eslint-disable react-hooks/exhaustive-deps */
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { putPergunta } from "../../services/api/faqServices.js";

export default function ModalPergunta({
  setModal,
  cat,
  tit,
  resp,
  tipo,
  id = null,
  setNotificacao,
  setLoading,
  navigate,
  buscarPerguntas,
}) {
  const [categoria, setCategoria] = useState("");
  const [titulo, setTitulo] = useState("");
  const [resposta, setResposta] = useState("");

  const [isOk, setIsOk] = useState(false);

  async function editaPergunta() {
    if (categoria == "" || titulo == "" || resposta == "") {
      return;
    }
    setLoading(true);
    try {
      await putPergunta(id, categoria, titulo, resposta);

      await buscarPerguntas();
      setLoading(false);
      alert("Deu bom");
      setModal({
        show: false,
        id: "",
        categoria: "",
        titulo: "",
        resposta: "",
        tipo: "",
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  useEffect(() => {
    setIsOk(
      categoria.trim() != "" && titulo.trim() != "" && resposta.trim() != ""
    );
  }, [categoria, titulo, resposta]);

  useEffect(() => {
    setCategoria(cat);
    setTitulo(tit);
    setResposta(resp);
  }, [cat, tit, resp]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape")
        setModal({
          show: false,
          id: "",
          categoria: "",
          titulo: "",
          resposta: "",
          tipo: "",
        });
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">
              {tipo == "editar" ? "Editar" : "Cadastrar"} Pergunta
            </h3>
            {tipo == "cadastro" && (
              <p className="text-xs text-white/60">Preencha os dados abaixo</p>
            )}
          </div>

          <button
            onClick={() =>
              setModal({
                show: false,
                id: "",
                categoria: "",
                titulo: "",
                resposta: "",
                tipo: "",
              })
            }
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Categoria</span>
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              type="text"
              placeholder="Digite a categoria"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/10 
                     px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Título</span>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              placeholder="Digite o título da pergunta"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/10 
                     px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Resposta</span>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              rows="4"
              placeholder="Digite a resposta para a pergunta"
              className="w-full rounded-lg border border-white/10 bg-white/10 
                     px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400 resize-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() =>
              setModal({
                show: false,
                id: "",
                categoria: "",
                titulo: "",
                resposta: "",
                tipo: "",
              })
            }
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
                   border-gray-400/30 bg-white/10 px-5 py-2 text-sm font-medium text-gray-300 
                   hover:bg-white/20 transition"
          >
            Cancelar
          </button>
          <button
            onClick={
              tipo == "cadastro"
                ? () => alert("cadastro")
                : () => editaPergunta()
            }
            disabled={!isOk}
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
