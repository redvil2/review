ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS builder

ARG PACKAGE_NAME=website-landing

WORKDIR /app

COPY package.json yarn.lock tsconfig.*.json ./

WORKDIR /app/packages/$PACKAGE_NAME

COPY ./packages/script-lang-generator ../script-lang-generator
COPY ./packages/shared-components ../shared-components
COPY ./packages/shared-i18n ../shared-i18n
COPY ./packages/shared-theme ../shared-theme

COPY ./packages/$PACKAGE_NAME/package.json ./

RUN yarn install --frozen-lockfile

COPY ./packages/$PACKAGE_NAME ./

COPY .env ../../

RUN yarn build

FROM nginx:alpine

ARG PACKAGE_NAME=website-landing

COPY --from=builder /app/packages/$PACKAGE_NAME/public /usr/share/nginx/html

COPY dockerfiles/spa.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
