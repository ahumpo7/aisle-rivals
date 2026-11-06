FROM node:20-alpine

WORKDIR /app

# Install root dependencies
COPY package*.json ./
RUN npm install

# Install client dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NO_TUNNEL=true

CMD ["node", "server/server.js"]
