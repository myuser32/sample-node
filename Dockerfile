FROM node:13.8.0-alpine
RUN apk add --no-cache tzdata 
ENV DEBUG=server,server:*
ENV PORT=4000
RUN export DEBUG=server,server:*
RUN export PORT=4000
WORKDIR /usr/src/app
RUN mkdir -p market-place-sp-portal-backend
COPY . /usr/src/app/market-place-sp-portal-backend/
WORKDIR /usr/src/app/market-place-sp-portal-backend
RUN npm install
EXPOSE 4000
CMD [ "npm", "run", "start" ]
