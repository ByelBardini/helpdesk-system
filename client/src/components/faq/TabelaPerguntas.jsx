/* eslint-disable no-unused-vars */
import { Search, ChevronDown, ChevronUp, SearchX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TabelaPerguntas({
  setPesquisa,
  perguntasOrdenadas,
  perguntasFiltradas,
  toggleExibindo,
}) {
  return (
    <main className="lg:col-span-3 space-y-4">
      <div className="relative mb-6">
        <input
          onChange={(e) => setPesquisa(e.target.value)}
          type="text"
          placeholder="Pesquisar dúvida..."
          className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 pl-11 outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[#6bb7ff]/40"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
      </div>

      <AnimatePresence mode="popLayout">
        {perguntasOrdenadas.map((pergunta) => (
          <motion.article
            key={pergunta.pergunta_id}
            layout
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => toggleExibindo(pergunta.pergunta_id)}
            className="rounded-2xl bg-[#2a2d5a] shadow-md overflow-hidden cursor-pointer transition"
          >
            <header
              className={`flex items-center justify-between p-3 transition-colors ${
                pergunta.exibindo ? "bg-[#343765]" : "hover:bg-[#343765]"
              }`}
            >
              <h3 className="font-medium text-white/90 text-base">
                {pergunta.pergunta_titulo}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/50">
                  {pergunta.pergunta_categoria}
                </span>
                {!pergunta.exibindo ? (
                  <ChevronDown className="h-5 w-5 text-[#6bb7ff]" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-[#ff6b98]" />
                )}
              </div>
            </header>

            {/* Animação de expansão do conteúdo */}
            <AnimatePresence initial={false}>
              {pergunta.exibindo && (
                <motion.div
                  key={pergunta.pergunta_id + "-conteudo"}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 text-sm leading-relaxed text-white/70 bg-[#1c1f4a] border-t border-white/10">
                    {pergunta.pergunta_resposta}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </AnimatePresence>
      {perguntasFiltradas.length == 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-white/70">
          <SearchX className="h-12 w-12 text-[#6bb7ff] mb-4" />
          <p className="text-lg font-semibold">Nenhuma pergunta encontrada</p>
          <p className="text-sm text-white/50">
            Tente outra palavra-chave ou categoria.
          </p>
        </div>
      )}
    </main>
  );
}
