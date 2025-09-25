import { api } from "../api.js";

export async function getChamadosUsuario(id) {
  try {
    const response = await api.get(`/chamado/usuario/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em getChamadosUsuario:", err);
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
