import { api } from "../api.js";

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
