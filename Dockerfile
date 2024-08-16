FROM node:slim

WORKDIR /app

COPY ./build/ ./

COPY ./scripts/start.sh ./
RUN chmod +x ./start.sh

CMD [ "./start.sh" ]