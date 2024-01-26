ARG PACKAGE_NAME=app-generator

FROM node:18-buster as build-image

ARG PACKAGE_NAME

RUN apt-get update && \
    apt-get install -y \
    libfontconfig1 \
    libfreetype6 \
    python3 \
    libjpeg-turbo-progs \
    libpng16-16 \
    libicu-dev \
    cmake gcc g++ make curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app

COPY package.json yarn.lock tsconfig.*.json ./
COPY packages/${PACKAGE_NAME}/package.json ./packages/${PACKAGE_NAME}/package.json
COPY packages/app-prisma/package.json ./packages/app-prisma/package.json
COPY packages/shared-lambda-logger/package.json ./packages/shared-lambda-logger/package.json
RUN yarn install --frozen-lockfile

WORKDIR /app/packages/app-prisma
COPY ./packages/app-prisma ./
RUN yarn build

WORKDIR /app/packages/shared-lambda-logger
COPY ./packages/shared-lambda-logger ./
RUN yarn build

WORKDIR /app/packages/$PACKAGE_NAME
COPY ./packages/$PACKAGE_NAME ./
RUN yarn build

RUN yarn install --frozen-lockfile --production

RUN yarn add aws-lambda-ric

RUN find / | grep aws-lambda-ric

FROM node:18

ARG PACKAGE_NAME

# Required for Node runtimes which use npm@8.6.0+ because
# by default npm writes logs under /home/.npm and Lambda fs is read-only
ENV NPM_CONFIG_CACHE=/tmp/.npm

RUN apt-get update && \
    apt-get install -y \
    libfontconfig1 \
    zip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build-image /app/node_modules ./node_modules
COPY --from=build-image /app/node_modules/@app/shared-lambda-logger ./node_modules/@app/shared-lambda-logger
COPY --from=build-image /app/dist ./dist
COPY --from=build-image /app/dist/packages/$PACKAGE_NAME ./dist/packages/$PACKAGE_NAME

WORKDIR /app/dist/packages/$PACKAGE_NAME/src

ENTRYPOINT ["/app/node_modules/.bin/aws-lambda-ric"]
CMD ["sqsHandler.handler"]
