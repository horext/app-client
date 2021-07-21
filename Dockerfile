FROM node:14-alpine3.14 as build

WORKDIR /usr/src/app

COPY . .

RUN yarn install \
  --prefer-offline \
  --non-interactive \
  --production=false

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true


FROM node:14-alpine3.14 as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app  .

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD [ "yarn", "start"]



