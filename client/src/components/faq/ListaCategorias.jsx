export default function ListaCategorias({
  setCategoriaSelecionada,
  categoriaSelecionada,
  perguntas,
}) {
  return (
    <aside className="lg:col-span-1 bg-[#2a2d5a] rounded-2xl p-4 shadow-md h-fit sticky top-6">
      <h2 className="text-lg font-semibold mb-4 text-[#6bb7ff]">Categorias</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setCategoriaSelecionada("")}
            className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg transition ${
              categoriaSelecionada === ""
                ? "bg-[#6bb7ff]/20 text-[#6bb7ff]"
                : "hover:bg-[#343765] text-white/80"
            }`}
          >
            Todas
          </button>
        </li>
        {[...new Set(perguntas.map((p) => p.pergunta_categoria))].map(
          (categoria) => (
            <li key={categoria}>
              <button
                onClick={() => setCategoriaSelecionada(categoria)}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg transition ${
                  categoriaSelecionada === categoria
                    ? "bg-[#6bb7ff]/20 text-[#6bb7ff]"
                    : "hover:bg-[#343765] text-white/80"
                }`}
              >
                {categoria}
              </button>
            </li>
          )
        )}
      </ul>
    </aside>
  );
}
