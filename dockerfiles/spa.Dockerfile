ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-buster AS builder

ARG PACKAGE_NAME=app-client

WORKDIR /app

COPY package.json yarn.lock tsconfig.*.json ./

WORKDIR /app/packages/app-prisma

COPY ./packages/app-prisma ./

RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /app/packages/app-prisma

COPY ./packages/script-lang-generator ./

RUN yarn install --frozen-lockfile

WORKDIR /app/packages/$PACKAGE_NAME

COPY ./packages/app-components ../app-components
COPY ./packages/shared-components ../shared-components
COPY ./packages/shared-i18n ../shared-i18n
COPY ./packages/shared-theme ../shared-theme
COPY ./packages/shared-theme ../shared-theme

COPY ./packages/$PACKAGE_NAME/package.json ./

RUN yarn install --frozen-lockfile

COPY ./packages/$PACKAGE_NAME ./

COPY .env ../../

RUN yarn generate-languages

COPY .git ../../.git

RUN yarn build

FROM nginx:alpine

ARG PACKAGE_NAME=app-client

COPY --from=builder /app/packages/$PACKAGE_NAME/dist /usr/share/nginx/html

COPY dockerfiles/spa.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
