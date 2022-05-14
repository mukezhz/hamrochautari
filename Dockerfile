ARG APP_HOME=/app
FROM node:alpine as react
ARG APP_HOME
ENV APP_HOME=${APP_HOME}
WORKDIR ${APP_HOME}
COPY package.json .
COPY package-lock.json .
RUN npm i -g npm
RUN npm ci
COPY ./tsconfig.json .
COPY ./public public/
COPY ./src src/
RUN npm run build
COPY ./.env_sample .
COPY nginx.conf .

FROM nginx:alpine
ARG APP_HOME
COPY --from=react ${APP_HOME}/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=react ${APP_HOME}/build .
COPY --from=react ${APP_HOME}/.env_sample .env
COPY --from=react ${APP_HOME}/build .

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g runtime-env-cra@0.2.4

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]