FROM node:14-alpine3.14 as production

WORKDIR /usr/src/app

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD [ "yarn", "start"]



