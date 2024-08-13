FROM node:slim

WORKDIR /app

COPY ./build/ ./

USER node

CMD [ "node", "index.js" ]