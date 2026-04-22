FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads/anexos

EXPOSE 3034

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3034/health || exit 1

CMD ["node", "server.js"]
