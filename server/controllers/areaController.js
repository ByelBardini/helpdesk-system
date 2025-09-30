import { Area } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getAreas(req, res) {
  const areas = await Area.findAll({ where: { area_ativa: 1 } });

  return res.status(200).json(areas);
}
