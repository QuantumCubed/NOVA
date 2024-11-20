FROM node:latest

WORKDIR /nodejs-web-server

COPY package*.json ./

COPY ./ ./

EXPOSE 8080

RUN npm install

CMD ["npm", "run" , "dev"]