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
