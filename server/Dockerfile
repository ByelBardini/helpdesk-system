FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ---- runtime image ----
FROM node:18-alpine

WORKDIR /app

# Copia apenas o que é necessário para rodar
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garante que o diretório de uploads exista na imagem base;
# o volume montado no Coolify sobrescreve este ponto em runtime.
RUN mkdir -p uploads/anexos

EXPOSE 80

CMD ["node", "server.js"]
