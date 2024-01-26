# A4lCloud

This monorepo contains all the moving parts of the A4lCloud application.

## Frontend development

First install all and build the required dependencies by running:

```
yarn
yarn workspace @app/prisma build
yarn workspace @app/app-client generate-languages
```

Run the following commands to setup your environment:

```
[[ -f .env ]] || cp .env.example .env
docker-compose up -d app-server
```

Then start developing on the web app by running:

```
yarn workspace @app/app-client dev
```
To start developing on the website run:
```
yarn workspace @app/websites-landing dev
```

Run storybook:
```
yarn workspace @app/shared-ui-components sb dev
```
Run linter:
```
yarn workspace run lint
```

## Backend development

First install all and build the required dependencies by running:

```
yarn
yarn workspace @app/prisma build
```

Run the following commands to setup your environment:

```
[[ -f .env ]] || cp .env.example .env
docker-compose up -d postgres
```

Then start developing by running:

```
yarn workspace @app/app-server dev
```
