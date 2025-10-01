import { api } from "../api.js";

export async function postCompras(
  empresa_id,
  setor_id,
  solicitante_id,
  item,
  quantidade,
  motivo
) {
  try {
    const response = await api.post(`/compra`, {
      empresa_id,
      setor_id,
      solicitante_id,
      item,
      quantidade,
      motivo,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postCompras:", err);
    throw err;
  }
}
