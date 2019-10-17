FROM node:latest

RUN mkdir /packages
WORKDIR /packages

ENV PATH /packages/node_modules/.bin:$PATH

COPY package.json yarn.lock .eslintignore .eslintrc.js .prettierrc.js /packages/
RUN yarn install
RUN yarn bootstrap

COPY . /packages/