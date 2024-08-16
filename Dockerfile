FROM node:slim

WORKDIR /app

RUN npx playwright install --with-deps chromium

COPY ./build/ ./

USER node

CMD [ "node", "index.js" ]