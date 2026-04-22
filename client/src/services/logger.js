import { attachConsole, info, warn, error, debug } from "@tauri-apps/plugin-log";

export async function initLogger() {
  try {
    await attachConsole();
    await info("Logger iniciado — logs sendo gravados em arquivo");
  } catch (e) {
    console.error("[Logger] Falha ao inicializar:", e);
  }
}

export { info, warn, error, debug };
