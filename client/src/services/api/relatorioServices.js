import { api } from "../api.js";

export async function getDadosRelatorios() {
  try {
    const response = await api.get("/relatorio/dados");

    return response.data;
  } catch (err) {
    console.error("Erro em getDadosRelatorios:", err);
    throw err;
  }
}

export async function getTempoResolucao(dataInicio, dataFim, empresa) {
  try {
    const response = await api.put("/relatorio/resolucao", {
      dataInicio,
      dataFim,
      empresa,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em tempoResolucao:", err);
    throw err;
  }
}
