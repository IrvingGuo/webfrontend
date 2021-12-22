FROM circleci/node:16.12.0-bullseye-browsers as builder
USER root
WORKDIR /usr/src/app/
COPY package.json ./
RUN yarn
COPY ./ ./
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html/
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
