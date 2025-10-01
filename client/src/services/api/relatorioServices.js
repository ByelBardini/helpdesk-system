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
    console.error("Erro em getTempoResolucao:", err);
    throw err;
  }
}

export async function getResponsaveis(dataInicio, dataFim, empresa) {
  try {
    const response = await api.put("/relatorio/responsaveis", {
      dataInicio,
      dataFim,
      empresa,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em getResponsaveis:", err);
    throw err;
  }
}

export async function getSolicitacoes(dataInicio, dataFim, empresa) {
  try {
    const response = await api.put("/relatorio/solicitacoes", {
      dataInicio,
      dataFim,
      empresa,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em getSolicitacoes:", err);
    throw err;
  }
}

export async function getChamadosAbertos(dataInicio, dataFim, empresa) {
  try {
    const response = await api.put(
      "/relatorio/abertos",
      { dataInicio, dataFim, empresa },
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio_chamados.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erro em getChamadosAbertos:", err);
    throw err;
  }
}
