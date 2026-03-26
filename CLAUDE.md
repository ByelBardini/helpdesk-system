# Helpdesk System — Diretrizes para Claude Code

## Estrutura do projeto

```
helpdesk-system/
  server/     # Node.js + Express — controllers, models, routes, middlewares
  client/     # React + Tauri — src/, src-tauri/
  migration/  # Migrations SQL manuais
  docs/       # Screenshots e documentação
  package.json         # Dependências do backend (raiz)
  client/package.json  # Dependências do frontend
```

## Convenções de nomenclatura

Manter os nomes padrão de mercado: `server/`, `client/`, `migration/`. Não renomear para variações como `backend/`, `frontend/`, `database/`.

## Dependências — versões fixas

**Nunca use `^` ou `~` em versões de pacotes** nos arquivos `package.json` (raiz ou `client/`).

Sempre especifique a versão exata:
```json
// correto
"express": "5.1.0"

// errado
"express": "^5.1.0"
"express": "~5.1.0"
```

Ao instalar novas dependências, use a flag `--save-exact` (ou `-E`):
```bash
npm install <pacote> --save-exact
```
