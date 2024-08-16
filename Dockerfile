FROM node:slim

WORKDIR /app

RUN npx playwright install-deps
USER node
RUN npx playwright install chromium

COPY ./build/ ./

CMD [ "node", "index.js" ]