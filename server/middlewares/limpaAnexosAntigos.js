import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const BASE_DIR = path.join(ROOT, "uploads", "anexos");

const TRES_MESES = 1000 * 60 * 60 * 24 * 90;

export function limpaArquivosAntigos(req, res, next) {
  try {
    if (!fs.existsSync(BASE_DIR)) {
      return next();
    }

    const files = fs.readdirSync(BASE_DIR);

    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(BASE_DIR, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtimeMs > TRES_MESES) {
        fs.unlinkSync(filePath);
        console.log(`Arquivo apagado: ${file}`);
      }
    });
  } catch (err) {
    console.error("Erro ao limpar anexos antigos:", err);
  }

  next();
}
