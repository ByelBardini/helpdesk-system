import { api } from "../api.js";
import { io } from "socket.io-client";
import { Store } from "@tauri-apps/plugin-store";

let socket = null;
let store = null;

async function getStore() {
  if (!store) {
    store = await Store.load("auth.dat");
  }
  return store;
}

export async function getToken() {
  const store = await getStore();
  const token = await store.get("token");
  return token || localStorage.getItem("token");
}

export async function login(usuario_senha, usuario_login) {
  try {
    const { data } = await api.post("/login", { usuario_login, usuario_senha });
    const { token, resposta } = data;

    localStorage.setItem("token", token);
    const store = await getStore();
    await store.set("token", token);
    await store.save();

    localStorage.setItem("usuario_id", resposta.usuario_id);
    localStorage.setItem("setor_id", resposta.setor.setor_id);
    localStorage.setItem("setor_nome", resposta.setor.setor_nome);
    localStorage.setItem("empresa_id", resposta.empresa.empresa_id);
    localStorage.setItem("empresa_nome", resposta.empresa.empresa_nome);
    localStorage.setItem("usuario_login", resposta.usuario_login);
    localStorage.setItem("usuario_role", resposta.usuario_role);
    localStorage.setItem("usuario_nome", resposta.usuario_nome);
    localStorage.setItem("usuario_troca_senha", resposta.usuario_troca_senha);

    await store.set("token", token);
    await store.save();

    if (resposta.usuario_caminho_foto != undefined) {
      localStorage.setItem(
        "usuario_caminho_foto",
        resposta.usuario_caminho_foto
      );
    }

    conectarSocket(token);

    return resposta;
  } catch (err) {
    console.error("Erro em login:", err);
    throw err;
  }
}

export async function conectarSocket(forceToken = null) {
  const token = forceToken || (await getToken());

  if (!token) {
    console.warn("Nenhum token encontrado, não conectando socket.");
    return null;
  }

  socket = io(import.meta.env.VITE_API_BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket conectado:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Erro socket:", err.message);
  });

  return socket;
}

export async function logout() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  try {
    await store.delete("token");
    await store.save();
  } catch (e) {
    console.warn("Erro ao limpar store:", e);
  }
  localStorage.clear();
}

export async function getUserInfo() {
  const token = await getToken();
  if (!token) {
    console.warn("Nenhum token encontrado");
    return null;
  }

  try {
    const { data } = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("usuario_id", data.usuario_id);
    localStorage.setItem("usuario_login", data.usuario_login);
    localStorage.setItem("usuario_nome", data.usuario_nome);
    localStorage.setItem("usuario_role", data.usuario_role);
    localStorage.setItem("usuario_troca_senha", data.usuario_troca_senha);

    if (data.usuario_caminho_foto) {
      localStorage.setItem("usuario_caminho_foto", data.usuario_caminho_foto);
    }

    if (data.empresa) {
      localStorage.setItem("empresa_id", data.empresa.empresa_id);
      localStorage.setItem("empresa_nome", data.empresa.empresa_nome);
    }

    if (data.setor) {
      localStorage.setItem("setor_id", data.setor.setor_id);
      localStorage.setItem("setor_nome", data.setor.setor_nome);
    }

    return data;
  } catch (err) {
    console.error("Erro ao buscar informações do usuário:", err);

    if (err.response?.status === 401) {
      localStorage.clear();
    }

    return null;
  }
}
