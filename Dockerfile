FROM node:20.12.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.example .env

EXPOSE 3000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.11.0/wait /wait
RUN chmod +x /wait

CMD ["/bin/bash", "-c", "/wait && npm run update-database && npm start"]