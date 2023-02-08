FROM node:18.14.0-alpine3.17 AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
RUN yarn build

##########################################################

FROM node:18.14.0-alpine3.17 AS runner

WORKDIR /app

ENV NODE_ENV production

EXPOSE 5000

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY --from=builder /app/dist ./dist
CMD ["yarn", "run", "start:prod"]