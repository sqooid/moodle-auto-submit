FROM --platform=linux/arm64/v8 node:slim

COPY ./build/ ./

USER node

CMD [ "node", "index.js" ]