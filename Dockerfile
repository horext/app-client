# syntax=docker/dockerfile:1

FROM node:20-alpine AS build

ARG NUXT_API_URL
ARG NUXT_PUBLIC_GSI_CLIENT_ID
ARG NUXT_PUBLIC_GSI_SCOPES

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm
# Build
COPY  pnpm-lock.yaml pnpm-lock.yaml
COPY  package.json package.json
RUN pnpm install --frozen-lockfile --production=false

COPY  . .

RUN NUXT_API_URL=$NUXT_API_URL \
    NUXT_PUBLIC_GSI_CLIENT_ID=$NUXT_PUBLIC_GSI_CLIENT_ID \
    NUXT_PUBLIC_GSI_SCOPES=$NUXT_PUBLIC_GSI_SCOPES \
    pnpm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output .output

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD [ "node", ".output/server/index.mjs" ]





