FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

RUN mkdir -p uploads logs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start command
CMD ["node", "server.js"]