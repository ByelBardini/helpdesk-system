import { formatToCapitalized, formatToDate } from "brazilian-values";

export default function DadosModalChamado({
  chamado,
  prioridade,
  setPrioridade,
  podeEditar,
}) {
  return (
    <div className="w-1/2 p-6 flex flex-col space-y-6 border-r border-white/10 overflow-y-auto">
      <div>
        <p className="text-gray-400 text-xs uppercase">Solicitante</p>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
          {chamado.usuario?.usuario_nome}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase">Empresa</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {chamado.usuario?.empresa.empresa_nome || "-"}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase">Setor</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {chamado.usuario?.setor.setor_nome || "-"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase">Tipo</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {chamado.chamado_tipo == "solicitacao"
              ? "Solicitação"
              : formatToCapitalized(chamado.chamado_tipo)}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase">Área</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {chamado.area?.area_nome || "-"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase">Data de Abertura</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {formatToDate(
              new Date(chamado.chamado_data_abertura + "T03:00:00Z")
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase">Data de Conclusão</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {chamado.chamado_data_conclusao
              ? formatToDate(
                  new Date(chamado.chamado_data_conclusao + "T03:00:00Z")
                )
              : "Não finalizado"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase">Status</p>
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {formatToCapitalized(chamado.chamado_status)}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase">Prioridade</p>
          <select
            value={prioridade}
            disabled={!podeEditar}
            onChange={(e) => {
              setPrioridade(e.target.value);
            }}
            className="w-full bg-[#1c1f4a] border border-white/20 rounded-lg px-3 py-2 text-sm"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-xs uppercase">Descrição</p>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm whitespace-pre-line min-h-[100px]">
          {chamado.chamado_descricao}
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-xs uppercase mb-1">Anexos</p>
        {chamado.anexos && chamado.anexos.length > 0 ? (
          <ul className="space-y-2">
            {chamado.anexos.map((anexo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <span className="truncate">{anexo.anexo_nome}</span>
                <a
                  href={anexo.anexo_caminho}
                  download
                  className="cursor-pointer ml-3 bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400">
            Nenhum anexo enviado.
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        {(chamado.chamado_status === "em aberto" ||
          chamado.chamado_status === "visualizado") && (
          <button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors">
            Iniciar Chamado
          </button>
        )}

        {chamado.chamado_status === "resolvendo" && (
          <button className="cursor-pointer w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors">
            Concluir Chamado
          </button>
        )}

        <button className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors">
          Salvar
        </button>
      </div>
    </div>
  );
}
