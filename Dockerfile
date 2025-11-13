FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run db:migrate && npm run start"]

