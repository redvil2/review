ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS builder

ARG PACKAGE_NAME=app-server

WORKDIR /app

COPY package.json yarn.lock tsconfig.*.json ./
COPY packages/${PACKAGE_NAME}/package.json ./packages/${PACKAGE_NAME}/package.json
COPY packages/app-prisma/package.json ./packages/app-prisma/package.json
COPY packages/shared-backend-logger/package.json ./packages/shared-backend-logger/package.json
RUN yarn install --frozen-lockfile

WORKDIR /app/packages/app-prisma
COPY ./packages/app-prisma ./
RUN yarn build

WORKDIR /app/packages/shared-backend-logger
COPY ./packages/shared-backend-logger ./
RUN yarn build

WORKDIR /app/packages/$PACKAGE_NAME
COPY ./packages/$PACKAGE_NAME ./
RUN yarn build

RUN yarn install --frozen-lockfile --production

FROM node:${NODE_VERSION}-alpine

ARG PACKAGE_NAME=app-server
ARG SENTRY_RELEASE

ENV SENTRY_RELEASE=$SENTRY_RELEASE

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/@app/shared-backend-logger ./node_modules/@app/shared-backend-logger
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/packages/app-prisma ./packages/app-prisma

WORKDIR /app/dist/packages/$PACKAGE_NAME

ENV PORT 3000
EXPOSE $PORT

CMD ["node", "src/main.js"]
