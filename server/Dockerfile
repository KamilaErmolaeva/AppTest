FROM node:22-alpine

RUN apk add --no-cache npm python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

ENV PORT=2050
EXPOSE 2050
CMD ["npm", "start"]