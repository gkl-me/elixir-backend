# Base Image #

FROM node:current-alpine3.22 AS base
WORKDIR /app
COPY package*.json ./

# Development #
FROM base AS development
RUN npm install
COPY . .

EXPOSE 5000

CMD ["npm","run","dev"]

# Build #

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production #
FROM node:current-alpine3.22 AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

EXPOSE 5000

CMD ["npm","run","start"]