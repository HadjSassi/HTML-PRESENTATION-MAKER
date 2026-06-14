FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve with a lightweight static server
FROM node:20-alpine AS runtime
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 3001
CMD ["serve", "-s", "dist", "-l", "3001"]