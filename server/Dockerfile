FROM node:20.11.1 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./

COPY . .

RUN npm run build


FROM node:20.11.1 as runner

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD [ "npm", "run", "start" ]
ENV NODE_ENV=production