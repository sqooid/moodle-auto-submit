FROM node:slim

COPY ./build/ ./
COPY ./package.json ./

USER node

CMD [ "node", "index.js" ]