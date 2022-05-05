FROM node:alpine as react
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN sed -i 's/location \/ {/location \/ {\n\ttry_files $uri \/index.html;/' /etc/nginx/conf.d/default.conf 
WORKDIR /usr/share/nginx/html
COPY --from=react /app/build .