FROM node:slim

WORKDIR /app

RUN npx playwright install-deps
RUN npx playwright install chromium

COPY ./build/ ./

COPY ./scripts/start.sh ./
RUN chmod +x ./start.sh

CMD [ "./start.sh" ]