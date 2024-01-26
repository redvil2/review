ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS builder

ARG PACKAGE_NAME=app-prisma

WORKDIR /app

COPY package.json yarn.lock tsconfig.*.json ./

WORKDIR /app/packages/$PACKAGE_NAME

COPY ./packages/$PACKAGE_NAME/package.json ./

RUN yarn install --frozen-lockfile

COPY ./packages/$PACKAGE_NAME ./
