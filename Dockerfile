FROM node:16.7.0-alpine3.11 as build

RUN npm install -g npm

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY template ./template
COPY docker-entrypoint.sh ./docker-entrypoint.sh
COPY index.ts ./index.ts
COPY tsconfig.json ./tsconfig.json

RUN yarn build

ENTRYPOINT [ "./docker-entrypoint.sh" ]


FROM nginx:1.21-alpine as service

RUN apk add --no-cache nodejs npm \
  && npm install -g npm yarn

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --prod

COPY template ./template
COPY docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=build /usr/src/app/dist/index.js ./index.js

ENTRYPOINT [ "./docker-entrypoint.sh" ]
