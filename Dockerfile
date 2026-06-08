FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --production
COPY server/ ./
COPY src/ ./public/
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "index.js"]
