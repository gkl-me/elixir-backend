# BASE 
FROM node:26-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development 

FROM base AS development

RUN npm install 

copy . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Build
FROM base AS build

RUN npm ci

COPY . .

RUN npm run build

# Production 
FROM node:26-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run","start"]