export function tratarErro(setNotificacao, err, navigate) {
  console.error(err);
  if (err.status == 401 || err.status == 403) {
    setNotificacao({
      show: true,
      tipo: "erro",
      titulo: `Erro de validação`,
      mensagem:
        "Sessão inválida ou expirada, redirecionando para a tela de login",
    });
    setTimeout(() => {
      setNotificacao({
        show: false,
        tipo: "sucesso",
        titulo: "",
        mensagem: "",
      });
      navigate("/", { replace: true });
    }, 700);
  }
  setNotificacao({
    show: true,
    tipo: "erro",
    titulo: `Erro ${err.status}`,
    mensagem: err.message,
  });
}
