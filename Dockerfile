FROM node:16.14.2
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --silent
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]