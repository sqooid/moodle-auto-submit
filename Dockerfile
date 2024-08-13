FROM --platform=linux/arm64 node:slim

COPY ./build/ ./

USER node

CMD [ "node", "index.js" ]