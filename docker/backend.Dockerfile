FROM node:20-alpine
WORKDIR /app
COPY application/backend/package*.json ./
RUN npm install --omit=dev
COPY application/backend/ ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
