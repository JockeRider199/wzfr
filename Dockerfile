FROM node:20-slim

WORKDIR /home/wzfr

COPY ./dist /home/wzfr/

RUN apt-get update -y && apt-get install -y openssl
RUN npm install
RUN npx prisma generate

CMD node src/index.js
