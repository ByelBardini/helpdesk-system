import { api } from "../api.js";

export async function getChamados(role, id) {
  try {
    const response = await api.get(`/chamado/usuario/${role}/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em getChamados:", err);
    throw err;
  }
}

export async function getChamadosSuporte() {
  try {
    const response = await api.get(`/chamado/suporte/`);

    return response.data;
  } catch (err) {
    console.error("Erro em getChamados:", err);
    throw err;
  }
}

export async function postChamado(fd) {
  try {
    const response = await api.post("/chamado", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postChamado:", err);
    throw err;
  }
}
