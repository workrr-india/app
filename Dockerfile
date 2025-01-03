FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]
