import { api } from "../api.js";

export async function getDados() {
  try {
    const response = await api.get(`/config`);

    return response.data;
  } catch (err) {
    console.error("Erro em getDados configurações:", err);
    throw err;
  }
}

export async function ativaInativaGeral(id, tipo) {
  try {
    const response = await api.put(`/config/inativa/${id}`, { tipo });

    return response.data;
  } catch (err) {
    console.error("Erro em ativaInativaGeral:", err);
    throw err;
  }
}

export async function postGeral(fd) {
  try {
    const response = await api.post("/config", fd, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postGeral:", err);
    throw err;
  }
}
