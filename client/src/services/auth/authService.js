import { api } from "../api.js";
import { io } from "socket.io-client";

let socket = null;

export async function login(usuario_senha, usuario_login) {
  try {
    const { data } = await api.post("/login", { usuario_login, usuario_senha });
    const { token, resposta } = data;

    console.log(data);

    console.log(data);

    localStorage.setItem("token", token);
    localStorage.setItem("usuario_id", resposta.usuario_id);
    localStorage.setItem("setor_id", resposta.setor.setor_id);
    localStorage.setItem("setor_nome", resposta.setor.setor_nome);
    localStorage.setItem("empresa_id", resposta.empresa.empresa_id);
    localStorage.setItem("empresa_nome", resposta.empresa.empresa_nome);
    localStorage.setItem("usuario_login", resposta.usuario_login);
    localStorage.setItem("usuario_role", resposta.usuario_role);
    localStorage.setItem("usuario_nome", resposta.usuario_nome);
    localStorage.setItem("usuario_troca_senha", resposta.usuario_troca_senha);
    if (resposta.usuario_caminho_foto != undefined) {
      localStorage.setItem(
        "usuario_caminho_foto",
        resposta.usuario_caminho_foto
      );
    }

    socket = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Erro socket:", err.message);
    });

    return resposta;
  } catch (err) {
    console.error("Erro em login:", err);
    throw err;
  }
}
