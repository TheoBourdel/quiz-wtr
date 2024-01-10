FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

CMD ["npm", "start"]
