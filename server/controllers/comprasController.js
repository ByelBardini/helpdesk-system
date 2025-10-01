import { Compra } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function postCompras(req, res) {
  const { empresa_id, setor_id, solicitante_id, item, quantidade, motivo } =
    req.body;
  if (
    !empresa_id ||
    !setor_id ||
    !solicitante_id ||
    !item ||
    !quantidade ||
    !motivo
  ) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  await Compra.create({
    compra_empresa_id: empresa_id,
    compra_setor_id: setor_id,
    compra_solicitante_id: solicitante_id,
    compra_item: item,
    compra_quantidade: quantidade,
    compra_motivo: motivo,
    compra_data: new Date(),
    compra_status: "em analise",
  });

  return res
    .status(201)
    .json({ message: "Solicitação de compra enviada com sucesso" });
}
