FROM node AS development
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node AS production
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm build
