/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import ListaEmpresas from "../components/configuracoes/ListaEmpresas.jsx";
import ListaSetores from "../components/configuracoes/ListaSetores.jsx";
import ListaAreas from "../components/configuracoes/ListaAreas.jsx";
import ModalCadastraEmpresa from "../components/configuracoes/ModalCadastraEmpresa.jsx";
import ModalCadastraSetor from "../components/configuracoes/ModalCadastraSetor.jsx";
import ModalCadastraArea from "../components/configuracoes/ModalCadastraArea.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import { useEffect, useState } from "react";
import { getDados, ativaInativaGeral } from "../services/api/configServices.js";
import { Building2, Grid, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tratarErro } from "../components/default/funcoes.js";

export default function Configuracoes() {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);
  const [open, setOpen] = useState(null);

  const [cadastro, setCadastro] = useState("");

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });

  const secoes = [
    { titulo: "Empresas", cor: "bg-blue-500", icone: Building2 },
    { titulo: "Setores", cor: "bg-green-500", icone: Grid },
    { titulo: "Áreas", cor: "bg-purple-500", icone: Layers },
  ];

  const toggle = (secao) => {
    setOpen(open === secao ? null : secao);
  };

  async function buscarDados() {
    setLoading(true);
    try {
      const dados = await getDados();
      setLoading(false);

      setDados(dados);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function ativaInativa(id, tipo, ativo) {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (tipo == "setor" && id == localStorage.getItem("setor_id")) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Ação não permitida",
        mensagem: "Você não pode inativar o setor ao qual faz parte",
      });
      return;
    }
    if (tipo == "empresa" && id == localStorage.getItem("empresa_id")) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Ação não permitida",
        mensagem: "Você não pode inativar a empresa à qual faz parte",
      });
      return;
    }
    setLoading(true);
    try {
      await ativaInativaGeral(id, tipo);
      setLoading(false);
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: `${ativo ? "Inativado" : "Ativado"} com sucesso`,
        mensagem: "O item foi atualizado com sucesso",
      });
      await buscarDados();
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
      console.error(err);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <div className="min-h-screen h-screen pb-18 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 overflow-y-auto">
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
      {confirmacao.show && (
        <Confirmacao
          texto={confirmacao.texto}
          titulo={confirmacao.titulo}
          onSim={confirmacao.onSim}
          onNao={() =>
            setConfirmacao({
              show: false,
              titulo: "",
              texto: "",
              onSim: null,
            })
          }
        />
      )}
      {loading && <Loading />}
      {cadastro == "empresa" && (
        <ModalCadastraEmpresa
          buscarDados={buscarDados}
          setCadastro={setCadastro}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          navigate={navigate}
        />
      )}
      {cadastro == "setor" && (
        <ModalCadastraSetor
          buscarDados={buscarDados}
          setCadastro={setCadastro}
          empresas={dados.empresas}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          navigate={navigate}
        />
      )}
      {cadastro == "area" && (
        <ModalCadastraArea
          buscarDados={buscarDados}
          setCadastro={setCadastro}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          navigate={navigate}
        />
      )}
      <div className="space-y-4">
        {secoes.map(({ titulo, cor, icone: Icon }) => (
          <div
            key={titulo}
            className="rounded-xl border border-white/10 overflow-hidden shadow-lg"
          >
            <button
              onClick={() => toggle(titulo)}
              className="cursor-pointer w-full flex flex-col px-5 py-4 text-left font-semibold bg-[#1c1f4a]/70 hover:bg-[#1c1f4a]/90 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-white/80" />
                  <span>{titulo}</span>
                </div>
                {open === titulo ? (
                  <ChevronUp className="w-5 h-5 text-white/70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/70" />
                )}
              </div>
              <div className={`mt-2 h-1 rounded-full ${cor}`} />
            </button>

            {open == "Empresas" && titulo == open && (
              <ListaEmpresas
                empresas={dados.empresas}
                cor={cor}
                ativaInativa={ativaInativa}
                setCadastro={setCadastro}
                setConfirmacao={setConfirmacao}
              />
            )}
            {open == "Setores" && titulo == open && (
              <ListaSetores
                setores={dados.setores}
                cor={cor}
                ativaInativa={ativaInativa}
                setCadastro={setCadastro}
                setConfirmacao={setConfirmacao}
              />
            )}
            {open == "Áreas" && titulo == open && (
              <ListaAreas
                areas={dados.areas}
                cor={cor}
                ativaInativa={ativaInativa}
                setCadastro={setCadastro}
                setConfirmacao={setConfirmacao}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
