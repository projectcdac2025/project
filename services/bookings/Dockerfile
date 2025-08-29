FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --production
COPY src ./src
EXPOSE 4005
CMD ["npm","start"]

