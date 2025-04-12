FROM node:20.11.1

WORKDIR /app

ARG NODE_ENV=development

COPY package*.json /.

COPY tsconfig.json /.

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]