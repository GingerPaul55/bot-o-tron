FROM node:10

WORKDIR /usr/app

COPY yarn.lock .
COPY webpack.config.js .
COPY package.json .
RUN yarn
CMD sleep 123123
