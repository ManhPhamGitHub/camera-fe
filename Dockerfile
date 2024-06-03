FROM node:lts-buster-slim AS development

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

COPY . /usr/src/app

EXPOSE 8004

CMD ["npm","run","start"]
