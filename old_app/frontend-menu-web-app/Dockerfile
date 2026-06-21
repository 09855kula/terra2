FROM node:14.18.2-alpine AS node_base

FROM node_base as deps
WORKDIR /usr/app
COPY package.json /usr/app/package.json
COPY yarn.lock /usr/app/yarn.lock
RUN yarn --network-timeout 100000

FROM node_base as build
WORKDIR /usr/app
COPY --from=deps /usr/app/node_modules /usr/app/node_modules
COPY . /usr/app
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /usr/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
