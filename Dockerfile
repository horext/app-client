FROM node:20-alpine as build

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm
# Build
COPY  pnpm-lock.yaml pnpm-lock.yaml
COPY  package.json package.json
RUN pnpm install --frozen-lockfile --production=false

COPY  . .

RUN pnpm build

FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output .output

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD [ "node", ".output/server/index.mjs" ]





