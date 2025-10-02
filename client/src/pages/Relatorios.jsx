import TelaRelatorios from "../components/relatorios/TelaRelatorios.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import { useState } from "react";

export default function Relatorios() {
  const [selecionado, setSelecionado] = useState("tempo");
  const [resultado, setResultado] = useState([]);

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  const menu = {
    geral: [
      {
        key: "tempo",
        title: "Tempo de resolução",
        desc: "Tempo médio para cada chamado ser resolvido.",
      },
      {
        key: "responsaveis",
        title: "Responsáveis",
        desc: "Porcentagem de chamados resolvidos por cada responsável.",
      },
      {
        key: "solicitacoes",
        title: "Solicitações",
        desc: "Valor gasto com cada tipo de solicitação de compra.",
      },
    ],
    periodo: [
      {
        key: "abertos",
        title: "Chamados abertos por período",
        desc: "Quantidade de chamados abertos em um intervalo de tempo.",
      },
      {
        key: "compras",
        title: "Solicitações de compras por período",
        desc: "Quantidade de solicitações de compra aberto em um intervalo de tempo.",
      },
    ],
  };

  const todasOpcoes = [...menu.geral, ...menu.periodo];

  const getSelectedTitle = () =>
    todasOpcoes.find((item) => item.key === selecionado)?.title || "";

  const getSelectedDesc = () =>
    todasOpcoes.find((item) => item.key === selecionado)?.desc || "";

  const renderGrupoMenu = (titulo, opcoes) => (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
        {titulo}
      </h3>
      <div className="space-y-2">
        {opcoes.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              setResultado([]);
              setSelecionado(item.key);
            }}
            className={`rounded-xl border p-3 transition cursor-pointer ${
              selecionado === item.key
                ? "bg-blue-600/20 border-blue-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <h2 className="text-sm font-semibold text-white">{item.title}</h2>
            {selecionado === item.key && (
              <p className="text-xs text-white/60 mt-1">{item.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-12 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 custom-scrollbar">
      {notificacao.show && (
        <Notificacao
          titulo={notificacao.titulo}
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClick={() =>
            setNotificacao({
              show: false,
              tipo: "sucesso",
              titulo: "",
              mensagem: "",
            })
          }
        />
      )}
      {loading && <Loading />}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <nav className="col-span-12 md:col-span-3 space-y-6">
          {renderGrupoMenu("Geral", menu.geral)}
          {renderGrupoMenu("Período", menu.periodo)}
        </nav>

        <TelaRelatorios
          getSelectedTitle={getSelectedTitle}
          getSelectedDesc={getSelectedDesc}
          selecionado={selecionado}
          resultado={resultado}
          setResultado={setResultado}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
