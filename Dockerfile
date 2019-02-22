FROM node:10

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY /build ./

EXPOSE 3000

CMD ["npm", "run", "start"]