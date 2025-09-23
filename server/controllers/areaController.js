import { Area } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getAreas(req, res) {
  const areas = await Area.findAll();

  return res.status(200).json(areas);
}
